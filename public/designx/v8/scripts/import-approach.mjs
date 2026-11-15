// Import the exact original approach film requested for v8. No transcoding,
// retiming, source edits, or scene regeneration takes place here.
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(process.argv[2] || 'C:/BOWER/drawings-in-code/exports/approach-ink');
const destination = resolve(here, '../assets/approach-ink');
const files = ['approach-ink-16x9.mp4', 'approach-ink-16x9.jpg'];
await mkdir(destination, { recursive: true });
const assets = [];
for (const name of files) {
  const input = resolve(source, name);
  const bytes = await readFile(input);
  await copyFile(input, resolve(destination, name));
  assets.push({ file: name, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
}
const manifest = {
  name: 'Original eye-level approach in ink',
  video: files[0],
  poster: files[1],
  width: 1920,
  height: 1080,
  duration: 51,
  fps: 30,
  codec: 'H.264 High / yuv420p',
  audio: false,
  phases: { assembly: [0, 12], planting: [12, 13], growth: [13, 49], finalHold: [49, 51] },
  presentationCrop: { x: 0, y: 130, width: 1920, height: 770 },
  sourceDirectory: source.replaceAll('\\', '/'),
  sourcePipeline: 'drawings-in-code/pipeline/film.mjs',
  importedOn: '2026-11-15',
  treatment: 'Byte-for-byte original film and poster. The presentation crop hides baked titles and timeline without changing the camera. The deck adds authored occupation separately.',
  evidence: 'A generated growth scenario on provisional assumptions, not a forecast or measured performance. The timber is concept geometry. Assembly order is a generated sequence, not a validated erection method.',
  assets
};
await writeFile(resolve(destination, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Imported ${assets.length} original assets (${assets.reduce((sum, item) => sum + item.bytes, 0)} bytes).`);
