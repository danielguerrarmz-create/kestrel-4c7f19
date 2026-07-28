import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { HeroReveal, heroMode } from './HeroReveal';
import { runEngine } from '../../engine';
import { ENVELOPE } from '../../data/config';
import type { DesignParams } from '../../engine/types';

const defaults: DesignParams = {
  footprintM2: ENVELOPE.footprintM2.default,
  riseM: ENVELOPE.riseM.default,
  strutSpacingM: ENVELOPE.strutSpacingM.default,
  apertureDeg: ENVELOPE.apertureDeg.default,
  speciesId: 'lonicera',
  year: 0,
  jointSystem: ENVELOPE.jointSystem,
};

describe('heroMode (fallback decision, 3D reveal tabled)', () => {
  it('server (no window) -> poster (finished markup, copy present)', () => {
    expect(heroMode({ isBrowser: false, reduced: false })).toBe('poster');
  });

  it('reduced motion -> static (finished still, no growth)', () => {
    expect(heroMode({ isBrowser: true, reduced: true })).toBe('static');
  });

  it('browser + motion allowed -> reveal (copy grows in after the intro veil lifts)', () => {
    expect(heroMode({ isBrowser: true, reduced: false })).toBe('reveal');
  });
});

describe('HeroReveal SSR (finished still + copy visible)', () => {
  const outputs = runEngine(defaults);
  const html = renderToString(createElement(HeroReveal, { outputs, reduced: false }));

  it('centres the still, and does NOT pin its bottom edge (2026-07-23)', () => {
    /**
     * Clay, on a 1339x663 window: "the bower ... sits way too high up." The cause was
     * `object-bottom` — it pinned the photo's bottom edge, so a window wider than the photo
     * cropped all the overflow off the TOP and slid the pavilion up (measured: 135px above the
     * frame's centre). The fix moved the pavilion to the MASTER's own vertical centre (340px
     * trimmed off the original's bottom), which makes `cover`'s default 50% 50% correct at every
     * window aspect — verified 0px offset at 1339x663, 1440x900, 1920x700 and 390x844.
     *
     * Pinned as an ABSENCE because the failure mode is a well-meaning restoration: `object-bottom`
     * reads like a sensible thing to want on a full-bleed hero, and re-adding it silently
     * un-centres the product on every short window again. Any object-position override is wrong
     * here; re-crop the master instead.
     */
    expect(html).toContain('object-cover');
    expect(html).not.toContain('object-bottom');
    expect(html).not.toContain('object-top');
  });

  it('renders the outcome copy with the product word "Bower", over the beauty still', () => {
    expect(html).toContain('Grow a living');
    // ONE NAME (2026-07-23): the hand-lettered display word was "Eden" until Clay retired the
    // two-noun split. The headline and the wordmark now say the same thing.
    expect(html).toContain('Bower');
    expect(html).not.toContain('>Eden<');
    expect(html).toContain('in your garden');
    // The subline says the plain thing (2026-07-23): the noun is "pavilions", not
    // "a living structure, computed".
    expect(html).toContain('living garden pavilions');
    // THE HERO'S CTAs MUST NOT POINT AT A GATED ROUTE. It had two, "Shape your Eden" into the
    // studio and "See how it works" into the engine walkthrough; both destinations went dev-only
    // on 2026-07-21 and the pair was removed rather than repointed. A different pair returned on
    // 2026-07-28 against real public pages (/gallery, /questions), so the invariant is not "no
    // CTA" any more, it is "no CTA into something production does not serve".
    expect(html).not.toContain('Shape your Eden');
    expect(html).not.toContain('See how it works');
    // Sweep the hrefs rather than naming the two we happen to remember. UPDATED 2026-07-28: this
    // used to assert `not.toContain('#/studio')`, which after the path migration is a string the
    // page can no longer produce under any bug — a check that cannot fail. The real question is
    // whether every destination is a live public route, and that survives the routing scheme.
    const hrefs = [...html.matchAll(/<a\s[^>]*?href="([^"]*)"/g)].map((m) => m[1]);
    expect(hrefs.length, 'the hero has CTAs again, so this sweep must have something to sweep')
      .toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(['/', '/about', '/gallery', '/questions', '#register']).toContain(href);
    }
    // The 3D reveal is tabled: no three.js canvas is referenced by the hero.
    expect(html).not.toContain('<canvas');
    // The nav lives in the global fixed SplashHeader, not the hero SSR.
    expect(html).not.toContain('the studio');
    // Removed CTAs / stats must not reappear.
    expect(html).not.toContain('Register interest');
    expect(html).not.toContain('See how the engine works');
    expect(html).not.toContain('priced live');
    // The beauty still is present as the hero background.
    expect(html).toContain('/hero/');
    // No em/en dashes in the hero copy (house rule).
    expect(html).not.toMatch(/[—–]/);
  });
});
