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
    let mode=scene.dataset.v7flowMode;
    const nodes=[...scene.querySelectorAll('[data-v7flow-node]')];
    function inspect(id){
      const [,copy]=traces[mode].find(step=>step[0]===id);
      nodes.forEach(node=>{
        const selected=node.dataset.v7flowNode===id;
        node.classList.toggle('v8-trace-current',selected);
        node.setAttribute('aria-pressed',String(selected));
      });
      scene.querySelector('[data-v7flow-readout]').textContent=copy;
      scene.dataset.traceStep=id;
    }
    function selectMode(){
      mode=scene.dataset.v7flowMode;
      inspect(traces[mode][0][0]);
    }
    scene.querySelectorAll('[data-v7flow-select]').forEach(button=>{
      button.addEventListener('click',selectMode);
      // The inherited diagram selects arrow-key destinations without a click.
      button.addEventListener('keydown',event=>{
        if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) selectMode();
      });
    });
    nodes.forEach(node=>{
      node.setAttribute('tabindex','0');node.setAttribute('role','button');node.setAttribute('aria-label','Inspect '+node.querySelector('text')?.textContent);
      function select(){
        const id=node.dataset.v7flowNode;
        if(!traces[mode].some(step=>step[0]===id)){
          const next=Object.keys(traces).find(key=>traces[key].some(step=>step[0]===id));
          if(!next)return;
          scene.querySelector(`[data-v7flow-select="${next}"]`).click();
        }
        inspect(id);
      }
      node.addEventListener('click',select);node.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();event.stopPropagation();select();}});
    });
    selectMode();
  });
})();
