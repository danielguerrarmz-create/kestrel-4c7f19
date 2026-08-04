import { describe, expect, it } from 'vitest';
import { APPLY_CTA, FOUNDING_COHORT_LINE, ritualSteps } from './copy';

describe('home commissioning copy', () => {
  it('uses five honest commissioning stages', () => {
    const steps = ritualSteps();
    expect(steps).toHaveLength(5);
    expect(steps.map((step) => step.n)).toEqual(['1', '2', '3', '4', '5']);
    expect(steps.map((step) => step.text).join(' ')).toContain('Feasibility');
    expect(steps.map((step) => step.text).join(' ')).toContain('Growth and stewardship');
    expect(steps.map((step) => step.text).join(' ')).not.toMatch(/[—–]/);
  });

  it('uses the requested founding-commission action without artificial scarcity', () => {
    expect(APPLY_CTA).toBe('Discuss a founding commission');
    expect(FOUNDING_COHORT_LINE).toContain('paid feasibility studies');
    expect(FOUNDING_COHORT_LINE).toContain('2027');
    expect(FOUNDING_COHORT_LINE).not.toMatch(/available|only|limited/i);
  });
});
