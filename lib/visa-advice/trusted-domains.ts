/**
 * Allowlist of domain patterns we consider "official / primary" sources for
 * visa rules. A citation whose hostname doesn't match one of these patterns
 * is stripped from the response and the overall confidence is demoted.
 *
 * Patterns:
 *  - exact hostnames                  e.g. "travel.state.gov"
 *  - suffixes (anything ending with)  e.g. ".gov" or ".gov.uk"
 *
 * When in doubt, prefer suffix matches rooted at a government TLD so we
 * cover sub-consulates we haven't manually listed (e.g. "in.usembassy.gov").
 */
const TRUSTED_SUFFIXES: readonly string[] = [
  // Generic government TLDs
  ".gov",
  ".gov.uk",
  ".gov.au",
  ".gov.nz",
  ".gov.in",
  ".gov.sg",
  ".gov.ae",
  ".gov.sa",
  ".gov.br",
  ".gov.za",
  ".gov.mx",
  ".gov.ar",
  ".gov.co",
  ".gob.cl",
  ".gob.mx",
  ".gob.es",
  ".gob.pe",
  ".gov.il",
  ".gov.tr",
  ".gov.vn",
  ".gov.ph",
  ".gov.my",
  ".gov.pk",
  ".gov.bd",
  ".gov.lk",
  ".gov.hk",
  ".gc.ca", // Government of Canada
  ".gouv.fr", // Government of France
  ".admin.ch", // Swiss federal admin
  ".europa.eu", // EU institutions
  ".bund.de", // German federal (some use .de directly; fall back to embassy suffixes)
  // Ministry / diplomatic-service domains commonly used for consulate pages
  "mofa.go.jp",
  "mofa.gov.kr",
  "mofa.gov.sa",
  "mofa.gov.ae",
  "mea.gov.in",
  "immi.homeaffairs.gov.au",
  "immigration.govt.nz",
  "ircc.canada.ca",
  "vfsglobal.com", // Note: vfs is a booking intermediary, not authoritative — kept off allowlist intentionally
] as const;

// Explicit exact allowlist for non-gov hosts we still trust as primary sources.
const TRUSTED_EXACT: readonly string[] = [
  "europa.eu",
  "ec.europa.eu",
  "schengenvisainfo.com", // Informational — NOT authoritative; excluded deliberately
].filter((host) => host !== "schengenvisainfo.com");

function hostFor(url: string): string | null {
  try {
    const u = new URL(url);
    return u.hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function isTrustedCitation(url: string): boolean {
  const host = hostFor(url);
  if (!host) return false;
  if (TRUSTED_EXACT.includes(host)) return true;
  // .gov is allowed for US (2-label), but also exact suffix match protects
  // against look-alikes like "foo.gov.evil.com".
  return TRUSTED_SUFFIXES.some(
    (suffix) => host === suffix.replace(/^\./, "") || host.endsWith(suffix),
  );
}

export function filterToTrusted<T extends { url: string }>(
  citations: readonly T[],
): T[] {
  return citations.filter((c) => isTrustedCitation(c.url));
}
