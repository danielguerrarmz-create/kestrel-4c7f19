# Buildings That Grow

A sixteen-scene working presentation for Bower × MIT–LUMA. The website is the dynamic version; its PDF is a deliberate static counterpart.

## Routes

- `/designx` and `/designx/`: interactive presentation.
- `/designx/2` and `/designx/2/`: second visual edition, using the architectural-editorial style guide.
- `/designx/pdf` and `/designx/pdf/`: current PDF served inline.
- `/designx/downloads/Bower_DesignX_Buildings_That_Grow.pdf`: underlying exported file.

Vite development/preview and Vercel use the same routes. Presentation code, media and PDF stay under `public/designx/`. The marketing router yields to this document. Its navigation and sitemap remain unchanged. No external fonts, analytics or runtime APIs are required. Noindex headers discourage indexing.

The second edition keeps its entry point, style and interaction enhancements in `public/designx/2/`. It reuses source scenes, scene modules and media already under `public/designx/`, avoiding duplicate copies of large assets. The original presentation and its current PDF remain available at their existing URLs.

Edition 02 uses the supplied Helvetica Neue/Arial system, botanical palette and the existing Oculus emblem with a Georgia wordmark. Its `editorial.css` controls the art direction; `edition.js` controls the edition's sequence and headline revisions, plus scroll navigation, deliberate growth scrubbing and on-demand seeking through the customer film. The invention comes before customer segmentation, and the commercial sequence shows the reusable capability commissions are intended to develop. Eyebrow headings are removed; evidence and development-status notes remain. Keyboard, touch, direct scene controls and reduced-motion alternatives remain available. The PDF link is explicitly labelled as edition 01 until a second-edition PDF is requested.

Run `npm run dev`; preview at `http://localhost:5333/designx`. Deep links run from `#slide-01` to `#slide-16`. Add `?print=1` to inspect all static compositions. The file can also run offline; its PDF link uses the local exported file.

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
npm run build
```

Export before building so production includes the latest PDF. The export writes `output/pdf/`, copies the PDF into `downloads/`, and captures review PNGs under ignored `qa-out/designx/slides/`. PDF photography is compressed in the export browser; web originals and live text/vector diagrams are retained. The verifier needs `pypdf`.

The twenty-one browser checks cover navigation, scene interactions, keyboard/modal focus, five viewports, print composition, offline use, isolated resource loading and PDF route headers/byte equality. Inspect the actual rendered PDF too. Reports are under `qa-out/designx/`.

The second-edition check covers ten behaviour groups, all sixteen slide compositions and four viewport sizes, including trackpad inertia, first play, seek/replay, original-route isolation and reduced motion. Its screenshots and report are under `qa-out/designx/edition-02/`.

`DESIGNX_META.status` is `working-draft`. Export is enabled because the founder requested a current PDF containing the interim notes. This does not mark it ready for submission. Earlier rejected exports remain in ignored `output/designx/rejected-v1-2026-11-13/`.

Set `DESIGNX_URL` or `DESIGNX_BROWSER` for a different preview server or Chromium executable. None of these commands deploys the website or submits an application.
