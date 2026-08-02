/**
 * capacity.ts — how big a Bower is and how many people fit in it. ONE owner, because as of
 * 2026-07-31 two pages say it.
 *
 * WHY THIS MODULE EXISTS. The venue rewrite put the same capacity sentence on `/questions` ("How
 * big is it?") and on `/houses` ("What it holds"). That is the exact shape of the oldest live bug
 * in this repo — the founder bios restate project facts by hand and nothing links them to the
 * ledger, so `LLO: Dream Machine` was re-attributed in one place and sat wrong in the other for
 * five rounds, silently, because nothing fails when prose disagrees with prose. A capacity figure
 * is worse than a project credit: it is the number a venue owner plans a dinner around, and the two
 * pages that state it are the two pages that reader will have open at the same time.
 *
 * So the figures are constants here and the prose reads them. The pages keep their own voice — the
 * questions page answers, the houses page argues — but neither owns the number.
 *
 * THE FIGURES ARE DERIVED FROM AN AREA AND A RATE, AND THE DERIVATION IS THE POINT. Standard UK
 * event planning, and the spec is explicit: use these and do not round generously.
 *
 *   seated dining, banqueting rounds   1.5 m2 per head
 *   seated ceremony / theatre          0.8 m2 per head
 *   standing reception                 0.7 m2 per head
 *
 * `capacity.test.ts` recomputes every published figure from `FOOTPRINT_M2.max` and these rates, so
 * changing the range without restating the capacities fails the suite. That is the guard the size
 * answer needed: the line it replaced ("room for a table of eight") was a capacity claim nobody had
 * ever checked against an area, and it disqualified Bower from the entire segment in the first
 * answer a venue owner reads.
 *
 * WHAT THIS MODULE DELIBERATELY DOES NOT CARRY: a house-scale or landmark tier. An earlier draft of
 * the venue spec invented one, with seated and standing figures to be filled in later, and the
 * revised spec withdrew it outright. Bower cannot currently engineer or price a structure at
 * marquee scale and has built nothing, so a capacity for it is not a blank awaiting a number — it
 * is a claim awaiting falsification by the first buyer who asks what it is based on. `Larger pieces
 * exist` is the correct amount to say, and it is all the copy says.
 *
 * AND THE MARQUEE-REPLACEMENT CLAIM IS WITHDRAWN FROM THE WHOLE SITE, pinned as an absence in
 * `houseRules.test.ts`. At 25 to 40 m2 a Bower does not replace a marquee, a venue owner
 * establishes that in one question, and the page that had claimed it would have lost the argument
 * it opened with. What replaces the claim is the true one: this is a different room, at house-party
 * size, that exists in November.
 */

/**
 * The footprint range every published capacity is derived from. Square metres.
 *
 * NOT wired to the engine's `GRAMMAR.minFootprintM2`/`maxFootprintM2` (12 to 18), and that is
 * deliberate rather than an oversight: those bounds describe the smallest object the dev-only
 * studio models, and this is the range the practice takes commissions in. Wiring them together
 * would make a marketing figure move when someone widens a slider.
 */
export const FOOTPRINT_M2 = { min: 25, max: 40 } as const;

/** Square metres per head, by how the room is used. Standard UK event planning. */
export const M2_PER_HEAD = {
  /** Seated dining on banqueting rounds. */
  dining: 1.5,
  /** Seated ceremony, theatre-style. */
  ceremony: 0.8,
  /** Standing reception. */
  standing: 0.7,
} as const;

/** How many heads an area supports for a given use, unrounded. */
export const headsFor = (m2: number, use: keyof typeof M2_PER_HEAD): number =>
  m2 / M2_PER_HEAD[use];

/**
 * THE PUBLISHED FIGURES, at the top of the range, as the copy prints them.
 *
 * These are the numbers in the prose, held here so the two pages cannot drift. They are rounded for
 * a reader; `capacity.test.ts` checks each against `headsFor(FOOTPRINT_M2.max, ...)`.
 *
 * ON `dining: 30` — READ THIS BEFORE CHANGING THE RANGE OR THE RATE. 40 m2 at 1.5 m2 per head is
 * 26.7, so "about thirty" sits ABOVE what the arithmetic supports, by the margin pinned in
 * `DINING_ROUNDING_PCT` below. It is Clay's published product statement, stated the same way in the
 * spec's own §0 ("dinner for a house party of about thirty") and in both drafted pages, so it is
 * published as written rather than quietly corrected to twenty-five here. But it is the one figure
 * on this page that is not conservative, and the test pins the gap as a NUMBER rather than
 * describing it in a comment — because a comment cannot fail, it can only be believed, and this
 * repo has a standing rule about relationships that live only in prose.
 *
 * `standing: 50` against an implied 57 is conservative, which is the right direction.
 */
export const PUBLISHED_HEADS = {
  dining: 30,
  standing: 50,
} as const;

/**
 * The same two figures as the copy actually prints them: in words.
 *
 * The site's register spells small numbers out ("about three metres", "twenty-five square metres"),
 * and the range keeps numerals because the existing size answer already did. Holding both forms
 * here is what lets the test check that the word and the number agree — otherwise the numeral is a
 * constant the prose merely resembles, which is a guard that cannot fail.
 */
export const HEADS_IN_WORDS = {
  dining: 'thirty',
  standing: 'fifty',
} as const;

/**
 * How far `PUBLISHED_HEADS.dining` sits above the arithmetic, as a percentage, rounded to a whole
 * number. Pinned so that widening `FOOTPRINT_M2` or changing `M2_PER_HEAD.dining` without restating
 * the published figure goes red instead of silently making the overstatement bigger.
 */
export const DINING_ROUNDING_PCT = 12;

/**
 * WHAT IS SHARED IS THE NUMBERS, NOT A SENTENCE — and the first draft of this module got that
 * wrong, which is worth recording because the wrong version looked more DRY.
 *
 * It exported a ready-made fragment ("About thirty to dinner, or fifty standing.") for both pages
 * to print. But `/questions` sets the figures inside an answer ("At the top of that range: about
 * thirty to dinner, or fifty standing") and `/houses` sets them as three standalone claims ("About
 * thirty to dinner. About fifty standing. A small ceremony."). Forcing one string to serve both
 * meant the caller had to patch its capitalisation back off at the call site, which is the tell: a
 * shared constant that needs editing where it is used is not shared, it is borrowed.
 *
 * So each page writes its own sentence and interpolates `HEADS_IN_WORDS`. The number has one owner;
 * the register belongs to the page. `capacity.test.ts` asserts both rendered pages carry the same
 * figures, which is the invariant that actually mattered — not that they share a string.
 */

