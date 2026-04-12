import type { WaitTimeRecord } from "./types";

/**
 * In-memory wait-time store (replaced by Vercel KV in production).
 * Keyed by "{country}:{category}" for quick lookup.
 */
const STORE = new Map<string, WaitTimeRecord[]>();
const REFRESH_LOG = new Map<string, string>(); // sourceId → ISO timestamp

function storeKey(country: string): string {
  return country.toUpperCase();
}

export function getRecords(country: string): WaitTimeRecord[] {
  return STORE.get(storeKey(country)) ?? [];
}

export function setRecords(
  country: string,
  records: WaitTimeRecord[],
): void {
  STORE.set(storeKey(country), records);
}

export function getLastRefresh(sourceId: string): string | null {
  return REFRESH_LOG.get(sourceId) ?? null;
}

export function setLastRefresh(sourceId: string): void {
  REFRESH_LOG.set(sourceId, new Date().toISOString());
}
