import Link from "next/link";
import type { CorridorPolicy } from "@/lib/visa-policy";
import type { CorridorWaitTime } from "@/lib/wait-times/query";

/**
 * "Sources used" footer block for corridor pages.
 *
 * Surfaces — in plain text, on the page — every primary source that
 * fed the verdict, fee, and wait-time numbers shown above. This is the
 * E-E-A-T signal Google looks for on YMYL travel content, and it is
 * what AdSense reviewers expect to find when they scrutinize a YMYL
 * publisher.
 */
export function SourcesBlock({
  policy,
  waitTime,
  destination,
}: {
  policy: CorridorPolicy | null;
  waitTime: CorridorWaitTime | null;
  destination: string;
}) {
  // Don't render an empty section when nothing is sourced.
  if (!policy && !waitTime) return null;

  return (
    <section
      aria-label="Sources used on this page"
      className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/30 p-5"
    >
      <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Sources used on this page
      </h2>
      <ul className="flex flex-col gap-3 text-sm">
        {policy && (
          <li className="flex flex-col gap-0.5">
            <span className="font-medium">
              Verdict and indicative fee
            </span>
            <span className="text-muted-foreground">
              {destination}&apos;s official visa information page —{" "}
              <a
                href={policy.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400"
              >
                {hostnameOf(policy.officialUrl)}
              </a>
            </span>
          </li>
        )}
        {waitTime && (
          <li className="flex flex-col gap-0.5">
            <span className="font-medium">Processing time</span>
            <span className="text-muted-foreground">
              {waitTime.category}, median across{" "}
              {waitTime.postCount} consulate
              {waitTime.postCount === 1 ? "" : "s"} —{" "}
              <a
                href={waitTime.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400"
              >
                {hostnameOf(waitTime.sourceUrl)}
              </a>{" "}
              · fetched{" "}
              <time dateTime={waitTime.fetchedAt}>
                {new Date(waitTime.fetchedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </span>
          </li>
        )}
      </ul>
      <p className="text-xs text-muted-foreground">
        Visa rules change. Always confirm with the linked official source
        before booking or applying. See our{" "}
        <Link href="/about" className="underline hover:text-foreground">
          editorial process
        </Link>{" "}
        for how the data is reviewed.
      </p>
    </section>
  );
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
