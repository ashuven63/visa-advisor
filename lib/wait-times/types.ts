/**
 * A single wait-time record that the UI can render.
 */
export interface WaitTimeRecord {
  /** ISO alpha-2 of the **destination** country, e.g. "US". */
  country: string;
  /** Visa category, e.g. "B1/B2 Tourist", "Student", "Work". */
  category: string;
  /** City or consulate name if the source is per-post. */
  post?: string;
  /** Processing time in calendar days, or null when not published. */
  waitDays: number | null;
  /** Human-readable processing time (e.g. "3–5 weeks"). */
  waitLabel: string | null;
  /** ISO 8601 date string of when the data was fetched/published. */
  fetchedAt: string;
  /** Canonical URL the traveler can open to verify. */
  sourceUrl: string;
}

/**
 * Each country source exports a `WaitTimeSource` that the registry
 * discovers at import time. The `fetch()` method does the heavy lifting —
 * scraping, API calls, or LLM lookup — and returns zero or more records.
 */
export interface WaitTimeSource {
  /** Unique identifier for this source, e.g. "us-state-dept". */
  id: string;
  /** Two-letter ISO code for the destination country. */
  country: string;
  /** Human-readable description. */
  label: string;
  /** Fetch current wait-time records. Throw on transient errors. */
  fetch(): Promise<WaitTimeRecord[]>;
}
