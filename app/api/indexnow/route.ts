import { NextResponse } from "next/server";
import { CORRIDORS } from "@/lib/corridors";
import { PHOTO_CORRIDORS } from "@/lib/photo-corridors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INDEXNOW_KEY = "a1b2c3d4e5f6a7b8";
const BASE_URL = "https://www.visahint.com";

export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
  }

  const urlList = [
    BASE_URL,
    `${BASE_URL}/photo`,
    `${BASE_URL}/results`,
    ...CORRIDORS.map((c) => `${BASE_URL}/visa/${c.slug}`),
    ...PHOTO_CORRIDORS.map((c) => `${BASE_URL}/photo/${c.slug}`),
  ];

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "www.visahint.com",
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });

    return NextResponse.json({
      submitted: urlList.length,
      status: res.status,
      ok: res.ok,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
