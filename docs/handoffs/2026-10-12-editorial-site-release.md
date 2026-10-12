# Editorial site release

Date: 2026-10-12

## What changed

- Reworked the homepage, Works, Process and Practice entry sequences into a shared editorial system.
- Updated the global header, mobile navigation and footer across public pages.
- Imported the current selected design-study catalog with responsive image variants and source provenance.
- Rebuilt Works around the approved image sequence and collection layout.
- Rebuilt Process around the approved white opening, Ancient Bower first image, five numbered acts and growth media.
- Refined Practice with the homepage-derived green gradient and aligned opening typography.
- Regenerated the agent-readable mirrors, social card and image-variant manifest.

## Why

This release consolidates the visual review completed between October 6 and October 12 into one coherent public-site update while preserving the distinction between concept studies and completed work.

## How to verify

1. Compare `/`, `/gallery`, `/process`, `/about/practice` and `/contact` with the production site before merge.
2. Check the same routes at desktop and phone widths.
3. Confirm the Works collection and Process opening use the approved selected studies.
4. Confirm the site continues to identify the imagery as concept studies or concept visualisations.
5. Run `npm test`, `npm run typecheck`, `npm run build`, `npm audit --omit=dev` and `git diff --check`.
6. Verify the production deployment and responsive assets after merge.

## What's left

- Merge the reviewed pull request.
- Confirm the Vercel production deployment and public routes.

## Files touched

- `src/`
- `public/agent/`
- `public/assets/about/`
- `public/assets/home/evolution/`
- `public/assets/process/`
- `public/assets/selected/`
- `scripts/`
- `index.html`
- `public/llms.txt`
