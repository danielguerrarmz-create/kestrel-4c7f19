/**
 * Footer.tsx — the small, quiet footer every standalone page wears.
 *
 * NOT the home page's monument (the viewport-wide lowercase "bower" that closes the splash). This is
 * its documentation-layer cousin: the Oculus mark, the ways in and the global copyright.
 * Understated on purpose — it closes a page without competing with its content. The
 * home keeps its monument and suppresses this one (see the pages), so the big gesture stays unique.
 *
 * IT DELIBERATELY DOES NOT USE `BowerMark`: that component carries the single `[data-wordmark]` span
 * the one-time BowerIntro flies its lockup onto, and there must be exactly one on a page. The footer
 * draws its own mark + name so it never mints a second wordmark target.
 */
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
    <footer className={`site-footer mx-auto w-full ${width} snap-end items-center gap-x-8 gap-y-4 px-gutter py-8 text-inkBlack`}>
      <a
        href={routes.home}
        aria-label="Bower, home"
        className="site-footer-logo inline-flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-inkBlack"
      >
        <img src="/assets/brand/bower-logo-evergreen-horizontal-transparent.png" width="112" height="28" alt="Bower" />
      </a>
      {/* Coarse-pointer devices get a 44px tap height on each footer link (they render ~17px tall);
          gated so the desktop footer's density is unchanged.
          "how it works" (`/engine`) and "studio" were removed on 2026-07-21 with the rest of the
          engine's public surface; only routes that ship to production may be linked here. */}
      {/* 13px, not 11 (2026-07-28). Uppercase mono at 0.14em tracking is the least legible
          register on the site and it was set two steps below the body; this page's readers are
          not all twenty-five. Same for the gallery's plate captions. */}
      <nav aria-label="Footer" className="flex flex-wrap items-center gap-6 font-sans text-[11px] uppercase tracking-[0.16em] text-inkBlack/48">
        <a href={routes.press} className="inline-flex items-center justify-center transition-colors duration-150 hover:text-inkBlack [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:min-w-[44px]">Press</a>
        <a href={routes.questions} className="inline-flex items-center justify-center transition-colors duration-150 hover:text-inkBlack [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:min-w-[44px]">Questions</a>
        <a href={routes.gallery} className="inline-flex items-center justify-center transition-colors duration-150 hover:text-inkBlack [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:min-w-[44px]">Works</a>
        {/* `/privacy` remains linked at the contact form, where it is load-bearing. */}
        <a href={routes.contact} className="inline-flex items-center justify-center transition-colors duration-150 hover:text-inkBlack [@media(pointer:coarse)]:min-h-[44px] [@media(pointer:coarse)]:min-w-[44px]">Contact</a>
      </nav>
      {/* THE COMPANY LINE. Stubbed 2026-07-31 and rendering the copyright alone until
          incorporation completes — see `pending.ts`, `practice-entity`.

          A commercial buyer's solicitor looks for a company number, a registered office and a VAT
          number, and finds none anywhere on this site. The markup is here so that landing them is a
          data change rather than a layout change; `COMPANY` is deliberately `null` rather than a
          set of empty strings, because an empty string renders as a stray separator and reads as a
          bug, whereas an absent block reads as a footer. */}
      <span className="site-footer-legal flex items-center font-mono text-[11px] uppercase tracking-[0.14em] text-inkBlack/40">
        <a
          href={routes.home}
          aria-label={`© ${year} Bower, home`}
          className="transition-colors duration-150 hover:text-inkBlack focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-inkBlack"
        >
          © {year} Bower. All rights reserved.
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
