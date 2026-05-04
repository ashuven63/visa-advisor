import type { Metadata } from "next";
import { ThemeToggle } from "@/components/theme-toggle";
import { PUBLISHER, formatReviewDate } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "Terms of Use — VisaHint",
  description:
    "Terms governing use of the VisaHint website and the visa and photo tools provided.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "2026-05-03";

export default function TermsPage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-14">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            &larr; Home
          </a>
          <ThemeToggle />
        </div>

        <header className="flex flex-col gap-3">
          <h1 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Terms of Use
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated{" "}
            <time dateTime={LAST_UPDATED}>{formatReviewDate(LAST_UPDATED)}</time>
          </p>
        </header>

        <section className="flex flex-col gap-5 text-sm leading-relaxed text-foreground">
          <p>
            These terms govern your use of {PUBLISHER.name} (
            <a className="underline" href={PUBLISHER.url}>
              visahint.com
            </a>
            ). By using the site you agree to these terms. If you do not
            agree, do not use the site.
          </p>

          <h2 className="font-display text-lg font-medium">
            Informational only — not legal advice
          </h2>
          <p>
            Visa rules change. Wait times move. Consulate practice varies by
            location and applicant. Everything on this site is informational
            and is not a substitute for advice from a qualified immigration
            lawyer or the official consulate. Always confirm requirements with
            the relevant government source before booking travel or filing an
            application.
          </p>

          <h2 className="font-display text-lg font-medium">No warranty</h2>
          <p>
            The site is provided &quot;as is&quot; and &quot;as available&quot;
            without warranties of any kind, express or implied, including
            warranties of accuracy, completeness, fitness for a particular
            purpose, or non-infringement.
          </p>

          <h2 className="font-display text-lg font-medium">
            Limitation of liability
          </h2>
          <p>
            To the maximum extent permitted by law, {PUBLISHER.name} and its
            operators are not liable for any indirect, incidental,
            consequential, or punitive damages arising from your use of the
            site, including denied entry, denied visa, missed travel, or
            financial loss.
          </p>

          <h2 className="font-display text-lg font-medium">Acceptable use</h2>
          <p>
            You agree not to scrape, reverse engineer, abuse, or use the site
            in a way that disrupts service for others or violates law. You
            agree not to upload photos of people without their consent.
          </p>

          <h2 className="font-display text-lg font-medium">Third-party links</h2>
          <p>
            The site links to government and consulate websites and other
            third-party resources. We do not control these resources and are
            not responsible for their content.
          </p>

          <h2 className="font-display text-lg font-medium">
            Changes to these terms
          </h2>
          <p>
            We may revise these terms as the service evolves. Continued use of
            the site after a revision constitutes acceptance.
          </p>

          <h2 className="font-display text-lg font-medium">Contact</h2>
          <p>
            Questions about these terms:{" "}
            <a className="underline" href={`mailto:${PUBLISHER.contactEmail}`}>
              {PUBLISHER.contactEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
