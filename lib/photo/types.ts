/**
 * Per-country photo specification. Fetched via Gemini + grounding and
 * cached in KV per country for 30 days.
 */
export interface CountryPhotoSpec {
  country: string;
  widthMm: number;
  heightMm: number;
  dpi: number;
  /** Required minimum pixels: computed from mm × dpi / 25.4 */
  minWidthPx: number;
  minHeightPx: number;
  /** Background color requirement, e.g. "white", "light gray". */
  background: string;
  /** Hex code for the ideal background, e.g. "#ffffff". */
  backgroundHex: string;
  /** Head height as percentage of total frame: [min, max]. */
  headSizePercent: [number, number];
  /** Are glasses allowed? */
  glassesAllowed: boolean;
  /** Maximum file size in bytes, or null if unspecified. */
  maxFileSizeBytes: number | null;
  /** Source URL for the spec. */
  sourceUrl: string;
}

/** Result of a single check in the photo compliance pipeline. */
export interface PhotoCheck {
  id: string;
  label: string;
  status: "pass" | "fail" | "warn";
  detail: string;
  /** Whether nano banana can realistically fix this issue. */
  fixable: boolean;
}

/** Full photo compliance report combining mechanical + LLM checks. */
export interface PhotoReport {
  overall: "pass" | "fail";
  checks: PhotoCheck[];
  spec: CountryPhotoSpec;
}

/**
 * Default photo spec (US passport photo) used when we cannot fetch the
 * country-specific spec. 2×2 inches at 300 DPI.
 */
export const DEFAULT_SPEC: CountryPhotoSpec = {
  country: "US",
  widthMm: 51,
  heightMm: 51,
  dpi: 300,
  minWidthPx: 600,
  minHeightPx: 600,
  background: "white",
  backgroundHex: "#ffffff",
  headSizePercent: [50, 69],
  glassesAllowed: false,
  maxFileSizeBytes: 10 * 1024 * 1024, // 10 MB
  sourceUrl:
    "https://travel.state.gov/content/travel/en/passports/how-apply/photos.html",
};
