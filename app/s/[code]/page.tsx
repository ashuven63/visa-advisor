import Link from "next/link";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { SharedResultView } from "@/components/shared-result-view";

type Params = Promise<{ code: string }>;

export default async function SharedPage({ params }: { params: Params }) {
  const { code } = await params;

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-14">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            &larr; Check your own visa
          </Link>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
            Visa Advisor — Shared Result
          </p>
        </div>

        <DisclaimerBanner />

        <SharedResultView code={code} />
      </div>
    </main>
  );
}
