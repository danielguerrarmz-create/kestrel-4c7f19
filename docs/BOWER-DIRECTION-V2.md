# Bower gallery and making direction

This is a review proposal, not a locked animation or wireframe. Built on current main; the older local experiment is preserved separately. Do not merge without review.

## Experience

- A short, skippable emblem opening interprets the Marketing round-01 motion study. The approved evergreen emblem unfurls and resolves beside the **intact** Bower wordmark. It never replaces the letter o. This is a web animation, not the original video embedded unchanged.
- Poem → visitor chooses Enter → darkness → four image cuts → a white, spatial gallery. A direct gallery bypass and reduced-motion route avoid the sequence. Replay is available inside the gallery.
- Large study views, a twelve-image overview, a growth-study selector and a green Contact invitation lead into the existing enquiry page.
- Process connects the computational prototype, robotic fabrication research, connection studies and the proposed commissioning route. The static specimen derives from existing engine geometry; the development engine itself remains gated out of production.

## Assets and scope

- Source: Bower Marketing product manifest v02, 28 active studies (001–020 and 022–029). Source hashes verified. WebP derivatives preserve the source composition; responsive variants regenerated. Existing Bower image URLs used on quieter pages receive matching current derivatives.
- Approved September logo masters: evergreen, timber and inverse, emblem and horizontal lockup. Only empty canvas trimmed and proportional resizing applied. Source hashes are in `public/assets/brand/provenance.json`; image hashes are in `public/assets/studies/provenance.json`.
- Approved palette: evergreen #354D40, timber #806346, ink #17160F, white. These are source-brand values, not placeholder colours.
- Bodoni Moda and Source Serif 4 remain self-hosted. Inter is now imported from the brand font package; the Google Fonts request is removed.
- Historical project photographs and video files are unchanged. Robotics footage is existing prior research, labelled as such, not evidence of a Bower factory.
- Existing pathname routing, Contact backend and separate printed/form addresses are preserved. The printed address remains clay@bowerbuild.org. No test enquiry was sent.

## Direction conflicts resolved

The supplied company statement supersedes older “design practice” positioning. Shared company copy, metadata and the Practice closing line now identify building technology. The new brief also asks for visible study disclosures, which supersedes the older instruction to put them only in alt text. The quieter page layouts and historical material remain intact.

There is no claim of engineering approval, a working Bower production line, manufacturing savings or guaranteed growth timing. The process describes the proposed route and distinguishes imagery, prototype and research evidence.

## Validation

TypeScript, production build and the full unit suite; generated SEO/mirror freshness and asset tracking; production bundle gate check. Browser review includes desktop and 390px mobile, opening/replay, dark/image/gallery progression, enlargement and Escape, twelve-study view, growth selection, component inspection and the Contact route. Reduced motion bypasses the image cuts and removes CSS animation. Contact delivery was not exercised.

## Reproduction

`python scripts/refresh-bower-assets.py --marketing-root "PATH/TO/Bower Marketing"` imports approved source assets (requires Pillow). Then run `npm run gen:images` and `npm run gen:og`.

`npx vite-node scripts/gen-process-specimen.ts` regenerates the static prototype specimen. It is a centreline form study, not a fabrication drawing.
