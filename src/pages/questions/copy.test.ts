import { describe, expect, it } from 'vitest';
import { INTRO, QUESTIONS, RING } from './copy';
import { COMMISSION_BUDGET_POSITION, STAGE_1_CREDIT, STAGE_1_FEE } from '../../ui/priceCopy';
import { CONTACT } from '../../data/config';

const allCopy = [
  INTRO.eyebrow,
  INTRO.title,
  INTRO.standfirst,
  ...QUESTIONS.flatMap((item) => [item.q, ...item.a]),
  RING.q,
  RING.first,
  RING.study,
  RING.next,
].join(' ');

describe('questions copy', () => {
  it('uses the site punctuation register', () => {
    expect(allCopy).not.toMatch(/[—–]/);
  });

  it('withholds an indicative budget, and the only figure it states is the Stage 1 fee', () => {
    // AMENDED 2026-08-04 (Clay): the Stage 1 fee is published again (£20,000, credited against
    // the design and engineering commission). The commission itself still carries no figure, so
    // the guard moved from "no £ at all" to the PROPERTY that survives fee changes: every
    // £-figure in this answer IS the Stage 1 fee, and the credit term travels with it.
    const cost = QUESTIONS.find((item) => item.id === 'cost')!.a.join(' ');
    expect(cost).toContain(COMMISSION_BUDGET_POSITION);
    expect(cost).toContain(STAGE_1_FEE);
    expect(cost).toContain(STAGE_1_CREDIT);
    const figures = cost.match(/£[\d,]+/g) ?? [];
    expect(figures.length).toBeGreaterThan(0);
    expect(new Set(figures)).toEqual(new Set([STAGE_1_FEE]));
    expect(cost).not.toContain('£350,000');
    expect(cost).not.toContain('£18,000');
    expect(cost).toContain('paid feasibility study');
    // 'engineering route' left with the old COMMISSION_STATEMENT (2026-08-05, Clay's rewording);
    // the position it pinned — no figure before the testing — is COMMISSION_BUDGET_POSITION,
    // asserted above by the constant itself.
  });

  it('answers built status, public use, weather, planning and scale plainly', () => {
    // LITERALS UPDATED 2026-08-05 with the plain-register rewrite (Clay: beautiful and deliberate,
    // no committee vocabulary). Each pin is the presence half of a fact the answer must keep
    // carrying, whatever its phrasing does next; the waterproof answer's full shape (default
    // first, engineered option with its cost) is pinned in houseRules.test.ts.
    for (const id of ['built-status', 'public-programmes', 'waterproof', 'planning', 'size']) {
      expect(QUESTIONS.some((item) => item.id === id), `missing ${id}`).toBe(true);
    }
    expect(allCopy).toContain('Not yet.');
    expect(allCopy).toContain('open garden building');
    // Public use: the duties are named in plain words and none of them is promised.
    expect(allCopy).toContain('level ways in, safe ways out');
    // Size: still no capacity figure invented here — the range is stated as rooms, not heads.
    expect(allCopy).toContain('decide the structure, the planning route and the cost');
  });

  it('does not assume permitted development or a settled foundation route', () => {
    expect(allCopy.toLowerCase()).not.toContain('permitted development');
    // The lawn answer may not name a method (ground screws belong to the arguing pages); what it
    // must say instead is that the ground decides and Stage 1 is where it is decided.
    expect(allCopy).toContain('we will not promise a method before we have walked the ground');
    expect(allCopy.toLowerCase()).not.toContain('ground screw');
  });

  it('provides the named domain contact and a paid-feasibility next step', () => {
    expect(CONTACT.email).toBe('clay@bowerbuild.org');
    expect(allCopy).toContain('paid feasibility study');
    expect(allCopy).not.toContain('gmail.com');
  });
});
