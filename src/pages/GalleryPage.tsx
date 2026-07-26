/**
 * GalleryPage.tsx — `#/gallery`, the commission visions (2026-07-23, Clay's client pass:
 * "make a new page dedicated to these images -- like a 'gallery' page").
 *
 * Seven CONCEPT RENDERINGS of Bower pavilions at home in their gardens, shown as full-width
 * mounted plates in the About page's own register (hairline sepia rule + vellum mat), under the
 * same transparent header + logo capsule the About wears. Tap opens the shared Lightbox with the
 * morph OFF (these plates carry no layoutId; see the Lightbox prop note).
 *
 * THE COPY SAYS "CONCEPT RENDERINGS" ON PURPOSE. These are generated visualizations, not
 * photographs of built work, and the page is shown to commission clients — a gallery that lets a
 * render pass as a photo would be a claim nobody here is making. The framing line is the honest
 * floor; how much further to lean into it is Daniel's copy call, flagged on the PR.
 *
 * The order is Clay's own (the sequence he shared them in); the files are numbered to match, so
 * the folder reads in page order. Ratios are MEASURED from the emitted webp files (sharp
 * metadata, 2026-07-23), per the site's standing law: never guessed, and the box is built from
 * the image, not the other way around.
 */
import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { SplashHeader } from './splash/SplashHeader';
import { Footer } from '../ui/Footer';
import { Lightbox } from './AboutPage';
import { INK_SEPIA } from './about/CrossPathsTimeline';
import { srcSetFor } from '../ui/responsiveImg';
import { useReducedMotion } from '../ui/useReducedMotion';
import type { ProjectImage } from './about/projects';

const G = '/assets/gallery';

/** The page's reveal ease — the About tree's own vocabulary, not a new one. */
const EASE_LINE = [0.16, 1, 0.3, 1] as const;

/** The seven visions, in Clay's order. Ratios measured from the files. */
export const GALLERY_IMAGES: ProjectImage[] = [
  {
    src: `${G}/01-wisteria-walk.webp`,
    ratio: 1.8356,
    alt: 'A walk beneath a run of woven timber lattice arches, wisteria hanging through the crown, cafe tables to one side and a stone manor beyond',
  },
  {
    src: `${G}/02-garden-pavilion.webp`,
    ratio: 1.8338,
    alt: 'A bower pavilion in a walled garden, its woven lattice crown sweeping up over rooted timber columns, visitors gathered inside',
  },
  {
    src: `${G}/03-glass-crown.webp`,
    ratio: 1.8338,
    alt: 'A pavilion whose lattice crown carries glazing, roses and wisteria growing over the rim, carved benches inside and a pond at its feet',
  },
  {
    src: `${G}/04-stained-glass-walk.webp`,
    ratio: 1.8338,
    alt: 'A garden walk under a sweeping lattice roof, stained glass set between the timbers, a curved bench following the path',
  },
  {
    src: `${G}/05-stained-glass-interior.webp`,
    ratio: 1.8356,
    alt: 'Inside the bower, stained glass glowing between woven branches, wisteria hanging through the crown, cushioned benches along the walls',
  },
  {
    src: `${G}/06-party-canopy.webp`,
    ratio: 1.8338,
    alt: 'A garden party under a broad lattice canopy, roses and clematis growing over the crown, the structure rising from rooted trunks',
  },
  {
    src: `${G}/07-fountain-room.webp`,
    ratio: 1.8356,
    alt: 'The heart of a large bower, a lattice dome carried on rooted columns, benches and a small fountain among the planting',
  },
];

/** The plates render at the content column's width; the 1920w base plus 1280/800/400 variants
 *  cover every DPR without pulling more than the column needs. */
const PLATE_SIZES = 'min(92vw, 1128px)';

/** One mounted plate: the About gallery's own frame (hairline sepia rule + vellum mat), a real
 *  button into the Lightbox, and the image at its OWN measured ratio so nothing crops. */
function GalleryPlate({
  image,
  index,
  reduced,
  onOpen,
}: {
  image: ProjectImage;
  index: number;
  reduced: boolean;
  onOpen: (index: number) => void;
}) {
  const btn = (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`Open: ${image.alt.slice(0, 72)}`}
      className="block w-full cursor-zoom-in bg-paperVellum p-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inkBlack sm:p-2"
      style={{ border: `1px solid ${INK_SEPIA}33` }}
    >
      <img
        src={image.src}
        srcSet={srcSetFor(image.src)}
        sizes={PLATE_SIZES}
        alt={image.alt}
        width={1920}
        height={Math.round(1920 / image.ratio)}
        loading={index === 0 ? 'eager' : 'lazy'}
        decoding="async"
        style={{ aspectRatio: String(image.ratio) }}
        className="block w-full bg-paperDeep/40"
      />
    </button>
  );
  if (reduced) return btn;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.5, ease: EASE_LINE }}
    >
      {btn}
    </motion.div>
  );
}

export function GalleryPage() {
  const reduced = useReducedMotion();
  const [shot, setShot] = useState<number | null>(null);
  const openShot = useCallback((i: number) => setShot(i), []);
  const closeShot = useCallback(() => setShot(null), []);
  const stepShot = useCallback(
    (delta: number) => setShot((i) => (i === null ? i : (i + delta + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)),
    [],
  );
  return (
    <div className="min-h-screen w-full bg-paperVellum text-inkBlack">
      <SplashHeader transparent logoPill />

      <main className="mx-auto w-full max-w-canvas px-gutter pb-16 pt-[calc(var(--header-h)+2.5rem)]">
        <header className="mb-10 flex flex-col gap-4 sm:mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-inkBlack/40">Gallery</p>
          <h1 className="max-w-[24ch] font-serifDisplay text-[clamp(1.7rem,4.2vw,3rem)] font-medium leading-[1.12] tracking-[-0.01em]">
            What we are here to build.
          </h1>
          {/* The honest floor: these are renderings, and the page says so before the first one. */}
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-inkBlack/55">
            Concept renderings of Bower commissions, at home in their gardens.
          </p>
        </header>

        <div className="flex flex-col gap-10 sm:gap-14">
          {GALLERY_IMAGES.map((image, i) => (
            <GalleryPlate key={image.src} image={image} index={i} reduced={reduced} onOpen={openShot} />
          ))}
        </div>
      </main>

      <Footer />

      {/* The shared viewer, morph OFF: these plates carry no layoutId, and the deadlock the morph
          prop documents is not worth a shared element on a page with one image column. */}
      <Lightbox images={GALLERY_IMAGES} index={shot} onClose={closeShot} onStep={stepShot} reduced={reduced} morph={false} />
    </div>
  );
}
