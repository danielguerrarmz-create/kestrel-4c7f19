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
 *   - Stage 1, the feasibility and siting study: £15,000, owned by `STAGE_1_FEE` in
 *     ui/priceCopy.ts because three surfaces state it. Was £6,500 (2026-07-28) and £1,500 before
 *     that; it has moved twice in four days, which is exactly why it stopped being a literal.
 *   - Stage 2 IS NO LONGER PRICED (2026-07-31, Clay). It published "typically £18,000 to £25,000,
 *     confirmed at the end of Stage 1" — a range rather than a point, deliberately, because the
 *     figure varies with heritage statements and tree surveys. The range is now gone entirely and
 *     the copy describes the WORK instead, with the price fixed after the study establishes scope.
 *     This note used to read "do not collapse it to a single figure"; that rule stands and is not
 *     what happened. Collapsing a range to a point claims a precision nobody has. Removing it
 *     declines to guess.
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
 *     public assembles under, where occupancy loading, means of escape and level access all engage.
 *     That one sentence, read by a house that trades, was a credibility landmine with a live
 *     prospect. It is now split explicitly by who uses the structure.
 *
 * **AND THE NEW SENTENCE WRITES A CHEQUE THE PRACTICE HAS NOT YET CASHED.** "The structural
 * engineering is specified for public loading from the outset" commits Bower to a named structural
 * engineer. There isn't one, nor professional indemnity, nor public liability (see `pending.ts`,
 * `practice-entity`). The copy is honest about intent and the substance has to exist before a venue
 * can transact: resolve it in August or this line stops being a strength and becomes the thing a
 * solicitor quotes back.
 *
 * WHAT THIS PAGE DELIBERATELY DOES NOT SAY, both withdrawn from the spec's own earlier draft:
 * a house-scale tier with capacities (Bower cannot engineer or price at marquee scale and has built
 * nothing), and a marquee hire cost to compare against. The comparison invites the capacity
 * question and loses it. `houseRules.test.ts` pins the marquee-replacement claim absent site-wide.
 *
 * WHAT THIS PAGE NO LONGER CLAIMS: that the study "comes off the price". That was true of the
 * £1,500 version and was NOT restated when the fee became £6,500 and a defined product, so it is
 * gone rather than carried forward on momentum. Restore it only if Clay says it is credited.
 * The three-metre height is the same threshold `GRAMMAR.pdHeightCapM` enforces (2.5 m) rounded UP
 * in prose to the permitted-development ceiling for a garden structure, which is why this file
 * says "about three metres" and never quotes the engine's cap as a promise. Do not wire these to
 * the engine: it models the smallest thing the studio makes, and this page is about commissions.
 */

import { FOOTPRINT_M2, HEADS_IN_WORDS } from '../../data/capacity';
import { STAGE_1_FEE } from '../../ui/priceCopy';

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
    q: 'How big is it?',
    a: [
      `Most are between ${FOOTPRINT_M2.min} and ${FOOTPRINT_M2.max} square metres. At the top of that range: about ${HEADS_IN_WORDS.dining} to dinner, or ${HEADS_IN_WORDS.standing} standing. About three metres tall, which is the height that looks right on a lawn and also the height above which planning permission stops being optional.`,
      'Each one is drawn for the garden it stands in, so size is a conversation. Larger pieces exist. Smaller than twenty-five square metres doesn’t really justify the work.',
    ],
  },
  {
    id: 'cost',
    q: 'What does it cost?',
    a: [
      'Commissions begin at £350,000 including VAT, and run into seven figures for landmark pieces.',
      // "a paid feasibility and siting study", matching the name the fee line and /houses now use.
      // It said "a paid siting study" and the two sat four paragraphs apart in the same answer,
      // which reads as two different pieces of work rather than one renamed on 2026-07-31.
      'Every Bower is site-specific, so that is where commissions begin and not a quote for yours. The fixed price is established through a paid feasibility and siting study.',
      'It covers everything: design, engineering, planning drawings, making, foundations, putting it up, and the planting.',
      `The step before it is smaller. Stage 1, the feasibility and siting study, is ${STAGE_1_FEE}.`,
      'Following the feasibility study, we prepare a fixed proposal for planning, engineering and technical design. Most projects involve structural engineering, planning coordination and fabrication detailing, with the final scope depending on the site and local authority requirements.',
      'Afterwards, looking after the planting through the first three years runs at 6 to 10% of the commission a year.',
    ],
  },
  {
    id: 'planning',
    q: 'Do I need planning permission?',
    a: [
      'Often, yes, and we handle it.',
      'Some gardens don’t need it at all. That requires an unlisted house, no conservation area or National Landscape, a position behind the house, and a structure under three metres. If any of that isn’t true, it needs a householder application: eight weeks officially, ten to fourteen in practice.',
      'One rule matters particularly here. In a National Landscape such as the Cotswolds, anything more than twenty metres from the house is capped at ten square metres, which is too small to be a Bower. Nearer the house, the ordinary rules apply.',
      'A listed house also needs Listed Building Consent, and a registered garden brings the Gardens Trust in as a consultee. Four to six months. Slower, not harder.',
      'A house that trades, whether that is weddings, whole-house hire or guests, is a different route. Permitted development rules for dwellings don’t apply, so it is a full planning application rather than a householder one, though the timetable is much the same. A structure ancillary to how the place already operates rarely raises a change-of-use question, but it is one of the things the siting study settles before you have spent anything on design.',
      // Trimmed 2026-07-31. This read "...during the siting study, before you've spent anything on
      // design", and the commercial paragraph inserted above it now ends on that same clause. Two
      // adjacent paragraphs closing with the identical promise reads as a page repeating itself to
      // fill space, which is the opposite of what this register is for. The clause stays where it
      // does the most work: on the answer a trading house actually needs.
      'We find out which of these you are during the siting study.',
      // "and level access" was cut from this list on 2026-07-31 (Clay). It was in the spec's own
      // draft, and it is a claim about a design commitment nobody has verified: on ground screws
      // over a lawn that is not itself level, step-free access is something you engineer, not
      // something you get. Occupancy and escape are properties of the CONSENT ROUTE, which is what
      // this answer is about, and they are true whatever the finished levels turn out to be.
      // Naming the two that hold and dropping the one that might not is the conservative direction.
      'In a private garden, building regulations almost certainly don’t apply as long as nobody sleeps in it. Where the public will use it, they do: occupancy and escape are part of the design, and the structural engineering is specified for public loading from the outset rather than retrofitted to it.',
    ],
  },
  {
    id: 'lawn',
    q: 'Will it wreck my lawn?',
    a: [
      'No. The structure stands on steel piles wound into the ground like corkscrews, over a day or two. No concrete, no digging, no lorry down the drive, nothing to cart away. They can be wound out again, which is why conservation officers accept them.',
      'Access is the honest part. There will be a few weeks of a working site: deliveries, a small compound, a route across the grass. We lay protective matting over anything we drive on and put back what we disturb. A track may show until the following spring. The ground the structure stands on is never dug up.',
      'If the house is trading, the question is really about the diary. Foundations and raising take about three weeks on site, and it can be scheduled into a gap rather than closing anything: the compound sits away from the house, the route in is matted, and there is no concrete, no lorry down the drive and nothing to cart away. We would rather work around a booked season than through it, so we plan the build backwards from your calendar.',
    ],
  },
  {
    id: 'how-long',
    q: 'How long from ringing us to sitting in it?',
    a: [
      'A year to eighteen months. Most of that is waiting for planning, not making.',
      'The structure goes up in summer, when the ground is dry enough to bring a crew across a lawn without marking it. Planting follows separately. Autumn is the best moment for it, because climbers root through the winter and come away strongly in their first spring, but pot-grown plants will go in at almost any time of year given water, so it is rarely worth waiting.',
      'You can sit in it the week it goes up. That first year it is a timber structure, and a handsome one. You won’t see the thing you actually bought until the third summer.',
      'For a house that sells by the season: commission in the autumn, planning over the winter, raise it the following summer, and it is photographing properly by the summer after that.',
    ],
    rows: [
      { stage: 'Stage 1, the feasibility and siting study', span: '2 to 4 weeks' },
      { stage: 'Design', span: '6 to 10 weeks' },
      { stage: 'Engineering', span: '6 to 10 weeks' },
      { stage: 'Planning', span: 'none, or up to 6 months' },
      { stage: 'Making it', span: '8 to 14 weeks' },
      { stage: 'Foundations and raising it', span: 'about three weeks on site' },
      { stage: 'Planting', span: 'a few days, once it’s standing' },
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
  /** What the paid step buys, stated as deliverables. */
  study: `After that, Stage 1: the feasibility and siting study, ${STAGE_1_FEE}, ready within two to four weeks. Where it sits, how big, which way it faces, a straight answer on planning for your particular site, and a drawing of the structure in your garden. Yours to keep whatever you decide.`,
  /**
   * The step after it, named and deliberately UNPRICED.
   *
   * It used to publish "typically £18,000 to £25,000, confirmed at the end of Stage 1". The range
   * was itself a deliberate refusal to give one number, on the reasoning that the figure varies
   * with heritage statements and tree surveys. Clay withdrew the figures entirely on 2026-07-31.
   *
   * That is a move in the SAME direction, not a reversal, and worth being clear about because the
   * old header note said "do not collapse it to a single figure": collapsing a range to a point is
   * a claim to precision nobody has, whereas removing it is a refusal to guess. What replaces it
   * says what the work IS (structural engineering, planning coordination, fabrication detailing)
   * and that the price is fixed once the study has established the scope. **The cost is that a
   * reader no longer learns what Stage 2 runs to before engaging.** That is the trade Clay made.
   */
  next: 'Following the feasibility study, we prepare a fixed proposal for planning, engineering and technical design. Most projects involve structural engineering, planning coordination and fabrication detailing, with the final scope depending on the site and local authority requirements.',
} as const;

/** The page's frontispiece. The subline names the audience's own worry, not the product. */
export const INTRO = {
  eyebrow: 'Questions',
  title: 'Questions we’re asked',
  standfirst:
    'What one costs, what it does to a lawn, whether you need permission, and how long before you are sitting in it.',
} as const;
