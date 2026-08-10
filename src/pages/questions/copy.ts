/**
 * questions/copy.ts — the hand-authored content of `/questions`, kept out of the JSX so the
 * house dash rule can be tested (no em/en dashes in on-screen copy) and so the mirror, the page
 * and the tests all read one source.
 *
 * WHY THIS PAGE EXISTS (2026-07-28, Clay). The live site was three pages that between them
 * answered no practical question. A first-time reader could learn what a bower is and see seven
 * beautiful renderings, and still not know the price, the country, whether it needs planning
 * permission, what it does to a lawn, how long it takes, or who to ring. Worse, two of those
 * answers were already written and TESTED in this repo and rendered nowhere public:
 * `COMMISSION_FROM` ('from £150k') only ever appeared on `/studio` and `/shape`, both dev-only
 * since 2026-07-21, and `PD_FACT` was authored in splash/copy.ts and never mounted. The facts
 * existed; the page to put them on did not.
 *
 * THE REGISTER IS DELIBERATELY PLAIN. Every other surface on this site is composed; this one is
 * answering questions, and the reader who needs it is the one least served by elegance. Short
 * questions in her words, short answers in ours, no salesmanship. Where an answer is unwelcome
 * (access will churn the grass for a few weeks; you do not see what you bought until the third
 * summer) it is stated in the answer rather than softened, because a reader spending six figures
 * can tell the difference and the honesty is the pitch.
 *
 * THE NUMBERS HERE ARE CLAY'S OWN. They are business facts, not computed output, and NOTHING in
 * the engine derives them:
 *   - £350,000 published starting point, including VAT, running to seven figures for landmark
 *     pieces. Mirrors `COMMISSION_FROM` in ui/priceCopy.ts. If one moves, move both.
 *   - The six-week Founding Site Study: £45,000 plus approved expenses as of 2026-08-10, owned by
 *     `FOUNDING_SITE_STUDY_FEE` in ui/priceCopy.ts because several surfaces state it. It is a
 *     standalone appointment and is not credited against later work.
 *   - Stage 2, planning, design and engineering: £60,000 to £90,000 including VAT, `STAGE_2_FEE`.
 *     A RANGE, deliberately, and the rule that has governed it through three revisions is
 *     unchanged: **do not collapse it to a single figure**, because a point value reads as a quote
 *     for work nobody has scoped and the scoping is what Stage 1 is for. (It briefly published no
 *     figure at all on 2026-07-31 before this one landed.)
 *   - Both stages are professional fees and are NOT credited against construction (`FEES_NOT_CREDITED`).
 *     A buyer who assumes £108,000 of fees comes off a £350,000 commission has mis-budgeted by
 *     nearly a third, and would find that out late.
 *   - 6 to 10% of the commission a year for the first three years' training. Matches
 *     `STEWARDSHIP_NOTE` in ui/priceCopy.ts.
 *
 * CORRECTED 2026-07-28, HOURS AFTER THIS PAGE FIRST SHIPPED, AND THE CORRECTION IS THE LESSON.
 * The page originally published "£150,000" and "a siting study is £1,500", taken from
 * `COMMISSION_FROM` (Daniel's ladder of 2026-07-17) and from Clay's first pass. Clay: "£150,000
 * is below your cost. Every hour it's up is a chance someone anchors to it." The real floor is
 * £220,000 break-even on the smallest object worth building; £350,000 is a 30 m2 Bower at 35%
 * margin, which is what a published number has to be.
 *
 * So: **a figure inherited from a constant is not automatically a figure you may publish.** The
 * drift test in copy.test.ts was doing its job when it bound this page to `COMMISSION_FROM` --
 * it just bound it to a number that was itself wrong, and agreement between two places is not
 * evidence about either. The floor is now a COST fact (`COMMISSION_BREAKEVEN_GBP`) that the
 * published figure must clear, which is a claim a test can actually check.
 *
 * REPOINTED AT COMMERCIAL HOSPITALITY, 2026-07-31. The site had been written entirely to a private
 * homeowner: every second-person address assumed the reader would personally sit in the structure.
 * A venue owner is not buying somewhere to sit. Five answers changed, and two of them were not
 * softening — they were wrong:
 *
 *   - THE SIZE ANSWER SAID "room for a table of eight, with space to walk around it". Probably true
 *     of the range, and it disqualifies Bower from the entire segment in the first answer a venue
 *     owner reads. The capacities now come from `data/capacity.ts`, which derives them from an area
 *     and a published rate instead of from a mental image of a dinner party. **A capacity claim
 *     nobody had checked against a square metre figure sat two clauses away from the square metre
 *     figure.**
 *   - THE BUILDING REGULATIONS LINE SAID they "almost certainly don't apply, as long as nobody
 *     sleeps in it". Defensible in a private garden. NOT defensible for a structure the paying
 *     public assembles under, where occupancy loading and means of escape engage. That one
 *     sentence, read by a house that trades, was a credibility landmine with a live prospect.
 *
 * IT WAS FIXED, AND THEN THE WHOLE PARAGRAPH WAS DELETED LATER THE SAME DAY, which is the more
 * interesting outcome. The fix ("the structural engineering is specified for public loading from
 * the outset") replaced an understatement of the obligation with an OVERSTATEMENT of the practice:
 * it commits Bower to a named structural engineer, and there isn't one, nor professional indemnity,
 * nor public liability (`pending.ts`, `practice-entity`). Clay's rewrite of the planning answer
 * removed both sentences. **Saying nothing was the only honest option while neither claim was
 * true**, and the substance still has to exist before a venue can transact — it is simply no longer
 * promised on a public page in the meantime.
 *
 * AND RAIN IS ANSWERED, IN TWO RULINGS. "Is it waterproof? No." (2026-07-31) closed
 * `weather-glazed-crown`, the spec's hardest objection in the segment, in the least convenient
 * direction available. AMENDED 2026-08-05 (Clay): a Bower CAN be made waterproof — it adds to the
 * engineering effort, and that is true. The default stays open and is said first; the engineered
 * option carries its cost in the same breath. `houseRules.test.ts` still sweeps every page: the
 * unconditional claim stays banned, the conditional one is permitted, and both halves of the
 * answer are pinned present.
 *
 * WHAT THIS PAGE DELIBERATELY DOES NOT SAY, both withdrawn from the spec's own earlier draft:
 * a house-scale tier with capacities (Bower cannot engineer or price at marquee scale and has built
 * nothing), and a marquee hire cost to compare against. The comparison invites the capacity
 * question and loses it. `houseRules.test.ts` pins the marquee-replacement claim absent site-wide.
 *
 * THE STUDY IS STANDALONE (2026-08-10). Its fee is not credited against later work, because the
 * study has a valid conclusion even when that conclusion is not to build.
 * The three-metre height is the same threshold `GRAMMAR.pdHeightCapM` enforces (2.5 m) rounded UP
 * in prose to the permitted-development ceiling for a garden structure, which is why this file
 * says "about three metres" and never quotes the engine's cap as a promise. Do not wire these to
 * the engine: it models the smallest thing the studio makes, and this page is about commissions.
 */

import { FOUNDING_SITE_STUDY_FEE } from '../../ui/priceCopy';

/** One question and its answer. `a` is paragraphs; `rows` renders as a ruled schedule. */
export interface QA {
  /** Stable anchor id, so a link can point at one answer. */
  id: string;
  /** The question in the reader's words, not the studio's. */
  q: string;
  /** Answer paragraphs, in order. */
  a: readonly string[];
  /** Optional schedule (the timeline), rendered as a description list. */
  rows?: ReadonlyArray<{ stage: string; span: string }>;
}

export const QUESTIONS: readonly QA[] = [
  {
    id: 'size',
    /**
     * REWRITTEN OUT OF COMMITTEE VOICE, 2026-08-05 (Clay: the site's small language should be
     * beautiful and deliberate, Tolkien as the touchstone — concrete nouns, no professional
     * vocabulary). "Programme", "occupancy" and "hospitality" went; the facts stayed: sized per
     * commission, no published capacity tier (see data/capacity.ts on why), and size is settled
     * early because it drives structure, planning and cost.
     */
    q: 'How large is a Bower?',
    a: [
      'The smallest is a room for one table. The largest can hold an audience: a reading, a concert, dinner for a house party.',
      'Size is settled early, with the landscape, because the span of the frame and the number of people beneath it decide the structure, the planning route and the cost.',
    ],
  },
  {
    id: 'cost',
    /**
     * The Founding Site Study fee is published plainly as of 2026-08-10. The commission itself
     * still carries no construction figure; the only £-figure in this answer is the fixed fee for
     * the six-week standalone study.
     */
    q: 'What does it cost?',
    a: [
      'A Bower is a serious, site-specific building, priced like one.',
      'The scale, ground conditions, planning route, access and intended use all materially affect the final cost. We therefore begin with a six-week Founding Site Study, rather than offering a construction figure before the site and structure have been tested.',
      `The fixed fee is ${FOUNDING_SITE_STUDY_FEE} plus approved expenses, with half payable on appointment.`,
      'The study compares up to three locations, recommends the strongest, and develops one preliminary Bower proposition with early planning, structural and fabrication input. It concludes with an indicative project range, programme and proposal for the next stage.',
      'Concept design, detailed design, specialist consultants, fabrication, construction and planting are appointed separately if the patron decides to proceed.',
    ],
  },
  {
    id: 'planning',
    /**
     * REWRITTEN DOWN TO THREE SENTENCES, 2026-07-31 (Clay), and what came OUT matters more than
     * what went in. The answer ran seven paragraphs: the permitted-development test, the
     * ten-square-metre cap in a National Landscape, Listed Building Consent and the Gardens Trust,
     * the separate consent route for a house that trades, and a closing paragraph on building
     * regulations. All of it accurate, and all of it a specific commitment about a specific site,
     * published before anyone has looked at the site.
     *
     * THE BUILDING-REGULATIONS PARAGRAPH IS GONE, WHICH RETIRES A LIABILITY THIS REPO HAD FLAGGED
     * TWICE. It read "the structural engineering is specified for public loading from the outset" —
     * a promise with no named structural engineer behind it (`pending.ts`, `practice-entity`). It
     * had been introduced days earlier to fix a WORSE sentence ("building regulations almost
     * certainly don't apply, as long as nobody sleeps in it"), which is indefensible for a
     * structure the paying public assembles under. One understated the obligation and the other
     * overstated the practice; saying nothing is the honest position while neither is true yet.
     * **If a venue asks, that is a conversation, not a published claim.**
     */
    q: 'Will I need planning permission?',
    a: [
      'Possibly. Planning requirements depend on the property, location, size and intended use.',
      'Listed buildings, registered gardens, conservation areas and protected landscapes usually require a more involved consent process.',
      'The Founding Site Study identifies the likely planning route and any obvious consent risks. Detailed planning advice and applications form part of a later appointment.',
    ],
  },
  {
    id: 'waterproof',
    /**
     * THE ANSWER IS NO, AND IT CLOSES THE LONGEST-STANDING BLOCKER ON THIS SITE.
     *
     * The venue spec called rain "the hardest objection in the segment and the one every venue
     * owner raises within the first two minutes", because a marquee is waterproof and that is the
     * entire reason it gets hired. It sat unanswerable in `pending.ts` as `weather-glazed-crown`
     * while it was an open product question. Clay closed it on 2026-07-31: a Bower is an open
     * garden structure, not a watertight room.
     *
     * PUBLISHING THE "NO" IS THE POINT. It is the least commercially convenient sentence on the
     * site and it is the one that makes everything around it worth believing — a reader told
     * plainly that it will not keep the rain off has reason to believe the winter claim, the
     * ground-screw claim and the price. Silence here would not have been neutral: it lets a buyer
     * assume shelter, and they find out at the first booking, in front of guests.
     *
     * "It should not be described as rainproof" is Clay's instruction, and it is now a TEST rather
     * than a note: `houseRules.test.ts` sweeps every rendered page for a waterproofing claim. A
     * rule that lives only in a comment is a rule the next copy pass will not read.
     */
    /**
     * THE RULING CHANGED, 2026-08-05 (Clay): a Bower CAN be made waterproof; it adds to the
     * engineering effort, and that is true. This supersedes the 2026-07-31 "the answer is no"
     * position recorded above and in `houseRules.test.ts` — the guard there now permits the
     * CONDITIONAL claim ("can be made waterproof") while still banning the unconditional one
     * ("is waterproof"). The default remains an open garden building, said first and plainly.
     */
    q: 'Is a Bower waterproof?',
    a: [
      'Not by default. A Bower is an open garden building: it gives shade, and more shelter each year as the planting closes over the frame.',
      'It can be made waterproof. That adds engineering, so it is decided at the start, and the design carries it from the first drawing.',
    ],
  },
  {
    id: 'public-programmes',
    /**
     * REWRITTEN 2026-08-05 (same pass as the size answer). The six-abstract-nouns-in-a-row list
     * ("requirements concerning accessibility, fire safety, escape, structural loading, building
     * control and event operations") became plain words for the same three duties: ways in, ways
     * out, and the weight of a crowd. The property it must keep is unchanged: name the duties,
     * PROMISE none of them — there is still no named engineer, no PII, no public liability
     * (`pending.ts`, `practice-entity`), so what applies is established in Stage 1, not asserted.
     */
    q: 'Can it host public programmes?',
    a: [
      'Yes. Talks, concerts, teaching, dinners: a Bower is shaped around what will happen inside it.',
      'A room the public gathers in carries duties a private garden does not: level ways in, safe ways out, and the weight of a crowd on the structure. The Founding Site Study identifies the principal requirements. Access, fire safety, crowd loading and other public-use obligations are developed with the relevant specialists during design.',
    ],
  },
  {
    id: 'built-status',
    q: 'Has one been built?',
    a: [
      'Not yet. Bower is currently developing its first commissions for construction from 2027.',
      'The images on this site are concept visualisations, and the engineering and fabrication route for each project is established through the commissioning process.',
    ],
  },
  {
    id: 'lawn',
    /**
     * REWRITTEN 2026-08-05 (same pass). The old answer spent its first breath explaining why it
     * would not answer ("It is not responsible to promise one method before..."), which is a
     * sentence about liability, not about grass. The property it keeps is the one the test pins:
     * NO promised foundation method — the houses page may say ground screws because that page
     * argues; this page answers, and the honest answer is that the ground decides.
     */
    q: 'Will it wreck my lawn?',
    a: [
      'Not if we can help it. But soil, roots, buried services and the route to the site all influence the foundations and installation strategy, so we will not promise a method before walking the ground.',
      'The Founding Site Study assesses the likely approach. Surveys and detailed foundation design follow later if the project proceeds.',
      'The work needs a working area and a route for deliveries, agreed beforehand and made good afterwards. The lawn is part of the project, not the price of it.',
    ],
  },
  {
    id: 'how-long',
    /**
     * NAMES A DATE FOR THE FIRST TIME (Clay, 2026-07-31): summer and autumn 2027.
     *
     * The question changed with the answer. It was "How long from ringing us to sitting in it?",
     * which is a DURATION question, and it was answered with a duration ("a year to eighteen
     * months") plus a seven-row schedule of typical spans. That framing quietly assumed the clock
     * starts when the reader rings, and for a practice with nothing built yet it does not: the
     * first installations are a fixed point in the calendar, and everything before them is queue.
     *
     * THE SCHEDULE TABLE IS GONE, and this is the deletion to argue with if any is. Against
     * keeping it: its first row ("Stage 1: 2 to 4 weeks") was measured against a £6,500 study and
     * the study is now £18,000 with surveys and a consent route in it, so the row was already
     * stale, and the rest of the table implies a precision that "a project-specific timeline is
     * confirmed during Stage 1" explicitly withdraws. A published schedule and a promise to
     * schedule per project are two answers to one question. For keeping it: it was concrete, and
     * concrete is rare on this page. **Restoring it means re-timing every row against the new
     * scope, not pasting the old numbers back.**
     */
    q: 'When could mine be built?',
    a: [
      'The earliest founding installations are being planned for 2027, subject to site, consent and fabrication requirements.',
      'The programme includes the Founding Site Study, planning, technical design, fabrication and erection. The Founding Site Study provides a preliminary programme. The construction date is confirmed only after the planning, engineering and fabrication route is sufficiently resolved.',
      'The structure goes up in summer, when the ground is dry enough to bring a crew across a lawn without marking it. Planting follows separately, and autumn is the best moment for it, because climbers root through the winter and come away strongly in their first spring.',
      'You can sit in it the week it goes up. That first year it is a timber structure, and a handsome one. You won’t see the thing you actually bought until the third summer.',
    ],
  },
  {
    id: 'pruning',
    q: 'Who prunes it?',
    a: [
      'For the first three years after planting, its growth is actively guided. Where a property has its own gardener or grounds team, we work with them and gradually hand over the routine care.',
      'That isn’t maintenance, it’s the second half of the building work. The climbers are tied in, trained along the lattice and pruned to hold the shape. Left alone, you get a green mound. The training is what keeps the drawing.',
      'Every commission includes a separately priced three-year stewardship plan. Its cost depends on the planting, scale, location and whether care is undertaken by Bower’s landscape partner or the property’s own grounds team.',
      'After the third year, one visit annually.',
      'And these are ordinary climbers in your own soil, not a wall on life support. If nobody comes for six months, nothing dies. It simply grows where it likes.',
    ],
  },
  {
    id: 'winter',
    q: 'What does it look like in February?',
    a: [
      'Like a drawing held in the air.',
      'The leaves fall and give you back the timber: the whole woven lattice, bare, frost along the top of every lath. That’s four months of the year, so it is designed to be worth looking at empty.',
      'Not that it’s empty. We plant for winter deliberately: something evergreen threaded through, rose hips, clematis seedheads, the peeling bark of a honeysuckle. The timber silvers as it ages and sits better against a grey sky than any stain would.',
      'For a house that sells weeks of the year, this is the half of it that matters most. The lattice bare and lit is a different room from the lattice in leaf, and it is a room that exists in November and January, when the lawn is unusable and the marquee is in storage.',
      'Then in March it begins to disappear again.',
    ],
  },
];

/**
 * THE CLOSE, and the only place on the public site with a way to reach a person.
 *
 * It is a QUESTION like the others ("How does a commission begin?") rather than a CONTACT banner, because that
 * is how the reader has been thinking for the whole page and switching register at the end would
 * make it feel like the sales bit. The contact details themselves live in `data/config.ts`.
 */
export const RING = {
  q: 'How does a commission begin?',
  opening: 'Begin by introducing the landscape.',
  first:
    'The first step is a short conversation with Clay to understand the property, what might happen within the Bower, who is involved in the decision and whether there is a credible fit.',
  appointment:
    'If there is, we propose a six-week Founding Site Study. The appointment begins once its scope is agreed, the agreement is signed and the first payment has been received. The study includes the property visit.',
  leadIn: 'It establishes:',
  deliverables: [
    'The strongest location',
    'One preliminary site-specific proposition',
    'Likely planning and access constraints',
    'Early structural and fabrication thinking',
    'An indicative project range and programme',
    'The recommended route into design',
  ],
  conclusion:
    'The study concludes with a decision: proceed into Concept Design, pause, or conclude that a Bower does not belong there.',
} as const;

/** The page's frontispiece. The subline names the audience's own worry, not the product.
 *
 *  IT NO LONGER OPENS ON PRICE (2026-08-03, Clay). "What one costs" led the standfirst from the
 *  day the page shipped, written for a buyer whose first worry was the number. The founding
 *  outreach goes to estates, foundations and institutions, and Clay's ruling is that clientele at
 *  this range care less about what one costs — so cost moved from the first clause to the last,
 *  folded into "what a commission involves". The cost ANSWER below is untouched: demoting the
 *  question's billing is not withdrawing the answer. */
export const INTRO = {
  eyebrow: 'Questions',
  title: 'Questions we’re asked',
  standfirst:
    'Whether you need permission, what it does to a lawn, how long before you are sitting in it, and what a commission involves.',
} as const;
