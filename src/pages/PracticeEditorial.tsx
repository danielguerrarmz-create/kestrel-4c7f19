import { routes } from '../routing';
import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { srcSetFor } from '../ui/responsiveImg';
import { usePageSnap } from '../ui/usePageSnap';
import { useReducedMotion } from '../ui/useReducedMotion';
import { PROJECTS, TEAM } from './about/projects';

const LEAD_WORK = PROJECTS.filter((project) => project.tier === 'lead').map((project) => ({
  ...project,
  image: project.images.find((image) => image.hero) ?? project.images[0],
}));

const DELIVERY_DISCIPLINES = [
  ['Engineering', 'Structure, foundations, weather and public use'],
  ['Fabrication', 'Timber development, prototyping and assembly'],
  ['Landscape', 'Planting design, establishment and stewardship'],
  ['Planning', 'Consent strategy and project-specific advice'],
] as const;

export function PracticeEditorial() {
  usePageSnap({ wheel: true });
  const reduced = useReducedMotion();

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
                    {project.image.video?.gif && !reduced ? (
                      <img
                        src={project.image.video.gif}
                        alt={project.image.alt}
                        loading="eager"
                        decoding="async"
                        className={`h-full w-full ${project.image.fit === 'contain' ? 'object-contain' : 'object-cover'}`}
                      />
                    ) : project.image.video && !reduced ? (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={project.image.src}
                        aria-label={project.image.alt}
                        className={`h-full w-full ${project.image.fit === 'contain' ? 'object-contain' : 'object-cover'}`}
                        onLoadedMetadata={(event) => {
                          event.currentTarget.playbackRate = project.image.video?.rate ?? 1;
                        }}
                      >
                        {project.image.video.webm && <source src={project.image.video.webm} type="video/webm" />}
                        <source src={project.image.video.mp4} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={project.image.src} srcSet={srcSetFor(project.image.src)} sizes="(min-width: 768px) 33vw, 34vw" alt={project.image.alt} loading="eager" decoding="async" className={`h-full w-full ${project.image.fit === 'contain' ? 'object-contain' : 'object-cover'}`} />
                    )}
                  </div>
                  <figcaption className="mt-3 font-mono text-[8px] uppercase tracking-[0.12em] text-white/45 md:text-[9px]">{project.title} · {project.year}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section data-snap-section className="flex min-h-[100svh] snap-start items-center border-t border-black/10 px-gutter py-20">
          <div className="mx-auto grid w-full max-w-canvas gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-black/55">How the work is delivered</p>
              <h2 className="mt-8 max-w-[10ch] font-quote text-[clamp(3.3rem,7vw,7.2rem)] leading-[0.89] tracking-[-0.045em]">One Bower team, assembled for one place.</h2>
              <p className="mt-8 max-w-[34rem] font-serifDisplay text-[clamp(1.15rem,1.8vw,1.45rem)] leading-[1.55] text-black/58">
                Bower leads the commission from the first site conversation through design, making and stewardship. For each landscape, we assemble the appropriate engineering, fabrication, planning and landscape specialists; each role and appointment is defined around the site and the work it must support.
              </p>
            </div>
            <dl className="border-t border-black/20">
              {DELIVERY_DISCIPLINES.map(([title, description], index) => (
                <div key={title} className="grid grid-cols-[2rem_1fr] gap-4 border-b border-black/15 py-5 sm:grid-cols-[3rem_.7fr_1.3fr]">
                  <dt className="font-mono text-[10px] text-black/38">0{index + 1}</dt>
                  <dd className="font-serifDisplay text-[clamp(1.15rem,2vw,1.45rem)]">{title}</dd>
                  <dd className="col-start-2 font-mono text-[10px] uppercase tracking-[0.1em] text-black/48 sm:col-start-auto sm:self-center">{description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section data-snap-section className="flex min-h-[100svh] snap-start items-center px-gutter py-20">
          <div className="mx-auto w-full max-w-[1080px]">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/38">Bower · Based in England · Working across Europe</p>
            <h2 className="mt-10 max-w-[12ch] font-quote text-[clamp(3.6rem,8vw,8.4rem)] leading-[0.88] tracking-[-0.048em]">A design practice for living structures.</h2>
            <a href={routes.contact} className="mt-12 inline-block border-b border-black/45 pb-1 font-serifDisplay text-[clamp(1.2rem,2vw,1.55rem)]">Discuss a founding commission →</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
