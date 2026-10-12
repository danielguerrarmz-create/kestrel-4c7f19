# Homepage and gallery refinement

Date: 2026-10-07

## What changed

- Compressed the homepage time sequence so its heading, three images and captions fit inside one desktop or mobile viewport.
- Enlarged the time-sequence heading and anchored its three studies at the bottom of the frame.
- Increased the white space around the homepage text interlude.
- Vertically centred the interlude explanation against the three-line statement and moved the seasonal image lower.
- Restored the summer-to-winter family morph using selected studies 09 and 08.
- Changed the homepage hero cycle to studies 04, 19 and 01.
- Imported the expanded 36-study selected-image source set and regenerated responsive variants.
- Recut the ten-image gallery narrative to studies 12, 24, 05, 18, 03, 29, 15, 06, 14 and 31, ordered to alternate light, dark, cool and warm scenes.
- Replaced Estate Aerial and Grape Oculus in the gallery collection with Ancient Bower and Family Supper.
- Moved the concept-study disclosure from the gallery heading to the bottom of the collection.
- Renamed the visible Gallery destination to Works while retaining the stable `/gallery` route.
- Rebuilt the Works entry as a full-height white title frame matching the supplied reference, followed by Rose Wisteria as the first image.
- Restored the Works header to the shared global header and kept Ancient Bower only in its existing collection position.
- Removed the duplicate concept-study line beneath the collection, halved the bottom whitespace, matched the entry note to the Inter UI typography and shifted the desktop entry composition slightly right.
- Lowered the homepage time-sequence heading to the midpoint between its former position and the image row without moving the images.

## Why

The homepage sequence previously extended beyond a single frame and the gallery opening carried unnecessary qualification beside its title. The revised layouts keep each idea visually discrete, use the current selected imagery, and preserve the public distinction between concept studies and completed buildings.

## How to verify

1. Open `http://127.0.0.1:5180/` at 1651 by 859 and confirm the full time sequence fits in one frame.
2. Confirm the homepage hero rotates through Garden Exhibition, Floral Canopy and Meadow Tea.
3. Confirm the seasonal scene morphs between Summer Family and Winter Family.
4. Open `http://127.0.0.1:5180/gallery` and inspect the ten-image narrative sequence.
5. Confirm Ancient Bower and Family Supper appear in the collection while Estate Aerial and Grape Oculus do not.
6. Confirm the concept-study disclosure appears beneath the final collection row.
7. Repeat the homepage and gallery checks at 390 by 844.
8. Run `npm test`, `npm run typecheck`, `npm run build` and `git diff --check`.

## What is left

- Visual sign-off from Daniel.
- No commit, push or deployment has been performed.

## Files touched

- `src/data/selectedImages.ts`
- `src/data/imageVariants.generated.json`
- `src/pages/SplashPage.tsx`
- `src/pages/SplashPage.test.ts`
- `src/pages/GalleryPage.tsx`
- `src/pages/GalleryPage.test.ts`
- `src/pages/bower-direction.css`
- `public/assets/selected/`
- `public/agent/` and `public/llms.txt`
