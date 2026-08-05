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
 *   - Stage 1, siting and feasibility: £20,000 as of 2026-08-04, owned by `STAGE_1_FEE` in
 *     ui/priceCopy.ts because several surfaces state it. It has been £1,500, £6,500, £15,000 and
 *     £18,000, which is exactly why it stopped being a literal. It is credited in full against
 *     the design and engineering commission (`STAGE_1_CREDIT`, Clay's term of 2026-08-04).
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
 * THE CREDIT CLAIM IS BACK (2026-08-04). "The study comes off the price" was true of the £1,500
 * version, was deliberately NOT carried forward through £6,500/£15,000/£18,000, and this header
 * said to restore it only if Clay ruled it credited. He has: the £20,000 fee is credited in full
 * against the design and engineering commission (not against construction). The sentence is
 * `STAGE_1_CREDIT` in priceCopy.ts, one owner.
 * The three-metre height is the same threshold `GRAMMAR.pdHeightCapM` enforces (2.5 m) rounded UP
 * in prose to the permitted-development ceiling for a garden structure, which is why this file
 * says "about three metres" and never quotes the engine's cap as a promise. Do not wire these to
 * the engine: it models the smallest thing the studio makes, and this page is about commissions.
 */

import { COMMISSION_STATEMENT, STAGE_1_CREDIT, STAGE_1_FEE } from '../../ui/priceCopy';

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
     * THE STAGE 1 FEE IS PUBLISHED AGAIN AS OF 2026-08-04 (Clay: "Stage 1 cost = 20k GBP...
     * That 20k gets credited against DD"), which reverses the figure-free position this answer
     * held from 2026-08-03. The commission itself still carries no figure — the only number a
     * reader may meet here is the fee for the next step they can actually take, and the credit
     * term is what stops it reading as a toll. `copy.test.ts` pins that property: the ONLY
     * £-figure in this answer is `STAGE_1_FEE`.
     */
    q: 'What does it cost?',
    a: [
      ...COMMISSION_STATEMENT,
      // "The study" lost its antecedent when the feasibility sentence left COMMISSION_STATEMENT
      // (2026-08-05), so the fee line names the thing it prices.
      `Stage 1, the paid feasibility study, is ${STAGE_1_FEE}. ${STAGE_1_CREDIT}`,
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
      'Stage 1 establishes the likely planning route before detailed design begins.',
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
      'A room the public gathers in carries duties a private garden does not: level ways in, safe ways out, and the weight of a crowd on the structure. Stage 1 establishes which apply before the design begins.',
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
      'Not if we can help it. But soil, roots, buried services and the way in decide the foundations, so we will not promise a method before we have walked the ground. Stage 1 settles it.',
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
      'The first installations are planned for summer and autumn 2027.',
      'The programme includes feasibility, planning, technical design, fabrication and erection. A project-specific timeline is confirmed during Stage 1.',
      'The structure goes up in summer, when the ground is dry enough to bring a crew across a lawn without marking it. Planting follows separately, and autumn is the best moment for it, because climbers root through the winter and come away strongly in their first spring.',
      'You can sit in it the week it goes up. That first year it is a timber structure, and a handsome one. You won’t see the thing you actually bought until the third summer.',
    ],
  },
  {
    id: 'pruning',
    q: 'Who prunes it?',
    a: [
      'For the first three years after planting, we do. If you have a gardener or grounds staff, we’d rather teach them and hand it across: they’re there every day and we aren’t.',
      'That isn’t maintenance, it’s the second half of the building work. The climbers are tied in, trained along the lattice and pruned to hold the shape. Left alone, you get a green mound. The training is what keeps the drawing.',
      'It runs at 6 to 10% of the commission a year and is arranged at the same time. Either way you get a pruning calendar, notes on every plant, and an inspection once a year.',
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
 * It is a QUESTION like the others ("Who do I ring?") rather than a CONTACT banner, because that
 * is how the reader has been thinking for the whole page and switching register at the end would
 * make it feel like the sales bit. The contact details themselves live in `data/config.ts`.
 */
export const RING = {
  q: 'Who do I ring?',
  /** What the first conversation actually is, so nobody fears a sales call. */
  first:
    'The first conversation happens in your garden, by arrangement. An hour, walking the ground, working out where a structure might go and whether it should.',
  /**
   * What the paid step buys, stated as deliverables.
   *
   * "ready within two to four weeks" IS GONE (2026-07-31). It was the turnaround for a £6,500
   * study; Stage 1 is now £18,000 and carries surveys and a consent route, and no one has re-timed
   * it. The same stale span was the first row of the schedule table this page used to publish, and
   * that table was deleted for the same reason. **A duration inherited from a cheaper, smaller
   * version of a product is not a duration you may keep publishing** — it is the timing equivalent
   * of the £150,000 incident. Put a real one back when it is known.
   */
  study: 'After that, a paid feasibility study establishes where it sits, how large it should be, the likely planning route, engineering and fabrication strategy, access, delivery sequence and a project-specific cost range.',
  /**
   * The step after it, priced as a RANGE and explicitly fixed later.
   *
   * The figure has been published, withdrawn and republished in one day (£18,000 to £25,000, then
   * nothing, then £60,000 to £90,000). What survived all three revisions is the rule: never a
   * single figure, because a point value reads as a quote for work nobody has scoped, and the
   * scoping is what Stage 1 is for.
   */
  next: 'Only when that work is complete is a design and engineering commission proposed.',
  /** Both stages are fees for work, not money on account. Stated in the close as well as the cost
   *  answer, because the close is where someone decides to commit to Stage 1. */
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
