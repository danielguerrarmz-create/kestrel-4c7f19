# Bower for CRE retail

A separate seventeen-slide discussion edition at `/cre-retail`, with a matching PDF at `/cre-retail/pdf`. The `/designx/retail/` paths remain aliases.

## Sales-story revision - 18 November 2026

Restores the commercial evidence, coordinated design approach, growth and seasonal planting, delivery requirements, commission scope and ongoing care. These are spread across concise slides rather than returned to dense paragraphs. Essential evidence qualifications remain visible; full methods and source links are available in the Sources drawer.

The sequence is: complete retail place, pavilion, visitor uses, integrated garden, coordinated design, activity evidence, rental evidence, shopper preferences, growth, Hammerson context, operations, delivery, commission, build and care, evaluation, team and next step.

Typography uses the supplied Argesta Display regular/italic and Safiro regular/medium files through `../4/fonts.css`. The Bower logo is unchanged.

## Images

The latest built-in ImageGen concepts show a cohesive retail garden: connected planting beds, integrated seating, layered vegetation, clear paths and visible contemporary shopfronts. They reference the current six-bay model and remain labelled as illustrative interpretations. They are not exact-model renders, surveyed locations, commissioned projects, engineering validations or completed installations.

- `assets/retail-garden-square.png`: whole garden and pavilion in a retail square.
- `assets/retail-garden-seating.png`: closer view of planting, seating and shops.
- `assets/garden-provenance.json`: full new prompts and reference roles.
- `assets/provenance.json`: previous generation provenance; previous images retained for history.

The product and growth slides crop the approach view of the original transparent model triptychs using CSS. `time-16.webp` shows the frame; `time-33.webp` shows a canopy scenario. The source geometry is unchanged. These are digital states, not observed growth or a maturity forecast.

## Evidence and commercial terms

TfL/UCL's comparative London street study reports 93% more walking activity, 216% more leisure-based stationary activity and additional retail rental growth equivalent to 7.5% per annum. These reflect whole-street interventions, not a Bower forecast. The stationary measure is an activity count, not visit duration.

Wolf's mature-tree research concerns stated willingness to pay, not recorded sales. The 2019 shopping-centre survey concerns emotional response and visit intention, not actual footfall. Hammerson's published project context implies no Bower commission. The first completed Bower is pending.

The proposed GBP65,000 commission follows agreement of an indicative installed budget and develops design, planting strategy, feasibility and a construction offer. It is credited once against the build price if proceeding. A scoped fixed build price is agreed before construction, with annual care separately scoped and priced.

## Check and export

Edit `slides.js` and `retail.css`. Run `node scripts/designx/retail.mjs`. It checks seventeen slides, a 60-word ceiling, navigation, source drawer, three viewport sizes, brand-font loading, asset resolution and rendered text bounds. It captures every slide and writes the matching PDF to `output/pdf/` and `downloads/`. Review `qa-out/designx/retail/` and render the PDF with Poppler before publishing.

The shared viewer supplies keyboard and touch navigation, the index, source notes, fullscreen and print layout. Route tests live in `src/documentRoutes.test.ts` and `src/routing.test.ts`.
