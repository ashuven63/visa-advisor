/**
 * SERP title/description builders for corridor SEO pages.
 *
 * Why these templates: corridor pages live or die on search CTR, and
 * three levers reliably move it for programmatic pages:
 *
 *   1. Question-form titles that mirror the dominant query phrasing
 *      ("do indian citizens need a visa for the us") get bolded query
 *      matches in the SERP and are less likely to be rewritten by
 *      Google than keyword-listing titles.
 *   2. Front-loading the answer ("Yes — eVisa") turns the title into
 *      the featured-snippet-style payoff searchers scan for. The
 *      answer sits right after the question so it survives pixel
 *      truncation on long country names.
 *   3. Concrete numbers in the description (fee, current processing
 *      time) plus a freshness stamp outperform generic copy.
 *
 * Country names here are display variants tuned for how people
 * actually search ("US citizens", not "United States citizens";
 * "the UK", not "United Kingdom"), NOT canonical names — those stay
 * in `lib/countries.ts`.
 */

import type { Corridor } from "@/lib/corridors";
import type { CorridorPolicy, Verdict } from "@/lib/visa-policy";
import {
  formatWaitLabel,
  type CorridorWaitTime,
} from "@/lib/wait-times/query";

/**
 * Adjective/demonym per passport country, covering TOP_PASSPORTS.
 * Falls back to the country name for codes outside this map, which
 * reads slightly stiff ("India citizens") but stays correct.
 */
const PASSPORT_DEMONYMS: Record<string, string> = {
  IN: "Indian",
  US: "US",
  GB: "British",
  CA: "Canadian",
  AU: "Australian",
  DE: "German",
  FR: "French",
  CN: "Chinese",
  JP: "Japanese",
  KR: "South Korean",
  BR: "Brazilian",
  MX: "Mexican",
  NG: "Nigerian",
  PH: "Filipino",
  ID: "Indonesian",
  VN: "Vietnamese",
  PK: "Pakistani",
  BD: "Bangladeshi",
  EG: "Egyptian",
  RU: "Russian",
  TH: "Thai",
  MY: "Malaysian",
  SA: "Saudi",
  AE: "UAE",
  ZA: "South African",
  TR: "Turkish",
  IT: "Italian",
  ES: "Spanish",
  NL: "Dutch",
  PL: "Polish",
};

/**
 * Search-friendly destination names where the canonical name is long
 * or needs a definite article. Everything else uses the country name.
 */
const DESTINATION_DISPLAY: Record<string, string> = {
  US: "the US",
  GB: "the UK",
  AE: "the UAE",
  NL: "the Netherlands",
  PH: "the Philippines",
};

export function passportDemonym(code: string, fallbackName: string): string {
  return PASSPORT_DEMONYMS[code.toUpperCase()] ?? fallbackName;
}

export function destinationDisplayName(
  code: string,
  fallbackName: string,
): string {
  return DESTINATION_DISPLAY[code.toUpperCase()] ?? fallbackName;
}

/**
 * Short SERP answer to "do I need a visa?". Kept terse so it fits
 * inside the ~60-char window Google displays before truncating.
 */
export function verdictShortAnswer(verdict: Verdict): string {
  switch (verdict) {
    case "not_required":
      return "No — Visa-Free";
    case "voa":
      return "Visa on Arrival";
    case "eta":
      return "No — ETA Needed";
    case "evisa":
      return "Yes — eVisa";
    case "required":
      return "Yes";
  }
}

/** Verdict clause for the meta description, using display names. */
function verdictClause(
  verdict: Verdict,
  demonym: string,
  destination: string,
): string {
  switch (verdict) {
    case "not_required":
      return `${demonym} citizens don't need a visa for short trips to ${destination}.`;
    case "voa":
      return `${demonym} citizens get a visa on arrival in ${destination}.`;
    case "eta":
      return `${demonym} citizens need an ETA (not a visa) for ${destination}.`;
    case "evisa":
      return `${demonym} citizens need an eVisa for ${destination}.`;
    case "required":
      return `${demonym} citizens need a visa for ${destination}.`;
  }
}

/**
 * SERP title, e.g. "Do Indian Citizens Need a Visa for the US? Yes (2026)".
 * `year` is passed in (rather than read from the clock here) so callers
 * control freshness and the function stays pure/testable.
 */
export function corridorTitle(
  corridor: Pick<Corridor, "passport" | "passportCode" | "destination" | "destinationCode">,
  policy: CorridorPolicy | null,
  year: number,
): string {
  const demonym = passportDemonym(corridor.passportCode, corridor.passport);
  const dest = destinationDisplayName(
    corridor.destinationCode,
    corridor.destination,
  );
  const answer = policy ? verdictShortAnswer(policy.verdict) : "Requirements";
  return `Do ${demonym} Citizens Need a Visa for ${dest}? ${answer} (${year})`;
}

/**
 * Meta description: verdict, then the numbers searchers compare on
 * (fee, current processing time), then a freshness stamp sourced from
 * real data (wait-time fetch date or the editorial review date).
 */
export function corridorDescription(
  corridor: Pick<Corridor, "passport" | "passportCode" | "destination" | "destinationCode">,
  policy: CorridorPolicy | null,
  waitTime: CorridorWaitTime | null,
  reviewedAtIso: string,
): string {
  const demonym = passportDemonym(corridor.passportCode, corridor.passport);
  const dest = destinationDisplayName(
    corridor.destinationCode,
    corridor.destination,
  );

  if (!policy) {
    return `Do ${demonym} citizens need a visa for ${dest}? Check requirements, documents, processing times, and photo specs — with official citations.`;
  }

  const parts: string[] = [verdictClause(policy.verdict, demonym, dest)];
  // feeUsd is verdict-aware (ETA fee for "eta" verdicts, visa fee
  // otherwise — see getCorridorPolicy), so it's always safe to quote.
  if (policy.feeUsd) {
    parts.push(`Fee ~US$${policy.feeUsd}.`);
  }
  if (waitTime) {
    parts.push(`Current processing ${formatWaitLabel(waitTime)}.`);
  }

  const updatedIso = waitTime ? waitTime.fetchedAt : reviewedAtIso;
  const updated = new Date(updatedIso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  parts.push(`Documents, photo specs & official sources — updated ${updated}.`);

  return parts.join(" ");
}
