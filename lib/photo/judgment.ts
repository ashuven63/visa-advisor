import { getGemini, MODELS } from "@/lib/gemini";
import type { CountryPhotoSpec, PhotoCheck } from "./types";

/**
 * LLM-based visual judgment for photo compliance. Sent to Gemini 3 Flash
 * (vision model) with the photo + the spec. Checks things that sharp/
 * MediaPipe can't: background color/uniformity, expression, shadows,
 * headwear, hair covering face, glasses, etc.
 */
export async function llmJudgment(
  buffer: Buffer,
  spec: CountryPhotoSpec,
): Promise<PhotoCheck[]> {
  const ai = getGemini();

  const prompt = `You are a visa/passport photo compliance reviewer. Given the photo and spec below, evaluate ONLY these criteria and return a JSON array of check objects.

Spec:
- Background: ${spec.background} (${spec.backgroundHex})
- Head size: ${spec.headSizePercent[0]}–${spec.headSizePercent[1]}% of frame height
- Glasses allowed: ${spec.glassesAllowed ? "yes" : "no"}
- Country: ${spec.country}

Evaluate each of these and include ALL in your response:
1. "face-count" — exactly one face visible
2. "head-size" — head height is ${spec.headSizePercent[0]}–${spec.headSizePercent[1]}% of frame
3. "head-tilt" — head is straight (tilt < 5°)
4. "eye-line" — eyes are in the correct vertical band (roughly 55–70% from bottom)
5. "background" — uniform ${spec.background} background, no patterns or objects
6. "expression" — neutral expression, mouth closed, eyes open
7. "glasses" — ${spec.glassesAllowed ? "glasses are allowed" : "no glasses should be worn"}
8. "shadows" — no shadows on face or background
9. "hair" — hair does not obscure face or eyes
10. "headwear" — no headwear unless religious

For each, return: { "id": string, "label": string, "status": "pass"|"fail"|"warn", "detail": string, "fixable": boolean }

"fixable" = true only for: background issues, shadow removal. False for: expression, glasses, head tilt, face count.

Respond with a JSON array ONLY, no markdown fences.`;

  const result = await ai.models.generateContent({
    model: MODELS.vision,
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: buffer.toString("base64"),
            },
          },
          { text: prompt },
        ],
      },
    ],
    config: {
      temperature: 0.1,
    },
  });

  const text = result.text ?? "";
  const first = text.indexOf("[");
  const last = text.lastIndexOf("]");
  if (first === -1 || last <= first) return [];

  try {
    const parsed = JSON.parse(text.slice(first, last + 1)) as unknown[];
    return parsed
      .filter(
        (item): item is PhotoCheck =>
          typeof item === "object" &&
          item !== null &&
          "id" in item &&
          "status" in item,
      )
      .map((item) => ({
        id: String(item.id),
        label: String(item.label ?? item.id),
        status: (["pass", "fail", "warn"].includes(item.status)
          ? item.status
          : "warn") as PhotoCheck["status"],
        detail: String(item.detail ?? ""),
        fixable: Boolean(item.fixable),
      }));
  } catch {
    return [];
  }
}
