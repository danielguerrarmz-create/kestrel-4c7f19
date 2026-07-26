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
    { n: '3', text: `Flat timber components, CNC-cut` },
    { n: '4', text: 'Days to raise, on ground screws, no slab' },
    { n: '5', text: 'Plant, and let it start becoming.' },
  ];
}

/** The same ritual condensed to one mono line for the close (process shown twice). */
export function ritualCompact(componentCount: number): string {
  return `designed with you · the price fixed as it is designed · ~${componentCount} components, CNC-cut · days to raise on ground screws · plant, and it begins to become`;
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
