import { NextResponse } from "next/server";
import { VisaAdviceResponseSchema } from "@/lib/visa-advice/schema";
import { kvGet, kvSet } from "@/lib/kv";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SHARE_TTL = 30 * 24 * 60 * 60; // 30 days

function randomCode(): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789"; // no ambiguous 0/O/1/l
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const ShareRequestSchema = z.object({
  input: z.record(z.string(), z.unknown()),
  data: VisaAdviceResponseSchema,
});

/**
 * POST /api/export/share — create a share link.
 * Returns { code: string, url: string }.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = ShareRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 },
    );
  }

  const code = randomCode();
  await kvSet(
    `share:${code}`,
    { input: parsed.data.input, data: parsed.data.data },
    SHARE_TTL,
  );

  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    req.headers.get("origin") ??
    "http://localhost:3000";

  return NextResponse.json({ code, url: `${base}/s/${code}` });
}

/**
 * GET /api/export/share?code=xxxx — retrieve a shared result.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.json(
      { error: "Missing `code` query parameter." },
      { status: 400 },
    );
  }

  const entry = await kvGet<{ input: unknown; data: unknown }>(
    `share:${code}`,
  );
  if (!entry) {
    return NextResponse.json(
      { error: "Share link not found or expired." },
      { status: 404 },
    );
  }

  return NextResponse.json({ input: entry.input, data: entry.data });
}
