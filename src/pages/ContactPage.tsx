import { useState, type FormEvent } from 'react';
import { CONTACT } from '../data/config';
import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { srcSetFor } from '../ui/responsiveImg';
import { usePageSnap } from '../ui/usePageSnap';

type Outcome = 'idle' | 'sending' | 'delivered' | 'undelivered';

/**
 * What the reader is given when the send failed — and it must be BOTH routes, not one.
 *
 * THE REGRESSION THIS EXISTS TO CLOSE (2026-08-13). The site's contract, written up in CLAUDE.md
 * and implemented in `splash/RegisterInterest.tsx` since 2026-07-31, is: the outcome is decided by
 * the SERVER, and every path that is not a 2xx "prints the phone number and the address". The
 * 2026-08-08 site rework replaced that form with this page and carried over the honesty of the
 * control flow but not the recovery route — the failure branch printed the email alone.
 *
 * That is not a cosmetic loss, because of WHEN it is read. This branch renders exactly when the
 * form did not work, so the person reading it has already had one route fail on them, and handing
 * them a second address on the same domain asks them to trust the channel that just dropped their
 * message. The phone is the only route here that does not share a failure mode with the form.
 * It also matters more than usual right now: `RESEND_API_KEY` is unset in Vercel Production, so
 * `POST /api/contact` returns 503 not-configured and **this is the branch every submission takes.**
 *
 * Both values come from `CONTACT`, never from a literal — the published address has changed five
 * times in a fortnight (see the comment on `CONTACT.email`), and a hand-copied one here would go
 * stale silently on the page that exists to be correct about how to reach the practice.
 */
export function UndeliveredNotice() {
  return (
    <p role="alert" className="sm:col-span-2 font-serifDisplay text-[16px] italic text-black/52">
      That did not send, and we would rather tell you than lose your note. The sure way to reach us
      is directly:{' '}
      <a className="not-italic underline" href={`tel:${CONTACT.phoneHref}`}>
        {CONTACT.phone}
      </a>{' '}
      or{' '}
      <a className="not-italic underline" href={`mailto:${CONTACT.email}`}>
        {CONTACT.email}
      </a>
      .
    </p>
  );
}

export function ContactPage() {
  usePageSnap({ wheel: true });
  const [outcome, setOutcome] = useState<Outcome>('idle');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (outcome === 'sending') return;
    setOutcome('sending');
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, source: 'contact' }),
      });
      setOutcome(response.ok ? 'delivered' : 'undelivered');
    } catch {
      setOutcome('undelivered');
    }
  };

  const field = 'mt-2 w-full border-0 border-b border-black/28 bg-transparent px-0 py-2 font-serifDisplay text-[18px] text-black outline-none transition-colors placeholder:text-black/25 focus:border-black';
  const label = 'font-mono text-[9px] uppercase tracking-[0.16em] text-black/42';

  return (
    <div className="min-h-screen bg-white text-[#11110e]">
      <main>
        <section data-snap-section className="relative flex min-h-[100svh] snap-start items-end overflow-hidden bg-[#11110e] px-gutter py-16 text-white md:py-24">
          <EditorialHeader tone="white" />
          <img
            src="/assets/gallery/02-garden-pavilion.webp"
            srcSet={srcSetFor('/assets/gallery/02-garden-pavilion.webp')}
            sizes="100vw"
            alt="Concept visualisation of a timber Bower within a mature walled garden"
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.46)_0%,rgba(0,0,0,.04)_38%,rgba(0,0,0,.78)_100%)]" />
          <div className="relative mx-auto w-full max-w-canvas">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">Enquire</p>
            <h1 className="mt-7 max-w-[11ch] font-quote text-[clamp(3.8rem,9vw,9rem)] leading-[0.87] tracking-[-0.05em]">Tell us about your landscape.</h1>
            <p className="mt-9 font-mono text-[8px] uppercase tracking-[0.18em] text-white/48 md:text-[9px]">One conversation begins below ↓</p>
          </div>
        </section>

        <section data-snap-section className="flex min-h-[100svh] snap-start items-center px-gutter py-20">
          <div className="mx-auto grid w-full max-w-canvas gap-14 lg:grid-cols-[.65fr_1.35fr] lg:items-end">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/38">Introduce a landscape</p>
              <h2 className="mt-8 max-w-[8ch] font-quote text-[clamp(3rem,6vw,6rem)] leading-[0.9] tracking-[-0.04em]">Begin with the place.</h2>
              <p className="mt-8 font-serifDisplay text-[18px]">Clay Seifert</p>
              <a href={`mailto:${CONTACT.email}`} className="mt-1 inline-block border-b border-black/35 pb-1 font-serifDisplay text-[16px] text-black/52">{CONTACT.email}</a>
            </div>

            {outcome === 'delivered' ? (
              <p className="max-w-[28rem] font-quote text-[clamp(2.6rem,5vw,5rem)] leading-[0.95]">Thank you. Your note has reached us.</p>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                <label className={label}>Name<input className={field} name="name" autoComplete="name" /></label>
                <label className={label}>Organisation<input className={field} name="organisation" autoComplete="organization" /></label>
                <label className={label}>Site or location<input className={field} name="location" /></label>
                <label className={label}>Email<input className={field} name="email" type="email" required autoComplete="email" /></label>
                <label className={`sm:col-span-2 ${label}`}>What might happen in the Bower?<textarea className={`${field} min-h-[5rem] resize-y`} name="programme" /></label>
                <div className="sm:col-span-2">
                  <button type="submit" disabled={outcome === 'sending'} className="border-b border-black/45 pb-1 font-serifDisplay text-[19px] transition-opacity hover:opacity-55 disabled:opacity-35">
                    {outcome === 'sending' ? 'Sending' : 'Send your note →'}
                  </button>
                </div>
                {outcome === 'undelivered' && <UndeliveredNotice />}
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
