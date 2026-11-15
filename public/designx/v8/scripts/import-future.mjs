// Import the five founder-supplied concepts for v8 without altering earlier decks.
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || 'C:/BOWER/Bower_Web/node_modules/sharp');
const destination = resolve(dirname(fileURLToPath(import.meta.url)), '../assets/future');
const source = resolve(process.argv[2] || 'C:/Users/cseif/Downloads');
const files = [
  ['sanctuary', 'Golden Garden Cathedral Sanctuary.png'],
  ['civic-promenade', 'Wisteria Canopy Civic Promenade.png'],
  ['living-street', 'ChatGPT Image Nov 15, 2026, 08_47_43 PM.png'],
  ['living-building', 'ChatGPT Image Nov 15, 2026, 08_47_53 PM.png'],
  ['garden-city', 'Golden-Hour Living Timber Garden City.png'],
];
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
await mkdir(destination, { recursive:true });
const assets = [];
for (const [id, filename] of files) {
  const original = await readFile(resolve(source, filename));
  const { width, height } = await sharp(original).metadata();
  const output = await sharp(original).webp({quality:92, effort:6}).toBuffer();
  await writeFile(resolve(destination, `${id}.webp`), output);
  assets.push({id, originalFilename:filename, width, height, originalSha256:sha256(original), file:`${id}.webp`, bytes:output.length, sha256:sha256(output)});
}
await writeFile(resolve(destination, 'provenance.json'), JSON.stringify({supplied:'2026-11-15', treatment:'WebP encoding at original dimensions; no crop or visual edits.', evidence:'Founder-supplied generated architectural concepts expressing longer-term ambition, not completed projects or engineered proposals.', assets}, null, 2)+'\n');
console.log(`Imported five concepts: ${assets.reduce((sum, a) => sum+a.bytes, 0)} bytes total.`);
