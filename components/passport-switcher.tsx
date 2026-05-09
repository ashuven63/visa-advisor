import Link from "next/link";
import { CORRIDORS, TOP_PASSPORTS, type Corridor } from "@/lib/corridors";

/**
 * Server-rendered passport switcher for corridor pages.
 *
 * Recovers the visitor who lands on /visa/germany-to-usa but actually
 * holds (e.g.) a UK passport. Without this, they'd have to bounce back
 * to the home form to get the right answer. With it, one click sends
 * them to /visa/uk-to-usa.
 *
 * Renders only links that resolve to an existing corridor — i.e. only
 * passports we've actually generated pages for. Pure server output, no
 * client JS.
 */
export function PassportSwitcher({
  currentCorridor,
  limit = 10,
}: {
  currentCorridor: Corridor;
  limit?: number;
}) {
  // Index lookup once: { passportCode: Corridor } for the current destination.
  const byPassport = new Map<string, Corridor>();
  for (const c of CORRIDORS) {
    if (
      c.destinationCode === currentCorridor.destinationCode &&
      c.passportCode !== currentCorridor.passportCode
    ) {
      byPassport.set(c.passportCode, c);
    }
  }

  // Walk TOP_PASSPORTS so the most-searched passports come first.
  const alternatives: Corridor[] = [];
  for (const code of TOP_PASSPORTS) {
    const corridor = byPassport.get(code);
    if (corridor) alternatives.push(corridor);
    if (alternatives.length >= limit) break;
  }

  if (alternatives.length === 0) return null;

  return (
    <div
      aria-label="Switch passport"
      className="flex flex-col gap-2 rounded-2xl border border-border bg-muted/40 p-4"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Holding a different passport? Switch to {currentCorridor.destination}{" "}
        from:
      </p>
      <div className="flex flex-wrap gap-2">
        {alternatives.map((c) => (
          <Link
            key={c.slug}
            href={`/visa/${c.slug}`}
            className="rounded-full border border-border bg-background px-3 py-1 text-sm transition-colors hover:border-brand-400 hover:text-foreground"
            prefetch={false}
          >
            {c.passport}
          </Link>
        ))}
      </div>
    </div>
  );
}
