# Process editorial readaptation

Date: 2026-10-07

## What changed

- Rebuilt the local Process page around the current live page narrative and five-act commissioning structure.
- Replaced the prior interactive workshop presentation with the restrained editorial format used across the refreshed site.
- Assigned six distinct selected renditions: Ancient Bower, Walled Garden, New Bower, Growing Bower, Mature Bower and Winter Bower.
- Replaced the three-stage growth strip with Daniel's supplied nine-second portrait video.
- Optimized the website copy from 37.1 MB at 1088 by 1920 to 6.6 MB at 720 by 1270 while preserving the supplied original in Downloads.
- Converted the final winter still into a four-frame installation-to-winter crossfade.
- Removed the requested hero, image and closing labels, plus the former closing copy block.
- Rebuilt the five acts as an open two-column composition without numbers or dividing lines.
- Corrected the page-level image rule that had enlarged the footer logo.
- Replaced the prologue image with the higher-resolution Walled Garden rendition.
- Rebuilt the growth chapter as a portrait-video and text pairing, with the contextual paragraph held above the heading.
- Added the approved “Every landscape asks for a different answer” statement and conversation link over the four-frame transition.
- Matched the closing reference more closely with a four-line headline, reduced type scale, narrower CTA and lower headline placement.
- Smoothed the four-frame sequence into overlapping 1.7-second crossfades with longer holds between images.
- Rebuilt the prologue as a full-screen warm-ivory text plate matching the supplied live-page reference, with the paragraph upper-left and statement lower-right.
- Increased the growth heading line-height so adjacent descenders and dots remain clearly separated.
- Re-encoded the growth video to 3.0 MB desktop and 1.2 MB mobile files, added fast-start metadata and a 92 KB poster while retaining silent autoplay and looping.
- Removed the opening background image and converted the hero, prologue and five-act section to white.
- Moved Ancient Bower to the first full-bleed image, right-aligned the prologue statement, numbered the five acts and added grounding rules below each title.
- Rewrapped the process heading as “Five acts of” and “making,” and moved the closing CTA directly beneath its statement.
- Simplified the universal footer to the Bower logo, navigation and globally worded copyright, with the copyright vertically centered.
- Rebuilt the Process tests and regenerated the public agent mirror.

## Why

The local Process page had diverged from the live narrative and used repeated imagery. The readaptation restores the approved live story while matching the new site's typography, spacing and image-led pacing.

## How to verify

1. Open `http://127.0.0.1:5180/process` on desktop and confirm the hero reads “From landscape to Bower.”
2. Confirm the portrait growth video autoplays silently and loops to the left of “The garden continues the architecture.”
3. Confirm the final four-frame transition cycles through installation, growth, maturity and winter beneath the white closing statement and CTA.
4. Confirm the five acts are numbered, each title has a grounding rule, and the footer logo remains at its normal size.
5. Repeat at 390 by 844 and inspect image crops, heading wraps, video width and act-list stacking.
6. Run `npx vitest run src/pages/ProcessPage.test.ts`, `npm run typecheck`, `npm run build` and `git diff --check`.

## What is left

- Visual sign-off from Daniel.
- No commit, push or deployment has been performed.

## Files touched

- `src/pages/ProcessPage.tsx`
- `src/pages/ProcessPage.test.ts`
- `src/pages/process-journey.css`
- `public/assets/process/bower-growth-transition.mp4`
- `src/agent/agentMirror.generated.test.ts`
- `public/agent/process.md`
- `src/ui/Footer.tsx`
- `src/ui/Footer.test.ts`
