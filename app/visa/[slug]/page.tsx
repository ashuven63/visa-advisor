import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { StructuredData } from "@/components/structured-data";
import { CORRIDORS, getCorridorBySlug } from "@/lib/corridors";
import { getBestPhotoCorridorForDestination } from "@/lib/photo-corridors";
import { AdSlot } from "@/components/ad-slot";
import {
  getCorridorWaitTime,
  formatWaitLabel,
} from "@/lib/wait-times/query";
import {
  VISA_CORRIDORS_REVIEWED_AT,
  EDITORIAL_AUTHOR,
  formatReviewDate,
} from "@/lib/editorial";

export const dynamicParams = false;
// Regenerate at most hourly so wait-time data refreshes after the nightly cron.
export const revalidate = 3600;

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

  const photoCorridor = getBestPhotoCorridorForDestination(corridor.destinationCode);
  const waitTime = await getCorridorWaitTime(corridor.destinationCode, "tourist");

  const faqEntries: { q: string; a: string }[] = [
    {
      q: `Do ${corridor.passport} citizens need a visa for ${corridor.destination}?`,
      a: `Use Visa Advisor to check the latest visa requirements for ${corridor.passport} passport holders traveling to ${corridor.destination}. Results include official citations, required documents, and processing times.`,
    },
    {
      q: `What documents do I need to travel from ${corridor.passport} to ${corridor.destination}?`,
      a: `Document requirements vary by trip purpose and duration. Visa Advisor provides a personalized checklist based on your specific travel details, with links to official sources.`,
    },
    {
      q: `What are the ${corridor.destination} visa photo requirements for ${corridor.passport} applicants?`,
      a: `Visa Advisor includes a free photo compliance checker that validates your photo against ${corridor.destination}'s official requirements and can auto-fix issues like background color and dimensions.`,
    },
  ];

  if (waitTime) {
    faqEntries.unshift({
      q: `How long does a ${corridor.destination} visa take for ${corridor.passport} applicants?`,
      a: `Current median processing time for ${waitTime.category.toLowerCase()} applicants is about ${formatWaitLabel(waitTime)} (${waitTime.medianDays} days), based on official data${waitTime.postCount > 1 ? ` across ${waitTime.postCount} consulates` : ""} last updated ${new Date(waitTime.fetchedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}.`,
    });
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntries.map((e) => ({
      "@type": "Question",
      name: e.q,
      acceptedAnswer: { "@type": "Answer", text: e.a },
    })),
  };

  const pageUrl = `https://www.visahint.com/visa/${corridor.slug}`;
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${corridor.passport} passport to ${corridor.destination} — Visa requirements`,
    url: pageUrl,
    dateModified: waitTime
      ? waitTime.fetchedAt
      : `${VISA_CORRIDORS_REVIEWED_AT}T00:00:00Z`,
    lastReviewed: `${VISA_CORRIDORS_REVIEWED_AT}T00:00:00Z`,
    author: {
      "@type": "Organization",
      name: EDITORIAL_AUTHOR.name,
      url: EDITORIAL_AUTHOR.url,
    },
    publisher: {
      "@type": "Organization",
      name: "VisaHint",
      url: "https://www.visahint.com",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.visahint.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Visa Requirements",
        item: "https://www.visahint.com",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${corridor.passport} to ${corridor.destination}`,
        item: `https://www.visahint.com/visa/${corridor.slug}`,
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

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-14">
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={pageSchema} />
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
          <p className="text-xs text-muted-foreground">
            Last reviewed{" "}
            <time dateTime={VISA_CORRIDORS_REVIEWED_AT}>
              {formatReviewDate(VISA_CORRIDORS_REVIEWED_AT)}
            </time>{" "}
            by{" "}
            <a
              href={EDITORIAL_AUTHOR.url}
              className="underline hover:text-foreground"
            >
              {EDITORIAL_AUTHOR.name}
            </a>
            .
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

        {waitTime && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-medium">
                  Current {corridor.destination} visa wait time
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Typical processing for {waitTime.category.toLowerCase()}{" "}
                  applicants
                  {waitTime.postCount > 1
                    ? ` across ${waitTime.postCount} consulates`
                    : ""}
                  .
                </p>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-medium text-brand-600 dark:text-brand-400">
                  {formatWaitLabel(waitTime)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  median {waitTime.medianDays} days
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span>
                Updated{" "}
                <time dateTime={waitTime.fetchedAt}>
                  {new Date(waitTime.fetchedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </span>
              <a
                href={waitTime.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline dark:text-brand-400"
              >
                Official source &rarr;
              </a>
            </div>
          </div>
        )}

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
