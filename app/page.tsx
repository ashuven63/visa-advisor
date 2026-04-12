import { VisaForm } from "@/components/visa-form";
import { DisclaimerBanner } from "@/components/disclaimer-banner";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-3xl flex flex-col gap-10">
        <header className="flex flex-col gap-4 text-center sm:text-left">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            Visa Advisor
          </p>
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

        <DisclaimerBanner className="opacity-60 text-xs" />
      </div>
    </main>
  );
}
