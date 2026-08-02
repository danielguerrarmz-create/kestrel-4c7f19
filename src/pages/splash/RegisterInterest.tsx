/**
 * RegisterInterest.tsx — the splash's one email capture (spec §5). Top-of-funnel
 * and design-agnostic, so it deliberately does NOT reuse the store's
 * commission-coupled submitReserve() slice; it keeps its own local state.
 *
 * IT POSTS TO A REAL ENDPOINT AS OF 2026-07-31 (`api/contact.ts`, mailing `FORM_INBOX`), which is
 * the first backend this site has had. The honesty posture did not relax with it — it moved from
 * the copy into the control flow: the confirmation the reader sees is decided by what the SERVER
 * returned, so the site can only promise a reply when a message was actually accepted. See the
 * comment above the confirmation branches.
 *
 * Visuals stay in the hairline drafting register (1px border, no rounded pill,
 * thin-bordered submit) so this page keeps exactly one filled action, the hero
 * and close engine CTA.
 */
import { useState, type FormEvent } from 'react';
import { CONTACT } from '../../data/config';

/** What happened to the submission, which is what decides the confirmation the reader is shown. */
type Outcome = 'idle' | 'sending' | 'delivered' | 'undelivered';

export function RegisterInterest() {
  const [email, setEmail] = useState('');
  const [outcome, setOutcome] = useState<Outcome>('idle');

  /**
   * THE OUTCOME IS DECIDED BY THE SERVER, NOT BY THE CLICK — that is the whole design.
   *
   * A form that says "thank you" on submit is indistinguishable, to the person who sent it, from
   * one that works. They walk away believing they have contacted you. So there is exactly ONE path
   * to the short confirmation and it requires a 2xx from `/api/contact`, which itself requires the
   * mail provider to have accepted the message. Every other outcome (endpoint absent in local dev,
   * `RESEND_API_KEY` unset in production, provider down, network gone) lands on `undelivered`, which
   * prints the phone number and the address.
   *
   * This is also why the truth is not read from a build-time flag. A flag would have to be right,
   * and the failure it is guarding against is precisely the case where something we believed was
   * configured is not.
   */
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || outcome === 'sending') return;
    setOutcome('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, source: 'splash' }),
      });
      setOutcome(res.ok ? 'delivered' : 'undelivered');
    } catch {
      setOutcome('undelivered');
    }
  };

  /*
   * "WE WILL BE IN TOUCH" IS SAYABLE AGAIN (2026-07-31) — but only when it is true.
   *
   * The history, because it is the reason this component is shaped the way it is: the confirmation
   * once read "Noted. We will be in touch." above a handler that did `console.log` and nothing else,
   * with no backend and no inbox anywhere on the site. The site's ONE conversion point told every
   * visitor a falsehood and dropped them. On 2026-07-28 the copy was made honest and the mechanism
   * was left as "a provider choice, not a copy fix", with a note saying the apology could go when an
   * endpoint landed.
   *
   * The endpoint has landed (`api/contact.ts`), and the note's instruction is followed EXACTLY as
   * far as it should be and no further: the promise returns on the path where the message was
   * actually accepted, and the apology stays on the path where it was not. Deleting it outright
   * would have recreated the original bug the first time an API key expired.
   */
  if (outcome === 'delivered') {
    return (
      <div className="mt-8 font-serifDisplay text-[17px] leading-relaxed text-inkBlack/70">
        <p className="italic">Noted, and thank you. We will be in touch.</p>
      </div>
    );
  }

  if (outcome === 'undelivered') {
    return (
      <div className="mt-8 flex flex-col gap-2 font-serifDisplay text-[17px] leading-relaxed text-inkBlack/70">
        <p className="italic">That didn’t send, and we would rather tell you than lose it.</p>
        <p className="italic">
          The sure way to reach us is directly:{' '}
          <a href={`tel:${CONTACT.phoneHref}`} className="not-italic text-inkBlack underline decoration-inkBlack/25 underline-offset-4 transition-colors hover:decoration-inkBlack">
            {CONTACT.phone}
          </a>{' '}
          or{' '}
          <a href={`mailto:${CONTACT.email}`} className="not-italic text-inkBlack underline decoration-inkBlack/25 underline-offset-4 transition-colors hover:decoration-inkBlack">
            {CONTACT.email}
          </a>
          .
        </p>
      </div>
    );
  }

  /*
   * A RULED LINE ON PAPER, NOT A BOXED FORM (2026-07-23 elegance pass).
   *
   * This was the most software-looking object on the page: a hard 1px box around the field, a
   * bordered button, both labelled in mono uppercase at 11px. That is a sign-up widget, and it
   * sat directly under "Begin." — the page's most graceful line.
   *
   * Now the field is an underline the text sits on (the way a name goes on a card), the label is
   * the page's serif small-cap eyebrow, and the submit is a serif word with the nav's own
   * olive arrow and left-origin underline. NOTHING about behaviour changed: same input id, same
   * name, same type/autoComplete/required, same 44px coarse-pointer floor, same submit path.
   */
  return (
    <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-8">
      <label className="flex flex-col gap-3">
        <span
          className="font-serifDisplay text-[13px] italic opacity-60"
          style={{ fontVariant: 'small-caps', letterSpacing: '0.16em' }}
        >
          register interest
        </span>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full min-w-[16rem] border-0 border-b border-inkBlack/25 bg-transparent pb-2 font-serifDisplay text-[18px] text-inkBlack outline-none transition-colors focus:border-inkBlack placeholder:italic placeholder:text-inkBlack/25 sm:w-[22rem] [@media(pointer:coarse)]:min-h-[44px]"
        />
      </label>
      <button
        type="submit"
        disabled={outcome === 'sending'}
        aria-busy={outcome === 'sending'}
        className="group inline-flex items-center gap-1.5 self-start pb-2 font-serifDisplay text-[18px] text-inkBlack transition-opacity disabled:opacity-50 sm:self-auto [@media(pointer:coarse)]:min-h-[44px]"
      >
        <span className="relative">
          {outcome === 'sending' ? 'sending' : 'submit'}
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left scale-x-0 bg-inkBlack transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
          />
        </span>
        <span aria-hidden className="text-accentOlive transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </button>
    </form>
  );
}
