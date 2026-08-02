/**
 * GalleryPage.tsx — `/gallery`, the commission visions (2026-07-23, Clay's client pass:
 * "make a new page dedicated to these images -- like a 'gallery' page").
 *
 * Seven CONCEPT RENDERINGS of Bower pavilions at home in their gardens, read as an exhibition
 * catalogue (2026-07-23 second pass, Clay: "make it more professional"): a centred frontispiece,
 * a catalogue column narrower than the canvas so every plate sits in air, and each image mounted
 * (the About register's hairline sepia rule + vellum mat, cut deeper at this scale) with a
 * numbered exhibit caption beneath. Under the same transparent header + logo capsule the About
 * wears. Tap opens the shared Lightbox with the morph OFF (these plates carry no layoutId; see
 * the Lightbox prop note).
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
import { Lightbox } from './PracticePage';
import { INK_SEPIA } from './about/CrossPathsTimeline';
import { srcSetFor } from '../ui/responsiveImg';
import { useReducedMotion } from '../ui/useReducedMotion';
import type { ProjectImage } from './about/projects';

const G = '/assets/gallery';

/** The page's reveal ease — the About tree's own vocabulary, not a new one. */
const EASE_LINE = [0.16, 1, 0.3, 1] as const;

/** A catalogue plate: the shared image shape plus the exhibit caption. */
interface GalleryPlateData extends ProjectImage {
  /** Plate number as printed — the projects ledger's own two-digit convention. */
  n: string;
  /** Short exhibit title (DRAFT COPY, 2026-07-23 — authored here so the plates read curated
   *  rather than anonymous; Daniel renames freely, the numbering convention stays). */
  title: string;
  /**
   * One line of fact under the title (2026-07-28): roughly how big, and what is growing on it.
   *
   * WHY, and what these are and are NOT. Seven titled photographs with no information is a mood
   * board: a reader could not tell whether these were the same size, the same product, or the
   * same order of money, and the page's whole job at this point in the site is to make the thing
   * feel real. One line fixes it.
   *
   * They describe the DESIGN SHOWN, not a built record, because these are concept renderings and
   * the page says so twice. The scales are drawn from the commission range stated on
   * `/questions` (25 to 40 m², about three metres tall, a table of eight), so the gallery and
   * the answers cannot quote different numbers at the same reader; the planting in each is read
   * off that plate's own `alt`. Everything is hedged with "about" because none of it has been
   * surveyed.
   *
   * DRAFT, and Clay/Daniel's to overwrite — the images are generated, so there is no source of
   * truth to check these against except the studio's own intent. If a plate ever depicts a real
   * commission, its line must become the real figures.
   */
  fact: string;
}

/** The seven visions, in Clay's order, numbered and titled like catalogue plates. Ratios
 *  measured from the files. */
export const GALLERY_IMAGES: GalleryPlateData[] = [
  {
    n: '01',
    title: 'The wisteria walk',
    fact: 'A covered walk rather than a room. Wisteria through the crown, seating along one side.',
    src: `${G}/01-wisteria-walk.webp`,
    ratio: 1.8356,
    alt: 'A walk beneath a run of woven timber lattice arches, wisteria hanging through the crown, cafe tables to one side and a stone manor beyond',
  },
  {
    n: '02',
    title: 'A pavilion in a walled garden',
    fact: 'About 30 square metres, open on every side. Climbing rose over a lattice crown.',
    src: `${G}/02-garden-pavilion.webp`,
    ratio: 1.8338,
    alt: 'A bower pavilion in a walled garden, its woven lattice crown sweeping up over rooted timber columns, visitors gathered inside',
  },
  {
    n: '03',
    title: 'The glass crown',
    fact: 'About 30 square metres, with glazing set into the crown. Roses and wisteria over the rim.',
    src: `${G}/03-glass-crown.webp`,
    ratio: 1.8338,
    alt: 'A pavilion whose lattice crown carries glazing, roses and wisteria growing over the rim, carved benches inside and a pond at its feet',
  },
  {
    n: '04',
    title: 'The stained glass walk',
    fact: 'A walk again, following an existing path. Coloured glass set between the timbers.',
    src: `${G}/04-stained-glass-walk.webp`,
    ratio: 1.8338,
    alt: 'A garden walk under a sweeping lattice roof, stained glass set between the timbers, a curved bench following the path',
  },
  {
    n: '05',
    title: 'Inside the bower',
    fact: 'The same structure from within, in its third or fourth summer, once the climbers have closed the crown.',
    src: `${G}/05-stained-glass-interior.webp`,
    ratio: 1.8356,
    alt: 'Inside the bower, stained glass glowing between woven branches, wisteria hanging through the crown, cushioned benches along the walls',
  },
  {
    n: '06',
    title: 'The garden party',
    fact: 'About 40 square metres, the top of the usual range. Roses and clematis over a broad canopy.',
    src: `${G}/06-party-canopy.webp`,
    ratio: 1.8338,
    alt: 'A garden party under a broad lattice canopy, roses and clematis growing over the crown, the structure rising from rooted trunks',
  },
  {
    n: '07',
    title: 'The fountain room',
    fact: 'A landmark piece, larger than a garden commission: a planted dome built around a fountain.',
    src: `${G}/07-fountain-room.webp`,
    ratio: 1.8356,
    alt: 'The heart of a large bower, a lattice dome carried on rooted columns, benches and a small fountain among the planting',
  },
];

/** The plates render inside the catalogue column (max 1020px); the 1920w base plus the
 *  1280/800/400 variants cover every DPR without pulling more than the column needs. */
const PLATE_SIZES = 'min(90vw, 1020px)';

/**
 * One catalogue plate: the mounted image (the About gallery's hairline sepia rule + vellum mat,
 * cut DEEPER here than the About's 6px because at ~1000px wide a 6px mat vanishes and the mount
 * read as a stray border), a real button into the Lightbox, and the exhibit caption beneath —
 * plate number and title in the ledger's own mono register. The caption is what turns seven
 * anonymous images into a curated sequence.
 */
function GalleryPlate({
  image,
  index,
  reduced,
  onOpen,
}: {
  image: GalleryPlateData;
  index: number;
  reduced: boolean;
  onOpen: (index: number) => void;
}) {
  const fig = (
    <figure>
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`Open plate ${image.n}: ${image.title}`}
        className="block w-full cursor-zoom-in bg-paperVellum p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inkBlack sm:p-3"
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
      {/* THE CAPTION CARRIES A FACT NOW (2026-07-28), and the label register went up two steps.
          It was `01 THE WISTERIA WALK` in 11px uppercase mono at 0.16em tracking: the least
          legible setting on the site, on the page most likely to be read by someone over sixty,
          saying nothing a reader could act on. 13px keeps the ledger voice and stops being a
          squint; the fact line beneath is set in the page's own serif at reading size, because
          it is prose and prose is not a label. */}
      <figcaption className="mt-4">
        <span className="flex items-baseline gap-3 font-mono text-[13px] uppercase tracking-[0.16em]">
          <span className="text-inkBlack/35">{image.n}</span>
          <span className="text-inkBlack/60">{image.title}</span>
        </span>
        <span className="mt-2 block max-w-[60ch] font-serifDisplay text-[16px] leading-[1.5] text-inkBlack/55">
          {image.fact}
        </span>
      </figcaption>
    </figure>
  );
  if (reduced) return fig;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.5, ease: EASE_LINE }}
    >
      {fig}
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

      <main className="mx-auto w-full max-w-canvas px-gutter pb-20 pt-[calc(var(--header-h)+3rem)]">
        {/* THE FRONTISPIECE — centred, like an exhibition's title wall, with the honest line as a
            quiet serif sentence rather than a shouting mono caption. The page's images are
            generated visualizations shown to commission clients; naming them renderings before
            the first one is the floor, whatever wording Daniel lands on. */}
        <header className="mx-auto mb-14 flex max-w-[52ch] flex-col items-center gap-5 text-center sm:mb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-inkBlack/40">Gallery</p>
          <h1 className="font-serifDisplay text-[clamp(1.7rem,4.2vw,3rem)] font-medium leading-[1.12] tracking-[-0.01em] [text-wrap:balance]">
            What we are here to build.
          </h1>
          <p className="font-serifDisplay text-[clamp(1rem,1.4vw,1.2rem)] italic leading-[1.5] text-inkBlack/60">
            Concept renderings of Bower commissions, at home in their gardens.
          </p>
        </header>

        {/* THE CATALOGUE COLUMN — deliberately narrower than the canvas (1020px against ~1272),
            so every plate sits in air instead of running gutter to gutter, and the page reads as
            a curated sequence rather than an image feed. */}
        <div className="mx-auto flex w-full max-w-[1020px] flex-col gap-14 sm:gap-20">
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
