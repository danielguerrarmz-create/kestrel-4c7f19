# Fixed portfolio frame and mobile project browsing

## What changed
- Desktop portfolio fills one viewport at the reviewed desktop sizes. Removed the introduction under its title.
- Standardized title, credit, description, award, publication, collaborator, and download positions. Download links are smaller; missing metadata leaves its slot unoccupied.
- All preview images and videos fill fixed frames with cover cropping, as requested. Expanded views retain the full originals.
- Restored hover selection on devices reporting a fine pointer and hover support. Click and keyboard focus remain available.
- Mobile now uses a labeled project selector, one hero, three thumbnails, and full project information. Thumbnails open the correct project's lightbox.
- Widened opening vines with spiral tips, aligned founder rows, shifted left-side timeline images outward, and raised the emblem.

## Why
Addresses the latest eleven browser comments and the request for a more usable mobile portfolio.

## Validation
Typecheck and 22 focused tests pass. Browser checks at 1355x886 and 1024x768 verified viewport-height portfolio sections and publication fields without overflow. Mobile checks at 390x844 verified selection, thumbnail enlargement, and no horizontal overflow.

## What's left
Visual review. No push, deployment, or merge performed.

## Files touched
- src/pages/PracticePage.tsx
- src/pages/PracticeEditorial.tsx
- src/pages/practice-garden.css
- public/agent/practice.md (generated)

## Subsequent spacing review
- Balanced both founder profiles as equal 390px columns, equidistant from the central vine.
- Grouped award and publication metadata with small labels, consistent spacing, and an adjacent paper link; empty fields no longer create internal gaps.
- Increased white bottom padding to 90px desktop and 95px mobile.
- Fixed hidden supporting images caused by duplicate shared animation IDs in simultaneously mounted desktop and mobile galleries. Frame thumbnails no longer share layout IDs; lightboxes remain interactive.
- Verified all three Plentify supporting images loaded at opacity 1 after project switching. Typecheck, six focused tests, production build and bundle boundary check passed.

## Founder breathing room and alternating chapters
- Raised opening copy by 70px desktop and 50px mobile.
- Enlarged desktop founder portraits to 126x158 and expanded space above and below the founder section.
- Alternated year introductions left/right on desktop, with a small inset variation on mobile.
- Measured vine curves now sweep into the empty space opposite each desktop year heading and rejoin the image gutter before the media begins.
- Verified desktop composition, text and image clearance, typecheck and production build.

## Branching ornament and project heading spacing
- Replaced the wide detours of the main stem with attached side branches. Alternate branches end in small coils or open tips.
- Branches occupy measured gaps between complete image rows, with 90px desktop and 82px mobile row spacing. Mobile stems remain in the left margin and use shorter branches and smaller coils.
- Leaf density now follows each path length, preventing short branches from inheriting an entire chapter's leaves.
- Increased projects heading gap to 44px desktop and 32px mobile. Verified the desktop section remains 886px in an 886px viewport.
- Verified mobile and desktop visually, typecheck, production build, bundle boundary check and diff whitespace check.
