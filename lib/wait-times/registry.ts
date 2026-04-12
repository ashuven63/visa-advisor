import type { WaitTimeSource } from "./types";
import { usStateDept } from "./sources/us-state-dept";
import { ukGov } from "./sources/uk-gov";
import { canadaIrcc } from "./sources/canada-ircc";
import { australiaHomeAffairs } from "./sources/australia-homeaffairs";
import { newZealandInz } from "./sources/new-zealand-inz";

/**
 * All registered wait-time sources. Each source is a file under
 * `lib/wait-times/sources/` — adding a new country is a one-file PR
 * plus a registration line here.
 */
export const ALL_SOURCES: readonly WaitTimeSource[] = [
  usStateDept,
  ukGov,
  canadaIrcc,
  australiaHomeAffairs,
  newZealandInz,
];

export function sourcesForCountry(countryCode: string): WaitTimeSource[] {
  const upper = countryCode.toUpperCase();
  return ALL_SOURCES.filter((s) => s.country === upper);
}
