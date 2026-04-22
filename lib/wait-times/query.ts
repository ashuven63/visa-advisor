/**
 * Read-side helpers for surfacing wait-time data on static pages.
 *
 * The nightly cron (`/api/cron/refresh-wait-times`) populates KV with
 * per-country records. Corridor pages read from KV at revalidation
 * time to show a real, datum-backed "current wait time" card.
 */

import { getRecords } from "./store";
import type { WaitTimeRecord } from "./types";

export type CorridorCategory = "tourist" | "student" | "work" | "any";

export interface CorridorWaitTime {
  /** Category we matched on (may be narrower than the request). */
  category: string;
  /** Median waitDays across non-null posts. */
  medianDays: number;
  /** Min waitDays across non-null posts. */
  minDays: number;
  /** Max waitDays across non-null posts. */
  maxDays: number;
  /** How many posts/consulates contributed data. */
  postCount: number;
  /** Most recent fetch timestamp among the contributing records. */
  fetchedAt: string;
  /** Canonical source URL — the first one we see. */
  sourceUrl: string;
}

/**
 * Match category strings from records against a requested semantic bucket.
 * Each source labels categories slightly differently, so we match loosely.
 */
function categoryMatches(
  recordCategory: string,
  request: CorridorCategory,
): boolean {
  if (request === "any") return true;
  const c = recordCategory.toLowerCase();
  if (request === "tourist") {
    return (
      c.includes("visitor") ||
      c.includes("tourist") ||
      c.includes("b1/b2") ||
      c.includes("standard") ||
      c.includes("visit")
    );
  }
  if (request === "student") {
    return c.includes("student") || c.includes("f/m");
  }
  if (request === "work") {
    return c.includes("work") || c.includes("skilled") || c.includes("employ");
  }
  return false;
}

function median(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

/**
 * Return a summary of the current wait time for a (destination, category).
 * Falls back progressively: requested category → tourist → any. Returns
 * null when no usable data is available.
 */
export async function getCorridorWaitTime(
  destinationCode: string,
  category: CorridorCategory = "tourist",
): Promise<CorridorWaitTime | null> {
  const records = await getRecords(destinationCode);
  if (records.length === 0) return null;

  const fallbackOrder: CorridorCategory[] =
    category === "any" ? ["any"] : [category, "tourist", "any"];

  for (const attempt of fallbackOrder) {
    const summary = summarize(records, attempt);
    if (summary) return summary;
  }
  return null;
}

function summarize(
  records: WaitTimeRecord[],
  category: CorridorCategory,
): CorridorWaitTime | null {
  const matching = records.filter(
    (r) => categoryMatches(r.category, category) && r.waitDays !== null,
  );
  if (matching.length === 0) return null;

  const days = matching
    .map((r) => r.waitDays)
    .filter((d): d is number => d !== null && Number.isFinite(d));
  if (days.length === 0) return null;

  const fetchedAt = matching
    .map((r) => r.fetchedAt)
    .sort()
    .at(-1) as string;

  return {
    category: matching[0].category,
    medianDays: median(days),
    minDays: Math.min(...days),
    maxDays: Math.max(...days),
    postCount: matching.length,
    fetchedAt,
    sourceUrl: matching[0].sourceUrl,
  };
}

/** Format days as a human-friendly label ("~3 weeks", "2–5 days"). */
export function formatWaitLabel(summary: CorridorWaitTime): string {
  if (summary.minDays === summary.maxDays) {
    return formatDays(summary.medianDays);
  }
  return `${formatDays(summary.minDays)} – ${formatDays(summary.maxDays)}`;
}

function formatDays(days: number): string {
  if (days <= 1) return `${days} day`;
  if (days < 14) return `${days} days`;
  const weeks = Math.round(days / 7);
  if (weeks < 8) return `~${weeks} weeks`;
  const months = Math.round(days / 30);
  return `~${months} month${months === 1 ? "" : "s"}`;
}
