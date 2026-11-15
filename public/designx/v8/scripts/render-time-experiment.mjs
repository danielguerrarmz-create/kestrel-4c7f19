// v8-owned presentation experiment. Reads the original frozen six-bay model and
// full trained-10y run; never edits the studio, generator, source film or release.
// --probe writes camera proofs; --render=orbit|roof renders a film; --fixed blends
// the matching original ink and timber films. Outputs remain under v8.
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, stat, copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { startStudio } from '../../../../drawings-in-code/pipeline/headless.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '../../../..');
const out = resolve(here, '../assets/time-experiment');
const proofs = resolve(here, '../.qa/time-experiment');
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || 'C:/BOWER/Bower_Web/node_modules/sharp');
const ffmpeg = require(resolve(repo, 'drawings-in-code/node_modules/ffmpeg-static'));
const { PerspectiveCamera, Matrix4 } = await import(pathToFileURL(resolve(repo, 'Horti-code-ture/node_modules/three/build/three.module.js')).href);
const args = Object.fromEntries(process.argv.slice(2).map(s => s.replace(/^--/, '').split('=')));
const width=1600, height=900, duration=51, fps=Number(args.fps||12);
const transition=[12,14], arc=Number(args.arc||180)*Math.PI/180, radius=Math.hypot(1.2,21), startAngle=Math.atan2(-21,1.2);
const smooth = p => { p=Math.max(0,Math.min(1,p)); return p*p*(3-2*p); };
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
await mkdir(out,{recursive:true}); await mkdir(proofs,{recursive:true});
const run = (cmd, argv) => new Promise((yes,no)=>{const p=spawn(cmd,argv,{stdio:['ignore','ignore','pipe']});let errors='';p.stderr.on('data',c=>errors+=c);p.on('exit',code=>code===0?yes():no(new Error(errors)));});
const camera = (t, variant='orbit') => {
  const p=Math.max(0,Math.min(1,t/49)), turn=startAngle+arc*smooth(p);
  return { eye:[radius*Math.cos(turn),radius*Math.sin(turn),1.7+(variant==='roof'?14.3:.9)*smooth(p)], target:[0,0,3], zoom:1.23 };
};
const timelineAt=(t,line)=>t<12 ? line.start+t/12*(line.planted-line.start) : t<13?line.planted : line.planted+Math.min(1,(t-13)/36)*(line.lastSummer-line.planted);
async function writeManifest() {
  const timeline=[{time:0,label:'Assembly',year:null,date:null},{time:12,label:'At installation',year:0,date:'2027-03-12'},{time:13,label:'Planting',year:0,date:'2027-03-12'}];
  const planted=Date.parse('2027-03-12T00:00:00Z'),end=Date.parse('2036-06-20T00:00:00Z');
  for(let year=1;year<=9;year++){const at=Date.UTC(2027+year,2,12);timeline.push({time:13+(at-planted)/(end-planted)*36,label:`Year ${year}`,year,date:`${2027+year}-03-12`});}
  timeline.push({time:49,label:'Established summer',year:(end-planted)/86400000/365.25,date:'2036-06-20'},{time:51,label:'Established summer',year:(end-planted)/86400000/365.25,date:'2036-06-20'});
  const variants=[];
  for(const [id,stem,label] of [['orbit','orbit','Low orbit'],['rise','roof','Rising orbit'],['fixed','fixed','Eye-level']]){
    try{const bytes=await readFile(resolve(out,`${stem}.mp4`));let cameraFrames;
      if(id==='fixed'){
        const c=new PerspectiveCamera(33.39848846798724,16/9,.05,600);c.position.set(1.2,1.7,21);c.lookAt(.2,3,0);c.updateMatrixWorld();
        const crop=new Matrix4().set(1080/770,0,0,0,0,1080/770,0,-50/770,0,0,1,0,0,0,0,1);
        const matrix=crop.multiply(c.projectionMatrix).multiply(c.matrixWorldInverse).toArray();
        cameraFrames=[{time:0,matrix,eye:[1.2,-21,1.7]},{time:51,matrix,eye:[1.2,-21,1.7]}];
      }else cameraFrames=JSON.parse(await readFile(resolve(out,`${stem}-camera.json`),'utf8')).samples;
      await copyFile(resolve(out,`${stem}.jpg`),resolve(out,`${stem}-poster.jpg`));
      const first=cameraFrames[0].eye,last=cameraFrames.at(-1).eye;
      const angle=(Math.atan2(last[1],last[0])-Math.atan2(first[1],first[0])+Math.PI*2)%(Math.PI*2);
      const cameraMotion={radiusMeters:Math.hypot(first[0],first[1]),arcDegrees:angle*180/Math.PI,startEyeHeightMeters:first[2],endEyeHeightMeters:last[2]};
      variants.push({id,label,src:`${stem}.mp4`,poster:`${stem}-poster.jpg`,bytes:bytes.length,sha256:digest(bytes),cameraMotion,cameraFrames});
    }catch{ /* A command may be making the first of several variants. */ }
  }
  const manifest={schema:'bower.time-experiment/1',duration,width,height,assemblyEnd:12,transition,startDate:'2027-03-12',endDate:'2036-06-20',timeline,variants,coordinateSystem:'World points use source model x east, y north, z up. For matrix multiplication convert to Three coordinates [x,z,-y,1]. Matrices are column-major viewProjection matrices. Eye stays in source model coordinates.',sources:{snapshot:'six-bay-radial-v1',run:'trained-10y',start:'2027-03-01',plantedDay:11,lastSummerDay:3399},evidence:'Authored camera and material transition over the existing generated assembly and provisional growth scenario. Timber appearance is illustrative; no performance, erection method or growth date is validated.'};
  await writeFile(resolve(out,'manifest.json'),JSON.stringify(manifest)+'\n');
}
let studio,page;
async function prepare() {
  studio=await startStudio(Number(args.port||5324),'six-bay-radial-v1');
  page=await studio.open({film:'',tour:'',view:'approach',timber:'ink',build:'0',run:'trained-10y'}, {width,height,scale:1});
  const data=await page.js(`(() => { const s=window.studio; s.paper.step=()=>false; s.paper.resize(); return {line:s.line(),start:s.growth.start,fov:s.paper.camera().fov}; })()`);
  console.log(JSON.stringify(data));
  return data;
}
async function draw(t, variant, look, data) {
  const c=camera(t,variant),at=timelineAt(t,data.line);
  const projection=await page.js(`(async()=>{const s=window.studio,c=s.paper.camera(); c.position.set(${c.eye[0]},${c.eye[2]},${-c.eye[1]}); c.zoom=${c.zoom}; c.lookAt(${c.target[0]},${c.target[2]},${-c.target[1]});c.updateProjectionMatrix();c.updateMatrixWorld();s.look(${JSON.stringify(look)});await s.film(${at},${1/fps});return {matrix:c.projectionMatrix.clone().multiply(c.matrixWorldInverse).toArray()};})()`);
  return {bytes:await page.shot('jpeg'), projection};
}
try {
  if (Object.hasOwn(args,'manifest')) {
    // Rebuild the manifest after independently rendering a variant.
  } else if (Object.hasOwn(args,'fixed')) {
    const source='C:/BOWER/drawings-in-code/exports';
    const ink=resolve(source,'approach-ink/approach-ink-16x9.mp4'),wood=resolve(source,'approach-timber/approach-timber-16x9.mp4');
    const crop='crop=1920:770:0:130,scale=1600:900:force_original_aspect_ratio=increase,crop=1600:900,setsar=1';
    await run(ffmpeg,['-y','-i',ink,'-i',wood,'-filter_complex',`[0:v]${crop},trim=0:14,setpts=PTS-STARTPTS[a];[1:v]${crop},trim=start=12,setpts=PTS-STARTPTS[b];[a][b]xfade=transition=fade:duration=2:offset=12[v]`,'-map','[v]','-c:v','libx264','-crf','20','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart','-an',resolve(out,'fixed.mp4')]);
    await run(ffmpeg,['-y','-ss','49','-i',resolve(out,'fixed.mp4'),'-frames:v','1',resolve(out,'fixed.jpg')]);
    await writeFile(resolve(out,'fixed-source.json'),JSON.stringify({sources:await Promise.all([ink,wood].map(async p=>({file:p,bytes:(await stat(p)).size,sha256:digest(await readFile(p))}))),transition,crop:'source x=0,y=130,w=1920,h=770; cover-fitted to 1600x900'},null,2)+'\n');
    console.log('Fixed eye-level comparison written.');
  } else {
    const data=await prepare();
    if (Object.hasOwn(args,'probe')) {
      for(const variant of ['orbit','roof'])for(const t of [6,12,28,49]){
        const began=performance.now(), frame=await draw(t,variant,t<12?'ink':'wood',data);
        await writeFile(resolve(proofs,`${variant}-${t}.jpg`),frame.bytes);
        console.log(`${variant} ${t}: ${((performance.now()-began)/1000).toFixed(2)} s`);
      }
      await writeFile(resolve(proofs,'timeline.json'),JSON.stringify(data,null,2)+'\n');
    } else {
      const variant=args.render;
      if(!['orbit','roof'].includes(variant))throw new Error('Use --probe, --fixed or --render=orbit|roof');
      const frames=resolve(proofs,variant);await mkdir(frames,{recursive:true});
      const samples=[],total=Math.round(duration*fps),began=performance.now();
      for(let i=0;i<total;i++){
        const t=i/fps,blend=smooth((t-transition[0])/(transition[1]-transition[0]));
        const frame=await draw(t,variant,blend===0?'ink':'wood',data);
        let bytes=frame.bytes;
        if(blend>0&&blend<1){const ink=await draw(t,variant,'ink',data);const a=await sharp(ink.bytes).raw().toBuffer(),b=await sharp(bytes).raw().toBuffer();for(let k=0;k<a.length;k++)a[k]=Math.round(a[k]*(1-blend)+b[k]*blend);bytes=await sharp(a,{raw:{width,height,channels:3}}).jpeg({quality:94}).toBuffer();}
        await writeFile(resolve(frames,`${String(i).padStart(5,'0')}.jpg`),bytes);
        samples.push({time:t,...camera(t,variant),...frame.projection});
        if(i%60===59){const elapsed=(performance.now()-began)/1000;console.log(`${variant} ${i+1}/${total}, ${(elapsed/(i+1)).toFixed(2)}s/frame, ~${Math.ceil((total-i-1)*elapsed/(i+1)/60)} min left`);}
      }
      await run(ffmpeg,['-y','-framerate',String(fps),'-i',resolve(frames,'%05d.jpg'),'-vf','fps=24','-c:v','libx264','-crf','20','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart','-an',resolve(out,`${variant}.mp4`)]);
      await run(ffmpeg,['-y','-ss','49','-i',resolve(out,`${variant}.mp4`),'-frames:v','1',resolve(out,`${variant}.jpg`)]);
      await writeFile(resolve(out,`${variant}-camera.json`),JSON.stringify({coordinateSystem:'source model x east, y north, z up; Three world x east,y up,z south; matrices column-major',fps,samples})+'\n');
      await writeFile(resolve(out,'timeline-source.json'),JSON.stringify(data,null,2)+'\n');
      console.log(`Wrote ${variant}.mp4`);
    }
  }
}finally{page?.close();studio?.stop();}
if(!Object.hasOwn(args,'probe'))await writeManifest();
process.exit(0);
