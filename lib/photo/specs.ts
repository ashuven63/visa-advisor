import { getGemini, MODELS } from "@/lib/gemini";
import { countryName } from "@/lib/countries";
import { DEFAULT_SPEC, type CountryPhotoSpec } from "./types";

/**
 * In-memory spec cache. In production → Vercel KV with 30-day TTL.
 */
const SPEC_CACHE = new Map<string, { spec: CountryPhotoSpec; ts: number }>();
const TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

/**
 * Fetch the official photo specification for a given country using Gemini
 * with Google Search grounding. Falls back to DEFAULT_SPEC on failure.
 */
export async function getPhotoSpec(
  countryCode: string,
): Promise<CountryPhotoSpec> {
  const upper = countryCode.toUpperCase();
  const cached = SPEC_CACHE.get(upper);
  if (cached && Date.now() - cached.ts < TTL_MS) return cached.spec;

  try {
    const ai = getGemini();
    const name = countryName(upper);

    const result = await ai.models.generateContent({
      model: MODELS.reasoning,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `What are the official passport/visa photo requirements for ${name}? I need: width and height in millimeters, DPI (default 300 if not specified), background color and hex code, head height as percentage range of frame, whether glasses are allowed, and maximum file size in bytes. Also provide the official government source URL. Respond with ONLY a JSON object: { "widthMm": number, "heightMm": number, "dpi": number, "background": string, "backgroundHex": string, "headSizePercent": [min, max], "glassesAllowed": boolean, "maxFileSizeBytes": number|null, "sourceUrl": string }`,
            },
          ],
        },
      ],
      config: {
        systemInstruction:
          "You are a precise photo-requirements researcher. Only use official government sources. Respond with JSON only, no markdown fences.",
        temperature: 0.1,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = result.text ?? "";
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first === -1 || last <= first) throw new Error("No JSON in response");
    const parsed = JSON.parse(text.slice(first, last + 1)) as Record<
      string,
      unknown
    >;

    const spec: CountryPhotoSpec = {
      country: upper,
      widthMm: Number(parsed.widthMm) || DEFAULT_SPEC.widthMm,
      heightMm: Number(parsed.heightMm) || DEFAULT_SPEC.heightMm,
      dpi: Number(parsed.dpi) || 300,
      minWidthPx: 0, // computed below
      minHeightPx: 0,
      background: String(parsed.background ?? "white"),
      backgroundHex: String(parsed.backgroundHex ?? "#ffffff"),
      headSizePercent: Array.isArray(parsed.headSizePercent)
        ? [Number(parsed.headSizePercent[0]) || 50, Number(parsed.headSizePercent[1]) || 69]
        : [50, 69],
      glassesAllowed: Boolean(parsed.glassesAllowed),
      maxFileSizeBytes:
        typeof parsed.maxFileSizeBytes === "number"
          ? parsed.maxFileSizeBytes
          : null,
      sourceUrl: String(parsed.sourceUrl ?? ""),
    };
    spec.minWidthPx = Math.ceil((spec.widthMm * spec.dpi) / 25.4);
    spec.minHeightPx = Math.ceil((spec.heightMm * spec.dpi) / 25.4);

    SPEC_CACHE.set(upper, { spec, ts: Date.now() });
    return spec;
  } catch {
    return { ...DEFAULT_SPEC, country: upper };
  }
}
