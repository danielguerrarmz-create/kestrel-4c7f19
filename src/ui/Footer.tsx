/**
 * Footer.tsx — the small, quiet footer every standalone page wears.
 *
 * NOT the home page's monument (the viewport-wide lowercase "bower" that closes the splash). This is
 * its documentation-layer cousin: the Oculus mark, the wordmark in mono, a thin rule, the ways in,
 * and a year. Understated on purpose — it closes a page without competing with its content. The
 * home keeps its monument and suppresses this one (see the pages), so the big gesture stays unique.
 *
 * IT DELIBERATELY DOES NOT USE `BowerMark`: that component carries the single `[data-wordmark]` span
 * the one-time BowerIntro flies its lockup onto, and there must be exactly one on a page. The footer
 * draws its own mark + name so it never mints a second wordmark target.
 */
import { OculusMark } from './OculusMark';
import { WORDMARK } from '../data/config';
import { routes } from '../routing';
import type { Measure } from './Frame';

/**
 * The registered-company details, or `null` while there is no company to name.
 *
 * NOT four empty strings: an empty string still renders its separator and its wrapper, so the
 * footer would carry a row of stray gaps that reads as a rendering bug rather than as an absence.
 * `null` renders nothing at all, and the `COMPANY &&` guard at the call site is the whole switch.
 *
 * Fill this in when incorporation completes — `pending.ts`, `practice-entity`, which also carries
 * the professional indemnity, public liability, engineer and fabricator the same solicitor asks
 * about. This is the ONE place; the About page's "The practice" block reads the same constant.
 */
export const COMPANY: {
  name: string;
  number: string;
  registeredOffice: string;
  vat: string;
} | null = null;

/** `measure` matches the page it closes (the engine walkthrough is the narrower 'page' spread; the
 *  about page and home are 'canvas'), so the footer's edges line up with the content above it. */
export function Footer({ measure = 'canvas' }: { measure?: Measure }) {
  const year = new Date().getFullYear();
  const width = measure === 'page' ? 'max-w-page' : measure === 'read' ? 'max-w-read' : 'max-w-canvas';
  return (
    <footer className={`mx-auto flex w-full ${width} flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-inkBlack/15 px-gutter py-8 text-inkBlack`}>
      {/* ONE PLAIN ROW, and it stays that way. An earlier pass on 2026-07-31 grew a whole practice
          block here — both founders, both addresses, a labelled door — on the reasoning that a
          solicitor scans a footer for who carries the liability. Clay's correction was that the
          footer stays plain and a SHORT ABOUT PAGE carries that job, with the founders' page nested
          behind it. The reason is worth keeping: a footer that grows a section is a footer competing
          with the page above it, and this one closes six different pages. The names and addresses
          live on `/about/practice`, which is where someone asking "who are you" has already
          arrived. */}
      <a
        href={routes.home}
        aria-label="Bower, home"
        className="inline-flex items-center gap-1.5 transition-opacity duration-150 hover:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-inkBlack"
      >
        <OculusMark size={18} />
        <span className="font-mono text-[14px] lowercase tracking-[0.1em]">{WORDMARK}</span>
      </a>
      {/* Coarse-pointer devices get a 44px tap height on each footer link (they render ~17px tall);
          gated so the desktop footer's density is unchanged.
          "how it works" (`/engine`) and "studio" were removed on 2026-07-21 with the rest of the
          engine's public surface; only routes that ship to production may be linked here. */}
      {/* 13px, not 11 (2026-07-28). Uppercase mono at 0.14em tracking is the least legible
          register on the site and it was set two steps below the body; this page's readers are
          not all twenty-five. Same for the gallery's plate captions. */}
      <nav aria-label="Footer" className="flex flex-wrap items-center gap-5 font-mono text-[13px] uppercase tracking-[0.14em] text-inkBlack/55">
        <a href={routes.commissions} className="inline-flex items-center justify-center transition-colors duration-150 hover:text-inkBlack [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:min-w-[44px]">commissions</a>
        <a href={routes.gallery} className="inline-flex items-center justify-center transition-colors duration-150 hover:text-inkBlack [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:min-w-[44px]">gallery</a>
        <a href={routes.process} className="inline-flex items-center justify-center transition-colors duration-150 hover:text-inkBlack [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:min-w-[44px]">process</a>
        {/* "about" is here and NOT in the header (2026-07-31). It points at the short page, which
            carries the door to the founders' page in turn. The header is the reader's order of
            interest and "who are you" is last; the footer is where it is looked for. */}
        <a href={routes.about} className="inline-flex items-center justify-center transition-colors duration-150 hover:text-inkBlack [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:min-w-[44px]">about</a>
        <a href={routes.contact} className="inline-flex items-center justify-center transition-colors duration-150 hover:text-inkBlack [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:min-w-[44px]">contact</a>
        <a href={routes.press} className="inline-flex items-center justify-center transition-colors duration-150 hover:text-inkBlack [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:min-w-[44px]">press</a>
        <a href={routes.questions} className="inline-flex items-center justify-center transition-colors duration-150 hover:text-inkBlack [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:min-w-[44px]">questions</a>
      </nav>
      {/* THE COMPANY LINE. Stubbed 2026-07-31 and rendering the copyright alone until
          incorporation completes — see `pending.ts`, `practice-entity`.

          A commercial buyer's solicitor looks for a company number, a registered office and a VAT
          number, and finds none anywhere on this site. The markup is here so that landing them is a
          data change rather than a layout change; `COMPANY` is deliberately `null` rather than a
          set of empty strings, because an empty string renders as a stray separator and reads as a
          bug, whereas an absent block reads as a footer. */}
      <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-inkBlack/40">
        <a
          href={routes.home}
          aria-label={`© ${year} Bower, home`}
          className="transition-colors duration-150 hover:text-inkBlack focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-inkBlack"
        >
          © {year} Bower
        </a>
        {COMPANY && (
          <>
            <span>{COMPANY.name}</span>
            <span>Registered in England and Wales no. {COMPANY.number}</span>
            <span>{COMPANY.registeredOffice}</span>
            <span>VAT {COMPANY.vat}</span>
          </>
        )}
      </span>
    </footer>
  );
}
