import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { srcSetFor } from '../ui/responsiveImg';
import { useReducedMotion } from '../ui/useReducedMotion';

import { useMobileLayout } from '../ui/useMobileLayout';
import { ImageViewer } from '../ui/ImageViewer';
import './bower-direction.css';

const G = '/assets/gallery';

/** Soft snapping on both layouts lets touch scrolling settle near a plate without requiring it. */
export const GALLERY_SNAP = { strength: 'proximity', mobileStrength: 'proximity' } as const;

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

function ExpandingPlate({ image, eager, opening }: { image: (typeof GALLERY_IMAGES)[number]; eager: boolean; opening: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, () => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds || typeof window === 'undefined') return 0;
    return Math.max(0, Math.min(1, (window.innerHeight - bounds.top) / bounds.height));
  });
  // A feathered edge grows beyond the frame; image detail itself stays sharp.
  const radiusX = useTransform(progress, [0, 0.45, 0.9], [32, 40, 185]);
  const radiusY = useTransform(progress, [0, 0.45, 0.9], [48, 60, 245]);
  const maskImage = useMotionTemplate`radial-gradient(ellipse ${radiusX}% ${radiusY}% at 50% 100%, #000 58%, transparent 100%)`;
  const scale = useTransform(progress, [0, 0.8], [1.04, 1]);
  return (
    <section ref={ref} aria-label={`${image.n} ${image.title}`} className={`gallery-growth-plate${reduced || opening ? ' is-still' : ''}`}>
      <div className="gallery-growth-stage">
        <motion.figure style={reduced || opening ? undefined : { maskImage, WebkitMaskImage: maskImage }} className="gallery-growth-image">
          <motion.img
            style={reduced || opening ? undefined : { scale }}
            src={image.src} srcSet={srcSetFor(image.src)} sizes="100vw"
            alt={image.alt} loading={eager ? 'eager' : 'lazy'} decoding="async"
          />
        </motion.figure>
        <p className="gallery-plate-label">{image.title}</p>
      </div>
    </section>
  );
}

export function GalleryPage() {
  const mobile = useMobileLayout();
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="gallery-page editorial-page min-h-screen bg-floralWhite text-[#11110e]">
      <main>
        <section data-snap-section className="gallery-intro relative flex min-h-[240px] items-end px-gutter pb-10 pt-32">
          <EditorialHeader logoSrc="/assets/brand/bower-logo-evergreen-horizontal-transparent.png" />
          <div className="mx-auto flex w-full max-w-canvas items-end justify-between gap-8">
            <h1 className="font-quote text-[clamp(2.8rem,6vw,5rem)] leading-[0.82] tracking-[-0.055em]">Works</h1>
            <p className="pb-2 text-right font-mono text-[8px] uppercase tracking-[0.18em] text-black/38 md:text-[9px]">Eight concept studies<br />Design studies, not completed buildings<br />{mobile ? 'Tap a work to explore' : 'Scroll to explore'}</p>
          </div>
        </section>

        {GALLERY_IMAGES.map((image, index) => mobile ? (
          <section key={image.src} data-snap-section className="mobile-gallery-plate" aria-label={image.title}>
            <button className="mobile-gallery-image" onClick={() => setSelected(index)} aria-label={`Enlarge ${image.title}`}>
              <img src={image.src} srcSet={srcSetFor(image.src)} sizes="100vw" alt={image.alt} loading={index < 2 ? 'eager' : 'lazy'} decoding="async" />
              <span className="gallery-enlarge" aria-hidden>↗</span>
            </button>
            <div className="mobile-gallery-caption"><span>{image.n}</span><h2>{image.title}</h2><span>View +</span></div>
          </section>
        ) : <ExpandingPlate key={image.src} image={image} eager={index < 2} opening={index === 0} />)}
        <section className="gallery-collection" aria-labelledby="collection-title">
          <div className="gallery-collection-heading">
            <h2 id="collection-title">A world of Bowers.</h2>
            <p>All eight design studies. Select a view to explore.</p>
          </div>
          <motion.div className="gallery-collection-grid"
            initial={reduced ? false : "above"} whileInView="settled"
            viewport={{ once: true, amount: 0.12 }}
            variants={{ above: {}, settled: { transition: { staggerChildren: 0.08 } } }}>
            {GALLERY_IMAGES.map((image, index) => (
              <motion.button key={image.src} onClick={() => setSelected(index)}
                aria-label={`Open study ${image.n}: ${image.title}`}
                variants={{ above: { opacity: 0, y: mobile ? -45 : -160, scale: 0.92, rotate: index % 2 ? 3 : -3 }, settled: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } } }}>
                <img src={image.src} srcSet={srcSetFor(image.src)} sizes="(max-width: 600px) 88vw, (max-width: 1000px) 44vw, 21vw" alt={image.alt} loading="lazy" />
                <span><span>{image.title}</span><span aria-hidden="true">↗</span></span>
              </motion.button>
            ))}
          </motion.div>
        </section>
        {selected !== null && <ImageViewer images={GALLERY_IMAGES} initial={selected} onClose={() => setSelected(null)} />}
      </main>
      <Footer />
    </div>
  );
}
