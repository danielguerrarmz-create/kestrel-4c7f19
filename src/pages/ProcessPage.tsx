import { routes } from '../routing';
import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { srcSetFor } from '../ui/responsiveImg';
import { usePageSnap } from '../ui/usePageSnap';

export const PROCESS_STEPS = [
  { title: 'Conversation', body: 'Landscape, people, purpose.' },
  { title: 'Feasibility', body: 'Site, consent, route, cost.' },
  { title: 'Design', body: 'Geometry, structure, planting.' },
  { title: 'Making', body: 'Fabrication and assembly.' },
  { title: 'Stewardship', body: 'Training, growth, care.' },
] as const;

const GROWTH_STAGES = [
  { year: '00', label: 'A lattice', src: '/assets/process/evolution/installation.webp', alt: 'Concept visualisation of a newly installed bare timber Bower' },
  { year: '01', label: 'Leaves in the weave', src: '/assets/process/evolution/establishing.webp', alt: 'Concept visualisation of the same Bower as planting begins to establish' },
  { year: '03', label: 'A room of blossom and eaves', src: '/assets/process/evolution/mature.webp', alt: 'Concept visualisation of the same Bower with mature planting through its lattice' },
] as const;

export function ProcessPage() {
  usePageSnap({ wheel: true });

  return (
    <div className="min-h-screen bg-white text-[#11110e]">
      <main>
        <section data-snap-section className="relative flex min-h-[100svh] snap-start items-center px-gutter py-28">
          <EditorialHeader />
          <div className="mx-auto w-full max-w-canvas">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/38">Making</p>
            <h1 className="mt-10 max-w-[11ch] font-quote text-[clamp(4rem,10vw,10rem)] leading-[0.86] tracking-[-0.05em]">From landscape to Bower.</h1>
            <p className="ml-auto mt-14 max-w-[23rem] font-serifDisplay text-[clamp(1.15rem,1.9vw,1.55rem)] leading-[1.5] text-black/48">The structure is finished once. The garden never is.</p>
          </div>
        </section>

        <section data-snap-section className="flex min-h-[100svh] snap-start items-center border-t border-black/10 px-gutter py-[clamp(7rem,14vw,14rem)]">
          <div className="mx-auto w-full max-w-canvas">
            <p className="max-w-[36rem] font-serifDisplay text-[clamp(1.2rem,2.1vw,1.75rem)] leading-[1.55] text-black/52">
              Ask anyone for the most beautiful place they have ever stood in and they rarely name a building. They name a hollow under a beech. A cave mouth above a beach. A path where the hedge grew over into a tunnel.
            </p>
            <h2 className="ml-auto mt-[clamp(6rem,14vw,13rem)] max-w-[12ch] text-right font-quote text-[clamp(3.5rem,8vw,8.5rem)] leading-[0.88] tracking-[-0.05em]">
              None of them finished. All of them alive.
            </h2>
          </div>
        </section>

        <section data-snap-section className="flex min-h-[100svh] snap-start items-center overflow-hidden bg-[#11110e] px-gutter py-[clamp(2rem,5svh,4rem)] text-white">
          <div className="mx-auto w-full max-w-canvas">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/42">We build for that</p>
            <div className="mt-[clamp(1.25rem,3svh,2rem)] grid gap-5 md:grid-cols-[1.2fr_.8fr] md:items-end md:gap-10">
              <h2 className="max-w-[10ch] font-quote text-[clamp(3.2rem,6vw,7rem)] leading-[0.89] tracking-[-0.045em]">Built to be unfinished.</h2>
              <p className="max-w-[30rem] font-serifDisplay text-[clamp(1rem,1.35vw,1.3rem)] leading-[1.48] text-white/58">A Bower begins as a woven, load-bearing timber lattice. Over three years, wisteria, rose or vine grows through it until structure and garden become one.</p>
            </div>
            <div className="mt-[clamp(2rem,5svh,3.5rem)] grid grid-cols-3 gap-2 md:gap-4">
              {GROWTH_STAGES.map((stage) => (
                <figure key={stage.src}>
                  <div className="aspect-[3/2] overflow-hidden bg-white/5 md:aspect-auto md:h-[clamp(10rem,33svh,20rem)]">
                    <img src={stage.src} srcSet={srcSetFor(stage.src)} sizes="(min-width: 768px) 33vw, 34vw" alt={stage.alt} loading="eager" decoding="async" className="h-full w-full object-cover" />
                  </div>
                  <figcaption className="mt-3 flex flex-col gap-1 font-mono text-[8px] uppercase tracking-[0.12em] text-white/48 md:flex-row md:gap-3 md:text-[9px]">
                    <span>{stage.year}</span><span>{stage.label}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section data-snap-section className="flex min-h-[100svh] snap-start items-center px-gutter py-20">
          <div className="mx-auto grid w-full max-w-canvas gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/38">A disciplined route</p>
              <h2 className="mt-8 max-w-[8ch] font-quote text-[clamp(3.3rem,7vw,7.2rem)] leading-[0.89] tracking-[-0.045em]">Five acts of making.</h2>
            </div>
            <ol className="border-t border-black/18">
              {PROCESS_STEPS.map((step, index) => (
                <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-4 border-b border-black/14 py-4 md:grid-cols-[3rem_1fr_1fr] md:py-5">
                  <span className="font-mono text-[9px] text-black/32">0{index + 1}</span>
                  <span className="font-serifDisplay text-[clamp(1.15rem,2vw,1.55rem)]">{step.title}</span>
                  <span className="col-start-2 font-mono text-[8px] uppercase tracking-[0.13em] text-black/38 md:col-start-auto md:self-center md:text-[9px]">{step.body}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section data-snap-section className="relative flex min-h-[100svh] snap-start items-end overflow-hidden bg-[#11110e] px-gutter py-16 text-white md:py-24">
          <img src="/assets/gallery/favorites/english-garden-path.webp" srcSet={srcSetFor('/assets/gallery/favorites/english-garden-path.webp')} sizes="100vw" alt="Concept visualisation of a planted Bower within an English garden" loading="eager" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/8 to-black/18" />
          <div className="relative mx-auto w-full max-w-canvas">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">Founding commissions · 2027</p>
            <h2 className="mt-7 max-w-[11ch] font-quote text-[clamp(3.3rem,7vw,7.5rem)] leading-[0.89] tracking-[-0.045em]">Every landscape asks for a different answer.</h2>
            <a href={routes.contact} className="mt-9 inline-block border-b border-white/60 pb-1 font-serifDisplay text-[clamp(1.15rem,2vw,1.5rem)]">Introduce yours →</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
