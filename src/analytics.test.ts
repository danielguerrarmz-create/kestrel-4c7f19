import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import { analyticsRouteFor } from './analytics';
import { shouldStart } from './posthog';
import { DEV_ONLY_ROUTES, ENGINE_ROUTES, PUBLIC_ROUTES, routes } from './routing';

const source = readFileSync(new URL('./analytics.tsx', import.meta.url), 'utf8');
const posthogSource = readFileSync(new URL('./posthog.ts', import.meta.url), 'utf8');
const main = readFileSync(new URL('./main.tsx', import.meta.url), 'utf8');
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

/**
 * WHAT THIS FILE CAN AND CANNOT ANSWER. It cannot observe a beacon: the SDK only runs in a
 * production build, in a browser, against Vercel's own endpoint. What it CAN pin is everything
 * that decides whether that beacon is correct or fires at all — the route we would report, the
 * production-only gate, and the two props whose presence switches the SDK from auto-tracking to
 * manual. All three are invisible failures if they regress: analytics that quietly records the
 * wrong thing looks exactly like analytics that works.
 */
describe('the route reported to analytics', () => {
  it('is the page itself for each of the four public routes', () => {
    for (const path of PUBLIC_ROUTES) {
      expect(analyticsRouteFor(path)).toBe(path);
    }
    expect(new Set(PUBLIC_ROUTES.map(analyticsRouteFor)).size).toBe(4);
  });

  it('COLLAPSES every unknown URL onto the home, which is what production serves there', () => {
    // The reason manual tracking exists here. Under auto-track each of these would open its own
    // row in the dashboard while actually BEING the home page, so the one number anybody wants
    // would be split across every typo, stale link and scanner probe the site receives.
    for (const junk of ['/typo', '/gallery/nope', '/wp-login.php', '/register', '/.env']) {
      expect(analyticsRouteFor(junk)).toBe(routes.home);
    }
  });

  it('never reports a gated route, in either gated list', () => {
    // Production serves the splash at all of these, so reporting them as themselves would invent
    // traffic to pages that do not exist for a visitor.
    for (const path of [...ENGINE_ROUTES, ...DEV_ONLY_ROUTES]) {
      expect(analyticsRouteFor(path)).toBe(routes.home);
    }
  });

  it('treats a trailing slash as the same page, not a second one', () => {
    // The router normalizes before this ever runs, but the canonical tag and the analytics row
    // have to agree about what "the gallery" is, and this is where that would silently diverge.
    expect(analyticsRouteFor('/gallery')).toBe(analyticsRouteFor('/gallery/'));
  });
});

describe('the analytics mount', () => {
  it('is gated on import.meta.env.PROD, so dev and vitest never load or fire it', () => {
    // Same mechanism as the engine gate: Vite folds this at build time, so the dynamic import
    // goes with the dead branch and nothing is downloaded under `npm run dev`.
    expect(source).toMatch(/import\.meta\.env\.PROD\s*\r?\n?\s*\?\s*lazy\(/);
    expect(source).toContain("import('@vercel/analytics/react')");
    // A STATIC import would run the SDK's module scope in every environment, including this one.
    expect(source).not.toMatch(/^import\s+\{[^}]*Analytics[^}]*\}\s+from\s+'@vercel\/analytics/m);
  });

  it('passes BOTH route and path, which is what disables the SDK\'s auto-tracking', () => {
    // Verified against node_modules/@vercel/analytics/dist/react/index.mjs: `disableAutoTrack` is
    // set only when `route !== undefined`, and the pageview only fires when BOTH are truthy.
    // Dropping either one silently reverts to auto-track and the collapsing above stops applying.
    //
    // The route moved into a local on 2026-07-29 (PostHog is handed the same pair), so this now
    // checks the two halves separately: the prop is passed, AND the local it is passed is the
    // COLLAPSED route rather than the raw path. Matching the old inline call would have passed
    // for `route={path}`, which is the regression that actually matters.
    expect(source).toMatch(/const route = analyticsRouteFor\(path\)/);
    expect(source).toMatch(/route=\{route\}/);
    expect(source).toMatch(/path=\{path\}/);
  });

  it('is mounted once, from main.tsx, outside the ErrorBoundary', () => {
    expect(main).toContain('<SiteAnalytics />');
    expect(main.match(/<SiteAnalytics \/>/g)).toHaveLength(1);
    // Outside, so analytics can never take the page down and a page crash is still measurable.
    expect(main.indexOf('</ErrorBoundary>')).toBeLessThan(main.indexOf('<SiteAnalytics />'));
  });

  it('is a runtime dependency, not a devDependency', () => {
    expect(pkg.dependencies).toHaveProperty('@vercel/analytics');
    expect(pkg.devDependencies ?? {}).not.toHaveProperty('@vercel/analytics');
  });
});

/**
 * POSTHOG, ADDED BESIDE VERCEL ON 2026-07-29 (Clay).
 *
 * The same limitation as above applies — no beacon is observable from here — so this pins the
 * decisions that make the beacon right: the gate, the shared route, and the two properties that
 * stop PostHog fragmenting its dashboard the way auto-track would.
 *
 * ONE PIECE OF HISTORY WORTH KEEPING, because it is the reason this file has a second half. The
 * first PostHog integration was written against a 13-commit-stale branch, on the assumption the
 * site was still a HASH router, and captured pageviews from `location.hash` on `hashchange`. On
 * the path-routed site there is no hash: it would have reported `/` for all four pages, fired
 * once per session, and looked entirely healthy doing it. It was never deployed. **The class of
 * bug is "analytics written against a router that has since moved", and the guard against it is
 * that PostHog is now handed its route by `SiteAnalytics` rather than reading the URL itself.**
 */
describe('the posthog gate', () => {
  it('does not run in dev, key or no key', () => {
    expect(shouldStart(false, 'phc_real_looking_key')).toBe(false);
    expect(shouldStart(false, '')).toBe(false);
  });

  it('does not run in production without a key, rather than initialising a broken client', () => {
    expect(shouldStart(true, '')).toBe(false);
    expect(shouldStart(true, '   ')).toBe(false);
  });

  it('runs in production with a key', () => {
    expect(shouldStart(true, 'phc_real_looking_key')).toBe(true);
  });

  it('is gated on import.meta.env.PROD and imports the SDK dynamically', () => {
    expect(posthogSource).toMatch(/shouldStart\(import\.meta\.env\.PROD, KEY\)/);
    expect(posthogSource).toMatch(/import\('posthog-js'\)/);
    // A static import would run posthog's module scope in every environment, this one included.
    expect(posthogSource).not.toMatch(/^import .* from 'posthog-js'/m);
  });

  it('is a runtime dependency, not a devDependency', () => {
    expect(pkg.dependencies).toHaveProperty('posthog-js');
    expect(pkg.devDependencies ?? {}).not.toHaveProperty('posthog-js');
  });
});

describe('what posthog is told a pageview is', () => {
  it('takes its route from SiteAnalytics rather than reading the URL itself', () => {
    // THE POINT OF THE WHOLE INTEGRATION. Both tools get the same pair, so the junk-URL
    // collapsing proven above applies to PostHog by construction rather than by a second
    // implementation that has to agree. Reading `location` here is what the superseded draft did.
    expect(source).toMatch(/capturePageview\(route, path\)/);
    expect(posthogSource).toMatch(/export function capturePageview\(route: string, path: string\)/);
    expect(posthogSource).not.toMatch(/location\.pathname|location\.hash|hashchange/);
  });

  it('overrides $pathname with the collapsed route, so scanners do not mint dashboard rows', () => {
    // PostHog breaks its own dashboards down on `$pathname`, which it would otherwise read from
    // `location`. Left alone, `/wp-login.php` opens a row while actually being the home page —
    // the identical failure `route`/`path` exists to prevent on the Vercel side.
    expect(posthogSource).toMatch(/\$pathname: route/);
    // The real URL still has to survive somewhere, or a junk hit becomes uninvestigable.
    expect(posthogSource).toMatch(/\$current_url: window\.location\.href/);
  });

  it('turns automatic pageview capture OFF, so navigations are not counted twice', () => {
    expect(posthogSource).toMatch(/capture_pageview: false/);
  });
});

describe('the posthog key', () => {
  const env = readFileSync(new URL('../.env', import.meta.url), 'utf8');
  /** Assignments only: the comments in that file NAME the key prefixes they warn about. */
  const values = env
    .split('\n')
    .filter((l) => !l.trimStart().startsWith('#'))
    .join('\n');

  it('is present', () => {
    expect(values).toMatch(/^VITE_POSTHOG_KEY=phc_\w+$/m);
  });

  it('is not a personal API key', () => {
    // `phc_` is the public project token and ships in the bundle by design. `phx_` reads and
    // writes the whole PostHog account over the REST API, and this repo is PUBLIC.
    expect(values).not.toMatch(/phx_/);
  });

  it('is not git-ignored, so a production build cannot silently lose analytics', () => {
    // Deliberately committable — see the header of .env. Adding `.env` to .gitignore is the
    // reflex this pins: do it and the Vercel build loses its key, which shows up as a graph at
    // zero that is indistinguishable from a quiet week. If the key should genuinely leave the
    // repo, set VITE_POSTHOG_KEY in the Vercel dashboard and delete this test on purpose,
    // having first checked the dashboard actually has it.
    let ignored = true;
    try {
      execFileSync('git', ['check-ignore', '-q', '--', '.env'], { cwd: resolve(__dirname, '..') });
    } catch {
      ignored = false; // exit 1 == not ignored
    }
    expect(ignored).toBe(false);
  });
});
