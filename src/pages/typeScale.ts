/**
 * typeScale.ts — the shared documentation-layer type scale.
 *
 * Extracted from EnginePage so the splash landing and the engine explainer
 * import the identical scale instead of drifting private copies. Zero visual
 * change: these are the exact class strings the Engine page shipped with.
 *
 * H1  = the one Bodoni Moda pull-quote moment per page (font-quote).
 * H2  = every other heading (font-serifDisplay, Source Serif 4).
 * BODY = the reading-column paragraph default.
 *
 * BODY IS SET IN THE SERIF (2026-07-23 elegance pass). It inherited the UI sans (Inter), which
 * left the page bilingual: serif headings and serif list items over sans paragraphs. That pairing
 * is the house style of software marketing, and it was the last structural reason the home still
 * read as, in Clay's words, "a technology website landing page, not a beautiful elegant garden
 * structures landing page". One serif voice throughout makes it a printed page instead. The sans
 * keeps every job it is actually for: the nav, buttons, inputs and the studio's instrument UI.
 * 18px, not 17: the serif's x-height runs smaller than Inter's at the same size.
 */
export const H1 =
  'font-quote font-bold leading-[0.98] tracking-[-0.02em] text-[clamp(2.75rem,6vw,5.5rem)]';
export const H2 =
  'font-serifDisplay font-semibold leading-[1.04] tracking-[-0.01em] text-[clamp(1.75rem,3.5vw,3rem)]';
export const BODY = 'mt-6 max-w-[60ch] font-serifDisplay text-[18px] leading-relaxed opacity-90';
