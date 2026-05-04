/**
 * Editorial metadata for corridor pages.
 *
 * Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trust)
 * signals reward visible freshness stamps and identifiable authorship
 * on YMYL ("your money or your life") content — travel/visas qualify.
 *
 * We expose a single review date per corridor set. Update these dates
 * whenever the underlying content is verified against official sources.
 */

/** ISO date (YYYY-MM-DD) the visa corridor content was last reviewed. */
export const VISA_CORRIDORS_REVIEWED_AT = "2026-04-21";

/** ISO date (YYYY-MM-DD) the photo corridor content was last reviewed. */
export const PHOTO_CORRIDORS_REVIEWED_AT = "2026-04-21";

/** Editorial owner shown on corridor pages and in JSON-LD. */
export const EDITORIAL_AUTHOR = {
  name: "VisaHint editorial team",
  url: "https://www.visahint.com",
} as const;

/** Publisher / brand identity used in policy pages, footer, and JSON-LD. */
export const PUBLISHER = {
  name: "VisaHint",
  url: "https://www.visahint.com",
  /**
   * Public-facing contact email. Reviewable by AdSense / users / readers.
   * Swap to a domain-hosted address (e.g. hello@visahint.com) once the
   * MX records are configured.
   */
  contactEmail: "venkaakesh@gmail.com",
} as const;

/** Human-readable "April 21, 2026" style date. */
export function formatReviewDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
