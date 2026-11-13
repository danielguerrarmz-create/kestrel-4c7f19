# Buildings That Grow

A working presentation for Bower × MIT–LUMA. Editions 01 and 02 have sixteen scenes; editions 03 and 04 have fifteen after combining the first market and prospect conversations. The website is the dynamic version; its PDF is a deliberate static counterpart.

## Routes

- `/designx` and `/designx/`: interactive presentation.
- `/designx/2` and `/designx/2/`: second visual edition, using the architectural-editorial style guide.
- `/designx/3` and `/designx/3/`: third edition, opening with the material problem and manufacturing challenge.
- `/designx/4` and `/designx/4/`: fourth edition, pairing Argesta architectural typography with Safiro technical diagrams and a dark laboratory sequence.
- `/designx/pdf` and `/designx/pdf/`: original-edition PDF served inline.
- `/designx/3/pdf` and `/designx/3/pdf/`: matching third-edition PDF served inline.
- `/designx/4/pdf` and `/designx/4/pdf/`: matching fourth-edition PDF served inline.
- `/designx/downloads/Bower_DesignX_Buildings_That_Grow.pdf`: underlying exported file.

Vite development/preview and Vercel use the same routes. Presentation code, media and PDF stay under `public/designx/`. The marketing router yields to this document. Its navigation and sitemap remain unchanged. No external fonts, analytics or runtime APIs are required. Noindex headers discourage indexing.

The second edition keeps its entry point, style and interaction enhancements in `public/designx/2/`. It reuses source scenes, scene modules and media already under `public/designx/`, avoiding duplicate copies of large assets. The original presentation and its current PDF remain available at their existing URLs.

Edition 02 uses the supplied Helvetica Neue/Arial system, botanical palette and the existing Oculus emblem with a Georgia wordmark. Its `editorial.css` controls the art direction; `edition.js` controls the edition's sequence and headline revisions, plus scroll navigation, deliberate growth scrubbing and on-demand seeking through the customer film. The invention comes before customer segmentation, and the commercial sequence shows the reusable capability commissions are intended to develop. Eyebrow headings are removed; evidence and development-status notes remain. Keyboard, touch, direct scene controls and reduced-motion alternatives remain available. The PDF link is explicitly labelled as edition 01 until a second-edition PDF is requested.

Edition 03 uses that visual system and those controls, with its own story transformation and styles in `3/edition.js` and `3/editorial.css`. The first three scenes treat the material problem as shared ground for MIT–LUMA, then move directly to variability and Bower's developing production system. A cinematic construction horizon establishes the timing of material choices; living timber introduces the alternative and its production challenge; the Bower reveal holds only “Buildings that grow.” and “And the means to make many.” The subsequent technical and commercial scenes develop that promise. ETC's projected 55% growth in global building floor area has its 2022–2050 baseline and visible source. The two founder theses remain on slides 2 and 15. No measured Bower carbon advantage or operational factory is claimed. Earlier editions remain independent.

Edition 04 inherits the same fifteen scenes and evidence, with its own `4/edition.js`, `4/editorial.css` and `4/fonts.css`. The supplied Safiro and Argesta webfonts are hosted exclusively under `4/assets/fonts/`; their original filenames, ZIP sources and hashes are recorded there. Safiro uses its real 400–700 weights for the technical system, interface and supporting text. Argesta Display, Headline and Text use the supplied normal/italic cuts for architectural moments; no synthetic bold or italic is used. The actual Bower logo remains unchanged. The anatomy, engine, factory and technical learning loop use a dark drawing-board treatment. Monochrome technical model imagery is derived at display time using CSS, preserving source assets. The engine's Assembly / Components control switches between the existing R13 assembly and three actual digital component studies, not fabricated machine outputs. Print resolves this to the complete assembly. Earlier editions load no edition-04 fonts or styling.

The combined first-customers scene is slide 9. Private, cultural and hospitality concept imagery remains above one grouped row of official Eden Project, The Newt and 25hours logos, captioned “In discussion with.” The imagery is not work for those organisations, and the conversations are not signed commissions. Official logo provenance is stored in `3/assets/prospects/sources.json`; assets are local, without hotlinking. The resort concept film remains interactive. There is no separate prospect slide in edition 03.

Edition 03 uses the supplied botanical logo as complete artwork, copied byte-for-byte from the current website's `public/assets/brand/bower-logo-evergreen-horizontal-transparent.png` into `3/assets/bower-logo.png`. The viewer, reveal and closing use the same white-on-image CSS treatment as the marketing header. The older edition-02 Oculus SVG plus Georgia reconstruction is not used in edition 03.

`3/problem.js` and `3/problem.css` own the first two scenes. Their slow image motion can be paused, stops offscreen or in a hidden tab, and is disabled in reduced-motion and print modes. All of the argument is visible without interaction. The construction and woodland images are generated illustrations, labelled accordingly; the varied timber components are existing Bower digital studies. The new project-local visual assets and their complete built-in `image_gen` prompts/provenance are:

- `3/assets/world-under-construction.webp` and `3/assets/world-under-construction.source.json`.
- `3/assets/living-structure.webp` and `3/assets/living-structure.source.json`.

Run `npm run dev`; preview at `http://localhost:5333/designx`. Deep links run from `#slide-01` to `#slide-16` for editions 01/02 and `#slide-15` for editions 03/04. Add `?print=1` to inspect all static compositions. The file can also run offline; its PDF link uses the local exported file.

## Current work

The founder explicitly authorized simple sticky notes for central visuals being supplied later. Assembly animation, engine diagram, factory drawing and Clay's plant-growth simulation have visible notes. These notes appear in the working PDF too. The current growth playback crossfades illustrative concepts; it is not a botanical simulation.

The technical and commercial flywheels have selectable stages, changing causal explanations, controlled playback and pause offscreen. The coupled scene brings the two systems together and reveals their directional connections. Growth has a keyboard-accessible scrubber and bounded playback. The customer slide uses existing Higgsfield concepts and a user-triggered eight-second film; no new media was generated. Print states are designed separately, and reduced motion is supported.

## Edit

- `slides.js`: story, compositions, notes, sources and `DESIGNX_META`.
- `scenes/growth.js` and `.css`: immersive growth scene and print composition.
- `scenes/flywheels.js` and `.css`: technical, commercial and coupled flywheels.
- `scenes/customers.js`: manual playback of the existing Higgsfield resort concept film, with a static PDF poster.
- `deck.js`: viewer navigation, scene lifecycle, dialogs and other interactions.
- `deck.css` and `editorial.css`: shared and scene-specific compositions.
- `assets/`: local media and provenance manifest.

Scene modules define markup in `window.DESIGNX_SCENES` and register mounting functions in `window.DESIGNX_MOUNTS`. The viewer dispatches `designx:slidechange` and `designx:motionchange`; animations pause offscreen. Supplied visuals can use HTML/JS, SVG, video, image sequences or models. Adapt their lifecycle rather than requiring a new framework.

Private source notes are in `docs/private/designx/` and excluded from the build. Regenerate speaker notes with `node docs/private/designx/generate-speaker-notes.cjs`.

## Export and check

```text
node scripts/designx/export.mjs
python scripts/designx/verify-pdf.py
node scripts/designx/check.mjs
node scripts/designx/check-2.mjs
node scripts/designx/check-3.mjs
node scripts/designx/export.mjs --edition=3
python scripts/designx/verify-pdf.py output/pdf/Bower_DesignX_Buildings_That_Grow_03.pdf --expected-pages 15
node scripts/designx/check-4.mjs --before-export
node scripts/designx/export.mjs --edition=4
python scripts/designx/verify-pdf.py output/pdf/Bower_DesignX_Buildings_That_Grow_04.pdf --expected-pages 15
node scripts/designx/check-4.mjs
npm run build
```

Export before building so production includes the latest PDF. The export writes `output/pdf/`, copies the PDF into `downloads/`, and captures review PNGs under ignored `qa-out/designx/slides/`. PDF photography is compressed in the export browser; web originals and live text/vector diagrams are retained. The verifier needs `pypdf`.

The `--edition=3` export instead writes its public file to `3/downloads/` and captures static compositions under `qa-out/designx/edition-03/print/`. It does not overwrite the original PDF. The third-edition browser check covers the visual opening, controlled ambient motion and founder theses, existing interactive scenes, mobile viewport fitting, reduced motion, and earlier-edition isolation.

The `--edition=4` export similarly writes `4/downloads/Bower_DesignX_Buildings_That_Grow_04.pdf` and captures `qa-out/designx/edition-04/print/`. Edition-04 checks include actual font loading, the model-view control, responsive composition, prior-edition isolation and the separate PDF alias. The supplied fonts are embedded in the PDF.

The twenty-one browser checks cover navigation, scene interactions, keyboard/modal focus, five viewports, print composition, offline use, isolated resource loading and PDF route headers/byte equality. Inspect the actual rendered PDF too. Reports are under `qa-out/designx/`.

The second-edition check covers ten behaviour groups, all sixteen slide compositions and four viewport sizes, including trackpad inertia, first play, seek/replay, original-route isolation and reduced motion. Its screenshots and report are under `qa-out/designx/edition-02/`.

`DESIGNX_META.status` is `working-draft`. Export is enabled because the founder requested a current PDF containing the interim notes. This does not mark it ready for submission. Earlier rejected exports remain in ignored `output/designx/rejected-v1-2026-11-13/`.

Set `DESIGNX_URL` or `DESIGNX_BROWSER` for a different preview server or Chromium executable. None of these commands deploys the website or submits an application.
