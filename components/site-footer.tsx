import Link from "next/link";
import { PUBLISHER } from "@/lib/editorial";

/**
 * Site-wide footer. Surfaces policy links (required for AdSense) and the
 * publisher identity so reviewers and users can verify ownership and
 * understand how the site uses data.
 */
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="font-display text-base font-medium text-foreground"
          >
            {PUBLISHER.name}
          </Link>
          <p className="max-w-sm leading-relaxed">
            Free visa requirements and passport-photo compliance checks, with
            citations from official government sources.
          </p>
          <p className="text-xs">
            Informational only — not legal advice. Always verify with the
            official consulate before booking or applying.
          </p>
        </div>

        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-3"
        >
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <Link href="/photo" className="hover:text-foreground">
            Photo tool
          </Link>
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {PUBLISHER.name}. All rights
            reserved.
          </p>
          <p>
            Contact:{" "}
            <a
              href={`mailto:${PUBLISHER.contactEmail}`}
              className="underline hover:text-foreground"
            >
              {PUBLISHER.contactEmail}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
