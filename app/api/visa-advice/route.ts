import { NextResponse } from "next/server";
import { getGemini, MODELS } from "@/lib/gemini";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import {
  VisaAdviceInputSchema,
  VisaAdviceResponseSchema,
  cacheKey,
  type VisaAdviceResponse,
  type Citation,
} from "@/lib/visa-advice/schema";
import { SYSTEM_INSTRUCTIONS, buildUserPrompt } from "@/lib/visa-advice/prompt";
import { filterToTrusted } from "@/lib/visa-advice/trusted-domains";

export const runtime = "nodejs";
// We call an external LLM; never cache the route itself.
export const dynamic = "force-dynamic";

/**
 * In-memory cache for local dev only. In production this is replaced with
 * Vercel KV (see lib/visa-advice/cache.ts in a later milestone). Keyed by
 * normalized input fingerprint so "5 days" and "6 days" hit the same entry.
 */
const DEV_CACHE = new Map<string, { value: VisaAdviceResponse; ts: number }>();
const DEV_CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24h

function devCacheGet(key: string): VisaAdviceResponse | null {
  const hit = DEV_CACHE.get(key);
  if (!hit) return null;
  if (Date.now() - hit.ts > DEV_CACHE_TTL_MS) {
    DEV_CACHE.delete(key);
    return null;
  }
  return hit.value;
}

function devCacheSet(key: string, value: VisaAdviceResponse): void {
  DEV_CACHE.set(key, { value, ts: Date.now() });
}

/**
 * Gemini often wraps JSON in ```json fences despite instructions. Strip them
 * before parsing. We also tolerate a leading prose line by finding the first
 * `{` and the last `}`.
 */
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const body = fenced ? fenced[1] : text;
  const first = body.indexOf("{");
  const last = body.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return body.trim();
  return body.slice(first, last + 1);
}

/**
 * Merge citations the model listed with URIs from groundingMetadata. The
 * grounding chunks are authoritative (they are the URLs Google actually
 * retrieved), so if the model hallucinated a citation that isn't also in the
 * chunks, we still get the real ones in the final list.
 */
function mergeCitations(
  modelCitations: readonly Citation[],
  groundingChunks: ReadonlyArray<{ web?: { uri?: string; title?: string } }>,
): Citation[] {
  const seen = new Set<string>();
  const out: Citation[] = [];
  for (const c of modelCitations) {
    if (!c?.url || seen.has(c.url)) continue;
    seen.add(c.url);
    out.push(c);
  }
  for (const chunk of groundingChunks) {
    const uri = chunk.web?.uri;
    if (!uri || seen.has(uri)) continue;
    seen.add(uri);
    out.push({ title: chunk.web?.title || uri, url: uri });
  }
  return out;
}

export async function POST(req: Request) {
  const rl = rateLimit(clientIp(req));
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "retry-after": String(Math.ceil(rl.retryAfterMs / 1000)),
        },
      },
    );
  }

  let rawInput: unknown;
  try {
    rawInput = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = VisaAdviceInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const input = parsed.data;

  const key = cacheKey(input);
  const cached = devCacheGet(key);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "x-visa-advice-cache": "hit" },
    });
  }

  let ai;
  try {
    ai = getGemini();
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Gemini client is not configured.",
      },
      { status: 500 },
    );
  }

  const userPrompt = buildUserPrompt(input);

  let result;
  try {
    result = await ai.models.generateContent({
      model: MODELS.reasoning,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        temperature: 0.2,
        // Grounding tool: forces retrieval from the live web via Google Search.
        // We deliberately do NOT set responseSchema here because Gemini does
        // not allow structured-output schemas alongside search grounding.
        // We validate + repair the JSON ourselves after the call.
        tools: [{ googleSearch: {} }],
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Gemini request failed",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }

  const text = result.text ?? "";
  if (!text) {
    return NextResponse.json(
      { error: "Gemini returned an empty response." },
      { status: 502 },
    );
  }

  const jsonText = extractJson(text);

  let modelObject: unknown;
  try {
    modelObject = JSON.parse(jsonText);
  } catch (err) {
    return NextResponse.json(
      {
        error: "Gemini response was not valid JSON.",
        detail: err instanceof Error ? err.message : String(err),
        raw: text.slice(0, 500),
      },
      { status: 502 },
    );
  }

  const validated = VisaAdviceResponseSchema.safeParse(modelObject);
  if (!validated.success) {
    return NextResponse.json(
      {
        error: "Gemini response failed schema validation.",
        details: validated.error.flatten(),
        raw: text.slice(0, 1000),
      },
      { status: 502 },
    );
  }

  // --- Trusted-citation enforcement (three-layer defense step 2 + 3) -------

  const groundingChunks =
    result.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

  const merged = mergeCitations(validated.data.citations, groundingChunks);
  const trusted = filterToTrusted(merged);

  // If zero trusted citations survived, demote confidence and surface a
  // caveat instead of silently shipping an unverifiable answer.
  let finalResponse: VisaAdviceResponse = {
    ...validated.data,
    citations: trusted.length > 0 ? trusted : merged,
  };

  if (trusted.length === 0) {
    finalResponse = {
      ...finalResponse,
      confidence: "low",
      caveats: [
        "We could not verify this answer against an official government source. Please confirm directly with the destination consulate before you book or apply.",
        ...finalResponse.caveats,
      ],
    };
  }

  devCacheSet(key, finalResponse);

  return NextResponse.json(finalResponse, {
    headers: { "x-visa-advice-cache": "miss" },
  });
}
