# Bower for CRE retail

A separate fourteen-slide discussion edition, dated 18 November 2026. The canonical URL is `/cre-retail`; the PDF is at `/cre-retail/pdf`. The `/designx/retail/` paths remain aliases. It does not change the current DesignX deck.

The audience is retail asset management, with a Hammerson-specific context slide. The sequence covers the proposed pavilion, retail uses, research evidence, Hammerson's public-realm priorities, site requirements, growth and care, public use, founders, proposed commercial model, evaluation and next steps. The last slide contains linked primary sources. Per-slide Sources also provides evidence qualifications and image provenance.

Typography uses the authentic supplied Argesta Display regular/italic and Safiro regular/medium files through `../4/fonts.css`. The botanical Bower logo is the existing original artwork. All architectural images are existing concepts or digital studies. There are no new generated images or claims of completed installations.

## Evidence decisions

- TfL/UCL's +93% walking and +216% leisure-based stationary activity are comparative whole-street findings, not Bower forecasts. The latter is not a dwell-duration increase.
- The reported 7.5% rental metric is additional retail rental growth **per annum**, not a one-off rent premium.
- Wolf's 9–12% figure is stated willingness to pay. The 403-consumer shopping-centre study measures responses and visit intentions.
- Quakers Friars and Cabot Gate are published project contexts, not selected sites, budget commitments or Bower consents.
- The £65,000 commission, credit against the build price and separately scoped care retain the existing proposed offer. Installed price and tax treatment are not invented.
- Bower's first completed reference remains to be delivered. Growth images are scenarios; no guaranteed establishment date, cooling result or commercial uplift is asserted.

## Maintain and export

Edit `slides.js` and `retail.css`. The shared viewer provides keyboard navigation, index, source notes, fullscreen, touch navigation and print layout. `viewer.js` only corrects this edition's offline logo/PDF paths.

Run `node scripts/designx/retail.mjs` from the repository root. It serves local public files through Playwright for sandboxed checks, checks navigation, responsive fitting, loaded fonts, asset resolution and slide bounds, captures every slide, and exports the matching PDF to `output/pdf/` and this edition's `downloads/` directory. Review the captures under `qa-out/designx/retail/`, then render the exported PDF with Poppler for final visual review. Route tests live in `src/documentRoutes.test.ts`.

Earlier deck files are reused as read-only assets; this edition does not load v8's slide transformations or animations. No analytics, mailing, publishing or deployment is triggered by the export.
