/**
 * Product analytics events. Uses Vercel Analytics custom events when
 * available, falls back to no-op in dev.
 *
 * All events are keyed only by anonymous session ID, destination
 * country, and passport country — never by IP or user-provided text.
 */

type AnalyticsEvent =
  | { name: "visa_check_submitted"; destination: string; passport: string }
  | { name: "visa_check_completed"; destination: string; verdict: string }
  | { name: "photo_uploaded"; destination: string }
  | { name: "photo_check_passed"; destination: string }
  | { name: "photo_check_failed"; destination: string }
  | { name: "photo_fix_requested"; destination: string }
  | { name: "photo_fix_completed"; destination: string }
  | { name: "export_pdf"; destination: string }
  | { name: "export_email"; destination: string }
  | { name: "export_share_link"; destination: string }
  | { name: "exit_intent_shown"; destination: string }
  | { name: "exit_intent_affiliate_click"; destination: string };

/**
 * Track a product event. Safe to call from client code — it dynamically
 * imports the Vercel Analytics `track` function so the bundle isn't
 * bloated when analytics isn't configured.
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    // @vercel/analytics is an optional peer dep. If not installed or
    // not in a Vercel environment, this silently no-ops.
    const { track } = await import("@vercel/analytics");
    const { name, ...props } = event;
    track(name, props);
  } catch {
    // No-op in dev / when @vercel/analytics is not available.
  }
}

/**
 * Server-side cost telemetry. Logs Gemini token counts per call to an
 * in-memory structure (replaced by KV in production).
 */
interface CostEvent {
  model: string;
  inputTokens: number;
  outputTokens: number;
  timestamp: string;
}

const COST_LOG: CostEvent[] = [];

export function logCost(event: CostEvent): void {
  COST_LOG.push(event);
  // In production, write to KV set "cost_events" instead.
}

export function getCostLog(): readonly CostEvent[] {
  return COST_LOG;
}
