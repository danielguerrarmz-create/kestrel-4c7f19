// Offline build-time sprite rendering. The deck only loads walk-atlas.webp and manifest.json.
// Source/licence: ../assets/inhabitants/SOURCES.md. No model or WebGL is needed at runtime.
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname, sep } from 'node:path';
import { createHash } from 'node:crypto';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../..');
const output = resolve(here, '../assets/inhabitants');
const threeRoot = resolve(root, 'Horti-code-ture/node_modules/three');
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'C:/BOWER/Bower_Web/node_modules/playwright');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || 'C:/Users/cseif/AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe', args: ['--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
  page.on('pageerror', error => console.error(error));
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.pathname === '/') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><style>body{margin:0;background:#eef3ea}</style><script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script>' });
    const base = url.pathname.startsWith('/three/') ? threeRoot : output;
    const path = resolve(base, decodeURIComponent(url.pathname.replace(/^\/(three|assets)\//, '')));
    if (!path.startsWith(base + sep)) return route.abort();
    try { return route.fulfill({ contentType: extname(path) === '.js' ? 'text/javascript' : 'application/octet-stream', body: await readFile(path) }); }
    catch { return route.fulfill({ status: 404, body: path }); }
  });
  await page.goto('http://render.local/');
  const result = await page.evaluate(async () => {
    const THREE = await import('three');
    const { FBXLoader } = await import('three/addons/loaders/FBXLoader.js');
    const model = await new FBXLoader().loadAsync('/assets/QuaterniusHuman.fbx');
    const scene = new THREE.Scene();
    const palette = await new THREE.TextureLoader().loadAsync('/assets/ClothedLightSkin.png');
    const neutralPalette = document.createElement('canvas'); neutralPalette.width = palette.image.width; neutralPalette.height = palette.image.height;
    const nc = neutralPalette.getContext('2d'); nc.drawImage(palette.image, 0, 0);
    const pixels = nc.getImageData(0, 0, neutralPalette.width, neutralPalette.height);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const luminance = .2126 * pixels.data[i] + .7152 * pixels.data[i+1] + .0722 * pixels.data[i+2];
      const tone = Math.round(135 + luminance * .47);
      pixels.data[i] = pixels.data[i+1] = pixels.data[i+2] = tone;
    }
    nc.putImageData(pixels, 0, 0);
    const cloth = new THREE.CanvasTexture(neutralPalette); cloth.colorSpace = THREE.SRGBColorSpace; cloth.magFilter = THREE.NearestFilter;
    const material = new THREE.MeshStandardMaterial({ color: '#8b9690', map: cloth, roughness: 1, metalness: 0 });
    model.traverse(object => { if (object.isMesh) { object.material = material; object.frustumCulled = false; } });
    scene.add(model);
    const initialBox = new THREE.Box3().setFromObject(model, true);
    model.scale.multiplyScalar(1.75 / initialBox.getSize(new THREE.Vector3()).y);
    scene.add(new THREE.HemisphereLight('#ffffff', '#657266', 2.4));
    const key = new THREE.DirectionalLight('#ffffff', 2.0); key.position.set(-3, 6, 5); scene.add(key);
    const fill = new THREE.DirectionalLight('#ced8d2', .6); fill.position.set(3, 2, -4); scene.add(fill);
    const mixer = new THREE.AnimationMixer(model), clip = model.animations.find(clip => /walk/i.test(clip.name)) || model.animations[0];
    mixer.clipAction(clip).play(); mixer.setTime(0); model.updateMatrixWorld(true);
    const frames = 24, width = 112, height = 176;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(2); renderer.setSize(width, height); renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const atlas = document.createElement('canvas'); atlas.width = frames * width; atlas.height = 9 * height;
    const ctx = atlas.getContext('2d');
    // Bounds across the whole cycle keep feet/scale stable rather than fitting each frame.
    const bounds = new THREE.Box3();
    for (let i = 0; i < frames; i++) { mixer.setTime(i / frames * clip.duration); model.updateMatrixWorld(true); bounds.union(new THREE.Box3().setFromObject(model, true)); }
    const size = bounds.getSize(new THREE.Vector3()), centre = bounds.getCenter(new THREE.Vector3());
    const fieldHeight = size.y / (160 / height), fieldWidth = fieldHeight * width / height;
    const camera = new THREE.OrthographicCamera(-fieldWidth/2, fieldWidth/2, fieldHeight/2, -fieldHeight/2, .01, 30);
    const directions = [
      { name: 'front', angle: 0 }, { name: 'front-left', angle: 45 },
      { name: 'left', angle: 90 }, { name: 'back-left', angle: 135 },
      { name: 'back', angle: 180 }, { name: 'back-right', angle: 225 },
      { name: 'right', angle: 270 }, { name: 'front-right', angle: 315 },
      { name: 'plan', angle: 0, plan: true }
    ];
    for (const [row, direction] of directions.entries()) {
      const angle = direction.angle * Math.PI / 180;
      camera.up.set(0, 1, 0);
      if (direction.plan) { camera.position.set(centre.x, centre.y + 5, centre.z + .001); camera.up.set(0, 0, -1); }
      else camera.position.set(centre.x + Math.sin(angle) * 5, centre.y, centre.z + Math.cos(angle) * 5);
      camera.lookAt(centre); camera.updateProjectionMatrix();
      for (let frame = 0; frame < frames; frame++) {
        mixer.setTime(frame / frames * clip.duration); model.updateMatrixWorld(true);
        renderer.render(scene, camera);
        ctx.drawImage(renderer.domElement, frame * width, row * height, width, height);
      }
    }
    // Human-readable contact sheet, separate from the transparent runtime atlas.
    const preview = document.createElement('canvas'); preview.width = frames * 60; preview.height = 9 * 115;
    const pc = preview.getContext('2d'); pc.fillStyle = '#eef3ea'; pc.fillRect(0, 0, preview.width, preview.height);
    for (let row = 0; row < 9; row++) {
      pc.fillStyle = '#18352a'; pc.font = '12px sans-serif'; pc.fillText(directions[row].name, 5, row * 115 + 13);
      for (let frame = 0; frame < frames; frame++) pc.drawImage(atlas, frame * width, row * height, width, height, frame * 60, row * 115 + 16, 60, 94);
    }
    return { webp: atlas.toDataURL('image/webp', .88), preview: preview.toDataURL('image/png'), metadata: { image: 'walk-atlas.webp', atlas: 'walk-atlas.webp', width: atlas.width, height: atlas.height, cellWidth: width, cellHeight: height, columns: frames, rows: directions.length, frames, sourceClip: clip.name, sourceCycleSeconds: clip.duration, duration: 1.35, suggestedCycleSeconds: 1.35, foot: { x: width/2, y: height - 8 }, directions: directions.map((direction, row) => ({ row, ...direction, anchor: { x: width/2, y: direction.plan ? height/2 : height-8 } })), bounds: { min: bounds.min.toArray(), max: bounds.max.toArray() } } };
  });
  await writeFile(resolve(output, 'walk-atlas.webp'), Buffer.from(result.webp.split(',')[1], 'base64'));
  await writeFile(resolve(output, 'walk-preview.png'), Buffer.from(result.preview.split(',')[1], 'base64'));
  result.metadata.sourceSha256 = createHash('sha256').update(await readFile(resolve(output, 'QuaterniusHuman.fbx'))).digest('hex');
  result.metadata.author = 'Quaternius';
  result.metadata.license = 'CC0-1.0';
  result.metadata.source = 'https://opengameart.org/content/animated-human-low-poly';
  await writeFile(resolve(output, 'manifest.json'), JSON.stringify(result.metadata, null, 2) + '\n');
  console.log(JSON.stringify(result.metadata, null, 2));
} finally { await browser.close(); }
