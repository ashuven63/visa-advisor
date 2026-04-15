# Technical SEO Quick Wins

**Date:** 2026-04-14
**Status:** Approved

## Context

Site (visahint.com) launched ~1 week ago. Google has begun crawling via sitemap but no pages are indexed yet. One real Android user found the site via Google search. 23 visitors total, mostly bots + owner testing.

71 visa corridor pages and 23 photo corridor pages currently exist as isolated page groups with no cross-linking. No search engine ping automation exists.

## Goals

1. Maximize value of Google's initial crawl pass
2. Help Googlebot discover photo pages faster via internal links
3. Automate search engine notification on deploy
4. Improve click-through rate in search results with breadcrumbs

## Design

### 1. Cross-link visa corridors <-> photo pages

**Visa corridor pages** (`/visa/[slug]`):
- Add a "Photo requirements" card that links to the matching photo corridor page
- Match logic: visa corridor's `destinationCode` maps to photo corridor's `countryCode`
- Example: `/visa/india-to-usa` (destinationCode: "US") links to `/photo/us-visa-photo` (countryCode: "US")
- If multiple photo corridors match (e.g., US passport + US visa), link to the visa-specific one first

**Photo corridor pages** (`/photo/[slug]`):
- Already have a "Need a visa too?" CTA linking to home
- Add links to relevant visa corridors (all corridors where destinationCode matches this photo page's countryCode)

### 2. Automatic sitemap ping

- Add logic to the existing `/api/cron/refresh-wait-times` route to also ping:
  - `https://www.google.com/ping?sitemap=https://www.visahint.com/sitemap.xml`
  - `https://www.bing.com/ping?sitemap=https://www.visahint.com/sitemap.xml`
- Runs nightly at 3 AM UTC (existing cron schedule)
- Fire-and-forget — log result but don't fail the cron if ping fails

### 3. IndexNow for Bing/Yandex/DuckDuckGo

- Generate a random UUID as the IndexNow API key
- Place verification file at `public/<key>.txt` containing the key
- Add `POST /api/indexnow` route that submits all sitemap URLs in batch to `https://api.indexnow.org/indexnow`
- Call from the nightly cron after wait-times refresh
- No account or external API key needed — just the self-hosted key file

### 4. Breadcrumb structured data

- Add `BreadcrumbList` JSON-LD to:
  - Photo corridor pages: Home > Photo Tool > {Page Name}
  - Visa corridor pages: Home > Visa Requirements > {Page Name}
- Use the existing `StructuredData` component
- No visible UI breadcrumb needed (Google reads JSON-LD)

## Non-goals

- Content depth expansion (deferred until we see which pages Google ranks)
- Google Search Console API integration (requires OAuth, overkill for now)
- Backlink building (Phase B — referral traffic)

## Implementation order

1. Cross-link visa <-> photo pages (highest impact)
2. Breadcrumb structured data (quick, improves all pages)
3. Sitemap ping (add to existing cron)
4. IndexNow (new route + key file)
5. Commit each change separately, push, deploy
