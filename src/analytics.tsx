/**
 * analytics.tsx — Vercel Web Analytics, mounted once beside the router.
 *
 * WHY NOW, AND WHY IT IS ROUTE-AWARE FIRST. Until 2026-07-28 the whole site was one URL
 * (`bowerbuild.org/#/gallery` is `bowerbuild.org/` to anything that is not the browser itself), so
 * a pageview number would have been a single undifferentiated total. The path migration is what
 * makes "how many people read the questions page" a question with an answer, which is the only
 * reason this is worth installing today. Daniel chose Vercel Analytics over Plausible and Search
 * Console: the site is already on Vercel, the free tier covers this traffic, and it sets no cookie,
 * so there is no consent banner to design.
 *
 * MANUAL TRACKING, NOT AUTO-TRACK, FOR A REASON THAT IS NOT PEDANTRY.
 *
 * `@vercel/analytics` has two modes. Passing no `route` leaves auto-track on, and the remote
 * `/_vercel/insights/script.js` patches `history.pushState` and listens to `popstate` itself — it
 * would in fact see our hand-rolled router's navigations. Passing BOTH `route` and `path` sets
 * `disableAutoTrack` and hands the SDK each pageview explicitly (verified by reading
 * `node_modules/@vercel/analytics/dist/react/index.mjs`, not assumed).
 *
 * We pass both, because Vercel aggregates by `route` and displays `path`, and this site has a
 * catch-all: EVERY unrecognised URL renders the home splash. Under auto-track, `/typo`,
 * `/gallery/nope` and every scanner-probed path would each open its own row in the dashboard while
 * actually being the home page, fragmenting the one number anybody wants. So `route` is the
 * canonical route production serves at that path and `path` is the real URL the visitor typed.
 *
 * That mapping is `metaForPath`, deliberately: it is the same "what does production actually serve
 * here" decision that already picks the canonical tag and the title. A junk URL is the home page
 * for the crawler, for the canonical, and now for the analytics, by construction rather than by
 * three lists agreeing.
 *
 * PRODUCTION ONLY, VIA THE SAME GATE THE ENGINE USES. `import.meta.env.PROD` is folded at build
 * time, so under `npm run dev` and under vitest the ternary is dead, the dynamic `import()` goes
 * with it, and nothing is downloaded, mounted or fired. The SDK has its own dev detection
 * (`process.env.NODE_ENV`) which would merely point the beacon at a debug script; that is weaker
 * than not existing, and this repo's convention is the ternary.
 *
 * ONE DEPLOY-SIDE DEPENDENCY: `vercel.json` must not rewrite `/_vercel/*` into the SPA shell, or
 * the script 200s as HTML and every pageview is silently lost. That exclusion is guarded in
 * `routing.test.ts`.
 */
import { Suspense, lazy } from 'react';
import { useRoute } from './routing';
import { metaForPath } from './seo';

/** Null in dev and under test. This ternary IS the gate; see the note above. */
const VercelAnalytics = import.meta.env.PROD
  ? lazy(() => import('@vercel/analytics/react').then((m) => ({ default: m.Analytics })))
  : null;

/**
 * The route to REPORT for a given path: the canonical route production serves there, so the four
 * public pages stay four rows and every unknown URL folds into the home rather than minting a row
 * of its own.
 *
 * Pure and exported so the collapsing is testable without a DOM or a build.
 */
export function analyticsRouteFor(path: string): string {
  return metaForPath(path).path;
}

/**
 * Mount once, beside `<Root />`. Renders nothing.
 *
 * `useRoute()` is called unconditionally (hooks rule) even though the component short-circuits in
 * dev; the subscription is free and it keeps this a normal component rather than a conditional one.
 */
export function SiteAnalytics() {
  const path = useRoute();
  if (!VercelAnalytics) return null;
  return (
    <Suspense fallback={null}>
      <VercelAnalytics route={analyticsRouteFor(path)} path={path} />
    </Suspense>
  );
}
