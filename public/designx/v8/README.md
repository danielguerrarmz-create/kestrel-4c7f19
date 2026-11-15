# Edition 08: one continuous story

Open the [story map](http://localhost:5312/designx/v8/story-map.html) or the [working deck](http://localhost:5312/designx/v8/). Run `node deck/serve.mjs` from the repository root if needed.

This is the replacement v8 requested on 15 November 2026. It uses v7's visual system and viewer in a twenty-slide story, with two drawing spaces for ground and care. The separate shared-model, learning-cycle and coupled-system slides are consolidated into one explorable learning drawing. The previous 21-slide v8 and the standalone v9 narrative are superseded. V7 and earlier editions are unchanged. No repository-root document was changed by this revision.

## The story

We encounter a Bower and understand why someone would want it. Looking more closely reveals the relationships that give it its character. Designing those relationships raises decisions that computation helps us explore. Those decisions produce particular parts and manufacturing requirements. Bringing the place into someone's garden requires a credible commission and delivery process. Its continuing life requires care, and that experience informs the next Bower.

`story.js` is the slide-by-slide editorial map. Every entry records the source v7 slide, its role, what stays, the intended drawing, current evidence status and the connection to the next slide. `story-map.html` presents that map with links to each slide. The deck's Notes include the same connections and drawing briefs alongside the original source notes.

The twenty-slide sequence is: Bower → a room through time → light through the day → plants make space → ground → design decision → computational consequences → the design engine → variability → manufacturing → form/measure/machine → customers → the missing built reference → commission/build/grow → care → how the system learns → team → construction at scale → future possibilities → the first Bower and the means to make many.

## What is present

- The original customer settings as three still images, named conversations and the upcoming Canary Wharf Group meeting, the proposed £65,000 commission credited against the build, fixed build price and annual care.
- A computational consequence drawing using the scene owner's existing handoff, one consolidated learning flow and the England customer-discovery finding, both founder theses, team and future imagery.
- Daniel's original factory map, fourteen stations, Form/Measure/Machine views, playback, notes and print drawings. This uses the v7 factory system, without a second implementation.
- **Time, Light and Space now have their own slides (02–04).** Each autoplays on arrival, pauses off-slide, and has one quiet Pause / scrub / caption edge. Argesta italic titles overlay the full-slide drawings. Inspect holds secondary controls. Reduced-motion settings begin paused.
- **Time** restores the exact original eye-level `approach-ink` film as its default: 12 seconds of assembly, planting, then growth and seasons, with authored walking silhouettes added in the open threshold. Only the baked interface is cropped; the camera and 51-second timing are unchanged. The recent timber Above / Approach / Inside views remain in Inspect with their own saved moments.
- **Light** keeps installation, establishing and mature planting aligned together while a single midsummer-day timeline changes their shadows. Establishing now uses the existing 2033 midsummer state, which reads about halfway between the other two. The chosen state gives 50.6% of the mature additional noon shadow in a digital comparison; this is not a measured canopy-coverage claim. The original two outer panels and all 37 sun positions are retained. See [Light provenance](assets/light-establishment/SOURCES.md). **Space** retains the large draggable panorama.
- The old procedural stick figures are replaced with an articulated, clothed walk cycle rendered from Quaternius’s CC0 Animated Human. The local 403 KB sprite atlas has eight viewing directions plus plan; fixed foot anchors prevent bouncing. Placement remains authored, not a behavioural simulation. See [asset provenance](assets/inhabitants/SOURCES.md).
- The existing pier comparison and an explorable four-stage study opened within the presentation. Selecting a moment pauses it; enlargement and return preserve its timeline position.

## New drawings and current limits

Slide 05 reserves the section of the same inhabited room, making root space, footing, water provision, supports and care access legible. Slide 15 reserves establishment and care in that room. These production briefs are visible in the working deck; it is not a finished submission while those compositions remain unresolved.

First arrival and annotated-section drafts are copied in `assets/scene-drafts/` and linked from the story map. They came from `bower-blender/studies/inhabited-room/views/arrival.png` and `section.png`, visually inspected on 15 November. Their baseline is `six-bay-radial-v1`; site and ground arrangements are provisional proposals in the source study. They show the same room with no furniture. The section needs a presentation composition and contains more annotation than a slide can comfortably carry. V7's opening and closing artwork remains until the new scene is ready for those compositions. The care view remains to be made.

The older pier animation on slide 06 compares existing variants. Slide 07 now reads the newer coordinated `inhabited-room` export: its baseline/opened-pier images, layer masks, stable threshold anchors and quantities. Plant support, Entrance, Making and Designer review expose different consequences of those authored alternatives. The 4.87 m / 3.61 m threshold widths come from that export's timber geometry; they are not the older pier sweep's centreline widths or physical measurements. The opened footing remains unengineered and its exported clearance flags remain visible. Nothing is recomputed during playback. Integrated plantability and cost evaluators remain proposed.

Slide 08 restores the original engine explanation with Fabricatability, Plantability and Cost. Geometry and growth studies exist; integrated checks remain in development or proposed. Selecting a consideration explains an authored design response, not a running evaluator or a price estimate. This slide and the particular pier-consequence drawing have different roles.

Slide 11 recomposes Form / Measure / Machine with the same compact heading, selection hierarchy and bottom control edge. Daniel's source geometry, animation timing, notes and fourteen-station explorer are untouched. Slide 16 retains an inspectable trace to the complete learning flow: an assumption or target, future observations, validation and possible rule revision. The trace is an authored explanation, not working automation.

## Drawing decisions

| Drawing | Pitch question | Treatment |
|---|---|---|
| Time | How does a room come into being and develop? | Restore the original eye-level ink film, including assembly; add authored people and retain the newer timber views in Inspect. |
| Light | How does growth change the light on the floor? | Three stages side by side, sharing one day cycle. |
| Space | How does planting change the enclosure? | A separate, large unrolled interior panorama. |
| Computational consequences | What else changes when we open the pier? | Replace generic text switches with the existing scene export and its evidence; keep the designer's review explicit. |
| Design engine | Can we make it, can it grow and can we afford it? | Restore the v7 engine explanation separately from the particular pier study. Three selectable checks inform shared geometry and designer review; cost is feasibility against the client’s budget. |
| Factory map and operations | How can varied parts become an assembled room? | Preserve the live SVG studies and notes; reframe the selected operations and connect each to assembly. |
| Learning flow | How does checked evidence reach a design decision? | One complete, pauseable diagram absorbs the shared-model and project-cycle explanations. Start with the support-route question, then inspect other evidence paths. |
| First reference | What did prospective clients need to see? | Keep the England finding beside a provisional ghost-to-colour arrival reveal. “A place they can visit” captions the image; a sticky note briefs the final drawing. |

The room/site/plant–footing study, generators, exports, stable IDs and releases remain owned by their existing subsystems. This revision only reads their published handoff. Root documents and earlier deck editions are unchanged by this work.

## Editorial consolidation

The former slides 12, 13 and 16 leave the main sequence. Their shared-model and learning arguments sit within slide 16, How the system learns. Its project phases read Designing each Bower and Making and living with it; software readiness is stated separately. The trace begins with the Growing question and remains selectable, pauseable and scrubbable.

The First customers slide now sits at slide 12, after manufacturing and before the built-reference finding. Its original triptych is retained, with the hospitality video omitted and Canary Wharf Group added as a scheduled meeting.

The former commercial flywheel becomes slide 13, The first Bower is the missing reference, just before the commission offer. It records the founder’s England conversations, without invented quotations, counts or commitments. The image is the existing early scene draft, not a completed-project photograph; its animation is a timing sketch for the final drawing. The pier and computational consequence drawings remain on slides 6 and 7; the separate engine explanation follows on slide 8.

## Files and verification

`index.html` loads unchanged v7 dependencies and v8 modules. `growth-player.js/css` owns the three independent players: the original eye-level film plus retained raster views, Light and Space, lazy frame requests, six-frame cache and authored occupants. The sprite source and reproducible renderer live in assets/inhabitants and scripts/render-inhabitants.mjs. Playback downloads neither plant nor human geometry. The original film is imported byte-for-byte under assets/approach-ink; import-approach.mjs records its hashes. The later Light middle panel is rendered separately by render-light-establishment.mjs, without overwriting the source export. `consequences.js` reads the scene export; `drawing-tools.js` supplies the explanation clock; `learning-trace.js` and `manufacturing.js` adapt presentation. `drawings.css` gives these drawings common framing. `customers.js/css` retains the customer triptych, removes the single hospitality video and adds the fourth prospect logo. `engine.js/css` restores the three-question engine explanation. `reference.js/css` supplies the customer-discovery slide and an opacity/colour animation of the existing arrival draft, playing once on entry and holding full opacity, without controls; print and reduced-motion views show the final image; `learning-editorial.js/css` clarifies the learning phases and selects its initial evidence trace. `edition.js` integrates them, while `studies.js` retains the older pier player. Load failures retain a labelled fallback or previous drawing, with retry.

The growth stills copy `time-26.webp` and `time-30.webp` from `04-plants-make-space-timber`. The pier stills copy `bare-was-room-00.webp` and `bare-now-room-00.webp` from `shaded-at-the-pier`. Dynamic exports use `/designx/pieces/`. A standalone publication must include **04-plants-make-space-timber**, **shaded-at-the-pier** and **inhabited-room**. No dependency points at v9. If publishing into Bower_Web, preserve that checkout's v8/baseline living files, which protect its newer v7.

The **Print view** link opens this edition's static reading layout. No new PDF has been exported. Direct file opening shows static images; use the local server for interactions. The browser check in `scripts/check.mjs` uses the installed Playwright/Chromium, routes local assets from disk for sandboxed QA, and writes private screenshots/results to ignored `.qa/`.
