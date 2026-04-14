import type { WaitTimeSource, WaitTimeRecord } from "../types";

/**
 * Immigration New Zealand (INZ) — publishes visa processing times at:
 * https://www.immigration.govt.nz/about-us/policy-and-law/how-the-immigration-system-operates/visa-processing-times
 *
 * The page contains HTML tables with visa categories and processing time
 * estimates. We fetch the raw HTML, extract table rows with regex, and
 * convert time text into approximate calendar days.
 */
const SOURCE_URL =
  "https://www.immigration.govt.nz/about-us/policy-and-law/how-the-immigration-system-operates/visa-processing-times";

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
 *   "25 working days"       → 35
 *   "4 to 6 weeks"          → 35  (midpoint: 5 weeks)
 *   "20 to 25 working days" → 32  (midpoint: 22.5 × 1.4)
 *   "Less than 30 days"     → 30
 *   "Up to 6 months"        → 180
 *   "2 to 4 months"         → 90  (midpoint: 3 months)
 *   "90 days"               → 90
 *
 * Returns null if the string cannot be parsed.
 */
function parseWaitDays(text: string): number | null {
  const lower = text.toLowerCase().trim();

  // Range pattern: "X to Y <unit>" or "X - Y <unit>" or "X–Y <unit>"
  const rangeMatch = lower.match(
    /(\d+)\s*(?:to|-|–)\s*(\d+)\s*(month|week|working\s*day|business\s*day|calendar\s*day|day|hour|year)s?/
  );
  if (rangeMatch) {
    const lo = parseInt(rangeMatch[1], 10);
    const hi = parseInt(rangeMatch[2], 10);
    const mid = (lo + hi) / 2;
    const unit = rangeMatch[3];
    if (unit === "year") return Math.round(mid * 365);
    if (unit === "month") return Math.round(mid * 30);
    if (unit === "week") return Math.round(mid * 7);
    if (unit.startsWith("working") || unit.startsWith("business")) return Math.round(mid * 1.4);
    if (unit.startsWith("calendar") || unit === "day") return Math.round(mid);
    if (unit === "hour") return Math.max(1, Math.round(mid / 24));
  }

  // "Up to N <unit>" or "Less than N <unit>" or "Within N <unit>"
  const upToMatch = lower.match(
    /(?:up\s+to|less\s+than|within)\s+(\d+)\s*(month|week|working\s*day|business\s*day|calendar\s*day|day|hour|year)s?/
  );
  if (upToMatch) {
    const n = parseInt(upToMatch[1], 10);
    const unit = upToMatch[2];
    if (unit === "year") return n * 365;
    if (unit === "month") return n * 30;
    if (unit === "week") return n * 7;
    if (unit.startsWith("working") || unit.startsWith("business")) return Math.round(n * 1.4);
    if (unit.startsWith("calendar") || unit === "day") return n;
    if (unit === "hour") return Math.max(1, Math.round(n / 24));
  }

  // Single value: "N <unit>"
  const singleMatch = lower.match(
    /(\d+)\s*(month|week|working\s*day|business\s*day|calendar\s*day|day|hour|year)s?/
  );
  if (singleMatch) {
    const n = parseInt(singleMatch[1], 10);
    const unit = singleMatch[2];
    if (unit === "year") return n * 365;
    if (unit === "month") return n * 30;
    if (unit === "week") return n * 7;
    if (unit.startsWith("working") || unit.startsWith("business")) return Math.round(n * 1.4);
    if (unit.startsWith("calendar") || unit === "day") return n;
    if (unit === "hour") return Math.max(1, Math.round(n / 24));
  }

  return null;
}

/** Categories we look for and their canonical display names. */
const CATEGORY_KEYWORDS: Record<string, string> = {
  visitor: "Visitor Visa",
  student: "Student Visa",
  "essential skills": "Work — Essential Skills",
  "accredited employer": "Accredited Employer Work Visa",
  "work to residence": "Work to Residence",
  "skilled migrant": "Skilled Migrant Category",
  "partnership": "Partnership-based Visa",
  "partner": "Partnership-based Visa",
  "parent": "Parent Visa",
  "resident": "Resident Visa",
  "working holiday": "Working Holiday Visa",
};

/** Fallback stub records returned when fetching or parsing fails. */
function stubRecords(): WaitTimeRecord[] {
  const now = new Date().toISOString();
  return [
    { country: "NZ", category: "Visitor Visa", waitDays: null, waitLabel: "Check official source", fetchedAt: now, sourceUrl: SOURCE_URL },
    { country: "NZ", category: "Student Visa", waitDays: null, waitLabel: "Check official source", fetchedAt: now, sourceUrl: SOURCE_URL },
    { country: "NZ", category: "Accredited Employer Work Visa", waitDays: null, waitLabel: "Check official source", fetchedAt: now, sourceUrl: SOURCE_URL },
    { country: "NZ", category: "Skilled Migrant Category", waitDays: null, waitLabel: "Check official source", fetchedAt: now, sourceUrl: SOURCE_URL },
  ];
}

/** Try to match a cell's text to a known visa category. */
function matchCategory(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
    if (lower.includes(keyword)) return category;
  }
  return null;
}

export const newZealandInz: WaitTimeSource = {
  id: "new-zealand-inz",
  country: "NZ",
  label: "Immigration New Zealand visa processing times",

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

      // Strategy 1: Parse HTML tables
      const trRegex = /<tr[\s>][\s\S]*?<\/tr>/gi;
      let trMatch: RegExpExecArray | null;

      while ((trMatch = trRegex.exec(html)) !== null) {
        const row = trMatch[0];

        // Extract all <td> and <th> cells
        const cellRegex = /<t[dh][\s>][\s\S]*?<\/t[dh]>/gi;
        const cells: string[] = [];
        let cellMatch: RegExpExecArray | null;
        while ((cellMatch = cellRegex.exec(row)) !== null) {
          cells.push(stripHtml(cellMatch[0]));
        }

        if (cells.length < 2) continue;

        const firstCell = cells[0];
        const timeCell = cells[cells.length - 1];

        if (!firstCell || !timeCell) continue;

        // Skip header rows
        if (/visa\s*(type|category)/i.test(firstCell) && /processing|time/i.test(timeCell)) continue;
        if (/^(type|category|visa)$/i.test(firstCell.trim())) continue;

        // Try to match the first cell to a known category
        const category = matchCategory(firstCell);
        if (category) {
          const waitDays = parseWaitDays(timeCell);
          if (waitDays !== null || /\d/.test(timeCell)) {
            records.push({
              country: "NZ",
              category,
              waitDays,
              waitLabel: timeCell,
              fetchedAt: now,
              sourceUrl: SOURCE_URL,
            });
          }
        } else if (/\d/.test(timeCell) && firstCell.length > 2 && firstCell.length < 120) {
          // If not a known category but looks like a data row, include it
          // with the original cell text as the category name
          const waitDays = parseWaitDays(timeCell);
          if (waitDays !== null) {
            records.push({
              country: "NZ",
              category: firstCell,
              waitDays,
              waitLabel: timeCell,
              fetchedAt: now,
              sourceUrl: SOURCE_URL,
            });
          }
        }
      }

      // Strategy 2: Look for processing times in headings + following paragraphs
      if (records.length === 0) {
        // Pattern: heading with visa type followed by time info in nearby text
        const headingPattern =
          /<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>[\s\S]{0,500}?(?:processing\s*time|timeframe|estimated\s*time)[:\s]*([\s\S]{5,120}?)(?:<|\.)/gi;
        let headingMatch: RegExpExecArray | null;

        while ((headingMatch = headingPattern.exec(html)) !== null) {
          const heading = stripHtml(headingMatch[1]);
          const timeText = stripHtml(headingMatch[2]);
          const category = matchCategory(heading);

          if (category && timeText) {
            records.push({
              country: "NZ",
              category,
              waitDays: parseWaitDays(timeText),
              waitLabel: timeText,
              fetchedAt: now,
              sourceUrl: SOURCE_URL,
            });
          }
        }
      }

      // Strategy 3: Look for list items with visa types and times
      if (records.length === 0) {
        const liRegex = /<li[\s>][\s\S]*?<\/li>/gi;
        let liMatch: RegExpExecArray | null;

        while ((liMatch = liRegex.exec(html)) !== null) {
          const liText = stripHtml(liMatch[0]);
          const category = matchCategory(liText);
          if (category) {
            const waitDays = parseWaitDays(liText);
            if (waitDays !== null) {
              records.push({
                country: "NZ",
                category,
                waitDays,
                waitLabel: liText,
                fetchedAt: now,
                sourceUrl: SOURCE_URL,
              });
            }
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
