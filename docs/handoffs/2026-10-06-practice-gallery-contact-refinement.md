# Practice, gallery and contact refinement

## What changed

- Reworked the Practice mission into the supplied split editorial layout on the homepage's faded green, with a specialist-team grid and dark readable type.
- Enlarged both founder portraits and removed the opening and founder labels.
- Simplified Gallery headings and added original selected-image indices and names.
- Removed Contact page snap forcing, shortened the transition, and increased bottom spacing.
- Added a fixed-frame summer-to-winter crossfade to the homepage family scene.

## Why

These changes respond to the October 6 browser review and preserve the supplied reference's hierarchy while using Bower's visual language.

## How to verify

- Open `http://127.0.0.1:5180/about/practice` and inspect the founders and mission section.
- Open `http://127.0.0.1:5180/gallery` and inspect the heading and collection captions.
- Open `http://127.0.0.1:5180/contact` and scroll naturally from the hero into the form.
- Run `npm run build` and the targeted page tests.

## What's left

- Visual sign-off at desktop and phone sizes.
- No commit, push, or deployment has been made.

## Files touched

- `src/pages/PracticeEditorial.tsx`
- `src/pages/PracticeEditorial.test.ts`
- `src/pages/ContactPage.tsx`
- `src/pages/GalleryPage.tsx`
- `src/pages/GalleryPage.test.ts`
- `src/pages/practice-garden.css`
- `src/pages/bower-direction.css`
