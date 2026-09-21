# Practice year chapters and portfolio formatting

## What changed
- Four year chapters now place the year, title, and short introduction above the images. Unequal widths and vertical offsets balance the desktop pairs. The cardboard care-device image is on the left.
- Replaced tight vine hairpins with continuous, gently bending curves through the space between images. Mobile keeps the vine beside the reading column.
- Kept Projects & research on one line, with its introduction below.
- Standardized the desktop portfolio to one hero and three supporting images. Added the existing KUKA rosette simulation asset to complete the robotics set. Original media remains uncropped.
- Removed every rendered What we learned block. Description and recognition now occupy two wider columns below the images.
- All portfolio images open the lightbox, including on mobile. Menu selection uses click or keyboard focus, avoiding accidental changes on hover.
- The combined delivery and commission section uses a sage background.

## Why
Responds to the five latest annotations and the request to improve hierarchy, image density, asymmetry, and gentle vine continuity.

## How to verify
Open http://127.0.0.1:5180/about/practice. Review the four chapters, select each portfolio project, and enlarge its hero or side images. Check the mobile lightbox and the sage closing section.

Validated typecheck, production build, bundle boundary check, and 22 focused tests. Browser checks covered all eight desktop projects, consistent four-image media frames, and mobile enlargement and overflow.

## What's left
Daniel's visual review. No push, deployment, or merge performed.

## Files touched
- src/pages/PracticeEditorial.tsx
- src/pages/PracticePage.tsx
- src/pages/practice-garden.css
- src/pages/about/projects.ts
- src/pages/PracticeEditorial.test.ts
- public/agent/practice.md (generated)
