# Global inline loader

Date: 2026-10-14

## What changed

- Added one site-wide cold-load state directly to `index.html`.
- Kept the state asset-free: inline HTML, inline CSS, system fonts, and one CSS hairline animation.
- Delayed its appearance by 180 ms so normal connections do not flash a loader.
- Released it after the React shell and first eager image are ready, with a three-second image ceiling.
- Suppressed the heavier homepage intro only when the slow-load state was actually visible.
- Preserved the non-JavaScript fallback by hiding the loader inside `noscript`.
- Added a site-wide, asset-free evergreen outline while content images load, with a darker hairline that traces the image perimeter.
- Excluded header, footer, and intro branding from image outlines.

## Why

On poor connections the previous shell was a blank white page until the JavaScript application arrived. The new state confirms that the site is loading without adding another network request or making normal navigation feel slower.

## How to verify

1. Throttle a cold page load below 1 Mbps with at least 300 ms latency.
2. Confirm the centered `bower` state appears on every public route.
3. Confirm it fades into the requested page once the shell and first eager image are ready.
4. Confirm the homepage does not show the full brand intro after the slow-load state.
5. Reload without throttling and confirm the global state does not flash.
6. Disable JavaScript and confirm the text fallback remains readable.
7. Throttle images and confirm content image boundaries remain visible until their pixels arrive.

## What is left

- Nothing. The global loader and image-outline animation were approved for release.

## Files touched

- `index.html`
- `src/main.tsx`
- `src/pages/splash/BowerLoading.tsx`
- `src/ui/installImageLoadingFrames.ts`
- `src/index.css`
- `src/siteLoader.test.ts`
