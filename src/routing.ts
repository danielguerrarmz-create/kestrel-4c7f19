/**
 * routing.ts — a deliberately tiny PATH router (no dependency).
 *
 * THE PUBLIC SITE IS FOUR PAGES: the home at `/`, the about page at `/about`, the
 * gallery of commission visions at `/gallery` (added 2026-07-23, Clay's client
 * pass), and the practical questions at `/questions` (added 2026-07-28: the price,
 * the planning position, the lawn, the timeline, and the only way to reach a person).
 *
 * IT WAS A HASH ROUTER UNTIL 2026-07-28, AND THE HASH WAS COSTING THE SITE ITS SEARCH
 * SURFACE. `https://www.bowerbuild.org/#/gallery` is, to every crawler and every link
 * unfurler, the single URL `https://www.bowerbuild.org/` — the fragment is never sent to
 * the server and search engines do not index it as a distinct page. So four pages of real
 * writing (seven renderings, seven answered questions, the practice's whole history)
 * competed as one document, one title, one description, and nothing could be linked to,
 * ranked, or canonicalized separately. Real paths make each page a page.
 *
 * WHAT REPLACED IT, AND WHAT DID NOT CHANGE:
 *   - `useRoute` reads `location.pathname` through `useSyncExternalStore`, subscribing to
 *     `popstate` (back/forward, manual URL edits) plus our own `navigate`, because
 *     `pushState` fires no event of its own.
 *   - Links stay REAL ANCHORS with real hrefs (`<a href="/gallery">`), openable in a new
 *     tab and readable by a crawler. A single delegated click handler upgrades a plain
 *     left-click into a `pushState`; everything else (modified clicks, `target`, external
 *     origins, `mailto:`/`tel:`, downloads) falls through to the browser untouched. There
 *     is no `<Link>` component to remember to use, so a plain `<a>` cannot be a bug.
 *   - `installRouter()` (called from main.tsx before the first render) also runs the
 *     LEGACY HASH SHIM: an inbound `/#/gallery` is rewritten in place to `/gallery`. Every
 *     link shared while the site was hash-routed keeps working.
 *
 * IN-PAGE ANCHORS GOT SIMPLER, NOT HARDER. Under the hash router an `href="#register"`
 * normalized to the unknown path `/register` and fell through to the home splash, which
 * only worked because the home WAS the fallback (see the note that used to sit in
 * QuestionsPage). Now a fragment is just a fragment: the pathname does not change, the
 * click handler declines to intercept it, and the browser scrolls. That works on every
 * page, not only the one whose fallback happened to be itself.
 *
 * `/about/tree` WAS public and is DEV-ONLY as of 2026-07-28 (Clay). It shipped on
 * 2026-07-26 linked from no nav surface at all, which is the worst of both: a public
 * URL nobody can find and nobody has reviewed. It is a duplicate of `/about`, not a
 * replacement, so gating it costs the reader nothing. Same mechanism as the engine
 * (see below), and like the engine this is a gate, not a deletion.
 *
 * Everything engine-facing (the studio/draw tool, the engine walkthrough,
 * the shape and sculpt spikes, the labs) is DEV-ONLY as of 2026-07-21 — Daniel's ruling:
 * the engine "is not something to be proud of at this time", so it comes off production
 * and stays hidden until it is worth showing. The code is untouched and every one of
 * those routes still works under `npm run dev`; see `ENGINE_ROUTES` / `resolveRoute`
 * below and `src/DevRoutes.tsx`. This is a gate, not a deletion.
 */
import { useEffect, useSyncExternalStore } from 'react';

/* ------------------------------- path parsing ------------------------------ */

/**
 * Normalize a pathname to the canonical route path: leading slash, no duplicate slashes,
 * no trailing slash (except the root). `/gallery/` and `//gallery` both mean `/gallery`,
 * which is also what the canonical link tag will say, so the two cannot disagree.
 *
 * Pure and exported so the parsing is testable without a DOM.
 */
export function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  const p = ('/' + pathname).replace(/\/{2,}/g, '/').replace(/(.)\/+$/, '$1');
  return p || '/';
}

/**
 * The URL an inbound legacy `#/...` link should be rewritten to, or `null` when there is
 * nothing to rewrite.
 *
 * `null` for a bare in-page anchor (`#register`) is the load-bearing case: rewriting that
 * to `/register` is exactly the old router's behaviour and exactly what this change is
 * getting rid of. Only a hash that starts `#/` was ever a route.
 *
 * A query may sit OUTSIDE the hash (`/?species=x#/about` — how the QA probes and the
 * engine's own share links are shaped, because `composeDesignUrl` writes the params before
 * the hash) or INSIDE it (`#/studio?a=1`). Both are kept; the inner one wins a collision,
 * because it travelled with the route.
 */
export function legacyHashRedirect(loc: {
  search: string;
  hash: string;
}): string | null {
  if (!loc.hash.startsWith('#/')) return null;
  const raw = loc.hash.slice(1);
  const q = raw.indexOf('?');
  const path = normalizePath(q === -1 ? raw : raw.slice(0, q));
  const params = new URLSearchParams(loc.search);
  if (q !== -1) for (const [k, v] of new URLSearchParams(raw.slice(q))) params.set(k, v);
  const search = params.toString();
  return search ? `${path}?${search}` : path;
}

/**
 * Does the router take this link over, or must the browser handle it?
 *
 * Pure, so the whole "which links do we hijack" decision is testable without a DOM — and it
 * needs to be, because every case below is a way to break a link that used to work:
 * `mailto:`/`tel:` (the questions page's only contact route), a new-tab `target`, a
 * download, another origin, and an in-page fragment on the page you are already on.
 */
export function claimsLink(
  link: { href: string; target?: string | null; download?: boolean; rel?: string | null },
  here: string,
): boolean {
  if (link.download) return false;
  if (link.target && link.target !== '_self') return false;
  if (link.rel && /\bexternal\b/i.test(link.rel)) return false;
  let url: URL;
  let current: URL;
  try {
    current = new URL(here);
    url = new URL(link.href, here);
  } catch {
    return false;
  }
  // `mailto:` and `tel:` have an opaque origin ("null"), so this one check covers both them
  // and every other site.
  if (url.origin !== current.origin) return false;
  // An in-page anchor is the browser's job: it scrolls, and it does it without a re-render.
  if (url.pathname === current.pathname && url.hash) return false;
  return true;
}

/* --------------------------------- the store ------------------------------- */

const listeners = new Set<() => void>();
let snapshot = typeof window === 'undefined' ? '/' : normalizePath(window.location.pathname);

/** Recompute the current path and wake React if it moved. */
function publish(): void {
  const next = normalizePath(window.location.pathname);
  if (next === snapshot) return;
  snapshot = next;
  for (const l of listeners) l();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener('popstate', publish);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('popstate', publish);
  };
}

/** Current route path, e.g. `/`, `/gallery`. SSR-safe fallback of `/`. */
export function useRoute(): string {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => '/',
  );
}

/**
 * Navigate to an in-app URL: push it, tell the store, and reset the scroll the way a real
 * page load would. `pushState` does not scroll and does not fire an event, so both are ours.
 *
 * A fragment is left alone here on purpose. Landing on it is `useFragmentScroll`'s job, because
 * the element does not exist yet at this instant: the page it lives on has not rendered.
 */
export function navigate(href: string): void {
  const url = new URL(href, window.location.href);
  window.history.pushState(null, '', url.pathname + url.search + url.hash);
  publish();
  if (!url.hash) window.scrollTo(0, 0);
}

/**
 * Land on `location.hash` once the page that owns it has actually rendered.
 *
 * WAIT FOR THE THING, NOT THE CLOCK — this repo's most repeated lesson, and this is the routing
 * version of it. A browser resolves a fragment shortly after the document loads; in a client-
 * rendered app the element it names does not exist yet, and the browser does not keep trying
 * forever. Measured on the built site: a cold `/#register` happened to land (the home is heavy
 * enough that the retry outlasted React's mount) and a cold `/questions#winter` did NOT, which is
 * exactly the kind of works-on-my-page inconsistency a timer would paper over. Running in an
 * effect keyed on the route asks the real question instead: has the element appeared?
 *
 * THIS IS NEW SURFACE, NOT A RESTORATION. Under the hash router `/questions#winter` was not a
 * fragment at all — the hash WAS the route, so it parsed as the unknown path `/winter` and threw
 * you to the splash. Per-answer deep links only became possible with real paths, and they are
 * worth having now that `/questions` publishes FAQPage structured data keyed on the same ids:
 * an answer engine or a Google "jump to" link that points at `#cost` should land on the cost.
 *
 * Idempotent by construction: when the browser DID already scroll there, this scrolls to the
 * same place.
 */
export function useFragmentScroll(route: string): void {
  useEffect(() => {
    const raw = window.location.hash.slice(1);
    if (!raw) return;
    let id: string;
    try {
      id = decodeURIComponent(raw);
    } catch {
      return; // a malformed escape is not an element id
    }
    document.getElementById(id)?.scrollIntoView();
  }, [route]);
}

/**
 * Install the router: rewrite a legacy hash URL in place, then delegate link clicks.
 *
 * Call it BEFORE the first render (main.tsx does) so the shim has already run when React
 * reads the path — otherwise an inbound `/#/gallery` paints the home for a frame first.
 * Returns a teardown, for symmetry and for tests.
 */
export function installRouter(): () => void {
  const target = legacyHashRedirect(window.location);
  if (target !== null) {
    window.history.replaceState(null, '', target);
    publish();
  }

  const onClick = (e: MouseEvent) => {
    // Anything the user asked the BROWSER for (new tab, new window, download, save) stays
    // the browser's. `defaultPrevented` lets a component opt out by handling the click first.
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest?.('a');
    // `closest('a')` also matches an SVG <a>, whose `.href` is an SVGAnimatedString rather
    // than a string — the About timeline is full of SVG. Narrow to the HTML element.
    if (!(a instanceof HTMLAnchorElement) || !a.getAttribute('href')) return;
    if (
      !claimsLink(
        {
          href: a.href,
          target: a.getAttribute('target'),
          download: a.hasAttribute('download'),
          rel: a.getAttribute('rel'),
        },
        window.location.href,
      )
    ) {
      return;
    }
    e.preventDefault();
    navigate(a.href);
  };

  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}

/* ---------------------------------- routes --------------------------------- */

/** Real path hrefs, so links stay real anchors (openable in new tab, crawlable, no JS
 *  needed to read where they go).
 *  Only `home`, `about`, `gallery` and `questions` may be linked from a surface that
 *  ships to production — everything else is dev-only (see `ENGINE_ROUTES` and
 *  `DEV_ONLY_ROUTES`). */
export const routes = {
  home: '/',
  engine: '/engine',
  studio: '/studio',
  about: '/about',
  /** The commission visions: seven concept renderings of Bower pavilions in their
   *  gardens (2026-07-23, Clay). A public page, NOT an engine route. */
  gallery: '/gallery',
  /** The three ways a Bower can serve a landscape. */
  commissions: '/commissions',
  /** The five-stage route from first conversation to long-term stewardship. */
  process: '/process',
  /** Direct founding-commission enquiry. */
  contact: '/contact',
  /** A quiet, footer-only route for journalists and editors. */
  press: '/press',
  /** The practical questions (2026-07-28): size, price, planning, the lawn, the
   *  timeline, pruning, winter, and who to ring. The site's only contact surface. */
  questions: '/questions',
  /** The commercial-hospitality page (2026-07-31): family-owned houses that earn from
   *  exclusive hire and whole-house rental. `/houses`, NOT `/venues` — "venue" is trade
   *  vocabulary and these owners do not use it about themselves; "houses" is how Landed
   *  Houses, Wolsey Lodges and Historic Houses all speak.
   *  DEV-ONLY since 2026-08-04 (Clay, founding-commission launch): its fee figures
   *  contradicted the withdrawn-budget posture, and a third of the outreach list is
   *  hospitality, so the material is gated for a later aimed relaunch, not deleted. */
  houses: '/houses',
  /** The founders, the timeline and the work: the drawn page that WAS `/about` until
   *  2026-07-31, now nested behind the short one as its expanded version. Public. */
  practice: '/about/practice',
  /** The Tree of Life About (2026-07-26): the same history as /about retold as a
   *  scroll-grown tree. DEV-ONLY since 2026-07-28 — see `DEV_ONLY_ROUTES`. */
  aboutTree: '/about/tree',
  /** The drawing flow: pick a site, scribble the plan, drag the spines. The
   *  sliders become a readout of what you drew rather than the design act. */
  draw: '/draw',
  /** Direct-manipulation shaping prototype (draggable cage, no sliders). */
  shape: '/shape',
  /** Form-finding spike: sculpt a control lattice, relax onto a buildable gridshell. */
  sculpt: '/sculpt',
  /** Isolated Phase-1 preview of the procedural botanical generator (not wired in). */
  botanicalLab: '/lab/botanical',
  /* The two About drafts (/about/scroll, /about/ascent) were retired on 2026-07-16.
     Daniel's page at /about stayed the shell and their generative engine was harvested
     into it as ornament — see docs/handoffs/2026-07-16-about-hybrid.md. */
  /** Curation room for the painterly gongbi engine (pin commission seeds here). */
  gongbiLab: '/lab/gongbi',
} as const;

/** The five routes that ship to production, in nav order. The sitemap and the per-page
 *  metadata are both built from this, so a page cannot be published without a URL, a
 *  title and a sitemap entry — or listed in the sitemap without being a real route.
 *
 *  The order keeps the reader's path set on 2026-07-28 — see the work, find out what it
 *  involves, then look up who we are. `/houses` left this list on 2026-08-04 (gated, see
 *  `DEV_ONLY_ROUTES`). */
export const PUBLIC_ROUTES: readonly string[] = [
  routes.home,
  routes.commissions,
  routes.gallery,
  routes.process,
  routes.about,
  routes.practice,
  routes.contact,
  routes.press,
  routes.questions,
];

/**
 * Every engine-facing path, as normalized route paths.
 *
 * These render ONLY under `import.meta.env.DEV`. In a production build each one falls
 * through to the home splash, so a stray bookmark or a guessed URL lands somewhere real
 * instead of on a page we are not ready to show. Add a route here the moment you add it
 * to `DevRoutes` — a dev route that is missing from this list is a route that ships.
 */
export const ENGINE_ROUTES: readonly string[] = [
  '/studio',
  '/draw',
  '/engine',
  '/shape',
  '/sculpt',
  '/lab/botanical',
  '/lab/gongbi',
];

/**
 * Non-engine routes that are ALSO dev-only, as normalized route paths.
 *
 * Kept separate from `ENGINE_ROUTES` because they are gated for a different reason and render
 * through a different component. `ENGINE_ROUTES` is Daniel's ruling about an unfinished TOOL and
 * every one of them resolves to the shared `engine` target (DevRoutes); this list is for finished
 * PAGES that simply are not ready to be seen, and each keeps its own target. Folding about/tree
 * into ENGINE_ROUTES would have been the quick move and it would have been a lie in two
 * directions: it would claim the tree page is engine-facing, and it would route it to DevRoutes,
 * which knows nothing about it.
 *
 * `/houses` joined 2026-08-04 (Clay, founding-commission launch). It had been public since
 * 2026-07-31 but was unlinked from every nav on this branch, and it still published the Stage 1
 * and Stage 2 fees the founding-commission posture withdraws ("we do not publish an indicative
 * budget"). An indexed page contradicting the proposal terms the outreach emails carry is worse
 * than no page; the hospitality material stays reviewable in dev for a later aimed relaunch.
 */
export const DEV_ONLY_ROUTES: readonly string[] = ['/about/tree', '/houses'];

/** What a path resolves to. `engine`, `aboutTree` and `houses` are only ever returned when
 *  `dev` is true. */
export type RouteTarget =
  | 'splash'
  | 'about'
  | 'practice'
  | 'aboutTree'
  | 'gallery'
  | 'commissions'
  | 'process'
  | 'contact'
  | 'press'
  | 'questions'
  | 'houses'
  | 'engine';

/**
 * The whole route decision as one pure function, so the production gate is testable
 * without a DOM and without a production build. `dev` is `import.meta.env.DEV` at the
 * call site (Root); Vite folds that to `false` when it builds, which is what makes the
 * engine chunk disappear from the bundle rather than merely go unlinked.
 */
export function resolveRoute(path: string, dev: boolean): RouteTarget {
  // `/about/practice` must be tested BEFORE `/about` would be, though these are exact matches so
  // order is not load-bearing today. It would be the moment anyone reaches for a prefix match.
  if (path === routes.practice) return 'practice';
  if (path === routes.about) return 'about';
  if (path === routes.gallery) return 'gallery';
  if (path === routes.commissions) return 'commissions';
  if (path === routes.process) return 'process';
  if (path === routes.contact) return 'contact';
  if (path === routes.press) return 'press';
  if (path === routes.questions) return 'questions';
  // The two gated families. Both fall through to the home in production, so a stray bookmark or a
  // guessed URL lands somewhere real instead of on a blank or a page we are not ready to show.
  if (dev && path === routes.houses) return 'houses';
  if (dev && path === routes.aboutTree) return 'aboutTree';
  if (dev && ENGINE_ROUTES.includes(path)) return 'engine';
  return 'splash';
}
