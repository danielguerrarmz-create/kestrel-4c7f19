/**
 * AboutPage.tsx — `/about`. The short one.
 *
 * THE BRIEF WAS THREE WORDS: "very simple, very plain, very elegant" (Clay, 2026-07-31). So this is
 * the least engineered page in the repo, and deliberately: no scroll choreography, no generative
 * ornament, no photograph, no measured camera. One column of prose on vellum. The founders' page
 * that used to live at this URL is nested behind it at `/about/practice` as the expanded version.
 *
 * WHAT "ELEGANT" IS BUYING HERE, since it is the only instruction and everything else follows from
 * it: the page has exactly three moves, and every one of them is spacing rather than decoration.
 *   1. The wordmark alone at the top, at reading size rather than as a monument. This page is not
 *      an entrance, so it does not announce.
 *   2. The opening set one step above body size. It is the argument, and it is three paragraphs
 *      long; anything smaller and a reader skims to the creed and misses why it is there.
 *   3. The creed given a rule above it and real air between lines. Set as a paragraph the
 *      repetition of "We believe" reads as padding; set as lines it reads as what it is.
 *
 * NO HEADINGS. There is nothing to navigate: it is under three hundred words, and a heading would
 * be the page telling a reader who can see the whole thing at once how to get around it. `<h1>` is
 * the wordmark, which is also what the document is about, so the outline stays honest for a screen
 * reader and for the markdown mirror.
 */
import { SplashHeader } from './splash/SplashHeader';
import { Footer } from '../ui/Footer';
import {
  MANIFESTO_CLOSE,
  MANIFESTO_CREED,
  MANIFESTO_LINK,
  MANIFESTO_OPENING,
} from './about/manifesto';
import { WORDMARK } from '../data/config';

/** Narrower than `/questions`' 64ch. This is prose to be read, not answers to be scanned. */
const COLUMN = 'mx-auto w-full max-w-[58ch]';

export function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-paperVellum text-inkBlack">
      <SplashHeader transparent logoPill />

      <main className={`${COLUMN} px-gutter pb-24 pt-[calc(var(--header-h)+5rem)]`}>
        {/* The name, at reading weight. Not the home's viewport-wide monument: that gesture belongs
            to the front door and stays unique to it. */}
        <h1 className="font-serifDisplay text-[clamp(1.75rem,3.2vw,2.4rem)] font-medium leading-none tracking-[-0.01em]">
          {WORDMARK}
        </h1>

        <div className="mt-12 flex flex-col gap-7">
          {MANIFESTO_OPENING.map((para) => (
            <p
              key={para.slice(0, 40)}
              className="font-serifDisplay text-[clamp(1.05rem,1.55vw,1.28rem)] leading-[1.62]"
            >
              {para}
            </p>
          ))}
        </div>

        {/* THE CREED. A hairline rule and generous air, then one line each. `text-balance` keeps a
            wrapped line from leaving a single orphaned word, which on lines this short is the
            difference between a creed and a list. */}
        <ul className="mt-14 flex flex-col gap-3.5 border-t border-inkBlack/[0.12] pt-14">
          {MANIFESTO_CREED.map((line) => (
            <li
              key={line}
              className="font-serifDisplay text-[clamp(1.05rem,1.55vw,1.28rem)] leading-[1.5] [text-wrap:balance]"
            >
              {line}
            </li>
          ))}
        </ul>

        <p className="mt-14 font-serifDisplay text-[clamp(1.3rem,2.4vw,1.75rem)] italic leading-snug">
          {MANIFESTO_CLOSE}
        </p>

        {/* The one door onward. Quiet, and a long way below the close, so the page ends on its own
            last line rather than on a call to action. */}
        <p className="mt-20 border-t border-inkBlack/[0.12] pt-8">
          <a
            href={MANIFESTO_LINK.href}
            className="group inline-flex items-baseline gap-1.5 font-serifDisplay text-[17px] text-inkBlack [@media(pointer:coarse)]:min-h-[44px]"
          >
            <span className="relative">
              {MANIFESTO_LINK.label}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-inkBlack transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
              />
            </span>
            <span
              aria-hidden
              className="text-accentOlive transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </p>
      </main>

      <Footer />
    </div>
  );
}
