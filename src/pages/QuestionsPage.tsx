/**
 * QuestionsPage.tsx — `/questions`, the page that answers what the other three don't.
 *
 * The live site could tell you what a bower is and show you seven renderings of one, and could
 * not tell you the price, the country, the planning position, what it does to a lawn, how long it
 * takes, or who to ring. This is that page. Content and the reasoning behind its register live in
 * `questions/copy.ts`; this file is only the setting.
 *
 * THE SETTING IS DELIBERATELY THE QUIETEST ON THE SITE. No scrim, no full-bleed photograph, no
 * scroll choreography, one column. The home and the gallery do the seducing; by the time someone
 * is here they have a specific worry and want it answered, and every gesture between them and the
 * answer is a cost. So: the page's own serif, a hairline rule between questions, and roughly
 * double the air the type needs. The one flourish is the question numerals, borrowed from the
 * home's ritual list (serif italic in the olive accent) so this reads as the same publication.
 *
 * NO IN-PAGE ANCHOR INDEX, AND THE REASON CHANGED ON 2026-07-28. It used to be a HARD constraint:
 * the hash router read `#cost` as the unknown route `/cost` and fell through to the SPLASH, so an
 * index of anchor links would have navigated the reader off this page one question at a time. The
 * path router removed that: a fragment is now just a fragment, the `id`s below already exist, and
 * `href="#cost"` would work. So it is a DESIGN choice now, not a technical one — seven headed
 * sections in one column scan fine without an index. Add one if a reader ever gets lost; nothing
 * in the routing stops you.
 *
 * The `id`s are load-bearing anyway: `seo.ts` builds the page's FAQPage structured data from the
 * same `QUESTIONS` array, so each answer is addressable to an answer engine whether or not the
 * page ever prints a link to it.
 *
 * Type sizes run a step larger than the rest of the site on purpose. The reader this page was
 * written for is not twenty-five, and the site's 11px mono captions are already at the edge.
 */
import { SplashHeader } from './splash/SplashHeader';
import { Footer } from '../ui/Footer';
import { QUESTIONS, RING, INTRO } from './questions/copy';
import { CONTACT } from '../data/config';

/** The shared reading column. Narrower than the canvas so the measure stays readable. */
const COLUMN = 'mx-auto w-full max-w-[64ch]';

/** One answered question: a serif heading, its paragraphs, and an optional ruled schedule. */
function Question({ n, item }: { n: number; item: (typeof QUESTIONS)[number] }) {
  return (
    <section className="border-t border-inkBlack/[0.10] pt-10 first:border-t-0 first:pt-0 sm:pt-14">
      <h2
        id={item.id}
        className="flex items-baseline gap-4 font-serifDisplay text-[clamp(1.4rem,2.6vw,1.9rem)] font-semibold leading-[1.2] tracking-[-0.01em]"
      >
        <span className="font-serifDisplay text-[15px] font-normal italic text-accentOlive">
          {n}
        </span>
        <span>{item.q}</span>
      </h2>

      <div className="mt-5 flex flex-col gap-5">
        {item.a.map((para) => (
          <p key={para.slice(0, 40)} className="font-serifDisplay text-[19px] leading-[1.6]">
            {para}
          </p>
        ))}
      </div>

      {/* THE SCHEDULE AS A DESCRIPTION LIST, not a <table>. Two reasons: stage-to-duration IS a
          description list semantically, and the mirror's converter treats dl/dt/dd as blocks
          while td/th are not in its BLOCK set, so a table would collapse every row into one
          run-on line for non-JavaScript readers. */}
      {/* Each row stacks on a phone and sits side by side from `sm`. NOT `flex-wrap`: with
          wrapping, the two longest rows ("Foundations and raising it", "Planting") broke to a
          second line while the five short ones stayed inline, so the schedule read as five tidy
          rows and two broken ones rather than as one consistent list. */}
      {item.rows && (
        <dl className="mt-8 border-t border-inkBlack/[0.10]">
          {item.rows.map((r) => (
            <div
              key={r.stage}
              className="flex flex-col gap-y-0.5 border-b border-inkBlack/[0.10] py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-8"
            >
              <dt className="font-serifDisplay text-[17px]">{r.stage}</dt>
              <dd className="font-serifDisplay text-[17px] italic text-inkBlack/55">{r.span}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

export function QuestionsPage() {
  return (
    <div className="min-h-screen w-full bg-paperVellum text-inkBlack">
      <SplashHeader transparent logoPill />

      <main className={`px-gutter pb-20 pt-[calc(var(--header-h)+3rem)]`}>
        <header className={`${COLUMN} mb-14 sm:mb-20`}>
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-inkBlack/40">
            {INTRO.eyebrow}
          </p>
          <h1 className="mt-5 font-serifDisplay text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.01em] [text-wrap:balance]">
            {INTRO.title}
          </h1>
          <p className="mt-5 font-serifDisplay text-[clamp(1.05rem,1.6vw,1.3rem)] italic leading-[1.5] text-inkBlack/60">
            {INTRO.standfirst}
          </p>
        </header>

        <div className={`${COLUMN} flex flex-col gap-10 sm:gap-14`}>
          {QUESTIONS.map((item, i) => (
            <Question key={item.id} n={i + 1} item={item} />
          ))}

          {/* THE CLOSE. Same rule and rhythm as a question, because it IS one: the reader has
              been asking things for a page and this is the last of them. The details are real
              links (tel:, mailto:) so a phone dials and a desktop opens a compose window. */}
          <section className="border-t border-inkBlack/[0.10] pt-10 sm:pt-14">
            <h2
              id="ring"
              className="flex items-baseline gap-4 font-serifDisplay text-[clamp(1.4rem,2.6vw,1.9rem)] font-semibold leading-[1.2] tracking-[-0.01em]"
            >
              <span className="font-serifDisplay text-[15px] font-normal italic text-accentOlive">
                {QUESTIONS.length + 1}
              </span>
              <span>{RING.q}</span>
            </h2>

            <p className="mt-6 font-serifDisplay text-[21px] leading-[1.5]">{CONTACT.name}</p>
            <p className="mt-2 flex flex-col gap-1 font-serifDisplay text-[19px] leading-[1.5] sm:flex-row sm:gap-6">
              <a
                href={`tel:${CONTACT.phoneHref}`}
                className="group inline-flex w-fit items-center text-inkBlack [@media(pointer:coarse)]:min-h-[44px]"
              >
                <span className="relative">
                  {CONTACT.phone}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-100 bg-inkBlack/25 transition-colors duration-200 group-hover:bg-inkBlack"
                  />
                </span>
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="group inline-flex w-fit items-center text-inkBlack [@media(pointer:coarse)]:min-h-[44px]"
              >
                <span className="relative">
                  {CONTACT.email}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-100 bg-inkBlack/25 transition-colors duration-200 group-hover:bg-inkBlack"
                  />
                </span>
              </a>
            </p>

            <div className="mt-8 flex flex-col gap-5">
              <p className="font-serifDisplay text-[19px] leading-[1.6]">{RING.first}</p>
              <p className="font-serifDisplay text-[19px] leading-[1.6]">{RING.study}</p>
              <p className="font-serifDisplay text-[19px] leading-[1.6]">{RING.next}</p>
              <p className="font-serifDisplay text-[19px] leading-[1.6]">{RING.notCredited}</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
