"use client";

import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import {
  affiliatesFor,
  type AffiliateCategory,
  type AffiliatePartner,
} from "@/lib/affiliate";
import type { Verdict } from "@/lib/visa-advice/schema";

/**
 * Inline affiliate placement for the results page.
 *
 * Renders up to two sections — "Get help applying" (visa-service
 * affiliates, verdict-gated) and "Travel essentials" (insurance,
 * always relevant). Sections are omitted entirely when no relevant
 * partners exist (e.g. for visa-free verdicts the visa-service
 * section is skipped so we don't push iVisa to someone who needs no
 * visa).
 *
 * Each card fires an `affiliate_click` analytics event with the
 * partner id, placement, and destination country code so we can
 * measure conversion by corridor and partner.
 *
 * FTC: a "We may earn a commission" disclosure renders at the
 * bottom of the block whenever any affiliate links are rendered.
 */
export function AffiliateBlock({
  verdict,
  destination,
  placement = "results",
}: {
  verdict: Verdict;
  /** ISO destination code, used for click attribution. */
  destination: string;
  /** Where this block is rendered — included on click events. */
  placement?: string;
}) {
  const visaServices = affiliatesFor({
    category: "visa-service",
    verdict,
    limit: 2,
  });
  const insurance = affiliatesFor({ category: "insurance", limit: 2 });

  // Skip the block entirely if nothing's relevant — never render an
  // empty section just to take up vertical space.
  if (visaServices.length === 0 && insurance.length === 0) return null;

  function handleClick(partner: AffiliatePartner) {
    void trackEvent({
      name: "affiliate_click",
      partner: partner.id,
      placement,
      destination,
    });
  }

  return (
    <section
      aria-label="Recommended services"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5"
    >
      {visaServices.length > 0 && (
        <AffiliateSection
          title="Get help applying"
          subtitle="If you'd rather have a service handle the paperwork:"
          partners={visaServices}
          onClick={handleClick}
        />
      )}
      {insurance.length > 0 && (
        <AffiliateSection
          title="Travel essentials"
          subtitle="Most consulates recommend travel medical insurance, especially for Schengen visas which require €30,000+ coverage."
          partners={insurance}
          onClick={handleClick}
        />
      )}
      <p className="text-[10px] text-muted-foreground/70">
        Affiliate links — we may earn a commission if you sign up. The
        verdict and citations above are independent of this revenue.
      </p>
    </section>
  );
}

function AffiliateSection({
  title,
  subtitle,
  partners,
  onClick,
}: {
  title: string;
  subtitle: string;
  partners: AffiliatePartner[];
  onClick: (partner: AffiliatePartner) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {partners.map((p) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noreferrer noopener sponsored"
            onClick={() => onClick(p)}
            className={cn(
              "flex items-center justify-between gap-3 rounded-xl border border-border p-3 transition-colors",
              "hover:border-brand-400 hover:bg-brand-50",
            )}
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-sm font-medium">{p.name}</span>
              <span className="line-clamp-2 text-xs text-muted-foreground">
                {p.tagline}
              </span>
            </div>
            <span className="flex-none rounded-full bg-brand-500 px-3 py-1 text-xs font-medium text-white">
              {p.cta}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

// Suppress an "unused export" lint warning while satisfying the type
// system in components that import the category type for filtering.
export type { AffiliateCategory };
