/**
 * Import supplied Bower factory drawings without changing their geometry or timelines.
 * Usage: node scripts/designx/import-factory.mjs [read-only source directory]
 * Only the drawing engine, scene fragments and selected public-facing card fields are used.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const destination = fileURLToPath(new URL('../../public/designx/5/factory/', import.meta.url));
const source = resolve(process.argv[2] || 'C:/BOWER/bower-factory');
const modules = ['projection', 'timeline', 'solids', 'parts', 'labels', 'dimensions', 'pointcloud', 'exploded', 'hud'];
const inputs = new Map();
const read = path => {
  const buffer = readFileSync(join(source, path));
  inputs.set(path.replaceAll('\\', '/'), createHash('sha256').update(buffer).digest('hex'));
  return buffer.toString('utf8').replace(/^\uFEFF/, '');
};
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const data = value => JSON.stringify(value).replaceAll('<', '\\u003c');
const engine = modules.map(name => read(`engine/${name}.js`)).join('\n');
const stationShell = read('engine/page.js').split('const caps=')[0]
  .replace("JSON.parse($('card-data').textContent).number", 'DRAWING_META.number')
  // The source page lift assumed its taller reference layout. In a presentation
  // viewport it clips the exploded lamellae; keep the same geometry centred instead.
  .replace("const lift={'05':.065,'07':.095,'11':.05}[station]||0;", 'const lift=0;');
const overviewShell = read('engine/page-overview.js').split('let paused=false')[0];

// This adapter replaces only the source page controls and animation scheduler.
// The source drawing/fit functions, scene timings, labels and colours are retained.
const lifecycle = String.raw`
const factoryMedia = matchMedia('(prefers-reduced-motion: reduce)');
let factoryActive=false, factoryIntent=true, factoryRaf=0, factoryLast=0, factoryEmit=0;
let factoryTime=typeof VIEWPORT_T!=='undefined'?VIEWPORT_T:STATIC_T;
let factoryStatic=factoryMedia.matches;
let factoryDraws=0;
const factoryReady = () => window.__ready===true;
function factoryState(){
  const index=typeof stepOf==='function'?stepOf(factoryTime):0;
  const item=typeof STEPS!=='undefined'?STEPS[index]:null;
  return {id:DRAWING_META.id,title:DRAWING_META.title,duration:DUR,time:factoryTime,
    playing:!!factoryRaf,active:factoryActive,reducedMotion:factoryMedia.matches,
    step:item?item[0]:'Process overview',caption:item?item[1]:DRAWING_META.whatHappens,
    stepIndex:index,static:factoryStatic,ready:factoryReady(),renderCount:factoryDraws};
}
function factoryNotify(){
  const state=factoryState();
  window.dispatchEvent(new CustomEvent('bower:factory-state',{detail:state}));
  if(parent!==window)parent.postMessage({type:'bower-factory:state',state},'*');
}
function factoryRender(){frame(factoryTime,{static:factoryStatic});factoryDraws++;}
function factoryFit(){
  // Some scenes place insets after the initial viewBox is known. Reconcile their
  // full timeline with the compact deck viewport, retaining one stable camera.
  VB=null;root.removeAttribute('transform');fit();
  if(DRAWING_META.id==='overview')return;
  const times=[...new Set([...FIT_TIMES,...(typeof REVIEW_TIMES!=='undefined'?REVIEW_TIMES:[]),STATIC_T])];
  for(let pass=0;pass<8;pass++){
    let x0=VB[0],y0=VB[1],x1=x0+VB[2],y1=y0+VB[3];
    const pad=8*Math.max(VB[2]/Math.max(1,svg.clientWidth),VB[3]/Math.max(1,svg.clientHeight));
    for(const value of times){
      frame(value,{});
      // SVG getBBox includes geometry outside clip paths. The visible inset
      // outlines already bound those details; invisible shearing tools must
      // not enlarge the camera by several metres as they leave the inset.
      for(const clipped of root.querySelectorAll('[clip-path]'))clipped.style.display='none';
      const b=root.getBBox();
      x0=Math.min(x0,b.x-pad);y0=Math.min(y0,b.y-pad);
      x1=Math.max(x1,b.x+b.width+pad);y1=Math.max(y1,b.y+b.height+pad);
    }
    if(Math.abs(x0-VB[0])+Math.abs(y0-VB[1])+Math.abs(x1-VB[0]-VB[2])+Math.abs(y1-VB[1]-VB[3])<.5)break;
    VB=[x0,y0,x1-x0,y1-y0];svg.setAttribute('viewBox',VB.map(n1).join(' '));
  }
}
function factoryStop(){
  if(factoryRaf)cancelAnimationFrame(factoryRaf);
  factoryRaf=0;factoryLast=0;
}
function factoryTick(now){
  factoryRaf=0;
  if(!factoryActive||!factoryIntent||document.hidden||factoryMedia.matches)return;
  if(factoryLast)factoryTime=(factoryTime+(now-factoryLast)/1000)%DUR;
  factoryLast=now;factoryStatic=false;factoryRender();
  factoryRaf=requestAnimationFrame(factoryTick);
  if(now-factoryEmit>120){factoryEmit=now;factoryNotify();}
}
function factoryStart(){
  if(factoryReady()&&factoryActive&&factoryIntent&&!document.hidden&&!factoryMedia.matches&&!factoryRaf){
    factoryLast=0;factoryRaf=requestAnimationFrame(factoryTick);
  }
}
function factorySeek(value){
  const parsed=Number(value);if(!Number.isFinite(parsed))return factoryState();
  factoryStop();factoryIntent=false;factoryStatic=false;
  factoryTime=Math.max(0,Math.min(DUR,parsed));
  if(factoryReady())factoryRender();factoryNotify();return factoryState();
}
window.__ready=false;
window.__duration=DUR;
window.__reviewTimes=typeof REVIEW_TIMES!=='undefined'?REVIEW_TIMES:null;
window.__viewportT=typeof VIEWPORT_T!=='undefined'?VIEWPORT_T:null;
window.__setT=factorySeek;
window.BOWER_FACTORY=Object.freeze({
  setActive(value){factoryActive=!!value;if(factoryActive)factoryStart();else factoryStop();factoryNotify();return factoryState();},
  play(){factoryIntent=true;factoryStatic=false;factoryStart();factoryNotify();return factoryState();},
  pause(){factoryIntent=false;factoryStop();factoryNotify();return factoryState();},
  seek:factorySeek,
  renderStatic(){factoryIntent=false;factoryStop();factoryStatic=true;factoryTime=STATIC_T;
    if(factoryReady())factoryRender();factoryNotify();return factoryState();},
  getState:factoryState,
  exportSvg(){
    const copy=svg.cloneNode(true);copy.setAttribute('xmlns','http://www.w3.org/2000/svg');
    copy.setAttribute('width',svg.clientWidth);copy.setAttribute('height',svg.clientHeight);
    copy.setAttribute('style','background:#fdfcf9;color:#23272b');
    return new XMLSerializer().serializeToString(copy);
  }
});
// The file:// preview has opaque origins. Only its actual parent may issue the small
// public drawing API; no arbitrary code, URLs, storage or DOM commands are accepted.
window.addEventListener('message',async event=>{
  if(event.source!==parent||parent===window||event.data?.type!=='bower-factory:command')return;
  const {requestId,action,args}=event.data;
  const allowed={state:'getState',getState:'getState',setActive:'setActive',play:'play',pause:'pause',seek:'seek',renderStatic:'renderStatic',exportSvg:'exportSvg'};
  const method=Object.hasOwn(allowed,action)?allowed[action]:null;
  if(!method)return;
  try{
    await window.BOWER_FACTORY_READY;
    const result=window.BOWER_FACTORY[method](...(Array.isArray(args)?args:[]));
    parent.postMessage({type:'bower-factory:reply',requestId,result},'*');
  }catch(error){parent.postMessage({type:'bower-factory:reply',requestId,error:String(error?.message||error)},'*');}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)factoryStop();else factoryStart();factoryNotify();});
factoryMedia.addEventListener('change',()=>{
  factoryStop();factoryStatic=factoryMedia.matches;
  if(factoryStatic){factoryTime=STATIC_T;if(factoryReady())factoryRender();}
  else factoryStart();factoryNotify();
});
let factoryWidth=0,factoryHeight=0;
const factoryResize=new ResizeObserver(()=>{
  if(!factoryReady()||!svg.clientWidth||!svg.clientHeight)return;
  if(svg.clientWidth===factoryWidth&&svg.clientHeight===factoryHeight)return;
  factoryWidth=svg.clientWidth;factoryHeight=svg.clientHeight;
  factoryFit();factoryRender();
});
factoryResize.observe(svg);
window.BOWER_FACTORY_READY=(async()=>{
  await document.fonts.load('11.5px Safiro');await document.fonts.ready;
  S.fontSize=DRAWING_META.id==='overview'?11:11.5;
  factoryFit();factoryWidth=svg.clientWidth;factoryHeight=svg.clientHeight;
  if(factoryStatic)factoryTime=STATIC_T;
  factoryRender();window.__ready=true;factoryNotify();factoryStart();
  if(parent!==window)parent.postMessage({type:'bower-factory:ready',state:factoryState()},'*');
  return window.BOWER_FACTORY;
})();
`;

const catalog = [{
  id:'overview', number:null, title:'Process overview', stage:'Factory',
  whatHappens:'Fourteen connected operations, from timber preparation to a finished rib.',
  bower:'Proposed manufacturing process. This arrangement explains the sequence; it is not a verified factory floor plan.',
  testing:'Engineering drawings in development. Equipment, process performance and the proposed tower clamps still require validation.',
  sourceLinks:[],
}];
const stationIds = readdirSync(join(source,'stations'),{withFileTypes:true})
  .filter(item=>item.isDirectory()&&/^\d{2}-/.test(item.name)).map(item=>item.name).sort();
for(const id of stationIds){
  const card=JSON.parse(read(`stations/${id}/card.json`));
  const display=card.display||card;
  catalog.push({id,number:card.number,title:card.verb,stage:card.stage,
    whatHappens:display.what_happens,bower:card.what_is_bowers,testing:card.still_to_prove,
    sourceLinks:(card.who_has_done_this||[]).map(item=>({title:item.name,url:item.url})),
  });
}
mkdirSync(destination,{recursive:true});
const annotationCss='.lb{font-family:Safiro,Arial,sans-serif;font-weight:400;font-variant-numeric:tabular-nums;paint-order:stroke;stroke:#fdfcf9;stroke-width:3px;stroke-linejoin:round}';
for(const entry of catalog){
  const isOverview=entry.id==='overview';
  const scene=read(isOverview?'overview/scene.js':`stations/${entry.id}/scene.js`);
  const script=`const DRAWING_META=${data(entry)};\nconst S={};\n${engine}\n${scene}\n${isOverview?overviewShell:stationShell}\n${lifecycle}`;
  const title=isOverview?'Bower manufacturing process overview':`Bower station ${entry.number}: ${entry.title}`;
  const html=`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(title)}</title><link rel="stylesheet" href="../../4/fonts.css">
<style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#fdfcf9}svg{display:block;width:100%;height:100%;max-height:none}body{font-family:Safiro,Arial,sans-serif}${annotationCss}</style>
</head><body><svg id="s" role="img" aria-label="${escape(title)}"><style>${annotationCss}</style><g id="g"></g></svg>
<script>(()=>{${script}\n})();</script></body></html>\n`;
  writeFileSync(join(destination,`${entry.id}.html`),html);
}
writeFileSync(join(destination,'catalog.js'),`/* Selected public drawing metadata; source cards and research files are not published. */\nwindow.DESIGNX_FACTORY_CATALOG=${JSON.stringify(catalog,null,2)};\n`);

let commit=null;
const headPath=join(source,'.git/HEAD');
if(existsSync(headPath)){
  const head=readFileSync(headPath,'utf8').trim();
  if(/^[a-f\d]{40}$/i.test(head))commit=head;
  else if(head.startsWith('ref: ')){
    const refPath=join(source,'.git',head.slice(5));
    if(existsSync(refPath))commit=readFileSync(refPath,'utf8').trim();
  }
}
const provenance={
  source:'Bower factory drawing package',sourceCommit:commit,
  sourceGeometry:'Engine and scene fragments retained without modification.',
  adaptations:['Drawing-only page shell with centred station framing','Safiro annotation font','Pause, seek, active-slide and reduced-motion lifecycle','Static SVG export'],
  qualification:'Engineering drawings in development. Overview is a process arrangement, not a verified floor plan. Station 09 clamps remain a proposal.',
  files:Object.fromEntries([...inputs].sort(([a],[b])=>a.localeCompare(b))),
};
writeFileSync(join(destination,'provenance.json'),`${JSON.stringify(provenance,null,2)}\n`);
console.log(`Imported ${catalog.length} authentic drawings into ${destination}`);
