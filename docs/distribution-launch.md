# Distribution Launch Playbook

Paste-ready copy and timing for the two highest-leverage non-paid
distribution channels: **Product Hunt** and **Reddit**. Both are
optimized for *first-touch* — i.e. you've never launched VisaHint
publicly. Re-launches need different copy.

---

## Product Hunt

### Pre-launch checklist (do these 1 week before)

1. **Create the maker account at least 7 days early.** PH heavily
   weights account age — accounts created the same day as the launch
   are throttled or shadow-shipped.
2. **Follow 20–30 active makers** in the travel / AI / productivity
   space. Comment on 3–5 of their launches — even a one-liner of
   genuine feedback. PH's algorithm considers "is this maker engaged"
   when ranking.
3. **Hunter:** ideally find someone with 1k+ followers to *hunt* the
   product. Hunter is the person who actually submits — submitters
   with high follower counts get more first-hour distribution. If you
   can't find one, self-hunt — still works, just slower.
4. **Schedule the launch for a Tuesday or Wednesday at 12:01 AM PT.**
   Monday is usually the busiest day → harder to crack the front
   page. Friday/Saturday die fast. Always 12:01 AM PT — PH's day
   resets there and submissions in the first hour get the strongest
   visibility window.
5. **Have 5–10 supporters lined up.** Send them the URL the moment
   the launch goes live. PH detects bot-style upvotes (all from
   identical IPs / new accounts) and discounts them — supporters
   need to be real makers / Twitter friends.
6. **Have responses drafted** for the most common comments:
   - "How is this different from iVisa / VisaHQ?"
   - "Is the photo tool really free?"
   - "What about countries you don't cover?"
   - "Does it work for [edge case: dual citizenship / transit]?"

### Tagline (60 char hard limit)

Use **one** of these — A/B test in pre-launch comments if you have time.

- **A:** `Free visa requirements & photo checker, with citations`
- **B:** `Visa requirements + AI photo compliance — free & cited`
- **C:** `Do you need a visa? Free check with official citations`

A is safest — front-loads "free" (highest-converting word on PH).
C is the most curiosity-driving but slightly weaker on what it
*does*. B emphasizes the AI angle — only use if you want AI-aware
hunters specifically.

### Description (260 char hard limit)

> Free instant visa requirements for any passport/destination — with
> citations from official government sources. Plus a free passport
> photo compliance checker with AI auto-fix. Built for real trips:
> transit, dual passports, held-visa exemptions.

(257 chars — fits.)

### Maker's first comment (post immediately after launch goes live)

Aim for ~600 words. Personal, specific, no marketing-speak. The PH
algorithm and human voters both discount fluff.

```
Hey Hunters,

I'm Ashwini, the maker. VisaHint started because the existing visa
tools (iVisa, VisaHQ, Sherpa) all answer the basic version of the
question — "does passport X need a visa for country Y?" — and stop
there. Every real trip I've taken has run into the *next* question:
the layover that triggers a transit visa, the held US B1/B2 that
exempts you from the Mexican visa, the dual passport that changes
the answer entirely, the 30-vs-90-day rule that flips the verdict.

Existing tools don't handle these. So I built one that does.

What's actually here:

- **Visa requirements:** answer + verdict, with a link to the
  official government source for every claim. Handles transit,
  dual passports, held visas, and length-dependent rules.
- **Free passport photo compliance check:** upload your photo, get
  10 specific checks (face position, head height %, background,
  expression, glasses, shadows, hair, headwear, etc.) against the
  official spec for whichever country you're applying to. Spec is
  fetched from primary government sources via Gemini + Google
  Search grounding, cached for 30 days.
- **Free AI photo auto-fix:** if the photo fails on background,
  shadows, or aspect ratio, it gets regenerated with those issues
  fixed — face/expression/clothing untouched. Most photo services
  charge $5–10 for this; we don't charge for it.
- **Printable 4×6 sheet** of your fixed photo — drop it into any
  drugstore (CVS, Walgreens, Walmart) print kiosk for $0.20–0.50
  instead of $15–20 at a passport-photo store.
- **Compliance certificate PDF** with the photo at actual print
  size + the spec it was checked against + the official source URL.
  Bring it to the consulate as evidence.
- **Live processing wait times** for US, UK, Canada, Australia, and
  New Zealand visas, refreshed nightly from primary government
  feeds. Surfaced on every relevant corridor page (e.g.
  `/visa/india-to-usa`).

What it doesn't do (yet):

- Apply for visas on your behalf — we'll only ever be a checker,
  not an agent
- Answer for every country — we have ~30 destinations with
  high-confidence verdicts; the rest fall back to "varies, run the
  checker" so we never give you a wrong answer
- Replace a lawyer for non-tourist cases (study, work, family) —
  always verify with the official source for those

Privacy: photos are processed in-memory and discarded after the
check. We don't keep them, don't train on them, don't have user
accounts. The full privacy policy is in the footer.

Asks for the community:
1. Try a corridor relevant to your next trip and tell me if the
   answer matches what you've experienced
2. Upload your messiest passport photo to the photo tool — I want
   to see where the auto-fix breaks
3. If you spot a stale fee, broken consulate link, or wrong
   verdict, email the address in the footer (`venkaakesh@gmail.com`)
   — corrections happen the same day the source confirms

Thanks for hunting!
```

### Topics to select (PH lets you pick up to 3)

- **Travel** (primary — biggest topical audience)
- **Productivity** (catches the "tools" crowd)
- **Artificial Intelligence** (if you want AI-watchers to find it
  — currently AI tools rank well; if AI fatigue is real on launch
  day, swap to **Tech** instead)

### Screenshots (PH allows up to 4)

Use these in this order — first three are above-the-fold:

1. **Hero shot of `/visa/india-to-usa`** showing the verdict card
   (red "Visa required" pill, $185 indicative fee, India → United
   States title). Clearest demonstration of the value prop.
2. **The photo tool post-fix screen** showing original-vs-fixed
   side-by-side. Visual demo of the AI auto-fix is the strongest
   single-image story.
3. **The compliance certificate PDF** opened in a viewer.
4. **The dynamic OG image** of any corridor — distinctive social
   preview, shows polish.

If you can do a 30-second screen recording instead of static
images, even better — PH ranks media-rich launches higher.

### Launch-day timeline (set timers)

- **00:01 AM PT** — launch goes live, post the maker comment
- **00:05 AM PT** — message your 5–10 supporters with the URL
- **First hour** — reply to *every* comment, even one-liners
- **Throughout the day** — check every 30 min, reply to comments
  within 5 minutes of arrival. PH's algorithm rewards engagement
  velocity in the first 6 hours.
- **End of day** — post a "thank you for hunting" comment,
  including a metric (e.g. "X visa checks run today") if you can.

### Realistic outcome

For a first launch with no Twitter following: expect **300–800
upvotes**, maybe top 5–10 of the day. That maps to **2,000–8,000
unique visitors** in 48 hours and **1–3 backlinks** from secondary
"PH winners" aggregators. Not a viral hit, but a healthy seed.

If you crack top 3 of the day (rare for first-time makers) you can
expect 5,000+ upvotes and ~30,000 visitors over the week.

---

## Reddit

Reddit is **not a launch channel** — it's a sustained-presence
channel. One "Show Reddit: I built a thing" post per major
subreddit, then move to *answering questions* with corridor links
as the source.

### Rules of the road (skip at your peril)

1. **Read each subreddit's rules.** Most travel subs have explicit
   anti-self-promotion rules. r/travel and r/digitalnomad ban
   first-time posters who only have promotional posts; r/IndianTravel
   is more lenient but still bans link-drops. Ban = your account
   is shadow-listed forever.
2. **Build karma first.** A new account with 0 karma posting a
   self-promotion link will be auto-removed by AutoModerator on
   most subs. Spend 1 week answering visa questions with text-only
   replies (no link), build 100+ comment karma, *then* start
   linking.
3. **Always lead with the answer, not the link.** Bad pattern:
   "Hey, check out this site I built: visahint.com". Good pattern:
   write a 200-word answer that fully addresses the question, then
   close with "I built a free tool that handles cases like yours
   if it's useful: [URL]". The first line earns the second.
4. **Don't link in every reply.** If you've linked in this thread
   already, don't link again. If your last 5 comments are all the
   same URL, you'll get banned for spam regardless of intent.
5. **Disclose if asked.** If someone asks "are you the creator?",
   say yes immediately. The mods are watching for this and a
   denial → instant ban.

### Subreddit map

| Sub | Subscribers | Vibe | Auto-mod strict? | Link-friendly? |
|---|---|---|---|---|
| r/IndianTravel | 380k | Practical Q&A | Medium | Yes, after karma |
| r/Schengen | 28k | Visa-procedure focused | Strict | Only if asked |
| r/USTravel | 80k | Tourism-heavy | Medium | Limited |
| r/digitalnomad | 2.5M | Lifestyle + visas | Strict | Once per quarter max |
| r/travel | 9M | Generalist, lots of newcomers | Very strict | Almost never |
| r/expats | 270k | Long-term moves | Medium | Yes for relocation |
| r/passportporn | 80k | Photo-tool natural fit | Loose | Yes |
| r/visapassport | 40k | Pure visa rules | Loose | Yes |
| r/UKvisa | 95k | UK applications | Very strict | Almost never |

Start with the **medium-strict + topical-fit** subs:
r/IndianTravel, r/Schengen, r/USTravel, r/passportporn,
r/visapassport. Skip r/travel and r/digitalnomad until you have
3+ months of comment karma there.

### "Show & tell" post template

For the one introductory post per subreddit. Tweak the country
references for each sub.

```
Title: I built a free tool that handles transit visas, dual
passports, and held-visa exemptions

Body:
Quick context: every visa-checker I've used (iVisa, Sherpa,
VisaHQ) answers the easy version of the question and stops there.
The hard cases — layovers triggering transit visas, dual
citizenship changing the answer, an existing US B1/B2 exempting
you from the Mexican visa — they all punt on.

So I built one that handles those cases. visahint.com (link in my
profile if rules allow).

What's there:
- Visa verdict + fee + processing time, with a link to the
  official government source for every claim
- Free passport photo compliance check (no signup, no watermark,
  no upsell) for ~60 documents across 30 countries
- AI auto-fix for the photo if it fails on background, shadows,
  or aspect ratio
- Free 4×6 printable sheet so you can print at any drugstore for
  ~$0.30 instead of $15 at a passport store

Honest limitations: ~30 high-confidence destinations covered
(rest fall back to "varies — verify with the official source").
Not a substitute for a lawyer on study/work visas. Photos are
processed in-memory and discarded — not stored, not used to train
anything.

Happy to answer questions / corridor-specific edge cases here.
If you find a wrong verdict please tell me — corrections happen
the same day the source confirms.
```

Post this once per subreddit, max. Post on Tuesday-Thursday between
8 and 10 am in the dominant timezone of the subreddit (e.g. India
time for r/IndianTravel).

### Question-answer template

For replying to existing visa-question threads. Use this 80% of
the time and the show-and-tell post 20% of the time.

```
[Direct answer to the question — be specific, not generic]

[2-3 sentences of useful context they didn't ask for but probably
need: timing, fees, common pitfalls]

[Source: link to the official authority page, e.g. travel.state.gov]

If it's helpful, I built a free corridor page that has the verdict,
processing time, and the official source in one place:
visahint.com/visa/india-to-usa (replace with the relevant slug).
You don't need to use it — just adding so others on this thread
have one place to verify.
```

The closing paragraph is *optional* — only add it on threads
where the verdict on visahint actually matches what you said. If
you'd be linking a corridor that doesn't have policy data yet,
skip the link.

### High-volume question patterns to watch for

Set up Reddit search alerts for these phrases. Most fire 5-20
times per week. Answering 3-5 of these per week sustains visibility.

- "do I need a visa for [country]"
- "[country] visa wait time"
- "[country] visa photo size"
- "[country] visa rejected"
- "transit visa [airport]"
- "dual passport [country]"
- "schengen visa from [country]"

### Realistic outcome

A consistent 2-3 helpful comments per week across 4-5 subs over
**3 months** typically converts to:
- 200-400 direct corridor-page visitors per week (slow but
  compounding)
- 5-15 quality backlinks from comment URLs Google indexes
- A reputation as "the visa person" in those subs — when someone
  posts a question and your answer is one of the top comments,
  *other people* start linking to you.

This is the channel that pays off in months 4-12, not week 1.

---

## What I am not including in this doc

- **Show HN copy** — Hacker News' tone differs enough from PH that
  it deserves its own draft when you're ready (Show HN audience
  cares more about the technical novelty: the LLM-grounded photo
  spec fetcher, the AI image-edit fix, the verdict-policy
  registry as a structural rather than ML approach).
- **Twitter/X threads** — short-form copy needs the actual numbers
  the site has gathered (e.g. wait-time data variance) which we
  don't have yet at this scale.
- **Press / journalist outreach** — needs the data-story PR piece
  (todo #15) finished first.

Ping me when you want any of these drafted.
