import { describe, it, expect } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { sitemapXml, SITE_ORIGIN } from './seo';
import { ENGINE_ROUTES, DEV_ONLY_ROUTES, PUBLIC_ROUTES } from './routing';

/**
 * `public/sitemap.xml` is BOTH generated and drift-guarded here — the agentMirror.generated
 * pattern applied to the sitemap, for the same reason: a hand-maintained list of URLs is a list
 * of URLs that used to be true.
 *
 *   npm test                            → asserts the committed sitemap equals a fresh render
 *   GEN=1 npx vitest run seo.generated  → REWRITES it from PUBLIC_ROUTES
 *
 * The invariant that matters most is the last test in this file: no dev-only route may appear.
 * `https://www.bowerbuild.org/sitemap.xml` returned 404 until 2026-07-28, so this is a new file
 * and the first thing it could get wrong is inviting Google to crawl the engine, which Daniel
 * took off the live site on 2026-07-21.
 */
const SITEMAP = fileURLToPath(new URL('../public/sitemap.xml', import.meta.url));
const ROBOTS = fileURLToPath(new URL('../public/robots.txt', import.meta.url));

describe('the sitemap is fresh', () => {
  it('the committed sitemap is byte-identical to a fresh render', () => {
    if (process.env.GEN) {
      writeFileSync(SITEMAP, sitemapXml());
      return;
    }
    expect(
      readFileSync(SITEMAP, 'utf8'),
      'public/sitemap.xml is stale — regenerate: GEN=1 npx vitest run seo.generated',
    ).toBe(sitemapXml());
  });

  it('lists exactly the six public routes, on the www origin', () => {
    const xml = sitemapXml();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toEqual(PUBLIC_ROUTES.map((p) => SITE_ORIGIN + p));
    // The count is pinned as a literal ALONGSIDE the equality above, not instead of it: the
    // equality alone would pass if PUBLIC_ROUTES silently lost a page, since both sides move
    // together. `/houses` joined on 2026-07-31.
    expect(locs).toHaveLength(6);
    // The apex 308-redirects to www, so an apex URL in a sitemap is a URL that only ever
    // redirects. Pinned as an absence because it is the easy mistake.
    for (const loc of locs) expect(loc.startsWith('https://www.bowerbuild.org')).toBe(true);
    expect(xml).not.toContain('https://bowerbuild.org');
  });

  it('NEVER lists an engine or otherwise dev-only route', () => {
    const xml = sitemapXml();
    for (const path of [...ENGINE_ROUTES, ...DEV_ONLY_ROUTES]) {
      expect(xml, `${path} must not be advertised to crawlers`).not.toContain(`${path}<`);
    }
  });

  it('robots.txt points at the sitemap, at the same absolute URL', () => {
    const robots = readFileSync(ROBOTS, 'utf8');
    expect(robots).toContain(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`);
    // A sitemap nothing references is a sitemap nothing finds.
    expect(robots).toMatch(/^User-agent: \*$/m);
    expect(robots).toMatch(/^Allow: \/$/m);
    // Every published mirror is named, so adding a page cannot silently leave one unlisted.
    for (const md of ['home', 'houses', 'gallery', 'questions', 'about', 'practice']) {
      expect(robots).toContain(`/agent/${md}.md`);
    }
  });
});
