import { useState, type FormEvent } from 'react';
import { SplashHeader } from './splash/SplashHeader';
import { CONTACT } from '../data/config';
import { Footer } from '../ui/Footer';

type Outcome = 'idle' | 'sending' | 'delivered' | 'undelivered';

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
  const field = 'w-full border-0 border-b border-inkBlack/25 bg-transparent px-0 py-2 font-serifDisplay text-[17px] outline-none transition-colors placeholder:text-inkBlack/30 focus:border-inkBlack';
  return (
    <div className="min-h-screen bg-paperVellum text-inkBlack">
      <SplashHeader transparent logoPill />
      <main className="mx-auto grid min-h-[100svh] w-full max-w-canvas gap-6 px-gutter pb-6 pt-[calc(var(--header-h)+1.5rem)] lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-14 lg:pb-8 lg:pt-[calc(var(--header-h)+1rem)]">
        <header>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-inkBlack/40">Contact</p>
          <h1 className="mt-4 max-w-[13ch] font-serifDisplay text-[clamp(2.35rem,4.7vw,4.5rem)] leading-[0.98] tracking-[-0.025em]">Discuss a founding commission.</h1>
          <p className="mt-4 max-w-[40ch] font-serifDisplay text-[17px] leading-[1.5] text-inkBlack/65">We are selecting three exceptional landscapes for the first Bowers. If you think yours may be a fit, please contact us.</p>
          <div className="mt-4 border-t border-inkBlack/15 pt-4 font-serifDisplay text-[16px] leading-relaxed">
            <p className="text-[19px]">Clay Seifert</p>
            <a href={`mailto:${CONTACT.email}`} className="mt-1 inline-flex min-h-[36px] items-center underline decoration-inkBlack/25 underline-offset-4">clay@bowerbuild.org</a>
          </div>
        </header>

        <div className="border-t border-inkBlack/15 pt-6">
          {outcome === 'delivered' ? <p className="font-serifDisplay text-[clamp(1.5rem,3vw,2.4rem)] italic leading-snug">Thank you. Your note has reached us, and Clay will be in touch.</p> : (
            <form onSubmit={onSubmit} className="grid grid-cols-2 gap-x-5 gap-y-4 sm:gap-x-8 sm:gap-y-5">
              <label className="font-mono text-[11px] uppercase tracking-[0.14em] text-inkBlack/50">Name<input className={field} name="name" required autoComplete="name" /></label>
              <label className="font-mono text-[11px] uppercase tracking-[0.14em] text-inkBlack/50">Organisation<input className={field} name="organisation" autoComplete="organization" /></label>
              <label className="font-mono text-[11px] uppercase tracking-[0.14em] text-inkBlack/50">Site or location<input className={field} name="location" required /></label>
              <label className="font-mono text-[11px] uppercase tracking-[0.14em] text-inkBlack/50">Email<input className={field} name="email" type="email" required autoComplete="email" /></label>
              <label className="col-span-2 font-mono text-[11px] uppercase tracking-[0.14em] text-inkBlack/50">What might happen in the Bower?<textarea className={`${field} min-h-[5rem] resize-y`} name="programme" required /></label>
              <div className="col-span-2"><button type="submit" disabled={outcome === 'sending'} className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-inkBlack px-6 py-3 font-serifDisplay text-[17px] text-paperVellum disabled:opacity-50">{outcome === 'sending' ? 'Sending' : 'Send your note'} <span aria-hidden className="text-accentOlive transition-transform group-hover:translate-x-1">→</span></button></div>
              {outcome === 'undelivered' && <p role="alert" className="col-span-2 font-serifDisplay text-[16px] italic leading-relaxed text-inkBlack/65">That did not send. Please email <a className="underline" href="mailto:clay@bowerbuild.org">clay@bowerbuild.org</a> directly.</p>}
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
