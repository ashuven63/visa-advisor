import Link from "next/link";
import { CORRIDORS, type Corridor } from "@/lib/corridors";
import {
  getCorridorPolicy,
  verdictLabel,
  verdictTone,
} from "@/lib/visa-policy";

/**
 * Popular corridors grid on the homepage.
 *
 * Internal-link gravity for the highest-volume slugs. Every visitor
 * arriving on / becomes a Google crawl seed for a dozen corridor URLs,
 * which compounds with the sitemap submission to accelerate
 * indexation. Server-rendered, no client JS — the cards are pure
 * <Link>s with policy data baked in at build time.
 *
 * Picks: hand-curated by passport×destination search volume. Only
 * corridors that exist in CORRIDORS render — if the registry shrinks
 * later, missing slugs are silently filtered out.
 */
const POPULAR_SLUGS = [
  "india-to-usa",
  "india-to-uk",
  "india-to-canada",
  "india-to-australia",
  "philippines-to-usa",
  "pakistan-to-usa",
  "nigeria-to-uk",
  "china-to-usa",
  "mexico-to-usa",
  "brazil-to-usa",
  "vietnam-to-usa",
  "uk-to-usa",
] as const;

const TONE_STYLES = {
  ok: {
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  warn: {
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  stop: {
    badge: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
  },
} as const;

export function PopularCorridors() {
  const corridorBySlug = new Map<string, Corridor>(
    CORRIDORS.map((c) => [c.slug, c]),
  );

  const cards = POPULAR_SLUGS.map((slug) => corridorBySlug.get(slug)).filter(
    (c): c is Corridor => c !== undefined,
  );

  if (cards.length === 0) return null;

  return (
    <section
      aria-label="Popular visa corridors"
      className="flex flex-col gap-4"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-medium">
            Popular visa corridors
          </h2>
          <p className="text-sm text-muted-foreground">
            The highest-volume passport-to-destination pairs, with the
            current verdict.
          </p>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map((c) => {
          const policy = getCorridorPolicy(c.passportCode, c.destinationCode);
          const tone = policy ? verdictTone(policy.verdict) : null;
          const styles = tone ? TONE_STYLES[tone] : null;
          return (
            <li key={c.slug}>
              <Link
                href={`/visa/${c.slug}`}
                className="group flex h-full flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand-400"
              >
                <div className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <span>{c.passportCode}</span>
                  <span className="text-brand-500">&rarr;</span>
                  <span>{c.destinationCode}</span>
                </div>
                <div className="text-sm font-medium leading-snug text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400">
                  {c.passport} <span className="text-muted-foreground">to</span>{" "}
                  {c.destination}
                </div>
                {policy && styles && (
                  <span
                    className={`mt-auto inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${styles.badge}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                    {verdictLabel(policy.verdict)}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
