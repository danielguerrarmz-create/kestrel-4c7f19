import { describe, expect, it } from 'vitest';
import { INTRO, QUESTIONS, RING } from './copy';
import { FOUNDING_SITE_STUDY_FEE } from '../../ui/priceCopy';
import { CONTACT } from '../../data/config';

const allCopy = [
  INTRO.eyebrow,
  INTRO.title,
  INTRO.standfirst,
  ...QUESTIONS.flatMap((item) => [item.q, ...item.a]),
  RING.q,
  RING.opening,
  RING.first,
  RING.appointment,
  RING.leadIn,
  ...RING.deliverables,
  RING.conclusion,
].join(' ');

describe('questions copy', () => {
  it('uses the site punctuation register', () => {
    expect(allCopy).not.toMatch(/[—–]/);
  });

  it('publishes the standalone Founding Site Study fee and no construction figure', () => {
    const cost = QUESTIONS.find((item) => item.id === 'cost')!.a.join(' ');
    expect(cost).toContain(FOUNDING_SITE_STUDY_FEE);
    expect(cost).toContain('four-week Founding Site Study');
    expect(cost).toContain('plus approved travel and project expenses');
    expect(cost).toContain('Tax treatment is confirmed according to the client and project location.');
    expect(cost).toContain('half payable on appointment');
    const figures = cost.match(/£[\d,]+/g) ?? [];
    expect(figures.length).toBeGreaterThan(0);
    expect(new Set(figures)).toEqual(new Set([FOUNDING_SITE_STUDY_FEE]));
    expect(cost).not.toContain('£350,000');
    expect(cost.toLowerCase()).not.toContain('credited');
    expect(cost).toContain('appointed separately');
  });

  it('answers built status, public use, weather, planning and scale plainly', () => {
    // LITERALS UPDATED 2026-08-05 with the plain-register rewrite (Clay: beautiful and deliberate,
    // no committee vocabulary). Each pin is the presence half of a fact the answer must keep
    // carrying, whatever its phrasing does next; the waterproof answer's full shape (default
    // first, engineered option with its cost) is pinned in houseRules.test.ts.
    for (const id of ['built-status', 'public-programmes', 'waterproof', 'international', 'planning', 'size']) {
      expect(QUESTIONS.some((item) => item.id === id), `missing ${id}`).toBe(true);
    }
    expect(allCopy).toContain('Not yet.');
    expect(allCopy).toContain('open garden building');
    // Public use: the duties are named in plain words and none of them is promised.
    expect(allCopy).toContain('level ways in, safe ways out');
    // Size: still no capacity figure invented here — the range is stated as rooms, not heads.
    expect(allCopy).toContain('decide the structure, the planning route and the cost');
    // REACH, REPINNED 2026-09-03 for the European outreach. The old literal was 'considers
    // commissions internationally', and the rewrite deleted it on purpose — "considers" was the
    // hedge that told a patron in Navarra they were the exception. Two pins now, because the
    // answer has to keep BOTH halves: Europe stated as ordinary work, and an honest weaker verb
    // still holding the door open past it.
    expect(allCopy).toContain('works across Europe');
    expect(allCopy).toContain('commissions further afield');
    // APPROVALS: England must never be the only jurisdiction the answer addresses. Pinned as the
    // elsewhere-clause rather than as the old 'equivalent local approvals' wording, so a rephrase
    // of the sentence cannot quietly leave a reader outside England unanswered.
    expect(allCopy).toContain('the local equivalent');
  });

  it('does not assume permitted development or a settled foundation route', () => {
    expect(allCopy.toLowerCase()).not.toContain('permitted development');
    // The lawn answer may not name a method (ground screws belong to the arguing pages); what it
    // must say instead is that the ground decides and Stage 1 is where it is decided.
    expect(allCopy).toContain('we will not promise a method before walking the ground');
    expect(allCopy.toLowerCase()).not.toContain('ground screw');
  });

  it('provides the named domain contact and a Founding Site Study next step', () => {
    expect(CONTACT.email).toBe('clay@bowerbuild.org');
    expect(allCopy).toContain('four-week Founding Site Study');
    expect(RING.deliverables).toHaveLength(6);
    expect(allCopy).not.toContain('gmail.com');
  });

  it('does not publish the withdrawn stewardship percentage', () => {
    expect(allCopy).not.toContain('6 to 10%');
    expect(allCopy).toContain('separately priced three-year stewardship plan');
  });
});
