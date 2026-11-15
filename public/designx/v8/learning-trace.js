/* An inspectable explanation of proposed information flow, not a running feedback system. */
(() => {
  'use strict';
  const traces={
    design:[['inputs','The brief begins with a place, its living conditions and a budget.'],['geometry','Generate a candidate that carries those intentions.'],['fabrication','Fabricatability considers how its members, joints and assembly could be made.'],['plantability','Proposed plantability checks ask whether roots can reach suitable support.'],['review','The designer weighs planting, making, access and cost before revising the candidate.']],
    making:[['geometry','The released geometry defines what the member should be.'],['making','Form and scan the member against that target. The factory drawing is schematic.'],['validation','A future deviation needs investigation and repeat checks before it becomes evidence.'],['rules','Supported findings could revise forming allowances for the next member.']],
    growing:[['plantability','Hypothesis: the proposed support route helps the intended planting establish.'],['living','In a built Bower, record reach, survival, clearance and the care required.'],['validation','Compare observations with the assumption, keeping site and season in view.'],['rules','A supported finding could change support spacing or the care plan.']],
    cost:[['cost','A proposed estimate connects quantities and process assumptions to dated quotes.'],['making','Record actual time, material use and waste during production.'],['validation','Compare like-for-like scope before changing an estimating assumption.'],['rules','Checked evidence could improve the next budget. No calibrated cost model is claimed.']],
    all:[['geometry','One candidate connects the intended room to making and living conditions.'],['review','Designer review reconciles the consequences before release.'],['making','Making could provide an early stream of measurements.'],['living','Use, growth and tending could provide a slower stream of observations.'],['validation','Evidence must be reviewed before it changes a rule.'],['rules','Supported findings could improve the next design.']]
  };
  (window.DESIGNX_MOUNTS ||= []).push(root=>{
    const scene=root.querySelector('[data-v7-flow]');if(!scene)return;
    scene.classList.add('v8-learning-trace');
    scene.querySelector('.v7flow-diagram').setAttribute('role','group');
    const bar=document.createElement('div');bar.className='v8-sequence-controls slide-interaction';
    bar.innerHTML='<button type="button" data-sequence-play>Play</button><input type="range" min="0" max="1000" value="0" data-sequence-range aria-label="Follow evidence through the learning system"><output data-sequence-caption>Whole system</output>';
    scene.append(bar);
    let mode='all',selected=-1;
    const nodes=[...scene.querySelectorAll('[data-v7flow-node]')];
    const clock=window.DESIGNX_V8_SEQUENCE(scene,6,index=>{
      const trace=traces[mode],step=Math.min(trace.length-1,Math.floor(index*trace.length/6));
      const [id,copy]=trace[step];selected=step;
      nodes.forEach(node=>node.classList.toggle('v8-trace-current',node.dataset.v7flowNode===id));
      scene.querySelector('[data-v7flow-readout]').textContent=copy;
      bar.querySelector('output').textContent=`${step+1} / ${trace.length} · ${mode==='all'?'Whole system':mode[0].toUpperCase()+mode.slice(1)}`;
      scene.dataset.traceStep=id;
    });
    scene.querySelectorAll('[data-v7flow-select]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.v7flowSelect;clock.seek(0);}));
    nodes.forEach(node=>{
      node.setAttribute('tabindex','0');node.setAttribute('role','button');node.setAttribute('aria-label','Inspect '+node.querySelector('text')?.textContent);
      function select(){
        let index=traces[mode].findIndex(([id])=>id===node.dataset.v7flowNode);
        if(index<0){const next=Object.keys(traces).find(key=>traces[key].some(([id])=>id===node.dataset.v7flowNode));if(!next)return;scene.querySelector(`[data-v7flow-select="${next}"]`).click();index=traces[mode].findIndex(([id])=>id===node.dataset.v7flowNode);}
        clock.seek(Math.ceil(index*6/traces[mode].length));
      }
      node.addEventListener('click',select);node.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();event.stopPropagation();select();}});
    });
    document.addEventListener('designx:slidechange',event=>clock.setActive(event.detail.element===scene.closest('.slide')));
    scene.v8Controller=clock;
  });
})();
