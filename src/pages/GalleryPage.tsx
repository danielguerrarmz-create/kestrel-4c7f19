import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { srcSetFor } from '../ui/responsiveImg';
import { usePageSnap } from '../ui/usePageSnap';
import { useReducedMotion } from '../ui/useReducedMotion';

const G = '/assets/gallery';

/** Preserve the gallery's soft desktop drift while giving touch screens a clear panel rhythm. */
export const GALLERY_SNAP = { strength: 'proximity', mobileStrength: 'mandatory' } as const;

export const GALLERY_IMAGES = [
  {
    n: '01', title: 'Wisteria walk', src: `${G}/01-wisteria-walk.webp`,
    alt: 'Concept visualisation of a walk beneath planted timber lattice arches with a stone manor beyond',
  },
  {
    n: '02', title: 'Walled garden', src: `${G}/02-garden-pavilion.webp`,
    alt: 'Concept visualisation of an open timber Bower within a mature walled garden',
  },
  {
    n: '03', title: 'Winter canopy', src: `${G}/exclusive/winter-canopy.webp`,
    alt: 'Concept visualisation of an open timber canopy in a snow-covered sculpture garden',
  },
  {
    n: '04', title: 'Garden concert', src: `${G}/exclusive/garden-concert-aerial.webp`,
    alt: 'Concept visualisation of musicians performing within a planted Bower in an estate garden',
  },
  {
    n: '05', title: 'The curator’s room', src: `${G}/favorites/curator-in-landscape.webp`,
    alt: 'Concept visualisation of a curator speaking inside a planted timber Bower',
  },
  {
    n: '06', title: 'Dinner beneath the lattice', src: `${G}/exclusive/garden-dinner.webp`,
    alt: 'Concept visualisation of guests dining beneath a flower-covered timber lattice',
  },
  {
    n: '07', title: 'Timber joint', src: `${G}/favorites/timber-joinery-detail.webp`,
    alt: 'Concept study of curved timber members meeting at a fitted pegged joint',
  },
  {
    n: '08', title: 'Inside the Bower', src: `${G}/05-stained-glass-interior.webp`,
    alt: 'Concept visualisation from inside a mature planted Bower with stained glass between its timbers',
  },
] as const;

function ExpandingPlate({ image, eager }: { image: (typeof GALLERY_IMAGES)[number]; eager: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });
  useEffect(() => {
    const measure = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const startWidth = Math.min(viewport.width * 0.72, 620);
  const width = useTransform(scrollYProgress, [0, 0.72], [startWidth, viewport.width]);
  const height = useTransform(scrollYProgress, [0, 0.72], [startWidth / 1.833, viewport.height]);
  const radius = useTransform(scrollYProgress, [0, 0.72], ['2px', '0px']);
  const captionOpacity = useTransform(scrollYProgress, [0, 0.3, 0.52], [1, 1, 0]);

  return (
    <section ref={ref} data-snap-section aria-label={`${image.n} ${image.title}`} className="relative h-[190svh] snap-start bg-white">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden bg-white">
        <motion.figure
          style={reduced ? undefined : { width, height, borderRadius: radius }}
          className="relative h-[100svh] w-screen overflow-hidden bg-[#efefed]"
        >
          <img
            src={image.src}
            srcSet={srcSetFor(image.src)}
            sizes="100vw"
            alt={image.alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out hover:scale-[1.012] motion-reduce:transition-none"
          />
        </motion.figure>
        <motion.p
          style={reduced ? undefined : { opacity: captionOpacity }}
          className="pointer-events-none absolute bottom-7 left-gutter z-10 font-mono text-[8px] uppercase tracking-[0.17em] text-black/48 mix-blend-difference invert md:bottom-10 md:text-[9px]"
        >
          {image.n} · {image.title} · Concept visualisation
        </motion.p>
      </div>
    </section>
  );
}

export function GalleryPage() {
  usePageSnap(GALLERY_SNAP);

  return (
    <div className="min-h-screen bg-white text-[#11110e]">
      <main>
        <section data-snap-section className="relative flex min-h-[100svh] snap-start items-center px-gutter">
          <EditorialHeader />
          <div className="mx-auto flex w-full max-w-canvas items-end justify-between gap-8">
            <h1 className="font-quote text-[clamp(4rem,12vw,12rem)] leading-[0.82] tracking-[-0.055em]">Works</h1>
            <p className="pb-2 text-right font-mono text-[8px] uppercase tracking-[0.18em] text-black/38 md:text-[9px]">Eight concept studies<br />Scroll to enter</p>
          </div>
        </section>

        {GALLERY_IMAGES.map((image, index) => <ExpandingPlate key={image.src} image={image} eager={index < 2} />)}
      </main>
      <Footer />
    </div>
  );
}
