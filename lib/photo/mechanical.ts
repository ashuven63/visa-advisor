import sharp from "sharp";
import type { CountryPhotoSpec, PhotoCheck } from "./types";

/**
 * Run mechanical (non-LLM) checks on an uploaded photo buffer. These
 * checks are fast and cheap — they run before any LLM call.
 */
export async function mechanicalChecks(
  buffer: Buffer,
  spec: CountryPhotoSpec,
): Promise<PhotoCheck[]> {
  const checks: PhotoCheck[] = [];
  const meta = await sharp(buffer).metadata();

  // 1. File type
  const format = meta.format;
  const accepted = ["jpeg", "png"];
  checks.push({
    id: "file-type",
    label: "File type",
    status: accepted.includes(format ?? "") ? "pass" : "fail",
    detail:
      accepted.includes(format ?? "")
        ? `${format?.toUpperCase()} detected — accepted.`
        : `${format?.toUpperCase() ?? "Unknown"} detected. Only JPEG or PNG accepted. If you're on iPhone, convert from HEIC first.`,
    fixable: false,
  });

  // 2. Pixel dimensions
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const dimOk = w >= spec.minWidthPx && h >= spec.minHeightPx;
  checks.push({
    id: "pixel-dimensions",
    label: "Pixel dimensions",
    status: dimOk ? "pass" : "fail",
    detail: dimOk
      ? `${w}×${h} px meets the minimum ${spec.minWidthPx}×${spec.minHeightPx} px.`
      : `${w}×${h} px is below the minimum ${spec.minWidthPx}×${spec.minHeightPx} px.`,
    fixable: false,
  });

  // 3. Aspect ratio
  const expectedRatio = spec.widthMm / spec.heightMm;
  const actualRatio = w / (h || 1);
  const ratioOk = Math.abs(actualRatio - expectedRatio) / expectedRatio < 0.01;
  checks.push({
    id: "aspect-ratio",
    label: "Aspect ratio",
    status: ratioOk ? "pass" : "warn",
    detail: ratioOk
      ? `Aspect ratio matches (${spec.widthMm}:${spec.heightMm}).`
      : `Aspect ratio is ${actualRatio.toFixed(3)} but expected ~${expectedRatio.toFixed(3)} (${spec.widthMm}:${spec.heightMm}). May be cropped during processing.`,
    fixable: true,
  });

  // 4. File size
  const size = buffer.byteLength;
  if (spec.maxFileSizeBytes) {
    const sizeOk = size <= spec.maxFileSizeBytes;
    checks.push({
      id: "file-size",
      label: "File size",
      status: sizeOk ? "pass" : "fail",
      detail: sizeOk
        ? `${(size / 1024).toFixed(0)} KB is within the ${(spec.maxFileSizeBytes / 1024 / 1024).toFixed(1)} MB limit.`
        : `${(size / 1024).toFixed(0)} KB exceeds the ${(spec.maxFileSizeBytes / 1024 / 1024).toFixed(1)} MB limit.`,
      fixable: false,
    });
  }

  // 5. Color mode
  const space = meta.space;
  const colorOk = space === "srgb" || space === "rgb";
  checks.push({
    id: "color-mode",
    label: "Color mode",
    status: colorOk ? "pass" : space === "grey16" || space === "b-w" ? "fail" : "warn",
    detail: colorOk
      ? `sRGB color space — correct.`
      : `Color space is ${space ?? "unknown"}. sRGB is required.`,
    fixable: false,
  });

  // 6. Effective DPI (from EXIF if available)
  const density = meta.density;
  if (density && density < spec.dpi * 0.8) {
    checks.push({
      id: "effective-dpi",
      label: "Effective DPI",
      status: "warn",
      detail: `EXIF reports ${density} DPI — below the recommended ${spec.dpi} DPI. The image may appear blurry when printed.`,
      fixable: false,
    });
  }

  return checks;
}
