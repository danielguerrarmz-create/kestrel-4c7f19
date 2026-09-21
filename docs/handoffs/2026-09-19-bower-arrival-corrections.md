# Bower arrival corrections

Date: 2026-09-19 (local)
Status: Local preview for visual sign-off. Not pushed. PR #46 remains unmerged.

## What changed

- The loading animation now retains one emblem from reveal to final placement. Only the lettering fades in beside it. No logo replaces the o.
- The arrival now shows a full-bleed summer garden study, the product description and a readable invitation. On mobile, the photograph transitions into a green text field. The poem is secondary on desktop.
- Entry controls sit above non-interactive artwork and remain available by pointer and keyboard. Short viewports can scroll the arrival rather than losing its controls.
- White header branding now uses the approved full lockup without the inverse asset's solid rectangular background.

## Why

- **Loader:** inspected samples 0 through 192 at 60 fps across the full 3.2-second timeline, before and after. The old animation faded a moving 190px emblem into a second emblem inside the complete lockup. Around 1.9 to 2.6 seconds, the two occupied different positions/scales and appeared as a ghosted jump. The new animation has no emblem crossfade.
- **Entry:** reproduced on the user's preview tab. A pointer click left the arrival unchanged while Enter on the focused button worked. Hit-testing the button returned the animated `strong` text, even below its layout rectangle. The new artwork is non-interactive, and the control has an explicit stacking position. Pointer activation now enters the dark phase and reaches the visible gallery.
- **Arrival:** the text-only opening withheld the product. A visitor now sees both the structure and what Bower offers immediately.

## How to verify

1. Open http://127.0.0.1:5180/ and inspect the first screen at desktop and 390px mobile width.
2. Click Enter the world with the pointer. Confirm darkness, four image cuts, then the gallery. Test keyboard activation and Skip to gallery too.
3. In the gallery, choose Replay the opening. Confirm one continuously moving emblem, then intact lettering. Skip and Escape remain available.
4. The local frame-review harness is http://127.0.0.1:5180/qa/iterations/2026-09-20-loading/frames.html?version=after&page=0. Next/Previous traverses all 193 samples. Switch version compares the retained original CSS. The harness is development-only and not a Vite production entry.

Browser checks: pointer activation on desktop and mobile; arrival-to-gallery completion; no horizontal overflow at 390px; the first-screen controls remain clear of artwork. TypeScript, build and relevant page/copy/SEO tests are also checked. No enquiry submitted.

## What's left

- Daniel's visual sign-off on this first screen.
- Explicit approval before pushing these corrections to PR #46, as required by the new global AGENTS.md instructions.
- No merge or deployment authorised by this turn.

## Files touched

- `src/pages/SplashPage.tsx`
- `src/pages/splash/BowerLoading.tsx`
- `src/pages/bower-direction.css`
- `src/ui/EditorialHeader.tsx`
- Generated mirrors under `public/agent/`
- Frame-review harness and before CSS under `qa/iterations/2026-09-20-loading/`
- This handoff
