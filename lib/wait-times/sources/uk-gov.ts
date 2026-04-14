import type { WaitTimeSource, WaitTimeRecord } from "../types";

/**
 * UK Government — publishes visa decision waiting times at:
 * https://www.gov.uk/guidance/visa-decision-waiting-times-applications-outside-the-uk
 *
 * The data lives in HTML tables. We fetch the page, extract rows with regex,
 * and convert processing-time text (e.g. "3 weeks") into approximate days.
 */
const SOURCE_URL =
  "https://www.gov.uk/guidance/visa-decision-waiting-times-applications-outside-the-uk";

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
    .trim();
}

/**
 * Convert a human-readable processing time string into approximate calendar days.
 *
 * Handles patterns like:
 *   "3 weeks"          → 21
 *   "6 to 8 weeks"     → 49   (midpoint: 7 weeks)
 *   "12 weeks"         → 84
 *   "8 working days"   → 11   (working days × 1.4 ≈ calendar days)
 *   "3 months"         → 90
 *   "6 to 12 months"   → 270  (midpoint: 9 months)
 *   "24 hours"         → 1
 *
 * Returns null if the string cannot be parsed.
 */
function parseWaitDays(text: string): number | null {
  const lower = text.toLowerCase().trim();

  // Range pattern: "X to Y <unit>" or "X - Y <unit>"
  const rangeMatch = lower.match(
    /(\d+)\s*(?:to|-)\s*(\d+)\s*(week|working\s*day|day|month|hour)s?/
  );
  if (rangeMatch) {
    const lo = parseInt(rangeMatch[1], 10);
    const hi = parseInt(rangeMatch[2], 10);
    const mid = (lo + hi) / 2;
    const unit = rangeMatch[3];
    if (unit === "week") return Math.round(mid * 7);
    if (unit.startsWith("working")) return Math.round(mid * 1.4);
    if (unit === "day") return Math.round(mid);
    if (unit === "month") return Math.round(mid * 30);
    if (unit === "hour") return Math.max(1, Math.round(mid / 24));
  }

  // Single value: "N <unit>"
  const singleMatch = lower.match(
    /(\d+)\s*(week|working\s*day|day|month|hour)s?/
  );
  if (singleMatch) {
    const n = parseInt(singleMatch[1], 10);
    const unit = singleMatch[2];
    if (unit === "week") return n * 7;
    if (unit.startsWith("working")) return Math.round(n * 1.4);
    if (unit === "day") return n;
    if (unit === "month") return n * 30;
    if (unit === "hour") return Math.max(1, Math.round(n / 24));
  }

  return null;
}

/** Fallback stub records returned when fetching or parsing fails. */
function stubRecords(): WaitTimeRecord[] {
  const now = new Date().toISOString();
  return [
    { country: "GB", category: "Standard Visitor", waitDays: null, waitLabel: null, fetchedAt: now, sourceUrl: SOURCE_URL },
    { country: "GB", category: "Work (Skilled Worker)", waitDays: null, waitLabel: null, fetchedAt: now, sourceUrl: SOURCE_URL },
    { country: "GB", category: "Student", waitDays: null, waitLabel: null, fetchedAt: now, sourceUrl: SOURCE_URL },
  ];
}

export const ukGov: WaitTimeSource = {
  id: "uk-gov",
  country: "GB",
  label: "UK Government visa decision waiting times",

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

      // Match each <tr>…</tr> block (non-greedy, across newlines)
      const trRegex = /<tr[\s>][\s\S]*?<\/tr>/gi;
      let trMatch: RegExpExecArray | null;

      while ((trMatch = trRegex.exec(html)) !== null) {
        const row = trMatch[0];

        // Extract all <td>…</td> cells from this row
        const tdRegex = /<td[\s>][\s\S]*?<\/td>/gi;
        const cells: string[] = [];
        let tdMatch: RegExpExecArray | null;
        while ((tdMatch = tdRegex.exec(row)) !== null) {
          cells.push(stripHtml(tdMatch[0]));
        }

        // We expect at least 2 cells: category name and processing time
        if (cells.length < 2) continue;

        const category = cells[0];
        const timeText = cells[1];

        // Skip header-like rows or empty cells
        if (!category || !timeText) continue;
        if (/visa\s*type/i.test(category) && /processing/i.test(timeText)) continue;

        const waitDays = parseWaitDays(timeText);

        records.push({
          country: "GB",
          category,
          waitDays,
          waitLabel: timeText,
          fetchedAt: now,
          sourceUrl: SOURCE_URL,
        });
      }

      // If parsing yielded no results, fall back to stubs
      return records.length > 0 ? records : stubRecords();
    } catch {
      return stubRecords();
    }
  },
};
