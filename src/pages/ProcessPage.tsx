import { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { SplashHeader } from './splash/SplashHeader';
import { Footer } from '../ui/Footer';
import { routes } from '../routing';
import { srcSetFor } from '../ui/responsiveImg';
import { useReducedMotion } from '../ui/useReducedMotion';

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

function GrowthEvolution() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  // Wheel events arrive in visible steps. The spring turns that staircase into a continuous
  // photographic dissolve, while the long overlaps keep a single hard handoff from ever appearing.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 18,
    mass: 0.25,
    restDelta: 0.0005,
  });
  const installationOpacity = useTransform(smoothProgress, [0, 0.2, 0.48], [1, 1, 0]);
  const establishingOpacity = useTransform(smoothProgress, [0.18, 0.42, 0.58, 0.82], [0, 1, 1, 0]);
  const matureOpacity = useTransform(smoothProgress, [0.55, 0.84, 1], [0, 1, 1]);
  const opacities = [installationOpacity, establishingOpacity, matureOpacity] as const;

  if (reduced) {
    return (
      <section className="mt-16 bg-inkBlack px-gutter py-16 text-paperVellum" aria-labelledby="growth-evolution-title">
        <div className="mx-auto w-full max-w-canvas">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paperVellum/55">Year zero to year three</p>
          <h2 id="growth-evolution-title" className="mt-4 max-w-[18ch] font-serifDisplay text-[clamp(2rem,4vw,4rem)] leading-[1.02]">The garden continues the architecture.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {GROWTH_STAGES.map((stage) => (
              <figure key={stage.src}>
                <img src={stage.src} srcSet={srcSetFor(stage.src)} sizes="(min-width: 768px) 33vw, 100vw" alt={stage.alt} loading="lazy" decoding="async" className="aspect-[11/6] w-full object-cover" />
                <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-paperVellum/60">{stage.year} · {stage.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative mt-16 h-[340svh] bg-inkBlack" aria-labelledby="growth-evolution-title">
      <div className="sticky top-0 h-svh overflow-hidden bg-inkBlack text-paperVellum">
        {GROWTH_STAGES.map((stage, index) => (
          <motion.img
            key={stage.src}
            src={stage.src}
            srcSet={srcSetFor(stage.src)}
            sizes="100vw"
            alt={stage.alt}
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center will-change-[opacity] [transform:translateZ(0)]"
            style={{ opacity: opacities[index] }}
          />
        ))}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
        <div className="absolute inset-0 mx-auto flex w-full max-w-canvas flex-col justify-between px-gutter pb-10 pt-[calc(var(--header-h)+2.5rem)] md:pb-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paperVellum/65">Year zero to year three</p>
            <h2 id="growth-evolution-title" className="mt-4 max-w-[16ch] font-serifDisplay text-[clamp(2.4rem,5.5vw,5.5rem)] leading-[0.98] tracking-[-0.025em] [text-shadow:0_1px_20px_rgba(0,0,0,0.45)]">The garden continues the architecture.</h2>
          </div>
          <div className="relative min-h-12 border-l border-paperVellum/35 pl-4 font-mono text-[11px] uppercase tracking-[0.16em] text-paperVellum/80">
            {GROWTH_STAGES.map((stage, index) => (
              <motion.p key={stage.label} aria-hidden className="absolute inset-y-0 left-4 flex items-center" style={{ opacity: opacities[index] }}>
                {stage.year} · {stage.label}
              </motion.p>
            ))}
            <span className="sr-only">The same Bower is shown at installation, with establishing planting and with mature planting.</span>
          </div>
        </div>
        <motion.div data-growth-progress aria-hidden className="absolute inset-x-0 bottom-0 h-px origin-left bg-mossDeep/70" style={{ scaleX: smoothProgress }} />
      </div>
    </section>
  );
}

export function ProcessPage() {
  const [active, setActive] = useState(0);
  return (
    <div className="min-h-screen bg-paperVellum text-inkBlack">
      <SplashHeader transparent logoPill />
      <main className="pb-24 pt-[calc(var(--header-h)+4rem)]">
        <header className="mx-auto w-full max-w-canvas px-gutter">
          <div className="max-w-[62rem]">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-inkBlack/40">Process</p>
          <h1 className="mt-5 font-serifDisplay text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.98] tracking-[-0.025em]">From landscape to Bower.</h1>
          {/* REWRITTEN 2026-08-04 (Clay: "wth does this line even mean"). It read "A clear
              sequence turns a first image into a responsible commission" — the site describing
              its own process page instead of telling the reader what happens. The standfirst now
              states the sequence's actual promise: what the steps are FOR, in the reader's terms. */}
          <p className="mt-8 max-w-[62ch] font-serifDisplay text-[clamp(1.1rem,1.8vw,1.4rem)] leading-[1.55] text-inkBlack/70">Five steps take a Bower from a first conversation in your garden to a structure the garden finishes. The first installations are planned for 2027.</p>
          </div>
        </header>

        <GrowthEvolution />

        <section className="mx-auto mt-24 grid w-full max-w-canvas gap-12 px-gutter lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-inkBlack/40">Commissioning sequence</p>
            <h2 className="mt-4 max-w-[12ch] font-serifDisplay text-[clamp(1.8rem,3.5vw,3.4rem)] leading-[1.02]">Five steps from conversation to stewardship.</h2>
            <a href={routes.commissions} className="group mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-inkBlack px-6 py-3 font-serifDisplay text-[17px] text-paperVellum">What a Bower makes possible <span aria-hidden className="text-accentOlive transition-transform group-hover:translate-x-1">→</span></a>
          </div>
          <ol className="border-b border-inkBlack/10">
            {PROCESS_STEPS.map((step, index) => (
              <li key={step.title} className="border-t border-inkBlack/10 first:border-t-0">
                <button type="button" onClick={() => setActive(index)} aria-expanded={active === index} className="flex w-full items-baseline gap-5 py-5 text-left [@media(pointer:coarse)]:min-h-[56px]">
                  <span data-process-step-number className="font-serifDisplay text-[13px] italic text-mossDeep/75">{index + 1}</span>
                  <span className="flex-1 font-serifDisplay text-[clamp(1.25rem,2.4vw,1.75rem)]">{step.title}</span>
                  <span aria-hidden className="font-serifDisplay text-xl text-inkBlack/40">{active === index ? '−' : '+'}</span>
                </button>
                {/* `hidden`, not conditional render (2026-08-04): only the open step's body
                    existed in the DOM, so the agent mirror showed a five-step sequence with four
                    empty steps — the page that exists to prove responsible sequencing described
                    only step 1 to any non-clicking reader. */}
                <p hidden={active !== index} className="pb-6 pl-9 font-serifDisplay text-[18px] leading-[1.6] text-inkBlack/65">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

      </main>
      <Footer />
    </div>
  );
}
