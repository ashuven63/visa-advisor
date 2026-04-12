import { z } from "zod";

/**
 * Shared schemas for the visa-advice pipeline.
 *
 * `VisaAdviceInput` is what the client form sends to /api/visa-advice.
 * `VisaAdviceResponse` is what the route handler returns after validation
 * against Gemini's structured output.
 */

export const VisaPurposeSchema = z.enum(["tourist", "transit"]);
export type VisaPurpose = z.infer<typeof VisaPurposeSchema>;

export const HeldVisaIdSchema = z.string();
export type HeldVisaId = z.infer<typeof HeldVisaIdSchema>;

export const VisaAdviceInputSchema = z.object({
  destination: z.string().length(2, "ISO alpha-2 code expected"),
  residence: z.string().length(2),
  passports: z.array(z.string().length(2)).min(1).max(3),
  purpose: VisaPurposeSchema,
  days: z.number().int().min(1).max(365),
  heldVisas: z.string().default(""),
});
export type VisaAdviceInput = z.infer<typeof VisaAdviceInputSchema>;

export const VerdictSchema = z.enum([
  "not_required",
  "voa",
  "eta",
  "evisa",
  "required",
]);
export type Verdict = z.infer<typeof VerdictSchema>;

export const CitationSchema = z.object({
  title: z.string().min(1),
  url: z.url(),
});
export type Citation = z.infer<typeof CitationSchema>;

export const StepSchema = z.object({
  title: z.string().min(1),
  detail: z.string().min(1),
  url: z.string().optional(),
});

export const DocumentSchema = z.object({
  name: z.string().min(1),
  note: z.string().optional(),
  required: z.boolean(),
});

export const VisaAdviceResponseSchema = z.object({
  verdict: VerdictSchema,
  oneLineReason: z.string().min(1),
  citations: z.array(CitationSchema),
  steps: z.array(StepSchema),
  documents: z.array(DocumentSchema),
  confidence: z.enum(["high", "medium", "low"]),
  caveats: z.array(z.string()),
});
export type VisaAdviceResponse = z.infer<typeof VisaAdviceResponseSchema>;

/**
 * Bucketize trip length for cache-key stability — otherwise "5 days" and
 * "6 days" are cached separately even though the answer is identical.
 */
export function bucketDays(days: number): "<=30" | "31-90" | "91-180" | ">180" {
  if (days <= 30) return "<=30";
  if (days <= 90) return "31-90";
  if (days <= 180) return "91-180";
  return ">180";
}

export function cacheKey(input: VisaAdviceInput): string {
  const passports = [...input.passports].sort().join(",");
  const held = input.heldVisas.trim().toLowerCase();
  return [
    "va:v1",
    input.destination,
    input.residence,
    passports,
    input.purpose,
    bucketDays(input.days),
    held || "-",
  ].join(":");
}
