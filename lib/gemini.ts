import { GoogleGenAI } from "@google/genai";

/**
 * Lazy Gemini client. We don't instantiate at import time so that the app
 * can start in dev without GEMINI_API_KEY set (the /api/visa-advice route
 * will surface a clear error if it's missing at request time).
 */
let _client: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (_client) return _client;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to .env.local before using the visa-advice API.",
    );
  }
  _client = new GoogleGenAI({ apiKey });
  return _client;
}

/**
 * Model IDs are centralized here so we can pin/update them in one place as
 * Google ships new Gemini 3 revisions. These names follow the current
 * Google GenAI SDK convention; update when the latest Gemini 3 identifiers
 * are published.
 */
export const MODELS = {
  /** Reasoning + Google Search grounding. Used for visa advice and photo specs. */
  reasoning: process.env.GEMINI_REASONING_MODEL ?? "gemini-2.5-pro",
  /** Multimodal judgment. Used for photo compliance review. */
  vision: process.env.GEMINI_VISION_MODEL ?? "gemini-2.5-flash",
  /** Image editing. Used for photo fix. */
  imageEdit:
    process.env.GEMINI_IMAGE_EDIT_MODEL ?? "gemini-2.5-flash-image",
} as const;
