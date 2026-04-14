import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { StructuredData } from "@/components/structured-data";
import { PhotoTool } from "@/components/photo-tool";
import { AdSlot } from "@/components/ad-slot";
import { PHOTO_CORRIDORS } from "@/lib/photo-corridors";

export const metadata: Metadata = {
  title: "Free Passport & Visa Photo Checker — AI-Powered Compliance Tool",
  description:
    "Check your passport or visa photo against official requirements for any country. Free instant compliance check with AI-powered auto-fix for background, dimensions, and more.",
  openGraph: {
    title: "Free Passport & Visa Photo Checker — AI-Powered Compliance Tool",
    description:
      "Upload your passport or visa photo for a free instant compliance check. Auto-fix background, dimensions, and more with AI.",
  },
  twitter: {
    title: "Free Passport & Visa Photo Checker",
    description:
      "Upload your passport or visa photo for a free instant compliance check. Auto-fix background, dimensions, and more with AI.",
  },
};

export default function PhotoPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I check if my passport photo meets requirements?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Upload your photo to our free compliance checker. It validates dimensions, background color, face position, expression, glasses, and more against official requirements for your destination country.",
        },
      },
      {
        "@type": "Question",
        name: "Can I fix my passport photo online for free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. After checking your photo, our AI-powered tool can automatically fix common issues like wrong background color, incorrect dimensions, shadows, and more. The fixed photo is ready to download.",
        },
      },
      {
        "@type": "Question",
        name: "What are the standard passport photo dimensions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dimensions vary by country. US and India use 2x2 inches (51x51 mm). Most other countries including the UK, EU, Australia, and Canada use 35x45 mm. China uses 33x48 mm. Use our tool to check requirements for your specific country.",
        },
      },
      {
        "@type": "Question",
        name: "Can I take a passport photo with my phone?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Modern smartphones take photos that easily exceed the minimum resolution requirements. Use a plain white or light background, face the camera directly with even lighting, and upload to our checker to verify compliance.",
        },
      },
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Visa Advisor Photo Checker",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free passport and visa photo compliance checker with AI-powered auto-fix. Check your photo against official requirements for any country.",
  };

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-14">
      <StructuredData data={faqSchema} />
      <StructuredData data={softwareSchema} />
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
              Photo Tool
            </p>
            <ThemeToggle />
          </div>
        </div>

        <header className="flex flex-col gap-4">
          <h1 className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-5xl">
            Free Passport &amp; Visa{" "}
            <span className="text-brand-600 dark:text-brand-400">
              Photo Checker
            </span>
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Upload your passport or visa photo and we&apos;ll check it against
            official requirements. If anything is wrong, our AI can fix it
            automatically — background, dimensions, and more.
          </p>
        </header>

        {/* Photo tool with generic country */}
        <PhotoTool country="US" />

        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-medium">
            What we check
          </h2>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-brand-500" />
              <span>
                <strong className="text-foreground">
                  Dimensions &amp; resolution
                </strong>{" "}
                — pixel size, aspect ratio, and DPI against official requirements
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-brand-500" />
              <span>
                <strong className="text-foreground">Background</strong> — color
                uniformity and compliance with country-specific rules
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-brand-500" />
              <span>
                <strong className="text-foreground">Face position</strong> —
                head size, centering, eye line, and head tilt
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-brand-500" />
              <span>
                <strong className="text-foreground">Expression</strong> —
                neutral expression, mouth closed, eyes open
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-brand-500" />
              <span>
                <strong className="text-foreground">Glasses &amp; accessories</strong>{" "}
                — checks if glasses are allowed and detects headwear
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-brand-500" />
              <span>
                <strong className="text-foreground">Shadows &amp; lighting</strong>{" "}
                — detects shadows on face or background
              </span>
            </li>
          </ul>
        </div>

        <AdSlot slot="5803818608" format="horizontal" className="my-2" />

        {/* Country-specific requirements */}
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-xl font-medium">
            Photo requirements by country
          </h2>
          <p className="text-sm text-muted-foreground">
            Select your destination to see specific photo requirements,
            dimensions, and rules.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PHOTO_CORRIDORS.filter((c) => c.countryCode !== "GENERIC").map(
              (c) => (
                <Link
                  key={c.slug}
                  href={`/photo/${c.slug}`}
                  className="rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:border-brand-400 hover:bg-brand-50 dark:hover:border-brand-600 dark:hover:bg-brand-950"
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {c.dimensions}
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-800 dark:bg-brand-950">
          <h2 className="font-display text-xl font-medium">
            Need a visa too?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Check if you need a visa for your destination and get a complete
            checklist — requirements, documents, processing times, and more.
          </p>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
            >
              Check visa requirements
            </Link>
          </div>
        </div>

        <AdSlot slot="9668696980" format="horizontal" className="my-2" />
      </div>
    </main>
  );
}
