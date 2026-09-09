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
    expect(html).toContain('Estates · Gardens · Cultural landscapes');
    // "Hotels" was the fourth segment until 2026-09-09 (Clay). Beside Estates and Cultural
    // landscapes it recalibrated the whole list downward: a foundation reading it now knew it was
    // being sorted alongside hospitality procurement. Pinned absent because a segment list is
    // exactly the thing a later pass "completes".
    expect(html).not.toContain('Hotels');
    expect(html).toContain('Founding commissions · 2027');
    expect(html).toContain('id="meaning"');
  });

  it('makes the commissioning action and the first appointment visible', () => {
    expect(html).toContain('The first three landscapes will decide what a Bower is.');
    /**
     * THE CLOSE NO LONGER GRADES A LANDSCAPE IT HAS NOT SEEN (2026-09-09, Clay). It read "The
     * first Bowers will be made for three spectacular landscapes." Three is a real capacity limit
     * and stays; "spectacular" was praising the reader's garden sight-unseen, in the largest type
     * on the site, and the passive voice left nobody in the sentence to do the praising. The line
     * that replaced it makes the same offer as authorship rather than as scarcity: what a founding
     * client buys is a hand in defining the type, which is the one thing a fourth client cannot.
     *
     * Pinned as an absence too, because an adjective is the easiest thing in the world to put back.
     */
    expect(html).not.toContain('spectacular');
    expect(html).toContain('Discuss a founding commission');
    /**
     * NO FIGURE ON THE HOME (2026-09-09, Clay) — and this is a repaired guard, not a new rule.
     *
     * The band carried "Founding Site Study · Four weeks · £45,000 GBP plus approved travel and
     * project expenses", and the three lines that stood here pinned all of it PRESENT. But the
     * ruling of 2026-08-03 — still quoted verbatim in HeroReveal.tsx, that clientele at this range
     * care less about what one costs — was never rescinded. The 2026-09-03 rewrite re-derived this
     * file from "the page as it actually renders", and a pin taken from a page cannot defend a
     * decision the page has drifted away from. It inverted the guard while staying green.
     *
     * Expressed as the PROPERTY, not as not.toContain('£45,000 GBP'): the next change of fee would
     * disarm that literal and leave it passing, which is the failure mode this repo keeps finding.
     * /questions owns the price, and the head layer is pinned figure-free in seo.test.ts already.
     */
    expect(html).not.toMatch(/£s?[d,]/);
    expect(html).not.toMatch(/d{1,3},d{3}/);
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
    /**
     * THE THIRD MOVEMENT IS THE PICTURE ALONE (2026-09-09, Clay). Its heading was pinned in the
     * list below and its paragraph was never pinned at all. Both are gone: the heading argued
     * ("cannot simply be purchased and placed") against a proposition no reader had made, and the
     * paragraph graded the practice's own work ("more extraordinary"). Pinned as absences, because
     * a silent movement is the single easiest thing for a later copy pass to fill back in.
     */
    expect(html).not.toContain('cannot simply be purchased');
    expect(html).not.toContain('more extraordinary');
    for (const line of [
      'A Bower begins when building ends.',
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
    /**
     * THE DISCLOSURE MOVED OUT OF THE CAPTIONS AND INTO THE ALT TEXT (2026-09-09, Clay).
     *
     * The visible captions read "Unbuilt concept visualisation" and "A garden room in use ·
     * Concept visualisation". Repeated under every plate, a true statement starts working as a
     * disclaimer, and a disclaimer reads as a practice apologising for having built nothing yet.
     * The honesty is not negotiable and has not moved far: every render still declares itself in
     * its alt text, which is what a screen reader announces, and /questions 07 states it plainly
     * once in prose. What went is the drumbeat, not the fact.
     */
    expect(html).toContain('Concept visualisation of a planted timber Bower occupying a misted valley at dawn');
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
  it('does not pin its reach to one country', () => {
    /**
     * THE HOME NO LONGER STATES ITS REACH AT ALL (2026-09-09, Clay). "Bower · Working across
     * Europe" was pinned present on this line; the whole band is gone. The absences below are the
     * half that still matters, and they are why this test survives the line it was written for:
     * the home may not re-acquire an England frame by any wording.
     *
     * The positive fact lives on /about/practice ("Bower · Based in England · Working across
     * Europe", PracticeEditorial.tsx) and in the contact form's project-location and time-zone
     * fields. If that band ever comes off /about/practice, the reach is stated nowhere.
     */
    expect(html).not.toContain('Working internationally');
    expect(html).not.toContain('English valley');
    expect(html).not.toContain('Based in England');
    // The valley caption is two spans now: the place at the left, the light at the right.
    expect(html).toContain('Valley at dawn');
    expect(html).toContain('Morning mist');
    expect(html).not.toContain('Unbuilt concept visualisation');
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
