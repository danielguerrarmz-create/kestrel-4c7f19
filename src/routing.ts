/**
 * routing.ts — a deliberately tiny hash router (no dependency).
 *
 * THE PUBLIC SITE IS FOUR PAGES: the home at `#/`, the about page at `#/about`, the
 * gallery of commission visions at `#/gallery` (added 2026-07-23, Clay's client
 * pass), and the practical questions at `#/questions` (added 2026-07-28: the price,
 * the planning position, the lawn, the timeline, and the only way to reach a person).
 *
 * `#/about/tree` WAS public and is DEV-ONLY as of 2026-07-28 (Clay). It shipped on
 * 2026-07-26 linked from no nav surface at all, which is the worst of both: a public
 * URL nobody can find and nobody has reviewed. It is a duplicate of `#/about`, not a
 * replacement, so gating it costs the reader nothing. Same mechanism as the engine
 * (see below), and like the engine this is a gate, not a deletion.
 *
 * Everything engine-facing (the studio/draw tool, the engine walkthrough,
 * the shape and sculpt spikes, the labs) is DEV-ONLY as of 2026-07-21 — Daniel's ruling:
 * the engine "is not something to be proud of at this time", so it comes off production
 * and stays hidden until it is worth showing. The code is untouched and every one of
 * those routes still works under `npm run dev`; see `ENGINE_ROUTES` / `resolveRoute`
 * below and `src/DevRoutes.tsx`. This is a gate, not a deletion.
 *
 * We subscribe to `hashchange` via useSyncExternalStore so back/forward and manual URL
 * edits all work, then normalize the hash to a clean path (`#/about` -> `/about`,
 * empty -> `/`).
 *
 * Note: an in-page anchor like `#register` normalizes to the path `/register`, which is
 * not a known route, so Root falls through to the home splash and the browser scrolls to
 * the matching element id. That is intentional.
 */
import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

function getHash(): string {
  return window.location.hash;
}

/** Current route path, e.g. `/`, `/engine`. SSR-safe fallback of `/`. */
export function useRoute(): string {
  const hash = useSyncExternalStore(subscribe, getHash, () => '');
  const path = hash.replace(/^#/, '');
  return path === '' ? '/' : path;
}

/** Hash hrefs, so links stay real anchors (openable in new tab, no JS needed).
 *  Only `home`, `about`, `gallery` and `questions` may be linked from a surface that
 *  ships to production — everything else is dev-only (see `ENGINE_ROUTES` and
 *  `DEV_ONLY_ROUTES`). */
export const routes = {
  home: '#/',
  engine: '#/engine',
  studio: '#/studio',
  about: '#/about',
  /** The commission visions: seven concept renderings of Bower pavilions in their
   *  gardens (2026-07-23, Clay). A public page, NOT an engine route. */
  gallery: '#/gallery',
  /** The practical questions (2026-07-28): size, price, planning, the lawn, the
   *  timeline, pruning, winter, and who to ring. The site's only contact surface. */
  questions: '#/questions',
  /** The Tree of Life About (2026-07-26): the same history as #/about retold as a
   *  scroll-grown tree. DEV-ONLY since 2026-07-28 — see `DEV_ONLY_ROUTES`. */
  aboutTree: '#/about/tree',
  /** The drawing flow: pick a site, scribble the plan, drag the spines. The
   *  sliders become a readout of what you drew rather than the design act. */
  draw: '#/draw',
  /** Direct-manipulation shaping prototype (draggable cage, no sliders). */
  shape: '#/shape',
  /** Form-finding spike: sculpt a control lattice, relax onto a buildable gridshell. */
  sculpt: '#/sculpt',
  /** Isolated Phase-1 preview of the procedural botanical generator (not wired in). */
  botanicalLab: '#/lab/botanical',
  /* The two About drafts (#/about/scroll, #/about/ascent) were retired on 2026-07-16.
     Daniel's page at #/about stayed the shell and their generative engine was harvested
     into it as ornament — see docs/handoffs/2026-07-16-about-hybrid.md. */
  /** Curation room for the painterly gongbi engine (pin commission seeds here). */
  gongbiLab: '#/lab/gongbi',
} as const;

/**
 * Every engine-facing path, as normalized route paths (no leading `#`).
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
 */
export const DEV_ONLY_ROUTES: readonly string[] = ['/about/tree'];

/** What a path resolves to. `engine` and `aboutTree` are only ever returned when `dev` is true. */
export type RouteTarget = 'splash' | 'about' | 'aboutTree' | 'gallery' | 'questions' | 'engine';

/**
 * The whole route decision as one pure function, so the production gate is testable
 * without a DOM and without a production build. `dev` is `import.meta.env.DEV` at the
 * call site (Root); Vite folds that to `false` when it builds, which is what makes the
 * engine chunk disappear from the bundle rather than merely go unlinked.
 */
export function resolveRoute(path: string, dev: boolean): RouteTarget {
  if (path === routes.about.replace(/^#/, '')) return 'about';
  if (path === routes.gallery.replace(/^#/, '')) return 'gallery';
  if (path === routes.questions.replace(/^#/, '')) return 'questions';
  // The two gated families. Both fall through to the home in production, so a stray bookmark or a
  // guessed URL lands somewhere real instead of on a blank or a page we are not ready to show.
  if (dev && path === routes.aboutTree.replace(/^#/, '')) return 'aboutTree';
  if (dev && ENGINE_ROUTES.includes(path)) return 'engine';
  return 'splash';
}
