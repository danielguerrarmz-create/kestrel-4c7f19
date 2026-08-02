import { describe, it, expect } from 'vitest';
import {
  ritualSteps,
  ritualCompact,
  STAYS_THE_SAME,
  PD_FACT,
  APPLY_CTA,
  FOUNDING_COHORT,
  FOUNDING_COHORT_LINE,
} from './copy';
import { runEngine } from '../../engine';
import type { DesignParams } from '../../engine/types';
import { ENVELOPE } from '../../data/config';

const DASHES = /[—–]/; // em dash, en dash: never allowed in on-screen copy

const defaults: DesignParams = {
  footprintM2: ENVELOPE.footprintM2.default,
  riseM: ENVELOPE.riseM.default,
  strutSpacingM: ENVELOPE.strutSpacingM.default,
  apertureDeg: ENVELOPE.apertureDeg.default,
  speciesId: 'lonicera',
  year: 0,
  jointSystem: ENVELOPE.jointSystem,
};

describe('splash precedent copy (hand-authored, house dash rule)', () => {
  it('the ritual is five steps, each one fact, none of them jargon', () => {
    const steps = ritualSteps();
    expect(steps).toHaveLength(5);
    // STEP 3 NO LONGER STATES A FABRICATION METHOD (2026-08-01, Clay: "I don't think that is true
    // and I would prefer to not list it as such"). It read "Flat timber components, CNC-cut",
    // which described the DEV-ONLY ENGINE's model of how a Bower is made as though it were how a
    // commission is actually built — and nothing has been built. Pinned absent here, and swept
    // across every rendered page by `houseRules.test.ts`.
    expect(steps[2].text).not.toMatch(/\bCNC\b/i);
    expect(steps[2].text).not.toContain('Flat timber components');
    // CUT 2026-07-23 (subtraction pass): "from the live cut list" is engine vocabulary on a
    // page whose reader cannot see the engine, and "no wet trades" is trade jargon. Pinned as
    // absences so they cannot drift back in.
    expect(steps[2].text).not.toContain('live cut list');
    expect(steps[3].text).not.toContain('wet trades');
    // No step may outgrow a glance: one line, one fact.
    for (const step of steps) {
      expect(step.text.split(/\s+/).length, `step ${step.n} is a sentence, not a step`).toBeLessThanOrEqual(8);
      expect(step.text).not.toMatch(DASHES);
    }
  });

  /**
   * THE SCARCITY LINE IS THE ONLY COPY ON THIS SITE THAT EXPIRES BY ITSELF.
   *
   * Everything else stays true until someone changes it. "Four founding studies are available for
   * autumn 2026" stops being a forward-looking offer when autumn 2026 ends, whether or not anyone
   * edits this repo — and a stale scarcity claim is worse than none, because it is the one sentence
   * a returning reader remembers and checks.
   *
   * So this test is a DELIBERATE TRIPWIRE rather than a flake: it will start failing on its own,
   * and that is the feature. When it does, the fix is to update `FOUNDING_COHORT` or remove the
   * line, not to widen the assertion.
   *
   * WHAT IT CANNOT GUARD: the COUNT. "Four are available" goes false the moment a fourth is
   * accepted, and nothing in this repo can know that. Only Clay can, and that is written into the
   * constant's own comment because there is no test that will ever say it.
   */
  it('the founding cohort has not silently expired', () => {
    const thisYear = new Date().getFullYear();
    expect(
      FOUNDING_COHORT.studyYear,
      `the home offers studies for ${FOUNDING_COHORT.studySeason} ${FOUNDING_COHORT.studyYear}, which is in the past — update FOUNDING_COHORT or remove the line`,
    ).toBeGreaterThanOrEqual(thisYear);
    // The build year must follow the study year, or the offer describes a sequence that runs
    // backwards.
    expect(FOUNDING_COHORT.commissionYear).toBeGreaterThanOrEqual(FOUNDING_COHORT.studyYear);
  });

  it('the scarcity line spells its numbers, and they match the constants', () => {
    // Both figures are interpolated from `FOUNDING_COHORT` through a word map, so a bare digit in
    // the rendered line means the map lost an entry and fell through to `undefined`.
    expect(FOUNDING_COHORT_LINE).not.toMatch(/undefined/);
    expect(FOUNDING_COHORT_LINE).not.toMatch(/\b\d\b/); // no bare single digit; years are fine
    expect(FOUNDING_COHORT_LINE).toContain(String(FOUNDING_COHORT.studyYear));
    expect(FOUNDING_COHORT_LINE).toContain(String(FOUNDING_COHORT.commissionYear));
    expect(FOUNDING_COHORT_LINE).not.toMatch(DASHES);
  });

  it('the primary action names what is applied FOR, not the act of registering', () => {
    // Clay, 2026-08-01: "Register interest" is too passive. Pinned as an absence so a later pass
    // cannot quietly demote the ask back to joining a mailing list.
    expect(APPLY_CTA).toMatch(/^Apply for/);
    expect(APPLY_CTA.toLowerCase()).not.toContain('register interest');
    expect(APPLY_CTA).not.toMatch(DASHES);
  });

  it('the compact recap carries no component count and stays clean', () => {
    // It inlined "~217 components, CNC-cut" until 2026-08-01. The count went with the fabrication
    // claim, because a component count IS a statement about how the thing is made — and the more
    // checkable half of it, against an object nobody has built.
    const line = ritualCompact(217);
    expect(line).not.toContain('217');
    expect(line).not.toContain('components');
    expect(line).not.toMatch(/\bCNC\b/i);
    expect(line).not.toMatch(DASHES);
  });

  it('the what-stays-the-same strip and the PD fact are clean', () => {
    for (const s of [STAYS_THE_SAME.keeps, STAYS_THE_SAME.adds, PD_FACT]) {
      expect(s).not.toMatch(DASHES);
    }
    expect(PD_FACT).toContain('permitted development');
    // The height reads live off the grammar's PD cap (2.5 m), never a hardcoded promise.
    expect(PD_FACT).toContain('2.5 m');
  });
});

describe('ritual figures come from the engine, not hardcoded', () => {
  it('the default design exposes the production figures the ritual reuses', () => {
    const { components, buildPlan } = runEngine(defaults);
    expect(components.totalCount).toBeGreaterThan(0);
    expect(Number.isInteger(components.totalCount)).toBe(true);
    expect(buildPlan.leadTimeWeeks).toBeGreaterThan(0);
    /**
     * THE COMPONENT COUNT IS NO LONGER PRINTED ANYWHERE PUBLIC (2026-08-01).
     *
     * It rode the compact recap ("~217 components, CNC-cut") after moving off step 3, and both
     * came out with the fabrication claim: a component count is the same kind of statement about
     * how the thing is made, and it is the more checkable half of it.
     *
     * The engine assertions above STAY, and that is the point of keeping this test. They check the
     * engine still computes a real count and lead time, which is what the dev-only studio surfaces
     * render. What is asserted now is that the public recap does NOT carry it — so if someone
     * reinstates the number here, this fails rather than the change passing silently.
     */
    const recap = ritualCompact(components.totalCount);
    expect(recap).not.toContain(`${components.totalCount}`);
    expect(recap).not.toMatch(/\bCNC\b/i);
    expect(recap).not.toContain('components');
  });
});
