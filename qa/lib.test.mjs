/**
 * qa/lib.test.mjs — the ready-gate's budget arithmetic.
 *
 * This file exists because of a specific failure, and the failure is worth stating so nobody
 * "simplifies" the cap back out. `waitForReady` shares one budget across three waits. Step 2 (lazy
 * images) used to be handed `timeoutMs - elapsed`, i.e. ALL of it. On the About page 47 lazy
 * off-screen images never complete, so step 2 burned the whole 45s. Step 3's loop was then guarded
 * by `Date.now() - t0 < timeoutMs`, which was already false, so its body ran ZERO times, `seen`
 * kept its initialiser, and the probe threw "only 0/4 garland bitmaps painted in 45s".
 *
 * Nothing was broken. 4-5 blobs were on the page and no request 404'd. The zero was never a
 * measurement — it was an initialiser wearing a measurement's error message, and it read as a
 * confident, specific fact about the page. That is the class of bug these assertions pin:
 * an instrument reporting a number it never took.
 */
import { describe, expect, it } from 'vitest';

import { IMAGE_WAIT_CAP_MS, imageWaitMs } from './lib.mjs';

describe('imageWaitMs: step 2 cannot starve step 3', () => {
  it('THE REGRESSION: never returns the whole budget, however early it is called', () => {
    // The old code was `Math.max(5000, timeoutMs - elapsed)`, which at elapsed=0 is the entire
    // 45s. This is the single assertion that would have caught it.
    expect(imageWaitMs(45000, 0)).toBeLessThan(45000);
    expect(imageWaitMs(45000, 0)).toBe(IMAGE_WAIT_CAP_MS);
  });

  it('leaves the majority of the budget for the poll that actually measures', () => {
    const timeoutMs = 45000;
    expect(timeoutMs - imageWaitMs(timeoutMs, 0)).toBeGreaterThan(timeoutMs / 2);
  });

  it('is capped no matter how large the total budget grows', () => {
    for (const total of [10_000, 45_000, 120_000, 600_000]) {
      expect(imageWaitMs(total, 0)).toBeLessThanOrEqual(IMAGE_WAIT_CAP_MS);
    }
  });

  it('yields to what is actually left once the budget is nearly spent', () => {
    expect(imageWaitMs(45000, 41000)).toBe(4000);
  });

  it('never returns zero or negative, even past the deadline', () => {
    // Puppeteer reads 0 as "no timeout" and would hang forever, which is the same bug wearing a
    // different hat: a wait that never ends is also a measurement that never happens.
    for (const elapsed of [45000, 50000, 1e9]) {
      expect(imageWaitMs(45000, elapsed)).toBeGreaterThan(0);
    }
  });

  it('honours an explicit cap', () => {
    expect(imageWaitMs(45000, 0, 2000)).toBe(2000);
  });
});
