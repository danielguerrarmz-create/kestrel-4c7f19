import { useState, type FormEvent } from 'react';
import { SplashHeader } from './splash/SplashHeader';
import { CONTACT } from '../data/config';
import { Footer } from '../ui/Footer';
import { srcSetFor } from '../ui/responsiveImg';

type Outcome = 'idle' | 'sending' | 'delivered' | 'undelivered';

/**
 * FULL-BLEED, UNCOMMITTED EXPERIMENT (2026-08-05, Clay, two rounds). Round one split the page;
 * round two: "make the image full bleed. Our full-bleed renders are our strongest asset."
 * The first full-bleed attempt floated the form on a frosted card and Clay called it ugly —
 * rightly: nothing on this site uses floating panels, so a card is off-language. And the page
 * root was bg-inkBlack, which the transparent Footer inherited — the "completely black" footer.
 *
 * This version is the site's own language: ONE image, ONE bottom-weighted gradient, and both
 * the heading and the form set directly into the scrim in vellum — the underline-minimal field
 * style the form already had, recoloured for dark ground. The root is paperVellum again, so the
 * footer renders normally. No concept-visualisation tag ("they are aware"); the unbuilt record
 * lives on /questions Q6, the gallery, and llms.txt.
 */
export function ContactPage() {
  const [outcome, setOutcome] = useState<Outcome>('idle');
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (outcome === 'sending') return;
    setOutcome('sending');
    const data = new FormData(event.currentTarget);
    const payload = Object.fromEntries(data.entries());
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, source: 'contact' }) });
      setOutcome(response.ok ? 'delivered' : 'undelivered');
    } catch { setOutcome('undelivered'); }
  };
  const field = 'w-full border-0 border-b border-paperVellum/60 bg-transparent px-0 py-2 font-serifDisplay text-[17px] text-paperVellum outline-none transition-colors placeholder:text-paperVellum/35 focus:border-paperVellum';
  const label = 'font-mono text-[11px] uppercase tracking-[0.14em] text-paperVellum/85';
  return (
    <div className="min-h-screen bg-paperVellum text-inkBlack">
      <SplashHeader />
      <main className="relative isolate min-h-[100svh] overflow-hidden bg-inkBlack text-paperVellum">
        <img
          src="/assets/gallery/02-garden-pavilion.webp"
          srcSet={srcSetFor('/assets/gallery/02-garden-pavilion.webp')}
          sizes="100vw"
          alt="A bower pavilion in a walled garden, its woven lattice crown sweeping up over rooted timber columns, visitors gathered inside"
          loading="eager"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        {/* Two gradients: bottom-weighted for the whole text zone, and a second one rising
            from the lower-right corner where the form sits (2026-08-05, Clay: "can't see the
            damn form... too low of contrast. I like the image though") — so the fields get a
            genuinely dark ground while the upper half of the render stays bright. */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        <div aria-hidden className="absolute inset-y-0 right-0 -z-10 w-[70%] bg-gradient-to-tl from-black/80 via-black/35 to-transparent" />
        <div className="mx-auto grid min-h-[100svh] w-full max-w-canvas content-end gap-10 px-gutter pb-[clamp(2.5rem,5vw,4rem)] pt-[calc(var(--header-h)+2rem)] lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
          <header className="[text-shadow:0_1px_16px_rgba(0,0,0,0.6)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paperVellum/70">Contact</p>
            {/* NOT "Discuss a founding commission." (2026-08-05, Clay's redundancy pass): that
                was the label of the button the reader just clicked. This page's job is to start
                the conversation, in the words the form itself asks. */}
            <h1 className="mt-4 max-w-[13ch] font-serifDisplay text-[clamp(2.35rem,4.7vw,4.5rem)] leading-[0.98] tracking-[-0.025em]">Tell us about your landscape.</h1>
            <div className="mt-5 border-t border-paperVellum/30 pt-4 font-serifDisplay text-[16px] leading-relaxed">
              <p className="text-[19px]">Clay Seifert</p>
              <a href={`mailto:${CONTACT.email}`} className="mt-1 inline-flex min-h-[36px] items-center underline decoration-paperVellum/40 underline-offset-4">clay@bowerbuild.org</a>
            </div>
          </header>

          <div className="[text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
            {outcome === 'delivered' ? <p className="font-serifDisplay text-[clamp(1.5rem,3vw,2.4rem)] italic leading-snug">Thank you. Your note has reached us, and Clay will be in touch.</p> : (
              <form onSubmit={onSubmit} className="grid grid-cols-2 gap-x-5 gap-y-4 sm:gap-x-8 sm:gap-y-5">
                <label className={label}>Name<input className={field} name="name" required autoComplete="name" /></label>
                <label className={label}>Organisation<input className={field} name="organisation" autoComplete="organization" /></label>
                <label className={label}>Site or location<input className={field} name="location" required /></label>
                <label className={label}>Email<input className={field} name="email" type="email" required autoComplete="email" /></label>
                <label className={`col-span-2 ${label}`}>What might happen in the Bower?<textarea className={`${field} min-h-[5rem] resize-y`} name="programme" required /></label>
                <div className="col-span-2"><button type="submit" disabled={outcome === 'sending'} className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-paperVellum px-6 py-3 font-serifDisplay text-[17px] text-inkBlack [text-shadow:none] disabled:opacity-50">{outcome === 'sending' ? 'Sending' : 'Send your note'} <span aria-hidden className="text-mossDeep transition-transform group-hover:translate-x-1">→</span></button></div>
                {outcome === 'undelivered' && <p role="alert" className="col-span-2 font-serifDisplay text-[16px] italic leading-relaxed text-paperVellum/80">That did not send. Please email <a className="underline" href="mailto:clay@bowerbuild.org">clay@bowerbuild.org</a> directly.</p>}
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
