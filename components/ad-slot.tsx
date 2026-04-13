"use client";

import { useEffect, useRef } from "react";

/**
 * Google AdSense display ad slot.
 * Requires NEXT_PUBLIC_ADSENSE_CLIENT_ID to be set (e.g. "ca-pub-1234567890").
 * Renders nothing if the env var is missing.
 */
export function AdSlot({
  slot,
  format = "auto",
  className,
}: {
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
}) {
  const adRef = useRef<HTMLModElement>(null);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {},
      );
    } catch {
      // AdSense not loaded or blocked by ad blocker — silent fail.
    }
  }, [clientId]);

  if (!clientId) return null;

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
