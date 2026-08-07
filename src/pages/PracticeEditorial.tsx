import { routes } from '../routing';
import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { srcSetFor } from '../ui/responsiveImg';
import { usePageSnap } from '../ui/usePageSnap';
import { PROJECTS, TEAM } from './about/projects';

const LEAD_WORK = PROJECTS.filter((project) => project.tier === 'lead').map((project) => ({
  ...project,
  image: project.images.find((image) => image.hero) ?? project.images[0],
}));

export function PracticeEditorial() {
  usePageSnap({ wheel: true });

  return (
    <div className="min-h-screen bg-white text-[#11110e]">
      <main>
        <section data-snap-section className="relative flex min-h-[100svh] snap-start items-center px-gutter py-28">
          <EditorialHeader />
          <div className="mx-auto w-full max-w-canvas">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/38">Practice</p>
            <h1 className="mt-10 max-w-[10ch] font-quote text-[clamp(4rem,10vw,10rem)] leading-[0.86] tracking-[-0.05em]">The obsession is old.</h1>
            <p className="ml-auto mt-14 max-w-[28rem] font-serifDisplay text-[clamp(1.2rem,2vw,1.7rem)] leading-[1.45] text-black/50">How can architecture be grown, not only built?</p>
          </div>
        </section>

        <section data-snap-section className="flex min-h-[100svh] snap-start items-center border-t border-black/10 px-gutter py-20">
          <div className="mx-auto w-full max-w-canvas">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/38">Two founders · One practice</p>
            <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-8">
              {TEAM.map((person) => {
                const built = person.facts.find((fact) => fact.label === 'Built');
                return (
                  <article key={person.id} className="grid grid-cols-[7rem_1fr] gap-6 border-t border-black/18 pt-5 sm:grid-cols-[10rem_1fr] md:grid-cols-1">
                    {person.image && <img src={person.image} alt={person.name} loading="eager" decoding="async" className="aspect-[4/5] w-full object-cover grayscale" />}
                    <div>
                      <h2 className="font-quote text-[clamp(2.2rem,4vw,4.2rem)] leading-[0.95] tracking-[-0.035em]">{person.name}</h2>
                      <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.16em] text-black/38 md:text-[9px]">{person.role}</p>
                      {built && <p className="mt-6 max-w-[34rem] font-serifDisplay text-[clamp(1rem,1.5vw,1.25rem)] leading-[1.55] text-black/52">{built.value}</p>}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section data-snap-section className="flex min-h-[100svh] snap-start items-center bg-[#11110e] px-gutter py-16 text-white md:py-24">
          <div className="mx-auto w-full max-w-canvas">
            <div className="flex items-end justify-between gap-8">
              <h2 className="max-w-[10ch] font-quote text-[clamp(3.3rem,7vw,7.4rem)] leading-[0.89] tracking-[-0.045em]">The work came before Bower.</h2>
              <p className="hidden pb-2 text-right font-mono text-[9px] uppercase tracking-[0.18em] text-white/38 sm:block">Architecture<br />Material research<br />Living systems</p>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-2 md:mt-20 md:gap-4">
              {LEAD_WORK.map((project) => (
                <figure key={project.title}>
                  <div className="aspect-[4/5] overflow-hidden bg-white/5 md:aspect-[3/2]">
                    <img src={project.image.src} srcSet={srcSetFor(project.image.src)} sizes="(min-width: 768px) 33vw, 34vw" alt={project.image.alt} loading="eager" decoding="async" className={`h-full w-full ${project.image.fit === 'contain' ? 'object-contain' : 'object-cover'}`} />
                  </div>
                  <figcaption className="mt-3 font-mono text-[8px] uppercase tracking-[0.12em] text-white/45 md:text-[9px]">{project.title} · {project.year}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section data-snap-section className="flex min-h-[100svh] snap-start items-center px-gutter py-20">
          <div className="mx-auto w-full max-w-[1080px]">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/38">Bower · England</p>
            <h2 className="mt-10 max-w-[12ch] font-quote text-[clamp(3.6rem,8vw,8.4rem)] leading-[0.88] tracking-[-0.048em]">A design practice for living structures.</h2>
            <a href={routes.contact} className="mt-12 inline-block border-b border-black/45 pb-1 font-serifDisplay text-[clamp(1.2rem,2vw,1.55rem)]">Introduce a landscape →</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
