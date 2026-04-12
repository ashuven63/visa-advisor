import { NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { fixPhoto } from "@/lib/photo/fix";
import { getPhotoSpec } from "@/lib/photo/specs";
import type { PhotoCheck } from "@/lib/photo/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 8 * 1024 * 1024;

/**
 * POST /api/photo/fix
 *
 * Accepts multipart/form-data with:
 *   - "photo" (File): the original image
 *   - "country" (string): ISO alpha-2
 *   - "failures" (string): JSON-encoded PhotoCheck[] of failing checks
 *
 * Returns the fixed image as image/jpeg.
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

  const country =
    typeof form.get("country") === "string" &&
    (form.get("country") as string).length === 2
      ? (form.get("country") as string).toUpperCase()
      : "US";

  let failures: PhotoCheck[];
  try {
    const raw = form.get("failures");
    failures = JSON.parse(typeof raw === "string" ? raw : "[]");
  } catch {
    return NextResponse.json(
      { error: '"failures" must be a JSON array of check objects.' },
      { status: 400 },
    );
  }

  if (!Array.isArray(failures) || failures.length === 0) {
    return NextResponse.json(
      { error: "No failures provided to fix." },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await photoField.arrayBuffer());
  const spec = await getPhotoSpec(country);

  const fixable = failures.filter((f) => f.fixable);
  if (fixable.length === 0) {
    return NextResponse.json(
      {
        error:
          "None of the reported failures are fixable by the photo editor. Please retake the photo.",
      },
      { status: 422 },
    );
  }

  const fixed = await fixPhoto(buffer, fixable, spec);
  if (!fixed) {
    return NextResponse.json(
      { error: "Photo editing failed. Please try again or retake the photo." },
      { status: 502 },
    );
  }

  return new Response(new Uint8Array(fixed), {
    headers: {
      "content-type": "image/jpeg",
      "content-disposition": 'attachment; filename="fixed-photo.jpg"',
    },
  });
}
