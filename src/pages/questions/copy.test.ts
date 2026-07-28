import { describe, it, expect } from 'vitest';
import { QUESTIONS, RING, INTRO } from './copy';
import { COMMISSION_BREAKEVEN_GBP, COMMISSION_FROM, STEWARDSHIP_NOTE } from '../../ui/priceCopy';
import { CONTACT } from '../../data/config';

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
    // Scoped to the sentence that states the commission, NOT to every pound sign on the page:
    // the Stage 1 and Stage 2 fees (£6,500, £18,000 to £25,000) are professional fees and are
    // *supposed* to sit far below break-even on the object. Sweeping every figure here was the
    // first version of this test and it failed on exactly those, which is the difference
    // between guarding a quantity and guarding every number that looks like one.
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

  it('the Stage 1 fee is the same number in the answer and in the close', () => {
    expect(costAnswer).toContain('£6,500');
    expect(RING.study).toContain('£6,500');
    // Superseded on 2026-07-28 along with the £150k floor; pinned absent so it cannot return.
    expect(ALL_COPY.join(' ')).not.toContain('£1,500');
  });

  it('Stage 2 stays a RANGE, and stays explicitly unconfirmed', () => {
    // Clay: "don't fix it, since it varies with heritage statements and tree surveys." A single
    // figure here would read as a quote for work nobody has scoped.
    for (const s of [costAnswer, RING.next]) {
      expect(s).toContain('£18,000 to £25,000');
    }
    expect(`${costAnswer} ${RING.next}`).toContain('confirmed at the end of Stage 1');
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
