/**
 * Simple in-memory token-bucket rate limiter. In production, swap this
 * for a Vercel KV-backed implementation for cross-instance consistency.
 *
 * Default: 20 requests per 10 minutes per IP.
 */

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();
const MAX_TOKENS = 20;
const REFILL_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

function getBucket(key: string): Bucket {
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { tokens: MAX_TOKENS, lastRefill: Date.now() };
    buckets.set(key, bucket);
    return bucket;
  }

  // Refill
  const elapsed = Date.now() - bucket.lastRefill;
  if (elapsed >= REFILL_INTERVAL_MS) {
    bucket.tokens = MAX_TOKENS;
    bucket.lastRefill = Date.now();
  }

  return bucket;
}

/**
 * Try to consume one token for the given key (usually IP).
 * Returns `{ allowed: true }` or `{ allowed: false, retryAfterMs }`.
 */
export function rateLimit(
  key: string,
): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const bucket = getBucket(key);

  if (bucket.tokens > 0) {
    bucket.tokens--;
    return { allowed: true };
  }

  const retryAfterMs = REFILL_INTERVAL_MS - (Date.now() - bucket.lastRefill);
  return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 0) };
}

/**
 * Extract a client IP from Next.js request headers.
 */
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}
