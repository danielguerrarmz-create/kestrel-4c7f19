# Selected image refresh

Date: 2026-10-06

## What changed

- Imported all 29 current selected Bower Marketing design studies into `public/assets/selected` with source hashes and dimensions recorded in `provenance.json`.
- Generated responsive WebP variants at 400, 800, 1280, 1920 and 2560 pixels where the source width allowed it.
- Updated the website to the short, stable selected-image filenames used by the marketing directory.
- Expanded the gallery to 24 public-facing studies: a 10-image immersive narrative and a 20-image thumbnail collection with intentional overlap.
- Hand-curated the thumbnail order by visual contrast rather than source-folder numbering.
- Moved the summer/winter family and floral/autumn canopy pairs out of the thumbnail collection and into the immersive narrative.
- Kept the technical joint on Process and routed the four matched growth studies into the homepage time sequence instead of duplicating them in the gallery collection.
- Updated commission imagery by subject: theatre for cultural work, banquet for gathering, and woodland for ecology and learning.
- Updated the Open Graph card from the current Estate Aerial rendition.
- Added a mobile-specific focal point for Meadow Tea so the people and full arch remain visible on a 390px screen.

## Why

The selected marketing directory now contains newer renditions and additional approved studies. The website still referenced the older 13-image import and legacy filenames. The refresh brings the site to the current source set without treating every image as interchangeable or loading every study as a full-screen mobile panel.

All public copy continues to describe these images as concept visualisations or design studies, not completed buildings or verified planting records.

## How to verify

1. Open `http://127.0.0.1:5180/` and confirm the Meadow Tea hero crop on desktop and mobile.
2. Open `http://127.0.0.1:5180/gallery` and confirm the 10-image immersive narrative and varied 20-image collection order.
3. Open `http://127.0.0.1:5180/process` and confirm the Timber Joint, Orchard Approach, Estate Aerial and seasonal studies.
4. Open `http://127.0.0.1:5180/contact` and confirm the Walled Garden hero.
5. Run `npm test`, `npm run typecheck`, `npm run build`, and `git diff --check`.
6. Confirm `public/assets/selected/provenance.json` contains 29 entries with no source-hash mismatch.

## What is left

- Visual sign-off from Daniel.
- The legacy selected-image derivatives remain unreferenced in `public/assets/selected`. Removing them is optional cleanup and requires explicit deletion approval.
- No commit, push or deployment has been performed.

## Files touched

- `src/data/selectedImages.ts`
- `src/pages/GalleryPage.tsx`
- `src/pages/GalleryPage.test.ts`
- `src/pages/SplashPage.tsx`
- `src/pages/SplashPage.test.ts`
- `src/pages/ProcessPage.tsx`
- `src/pages/ProcessPage.test.ts`
- `src/pages/ContactPage.tsx`
- `src/pages/CommissionsPage.tsx`
- `src/pages/about-tree/milestones.ts`
- `src/pages/splash/HowItWorks.tsx`
- `src/agent/agentMirror.generated.test.ts`
- `src/seo.ts`
- `scripts/gen-og-card.mjs`
- `public/assets/selected/`
- `public/assets/social/og-card-v2.jpg`
- `src/data/imageVariants.generated.json`
- `public/agent/` and `public/llms.txt`
