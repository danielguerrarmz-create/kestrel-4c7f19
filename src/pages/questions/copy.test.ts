import { describe, expect, it } from 'vitest';
import { INTRO, QUESTIONS, RING } from './copy';
import { COMMISSION_BUDGET_POSITION } from '../../ui/priceCopy';
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

  it('withholds an indicative budget until engineering establishes a project range', () => {
    const cost = QUESTIONS.find((item) => item.id === 'cost')!.a.join(' ');
    expect(cost).toContain(COMMISSION_BUDGET_POSITION);
    expect(cost).not.toMatch(/£\s?\d/);
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
