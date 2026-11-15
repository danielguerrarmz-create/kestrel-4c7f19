/* A second telling of Time: a rendered camera study, with an explicit model clock.
   The browser decodes the film and projects authored occupants; it loads no plant mesh. */
(() => {
  'use strict';
  const BASE = 'v8/assets/time-experiment/';
  const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
  const fract = x => ((x%1)+1)%1;
  // Author routes in building metres, then sample by distance, not spline parameter.
  // These vignettes play at an everyday pace over the accelerated growth film.
  function route(points) {
    const samples=[{point:points[0],distance:0}];
    for(let i=0;i<points.length-1;i++) for(let n=1;n<=40;n++) {
      const t=n/40,a=points[Math.max(0,i-1)],b=points[i],c=points[i+1],d=points[Math.min(points.length-1,i+2)];
      const point=b.map((v,k)=>.5*((2*v)+(-a[k]+c[k])*t+(2*a[k]-5*v+4*c[k]-d[k])*t*t+(-a[k]+3*v-3*c[k]+d[k])*t*t*t));
      const last=samples.at(-1);samples.push({point,distance:last.distance+Math.hypot(...point.map((v,k)=>v-last.point[k]))});
    }
    return {samples,length:samples.at(-1).distance};
  }
  function along(path,distance) {
    const s=path.samples,d=clamp(distance,0,path.length);
    let lo=0,hi=s.length-1;
    while(hi-lo>1){const mid=(lo+hi)>>1;if(s[mid].distance<d)lo=mid;else hi=mid;}
    const a=s[lo],b=s[hi],p=(d-a.distance)/(b.distance-a.distance||1);
    return {point:a.point.map((v,i)=>v+(b.point[i]-v)*p),heading:Math.atan2(b.point[1]-a.point[1],b.point[0]-a.point[0])};
  }
  const walks=[
    {id:'through',start:13,speed:1.12,gap:7,path:route([[9,-5.2,0],[4.65,-2.6845,0],[0,-.2,0],[-4.65,2.6845,0],[-9,5.2,0]])},
    {id:'around',start:18,speed:1.18,gap:8,path:route([[11,-8,0],[8,-6,0],[8.2,-2,0],[8,2,0],[6.8,4,0],[4.65,2.6845,0],[.2,0,0],[-4.65,-2.6845,0],[-10,-5.8,0]])}
  ];
  function occupationAt(time) {
    return walks.flatMap(walk=>{
      if(time<walk.start)return [];
      const elapsed=(time-walk.start)%(walk.path.length/walk.speed+walk.gap),distance=elapsed*walk.speed;
      if(distance>=walk.path.length)return [];
      return [{id:walk.id,...along(walk.path,distance),distance,cycle:fract(distance/1.4),alpha:Math.min(1,distance/1.6,(walk.path.length-distance)/1.6)}];
    });
  }
  const perch=[3.228,-4.444,3.32]; // Timber surface at lap:R1.B2.hoop0:R1.fine.cw.15.
  const approach=route([[14,-14,6],[9,-10,6.2],[5,-6,4.4],perch]);
  const departure=route([perch,[1,-3,4.1],[-4,1,5.8],[-14,10,7]]);
  function birdAt(time) {
    const start=[22,41.5].find(t=>time>=t&&time<t+9);if(start===undefined)return null;
    const t=time-start;
    if(t<3.4){const p=t/3.4;return {...along(approach,approach.length*(1-Math.pow(1-p,1.35))),flying:true,flap:Math.sin(t*Math.PI*13),alpha:clamp(t/.4,0,1)};}
    if(t<5.6)return {point:perch,heading:-2.5+.2*Math.sin((t-3.4)*2),flying:false,flap:0,alpha:1};
    const p=(t-5.6)/3.4;
    return {...along(departure,departure.length*Math.pow(p,1.3)),flying:true,flap:Math.sin((t-5.6)*Math.PI*14),alpha:clamp((1-p)*7,0,1)};
  }
  const asset = file => new URL(file.startsWith('v8/') ? file : BASE+file,document.baseURI).href;
  const html = `<section class="v7-scene v8-time-experiment-scene">
    <h2 class="v7-title">A room through time</h2>
    <img class="v8-time-experiment-poster" src="${BASE}orbit-poster.jpg" alt="The established timber room, seen from a low orbit">
    <div data-v8-time-experiment class="slide-interaction">
      <canvas role="img" aria-label="An orbital study of assembly and growth"></canvas>
      <nav class="v8-time-cameras" aria-label="Camera path"><span>Camera</span><button data-time-variant="fixed">Eye level</button><button data-time-variant="orbit" aria-pressed="true">Orbit</button><button data-time-variant="rise">Rise</button></nav>
      <div class="v8-time-message" role="status" hidden><span></span><button data-time-retry hidden>Retry drawing</button></div>
      <div class="v8-time-footer v8-drawing-timeline"><button data-time-play aria-label="Pause drawing">Pause</button><div class="v8-time-when v8-drawing-when"><output data-time-readout class="v8-drawing-readout">Assembly</output><span data-time-date class="v8-drawing-context">Before planting</span></div><div class="v8-time-track v8-drawing-track"><input type="range" aria-label="Time since planting" min="0" max="51" step="0.01" value="0" disabled><div class="v8-time-axis v8-drawing-axis" aria-hidden="true"><span style="left:0">Assembly</span><span style="left:25.49%">Planted</span><span style="left:39.6%">Year 2</span><span style="left:60.78%">Year 5</span><span style="left:96.08%">Year 9</span></div></div></div>
      <p class="v8-time-evidence">Pre-rendered growth scenario · people and wildlife are authored vignettes</p>
    </div>
    <p data-time-print-caption>Year 9 · Low orbit · Timber and planting scenario</p>
  </section>`;
  function mount(root) {
    const $ = s => root.querySelector(s), canvas=$('canvas'), ctx=canvas.getContext('2d');
    const video=document.createElement('video'); video.muted=true; video.loop=true; video.playsInline=true; video.preload='metadata'; video.hidden=true; root.append(video);
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    const state={ready:false,active:false,playing:!motion.matches,running:false,time:motion.matches?49:0,duration:51,variant:'orbit',error:null};
    const range=$('input'), play=$('[data-time-play]'), message=$('.v8-time-message');
    let manifest=null, manifestPromise=null, atlas=null, raf=0, loadedVariant='', loadTimer=0, pendingTime=0, destroyed=false;
    const current=()=>manifest?.variants.find(v=>v.id===state.variant);
    const usable=()=>state.active&&!document.hidden&&!destroyed;
    function showMessage(text,error=false) { message.hidden=!text; message.querySelector('span').textContent=text||''; $('[data-time-retry]').hidden=!error; }
    function yearAt(t) {
      const points=manifest?.timeline?.filter(p=>Number.isFinite(p.year))||[{time:13,year:0},{time:49,year:9.2758}];
      let lo=points[0],hi=points.at(-1);
      for(let i=1;i<points.length;i++) if(t<=points[i].time){lo=points[i-1];hi=points[i];break;}
      return lo.year+(hi.year-lo.year)*clamp((t-lo.time)/(hi.time-lo.time||1),0,1);
    }
    function timeText() {
      const assembly=manifest?.assemblyEnd??12;
      if(state.time<assembly) return ['Assembly',`${Math.round(state.time/assembly*100)}% assembled`];
      if(state.time<13) return ['At installation','Year 0 · Planting begins'];
      const year=yearAt(state.time), years=Math.floor(year), months=Math.floor((year-years)*12);
      const date=new Date(Date.parse((manifest?.startDate||'2027-03-12')+'T00:00:00Z')+year*365.25*86400000);
      const calendar=date.toLocaleDateString('en-GB',{month:'short',year:'numeric',timeZone:'UTC'});
      return [`Year ${years}${months?` · ${months} ${months===1?'month':'months'}`:''}`,state.time<(manifest?.transition?.[1]??14)?'Ink becomes timber':calendar];
    }
    function controls() {
      const [main,sub]=timeText();
      root.dataset.ready=String(state.ready);root.dataset.playing=String(state.playing);root.dataset.variant=state.variant;
      range.max=String(state.duration);range.value=String(state.time);range.disabled=!manifest;
      range.setAttribute('aria-valuetext',`${main}. ${sub}`);
      $('[data-time-readout]').textContent=main;$('[data-time-date]').textContent=sub;
      play.textContent=state.playing?'Pause':'Play';play.setAttribute('aria-label',`${state.playing?'Pause':'Play'} drawing`);play.disabled=!manifest||!!state.error;
      root.querySelectorAll('[data-time-variant]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.timeVariant===state.variant)));
      canvas.setAttribute('aria-label',`${current()?.label||'Low orbit'}. ${main}. ${sub}. Rendered model with authored walking occupants and occasional bird visits.`);
    }
    function cameraAt(t) {
      const frames=current()?.cameraFrames;
      if(!frames?.length)return null;
      let index=clamp(Math.floor(t/state.duration*(frames.length-1)),0,frames.length-1);
      while(index>0&&frames[index].time>t)index--;
      while(index<frames.length-2&&frames[index+1].time<t)index++;
      const a=frames[index],b=frames[Math.min(index+1,frames.length-1)],p=clamp((t-a.time)/(b.time-a.time||1),0,1);
      return {matrix:a.matrix.map((v,i)=>v+(b.matrix[i]-v)*p),eye:a.eye?.map((v,i)=>v+(b.eye[i]-v)*p)};
    }
    function project(matrix,point) {
      // Source model: east, north, up. Three: east, up, south.
      const [x,north,z]=point,y=z,south=-north,m=matrix;
      const w=m[3]*x+m[7]*y+m[11]*south+m[15];
      return w<=0?null:{x:(m[0]*x+m[4]*y+m[8]*south+m[12])/w,y:(m[1]*x+m[5]*y+m[9]*south+m[13])/w};
    }
    function ghosts(rect) {
      if(!atlas||state.time<13)return;
      const camera=cameraAt(state.time);if(!camera)return;
      const shown=[];
      const people=occupationAt(state.time).sort((a,b)=>camera.eye?Math.hypot(b.point[0]-camera.eye[0],b.point[1]-camera.eye[1])-Math.hypot(a.point[0]-camera.eye[0],a.point[1]-camera.eye[1]):0);
      for(const person of people){
        const p=person.point;
        const foot=project(camera.matrix,p),head=project(camera.matrix,[p[0],p[1],1.72]);if(!foot||!head)continue;
        const x=rect.x+(foot.x+1)/2*rect.w,y=rect.y+(1-foot.y)/2*rect.h;
        const height=Math.abs(head.y-foot.y)*rect.h/2;if(height<6)continue;
        const toward=camera.eye?Math.atan2(camera.eye[1]-p[1],camera.eye[0]-p[0]):0;
        const direction=(Math.round((toward-person.heading)/(Math.PI/4))+16)%8;
        const row=atlas.directions[direction],frame=Math.floor(person.cycle*atlas.frames),scale=height/160;
        let separation=1;
        for(const other of shown) if(y>other.y-other.height&&y-height<other.y) separation=Math.min(separation,clamp(Math.abs(x-other.x)/(Math.max(height,other.height)*.42),0,1));
        shown.push({x,y,height});
        ctx.save();ctx.globalAlpha=.34*person.alpha*separation;
        ctx.drawImage(atlas.image,frame*atlas.cellWidth,direction*atlas.cellHeight,atlas.cellWidth,atlas.cellHeight,x-row.anchor.x*scale,y-row.anchor.y*scale,atlas.cellWidth*scale,atlas.cellHeight*scale);ctx.restore();
      }
    }
    function wildlife(rect) {
      const bird=birdAt(state.time),camera=cameraAt(state.time);if(!bird||!camera)return;
      const c=Math.cos(bird.heading),s=Math.sin(bird.heading);
      const screen=([forward,side,up])=>{
        const p=project(camera.matrix,[bird.point[0]+forward*c-side*s,bird.point[1]+forward*s+side*c,bird.point[2]+up]);
        return p?[rect.x+(p.x+1)*rect.w/2,rect.y+(1-p.y)*rect.h/2]:null;
      };
      const shape=points=>{
        const pixels=points.map(screen);if(pixels.some(p=>!p))return;
        ctx.beginPath();pixels.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();
      };
      ctx.save();ctx.globalAlpha=.7*bird.alpha;ctx.fillStyle='#46564c';
      // A small volumetric silhouette: tapered wings, tail, breast and beak.
      // The wings fold on landing; there is no screen-fixed bird icon.
      for(const side of [-1,1]) {
        if(bird.flying)shape([[.04,side*.035,.09],[-.025,side*.13,.09+bird.flap*.12],[-.16,side*.29,.08+bird.flap*.22],[-.13,side*.08,.05]]);
        else shape([[.045,side*.035,.1],[-.12,side*.055,.07],[-.10,side*.025,.015]]);
      }
      shape([[-.075,-.035,.06],[-.25,-.05,.015],[-.22,.05,.015],[-.075,.035,.06]]);
      shape(Array.from({length:18},(_,i)=>{const a=i/18*Math.PI*2;return [.105*Math.cos(a),0,.085+.066*Math.sin(a)];}));
      shape([[.04,0,.12],[.07,0,.18],[.13,0,.18],[.16,0,.14],[.215,0,.12],[.15,0,.105],[.10,0,.07]]);
      if(!bird.flying) for(const side of [-.025,.025])shape([[-.01,side,.04],[0,side,0],[.045,side,0],[.045,side,.008],[.01,side,.012],[.005,side,.05]]);
      ctx.restore();
    }
    function paint() {
      if(!usable()||video.readyState<2||video.seeking)return;
      state.time=video.currentTime;
      const box=root.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),w=Math.round(box.width*dpr),h=Math.round(box.height*dpr);
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
      const crop=current()?.crop||{x:0,y:0,width:video.videoWidth,height:video.videoHeight};
      const scale=Math.max(w/crop.width,h/crop.height),rect={x:(w-crop.width*scale)/2,y:(h-crop.height*scale)/2,w:crop.width*scale,h:crop.height*scale};
      canvas.style.visibility='visible';
      ctx.fillStyle='#fdfcf9';ctx.fillRect(0,0,w,h);ctx.drawImage(video,crop.x,crop.y,crop.width,crop.height,rect.x,rect.y,rect.w,rect.h);
      // Projection metadata describes the uncropped source image.
      const projection={x:rect.x-crop.x*scale,y:rect.y-crop.y*scale,w:video.videoWidth*scale,h:video.videoHeight*scale};
      ghosts(projection);wildlife(projection);controls();
    }
    function stop(){cancelAnimationFrame(raf);raf=0;state.running=false;video.pause();if(video.readyState>=2&&!video.seeking)state.time=video.currentTime;}
    function tick(){raf=0;if(!usable()||!state.playing)return;state.time=video.currentTime;paint();raf=requestAnimationFrame(tick);}
    function start(){
      if(!usable()||!state.playing||!state.ready||video.seeking||state.error)return;
      video.play().then(()=>{if(!usable()||!state.playing){video.pause();return;}state.running=true;if(!raf)raf=requestAnimationFrame(tick);}).catch(error=>{if(error.name==='NotAllowedError'){state.playing=false;controls();}else if(error.name!=='AbortError')fail();});
    }
    function fail(){stop();canvas.style.visibility='hidden';state.error='Film unavailable';state.ready=false;showMessage('The film could not load. The still shows the established room.',true);controls();}
    function loadFilm(){
      const variant=current();if(!variant)return;
      stop();canvas.style.visibility='hidden';state.ready=false;state.error=null;pendingTime=state.time;loadedVariant=state.variant;
      const poster=root.previousElementSibling;poster.src=asset(variant.poster);poster.style.objectFit='cover';
      poster.alt=`Established timber and planting scenario: ${variant.label}`;
      root.closest('section').querySelector('[data-time-print-caption]').textContent=`Year 9 · June 2036 · ${variant.label} · Timber and planting scenario`;
      showMessage('Loading the camera study…');clearTimeout(loadTimer);loadTimer=setTimeout(()=>{if(video.readyState<2)fail();},25000);
      video.src=asset(variant.src);video.load();controls();
    }
    async function load(){
      if(!manifestPromise)manifestPromise=(async()=>{
        const response=await fetch(asset('manifest.json'));if(!response.ok)throw new Error('Manifest unavailable');manifest=await response.json();state.duration=manifest.duration;
        const axis=$('.v8-time-axis');axis.innerHTML='';
        const marks=[{time:0,label:'Assembly'},{time:13,label:'Planted'},...manifest.timeline.filter(p=>[2,5,9].includes(p.year))];
        for(const mark of marks){const span=document.createElement('span');span.textContent=mark.label;span.style.left=`${100*mark.time/state.duration}%`;axis.append(span);}
        const source=new URL('v8/assets/inhabitants/',document.baseURI);
        fetch(new URL('manifest.json',source)).then(r=>r.json()).then(async data=>{const image=await createImageBitmap(await(await fetch(new URL(data.atlas,source))).blob());atlas={...data,image};paint();}).catch(()=>{});
      })().catch(()=>{manifestPromise=null;fail();});
      await manifestPromise;if(manifest&&usable()){if(loadedVariant!==state.variant)loadFilm();else{paint();start();}}controls();
    }
    video.addEventListener('loadedmetadata',()=>{video.currentTime=clamp(pendingTime,0,state.duration-.01);});
    const ready=()=>{if(video.readyState<2)return;clearTimeout(loadTimer);state.ready=true;state.error=null;showMessage('');paint();start();};
    video.addEventListener('loadeddata',ready);video.addEventListener('seeked',ready);video.addEventListener('canplay',ready);
    video.addEventListener('waiting',()=>{if(usable()&&!state.error)showMessage('Loading the selected moment…');});video.addEventListener('error',()=>{if(video.src)fail();});
    play.onclick=()=>{state.playing=!state.playing;if(state.playing)start();else{stop();paint();}controls();};
    range.addEventListener('input',()=>{state.playing=false;stop();state.time=Number(range.value);pendingTime=state.time;if(video.readyState>=1){state.ready=false;showMessage('Loading the selected moment…');video.currentTime=state.time;}controls();});
    root.querySelectorAll('[data-time-variant]').forEach(button=>button.onclick=()=>{if(state.variant===button.dataset.timeVariant)return;state.variant=button.dataset.timeVariant;loadFilm();});
    $('[data-time-retry]').onclick=()=>{state.error=null;if(manifest)loadFilm();else load();};
    root.addEventListener('keydown',event=>event.stopPropagation());
    const resize=new ResizeObserver(paint);resize.observe(root);
    motion.addEventListener('change',()=>{if(motion.matches){state.playing=false;stop();controls();}});
    const controller={setActive(active){state.active=active;if(!active)stop();else load();},getState(){return {...state};},destroy(){destroyed=true;stop();clearTimeout(loadTimer);resize.disconnect();video.removeAttribute('src');video.load();atlas?.image.close();}};
    root.v8Controller=controller;controls();return controller;
  }
  window.DESIGNX_V8_TIME_EXPERIMENT={html,mount,occupationAt,birdAt};
  (window.DESIGNX_MOUNTS||=[]).push(deck=>{
    if(location.protocol==='file:'||new URL(location.href).searchParams.has('print'))return;
    const root=deck.querySelector('[data-v8-time-experiment]');if(!root)return;
    let player=null,printing=false;
    const update=()=>{const active=!printing&&!document.hidden&&root.closest('.slide').classList.contains('is-active');if(active&&!player)player=mount(root);player?.setActive(active);};
    document.addEventListener('designx:slidechange',update);document.addEventListener('visibilitychange',update);
    window.addEventListener('beforeprint',()=>{printing=true;update();});window.addEventListener('afterprint',()=>{printing=false;update();});queueMicrotask(update);
  });
})();
