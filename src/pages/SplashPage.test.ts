/**
 * SplashPage.test.ts
 *
 * REWRITTEN 2026-09-03. Every assertion in the previous version was written against a home page
 * that no longer exists — "A room the landscape has been waiting for.", a frosted-pill `nav-pill`
 * header, a `Four weeks to know whether a Bower belongs.` band. The page was rewritten into the
 * seven-movement exhibition it is now and the test was not, so it sat 5-of-10 RED in the working
 * tree, which is the state in which a suite stops being read at all. The pins below are taken from
 * the page as it actually renders.
 */
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PUBLIC_ROUTES, routes } from '../routing';
import { HERO_IMAGES, HERO_ROTATION_MS, nextHeroIndex, SplashPage } from './SplashPage';

const html = renderToString(createElement(SplashPage)).replace(/<!-- -->/g, '');

describe('SplashPage', () => {
  it('opens on the product, the audience and the availability', () => {
    expect(html).toContain('Living architecture');
    expect(html).toContain('Buildings that nature designs.');
    expect(html).toContain('We make the structure. The garden makes the rest.');
    expect(html).toContain('Estates · Gardens · Hotels · Cultural landscapes');
    expect(html).toContain('Founding commissions · 2027');
    expect(html).toContain('id="meaning"');
  });

  it('makes the commissioning action and the first appointment visible', () => {
    expect(html).toContain('The first Bowers will be made for three spectacular landscapes.');
    expect(html).toContain('Founding Site Study');
    expect(html).toContain('£45,000 GBP');
    expect(html).toContain('plus approved travel and project expenses');
    expect(html).toContain('Discuss a founding commission');
    expect(html).toContain(`href="${routes.contact}"`);
    expect([...PUBLIC_ROUTES]).toContain(routes.contact);
  });

  it('carries the editorial nav and the routes onward', () => {
    const primary = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
    const links = [...primary.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
    expect(links.length).toBeGreaterThan(0);
    expect(links).toEqual([routes.gallery, routes.process, routes.practice, routes.contact]);
    // Every href the page renders must be a route production actually serves. Expressed as the
    // PROPERTY rather than as `not.toContain('#/studio')`, which the 2026-07-28 path migration
    // turned into an assertion that could no longer fail — see CLAUDE.md on disarmed guards.
    const hrefs = [...html.matchAll(/href="(\/[^"#]*)"/g)].map((match) => match[1]);
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) expect([...PUBLIC_ROUTES], `dead route ${href}`).toContain(href);
  });

  it('moves from the object in time to a controlled decision', () => {
    for (const line of [
      'A Bower begins when building ends.',
      'We create buildings that cannot simply be purchased and placed.',
      'The garden becomes a place to gather.',
      'Every Bower is different.',
      'See how it is made →',
    ]) {
      expect(html).toContain(line);
    }
    expect(html.match(/<section\b/g)).toHaveLength(7);
    expect(html).toContain('/assets/process/evolution/installation.webp');
    expect(html).toContain('/assets/process/evolution/establishing.webp');
    expect(html).toContain('/assets/process/evolution/mature.webp');
    expect(html).toContain('/assets/gallery/week-3/valley-bower-at-dawn.webp');
    expect(html).toContain('/assets/gallery/favorites/timber-joinery-detail.webp');
    for (const step of ['Site', 'Geometry', 'Structure', 'Planting', 'Stewardship']) {
      expect(html).toContain(step);
    }
    for (const caption of ['A lattice', 'Leaves in the weave', 'A room of blossom and eaves']) {
      expect(html).toContain(caption);
    }
  });

  it('labels imagined work honestly and keeps secondary routes in the footer', () => {
    expect(html).toContain('Unbuilt concept visualisation');
    expect(html).toContain('Concept study of a timber lattice joint');
    // The footer row is press / questions / gallery / contact and nothing else (Clay,
    // 2026-09-03). The previous version of this test also demanded `href="/commissions"` here and
    // it had not been true for some time. `/privacy` is deliberately NOT in this row — it is
    // reached from the contact form's own notice link, at the point of collection.
    expect(html).toContain(`href="${routes.press}"`);
    expect(html).toContain(`href="${routes.questions}"`);
    // `/about/practice` reaches the home through the header, not the footer.
    expect(html).toContain(`href="${routes.practice}"`);
  });

  /**
   * THE HOME PAGE MAY NOT PIN ITS REACH TO ONE COUNTRY (2026-09-03, the European patron outreach).
   *
   * The prospect list this was written for is 28 of 30 outside England — Italy, France, Spain,
   * Portugal, Germany, Belgium, Switzerland, the Netherlands, Sweden and Ireland. The home said
   * "Working internationally" beside "Based in England" in the hero, "Bower · Based in England"
   * one screen later, and captioned its most-studied render "English valley". None of it was
   * false; all of it read, to a patron in Gavi or Navarra, as an England programme they would be
   * an exception to.
   *
   * Pinned as ABSENCES because that is the half a copy pass silently reintroduces.
   */
  it('states its reach as Europe, not as England with exceptions', () => {
    // The hero eyebrow carried this too until 2026-09-03 and Clay cut it for length. One statement
    // of the reach on the page, in the band with room for it.
    expect(html).toContain('Bower · Working across Europe');
    expect(html).not.toContain('Working internationally');
    expect(html).not.toContain('English valley');
    expect(html).toContain('Valley at dawn · Morning mist');
  });

  /**
   * THE HERO IS NOT A LINK, AND THE SCROLL CUE IS NOT A WHITE BOX (2026-09-03, Clay).
   *
   * Pinned as absences because both are the kind of thing a later "polish" pass reinstates without
   * knowing why they went. The full-bleed `<a>` made the entire first viewport a click target under
   * a `cursor-zoom-in` that promised a zoom and delivered a navigation, with no visible control and
   * no way out; the cue's `bg-white/95` capsule was UI chrome sitting on a full-bleed photograph.
   */
  it('does not turn the whole first screen into a link or plate the scroll cue', () => {
    expect(html).not.toContain('cursor-zoom-in');
    expect(html).not.toContain('View the full Bower gallery');
    expect(html).not.toContain('bg-white/95');
    // The cue itself survives, and it is still a real anchor to the next band.
    expect(html).toContain('aria-label="Scroll to discover more"');
    expect(html).toContain('href="#meaning"');
    // The gallery keeps a deliberate door in the header rather than an invisible one on the image.
    const primary = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
    expect(primary).toContain(`href="${routes.gallery}"`);
  });
});

describe('homepage hero rotation', () => {
  /**
   * ORDER IS ASSERTED ON THE EXPORTED ARRAY, NOT ON THE RENDERED STRING. Four `toContain` calls
   * prove four images are present and say nothing about which is second, which is exactly the
   * fact under review here.
   */
  it('runs the four frames in order, opening from inside a Bower', () => {
    // Reordered 2026-09-03 (Clay): `garden-performance` moved from second to last, so the rotation
    // runs interior → stained glass → flowering Bower → performance.
    expect(HERO_IMAGES.map((image) => image.src)).toEqual([
      '/assets/gallery/favorites/living-bower-interior.webp',
      '/assets/gallery/week-3/stained-glass-cliff-interior.webp',
      '/assets/gallery/favorites/bower-in-summer-borders.webp',
      '/assets/gallery/favorites/garden-performance.webp',
    ]);
    for (const image of HERO_IMAGES) expect(html).toContain(image.src);
  });

  /**
   * `manor-garden` WAS THE SECOND FRAME AND IS OUT (2026-09-03, Clay: "slightly understated").
   * The previous test pinned it PRESENT — `it('includes the former manor-garden homepage hero')` —
   * so the swap has to retire that pin rather than sit beside it. `heroStill.ts` still references
   * the same file for the dev-only engine reveal; this is a pin on the HOME hero only.
   */
  it('drops the understated manor-garden frame for the flowering Bower', () => {
    expect(HERO_IMAGES.map((image) => image.src)).not.toContain('/hero/v4/manor-garden.webp');
    expect(html).not.toContain('/hero/v4/manor-garden.webp');
    expect(HERO_IMAGES.map((image) => image.src)).toContain('/assets/gallery/favorites/bower-in-summer-borders.webp');
  });

  it('keeps the tall mobile crop on the opening frame only', () => {
    expect(HERO_IMAGES[0]).toHaveProperty('mobileSrc', '/hero/v4/eden-oculus-up-tall.webp');
    expect(HERO_IMAGES.filter((image) => 'mobileSrc' in image)).toHaveLength(1);
  });

  it('advances through the hero images and wraps to the first', () => {
    expect(nextHeroIndex(0)).toBe(1);
    expect(nextHeroIndex(1)).toBe(2);
    expect(nextHeroIndex(2)).toBe(3);
    expect(nextHeroIndex(3)).toBe(0);
  });

  it('changes the image every few seconds', () => {
    expect(HERO_ROTATION_MS).toBeGreaterThanOrEqual(3000);
    expect(HERO_ROTATION_MS).toBeLessThanOrEqual(7000);
  });
});
