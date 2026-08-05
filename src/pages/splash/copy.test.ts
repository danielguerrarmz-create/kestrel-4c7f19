import { describe, expect, it } from 'vitest';
import { APPLY_CTA, ritualSteps } from './copy';

describe('home commissioning copy', () => {
  it('uses five honest commissioning stages', () => {
    const steps = ritualSteps();
    expect(steps).toHaveLength(5);
    expect(steps.map((step) => step.n)).toEqual(['1', '2', '3', '4', '5']);
    expect(steps.map((step) => step.text).join(' ')).toContain('Feasibility');
    expect(steps.map((step) => step.text).join(' ')).toContain('Growth and stewardship');
    expect(steps.map((step) => step.text).join(' ')).not.toMatch(/[—–]/);
  });

  it('uses the requested founding-commission action', () => {
    // FOUNDING_COHORT_LINE's assertions left with the constant (2026-08-05): the sentence it fed
    // was cut from the close, and the constant itself had been an orphan rendering nowhere.
    expect(APPLY_CTA).toBe('Discuss a founding commission');
  });
});
