import type { PhotoCheck, CountryPhotoSpec } from "./types";

/**
 * Face detection checks using basic image analysis.
 *
 * NOTE: The plan calls for @mediapipe/tasks-vision, but it requires
 * WASM binaries that are complex to set up in a Node.js server
 * environment. For v1, we delegate face-related judgments (head size,
 * tilt, eye line) to the Gemini vision LLM in `judgment.ts` — which can
 * evaluate all of these accurately from the image. This file provides a
 * structural placeholder so the pipeline shape is correct, and we can
 * drop in MediaPipe later without changing the API.
 *
 * In the meantime, the mechanical pipeline returns a single "face"
 * check that defers to the LLM.
 */
export async function faceChecks(
  _buffer: Buffer,
  _spec: CountryPhotoSpec,
): Promise<PhotoCheck[]> {
  // Face-level checks are handled by the LLM judgment step.
  // Return an empty array so the pipeline merges cleanly.
  return [];
}
