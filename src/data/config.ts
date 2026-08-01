/**
 * config.ts — THE ONE PLACE every stubbed constant lives.
 *
 * Honesty rule (demo-spec §0, §2.3): every number that is a placeholder is a
 * NAMED CONSTANT here, never a magic number buried in the engine. When a real
 * figure lands (Clay's fab quote ~Day 4–6, an install allowance from a designer
 * call) it is wired in HERE and the whole engine updates. Nothing downstream
 * invents its own numbers.
 */

// ---------------------------------------------------------------------------
// GRAMMAR — the fabrication rules the whole design space derives from.
// (demo-spec §2.2: "this IS the pitch")
// ---------------------------------------------------------------------------
/**
 * Every slider bound in the demo derives from one of these stated rules, and
 * the UI surfaces WHICH rule stopped the slider as a quiet caption. The rules
 * stand in for a real fab shop's capability sheet + a pre-engineered joint
 * family a chartered engineer has stamped once — the constraint ARCHITECTURE
 * is the invention; these numbers are its current authored bounds.
 */
export const GRAMMAR = {
  /** CNC sheet stock the curved pieces are cut from (standard 2.4 × 1.2 m). */
  sheet: { lengthM: 2.4, widthM: 1.2 },
  /** Longest SHEET piece we cut — sheet length minus clamping margin. */
  maxComponentLengthM: 2.35,
  /** Longest LINEAR piece in the kit — courier/handling cap, not the saw
   *  (docking stock is 4.8 m; nothing ships longer than this). */
  maxLinearPieceM: 3.0,
  /** Saw kerf + handling gap between nested parts on a sheet. */
  nestingKerfM: 0.012,
  /** Cut lengths round to this bucket so components collapse into a tidy cut-list. */
  cutListRoundingM: 0.05,

  /**
   * Structural bay bounds (node-to-node spacing) — FABRICATION.md §1–§3.
   * Below the min, connector hardware (hub fins / lamella bolt edge
   * distances) physically overlaps at acute diamond angles.
   */
  minStrutSpacingM: 0.45,
  /** Hub system cap: above this the unsupported armature span between
   *  struts exceeds the flat-piece curvature tolerance. */
  maxStrutSpacingM: 1.05,
  /**
   * Lamella system cap: a lamella spans TWO bays through its node, and the
   * whole curved piece must still fit the CNC sheet cut limit. Grammar
   * surfaces this the moment the user switches joint system.
   */
  maxLamellaSpacingM: 0.6,

  /** Permitted-development height cap — no planning application needed. HARD. */
  pdHeightCapM: 2.5,
  /** Minimum clear headroom under the eave — people walk beneath the canopy. */
  minHeadroomM: 1.9,
  /**
   * Crown curvature limit, expressed as max rise per metre of minor half-span.
   * Tighter than this and individual flat components would need to approximate
   * more curvature than the cutter's tolerance allows. Makes the rise bound
   * DYNAMIC: a small footprint caps rise below the 2.5 m planning cap.
   */
  maxRisePerHalfSpan: 1.28,

  /**
   * The engineer-validated structural family covers this footprint range.
   * TODO: widen with a chartered engineer's sign-off — this is the roadmap
   * ("each delivered commission widens the grammar"), stated as such.
   */
  minFootprintM2: 12,
  maxFootprintM2: 18,

  /** Plan proportion of the canopy ellipse (major/minor). Fixed, not a slider. */
  planAspect: 1.25,

  /** Crown oculus radius as a fraction of the plan — the diagrid starts here. */
  crownFraction: 0.22,

  /**
   * Eave beam blanks are curved pieces cut from sheet stock, spliced only at
   * feet and at one midpoint between feet (2 blanks per inter-foot span). The
   * engine ADDS a foot when a blank would exceed maxComponentLengthM — the
   * grammar visibly reshaping the design.
   */
  eaveBlanksPerFootSpan: 2,
  minFeet: 3,
  maxFeet: 4,
} as const;

// ---------------------------------------------------------------------------
// STOCK — the standardized material palette (FABRICATION.md §0–§4).
// ONE section per role; lengths vary freely because CNC makes that free.
// ---------------------------------------------------------------------------
export const STOCK = {
  /** Hub-system struts: planed C24 spruce/larch, UC3 treated. */
  strut: { widthMm: 45, depthMm: 70, grade: 'C24', stockLengthM: 4.8 },
  /** Lamella pieces: CNC-profiled from 45 mm spruce LVL sheet (curved, so cut not bent). */
  lamella: { thicknessMm: 45, depthMm: 120 },
  /** Eave + crown blanks: 45 mm LVL, cut to their true plan curve. */
  blank: { thicknessMm: 45, depthMm: 180 },
} as const;

// ---------------------------------------------------------------------------
// JOINTS — the two v1 joint systems (FABRICATION.md §2–§3).
// TODO(roadmap): third system 'timberJoinery' — 5-axis all-timber milled
// connections (BUGA-style, no visible steel). The node-graph representation
// the geometry now emits is exactly what it will consume. FABRICATION.md §9.
// ---------------------------------------------------------------------------
export const JOINTS = {
  hub: {
    /** S355 laser-cut fin thickness (mm); strut end slot = fin + galv allowance. */
    finThicknessMm: 6,
    slotMm: { width: 7, depth: 105 },
    /** Fin plate the strut slots onto: 60 mm tall (inside the 70 mm depth). */
    finHeightMm: 60,
    /** M12×70 8.8 HDG through-bolts per strut end into the fin. */
    boltsPerStrutEnd: 2,
    boltSpec: 'M12×70 8.8 HDG + dome nut',
    /** Bolt hole centres from the strut end face (mm) — FABRICATION.md §2. */
    boltInsetsMm: [40, 85],
    boltDiaMm: 12,
    /** Hub core disc: a laser-cut disc the fins weld to (FABRICATION.md §2) —
     *  drawn as the thin plate it is, not a drum. Its Ø claims a cylindrical
     *  CONNECTOR ENVELOPE about the node normal at EVERY node (interior disc,
     *  ring flange assembly, ground shoe alike) — timber stays out of it.
     *  The envelope is a clearance VOLUME, not the physical part: the standoff
     *  solver reads coreDiaMm only, so the disc thickness is render-only. */
    coreDiaMm: 140,
    // Render-only volume bump (2026-07-17, Sai): a stubby cylindrical pipe-boss
    // hub reads far better than a flat 8 mm sticker-disc under the wash. Safe —
    // the standoff solver reads coreDiaMm ONLY (see the note above), so disc
    // thickness moves no BOM line and no cut; 30 mm stays well inside the 140 mm
    // face so proportions hold.
    coreDiscMm: 30,
    /**
     * MILLED-END STANDOFF (FABRICATION.md §1a): every strut end is a square
     * cut at a COMPUTED standoff — the smallest length where the whole end
     * face clears the connector envelope by `envelopeClearanceMm`, whatever
     * the approach angle. This is the FLOOR (the core radius); the computed
     * value is typically 75–85 mm and is subtracted into the CUT length.
     */
    strutStandoffM: 0.07,
    /** Timber-to-steel clearance at the envelope (mm). */
    envelopeClearanceMm: 10,
    /** At ring nodes the strut end also clears the blank's inner face (mm). */
    blankFaceClearanceMm: 5,
  },
  lamella: {
    /** One through-bolt per node: continuous lamella mid-hole + two butting ends. */
    boltsPerNode: 1,
    boltSpec: 'M12×180 8.8 HDG + 50 mm washers',
    boltDiaMm: 12,
    /**
     * MILLED-END GEOMETRY (FABRICATION.md §1a): a butting end is a SKEW cut
     * on the continuous piece's side-face plane — half its thickness plus
     * this assembly gap from the node centre. Ends at the rings are skew cuts
     * on the blank's inner-face plane (half the blank depth + the same gap).
     * The trims are DERIVED from those planes, not constants.
     */
    assemblyGapMm: 2,
  },
  /** Mid-bay splice + split-weave nodes: square cuts leaving this total
   *  joint gap under the fish plates (half each side). */
  spliceGapM: 0.003,
} as const;

// ---------------------------------------------------------------------------
// FOUNDATION — both foot strategies land on ground screws; no concrete.
// ---------------------------------------------------------------------------
export const FOUNDATION = {
  /** TODO: confirm screw spec per ground survey (FABRICATION.md §5). */
  groundScrewSpec: 'Ø76 × 865 mm HDG ground screw',
} as const;

// ---------------------------------------------------------------------------
// ENVELOPE — slider ranges + defaults (bounds justified by GRAMMAR rules;
// the live per-design bounds come from engine/grammar.ts deriveBounds()).
// ---------------------------------------------------------------------------
export const ENVELOPE = {
  footprintM2: { min: GRAMMAR.minFootprintM2, max: GRAMMAR.maxFootprintM2, default: 15 },
  riseM: { min: GRAMMAR.minHeadroomM, max: GRAMMAR.pdHeightCapM, default: 2.3 },
  strutSpacingM: { min: GRAMMAR.minStrutSpacingM, max: GRAMMAR.maxStrutSpacingM, default: 0.55 },
  apertureDeg: { min: 0, max: 359, default: 90 }, // 90 = opens east, toward morning light
  /** Default joint system (FABRICATION.md §2–§3). */
  jointSystem: 'hub',
} as const;

// ---------------------------------------------------------------------------
// SITE — fixed site assumptions (no site import in this demo, spec §2.6).
// The sun-path still runs for real so "opens toward morning light" and the
// sunward strut bias are astronomy, not copy.
// ---------------------------------------------------------------------------
export const SITE = {
  latitudeDeg: 51.5, // London-ish
  /** World north: scene +Z. Kept as a constant so a site step could return. */
  northDeg: 0,
} as const;

// ---------------------------------------------------------------------------
// PRICING — cost build-up = Σ components × rate + install + groundwork
//           + planting + margin (demo-spec §2.3). Shown as a cost build-up for
//           the kit and its install, NEVER as the commission price: the ladder's
//           stated range lives in ui/priceCopy.ts and is ~6x this. Read that
//           module's header before touching a rate here.
// ---------------------------------------------------------------------------
export const PRICING = {
  /**
   * TODO: wire real fab quotes (Clay, Day 4–6). Every unit rate below is a
   * PLACEHOLDER until a fabricator returns an itemised quote against the
   * demo's ACTUAL cut geometry + hardware schedule. Until then the price
   * MOVES correctly (it is built from the real BOM); it is not yet TRUE.
   */

  /** £/m — 45×70 planed C24, UC3 treated, delivered (hub struts). */
  timberPerMetreGBP: 7,
  /** £/sheet — 45 mm spruce LVL 2.4 × 1.2 m (lamellas, eave + crown blanks). */
  lvlSheetGBP: 215,
  /** £/sheet — CNC profiling one full sheet (lamellas / blanks). */
  sheetCncGBP: 65,
  /** £/piece — docking-saw end program on a linear piece (2 ends: dock+slot+drill). */
  dockingPerPieceGBP: 5,

  /** Steel + fixings unit rates, keyed by the hardware ids joints.ts emits. */
  hardwareGBP: {
    /** Welded + HDG steel node hub (per fin averaged in). */
    hub: 32,
    /** Ground-shoe hub: hub + 200×200×8 base plate (the rooted touchdowns). */
    hubGroundShoe: 48,
    /** Bent-plate ground shoe for lamella touchdowns. */
    plateGroundShoe: 24,
    /** M12 bolt set (bolt + nut + washers), either system. */
    boltSet: 1.4,
    /** 4 mm HDG fish-plate pair + M10 sets (blank splices, lamella system). */
    fishPlate: 9,
    /** Ø76 × 865 ground screw, supplied AND driven (no concrete). */
    groundScrew: 175,
    /** Living armature: 6 mm stainless wire + eye screws, per metre run. */
    armatureWirePerM: 3.2,
  } as Record<string, number>,

  /** TODO: confirm with installer — fixed mobilisation (crew, delivery). */
  installBaseGBP: 3800,

  /** TODO: confirm with installer — marginal install labour per timber piece. */
  installPerComponentGBP: 6.5,

  /** TODO: confirm with horticultural partner — supply + plant one climber. */
  plantingPerPlantGBP: 55,

  /**
   * Margin + contingency. Covers the designer channel fee, VAT treatment and
   * contingency in one stated line. Shown in the decomposition — hiding it
   * would be the overclaim the application warns against.
   *
   * This comment used to say the margin line is what lets the on-screen figure
   * "honestly read 'fixed', not 'estimate'". It does not. A margin on top of
   * placeholder rates is a placeholder with a margin on it, and no on-screen
   * copy has said "fixed" since 2026-07-17. See ui/priceCopy.ts.
   */
  marginRate: 0.28,

  /** The total is rounded to this. Rounding is legibility, not confidence. */
  roundTotalToGBP: 100,
} as const;

// ---------------------------------------------------------------------------
// ECOLOGY — rule-of-thumb formulas (kept: the living layer is the reframe)
// ---------------------------------------------------------------------------
export const ECOLOGY = {
  /** TODO: site-specific rainfall (Met Office 1991-2020). SE England ballpark. */
  annualRainfallMm: 690,

  /** Runoff coefficient for a slatted lattice canopy captured to beds. */
  roofRunoffCoefficient: 0.55,

  /**
   * Pollinator "cells": a coarse habitat unit = 1 per this many m² of flowering
   * coverage, scaled by the species' pollinator value. Rule of thumb for the
   * readout, NOT an ecological survey.
   */
  m2PerPollinatorCellAtFullValue: 1.4,

  /** Carbon rough proxy: kg CO2e sequestered per m² of mature leaf coverage/yr. */
  carbonKgPerM2PerYr: 1.1,
} as const;

// ---------------------------------------------------------------------------
// GROWTH — visual approximation of establishment
// ---------------------------------------------------------------------------
export const GROWTH = {
  /** Years the toggle can show. Year 2 = "finished in year two". */
  years: [0, 1, 2] as const,
  /** Coverage saturates as growth approaches this fraction of the lattice. */
  maxCoverageFraction: 0.92,
  /** Year-0 establishment: what a freshly-planted climber covers on day one. */
  year0CoverageFraction: 0.04,
  /** Characteristic climb length (m) from bed to crown of the canopy. */
  characteristicLengthM: 2.6,
} as const;

export type Year = (typeof GROWTH.years)[number];

// ---------------------------------------------------------------------------
// LEAD TIME — quoted build lead time (stubbed)
// ---------------------------------------------------------------------------
/** TODO: confirm with fab shop + installer once real capacity is known. */
export const LEAD_TIME = {
  baseWeeks: 6,
  weeksPerHundredComponents: 2,
} as const;

// ---------------------------------------------------------------------------
// NAMING — ONE NAME (2026-07-23). Clay: "shift the homepage so it says 'Bower'
// instead of 'Eden'. It is super confusing right now."
//
// This retires the two-proper-noun system confirmed on 2026-07-05, under which
// WORDMARK ("Bower") was the company and PRODUCT ("Eden") was the object a client
// commissions. Both names were defensible on their own and the split was invisible
// from inside; the problem is what it does to a first-time reader, who meets one
// word in the nav and a different one in the headline with nothing explaining the
// relationship. The page now teaches a single word three ways — the wordmark, the
// dictionary definition on the home's full-spread band, and the object itself.
//
// The common noun "bower" (a garden structure, like pavilion or arbor) is the whole
// point of the choice: the brand IS the dictionary word, so lowercase generic prose
// and the proper noun reinforce each other instead of competing.
//
// STILL SAYING "Eden" and deliberately left alone: dev-only engine/studio surfaces
// (ui/priceCopy.ts, ui/PricePanel.tsx hardcode it) and the historical record in
// about/projects.ts + handoffs. None of those are client-facing today; sweeping
// them is a follow-up, not a silent side effect of a homepage change.
// ---------------------------------------------------------------------------
export const WORDMARK = 'Bower';
export const PRODUCT = 'Bower';

/**
 * ENGINE_NAME — the generative engine's proper noun. NOT YET DECIDED: Daniel and
 * Clay have an open call (candidates floated: Espalier / Trellis / Grammar /
 * Understory). Until it lands, the engine is named with the lowercase generic
 * "the engine", and every splash/engine chrome reference reads it from HERE, so
 * locking the name is a one-line swap.
 */
export const ENGINE_NAME = 'the engine';

/**
 * PRIMARY CTA labels — one filled action on the splash, audience-dependent. Until
 * the Jul 17 evaluator deadline the filled action sends to the proof (the engine
 * page); after it, the buyer action (the studio) leads. Both labels live here so
 * the swap is one line. Do NOT swap without the call.
 */
export const CTA_PRIMARY_EVALUATOR = 'See how the engine works';
export const CTA_PRIMARY_BUYER = 'Shape your Bower';

/**
 * CONTACT — REAL AS OF 2026-07-28 (Clay). This was deliberately empty from 2026-07-17
 * (Daniel: no inbox to route to, so expose nothing rather than something dead), and the
 * emptiness had a second cost nobody had priced: `RegisterInterest` told every visitor
 * "Noted. We will be in touch." over a handler that does `console.log` and nothing else.
 * A site with no contact route AND a form that claims one is worse than either alone.
 *
 * These are Clay's own details, given for the `/questions` close. Two things to know:
 *   - THIS REPO IS PUBLIC (see CLAUDE.md), so both values are already scrapeable here as
 *     well as on the rendered page. That is a decision, not an oversight; swap in a
 *     studio inbox and a UK number when they exist and nothing else has to change.
 *   - The site sells to UK gardens and the number is a US mobile. Also deliberate for
 *     now (it is the number Clay answers), and the first thing to revisit.
 *
 * `phoneHref` is the E.164 form for `tel:`; `phone` is the printed form.
 *
 * STILL NOT DONE AS OF 2026-07-31, AND IT IS NOW THE OLDEST UNPAID DEBT ON THE SITE. The venue
 * rewrite ranks this third of nine, above building a whole new page, and describes it as one hour
 * of work: "a US mobile and a Gmail address are what a commercial buyer's solicitor notices first",
 * and they sit on the page that names £350,000. The practice is about to send letters to
 * family-owned listed houses; the reply-to on the site is a personal Gmail account.
 *
 * The note above already said the number was "the first thing to revisit" three days ago, which is
 * exactly the problem with recording an intention in a comment: `config.test.ts` now asserts the
 * SHAPE of what is wrong rather than describing it, so the day a UK number and a domain mailbox
 * land, a test tells you the debt is cleared instead of a human noticing. See `pending.ts`,
 * `contact-uk-phone` and `contact-domain-email`.
 */
export const CONTACT = {
  name: 'Clay Seifert',
  phone: '+1 972-363-6298',
  phoneHref: '+19723636298',
  /**
   * THE PUBLISHED ADDRESS, and it is deliberately a PERSON rather than a department (2026-07-31).
   *
   * `info@bowerbuild.org` exists and is the form's destination (`FORM_INBOX` below). It is not what
   * the page prints, because of where the page prints it: the `/questions` close sets the heading
   * "Who do I ring?", then the name "Clay Seifert", then this address directly underneath. An
   * `info@` in that position puts a front desk between the reader and the person they just read the
   * name of — the peer-to-supplier slide the venue spec's sixth ground rule is about, arriving
   * through the email address instead of through the vocabulary.
   *
   * It is also who these buyers are. A family-owned house is not procuring from a vendor; the
   * reference customer is already asking technical questions unprompted, and the answer to "who do
   * I ring" should be a human being with a name.
   *
   * One line to reverse if the volume ever justifies a shared inbox — every surface reads this
   * constant.
   */
  email: 'clay@bowerbuild.org',
} as const;

/**
 * WHERE THE SITE'S OWN FORM WRITES, as opposed to where a reader is invited to write.
 *
 * A department address is right here and wrong above, and the difference is who is typing. The
 * register-interest form is a machine posting to a machine: nobody reads `info@` as a brush-off
 * because nobody sees it. What it buys is durability — it survives one person being away, it can
 * fan out to both founders later without the site changing, and it keeps automated mail out of the
 * mailbox a client's reply lands in.
 *
 * Consumed by `api/contact.ts` (the serverless handler), NOT by any component: a form does not need
 * to know its own destination, and printing it would undo the reasoning above.
 */
export const FORM_INBOX = 'info@bowerbuild.org';

/**
 * THE FOUNDERS, name and address paired, for the footer's practice block.
 *
 * NOT imported from `pages/about/projects.ts`, for the reason `seo.ts` already gives about
 * `FOUNDER_NAMES`: that module is the entire About ledger (every project, every image path, every
 * bio) and pulling it in here would drag it into EVERY page's bundle to print four strings, since
 * the footer is on all of them. `config.test.ts` asserts these names equal `TEAM`'s exactly, so the
 * coupling is paid at test time and costs the reader nothing.
 *
 * The order is the order they are printed in, and it matches `TEAM`.
 */
export const FOUNDERS = [
  { id: 'clay', name: 'Clay Seifert', email: 'clay@bowerbuild.org' },
  { id: 'daniel', name: 'Daniel Guerra', email: 'daniel@bowerbuild.org' },
] as const;

/**
 * WHAT THE CONTACT DETAILS HAVE TO BECOME, as data rather than as prose.
 *
 * `config.test.ts` reads this and reports the gap on every run. It is deliberately expressed as the
 * TARGET (a UK dialling code, a bowerbuild.org mailbox) rather than as "the current value is wrong",
 * because a test pinned to the current wrong value is a test that goes green by accident the moment
 * anyone edits it to a different wrong value.
 */
export const CONTACT_TARGET = {
  /** The site sells to UK houses; the number must be reachable as a UK one. */
  phoneCountryPrefix: '+44',
  /** A domain mailbox, not a personal account on a free provider. */
  emailDomain: 'bowerbuild.org',
} as const;

