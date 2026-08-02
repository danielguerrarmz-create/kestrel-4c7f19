import { describe, it, expect } from 'vitest';
import { ritualSteps, ritualCompact, STAYS_THE_SAME, PD_FACT } from './copy';
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
