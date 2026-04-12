import type { WaitTimeSource, WaitTimeRecord } from "../types";

/**
 * Canada — IRCC publishes processing times at:
 * https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html
 */
const SOURCE_URL =
  "https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html";

export const canadaIrcc: WaitTimeSource = {
  id: "canada-ircc",
  country: "CA",
  label: "Immigration, Refugees and Citizenship Canada processing times",

  async fetch(): Promise<WaitTimeRecord[]> {
    const now = new Date().toISOString();
    // TODO: parse HTML tables from IRCC for category-level data.
    return [
      {
        country: "CA",
        category: "Visitor visa",
        waitDays: null,
        waitLabel: null,
        fetchedAt: now,
        sourceUrl: SOURCE_URL,
      },
      {
        country: "CA",
        category: "Study permit",
        waitDays: null,
        waitLabel: null,
        fetchedAt: now,
        sourceUrl: SOURCE_URL,
      },
      {
        country: "CA",
        category: "Work permit",
        waitDays: null,
        waitLabel: null,
        fetchedAt: now,
        sourceUrl: SOURCE_URL,
      },
    ];
  },
};
