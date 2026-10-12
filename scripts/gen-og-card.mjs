/**
 * scripts/gen-og-card.mjs — the social sharing card, generated so it is reproducible.
 *
 *   node scripts/gen-og-card.mjs        write public/assets/social/og-card.jpg
 *   npm run gen:og                      the same thing
 *
 * WHY THIS EXISTS. Until 2026-07-28 index.html carried no `og:image` at all, so every link to
 * bowerbuild.org pasted into iMessage, WhatsApp, Slack or LinkedIn unfurled as a blank card with a
 * generic browser icon, under a headline still selling the shape-it-live engine (a product that
 * came off the site on 2026-07-21). The site's whole argument is visual and the card was showing
 * none of it.
 *
 * WHY A SEPARATE ASSET WHEN THE SITE ALREADY SHIPS THIS PICTURE:
 *   - JPEG remains the most reliable format for link unfurlers.
 *   - The approved estate-garden aerial is nearly the 1200x630 card ratio, so the crop is minimal.
 *   - The result stays under 300 KB for conservative unfurling limits.
 */
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import { dirname } from 'node:path';

const SRC = 'public/assets/selected/10-estate-aerial.webp';
const OUT = 'public/assets/social/og-card-v2.jpg';

/** The Open Graph card slot. Every major unfurler crops to this; matching it exactly means none
 *  of them has to choose. Mirrored by `OG_CARD` in src/seo.ts, pinned by src/seo.test.ts. */
const CARD_W = 1200;
const CARD_H = 630;

/** Unfurlers start giving up somewhere above this; the tags are useless if the fetch is abandoned. */
const MAX_BYTES = 300 * 1024;

const src = sharp(SRC);
const { width, height } = await src.metadata();
if (!width || !height) throw new Error(`${SRC}: no intrinsic size`);

// Crop height to the card's ratio at full source width, then scale. Never the other way round:
// cropping WIDTH would lose the arches at the edges, which are the whole subject.
const cropH = Math.round((width * CARD_H) / CARD_W);
if (cropH > height) {
  throw new Error(
    `${SRC} is ${width}x${height}, taller-slot than ${CARD_W}x${CARD_H} needs (${width}x${cropH}). ` +
      `Crop width instead, deliberately, rather than letting this script guess.`,
  );
}

await mkdir(dirname(OUT), { recursive: true });
await src
  // Top-anchored so the garden composition and Bower remain intact.
  .extract({ left: 0, top: 0, width, height: cropH })
  .resize(CARD_W, CARD_H, { fit: 'fill' }) // exact integer scale, so `fill` cannot distort
  .jpeg({ quality: 80, mozjpeg: true, chromaSubsampling: '4:4:4' })
  .toFile(OUT);

const { size } = await stat(OUT);
const out = await sharp(OUT).metadata();
if (out.width !== CARD_W || out.height !== CARD_H) {
  throw new Error(`${OUT} came out ${out.width}x${out.height}, expected ${CARD_W}x${CARD_H}`);
}
if (size > MAX_BYTES) {
  throw new Error(`${OUT} is ${(size / 1024).toFixed(0)} KB, over the ${MAX_BYTES / 1024} KB budget`);
}
console.log(
  `${OUT}  ${out.width}x${out.height}  ${(size / 1024).toFixed(0)} KB  ` +
    `(from ${width}x${height}, cropped to ${width}x${cropH})`,
);
