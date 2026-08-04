import { useState } from 'react';
import { motion } from 'framer-motion';
import { SplashHeader } from './splash/SplashHeader';
import { Footer } from '../ui/Footer';
import { routes } from '../routing';
import { srcSetFor } from '../ui/responsiveImg';
import { STAGE_1_FEE } from '../ui/priceCopy';

/**
 * THE FOUNDING EXCHANGE (2026-08-04). "Founding commission" had been doing the entire job as a
 * label: the site asked someone to be first without ever stating what carrying that buys, and the
 * rational reader's answer to an unstated exchange is to wait and be commission four. These are
 * the terms of being first, stated as a list rather than argued, because a patron at this range
 * is deciding between going first and waiting — not between Bower and something else.
 *
 * The fee figure comes from `STAGE_1_FEE` (one owner, ui/priceCopy.ts); the credit wording here
 * is deliberately the same term `STAGE_1_CREDIT` publishes on /questions. Register: no banned
 * commercial vocabulary (houseRules.test.ts) — these are patrons, not investors.
 */
/** REWRITTEN FOR A READER WHO KNOWS NOTHING (2026-08-05, Clay: "pretend that you are someone
 *  that has no idea what we do!! ... Wth does 'the grammar every later Bower inherits' even
 *  mean???"). Every line is now a plain claim an outsider can parse on first read. The grammar
 *  term died because it described the SYSTEM to a reader who is buying a BUILDING: the
 *  outsider-meaningful fact is simply that theirs is the first one ever built. */
const FOUNDING_TERMS = [
  'Two founders, three landscapes, nothing else.',
  'The first Bower ever built, drawn for your landscape.',
  'Standing by 2027.',
  'Its making filmed, photographed and published.',
  `The ${STAGE_1_FEE} study, credited against the design stage.`,
] as const;

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
        <section className="relative mt-24 h-svh min-h-[560px] overflow-hidden bg-inkBlack text-paperVellum">
          <img
            src="/assets/gallery/exclusive/garden-concert-aerial.webp"
            srcSet={srcSetFor('/assets/gallery/exclusive/garden-concert-aerial.webp')}
            sizes="100vw"
            alt="Aerial view of musicians performing in a planted timber Bower before an audience in an estate garden"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-black/30" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
          <div className="relative z-10 mx-auto flex h-full w-full max-w-canvas items-end px-gutter pb-[clamp(2.5rem,5vw,4rem)]">
            <div className="max-w-[38rem] [text-shadow:0_1px_16px_rgba(0,0,0,0.65)]">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paperVellum/75">The founding commissions</p>
              <h2 className="mt-3 font-serifDisplay text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.04]">Three landscapes will be first.</h2>
              <ul className="mt-6 border-t border-paperVellum/30">
                {FOUNDING_TERMS.map((term) => (
                  <li key={term} className="border-b border-paperVellum/30 py-2.5 font-serifDisplay text-[16px] leading-[1.45]">{term}</li>
                ))}
              </ul>
              <a href={routes.contact} className="group mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-paperVellum px-6 py-3 font-serifDisplay text-[17px] text-inkBlack [text-shadow:none]">Discuss a founding commission <span aria-hidden className="text-mossDeep transition-transform group-hover:translate-x-1">→</span></a>
            </div>
          </div>
          <p className="absolute bottom-3 right-3 z-10 rounded-full bg-paperVellum/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-inkBlack/60 backdrop-blur-sm">Concept visualisation</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
