/**
 * Passport-to-destination corridors for SEO landing pages.
 *
 * Corridors are generated programmatically from the Cartesian product
 * of TOP_PASSPORTS × TOP_DESTINATIONS, minus same-country pairs. This
 * yields ~700 indexable URLs covering the highest-volume visa
 * requirement searches without hand-curation drift.
 *
 * To add a new passport or destination, append to the list below and
 * the new corridors are picked up at the next build. The visa-policy
 * registry (`lib/visa-policy.ts`) is consulted at render time for the
 * verdict and fee data — it can be sparser than this list without
 * breaking pages.
 */
import { COUNTRIES, countryName } from "@/lib/countries";

export interface Corridor {
  passport: string;
  passportCode: string;
  destination: string;
  destinationCode: string;
  slug: string;
}

/**
 * Highest-volume passport markets by Google Search trends + global
 * outbound tourism. Order is roughly by search volume.
 */
export const TOP_PASSPORTS: readonly string[] = [
  "IN", "US", "GB", "CA", "AU", "DE", "FR", "CN", "JP", "KR",
  "BR", "MX", "NG", "PH", "ID", "VN", "PK", "BD", "EG", "RU",
  "TH", "MY", "SA", "AE", "ZA", "TR", "IT", "ES", "NL", "PL",
] as const;

/**
 * Highest-volume inbound destinations. Order is roughly by inbound
 * tourist arrivals + visa-question search volume.
 */
export const TOP_DESTINATIONS: readonly string[] = [
  "US", "GB", "CA", "AU", "DE", "FR", "IT", "ES", "JP", "CN",
  "IN", "AE", "TH", "SG", "MY", "MX", "BR", "NZ", "KR", "TR",
  "NL", "CH", "EG", "ZA", "ID", "AT", "GR", "PT", "SE", "PL",
] as const;

/** URL-safe slug for a passport→destination pair. */
function makeSlug(passportCode: string, destinationCode: string): string {
  // Use compact aliases for high-frequency country names so URLs read
  // naturally to humans (and to backlinks). Falls back to the lower-cased
  // ISO code for everything else.
  const aliases: Record<string, string> = {
    US: "usa",
    GB: "uk",
    AE: "uae",
    KR: "south-korea",
    NZ: "new-zealand",
    CN: "china",
    DE: "germany",
    FR: "france",
    IT: "italy",
    ES: "spain",
    JP: "japan",
    IN: "india",
    AU: "australia",
    CA: "canada",
    BR: "brazil",
    MX: "mexico",
    NG: "nigeria",
    PH: "philippines",
    ID: "indonesia",
    VN: "vietnam",
    PK: "pakistan",
    BD: "bangladesh",
    EG: "egypt",
    RU: "russia",
    TH: "thailand",
    MY: "malaysia",
    SA: "saudi-arabia",
    ZA: "south-africa",
    TR: "turkey",
    NL: "netherlands",
    CH: "switzerland",
    SG: "singapore",
    AT: "austria",
    GR: "greece",
    PT: "portugal",
    SE: "sweden",
    PL: "poland",
  };
  const a = aliases[passportCode] ?? passportCode.toLowerCase();
  const b = aliases[destinationCode] ?? destinationCode.toLowerCase();
  return `${a}-to-${b}`;
}

function generateCorridors(): Corridor[] {
  const out: Corridor[] = [];
  const seen = new Set<string>();
  const knownCodes = new Set(COUNTRIES.map((c) => c.code));

  for (const p of TOP_PASSPORTS) {
    if (!knownCodes.has(p)) continue;
    for (const d of TOP_DESTINATIONS) {
      if (!knownCodes.has(d)) continue;
      if (p === d) continue; // skip same-country pairs
      const slug = makeSlug(p, d);
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push({
        passport: countryName(p),
        passportCode: p,
        destination: countryName(d),
        destinationCode: d,
        slug,
      });
    }
  }
  return out;
}

export const CORRIDORS: readonly Corridor[] = generateCorridors();

export function getCorridorBySlug(slug: string): Corridor | undefined {
  return CORRIDORS.find((c) => c.slug === slug);
}
