# Gallery review
Date: 2026-09-19

## What changed
- More space between Works and the first image.
- Image captions use solid white labels, 16px titles and no blend-mode inversion or disappearance.
- Every desktop study opens upwards from a rounded canopy mask into the full frame. Scroll progress is calculated from each section's current bounds so it holds open through exit. Reduced motion shows full still images.
- After the final image, all eight studies descend and settle into a regular collection grid. Selecting any thumbnail opens the existing image viewer.
- Grid adapts from four desktop columns to two phone columns (one on very narrow phones). Phone immersive sequence remains ordinary touch-friendly image browsing; collection entry motion has a shorter travel distance.

## Why
User annotated opening spacing, unreadable captions, harsh transitions, and requested a final all-images gallery with a descending arrival animation.

## How to verify
http://127.0.0.1:5180/gallery
Scroll through the first three images. Each canopy should expand and stay fully open as it exits. Captions remain readable against garden and snow scenes. Continue after Inside the Bower to see eight images settle into the collection. Open Winter canopy, close it, and check the phone grid/viewer.

## Validation
Gallery curation and generated mirrors: five tests passed. Production build passed. Desktop and 390px browser inspection; verified full-open masks, eight grid items, image viewer on desktop and mobile, and no mobile document overflow. Physical-device testing not performed.

## What is left
Visual approval. Local changes only; do not merge PR #46. Push requires permission under user AGENTS.

## Files touched
src/pages/GalleryPage.tsx
src/pages/bower-direction.css
src/agent/agentMirror.generated.test.ts
public/agent/gallery.md

## Softer reveal follow-up
The first image now starts full-frame, avoiding the rounded preview beneath Works. Later images use a feathered radial mask that expands beyond the frame; their centres stay sharp while the boundary dissolves. Replaced white caption boxes with unnumbered white titles over a low bottom-edge shadow. Removed visible numbers from collection titles. Desktop visual inspection confirmed an unmasked first image, feathered subsequent image and legible lighter caption treatment. Gallery/mirror tests and production build pass. Local preview only.
