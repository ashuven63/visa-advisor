import type { Metadata } from "next";
import { ThemeToggle } from "@/components/theme-toggle";
import { PUBLISHER } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "Contact — VisaHint",
  description:
    "Get in touch with VisaHint to report an inaccuracy, ask a question, or discuss partnerships.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
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
            Contact
          </h1>
          <p className="text-lg text-muted-foreground">
            We read every email. The fastest way to reach us is direct.
          </p>
        </header>

        <section className="flex flex-col gap-6 text-sm leading-relaxed text-foreground">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-medium">Email</h2>
            <p className="mt-2">
              <a
                className="text-brand-600 hover:underline dark:text-brand-400"
                href={`mailto:${PUBLISHER.contactEmail}`}
              >
                {PUBLISHER.contactEmail}
              </a>
            </p>
            <p className="mt-3 text-muted-foreground">
              Typical reply within two business days.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-display text-lg font-medium">
              What to include
            </h2>
            <ul className="list-disc pl-5">
              <li>
                <strong>Reporting a corridor inaccuracy:</strong> the URL of
                the page, what looks wrong, and a link to the official source
                showing the correct rule. We update the same day when the
                source confirms.
              </li>
              <li>
                <strong>Photo tool issue:</strong> the country and document
                you were checking, the error you saw, and (if possible) the
                browser and device.
              </li>
              <li>
                <strong>Privacy or data request:</strong> mention &quot;privacy&quot;
                in the subject. We do not maintain user accounts, so most
                requests are handled the same day.
              </li>
              <li>
                <strong>Partnerships, press, or affiliate inquiries:</strong>{" "}
                a sentence on what you have in mind is enough to start.
              </li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            We do not provide individual visa or legal advice over email. For
            personalized advice, consult a qualified immigration lawyer or the
            relevant consulate.
          </p>
        </section>
      </div>
    </main>
  );
}
