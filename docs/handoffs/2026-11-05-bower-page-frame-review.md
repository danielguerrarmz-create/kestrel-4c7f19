# Bower page frame review

Date: 2026-11-05
Branch: codex/bower-tech
Preview: http://127.0.0.1:5333/
Status: local changes only. Deployment remains on hold at Daniel's request.

## What changed

- Shared page snapping now defaults to native proximity with normal stops. No wheel or touch interception. Reduced motion disables snapping. Mobile image spreads use stable viewport height instead of changing with browser chrome.
- Home's content frames now share one viewport rhythm with centered content and shorter copy.
- Process's portrait growth video and five-stage sequence fit a normal page frame. Shorter introductory copy; flexible content heights on small screens.
- Practice's founders and mission now fit desktop frames. Removed excess top/bottom spacing, aligned the mission list and restored dark mobile text that was previously white on white. Tablet founder portraits give more room to biographies.
- Works' opening aligns with the shared gutter; removed the mobile title's downward offset. Its existing sticky image-growth sequence is preserved.
- Questions uses consistent desktop frames, shorter narrative answers and freely scrolling mobile text. Long headings wrap within their columns. Fees, scope, separate appointments and qualifications remain intact.
- Press now has a full-height phone opening. About uses the current shared Bower header and white background. About's founder-authored manifesto and the Privacy notice remain unchanged.
- Tech joins proximity snapping, with roomy content frames; long technical tables remain taller than a screen rather than being clipped or shrunk.
- Updated generated text mirrors to reflect rendered copy.

## Why

The previous default was mandatory snapping with forced stops. Several sections mixed viewport sizing and large fixed padding. At 1280 x 720, Process growth measured 1138px and Practice mission 994px. At 390 x 844, growth measured 1207px, Practice mission 1440px and Press only 284px. These mismatches broke the intended frame rhythm.

## How verified

- Reviewed all public page routes. Measured desktop 1280 x 720, phone 390 x 844, narrow phone 320 x 568 and tablet 820 x 620.
- Home, Process, Practice and Contact desktop frames now measure 720px at a 720px viewport. Process frames measure 844px on the 844px phone viewport. Longer forms, reading pages, technical evidence and gallery scroll sequences intentionally retain natural height.
- No horizontal page overflow or clipped marked frames in the phone audit. Long FAQ heading overflow found at 320px and 820px was fixed and rechecked.
- Real scrolling landed Process growth at top=0. Contact's fragment link landed its form at top=0; the remaining form and submit control were reachable by scrolling without being pulled back. No form was submitted.
- Pause-free native scrolling is preserved; reduced-motion behavior remains in CSS. Reduced-motion mode was not emulated in the browser during this pass.
- 493 page, content, snapping and house-rules tests passed across 39 files. Final targeted rerun passed 35 tests; generated mirrors and SEO passed 6. Typecheck and final production build passed. git diff --check passed.
- Regression test first reproduced the mandatory default, then passed with proximity. The existing Inter-variable.ttf build warning remains.
- No browser console errors observed.

## Review evidence

- C:/Users/danie/scratch/2026-11-05/bower-tech/frame-audit.json (before/after measurements; small-phone/tablet arrays retain the findings before the final heading fix)
- C:/Users/danie/scratch/2026-11-05/bower-tech/practice-desktop.png
- C:/Users/danie/scratch/2026-11-05/bower-tech/practice-mobile.png
- C:/Users/danie/scratch/2026-11-05/bower-tech/process-mobile.png

## What's left

Daniel's visual review. Nothing committed, pushed or deployed. Existing unrelated untracked worktree artifacts and the personal portfolio remain untouched.

## Files touched in this pass

- src/ui/usePageSnap.ts and usePageSnap.test.ts; new ui/editorialFrames.css
- src/index.css and src/main.tsx
- src/pages/SplashPage.tsx and SplashPage.test.ts
- src/pages/ProcessPage.tsx and process-journey.css
- src/pages/PracticeEditorial.tsx and practice-garden.css
- src/pages/QuestionsPage.tsx, questions/copy.ts and copy.test.ts
- src/pages/PressPage.tsx, AboutPage.tsx, bower-direction.css
- src/pages/TechPage.tsx
- Generated public/agent mirrors and this handoff
