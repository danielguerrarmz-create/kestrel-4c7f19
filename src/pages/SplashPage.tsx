/** The front door: one image, one proposition, one action. */
import { useState } from 'react';
import { useDesign } from '../state/store';
import { useReducedMotion } from '../ui/useReducedMotion';
import { Footer } from '../ui/Footer';
import { routes } from '../routing';
import { srcSetFor } from '../ui/responsiveImg';
import { HeroReveal } from './splash/HeroReveal';
import { SplashHeader } from './splash/SplashHeader';
import { AdaptiveCursor } from './splash/AdaptiveCursor';
import { BowerIntro } from './splash/BowerIntro';

const LANDSCAPE_LIFE = [
  {
    title: 'Gather',
    body: 'Meals, conversations, performances and the quiet daily use of a garden.',
    image: '/assets/gallery/favorites/garden-table.webp',
    alt: 'Guests gathered for a meal beneath a planted timber Bower',
    href: routes.commissions,
  },
  {
    title: 'Observe',
    body: 'A sheltered vantage from which planting, weather and the changing seasons become more present.',
    image: '/assets/gallery/favorites/garden-performance.webp',
    alt: 'An audience attending a chamber performance inside a flower-covered timber Bower',
    href: routes.gallery,
  },
  {
    title: 'Tend',
    body: 'A timber framework cared for as the garden grows into it and changes its character.',
    image: '/assets/process/evolution/mature.webp',
    alt: 'A mature Bower integrated with roses, wisteria and surrounding planting',
    href: routes.process,
  },
] as const;

export function SplashPage() {
  const reduced = useReducedMotion();
  const outputs = useDesign((state) => state.outputs);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);

  return (
    <div className="min-h-screen w-full bg-paperVellum text-inkBlack">
      <AdaptiveCursor />
      <BowerIntro />
      <SplashHeader />
      <HeroReveal outputs={outputs} reduced={reduced} />

      <section className="relative min-h-[88svh] overflow-hidden bg-inkBlack text-paperVellum">
        <img
          src="/assets/gallery/favorites/living-bower-interior.webp"
          srcSet={srcSetFor('/assets/gallery/favorites/living-bower-interior.webp')}
          sizes="100vw"
          alt="Inside a living timber Bower, with branching lattice arches, climbing plants and places to sit among the garden"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[88svh] w-full max-w-canvas items-end px-gutter pb-[clamp(3rem,7vw,6rem)] pt-40">
          <div className="max-w-[58rem] [text-shadow:0_1px_18px_rgba(0,0,0,0.5)]">
            <p className="max-w-[52ch] font-serifDisplay text-[clamp(1rem,1.5vw,1.2rem)] italic leading-[1.5] text-paperVellum/80">
              bower, <span className="not-italic font-mono text-[11px] uppercase tracking-[0.14em]">noun</span>. A shaded resting place in a garden, made of woven branches and climbing plants.
            </p>
            {/* The size is capped by HEIGHT as well as width (min(5.8vw, 7.5svh)): on a short
                laptop window the 88svh band shrinks with the viewport while a vw-only clamp kept
                growing with its width, so four lines of display type buried the photograph. On a
                tall monitor 7.5svh clears the old 5.8vw value and nothing changes. */}
            <h2 className="mt-6 max-w-[16ch] font-serifDisplay text-[clamp(2.25rem,min(5.8vw,7.5svh),5.25rem)] leading-[0.98] tracking-[-0.025em]">Designed for your garden, and for the <em className="italic">plant</em> that grows through it.</h2>
          </div>
        </div>
      </section>

      <section className="border-b border-inkBlack/10 px-gutter py-[clamp(5.5rem,12vw,10rem)]">
        <div className="mx-auto w-full max-w-canvas">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-inkBlack/40">A place to inhabit</p>
          <h2 className="mt-5 max-w-[13ch] font-serifDisplay text-[clamp(2.6rem,5.5vw,5.25rem)] leading-[0.98] tracking-[-0.025em] [text-wrap:balance]">Made for the life of a landscape.</h2>
          <div className="mt-[clamp(4rem,8vw,7rem)] grid border-t border-inkBlack/15 md:grid-cols-3">
            {LANDSCAPE_LIFE.map((chapter, index) => (
              <a
                key={chapter.title}
                href={chapter.href}
                onPointerMove={() => setActiveChapter(index)}
                onPointerLeave={() => setActiveChapter(null)}
                onFocus={() => setActiveChapter(index)}
                onBlur={() => setActiveChapter(null)}
                className="group relative isolate min-h-[360px] overflow-hidden border-b border-inkBlack/15 px-6 py-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mossDeep md:border-b-0 md:border-r md:last:border-r-0 lg:min-h-[430px] lg:px-8 lg:py-8"
              >
                <img
                  src={chapter.image}
                  srcSet={srcSetFor(chapter.image)}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  alt={chapter.alt}
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 -z-20 h-full w-full object-cover transition-[opacity,transform] group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100 ${activeChapter === index ? 'scale-100 opacity-100 duration-700 ease-out' : 'scale-[1.035] opacity-0 duration-[1400ms] ease-in-out'}`}
                />
                <div aria-hidden className={`absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/25 to-black/15 transition-opacity group-hover:opacity-100 [@media(hover:none)]:opacity-100 ${activeChapter === index ? 'opacity-100 duration-500' : 'opacity-0 duration-[1200ms]'}`} />
                <div className="flex h-full min-h-[304px] flex-col justify-between lg:min-h-[366px]">
                  <div className={`flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-500 group-hover:text-paperVellum/70 [@media(hover:none)]:text-paperVellum/70 ${activeChapter === index ? 'text-paperVellum/70' : 'text-inkBlack/35'}`}>
                    <span>0{index + 1}</span>
                    <span aria-hidden className="text-base font-normal transition-transform duration-500 group-hover:rotate-45">+</span>
                  </div>
                  <div className={`transition-transform ease-out group-hover:-translate-y-1 motion-reduce:transition-none ${activeChapter === index ? '-translate-y-1 duration-500' : 'translate-y-0 duration-[900ms]'}`}>
                    <h3 className={`font-serifDisplay text-[clamp(1.75rem,2.8vw,2.4rem)] italic transition-colors duration-500 group-hover:text-paperVellum [@media(hover:none)]:text-paperVellum ${activeChapter === index ? 'text-paperVellum' : 'text-inkBlack'}`}>{chapter.title}</h3>
                    <p className={`mt-4 max-w-[32ch] font-serifDisplay text-[17px] leading-[1.6] transition-colors duration-500 group-hover:text-paperVellum/80 [@media(hover:none)]:text-paperVellum/80 ${activeChapter === index ? 'text-paperVellum/80' : 'text-inkBlack/60'}`}>{chapter.body}</p>
                  </div>
                </div>
                <span aria-hidden className={`absolute inset-x-0 top-0 h-px origin-left bg-mossDeep transition-transform ease-out group-hover:scale-x-100 ${activeChapter === index ? 'scale-x-100 duration-700' : 'scale-x-0 duration-[1100ms]'}`} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-gutter py-[clamp(4.5rem,10vw,9rem)]">
        <div className="mx-auto w-full max-w-[920px]">
          <p className="font-serifDisplay text-[clamp(2rem,4.4vw,4rem)] leading-[1.08] tracking-[-0.02em] [text-wrap:balance]">Three founding commissions across England. A different Bower for every landscape.</p>
          <div className="mt-9 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[42ch] font-serifDisplay text-[18px] leading-[1.55] text-inkBlack/60">We are selecting the landscapes now, with first installations targeted for 2027.</p>
            <a href={routes.contact} className="group inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-full bg-inkBlack px-6 py-3 font-serifDisplay text-[17px] text-paperVellum">Discuss a founding commission <span aria-hidden className="text-accentOlive transition-transform group-hover:translate-x-1">→</span></a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
