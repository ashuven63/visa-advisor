import type { WaitTimeSource, WaitTimeRecord } from "../types";

/**
 * US State Department — publishes visa wait times as JSON at:
 * https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/global-visa-wait-times.html
 *
 * The most reliable machine-readable source available. The JSON feed
 * returns per-post (per-consulate) data for multiple visa categories.
 *
 * NOTE: The actual JSON endpoint URL may change — if this breaks, check
 * the page above for the current data source.
 */
const SOURCE_URL =
  "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/global-visa-wait-times.html";

const JSON_FEED_URL =
  "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/global-visa-wait-times.html/jcr:content/tsg-rwd-content-page-parsysarea/waittimeswidget.data.json";

export const usStateDept: WaitTimeSource = {
  id: "us-state-dept",
  country: "US",
  label: "US State Department global visa wait times",

  async fetch(): Promise<WaitTimeRecord[]> {
    const res = await fetch(JSON_FEED_URL, {
      headers: { accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(
        `US State Dept feed responded ${res.status}: ${res.statusText}`,
      );
    }
    const data: unknown = await res.json();

    // The feed structure varies; the common shape is an array of post objects
    // each with category wait-time fields. We defensively parse what we can.
    const records: WaitTimeRecord[] = [];
    const now = new Date().toISOString();

    if (Array.isArray(data)) {
      for (const entry of data) {
        if (typeof entry !== "object" || entry === null) continue;
        const obj = entry as Record<string, unknown>;
        const post = String(obj.post_name ?? obj.city ?? "Unknown");

        for (const [field, category] of [
          ["visitor_wait", "B1/B2 Visitor"],
          ["student_wait", "F/M Student"],
          ["other_wait", "Other Non-immigrant"],
          ["crew_wait", "Crew/Transit"],
          ["immigrant_wait", "Immigrant"],
        ] as const) {
          const raw = obj[field];
          const days =
            typeof raw === "number"
              ? raw
              : typeof raw === "string"
                ? Number.parseInt(raw, 10)
                : null;

          records.push({
            country: "US",
            category,
            post,
            waitDays: Number.isFinite(days) ? days : null,
            waitLabel: Number.isFinite(days)
              ? `${days} calendar day${days === 1 ? "" : "s"}`
              : "Not published",
            fetchedAt: now,
            sourceUrl: SOURCE_URL,
          });
        }
      }
    }

    return records;
  },
};
