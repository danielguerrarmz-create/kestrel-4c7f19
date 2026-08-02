/**
 * copy.ts — the hand-authored copy for the precedent-study splash additions (the
 * commission ritual and the "what stays the same" strip). Kept out of the JSX so
 * it can be dash-checked by the test suite (house rule: no em/en dashes in
 * on-screen copy) and so the ritual can be rendered twice, expanded and compact,
 * from one source. Live numbers (component count, lead-time weeks) are injected by
 * the caller from the store's default `outputs`, the same source of truth the
 * commission sheet reads; nothing here hardcodes a production figure.
 */
import { GRAMMAR } from '../../data/config';

export interface RitualStep {
  n: string;
  text: string;
}

/**
 * The commission ritual, numbered 1 to 5, one line each.
 */
export function ritualSteps(): RitualStep[] {
  /*
   * CUT TO ONE FACT PER LINE (2026-07-23 subtraction pass, Clay: "nothing left to take away").
   * What went, and why none of it is a loss:
   *
   *   1. "...your Eden with you, for your garden" -> the band's own heading is "From design to
   *      garden"; a step need not repeat its own band.
   *   2. "...while we design, NOT AFTER" -> defending against an objection the reader has not
   *      made yet.
   *   3. "from the live cut list" -> engine vocabulary for a reader who cannot see the engine.
   *      (It replaced the component count here in an earlier pass; the count lives in the
   *      annotation strip beside this list, which is where a number belongs.)
   *   4. "no wet trades" -> trade jargon. "No slab" already says it to anyone who cares, and
   *      the speed is the actual point.
   *   5. UNTOUCHED. Six words, and the only line here allowed to be beautiful rather than
   *      informative: it is the payoff the other four build to.
   *
   * Steps 1 and 2 had just been rewritten off "Shape it in the studio" / "the price fixes
   * itself as you do", which promised a dev-only tool. That correction stands; this only cuts.
   */
  return [
    { n: '1', text: 'We design it with you' },
    { n: '2', text: 'The price is fixed as we design' },
    // WAS "Flat timber components, CNC-cut", REMOVED 2026-08-01 (Clay: "I don't think that is
    // true and I would prefer to not list it as such"). It described the dev-only engine's
    // fabrication model — flat sheet stock, nested and profiled — as though it were how a
    // commission is actually built, and nothing has been built. A manufacturing method is the
    // easiest claim on a site like this for a technically literate buyer to test, and the one
    // with the least to gain from being asserted early.
    //
    // What replaces it (Clay, 2026-08-01) says WHERE the work happens rather than HOW: off-site
    // manufacture is a fact about the process the practice controls, and it carries the thing the
    // reader actually cares about at this point in the list — that the garden is not a building
    // site for months. It makes no claim about tooling, stock or method.
    { n: '3', text: 'We manufacture off-site' },
    { n: '4', text: 'Days to raise, on ground screws, no slab' },
    { n: '5', text: 'Plant, and let it start becoming.' },
  ];
}

/** The same ritual condensed to one mono line for the close (process shown twice). */
export function ritualCompact(componentCount: number): string {
  // `componentCount` is no longer printed: the CNC claim came out of step 3 above (2026-08-01) and
  // this line restated it, so removing it there and leaving it here would have put the two copies
  // of one fact into disagreement — the failure this file's own header is about. The parameter
  // stays so the dev-only engine surfaces that call this keep compiling.
  void componentCount;
  return `designed with you · the price fixed as it is designed · made for your garden · days to raise on ground screws · plant, and it begins to become`;
}

/**
 * The objection-handling strip: what a client does NOT have to change, then the
 * one thing an Eden adds. Structural, not an FAQ afterthought.
 */
export const STAYS_THE_SAME = {
  keeps:
    'your garden · your soil (ground screws, the ground stays alive) · your planting scheme and your garden designer',
  adds: 'a computed armature for it to climb',
} as const;

/**
 * The single legal fact, phrased as a fact about the height class, never a promise
 * about any specific site. The height reads live off the grammar's permitted-
 * development cap, so it stays truthful to what the engine enforces.
 */
export const PD_FACT = `under ${GRAMMAR.pdHeightCapM} m: permitted development in the UK, no planning application`;

/**
 * THE FOUNDING COHORT — the home's primary call to action, and the site's first scarcity claim.
 *
 * Clay, 2026-08-01: "Register interest" is too passive. The front door now asks for an
 * application to a named, limited thing rather than for an email address.
 *
 * **THIS IS THE MOST PERISHABLE COPY ON THE SITE, AND IT IS THE ONLY CLAIM HERE WITH AN EXPIRY
 * DATE.** Every other fact the site publishes stays true until someone changes it; this one becomes
 * false on its own, in two independent ways:
 *
 *   1. TIME. "Autumn 2026" stops being a forward-looking offer the moment autumn 2026 ends.
 *   2. UPTAKE. "Four are available" is false the moment a fourth is accepted, and nothing in this
 *      repo can know that. Only Clay can.
 *
 * A scarcity claim that has quietly stopped being true is worse than no scarcity claim, because it
 * is the one sentence on the page a returning reader will remember and check. So the year is a
 * NUMBER rather than prose, and `copy.test.ts` fails once it is in the past — a deliberate
 * tripwire, not a flake. **The count has no such guard and cannot have one: watch it by hand.**
 */
export const FOUNDING_COHORT = {
  /** How many feasibility studies are open. Decrement or remove as they are taken. */
  studies: 4,
  /** The season those studies run. `studyYear` is guarded; the season word is not. */
  studySeason: 'autumn',
  studyYear: 2026,
  /** How many builds will follow, and when. */
  commissions: 2,
  commissionYear: 2027,
} as const;

/** The primary action on the home page. Names the thing being applied FOR, not the act of
 *  registering: an application to something limited is a decision, a registration is a mailing
 *  list. */
export const APPLY_CTA = 'Apply for a Founding Feasibility Study';

/**
 * Small counts spelled out, because the site's register spells them out everywhere else ("about
 * three metres", "twenty-five square metres", "about thirty to dinner").
 *
 * The same shape as `HEADS_IN_WORDS` in `data/capacity.ts`, and for the same reason: the word is
 * what the reader sees, so the word is what has to be right, and holding it beside the number lets
 * the test check they agree. Interpolating a bare digit would have printed "4 founding studies",
 * which is the only numeral in a page of spelled-out ones.
 */
const COUNT_IN_WORDS: Record<number, string> = {
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
};

/** The scarcity line, set immediately beneath the CTA. Built from `FOUNDING_COHORT` so the
 *  numbers cannot drift from the constants the test guards. */
export const FOUNDING_COHORT_LINE = `${COUNT_IN_WORDS[FOUNDING_COHORT.studies]} founding studies are available for ${FOUNDING_COHORT.studySeason} ${FOUNDING_COHORT.studyYear}. Up to ${COUNT_IN_WORDS[FOUNDING_COHORT.commissions].toLowerCase()} construction commissions will be accepted for ${FOUNDING_COHORT.commissionYear}.`;
