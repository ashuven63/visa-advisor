import { NextResponse } from "next/server";
import { ALL_SOURCES } from "@/lib/wait-times/registry";
import { setRecords, setLastRefresh } from "@/lib/wait-times/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // allow up to 60s for all sources

/**
 * GET /api/cron/refresh-wait-times
 *
 * Triggered nightly by Vercel Cron (see vercel.json). Also callable
 * manually in dev. Iterates every registered source and writes the
 * results to the wait-times store.
 *
 * On Vercel, protect with CRON_SECRET; in dev, allow unauthenticated.
 */
export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
  }

  const results: { id: string; country: string; count: number; error?: string }[] = [];

  for (const source of ALL_SOURCES) {
    try {
      const records = await source.fetch();
      await setRecords(source.country, records);
      await setLastRefresh(source.id);
      results.push({
        id: source.id,
        country: source.country,
        count: records.length,
      });
    } catch (err) {
      results.push({
        id: source.id,
        country: source.country,
        count: 0,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return NextResponse.json({ refreshed: results });
}
