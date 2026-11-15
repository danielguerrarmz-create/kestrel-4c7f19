/* Small clocks for authored explanations. None of these controls runs an evaluator. */
(() => {
  'use strict';
  window.DESIGNX_V8_SEQUENCE = function (root, count, render) {
    const play = root.querySelector('[data-sequence-play]'), range = root.querySelector('[data-sequence-range]');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const state = { time:0, playing:false, active:false };
    let raf=0, last=0, printing=false;
    function draw() {
      range.value = String(Math.round(state.time * 1000 / count));
      play.textContent = state.playing ? 'Pause' : 'Play';
      play.setAttribute('aria-label',state.playing ? 'Pause explanation' : 'Play explanation');
      render(Math.min(count-1,Math.floor(state.time)),state.time % 1);
    }
    function tick(now) {
      raf=0;
      if(!state.active || !state.playing || document.hidden || printing)return;
      state.time=Math.min(count,state.time+Math.min(.1,(now-last)/1000)/5);last=now;
      if(state.time===count)state.playing=false;
      draw(); if(state.playing)raf=requestAnimationFrame(tick);
    }
    function sync(){cancelAnimationFrame(raf);raf=0;if(state.active && state.playing && !document.hidden && !printing){last=performance.now();raf=requestAnimationFrame(tick);}}
    function seek(value){state.time=Math.max(0,Math.min(count,Number(value)||0));state.playing=false;draw();sync();}
    play.onclick=()=>{if(!state.playing && state.time===count)state.time=0;state.playing=!state.playing;draw();sync();};
    range.oninput=()=>seek(Number(range.value)*count/1000);
    root.addEventListener('keydown',event=>{if(event.target.closest('button,input'))event.stopPropagation();});
    root.addEventListener('wheel',event=>event.stopPropagation(),{passive:true});
    document.addEventListener('visibilitychange',sync);
    window.addEventListener('beforeprint',()=>{printing=true;sync();});
    window.addEventListener('afterprint',()=>{printing=false;sync();});
    motion.addEventListener('change',()=>{if(motion.matches)seek(state.time);});
    draw();
    return {seek,setActive(value){state.active=!!value;sync();},getState:()=>({...state,running:!!raf})};
  };
})();
