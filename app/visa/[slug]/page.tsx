import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { StructuredData } from "@/components/structured-data";
import { CORRIDORS, getCorridorBySlug } from "@/lib/corridors";
import { getBestPhotoCorridorForDestination } from "@/lib/photo-corridors";
import { AdSlot } from "@/components/ad-slot";

export const dynamicParams = false;

export function generateStaticParams() {
  return CORRIDORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const corridor = getCorridorBySlug(slug);
  if (!corridor) return {};

  const title = `${corridor.passport} passport to ${corridor.destination} — Visa requirements`;
  const description = `Do ${corridor.passport} citizens need a visa for ${corridor.destination}? Check requirements, documents, processing times, and photo specs — with official citations.`;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function CorridorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const corridor = getCorridorBySlug(slug);
  if (!corridor) notFound();

  const checkUrl = `/results?destination=${corridor.destinationCode}&passport=${corridor.passportCode}&residence=${corridor.passportCode}&purpose=tourist&days=14&heldVisas=`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Do ${corridor.passport} citizens need a visa for ${corridor.destination}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Use Visa Advisor to check the latest visa requirements for ${corridor.passport} passport holders traveling to ${corridor.destination}. Results include official citations, required documents, and processing times.`,
        },
      },
      {
        "@type": "Question",
        name: `What documents do I need to travel from ${corridor.passport} to ${corridor.destination}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Document requirements vary by trip purpose and duration. Visa Advisor provides a personalized checklist based on your specific travel details, with links to official sources.`,
        },
      },
      {
        "@type": "Question",
        name: `What are the ${corridor.destination} visa photo requirements for ${corridor.passport} applicants?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Visa Advisor includes a free photo compliance checker that validates your photo against ${corridor.destination}'s official requirements and can auto-fix issues like background color and dimensions.`,
        },
      },
    ],
  };

  // Find related corridors (same passport or same destination)
  const relatedByPassport = CORRIDORS.filter(
    (c) => c.passportCode === corridor.passportCode && c.slug !== corridor.slug,
  ).slice(0, 5);
  const relatedByDestination = CORRIDORS.filter(
    (c) =>
      c.destinationCode === corridor.destinationCode &&
      c.slug !== corridor.slug,
  ).slice(0, 5);

  const photoCorridor = getBestPhotoCorridorForDestination(corridor.destinationCode);

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-14">
      <StructuredData data={faqSchema} />
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            &larr; Home
          </Link>
          <div className="flex items-center gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
              Visa Advisor
            </p>
            <ThemeToggle />
          </div>
        </div>

        <header className="flex flex-col gap-4">
          <h1 className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-5xl">
            {corridor.passport} passport to{" "}
            <span className="text-brand-600 dark:text-brand-400">
              {corridor.destination}
            </span>
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Do {corridor.passport} citizens need a visa for{" "}
            {corridor.destination}? Check the latest requirements with official
            citations, get a personalized document checklist, and verify your
            visa photo — all free.
          </p>
        </header>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-medium">
            Check your requirements now
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Get a personalized visa assessment based on your trip details,
            including any held visas that might exempt you.
          </p>
          <div className="mt-4 flex gap-3">
            <Button asChild>
              <Link href={checkUrl}>
                Check {corridor.passport} → {corridor.destination}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Customize trip details</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-medium">
            What you&apos;ll get
          </h2>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-brand-500" />
              <span>
                <strong className="text-foreground">Instant verdict</strong> —
                visa required, visa-free, eTA, or visa-on-arrival
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-brand-500" />
              <span>
                <strong className="text-foreground">Official citations</strong>{" "}
                — linked to government and consulate sources
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-brand-500" />
              <span>
                <strong className="text-foreground">Step-by-step guide</strong>{" "}
                — application steps tailored to your trip
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-brand-500" />
              <span>
                <strong className="text-foreground">Document checklist</strong>{" "}
                — required vs. optional, with notes
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-brand-500" />
              <span>
                <strong className="text-foreground">Photo tool</strong> — check
                and fix your visa photo for free
              </span>
            </li>
          </ul>
        </div>

        {photoCorridor && (
          <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-800 dark:bg-brand-950">
            <h2 className="font-display text-xl font-medium">
              {corridor.destination} photo requirements
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {corridor.destination} requires a {photoCorridor.dimensions} photo
              with {photoCorridor.background.toLowerCase()} background.
              Check your photo for free and auto-fix any issues with AI.
            </p>
            <div className="mt-4 flex gap-3">
              <Button asChild>
                <Link href={`/photo/${photoCorridor.slug}`}>
                  Check photo requirements
                </Link>
              </Button>
            </div>
          </div>
        )}

        <AdSlot slot="5803818608" format="horizontal" className="my-2" />

        {/* Related corridors for internal linking */}
        {relatedByPassport.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Other destinations for {corridor.passport} passport
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedByPassport.map((c) => (
                <Link
                  key={c.slug}
                  href={`/visa/${c.slug}`}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-brand-400 hover:text-foreground"
                >
                  {c.destination}
                </Link>
              ))}
            </div>
          </div>
        )}

        {relatedByDestination.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Other passports for {corridor.destination}
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedByDestination.map((c) => (
                <Link
                  key={c.slug}
                  href={`/visa/${c.slug}`}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-brand-400 hover:text-foreground"
                >
                  {c.passport}
                </Link>
              ))}
            </div>
          </div>
        )}
        <AdSlot slot="9668696980" format="horizontal" className="my-2" />
      </div>
    </main>
  );
}
