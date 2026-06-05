/**
 * Affiliate partner registry.
 *
 * Single source of truth for the third-party links we earn commission
 * on. Replaces the per-component hardcoded URL lists (previously in
 * exit-intent-overlay.tsx) so:
 *   - URLs/IDs are swapped in one place when a contract changes
 *   - Different placements (results page, exit intent, corridor pages)
 *     can pick relevant partners by verdict / category
 *   - Click tracking is uniform across placements
 *
 * FTC compliance: every link must carry rel="sponsored" and every
 * placement must show a visible "we may earn a commission" disclosure
 * — handled by the AffiliateBlock component.
 *
 * Partner IDs marked TODO need user-supplied affiliate codes. The
 * URLs work without the codes but credit nobody until swapped.
 */

import type { Verdict } from "@/lib/visa-advice/schema";

export type AffiliateCategory = "visa-service" | "insurance" | "booking";

export interface AffiliatePartner {
  id: string;
  name: string;
  category: AffiliateCategory;
  /** One-line tagline shown under the partner name. */
  tagline: string;
  /** Fully-qualified URL with affiliate ID baked in. */
  url: string;
  /** CTA button label. */
  cta: string;
  /**
   * Verdicts where this partner is contextually relevant. Empty array
   * means "always relevant" (e.g. travel insurance is useful for any
   * trip). Use this to avoid showing iVisa to a visa-free traveler.
   */
  relevantVerdicts: readonly Verdict[];
}

export const AFFILIATE_PARTNERS: readonly AffiliatePartner[] = [
  // --- Visa application services (verdict-gated) ---------------------
  {
    id: "ivisa",
    name: "iVisa",
    category: "visa-service",
    tagline:
      "Guided online visa application — covers 200+ countries, paid expediting",
    // TODO: Replace `affid=PLACEHOLDER` with your real iVisa affiliate ID.
    // Sign up: https://www.ivisa.com/affiliate-program
    url: "https://www.ivisa.com/?affid=PLACEHOLDER",
    cta: "Start application",
    relevantVerdicts: ["required", "evisa", "eta"],
  },
  {
    id: "visahq",
    name: "VisaHQ",
    category: "visa-service",
    tagline: "Concierge visa service — they file on your behalf",
    // TODO: Replace `partner=PLACEHOLDER` with your real VisaHQ affiliate ID.
    url: "https://www.visahq.com/?partner=PLACEHOLDER",
    cta: "Get help applying",
    relevantVerdicts: ["required", "evisa"],
  },

  // --- Travel insurance (always relevant) ----------------------------
  {
    id: "safetywing",
    name: "SafetyWing",
    category: "insurance",
    tagline: "Travel medical insurance from $45/mo, monthly billing",
    // Reusing the existing referenceID from exit-intent-overlay.tsx.
    url: "https://safetywing.com/?referenceID=26510490&utm_source=26510490&utm_medium=Ambassador",
    cta: "Get covered",
    relevantVerdicts: [],
  },
  {
    id: "worldnomads",
    name: "World Nomads",
    category: "insurance",
    tagline: "Trip cancellation + medical for 200+ countries",
    url: "https://www.worldnomads.com/?affiliate=visa-advisor",
    cta: "Get a quote",
    relevantVerdicts: [],
  },
];

/**
 * Pick partners for a placement, optionally filtered by verdict.
 * Pass `verdict: undefined` to skip verdict-gating (used by the exit
 * intent overlay where we don't yet know the user's verdict).
 */
export function affiliatesFor(opts: {
  category?: AffiliateCategory;
  verdict?: Verdict;
  /** Maximum number of partners to return. */
  limit?: number;
}): AffiliatePartner[] {
  const { category, verdict, limit } = opts;
  let pool = [...AFFILIATE_PARTNERS];

  if (category) {
    pool = pool.filter((p) => p.category === category);
  }
  if (verdict !== undefined) {
    pool = pool.filter(
      (p) =>
        p.relevantVerdicts.length === 0 ||
        p.relevantVerdicts.includes(verdict),
    );
  }
  if (limit !== undefined) {
    pool = pool.slice(0, limit);
  }
  return pool;
}
