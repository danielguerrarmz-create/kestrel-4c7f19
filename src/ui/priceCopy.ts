/**
 * priceCopy.ts — the words next to the numbers, kept where they can be tested.
 *
 * WHY THIS IS ITS OWN MODULE. The surfaces that carry a price pull in R3F and
 * three.js, and this suite runs in a bare node environment with no DOM on
 * purpose (see vitest.config.ts). So the copy that matters most would be the
 * only copy nothing could pin. It is one import and it buys a regression test
 * on the sentences that carry the honesty claim.
 *
 * It moved here from `pages/draw/` on 2026-07-17 when the honesty pass reached
 * the other three surfaces. `ui/` importing from `pages/draw/` was backwards,
 * and this copy was never draw-specific.
 *
 * ---------------------------------------------------------------------------
 * THE TWO KINDS OF NUMBER. This is the whole reason the module exists, and the
 * distinction it enforces is the thing to preserve:
 *
 *   COMMISSION FLOOR (from £150k) is STATED, and it is a PRICE. Daniel's own
 *   ladder — a business decision about what a Bower is sold for. No code
 *   computes it. It does not move when you shape the form.
 *
 *   COST TO CONSTRUCT (~£15k) is COMPUTED, and it is a COST. `pricing.ts`
 *   builds it line-by-line from the real BOM, so it MOVES correctly, and its
 *   own header carries the loudest TODO in the demo: every unit rate in
 *   PRICING is a PLACEHOLDER until fab quotes land.
 *
 * They must never be rendered as the same kind of number, and neither is a
 * quote. A cost and a price are ALLOWED to differ — the difference is the
 * business. What is not allowed is presenting one as evidence for the other.
 *
 * THE GAP IS NOW ~10x, AND IT IS ON SCREEN ON PURPOSE (2026-07-17). Daniel
 * asked for the cost to construct to be visible and expandable; the commission
 * floor sits beside it. They visibly disagree, and they always have. That is a
 * real thing for Daniel to see, not a rendering bug to hide in a disclosure:
 * ~£15k of construction against a £150k floor implies ~90% gross margin, while
 * the brief's own target is 35-45%. Something is wrong and it is NOT resolvable
 * from this file: either the placeholder rates are far too low (most likely —
 * nobody has quoted them), or the cost base and the ladder were built from
 * different assumptions. Flagged, not papered.
 *
 * Do not "fix" it by moving a rate in PRICING until the total looks like the
 * ladder. Choosing rates so the output matches the marketing number and then
 * showing that output as evidence FOR the number is circular, and it is the one
 * move that dies to a single question from a technical reader. Daniel
 * authorised fake numbers; he did not authorise fabricated evidence, and he is
 * the one who would be holding it on camera.
 * ---------------------------------------------------------------------------
 *
 * WHY THE LABEL IS NOT "FIXED". It said "fixed" until 2026-07-17, and that word
 * was doing work no number here can support. A price honestly derived from
 * placeholder rates is indicative, not fixed. "Fixed" is what you say AFTER the
 * quotes come back, and they have not.
 *
 * The decomposition stays visible because the decomposition is the credible
 * part: 194 pieces and 108 nodes are counted off the actual kit and are true
 * right now. It is the MAGNITUDE that is pre-quote, not the object.
 *
 * Do not "fix" any of this by moving a rate in PRICING to make the computed
 * figure look more like the stated range. That is reverse-engineering evidence
 * to fit a claim, and it would not survive one question from a technical
 * reader. The gap is real. Report it; do not close it in code.
 */

/**
 * The qualifier that sits beside a computed figure, not buried under it: a
 * reader who takes only the number should have already read this.
 */
export const PRICE_QUALIFIER = 'indicative · pre-quote';

/**
 * BREAK-EVEN. A COST FACT, not a ladder: Clay, 2026-07-28, "never below £220,000 inc VAT —
 * that's break-even on the smallest object worth building."
 *
 * It exists as a constant so the published figure can be TESTED against it rather than merely
 * compared to the last published figure. That distinction is the whole point of this addition:
 * for eleven days the site's stated floor was £150k, every surface agreed with every other
 * surface, and all of them were **below cost**. Agreement is not evidence. A number you may
 * publish is one that clears a number you actually incur.
 *
 * Nothing may be published below this. See `priceCopy.test.ts`.
 */
export const COMMISSION_BREAKEVEN_GBP = 220_000;

/**
 * The published commission STARTING POINT. STATED, not computed.
 *
 * £350,000 (Clay, 2026-07-28): a 30 m2 Bower at 35% margin, which is the brief's own target
 * band. **It replaced `from £150k`, which was BELOW `COMMISSION_BREAKEVEN_GBP` and had been on
 * the public `#/questions` page for a matter of hours** — Clay: "Take £150,000 off the site
 * today. It is below your cost. Every hour it's up is a chance someone anchors to it."
 *
 * History, because this number has now moved three times and each move was a founder overriding
 * the last: `£75k to £150k` (evaluator brief) -> `from £150k` as a FLOOR not a ceiling (Daniel,
 * 2026-07-17, killing the £25-50k entry tier — do not reintroduce tier logic to chase it) ->
 * `from £350k` (Clay, 2026-07-28, on cost). **Do not move it back without a founder saying so,
 * and do not derive it from anything.**
 *
 * A starting point, not a single figure, and that distinction is load-bearing: "from £350k" is
 * open-ended and cannot be mistaken for a quote, which is the reason it never says "your price".
 * This is the one place the number lives.
 */
export const COMMISSION_FROM = 'established after engineering';

/**
 * THE PUBLISHED COMMISSION FLOOR IS NOW WORDS, NOT A NUMBER (Clay, 2026-08-01).
 *
 * The public pages said "Commissions begin at £350,000 including VAT". They now say complete
 * project budgets are expected to begin in the **mid-six figures**, reaching £1 million or more for
 * larger or structurally ambitious pavilions, with the site-specific range established by the paid
 * feasibility study.
 *
 * WHY THIS IS AN IMPROVEMENT AND NOT A RETREAT. "£350,000" is a point value for an object nobody
 * has built, quoted before a site has been seen — the same category of claim as a single Stage 2
 * figure, which this file already refuses to publish for exactly that reason. A range in words
 * cannot be mistaken for a quote, and it survives the first real commission coming in at £480,000.
 * It also stops the number being screenshotted out of context, which is the failure the whole
 * no-figures-in-the-meta-layer rule exists to prevent.
 *
 * **AND IT BREAKS THE BREAK-EVEN GUARD UNLESS THE WORDS CARRY A NUMBER.** `COMMISSION_BREAKEVEN_GBP`
 * exists because £150,000 shipped below cost, and the test that catches that parses a numeral out
 * of the published sentence. With no numeral there is nothing to parse, and the guard would go
 * green having checked nothing — the exact shape of failure this repo keeps writing warnings about.
 * So the phrase carries its own floor: the LOWEST figure a reader could reasonably understand by
 * "mid-six figures", and `priceCopy.test.ts` asserts THAT clears break-even.
 *
 * £400,000 is deliberately the conservative reading. "Mid-six figures" is arguably £500,000, and
 * taking the lower bound is what makes the guard meaningful rather than flattering.
 */
/**
 * REWORDED 2026-08-05, CLAY'S APPROVAL VERBATIM. It read "We do not publish an indicative budget
 * before the site, structure and engineering route have been tested" — "indicative budget" being
 * exactly the buyer's-accountant vocabulary the house rules ban in spirit. The position is
 * unchanged (no figure before the testing); only the voice moved, and Clay approved this
 * sentence word for word in review.
 */
export const COMMISSION_BUDGET_POSITION =
  'We don’t name a figure before we have tested the site and the structure, because a number before that is a guess wearing a suit.';

/**
 * HOW THE COMPANY DESCRIBES ITSELF (Clay, 2026-08-01), replacing "design studio" and "design
 * practice" wherever the site says what Bower IS.
 *
 * It lives here rather than in `data/config.ts` because it is a positioning statement that sits
 * beside the commercial facts, and every surface that prints it also prints one of those.
 *
 * WHERE IT GOES AND WHERE IT DOES NOT. This is the description a CRAWLER, an AGENT or a journalist
 * reads: the Organization schema, `llms.txt`, the `<noscript>` block. It is deliberately NOT the
 * home page's own "What Bower is" band, which stays "Designed for your garden, and for the plant
 * that grows through it." A buyer standing in front of a photograph of a garden pavilion is not
 * asking about a scalable system, and the venue spec's own instinct — the one that cut "This round:
 * the people, the narrative, the demand" from About — is that a sentence written for one audience
 * reads as a pitch to the other. Same sentence, right reader, different surface.
 */
export const COMPANY_DESCRIPTION =
  'Bower is a design practice making living timber structures for significant landscapes.';

/** The lowest a reader could reasonably read `COMMISSION_FLOOR_WORDS` as. Guarded against
 *  `COMMISSION_BREAKEVEN_GBP`, so the published words can never fall below cost the way a
 *  published number once did. */
/**
 * The whole published cost statement, as one paragraph set, so `/questions` and `/houses` cannot
 * drift.
 *
 * REWRITTEN 2026-08-05 (Clay approved the wording verbatim in review). The old three sentences —
 * "substantial, site-specific capital project", the "indicative budget" position, and a
 * feasibility sentence listing "brief, site conditions, engineering route and project-specific
 * budget range" — were the last committee voice on /questions. "Capital project" in particular
 * sat one step from the banned buyer-finance vocabulary. Two sentences now do the same three
 * jobs: serious building, no early figure, and the reason. The study sentence moved to the
 * callers, which each name Stage 1 in their own register beside the fee.
 */
export const COMMISSION_STATEMENT: readonly string[] = [
  'A Bower is a serious building, priced like one.',
  COMMISSION_BUDGET_POSITION,
];

/**
 * STAGE 1, THE PAID STUDY: £20,000 as of 2026-08-04 (Clay), AND IT IS NOW CREDITED — in full,
 * against the design and engineering commission that follows (`STAGE_1_CREDIT`), NOT against
 * construction. The figure has been £1,500, £6,500, £15,000 and £18,000 — which is the whole
 * argument for it being a constant rather than a literal typed into three pages.
 *
 * ONE OWNER, because several surfaces state it: the cost answer on `/questions`, the founding
 * terms on `/commissions`, and the `/houses` cost section (dev-only). A fee that has moved four
 * times is exactly the fact that ends up right in two places and wrong in the third.
 * `questions/copy.test.ts` binds the prose to this constant.
 *
 * VAT STATUS UNCONFIRMED for the £20,000: every prior figure was stated "including VAT" and
 * Clay's 2026-08-04 instruction named only the number, so the published copy prints the bare
 * figure. Confirm with Clay before adding "including VAT" back.
 *
 * IT IS A PROFESSIONAL FEE AND IS *SUPPOSED* TO SIT FAR BELOW `COMMISSION_BREAKEVEN_GBP`, so the
 * break-even guard deliberately does not sweep it — that guard is scoped to the sentence stating
 * the commission. Sweeping every pound sign on the page was the first version of that test and it
 * failed on precisely this number, which is the difference between guarding a quantity and
 * guarding everything shaped like one.
 */
export const STAGE_1_FEE_GBP = 20_000;

/** The same figure as the copy prints it. Held beside the number so prose cannot drift from it. */
export const STAGE_1_FEE = '£20,000';

/**
 * THE CREDIT TERM (Clay, 2026-08-04: "That 20k gets credited against DD"). One sentence, one
 * owner, because it is a commercial term and a term that exists in two wordings is two terms.
 * It is credited against the DESIGN AND ENGINEERING commission (Stage 2 / detailed design),
 * deliberately NOT "against construction" — see `FEES_NOT_CREDITED`, which still governs that
 * boundary.
 */
export const STAGE_1_CREDIT =
  'The fee is credited in full against the design and engineering commission that follows.';

/**
 * STAGE 2, PLANNING / DESIGN / ENGINEERING: £60,000 to £90,000 including VAT (Clay, 2026-07-31).
 *
 * A RANGE, AND IT CAME BACK ON PURPOSE. The history is worth keeping because the number has now
 * been published, withdrawn and republished in a single day, and each move was right at the time:
 *   - It read "typically £18,000 to £25,000, confirmed at the end of Stage 1".
 *   - It was withdrawn entirely, on the reasoning that the figure varies too much with heritage
 *     statements and tree surveys to publish at all.
 *   - It returns at £60,000 to £90,000, which is not the old range restated but a different
 *     estimate of a differently-scoped stage.
 *
 * The rule that governed all three is unchanged and still holds: **do not collapse it to a single
 * figure.** A point value here reads as a quote for work nobody has scoped, and the scoping is
 * literally what Stage 1 is for.
 *
 * `NOT_CREDITED` is the sentence that stops both fees reading as a deposit. It is a commercial
 * term, not decoration: a buyer who assumes £108,000 of professional fees comes off a £350,000
 * commission has mis-budgeted by nearly a third, and would find out late.
 */
export const STAGE_2_FEE = '£60,000 to £90,000';
export const STAGE_2_FEE_LOW_GBP = 60_000;
export const STAGE_2_FEE_HIGH_GBP = 90_000;

/**
 * The construction boundary. AMENDED 2026-08-04: Stage 1 is now credited against the design and
 * engineering commission (`STAGE_1_CREDIT`), so this sentence no longer claims both stages sit
 * outside everything — but the line it holds is unchanged and still matters: neither fee is money
 * on account against CONSTRUCTION, and a buyer who nets the fees off the build budget has
 * mis-budgeted.
 */
export const FEES_NOT_CREDITED =
  'The Stage 1 fee is credited against the design and engineering commission. Neither fee is credited against construction.';

/** What the floor is a floor OF. Sits with it, never with a computed figure. */
export const COMMISSION_LABEL = 'commission, installed and planted';

/** The qualifier for the STATED floor: indicative, and no quote behind it. */
export const COMMISSION_QUALIFIER = 'indicative · pre-quote';

/** The starting point in a sentence, for surfaces with room for one. "Seven figures" as of
 *  2026-07-28 (Clay), not "mid six": the published floor moved to £350k and the old ceiling
 *  language would now read as barely above it. */
export const COMMISSION_NOTE =
  'The budget for a complete Bower, installed and planted, is established after the site, structure and engineering route have been tested. It is not set before that work.';

/**
 * ⚠ STALE AND BELOW COST AS OF 2026-07-28. EVERY CONSTANT FROM HERE TO THE END OF
 * THE DEMO BLOCK IS ANCHORED TO THE SUPERSEDED £150k FLOOR.
 *
 * `COMMISSION_DEMO_FIGURE` (£150,000), `COMMISSION_ANCHOR_GBP` (£173,820) and
 * `COMMISSION_FLOOR_GBP` (150_000) all sit at or below
 * `COMMISSION_BREAKEVEN_GBP` (£220,000). They are LEFT NUMERICALLY UNTOUCHED on
 * purpose, for two reasons, and neither is inertia:
 *
 *   1. NOTHING HERE IS PUBLIC. Every surface that renders them (`#/draw`,
 *      `#/studio`, `#/shape`, PricePanel, CommissionSheet) has been dev-only
 *      since 2026-07-21, so there is no customer-facing exposure to close and
 *      Clay's "take it off the site today" is already satisfied by the
 *      `#/questions` change.
 *   2. FIXING THEM IS NOT A FIND-AND-REPLACE. The anchor is the calibration
 *      point of a weighted formula ("must feel computed, not flat"): raising
 *      `COMMISSION_FLOOR_GBP` to 220_000 while the anchor stays at 173,820
 *      would clamp EVERY draw to the floor and silently kill the one property
 *      the figure exists to have. Recalibrating it is Daniel's call, not a
 *      side effect of a copy fix.
 *
 * **So this is a flag, not a fix. Do not film, screenshot or demo any of these
 * numbers, and re-derive the whole block from `COMMISSION_BREAKEVEN_GBP` before
 * the engine comes back off the gate.**
 *
 * DEMO ONLY (2026-07-17). For a very short demo video Daniel asked the `#/draw`
 * panel to state ONE general commission figure and not get into the specifics
 * of pricing: no computed build-up, no itemisation, no money hop, no bridge, no
 * stewardship line. His words: "assume a general £150,000 figure and do not get
 * into specifics of pricing. This is for a very short demo, does not have to be
 * true."
 *
 * This CONSCIOUSLY SUPERSEDES the price-honesty pass FOR THE DEMO. The honest,
 * itemised panel — cost to construct vs stated floor, the ~10x gap on screen on
 * purpose, the bridge that prices nothing — lives in git history and its whole
 * argument is above. It is not gone, it is not filmed. When the demo is cut,
 * the honest panel comes back; the constants it needs (everything above) are
 * kept and still tested, and `#/studio` still renders them.
 *
 * A flat figure, not "from £150k", because the panel now shows one clean number
 * on camera and Daniel authorised a general figure. £150,000 is his own floor.
 */
export const COMMISSION_DEMO_FIGURE = '£150,000';

/** The mono label beside the demo figure. Register: lowercase, terse. */
export const COMMISSION_DEMO_LABEL = 'commission';

/**
 * DYNAMIC DEMO FIGURE (2026-07-17, Sai's demo-round spec §6; recalibrated to read
 * as COMPUTED per Daniel, 2026-07-17). Daniel: the on-screen figure "must feel
 * computed, not flat" — non-round and derived from the ACTUAL geometry, varying
 * as the draw changes. So it MOVES with what you draw, in named weighted
 * proportion to footprint area, real piece count, real node count and the
 * selected species' stem load, snapped to £10 (not £1,000) so the geometry
 * survives into the units. The reference bake resolves to £173,820; every other
 * draw is a different non-round figure. It is floored at Daniel's stated £150k
 * (COMMISSION_FLOOR_GBP), which a real baked design clears — only a very small
 * draw with the lightest species reaches the floor.
 *
 * DELIBERATELY SEPARATE from `pricing.ts`'s cost model. That machinery answers a
 * different, already-honest question (cost to construct); tuning it to hit a
 * marketing number is exactly the "reverse-engineer evidence to fit a figure"
 * move this file's own header refuses for the real floor. This is openly
 * demo-only. `COMMISSION_DEMO_FIGURE` (£150,000) stays what it always was: the
 * STATED general/floor figure in prose, not the computed output, which now sits
 * above it and moves.
 */
/**
 * The reference bake resolves here. NON-ROUND on purpose (Daniel, 2026-07-17:
 * "must feel computed, not flat") — a believable mid-six-figure garden-pavilion
 * commission, not a chosen round price. Every other draw lands on a different
 * non-round figure off the real geometry.
 */
export const COMMISSION_ANCHOR_GBP = 173_820;
/** The reference bake: 14.3 m², 194 pieces, 108 nodes, clematis (stemLoad01 0.5). */
export const COMMISSION_ANCHOR_AREA_M2 = 14.3;
export const COMMISSION_ANCHOR_PIECES = 194;
export const COMMISSION_ANCHOR_NODES = 108;
export const COMMISSION_AREA_WEIGHT = 0.45;
export const COMMISSION_PIECE_WEIGHT = 0.28;
export const COMMISSION_NODE_WEIGHT = 0.12;
export const COMMISSION_SPECIES_WEIGHT = 0.15;
/**
 * speciesFactor ranges 0.85 (stemLoad01=0) to 1.15 (stemLoad01=1); clematis
 * (0.5) lands it at exactly 1.0, so the reference bake's species term is a no-op
 * and the anchor calibration holds.
 */
export const COMMISSION_SPECIES_FLOOR = 0.85;
export const COMMISSION_SPECIES_SPAN = 0.3;
/** Daniel's stated "from £150k": the computed figure never dips below it. */
export const COMMISSION_FLOOR_GBP = 150_000;
/**
 * Resolution the figure snaps to. £10, NOT £1,000/£5,000: the footprint, piece
 * and node counts survive into the tens/hundreds digits, so the number reads as
 * computed (£173,820) rather than picked (£175,000). Fine enough to feel derived,
 * coarse enough that the count-up never chases per-frame noise.
 */
export const COMMISSION_STEP_GBP = 10;

export function commissionDemoFigureGBP(kit: {
  footprintM2: number;
  pieceCount: number;
  nodeCount: number;
  speciesStemLoad01: number;
}): number {
  const areaFactor = kit.footprintM2 / COMMISSION_ANCHOR_AREA_M2;
  const pieceFactor = kit.pieceCount / COMMISSION_ANCHOR_PIECES;
  const nodeFactor = kit.nodeCount / COMMISSION_ANCHOR_NODES;
  const speciesFactor =
    COMMISSION_SPECIES_FLOOR + kit.speciesStemLoad01 * COMMISSION_SPECIES_SPAN;
  const multiplier =
    COMMISSION_AREA_WEIGHT * areaFactor +
    COMMISSION_PIECE_WEIGHT * pieceFactor +
    COMMISSION_NODE_WEIGHT * nodeFactor +
    COMMISSION_SPECIES_WEIGHT * speciesFactor;
  // Snap to £10, not £1,000: the actual footprint, piece and node counts survive
  // into the tens/hundreds digits, so the figure reads as computed off the real
  // geometry (every draw a different non-round number) rather than a chosen round
  // price. At the reference bake all four factors are 1.0 => exactly the anchor.
  const stepped =
    Math.round((COMMISSION_ANCHOR_GBP * multiplier) / COMMISSION_STEP_GBP) *
    COMMISSION_STEP_GBP;
  // Never below Daniel's stated floor ("core commissions from £150k"): only a very
  // small draw with the lightest species reaches it; a real baked design clears it.
  return Math.max(COMMISSION_FLOOR_GBP, stepped);
}

export function commissionDemoLabel(gbp: number): string {
  return `£${gbp.toLocaleString('en-GB')}`;
}

/**
 * STEWARDSHIP — a revenue line the demo never mentioned, and the most on-thesis
 * number in the model: recurring income that exists BECAUSE the thing is alive.
 * A pavilion does not need stewarding; a living structure does.
 *
 * Daniel, 2026-07-17: "for stewardship, the ongoing care that keeps the living
 * structure thriving, at roughly 6-10% of install value each year."
 */
export const STEWARDSHIP_LABEL = 'stewardship';
export const STEWARDSHIP_NOTE =
  '6 to 10% of install value each year: the ongoing care that keeps the living structure thriving.';

/**
 * The summary Daniel asked for: "a summary cost to construct, and then the user
 * can expand it and see their itemized costs."
 *
 * "Cost to construct" is the honest name for what `pricing.ts` computes, and it
 * is a DIFFERENT KIND OF NUMBER from the commission floor above — a cost, not a
 * price. Note it includes the margin line, which is normal: a builder's price to
 * construct includes the builder's margin.
 */
export const COST_SUMMARY_LABEL = 'cost to construct';

/** The disclosure that opens the computed build-up. Deliberately not "price". */
export const COST_BUILDUP_LABEL = 'itemized';

/**
 * The admission that has to travel with the computed figure everywhere it is
 * shown. Two separate things, and it needs both: the rates are invented, AND
 * this is not the commission price.
 */
export const COST_BUILDUP_NOTE =
  "A build-up from this design's real cut list, at placeholder rates. It moves correctly as you shape the form, but every rate is a placeholder until fabrication quotes land. It is the cost of the kit and its install, not the commission price.";

/**
 * THE BRIDGE, AND WHY IT HAS NO NUMBERS IN IT.
 *
 * `CommissionSheet` put the stated floor and the computed build-up four lines
 * apart with nothing between them, so a reader met two figures an order of
 * magnitude apart and was left to explain the gap themselves. The two available
 * explanations are both wrong and both expensive: "they print money", or "the
 * £14k is fake" — and the second one takes the itemization down with it, which
 * is the most credible thing in the product (138 pieces and 80 nodes are
 * counted off the real kit and are true right now).
 *
 * So the gap gets named. It does NOT get priced, and that restraint is the
 * whole point of this constant. A numeric bridge — "kit £14k → design and
 * engineering £X → delivered £150k" — requires inventing £X, and £X could only
 * ever be BACK-SOLVED from £150k, because that is the only constraint
 * available. That is precisely the circular move this module already refuses to
 * make on rates, committed at a higher altitude and made MORE dangerous by
 * looking more rigorous. Asked about the £14k today there is a strong answer:
 * it is the real cut list at placeholder rates. There is no answer at all for
 * "how do you know design is £38,000?"
 *
 * Words, not figures. Do not add numbers to this sentence.
 */
export const COST_TO_COMMISSION_BRIDGE =
  'What this kit costs to construct is not what a Bower commissions for. Between them sit the design, the engineering stamp, the specifier’s fee, project management, insurance and VAT. Those numbers land when the quotes do.';

/**
 * WHICH RUNG THIS IS.
 *
 * The grammar caps every design at 18 m² and 2.5 m, non-occupied and
 * planning-free (`GRAMMAR.maxFootprintM2`, `pdHeightCapM`). That object is the
 * SMALLEST thing this studio makes — the original ladder called it the entry
 * piece. The £150k floor is a core commission: enclosed, serviced, larger. The
 * engine has never built one and currently cannot.
 *
 * That is not a defect to hide, it is a fact about scope, and saying it out
 * loud turns the distance between the two figures from an accusation into
 * information. It costs nothing, moves no rate, and is true.
 */
export const DEMO_SCOPE_NOTE = 'This demo models the smallest structure we make.';

/** The BOM decomposition: every number here is counted off the real kit. */
export function priceMetaLine(kit: {
  footprintM2: number;
  feetCount: number;
  pieceCount: number;
  nodeCount: number;
}): string {
  return `${kit.footprintM2.toFixed(1)} m² · ${kit.feetCount} feet · ${kit.pieceCount} pieces · ${kit.nodeCount} nodes`;
}
