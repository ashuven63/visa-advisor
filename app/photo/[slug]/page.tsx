import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { StructuredData } from "@/components/structured-data";
import { PhotoTool } from "@/components/photo-tool";
import { AdSlot } from "@/components/ad-slot";
import {
  PHOTO_CORRIDORS,
  getPhotoCorridorBySlug,
} from "@/lib/photo-corridors";

export const dynamicParams = false;

export function generateStaticParams() {
  return PHOTO_CORRIDORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const corridor = getPhotoCorridorBySlug(slug);
  if (!corridor) return {};

  return {
    title: corridor.title,
    description: corridor.description,
    openGraph: {
      title: corridor.title,
      description: corridor.description,
    },
    twitter: {
      title: corridor.title,
      description: corridor.description,
    },
  };
}

export default async function PhotoCorridorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const corridor = getPhotoCorridorBySlug(slug);
  if (!corridor) notFound();

  const { specs } = corridor;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What size is a ${corridor.name} photo?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `A ${corridor.name} photo must be ${corridor.dimensions}. The minimum pixel dimensions are ${specs.widthPx} x ${specs.heightPx} pixels at ${specs.dpi} DPI.`,
        },
      },
      {
        "@type": "Question",
        name: `What background is required for a ${corridor.name} photo?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The background must be ${corridor.background}. Our free tool can check your photo and auto-fix the background if needed.`,
        },
      },
      {
        "@type": "Question",
        name: `Are glasses allowed in ${corridor.name} photos?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: specs.glassesAllowed
            ? `Yes, glasses are generally allowed in ${corridor.name} photos, but there must be no glare on the lenses and your eyes must be clearly visible.`
            : `No, glasses are not allowed in ${corridor.name} photos. You must remove all eyewear including prescription glasses and sunglasses.`,
        },
      },
      {
        "@type": "Question",
        name: `Can I take my ${corridor.name} photo at home?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, you can take your ${corridor.name} photo at home with a smartphone. Use a plain ${corridor.background.toLowerCase()} background, face the camera directly, and use our free tool to check compliance and auto-fix any issues.`,
        },
      },
      {
        "@type": "Question",
        name: `How can I check if my ${corridor.name} photo is compliant?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Upload your photo to our free compliance checker above. It validates dimensions, background, face position, expression, and more — and can auto-fix most issues using AI.",
        },
      },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to take a compliant ${corridor.name} photo`,
    description: `Step-by-step guide to taking a ${corridor.name} photo that meets official requirements.`,
    step: [
      {
        "@type": "HowToStep",
        name: "Set up your background",
        text: `Use a ${corridor.background.toLowerCase()} wall or hang a white sheet. Ensure even lighting with no shadows.`,
      },
      {
        "@type": "HowToStep",
        name: "Position yourself",
        text: "Face the camera directly. Keep your head straight and centered in the frame. Your face should take up 70-80% of the photo height.",
      },
      {
        "@type": "HowToStep",
        name: "Take the photo",
        text: "Use your smartphone's front camera or have someone take it. Ensure the image is sharp and well-lit.",
      },
      {
        "@type": "HowToStep",
        name: "Check compliance",
        text: "Upload your photo to our free checker tool to verify it meets all official requirements.",
      },
      {
        "@type": "HowToStep",
        name: "Fix any issues",
        text: "If your photo fails any checks, use our AI-powered auto-fix to correct the background, dimensions, or other issues.",
      },
    ],
  };

  // Related photo corridors
  const related = PHOTO_CORRIDORS.filter(
    (c) => c.slug !== corridor.slug,
  ).slice(0, 8);

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-14">
      <StructuredData data={faqSchema} />
      <StructuredData data={howToSchema} />
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
            {corridor.name}{" "}
            <span className="text-brand-600 dark:text-brand-400">
              Photo Requirements
            </span>
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Check your {corridor.name.toLowerCase()} photo against official
            requirements. Upload below for a free instant compliance check — and
            use AI to auto-fix any issues.
          </p>
        </header>

        {/* Quick specs card */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-medium">
            Official specifications
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <SpecItem label="Dimensions" value={corridor.dimensions} />
            <SpecItem
              label="Pixels (min)"
              value={`${specs.widthPx} x ${specs.heightPx} px`}
            />
            <SpecItem label="DPI" value={String(specs.dpi)} />
            <SpecItem label="Background" value={corridor.background} />
            <SpecItem label="Format" value={specs.fileFormats} />
            <SpecItem
              label="Glasses"
              value={specs.glassesAllowed ? "Allowed" : "Not allowed"}
            />
            {specs.maxFileSize && (
              <SpecItem label="Max file size" value={specs.maxFileSize} />
            )}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Source:{" "}
            <a
              href={corridor.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-brand-700 underline-offset-2 hover:underline dark:text-brand-300"
            >
              Official government page
            </a>
          </p>
        </div>

        {/* Photo tool */}
        <PhotoTool country={corridor.countryCode} />

        <AdSlot slot="5803818608" format="horizontal" className="my-2" />

        {/* How to take the photo */}
        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-medium">
            How to take your {corridor.name.toLowerCase()} photo at home
          </h2>
          <ol className="flex flex-col gap-4">
            <HowToStep
              step={1}
              title="Set up a plain background"
              detail={`Stand in front of a ${corridor.background.toLowerCase()} wall or hang a white sheet behind you. Make sure the lighting is even — no harsh shadows on your face or the background.`}
            />
            <HowToStep
              step={2}
              title="Position yourself correctly"
              detail="Face the camera directly with a neutral expression. Keep your head straight (not tilted). Your eyes should be open and clearly visible."
            />
            {!specs.glassesAllowed && (
              <HowToStep
                step={3}
                title="Remove glasses"
                detail={`${corridor.name} photos do not allow glasses. Remove all eyewear including prescription glasses, sunglasses, and tinted lenses.`}
              />
            )}
            <HowToStep
              step={specs.glassesAllowed ? 3 : 4}
              title="Take the photo"
              detail={`Use a smartphone camera (front camera works well) or have someone take it for you. The photo should be at least ${specs.widthPx}x${specs.heightPx} pixels. Make sure the image is sharp and not blurry.`}
            />
            <HowToStep
              step={specs.glassesAllowed ? 4 : 5}
              title="Check and fix with our free tool"
              detail="Upload your photo above. We'll check dimensions, background, face position, expression, and more. If anything fails, our AI can fix it automatically."
            />
          </ol>
        </div>

        {/* Common rules */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-medium">
            {corridor.name} photo rules
          </h2>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <RuleItem text={`Photo size: ${corridor.dimensions}`} />
            <RuleItem
              text={`Minimum pixels: ${specs.widthPx} x ${specs.heightPx} px`}
            />
            <RuleItem text={`Background: ${corridor.background}`} />
            <RuleItem text="Neutral facial expression (mouth closed)" />
            <RuleItem text="Both eyes open and clearly visible" />
            <RuleItem
              text={
                specs.glassesAllowed
                  ? "Glasses allowed (no glare on lenses)"
                  : "No glasses (remove all eyewear)"
              }
            />
            <RuleItem text="No head coverings (religious exceptions may apply)" />
            <RuleItem text="Photo must be recent (taken within the last 6 months)" />
            <RuleItem text="No shadows on face or background" />
            <RuleItem text={`File format: ${specs.fileFormats}`} />
            {specs.maxFileSize && (
              <RuleItem text={`Maximum file size: ${specs.maxFileSize}`} />
            )}
          </ul>
        </div>

        {/* CTA to check visa requirements */}
        <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-800 dark:bg-brand-950">
          <h2 className="font-display text-xl font-medium">
            Need a visa too?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Check if you need a visa and get a personalized checklist of
            requirements, processing times, and documents.
          </p>
          <div className="mt-4">
            <Button asChild>
              <Link href="/">Check visa requirements</Link>
            </Button>
          </div>
        </div>

        <AdSlot slot="9668696980" format="horizontal" className="my-2" />

        {/* Related photo pages */}
        {related.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Other photo requirements
            </h3>
            <div className="flex flex-wrap gap-2">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  href={`/photo/${c.slug}`}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-brand-400 hover:text-foreground"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function HowToStep({
  step,
  title,
  detail,
}: {
  step: number;
  title: string;
  detail: string;
}) {
  return (
    <li className="flex gap-4">
      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
        {step}
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </div>
    </li>
  );
}

function RuleItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-0.5 h-2 w-2 flex-none rounded-full bg-brand-500" />
      <span>{text}</span>
    </li>
  );
}
