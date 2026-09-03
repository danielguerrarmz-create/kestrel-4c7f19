/**
 * Root.tsx — top-level route switch.
 *
 * THE PRODUCTION SITE IS FIVE PAGES AND NOTHING ELSE:
 *
 * `/`          -> the home: hero, the two product-photograph bands, the register close,
 *                and the company monument (SplashPage).
 * `/about`     -> the short one: what a Bower is and why (AboutPage; rewritten 2026-07-31 to
 *                Clay's brief, "very simple, very plain, very elegant").
 * `/about/practice`
 *              -> the founders, the timeline and the work — the drawn page that WAS `/about`
 *                until 2026-07-31, now the EXPANDED version nested behind the short one
 *                (PracticePage, renamed from AboutPage in the same commit so the file name
 *                stops describing a URL it no longer serves).
 * `/gallery`   -> the commission visions, seven concept renderings (GalleryPage;
 *                added 2026-07-23, Clay's client pass).
 * `/questions` -> the practical answers and the only contact route (QuestionsPage;
 *                added 2026-07-28).
 * anything else -> the home splash (fallback, so a stray URL never dead-ends).
 *
 * THESE ARE REAL PATHS AS OF 2026-07-28, not `#/` hashes: a fragment is never sent to a
 * server, so all four pages were one URL to a crawler and to every link unfurler. See
 * routing.ts for the migration and for the shim that keeps already-shared `#/gallery`
 * links working. Each route also carries its own title, description and canonical now
 * (`useDocumentMeta`), which is the point of having separate URLs in the first place.
 *
 * `/about/tree` IS DEV-ONLY (2026-07-28, Clay), having been public and unlinked since
 * 2026-07-26. It is lazy behind the same DEV ternary the engine uses, NOT merely absent
 * from the nav: it was statically imported here while it was "hidden", which shipped the
 * whole tree page (geometry, milestones, growth windows) into the production bundle for
 * a route nobody could reach. Unlinked is not gated.
 *
 * `/houses` IS DEV-ONLY TOO (2026-08-04, Clay, founding-commission launch): the
 * commercial-hospitality page (added 2026-07-31) still published Stage 1 and Stage 2 fees
 * the withdrawn-budget posture contradicts, and it was already unlinked from every nav.
 * Same lazy gate as the tree page; the material stays for a later aimed relaunch.
 *
 * EVERYTHING ENGINE-FACING IS DEV-ONLY (2026-07-21). Daniel's ruling: the studio/engine
 * "is not something to be proud of at this time", so it comes off the live site entirely
 * and stays hidden while it is rebuilt. `/studio`, `/draw`, `/engine`, `/shape`,
 * `/sculpt`, `/lab/botanical` and `/lab/gongbi` render only under
 * `import.meta.env.DEV` and all still work under `npm run dev` — that is the point of a
 * gate rather than a deletion. In a production build they resolve to the home splash.
 *
 * The gate is the ternary below, NOT a runtime check inside the component: Vite folds
 * `import.meta.env.DEV` to `false` at build time, the dead branch takes its `import()`
 * with it, and the engine (three.js, the draw tool, the labs) is never emitted into the
 * production bundle at all. The route decision itself lives in `resolveRoute`
 * (routing.ts) so it can be unit-tested for both values of `dev`.
 */
import { Suspense, lazy } from 'react';
import { SplashPage } from './pages/SplashPage';
import { AboutPage } from './pages/AboutPage';
import { PracticePage } from './pages/PracticePage';
import { GalleryPage } from './pages/GalleryPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { ProcessPage } from './pages/ProcessPage';
import { ContactPage } from './pages/ContactPage';
import { PressPage } from './pages/PressPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { resolveRoute, useFragmentScroll, useRoute } from './routing';
import { useDocumentMeta } from './seo';

/** Null in production. See the note above: this ternary IS the gate. */
const DevRoutes = import.meta.env.DEV
  ? lazy(() => import('./DevRoutes').then((m) => ({ default: m.DevRoutes })))
  : null;

/** Null in production, for the same reason and by the same mechanism (2026-07-28). */
const AboutTreePage = import.meta.env.DEV
  ? lazy(() => import('./pages/about-tree/AboutTreePage').then((m) => ({ default: m.AboutTreePage })))
  : null;

/**
 * Null in production (2026-09-03): `/commissions` is dev-only after Clay killed the page.
 *
 * LAZY BEHIND THE TERNARY, NOT A STATIC IMPORT, and that is why this file had to change and not
 * only `routing.ts`. It WAS statically imported here, so dropping it from `PUBLIC_ROUTES` alone
 * would have left the whole page — the copy, the three commission settings, the appointment gates
 * and the Founding Site Study fee — compiled into the production bundle for a route production
 * never serves. Unlinked is not gated; this repo has shipped that exact bug before with
 * `/about/tree`.
 */
const CommissionsPage = import.meta.env.DEV
  ? lazy(() => import('./pages/CommissionsPage').then((m) => ({ default: m.CommissionsPage })))
  : null;

/** Null in production (2026-08-04): `/houses` is dev-only during the founding-commission launch.
 *  Lazy behind the ternary, NOT a static import — unlinked is not gated, and a static import here
 *  would ship the whole page (fee copy included) to a route production never serves. */
const HousesPage = import.meta.env.DEV
  ? lazy(() => import('./pages/HousesPage').then((m) => ({ default: m.HousesPage })))
  : null;

export function Root() {
  const route = useRoute();
  // Before the switch, so it runs for every target including the dev-only ones (which carry the
  // home's head, because the home is what production serves at those paths).
  useDocumentMeta(route);
  // Same reason, and it must sit here too: a deep link like /questions#cost can only land once
  // the page owning that id has rendered, which is after this component returns.
  useFragmentScroll(route);
  const target = resolveRoute(route, import.meta.env.DEV);
  if (target === 'about') return <AboutPage />;
  if (target === 'practice') return <PracticePage />;
  if (target === 'gallery') return <GalleryPage />;
  if (target === 'process') return <ProcessPage />;
  if (target === 'contact') return <ContactPage />;
  if (target === 'press') return <PressPage />;
  if (target === 'privacy') return <PrivacyPage />;
  if (target === 'questions') return <QuestionsPage />;
  if (target === 'commissions' && CommissionsPage) {
    return (
      <Suspense fallback={null}>
        <CommissionsPage />
      </Suspense>
    );
  }
  if (target === 'houses' && HousesPage) {
    return (
      <Suspense fallback={null}>
        <HousesPage />
      </Suspense>
    );
  }
  if (target === 'aboutTree' && AboutTreePage) {
    return (
      <Suspense fallback={null}>
        <AboutTreePage />
      </Suspense>
    );
  }
  if (target === 'engine' && DevRoutes) {
    return (
      <Suspense fallback={null}>
        <DevRoutes route={route} />
      </Suspense>
    );
  }
  return <SplashPage />;
}
