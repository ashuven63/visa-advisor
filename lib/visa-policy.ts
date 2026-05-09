/**
 * Static visa-policy registry for the highest-volume destinations.
 *
 * Used to render an immediate verdict on corridor SEO landing pages
 * (e.g. /visa/india-to-usa shows "you need a visa" without waiting on
 * the LLM advice API). Acts as a guardrail for our own results too,
 * but the page-level disclaimer still applies — the user must verify
 * with the official source before booking.
 *
 * Schema:
 *   - Each destination has a `defaultVerdict` that applies to any
 *     passport not in the override maps.
 *   - `byPassport` overrides the verdict for specific passports.
 *   - `defaultFeeUsd` is the typical tourist visa fee when the verdict
 *     is "required" / "evisa" / "voa". Indicative only.
 *   - `officialUrl` is the destination's canonical visa info page.
 *
 * IMPORTANT: encode only well-known, stable rules. Wrong data is
 * worse than no data. When in doubt, omit the destination — the
 * corridor page falls back to a "verdict varies" experience.
 *
 * Many of these policies have well-known regional groupings:
 *   - SCHENGEN_VISA_FREE: passports that get 90/180 visa-free entry
 *     to all Schengen Area countries.
 *   - VISA_WAIVER_PROGRAM: passports eligible for the US ESTA / Visa
 *     Waiver Program.
 *   - GCC: Gulf Cooperation Council member passports (visa-free or
 *     simplified entry into other GCC countries).
 */

import type { Verdict } from "@/lib/visa-advice/schema";

export type { Verdict };

export interface DestinationPolicy {
  /** ISO alpha-2 code of the destination country. */
  code: string;
  /** Verdict applied to any passport not listed in `byPassport`. */
  defaultVerdict: Verdict;
  /** Per-passport overrides. */
  byPassport: Partial<Record<string, Verdict>>;
  /** Indicative tourist visa fee in USD (when default is required/evisa/voa). */
  defaultFeeUsd?: number;
  /** Per-passport fee overrides. */
  feeByPassport?: Partial<Record<string, number>>;
  /** Canonical official visa info page for this destination. */
  officialUrl: string;
  /** Confidence in the encoded rules. We only render verdicts when "high". */
  confidence: "high" | "medium";
}

// --- Regional groupings (passport sets) -----------------------------------

/**
 * Passports whose holders get visa-free short stays (typically 90 days
 * within any 180-day window) across the Schengen Area. Includes the
 * EU/EEA + Switzerland + a curated list of high-passport-strength
 * non-European countries that the EU has bilateral exemptions with.
 *
 * Not exhaustive — we err toward well-known cases.
 */
const SCHENGEN_VISA_FREE = new Set<string>([
  // Other Schengen / EU members (themselves visa-free)
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE",
  "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "NL",
  "NO", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "CH",
  // Non-European visa-free
  "US", "CA", "GB", "AU", "NZ", "JP", "KR", "SG", "IL", "AE",
  "BR", "AR", "CL", "MX", "UY", "CR", "PA",
  "TW", "HK", "MO", "MY",
]);

/** US Visa Waiver Program (ESTA) — short list of partner countries. */
const VISA_WAIVER_PROGRAM = new Set<string>([
  // EU/EEA
  "AT", "BE", "HR", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "NL", "NO", "PL",
  "PT", "SK", "SI", "ES", "SE", "CH",
  // Other VWP partners
  "GB", "AU", "NZ", "JP", "KR", "SG", "BN", "TW", "IL", "QA",
]);

/** Gulf Cooperation Council passports — visa-free across the bloc. */
const GCC = new Set<string>(["AE", "SA", "QA", "KW", "BH", "OM"]);

// --- Destination policies -------------------------------------------------

/**
 * Build a `byPassport` override map by assigning a single verdict to a
 * set of passports. Used to keep the policy data declarative and short.
 */
function fromSet(
  set: ReadonlySet<string>,
  verdict: Verdict,
): Partial<Record<string, Verdict>> {
  const out: Partial<Record<string, Verdict>> = {};
  for (const p of set) out[p] = verdict;
  return out;
}

function merge(
  ...maps: Partial<Record<string, Verdict>>[]
): Partial<Record<string, Verdict>> {
  return Object.assign({}, ...maps);
}

/**
 * Sparse, hand-curated registry. Add destinations here as the
 * confidence in their rules is verified against the official source.
 */
export const DESTINATION_POLICIES: Record<string, DestinationPolicy> = {
  US: {
    code: "US",
    defaultVerdict: "required",
    byPassport: merge(
      fromSet(VISA_WAIVER_PROGRAM, "eta"),
      // Canada: visa-not-required for short stays (no ESTA needed)
      { CA: "not_required", BM: "not_required" },
    ),
    defaultFeeUsd: 185, // B1/B2 MRV fee
    officialUrl: "https://travel.state.gov/content/travel/en/us-visas.html",
    confidence: "high",
  },

  GB: {
    code: "GB",
    defaultVerdict: "required",
    byPassport: merge(
      // UK ETA rolled out 2024–2025 to all visa-exempt visitors
      fromSet(SCHENGEN_VISA_FREE, "eta"),
    ),
    defaultFeeUsd: 150, // Standard Visitor visa
    officialUrl: "https://www.gov.uk/check-uk-visa",
    confidence: "high",
  },

  CA: {
    code: "CA",
    defaultVerdict: "required",
    byPassport: merge(
      fromSet(SCHENGEN_VISA_FREE, "eta"),
      // Canada exempts US passport holders entirely
      { US: "not_required" },
    ),
    defaultFeeUsd: 75, // Visitor Visa
    officialUrl:
      "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html",
    confidence: "high",
  },

  AU: {
    code: "AU",
    defaultVerdict: "required",
    byPassport: merge(
      // Most Schengen + Western passports get eVisitor (subclass 651) or ETA
      fromSet(SCHENGEN_VISA_FREE, "eta"),
    ),
    defaultFeeUsd: 130, // Visitor visa (subclass 600)
    officialUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa",
    confidence: "high",
  },

  NZ: {
    code: "NZ",
    defaultVerdict: "required",
    byPassport: merge(
      fromSet(SCHENGEN_VISA_FREE, "eta"),
      { AU: "not_required" }, // Australians don't need an NZeTA
    ),
    defaultFeeUsd: 200, // Visitor Visa
    officialUrl: "https://www.immigration.govt.nz/new-zealand-visas",
    confidence: "high",
  },

  // --- Schengen Area ---------------------------------------------------
  // All Schengen members share the same visa policy, so we encode them
  // identically. ETIAS (EU's pre-travel authorization) was scheduled to
  // launch in late 2026; until it does, visa-free passports remain
  // visa_free, not eta.

  DE: schengenPolicy("DE", "https://www.auswaertiges-amt.de/en/visa-service"),
  FR: schengenPolicy("FR", "https://france-visas.gouv.fr/en/web/france-visas/"),
  IT: schengenPolicy("IT", "https://vistoperitalia.esteri.it/home/en"),
  ES: schengenPolicy("ES", "https://www.exteriores.gob.es/Consulados/En/Paginas/Index.aspx"),
  NL: schengenPolicy("NL", "https://www.netherlandsworldwide.nl/visa-the-netherlands"),
  BE: schengenPolicy("BE", "https://dofi.ibz.be/en/themes/short-stay-90-days-or-less"),
  AT: schengenPolicy("AT", "https://www.bmeia.gv.at/en/travel-and-services/visa-information"),
  CH: schengenPolicy("CH", "https://www.sem.admin.ch/sem/en/home/themen/einreise.html"),
  GR: schengenPolicy("GR", "https://www.mfa.gr/en/visas/"),
  PT: schengenPolicy("PT", "https://vistos.mne.gov.pt/en/"),
  SE: schengenPolicy("SE", "https://www.migrationsverket.se/English/Private-individuals/Visiting-Sweden.html"),
  PL: schengenPolicy("PL", "https://www.gov.pl/web/diplomacy/visas"),

  // --- Asia ------------------------------------------------------------

  JP: {
    code: "JP",
    defaultVerdict: "required",
    byPassport: {
      // Japan grants 90-day visa-free entry to ~67 countries; we encode
      // the highest-volume ones.
      US: "not_required", CA: "not_required", GB: "not_required",
      AU: "not_required", NZ: "not_required", KR: "not_required",
      SG: "not_required", MY: "not_required", BN: "not_required",
      MX: "not_required", BR: "not_required", CL: "not_required",
      AR: "not_required", IL: "not_required", AE: "not_required",
      ...Object.fromEntries([...SCHENGEN_VISA_FREE].filter((c) =>
        ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR",
         "HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL",
         "PT","RO","SK","SI","ES","SE","CH"].includes(c),
      ).map((c) => [c, "not_required" as Verdict])),
      HK: "not_required", TW: "not_required", MO: "not_required",
    },
    defaultFeeUsd: 30,
    officialUrl: "https://www.mofa.go.jp/j_info/visit/visa/index.html",
    confidence: "high",
  },

  KR: {
    code: "KR",
    defaultVerdict: "required",
    byPassport: {
      // K-ETA suspended for many top-tier passports through 2025–2026 —
      // they get visa-free 90-day entry. We model that as not_required.
      US: "not_required", CA: "not_required", GB: "not_required",
      AU: "not_required", NZ: "not_required", JP: "not_required",
      SG: "not_required", MY: "not_required", IL: "not_required",
      AE: "not_required", BR: "not_required", CL: "not_required",
      MX: "not_required",
      ...Object.fromEntries(
        ["DE","FR","IT","ES","NL","BE","AT","CH","SE","NO","FI","DK",
         "IE","PT","GR","PL","CZ","HU","LU","IS"].map((c) => [c, "not_required" as Verdict]),
      ),
      HK: "not_required", TW: "not_required",
      // CN, IN, etc. need a visa or e-Visa.
      CN: "evisa", IN: "evisa", VN: "evisa", PH: "evisa",
      ID: "evisa", TH: "evisa",
    },
    defaultFeeUsd: 90,
    officialUrl: "https://www.k-eta.go.kr/portal/apply/index.do",
    confidence: "high",
  },

  CN: {
    code: "CN",
    defaultVerdict: "required",
    byPassport: {
      // Recent unilateral expansions (2023–2025): SG, BN, JP get
      // long-standing visa-free; many EU + AU + NZ + KR added 2024–25.
      SG: "not_required", BN: "not_required", JP: "not_required",
      KR: "not_required", AU: "not_required", NZ: "not_required",
      MY: "not_required",
      // EU expansion list (15-day visa-free, extended to 30 in 2024-25):
      ...Object.fromEntries(
        ["FR","DE","IT","ES","NL","BE","AT","CH","IE","LU","HU","FI",
         "PL","PT","SK","NO","DK","SE"].map((c) => [c, "not_required" as Verdict]),
      ),
    },
    defaultFeeUsd: 140,
    officialUrl: "https://bio.visaforchina.org/",
    confidence: "medium",
  },

  IN: {
    code: "IN",
    defaultVerdict: "evisa", // India's e-Tourist Visa covers ~170 nationalities
    byPassport: {
      NP: "not_required", BT: "not_required", // SAARC bilaterals
      MV: "not_required",
    },
    defaultFeeUsd: 25,
    officialUrl: "https://indianvisaonline.gov.in/evisa/tvoa.html",
    confidence: "high",
  },

  TH: {
    code: "TH",
    defaultVerdict: "voa",
    byPassport: {
      // Thailand's visa-exemption list is large; encode the highest-volume.
      US: "not_required", CA: "not_required", GB: "not_required",
      AU: "not_required", NZ: "not_required", JP: "not_required",
      KR: "not_required", SG: "not_required", MY: "not_required",
      ID: "not_required", PH: "not_required", VN: "not_required",
      IL: "not_required", AE: "not_required", BR: "not_required",
      MX: "not_required", AR: "not_required", CL: "not_required",
      RU: "not_required", TR: "not_required", ZA: "not_required",
      HK: "not_required", TW: "not_required", MO: "not_required",
      IN: "not_required", // Added to visa-free list in 2024
      CN: "not_required", // Mutual visa exemption signed 2024
      ...Object.fromEntries([...SCHENGEN_VISA_FREE].filter((c) =>
        ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR",
         "HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL",
         "PT","RO","SK","SI","ES","SE","CH"].includes(c),
      ).map((c) => [c, "not_required" as Verdict])),
    },
    defaultFeeUsd: 35,
    officialUrl: "https://www.thaievisa.go.th/",
    confidence: "high",
  },

  SG: {
    code: "SG",
    defaultVerdict: "required",
    byPassport: {
      // Singapore exempts ~158 nationalities for short tourism.
      US: "not_required", CA: "not_required", GB: "not_required",
      AU: "not_required", NZ: "not_required", JP: "not_required",
      KR: "not_required", MY: "not_required", BN: "not_required",
      ID: "not_required", PH: "not_required", TH: "not_required",
      VN: "not_required", IL: "not_required", AE: "not_required",
      BR: "not_required", MX: "not_required", AR: "not_required",
      CL: "not_required", ZA: "not_required",
      HK: "not_required", TW: "not_required", MO: "not_required",
      ...Object.fromEntries([...SCHENGEN_VISA_FREE].filter((c) =>
        ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR",
         "HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL",
         "PT","RO","SK","SI","ES","SE","CH"].includes(c),
      ).map((c) => [c, "not_required" as Verdict])),
      // China gets a 30-day visa-free as of 2024 (mutual)
      CN: "not_required",
      IN: "evisa",
    },
    defaultFeeUsd: 30,
    officialUrl: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements",
    confidence: "high",
  },

  AE: {
    code: "AE",
    defaultVerdict: "required",
    byPassport: merge(
      fromSet(SCHENGEN_VISA_FREE, "not_required"),
      fromSet(GCC, "not_required"),
      {
        US: "not_required", CA: "not_required", GB: "not_required",
        AU: "not_required", NZ: "not_required", JP: "not_required",
        KR: "not_required", SG: "not_required", MY: "not_required",
        BN: "not_required", IL: "not_required",
        HK: "not_required", TW: "not_required",
        IN: "voa", // VoA available for many but eVisa more common
      },
    ),
    defaultFeeUsd: 100,
    officialUrl: "https://u.ae/en/information-and-services/visa-and-emirates-id",
    confidence: "high",
  },

  TR: {
    code: "TR",
    defaultVerdict: "evisa",
    byPassport: {
      // Türkiye exempts most Western European, GCC, and select others.
      US: "evisa", CA: "evisa", GB: "evisa", AU: "evisa",
      ...Object.fromEntries(
        ["DE","FR","IT","ES","NL","BE","AT","CH","SE","NO","FI","DK",
         "IE","PT","GR","CZ","HU","PL"].map((c) => [c, "not_required" as Verdict]),
      ),
      JP: "not_required", KR: "not_required",
      AE: "not_required", QA: "not_required", KW: "not_required",
      BH: "not_required", OM: "not_required", SA: "evisa",
    },
    defaultFeeUsd: 50,
    officialUrl: "https://www.evisa.gov.tr/en/",
    confidence: "high",
  },

  MX: {
    code: "MX",
    defaultVerdict: "required",
    byPassport: merge(
      fromSet(SCHENGEN_VISA_FREE, "not_required"),
      {
        US: "not_required", CA: "not_required", GB: "not_required",
        AU: "not_required", NZ: "not_required", JP: "not_required",
        KR: "not_required", SG: "not_required", IL: "not_required",
        BR: "not_required", AR: "not_required", CL: "not_required",
        CO: "not_required", PE: "not_required", UY: "not_required",
        // Holders of valid US, CA, UK, JP, Schengen visa: visa-free.
        // Not modeled here — keep it simple.
      },
    ),
    defaultFeeUsd: 50,
    officialUrl: "https://www.gob.mx/sre/en/articles/passports-and-visas-mexico",
    confidence: "medium",
  },

  BR: {
    code: "BR",
    defaultVerdict: "required",
    byPassport: merge(
      fromSet(SCHENGEN_VISA_FREE, "not_required"),
      {
        // Brazil reinstated visas for US/CA/AU in 2025; we model that.
        US: "evisa", CA: "evisa", AU: "evisa",
        GB: "not_required", NZ: "not_required", JP: "not_required",
        KR: "not_required", SG: "not_required",
        MX: "not_required", AR: "not_required", CL: "not_required",
        CO: "not_required", PE: "not_required", UY: "not_required",
        ZA: "not_required", IL: "not_required",
      },
    ),
    defaultFeeUsd: 80,
    officialUrl: "https://www.gov.br/mre/en",
    confidence: "medium",
  },

  EG: {
    code: "EG",
    defaultVerdict: "voa",
    byPassport: {
      // Egypt grants VoA to most major passports.
      // GCC + a few others get visa-free.
      ...Object.fromEntries([...GCC].map((c) => [c, "not_required" as Verdict])),
    },
    defaultFeeUsd: 25,
    officialUrl: "https://www.visa2egypt.gov.eg/",
    confidence: "medium",
  },

  ZA: {
    code: "ZA",
    defaultVerdict: "required",
    byPassport: merge(
      fromSet(SCHENGEN_VISA_FREE, "not_required"),
      {
        US: "not_required", CA: "not_required", GB: "not_required",
        AU: "not_required", NZ: "not_required", JP: "not_required",
        KR: "not_required", SG: "not_required", IL: "not_required",
        BR: "not_required", AR: "not_required", CL: "not_required",
      },
    ),
    defaultFeeUsd: 45,
    officialUrl: "https://www.dha.gov.za/index.php/applying-for-sa-visa",
    confidence: "high",
  },

  // --- Sparse coverage for popular destinations without high confidence:
  // PH, VN, ID, RU, IL, SA  — defer until rules are verified.
};

function schengenPolicy(code: string, officialUrl: string): DestinationPolicy {
  return {
    code,
    defaultVerdict: "required",
    byPassport: fromSet(SCHENGEN_VISA_FREE, "not_required"),
    defaultFeeUsd: 90, // Standard Schengen short-stay visa
    officialUrl,
    confidence: "high",
  };
}

// --- Lookup ---------------------------------------------------------------

export interface CorridorPolicy {
  verdict: Verdict;
  /** Indicative tourist visa fee in USD. May be undefined when not_required. */
  feeUsd?: number;
  /** Canonical official source for the verdict. */
  officialUrl: string;
}

/**
 * Returns the encoded policy for a (passport, destination) pair, or null
 * if we don't have high-confidence data for the destination. Callers
 * should treat null as "verdict not known — show generic CTA".
 */
export function getCorridorPolicy(
  passportCode: string,
  destinationCode: string,
): CorridorPolicy | null {
  const policy = DESTINATION_POLICIES[destinationCode.toUpperCase()];
  if (!policy) return null;
  if (policy.confidence !== "high") return null;

  const override = policy.byPassport[passportCode.toUpperCase()];
  const verdict = override ?? policy.defaultVerdict;

  // Fee is only meaningful when a visa is actually needed.
  const feeUsd =
    verdict === "not_required"
      ? undefined
      : (policy.feeByPassport?.[passportCode.toUpperCase()] ??
        policy.defaultFeeUsd);

  return {
    verdict,
    feeUsd,
    officialUrl: policy.officialUrl,
  };
}

/** Human-readable verdict label for the corridor page hero. */
export function verdictLabel(verdict: Verdict): string {
  switch (verdict) {
    case "not_required":
      return "No visa required";
    case "voa":
      return "Visa on arrival";
    case "eta":
      return "Electronic travel authorization";
    case "evisa":
      return "eVisa required";
    case "required":
      return "Visa required";
  }
}

/** Sentence-form verdict for headlines. */
export function verdictSentence(
  verdict: Verdict,
  passport: string,
  destination: string,
): string {
  switch (verdict) {
    case "not_required":
      return `${passport} citizens do not need a visa to visit ${destination} for short tourism.`;
    case "voa":
      return `${passport} citizens can get a visa on arrival in ${destination}.`;
    case "eta":
      return `${passport} citizens need an electronic travel authorization (ETA) before traveling to ${destination}.`;
    case "evisa":
      return `${passport} citizens need an eVisa before traveling to ${destination}.`;
    case "required":
      return `${passport} citizens need a visa before traveling to ${destination}.`;
  }
}

/** Tone bucket used for verdict-card styling. */
export function verdictTone(verdict: Verdict): "ok" | "warn" | "stop" {
  switch (verdict) {
    case "not_required":
      return "ok";
    case "voa":
    case "eta":
    case "evisa":
      return "warn";
    case "required":
      return "stop";
  }
}
