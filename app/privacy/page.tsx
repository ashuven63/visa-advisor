import type { Metadata } from "next";
import { ThemeToggle } from "@/components/theme-toggle";
import { PUBLISHER, formatReviewDate } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "Privacy Policy — VisaHint",
  description:
    "How VisaHint handles your data: photo uploads, share links, advertising cookies, and analytics.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "2026-05-03";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated{" "}
            <time dateTime={LAST_UPDATED}>{formatReviewDate(LAST_UPDATED)}</time>
          </p>
        </header>

        <section className="prose prose-sm dark:prose-invert max-w-none flex flex-col gap-5 text-sm leading-relaxed text-foreground">
          <p>
            {PUBLISHER.name} (&quot;we&quot;, &quot;us&quot;) operates{" "}
            <a href={PUBLISHER.url}>visahint.com</a>. This page explains what
            data we collect, why, and how to contact us about it.
          </p>

          <h2 className="font-display text-lg font-medium">
            What you submit to the site
          </h2>
          <ul className="list-disc pl-5">
            <li>
              <strong>Trip details</strong> (passport, destination, purpose,
              days, held visas) entered into the visa form. These are sent to
              our visa-advice service to generate your result and are not
              persisted to a database.
            </li>
            <li>
              <strong>Photos</strong> uploaded to the photo compliance tool.
              Photos are processed in-memory to compute the compliance check
              and any AI auto-fix, then discarded — they are not stored on our
              servers and are not used to train any model.
            </li>
            <li>
              <strong>Email addresses</strong> entered to share results by
              email. We use the address only to send the requested message via
              our transactional email provider; we do not retain it for
              marketing.
            </li>
          </ul>

          <h2 className="font-display text-lg font-medium">
            Cookies and advertising
          </h2>
          <p>
            We use Google AdSense to display ads. Google and its partners use
            cookies (including the DoubleClick DART cookie) to serve ads based
            on a user&apos;s prior visits to this and other websites.
          </p>
          <p>
            You can opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>{" "}
            or, for participating networks, the{" "}
            <a
              href="https://optout.aboutads.info/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Digital Advertising Alliance opt-out page
            </a>
            . For more information about how Google uses data when you visit
            partner sites, see{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google&apos;s policies
            </a>
            .
          </p>

          <h2 className="font-display text-lg font-medium">Analytics</h2>
          <p>
            We use Vercel Analytics to measure aggregate traffic patterns
            (page views, referrers, country, device class). Vercel Analytics
            does not use cookies and does not track individual visitors across
            sites.
          </p>

          <h2 className="font-display text-lg font-medium">
            Third-party services we rely on
          </h2>
          <ul className="list-disc pl-5">
            <li>
              <strong>Google AdSense</strong> — display advertising.
            </li>
            <li>
              <strong>Vercel</strong> — hosting, edge delivery, and
              cookie-less analytics.
            </li>
            <li>
              <strong>Upstash Redis</strong> — short-lived caching of public
              data (visa wait times, share links). No personal data is stored.
            </li>
            <li>
              <strong>Resend</strong> — transactional email delivery for the
              share-by-email feature.
            </li>
            <li>
              <strong>Google Gemini API</strong> — generates visa-requirement
              summaries and (optionally) photo auto-fix output. Inputs are
              sent under Google&apos;s API terms; we do not use them for
              model training.
            </li>
          </ul>

          <h2 className="font-display text-lg font-medium">
            Children&apos;s privacy
          </h2>
          <p>
            The site is not directed to children under 13 and we do not
            knowingly collect personal information from children. If you
            believe a child has provided us with personal data, contact us and
            we will delete it.
          </p>

          <h2 className="font-display text-lg font-medium">Your rights</h2>
          <p>
            We do not maintain user accounts or persistent personal records,
            so there is generally nothing to access, correct, or delete. If
            you have a specific request — including a request under the GDPR,
            CCPA, or similar laws — email us and we will respond.
          </p>

          <h2 className="font-display text-lg font-medium">
            Changes to this policy
          </h2>
          <p>
            We may update this policy as the service evolves. The
            &quot;last updated&quot; date at the top reflects the most recent
            change.
          </p>

          <h2 className="font-display text-lg font-medium">Contact</h2>
          <p>
            Questions, requests, or corrections:{" "}
            <a href={`mailto:${PUBLISHER.contactEmail}`}>
              {PUBLISHER.contactEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
