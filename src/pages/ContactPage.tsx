import { useState, type FormEvent } from 'react';
import { CONTACT } from '../data/config';
import { routes } from '../routing';
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
  /*
   * THE SELECT WEARS THE SAME RULE AS THE INPUTS, WHICH TAKES `appearance-none`.
   *
   * A native `<select>` arrives with the operating system's own chrome — a bevelled box on Windows,
   * a rounded grey capsule on macOS — and dropping one into this form would put the single most
   * platform-looking object on a page built entirely from hairline underlines. So the native
   * decoration comes off and the field keeps the shared bottom rule, the same serif at 18px, and
   * the same focus darkening; `pr-6` reserves room for the chevron drawn beside it.
   *
   * `mt-2` is NOT here: the positioning wrapper carries it, because the chevron has to be
   * positioned against the select alone rather than against the label text above it.
   */
  const selectField =
    'w-full cursor-pointer appearance-none border-0 border-b border-black/28 bg-transparent px-0 py-2 pr-6 font-serifDisplay text-[18px] text-black outline-none transition-colors focus:border-black';

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
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">Founding commissions · 2027</p>
            <h1 className="mt-7 max-w-[11ch] font-quote text-[clamp(3.8rem,9vw,9rem)] leading-[0.87] tracking-[-0.05em]">Tell us about your landscape.</h1>
            <p className="mt-9 font-mono text-[8px] uppercase tracking-[0.18em] text-white/48 md:text-[9px]">One conversation begins below ↓</p>
          </div>
        </section>

        {/*
          * THE PADDING YIELDS SO THE SECTION ALWAYS SNAP-FITS (2026-09-03).
          *
          * It was a flat `py-20` — 160px that never moved — against a form that is ~495px tall at
          * desktop widths. 495 + 160 = 655, so on ANY viewport shorter than 655px the section blew
          * past `min-h-[100svh]`, grew, and stopped landing on its snap point: measured at
          * 1440x640 it overflowed by 15px and turned a two-screen page into 2.15 screens. It fit at
          * 720 and broke at 640, which is exactly the class of bug this repo keeps writing warnings
          * about — it hid in a viewport height nobody measured. A common laptop window is in that
          * range once browser chrome is subtracted.
          *
          * `clamp(2rem, 6vh, 5rem)` keeps the generous desktop breathing room, gives it back on a
          * short screen, and holds a 2rem floor so the content never touches the edge. The section
          * now fits any viewport down to ~559px.
          *
          * NOT fixed by shrinking the form or capping the section: `min-h` + growth is what a form
          * SHOULD do when it genuinely cannot fit (below `lg` the columns stack and scrolling is
          * correct). The bug was padding that refused to yield first.
          */}
        <section data-snap-section className="flex min-h-[100svh] snap-start items-center px-gutter py-[clamp(2rem,6vh,5rem)]">
          {/* `lg:items-center`, not `items-end` (2026-09-03, Clay): the left column's text is
              centred against the form beside it, so it sits centred on the snapped screen. It was
              bottom-aligned, which pinned the name and address to the form's last field and left a
              200px hole above them. */}
          <div className="mx-auto grid w-full max-w-canvas gap-14 lg:grid-cols-[.65fr_1.35fr] lg:items-center">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/55">Discuss a founding commission</p>
              <h2 className="mt-8 max-w-[8ch] font-quote text-[clamp(3rem,6vw,6rem)] leading-[0.9] tracking-[-0.04em]">Begin with the place.</h2>
              {/* NO GEOGRAPHY LINE HERE (2026-09-03, Clay). The eyebrow's "International enquiries"
                  went first, then this one: a reader who has scrolled to the form has already
                  decided to write, and telling them where the studio is at the moment they reach
                  for the keyboard answers a question they are no longer asking. It is on /questions,
                  where someone is actually looking it up. What stays beside the form is the person
                  who replies and the address to reach them. */}
              <p className="mt-8 font-serifDisplay text-[18px]">Clay Seifert</p>
              <a href={`mailto:${CONTACT.email}`} className="mt-1 inline-block border-b border-black/35 pb-1 font-serifDisplay text-[16px] text-black/52">{CONTACT.email}</a>
            </div>

            {outcome === 'delivered' ? (
              <p className="max-w-[28rem] font-quote text-[clamp(2.6rem,5vw,5rem)] leading-[0.95]">Thank you. Your note has reached us.</p>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {/* ORGANISATION REMOVED 2026-09-03 (Clay). It also leaves `ContactPayload` and the
                    notification body in `api/contact.ts`, and the collected-details list on
                    /privacy — a privacy notice that names a field the form no longer has is a
                    statement about data handling that is simply untrue. Four fields now sit as two
                    clean rows above the message. */}
                <label className={label}>Name<input className={field} name="name" autoComplete="name" /></label>
                <label className={label}>Project location and country<input className={field} name="location" autoComplete="country-name" /></label>
                <label className={label}>Email<input className={field} name="email" type="email" required autoComplete="email" /></label>
                {/* A SELECT, NOT A TEXT BOX (2026-09-03, Clay). Free text here produced answers a
                    scheduler cannot use ("CET", "GMT+1", "same as you"), and asked a patron to
                    name their own offset, which nobody knows without checking. The options are
                    grouped by ACTUAL offset and anchored to cities, so a reader recognises theirs
                    without arithmetic: Lisbon genuinely shares London's clock, and the whole
                    Paris/Rome/Madrid/Berlin block genuinely shares one.
                    The default is "No preference" — a real answer, not a disabled placeholder, so
                    the control never needs a greyed invalid state to look right and an unchanged
                    field still says something true. */}
                <label className={label}>
                  Preferred time zone
                  <span className="relative mt-2 block">
                    <select className={selectField} name="timeZone" defaultValue="No preference">
                      <option>No preference</option>
                      <option>London, Dublin, Lisbon</option>
                      <option>Paris, Rome, Madrid, Berlin</option>
                      <option>Athens, Helsinki</option>
                      <option>The Americas</option>
                      <option>Elsewhere</option>
                    </select>
                    <span aria-hidden className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[10px] text-black/40">▾</span>
                  </span>
                </label>
                <label className={`sm:col-span-2 ${label}`}>What might happen in the Bower?<textarea className={`${field} min-h-[5rem] resize-y`} name="programme" /></label>
                <div className="sm:col-span-2">
                  <button type="submit" disabled={outcome === 'sending'} className="border-b border-black/45 pb-1 font-serifDisplay text-[19px] transition-opacity hover:opacity-55 disabled:opacity-35">
                    {outcome === 'sending' ? 'Sending' : 'Send your note →'}
                  </button>
                </div>
                <p className="sm:col-span-2 font-serifDisplay text-[13px] leading-[1.5] text-black/42">
                  We use these details to respond to your enquiry. Read our{' '}
                  <a href={routes.privacy} className="border-b border-black/25 pb-px transition-colors hover:border-black">privacy notice</a>.
                </p>
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
