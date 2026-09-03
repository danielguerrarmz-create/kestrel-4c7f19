/** The home page as a seven-movement exhibition. */
import { useEffect, useState } from 'react';
import { routes } from '../routing';
import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { FOUNDING_SITE_STUDY_FEE_INTERNATIONAL } from '../ui/priceCopy';
import { srcSetFor } from '../ui/responsiveImg';
import { usePageSnap } from '../ui/usePageSnap';
import { BowerIntro } from './splash/BowerIntro';

/**
 * THE ROTATION LOST `manor-garden` AND GAINED `bower-in-summer-borders` (2026-09-03, Clay).
 *
 * `manor-garden` — the v4 hero still, a small shell across a lawn at a brick manor — was the
 * second frame and Clay's word for it was "slightly understated". It is a picture of a garden
 * that happens to contain a Bower; at that distance the structure reads as garden furniture. Every
 * other frame in this rotation puts the reader INSIDE or immediately beneath the thing. The new
 * frame is the flowering Bower at close range: curved lattice arches, roses and wisteria over the
 * crown, borders in full summer, people walking through at the scale of the arch.
 *
 * The file is NOT deleted. `heroStill.ts` still points at it for the engine-side reveal (dev-only),
 * and that surface has its own reasoning for the choice — see the comment there.
 */
export const HERO_IMAGES = [
  {
    src: '/assets/gallery/favorites/living-bower-interior.webp',
    mobileSrc: '/hero/v4/eden-oculus-up-tall.webp',
  },
  { src: '/assets/gallery/week-3/stained-glass-cliff-interior.webp' },
  { src: '/assets/gallery/favorites/bower-in-summer-borders.webp' },
  { src: '/assets/gallery/favorites/garden-performance.webp' },
] as const;

export const HERO_ROTATION_MS = 5000;

export function nextHeroIndex(current: number): number {
  return (current + 1) % HERO_IMAGES.length;
}

function RotatingHeroImages() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive(nextHeroIndex), HERO_ROTATION_MS);
    return () => window.clearInterval(timer);
  }, []);

  /*
   * THE HERO IS NOT A LINK ANY MORE (2026-09-03, Clay). The whole first screen was wrapped in an
   * `<a href="/gallery">` carrying `cursor-zoom-in`, which failed in three ways at once: the
   * magnifying glass is the browser's own zoom affordance and promised an enlarge that never came,
   * the entire viewport was a click target so any stray click on the home page navigated away, and
   * there was no visible control to explain or escape it. A reader could not tell they were inside
   * a link, and once the cursor changed they had no way to reason about what a click would do.
   *
   * Nothing is lost by removing it: the gallery is one deliberate click away in the header ("Works")
   * and again in the footer. A whole-viewport hit target is not navigation, it is a trapdoor.
   */
  return (
    <div className="absolute inset-0">
      {HERO_IMAGES.map((image, index) => (
        <picture
          key={image.src}
          aria-hidden={index !== active}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out motion-reduce:transition-none ${index === active ? 'opacity-100' : 'opacity-0'}`}
        >
          {'mobileSrc' in image && (
            <source media="(max-width: 640px)" srcSet={srcSetFor(image.mobileSrc)} sizes="100vw" />
          )}
          <img
            src={image.src}
            srcSet={srcSetFor(image.src)}
            sizes="100vw"
            alt={index === 0 ? 'Concept visualisation from within a planted timber Bower' : ''}
            decoding="async"
            loading={index === 0 ? 'eager' : 'lazy'}
            {...(index === 0 ? { fetchpriority: 'high' } : {})}
            className="h-full w-full scale-[1.015] object-cover object-center motion-safe:animate-[hero-drift_24s_ease-out_both]"
          />
        </picture>
      ))}
    </div>
  );
}

const TIME_STUDY = [
  {
    year: '00',
    title: 'A lattice',
    image: '/assets/process/evolution/installation.webp',
    alt: 'Concept visualisation of a newly installed timber Bower before the planting has established',
  },
  {
    year: '01',
    title: 'Leaves in the weave',
    image: '/assets/process/evolution/establishing.webp',
    alt: 'Concept visualisation of the same Bower after its first season of growth',
  },
  {
    year: '03',
    title: 'A room of blossom and eaves',
    image: '/assets/process/evolution/mature.webp',
    alt: 'Concept visualisation of the same Bower after the planting has matured through its lattice',
  },
] as const;

function Image({ src, alt, sizes, className = '' }: { src: string; alt: string; sizes: string; className?: string }) {
  return (
    <img
      src={src}
      srcSet={srcSetFor(src)}
      sizes={sizes}
      alt={alt}
      loading="eager"
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

export function SplashPage() {
  usePageSnap({ wheel: true });

  return (
    <main className="min-h-screen w-full overflow-hidden bg-white text-[#11110e]">
      <BowerIntro />

      <section data-snap-section className="relative min-h-[100svh] snap-start overflow-hidden bg-[#11110e] text-white">
        <EditorialHeader tone="white" />
        <RotatingHeroImages />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,5,0.48)_0%,rgba(7,7,5,0.03)_46%,rgba(7,7,5,0.55)_100%)]" />
        {/* THE WHITE PANEL IS GONE (2026-09-03, Clay). The cue sat in a `bg-white/95` capsule with
            its own shadow and blur, welded to the bottom edge — a piece of UI chrome parked on top
            of a full-bleed photograph, and the heaviest object in the frame after the picture
            itself. The mark now reads directly on the image: the hero's bottom scrim already
            darkens to rgba(7,7,5,0.55), so white at 70% clears contrast without a plate behind it.
            It keeps its 44px touch target via the padding, not via a visible box. */}
        <a
          href="#meaning"
          aria-label="Scroll to discover more"
          className="absolute bottom-8 left-1/2 z-30 flex min-h-11 -translate-x-1/2 flex-col items-center justify-end gap-2 px-6 font-mono text-[9px] uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:bottom-12 md:text-[10px]"
        >
          <span>Scroll to explore</span>
          <span aria-hidden className="relative block h-4 w-px overflow-hidden bg-white/25">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-white/85 motion-safe:animate-[scroll-cue_2.2s_cubic-bezier(0.45,0,0.2,1)_infinite]" />
          </span>
        </a>
        <div className="pointer-events-none relative z-10 mx-auto flex min-h-[100svh] w-full max-w-canvas items-end justify-between gap-8 px-gutter pb-8 pt-40 md:pb-12">
          <p className="font-serifDisplay text-[clamp(1.25rem,2vw,1.75rem)] tracking-[-0.01em]">Living architecture</p>
          {/* THREE WORDS AND A YEAR (2026-09-03, Clay: "way too many words — when in doubt, err on
              the side of saying the least amount possible"). It carried the availability AND the
              geography on two lines, which is two facts fighting in the quietest type on the page.
              The reach is already stated one screen down ("Bower · Working across Europe"), where
              it has room; the hero keeps only the fact that cannot be read anywhere else on this
              screen. Say each fact once, in the place that owns it. */}
          <p className="text-right font-mono text-[8px] uppercase tracking-[0.18em] text-white/58 sm:text-[9px]">Founding commissions · 2027</p>
        </div>
      </section>

      <section id="meaning" data-snap-section style={{ scrollMarginTop: 0 }} className="flex min-h-[100svh] snap-start items-center px-gutter py-[clamp(8rem,18vw,18rem)]">
        <div className="mx-auto w-full max-w-canvas">
          {/* THIS BAND IS NOW THE ONLY PLACE THE HOME STATES ITS REACH. It read "Bower · Based in
              England", which told a patron in Gavi or Navarra they were an exception. The hero
              briefly carried "Based in England · Working across Europe" as well and Clay cut it on
              2026-09-03 for length, so the fact lives here alone — which is where it has room. */}
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/38">Bower · Working across Europe</p>
          <h1 className="mt-[clamp(3rem,7vw,7rem)] max-w-[11ch] font-quote text-[clamp(3.6rem,9.2vw,9.8rem)] leading-[0.87] tracking-[-0.05em]">Buildings that nature designs.</h1>
          <div className="ml-auto mt-[clamp(5rem,11vw,10rem)] max-w-[27rem]">
            <p className="font-serifDisplay text-[clamp(1.2rem,2vw,1.65rem)] leading-[1.5] text-black/52">We make the structure. The garden makes the rest.</p>
            <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.16em] text-black/38">Estates · Gardens · Hotels · Cultural landscapes</p>
          </div>
        </div>
      </section>

      <section data-snap-section className="flex min-h-[100svh] snap-start items-center border-t border-black/10 px-gutter py-16 md:py-[clamp(7rem,12vw,12rem)]">
        <div className="mx-auto w-full max-w-canvas">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/38">The object in time</p>
            <h2 className="max-w-[9ch] font-quote text-[clamp(3rem,6.4vw,6.8rem)] leading-[0.91] tracking-[-0.04em]">A Bower begins when building ends.</h2>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-2 md:mt-[clamp(4rem,8vw,8rem)] md:gap-4">
            {TIME_STUDY.map((study) => (
              <figure key={study.year}>
                <div className="aspect-[3/2] overflow-hidden bg-[#f1f1ef]">
                  <Image src={study.image} alt={study.alt} sizes="(min-width: 768px) 33vw, 100vw" />
                </div>
                <figcaption className="mt-3 flex flex-col gap-1 font-mono text-[8px] uppercase tracking-[0.11em] text-black/45 md:grid md:grid-cols-[3rem_1fr] md:gap-3 md:text-[9px] md:tracking-[0.14em]">
                  <span>{study.year}</span><span>{study.title}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section data-snap-section className="flex min-h-[100svh] snap-start items-center border-t border-black/10 px-gutter py-20 md:py-[clamp(7rem,13vw,13rem)]">
        <div className="mx-auto w-full max-w-canvas">
          <div className="grid gap-8 md:grid-cols-[.7fr_1.3fr] md:items-end">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/38">Study No. 01 · Concept study</p>
            <div>
              <h2 className="max-w-[13ch] font-quote text-[clamp(3rem,6.4vw,6.8rem)] leading-[0.91] tracking-[-0.045em]">We create buildings that cannot simply be purchased and placed.</h2>
              <p className="mt-8 max-w-[35rem] font-serifDisplay text-[clamp(1.15rem,1.9vw,1.55rem)] leading-[1.5] text-black/52">They belong to one landscape, develop with it, and become more extraordinary with every passing year.</p>
            </div>
          </div>
          <figure className="mt-10 md:mt-[clamp(4rem,9vw,9rem)]">
            <div className="aspect-[16/10] overflow-hidden bg-[#f1f1ef]">
              <Image src="/assets/gallery/week-3/valley-bower-at-dawn.webp" alt="Concept visualisation of a planted timber Bower occupying a misted valley at dawn" sizes="100vw" className="object-[78%_center] md:object-[68%_center]" />
            </div>
            {/* "English valley" until 2026-09-03, and it was the ONLY place named on the home page.
                The render is not identifiably English — it is mist, a wooded valley and a dawn — so
                the nationality was a claim the picture never made, sitting on the one image a first
                -time reader studies longest. Dropped for the European outreach; nothing else about
                the caption changed. */}
            <figcaption className="mt-4 flex flex-wrap justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.15em] text-black/42">
              <span>Valley at dawn · Morning mist</span><span>Unbuilt concept visualisation</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section data-snap-section className="flex min-h-[100svh] snap-start items-center border-t border-black/10 px-gutter py-20 md:py-[clamp(7rem,13vw,13rem)]">
        <div className="mx-auto w-full max-w-canvas">
          <div className="grid gap-8 md:grid-cols-2 md:items-end">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/38">A life of its own</p>
            <h2 className="max-w-[10ch] font-quote text-[clamp(3.2rem,6.8vw,7rem)] leading-[0.9] tracking-[-0.04em]">The garden becomes a place to gather.</h2>
          </div>
          <figure className="mt-10 md:mt-[clamp(4rem,9vw,9rem)]">
            <div className="aspect-[16/10] overflow-hidden bg-[#11110e]">
              <Image src="/assets/gallery/week-3/garden-room-gathering.webp" alt="Concept visualisation of visitors gathering beneath a planted timber Bower in a formal garden" sizes="100vw" />
            </div>
            <figcaption className="mt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-black/42">A garden room in use · Concept visualisation</figcaption>
          </figure>
        </div>
      </section>

      <section data-snap-section className="relative flex min-h-[100svh] snap-start items-end overflow-hidden bg-[#11110e] px-gutter py-16 text-white md:py-[clamp(6rem,10vw,10rem)]">
        <Image src="/assets/gallery/favorites/timber-joinery-detail.webp" alt="Concept study of a timber lattice joint and carved connection" sizes="100vw" className="absolute inset-0 object-center opacity-72" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,7,0.06)_0%,rgba(9,9,7,0.48)_42%,rgba(9,9,7,0.96)_100%)]" />
        <div className="relative mx-auto grid w-full max-w-canvas gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/48">Evidence of making · Joint study 01</p>
            <h2 className="mt-7 max-w-[9ch] font-quote text-[clamp(3.3rem,6.8vw,7.2rem)] leading-[0.89] tracking-[-0.045em]">Every Bower is different.</h2>
            <p className="mt-5 max-w-[34rem] font-serifDisplay text-[clamp(1.1rem,1.8vw,1.55rem)] leading-[1.45] text-white/62">We are building the means to make them again and again, without ever making the same one twice.</p>
          </div>
          <div>
            <ol className="grid grid-cols-2 gap-x-6 border-t border-white/25 sm:grid-cols-5 lg:grid-cols-2">
              {['Site', 'Geometry', 'Structure', 'Planting', 'Stewardship'].map((step, index) => (
                <li key={step} className="border-b border-white/20 py-3 font-sans text-[8px] uppercase tracking-[0.14em] text-white/72 md:py-4 md:text-[9px]">
                  <span className="mr-3 font-mono text-white/38">0{index + 1}</span>{step}
                </li>
              ))}
            </ol>
            <a href={routes.process} className="mt-6 inline-block border-b border-white/55 pb-1 font-serifDisplay text-[16px] transition-colors hover:border-white hover:text-white/70 md:mt-9 md:text-[17px]">See how it is made →</a>
          </div>
        </div>
      </section>

      <section data-snap-section className="flex min-h-[100svh] snap-start items-center px-gutter py-16 md:py-[clamp(8rem,17vw,17rem)]">
        <div className="mx-auto w-full max-w-[1080px]">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/38">Founding commissions</p>
          <h2 className="mt-8 max-w-[13ch] font-quote text-[clamp(3.4rem,7.6vw,8rem)] leading-[0.89] tracking-[-0.045em] md:mt-12">The first Bowers will be made for three spectacular landscapes.</h2>
          <p className="mt-7 font-mono text-[9px] uppercase tracking-[0.16em] text-black/42 md:mt-10">Founding Site Study · Four weeks · {FOUNDING_SITE_STUDY_FEE_INTERNATIONAL} plus approved travel and project expenses</p>
          <a href={routes.contact} className="mt-8 inline-block border-b border-black/45 pb-1 font-serifDisplay text-[clamp(1.2rem,2vw,1.55rem)] transition-colors hover:border-black hover:text-black/55 md:mt-12">Discuss a founding commission →</a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
