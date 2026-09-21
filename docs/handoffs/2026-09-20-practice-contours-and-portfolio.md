# Practice contours and restored portfolio

## What changed
- Timeline media is grouped into seven alternating pairs, with no more than two images on one side. Smaller image heights reduce the long empty areas beside 2024.
- Two painted vines cross below the opening text and descend into a measured route along the timeline media. Curves bend below captions and join the emblem.
- The emblem transition uses a damped spring for smoother scroll response. The supplied emblem artwork is unchanged.
- Restored the existing `ListView` from `PracticePage.tsx`: left project menu, fitted image wall, information underneath, keyboard selection, and image lightbox. Desktop occupies one fixed frame; mobile retains the original stacked presentation.
- Combined delivery partnerships, specialist disciplines, and the commission link into one closing section.
- Timeline captions show years. Daniel confirmed year-only dates for now and Robotic Factory as 2025.

## Why
Addresses the latest nine browser annotations. The portfolio uses the actual retained earlier component rather than another interpretation of its layout.

## How to verify
Open http://127.0.0.1:5180/about/practice. Check the crossed opening vines, alternating timeline pairs, the scroll transition into the emblem, and the restored project menu. Select Plentify and Robotic Factory, then open an image. Check widths 1355, 390, and 320 pixels.

Typecheck and nine focused tests pass. Browser checks confirmed two images per group, in-place project switching, and no horizontal overflow at desktop and mobile widths.

## What's left
Visual review by Daniel. Month dates remain intentionally omitted. No push, deployment, or merge performed.

## Files touched
- src/pages/PracticeEditorial.tsx
- src/pages/PracticePage.tsx
- src/pages/practice-garden.css
- src/pages/PracticeEditorial.test.ts
- public/agent/practice.md (generated mirror)
