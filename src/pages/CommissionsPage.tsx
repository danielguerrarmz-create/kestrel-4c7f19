import { useState } from 'react';
import { motion } from 'framer-motion';
import { SplashHeader } from './splash/SplashHeader';
import { Footer } from '../ui/Footer';
import { VisualPlaceholder } from '../ui/VisualPlaceholder';
import { routes } from '../routing';

const COMMISSION_TYPES = [
  {
    id: 'culture',
    label: 'Cultural landscapes',
    title: 'A living work',
    body: 'For sculpture parks, galleries, estates and gardens where a Bower can become an inhabitable work, a place for interpretation and a setting for changing programmes.',
    uses: ['Curator walks', 'Intimate performance', 'Interpretation', 'Daily encounter'],
    image: 'A curator addressing 20 to 30 visitors inside and around a Bower, with sculpture or a significant garden view beyond.',
  },
  {
    id: 'gathering',
    label: 'Hospitality and gathering',
    title: 'A place to gather',
    body: 'For properties where the structure can host seasonal dining, private conversations, member experiences, quiet daily use and intimate celebrations.',
    uses: ['Seasonal table', 'Shared meals', 'Member experiences', 'Quiet daily use'],
    image: 'A long estate table for about 18 people, produce and ceramics on the table, with a gardener, chef or host speaking.',
  },
  {
    id: 'ecology',
    label: 'Ecology and learning',
    title: 'A place to attend to the landscape',
    body: 'For landscapes where it can become a field room, outdoor classroom, observation point or framework gradually inhabited by planting and habitat.',
    uses: ['Field room', 'Outdoor classroom', 'Observation', 'Horticultural workshop'],
    image: 'A guide and visitors using field notes, binoculars, plant samples and a landscape map, with the wider ecology remaining primary.',
  },
] as const;

export function CommissionsPage() {
  const [active, setActive] = useState<(typeof COMMISSION_TYPES)[number]['id']>('culture');
  const item = COMMISSION_TYPES.find((entry) => entry.id === active) ?? COMMISSION_TYPES[0];
  return (
    <div className="min-h-screen bg-paperVellum text-inkBlack">
      <SplashHeader transparent logoPill />
      <main className="mx-auto w-full max-w-canvas px-gutter pb-24 pt-[calc(var(--header-h)+4rem)]">
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

          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16"
          >
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accentOlive">{item.label}</p>
              <h2 className="mt-4 font-serifDisplay text-[clamp(2rem,4vw,3.4rem)] leading-[1.04]">{item.title}</h2>
              <p className="mt-6 font-serifDisplay text-[19px] leading-[1.6] text-inkBlack/70">{item.body}</p>
              <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-3 border-t border-inkBlack/10 pt-6">
                {item.uses.map((use) => <li key={use} className="font-serifDisplay text-[16px] italic text-inkBlack/55">{use}</li>)}
              </ul>
            </div>
            <VisualPlaceholder label={item.title} brief={item.image} />
          </motion.div>
        </section>

        <section className="mt-24 grid gap-8 border-t border-inkBlack/15 pt-12 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-inkBlack/40">The founding commissions</p>
            <h2 className="mt-4 max-w-[18ch] font-serifDisplay text-[clamp(2rem,4vw,3.4rem)] leading-[1.05]">The first landscapes will establish a new architectural tradition.</h2>
            <p className="mt-6 max-w-[62ch] font-serifDisplay text-[18px] leading-[1.6] text-inkBlack/65">Bower is currently developing its first built works for gardens and cultural landscapes in Britain, with initial installations targeted for 2027.</p>
          </div>
          <a href={routes.contact} className="group inline-flex min-h-[44px] items-center gap-2 rounded-full bg-inkBlack px-6 py-3 font-serifDisplay text-[17px] text-paperVellum">Discuss a founding commission <span aria-hidden className="text-accentOlive transition-transform group-hover:translate-x-1">→</span></a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
