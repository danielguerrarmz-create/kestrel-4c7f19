# Bower for CRE retail

A separate ten-slide discussion edition at `/cre-retail`, with a matching PDF at `/cre-retail/pdf`. The `/designx/retail/` paths remain aliases. Other DesignX editions are unchanged.

## Condensed revision — 18 November 2026

The visible deck contains 173 words across ten slides, including source captions and evidence qualifications. Each slide carries 7–28 words. Detailed methods, project requirements and commercial qualifications remain in the Sources drawer rather than the main composition.

The sequence is: proposition, pavilion, retail uses, one public-realm finding, Hammerson context, site requirements, commercial model, evaluation, team and next step. The previous extra statistics, long tables, biographies and source appendix have been removed from the main sequence.

Typography retains the supplied Argesta Display regular/italic and Safiro regular/medium files through `../4/fonts.css`. The botanical Bower logo is unchanged.

## Images

Two new built-in ImageGen concepts show one pavilion in a recognisable outdoor shopping-centre square. They use the existing six-bay model as a reference; they are illustrative interpretations, not exact-model renders, a real site, a commissioned project or a completed installation. Both are visibly labelled. They replace the garden, manor and future-street settings.

- `assets/retail-square.png`: wider retail square.
- `assets/retail-seating.png`: closer view of seating and shopfronts.
- `assets/provenance.json`: complete prompts, reference paths, mode and evidence limits.

The product slide shows the middle approach view of the original transparent model triptych via a CSS crop. The site slide retains the existing isolated planted-model study. No source geometry is edited.

## Evidence

The visible research finding is TfL/UCL's +216% leisure-based stationary activity in improved London streets compared with comparator streets. It is an activity count, not dwell duration or a forecast for Bower. The source link and whole-street qualification remain visible. Hammerson's project links and no-commission qualification remain visible. The first completed Bower is still pending.

The proposed £65,000 commission, credit if proceeding, indicative installed budget agreed first, scoped fixed build price and separately priced annual care retain the existing commercial model. Full terms remain in Sources.

## Check and export

Edit `slides.js` and `retail.css`. Run `node scripts/designx/retail.mjs`. It checks ten slides, a 45-word ceiling, navigation, source drawer, three viewport sizes, brand-font loading, asset resolution and rendered text bounds. It captures every slide and writes the matching PDF to `output/pdf/` and `downloads/`. Review `qa-out/designx/retail/` and render the PDF with Poppler before publishing.

The shared viewer supplies keyboard and touch navigation, the index, source notes, fullscreen and print layout. Route tests live in `src/documentRoutes.test.ts` and `src/routing.test.ts`.
