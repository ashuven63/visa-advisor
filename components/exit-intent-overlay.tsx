"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const AFFILIATE_LINKS = [
  {
    id: "safetywing",
    name: "SafetyWing",
    tagline: "Travel medical insurance from $45/mo",
    url: "https://safetywing.com/?referenceID=26510490&utm_source=26510490&utm_medium=Ambassador",
    cta: "Get covered",
  },
  {
    id: "worldnomads",
    name: "World Nomads",
    tagline: "Trip cancellation + medical for 200+ countries",
    url: "https://www.worldnomads.com/?affiliate=visa-advisor",
    cta: "Get a quote",
  },
  {
    id: "allianz",
    name: "Allianz Travel",
    tagline: "Comprehensive travel protection plans",
    url: "https://www.allianztravelinsurance.com/?utm_source=visa-advisor",
    cta: "See plans",
  },
] as const;

/**
 * Shows a non-intrusive overlay when the user appears to be leaving the
 * visa form without submitting. Uses three detection methods:
 *
 * 1. mouseout — cursor left the document (relatedTarget null, clientY <= 0)
 * 2. visibilitychange — user switched tabs or minimized
 * 3. idle timeout — user filled fields but stopped interacting for 15s
 *
 * Only triggers once per session, and only if 2+ form fields are filled.
 */
export function ExitIntentOverlay({ filledCount }: { filledCount: number }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const triggered = useRef(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = useCallback(() => {
    if (triggered.current || dismissed) return;
    triggered.current = true;
    setShow(true);
    trackEvent({ name: "exit_intent_shown", destination: "" });
  }, [dismissed]);

  // Method 1: Mouse leaves the document via top edge
  useEffect(() => {
    function handleMouseOut(e: MouseEvent) {
      if (filledCount < 2 || dismissed || triggered.current) return;
      if (e.relatedTarget !== null && e.clientY > 0) return;
      trigger();
    }
    document.addEventListener("mouseout", handleMouseOut);
    return () => document.removeEventListener("mouseout", handleMouseOut);
  }, [filledCount, dismissed, trigger]);

  // Method 2: User switches tab or minimizes window
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState !== "hidden") return;
      if (filledCount < 2 || dismissed || triggered.current) return;
      trigger();
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [filledCount, dismissed, trigger]);

  // Method 3: Idle timeout — user filled fields but stopped for 15s
  useEffect(() => {
    if (filledCount < 2 || dismissed || triggered.current) {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      return;
    }

    function resetIdle() {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        trigger();
      }, 15_000);
    }

    resetIdle();
    const events = ["mousemove", "keydown", "scroll", "touchstart"] as const;
    for (const evt of events) window.addEventListener(evt, resetIdle);
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      for (const evt of events) window.removeEventListener(evt, resetIdle);
    };
  }, [filledCount, dismissed, trigger]);

  function handleDismiss() {
    setShow(false);
    setDismissed(true);
  }

  function handleAffiliateClick(id: string) {
    trackEvent({ name: "exit_intent_affiliate_click", destination: id });
    setDismissed(true);
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismiss();
      }}
    >
      <div className="mx-4 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <h3 className="font-display text-xl font-medium">
          Before you go&hellip;
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Planning international travel? Make sure you&apos;re covered.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {AFFILIATE_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer noopener sponsored"
              onClick={() => handleAffiliateClick(link.id)}
              className={cn(
                "flex items-center justify-between rounded-xl border border-border p-4 transition-colors",
                "hover:border-brand-400 hover:bg-brand-50 dark:hover:border-brand-600 dark:hover:bg-brand-950",
              )}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{link.name}</span>
                <span className="text-xs text-muted-foreground">
                  {link.tagline}
                </span>
              </div>
              <span className="flex-none rounded-full bg-brand-500 px-3 py-1 text-xs font-medium text-white">
                {link.cta}
              </span>
            </a>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground/60">
            Affiliate links — we may earn a commission
          </p>
          <button
            onClick={handleDismiss}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
