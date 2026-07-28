import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { DEV_ONLY_ROUTES, ENGINE_ROUTES, resolveRoute, routes } from './routing';

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

  it('the four public pages resolve the same either way', () => {
    for (const dev of [true, false]) {
      expect(resolveRoute('/', dev)).toBe('splash');
      expect(resolveRoute('/about', dev)).toBe('about');
      // The gallery joined the public site 2026-07-23 (Clay's client pass).
      expect(resolveRoute('/gallery', dev)).toBe('gallery');
      // The questions page joined 2026-07-28: the price, the planning position, the contact.
      expect(resolveRoute('/questions', dev)).toBe('questions');
      // An in-page anchor normalizes to an unknown path and must land on the home, not a blank.
      expect(resolveRoute('/register', dev)).toBe('splash');
      expect(resolveRoute('/how-it-works', dev)).toBe('splash');
    }
  });

  it('routes.* are the paths resolveRoute matches on (they cannot drift)', () => {
    expect(resolveRoute(routes.about.replace(/^#/, ''), true)).toBe('about');
    expect(resolveRoute(routes.gallery.replace(/^#/, ''), true)).toBe('gallery');
    expect(resolveRoute(routes.questions.replace(/^#/, ''), true)).toBe('questions');
    expect(resolveRoute(routes.aboutTree.replace(/^#/, ''), true)).toBe('aboutTree');
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

  it('statically imports nothing engine-facing (that would reship the bundle)', () => {
    const staticImports = [...root.matchAll(/^import[^;]*?from\s+'([^']+)';/gms)].map((m) => m[1]);
    expect(staticImports).not.toContain('./pages/DrawPage');
    for (const spec of staticImports) {
      expect(spec).not.toMatch(/pages\/(engine|lab)\//);
      expect(spec).not.toMatch(/pages\/(Draw|Shape|Sculpt)Page/);
    }
  });
});
