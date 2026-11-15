/* The selected Time drawing. Earlier studies remain in source, outside the main sequence. */
(()=>{
  'use strict';
  const BASE='v8/assets/canopy-orbit/',clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const item={title:'From room to canopy',theme:'v8-canopy-orbit-slide',baseSlide:4,
    purpose:'See the room assemble and become inhabited, then rise from changing eye heights to an overhead reading of the living canopy.',
    stays:'The approved full orbit, ink-to-timber transition, inhabitants and shared timeline. The earlier Time studies remain in source outside the main sequence.',
    drawing:'A full orbit varies its height, then rises into a true top-down view and holds. Perspective and Axonometric use the same camera route and scenario clock; Axonometric uses parallel projection. The full-size films autoplay, pause and scrub with the shared black timeline.',
    status:'Pre-rendered full-model camera studies with authored 3D people and birds. Growth is a provisional scenario, timber appearance is illustrative, and the assembly sequence is not a validated erection method. The final overhead view is held for six seconds.',
    transition:'Return to the changing light and enclosure of the same room.'};
  const html=`<section class="v7-scene v8-canopy-orbit-scene">
    <h2 class="v7-title">From room to canopy</h2>
    <img class="v8-canopy-poster" src="${BASE}perspective-poster.jpg" alt="The established living room, seen directly from above">
    <div data-v8-canopy class="slide-interaction">
      <video muted playsinline loop preload="metadata" aria-label="An orbit from changing eye heights to a bird’s-eye view"></video>
      <nav class="v8-canopy-projections" aria-label="Projection"><span>Projection</span><button data-canopy-projection="perspective" aria-pressed="true">Perspective</button><button data-canopy-projection="axonometric" aria-pressed="false">Axonometric</button></nav>
      <div class="v8-canopy-message" role="status" hidden><span></span><button data-canopy-retry hidden>Retry drawing</button></div>
      <div class="v8-drawing-timeline"><button data-canopy-play aria-label="Pause drawing">Pause</button><div class="v8-drawing-when"><output data-canopy-readout class="v8-drawing-readout">Assembly</output><span data-canopy-date class="v8-drawing-context">Before planting</span></div><div class="v8-drawing-track"><input type="range" aria-label="Time since planting" min="0" max="55" step="0.01" value="0" disabled><div class="v8-drawing-axis" aria-hidden="true"></div></div></div>
      <p class="v8-canopy-evidence">Pre-rendered camera study · authored inhabitants · provisional growth</p>
    </div>
    <p class="v8-canopy-print-caption">Year 9 · June 2036 · Perspective overhead</p>
  </section>`;
  function mount(root){
    const $=s=>root.querySelector(s),video=$('video'),range=$('input'),play=$('[data-canopy-play]'),message=$('.v8-canopy-message');
    const motion=matchMedia('(prefers-reduced-motion: reduce)');video.muted=true;
    const state={active:false,ready:false,playing:!motion.matches,running:false,time:motion.matches?49:0,duration:55,projection:'perspective',error:null};
    let manifest=null,job=null,loaded='',pending=state.time,raf=0,timeout=0,destroyed=false;
    const asset=file=>new URL(BASE+file,document.baseURI).href,current=()=>manifest?.variants.find(v=>v.id===state.projection),usable=()=>state.active&&!document.hidden&&!destroyed;
    const show=(text,error=false)=>{message.hidden=!text;message.querySelector('span').textContent=text||'';$('[data-canopy-retry]').hidden=!error;};
    function textAt(t){
      if(t<12)return ['Assembly',`${Math.round(t/12*100)}% assembled`];
      if(t<13)return ['At installation','Year 0 · Planting begins'];
      const p=clamp((t-13)/36,0,1),start=Date.parse('2027-03-12T00:00:00Z'),end=Date.parse('2036-06-20T00:00:00Z'),years=p*(end-start)/86400000/365.25,y=Math.floor(years),m=Math.floor((years-y)*12);
      return [`Year ${y}${m?` · ${m} ${m===1?'month':'months'}`:''}`,new Date(start+(end-start)*p).toLocaleDateString('en-GB',{month:'short',year:'numeric',timeZone:'UTC'})+(t>=49?' · Overhead hold':'')];
    }
    function controls(){
      const [main,sub]=textAt(state.time);root.dataset.ready=String(state.ready);root.dataset.projection=state.projection;root.dataset.playing=String(state.playing);
      range.value=state.time;range.max=state.duration;range.disabled=!manifest;range.setAttribute('aria-valuetext',`${main}. ${sub}`);
      $('[data-canopy-readout]').textContent=main;$('[data-canopy-date]').textContent=sub;
      play.textContent=state.playing?'Pause':'Play';play.setAttribute('aria-label',`${state.playing?'Pause':'Play'} drawing`);play.disabled=!manifest||!!state.error;
      root.querySelectorAll('[data-canopy-projection]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.canopyProjection===state.projection)));
      video.setAttribute('aria-label',`${current()?.label||'Perspective'} orbit. ${main}. ${sub}. Pre-rendered geometry with authored inhabitants.`);
    }
    function stop(){cancelAnimationFrame(raf);raf=0;video.pause();state.running=false;if(video.readyState>=2&&!video.seeking)state.time=video.currentTime;}
    function tick(){raf=0;if(!usable()||!state.playing)return;state.time=video.currentTime;controls();raf=requestAnimationFrame(tick);}
    function start(){
      if(!usable()||!state.playing||!state.ready||video.seeking||state.error)return;
      video.play().then(()=>{if(!usable()||!state.playing){video.pause();return;}state.running=true;if(!raf)raf=requestAnimationFrame(tick);}).catch(e=>{if(e.name==='NotAllowedError'){state.playing=false;controls();}else if(e.name!=='AbortError')fail();});
    }
    function fail(){stop();state.ready=false;state.error='Film unavailable';video.style.visibility='hidden';show('The film could not load. The still shows the final overhead view.',true);controls();}
    function loadFilm(){
      const v=current();if(!v)return;stop();state.ready=false;state.error=null;pending=state.time;loaded=state.projection;video.style.visibility='hidden';
      root.previousElementSibling.src=asset(v.poster);root.previousElementSibling.alt=`${v.label}: the established room directly overhead`;
      root.parentElement.querySelector('.v8-canopy-print-caption').textContent=`Year 9 · June 2036 · ${v.label} overhead`;
      show('Loading the camera study…');clearTimeout(timeout);timeout=setTimeout(()=>{if(video.readyState<2)fail();},30000);
      video.src=asset(v.src);video.load();controls();
    }
    async function load(){
      if(!job)job=fetch(asset('manifest.json')).then(r=>{if(!r.ok)throw Error('Manifest unavailable');return r.json();}).then(data=>{
        manifest=data;state.duration=data.duration;
        const axis=$('.v8-drawing-axis'),start=Date.parse(data.startDate),end=Date.parse(data.endDate);
        const marks=[{time:0,label:'Assembly'},{time:13,label:'Planted'},...[2,5,9].map(y=>({time:13+(Date.UTC(2027+y,2,12)-start)/(end-start)*36,label:`Year ${y}`}))];
        axis.replaceChildren();for(const m of marks){const el=document.createElement('span');el.textContent=m.label;el.style.left=100*m.time/data.duration+'%';axis.append(el);}
      }).catch(()=>{job=null;fail();});
      await job;if(manifest&&usable()){if(loaded!==state.projection)loadFilm();else start();}controls();
    }
    video.addEventListener('loadedmetadata',()=>{video.currentTime=clamp(pending,0,state.duration-.01);});
    const ready=()=>{if(video.readyState<2||video.seeking)return;clearTimeout(timeout);state.ready=true;state.error=null;state.time=video.currentTime;video.style.visibility='visible';show('');controls();start();};
    video.addEventListener('loadeddata',ready);video.addEventListener('seeked',ready);video.addEventListener('canplay',ready);
    video.addEventListener('error',()=>{if(video.src)fail();});video.addEventListener('waiting',()=>{if(usable()&&!state.error)show('Loading the selected moment…');});
    play.onclick=()=>{state.playing=!state.playing;if(state.playing)start();else stop();controls();};
    range.oninput=()=>{state.playing=false;stop();state.time=Number(range.value);pending=state.time;if(video.readyState>=1){state.ready=false;video.currentTime=state.time;show('Loading the selected moment…');}controls();};
    root.querySelectorAll('[data-canopy-projection]').forEach(b=>b.onclick=()=>{if(state.projection===b.dataset.canopyProjection)return;state.projection=b.dataset.canopyProjection;loadFilm();});
    $('[data-canopy-retry]').onclick=()=>{state.error=null;if(manifest)loadFilm();else load();};
    root.addEventListener('keydown',e=>e.stopPropagation());
    motion.addEventListener('change',()=>{if(motion.matches){state.playing=false;stop();controls();}});
    const controller={setActive(active){state.active=active;if(active)load();else stop();},getState:()=>({...state}),destroy(){destroyed=true;stop();clearTimeout(timeout);video.removeAttribute('src');video.load();}};
    root.v8Controller=controller;controls();return controller;
  }
  // Promote the approved orbit, set aside the two earlier Time studies and omit
  // the empty care drawing. Every other slide retains its authored content.
  const retired=new Set(['v7-growth-slide','v8-time-experiment-slide','v8-care-slide']);
  const retained=s=>!s.theme.split(' ').some(theme=>retired.has(theme));
  const sourceStory=window.DESIGNX_V8_STORY;
  if(sourceStory&&!sourceStory.some(s=>s.theme===item.theme)){
    const next=sourceStory.filter(retained);next.splice(1,0,item);window.DESIGNX_V8_STORY=next.map((s,i)=>({...s,number:i+1}));
  }
  if(window.DESIGNX_SLIDES&&!window.DESIGNX_SLIDES.some(s=>s.theme===item.theme)){
    window.DESIGNX_SLIDES=window.DESIGNX_SLIDES.filter(retained);
    window.DESIGNX_SLIDES.splice(1,0,{title:item.title,theme:item.theme,act:'A living place',sourceIndex:3,comparisonIndex:3,html,notes:`${item.purpose}<br><br>${item.drawing}<br><br>${item.status}`,source:item.status});
    window.DESIGNX_META=Object.freeze({...window.DESIGNX_META,targetSlideCount:window.DESIGNX_SLIDES.length});
  }
  window.DESIGNX_V8_CANOPY_ORBIT={html,mount};
  (window.DESIGNX_MOUNTS||=[]).push(deck=>{
    if(location.protocol==='file:'||new URL(location.href).searchParams.has('print'))return;
    const root=deck.querySelector('[data-v8-canopy]');if(!root)return;let player=null,printing=false;
    const update=()=>{const active=!printing&&!document.hidden&&root.closest('.slide').classList.contains('is-active');if(active&&!player)player=mount(root);player?.setActive(active);};
    document.addEventListener('designx:slidechange',update);document.addEventListener('visibilitychange',update);window.addEventListener('beforeprint',()=>{printing=true;update();});window.addEventListener('afterprint',()=>{printing=false;update();});queueMicrotask(update);
  });
})();
