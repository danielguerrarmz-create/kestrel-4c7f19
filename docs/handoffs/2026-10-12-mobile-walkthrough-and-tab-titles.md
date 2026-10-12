# Mobile walkthrough and browser-tab titles

Date: 2026-10-12

## What changed

- Simplified every public browser-tab title to the `Bower - Page` pattern.
- Matched the mobile Practice entry to the full-screen Works and Process entry sequence.
- Changed the mobile Practice mission labels to white as the homepage gradient darkens so they remain legible.
- Kept the desktop layouts and social-card copy unchanged.

## Why

- Short titles are easier to scan in browser tabs and on mobile task switchers.
- The Practice entry previously ended at 72 percent of the viewport and exposed the next section too early.
- Dark label text lost contrast in the lower half of the approved green gradient on phones.

## How to verify

1. Run `npm test`, `npm run typecheck`, and `npm run build`.
2. Open every public route and confirm its title follows `Bower - Page`.
3. At 390 x 844, review Home, Works, Process, Practice, Contact, Questions, Press, and Privacy.
4. On Practice, confirm the opening fills the first screen and the mission list remains legible through the green footer transition.

## Files touched

- `index.html`
- `src/seo.ts`
- `src/seo.test.ts`
- `src/pages/practice-garden.css`
