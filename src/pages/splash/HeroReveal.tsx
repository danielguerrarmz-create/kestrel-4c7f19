/**
 * HeroReveal.tsx — the home hero.
 *
 * 2026-07-10: the timed 2D-Oculus -> 3D-gridshell -> render reveal (the three.js
 * `HeroScene` animation) has been TABLED. The hero is now a single photographic
 * beauty still with the outcome copy over it. The image's entrance is owned by the
 * one-time BowerIntro loader (bower wordmark -> spinning Oculus -> the image fades in),
 * so the hero itself just holds the finished still; only the copy animates, growing in
 * once the intro veil lifts.
 *
 * The old HeroScene / capture / video-record machinery still lives in HeroScene.tsx
 * and heroStill.ts (tabled, unreferenced here) so the 3D reveal can be relanded later.
 *
 * Copy layout: a lower-LEFT column (not a centered band) so the middle + right of the
 * image stay open. The hero sentence is set in the hand-lettered "Realistic Nature"
 * face (font-heroScript) and the one big product word "Bower" in "Paperlight Script"
 * (font-handwrite).
 *
 * Fallbacks:
 *   - reduced motion / SSR -> the finished still + copy, no growth animation.
 */
import { useEffect, useRef, useState } from 'react';
import { Frame } from '../../ui/Frame';
import { motion, type Variants } from 'framer-motion';
import type { EngineOutputs } from '../../engine/types';
import { srcSetFor } from '../../ui/responsiveImg';
import { SESSION_KEY, INTRO_DONE_EVENT } from './BowerIntro';
import { HERO_STILL } from './heroStill';
import { APPLY_CTA } from './copy';
import { routes } from '../../routing';

export type HeroMode = 'poster' | 'static' | 'reveal';

/**
 * Pure mode decision (unit-tested). Server -> poster (finished markup, copy present).
 * Reduced motion -> static (finished still, no growth). Browser + motion -> reveal
 * (the copy grows in once the intro veil lifts).
 */
export function heroMode(o: { isBrowser: boolean; reduced: boolean }): HeroMode {
  if (!o.isBrowser) return 'poster';
  if (o.reduced) return 'static';
  return 'reveal';
}

/**
 * The product name as the hero's one hand-lettered moment, set in the cursive `handwrite`
 * face (Paperlight Script). Real, selectable, accessible text — not a path.
 *
 * IT SAYS "BOWER" NOW, NOT "EDEN" (2026-07-23, Clay: "shift the homepage so it says 'Bower'
 * instead of 'Eden'. It is super confusing right now"). The site had carried two proper nouns
 * since 2026-07-05 — Bower the company, Eden the object — which is a distinction a first-time
 * reader has no way to hold: the nav says one word and the headline says another, and neither
 * is explained. One name, and it is the one the whole page already teaches: the wordmark, the
 * dictionary definition on the spread below, and the thing itself are now all "bower".
 */
function ProductWord({ className = '' }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Bower"
      className={`inline-block font-handwrite font-normal leading-[0.9] ${className}`}
    >
      Bower
    </span>
  );
}

/**
 * The hero copy's GROWTH reveal: each line rises from its own baseline under an upward
 * clip (like something sprouting) + a slight scale-from-smaller, on a soft spring, and
 * the lines stagger so it composes as one orchestrated moment. Reduced-motion / SSR
 * never reach this: those render the finished state via `orchestrate=false`.
 */
const copyContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.04 } },
};
const growLine: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.96, clipPath: 'inset(100% 0% -12% 0%)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    clipPath: 'inset(0% 0% -12% 0%)',
    transition: { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 },
  },
};

function HeroCopy({
  orchestrate = false,
  show = true,
}: {
  /** True in the browser reveal: start hidden and grow in when `show` flips. Off on
   *  poster / reduced-motion so the text renders finished with no motion. */
  orchestrate?: boolean;
  show?: boolean;
}) {
  return (
    <motion.div
      variants={copyContainer}
      initial={orchestrate ? 'hidden' : 'show'}
      animate={show ? 'show' : 'hidden'}
      className="text-paperVellum [text-shadow:0_1px_18px_rgba(0,0,0,0.45)]"
    >
      {/* THE TYPE STEPS DOWN ON A SHORT WINDOW, and the clamp alone could not do this.
          `clamp(...,4.8vw,...)` scales with WIDTH, and the collision here is a function of HEIGHT:
          this block is bottom-anchored, the section is `min-h-screen`, so on a short window the
          copy grows up into the fixed header while every width-based rule reports everything fine.
          Measured at 1280x560 before this: the headline's first line sat 26px BEHIND the nav pill.
          Pre-existing, and invisible at the 720px+ heights anything gets tested at.
          640px is the breakpoint because that is where the untouched sizes stop fitting; the step
          is small enough that nobody meets a different hero, only a slightly quieter one. */}
      <h1 className="max-w-[14ch] font-heroScript text-[clamp(2.25rem,4.8vw,4rem)] font-normal leading-[1.08] [@media(max-height:640px)]:text-[clamp(1.9rem,3.6vw,2.9rem)]">
        <motion.span variants={growLine} className="block origin-bottom will-change-transform">
          Grow a living
        </motion.span>
        <ProductWord className="mt-3 -mb-2 block text-[clamp(4.5rem,12vw,8.5rem)] [@media(max-height:640px)]:mt-1 [@media(max-height:640px)]:text-[clamp(3.25rem,8vw,5.5rem)]" />
        <motion.span variants={growLine} className="block origin-bottom will-change-transform">
          in your garden.
        </motion.span>
      </h1>
      <motion.p
        variants={growLine}
        className="mt-4 max-w-[38ch] origin-bottom font-serifDisplay text-[17px] leading-snug text-paperVellum/90 will-change-transform"
      >
        A site-specific timber pavilion, planted so that the garden continues its making.
      </motion.p>
      {/* THE SUBLINE IS THE WHOLE SENTENCE (2026-07-23). Two passes landed here: first the plain
          noun (Clay: a reader "didn't understand what it is that we actually do"), then the cut
          (Clay: "nothing left to take away"). The photograph shows the timber and the planting, so
          the words only have to name the thing. What went: "one of a kind timber structures,
          shaped for your garden, grown through by climbing plants" — every clause of it survives
          below, said once, where it earns its place. */}

      {/* THE FRONT DOOR ASKS FOR AN APPLICATION NOW (2026-08-01, Clay: "Register interest is too
          passive"). The filled action was "See what we're building" into the gallery, on the
          reasoning that the work earns the second minute. That is still true and the gallery is
          still one tap away in the nav — but it made the home a brochure whose only conversion
          point was an email field four screens down, labelled "register interest".

          An APPLICATION to a named, limited thing is a different act from registering an interest:
          it has a subject, it can be accepted or declined, and it implies the reader is choosing to
          be considered rather than choosing to be marketed to. That is the whole change.

          THE SCARCITY LINE IS NOT HERE, AND IT WAS, FOR ABOUT AN HOUR ON 2026-08-01. It sat under
          the button as a two-sentence note and it broke the hero — not subtly. **This block is
          anchored to the BOTTOM of the viewport** (`absolute inset-x-0 bottom-0`), so anything
          added to it grows UPWARD. Three extra lines pushed the h1 into the fixed header: measured
          at 1336x630, the headline's top went to 44px, underneath the nav pill.

          Two lessons, both worth more than the line was. **Adding copy to a bottom-anchored block
          is a layout change, not a copy change** — and it is invisible at the height you happen to
          be testing at (720px was fine; 630px was not). And a hero is a place where each element
          costs the others: five stacked blocks read as clutter however good each one is.

          The line now lives beside the FORM, which is where the terms of an offer belong anyway:
          you read them at the point of deciding, not at the point of being invited.

          The rule that survives untouched: exactly one filled action per page.

          THE QUIET "What one costs" LINK IS GONE (2026-08-03, Clay). Two reasons, and either alone
          would have carried it. The hero was still reading as cluttered after the cohort terms
          moved out, and the one removable element was the second action. And the audience changed
          underneath the link: the founding outreach goes to estates, foundations and institutions,
          and Clay's ruling is that clientele at this range care less about what one costs — so the
          hero's second line should not be a price question. The questions page keeps the ladder,
          one tap away in the nav and behind the close's own door; the hero now makes exactly one
          offer. */}
      <motion.div variants={growLine} className="mt-8 origin-bottom will-change-transform">
        <a
          href={routes.contact}
          data-cursor-solid
          className="group inline-flex items-center gap-2 rounded-full bg-paperVellum px-6 py-3 font-serifDisplay text-[17px] text-inkBlack shadow-sm transition-colors duration-200 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paperVellum [text-shadow:none] [@media(pointer:coarse)]:min-h-[44px]"
        >
          {APPLY_CTA}
          <span aria-hidden className="text-accentOlive transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </a>
      </motion.div>
    </motion.div>
  );
}

/**
 * The beauty still, full-bleed, and THE PAVILION IS THE IMAGE'S OWN VERTICAL CENTRE, which is
 * what keeps it centred on screen at every window shape (2026-07-23, Clay: "the bower ... sits
 * way too high up", with the structure circled on a short laptop window).
 *
 * WHY `object-bottom` WAS THE BUG, and why a different percentage would not have fixed it.
 * `object-bottom` pinned the image's bottom edge, so on a window wider than the photo all the
 * overflow was cropped off the TOP and everything left slid upward: measured at 1339x663, the
 * pavilion's centre landed 135px above the frame's centre. That pin was correct for v3, whose
 * top third was disposable Texas sky. v4 has a manor and mature trees up there and a rose border
 * down here, so there is no longer a throwaway end.
 *
 * A tuned `object-position: 50% N%` cannot solve it either: the vertical overflow depends on the
 * window's aspect, so the N that centres the subject at 1339x663 (~30%) leaves it 18px high at
 * 1440x900 and 45px high on a phone. **The only value that holds for every aspect is 50%** —
 * because `cover` crops symmetrically about the position point, so whatever is at the image's
 * centre stays at the frame's centre, always.
 *
 * So the MASTER was recropped instead of the CSS: the pavilion's bounding box was measured on a
 * percentage grid (crown 29%, base 61%, centre 45%), and 340px was trimmed off the bottom of the
 * 5056x3392 original to move that centre to exactly 50% (now 2560x1545, ratio 1.657). Hence no
 * `object-position` here at all — `cover`'s own 50% 50% default is the whole fix. Re-crop the
 * master if the hero image is ever replaced; do not reach for object-position.
 */
function HeroStill() {
  return (
    <img
      src={HERO_STILL.src}
      srcSet={srcSetFor(HERO_STILL.src)}
      sizes="100vw"
      alt=""
      decoding="async"
      {...{ fetchpriority: "high" }}
      className="absolute inset-0 h-full w-full object-cover object-center"
    />
  );
}

/** The copy sits in a lower-LEFT column so the middle + right of the image stay open. The
 *  legibility scrim is a separate FULL-BLEED layer (see StillHero), not clipped to this
 *  column, so it fades smoothly with no visible horizontal edge. */
function CopyColumn({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 pb-10 pt-40 md:pb-14">
      {/* The hero copy sits in the site frame, so its left edge is the SAME left edge as
          the wordmark above it and the page below it. It used to hug the raw viewport,
          which is why the hero never registered with the rest of the site on a wide
          display. */}
      <Frame measure="canvas">
        <div className="relative mr-auto max-w-[34rem]">{children}</div>
      </Frame>
    </div>
  );
}

/** The finished hero: the beauty still + copy. `animate` drives the one-time copy
 *  growth (browser reveal only); off on poster / reduced-motion. */
function StillHero({ animate }: { animate: boolean }) {
  // Latched once when the intro veil lifts (or immediately if the intro already played
  // this tab / animation is off): flips the copy growth on.
  const [show, setShow] = useState(!animate);
  const latch = useRef(!animate);

  useEffect(() => {
    if (!animate) return;
    const begin = () => {
      if (latch.current) return;
      latch.current = true;
      setShow(true);
    };
    let alreadyPlayed = false;
    try {
      alreadyPlayed = !!sessionStorage.getItem(SESSION_KEY);
    } catch {
      /* private mode: treat as not played -> wait for the intro */
    }
    if (alreadyPlayed) {
      begin();
      return;
    }
    window.addEventListener(INTRO_DONE_EVENT, begin, { once: true });
    return () => window.removeEventListener(INTRO_DONE_EVENT, begin);
  }, [animate]);

  return (
    <section className="relative min-h-screen w-full snap-start overflow-hidden bg-paperVellum text-inkBlack">
      <HeroStill />
      {/* THE LEGIBILITY SCRIM, IN TWO SOFT LAYERS.
          Both are full-bleed (not a clipped bottom column), so there is never a hard horizontal
          edge across the sky.

          (1) The diagonal, unchanged: darkest bottom-left where the copy sits, clearing toward
              the top-right so the structure and the house stay bright.
          (2) A GENTLE FOOT, added 2026-07-23 with the v4 hero. v3's bottom-left was dark
              pavement; v4's is a sunlit rose and lavender border, and over it the subline was
              fighting the flowers. The diagonal alone could not fix that without dimming the
              whole frame, because it is already near-transparent by the middle of the copy's
              own width. This bottom-up stop is confined to the lower ~55% and eases out well
              before the pavilion, so the copy sits on quiet ground and the garden keeps its
              light. Measured against the rendered page, not guessed. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/60 via-black/10 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.34) 18%, rgba(0,0,0,0.12) 38%, transparent 55%)',
        }}
      />
      <CopyColumn>
        <HeroCopy orchestrate={animate} show={show} />
      </CopyColumn>
    </section>
  );
}

export function HeroReveal({ reduced }: { outputs: EngineOutputs; reduced: boolean }) {
  // Client-rendered SPA (createRoot, no hydration). On the server (tests) there is no
  // window -> poster (finished markup, copy present).
  const isBrowser = typeof window !== 'undefined';
  const mode = heroMode({ isBrowser, reduced });
  return <StillHero animate={mode === 'reveal'} />;
}
