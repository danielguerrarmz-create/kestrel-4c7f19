// Re-render the existing orbit end view with room for its complete cast shadow.
// Reads the frozen geometry and growth record; leaves the Time assets unchanged.
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { startStudio } from '../../../../drawings-in-code/pipeline/headless.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../assets/reference');
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || 'C:/BOWER/Bower_Web/node_modules/sharp');
const frame = { width:2400, height:1200, left:600, top:100 };
await mkdir(out, { recursive:true });
let studio, page;
try {
  studio = await startStudio(5326, 'six-bay-radial-v1');
  page = await studio.open({plate:'', tour:'', view:'approach', timber:'wood', build:'0', run:'trained-10y'}, {width:1600, height:900, scale:1});
  const fov = await page.js('window.studio.paper.camera().fov');
  await page.size(frame.width, frame.height, 1);
  const projection = await page.js(`(async () => {
    const s = window.studio, p = s.paper;
    p.step = () => false; p.resize(); p.resize = () => false;
    const c = p.camera();
    c.position.set(-1.2, 2.6, -21); c.lookAt(0, 3, 0); c.zoom = 1.23;
    c.fov = ${fov};
    c.setViewOffset(1600, 900, -${frame.left}, -${frame.top}, ${frame.width}, ${frame.height});
    c.updateProjectionMatrix(); c.updateMatrixWorld();
    s.look('wood'); await s.film(3399, 1/12);
    return c.projectionMatrix.clone().multiply(c.matrixWorldInverse).toArray();
  })()`);
  const bytes = await page.shot();
  await sharp(bytes).webp({lossless:true}).toFile(resolve(out, 'bower-shadow.webp'));
  await writeFile(resolve(out, 'render.json'), JSON.stringify({snapshot:'six-bay-radial-v1',run:'trained-10y',day:3399,eye:[-1.2,21,2.6],target:[0,0,3],zoom:1.23,fov,originalFrame:[1600,900],expandedFrame:frame,projection}, null, 2)+'\n');
  console.log(`Rendered ${frame.width} x ${frame.height} reference with expanded shadow margins.`);
} finally { page?.close(); studio?.stop(); }
process.exit(0);
