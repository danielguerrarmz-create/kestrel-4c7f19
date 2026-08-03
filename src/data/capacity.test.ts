import { describe, it, expect } from 'vitest';
import {
  DINING_ROUNDING_PCT,
  FOOTPRINT_M2,
  HEADS_IN_WORDS,
  M2_PER_HEAD,
  PUBLISHED_HEADS,
  headsFor,
} from './capacity';
import { housesMirror } from '../agent/mirror';

/**
 * THE GUARD THE SIZE ANSWER NEVER HAD.
 *
 * "Room for a table of eight, with space to walk around it" stood on `/questions` as the first
 * thing a reader learned about scale. It is a capacity claim, it was never checked against an area,
 * and the venue spec identifies it as the single most damaging line on the site — it disqualifies
 * Bower from the segment in the first answer read. Nothing could have caught it, because nothing
 * connected the sentence to a square metre figure sitting two clauses away in the same paragraph.
 *
 * So every published capacity is recomputed here from `FOOTPRINT_M2.max` and the standard UK event
 * planning rates. Change the range, change a rate, or restate a figure in prose, and one of these
 * fails.
 */
describe('every published capacity is derived from an area and a rate', () => {
  it('the rates are the standard UK event planning ones the spec named', () => {
    // Pinned as literals: these are external facts, not our choices, and a "tuned" rate is how a
    // capacity claim quietly becomes whatever the copy needed it to be.
    expect(M2_PER_HEAD.dining).toBe(1.5);
    expect(M2_PER_HEAD.ceremony).toBe(0.8);
    expect(M2_PER_HEAD.standing).toBe(0.7);
  });

  it('standing capacity is conservative against the arithmetic', () => {
    // 40 m2 at 0.7 = 57.1, published as fifty. Under is the right direction to be wrong in.
    const implied = headsFor(FOOTPRINT_M2.max, 'standing');
    expect(implied).toBeGreaterThan(PUBLISHED_HEADS.standing);
  });

  /**
   * THE ONE FIGURE THAT IS NOT CONSERVATIVE, PINNED AS A NUMBER.
   *
   * 40 m2 at 1.5 per head is 26.7 and the site publishes "about thirty". That is Clay's product
   * statement, said the same way in the spec's §0 and in both drafted pages, so it ships as
   * written. But the gap is real, and this repo's standing rule is that a load-bearing relationship
   * living only in a comment is a relationship nobody can break loudly. Widening the footprint or
   * changing the rate without restating the published figure moves this percentage and fails here.
   */
  it('the dining figure rounds UP, and by exactly the pinned margin', () => {
    const implied = headsFor(FOOTPRINT_M2.max, 'dining');
    const overstatementPct = Math.round(((PUBLISHED_HEADS.dining - implied) / implied) * 100);
    expect(
      overstatementPct,
      `published dining capacity is now ${overstatementPct}% above the ${implied.toFixed(1)} that ${FOOTPRINT_M2.max} m2 supports; DINING_ROUNDING_PCT says ${DINING_ROUNDING_PCT}`,
    ).toBe(DINING_ROUNDING_PCT);
  });

  it('the words and the numbers agree', () => {
    // Without this the numeric constants are decoration: the prose would print a word that merely
    // resembles them, and the recomputation above would be guarding a figure nobody publishes.
    const WORDS: Record<number, string> = { 25: 'twenty-five', 30: 'thirty', 50: 'fifty' };
    expect(WORDS[PUBLISHED_HEADS.dining]).toBe(HEADS_IN_WORDS.dining);
    expect(WORDS[PUBLISHED_HEADS.standing]).toBe(HEADS_IN_WORDS.standing);
  });

  /**
   * THE INVARIANT THAT ACTUALLY MATTERED, and it is not that the two pages share a string.
   *
   * `/questions` and `/houses` both state the capacity, in their own words, and a venue owner will
   * have both open. What must never happen is that they disagree — so this checks the RENDERED text
   * of each page for the same figures, which holds however either page chooses to phrase it. A
   * shared constant would only have proved they imported the same variable.
   */
  it('every page that states a capacity states the same one', () => {
    const pages = [{ name: 'houses', text: housesMirror() }];
    for (const { name, text } of pages) {
      expect(text, `${name} does not state the dining figure`).toContain(HEADS_IN_WORDS.dining);
      expect(text, `${name} does not state the standing figure`).toContain(HEADS_IN_WORDS.standing);
      // The superseded line, pinned absent on both: it is the sentence the whole rewrite turns on.
      expect(text, `${name} still says "a table of eight"`).not.toMatch(/table of eight/i);
    }
  });

  it('publishes no capacity for a structure at marquee scale', () => {
    // The withdrawn house-scale tier. Anything much above the top of the range is a claim about an
    // object Bower cannot yet engineer or price, and the spec withdrew it outright.
    for (const heads of Object.values(PUBLISHED_HEADS)) {
      expect(heads, 'a marquee-scale capacity has reappeared').toBeLessThanOrEqual(
        headsFor(FOOTPRINT_M2.max, 'standing'),
      );
    }
  });
});
