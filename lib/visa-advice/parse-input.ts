import { VisaAdviceInputSchema, type VisaAdviceInput } from "./schema";

/**
 * Parse raw URLSearchParams into a validated `VisaAdviceInput`. Returns null
 * if the params are missing or malformed. Safe to call from server components.
 */
export function parseInputFromSearch(
  raw: Record<string, string | string[] | undefined>,
): VisaAdviceInput | null {
  const get = (k: string): string | undefined => {
    const v = raw[k];
    if (Array.isArray(v)) return v[0];
    return v;
  };
  const passports = (get("passports") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const heldVisas = get("heldVisas") ?? "";
  const days = Number.parseInt(get("days") ?? "", 10);

  const candidate = {
    destination: get("destination"),
    residence: get("residence"),
    passports,
    purpose: get("purpose"),
    days: Number.isFinite(days) ? days : undefined,
    heldVisas,
  };

  const parsed = VisaAdviceInputSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}
