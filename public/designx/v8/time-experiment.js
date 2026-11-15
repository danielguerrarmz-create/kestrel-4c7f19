/* A second telling of Time: a rendered camera study, with an explicit model clock.
   The browser decodes the film and projects authored occupants; it loads no plant mesh. */
(() => {
  'use strict';
  const BASE = 'v8/assets/time-experiment/';
  const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
  const fract = x => ((x%1)+1)%1;
  const asset = file => new URL(file.startsWith('v8/') ? file : BASE+file,document.baseURI).href;
  const html = `<section class="v7-scene v8-time-experiment-scene">
    <h2 class="v7-title">A room through time</h2>
    <img class="v8-time-experiment-poster" src="${BASE}orbit-poster.jpg" alt="The established timber room, seen from a low orbit">
    <div data-v8-time-experiment class="slide-interaction">
      <canvas role="img" aria-label="An orbital study of assembly and growth"></canvas>
      <nav class="v8-time-cameras" aria-label="Camera path"><span>Camera</span><button data-time-variant="fixed">Eye level</button><button data-time-variant="orbit" aria-pressed="true">Orbit</button><button data-time-variant="rise">Rise</button></nav>
      <div class="v8-time-message" role="status" hidden><span></span><button data-time-retry hidden>Retry drawing</button></div>
      <div class="v8-time-footer"><button data-time-play aria-label="Pause drawing">Pause</button><div class="v8-time-when"><output data-time-readout>Assembly</output><span data-time-date>Before planting</span></div><div class="v8-time-track"><input type="range" aria-label="Time since planting" min="0" max="51" step="0.01" value="0" disabled><div class="v8-time-axis" aria-hidden="true"><span style="left:0">Assembly</span><span style="left:25.49%">Planted</span><span style="left:39.6%">Year 2</span><span style="left:60.78%">Year 5</span><span style="left:96.08%">Year 9</span></div></div></div>
      <p class="v8-time-evidence">Camera study · pre-rendered growth scenario · authored occupation</p>
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
      canvas.setAttribute('aria-label',`${current()?.label||'Low orbit'}. ${main}. ${sub}. Rendered model with authored ghost occupants.`);
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
      const fade=clamp((state.time-13)/1.5,0,1);
      // Two authored passages through the empty central room. No behavioural model.
      const paths=[{a:[-2.4,-1,0],b:[2.4,-1,0],period:18,offset:0},{a:[2.1,2,0],b:[-1.8,2,0],period:23,offset:9}];
      const shown=[];
      for(const path of paths){
        const progress=fract((state.time-13+path.offset)/path.period),p=path.a.map((v,i)=>v+(path.b[i]-v)*progress);
        const foot=project(camera.matrix,p),head=project(camera.matrix,[p[0],p[1],1.72]);if(!foot||!head)continue;
        const x=rect.x+(foot.x+1)/2*rect.w,y=rect.y+(1-foot.y)/2*rect.h;
        const height=Math.abs(head.y-foot.y)*rect.h/2;if(height<6)continue;
        const vx=path.b[0]-path.a[0],vy=path.b[1]-path.a[1];
        const toward=camera.eye?Math.atan2(camera.eye[1]-p[1],camera.eye[0]-p[0]):0;
        const direction=(Math.round((toward-Math.atan2(vy,vx))/(Math.PI/4))+16)%8;
        const row=atlas.directions[direction],frame=Math.floor(fract(state.time/atlas.duration)*atlas.frames),scale=height/160;
        let separation=1;
        for(const other of shown) if(y>other.y-other.height&&y-height<other.y) separation=Math.min(separation,clamp(Math.abs(x-other.x)/(Math.max(height,other.height)*.42),0,1));
        shown.push({x,y,height});
        ctx.save();ctx.globalAlpha=.34*fade*Math.min(1,progress*12,(1-progress)*12)*separation;
        ctx.drawImage(atlas.image,frame*atlas.cellWidth,direction*atlas.cellHeight,atlas.cellWidth,atlas.cellHeight,x-row.anchor.x*scale,y-row.anchor.y*scale,atlas.cellWidth*scale,atlas.cellHeight*scale);ctx.restore();
      }
    }
    function paint() {
      if(!usable()||video.readyState<2||video.seeking)return;
      const box=root.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),w=Math.round(box.width*dpr),h=Math.round(box.height*dpr);
      if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
      const crop=current()?.crop||{x:0,y:0,width:video.videoWidth,height:video.videoHeight};
      const scale=Math.max(w/crop.width,h/crop.height),rect={x:(w-crop.width*scale)/2,y:(h-crop.height*scale)/2,w:crop.width*scale,h:crop.height*scale};
      canvas.style.visibility='visible';
      ctx.fillStyle='#fdfcf9';ctx.fillRect(0,0,w,h);ctx.drawImage(video,crop.x,crop.y,crop.width,crop.height,rect.x,rect.y,rect.w,rect.h);
      // Projection metadata describes the uncropped source image.
      ghosts({x:rect.x-crop.x*scale,y:rect.y-crop.y*scale,w:video.videoWidth*scale,h:video.videoHeight*scale});
      state.time=video.currentTime;controls();
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
  window.DESIGNX_V8_TIME_EXPERIMENT={html,mount};
  (window.DESIGNX_MOUNTS||=[]).push(deck=>{
    if(location.protocol==='file:'||new URL(location.href).searchParams.has('print'))return;
    const root=deck.querySelector('[data-v8-time-experiment]');if(!root)return;
    let player=null,printing=false;
    const update=()=>{const active=!printing&&!document.hidden&&root.closest('.slide').classList.contains('is-active');if(active&&!player)player=mount(root);player?.setActive(active);};
    document.addEventListener('designx:slidechange',update);document.addEventListener('visibilitychange',update);
    window.addEventListener('beforeprint',()=>{printing=true;update();});window.addEventListener('afterprint',()=>{printing=false;update();});queueMicrotask(update);
  });
})();
