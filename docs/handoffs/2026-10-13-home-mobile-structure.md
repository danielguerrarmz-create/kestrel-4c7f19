# Homepage mobile structure

Date: 2026-10-13

## What changed

- Rebuilt the mobile “A Bower begins when building ends” section as a left-aligned editorial heading followed by a large horizontal, snap-scrolling image sequence.
- Returned “A room for the life around it” to a structured image-and-copy layout instead of placing the copy over a full-screen image.
- Reframed the river-valley image as a shorter, uncaptioned landscape transition.
- Tightened the final green gradient and invitation spacing.
- Locked page scrolling while the mobile brand introduction is open so its handoff into the header cannot jump with the underlying document.
- Rebuilt the shared mobile footer as a compact logo, centered four-link navigation and legal line. The treatment applies across every page using the shared footer.
- Added a fixed leading gutter to the mobile growth-image rail equal to the gap between cards.

## Why

The previous mobile page reduced the growth sequence to three illegible thumbnails and treated the final two images as unrelated full-screen moments. The new sequence restores hierarchy, separates text from imagery and gives each lower-page section one clear role.

## How to verify

1. Run `npm run dev -- --host 127.0.0.1`.
2. Open `http://127.0.0.1:5333/?intro=1` in a 390 by 844 viewport and watch the complete brand introduction.
3. Review `/#object-in-time`, swipe the three growth studies, then continue through `/#life-around` and `/#knoll-study`.
4. Confirm there is no horizontal page overflow and that the final invitation transitions cleanly into the footer.
5. Check the homepage at 1440 by 900, then run `npm test`, `npm run typecheck`, `npm run build` and `git diff --check`.

## What is left

- Verify the automatic production deployment after merge.

## Files touched

- `src/pages/SplashPage.tsx`
- `src/pages/bower-direction.css`
- `src/index.css`
