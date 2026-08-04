import { useState } from 'react';
import { SplashHeader } from './splash/SplashHeader';
import { Footer } from '../ui/Footer';
import { routes } from '../routing';
import { COMMISSION_BUDGET_POSITION } from '../ui/priceCopy';
import { srcSetFor } from '../ui/responsiveImg';

export const PROCESS_STEPS = [
  { title: 'Conversation', body: 'We begin with the landscape, the people who use it and the kind of life the pavilion should gather.' },
  { title: 'Feasibility', body: 'A paid study tests siting, programme, access, planning constraints, structural and fabrication routes, project range and delivery sequence.' },
  { title: 'Design and engineering', body: 'The form is developed with the appointed structural, fabrication, landscape and specialist teams.' },
  { title: 'Making', body: 'Components are fabricated, trialled where required and assembled on site.' },
  { title: 'Growth and stewardship', body: 'Planting is trained through the structure and cared for as the architecture matures.' },
] as const;

const GROWTH_STAGES = [
  {
    label: 'Installation',
    year: 'Year zero',
    src: '/assets/process/evolution/installation.webp',
    alt: 'A newly installed bare timber Bower in a mature walled garden',
  },
  {
    label: 'Establishing',
    year: 'Year one',
    src: '/assets/process/evolution/establishing.webp',
    alt: 'The same timber Bower as climbing roses and wisteria begin to establish across its lattice',
  },
  {
    label: 'Mature',
    year: 'Year three',
    src: '/assets/process/evolution/mature.webp',
    alt: 'The same Bower with mature roses, wisteria and greenery integrated into its timber lattice',
  },
] as const;

export function ProcessPage() {
  const [active, setActive] = useState(0);
  const [growthStage, setGrowthStage] = useState(0);
  return (
    <div className="min-h-screen bg-paperVellum text-inkBlack">
      <SplashHeader transparent logoPill />
      <main className="mx-auto w-full max-w-canvas px-gutter pb-24 pt-[calc(var(--header-h)+4rem)]">
        <header className="max-w-[62rem]">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-inkBlack/40">Process</p>
          <h1 className="mt-5 font-serifDisplay text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.98] tracking-[-0.025em]">From landscape to Bower.</h1>
          <p className="mt-8 max-w-[62ch] font-serifDisplay text-[clamp(1.1rem,1.8vw,1.4rem)] leading-[1.55] text-inkBlack/70">A clear sequence turns a first image into a responsible commission. The first Bowers are being developed for installation from 2027.</p>
        </header>

        <section className="mt-16 grid gap-12 border-t border-inkBlack/15 pt-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <ol className="border-b border-inkBlack/10">
            {PROCESS_STEPS.map((step, index) => (
              <li key={step.title} className="border-t border-inkBlack/10 first:border-t-0">
                <button type="button" onClick={() => setActive(index)} aria-expanded={active === index} className="flex w-full items-baseline gap-5 py-5 text-left [@media(pointer:coarse)]:min-h-[56px]">
                  <span className="font-serifDisplay text-[14px] italic text-accentOlive">{index + 1}</span>
                  <span className="flex-1 font-serifDisplay text-[clamp(1.25rem,2.4vw,1.75rem)]">{step.title}</span>
                  <span aria-hidden className="font-serifDisplay text-xl text-inkBlack/40">{active === index ? '−' : '+'}</span>
                </button>
                {active === index && <p className="pb-6 pl-9 font-serifDisplay text-[18px] leading-[1.6] text-inkBlack/65">{step.body}</p>}
              </li>
            ))}
          </ol>
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <div className="overflow-hidden border border-inkBlack/15 bg-inkBlack">
              <div className="relative aspect-[11/6] overflow-hidden" aria-live="polite">
                {GROWTH_STAGES.map((stage, index) => (
                  <img
                    key={stage.src}
                    src={stage.src}
                    srcSet={srcSetFor(stage.src)}
                    sizes="(min-width: 1024px) 52vw, 100vw"
                    alt={stage.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${growthStage === index ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
                <p className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/90">
                  {GROWTH_STAGES[growthStage].year} · {GROWTH_STAGES[growthStage].label}
                </p>
              </div>
              <div className="grid grid-cols-3 border-t border-white/20" aria-label="Bower growth stage">
                {GROWTH_STAGES.map((stage, index) => (
                  <button
                    key={stage.label}
                    type="button"
                    onClick={() => setGrowthStage(index)}
                    aria-pressed={growthStage === index}
                    className={`min-h-[46px] border-l border-white/20 px-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors first:border-l-0 ${growthStage === index ? 'bg-paperVellum text-inkBlack' : 'bg-inkBlack text-white/65 hover:text-white'}`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-4 font-serifDisplay text-[15px] italic leading-relaxed text-inkBlack/50">The architecture continues to be made by growth, weather and repeated use.</p>
          </div>
        </section>

        <section className="mt-24 grid gap-10 border-t border-inkBlack/15 pt-12 md:grid-cols-2">
          <div><p className="font-mono text-[11px] uppercase tracking-[0.2em] text-inkBlack/40">Complete project budgets</p><h2 className="mt-4 font-serifDisplay text-[clamp(1.8rem,3vw,2.6rem)] leading-tight">Established through feasibility and engineering.</h2></div>
          <div className="font-serifDisplay text-[18px] leading-[1.65] text-inkBlack/65"><p>{COMMISSION_BUDGET_POSITION} A paid feasibility study establishes the project-specific budget range before a commission is accepted.</p><a href={routes.questions} className="mt-6 inline-flex min-h-[44px] items-center underline decoration-inkBlack/25 underline-offset-4">Read the practical questions</a></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
