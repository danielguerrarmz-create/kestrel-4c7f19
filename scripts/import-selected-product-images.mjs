/**
 * Import the approved Bower Marketing selection as canonical, full-resolution WebP assets.
 * Responsive derivatives are generated separately by `npm run gen:images`.
 *
 * Usage:
 *   node scripts/import-selected-product-images.mjs [source-directory]
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, extname, join, resolve } from 'node:path';
import sharp from 'sharp';

const SOURCE = resolve(
  process.argv[2] ??
    'C:/Users/danie/Documents/Codex/Projects/Bower Marketing/04-product-images/selected',
);
const OUTPUT = resolve('public/assets/selected');
const ACCEPTED = /\.(?:jpe?g|png|webp)$/i;

await mkdir(OUTPUT, { recursive: true });
const files = (await readdir(SOURCE)).filter((name) => ACCEPTED.test(name)).sort();
if (!files.length) throw new Error(`No source images found in ${SOURCE}`);

const provenance = [];
for (const file of files) {
  const sourcePath = join(SOURCE, file);
  const sourceBytes = await readFile(sourcePath);
  const sourceMeta = await sharp(sourceBytes).metadata();
  const stem = basename(file, extname(file));
  const outputName = `${stem}.webp`;
  const outputPath = join(OUTPUT, outputName);

  await sharp(sourceBytes)
    .rotate()
    .webp({ quality: 88, effort: 5, smartSubsample: true })
    .toFile(outputPath);

  const outputBytes = await readFile(outputPath);
  const outputMeta = await sharp(outputBytes).metadata();
  provenance.push({
    source: sourcePath.replace(/\\/g, '/'),
    sourceSha256: createHash('sha256').update(sourceBytes).digest('hex'),
    sourceWidth: sourceMeta.width,
    sourceHeight: sourceMeta.height,
    output: `/assets/selected/${outputName}`,
    outputSha256: createHash('sha256').update(outputBytes).digest('hex'),
    outputWidth: outputMeta.width,
    outputHeight: outputMeta.height,
  });
  console.log(`${file} -> ${outputName} (${outputMeta.width}x${outputMeta.height})`);
}

await writeFile(
  join(OUTPUT, 'provenance.json'),
  `${JSON.stringify({ importedFrom: SOURCE.replace(/\\/g, '/'), images: provenance }, null, 2)}\n`,
);
console.log(`${files.length} selected images imported to ${OUTPUT}`);
