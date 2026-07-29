/**
 * posthog.ts — PostHog product analytics, beside Vercel's (2026-07-29, Clay).
 *
 * WHY BOTH, AND WHAT EACH ONE IS FOR. `analytics.tsx` owns Vercel Web Analytics: pageviews and
 * visitors, no cookie, effectively free, already live. This adds the questions Vercel cannot
 * answer — funnels (did the gallery reader reach the price?), retention, session replay, and
 * events on the things a visitor DOES rather than the pages they open. Clay's call, 2026-07-29,
 * with the cookie accepted knowingly: see the note at the bottom.
 *
 * IT REPORTS THE SAME ROUTE VERCEL DOES, AND THAT IS THE WHOLE INTEGRATION. `SiteAnalytics` hands
 * us `analyticsRouteFor(path)`, so the collapsing that keeps `/wp-login.php` out of the dashboard
 * is one decision serving both tools rather than two lists that have to agree. `$pathname` is
 * OVERRIDDEN with that collapsed route, because PostHog's own dashboards break down on it and
 * would otherwise mint a row per scanner probe; the real URL survives as `path` and
 * `$current_url`, which is exactly Vercel's route/path split.
 *
 * AUTOMATIC PAGEVIEW CAPTURE IS OFF for the same reason Vercel's auto-track is: it would report
 * raw paths (fragmenting on junk URLs) AND double-count every navigation we already send.
 *
 * PRODUCTION ONLY, VIA THE SAME GATE THE ENGINE AND `analytics.tsx` USE. `import.meta.env.PROD`
 * is folded at build time, so under `npm run dev` and under vitest the dynamic `import()` goes
 * with the dead branch and nothing is downloaded, initialised or sent. A four-page site whose
 * dashboard is half `/lab/gongbi` seed-curation sessions is not measuring anything.
 *
 * IT LOADS AT IDLE AND QUEUES WHAT HAPPENS FIRST. posthog-js is 230 kB raw / 76 kB gzipped —
 * larger than everything left of the three.js stack — and no reader is here for it, so it waits
 * until the browser is idle. Views that happen before it lands are queued, not dropped: the
 * reader who arrives and goes straight to `/questions` is the one worth measuring and also the
 * one fast enough to fall through that window.
 *
 * THE KEY IS PUBLIC BY DESIGN — a write-only ingest token, compiled into the bundle every
 * visitor downloads. It lives in a tracked `.env` so the live build cannot lose analytics to an
 * unset Vercel dashboard variable, a failure whose only symptom is a graph at zero that reads as
 * a quiet week. A PERSONAL API key (`phx_`) is a real secret and must never come near this
 * PUBLIC repo.
 *
 * THE COOKIE IS A DECISION, NOT AN OVERSIGHT. Daniel picked Vercel Analytics partly because it
 * sets no cookie and therefore needs no consent banner (`analytics.tsx`). PostHog does set one,
 * and session replay is ON in the project's own remote config — which means replay records the
 * `/questions` contact form. Clay accepted both on 2026-07-29 with the consent banner still
 * unbuilt. **If that is revisited, the switches are `persistence: 'memory'` and
 * `disable_session_recording: true` here, plus the replay toggle in PostHog's settings.**
 */

/** Write-only ingest token. Public by design — see the header. */
const KEY: string = import.meta.env.VITE_POSTHOG_KEY ?? '';

/**
 * Cloud region. Verified US for this project on 2026-07-29 by asking both hosts for the project
 * config: `us.i.posthog.com` answered 200, `eu.i.posthog.com` 404. The wrong region does not
 * error — it drops every event silently.
 */
const HOST: string = import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com';

/**
 * Whether to run at all. Pure and exported so the production gate is a test rather than a
 * comment — the same reason `resolveRoute` and `analyticsRouteFor` are pure.
 */
export function shouldStart(prod: boolean, key: string): boolean {
  return prod && key.trim() !== '';
}

const ENABLED = shouldStart(import.meta.env.PROD, KEY);

/**
 * A pageview as PostHog receives it.
 *
 * `route` is the collapsed route (what production serves), `path` the URL the visitor actually
 * asked for. `$pathname` carries the collapsed one because that is what PostHog's built-in
 * breakdowns read.
 */
interface View {
  route: string;
  path: string;
  $pathname: string;
  $current_url: string;
}

const queue: View[] = [];
let send: (view: View) => void = (view) => {
  queue.push(view);
};
let loading = false;

/** Deferred to idle: the reader's bandwidth belongs to the hero image and the fonts first. */
function whenIdle(run: () => void): void {
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 4000 });
  else window.setTimeout(run, 1500);
}

function load(): void {
  if (loading) return;
  loading = true;
  whenIdle(() => {
    void import('posthog-js').then(({ default: posthog }) => {
      posthog.init(KEY, {
        api_host: HOST,
        // See the header: we send our own, against the collapsed route.
        capture_pageview: false,
        capture_pageleave: true,
      });
      send = (view) => {
        posthog.capture('$pageview', view);
      };
      for (const view of queue) send(view);
      queue.length = 0;
    });
  });
}

/**
 * Record one pageview. A no-op in dev, under vitest, and in any build without a key.
 *
 * Both arguments come from `SiteAnalytics`, which already computed them for Vercel — the point
 * is that the two tools cannot disagree about what page this is.
 */
export function capturePageview(route: string, path: string): void {
  if (!ENABLED) return;
  send({ route, path, $pathname: route, $current_url: window.location.href });
  load();
}
