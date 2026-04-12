import type { WaitTimeSource, WaitTimeRecord } from "../types";

const SOURCE_URL =
  "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times/global-visa-processing-times";

export const australiaHomeAffairs: WaitTimeSource = {
  id: "australia-homeaffairs",
  country: "AU",
  label: "Australian Home Affairs global visa processing times",

  async fetch(): Promise<WaitTimeRecord[]> {
    const now = new Date().toISOString();
    return [
      {
        country: "AU",
        category: "Visitor (600)",
        waitDays: null,
        waitLabel: null,
        fetchedAt: now,
        sourceUrl: SOURCE_URL,
      },
      {
        country: "AU",
        category: "Student (500)",
        waitDays: null,
        waitLabel: null,
        fetchedAt: now,
        sourceUrl: SOURCE_URL,
      },
      {
        country: "AU",
        category: "Work (482)",
        waitDays: null,
        waitLabel: null,
        fetchedAt: now,
        sourceUrl: SOURCE_URL,
      },
    ];
  },
};
