import { NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { mechanicalChecks } from "@/lib/photo/mechanical";
import { faceChecks } from "@/lib/photo/face";
import { llmJudgment } from "@/lib/photo/judgment";
import { getPhotoSpec } from "@/lib/photo/specs";
import type { PhotoReport, PhotoCheck } from "@/lib/photo/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

/**
 * POST /api/photo/check
 *
 * Accepts multipart/form-data with:
 *   - "photo" (File): the uploaded image
 *   - "country" (string): ISO alpha-2 of the destination country
 *
 * Returns a PhotoReport JSON.
 */
export async function POST(req: Request) {
  const rl = rateLimit(clientIp(req));
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "retry-after": String(Math.ceil(rl.retryAfterMs / 1000)) } },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data." },
      { status: 400 },
    );
  }

  const photoField = form.get("photo");
  if (!photoField || !(photoField instanceof Blob)) {
    return NextResponse.json(
      { error: 'Missing "photo" file field.' },
      { status: 400 },
    );
  }
  if (photoField.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `File too large. Maximum is ${MAX_SIZE / 1024 / 1024} MB.` },
      { status: 400 },
    );
  }

  const countryRaw = form.get("country");
  const country =
    typeof countryRaw === "string" && countryRaw.length === 2
      ? countryRaw.toUpperCase()
      : "US";

  const buffer = Buffer.from(await photoField.arrayBuffer());
  const spec = await getPhotoSpec(country);

  // Run mechanical checks first — they're fast and free.
  const mechanical = await mechanicalChecks(buffer, spec);

  // If any mechanical check fails hard (file type, dimensions, color mode),
  // skip the expensive Gemini LLM call entirely. The user needs to fix the
  // basics first — no point paying for vision on a 100x100 BMP.
  const hasHardMechanicalFail = mechanical.some(
    (c) => c.status === "fail" && ["file-type", "pixel-dimensions", "color-mode", "file-size"].includes(c.id),
  );

  if (hasHardMechanicalFail) {
    const report: PhotoReport = {
      overall: "fail",
      mechanicalOnly: true,
      checks: mechanical,
      spec,
    };
    return NextResponse.json(report);
  }

  // Mechanical checks passed or only have soft warnings — run LLM judgment.
  const [face, llm] = await Promise.all([
    faceChecks(buffer, spec),
    llmJudgment(buffer, spec).catch((): PhotoCheck[] => []),
  ]);

  const allChecks: PhotoCheck[] = [...mechanical, ...face, ...llm];
  const hasFail = allChecks.some((c) => c.status === "fail");

  const report: PhotoReport = {
    overall: hasFail ? "fail" : "pass",
    checks: allChecks,
    spec,
  };

  return NextResponse.json(report);
}
