import { NextResponse } from "next/server";
import { getRecords } from "@/lib/wait-times/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/wait-times?country=US
 *
 * Returns cached wait-time records for a destination country. Populated
 * by the nightly cron or manually via /api/cron/refresh-wait-times.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get("country")?.toUpperCase();

  if (!country || country.length !== 2) {
    return NextResponse.json(
      { error: "Query parameter `country` must be a 2-letter ISO code." },
      { status: 400 },
    );
  }

  const records = await getRecords(country);
  return NextResponse.json({ country, records });
}
