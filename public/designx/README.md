# Buildings That Grow

A sixteen-scene working presentation for Bower × MIT–LUMA. The website is the dynamic version; its PDF is a deliberate static counterpart.

## Routes

- `/designx` and `/designx/`: interactive presentation.
- `/designx/pdf` and `/designx/pdf/`: current PDF served inline.
- `/designx/downloads/Bower_DesignX_Buildings_That_Grow.pdf`: underlying exported file.

Vite development/preview and Vercel use the same routes. Presentation code, media and PDF stay under `public/designx/`. The marketing router yields to this document. Its navigation and sitemap remain unchanged. No external fonts, analytics or runtime APIs are required. Noindex headers discourage indexing.

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
npm run build
```

Export before building so production includes the latest PDF. The export writes `output/pdf/`, copies the PDF into `downloads/`, and captures review PNGs under ignored `qa-out/designx/slides/`. PDF photography is compressed in the export browser; web originals and live text/vector diagrams are retained. The verifier needs `pypdf`.

The twenty-one browser checks cover navigation, scene interactions, keyboard/modal focus, five viewports, print composition, offline use, isolated resource loading and PDF route headers/byte equality. Inspect the actual rendered PDF too. Reports are under `qa-out/designx/`.

`DESIGNX_META.status` is `working-draft`. Export is enabled because the founder requested a current PDF containing the interim notes. This does not mark it ready for submission. Earlier rejected exports remain in ignored `output/designx/rejected-v1-2026-11-13/`.

Set `DESIGNX_URL` or `DESIGNX_BROWSER` for a different preview server or Chromium executable. None of these commands deploys the website or submits an application.
