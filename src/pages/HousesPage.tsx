/**
 * HousesPage.tsx — `/houses`, the page addressed to a business rather than to a garden.
 *
 * THE SETTING BORROWS `/questions`, ON PURPOSE. Same vellum, same serif, same single column, same
 * hairline rule between sections, same olive numerals. These are the two pages a commercial reader
 * will have open at once, and a different visual register on each would read as two practices. The
 * home and the gallery do the seducing; these two answer.
 *
 * The one departure is the frontispiece: this page opens with a CLAIM rather than a label, because
 * unlike the questions page it has to earn a reader who did not come looking. Content and the
 * reasoning behind every sentence live in `houses/copy.ts`; this file is only the setting.
 *
 * TWO SECTIONS ARE ABSENT AND THEIR ABSENCE IS THE POINT — weather and ceremonies, both blocked on
 * facts nobody in this repo has (see `pending.ts`). They are marked with `PENDING(...)` comments in
 * the copy module at the position they belong, so the next person to open it finds the gap where
 * the section goes rather than discovering later that the page never had one.
 */
import { SplashHeader } from './splash/SplashHeader';
import { Footer } from '../ui/Footer';
import { HOUSES_INTRO, HOUSE_SECTIONS, HOUSES_CLOSE } from './houses/copy';

/** The shared reading column, matched to `/questions` so the two pages set the same measure. */
const COLUMN = 'mx-auto w-full max-w-[64ch]';

/** One titled section: a serif heading with its olive numeral, then its paragraphs. */
function Section({ n, heading, id, body }: { n: number; heading: string; id: string; body: readonly string[] }) {
  return (
    <section className="border-t border-inkBlack/[0.10] pt-10 first:border-t-0 first:pt-0 sm:pt-14">
      <h2
        id={id}
        className="flex items-baseline gap-4 font-serifDisplay text-[clamp(1.4rem,2.6vw,1.9rem)] font-semibold leading-[1.2] tracking-[-0.01em]"
      >
        <span className="font-serifDisplay text-[15px] font-normal italic text-accentOlive">{n}</span>
        <span>{heading}</span>
      </h2>
      <div className="mt-5 flex flex-col gap-5">
        {body.map((para) => (
          <p key={para.slice(0, 40)} className="font-serifDisplay text-[19px] leading-[1.6]">
            {para}
          </p>
        ))}
      </div>
    </section>
  );
}

export function HousesPage() {
  return (
    <div className="min-h-screen w-full bg-paperVellum text-inkBlack">
      <SplashHeader transparent logoPill />

      <main className="px-gutter pb-20 pt-[calc(var(--header-h)+3rem)]">
        <header className={`${COLUMN} mb-14 sm:mb-20`}>
          <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-inkBlack/40">
            {HOUSES_INTRO.eyebrow}
          </p>
          <h1 className="mt-5 font-serifDisplay text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.01em] [text-wrap:balance]">
            {HOUSES_INTRO.title}
          </h1>
          {/* The opening three paragraphs sit at a step above body size: this is the argument, and
              a reader who bounces off it never reaches the sections. */}
          <div className="mt-7 flex flex-col gap-5">
            {HOUSES_INTRO.body.map((para) => (
              <p
                key={para.slice(0, 40)}
                className="font-serifDisplay text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.55]"
              >
                {para}
              </p>
            ))}
          </div>
        </header>

        <div className={`${COLUMN} flex flex-col gap-10 sm:gap-14`}>
          {HOUSE_SECTIONS.map((s, i) => (
            <Section key={s.id} n={i + 1} id={s.id} heading={s.heading} body={s.body} />
          ))}

          {/* The one door off the page. A real anchor, so it is crawlable and openable in a new
              tab, and the router upgrades the click. */}
          <p className="border-t border-inkBlack/[0.10] pt-10 font-serifDisplay text-[19px] leading-[1.6] sm:pt-14">
            <a
              href={HOUSES_CLOSE.href}
              className="group inline-flex w-fit items-center text-inkBlack [@media(pointer:coarse)]:min-h-[44px]"
            >
              <span className="relative">
                {HOUSES_CLOSE.label}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px bg-inkBlack/25 transition-colors duration-200 group-hover:bg-inkBlack"
                />
              </span>
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
