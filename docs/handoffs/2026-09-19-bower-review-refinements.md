# Bower review refinements
Date: 2026-09-19

## What changed
- Opening keeps its original 3.2-second motion and holds the resolved green logo for two more seconds (5.2 seconds total). Skip and reduced-motion behaviour remain.
- Homepage image now carries only Living architecture, View the gallery, and the design-study disclosure. Narrative sections are accessible by ordinary scrolling.
- View the gallery goes directly to /gallery, the same route as the navigation. Removed the competing homepage gallery and the intervening burst. Gallery introduction is compact and its first images appear immediately, without forced snapping.
- Process gets 150px desktop chapter padding, 100px heading-to-image separation, larger paragraph gaps and 85px mobile chapter padding.
- Practice reuses the earlier generated botanical renderer and original timeline data, adds year selection and expandable records for all eight curated projects, and caps founder portraits at 144px desktop / 96px mobile. Historical media files are unchanged.
- Fixed inherited mobile header collisions in Practice and Contact. Full-height opening images request sufficient resolution for portrait crops.

## Why
The user requested less text over product imagery, a direct gallery path, more generous Process spacing, restoration of earlier Practice elements, and mobile verification.

## How to verify
Preview: http://127.0.0.1:5180/
Open a fresh browser session to see the 5.2-second logo opening. Existing sessions remember that it was seen.
Follow View the gallery; verify /gallery. On a phone-width viewport, enlarge a study and close the viewer.
Visit /process, inspect spacing and use Find the part.
Visit /about/practice, inspect flowers, portraits, select 2025, expand Robots as Instruments.
Test /contact at 320px: navigation, image disclosure and heading must not collide. Do not submit a test enquiry.

## Validation
- Full suite: 969 tests in 76 files passed.
- TypeScript and production build passed; bundle leak check found no gated surfaces.
- Browser visual review at 1280px and 390px; narrow 320px check across home, gallery, Process, Practice and Contact, with no document horizontal overflow.
- Exercised gallery navigation/viewer, timeline year selection, project disclosure and Process component isolation.
- These are desktop browser viewport checks, not physical iOS/Android device testing.

## What is left
Visual signoff. Changes are local, uncommitted and unpushed on codex/bower-gallery-process-v2. Existing draft PR #46 is not merged. User AGENTS requires permission before pushing.

## Files touched
src/pages/SplashPage.tsx, SplashPage.test.ts, GalleryPage.tsx, PracticeEditorial.tsx, PracticePage.tsx, ContactPage.tsx, bower-direction.css, splash/BowerLoading.tsx; src/agent/agentMirror.generated.test.ts; public/agent mirrors; qa/bundle-leak.mjs.
Earlier local EditorialHeader and animation corrections remain included; see the arrival-corrections handoff.

## Follow-up: homepage browser annotations
Removed the specifically marked opening disclosure, section eyebrows, growth caption and growth disclaimer. The founding eyebrow is hidden on the homepage only. Centred Somewhere to be in a single evenly padded band directly between the opening and gathering images, absorbing the separate 80px margin. Growth now shares the white canvas rather than switching to grey-green. Removed the three-state growth selector; a single mature-growth poster occupies the future film position. No finished growth film is present in public assets, so video integration remains pending delivery of that asset. Other image captions and current-stage company copy remain.
Validation: homepage and generated mirror tests passed (6); production build and private-route bundle check passed. Desktop interlude visually reviewed; phone layout checked at 390px. No push or merge.

## Follow-up: restore editorial balance
Changed Somewhere to be from a centred title to a left-aligned two-column introduction with a concise product description. Added a transitional sentence pair, A place to gather / A place that grows, joined by a fine rule across a white-to-pale-green band. The growth chapter retains the pale green and fades back to white before the following chapter. Reduced the homepage final Contact link from 3.5vw to 2.8vw (20 percent), preserving its touch target. Desktop and 390px visual review; six homepage/mirror tests and production build passed. Still local, no push or merge.

## Final homepage closing-section review
Simplified the homepage invitation to a single left-aligned stack: smaller heading, one founding-commissions sentence and a compact Contact link. Removed its separate legal-style bottom row by moving the unchanged current-stage statement into the earlier company description. Shared Process invitation stays unchanged through an optional quiet variant. Six homepage/mirror tests passed; build passed; desktop and phone layouts reviewed. No push or merge.
