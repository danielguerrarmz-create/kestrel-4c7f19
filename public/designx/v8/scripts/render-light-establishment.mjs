// Re-render only the middle Light panel from an existing simulated growth state.
// Never changes the source plate, growth record, frozen release or original export.
// Usage: node .../render-light-establishment.mjs --probe
//        node .../render-light-establishment.mjs --date=2032-06-21
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { startStudio } from '../../../../drawings-in-code/pipeline/headless.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../../../..');
const output = resolve(here, '../assets/light-establishment');
const proofs = resolve(here, '../.qa/light-establishment');
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || 'C:/BOWER/Bower_Web/node_modules/sharp');
const platePath = resolve(repo, 'drawings-in-code/plates/04-plants-make-space.json');
const source = resolve(repo, 'drawings-in-code/exports/deck/04-plants-make-space-timber');
const spec = JSON.parse(await readFile(platePath, 'utf8'));
const mode = spec.piece.modes.light;
const options = Object.fromEntries(process.argv.slice(2).map(arg => arg.replace(/^--/, '').split('=')));
const probe = Object.hasOwn(options, 'probe');
if (!probe && !/^20\d\d-06-21$/.test(options.date || '')) throw new Error('Use --probe or --date=YYYY-06-21');
await mkdir(output, { recursive: true });
const panelWidth = Math.floor((spec.slot[0] - spec.gutter * 2) / 3), height = spec.slot[1], scale = spec.scale;
const pixelWidth = panelWidth * scale, pixelHeight = height * scale, pixelGap = spec.gutter * scale;
const totalWidth = pixelWidth * 3 + pixelGap * 2;
let studio, page;
const take = async (at, sun = [172, 12]) => {
  await page.js(`window.studio.plate({view:'plan',timber:'wood',shade:0.36,sun:${JSON.stringify(sun)},at:window.studio.moment(${JSON.stringify(at)})})`);
  return page.shot();
};
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
try {
  console.log('Opening the original six-bay studio and full trained-10y record…');
  studio = await startStudio(Number(options.port || 5321), 'six-bay-radial-v1');
  page = await studio.open({ plate:'', paper:spec.paper, ink:spec.ink, timber:'wood', build:'1', run:'trained-10y' }, { width:panelWidth, height, scale });
  if (probe) {
    await mkdir(proofs, { recursive: true });
    const dates = ['2029-06-21','2030-06-21','2031-06-21','2032-06-21','2033-06-21','2034-06-21','2036-06-21'];
    const samples = new Map();
    for (const date of ['installation', ...dates]) {
      const png = await take(date === 'installation' ? 'build:1' : `date:${date}`);
      await writeFile(resolve(proofs, `probe-${date}.png`), png);
      samples.set(date, await sharp(png).ensureAlpha().raw().toBuffer());
      console.log(`Noon candidate ${date}`);
    }
    const bare = samples.get('installation'), mature = samples.get('2036-06-21');
    // Compare added projected shade rather than pretending this measures physical canopy cover.
    // Exclude opaque geometry and the sun icon; retain the mature extra-shadow footprint.
    const metric = pixels => {
      let value = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (mature[i] > 125 || bare[i] > 125 || mature[i] < 12) continue;
        value += Math.max(0, Math.min(mature[i], pixels[i]) - bare[i]);
      }
      return value;
    };
    const full = metric(mature);
    const results = dates.map(date => ({ date, additionalNoonShadowFraction: metric(samples.get(date)) / full }));
    const selected = [...results].sort((a,b) => Math.abs(a.additionalNoonShadowFraction-.5) - Math.abs(b.additionalNoonShadowFraction-.5))[0];
    const evidence = { metric:'Additional noon projected-shadow alpha within the mature extra-shadow footprint, normalized from installation=0 to mature=1. A digital image comparison, not a physical canopy-coverage measurement.', results, suggested:selected };
    await writeFile(resolve(output, 'probe.json'), JSON.stringify(evidence,null,2)+'\n');
    console.log(JSON.stringify(evidence,null,2));
  } else {
    await mkdir(resolve(output, 'frames'), { recursive: true });
    const frames = [];
    for (let i=0; i<mode.moments.length; i++) {
      const moment = mode.moments[i], stem = `light-${String(i).padStart(2,'0')}`;
      const middle = await take(`date:${options.date}`, moment.sun);
      const old = await readFile(resolve(source, 'frames', stem+'.webp'));
      const first = await sharp(old).extract({left:0,top:0,width:pixelWidth,height:pixelHeight}).png().toBuffer();
      const last = await sharp(old).extract({left:(pixelWidth+pixelGap)*2,top:0,width:pixelWidth,height:pixelHeight}).png().toBuffer();
      const combined = await sharp({create:{width:totalWidth,height:pixelHeight,channels:4,background:{r:0,g:0,b:0,alpha:0}}})
        .composite([{input:first,left:0,top:0},{input:middle,left:pixelWidth+pixelGap,top:0},{input:last,left:(pixelWidth+pixelGap)*2,top:0}])
        .webp({quality:88,alphaQuality:100}).toBuffer();
      const src = `frames/${stem}.webp`;
      await writeFile(resolve(output,src),combined);
      if(moment.poster) await writeFile(resolve(output,'poster.webp'),combined);
      frames.push({src,stage:moment.stage,sun:moment.sun,sha256:digest(combined)});
      console.log(`${i+1}/${mode.moments.length} ${moment.stage}`);
    }
    const manifest = { name:'v8-light-establishment', source:'04-plants-make-space-timber', snapshot:'six-bay-radial-v1', run:'trained-10y', sourcePlateSha256:digest(await readFile(platePath)), originalEstablishingDate:'2029-06-21', establishingDate:options.date, matureDate:'2036-06-21', panels:['At installation','Establishing','Mature'], seconds:mode.seconds, gutter:spec.gutter/spec.slot[0], width:totalWidth,height:pixelHeight, frames, statement:'A later state of the existing growth scenario was selected to depict intermediate establishment. The approximate half-cover intention is editorial, not measured canopy performance. Camera, midsummer sun path and shadow settings match the source drawing. Installation and mature panels are retained from its existing images.' };
    await writeFile(resolve(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
    console.log(`Wrote ${frames.length} frames to ${output}`);
  }
} finally { page?.close(); studio?.stop(); }
process.exit(0);
