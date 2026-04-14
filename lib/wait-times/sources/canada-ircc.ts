import type { WaitTimeSource, WaitTimeRecord } from "../types";

/**
 * Canada — IRCC publishes processing times at:
 * https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html
 *
 * The page uses a dynamic JavaScript widget, so we first try the publicly
 * available IRCC JSON API. If that fails we fall back to fetching the HTML
 * page and scraping any <table> rows via regex. If everything fails we
 * return stub records with null values so the UI can still link to the
 * source URL.
 */
const SOURCE_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html";

const JSON_API_URL =
  "https://www.canada.ca/content/dam/ircc/documents/json/data-ptime-en.json";

// ---- helpers ----------------------------------------------------------------

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
 * Convert a human-readable processing-time string into approximate calendar
 * days.
 *
 * Handles patterns such as:
 *   "3 weeks"            → 21
 *   "6 to 8 weeks"       → 49   (midpoint: 7 weeks)
 *   "12 weeks"           → 84
 *   "15 days"            → 15
 *   "8 business days"    → 11   (business days × 1.4 ≈ calendar days)
 *   "3 months"           → 90
 *   "6 to 12 months"     → 270  (midpoint: 9 months)
 *   "24 hours"           → 1
 *   "52 weeks (12 months)" → 364
 *
 * Returns null if the string cannot be parsed.
 */
function parseWaitDays(text: string): number | null {
  const lower = text.toLowerCase().trim();

  // Range: "X to Y <unit>" or "X - Y <unit>" or "X–Y <unit>"
  const rangeMatch = lower.match(
    /(\d+)\s*(?:to|-|–)\s*(\d+)\s*(week|business\s*day|working\s*day|calendar\s*day|day|month|year|hour)s?/,
  );
  if (rangeMatch) {
    const lo = parseInt(rangeMatch[1], 10);
    const hi = parseInt(rangeMatch[2], 10);
    const mid = (lo + hi) / 2;
    return unitToDays(mid, rangeMatch[3]);
  }

  // Single value: "N <unit>"
  const singleMatch = lower.match(
    /(\d+)\s*(week|business\s*day|working\s*day|calendar\s*day|day|month|year|hour)s?/,
  );
  if (singleMatch) {
    const n = parseInt(singleMatch[1], 10);
    return unitToDays(n, singleMatch[2]);
  }

  return null;
}

function unitToDays(n: number, unit: string): number | null {
  if (unit === "week") return Math.round(n * 7);
  if (unit.startsWith("business") || unit.startsWith("working"))
    return Math.round(n * 1.4);
  if (unit === "day" || unit.startsWith("calendar")) return Math.round(n);
  if (unit === "month") return Math.round(n * 30);
  if (unit === "year") return Math.round(n * 365);
  if (unit === "hour") return Math.max(1, Math.round(n / 24));
  return null;
}

/** Stub records returned when every strategy fails. */
function stubRecords(): WaitTimeRecord[] {
  const now = new Date().toISOString();
  return [
    { country: "CA", category: "Visitor visa", waitDays: null, waitLabel: null, fetchedAt: now, sourceUrl: SOURCE_URL },
    { country: "CA", category: "Study permit", waitDays: null, waitLabel: null, fetchedAt: now, sourceUrl: SOURCE_URL },
    { country: "CA", category: "Work permit", waitDays: null, waitLabel: null, fetchedAt: now, sourceUrl: SOURCE_URL },
  ];
}

// ---- JSON API parsing -------------------------------------------------------

/**
 * The IRCC JSON feed structure varies over time. Known shapes include:
 *
 * Shape A — top-level array of objects:
 *   [ { "program": "...", "processing_time": "...", ... }, ... ]
 *
 * Shape B — nested object with category keys:
 *   { "visitor": { ... }, "study": { ... }, "work": { ... }, ... }
 *
 * Shape C — object with an items/data array:
 *   { "data": [ { ... }, ... ] }
 *
 * We try to extract records from any of these structures.
 */
function parseJsonApi(data: unknown): WaitTimeRecord[] {
  const records: WaitTimeRecord[] = [];
  const now = new Date().toISOString();

  // Attempt to find the array of entries
  const entries = findEntriesArray(data);
  if (entries && entries.length > 0) {
    for (const entry of entries) {
      if (typeof entry !== "object" || entry === null) continue;
      const obj = entry as Record<string, unknown>;

      const category = extractString(obj, [
        "program",
        "type",
        "category",
        "visa_type",
        "name",
        "label",
        "application_type",
      ]);
      const timeText = extractString(obj, [
        "processing_time",
        "processingTime",
        "time",
        "wait_time",
        "waitTime",
        "duration",
        "timeline",
      ]);

      if (!category) continue;

      const waitDays = timeText ? parseWaitDays(timeText) : null;
      records.push({
        country: "CA",
        category,
        waitDays,
        waitLabel: timeText || null,
        fetchedAt: now,
        sourceUrl: SOURCE_URL,
      });
    }
  }

  // If the data is a nested object with known visa-category keys, try that
  if (records.length === 0 && typeof data === "object" && data !== null && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    const categoryMappings: [string[], string][] = [
      [["visitor", "visitors", "trv", "visitor_visa"], "Visitor visa"],
      [["study", "student", "study_permit"], "Study permit"],
      [["work", "worker", "work_permit"], "Work permit"],
      [["pr", "permanent_residence", "permanent_resident", "pr_card"], "Permanent residence"],
      [["citizenship", "citizen"], "Citizenship"],
      [["sponsorship", "family", "family_sponsorship"], "Family sponsorship"],
      [["express_entry", "expressentry"], "Express Entry"],
    ];

    for (const [keys, label] of categoryMappings) {
      for (const key of keys) {
        const val = obj[key];
        if (val !== undefined && val !== null) {
          const timeText = extractTimeFromValue(val);
          const waitDays = timeText ? parseWaitDays(timeText) : null;
          records.push({
            country: "CA",
            category: label,
            waitDays,
            waitLabel: timeText || null,
            fetchedAt: now,
            sourceUrl: SOURCE_URL,
          });
          break; // found this category, move to next
        }
      }
    }
  }

  return records;
}

/** Walk the data to find the most likely array of entries. */
function findEntriesArray(data: unknown): unknown[] | null {
  if (Array.isArray(data)) return data;
  if (typeof data !== "object" || data === null) return null;

  const obj = data as Record<string, unknown>;

  // Common wrapper keys
  for (const key of ["data", "items", "results", "records", "entries", "processing_times"]) {
    if (Array.isArray(obj[key])) return obj[key] as unknown[];
  }

  // Check all values for an array
  for (const val of Object.values(obj)) {
    if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object") {
      return val;
    }
  }

  return null;
}

/** Try multiple field names and return the first non-empty string. */
function extractString(
  obj: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === "string" && val.trim()) return val.trim();
  }
  return null;
}

/** Extract a time string from a value that could be a string or nested object. */
function extractTimeFromValue(val: unknown): string | null {
  if (typeof val === "string") return val.trim() || null;
  if (typeof val === "number") return `${val} days`;
  if (typeof val === "object" && val !== null) {
    const obj = val as Record<string, unknown>;
    const timeStr = extractString(obj, [
      "processing_time",
      "processingTime",
      "time",
      "wait_time",
      "duration",
      "timeline",
      "value",
      "text",
      "label",
    ]);
    if (timeStr) return timeStr;
    // If it has numeric days/weeks/months fields
    for (const [field, unit] of [
      ["days", "days"],
      ["weeks", "weeks"],
      ["months", "months"],
    ] as const) {
      const num = obj[field];
      if (typeof num === "number") return `${num} ${unit}`;
    }
  }
  return null;
}

// ---- HTML fallback parsing --------------------------------------------------

/**
 * Attempt to extract processing times from the IRCC HTML page by scraping
 * any <table> content. This is a best-effort fallback since the page
 * primarily uses a JavaScript widget.
 */
function parseHtml(html: string): WaitTimeRecord[] {
  const records: WaitTimeRecord[] = [];
  const now = new Date().toISOString();

  // Match each <tr>…</tr> block
  const trRegex = /<tr[\s>][\s\S]*?<\/tr>/gi;
  let trMatch: RegExpExecArray | null;

  while ((trMatch = trRegex.exec(html)) !== null) {
    const row = trMatch[0];

    // Extract <td> or <th> cells
    const cellRegex = /<t[dh][\s>][\s\S]*?<\/t[dh]>/gi;
    const cells: string[] = [];
    let cellMatch: RegExpExecArray | null;
    while ((cellMatch = cellRegex.exec(row)) !== null) {
      cells.push(stripHtml(cellMatch[0]));
    }

    if (cells.length < 2) continue;

    const category = cells[0];
    const timeText = cells[cells.length > 2 ? 1 : 1]; // use second cell

    if (!category || !timeText) continue;
    // Skip header rows
    if (/type|category|application/i.test(category) && /time|processing|wait/i.test(timeText))
      continue;

    const waitDays = parseWaitDays(timeText);
    // Only include rows that look like visa categories
    if (waitDays !== null || /week|month|day|hour|year/i.test(timeText)) {
      records.push({
        country: "CA",
        category,
        waitDays,
        waitLabel: timeText,
        fetchedAt: now,
        sourceUrl: SOURCE_URL,
      });
    }
  }

  // Also try to find processing times in <dl>/<dd> or list structures
  const dlRegex = /<dt[\s>][\s\S]*?<\/dt>\s*<dd[\s>][\s\S]*?<\/dd>/gi;
  let dlMatch: RegExpExecArray | null;
  while ((dlMatch = dlRegex.exec(html)) !== null) {
    const block = dlMatch[0];
    const dtMatch = block.match(/<dt[\s>]([\s\S]*?)<\/dt>/i);
    const ddMatch = block.match(/<dd[\s>]([\s\S]*?)<\/dd>/i);
    if (!dtMatch || !ddMatch) continue;

    const category = stripHtml(dtMatch[1]);
    const timeText = stripHtml(ddMatch[1]);
    const waitDays = parseWaitDays(timeText);

    if (waitDays !== null || /week|month|day|hour|year/i.test(timeText)) {
      records.push({
        country: "CA",
        category,
        waitDays,
        waitLabel: timeText,
        fetchedAt: now,
        sourceUrl: SOURCE_URL,
      });
    }
  }

  return records;
}

// ---- source export ----------------------------------------------------------

export const canadaIrcc: WaitTimeSource = {
  id: "canada-ircc",
  country: "CA",
  label: "Immigration, Refugees and Citizenship Canada processing times",

  async fetch(): Promise<WaitTimeRecord[]> {
    // Strategy 1: JSON API
    try {
      const res = await fetch(JSON_API_URL, {
        headers: {
          Accept: "application/json",
          "User-Agent": "visa-advisor-bot/1.0 (wait-time scraper)",
        },
      });
      if (res.ok) {
        const data: unknown = await res.json();
        const records = parseJsonApi(data);
        if (records.length > 0) return records;
      }
    } catch {
      // JSON API unavailable — fall through to HTML
    }

    // Strategy 2: HTML page scraping
    try {
      const res = await fetch(SOURCE_URL, {
        headers: {
          Accept: "text/html",
          "User-Agent": "visa-advisor-bot/1.0 (wait-time scraper)",
        },
      });
      if (res.ok) {
        const html = await res.text();
        const records = parseHtml(html);
        if (records.length > 0) return records;
      }
    } catch {
      // HTML fetch failed — fall through to stubs
    }

    // Strategy 3: Stub fallback
    return stubRecords();
  },
};
