import { getGemini, MODELS } from "@/lib/gemini";
import type { PhotoCheck, CountryPhotoSpec } from "./types";

/**
 * Build a targeted edit prompt from the failing checks.
 */
function buildFixPrompt(
  failures: PhotoCheck[],
  spec: CountryPhotoSpec,
): string {
  const instructions: string[] = [];

  for (const f of failures) {
    switch (f.id) {
      case "background":
        instructions.push(
          `Replace the background with a uniform ${spec.background} (${spec.backgroundHex}). Remove all objects, patterns, and shadows from the background.`,
        );
        break;
      case "shadows":
        instructions.push(
          "Remove all shadows on the face and background. Ensure even lighting.",
        );
        break;
      case "aspect-ratio":
        instructions.push(
          `Crop or pad the image to a ${spec.widthMm}:${spec.heightMm} aspect ratio, keeping the face centered.`,
        );
        break;
      default:
        instructions.push(
          `Fix: ${f.label} — ${f.detail}`,
        );
    }
  }

  return [
    "Edit this passport/visa photo to fix the following issues:",
    ...instructions.map((s, i) => `${i + 1}. ${s}`),
    "",
    "IMPORTANT: Keep the person's face, expression, and clothing completely unchanged.",
    "Return the edited image.",
  ].join("\n");
}

/**
 * Call Gemini Flash Image (nano banana successor) to fix the photo.
 * Returns the edited image as a Buffer, or null on failure.
 */
export async function fixPhoto(
  buffer: Buffer,
  failures: PhotoCheck[],
  spec: CountryPhotoSpec,
): Promise<Buffer | null> {
  if (failures.length === 0) return null;

  const ai = getGemini();
  const prompt = buildFixPrompt(failures, spec);

  const result = await ai.models.generateContent({
    model: MODELS.imageEdit,
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
      responseModalities: ["IMAGE", "TEXT"],
    },
  });

  // Look for an image part in the response.
  const candidate = result.candidates?.[0];
  if (!candidate?.content?.parts) return null;

  for (const part of candidate.content.parts) {
    if (
      part.inlineData?.mimeType?.startsWith("image/") &&
      part.inlineData?.data
    ) {
      return Buffer.from(part.inlineData.data, "base64");
    }
  }

  return null;
}
