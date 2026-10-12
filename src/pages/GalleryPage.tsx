import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { srcSetFor } from '../ui/responsiveImg';
import { useReducedMotion } from '../ui/useReducedMotion';

import { useMobileLayout } from '../ui/useMobileLayout';
import { ImageViewer } from '../ui/ImageViewer';
import { selectedImage, selectedStudy, type SelectedStudy } from '../data/selectedImages';
import './bower-direction.css';

/** Soft snapping on both layouts lets touch scrolling settle near a plate without requiring it. */
export const GALLERY_SNAP = { strength: 'proximity', mobileStrength: 'proximity' } as const;

const galleryImage = (slug: SelectedStudy['slug']) => {
  const study = selectedStudy(slug);
  return { slug, n: slug.slice(0, 2), title: study.title, src: selectedImage(slug), alt: study.alt };
};

/** Narrative plates may sit together when they show a deliberate change over time. */
export const FEATURED_SLUGS = [
  '14-rose-wisteria',
  '24-candlelit-canopy',
  '05-walled-garden',
  '18-autumn-dinner',
  '03-wisteria-walk',
  '29-wisteria-theatre',
  '15-rose-reading',
  '06-wedding-speech',
  '12-orchard-approach',
  '31-family-supper',
] as const satisfies readonly SelectedStudy['slug'][];

/** Hand-curated visual rhythm. This intentionally does not follow source-folder numbering. */
export const COLLECTION_SLUGS = [
  '14-rose-wisteria',
  '06-wedding-speech',
  '21-woodland-bower',
  '30-ancient-bower',
  '15-rose-reading',
  '29-wisteria-theatre',
  '05-walled-garden',
  '31-family-supper',
  '22-wisteria-banquet',
  '12-orchard-approach',
  '16-romantic-dinner',
  '04-garden-exhibition',
  '17-memorial-garden',
  '01-meadow-tea',
  '23-white-wisteria',
  '11-autumn-retreat',
  '07-charity-dinner',
  '03-wisteria-walk',
  '24-candlelit-canopy',
  '18-autumn-dinner',
] as const satisfies readonly SelectedStudy['slug'][];

const FEATURED_IMAGES = FEATURED_SLUGS.map(galleryImage);
export const COLLECTION_IMAGES = COLLECTION_SLUGS.map(galleryImage);
export const GALLERY_IMAGES = [...FEATURED_IMAGES, ...COLLECTION_IMAGES]
  .filter((image, index, images) => images.findIndex((candidate) => candidate.slug === image.slug) === index);

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
    <section ref={ref} aria-label={image.title} className={`gallery-growth-plate${reduced || opening ? ' is-still' : ''}`}>
      <div className="gallery-growth-stage">
        <motion.figure style={reduced || opening ? undefined : { maskImage, WebkitMaskImage: maskImage }} className="gallery-growth-image">
          <motion.img
            style={reduced || opening ? undefined : { scale }}
            src={image.src} srcSet={srcSetFor(image.src)} sizes="100vw"
            alt={image.alt} loading={eager ? 'eager' : 'lazy'} decoding="async"
          />
        </motion.figure>
      </div>
    </section>
  );
}

export function GalleryPage() {
  const mobile = useMobileLayout();
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<number | null>(null);
  const openImage = (src: string) => setSelected(GALLERY_IMAGES.findIndex((image) => image.src === src));

  return (
    <div className="gallery-page editorial-page min-h-screen bg-floralWhite text-[#11110e]">
      <main>
        <section data-snap-section className="gallery-intro">
          <EditorialHeader />
          <div className="gallery-intro-inner">
            <h1>Works</h1>
            <div className="gallery-intro-note" aria-label="Concept studies. Scroll to enter.">
              <span>Concept studies</span>
              <span>Scroll to enter</span>
            </div>
          </div>
        </section>

        {FEATURED_IMAGES.map((image, index) => mobile ? (
          <section key={image.src} data-snap-section className="mobile-gallery-plate" aria-label={image.title}>
            <button className="mobile-gallery-image" onClick={() => openImage(image.src)} aria-label={`Enlarge ${image.title}`}>
              <img src={image.src} srcSet={srcSetFor(image.src)} sizes="100vw" alt={image.alt} loading={index < 2 ? 'eager' : 'lazy'} decoding="async" />
            </button>
          </section>
        ) : <ExpandingPlate key={image.src} image={image} eager={index < 2} opening={index === 0} />)}
        <section className="gallery-collection" aria-labelledby="collection-title">
          <div className="gallery-collection-heading">
            <h2 id="collection-title">A world of Bowers.</h2>
          </div>
          <motion.div className="gallery-collection-grid"
            initial={reduced ? false : "above"} whileInView="settled"
            viewport={{ once: true, amount: 0.12 }}
            variants={{ above: {}, settled: { transition: { staggerChildren: 0.08 } } }}>
            {COLLECTION_IMAGES.map((image, index) => (
              <motion.button key={image.src} onClick={() => openImage(image.src)}
                aria-label={`Open study: ${image.title}`}
                variants={{ above: { opacity: 0, y: mobile ? -45 : -160, scale: 0.92, rotate: index % 2 ? 3 : -3 }, settled: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } } }}>
                <img src={image.src} srcSet={srcSetFor(image.src)} sizes="(max-width: 600px) 88vw, (max-width: 1000px) 44vw, 21vw" alt={image.alt} loading="lazy" />
                <span className="gallery-collection-caption">{image.title}</span>
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
