/**
 * GalleryPage.tsx — `/gallery`, the commission visions (2026-07-23, Clay's client pass:
 * "make a new page dedicated to these images -- like a 'gallery' page").
 *
 * CONCEPT RENDERINGS of Bower pavilions at home in their gardens, read as an exhibition
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
 * The order is curated for variety and does not repeat imagery used elsewhere on the site.
 * Ratios are MEASURED from the emitted webp files (sharp
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
   * WHY, and what these are and are NOT. Titled photographs with no information become a mood
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
  story: 'living-work' | 'gathering' | 'landscape';
  happening: string;
  stage: string;
  landscape: string;
}

/** Fourteen visions, sequenced as a gallery rather than a recap of the rest of the site. Images
 *  already used on the home and commissions pages are intentionally excluded. Ratios measured
 *  from the files. */
export const GALLERY_IMAGES: GalleryPlateData[] = [
  {
    n: '01',
    title: 'The garden archways',
    fact: 'A family of planted timber arches turning a garden path into a place of discovery.',
    story: 'landscape', happening: 'A garden walk', stage: 'Establishing planting', landscape: 'Walled garden',
    src: `${G}/exclusive/garden-archways.webp`,
    ratio: 1.8333,
    alt: 'A sequence of sculptural timber arches rising among flowers along a winding garden path',
  },
  {
    n: '02',
    title: 'A pavilion in a walled garden',
    fact: 'Open on every side, with climbing rose establishing over the lattice crown.',
    story: 'gathering', happening: 'An estate lunch', stage: 'Establishing planting', landscape: 'Historic estate',
    src: `${G}/02-garden-pavilion.webp`,
    ratio: 1.8338,
    alt: 'A bower pavilion in a walled garden, its woven lattice crown sweeping up over rooted timber columns, visitors gathered inside',
  },
  {
    n: '03',
    title: 'The winter canopy',
    fact: 'The lattice remains a gathering place after the garden has entered its quietest season.',
    story: 'living-work', happening: 'A winter programme', stage: 'Dormant planting', landscape: 'Sculpture landscape',
    src: `${G}/exclusive/winter-canopy.webp`,
    ratio: 1.8351,
    alt: 'An open timber canopy hosting visitors in a snow-covered sculpture garden',
  },
  {
    n: '04',
    title: 'The wisteria walk',
    fact: 'A covered walk rather than a room. Wisteria through the crown, seating along one side.',
    story: 'living-work', happening: 'A curator’s walk', stage: 'Mature planting', landscape: 'Cultural landscape',
    src: `${G}/01-wisteria-walk.webp`,
    ratio: 1.8356,
    alt: 'A walk beneath a run of woven timber lattice arches, wisteria hanging through the crown, cafe tables to one side and a stone manor beyond',
  },
  {
    n: '05',
    title: 'The garden concert',
    fact: 'A Bower becoming both stage and backdrop, with the garden forming the auditorium.',
    story: 'gathering', happening: 'A summer concert', stage: 'Mature planting', landscape: 'Estate garden',
    src: `${G}/exclusive/garden-concert-aerial.webp`,
    ratio: 1.8333,
    alt: 'Aerial view of musicians performing in a planted timber Bower before an audience in an estate garden',
  },
  {
    n: '06',
    title: 'The curator’s room',
    fact: 'A place from which a landscape and its art can be encountered together.',
    story: 'living-work', happening: 'A curator’s talk', stage: 'Mature planting', landscape: 'Sculpture landscape',
    src: `${G}/favorites/curator-in-landscape.webp`,
    ratio: 1.8338,
    alt: 'A curator speaking to visitors gathered within a planted timber Bower, with sculpture and parkland beyond',
  },
  {
    n: '07',
    title: 'The estate gathering',
    fact: 'A generous open canopy giving a reception its own place within the garden.',
    story: 'gathering', happening: 'An estate reception', stage: 'Establishing planting', landscape: 'Cultural landscape',
    src: `${G}/exclusive/estate-gathering.webp`,
    ratio: 1.8333,
    alt: 'Guests gathered beneath a broad timber canopy amid planting in a sculpture garden',
  },
  {
    n: '08',
    title: 'Dinner beneath the lattice',
    fact: 'A long table held within the timber canopy, surrounded by the colour and scent of the garden.',
    story: 'gathering', happening: 'A garden dinner', stage: 'Mature planting', landscape: 'Hospitality garden',
    src: `${G}/exclusive/garden-dinner.webp`,
    ratio: 1.8333,
    alt: 'Guests dining at a long table beneath a flower-covered woven timber canopy',
  },
  {
    n: '09',
    title: 'The garden party',
    fact: 'A broad canopy imagined for an intimate estate gathering, with roses and clematis overhead.',
    story: 'gathering', happening: 'A seasonal gathering', stage: 'Mature planting', landscape: 'Historic estate',
    src: `${G}/06-party-canopy.webp`,
    ratio: 1.8338,
    alt: 'A garden party under a broad lattice canopy, roses and clematis growing over the crown, the structure rising from rooted trunks',
  },
  {
    n: '10',
    title: 'The fountain room',
    fact: 'A more ambitious planted dome imagined around an existing fountain.',
    story: 'living-work', happening: 'An inhabitable artwork', stage: 'Mature planting', landscape: 'Cultural landscape',
    src: `${G}/07-fountain-room.webp`,
    ratio: 1.8356,
    alt: 'The heart of a large bower, a lattice dome carried on rooted columns, benches and a small fountain among the planting',
  },
  {
    n: '11',
    title: 'The glass crown',
    fact: 'A more sheltered study, with glazing imagined in the crown and planting over the rim.',
    story: 'living-work', happening: 'Quiet daily encounter', stage: 'Mature planting', landscape: 'Productive garden',
    src: `${G}/03-glass-crown.webp`,
    ratio: 1.8338,
    alt: 'A pavilion whose lattice crown carries glazing, roses and wisteria growing over the rim, carved benches inside and a pond at its feet',
  },
  {
    n: '12',
    title: 'The timber joint',
    fact: 'The building system expressed through the grain, fit and meeting of its timber pieces.',
    story: 'living-work', happening: 'Craft at close range', stage: 'Timber detail', landscape: 'Garden craft',
    src: `${G}/favorites/timber-joinery-detail.webp`,
    ratio: 1.8351,
    alt: 'Close view of curved timber members meeting at a precisely fitted pegged joint, with flowers beyond',
  },
  {
    n: '13',
    title: 'The stained glass walk',
    fact: 'A walk again, following an existing path. Coloured glass set between the timbers.',
    story: 'landscape', happening: 'Garden interpretation', stage: 'Establishing planting', landscape: 'Walled garden',
    src: `${G}/04-stained-glass-walk.webp`,
    ratio: 1.8338,
    alt: 'A garden walk under a sweeping lattice roof, stained glass set between the timbers, a curved bench following the path',
  },
  {
    n: '14',
    title: 'Inside the bower',
    fact: 'The same structure from within, in its third or fourth summer, once the climbers have closed the crown.',
    story: 'landscape', happening: 'Horticultural study', stage: 'Mature planting', landscape: 'Historic garden',
    src: `${G}/05-stained-glass-interior.webp`,
    ratio: 1.8356,
    alt: 'Inside the bower, stained glass glowing between woven branches, wisteria hanging through the crown, cushioned benches along the walls',
  },
];

/** The plates render inside the catalogue column (max 1020px); the 1920w base plus the
 *  1280/800/400 variants cover every DPR without pulling more than the column needs. */
const PLATE_SIZES = 'min(90vw, 1020px)';

/**
 * One catalogue plate: the mounted image (the About gallery's hairline sepia rule + vellum mat,
 * cut DEEPER here than the About's 6px because at ~1000px wide a 6px mat vanishes and the mount
 * read as a stray border), a real button into the Lightbox, and the exhibit caption beneath —
 * plate number and title in the ledger's own mono register. The caption is what turns these
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
        <span className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.13em] text-inkBlack/40">
          <span>{image.happening}</span><span>{image.stage}</span><span>{image.landscape}</span><span>Concept visualisation</span>
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

      <main className="mx-auto w-full max-w-canvas px-gutter pb-20 pt-[calc(var(--header-h)+1.25rem)]">
        {/* THE FRONTISPIECE — centred, like an exhibition's title wall, with the honest line as a
            quiet serif sentence rather than a shouting mono caption. The page's images are
            generated visualizations shown to commission clients; naming them renderings before
            the first one is the floor, whatever wording Daniel lands on. */}
        <header className="mb-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <h1 className="font-serifDisplay text-[clamp(2rem,4.2vw,3.4rem)] font-medium leading-none tracking-[-0.02em]">Gallery</h1>
          <p className="font-serifDisplay text-[15px] italic text-inkBlack/55">Concept studies for the first Bowers.</p>
        </header>

        {/* THE CATALOGUE COLUMN — deliberately narrower than the canvas (1020px against ~1272),
            so every plate sits in air instead of running gutter to gutter, and the page reads as
            a curated sequence rather than an image feed. */}
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-14 sm:gap-20">
          {GALLERY_IMAGES.map((image, index) => (
            <GalleryPlate key={image.src} image={image} index={index} reduced={reduced} onOpen={openShot} />
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
