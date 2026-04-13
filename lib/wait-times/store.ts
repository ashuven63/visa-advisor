import { kvGet, kvSet } from "@/lib/kv";
import type { WaitTimeRecord } from "./types";

const WAIT_TTL = 24 * 60 * 60; // 24 hours

function storeKey(country: string): string {
  return `wait:${country.toUpperCase()}`;
}

export async function getRecords(country: string): Promise<WaitTimeRecord[]> {
  return (await kvGet<WaitTimeRecord[]>(storeKey(country))) ?? [];
}

export async function setRecords(
  country: string,
  records: WaitTimeRecord[],
): Promise<void> {
  await kvSet(storeKey(country), records, WAIT_TTL);
}

export async function getLastRefresh(sourceId: string): Promise<string | null> {
  return kvGet<string>(`wait-refresh:${sourceId}`);
}

export async function setLastRefresh(sourceId: string): Promise<void> {
  await kvSet(`wait-refresh:${sourceId}`, new Date().toISOString(), WAIT_TTL);
}
