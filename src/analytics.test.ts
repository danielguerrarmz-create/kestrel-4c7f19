import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { analyticsRouteFor } from './analytics';
import { DEV_ONLY_ROUTES, ENGINE_ROUTES, PUBLIC_ROUTES, routes } from './routing';

const source = readFileSync(new URL('./analytics.tsx', import.meta.url), 'utf8');
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
    expect(source).toMatch(/route=\{analyticsRouteFor\(path\)\}/);
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
