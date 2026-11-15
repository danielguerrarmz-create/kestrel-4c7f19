/* Reads the scene owner's handoff. Images, masks, anchors and quantities remain theirs. */
(() => {
  'use strict';
  const stages=[
    {label:'Plant support',view:'pier',layers:['plant-routes','root-zones'],heading:'A route from soil to support',copy:'Changing the pier can let each climber meet its training line at the foot. The baseline uses feeder cables along the arches.',quantity:'meets_its_lines_m',unit:'Meeting the training line',evidence:'Generated geometry · growth remains to be tested'},
    {label:'Entrance',view:'whole',layers:['walking-route'],heading:'The opening becomes narrower',copy:'The same change alters the way people enter. Compare the distance between the innermost timber legs at the threshold.',quantity:'way_in_m',unit:'Entrance between timber legs',evidence:'Generated geometry · not an access compliance check'},
    {label:'Making',view:'pier',layers:['timber','footings'],heading:'A different connection to the ground',copy:'The opened pier proposes a frame in place of a steel plate. Forming, joints, assembly and foundation design must be resolved together.',quantity:'steel_over_the_ground_m2',unit:'Steel arrangement',evidence:'Authored footing proposal · not engineered'},
    {label:'Designer review',view:'pier',layers:['footings','plant-routes'],heading:'An improvement still needs review',copy:'Plant support, structural connections and space for roots compete at the same footing. The designer must resolve the outstanding checks before release.',evidence:'Draft checks · no physical observations'}
  ];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  window.DESIGNX_V8_COMPUTATION={html:`<section class="v8-consequences" data-v8-consequences>
    <h2 class="v8-drawing-title">One change, <em>several consequences</em></h2>
    <p class="v8-drawing-question">Can we make it? Can it grow? Can we still enter and care for it?</p>
    <nav class="v8-drawing-tabs slide-interaction" aria-label="Inspect a consequence">${stages.map((s,i)=>`<button type="button" data-consequence="${i}" aria-pressed="${i===0}">${s.label}</button>`).join('')}</nav>
    <div class="v8-consequence-body"><figure><div class="v8-consequence-image"><img src="v8/assets/studies/pier-opened.webp" alt="Opened pier, existing generated room study"><svg viewBox="0 0 1280 800" aria-hidden="true"></svg></div><figcaption data-consequence-image-label>Loading the coordinated scene…</figcaption></figure>
    <aside><p class="v8-annotation-kicker" data-consequence-evidence></p><h3 data-consequence-heading></h3><p data-consequence-copy></p><dl data-consequence-quantity></dl><p class="v8-consequence-checks" data-consequence-checks></p></aside></div>
    <div class="v8-consequence-config slide-interaction" role="group" aria-label="Compare authored configurations"><span>Configuration</span><button type="button" data-configuration="baseline" aria-pressed="false">Baseline</button><button type="button" data-configuration="proposal" aria-pressed="true">Opened pier</button><button type="button" data-consequence-retry hidden>Retry drawing</button></div>
    <div class="v8-sequence-controls slide-interaction"><button type="button" data-sequence-play>Play</button><input type="range" min="0" max="1000" value="0" data-sequence-range aria-label="Follow the design consequences"><output data-sequence-caption></output></div>
    <p class="v8-consequence-print"></p>
    <p class="v8-drawing-status">Authored alternatives, with quantities derived from their geometry before playback. Integrated plantability and cost checks remain proposed.</p>
  </section>`};
  (window.DESIGNX_MOUNTS ||= []).push(root=>{
    const scene=root.querySelector('[data-v8-consequences]');if(!scene)return;
    const imageHost=scene.querySelector('.v8-consequence-image'),label=scene.querySelector('[data-consequence-image-label]');
    const base=new URL('pieces/inhabited-room/',document.baseURI);
    let data=null,loading=null,config='proposal',stage=-1,request=0,active=false,clock;
    const imageCache=new Map();
    async function image(src){if(imageCache.has(src))return imageCache.get(src).cloneNode();const img=new Image();img.src=new URL(src,base).href;await Promise.race([img.decode(),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Image timed out')),12000))]);imageCache.set(src,img);return img.cloneNode();}
    function annotate(record,view){
      if(stage!==1)return '';
      const a=record.points[view]['way-in.west'],b=record.points[view]['way-in.east'];if(!a||!b)return '';
      const x1=a[0]*1280,y1=a[1]*800,x2=b[0]*1280,y2=b[1]*800;
      return `<path d="M${x1} ${y1}L${x2} ${y2}"/><circle cx="${x1}" cy="${y1}" r="5"/><circle cx="${x2}" cy="${y2}" r="5"/><text x="${(x1+x2)/2}" y="${Math.max(y1,y2)+30}" text-anchor="middle">${esc(record.quantities.way_in_m.says)}</text>`;
    }
    async function show(){
      const s=stages[stage],record=data?.configurations[config];
      scene.querySelector('[data-consequence-heading]').textContent=s.heading;
      scene.querySelector('[data-consequence-copy]').textContent=s.copy;
      scene.querySelector('[data-consequence-evidence]').textContent=s.evidence;
      scene.querySelector('[data-sequence-caption]').textContent=`${stage+1} / 4 · ${s.label}`;
      scene.querySelectorAll('[data-consequence]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.consequence===stage)));
      scene.querySelectorAll('[data-configuration]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.configuration===config)));
      if(!record)return;
      scene.querySelector('.v8-consequence-print').textContent=`The opened pier connects planting at the training-line foot. The entrance changes from ${data.configurations.baseline.quantities.way_in_m.value} m to ${data.configurations.proposal.quantities.way_in_m.value} m between timber legs. Its footing and pile clearances still need resolution.`;
      const q=s.quantity && record.quantities[s.quantity];
      scene.querySelector('[data-consequence-quantity]').innerHTML=q?`<dt>${s.unit}</dt><dd>${esc(q.says)}</dd>`:'';
      scene.querySelector('[data-consequence-checks]').textContent=stage===3 ? (record.to_review.length?record.to_review.join('. ')+'.':'No flags in this draft check. Structural and biological validation still required.') : '';
      const generation=++request;label.textContent='Loading selected drawing…';
      try{
        const images=await Promise.all([image(record.frames[s.view]),...s.layers.map(layer=>image(record.masks[s.view][layer]))]);
        if(generation!==request)return;
        images.forEach((img,i)=>{img.alt=i?'':`${record.label}, ${s.view} view. ${s.heading}`;img.className=i?'v8-scene-mask':'v8-scene-base';});
        const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 1280 800');svg.setAttribute('aria-hidden','true');svg.innerHTML=annotate(record,s.view);
        imageHost.replaceChildren(...images,svg);label.textContent=`${record.label} · ${s.view==='whole'?'whole room':'pier R1.P1'} · fixed rendered view`;
        scene.dataset.ready='true';scene.dataset.configuration=config;scene.dataset.stage=String(stage);
        scene.querySelector('[data-consequence-retry]').hidden=true;
      }catch{if(generation!==request)return;label.textContent='Selected drawing unavailable. Previous drawing retained.';scene.querySelector('[data-consequence-retry]').hidden=false;scene.dataset.ready='false';}
    }
    async function load(){
      if(data){show();return;}if(loading)return;
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
      loading=fetch(new URL('manifest.json',base),{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Missing scene manifest');return r.json();}).then(json=>{data=json;show();}).catch(()=>{label.textContent='Scene export unavailable. Retry to load the coordinated drawing.';scene.querySelector('[data-consequence-retry]').hidden=false;}).finally(()=>{clearTimeout(timer);loading=null;});
    }
    clock=window.DESIGNX_V8_SEQUENCE(scene,stages.length,index=>{if(index!==stage){stage=index;show();}});
    scene.querySelectorAll('[data-consequence]').forEach(b=>b.onclick=()=>clock.seek(+b.dataset.consequence));
    scene.querySelectorAll('[data-configuration]').forEach(b=>b.onclick=()=>{config=b.dataset.configuration;clock.seek(stage);show();});
    scene.querySelector('[data-consequence-retry]').onclick=()=>load();
    document.addEventListener('designx:slidechange',event=>{active=event.detail.element===scene.closest('.slide');clock.setActive(active);if(active)load();});
    if(new URL(location.href).searchParams.has('print'))load();
    scene.v8Controller={getState:()=>({...clock.getState(),config,stage}),seek:clock.seek};
  });
})();
