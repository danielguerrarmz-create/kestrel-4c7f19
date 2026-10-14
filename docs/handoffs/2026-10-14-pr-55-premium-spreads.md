# PR #55: premium viewport spreads

## What changed

- Added soft vertical page snapping to true full-spread imagery.
- Sized homepage, Process, and Works full-spread images to the dynamic viewport on desktop and mobile.
- Replaced opaque logo artwork with the transparent lockup.
- Added a 20 percent brightness lift and two-pixel rise to logo hover states while keeping blend mode on the image itself.
- Removed green and green ombre backgrounds from public page sections and footers. Image overlays now use neutral black only where text contrast requires them.

## Why

- Full-spread imagery should read as a composed screen rather than a loose image that continues beyond the viewport.
- The opaque logo file exposed its rectangular canvas over dark backgrounds.
- Neutral white surfaces keep the photographs and typography in control of the palette.

## How to verify

1. Run `npm test` and `npm run build`.
2. Open the homepage, Works, Process, and Practice pages at desktop and phone widths.
3. Scroll slowly into each full-spread image and confirm it settles at the viewport edge without trapping ordinary content scrolling.
4. Hover the header and footer logos with a fine pointer. Only the transparent logo pixels should rise and brighten.
5. Confirm no public section or footer uses a green fill or green ombre.

## What's left

- Review and tune image margins and crop positions with Daniel on desktop and mobile before merge.

## Files touched

- `src/index.css`
- `src/pages/bower-direction.css`
- `src/pages/process-journey.css`
- `src/pages/practice-garden.css`
- `src/pages/SplashPage.tsx`
- `src/pages/ProcessPage.tsx`
- `src/pages/GalleryPage.tsx`
- `src/ui/EditorialHeader.tsx`
- `src/ui/EditorialHeader.css`
- `src/ui/Footer.tsx`
- Related page and footer tests
