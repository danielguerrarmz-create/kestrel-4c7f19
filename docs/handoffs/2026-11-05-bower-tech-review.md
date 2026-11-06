# Bower technology review and draft handoff

Date: 2026-11-05

## What changed

- Renamed the opening to Technology at Bower; removed the attribution paragraph, repeated uppercase labels, assembly caption and boxed playback control.
- Reduced the film and model sizes and established consistent content gutters.
- Reduced the page to six technical chapters. Removed the garden visualizations and the marked engineering-question box; source assets remain preserved locally.
- Paired the engine drawings, arranged connection details across the page, placed the surface drawing on the left, and separated the material schedules.
- Shortened headings and summaries. Detailed load schedules expand on request. Dated study status and unsolved analysis remain explicit.
- Included the preceding site-wide frame, proximity snapping, spacing and copy review.

## Why

The previous repeated two-column template forced oversized drawings beyond the frame and repeated explanatory headings. The revised page prioritizes technical evidence and brief captions.

## Verification

- 493 page, house-rule and snapping tests passed; six generated mirror/SEO tests passed.
- TypeScript and production build passed. The existing unresolved Inter font reference warning remains.
- Desktop 1703 x 859 and 1280 x 720: all seven primary frames equal the viewport height with no horizontal overflow.
- Phone 390 x 844 and narrow 320 x 568: no horizontal page overflow. Long drawings and tables retain natural vertical flow.
- Native proximity scroll settled the structural frame at y=0. Load schedules expand and collapse correctly.
- Browser evidence: C:/Users/danie/scratch/2026-11-05/bower-tech/engine-revised.png and joints-mobile-revised.png.

## Remaining

Draft review only. No merge or production deployment. Engineering figures describe historical studies, not fabrication approval.

## Files touched

TechPage.tsx, TechPage.test.ts, tech/content.ts, tech/tech.css, editorialFrames.css, and regenerated public mirrors. Earlier integration and site review files are recorded in the two adjacent handoffs.
