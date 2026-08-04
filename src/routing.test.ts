import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import {
  DEV_ONLY_ROUTES,
  ENGINE_ROUTES,
  PUBLIC_ROUTES,
  claimsLink,
  legacyHashRedirect,
  normalizePath,
  resolveRoute,
  routes,
} from './routing';
import { CONTACT } from './data/config';

/**
 * THE PATH MIGRATION (2026-07-28). The site was hash-routed until this change, which meant every
 * page was the same URL to a crawler and to every link unfurler: a fragment is never sent to a
 * server. The tests below cover the three things that migration can break, and each of them
 * breaks silently.
 *
 *   1. PARSING. `/gallery/` and `/gallery` must be one route, or the canonical tag and the router
 *      disagree about which page you are on.
 *   2. THE SHIM. Every link shared while the site was hash-routed is `/#/gallery`. If those stop
 *      resolving, the change costs more traffic than it earns, and nothing in the app would fail.
 *   3. THE CLICK DELEGATE. One document-level handler now decides which anchors the router takes
 *      over. Every case it gets wrong is a link that used to work: `mailto:`/`tel:` (the questions
 *      page's ONLY contact route), a new tab, an in-page anchor, another site.
 */
describe('path parsing', () => {
  it('normalizes the shapes a URL bar and a crawler actually produce', () => {
    expect(normalizePath('/')).toBe('/');
    expect(normalizePath('')).toBe('/');
    expect(normalizePath('/gallery')).toBe('/gallery');
    // A trailing slash is the classic duplicate-URL source. One route, one canonical.
    expect(normalizePath('/gallery/')).toBe('/gallery');
    expect(normalizePath('/lab/gongbi/')).toBe('/lab/gongbi');
    expect(normalizePath('//gallery')).toBe('/gallery');
    expect(normalizePath('gallery')).toBe('/gallery');
    expect(normalizePath('/about/tree/')).toBe('/about/tree');
  });

  it('a trailing slash resolves to the same page, so /gallery/ is not a second page', () => {
    for (const path of PUBLIC_ROUTES) {
      expect(resolveRoute(normalizePath(path + '/'), false)).toBe(resolveRoute(path, false));
    }
  });
});

describe('the legacy hash shim', () => {
  const loc = (hash: string, search = '') => ({ hash, search });

  it('rewrites every link shared while the site was hash-routed', () => {
    expect(legacyHashRedirect(loc('#/'))).toBe('/');
    expect(legacyHashRedirect(loc('#/gallery'))).toBe('/gallery');
    expect(legacyHashRedirect(loc('#/questions'))).toBe('/questions');
    expect(legacyHashRedirect(loc('#/about'))).toBe('/about');
    // The gated families too: they must land on the same place the router would send them,
    // not dead-end on a hash the new router ignores.
    expect(legacyHashRedirect(loc('#/about/tree'))).toBe('/about/tree');
    expect(legacyHashRedirect(loc('#/studio'))).toBe('/studio');
  });

  it('LEAVES A BARE IN-PAGE ANCHOR ALONE, which is the whole reason it checks for `#/`', () => {
    // Rewriting `#register` to `/register` is precisely the old router's behaviour and precisely
    // what this change removes. The home's register anchor, and any future one on any page, is a
    // fragment and must stay a fragment.
    expect(legacyHashRedirect(loc('#register'))).toBeNull();
    expect(legacyHashRedirect(loc('#how-it-works'))).toBeNull();
    expect(legacyHashRedirect(loc('#cost'))).toBeNull();
    expect(legacyHashRedirect(loc('#'))).toBeNull();
    expect(legacyHashRedirect(loc(''))).toBeNull();
  });

  it('keeps a query string whichever side of the hash it sat on', () => {
    // Outside: how the QA probes and the engine's share links are shaped, because
    // `composeDesignUrl` writes the params before the hash.
    expect(legacyHashRedirect(loc('#/about', '?species=spine-2'))).toBe('/about?species=spine-2');
    // Inside: a hand-edited URL.
    expect(legacyHashRedirect(loc('#/studio?a=15.0'))).toBe('/studio?a=15.0');
    // Both, inner wins on a collision, because it travelled with the route.
    expect(legacyHashRedirect(loc('#/studio?a=9', '?a=1&sp=x'))).toBe('/studio?a=9&sp=x');
  });

  it('normalizes on the way through, so the shim cannot mint a duplicate URL', () => {
    expect(legacyHashRedirect(loc('#/gallery/'))).toBe('/gallery');
  });
});

describe('the click delegate decides which links the router takes over', () => {
  const here = 'https://www.bowerbuild.org/gallery';

  it('claims plain in-app links', () => {
    for (const href of ['/', '/about', '/questions', 'https://www.bowerbuild.org/about']) {
      expect(claimsLink({ href }, here)).toBe(true);
    }
  });

  it('NEVER claims mailto: or tel:, the questions page\'s only contact route', () => {
    // If the router swallowed these, the site's single conversion point would stop working and
    // nothing would throw: the click would just navigate to the splash.
    // Bound to CONTACT, not a literal: the address and the number have now BOTH moved (the Gmail
    // to the studio inbox, the US mobile to a UK landline) and a hardcoded copy here would have
    // gone on passing while testing details the site no longer serves. This branch had updated the
    // literals by hand, which fixes the instance and not the class; main's version fixes the class.
    expect(claimsLink({ href: `mailto:${CONTACT.email}` }, here)).toBe(false);
    expect(claimsLink({ href: `tel:${CONTACT.phoneHref}` }, here)).toBe(false);
  });

  it('leaves other origins, new tabs, downloads and rel=external to the browser', () => {
    expect(claimsLink({ href: 'https://github.com/LingDong-/nonflowers' }, here)).toBe(false);
    expect(claimsLink({ href: '/about', target: '_blank' }, here)).toBe(false);
    expect(claimsLink({ href: '/paper.pdf', download: true }, here)).toBe(false);
    expect(claimsLink({ href: '/about', rel: 'noopener external' }, here)).toBe(false);
    // `_self` is explicit "this tab", which is ours.
    expect(claimsLink({ href: '/about', target: '_self' }, here)).toBe(true);
  });

  it('leaves an in-page fragment to the browser, so #register still scrolls', () => {
    expect(claimsLink({ href: '#register' }, 'https://www.bowerbuild.org/')).toBe(false);
    expect(claimsLink({ href: '#how-it-works' }, 'https://www.bowerbuild.org/')).toBe(false);
    expect(claimsLink({ href: '#cost' }, 'https://www.bowerbuild.org/questions')).toBe(false);
    // A fragment on a DIFFERENT page is a real navigation and is ours.
    expect(claimsLink({ href: '/questions#cost' }, here)).toBe(true);
  });
});

/**
 * THE PRODUCTION GATE ON THE ENGINE (2026-07-21).
 *
 * Daniel's ruling: the studio/engine comes off the live site entirely and stays hidden
 * while it is rebuilt. The mechanism is `import.meta.env.DEV`, not deletion, so the ONLY
 * thing standing between a rebuilt-but-unfinished engine and production is this gate.
 * That makes it exactly the kind of invariant CLAUDE.md says must be a test rather than a
 * comment: "a comment cannot fail, it can only be believed."
 *
 * Two halves, because either alone is a proxy:
 *   1. `resolveRoute` is right for both values of `dev` (the truth table).
 *   2. Root is actually WIRED to it, and no engine page is statically imported there
 *      (the wiring). A perfect resolver nobody calls gates nothing, and a static import
 *      would put the engine back in the production bundle even with the routes hidden.
 *
 * Half 2 reads the source rather than rendering, in the same spirit as
 * timeline-photos.test.ts asking `git ls-files` what is really committed: the vitest
 * environment is node with `DEV` true, so a render can only ever exercise the dev branch.
 */
describe('the engine routes are dev-only in production', () => {
  it('every engine route falls through to the splash when dev is false', () => {
    for (const path of ENGINE_ROUTES) {
      expect(resolveRoute(path, false)).toBe('splash');
    }
  });

  it('every engine route still resolves to the engine in dev (the gate is not a deletion)', () => {
    for (const path of ENGINE_ROUTES) {
      expect(resolveRoute(path, true)).toBe('engine');
    }
  });

  it('covers every engine-facing path that has ever been linked', () => {
    // Pinned by name, so removing one from ENGINE_ROUTES (which would ship it) fails here
    // rather than silently going live. `/draw` is the `/studio` alias; the two labs are
    // review surfaces that were never in the nav but are just as unfinished.
    expect([...ENGINE_ROUTES].sort()).toEqual(
      ['/draw', '/engine', '/lab/botanical', '/lab/gongbi', '/sculpt', '/shape', '/studio'].sort(),
    );
  });

  it('the five public pages resolve the same either way', () => {
    for (const dev of [true, false]) {
      expect(resolveRoute('/', dev)).toBe('splash');
      expect(resolveRoute('/about', dev)).toBe('about');
      // The gallery joined the public site 2026-07-23 (Clay's client pass).
      expect(resolveRoute('/gallery', dev)).toBe('gallery');
      // The questions page joined 2026-07-28: the price, the planning position, the contact.
      expect(resolveRoute('/questions', dev)).toBe('questions');
      // The houses page joined 2026-07-31, when the practice repointed at commercial hospitality.
      expect(resolveRoute('/houses', dev)).toBe('houses');
      expect(resolveRoute('/press', dev)).toBe('press');
      // An in-page anchor normalizes to an unknown path and must land on the home, not a blank.
      expect(resolveRoute('/register', dev)).toBe('splash');
      expect(resolveRoute('/how-it-works', dev)).toBe('splash');
    }
  });

  it('routes.* are the paths resolveRoute matches on (they cannot drift)', () => {
    expect(resolveRoute(routes.about, true)).toBe('about');
    expect(resolveRoute(routes.gallery, true)).toBe('gallery');
    expect(resolveRoute(routes.questions, true)).toBe('questions');
    expect(resolveRoute(routes.houses, true)).toBe('houses');
    expect(resolveRoute(routes.press, true)).toBe('press');
    expect(resolveRoute(routes.aboutTree, true)).toBe('aboutTree');
  });

  it('every routes.* value is a real path, not a leftover hash', () => {
    // The migration's own regression: one `#/shape` left in the table would render an href the
    // click delegate reads as an in-page anchor, so the link would silently do nothing.
    for (const [name, href] of Object.entries(routes)) {
      expect(href.startsWith('/'), `routes.${name} = ${href}`).toBe(true);
      expect(href).not.toContain('#');
    }
  });

  it('PUBLIC_ROUTES is exactly the ten that ship, in nav order', () => {
    // The sitemap and the per-page metadata are both built from this list, so it is the one place
    // a page becomes public. Pinned by name so adding one is a deliberate act — which is what it
    // was for: `/houses` joined 2026-07-31 and this assert is where that decision was recorded.
    expect([...PUBLIC_ROUTES]).toEqual(['/', '/commissions', '/gallery', '/process', '/about', '/about/practice', '/contact', '/press', '/questions', '/houses']);
    for (const path of PUBLIC_ROUTES) {
      expect(ENGINE_ROUTES).not.toContain(path);
      expect(DEV_ONLY_ROUTES).not.toContain(path);
      // Public means public in BOTH builds; a route that only resolves in dev is not shippable.
      expect(resolveRoute(path, false)).toBe(resolveRoute(path, true));
    }
  });
});

/**
 * THE HOST CONFIG IS PART OF THE ROUTER NOW, and it is the one piece no unit test would otherwise
 * touch. Under the hash router every URL was `/` and the server needed no configuration at all;
 * with real paths, `https://www.bowerbuild.org/gallery` is a request the host must answer with
 * index.html or the page 404s for everyone who did not arrive via a click. The other half is just
 * as easy to get wrong in the other direction: a catch-all that also swallows `/agent/*.md` or
 * `/sitemap.xml` would serve HTML to exactly the readers those files exist for.
 *
 * Vercel compiles `source` with path-to-regexp and passes a bare regex inside a capture group
 * through, so the same expression can be exercised here.
 */
describe('the Vercel SPA rewrite', () => {
  const cfg = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  const rule = cfg.rewrites[0];
  const re = new RegExp('^' + rule.source + '$');

  it('sends every app route to index.html', () => {
    expect(rule.destination).toBe('/index.html');
    for (const path of [...PUBLIC_ROUTES, ...ENGINE_ROUTES, ...DEV_ONLY_ROUTES, '/typo']) {
      expect(re.test(path), `${path} must serve the app shell`).toBe(true);
    }
  });

  it('does NOT swallow /_vercel/*, or analytics silently records nothing', () => {
    // FOUND BEFORE IT SHIPPED, 2026-07-28. The catch-all rewrite matched
    // `/_vercel/insights/script.js` and `/_vercel/insights/view`, so Vercel Web Analytics would
    // have loaded the SPA shell as its script and posted every pageview into an HTML 200. Nothing
    // would throw, nothing would look broken, and the dashboard would read zero forever — the
    // precise failure mode of a platform path caught by an application catch-all.
    for (const path of [
      '/_vercel/insights/script.js',
      '/_vercel/insights/view',
      '/_vercel/insights/event',
      '/_vercel/speed-insights/script.js',
    ]) {
      expect(re.test(path), `${path} must reach Vercel, not index.html`).toBe(false);
    }
  });

  it('leaves the static files alone, including the ones agents read', () => {
    for (const path of [
      '/assets/index-abc123.js',
      '/assets/social/og-card.jpg',
      '/assets/gallery/01-wisteria-walk.webp',
      '/agent/home.md',
      '/agent/questions.md',
      '/robots.txt',
      '/llms.txt',
      '/sitemap.xml',
      '/favicon.svg',
      '/hero/v3/pavilion.jpg',
      '/fonts/x.woff2',
    ]) {
      expect(re.test(path), `${path} must be served from disk, not rewritten to HTML`).toBe(false);
    }
  });
});

describe('main.tsx installs the router before the first render', () => {
  const main = readFileSync(new URL('./main.tsx', import.meta.url), 'utf8');

  it('calls installRouter()', () => {
    // Without it there is no click delegation (every internal link full-page reloads) and no
    // legacy-hash shim (every link shared before 2026-07-28 lands on the home). Neither throws.
    expect(main).toMatch(/installRouter\(\)/);
  });

  it('calls it BEFORE createRoot(...).render, not inside an effect', () => {
    // Order is the whole point: the shim rewrites `/#/gallery` to `/gallery` in place, and doing
    // that after mount paints the home for a frame first.
    expect(main.indexOf('installRouter()')).toBeLessThan(main.indexOf('.render('));
    expect(main.indexOf('installRouter()')).toBeGreaterThan(-1);
  });
});

/**
 * THE SECOND GATE (2026-07-28): finished pages that are not ready to be seen.
 *
 * `#/about/tree` shipped public on 2026-07-26 linked from no nav surface, which is the failure
 * mode this file exists to prevent one level out: not "an unfinished route leaked", but "a route
 * was public, unreachable, and therefore unreviewed". Clay's call was to gate it. It is a
 * DUPLICATE of `#/about`, so nothing is lost to a reader.
 *
 * Same two halves as the engine gate, for the same reason: the truth table AND the wiring. The
 * wiring half matters more here than it looks, because before this change `AboutTreePage` was a
 * STATIC import in Root — the page was "hidden" while its whole bundle shipped to production.
 */
describe('the about/tree page is dev-only', () => {
  it('falls through to the splash when dev is false', () => {
    for (const path of DEV_ONLY_ROUTES) {
      expect(resolveRoute(path, false)).toBe('splash');
    }
    expect(resolveRoute('/about/tree', false)).toBe('splash');
  });

  it('still resolves in dev (a gate, not a deletion)', () => {
    expect(resolveRoute('/about/tree', true)).toBe('aboutTree');
  });

  it('gating it did not take the real about page with it', () => {
    for (const dev of [true, false]) expect(resolveRoute('/about', dev)).toBe('about');
  });

  it('DEV_ONLY_ROUTES is pinned by name, so removing an entry (which would ship it) fails here', () => {
    expect([...DEV_ONLY_ROUTES]).toEqual(['/about/tree']);
  });

  it('is lazy behind the DEV ternary in Root, so the build folds the tree bundle away', () => {
    const root = readFileSync(new URL('./Root.tsx', import.meta.url), 'utf8');
    expect(root).toContain("import('./pages/about-tree/AboutTreePage')");
    // The bug this pins: a static import ships the page even when the route is unreachable.
    expect(root).not.toMatch(/^import\s+\{[^}]*AboutTreePage[^}]*\}\s+from/m);
  });
});

describe('Root is wired to the gate', () => {
  const root = readFileSync(new URL('./Root.tsx', import.meta.url), 'utf8');

  it('passes import.meta.env.DEV into resolveRoute', () => {
    expect(root).toMatch(/resolveRoute\(\s*route,\s*import\.meta\.env\.DEV\s*\)/);
  });

  it('loads the engine routes behind a DEV ternary, so the build folds them away', () => {
    expect(root).toMatch(/import\.meta\.env\.DEV\s*\r?\n?\s*\?\s*lazy\(/);
    expect(root).toContain("import('./DevRoutes')");
  });

  it('sets the per-route head, and does it BEFORE the target switch', () => {
    // `useDocumentMeta` is a hook: called after any of Root's early returns it would run
    // conditionally and React would throw on the first navigation between two targets. It also
    // has to run for the dev-only targets, which carry the home's head because the home is what
    // production serves at those paths.
    expect(root).toContain('useDocumentMeta(route)');
    expect(root.indexOf('useDocumentMeta(route)')).toBeLessThan(
      root.indexOf("if (target === 'about')"),
    );
  });

  it('lands deep links on their answer, after the page has rendered', () => {
    // `/questions#cost` is new surface: the hash USED to be the route, so a fragment could not
    // exist. It exists now, FAQPage structured data is keyed on the same ids, and a browser gives
    // up resolving a fragment before a client-rendered page mounts. Hook, same rule as above.
    expect(root).toContain('useFragmentScroll(route)');
    expect(root.indexOf('useFragmentScroll(route)')).toBeLessThan(
      root.indexOf("if (target === 'about')"),
    );
  });

  it('statically imports nothing engine-facing (that would reship the bundle)', () => {
    const staticImports = [...root.matchAll(/^import[^;]*?from\s+'([^']+)';/gms)].map((m) => m[1]);
    expect(staticImports).not.toContain('./pages/DrawPage');
    for (const spec of staticImports) {
      expect(spec).not.toMatch(/pages\/(engine|lab)\//);
      expect(spec).not.toMatch(/pages\/(Draw|Shape|Sculpt)Page/);
    }
  });
});
