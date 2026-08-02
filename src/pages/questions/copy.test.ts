import { describe, it, expect } from 'vitest';
import { QUESTIONS, RING, INTRO } from './copy';
import {
  COMMISSION_BREAKEVEN_GBP,
  COMMISSION_FROM,
  FEES_NOT_CREDITED,
  STAGE_1_FEE,
  STAGE_1_FEE_GBP,
  STAGE_2_FEE,
  STEWARDSHIP_NOTE,
} from '../../ui/priceCopy';
import { CONTACT } from '../../data/config';
import { HOUSE_SECTIONS } from '../houses/copy';

const DASHES = /[—–]/; // em dash, en dash: never allowed in on-screen copy

/** Every string this page renders, flattened, so a rule can be applied to all of it at once. */
const ALL_COPY: string[] = [
  INTRO.eyebrow,
  INTRO.title,
  INTRO.standfirst,
  RING.q,
  RING.first,
  RING.study,
  RING.next,
  ...QUESTIONS.flatMap((q) => [q.q, ...q.a, ...(q.rows ?? []).flatMap((r) => [r.stage, r.span])]),
];

describe('the questions page copy (hand-authored, house dash rule)', () => {
  it('carries no em or en dashes anywhere', () => {
    // The source Clay supplied used them throughout ("25 and 40 square metres — room for a
    // table of eight", "6–10%"); they were rewritten as colons, commas and the word "to".
    for (const s of ALL_COPY) {
      expect(s, `dash in: ${s.slice(0, 60)}`).not.toMatch(DASHES);
    }
  });

  it('every question is a question, and every one has an answer', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(7);
    for (const q of QUESTIONS) {
      expect(q.q.endsWith('?'), `not phrased as a question: ${q.q}`).toBe(true);
      expect(q.a.length).toBeGreaterThan(0);
      expect(q.id).toMatch(/^[a-z-]+$/);
    }
  });

  it('the ids are unique, so a heading anchor can never collide', () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

/**
 * THE FIGURES ARE STATED IN TWO PLACES NOW, AND CLAUDE.md's oldest live bug is exactly this
 * shape: "the founder bios restate project facts by hand, and nothing links them to the ledger",
 * one fact in two places with one owner, silent when it drifts.
 *
 * `ui/priceCopy.ts` has owned the commission floor since 2026-07-17 (Daniel's ladder) and the
 * stewardship band since the same day. This page states both again in prose, because a reader
 * needs them in a sentence and not as a constant. So they get pinned against each other: change
 * the floor in priceCopy and this test names the page that still quotes the old one.
 *
 * It matches on the NUMBER, not the sentence, because the prose is Clay's and should stay free.
 */
describe('the stated figures agree with the module that owns them', () => {
  const costAnswer = QUESTIONS.find((q) => q.id === 'cost')!.a.join(' ');

  it('the published starting point matches ui/priceCopy COMMISSION_FROM', () => {
    // COMMISSION_FROM is 'from £350k'; the page writes it long, for a reader.
    expect(COMMISSION_FROM).toContain('350k');
    expect(costAnswer).toContain('£350,000');
  });

  /**
   * THE GUARD THAT WOULD HAVE CAUGHT THE ACTUAL BUG.
   *
   * The first version of this file bound the page to `COMMISSION_FROM` and went green while
   * BOTH said £150,000, which was below cost. Two places agreeing is not evidence about either
   * of them. So the real invariant is not "the page matches the constant" — it is "the number
   * we publish clears the number we incur", and that is checkable.
   */
  it('the published COMMISSION figure clears break-even', () => {
    // Scoped to the sentence that states the commission, NOT to every pound sign on the page: the
    // Stage 1 fee (£18,000) is a professional fee and is *supposed* to sit far below break-even on
    // the object. Sweeping every figure here was the first version of this test and it failed on
    // exactly that, which is the difference between guarding a quantity and guarding every number
    // that happens to look like one.
    const commissionLine = QUESTIONS.find((q) => q.id === 'cost')!.a.find((p) =>
      p.includes('Commissions begin at'),
    )!;
    const gbp = Number(commissionLine.match(/£([\d,]+)/)![1].replace(/,/g, ''));
    expect(gbp, `£${gbp.toLocaleString('en-GB')} is at or below break-even`).toBeGreaterThan(
      COMMISSION_BREAKEVEN_GBP,
    );
  });

  it('the superseded below-cost figure appears nowhere on the page', () => {
    expect(ALL_COPY.join(' ')).not.toContain('£150,000');
  });

  it('the stewardship band matches ui/priceCopy STEWARDSHIP_NOTE', () => {
    expect(STEWARDSHIP_NOTE).toContain('6 to 10%');
    expect(costAnswer).toContain('6 to 10%');
    // And the pruning answer quotes the same band, since it describes the same service.
    expect(QUESTIONS.find((q) => q.id === 'pruning')!.a.join(' ')).toContain('6 to 10%');
  });

  it('the Stage 1 fee is the same number in the answer, the close, and on /houses', () => {
    // Bound to the CONSTANT, not to a literal. The fee has moved twice in four days
    // (£1,500 -> £6,500 -> £15,000 -> £18,000, the last three inside a week) and each move had to
    // be made by hand in three places, which is how a page ends up right twice and wrong once.
    expect(costAnswer).toContain(STAGE_1_FEE);
    expect(RING.study).toContain(STAGE_1_FEE);
    expect(HOUSE_SECTIONS.find((s) => s.id === 'cost')!.body.join(' ')).toContain(STAGE_1_FEE);
    // Both superseded figures pinned absent, so neither can return by a stale edit.
    expect(ALL_COPY.join(' ')).not.toContain('£1,500');
    expect(ALL_COPY.join(' ')).not.toContain('£6,500');
  });

  it('the printed fee and the numeric fee are the same fee', () => {
    // Without this the number is decoration: the prose would print a string that merely resembles
    // it, and every assertion above would be checking the two halves of a constant against each
    // other rather than against the page.
    expect(Number(STAGE_1_FEE.replace(/[£,]/g, ''))).toBe(STAGE_1_FEE_GBP);
    // A professional fee is SUPPOSED to sit far below break-even on the object. Asserted so that
    // a future edit cannot quietly turn the study into something that has to clear the commission
    // guard, which is scoped to the commission sentence and would not catch it.
    expect(STAGE_1_FEE_GBP).toBeLessThan(COMMISSION_BREAKEVEN_GBP);
  });

  /**
   * STAGE 2 IS A RANGE, AND HAS SURVIVED THREE REVISIONS AS ONE.
   *
   * The number has been £18,000 to £25,000, then withdrawn entirely, then £60,000 to £90,000 — all
   * on 2026-07-31. What did not change through any of it is the rule this asserts: **never a single
   * figure.** A point value reads as a quote for work nobody has scoped, and the scoping is
   * literally what Stage 1 is for.
   *
   * So the assertion is about SHAPE rather than value: two figures with "to" between them, and the
   * confirmation that it is fixed later. That survives the next revision of the number too.
   */
  it('Stage 2 is published as a range, never as one figure', () => {
    const stage2 = `${costAnswer} ${RING.next}`;
    expect(stage2).toContain(STAGE_2_FEE);
    expect(STAGE_2_FEE).toMatch(/^£[\d,]+ to £[\d,]+$/);
    expect(stage2).toMatch(/confirmed at the end of Stage 1/);
    // The superseded ceiling, pinned absent. (Its old floor, £18,000, is now the Stage 1 fee —
    // which is why this checks the constants rather than a hand-written list of literals.)
    expect(stage2).not.toContain('£25,000');
  });

  it('both fees are stated as including VAT, and neither is credited against construction', () => {
    // "including VAT" on a professional fee is not decoration for a UK buyer deciding whether the
    // number they have been given is the number they will pay.
    expect(costAnswer).toMatch(new RegExp(`${STAGE_1_FEE.replace('£', '\\£')} including VAT`));
    expect(costAnswer).toMatch(new RegExp(`${STAGE_2_FEE.replace(/£/g, '\\£')} including VAT`));
    // The line that stops both fees reading as a deposit. A buyer who assumes £108,000 of fees
    // comes off a £350,000 commission has mis-budgeted by nearly a third and finds out late.
    expect(costAnswer).toContain(FEES_NOT_CREDITED);
    expect(RING.notCredited).toBe(FEES_NOT_CREDITED);
  });

  it('the cost answer carries no figure it does not own', () => {
    // A sweep, so a fourth number cannot appear without a decision. The only pound amounts on this
    // answer are the commission floor and the two stage fees.
    const figures = costAnswer.match(/£[\d,]+/g) ?? [];
    expect(figures.length).toBeGreaterThan(2);
    expect(new Set(figures)).toEqual(
      new Set(['£350,000', STAGE_1_FEE, ...STAGE_2_FEE.split(' to ')]),
    );
  });
});

describe('the page is a way to reach a person', () => {
  it('the contact details are real and non-empty', () => {
    expect(CONTACT.email).toContain('@');
    expect(CONTACT.phoneHref).toMatch(/^\+\d{7,}$/);
    expect(CONTACT.name.length).toBeGreaterThan(0);
  });

  it('answers the questions the rest of the site could not', () => {
    const all = ALL_COPY.join(' ').toLowerCase();
    // Each of these was unanswerable anywhere on the public site before this page existed.
    // NOTE the absence of "permitted development": the term is in `splash/copy.ts`'s PD_FACT and
    // is deliberately NOT used here. This page explains the test (unlisted, no conservation area
    // or National Landscape, behind the house, under three metres) instead of naming the statute,
    // because the reader it was written for does not know the phrase and does not need to.
    for (const fact of ['£350,000', 'planning', 'conservation area', 'square metres', 'listed building']) {
      expect(all, `the page no longer answers: ${fact}`).toContain(fact.toLowerCase());
    }
  });
});
