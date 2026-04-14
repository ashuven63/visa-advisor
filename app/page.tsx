import Link from "next/link";
import { VisaForm } from "@/components/visa-form";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdSlot } from "@/components/ad-slot";
import {
  StructuredData,
  HOME_FAQ_SCHEMA,
  WEB_APP_SCHEMA,
} from "@/components/structured-data";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-16">
      <StructuredData data={HOME_FAQ_SCHEMA} />
      <StructuredData data={WEB_APP_SCHEMA} />
      <div className="w-full max-w-3xl flex flex-col gap-10">
        <header className="flex flex-col gap-4 text-center sm:text-left">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
              Visa Advisor
            </p>
            <ThemeToggle />
          </div>
          <h1 className="font-display text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
            Do you need a <span className="text-brand-600 dark:text-brand-400">visa</span> for your next trip?
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Answer in seconds, with citations from official government sources.
            Built for real itineraries: transit layovers, held visas, dual
            citizenship — the stuff other visa tools get wrong.
          </p>
        </header>

        <VisaForm />

        <AdSlot slot="3294860321" format="horizontal" className="my-2" />

        {/* Photo tool CTA */}
        <div className="rounded-2xl border border-border bg-card p-6 text-center sm:text-left">
          <h2 className="font-display text-xl font-medium">
            Need a compliant passport photo?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload your photo for a free instant check against official
            requirements — and auto-fix any issues with AI.
          </p>
          <div className="mt-4">
            <Link
              href="/photo"
              className="inline-flex items-center rounded-full bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              Check your photo free &rarr;
            </Link>
          </div>
        </div>

        <DisclaimerBanner className="opacity-60 text-xs" />
      </div>
    </main>
  );
}
