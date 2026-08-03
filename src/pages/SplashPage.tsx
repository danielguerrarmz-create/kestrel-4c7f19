/** The front door: one image, one proposition, one action. */
import { useDesign } from '../state/store';
import { useReducedMotion } from '../ui/useReducedMotion';
import { Footer } from '../ui/Footer';
import { routes } from '../routing';
import { srcSetFor } from '../ui/responsiveImg';
import { HeroReveal } from './splash/HeroReveal';
import { SplashHeader } from './splash/SplashHeader';
import { AdaptiveCursor } from './splash/AdaptiveCursor';
import { BowerIntro } from './splash/BowerIntro';

export function SplashPage() {
  const reduced = useReducedMotion();
  const outputs = useDesign((state) => state.outputs);

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
          <div className="max-w-[38rem] [text-shadow:0_1px_18px_rgba(0,0,0,0.5)]">
            <h2 className="font-serifDisplay text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.96] tracking-[-0.025em]">A building you tend.</h2>
            <p className="mt-5 max-w-[42ch] font-serifDisplay text-[clamp(1.05rem,1.7vw,1.35rem)] leading-[1.5] text-paperVellum/90">Timber establishes the form. Planting, weather and the life gathered beneath it continue the architecture.</p>
          </div>
        </div>
      </section>

      <section className="px-gutter py-[clamp(4.5rem,10vw,9rem)]">
        <div className="mx-auto w-full max-w-[920px]">
          <p className="font-serifDisplay text-[clamp(2rem,4.4vw,4rem)] leading-[1.08] tracking-[-0.02em] [text-wrap:balance]">One repeatable timber system. A different Bower for every landscape.</p>
          <div className="mt-9 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[42ch] font-serifDisplay text-[18px] leading-[1.55] text-inkBlack/60">We are selecting three exceptional sites for the system’s founding commissions.</p>
            <a href={routes.contact} className="group inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-full bg-inkBlack px-6 py-3 font-serifDisplay text-[17px] text-paperVellum">Discuss a founding commission <span aria-hidden className="text-accentOlive transition-transform group-hover:translate-x-1">→</span></a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
