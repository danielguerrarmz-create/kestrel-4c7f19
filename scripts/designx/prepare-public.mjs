import { readdir, readFile, realpath, unlink, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { runInNewContext } from 'node:vm';
import { prepareV10Factory } from './prepare-v10-factory.mjs';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const STORY_FIELDS = ['number', 'baseSlide', 'title', 'theme', 'growthMode', 'timeExperiment'];
const EDITORIAL_FIELDS = ['purpose', 'stays', 'drawing', 'status', 'transition', 'speakerBridge'];

/** The browser needs the scene order and modes, not the internal editorial brief. */
export function publicStorySource(source) {
  const context = { window: {} };
  runInNewContext(source, context, { timeout: 1000 });
  const story = context.window.DESIGNX_V8_STORY;
  if (!Array.isArray(story) || !story.length) throw new Error('DesignX story manifest is missing.');
  const scenes = story.map(item => {
    for (const field of Object.keys(item)) {
      if (!STORY_FIELDS.includes(field) && !EDITORIAL_FIELDS.includes(field)) {
        throw new Error(`Review new DesignX story field before publication: ${field}`);
      }
    }
    return Object.fromEntries(STORY_FIELDS.filter(field => field in item).map(field => [field, item[field]]));
  });
  return `window.DESIGNX_V8_STORY = ${JSON.stringify(scenes, null, 2)};\n`;
}

export function isInternalArtifact(path) {
  const normalized = path.replaceAll('\\', '/');
  return /\.(?:md|mjs|py)$/i.test(normalized)
    || normalized.split('/').includes('scripts')
    || normalized === 'v8/story-map.html'
    || normalized === 'v8/set-aside.js';
}

/** Only the generated output is changed. The complete working material stays in public/. */
export async function preparePublicDeck(directory) {
  const root = await realpath(directory);
  const removed = [];
  async function visit(folder) {
    for (const item of await readdir(folder, { withFileTypes: true })) {
      const file = resolve(folder, item.name);
      const path = relative(root, file);
      if (path === '..' || path.startsWith(`..${sep}`) || item.isSymbolicLink()) {
        throw new Error(`Refusing to follow a path outside the generated DesignX output: ${path}`);
      }
      if (item.isDirectory()) await visit(file);
      else if (isInternalArtifact(path)) {
        await unlink(file);
        removed.push(path);
      }
    }
  }
  await visit(root);
  const storyFile = resolve(root, 'v8/story.js');
  await writeFile(storyFile, publicStorySource(await readFile(storyFile, 'utf8')));
  return removed;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const output = resolve(REPO, 'dist/designx');
  // Resolve the actual target before unlinking anything; a symlinked dist is not a build output.
  if (await realpath(output) !== output) throw new Error('DesignX build output must remain inside this repository.');
  const removed = await preparePublicDeck(output);
  await prepareV10Factory(output);
  console.log(`DesignX publication: excluded ${removed.length} internal files and published the scene manifest without editorial briefs.`);
}
