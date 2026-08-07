/**
 * usePageSnap.ts — a SLIGHT snap on a page's sections (2026-08-05, Clay, first ruled on
 * /commissions; extended site-wide 2026-08-06).
 *
 * `proximity`, NOT `mandatory`: full-viewport bands settle to their tops when a scroll ends
 * NEAR them, and free scrolling everywhere else is untouched — mandatory would fight the
 * reader through any section taller than the viewport. The snap container for normal page
 * scroll is the document, so the type goes on <html> for the mounting page's lifetime only.
 *
 * SCROLL-PADDING IS ZEROED WHILE THE SNAP IS LIVE, and that is half the point of this hook.
 * index.css sets `scroll-padding-top: calc(var(--header-h) + 1rem)` on html so anchor
 * landings clear the fixed header — but scroll-padding also insets the SNAPPORT, so with it
 * in force every full-bleed `snap-start` band came to rest ~100px shy of the viewport top,
 * showing a sliver of the section above under the transparent header. In-page anchors lose
 * nothing: `[id] { scroll-margin-top }` (also index.css) still gives every addressable
 * element its own clearance. A snapped section that SHOULD rest below the header (a text
 * section whose content starts at its border-box top) carries its own
 * `scroll-mt-[calc(var(--header-h)+1rem)]` — see the /commissions tab row.
 *
 * WHERE THIS DOES NOT BELONG: /questions and /about are reading pages ("no scroll
 * choreography" is the questions page's own stated register); /about/practice scrubs a
 * camera off scroll position, which a snap would fight; /contact and /press scroll only as
 * far as the footer, and a snap point at their hero is a spring the reader has to beat to
 * read it.
 */
import { useEffect } from 'react';

export function usePageSnap(): void {
  useEffect(() => {
    const el = document.documentElement;
    const prevSnap = el.style.scrollSnapType;
    const prevPad = el.style.scrollPaddingTop;
    el.style.scrollSnapType = 'y proximity';
    el.style.scrollPaddingTop = '0px';
    return () => {
      el.style.scrollSnapType = prevSnap;
      el.style.scrollPaddingTop = prevPad;
    };
  }, []);
}
