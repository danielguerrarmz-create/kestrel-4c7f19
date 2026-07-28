import { describe, it, expect } from 'vitest';
import {
  ENGINE_NAME,
  CTA_PRIMARY_EVALUATOR,
  CTA_PRIMARY_BUYER,
  WORDMARK,
  PRODUCT,
} from './config';

const DASHES = /[—–]/; // em dash, en dash: never allowed in on-screen copy

describe('brand naming constants (chrome reads these, so a rename is one line)', () => {
  it('ENGINE_NAME is the lowercase generic until the naming call lands', () => {
    expect(ENGINE_NAME).toBe('the engine');
  });

  it('both primary CTA labels exist so the post-deadline swap is one line', () => {
    expect(CTA_PRIMARY_EVALUATOR).toBe('See how the engine works');
    expect(CTA_PRIMARY_BUYER).toBe('Shape your Bower');
  });

  it('the company and the object share ONE name (2026-07-23)', () => {
    // Was WORDMARK 'Bower' + PRODUCT 'Eden', the two-noun system confirmed 2026-07-05. Clay
    // retired it because a first-time reader meets one word in the nav and another in the
    // headline with nothing joining them. Pinned as an equality rather than two literals, so
    // the invariant under test is the thing that matters: there is only one name.
    expect(WORDMARK).toBe('Bower');
    expect(PRODUCT).toBe(WORDMARK);
  });

  it('no naming or CTA constant carries an em/en dash', () => {
    for (const s of [ENGINE_NAME, CTA_PRIMARY_EVALUATOR, CTA_PRIMARY_BUYER, WORDMARK, PRODUCT]) {
      expect(s).not.toMatch(DASHES);
    }
  });
});
