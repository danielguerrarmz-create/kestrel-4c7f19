/**
 * AboutPage.tsx — `/about`. The short one.
 *
 * THE COPY IS CLAY'S FINAL VERSION OF 2026-08-04 (`about/aboutCopy.ts`, which carries the full
 * provenance: prose manifesto -> pitch poem -> this, three versions in one day, all his). The
 * page keeps the discipline every version has had: no scroll choreography, no ornament, no
 * photograph. One column, the wordmark at reading size, five paragraphs, a plain-type coda
 * naming the founders, and one door onward at the bottom.
 *
 * THE INK IS `inkForest`, NOT `inkBlack` — Clay's instruction from the poem round ("a deep deep
 * green, instead of the black"), kept through the final version and scoped to THIS page only,
 * the same way the old timeline's sepia law was scoped to it.
 *
 * NO HEADINGS beyond the wordmark: the whole page is under 150 words and a reader sees it at
 * once. `<h1>` is the wordmark, which is also what the document is about, so the outline stays
 * honest for a screen reader and for the markdown mirror.
 */
import { SplashHeader } from './splash/SplashHeader';
import { Footer } from '../ui/Footer';
import { ABOUT_CODA, ABOUT_LINK, ABOUT_PARAGRAPHS } from './about/aboutCopy';
import { WORDMARK } from '../data/config';

/** Narrower than `/questions`' 64ch. This is prose to be read, not answers to be scanned. */
const COLUMN = 'mx-auto w-full max-w-[58ch]';

export function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-paperVellum text-inkForest">
      <SplashHeader transparent logoPill />

      <main className={`${COLUMN} px-gutter pb-24 pt-[calc(var(--header-h)+5rem)]`}>
        {/* The name, at reading weight. Not the home's viewport-wide monument: that gesture belongs
            to the front door and stays unique to it. */}
        <h1 className="font-serifDisplay text-[clamp(1.75rem,3.2vw,2.4rem)] font-medium leading-none tracking-[-0.01em]">
          {WORDMARK}
        </h1>

        {/* The paragraphs, set one step above body size and left otherwise alone. The short
            second one ("None of them finished. All of them alive.") gets no special treatment:
            its length against its neighbours IS the emphasis. */}
        <div className="mt-12 flex flex-col gap-7">
          {ABOUT_PARAGRAPHS.map((para) => (
            <p
              key={para.slice(0, 40)}
              className="font-serifDisplay text-[clamp(1.05rem,1.55vw,1.28rem)] leading-[1.62]"
            >
              {para}
            </p>
          ))}
        </div>

        {/* THE CODA, in plain type below — smaller and slightly subdued, so the register change
            reads as a signature rather than another paragraph. */}
        <p className="mt-14 font-serifDisplay text-[17px] leading-[1.6] text-inkForest/80">
          {ABOUT_CODA}
        </p>

        {/* The one door onward. Quiet, below the coda, so the page ends on its own last words
            rather than on a call to action. */}
        <p className="mt-20 border-t border-inkForest/[0.18] pt-8">
          <a
            href={ABOUT_LINK.href}
            className="group inline-flex items-baseline gap-1.5 font-serifDisplay text-[17px] text-inkForest [@media(pointer:coarse)]:min-h-[44px]"
          >
            <span className="relative">
              {ABOUT_LINK.label}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-inkForest transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
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
