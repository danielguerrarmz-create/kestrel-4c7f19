# Practice timeline and portfolio distinction

## Subsequent review
The current version supersedes the expandable-history layout below. All timeline images are visible, with desktop records reduced by one third and alternating left/right. The portfolio uses a two-column image grid again. Removed the founders and history introduction headings. Opening top padding increased.

One measured botanical strip now runs from the opening through the founders and history to a larger emblem. Its segments share endpoints and reveal together with scrolling. At the end, a curling path gives way to the original emblem. Desktop and mobile measurements show no gap at the join. Timeline videos autoplay muted and loop, with controls retained for reduced-motion users. The visible Plentify clip was verified playing.

Removed the split italic heading treatment on Home, Process and the shared commission invitation. All nine public routes were checked for remaining italic heading elements and horizontal overflow; none found. Practice checked at 390px and 320px. Eight focused tests, typecheck, build and bundle scan passed. No push or merge.

## What changed / why
- History now has four chronological milestones linked by a growing vertical stem. Each has a lead image and concise story; supporting historical media remains available in expandable archives.
- Portfolio is explicitly titled Projects & research, using larger alternating project rows, original credits and expandable project details.
- Botanical artwork is generated vertically using the existing gongbi renderer, framing text instead of forming horizontal separators.
- All Practice grounds are white. Images have a narrow edge feather. Captions are shortened and limited to two visible lines; descriptive alt text remains intact.
- The history-ending vine descends into the supplied emblem.

## Verification
Typecheck, production build, four focused tests and production bundle scan passed. Browser reviewed desktop, 390px and 320px. No horizontal overflow; zero captions exceeded two lines at 390px. Checked archive expansion and seven loaded botanical ornaments. Four milestones and eight portfolio projects remain.

## What's left
Visual review and collaborative founder copy. No push, merge or deployment. The vertical approach works at both tested mobile widths, so the conditional alternative mockups were not needed for responsive feasibility.

## Files touched
- src/pages/PracticeEditorial.tsx
- src/pages/PracticePage.tsx
- src/pages/practice-garden.css
- public/agent/practice.md
