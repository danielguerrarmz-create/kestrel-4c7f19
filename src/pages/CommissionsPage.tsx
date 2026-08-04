import { useRef, useState, type RefObject } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SplashHeader } from './splash/SplashHeader';
import { Footer } from '../ui/Footer';
import { routes } from '../routing';
import { srcSetFor } from '../ui/responsiveImg';
import { useReducedMotion } from '../ui/useReducedMotion';

/*
 * THE FOUNDING-TERMS LIST IS GONE (2026-08-05, Clay: "Just remove all of this shit... extra
 * language that doesn't need to exist"). It lived one day, in three shrinking versions. The
 * commercial facts it carried still exist where they belong — the £20,000 study and its credit
 * are the cost answer on /questions — so nothing was lost from the site, only from this band,
 * which now says the one thing an image cannot: three landscapes will be first.
 */

/**
 * A full-bleed image with scroll-linked drift (2026-08-05, Clay: the page read "rather plain
 * for something that is so beautiful"). The img is oversized (124% of its band) and translates
 * vertically as the band crosses the viewport, so the picture moves slower than the page and
 * reads as depth behind it — the same useScroll-on-a-ref pattern the about-tree page uses.
 * ±9% of the image's own height stays inside the 12% bleed at both extremes, so the drift can
 * never expose an edge. Under reduced motion it is a plain cover image, no oversize, no drift.
 */
function ParallaxImg({ containerRef, src, alt }: { containerRef: RefObject<HTMLElement | null>; src: string; alt: string }) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-9%', '9%']);
  return (
    <motion.img
      src={src}
      srcSet={srcSetFor(src)}
      sizes="100vw"
      alt={alt}
      loading="lazy"
      decoding="async"
      style={reduced ? undefined : { y }}
      className={reduced ? 'absolute inset-0 h-full w-full object-cover' : 'absolute left-0 top-[-12%] h-[124%] w-full object-cover'}
    />
  );
}

const COMMISSION_TYPES = [
  {
    id: 'culture',
    label: 'Cultural landscapes',
    title: 'A living work',
    body: 'For sculpture parks, galleries, estates and gardens where a Bower can become an inhabitable work, a place for interpretation and a setting for changing programmes.',
    uses: ['Curator walks', 'Intimate performance', 'Interpretation', 'Daily encounter'],
    src: '/assets/commissions/cultural-landscape-tour.webp',
    alt: 'A curator addressing visitors gathered in and around a planted timber Bower, with a sculpture garden and lake beyond',
  },
  {
    id: 'gathering',
    label: 'Hospitality and gathering',
    title: 'A place to gather',
    body: 'For properties where the structure can host seasonal dining, private conversations, member experiences, quiet daily use and intimate celebrations.',
    uses: ['Seasonal table', 'Shared meals', 'Member experiences', 'Quiet daily use'],
    src: '/assets/gallery/favorites/garden-table.webp',
    alt: 'Guests sharing a long garden lunch beneath a planted timber Bower, with a gardener and garden produce at the table',
  },
  {
    id: 'ecology',
    label: 'Ecology and learning',
    title: 'A place to attend to the landscape',
    body: 'For landscapes where it can become a field room, outdoor classroom, observation point or framework gradually inhabited by planting and habitat.',
    uses: ['Field room', 'Outdoor classroom', 'Observation', 'Horticultural workshop'],
    src: '/assets/commissions/winter-landscape-talk.webp',
    alt: 'A guide speaking to visitors beside a timber Bower in a winter garden, its bare lattice and surrounding landscape held by frost',
  },
] as const;

export function CommissionsPage() {
  const [active, setActive] = useState<(typeof COMMISSION_TYPES)[number]['id']>('culture');
  const interludeRef = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLElement>(null);
  return (
    <div className="min-h-screen bg-paperVellum text-inkBlack">
      <SplashHeader transparent logoPill />
      {/* The container moved off <main> and onto an inner wrapper (2026-08-05) so the founding
          band below can run full-bleed. */}
      <main className="pt-[calc(var(--header-h)+4rem)]">
        <div className="mx-auto w-full max-w-canvas px-gutter">
        <header className="max-w-[58rem]">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-inkBlack/40">Commissions</p>
          <h1 className="mt-5 max-w-[16ch] font-serifDisplay text-[clamp(2.4rem,6vw,5.3rem)] font-medium leading-[0.98] tracking-[-0.025em]">
            What a Bower makes possible.
          </h1>
          <p className="mt-8 max-w-[60ch] font-serifDisplay text-[clamp(1.1rem,1.8vw,1.4rem)] leading-[1.55] text-inkBlack/70">
            Each Bower begins with a landscape and the life already gathering there. It is drawn for one place, not selected from a catalogue.
          </p>
        </header>
        </div>

        {/* THE WISTERIA INTERLUDE (2026-08-05, Clay: "rather plain for something that is so
            beautiful"). A full-spread image moment with ZERO copy — under the take-everything-
            away law, the richest thing this page can gain is a picture that says nothing. It
            drifts on scroll (ParallaxImg) so the page has depth, and it carries the
            concept-visualisation label like every render on this site. */}
        <section ref={interludeRef} className="relative mt-16 h-[72svh] min-h-[420px] overflow-hidden bg-inkBlack sm:mt-24">
          <ParallaxImg
            containerRef={interludeRef}
            src="/assets/gallery/01-wisteria-walk.webp"
            alt="A walk beneath a run of woven timber lattice arches, wisteria hanging through the crown, cafe tables to one side and a stone manor beyond"
          />
          <p className="absolute bottom-3 right-3 z-10 rounded-full bg-paperVellum/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-inkBlack/60 backdrop-blur-sm">Concept visualisation</p>
        </section>

        <div className="mx-auto w-full max-w-canvas px-gutter">
        <section className="mt-16 border-t border-inkBlack/15 pt-8 sm:mt-24">
          <div role="tablist" aria-label="Commission settings" className="flex flex-wrap gap-2">
            {COMMISSION_TYPES.map((entry) => (
              <button
                key={entry.id}
                type="button"
                role="tab"
                aria-selected={active === entry.id}
                onClick={() => setActive(entry.id)}
                className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors [@media(pointer:coarse)]:min-h-[44px] ${active === entry.id ? 'border-inkBlack bg-inkBlack text-paperVellum' : 'border-inkBlack/20 text-inkBlack/60 hover:border-inkBlack/50'}`}
              >
                {entry.label}
              </button>
            ))}
          </div>

          {/* EVERY PANEL RENDERS; the inactive ones are `hidden`, not absent (2026-08-04).
              Only the active tab existed in the DOM, so renderToString — and therefore the agent
              mirror at /agent/commissions.md — showed one category of three, and an AI assistant
              pre-reading the site for its owner never saw hospitality or ecology. `hidden` keeps
              the content in the render (htmlToMarkdown drops aria-hidden, not hidden) while
              display:none keeps lazy images unfetched. The keyed remount that played the entrance
              animation is preserved: the active panel alone wears the motion wrapper. */}
          {COMMISSION_TYPES.map((entry) => {
            const panel = (
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accentOlive">{entry.label}</p>
                  <h2 className="mt-4 font-serifDisplay text-[clamp(2rem,4vw,3.4rem)] leading-[1.04]">{entry.title}</h2>
                  <p className="mt-6 font-serifDisplay text-[19px] leading-[1.6] text-inkBlack/70">{entry.body}</p>
                  <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-inkBlack/10 pt-6">
                    {entry.uses.map((use) => <li key={use} className="font-serifDisplay text-[16px] italic text-inkBlack/55">{use}</li>)}
                  </ul>
                </div>
                <figure className="relative aspect-[16/10] overflow-hidden bg-paperDeep">
                  <img
                    src={entry.src}
                    srcSet={srcSetFor(entry.src)}
                    sizes="(max-width: 1024px) calc(100vw - 2.5rem), min(54vw, 720px)"
                    alt={entry.alt}
                    width={1920}
                    height={1047}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <figcaption className="absolute bottom-3 right-3 rounded-full bg-paperVellum/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-inkBlack/60 backdrop-blur-sm">
                    Concept visualisation
                  </figcaption>
                </figure>
              </div>
            );
            return (
              <div key={entry.id} role="tabpanel" hidden={entry.id !== active} className="mt-10">
                {entry.id === active ? (
                  <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                    {panel}
                  </motion.div>
                ) : (
                  panel
                )}
              </div>
            );
          })}
        </section>

        </div>

        {/* THE FOUNDING BAND: FULL-BLEED OVER THE PRODUCT, EXACTLY ONE VIEWPORT (2026-08-05,
            Clay, two rounds). Round one put the ask on the image; round two cut it to the bone:
            "clear, punchy, simple, and also elegant... it should fit all on one page." So the
            band is h-svh, not min-h — the reader never scrolls THROUGH the image — the heading
            is five words, the list label is gone, and the scrim is a flat darkening plus a
            bottom gradient because legibility was ruled before atmosphere. The render keeps its
            concept-visualisation label, as every render on this site must. */}
        <section ref={bandRef} className="relative mt-24 h-svh min-h-[560px] overflow-hidden bg-inkBlack text-paperVellum">
          <ParallaxImg
            containerRef={bandRef}
            src="/assets/gallery/exclusive/garden-concert-aerial.webp"
            alt="Aerial view of musicians performing in a planted timber Bower before an audience in an estate garden"
          />
          <div aria-hidden className="absolute inset-0 bg-black/30" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
          <div className="relative z-10 mx-auto flex h-full w-full max-w-canvas items-end px-gutter pb-[clamp(2.5rem,5vw,4rem)]">
            <div className="max-w-[38rem] [text-shadow:0_1px_16px_rgba(0,0,0,0.65)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paperVellum/75">The founding commissions</p>
              {/* THE FUNNEL ADVANCES, IT DOES NOT REPEAT (2026-08-05, Clay): the home announces
                  "three founding commissions"; this band's job is the personal turn, not the
                  same announcement again. Home owns the count; this owns "yours". */}
              <h2 className="mt-3 font-serifDisplay text-[clamp(2.1rem,4.2vw,3.6rem)] leading-[1.04]">Yours could be the first.</h2>
              <a href={routes.contact} className="group mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-paperVellum px-6 py-3 font-serifDisplay text-[17px] text-inkBlack [text-shadow:none]">Discuss a founding commission <span aria-hidden className="text-mossDeep transition-transform group-hover:translate-x-1">→</span></a>
            </div>
          </div>
          <p className="absolute bottom-3 right-3 z-10 rounded-full bg-paperVellum/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-inkBlack/60 backdrop-blur-sm">Concept visualisation</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
