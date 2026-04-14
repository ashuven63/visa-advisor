/**
 * Unified key-value cache. Uses Upstash Redis when `KV_REST_API_URL` is
 * set (production), otherwise falls back to an in-memory Map (local dev).
 *
 * All values are JSON-serialized. TTL is in seconds.
 */

import { Redis } from "@upstash/redis";

let kvClient: {
  get: <T>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown, opts?: { ex?: number }) => Promise<void>;
  del: (key: string) => Promise<void>;
} | null = null;

function getKvClient() {
  if (kvClient) return kvClient;

  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
    kvClient = {
      get: <T>(key: string) => redis.get<T>(key),
      set: (key, value, opts) =>
        opts?.ex
          ? redis.set(key, value, { ex: opts.ex }).then(() => {})
          : redis.set(key, value).then(() => {}),
      del: (key) => redis.del(key).then(() => {}),
    };
  } else {
    // In-memory fallback for local dev
    const store = new Map<string, { value: unknown; expiresAt: number }>();
    kvClient = {
      get: async <T>(key: string): Promise<T | null> => {
        const entry = store.get(key);
        if (!entry) return null;
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
          store.delete(key);
          return null;
        }
        return entry.value as T;
      },
      set: async (key: string, value: unknown, opts?: { ex?: number }) => {
        const expiresAt = opts?.ex
          ? Date.now() + opts.ex * 1000
          : Date.now() + 24 * 60 * 60 * 1000; // 24h default
        store.set(key, { value, expiresAt });
      },
      del: async (key: string) => {
        store.delete(key);
      },
    };
  }

  return kvClient;
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const client = getKvClient();
  return client.get<T>(key);
}

export async function kvSet(
  key: string,
  value: unknown,
  ttlSeconds?: number,
): Promise<void> {
  const client = getKvClient();
  await client.set(key, value, ttlSeconds ? { ex: ttlSeconds } : undefined);
}

export async function kvDel(key: string): Promise<void> {
  const client = getKvClient();
  await client.del(key);
}
