import type { WaitTimeSource, WaitTimeRecord } from "../types";

const SOURCE_URL =
  "https://www.immigration.govt.nz/about-us/policy-and-law/how-the-immigration-system-operates/visa-processing-times";

export const newZealandInz: WaitTimeSource = {
  id: "new-zealand-inz",
  country: "NZ",
  label: "Immigration New Zealand visa processing times",

  async fetch(): Promise<WaitTimeRecord[]> {
    const now = new Date().toISOString();
    return [
      {
        country: "NZ",
        category: "Visitor",
        waitDays: null,
        waitLabel: null,
        fetchedAt: now,
        sourceUrl: SOURCE_URL,
      },
      {
        country: "NZ",
        category: "Student",
        waitDays: null,
        waitLabel: null,
        fetchedAt: now,
        sourceUrl: SOURCE_URL,
      },
      {
        country: "NZ",
        category: "Work",
        waitDays: null,
        waitLabel: null,
        fetchedAt: now,
        sourceUrl: SOURCE_URL,
      },
    ];
  },
};
