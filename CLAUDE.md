# Bower (project-eden) — working notes

Loaded automatically at the start of every session in this repo. Keep it short.

## Where the work is — read this first

**THE LIVE SITE IS SIX PAGES: `/`, `/houses` (2026-07-31), `/gallery` (seven concept renderings,
2026-07-23 — `src/pages/GalleryPage.tsx`, assets in `public/assets/gallery/`), `/questions` and
`/about` (short) and `/about/practice` (the founders and the work).**

**THE PRACTICE REPOINTED AT COMMERCIAL HOSPITALITY ON 2026-07-31, AND THAT IS THE FRAME FOR
EVERY COPY DECISION NOW.** Three months of letters to private garden owners through the National
Garden Scheme produced ~85 letters, ~21 warm replies, 15 visits and **zero commercial
conversations**. The letters worked; the audience could not buy. The target is now family-owned
listed houses that already earn from exclusive hire and whole-house rental (reference customer:
Northcourt Manor, Isle of Wight). The whole site had been written to someone who would personally
sit in the structure, and a venue owner is not buying somewhere to sit.
- **WHAT THEY ARE BUYING IS NOT CAPACITY.** Bower cannot build at marquee scale and **must never
  claim to**. They are buying the reason a couple picks them over the house twenty miles away, plus
  three real uses: a drinks reception, a small ceremony, and dinner for a house party of ~30.
- **THE MARQUEE-REPLACEMENT CLAIM IS WITHDRAWN SITE-WIDE and pinned ABSENT in
  `src/houseRules.test.ts`.** It was the first draft's opening argument and every clause of it was
  true — canvas arrives, is struck, comes back dearer — but at 25 to 40 m² it does not hold the
  wedding the marquee was hired for, **a venue owner establishes that in ONE question**, and they
  establish it on your opening claim. *A true sentence about the wrong quantity.* What replaces it:
  a **different** room, at house-party size, **that exists in November**.
- **`houseRules.test.ts` IS THE SPEC'S SIX GROUND RULES AS ABSENCES**, swept over the rendered
  agent mirrors (i.e. every published page's real text, wherever the string was authored). Never
  call either founder an **architect** (protected under the Architects Act 1997; neither is
  ARB-registered — "designer", "trained in architecture" are fine). Never use **ROI, asset,
  revenue, capex, investment, leverage** at these buyers. No **curved-lamination Accoya** claim, no
  **outlasts oak** claim. It caught a live "leverage" in the Resia copy on its first run.
- **`/about` IS NOW THE SHORT PAGE, AND THE FOUNDERS' PAGE IS NESTED BEHIND IT AT
  `/about/practice` (2026-07-31, Clay).** The old `/about` — the drawn timeline, sixteen projects,
  the scroll-grown spine — is the most elaborate thing in this repo and it answers "are these people
  serious" at length, to someone who has already decided to look them up. It was never the answer a
  first-time reader arrives wanting. Clay's brief for the new one was three words: **"very simple,
  very plain, very elegant."** It is a manifesto in the founder's own voice
  (`pages/about/manifesto.ts`), it opens on a place the READER has stood in rather than on the
  company, and it ends with one link onward. **Nothing was deleted; the order was inverted.**
  - `src/pages/AboutPage.tsx` is the SHORT one. The old file was renamed to **`PracticePage.tsx`**
    in the same commit, because a file called `AboutPage` serving `/about/practice` is exactly the
    kind of name-that-became-a-lie this repo gets burned by (see the `vendor` chunk note).
    `PracticePage.tsx` still exports `Lightbox` and `QUESTIONS`, which Gallery/MobileTimeline/
    AboutTree import.
  - **THE MANIFESTO COPY IS CLAY'S AND MUST NOT BE SMOOTHED.** The only edit made to it was the
    house dash rule (an em dash and a `--` became a colon and a comma). It is the one page written
    in a founder's voice rather than the studio's; an agent "improving" it removes the only thing
    it has that the rest of the site cannot fake.
  - **`/about` is off the HEADER and in the FOOTER.** Nav is `houses / gallery / questions`. The
    footer stays **one plain row** — an earlier pass grew a whole practice block there and Clay
    corrected it: a footer that grows a section competes with the page above it, and this one
    closes six pages. Founder names and addresses live on `/about/practice` instead.
  - **The founders are NAMED, deliberately**, and Clay asked whether they need to be: with zero
    built work their record is the only substitute for a portfolio of finished buildings, so going
    anonymous the moment buyers ask "will these people exist in three years" makes the practice look
    smaller, not more corporate.
- **TWO ADDRESSES, AND THE SPLIT IS THE POINT.** `CONTACT.email` = **`clay@bowerbuild.org`** is what
  the site PRINTS (the `/questions` close names "Clay Seifert" one line above it; an `info@` in that
  position puts a front desk between the reader and the person they just read the name of).
  `FORM_INBOX` = **`info@bowerbuild.org`** is where the FORM posts — a machine writing to a machine,
  durable, fans out later. `config.test.ts` pins that they never converge.
- **THE SITE HAS A BACKEND NOW: `api/contact.ts`** (Vercel function, Resend), and the
  register-interest form posts to it. **It is INERT until `RESEND_API_KEY` is set in Vercel** — this
  repo is PUBLIC so no key can live here — returning a real `503 not-configured`, which the form
  reads. **The outcome is decided by the SERVER, never by the click**: "we will be in touch" renders
  only on a 2xx, everything else prints the phone and the address. That shape exists because this
  site already shipped the opposite once. **`vercel.json` MUST keep `api/` out of the SPA rewrite**
  or the form POSTs to the HTML shell, gets a 200, and promises a reply forever while sending
  nothing — same class as the `_vercel/` bug, pinned in `api/contact.test.ts`.
- **`src/pending.ts` IS THE LIST OF FACTS THE SITE IS WAITING ON**, with the drafted sentence each
  unblocks, deliberately unpublished. **`src/pending.test.ts` sweeps `src/` and `public/` so a
  `[CLAY: ...]` marker can never reach a reader.** The rejected alternative was rendering markers in
  dev only, which would split the page from the FAQ schema and the mirror that are generated from it.
  **Two entries were deleted the day they were written** (a house-scale capacity tier, a marquee
  hire figure) because the revised spec withdrew both: *some blanks should never be filled, they
  should be deleted and the claim withdrawn.*
- **`src/data/capacity.ts` OWNS EVERY SIZE AND CAPACITY FIGURE**, because `/questions` and
  `/houses` both state them and a venue owner reads both. It DERIVES them from an area and a
  published rate (1.5 m²/head dining, 0.8 ceremony, 0.7 standing) — the line it replaced, *"room
  for a table of eight"*, was a capacity claim nobody had ever checked against the square-metre
  figure **two clauses away in the same paragraph**. Note `PUBLISHED_HEADS.dining` (30) sits ~12%
  ABOVE what 40 m² supports; that is Clay's product statement, published as written, with the gap
  pinned as a number in `DINING_ROUNDING_PCT` rather than described in a comment.
- **THE BUILDING-REGS ANSWER NOW WRITES A CHEQUE THE PRACTICE HAS NOT CASHED.** "The structural
  engineering is specified for public loading from the outset" commits Bower to a named structural
  engineer, and there is none — nor PII, nor public liability, nor a fabricator (`pending.ts`,
  `practice-entity`). Honest about intent; **resolve in August or it becomes what a solicitor
  quotes back.**

**THESE ARE REAL PATHS AS OF 2026-07-28, NOT `#/` HASHES, AND THAT WAS AN SEO FIX, NOT A REFACTOR.**
A fragment is never sent to a server, so all four pages were the single URL `bowerbuild.org/` to
every crawler and every link unfurler: one `<title>` (the word "Bower"), one description, no
canonical, no sitemap, nothing linkable or rankable per page. `src/routing.ts` is a path router now
(History API, `popstate` + one delegated click handler, links stay real `<a href="/gallery">`), with
`vercel.json` rewriting every app path to `index.html` and a **legacy-hash shim** so every `/#/gallery`
link shared before that date still lands. **`routes.*` values are paths — one leftover `#/` there
renders an href the click delegate reads as an in-page anchor, so the link silently does nothing.**
Three consequences worth knowing:
- **A fragment is now just a fragment.** `href="#cost"` works on any page (it used to parse as the
  unknown route `/cost` and throw you to the splash, which is why QuestionsPage has no anchor index).
  Cold deep links land via `useFragmentScroll` in Root, **not** a timer: the browser gives up
  resolving a fragment before a client-rendered page mounts, and measured, `/#register` happened to
  land while `/questions#winter` did not.
- **Per-page head lives in `src/seo.ts`** (title, description, canonical, og:title/description),
  keyed off `resolveRoute(path, false)` — the PRODUCTION target — so a gated route like `/studio`
  carries the home's head, because the home is what production serves there.
- **ADDING A PUBLIC PAGE IS ONE LIST PLUS SIX DERIVED THINGS, and the compiler asks for most of
  them.** `PUBLIC_ROUTES` in `src/routing.ts` is the switch; `routes.*`, `RouteTarget`,
  `resolveRoute`, `seo.ts`'s `META` (exhaustive by construction — it will not compile without the
  new page's title), `Root.tsx`, the nav in `SplashHeader`, `ui/Footer`, a `*Mirror()` in
  `agent/mirror.ts` + its entry in `agentMirror.generated.test.ts`, `llms.txt`, `robots.txt`, then
  `GEN=1` for the mirror and the sitemap. The `/houses` commit is the worked example.
- **`public/sitemap.xml` is GENERATED** from `PUBLIC_ROUTES` and drift-guarded
  (`GEN=1 npx vitest run seo.generated`), the same pattern as the agent mirror. It was a 404 until
  2026-07-28. **Engine and dev-only routes must never appear in it**; that is a test, and it covers
  BOTH gated lists (`ENGINE_ROUTES` and `DEV_ONLY_ROUTES`), which stay separate on purpose.
- **NO FIGURES IN THE META LAYER. The head sells; the page prices.** `pages/questions/copy.ts` owns
  the published price, bound to `COMMISSION_FROM` and guarded against `COMMISSION_BREAKEVEN_GBP`.
  A title/description/og:description is the worst place to keep a second copy, because **a link
  card is cached by iMessage, WhatsApp, Slack and LinkedIn for months and gets screenshotted, and a
  green test cannot un-cache a frozen card.** `seo.test.ts` pins the ABSENCE (no currency symbol,
  no bare thousands figure). The ONE exception is `faqPageJsonLd()`, which is not a copy: it maps
  over `QUESTIONS` verbatim, and it re-runs the page's own break-even guard on the schema output.
- **`node qa/bundle-leak.mjs` after a build** answers the question no unit test can: did a gated
  surface end up in `dist/`? **Unlinked is not gated** (see about/tree below). It self-checks its
  markers against `src/` first, because its own first draft shipped five markers that could never
  fire and one false positive.
- **ANALYTICS IS PRODUCTION-ONLY AND ROUTE-AWARE** (`src/analytics.tsx`, Vercel Web Analytics,
  Daniel's pick 2026-07-28). Gated by `import.meta.env.PROD ? lazy(...) : null`, the same shape as
  the engine gate, so dev and vitest never load it (verified: `window.va` undefined, zero requests
  under `npm run dev`). It passes BOTH `route` and `path`, which is what turns the SDK's auto-track
  OFF: **every unknown URL renders the home splash here, so auto-track would give `/wp-login.php`
  its own dashboard row.** `route` comes from `metaForPath`, so the analytics row, the canonical tag
  and the title are one decision. **`vercel.json` MUST keep `_vercel/` out of the SPA rewrite** or
  the script loads the HTML shell and every pageview posts into a meaningless 200, silently, forever
  (caught before shipping; pinned in `routing.test.ts`). Enabling Analytics in the Vercel dashboard
  is a manual step no code can do.
- **AND THERE IS A SECOND TRACKER BESIDE IT: POSTHOG (`src/posthog.ts`, Clay 2026-07-29), FED THE
  SAME ROUTE.** Vercel answers how many; PostHog answers funnels, retention and replay. Same PROD
  gate, same dynamic-import shape, loaded at IDLE (230 kB raw / 76 kB gzipped, larger than what is
  left of the three.js stack) with views QUEUED until it lands so the fast reader who goes straight
  to `/questions` is not the one you lose. **It does not read the URL itself — `SiteAnalytics` hands
  it `analyticsRouteFor(path)` and `path`, and `$pathname` is overridden with the collapsed route**,
  or PostHog's own dashboards mint a row per scanner probe exactly as Vercel's auto-track would.
  **The first draft of it was written against a 13-commit-stale branch that still believed in the
  hash router: it captured `location.hash` on `hashchange`, which on a path-routed site reports `/`
  for all four pages, once per session, looking perfectly healthy. It was never deployed.** Key is
  a write-only `phc_` token in a **tracked `.env`** (an unset Vercel variable fails as a graph at
  zero that reads as a quiet week); a **personal** `phx_` key must never come near this PUBLIC repo.
  **Region is US** — verified against both hosts, EU 404s, and the wrong one drops every event
  silently. **The cookie is a knowing exception to Daniel's no-banner reasoning**: PostHog sets one
  and replay (ON by PostHog's remote config, not by this code) records the `/questions` contact
  form, accepted by Clay 2026-07-29 with no consent banner built. Switches to reverse it are named
  in `posthog.ts`. Guards: the second half of `src/analytics.test.ts`.

**THE SHARING CARD EXISTS (2026-07-28) AND IT USED TO ADVERTISE A DEAD PRODUCT.** index.html had no
`og:image` at all, so every pasted link unfurled blank, under an `og:title` still selling the
shape-it-live engine that came off the site on 2026-07-21. The card is
`public/assets/social/og-card.jpg`, a real 1200x630 **JPEG** (not WebP: iMessage/WhatsApp fail it to
*no image*), generated by `npm run gen:og` from the gallery's wisteria walk. **A crawler that does
not run JavaScript sees only index.html's static head**, so unfurlers get the home's card copy on
all four URLs; the per-route copy is for Google, which renders. Prerendering a head per path is the
open item, see `docs/handoffs/2026-07-28-routes-and-social-cards.md`.

**`/questions` IS NEW (2026-07-28) AND IT IS THE PRACTICAL PAGE THE SITE HAD NEVER HAD.**
Size, price, planning permission, groundworks, the timeline, pruning, winter, and the ONLY way
to reach a person. `src/pages/QuestionsPage.tsx`, content in `src/pages/questions/copy.ts`
(Clay's own answers, 2026-07-28), guarded by `questions/copy.test.ts`. Two things it fixed that
are worth remembering as a CLASS of bug:
- **The answers already existed and rendered nowhere.** `COMMISSION_FROM` was written, tested,
  and only ever mounted on `/studio` and `/shape` — both dev-only since 2026-07-21 — so gating
  the engine had silently taken the site's only price with it. `PD_FACT` was authored in
  `splash/copy.ts` and mounted on nothing, ever. **Gating a surface can orphan a fact that was
  never engine-specific; grep for what a gated page was the last renderer of.**
- **AND THE FIGURE IT INHERITED WAS BELOW COST.** The page published "£150,000" for a few hours
  because that is what `COMMISSION_FROM` said (Daniel's ladder, 2026-07-17). Clay: "£150,000 is
  below your cost. Every hour it's up is a chance someone anchors to it." Break-even is £220k on
  the smallest object worth building; the published figure is **£350k** (a 30 m² Bower at 35%
  margin), phrased as a qualifying statement rather than a price, with **Stage 1 £6,500** and
  **Stage 2 £18,000 to £25,000, deliberately a RANGE and deliberately unconfirmed** (it varies
  with heritage statements and tree surveys — do not collapse it). **A figure inherited from a
  constant is not automatically a figure you may publish**, and the drift test that bound the
  page to `COMMISSION_FROM` went green the whole time, because **two places agreeing is not
  evidence about either.** The real invariant is now a test: `COMMISSION_BREAKEVEN_GBP` is a COST
  fact and the published number must clear it (`priceCopy.test.ts`, `questions/copy.test.ts`).
  **The demo constants (`COMMISSION_DEMO_FIGURE`, `COMMISSION_ANCHOR_GBP`, `COMMISSION_FLOOR_GBP`)
  are STILL anchored to £150k and are flagged, not fixed** — all dev-only, and raising the floor
  without recalibrating the anchor would clamp every draw and kill the "feels computed" property.
  Daniel's call before the engine returns.
- **The one conversion point was lying.** `RegisterInterest` said "Noted. We will be in touch."
  over a handler that does `console.log` and nothing else, while `config.ts`'s CONTACT block was
  deliberately empty — so the site promised a reply it had no way to send. CONTACT is real now
  (Clay's own details; **this repo is PUBLIC**). The form still has NO BACKEND: its confirmation
  now says so and hands over the real route. **When an endpoint lands, restore the short message
  and delete the apology.**

**THE HERO HAS EXACTLY ONE ACTION NOW (2026-08-03, Clay), and `/about`'s door was renamed.** The
pair restored on 2026-07-28 (filled -> `/gallery`, quiet -> `/questions` "What one costs") became
an application CTA on 2026-08-01, and the quiet price link came OFF on 2026-08-03: the founding
outreach targets estates, foundations and institutions, and Clay's ruling is that clientele at this
range care less about what one costs. "What one costs" is pinned ABSENT from the home in
`SplashPage.test.ts`, and the `/questions` standfirst no longer opens on price (the cost ANSWER is
untouched). The home's close leads with a Questions door, and the About door reads
"Our background", because "Who is behind this / The people building Bower" promised people and
opened onto a research timeline (Vision Transformers, saliency heatmaps, two papers) containing
no garden pavilion. **About is right for investors and press and wrong for a buyer; the fix was
the label and the ordering, not the page.** Pinned as absences in `SplashPage.test.ts`.

**`/about/tree` IS DEV-ONLY (2026-07-28, Clay), having been public and unlinked since
2026-07-26.** A public URL nobody could reach is also a page nobody has reviewed. It is a
DUPLICATE of `/about`, so gating costs a reader nothing. **It was a STATIC import in Root while
it was "hidden", so the whole tree bundle shipped to production for an unreachable route —
unlinked is not gated.** It is lazy behind the DEV ternary now; verified by build (`treeLayout`
and `data-tree-track` absent from `dist/`). Second gate, separate list: `DEV_ONLY_ROUTES` in
`src/routing.ts`, NOT `ENGINE_ROUTES` (different reason, different render target), guarded in
`src/routing.test.ts`. Source: `src/pages/about-tree/`, probe `qa/tree-page.mjs`.

**The engine is DEV-ONLY (2026-07-21).** Daniel's ruling: the studio/engine "is not something to
be proud of at this time", so `/studio`, `/draw`, `/engine`, `/shape`, `/sculpt` and both labs
render only under `import.meta.env.DEV` and all links into them were stripped from the nav, footer,
home and hero. **It is a gate, not a deletion** — every route still works under `npm run dev`. See
`src/Root.tsx` + `src/DevRoutes.tsx` + `ENGINE_ROUTES` in `src/routing.ts`, guarded by
`src/routing.test.ts`; handoff `docs/handoffs/2026-07-21-engine-hidden.md`. **Add a new engine
route to `ENGINE_ROUTES` AND `DevRoutes` or it ships.**

**THE HOME COPY WAS REWRITTEN 2026-07-23, WHICH PARTLY OVERRODE DANIEL'S "LEAVE THEM" RULING.**
That ruling (handoff `2026-07-21-engine-hidden.md`) said the engine language in band 2 and ritual
step 1 stays until the engine returns. Clay reopened it with information the ruling did not have:
a real first-time reader could not tell what Bower does, or what a bower is. So the home now leads
with the plain noun (pavilions) and a dictionary definition of the name, and nothing on it
references a tool nobody can open — which serves the ruling's own intent. Then a second pass cut
the page from **240 rendered words to 123**. **The law that came out of it lives in
`SplashPage.tsx`'s header and governs every future edit: SAY EACH FACT ONCE, IN THE PLACE THAT
OWNS IT** (the hero owns the noun; the dictionary line owns the name; band 2 owns "one of a kind";
the ritual owns price, components and speed). Guards: no ritual step over 8 words, and
"grammar computes" / "generative design studio" / "live cut list" / "wet trades" are pinned
ABSENT in `SplashPage.test.ts` and `copy.test.ts`.

**Prior: mobile About REDESIGN shipped LIVE on `main` (2026-07-20). Handoff:
`docs/handoffs/2026-07-20-mobile-about-redesign.md`** (design-of-record:
`docs/design/2026-07-20-mobile-about-redesign.md`). Below `lg` the About timeline is a center-spine
DOM tree (`src/pages/about/MobileTimeline.tsx`): centred intro title, questions-first then a
grow/scroll-reveal choreography, reframed projects gallery. **AMENDED 2026-07-23 (Clay, client
pass): the plates are no longer Sai §4's ~84px specimen marks — each cluster's primary is a
mounted print at ~74vw riding OVER the spine (gallery's own mat register), chips for extras, and
the spine now ENDS in the finale mark instead of running through it.** Tap → shared Lightbox
unchanged. Also live: hamburger nav below `md`, responsive `srcset` across About/Splash/Engine
(handoff `2026-07-20-mobile-phase1.md`). Phase 2 (font cleanup, `/shape`+`/sculpt` gate cards, mobile
QA probes) still open. **Base new work on `origin/main`** — the old `about-round-10` branch is 52
commits behind and carries an unrelated `/lab/seeds` dev-rig WIP.

Prior desktop-About work: round 11, `docs/handoffs/2026-07-17-round-11.md` (the timeline/founders
laws below still hold).

Round 11 shipped items 1, 3+4, 6 (content), then 5 (intro stagger: colonization precomputed to
`subBranches.generated.json`, byte-identical), 8 (the Bower mark enlarged ~1.4x, stroke unchanged),
2 (a scroll cue on the finale pin), and 7 (the founders' parenthesis is now a CLOSED BOWER — the two
arms meet at the content centre; `parenthesis.ts` no longer describes the old open form). **The
former "known red" `qa/hero-lockup.mjs` is fixed** — it reads `[data-timeline-viewport]` now, re-derives
its camY honestly, and adds a mark-stroke invariant.

**Still open / needs Daniel:** the bower's BASE curve carries no foliage (reads as a clean binding —
offered to lush it, his call); the spine garland's 900ms mount timer (check it is even live before
spending — `SpineGarland` returns null when `!url`). **Keep this section a POINTER; the round log is
the record.**

*An 81-line round-2/round-3 task list stood here and was cut on 2026-07-17: it described a dead branch
(`about-hybrid-sepia`, "seven commits", "132 vitest"), a finale that no longer exists (the woven
bower; it is an unravel into the mark now), bios that have since been rewritten, and TODOs that were
resolved rounds ago (Rogers' dates among them). A stale map at the top of the file every session reads
first is worse than no map. Recover: `git show <this commit>^ -- CLAUDE.md`. Keep this section a
POINTER; the round log is the record.*

## Things worth knowing

- **This repo is PUBLIC.** Candid internal material (audits, stress tests, accelerator drafts,
  reviews of Clay's work) belongs in the private `bower-docs` repo. See `.gitignore`.
- **The About page is one colour: SEPIA.** `INK_SEPIA` (`#8A6A4A`) in `CrossPathsTimeline.tsx`,
  with `INK_SEPIA_TEXT` (`#6F5439`) for small text — the same colour at reading weight, because
  `INK_SEPIA` does not clear AA on the selected list row's own 8% tint. Amended 2026-07-16: the
  page was `INK_BLUE` (`#3E7CA8`), which appears nowhere in the splash hero (warm gold Austin
  light, timber, green foliage, wisteria purple). **Nothing blue survives on About.**
  - **PIGMENT is permitted on EVERY PAINTED BOTANICAL** — the founder specimens, the spine garland's
    organs, the sub-branches' organs, the founders' arms and the coda garlands (the gongbi genome's
    own palette). **RULED 2026-07-16**: this was "the botanical specimens only", and whether a
    painted *vine* counted was flagged rather than widened quietly. Daniel extended it. If the
    gongbi brush painted it, it may be in pigment.
    - **STRUCTURE IS ALWAYS SEPIA** — the spine, the sub-branch stems, the founders' arms' stems,
      the mark, rules, labels. That half is unchanged and is what the law is actually for. The line
      is: *the composer's brush may have colour; the page's own pen may not.*
    - The discipline frontispieces were deleted in round 2.
  - The old Clay-blue / Daniel-green / shared-olive split was removed on 2026-07-13 — **do not
    reintroduce colour-coding by person.** That prohibition stands unchanged.
- **A seed is a design review, not a constant.** Every commission in `about/paintings.ts` and the
  spine garland's `GARLAND_SEED` was curated by sweeping takes and comparing them, because
  `passesGate` (`engine/gongbi/quality.ts`) is a FLOOR, not a parity check: two seeds can both
  "pass" and still hang as a full plant next to a weed. Curate in `/lab/gongbi` before pinning.
- **THE SITE HAS AN AGENT-READABLE MIRROR (2026-07-23), AND IT REGENERATES OR THE SUITE GOES
  RED.** `/llms.txt` + `/agent/{home,gallery,questions,about}.md` are markdown mirrors of the four
  public pages, GENERATED from the same components via `renderToString` (`src/agent/mirror.ts`) and
  drift-guarded by `src/agent/agentMirror.generated.test.ts` (the subBranches GEN pattern). Any
  page-copy change fails the suite until `GEN=1 npx vitest run agentMirror.generated` reruns.
  index.html carries a `<noscript>` block + `rel="alternate"` pointer; `public/robots.txt`
  allows all agents. The converter is for OUR renderToString output only — never point it at
  foreign HTML.
- **THE TIMELINE SHOWS NO YEARS (2026-07-23).** Clay's client-curation note: the year labels,
  ticks and mobile year headers are gone, and the intro reads "Bower is new… The obsession is
  old." (no more "five years"). The `year` fields STAY — they order and band the layout — they
  are just never printed. The label machinery and its guards (the side rule, the gutter law
  `YEAR_LABEL_OFFSET + YEAR_LABEL_W <= OFFSET_X`, the collision floor) were deleted with the
  feature; the tombstone by the axis in `CrossPathsTimeline.tsx` records what went and why.
- **STOP FORCING GEOMETRY ONTO SOMETHING THAT ALREADY KNOWS ITS OWN SHAPE.** This is the page's
  most repeated bug and the answer has been the same every time: give the thing its own shape back.
  It has now shipped five ways — the hero in a 505x557 portrait box (Daniel: "natively landscape but
  displayed in portrait mode"); `unfurl()` opening every plate from `scale(0.92, 0.64)`; a founder
  vine upscaled 1.8x by `object-cover`; every project hero on `fit: 'cover'` in a region of the
  wrong ratio, silently cropping (Plentify lost **21% of its width** off the sides, and a cropped
  photo still looks like a photo, so nobody notices); and a trunk with a hardcoded stroke that
  matched the spine's position exactly and still stepped 46% in width at the join.
  - The fix is never a better number. `fill` hands a picture a box and resolves the disagreement
    with object-fit (cover crops, contain letterboxes); `FIT_FRAME` lets the replaced element size
    itself from its intrinsic ratio under max-width/max-height, so the element IS the picture and
    object-fit has nothing left to resolve.
  - **THIS LINE USED TO SAY "Measured: hero crop 0% across all twelve" AND IT WAS FALSE FOR ROUNDS.**
    It was true about object-fit, which is genuinely 0, and the word it used was "crop". Round 10
    measured the other way the page can hide a picture and found **all TWELVE heroes clipped at
    1440x760, worst 47.7% of Synthetic Vision; three at 900, worst 22.3% of Origami.** Not by
    object-fit. By the button's own `overflow-hidden`: `FIT_FRAME`'s `max-h-full` resolves against the
    button, `items-start` left the button's height `auto`, and **a percentage max-height against an
    indefinite containing block computes to `none`** — so the constraint silently evaporated and the
    image took its full natural height behind a clip. Fixed by stretching the button (`items-stretch`
    on `[data-project-hero]`); verified 0 clipped and 0 ratio deviation at both heights.
  - **AND THE PROBE AGREED WITH THE COMMENT, WHICH IS WHY IT SURVIVED.** `qa/project-media.mjs`
    computes crop from `|rect.width/rect.height − naturalRatio|`, and **a clipped `<img>` keeps its
    natural ratio in `getBoundingClientRect()`** — the element reports the size it wants to be and
    the clip happens on an ancestor's paint. So the instrument was not broken; it was answering a
    different question and its answer was quoted for the question nobody asked. Overflow clipping is
    only visible by comparing the IMAGE's rect to the **button's** rect: `qa/hero-clip.mjs`.
  - The clip depends on the REGION's ratio, which rises as the window shortens, which is why Daniel
    saw this and a 1440x900 harness never did. **Check a short viewport.**
  - **`project-media.mjs` NO LONGER SAYS "crop" (round 10), because that word was the bug.** It is now
    `heroRatioPct` (object-fit: the element's own rect vs natural) and `heroClipPct` (overflow: the
    IMAGE's rect vs the **BUTTON's**). Two mechanisms; **neither implies the other**; name the question
    in the variable or the next person quotes one answer for the other question. It takes a viewport
    height and width now.
  - **AND THE BANNED PATTERN WAS STILL LIVE ON MOBILE THE WHOLE TIME — reported THREE times, measured
    zero times, fixed round 10.** `Gallery` passed its hero neither `fit` nor `fill`, so it hit
    ProjectImg's default `object-cover` inside a hardcoded `aspect-[3/2]`. **Measured at 390x844:
    ELEVEN of twelve heroes cropped, worst 28.4% (Patterns), Robotic Factory 22.6%, Flowerfield 21.4%
    — MORE than the 21% Plentify loss that banned `cover` in the first place.** It survived because
    every instrument on this page runs at 1440, where that tree is `lg:hidden` and its rects are
    meaningless. **It was not hidden by subtlety. It was hidden by a viewport nobody measured.**
    `qa/mobile-hero.mjs` now guards it and takes a width.
  - **A HERO MAY CROP ONLY IF IT NAMES ITSELF: `ProjectImage.fillHero`, and exactly ONE asset has it**
    (Robots' KUKA loop, 20.1% of width, licensed by Daniel twice, explicitly, to hold the uniform
    region). **It is a LICENCE, NOT A PRECEDENT** — the number is a whisker off the banned 21%, so the
    only thing separating them is that it stays on one asset. `projects.test.ts` pins it BY SRC (a
    moved licence keeps the count at 1 — the count alone will not catch it), and
    `data-licensed-crop` lets the probes allow it there and nowhere else. **A second one is Daniel's
    decision, not yours.**
  - Before sizing any image region, check the aspect against the real asset — the ratios are
    authored in `projects.ts`, and `qa/` has probes.
- **THE DIVIDER IS PINNED BY GEOMETRY, NOT BY A NUMBER (round 10, item 7).** The band is `shrink-0`
  and the media region is the REMAINDER (`flex-1`), so `dividerY = detail.bottom − band.height` and
  **no hero change can move it** — chasing it by cropping heroes is the fake fix. Every project's band
  renders into ONE grid cell with the inactive ones `invisible` (NOT `display:none`, which collapses
  the cell and pins nothing; NOT `min-h-[302px]`, because 302.1 was a measurement at ONE viewport and
  re-wraps at any other width). Daniel ruled **pin at the longest, lose no text**, and accepted that
  Archipedia's line rises ~74px from where he called it correct. **Clamping the band is FORBIDDEN** —
  tried and reverted once; it hid 61px of awards behind an undiscoverable scrollbar. Guard:
  `qa/divider.mjs` (takes a height AND a width; verified 0.00px spread at 1280/1440/1680/1920).
- **`Project` HAS NO STABLE KEY.** `n` is display order and renumbers on merge; `title` is display
  copy and has been rewritten twice. Round 10 wrote a bio guard keyed on **`p.id`, a field that does
  not exist** — every lookup returned undefined and it passed green while checking nothing, inside the
  file written to catch exactly that. **Match on `src`**, or author a real `id`. See the note above
  `interface Project`.
- **RESOLVED (2026-07-17), kept for the lesson: Origami's rail was EIGHT sheets at 53px.** Daniel cut
  it to four (120px, clears `MIN_CELL` 60 by 2x). **They were not cut because they did not fit** — a
  twelve-step instruction manual (cut lines, tab dimensions, A/B/C/D panels) was never legible in a
  supporting rail at ANY width. "It did not fit" is a reason that expires the moment the rail gets
  wider; "a rail was the wrong place for it" does not. **When a constraint forces a content cut, ask
  whether the content was ever right, and say THAT.** `MIN_CELL` stays 60; widening a guard to make it
  pass is tuning the instrument to fit the result.
- **WAIT FOR THE THING, NOT THE CLOCK.** Two agents hit this the same night in different files without
  seeing each other: `qa/growth-timing.mjs` slept 450ms after seeking and measured a camera that had
  not arrived (`camY` 148, 148, 148, 965, 3702, 4439 — stuck for three stops; at 1800ms it tracks),
  and `qa/divider.mjs` measured Archipedia before the page settled, false-positive one run in three.
  **It had a guard and the guard passed**: it asked whether the SCROLL landed, and `scrollY` lands
  instantly — the question is whether the CAMERA arrived. **Guard the quantity the measurement depends
  on, not the one you set.** It also got newly wrong with no edit, because the page got heavier (438
  ornament runs, was 195), so a fixed sleep is a bug waiting for the page to slow down.
  - **Polling for STILLNESS cannot tell "not started" from "finished"** — it reported "settled at 0"
    twice. **Wait for MOVEMENT first, then stillness**, and discard as a HARNESS failure if it never
    moves. This sentence was already in the round-7 doc and was read the same session and walked into
    anyway: **reading the warning does not inoculate you.**
  - **AND WAITING FOR *A* THING IS NOT WAITING FOR *THE* THING. This page has several clocks.** I
    reported "the sub-branch twigs render bare" twice, put it in a commit message and filed it — and
    it was FALSE. My probe waited for the CAMERA correctly (movement, then stillness, tight
    threshold); the camera settles in ~2s. **The sub-branch garland is a painted bitmap that arrives
    at ~7.7s**, and every screenshot was taken at 3.5s. **There are TWO garlands on different clocks**
    (the spine's narrow strip lands early; the sub-branches' 1200-wide strip lands late), so a
    half-loaded page showed organs on the spine and none on the twigs — **a coherent, plausible, wrong
    picture that does not look broken, it looks like a design decision.** Wait for the SPECIFIC
    1200-wide `<image>`, never for "some image" and never for a count to stop rising. Also **cancel
    the autoplay BEFORE any long wait** (`AUTOPLAY_MS` 24000ms, after a 2500ms `AUTOPLAY_LEAD_IN_MS`;
    it is a linear descent, NOT 14s and NOT eased) or it drives the camera underneath it (measured:
    sought 30% of the track, got camY 4934 — the pin). And **pin `?species=`**: `PAGE_SPECIES` rolls per
    load, so an unpinned A/B measures the species, not the change. **The tell I ignored: I could not
    explain WHY the twigs were bare when a passing test said their stations exist. An unexplained
    contradiction between a green test and your own eyes is evidence against your INSTRUMENT.**
- **A CONFLATION IS NOT A CONSTRAINT: check whether X was DEFINED from Y before refusing over "X sets
  Y".** Item 1a (a thinner spine) was refused twice, correctly on the evidence, because
  `MARK_K = SPINE_W / MARK_STROKE` meant thinning the spine shrank the Oculus from the 241px Daniel
  approved to 71px. Every word true; the conclusion false. `MARK_K` had TWO jobs — the mark's SIZE,
  and the ratio making the mark's stroke equal the spine's. **Only the second is a real invariant (the
  join must not step in width), and it is a claim about two STROKES, not about a diameter.** The 241px
  was a CONSEQUENCE Daniel later approved as a fact, and **an approved consequence had become a
  constraint on its own input.** Pin the size, free the weight: nothing was traded — mark still 241px,
  `MARK_R`/`TAIL_LEN`/every point of the finale unchanged, only the ink's width. **This will recur
  every time he says "that size is great, don't change it" about something derived.** Same shape as
  the frame being both the camera's window AND the ink's clip (item 1b), and as `heroCrop` naming two
  mechanisms.
- **A COMMENT CANNOT FAIL. IT CAN ONLY BE BELIEVED.** Changing `SPINE_W` by 3.4x and rewriting
  `MARK_K`'s definition **broke no test** — neither the mark's approved 241px nor the
  spine-equals-mark-stroke identity was guarded anywhere. That is why the conflation above survived two
  rounds: the relationship lived only in prose, and **the prose was CORRECT, which is exactly what made
  it authoritative enough to veto a user's instruction with.** If a comment states a relationship
  load-bearing enough to refuse a ruling over, **it must be a test before the refusal is credible.**
  Corollary: after a change big enough that you expected something to fail, **an all-green run is a
  finding about your coverage, not a pass.**
- **A TEAMMATE'S CHARACTERIZATION OF A THIRD PARTY IS A LEAD, NOT A FACT.** I built a lesson on "the
  escalation offered only two of three levers", got it from a briefing, never checked the handoff — a
  file I had read that same session — and **quoted the refutation inside my own claim** ("cut content
  from 2024, *or give up equal bands*… he took the third, give up equal bands"). Both escapes had been
  named; the analysis was complete. **A borrowed frame is invisible: it arrives feeling like a
  conclusion you reached.** Open the source before repeating it, especially before attributing a
  mistake to someone who is not in the conversation.
  - **AND THE FALSE-POSITIVE HALF IS THE DANGEROUS ONE, which is why `divider.mjs` mattered more than
    its bug.** A guard that intermittently cries wolf does not get investigated — **it gets WEAKENED**,
    because the natural response to a flaky failure is to raise a tolerance or delete the check. That
    is the exact mechanism by which a good guard silently becomes a bad one, and it is how a threshold
    gets relaxed for the wrong reason. So a flake is never cosmetic: **an intermittent FAIL is a bug in
    the instrument, and it must be fixed at the wait, not at the threshold.**
- **A SINGLE GREEN RUN IS NOT EVIDENCE FOR A SUITE COVERING PROCEDURAL OUTPUT. Re-run before you quote
  a number.** "vitest 388" was written into ~20 commit messages tonight as a verdict; measured, the
  suite failed **1 run in 3-4**. `reveal.test.ts` asserted an emergent space-colonization depth
  `toBeGreaterThan(10)` and `maxOrder` landed *exactly* on 10, so the assert was a coin flip nobody had
  flipped twice. **This is the same proxy error one level up:** "this run passed" was checked, "the
  suite passes" was claimed. Anything covering emergent/seeded/procedural output (space colonization,
  the gongbi genome, generated geometry) needs **3-5 runs before its number means anything** — and any
  assert whose threshold came from observing one run (`> 10`, `> 100`, `> 1.5`) is a latent flake **even
  while green**, because it pinned a MEASUREMENT as a LAW.
- **CHANGING A STRING SHAPE SILENTLY DISARMS EVERY GUARD THAT PINNED THE OLD ONE. They stay GREEN
  forever.** The path migration (2026-07-28) turned `expect(html).not.toContain('#/studio')` into a
  check that cannot fail: after it, the page cannot emit that string under ANY bug. The guard was
  protecting something real (no CTA may point at a route production does not serve) and the
  migration disarmed it while leaving it passing. Found two of these in one session
  (`HeroReveal.test.ts`, and `qa/header-nav.mjs`'s hand-copied `PUBLIC_HREFS`, which had been
  silently wrong since `/questions` shipped). **After any URL / class-name / attribute rename, grep
  for `not.toContain('<old shape>')`** and re-express each one as the PROPERTY it was defending —
  sweep the rendered output and assert every href is a live public route — because a property
  survives the change of scheme and a literal does not. **And guard every sweep against emptiness**
  (`expect(hrefs.length).toBeGreaterThan(0)`): a for-loop over zero matches is the same no-op
  wearing a different hat, and that guard is exactly what exposed a regex I had corrupted.
- **A GUARD THAT READS A STALE ARTIFACT IS WORSE THAN NO GUARD: it launders staleness as evidence.**
  `npm run build && node qa/bundle-leak.mjs` — **the `&&` is the point.** A failing build leaves the
  PREVIOUS `dist/` in place, so an unchained probe scans an artifact that predates the change it is
  judging and prints a confident pass. This is not hypothetical: it fooled me while I was proving
  that very probe could fail. `bundle-leak.mjs` now compares source mtimes against `dist/` and exits
  2 rather than reporting at all. Applies to every check that reads a build output, a cache, or a
  generated file.
- **IF A GUARD FILTERS ITS INPUTS, CHECK WHETHER THE SCREEN CAN THROW AWAY THE PROOF.** The
  no-crowding test filtered `if (g <= GAP + 1) continue` — "a ~40px gap must be one cluster's own
  stack". True of a healthy lane, **false of exactly the lane it guards**, because a *crowded* gap is
  also small. It discarded every gap that was too tight and asserted only on the ones already fine, so
  **it could not fail** — and sat green over 15.1px crowding shipped one commit after claiming that
  property fixed. Proof: with the broken page live, the old filter passed all 58 and the fixed one
  failed instantly. **Filter by a FACT (`clusterId`), never by a MAGNITUDE — the magnitude that looks
  like noise can BE the failure.**
- **WHEN DANIEL RULES ON A SCREENSHOT, CHECK THE STATE HE SAW WAS VALID BEFORE EXECUTING.** He was
  shown the axis at `SLOPE` 1150 — a value below its own 1280 floor, crowding 2024 — and ruled "tighten
  the bands". The honest answer was **looser**. Complying would have made it worse *on his
  instruction*. **A ruling made on a broken render is unexecutable, and you only find out by measuring
  the thing he was reacting to.**
- **WHITE MARGINS AROUND A HERO MAY BE THE ASSET, NOT THE LAYOUT — measure before "fixing" it.**
  Measured on the real pixels: Plentify's 1920x1080 hero poster has 451 fully-white columns on the
  left and 478 on the right — **48.4% of the picture is white paper**. Resia's hero is **34.6%**,
  Patterns 9.2%. No box can remove white that lives inside the image, and cropping it out is exactly
  what "no cropping, do not lose context" forbids. This was diagnosed twice as a layout bug and is
  not one. **It wants a re-export of the asset (Daniel's call, his files).** Do not "fix" it in CSS.
- **A BOUNDING BOX IS NOT WHERE THE TEXT IS.** The no-go rule (ornament must not touch text) is only
  as good as its idea of "occupied". "The founders." is a `<p>` in a full-width column — its box is
  1100px wide for a ~110px string, so a box-based probe reports a vine "crossing text" while it
  sails through empty paper a foot away, and would fail forever wherever the ornament went. Measure
  the **glyph runs** (a `Range` over the text node, `getClientRects()`), as `qa/founder-frame.mjs`
  does. With that, one reported collision was a false positive and exactly one was real.
- **A grid row is as tall as its tallest column, and in the work detail that height comes out of the
  hero.** So `ProjectInfoBand`'s column split is a height budget, not a style choice — and MORE
  columns makes it taller, not shorter (narrower columns wrap more). Measured: 3 cols stacked wrong
  = 319px, 4 cols = 465px, 3 cols balanced = ~195px.
- **Do not overlay the BowerMark on a painting.** `matRect` (`engine/gongbi/quality.ts`)
  base-anchors every plant so its densest region sits on the mat's bottom pixel row; anything
  placed at the frame's bottom collides with it by construction, for every seed.
- **THE FOUNDER BIOS RESTATE PROJECT FACTS BY HAND, AND NOTHING LINKS THEM TO THE LEDGER.** This is
  live and it will bite again. `LLO: Dream Machine` was re-attributed to Clay in `projects.ts` on
  2026-07-15; the sentence claiming it sat in **Daniel's** bio until round 5 found it. One fact, two
  places, one owner. Misattributing a cofounder's work on the company's own About page is the worst
  class of bug this page has, and it is silent — nothing fails, it just reads wrong.
  - **Whenever you touch a `by:` attribution, grep `TEAM` for the project's nouns.**
  - Cheap fix if it recurs (proposed, not built): a test asserting no `TEAM` fact mentions a project
    whose `by:` excludes that founder — a noun list per project is enough to catch the class.
  - The mirror of it is just as bad: wording a **shared** project (`by: 'clay+daniel'`, e.g.
    `Plentify`) as sole authorship in one founder's bio. Say what someone did, not what they own.
- **`toBlob` ON THE MAIN THREAD WILL EAT THE PAGE.** "The painting is in a worker" is not the same
  as "the page is off-thread". Handing back an `ImageBitmap` made all four callers draw and
  PNG-encode it themselves: **6,291ms of main-thread self time, 51.9% of everything**, while the
  painters idled. The worker encodes now (`OffscreenCanvas.convertToBlob`) and `requestGarland`
  returns a **URL**, which is session-cached and **must not be revoked by callers** — the next mount
  would get a dead URL. Measured at 4x CPU throttle: blocking 23.3s → 7.3s, scroll 11fps → 48fps.
  Profile with `qa/perf-about.mjs <throttle>` before optimising anything here; the CPU profile named
  this in one run and no amount of guessing would have.
- **Do not wrap the project detail panel in `AnimatePresence mode="wait"`.** It deadlocks against
  the `layoutId` shared-element images inside it: the exit never completes, the incoming panel
  never mounts, and the detail silently freezes on whichever project rendered first while the list
  highlights another. It shipped that way once. There is a comment at the site.
