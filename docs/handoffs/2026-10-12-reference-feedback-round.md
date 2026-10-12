# Reference feedback round

Date: 2026-10-12

## What changed

- Shortened the opening lockup animation from about 4.7 seconds to about 2.7 seconds.
- Tightened the homepage company-stage paragraph while preserving the building technology company position.
- Standardized the editorial white token and mobile menu surface to pure white.
- Centered footer navigation independently from the logo and copyright widths.
- Added the missing gallery opener fade-in.
- Rebalanced the Process growth and Five Acts compositions.
- Made the Process growth film and both seasonal image sequences start when they enter the viewport and pause or reset off-screen.
- Turned the estate aerial into a full-page homepage scene.
- Restored the Bower-on-the-knoll study as a supporting full-bleed image.

## Why

These changes respond to the annotated visual review: reduce waiting, remove copy and spacing friction, keep backgrounds consistent, and make motion begin at the moment a visitor can see it.

## How to verify

1. Open `/`, `/gallery`, `/process`, and `/contact` at desktop width.
2. Repeat at 390 by 844.
3. Confirm the homepage intro completes in about 2.7 seconds.
4. Confirm seasonal transitions begin with their first frame when scrolled into view.
5. Confirm the Process film pauses off-screen and restarts from the beginning on re-entry.
6. Enable reduced motion and confirm animated sequences remain on their first frame.
7. Run `npm test`, `npm run typecheck`, and `npm run build`.

## What's left

- Visual sign-off on the full-page estate image and restored knoll study.
- Push, PR update, merge, and deployment require Daniel's separate approval after preview.

## Files touched

- `src/pages/SplashPage.tsx`
- `src/pages/GalleryPage.tsx`
- `src/pages/ProcessPage.tsx`
- `src/pages/splash/BowerLoading.tsx`
- `src/pages/bower-direction.css`
- `src/pages/process-journey.css`
- `src/ui/useViewportPlayback.ts`
- `src/ui/Footer.tsx`
- `src/ui/EditorialHeader.css`
- `src/index.css`
- `tailwind.config.js`
- `src/pages/ProcessPage.test.ts`
