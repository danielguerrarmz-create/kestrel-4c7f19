/**
 * pending.ts — every fact the VENUE REWRITE is waiting on, in one place, with the sentence each
 * one unblocks written out and NOT published.
 *
 * WHY THIS FILE EXISTS (2026-07-31). The hospitality repoint arrived as a spec with `[CLAY: ...]`
 * holes in it: the glazed crown's weather specification, a registrar's answer on civil ceremonies,
 * a company number, a UK phone line. Its first ground rule is "do not invent facts... leave it as a
 * visible placeholder and flag it. Do not fill it with a plausible guess." That rule is right and it
 * needs somewhere to live, because the two obvious ways of honouring it both fail:
 *
 *   - RENDERING `[CLAY: ...]` ON THE PAGE means the marker is one merge away from a venue owner
 *     reading it, and it splits the site in two: a dev page and a production page with different
 *     sentences on them. This repo already knows what that costs. `/questions` is not just a page —
 *     `seo.ts` builds its FAQPage structured data from the same `QUESTIONS` array and
 *     `agent/mirror.ts` renders the markdown mirror from the same components. A sentence that exists
 *     in dev and not in production means the schema, the mirror and the page can all disagree while
 *     every test stays green. **One fact, one owner**, and a fact with two renderings has none.
 *   - SIMPLY OMITTING the copy is safe and forgets. A gap in prose leaves no trace, and the thing
 *     that is missing is exactly the thing nobody is reminded to go and get.
 *
 * So the copy is omitted from the site and the DRAFT lives here, next to the question that has to
 * be answered before it can ship. This module is imported by nothing that renders. It is a list of
 * debts, and `pending.test.ts` keeps it honest at both ends: every published surface is swept for a
 * placeholder marker, and this registry is checked for the shape that makes it readable.
 *
 * TWO ENTRIES WERE DELETED ON THE DAY THEY WERE WRITTEN, and the reason is worth keeping, because
 * it is the difference between a gap and a mistake. The first version of this registry carried a
 * `house-piece-capacity` entry (a marquee-scale tier, with seated and standing figures to be filled
 * in) and a `marquee-hire-cost` entry (a per-event comparison figure). The revised spec WITHDREW
 * both: Bower cannot currently engineer or price a structure at marquee scale and has built nothing,
 * so quoting capacity for it is not a blank waiting on a number, it is a claim waiting to be
 * falsified by the first technically literate buyer who asks. **A placeholder is not automatically a
 * fact you are entitled to publish once you have the number.** Some blanks should never be filled;
 * they should be deleted, and the claim withdrawn. See `data/capacity.ts` for the guard that now
 * pins the marquee-replacement claim ABSENT across the whole site.
 *
 * WHEN AN ENTRY IS ANSWERED: write the real sentence into the page's own copy module, delete the
 * entry here, and regenerate the mirrors. When the array is empty, delete this file — a registry of
 * nothing is a comment with extra steps, and this repo has a tombstone rule about exactly that.
 *
 * THE ONE THING THIS FILE MUST NEVER BECOME is a second copy of the site's prose. `draft` is a
 * sentence that has never been published and cannot drift from a published one, because there is
 * nothing to drift from. The moment a draft goes live it leaves this file in the same commit.
 */

/**
 * WHAT KIND OF WAITING THIS IS, and the distinction is not bookkeeping — it changes who unblocks it
 * and what "done" looks like. `pending.test.ts` caught the difference on its first run, on the level
 * access entry, whose draft is a COMPLETE sentence with no blank in it:
 *
 *   - `value`        a blank awaiting a number or a string. The draft shows the blank.
 *   - `confirmation` a finished sentence that may be FALSE. Nothing to fill in; someone has to
 *                    verify it. This is the dangerous kind, because the copy is ready to paste and
 *                    reads as done. Level access and the registrar's answer are both here.
 *   - `decision`     nothing to find out. Someone has to choose, and either choice is defensible.
 *   - `asset`        a file that does not exist yet.
 */
export type Awaiting = 'value' | 'confirmation' | 'decision' | 'asset';

/** One fact the site is waiting on, and what it is costing while it waits. */
export interface PendingFact {
  /** Stable slug, referenced from a `// PENDING(id)` comment at the site of the gap. */
  id: string;
  /** Priority item in the venue spec of 2026-07-31, so the two documents can be read together. */
  item: number;
  /** See `Awaiting`: a blank, an unverified claim, a choice, or a missing file. */
  awaiting: Awaiting;
  /** The question to answer, phrased so it can be asked of a person or a supplier as written. */
  needs: string;
  /** What stays off the site until it lands, in the reader's terms rather than the repo's. */
  blocks: string;
  /**
   * The copy it unblocks, drafted. Never rendered anywhere: this is the thing to paste into the
   * page's own copy module once the fact exists, so answering the question is a five-minute job
   * and not a re-write.
   *
   * A `value` draft MUST carry its `[CLAY: ...]` gap, and the test enforces it — a fill-in-the-blank
   * with no visible blank is a finished-looking sentence one paste away from publishing a hole.
   * A `confirmation` draft is complete by nature: what is missing is not a word, it is the evidence.
   */
  draft?: string;
}

/**
 * OUTSTANDING, ordered by what each one costs today rather than by spec item number.
 *
 * The first two are the loudest: a US mobile and a Gmail address sit on the page that names
 * £350,000, and the spec is blunt that they are "what a commercial buyer's solicitor notices
 * first". Neither can be invented here — a phone number is not a judgement call, it is a fact only
 * Clay has.
 */
export const PENDING: readonly PendingFact[] = [
  {
    id: 'contact-uk-phone',
    item: 3,
    awaiting: 'value',
    needs: 'A UK telephone number for the studio, in printed form and in E.164 form for the tel: link.',
    blocks:
      'CONTACT.phone in data/config.ts, and with it the /questions close, the FAQPage schema, the Organization schema and the agent mirror. All four read the one constant, so the swap is a single line.',
  },
  {
    id: 'contact-form-provider',
    item: 3,
    awaiting: 'confirmation',
    needs:
      'A Resend account with bowerbuild.org verified (three DNS records: DKIM, SPF, return-path CNAME), then RESEND_API_KEY set as a Production environment variable in Vercel. NOT in .env, which is tracked in this public repo.',
    blocks:
      'Nothing visible, and that is the point: `api/contact.ts` is deployed and answers 503 not-configured until the key exists, so the register-interest form keeps showing the direct contact route instead of promising a reply. The moment the key lands the form starts mailing info@bowerbuild.org and the confirmation becomes "we will be in touch". Verify with GET /api/contact, which reports readiness without sending anything into the inbox a real client writes to.',
  },
  {
    id: 'weather-glazed-crown',
    item: 6,
    awaiting: 'confirmation',
    needs:
      'Four answers about the glazed crown: does it shed water fully, what proportion of the crown is glazed, what happens to the rest, and what wind loading the structure is designed to.',
    blocks:
      'The "Weather" section of /houses, and any answer to rain anywhere on the site. The spec ranks this the hardest objection in the segment and the one every venue owner raises inside two minutes, because a marquee is waterproof and that is the entire reason it gets hired. The gallery already shows a glazed crown (item 03) and a stained glass walk (item 04) and treats both as aesthetic options; nothing connects either to shelter. The section is scaffolded on the page and renders nothing until this lands.',
  },
  {
    id: 'ceremony-registrar',
    item: 5,
    awaiting: 'confirmation',
    needs:
      'A registrar\'s confirmation, Isle of Wight first given Northcourt, that a permanent garden structure can be approved premises in its own right, and whether that local authority restricts linked outdoor areas to British Summer Time.',
    blocks:
      'The "Ceremonies" section of /houses, which the spec says goes at the TOP of the page if it holds. Potentially the strongest single argument available: approved premises must be a permanently immovable structure comprising at least a room, so a marquee can never qualify and a Bower potentially can, which makes the shoulder-season case in law rather than in adjectives. It varies by local authority, so it is unpublishable until one confirms it.',
  },
  /*
   * `level-access` REMOVED 2026-07-31 (Clay: "don't include the phrase level access"), and the
   * phrase came out of the /questions building-regulations answer with it, where the spec's draft
   * had listed it beside occupancy and escape.
   *
   * This is the right call and worth recording as a pattern rather than a deletion. The drafted
   * sentence — "Level throughout, no threshold, no step." — was a `confirmation`, the dangerous
   * kind: complete prose, ready to paste, and possibly false. On a ground-screw foundation over a
   * lawn that is not itself level, step-free access is something you engineer and pay for, not
   * something the system gives you. **Not claiming it costs nothing today; claiming it and being
   * wrong is discovered by a wheelchair user on the day of an event.**
   *
   * If it later becomes a design commitment it can be published, with the drawing behind it. Note
   * the spec's image list still wants "level access with a wheelchair in frame" — an image makes
   * the same promise a sentence does, so that render waits on the same decision.
   */
  {
    id: 'practice-entity',
    item: 8,
    awaiting: 'value',
    needs:
      'Company name and registration number in England and Wales, registered office, VAT number, professional indemnity and public liability insurers, structural engineer, fabricator.',
    blocks:
      'The "The practice" block on /about and the company details in the footer, both scaffolded and both rendering nothing. This is the solicitor\'s question and the site is currently silent on it. Note that the building-regulations answer now commits Bower to specifying for public loading from the outset, so the engineer is not merely a company-details line: it is the substance behind a published claim, and the spec warns that line becomes a liability rather than an asset if August passes without it.',
    draft:
      '[CLAY: company name], registered in England and Wales, no. [CLAY: number]. Professional indemnity and public liability held with [CLAY: insurer]. Structural engineering by [CLAY: engineer]. Fabrication by [CLAY: fabricator].',
  },
  {
    id: 'practice-interim-line',
    item: 8,
    awaiting: 'decision',
    needs:
      'A decision, not a fact: whether to publish the interim honesty line while the appointments are outstanding. The spec calls it a real risk either way, which is why it is Clay\'s call and not a default.',
    blocks:
      'Nothing structural. The block is built and gated off, so publishing it is a one-line change. Against: it is a written, public, quotable statement that no insurance, engineer or fabricator is yet appointed, on a site asking for six-figure commitments. For: silence is what a buyer\'s solicitor notices, and candour has already earned trust in this correspondence.',
    draft:
      'Bower is a young practice and says so plainly. Insurance, engineering and fabrication partners are being appointed this autumn ahead of the first commissions; we would rather tell you that than have you find out.',
  },
  {
    id: 'houses-og-card',
    item: 7,
    awaiting: 'asset',
    needs:
      'A 1200x630 JPEG sharing card for /houses. The spec\'s image list ranks a full house (a hundred people under the structure, long tables, low evening light) as the single most important missing image on the site.',
    blocks:
      'A distinct link card for /houses. Until it exists the page unfurls with the site-wide wisteria walk, which is a good photograph of an EMPTY structure and therefore precisely the wrong argument for this audience. Note that a crawler which does not run JavaScript reads only index.html\'s static head, so a per-route card needs the prerendering work in docs/handoffs/2026-07-28-routes-and-social-cards.md before it reaches an unfurler at all.',
  },
  {
    id: 'bowerbuild-com',
    item: 7,
    awaiting: 'confirmation',
    needs:
      'Find out who owns bowerbuild.com and whether they will sell. It is NOT ours (confirmed by Clay 2026-07-31, correcting the spec, which implied otherwise). A broker enquiry, or WHOIS then a direct approach.',
    blocks:
      'Nothing on the site, and nothing in this repo should ever assume the .com is available: a redirect configured for a domain someone else controls is a link to a stranger. Worth acquiring because venue owners will typo it, and a parked page or an unrelated business on the .com costs a letter that has already been read.',
  },
];
