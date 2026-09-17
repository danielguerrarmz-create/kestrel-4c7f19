# Code-debt and overcomplication review (2026-09-13)

Full read of `src/` and `qa/` at `a09ba15`: 47,435 lines across 244 files. **Nothing in this PR
changes behaviour.** It adds this document only, as a shared backlog. Every finding was verified by
running the command quoted beside it; none is a guess.

Each item carries `file:line`, the defect in one sentence, the evidence, the recommended action and
an effort estimate (S / M / L). Ranked by cost, worst first: risk of a silent wrong render or a
future hour lost, not by line count.

**Read section 3 first if you read nothing else.** Four of the repo's own guards currently cannot
fail, and one of them is the reason a corrupted regex reached the deployed branch.

---

## 1. `PracticePage.tsx:2254` — a 2,256-line file whose page renders one line. **M**

`export function PracticePage() { return <PracticeEditorial />; }`. The other 2,253 lines
(`ListView`, `Lightbox`, `Gallery`, `CodaBower`, `FounderParenthesis`) render on no route. Its
static imports pull **22 modules / 8,167 lines** that nothing returns: `about/CrossPathsTimeline.tsx`
(2,800), `vendor/nonflowers.ts` (1,564), `MobileTimeline`, `clusters`, `pack`, `parenthesis`,
`reveal`, `spaceColonization`, all of `engine/gongbi/*`, plus `d3-shape`.

*Evidence:* import-graph crawl from `src/main.tsx` against each page's return value;
`grep -rn "from '.*PracticePage'"` returns only `Root.tsx`, `mirror.ts` and two dev-only files.

**Action:** gate `PracticePage` behind the `import.meta.env.DEV` ternary exactly as `/houses` is, or
delete it. `Lightbox` and `QUESTIONS` are imported by `MobileTimeline` and `AboutTreePage` (both
dev-only), so move those two exports first.

## 2. Five QA probes measure a page that was replaced on 2026-07-31. **S**

`qa/divider.mjs:32`, `qa/hero-clip.mjs:33`, `qa/project-media.mjs:74`, `qa/wall.mjs:57`,
`qa/perf-about.mjs:38` and `qa/base.mjs:44` all `goto(${BASE}/about…)`. `/about` now serves
`AboutPage`: four paragraphs, no timeline, no project heroes, no divider.

`qa/base.mjs:19` states the failure mode in its own words: *"A harness pointed at the wrong tree does
not fail. It passes, about someone else's code."*

**Action:** retire alongside finding 1.

## 3. `SplashPage.test.ts:62-63` — the home's no-price guard lost its backslashes. **S**

The live regexes are `/£s?[d,]/` and `/\bd{1,3},d{3}\b/`. Both test for a **literal letter `d`**.

```
/£s?[d,]/.test('Founding site study: £45,000')        // false
/\bd{1,3},d{3}\b/.test('Founding site study: £45,000') // false
/£\s?[\d,]/.test('Founding site study: £45,000')       // true
```

The 21-line comment above them says the literal was replaced by the PROPERTY. The property does not
exist. Correctly escaped twins sit at `seo.test.ts:170,173`.

Nothing is leaking today: `SplashPage.tsx` does not import the fee. This is a disarmed tripwire, not
an open door, and it will not catch the leak it was written for.

**Action:** restore `\s` and `\d`.

## 4. `2027` is published as a bare literal on three public pages, owned by nothing. **S**

`about/aboutCopy.ts:34`, `questions/copy.ts:265`, `questions/copy.ts:313`.
`splash/copy.ts:114`'s `FOUNDING_COHORT.commissionYear = 2027` is imported by no file, and its
tripwire was deleted on 2026-08-05 (`copy.test.ts:15`). A slipped date goes wrong on three pages
silently.

**Action:** bind all three renders to one constant; restore the date assertion.

## 5. `qa/header-nav.mjs:104` — the nav allow-list is three routes out of date. **S**

`PUBLIC_HREFS = ['/', '/gallery', '/questions', '/about']`. The real nav
(`ui/EditorialHeader.tsx:4-7`) is `/gallery`, `/process`, `/about/practice`, `/contact`. Three live
routes read as stowaways, and a guard that cries wolf gets weakened rather than investigated.

## 6. Two header components, two different navs. **S**

`EditorialHeader` (seven public pages): Works / Making / Practice / Enquire. `SplashHeader`
(`/about`, and `PracticePage`'s dead half): gallery / process / contact. A reader gets a different
nav on `/about` than everywhere else.

## 7. The gallery count is hand-typed in five places and already disagrees. **S**

`seo.ts:105,107,108`, `GalleryPage.tsx:104` and `mirror.ts:315` → `llms.txt:12` say "eight".
`Root.tsx:15` and `routing.ts:13,260` still say "seven". `GALLERY_IMAGES.length` is 8 and nothing
derives from it. A ninth plate leaves a cached, screenshotted link card wrong.

## 8. 29 modules, 3,775 lines, unreachable from any route including dev. **M**

Largest: `splash/HeroReveal.tsx` (310 lines, its own comment calls it *"the home hero"*, imported
only by its own test), `App.tsx` (246), `splash/HeroScene.tsx` (242), `ui/CommissionSheet.tsx` (252),
`engine/site.ts` (218), five `pages/engine/*Diagram.tsx`, and `splash/copy.ts` (136, orphaned since
the `PD_FACT` note). Four modules (`exportProject`, `bricks`, `HeroReveal`, `costAttribution`) are
kept alive solely by their own tests.

## 9. `index.html:20,23,46,49` duplicates `META.splash` byte for byte, bound to nothing. **S**

Four identical strings: `<title>`, `name="description"`, `og:title`, `og:description`, against
`seo.ts:96-101`. Their two neighbours in the same static head **are** pinned (`seo.test.ts:209` the
Organization JSON-LD, `:245` the noscript paragraph), so this is a gap rather than a policy.

The static head is what every non-JS crawler and every link unfurler reads, and `seo.ts:26` says in
its own words that a frozen link card cannot be un-cached by a green test.

## 10. The page count is stated wrong in five docblocks and in `CLAUDE.md`. **S**

`PUBLIC_ROUTES` (`routing.ts:315-325`) has **nine**: `/`, `/gallery`, `/process`, `/about`,
`/about/practice`, `/contact`, `/press`, `/privacy`, `/questions`.

| Location | Says |
|---|---|
| `routing.ts:4` | "THE PUBLIC SITE IS FOUR PAGES" |
| `routing.ts:12` | "four pages of real writing" |
| `seo.ts:82` | "the four pages production serves" |
| `Root.tsx:4` | "FIVE PAGES AND NOTHING ELSE", then switches on nine |
| `routing.ts:308` | "The five routes that ship to production" |
| `CLAUDE.md:7` | "THE LIVE SITE IS SIX PAGES", and lists `/houses`, dev-only since 2026-08-04 |

These are the first lines of the three files a new contributor reads. `CLAUDE.md`'s opening block is
Daniel's to change; the five docblocks are not.

## 11. No linter, no CI. **M**

No eslint, knip, depcheck or ts-prune config at the root; no `.github` directory. `tsconfig.json`
sets `noUnusedLocals` and `noUnusedParameters`, which catch intra-file waste only. **No TypeScript
flag can see an unimported module or an unreturned component**, which is exactly how findings 1 and 8
accumulated. With no CI, `npm test` runs when someone remembers, which is how finding 3 shipped.

**Action:** one GitHub Actions job running `npm run typecheck && npm test`, plus `npx knip` as a
report. This is the single change that stops the list regrowing.

## 12. `PressPage.tsx:5` hand-types a third copy of the form inbox. **S**

`PRESS_EMAIL = 'contact@bowerbuild.org'`, duplicating `FORM_INBOX` (`data/config.ts:455`).
`PressPage.test.ts` asserts only that the page renders `PRESS_EMAIL`; nothing ties it to `FORM_INBOX`
or to `CONTACT`.

The `clay@` / `contact@` split itself is deliberate and correctly pinned (`config.test.ts:143`
asserts they are **not** equal). The defect is the unbound third copy, of a value `config.ts:80`
records changing four times in five days. `CLAUDE.md` also states that `/press` prints
`CONTACT.email`; it prints the form box, so the doc and the code already disagree.

## 13. The site's signature paragraph is authored twice on two public pages. **S**

`about/aboutCopy.ts:25-26` (`/about`) and inline JSX at `ProcessPage.tsx:117,120` (`/process`):
*"Ask anyone for the most beautiful place… None of them finished. All of them alive."* Each is pinned
to its own literal (`ProcessPage.test.ts:12`, `agentMirror.generated.test.ts:68`), so editing one
leaves the other green. Two of nine public pages can disagree on the opening argument.

## 14. The process stages have three authors and already disagree. **S**

| Source | Stage 2 |
|---|---|
| `PROCESS_STEPS` (`ProcessPage.tsx:11-17`) | "Founding Site Study" |
| `seo.ts:115` | "feasibility" |
| `mirror.ts` → `public/llms.txt:13` | "feasibility" |

So agents and search snippets describe the £45,000 appointment as generic feasibility. The heading
"Five acts of making." is a fourth hand copy of `PROCESS_STEPS.length`. No test binds any pair.

## 15. `about/pack.test.ts:230` — one measurement pinned as a law. **S**

`expect(mean).toBeGreaterThan(0.88)` with the comment "measured 0.8841": a 0.41pp margin. A latent
flake even while green. The honest invariant is the line above it. Moot if finding 1 retires
`pack.ts`.

## 16. `pending.test.ts:105-112` — a sweep with no emptiness guard. **S**

The `confirmation` sweep has none; its sibling at `:99` does. Zero entries means zero assertions and
a green run. **Action:** `expect(values.length).toBeGreaterThan(0)`.

## 17. Four dev-only packages sit in `dependencies`. **S**

Crawling from `src/main.tsx` and stopping at the `DEV` lazy chunks, production pulls only `react`,
`react-dom`, `framer-motion`, `d3-shape`, `posthog-js` and `@vercel/analytics`. `three`,
`@react-three/fiber`, `@react-three/drei` and `zustand` are reachable only from dev-gated routes.
Tree-shaken correctly, so this is install and upgrade drag, not page weight.

## 18. "Four weeks" is hand-typed on two public pages. **S**

`ProcessPage.tsx:13`, `questions/copy.ts:153,356`. The fee beside it is a constant; the duration is
not. **Action:** add `FOUNDING_SITE_STUDY_WEEKS` to `priceCopy.ts`.

## 19. `PracticePage.tsx:84,88` — functions that ignore their argument. **S**

`authorColor(_by)` and `authorTextColor(_by)` return a constant: a vestigial seam for the
by-person colour split `CLAUDE.md` forbids reintroducing. Moot if finding 1 lands.

## 20. Two hex literals duplicate Tailwind tokens. **S**

`CrossPathsTimeline.tsx:103` `#FBF9F3` = `tailwind.config.js:50` `paperVellum`;
`ErrorBoundary.tsx:42` `#F6F4EE` = `paper`. No test reads the config, so a palette change strands two
surfaces on the old colour.

---

## Looks like debt, is not

Checked and deliberately cleared. Recorded so the next reader does not re-propose them.

- **Public assets.** Only 8 files / 0.17 MB of 473 are unreferenced. `srcSetFor` builds `-NNNNw`
  names from a manifest, so a filename grep gives 354 false positives.
- **`agent/mirror.ts` and `pending.ts` imported only by tests.** That is the design: a `GEN=1`
  generator and a swept list.
- **`api/contact.ts`'s address copy, and `clay@` vs `contact@`.** Both deliberate, both pinned
  (`api/contact.test.ts:195`, `config.test.ts:143-145`).
- **The engine, the labs, `/houses`, `/commissions`, `/about/tree`.** Lazy behind the DEV ternary at
  zero production bundle cost. A gate, not debt.
- **`about/manifesto.ts` and `poem.ts`.** Dead but deliberate provenance tombstones for three
  same-day drafts. Leave them.
- **`sitemap.xml`, `llms.txt`, `agent/*.md`, `capacity.ts`.** Generated or derived and drift-guarded.
  `qa/bundle-leak.mjs` self-checks and refuses a stale `dist/`.
- **`houseRules.test.ts`, `bios-vs-ledger.test.ts`.** Checked against the documented traps; clean,
  and the `p.id` bug is fixed.

---

## Verdict

For 47,435 lines this is unusually well-reasoned code, and the cleared list above is long precisely
because so much that looks wrong is deliberate and pinned.

One structural problem underlies findings 1, 2, 8 and 11: **the site keeps being replaced in place
and nothing sweeps up behind it.** 22% of `src` renders for nobody, 3,330 lines of tests and a third
of the QA suite guard that dead 22%, five probes measure a URL reassigned six weeks ago, and with no
linter and no CI nothing could ever notice. That is how a guard with its backslashes missing reached
the deployed branch.

**One sprint retires most of it:** gate or delete `PracticePage`, retire its five probes with it,
repair the four dead guards (3, 5, 15, 16), and add CI running `npm run typecheck && npm test`. The
remaining sixteen are a half-day of small, independent edits.
