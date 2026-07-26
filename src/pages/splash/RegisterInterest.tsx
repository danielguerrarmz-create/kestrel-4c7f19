/**
 * RegisterInterest.tsx — the splash's one email capture (spec §5). Top-of-funnel
 * and design-agnostic, so it deliberately does NOT reuse the store's
 * commission-coupled submitReserve() slice; it keeps its own local state and the
 * same honesty posture the rest of the MVP holds: real as a shape, logged to
 * console, not yet wired to a backend, and it says so.
 *
 * Visuals stay in the hairline drafting register (1px border, no rounded pill,
 * thin-bordered submit) so this page keeps exactly one filled action, the hero
 * and close engine CTA.
 */
import { useState, type FormEvent } from 'react';

export function RegisterInterest() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    // MVP: no backend. Capture the intent to console + local state only.
    // eslint-disable-next-line no-console
    console.log('[REGISTER] interest captured', { email: email.trim(), source: 'splash' });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="mt-8 font-serifDisplay text-[17px] italic leading-relaxed text-inkBlack/70">
        Noted. We will be in touch.
      </p>
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
        className="group inline-flex items-center gap-1.5 self-start pb-2 font-serifDisplay text-[18px] text-inkBlack sm:self-auto [@media(pointer:coarse)]:min-h-[44px]"
      >
        <span className="relative">
          submit
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
