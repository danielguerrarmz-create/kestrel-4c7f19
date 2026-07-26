import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { srcSetFor, MAX_SRCSET_W } from './responsiveImg';
import { HERO_STILL } from '../pages/splash/heroStill';
import VARIANTS from '../data/imageVariants.generated.json';

/**
 * WHAT A `srcset` PROMISES, THE REPO MUST ACTUALLY SHIP — and no candidate may be enormous.
 *
 * Written 2026-07-23 after "images aren't loading properly on the homepage". Nothing was 404ing;
 * the home page was fetching a **2,606 KB hero JPEG above the fold** because the variant ladder
 * stopped at 1280 and the only wider candidate was the 5,056px original. "Loads eventually, after
 * two and a half megabytes" is indistinguishable from "broken" to someone watching a blank hero.
 *
 * Both halves below are the CLAUDE.md rule that a relationship load-bearing enough to argue over
 * has to be a test rather than a comment:
 *   1. THE CAP holds, so the gap can never reopen by someone adding a huge source.
 *   2. EVERY promised file exists AND is tracked by git, because a variant that is on my disk and
 *      not in the repo is a 404 for every visitor (the exact trap timeline-photos.test.ts records
 *      for the timeline plates; this generalises it to every responsive image on the site).
 */
const REPO = resolve(__dirname, '../..');
const PUBLIC = resolve(REPO, 'public');
const MANIFEST = VARIANTS as Record<string, { w: number; variants: number[] }>;
const entries = Object.entries(MANIFEST);

/** Every file path a srcset can name, derived the same way `srcSetFor` derives it. */
function candidatePaths(src: string): string[] {
  const set = srcSetFor(src);
  if (!set) return [];
  return set.split(',').map((c) => c.trim().split(/\s+/)[0]);
}

describe('responsive images: the manifest cannot promise what the repo does not ship', () => {
  it('guards the probe: there are sources to check', () => {
    expect(entries.length).toBeGreaterThan(20);
  });

  it('every srcset candidate exists on disk', () => {
    const missing: string[] = [];
    for (const [src] of entries) {
      for (const p of candidatePaths(src)) {
        if (!existsSync(resolve(PUBLIC, p.replace(/^\//, '')))) missing.push(p);
      }
    }
    expect(missing, `srcset names files that do not exist:\n${missing.join('\n')}`).toEqual([]);
  });

  it('every srcset candidate is tracked by git, so it is not a 404 for everyone else', () => {
    // `git ls-files` answers "what does a stranger get when they clone", which is the real
    // question; existsSync answers "what is on MY disk", which is what hides this class of bug.
    const tracked = new Set(
      execFileSync('git', ['ls-files', 'public'], { cwd: REPO, encoding: 'utf8' })
        .split('\n')
        .filter(Boolean),
    );
    const dangling: string[] = [];
    for (const [src] of entries) {
      for (const p of candidatePaths(src)) {
        if (!tracked.has(`public${p}`)) dangling.push(p);
      }
    }
    expect(dangling, `referenced but not committed (these 404 for everyone but you):\n${dangling.join('\n')}`).toEqual([]);
  });
});

describe('no srcset candidate is enormous (the 2026-07-23 hero regression)', () => {
  it('offers nothing wider than the cap', () => {
    for (const [src, entry] of entries) {
      const widths = (srcSetFor(src) ?? '')
        .split(',')
        .map((c) => Number(c.trim().split(/\s+/)[1]?.replace('w', '')))
        .filter(Number.isFinite);
      for (const w of widths) {
        expect(w, `${src} offers a ${w}w candidate, past the ${MAX_SRCSET_W}w cap`).toBeLessThanOrEqual(MAX_SRCSET_W);
      }
      // ...and a source past the cap must not smuggle its original in as the top candidate.
      if (entry.w > MAX_SRCSET_W) {
        expect(srcSetFor(src), `${src} (${entry.w}px natural) still offers its original`).not.toContain(`${src} `);
      }
    }
  });

  it('THE CASE THAT CAUSED THIS: no home-hero candidate is heavy', () => {
    // Read from HERO_STILL rather than hardcoding the path: the hero is versioned (v3 -> v4 on
    // 2026-07-23) and a guard pinned to a retired filename silently stops guarding.
    const hero: string = HERO_STILL.src;
    expect(MANIFEST[hero], `${hero} is not in the variant manifest — run npm run gen:images`).toBeDefined();
    const paths = candidatePaths(hero);
    expect(paths.length, 'the hero offers no candidates').toBeGreaterThan(2);
    // Asserted in BYTES, because the pixel width was never what hurt: v3's 5,056px original was
    // 2,606 KB and the browser took it on any desktop.
    for (const p of paths) {
      const kb = statSync(resolve(PUBLIC, p.replace(/^\//, ''))).size / 1024;
      expect(kb, `${p} is ${Math.round(kb)} KB — too heavy for an above-the-fold hero`).toBeLessThan(900);
    }
  });
});
