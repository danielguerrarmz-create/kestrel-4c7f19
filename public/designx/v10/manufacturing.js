/* Presentation context around Daniel's unmodified drawing engine. */
(() => {
  'use strict';
  const captions={
    '05-press':'Form the member that will define the room’s opening and enclosure.',
    '07-scan':'Compare made and intended geometry so connections can assemble as designed.',
    '11-cut':'Machine the connections that locate each member within the whole room.'
  };
  (window.DESIGNX_MOUNTS ||= []).push(root=>{
    root.querySelectorAll('[data-factory-surface]').forEach(surface=>{
      const status=document.createElement('p');status.className='v8-factory-loading';status.setAttribute('role','status');surface.parentElement.append(status);
      const sync=()=>{
        const frame=surface.querySelector('iframe');
        const loading=!!frame && frame.style.visibility==='hidden';
        surface.setAttribute('aria-busy',String(loading));status.hidden=!loading;status.textContent='Loading the drawing…';
      };
      new MutationObserver(sync).observe(surface,{subtree:true,childList:true,attributes:true,attributeFilter:['style']});sync();
    });
    const scene=root.querySelector('.factory-focus-exhibit[data-factory-viewer="focus"]');if(!scene)return;
    const heading=scene.querySelector('.slide-heading h2');heading.textContent='Form. Measure. Machine.';
    const purpose=document.createElement('p');purpose.className='v8-factory-purpose';purpose.textContent=captions['05-press'];scene.append(purpose);
    scene.querySelectorAll('[data-factory-id]').forEach(button=>button.addEventListener('click',()=>{purpose.textContent=captions[button.dataset.factoryId];}));
  });
})();
