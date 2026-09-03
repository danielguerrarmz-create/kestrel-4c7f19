import { useRef, useState, type RefObject } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SplashHeader } from './splash/SplashHeader';
import { Footer } from '../ui/Footer';
import { routes } from '../routing';
import { srcSetFor } from '../ui/responsiveImg';
import { usePageSnap } from '../ui/usePageSnap';
import { useReducedMotion } from '../ui/useReducedMotion';
import { FOUNDING_SITE_STUDY_FEE_INTERNATIONAL } from '../ui/priceCopy';

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

/*
 * BODIES REWRITTEN 2026-08-05 (Clay: same pass as the splash cards — beautiful and deliberate,
 * concrete over categorical). Each body keeps its audience list (named places are the good kind
 * of list) and trades the trailing abstractions ("interpretation", "changing programmes",
 * "member experiences") for things a reader can picture. "Member experiences" also left the
 * uses column: nobody has ever stood in one.
 */
const COMMISSION_TYPES = [
  {
    id: 'culture',
    label: 'Cultural landscapes',
    title: 'A living work',
    body: 'For sculpture parks, galleries, estates and gardens: a work to stand inside, changing with the garden that holds it.',
    uses: ['Curator walks', 'Intimate performance', 'Readings and talks', 'Daily encounter'],
    src: '/assets/commissions/cultural-landscape-tour.webp',
    alt: 'A curator addressing visitors gathered in and around a planted timber Bower, with a sculpture garden and lake beyond',
  },
  {
    id: 'gathering',
    label: 'Hospitality and gathering',
    title: 'A place to gather',
    body: 'For houses and gardens that receive guests: a table under the lattice, a small ceremony, an evening that ends in the garden.',
    uses: ['Seasonal table', 'Shared meals', 'Private gatherings', 'Quiet daily use'],
    src: '/assets/gallery/favorites/garden-table.webp',
    alt: 'Guests sharing a long garden lunch beneath a planted timber Bower, with a gardener and garden produce at the table',
  },
  {
    id: 'ecology',
    label: 'Ecology and learning',
    title: 'A place to attend to the landscape',
    body: 'For land that is studied and taught: a field room, a classroom under leaves, a hide the habitat slowly claims.',
    uses: ['Field room', 'Outdoor classroom', 'Observation', 'Horticultural workshop'],
    src: '/assets/commissions/winter-landscape-talk.webp',
    alt: 'A guide speaking to visitors beside a timber Bower in a winter garden, its bare lattice and surrounding landscape held by frost',
  },
] as const;

const STUDY_DELIVERABLES = [
  'A serious site decision',
  'One preliminary Bower proposition',
  'Early planning, structural and fabrication thinking',
  'A credible cost range and programme',
  'A defined proceed, pause or stop decision',
  'A reserved route toward one of three founding commissions',
] as const;

const APPOINTMENT_GATES = [
  {
    number: '01',
    title: 'Before the study',
    body: 'The agreement, scope, fixed fee, four-week timetable and the professional arrangements required for the study are confirmed before appointment.',
  },
  {
    number: '02',
    title: 'During the study',
    body: 'Bower tests the place, the proposition and the route to planning, engineering and fabrication. Specialist input is matched to the work as it becomes clear.',
  },
  {
    number: '03',
    title: 'After the study',
    body: 'The patron chooses to proceed, pause or stop. Concept Design and construction are separate appointments. No construction commitment is made in the study.',
  },
] as const;

export function CommissionsPage() {
  const [active, setActive] = useState<(typeof COMMISSION_TYPES)[number]['id']>('culture');
  const interludeRef = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLElement>(null);

  /* A SLIGHT snap on the page's sections (2026-08-05, Clay): the two full-viewport image
     bands and the tab section settle to their tops when a scroll ends NEAR them. The ruling
     and the mechanics (proximity, <html>, scroll-padding) live in usePageSnap — this page's
     inline effect became the site-wide pattern on 2026-08-06. */
  usePageSnap({ strength: 'proximity', mobileStrength: 'proximity' });

  return (
    <div className="min-h-screen bg-paperVellum text-inkBlack">
      {/* Default header (frosted pills), the home's proven treatment over imagery — the page
          now LANDS on a render. */}
      <SplashHeader />
      <main>
        {/* THE PAGE OPENS ON THE PRODUCT (2026-08-05, Clay: "When you land on the commissions
            page, you land on the full bleed render, with the text on top of it. Condense it
            into one clean section, like the homepage."). One hero: the wisteria walk at full
            viewport, drifting on scroll, with the page's own heading held at its foot — the
            home's dictionary-band composition. The separate padded header and the standalone
            interlude this replaced are gone. NO concept-visualisation tag ("they are aware");
            the unbuilt record lives on /questions Q6, the gallery, and llms.txt. */}
        <section ref={interludeRef} className="relative h-svh min-h-[560px] snap-start overflow-hidden bg-inkBlack text-paperVellum">
          <ParallaxImg
            containerRef={interludeRef}
            src="/assets/gallery/01-wisteria-walk.webp"
            alt="A walk beneath a run of woven timber lattice arches, wisteria hanging through the crown, cafe tables to one side and a stone manor beyond"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
          <div className="relative z-10 mx-auto flex h-full w-full max-w-canvas items-end px-gutter pb-[clamp(2.5rem,6vw,5rem)]">
            <header className="max-w-[58rem] [text-shadow:0_1px_18px_rgba(0,0,0,0.55)]">
              {/* Four segments was already one too many, and "Based in England" was the one doing
                  least work here: this page is about where a Bower GOES, and the practice's own
                  address lives on /about/practice and in the footer. "Working internationally"
                  became "across Europe" for the 2026-09 patron outreach — 28 of 30 prospects are on
                  the continent, and "internationally" is the word every English exporter uses to
                  mean "we would consider it". */}
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-paperVellum/70">Three founding commissions · Working across Europe · 2027</p>
              <h1 className="mt-4 max-w-[16ch] font-serifDisplay text-[clamp(2.4rem,6vw,5.3rem)] font-medium leading-[0.98] tracking-[-0.025em]">
                What a Bower makes possible.
              </h1>
              <p className="mt-6 max-w-[60ch] font-serifDisplay text-[clamp(1.1rem,1.8vw,1.4rem)] leading-[1.55] text-paperVellum/85">
                Each Bower begins with what a particular landscape is trying to become: a room for consequential conversation, a living landmark, a place to gather, or a work that changes every season.
              </p>
            </header>
          </div>
        </section>

        <div className="mx-auto w-full max-w-canvas px-gutter">
        {/* `scroll-mt` keeps the snapped tab row clear of the fixed header. */}
        <section className="mt-16 snap-start scroll-mt-[calc(var(--header-h)+1rem)] border-t border-inkBlack/15 pt-8 sm:mt-24">
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

        <section className="mt-[clamp(5rem,10vw,9rem)] bg-paperDeep px-gutter py-[clamp(5rem,10vw,9rem)] text-inkBlack">
          <div className="mx-auto grid w-full max-w-canvas gap-14 lg:grid-cols-[.78fr_1.22fr] lg:gap-20">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accentOlive">The first appointment</p>
              <h2 className="mt-5 max-w-[11ch] font-serifDisplay text-[clamp(2.8rem,5.5vw,5.5rem)] font-medium leading-[0.96] tracking-[-0.035em]">Four weeks to make a serious decision.</h2>
              <p className="mt-6 max-w-[34rem] font-serifDisplay text-[clamp(1.08rem,1.7vw,1.35rem)] leading-[1.58] text-inkBlack/68">The Founding Site Study turns an instinct about the landscape into a proposition a family, estate team or board can assess with confidence.</p>
              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-inkBlack/12">
                <div className="bg-paperVellum p-5 sm:p-6">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-inkBlack/48">Fixed fee</dt>
                  <dd className="mt-2 font-serifDisplay text-[clamp(1.5rem,3vw,2.4rem)]">{FOUNDING_SITE_STUDY_FEE_INTERNATIONAL}</dd>
                </div>
                <div className="bg-paperVellum p-5 sm:p-6">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-inkBlack/48">Timetable</dt>
                  <dd className="mt-2 font-serifDisplay text-[clamp(1.5rem,3vw,2.4rem)]">Four weeks</dd>
                </div>
              </dl>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-inkBlack/45">Plus approved travel and project expenses · Half payable on appointment</p>
              <p className="mt-3 max-w-[36rem] font-serifDisplay text-[14px] leading-[1.5] text-inkBlack/52">Tax treatment is confirmed according to the client and project location.</p>
            </div>

            <div>
              <p className="max-w-[42rem] font-serifDisplay text-[clamp(1.25rem,2.1vw,1.65rem)] leading-[1.5]">The fee buys clarity, not a predetermined answer.</p>
              <ol className="mt-7 border-t border-inkBlack/18">
                {STUDY_DELIVERABLES.map((item, index) => (
                  <li key={item} className="grid grid-cols-[2rem_1fr] gap-4 border-b border-inkBlack/14 py-4 sm:grid-cols-[3rem_1fr] sm:py-5">
                    <span className="font-mono text-[10px] text-inkBlack/38">0{index + 1}</span>
                    <span className="font-serifDisplay text-[clamp(1.08rem,1.7vw,1.3rem)] leading-[1.38]">{item}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-8 rounded-2xl bg-paperVellum p-6 sm:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accentOlive">A valid outcome</p>
                <p className="mt-3 font-serifDisplay text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.34]">The study may conclude that a Bower does not belong on the property. That discipline is part of what the patron is buying.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-paperVellum px-gutter py-[clamp(5rem,10vw,9rem)] text-inkBlack">
          <div className="mx-auto w-full max-w-canvas">
            <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accentOlive">A controlled route to delivery</p>
              <div>
                <h2 className="max-w-[13ch] font-serifDisplay text-[clamp(2.8rem,5.5vw,5.5rem)] font-medium leading-[0.96] tracking-[-0.035em]">Commitment increases only as certainty does.</h2>
                <p className="mt-6 max-w-[43rem] font-serifDisplay text-[clamp(1.08rem,1.7vw,1.35rem)] leading-[1.58] text-inkBlack/66">Bower leads the commission and assembles the engineering, fabrication, planning and landscape expertise appropriate to the site. The team is defined by the work, not borrowed as decoration for a sales page.</p>
              </div>
            </div>

            <ol className="mt-[clamp(3rem,7vw,6rem)] grid gap-px overflow-hidden rounded-2xl bg-inkBlack/12 lg:grid-cols-3">
              {APPOINTMENT_GATES.map((gate) => (
                <li key={gate.number} className="bg-paperDeep p-6 sm:p-8 lg:min-h-[22rem] lg:p-10">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-inkBlack/38">{gate.number}</span>
                  <h3 className="mt-12 font-serifDisplay text-[clamp(1.7rem,2.8vw,2.5rem)] leading-[1.05]">{gate.title}</h3>
                  <p className="mt-5 font-serifDisplay text-[clamp(1rem,1.4vw,1.16rem)] leading-[1.6] text-inkBlack/65">{gate.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-col gap-5 border-t border-inkBlack/18 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[45rem] font-serifDisplay text-[clamp(1.1rem,1.6vw,1.3rem)] leading-[1.5]">The study agreement and professional arrangements are conditions of appointment. Construction begins only under a later, separate commitment.</p>
              <a href={routes.process} className="inline-flex shrink-0 items-center border-b border-inkBlack/45 pb-1 font-serifDisplay text-[16px]">See the full process <span aria-hidden className="ml-2">→</span></a>
            </div>
          </div>
        </section>

        {/* THE FOUNDING BAND: FULL-BLEED OVER THE PRODUCT, EXACTLY ONE VIEWPORT (2026-08-05,
            Clay, two rounds). Round one put the ask on the image; round two cut it to the bone:
            "clear, punchy, simple, and also elegant... it should fit all on one page." So the
            band is h-svh, not min-h — the reader never scrolls THROUGH the image — the heading
            is five words, the list label is gone, and the scrim is a flat darkening plus a
            bottom gradient because legibility was ruled before atmosphere. The render keeps its
            concept-visualisation label, as every render on this site must. */}
        <section ref={bandRef} className="relative min-h-[88svh] snap-start overflow-hidden bg-inkBlack text-paperVellum">
          <ParallaxImg
            containerRef={bandRef}
            src="/assets/gallery/exclusive/garden-concert-aerial.webp"
            alt="Aerial view of musicians performing in a planted timber Bower before an audience in an estate garden"
          />
          <div aria-hidden className="absolute inset-0 bg-black/30" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
          <div className="relative z-10 mx-auto flex min-h-[88svh] w-full max-w-canvas items-center px-gutter py-24">
            <div className="max-w-[43rem] [text-shadow:0_1px_16px_rgba(0,0,0,0.65)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paperVellum/75">Three founding commissions · 2027</p>
              {/* THE FUNNEL ADVANCES, IT DOES NOT REPEAT (2026-08-05, Clay): the home announces
                  "three founding commissions"; this band's job is the personal turn, not the
                  same announcement again. Home owns the count; this owns "yours". */}
              <h2 className="mt-4 max-w-[11ch] font-serifDisplay text-[clamp(2.8rem,5.8vw,5.6rem)] font-medium leading-[0.96] tracking-[-0.035em]">Three landscapes will define the first chapter.</h2>
              <p className="mt-6 max-w-[36rem] font-serifDisplay text-[clamp(1.08rem,1.7vw,1.35rem)] leading-[1.55] text-paperVellum/82">Founding patrons work directly with Bower’s founders, shape how the first works are documented and stewarded, and reserve a route toward one of three commissions. The Founding Site Study is the first decision, not a construction deposit.</p>
              <a href={routes.contact} className="group mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-paperVellum px-6 py-3 font-serifDisplay text-[17px] text-inkBlack [text-shadow:none]">Discuss a founding commission <span aria-hidden className="text-mossDeep transition-transform group-hover:translate-x-1">→</span></a>
              <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.13em] text-paperVellum/55">Concept visualisation</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
