import { describe, expect, it } from 'vitest';
import { resolveSnapStrength } from './usePageSnap';

describe('responsive page snapping', () => {
  it('keeps the desktop rule while allowing a firmer mobile rule', () => {
    expect(resolveSnapStrength('proximity', 'mandatory', false)).toBe('proximity');
    expect(resolveSnapStrength('proximity', 'mandatory', true)).toBe('mandatory');
  });

  it('uses the same mandatory rhythm at every size by default', () => {
    expect(resolveSnapStrength('mandatory', undefined, false)).toBe('mandatory');
    expect(resolveSnapStrength('mandatory', undefined, true)).toBe('mandatory');
  });
});
