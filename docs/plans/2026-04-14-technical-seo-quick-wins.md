# Technical SEO Quick Wins — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve Google crawling, cross-discoverability, and search result CTR for visahint.com's 71 visa + 23 photo pages.

**Architecture:** Add internal cross-links between visa/photo page groups, breadcrumb JSON-LD to all corridor pages, sitemap ping to existing cron, and IndexNow batch submission for Bing/Yandex.

**Tech Stack:** Next.js 16 App Router, static generation (generateStaticParams), JSON-LD structured data, Vercel cron.

---

### Task 1: Add helper to find photo corridors by country code

**Files:**
- Modify: `lib/photo-corridors.ts`

**Step 1: Add lookup function**

Add this function after the existing `getPhotoCorridorBySlug`:

```typescript
/** Find all photo corridors matching a country code (e.g. "US" returns US Passport + US Visa). */
export function getPhotoCorridorsByCountry(countryCode: string): PhotoCorridor[] {
  return PHOTO_CORRIDORS.filter(
    (c) => c.countryCode === countryCode || c.countryCode === "GENERIC",
  ).filter((c) => c.countryCode !== "GENERIC"); // exclude generic from country matches
}

/** Find the best photo corridor for a visa destination (prefer visa-specific over passport). */
export function getBestPhotoCorridorForDestination(destinationCode: string): PhotoCorridor | undefined {
  const matches = PHOTO_CORRIDORS.filter((c) => c.countryCode === destinationCode);
  // Prefer visa-specific page over passport page
  return matches.find((c) => c.slug.includes("visa")) ?? matches[0];
}
```

**Step 2: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add lib/photo-corridors.ts
git commit -m "Add photo corridor lookup helpers for cross-linking"
git push
```

---

### Task 2: Cross-link visa corridor pages → photo pages

**Files:**
- Modify: `app/visa/[slug]/page.tsx`

**Step 1: Add import**

Add to imports at top of file:

```typescript
import { getBestPhotoCorridorForDestination } from "@/lib/photo-corridors";
```

**Step 2: Add photo requirements card**

Inside the `CorridorPage` component, after the existing "What you'll get" card and before the `<AdSlot>`, look up the matching photo corridor and render a card:

```typescript
const photoCorridor = getBestPhotoCorridorForDestination(corridor.destinationCode);
```

Then add this JSX before `<AdSlot slot="5803818608" ...>`:

```tsx
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
```

**Step 3: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds with 71 visa corridor pages

**Step 4: Commit**

```bash
git add "app/visa/[slug]/page.tsx"
git commit -m "Cross-link visa corridor pages to matching photo requirement pages"
git push
```

---

### Task 3: Cross-link photo pages → relevant visa corridors

**Files:**
- Modify: `app/photo/[slug]/page.tsx`

**Step 1: Add import**

Add to imports:

```typescript
import { CORRIDORS } from "@/lib/corridors";
```

**Step 2: Add visa corridor links section**

Inside `PhotoCorridorPage`, compute relevant visa corridors:

```typescript
const relevantVisaCorridors = CORRIDORS.filter(
  (c) => c.destinationCode === corridor.countryCode,
).slice(0, 8);
```

Add this JSX before the existing "Need a visa too?" CTA card:

```tsx
{relevantVisaCorridors.length > 0 && (
  <div className="flex flex-col gap-3">
    <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
      Visa requirements for {corridor.name.replace(/ (Passport|Visa).*/, "")}
    </h3>
    <div className="flex flex-wrap gap-2">
      {relevantVisaCorridors.map((c) => (
        <Link
          key={c.slug}
          href={`/visa/${c.slug}`}
          className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-brand-400 hover:text-foreground"
        >
          {c.passport} → {c.destination}
        </Link>
      ))}
    </div>
  </div>
)}
```

**Step 3: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds with 23 photo corridor pages

**Step 4: Commit**

```bash
git add "app/photo/[slug]/page.tsx"
git commit -m "Cross-link photo pages to relevant visa corridor pages"
git push
```

---

### Task 4: Add breadcrumb structured data to visa corridor pages

**Files:**
- Modify: `app/visa/[slug]/page.tsx`

**Step 1: Add breadcrumb schema**

Inside `CorridorPage`, after the existing `faqSchema` const, add:

```typescript
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
```

**Step 2: Render the breadcrumb schema**

Add after the existing `<StructuredData data={faqSchema} />`:

```tsx
<StructuredData data={breadcrumbSchema} />
```

**Step 3: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add "app/visa/[slug]/page.tsx"
git commit -m "Add BreadcrumbList JSON-LD to visa corridor pages for search result breadcrumbs"
git push
```

---

### Task 5: Add breadcrumb structured data to photo corridor pages

**Files:**
- Modify: `app/photo/[slug]/page.tsx`

**Step 1: Add breadcrumb schema**

Inside `PhotoCorridorPage`, after the existing `howToSchema` const, add:

```typescript
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
      name: "Photo Tool",
      item: "https://www.visahint.com/photo",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: `${corridor.name} Photo Requirements`,
      item: `https://www.visahint.com/photo/${corridor.slug}`,
    },
  ],
};
```

**Step 2: Render the breadcrumb schema**

Add after existing `<StructuredData data={howToSchema} />`:

```tsx
<StructuredData data={breadcrumbSchema} />
```

**Step 3: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add "app/photo/[slug]/page.tsx"
git commit -m "Add BreadcrumbList JSON-LD to photo corridor pages for search result breadcrumbs"
git push
```

---

### Task 6: Add sitemap ping to existing cron

**Files:**
- Modify: `app/api/cron/refresh-wait-times/route.ts`

**Step 1: Add sitemap ping function**

Add this helper before the GET export:

```typescript
const SITEMAP_URL = "https://www.visahint.com/sitemap.xml";

async function pingSitemaps(): Promise<{ google: boolean; bing: boolean }> {
  const results = { google: false, bing: false };
  try {
    const gRes = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
    );
    results.google = gRes.ok;
  } catch { /* fire-and-forget */ }
  try {
    const bRes = await fetch(
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
    );
    results.bing = bRes.ok;
  } catch { /* fire-and-forget */ }
  return results;
}
```

**Step 2: Call from GET handler**

At the end of the GET handler, before the final `return`, add:

```typescript
const sitemapPing = await pingSitemaps();
```

And include it in the response:

```typescript
return NextResponse.json({ refreshed: results, sitemapPing });
```

**Step 3: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add app/api/cron/refresh-wait-times/route.ts
git commit -m "Add Google and Bing sitemap ping to nightly cron job"
git push
```

---

### Task 7: Add IndexNow — key file + API route

**Files:**
- Create: `public/a1b2c3d4e5f6g7h8.txt` (verification key file)
- Create: `app/api/indexnow/route.ts`

**Step 1: Create IndexNow key file**

Generate a key. Use `a1b2c3d4e5f6a7b8` as the key. Create the file:

`public/a1b2c3d4e5f6a7b8.txt` with content: `a1b2c3d4e5f6a7b8`

**Step 2: Create the IndexNow API route**

```typescript
import { NextResponse } from "next/server";
import { CORRIDORS } from "@/lib/corridors";
import { PHOTO_CORRIDORS } from "@/lib/photo-corridors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INDEXNOW_KEY = "a1b2c3d4e5f6a7b8";
const BASE_URL = "https://www.visahint.com";

export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
  }

  const urlList = [
    BASE_URL,
    `${BASE_URL}/photo`,
    `${BASE_URL}/results`,
    ...CORRIDORS.map((c) => `${BASE_URL}/visa/${c.slug}`),
    ...PHOTO_CORRIDORS.map((c) => `${BASE_URL}/photo/${c.slug}`),
  ];

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "www.visahint.com",
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });

    return NextResponse.json({
      submitted: urlList.length,
      status: res.status,
      ok: res.ok,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
```

**Step 3: Add IndexNow to vercel.json cron**

Update `vercel.json` to add the IndexNow cron (runs nightly at 3:15 AM, 15 min after wait-times):

```json
{
  "crons": [
    {
      "path": "/api/cron/refresh-wait-times",
      "schedule": "0 3 * * *"
    },
    {
      "path": "/api/indexnow",
      "schedule": "15 3 * * *"
    }
  ]
}
```

**Step 4: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add public/a1b2c3d4e5f6a7b8.txt app/api/indexnow/route.ts vercel.json
git commit -m "Add IndexNow integration for Bing/Yandex/DuckDuckGo instant URL submission"
git push
```

---

### Task 8: Deploy to production and verify

**Step 1: Deploy**

```bash
vercel --prod
```

**Step 2: Verify cross-links**

Open `https://www.visahint.com/visa/india-to-usa` — should see a "United States photo requirements" card linking to `/photo/us-visa-photo`.

Open `https://www.visahint.com/photo/us-visa-photo` — should see visa corridor links like "India → United States", "China → United States".

**Step 3: Verify IndexNow key**

Open `https://www.visahint.com/a1b2c3d4e5f6a7b8.txt` — should return the key text.

**Step 4: Verify breadcrumbs**

View source on any corridor page, search for `BreadcrumbList` — should find the JSON-LD block.

**Step 5: Trigger IndexNow manually**

```bash
curl https://www.visahint.com/api/indexnow
```

Expected: `{"submitted": 97, "status": 200, "ok": true}` (or 202)
