import type { WaitTimeSource, WaitTimeRecord } from "../types";

/**
 * Australian Department of Home Affairs — publishes visa processing times at:
 * https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times/global-visa-processing-times
 *
 * The main data is JS-rendered, but the page may contain some processing time
 * information in static HTML tables or embedded JSON. We attempt to parse
 * whatever is available and fall back to labelled stubs if the page is fully
 * client-rendered.
 */
const SOURCE_URL =
  "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times/global-visa-processing-times";

/** Strip HTML tags and decode common entities. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Convert a human-readable processing time string into approximate calendar days.
 *
 * Handles patterns like:
 *   "3 months"              → 90
 *   "6 to 9 months"         → 225  (midpoint: 7.5 months)
 *   "5 weeks"               → 35
 *   "20 to 23 days"         → 22   (midpoint: 21.5)
 *   "75% of applications:
 *    8 months"              → 240
 *   "Less than 20 days"     → 20
 *   "12 to 15 months"       → 405  (midpoint: 13.5 months)
 *
 * Returns null if the string cannot be parsed.
 */
function parseWaitDays(text: string): number | null {
  const lower = text.toLowerCase().trim();

  // Range pattern: "X to Y <unit>" or "X - Y <unit>" or "X–Y <unit>"
  const rangeMatch = lower.match(
    /(\d+)\s*(?:to|-|–)\s*(\d+)\s*(month|week|working\s*day|day|hour|year)s?/
  );
  if (rangeMatch) {
    const lo = parseInt(rangeMatch[1], 10);
    const hi = parseInt(rangeMatch[2], 10);
    const mid = (lo + hi) / 2;
    const unit = rangeMatch[3];
    if (unit === "year") return Math.round(mid * 365);
    if (unit === "month") return Math.round(mid * 30);
    if (unit === "week") return Math.round(mid * 7);
    if (unit.startsWith("working")) return Math.round(mid * 1.4);
    if (unit === "day") return Math.round(mid);
    if (unit === "hour") return Math.max(1, Math.round(mid / 24));
  }

  // "Less than N <unit>"
  const lessMatch = lower.match(
    /less\s+than\s+(\d+)\s*(month|week|working\s*day|day|hour|year)s?/
  );
  if (lessMatch) {
    const n = parseInt(lessMatch[1], 10);
    const unit = lessMatch[2];
    if (unit === "year") return n * 365;
    if (unit === "month") return n * 30;
    if (unit === "week") return n * 7;
    if (unit.startsWith("working")) return Math.round(n * 1.4);
    if (unit === "day") return n;
    if (unit === "hour") return Math.max(1, Math.round(n / 24));
  }

  // Single value: "N <unit>"
  const singleMatch = lower.match(
    /(\d+)\s*(month|week|working\s*day|day|hour|year)s?/
  );
  if (singleMatch) {
    const n = parseInt(singleMatch[1], 10);
    const unit = singleMatch[2];
    if (unit === "year") return n * 365;
    if (unit === "month") return n * 30;
    if (unit === "week") return n * 7;
    if (unit.startsWith("working")) return Math.round(n * 1.4);
    if (unit === "day") return n;
    if (unit === "hour") return Math.max(1, Math.round(n / 24));
  }

  return null;
}

/** Visa subclasses we care about and their display names. */
const VISA_SUBCLASSES: Record<string, string> = {
  "600": "Visitor (600)",
  "500": "Student (500)",
  "482": "Temporary Skill Shortage (482)",
  "820": "Partner — Temporary (820)",
  "801": "Partner — Permanent (801)",
  "186": "Employer Nomination Scheme (186)",
  "189": "Skilled Independent (189)",
  "190": "Skilled Nominated (190)",
  "491": "Skilled Work Regional (491)",
};

/** Fallback stub records returned when fetching or parsing fails. */
function stubRecords(): WaitTimeRecord[] {
  const now = new Date().toISOString();
  return [
    { country: "AU", category: "Visitor (600)", waitDays: null, waitLabel: "Check official source", fetchedAt: now, sourceUrl: SOURCE_URL },
    { country: "AU", category: "Student (500)", waitDays: null, waitLabel: "Check official source", fetchedAt: now, sourceUrl: SOURCE_URL },
    { country: "AU", category: "Temporary Skill Shortage (482)", waitDays: null, waitLabel: "Check official source", fetchedAt: now, sourceUrl: SOURCE_URL },
    { country: "AU", category: "Partner — Temporary (820)", waitDays: null, waitLabel: "Check official source", fetchedAt: now, sourceUrl: SOURCE_URL },
  ];
}

export const australiaHomeAffairs: WaitTimeSource = {
  id: "australia-homeaffairs",
  country: "AU",
  label: "Australian Home Affairs global visa processing times",

  async fetch(): Promise<WaitTimeRecord[]> {
    let html: string;
    try {
      const res = await fetch(SOURCE_URL, {
        headers: {
          "User-Agent": "visa-advisor-bot/1.0 (wait-time scraper)",
          Accept: "text/html",
        },
      });
      if (!res.ok) return stubRecords();
      html = await res.text();
    } catch {
      return stubRecords();
    }

    try {
      const records: WaitTimeRecord[] = [];
      const now = new Date().toISOString();

      // Strategy 1: Look for embedded JSON data (some gov sites embed data objects)
      const jsonDataMatch = html.match(
        /var\s+processingTimes\s*=\s*(\[[\s\S]*?\]);/
      ) ?? html.match(
        /"processingTimes"\s*:\s*(\[[\s\S]*?\])\s*[,}]/
      );

      if (jsonDataMatch) {
        try {
          const data = JSON.parse(jsonDataMatch[1]) as Array<{
            subclass?: string;
            visa_subclass?: string;
            processing_time?: string;
            time?: string;
          }>;
          for (const entry of data) {
            const subclass = entry.subclass ?? entry.visa_subclass ?? "";
            const timeText = entry.processing_time ?? entry.time ?? "";
            const categoryName = VISA_SUBCLASSES[subclass];
            if (categoryName && timeText) {
              records.push({
                country: "AU",
                category: categoryName,
                waitDays: parseWaitDays(timeText),
                waitLabel: timeText,
                fetchedAt: now,
                sourceUrl: SOURCE_URL,
              });
            }
          }
          if (records.length > 0) return records;
        } catch {
          // JSON parse failed, fall through to HTML parsing
        }
      }

      // Strategy 2: Parse HTML tables for visa processing data
      const trRegex = /<tr[\s>][\s\S]*?<\/tr>/gi;
      let trMatch: RegExpExecArray | null;

      while ((trMatch = trRegex.exec(html)) !== null) {
        const row = trMatch[0];

        // Extract all <td> and <th> cells from this row
        const cellRegex = /<t[dh][\s>][\s\S]*?<\/t[dh]>/gi;
        const cells: string[] = [];
        let cellMatch: RegExpExecArray | null;
        while ((cellMatch = cellRegex.exec(row)) !== null) {
          cells.push(stripHtml(cellMatch[0]));
        }

        if (cells.length < 2) continue;

        const firstCell = cells[0];
        const timeCell = cells[cells.length - 1]; // time is usually the last column

        if (!firstCell || !timeCell) continue;

        // Skip pure header rows
        if (/visa\s*(sub)?class/i.test(firstCell) && /processing/i.test(timeCell)) continue;
        if (/^(visa\s*type|category|stream)$/i.test(firstCell)) continue;

        // Check if the row mentions a known subclass number
        const subclassMatch = firstCell.match(/\b(600|500|482|820|801|186|189|190|491)\b/);
        if (subclassMatch) {
          const code = subclassMatch[1];
          const categoryName = VISA_SUBCLASSES[code] ?? firstCell;
          const waitDays = parseWaitDays(timeCell);

          // Only add if we got a meaningful time cell
          if (waitDays !== null || /\d/.test(timeCell)) {
            records.push({
              country: "AU",
              category: categoryName,
              waitDays,
              waitLabel: timeCell,
              fetchedAt: now,
              sourceUrl: SOURCE_URL,
            });
          }
        } else {
          // Also capture rows that mention known visa type keywords
          const keywordMap: Record<string, string> = {
            visitor: "Visitor (600)",
            student: "Student (500)",
            "temporary skill": "Temporary Skill Shortage (482)",
            partner: "Partner (820/801)",
            "skilled independent": "Skilled Independent (189)",
            "employer nomination": "Employer Nomination Scheme (186)",
          };

          const lowerFirst = firstCell.toLowerCase();
          for (const [keyword, category] of Object.entries(keywordMap)) {
            if (lowerFirst.includes(keyword)) {
              const waitDays = parseWaitDays(timeCell);
              if (waitDays !== null || /\d/.test(timeCell)) {
                records.push({
                  country: "AU",
                  category,
                  waitDays,
                  waitLabel: timeCell,
                  fetchedAt: now,
                  sourceUrl: SOURCE_URL,
                });
              }
              break;
            }
          }
        }
      }

      // Strategy 3: Look for processing times in definition lists or paragraph text
      if (records.length === 0) {
        // Pattern: "Subclass 600 ... processing time ... 20 days to 3 months"
        for (const [code, categoryName] of Object.entries(VISA_SUBCLASSES)) {
          const pattern = new RegExp(
            `(?:subclass|visa)\\s*${code}[\\s\\S]{0,500}?(?:processing\\s*time|timeframe)[:\\s]*([^<.]{5,80})`,
            "i"
          );
          const match = html.match(pattern);
          if (match) {
            const timeText = stripHtml(match[1]);
            records.push({
              country: "AU",
              category: categoryName,
              waitDays: parseWaitDays(timeText),
              waitLabel: timeText,
              fetchedAt: now,
              sourceUrl: SOURCE_URL,
            });
          }
        }
      }

      // Deduplicate by category (keep first occurrence)
      const seen = new Set<string>();
      const deduped = records.filter((r) => {
        if (seen.has(r.category)) return false;
        seen.add(r.category);
        return true;
      });

      return deduped.length > 0 ? deduped : stubRecords();
    } catch {
      return stubRecords();
    }
  },
};
