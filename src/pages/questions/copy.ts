/**
 * questions/copy.ts — the hand-authored content of `#/questions`, kept out of the JSX so the
 * house dash rule can be tested (no em/en dashes in on-screen copy) and so the mirror, the page
 * and the tests all read one source.
 *
 * WHY THIS PAGE EXISTS (2026-07-28, Clay). The live site was three pages that between them
 * answered no practical question. A first-time reader could learn what a bower is and see seven
 * beautiful renderings, and still not know the price, the country, whether it needs planning
 * permission, what it does to a lawn, how long it takes, or who to ring. Worse, two of those
 * answers were already written and TESTED in this repo and rendered nowhere public:
 * `COMMISSION_FROM` ('from £150k') only ever appeared on `#/studio` and `#/shape`, both dev-only
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
 * THE NUMBERS HERE ARE CLAY'S OWN, given 2026-07-28. They are business facts, not computed
 * output, and NOTHING in the engine derives them:
 *   - £150,000 commission floor, including VAT. Matches `COMMISSION_FROM` in ui/priceCopy.ts,
 *     which is the same figure Daniel set on 2026-07-17. If one moves, move both.
 *   - £1,500 siting study, credited against the commission.
 *   - 6 to 10% of the commission a year for the first three years' training. Matches
 *     `STEWARDSHIP_NOTE` in ui/priceCopy.ts.
 * The three-metre height is the same threshold `GRAMMAR.pdHeightCapM` enforces (2.5 m) rounded UP
 * in prose to the permitted-development ceiling for a garden structure, which is why this file
 * says "about three metres" and never quotes the engine's cap as a promise. Do not wire these to
 * the engine: it models the smallest thing the studio makes, and this page is about commissions.
 */

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
      'Most are between 25 and 40 square metres: room for a table of eight, with space to walk around it. About three metres tall, which is the height that looks right on a lawn and also the height above which planning permission stops being optional.',
      'Each one is drawn for the garden it stands in, so size is a conversation. Larger pieces exist. Smaller ones don’t really justify the work.',
    ],
  },
  {
    id: 'cost',
    q: 'What does it cost?',
    a: [
      'Commissions start at £150,000, including VAT. Landmark pieces go considerably higher.',
      'That covers everything: design, engineering, planning drawings, making, foundations, putting it up, and the planting.',
      'Two smaller numbers. A siting study is £1,500, and comes off the price if you go ahead. Looking after the planting through the first three years runs at 6 to 10% of the commission a year.',
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
      'We find out which of these you are during the siting study, before you’ve spent anything on design. Building regulations almost certainly don’t apply, as long as nobody sleeps in it.',
    ],
  },
  {
    id: 'lawn',
    q: 'Will it wreck my lawn?',
    a: [
      'No. The structure stands on steel piles wound into the ground like corkscrews, over a day or two. No concrete, no digging, no lorry down the drive, nothing to cart away. They can be wound out again, which is why conservation officers accept them.',
      'Access is the honest part. There will be a few weeks of a working site: deliveries, a small compound, a route across the grass. We lay protective matting over anything we drive on and put back what we disturb. A track may show until the following spring. The ground the structure stands on is never dug up.',
    ],
  },
  {
    id: 'how-long',
    q: 'How long from ringing us to sitting in it?',
    a: [
      'A year to eighteen months. Most of that is waiting for planning, not making.',
      'The structure goes up in summer, when the ground is dry enough to bring a crew across a lawn without marking it. Planting follows separately. Autumn is the best moment for it, because climbers root through the winter and come away strongly in their first spring, but pot-grown plants will go in at almost any time of year given water, so it is rarely worth waiting.',
      'You can sit in it the week it goes up. That first year it is a timber structure, and a handsome one. You won’t see the thing you actually bought until the third summer.',
    ],
    rows: [
      { stage: 'Siting study', span: '2 to 4 weeks' },
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
      'For the first three years after planting, we do. That isn’t maintenance, it’s the second half of the building work. The climbers are tied in, trained along the lattice and pruned to hold the shape. Left alone, you get a green mound. The training is what keeps the drawing.',
      'It runs at 6 to 10% of the commission a year and is arranged at the same time. If you have a gardener, we’d rather teach them and hand it across: they’re there every day and we aren’t. Either way you get a pruning calendar, notes on every plant, and an inspection once a year.',
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
  study:
    'After that, the siting study: £1,500, ready within two to four weeks. Where it sits, how big, which way it faces, a straight answer on planning for your particular site, and a drawing of the structure in your garden. Yours to keep whatever you decide. If you commission, it comes off the price.',
} as const;

/** The page's frontispiece. The subline names the audience's own worry, not the product. */
export const INTRO = {
  eyebrow: 'Questions',
  title: 'Questions we’re asked',
  standfirst:
    'What one costs, what it does to a lawn, whether you need permission, and how long before you are sitting in it.',
} as const;
