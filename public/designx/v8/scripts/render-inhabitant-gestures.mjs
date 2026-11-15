// Offline authored gestures on the existing CC0 clothed human. No runtime mesh.
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

    const reference = await (await fetch('/assets/manifest.json')).json();
    const mixer = new THREE.AnimationMixer(model), idle = model.animations.find(clip => /\|Idle$/.test(clip.name));
    if (!idle) throw new Error('The source Idle animation is required');
    mixer.clipAction(idle).play(); mixer.setTime(0); model.updateMatrixWorld(true);
    const bones = {}; model.traverse(o => { if(o.isBone) bones[o.name]=o; });
    // The game asset's Idle stance crouches. Relax the knees and shorten its
    // stagger, then place both shoes on the same ground before freezing it.
    const aim=(name,direction)=>{
      const bone=bones[name],parent=bone.parent.getWorldQuaternion(new THREE.Quaternion());
      const world=bone.getWorldQuaternion(new THREE.Quaternion());
      const current=new THREE.Vector3(0,1,0).applyQuaternion(world).normalize();
      const delta=new THREE.Quaternion().setFromUnitVectors(current,new THREE.Vector3(...direction).normalize());
      bone.quaternion.copy(parent.invert().multiply(delta).multiply(world));
      model.updateMatrixWorld(true);
    };
    for(const [side,out] of [['Left',.03],['Right',-.03]]){
      aim(side+'UpLeg',[out,-1,.08]);aim(side+'Leg',[0,-1,-.06]);
      aim(side+'Foot',[0,-.3,1]);aim(side+'ToeBase',[0,0,1]);
    }
    // Only the upper body changes between frames; the relaxed feet stay planted.
    const frozen = Object.values(bones).map(bone=>({bone,position:bone.position.clone(),quaternion:bone.quaternion.clone()}));
    const baseBox = new THREE.Box3().setFromObject(model,true);
    const referenceBounds = new THREE.Box3(new THREE.Vector3(...reference.bounds.min),new THREE.Vector3(...reference.bounds.max));
    const centre=referenceBounds.getCenter(new THREE.Vector3()),size=referenceBounds.getSize(new THREE.Vector3());
    const feet = bones.LeftFoot.getWorldPosition(new THREE.Vector3()).add(bones.RightFoot.getWorldPosition(new THREE.Vector3())).multiplyScalar(.5);
    model.position.add(new THREE.Vector3(centre.x-feet.x,referenceBounds.min.y-baseBox.min.y,centre.z-feet.z));
    model.updateMatrixWorld(true);
    const axisX=new THREE.Vector3(1,0,0),axisY=new THREE.Vector3(0,1,0),axisZ=new THREE.Vector3(0,0,1);
    const rotate=(name,axis,angle)=>{
      const bone=bones[name],parent=bone.parent.getWorldQuaternion(new THREE.Quaternion());
      const localAxis=axis.clone().applyQuaternion(parent.invert());
      bone.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(localAxis,angle));
      model.updateMatrixWorld(true);
    };
    const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
    const actions=[{id:'idle',duration:4,loop:true,rowOffset:0},{id:'look',duration:4.5,loop:false,rowOffset:8},{id:'smell',duration:5.5,loop:false,rowOffset:16}];
    function pose(action,phase){
      for(const {bone,position,quaternion} of frozen){bone.position.copy(position);bone.quaternion.copy(quaternion);}
      model.updateMatrixWorld(true);
      const envelope=smooth(phase/.25)*smooth((1-phase)/.25);
      const breath=Math.sin(phase*Math.PI*2);
      rotate('Spine2',axisX,.006*breath);
      if(action==='idle'){
        rotate('Head',axisY,.04*Math.sin(phase*Math.PI*2));
        rotate('Neck',axisZ,.012*Math.sin(phase*Math.PI*2));
      }else if(action==='look'){
        const turn=Math.sin((phase-.12)*Math.PI*2)*envelope;
        rotate('Spine2',axisY,.10*turn);
        rotate('Neck',axisY,.23*turn);
        rotate('Head',axisY,.18*turn);
        rotate('Neck',axisX,-.15*envelope);
        rotate('Head',axisX,-.07*envelope);
      }else{
        rotate('Spine',axisX,.21*envelope);
        rotate('Spine1',axisX,.13*envelope);
        rotate('Spine2',axisX,.08*envelope);
        rotate('Neck',axisX,-.06*envelope);
        rotate('Head',axisX,.12*envelope);
        rotate('RightArm',axisX,-.36*envelope);
        rotate('RightForeArm',axisX,-.66*envelope);
        rotate('LeftArm',axisX,-.09*envelope);
      }
      model.updateMatrixWorld(true);
    }
    const frames=24,width=112,height=176;
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});
    renderer.setPixelRatio(2);renderer.setSize(width,height);renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
    const atlas=document.createElement('canvas');atlas.width=width*frames;atlas.height=height*8*actions.length;
    const ctx=atlas.getContext('2d');
    const fieldHeight=size.y/(160/height),fieldWidth=fieldHeight*width/height;
    const camera=new THREE.OrthographicCamera(-fieldWidth/2,fieldWidth/2,fieldHeight/2,-fieldHeight/2,.01,30);
    const directions=reference.directions.slice(0,8);
    const preview=document.createElement('canvas');preview.width=8*140;preview.height=actions.length*250;
    const pc=preview.getContext('2d');pc.fillStyle='#fdfcf9';pc.fillRect(0,0,preview.width,preview.height);
    const bounds=new THREE.Box3();
    for(const [actionIndex,action] of actions.entries()){
      for(const [directionIndex,direction] of directions.entries()){
        const angle=direction.angle*Math.PI/180;
        camera.position.set(centre.x+Math.sin(angle)*5,centre.y,centre.z+Math.cos(angle)*5);
        camera.lookAt(centre);camera.updateProjectionMatrix();
        for(let frame=0;frame<frames;frame++){
          pose(action.id,frame/(action.loop?frames:frames-1));
          bounds.union(new THREE.Box3().setFromObject(model,true));
          renderer.render(scene,camera);
          const row=action.rowOffset+directionIndex;
          ctx.drawImage(renderer.domElement,frame*width,row*height,width,height);
          if(frame===11){
            pc.fillStyle='#173629';pc.font='14px sans-serif';pc.fillText(action.id+' / '+direction.name,directionIndex*140+5,actionIndex*250+20);
            pc.drawImage(renderer.domElement,directionIndex*140,actionIndex*250+25,140,220);
          }
        }
      }
    }
    return {webp:atlas.toDataURL('image/webp',.90),preview:preview.toDataURL('image/png'),metadata:{
      schema:'bower.inhabitant-gestures/1',atlas:'gestures.webp',width:atlas.width,height:atlas.height,cellWidth:width,cellHeight:height,
      frames,directions:directions.map(d=>({...d,anchor:{x:56,y:168}})),actions:actions.map(a=>({...a,frames})),
      referenceAtlas:'walk-atlas.webp',referenceHeight:160,foot:{x:56,y:168},sourceClip:idle.name,
      evidence:'Authored relaxed stance and upper-body gestures based on the CC0 Idle clip. Knees and feet are repositioned before rendering. No behavioural simulation.',
      authoredActions:{idle:'Subtle breathing and head motion.',look:'Slow head and upper-body turn with a lifted gaze.',smell:'Torso leans toward planting; head inclines and one forearm reaches gently.'},
      bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()},referenceBounds:reference.bounds
    }};
  });
  await writeFile(resolve(output,'gestures.webp'),Buffer.from(result.webp.split(',')[1],'base64'));
  await mkdir(resolve(here,'../.qa'),{recursive:true});
  await writeFile(resolve(here,'../.qa/inhabitant-gestures-preview.png'),Buffer.from(result.preview.split(',')[1],'base64'));
  result.metadata.sourceSha256=createHash('sha256').update(await readFile(resolve(output,'QuaterniusHuman.fbx'))).digest('hex');
  result.metadata.author='Quaternius; authored gesture poses by Bower';result.metadata.license='CC0-1.0';
  result.metadata.source='https://opengameart.org/content/animated-human-low-poly';
  await writeFile(resolve(output,'gestures.json'),JSON.stringify(result.metadata,null,2)+'\n');
  console.log(JSON.stringify({file:'gestures.webp',width:result.metadata.width,height:result.metadata.height,actions:result.metadata.actions,bounds:result.metadata.bounds}));
}finally{await browser.close();}
