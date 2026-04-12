import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { ResultsView } from "@/components/results-view";
import { parseInputFromSearch } from "@/lib/visa-advice/parse-input";
import { PhotoTool } from "@/components/photo-tool";

// Next.js 16: searchParams is a Promise in server components.
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const input = parseInputFromSearch(raw);

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-14">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            &larr; Edit trip
          </Link>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            Visa Advisor
          </p>
        </div>

        {input ? (
          <>
            <ResultsView input={input} />
            <PhotoTool country={input.destination} />
            <DisclaimerBanner className="opacity-60 text-xs" />
          </>
        ) : (
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-8">
            <h2 className="font-display text-2xl font-medium">
              We couldn&apos;t read your trip.
            </h2>
            <p className="text-muted-foreground">
              Some details seem to be missing from the URL. Start over and we
              can check your visa in a few seconds.
            </p>
            <div>
              <Button asChild>
                <Link href="/">Back to form</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
