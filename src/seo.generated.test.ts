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

  it('lists exactly the public routes, on the www origin', () => {
    const xml = sitemapXml();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toEqual(PUBLIC_ROUTES.map((p) => SITE_ORIGIN + p));
    // The count is pinned as a literal ALONGSIDE the equality above, not instead of it: the
    // equality alone would pass if PUBLIC_ROUTES silently lost a page, since both sides move
    // together. `/houses` joined on 2026-07-31.
    expect(locs).toHaveLength(PUBLIC_ROUTES.length);
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
    // `houses` left 2026-08-04 (dev-only, mirror ungenerated); `press` joined the same day.
    // `commissions` left 2026-09-03 (dev-only, same reason).
    const PUBLISHED = ['home', 'gallery', 'process', 'contact', 'press', 'privacy', 'questions', 'about', 'practice'];
    for (const md of PUBLISHED) {
      expect(robots).toContain(`/agent/${md}.md`);
    }
    // AND THE OTHER DIRECTION, ADDED 2026-09-03 AFTER GATING `/commissions`. The list above only
    // catches a mirror that is published and unlisted; the failure that actually happened was the
    // mirror image of it — `public/agent/commissions.md` was deleted and robots.txt, index.html's
    // <noscript> block and llms.txt all went on advertising it, which is a 404 handed to exactly
    // the non-JavaScript readers those lists exist to serve. Every `/agent/*.md` robots.txt names
    // must be a file that is actually there.
    for (const [, name] of robots.matchAll(/\/agent\/([a-z-]+)\.md/g)) {
      expect(PUBLISHED, `robots.txt advertises /agent/${name}.md, which is not published`).toContain(name);
    }
  });
});
