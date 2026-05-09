import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { PUBLISHER } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "About VisaHint — editorial process and sources",
  description:
    "Who runs VisaHint, how visa requirements are sourced, and how the photo compliance tool works.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
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
            About {PUBLISHER.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            Free, citation-backed visa requirements and photo compliance — for
            real itineraries, not the textbook ones.
          </p>
        </header>

        <section className="flex flex-col gap-5 text-sm leading-relaxed text-foreground">
          <h2 className="font-display text-lg font-medium">Why this exists</h2>
          <p>
            Most visa-requirement tools answer a generic question (does
            passport X need a visa for country Y?) and stop there. Real travel
            is messier: layovers and transit visas, dual citizenship, held
            visas that grant exemptions (a US B1/B2 lets some passports skip
            the Mexican visa), short-stay rules that change the answer at 30
            days vs. 90. {PUBLISHER.name} was built to handle those edge
            cases first, with citations to official sources for every claim.
          </p>

          <h2 className="font-display text-lg font-medium">
            How requirements are sourced
          </h2>
          <ul className="list-disc pl-5">
            <li>
              For each query, we generate a structured response that links to
              the relevant government or consulate source. We do not
              paraphrase rules without a citation.
            </li>
            <li>
              For corridor pages we also surface{" "}
              <strong>live processing wait times</strong> from primary
              government feeds — currently the US State Department, UK
              Government, IRCC (Canada), Australian Home Affairs, and
              Immigration New Zealand. The data is refreshed nightly.
            </li>
            <li>
              The corridor content is reviewed periodically against the
              official sources. The visible &quot;Last reviewed&quot; date on
              each page is the date of that review.
            </li>
          </ul>

          <h2 className="font-display text-lg font-medium">
            Sources we monitor
          </h2>
          <p>
            Every fact we surface ties back to a primary government source.
            The links below open in a new tab and are also cited on each
            corridor page where the data appears.
          </p>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Live processing wait-time feeds
            </h3>
            <ul className="list-disc pl-5">
              <li>
                <a
                  className="underline"
                  href="https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/global-visa-wait-times.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  US Department of State — global visa wait times
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="https://www.gov.uk/visa-processing-times"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  UK Government — visa processing times
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Immigration, Refugees and Citizenship Canada (IRCC)
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Australian Department of Home Affairs
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="https://www.immigration.govt.nz/about-us/our-strategies-and-projects/processing-times"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Immigration New Zealand
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Visa-policy authorities (verdicts and fees)
            </h3>
            <p className="text-muted-foreground">
              Each corridor page links directly to the destination&apos;s
              official visa-information page in the &quot;Sources used&quot;
              footer. Examples we monitor regularly include{" "}
              <a
                className="underline"
                href="https://travel.state.gov/content/travel/en/us-visas.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                travel.state.gov
              </a>
              ,{" "}
              <a
                className="underline"
                href="https://www.gov.uk/check-uk-visa"
                target="_blank"
                rel="noopener noreferrer"
              >
                gov.uk
              </a>
              ,{" "}
              <a
                className="underline"
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                canada.ca
              </a>
              ,{" "}
              <a
                className="underline"
                href="https://immi.homeaffairs.gov.au/visas/getting-a-visa"
                target="_blank"
                rel="noopener noreferrer"
              >
                immi.homeaffairs.gov.au
              </a>
              , and the consulate or embassy site for each destination we
              cover. Where a destination publishes an official photo standard
              we cite that document on the corresponding photo page.
            </p>
          </div>

          <h2 className="font-display text-lg font-medium">
            How the photo tool works
          </h2>
          <ul className="list-disc pl-5">
            <li>
              Photos are processed in-memory: face detection, dimension and
              background checks, then optional AI auto-fix. The image is not
              saved to disk and not used to train any model.
            </li>
            <li>
              The compliance specs (size in mm, pixel resolution, background
              color, glasses rules, etc.) come from the issuing
              government&apos;s published photo standard for that document.
              The source URL is shown on each photo corridor page.
            </li>
          </ul>

          <h2 className="font-display text-lg font-medium">
            Editorial independence
          </h2>
          <p>
            The site is supported by display advertising and (planned)
            affiliate links to third-party visa services. Ad and affiliate
            revenue does not influence which requirements we surface or how we
            describe them. Citations to official sources are the
            ground-truth — readers can always click through and verify.
          </p>

          <h2 className="font-display text-lg font-medium">Corrections</h2>
          <p>
            If you spot something wrong — a stale fee, a missing exemption, a
            broken consulate link — please tell us. Corrections happen on the
            same day when the underlying source confirms the issue. Email{" "}
            <a className="underline" href={`mailto:${PUBLISHER.contactEmail}`}>
              {PUBLISHER.contactEmail}
            </a>{" "}
            or use the{" "}
            <Link className="underline" href="/contact">
              contact page
            </Link>
            .
          </p>

          <h2 className="font-display text-lg font-medium">Operator</h2>
          <p>
            {PUBLISHER.name} is an independent project. For business
            inquiries, partnerships, or press, reach us at{" "}
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
