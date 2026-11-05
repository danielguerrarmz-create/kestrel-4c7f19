# Bower technology page

Date: 2026-11-05
Branch: codex/bower-tech
Base: origin/main at 9b267e2, the PR 57 luxury art direction release.
Preview: http://127.0.0.1:5333/tech
Status: local implementation, not committed, pushed or deployed.

## What changed

Adapted all eight chapters of the personal portfolio's Bower case study into a public /tech route. Uses Bower's shared header and footer, Bodoni Moda headings, Source Serif text, evergreen accents and white editorial layouts. Introduces the design engine in company voice. Adds a Technology navigation item, canonical metadata, sitemap entry and generated text mirror.

Copied the original assembly film and approved chapter imagery without changing source assets. Videos use mobile and desktop variants, pause offscreen, expose a pause control and show a poster under reduced motion. Drawings open at full resolution. Intrinsic image dimensions reserve layout space; mobile tables remain within the page.

## Why

Bring the portfolio's technical explanation onto Bower's own website while retaining its brand and keeping historical model studies distinct from built work or engineering approval. The source's technical quantities, model revisions, unanswered questions and pending structural analysis remain visible.

## Sources

- Portfolio data: C:/Users/danie/code/portfolio-website/src/data/projects.ts, Bower record, id 8.
- Original homepage film: C:/Users/danie/code/portfolio-website/public/assets/projects/08-bower/bower-assembly-720.mp4.
- Destination assets: public/assets/tech/, 22 files, 11,483,902 bytes.
- Brand reference: current production home and Process page, plus the current main branch's shared components and typography.
- Older Bower Three and gridshell content is explicitly a historical study, not the current product design.

## How to verify

1. Open /tech on the local Vite preview. Check the opening, chapter links, full-size drawings, technical notes and contact CTA.
2. Check 390 px and desktop layouts. Confirm diagrams remain legible and tables do not expand page width.
3. Pause and resume the assembly study; scroll offscreen to stop it. Enable reduced motion to use the still image.
4. Run npm run typecheck and npm run build.
5. Run npx vitest run src/pages/TechPage.test.ts src/routing.test.ts src/houseRules.test.ts src/agent/agentMirror.generated.test.ts src/seo.generated.test.ts.

## Validation

- Desktop and 390 x 844 phone preview inspected. No page overflow at phone width.
- Pause/resume verified in browser; no browser console errors observed.
- Final targeted page/routing/house-rules tests: 57 passed. Generated mirror and SEO tests: 6 passed.
- Typecheck and final production build passed; git diff --check passed.
- Initial full suite: 983 passed, 3 failed. Two failures were the shared page registry missing the new route; fixed and rerun. The geometry suite timed out under full-suite load; its isolated rerun plus house rules passed all 33 tests. The complete suite was not rerun after these fixes.
- Build retains the existing unresolved /fonts/Inter-variable.ttf warning; no dependency changes were made.
- Screenshots: C:/Users/danie/scratch/2026-11-05/bower-tech/desktop.png and mobile.png.

## What's left

User visual approval and explicit deployment approval. No production state was changed. Keep the existing untracked QA artifacts in this worktree out of any future commit. Portfolio files were not edited.

## Files touched

- src/pages/TechPage.tsx, TechPage.test.ts, tech/content.ts, tech/imageSizes.ts, tech/tech.css
- public/assets/tech/*
- src/Root.tsx, src/routing.ts, src/routing.test.ts, src/seo.ts, src/seo.generated.test.ts
- src/ui/EditorialHeader.tsx
- src/agent/mirror.ts, src/agent/agentMirror.generated.test.ts, src/houseRules.test.ts
- public/agent/*.md, public/llms.txt, public/sitemap.xml, public/robots.txt, index.html
- This handoff
