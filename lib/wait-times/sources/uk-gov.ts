import type { WaitTimeSource, WaitTimeRecord } from "../types";

/**
 * UK Government — publishes visa decision waiting times at:
 * https://www.gov.uk/guidance/visa-decision-waiting-times-applications-outside-the-uk
 *
 * The data is in an HTML table. We fetch the page and extract text. In a
 * production deployment this would parse the HTML; for now we return a
 * stub record pointing to the source URL so the UI can link to it.
 */
const SOURCE_URL =
  "https://www.gov.uk/guidance/visa-decision-waiting-times-applications-outside-the-uk";

export const ukGov: WaitTimeSource = {
  id: "uk-gov",
  country: "GB",
  label: "UK Government visa decision waiting times",

  async fetch(): Promise<WaitTimeRecord[]> {
    const now = new Date().toISOString();
    // TODO: parse HTML table from SOURCE_URL for category-level data.
    // For now, return a single record pointing to the official page.
    return [
      {
        country: "GB",
        category: "Standard Visitor",
        waitDays: null,
        waitLabel: null,
        fetchedAt: now,
        sourceUrl: SOURCE_URL,
      },
      {
        country: "GB",
        category: "Work (Skilled Worker)",
        waitDays: null,
        waitLabel: null,
        fetchedAt: now,
        sourceUrl: SOURCE_URL,
      },
      {
        country: "GB",
        category: "Student",
        waitDays: null,
        waitLabel: null,
        fetchedAt: now,
        sourceUrl: SOURCE_URL,
      },
    ];
  },
};
