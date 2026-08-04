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
    expect(cost).toContain('engineering route');
  });

  it('answers built status, public use, weather, planning and scale plainly', () => {
    for (const id of ['built-status', 'public-programmes', 'waterproof', 'planning', 'size']) {
      expect(QUESTIONS.some((item) => item.id === id), `missing ${id}`).toBe(true);
    }
    expect(allCopy).toContain('Not yet.');
    expect(allCopy).toContain('open garden building');
    expect(allCopy).toContain('accessibility, fire safety, escape');
    expect(allCopy).toContain('Scale, span and occupancy');
  });

  it('does not assume permitted development or a settled foundation route', () => {
    expect(allCopy.toLowerCase()).not.toContain('permitted development');
    expect(allCopy).toContain('foundation and access strategy is developed for the particular site');
  });

  it('provides the named domain contact and a paid-feasibility next step', () => {
    expect(CONTACT.email).toBe('clay@bowerbuild.org');
    expect(allCopy).toContain('paid feasibility study');
    expect(allCopy).not.toContain('gmail.com');
  });
});
