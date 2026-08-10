/**
 * houses/copy.ts — the content of `/houses`, the page written for a business rather than a garden.
 *
 * WHY THIS PAGE EXISTS (2026-07-31). Bower spent three months writing to private garden owners
 * through the National Garden Scheme: about eighty-five letters, twenty-one warm replies, fifteen
 * accepted visits, and zero commercial conversations. The letters worked. The audience could not
 * buy. The practice is repointing at family-owned listed houses that already earn from exclusive
 * hire, weddings and whole-house rental, and the site had nothing addressed to them: every
 * second-person sentence on it assumed the reader would personally sit in the structure.
 *
 * `/houses`, NOT `/venues`. "Venue" is trade vocabulary and these owners mostly do not describe
 * themselves that way; "houses" is how Landed Houses, Wolsey Lodges and Historic Houses all speak.
 *
 * WHAT THIS PAGE IS SELLING, stated precisely, because getting it wrong wastes the segment:
 * NOT CAPACITY. Bower cannot build at marquee scale and does not claim to. A commercial house is
 * buying the reason a couple picks them over the house twenty miles away — a photograph of
 * something that exists nowhere else, in a garden that is already historically significant.
 * Underneath that, three uses at real size: a drinks reception, a small ceremony, and dinner for a
 * house party of about thirty.
 *
 * THE FIRST DRAFT OF THIS PAGE OPENED WITH THE CLAIM THAT A BOWER REPLACES A MARQUEE, AND THAT IS
 * THE MOST IMPORTANT THING TO KNOW ABOUT IT. The argument was tidy: canvas arrives, is erected,
 * holds one weekend, is struck, and comes back next year dearer and shabbier; a Bower is raised once
 * and improves. Every clause true, and the conclusion false, because at 25 to 40 square metres it
 * does not hold the wedding the marquee was hired for. A venue owner establishes that in ONE
 * question, and they establish it on the page's opening claim, which means the rest of the page is
 * read by someone who has just caught you overselling. **The withdrawn claim was not a lie about
 * the product; it was a true sentence about the wrong quantity.** What replaces it is the case that
 * survives the question: this is a DIFFERENT room, at house-party size, that exists in November.
 * `houseRules.test.ts` pins the claim absent across the whole site.
 *
 * THE HONEST CONCESSION IS LOAD-BEARING AND MUST NOT BE EDITED OUT. "Canvas will still go up for a
 * hundred and twenty at dinner, and it should" is the sentence that buys the reader's trust for
 * everything after it. It costs nothing — the house already owns a marquee and already knows this —
 * and conceding the thing the reader was about to object to is what makes the next paragraph
 * credible. A later pass that reads it as a weakness and deletes it will have removed the reason
 * the page works.
 *
 * WEATHER IS ANSWERED, AND THE ANSWER CHANGED ONCE (2026-07-31 "no"; AMENDED 2026-08-05, Clay: a
 * Bower CAN be made waterproof — it adds to the engineering effort, and that is true). The default
 * stays an open garden structure, said first; the engineered option is stated with its cost. The
 * section sits SECOND, not buried, for the reasoning in its own note. `houseRules.test.ts` still
 * sweeps every page: the unconditional claim ("is waterproof") stays banned, the conditional one
 * ("can be made waterproof") is permitted.
 *
 * ONE SECTION IS STILL MISSING and it is the strongest thing this page could say: see `pending.ts`,
 * `ceremony-registrar`. Approved premises must be a permanently immovable structure comprising at
 * least a room, so a marquee can never qualify and a Bower potentially can — the shoulder-season
 * case made in law rather than in adjectives. It varies by local authority and is not guessable, so
 * it is not written here. Draft enquiry: `docs/enquiries/2026-07-31-registrar-approved-premises.md`.
 *
 * FIGURES COME FROM `data/capacity.ts`. Both this page and `/questions` state the capacity and a
 * venue owner will have both open; the number has one owner and each page writes its own sentence.
 */
import { HEADS_IN_WORDS } from '../../data/capacity';
import { COMMISSION_STATEMENT, FEES_NOT_CREDITED, FOUNDING_SITE_STUDY_FEE, STAGE_2_FEE } from '../../ui/priceCopy';

/** A titled section of the page. `body` is paragraphs, in order. */
export interface HouseSection {
  /** Stable anchor id, so a letter can link straight at one section. */
  id: string;
  /** The heading, in the reader's language. */
  heading: string;
  body: readonly string[];
}

/** The frontispiece. The eyebrow names the audience; the title is the whole argument in one line. */
export const HOUSES_INTRO = {
  eyebrow: 'Houses that receive people',
  title: 'There is nothing else like it in England.',
  body: [
    'A Bower is not a marquee and does not pretend to be one. Canvas will still go up for a hundred and twenty at dinner, and it should.',
    `This is the other thing. A room of about ${HEADS_IN_WORDS.dining} in the garden, raised once and left standing: through the winter, through the years, better in its tenth than its first, because by the third the planting has closed over the frame and the garden has finished the architecture.`,
    'Houses like yours are chosen from photographs by people who have never visited. What they are choosing between is a dozen beautiful Georgian lawns. We build the thing that is on nobody else’s lawn.',
  ],
} as const;

export const HOUSE_SECTIONS: readonly HouseSection[] = [
  {
    id: 'holds',
    heading: 'What it holds',
    body: [
      `About ${HEADS_IN_WORDS.dining} to dinner. About ${HEADS_IN_WORDS.standing} standing. A small ceremony.`,
      'Which is the size of a house party rather than a wedding breakfast, and for a house let whole, to a group sleeping under its own roof, that is the room that does not currently exist in the garden.',
    ],
  },
  {
    id: 'weather',
    /**
     * THE RULING CHANGED, 2026-08-05 (Clay): a Bower CAN be made waterproof — it adds to the
     * engineering effort, and that is true. This supersedes the 2026-07-31 "the answer is no",
     * which held while waterproofing was an open product question. The DEFAULT is unchanged and
     * still said first: an open garden structure. What changed is that "must be dry" now has an
     * answer other than canvas, and it is priced in engineering rather than promised in adjectives.
     *
     * STILL PLACED SECOND ON THE PAGE, DIRECTLY AFTER WHAT IT HOLDS. This audience asks about rain
     * inside two minutes, and an answer they find themselves is worth far less than one you
     * volunteered. `houseRules.test.ts` still sweeps every page: the UNCONDITIONAL claim ("it is
     * waterproof") stays banned; the conditional one ("can be made waterproof") is now permitted.
     *
     * The last line is still the load-bearing one: the open Bower is not the fallback, it is the
     * point.
     */
    heading: 'Weather',
    body: [
      'A Bower is an open garden structure first: shade in summer, and a canopy that thickens as the planting matures.',
      'Where the room must be dry, it can be made waterproof. That adds engineering, so it is decided at the start and designed in from the first drawing.',
      'And an open Bower is not the lesser room. It is somewhere worth walking out to in the rain rather than sheltering from it.',
    ],
  },
  {
    id: 'winter',
    heading: 'The winter half of the year',
    body: [
      'Four months of the year the leaves are down and the timber comes back: the whole woven lattice bare, frost along the top of every lath. We plant for it deliberately, something evergreen threaded through, rose hips, clematis seedheads, the peeling bark of a honeysuckle.',
      'It stands through all of it. Nothing is struck, nothing goes into storage, and nothing is hired back in the spring.',
      'It is a room in November. That is the part a marquee cannot do at any price.',
    ],
  },
  // PENDING(ceremony-registrar): "Ceremonies" goes at the TOP of this page if it holds. Approved
  // premises must be a permanently immovable structure comprising at least a room, so a marquee can
  // never qualify and a Bower potentially can. It varies by local authority and needs a registrar's
  // confirmation, Isle of Wight first. See pending.ts.
  {
    id: 'season',
    heading: 'Building around a booked season',
    body: [
      'Three weeks on site, planned backwards from your calendar. No concrete, no digging, no lorry down the drive. The compound sits away from the house and the route in is matted.',
      'Ground screws wind out again, which is why conservation officers accept them and why a listed setting is a slower conversation rather than a harder one.',
    ],
  },
  {
    id: 'looking-after',
    heading: 'Looking after it',
    body: [
      'The first three years of pruning are not maintenance, they are the second half of the building work: the climbers tied in, trained along the lattice, pruned to hold the drawing.',
      'If you have grounds staff we would rather teach them and hand it across; they are there every day and we are not. Either way you get a pruning calendar, notes on every plant, and an inspection once a year.',
    ],
  },
  // PENDING(level-access): "Access" belongs here. The drafted line is a complete sentence that has
  // not been verified, which is the dangerous kind of pending: it reads as finished. Every house
  // gets asked this weekly, and the building-regulations answer on /questions now names level
  // access as part of the design where the public will use it, so the two have to agree.
  {
    id: 'cost',
    heading: 'What it costs',
    body: [
      ...COMMISSION_STATEMENT,
      `The six-week Founding Site Study is ${FOUNDING_SITE_STUDY_FEE} plus approved expenses. Planning, design and engineering are appointed separately, and are typically ${STAGE_2_FEE} including VAT once their scope is defined.`,
      FEES_NOT_CREDITED,
    ],
  },
];

/** The one door off this page, to the answers in full. */
export const HOUSES_CLOSE = {
  href: '/questions',
  label: 'Full detail on the questions page',
} as const;
