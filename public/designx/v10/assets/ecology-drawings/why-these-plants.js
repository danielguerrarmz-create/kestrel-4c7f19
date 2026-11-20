/* Imported drawing routines from ecology-drawings, 0270bbb. See SOURCES.md. */
/* Six seasonal calendars use the trial planting and the original botanical sprigs. */
/* Months, leaf habit, climbing habit, height and role are read from the taxon files in the Auxin model (Horti-code-ture/species).
   Piers are the trial planting (scenes/six-bay-radial-open-pier/planting.json). Akebia and Lonicera henryi are left out;
   star jasmine and ivy stand in for them. */
(function(){
  const s = document.getElementById('logicS');
  const INK='var(--pencil)',MUTE='var(--mute)';
  const T=(p,x,y,txt,o)=>{o=o||{};return el(p,'text',{x,y,'text-anchor':o.a||'start','font-size':o.z||17,style:'fill:'+(o.f||'var(--ink)')+(o.w?';font-weight:500':'')+(o.d?';font-family:var(--display);font-style:italic':'')},txt);};
  const L=(p,x1,y1,x2,y2,w,op,dash)=>el(p,'line',{x1,y1,x2,y2,stroke:INK,'stroke-width':w||1,'stroke-opacity':op==null?.8:op,'stroke-dasharray':dash||'none','stroke-linecap':'round'});
  const C=(p,cx,cy,r,o)=>el(p,'circle',Object.assign({cx,cy,r,fill:'none',stroke:INK,'stroke-width':1},o||{}));
  const G=(p,o)=>el(p||s,'g',o||{});


  const PL = botanicalSprigs.species;
  const names = ['South-west', 'South-east', 'East', 'North-east', 'North-west', 'West'];
  const months = 'JFMAMJJASOND';
  const plants = [], petals = [], descriptions = [];
  let selected = null;
  function selectPlant(index) {
    selected = index;
    plants.forEach((g, i) => {
      g.setAttribute('aria-pressed', String(i === index));
      g.querySelector('circle').setAttribute('stroke-width', i === index ? 3 : .8);
    });
    petals.forEach(({group, species}) => group.setAttribute('opacity',
      index === null || species === index ? 1 : .16));
    descriptions.forEach(({label, pier}) => {
      const present = index === null || PL[index].pier.includes(pier);
      label.setAttribute('opacity', present ? 1 : .48);
    });
    readout.textContent = index === null ? 'Each petal is a month, clockwise from January.' :
      PL[index].n + ' · ' + PL[index].when + '.';
  }
  PL.forEach((p, i) => {
    const x = 95 + i * 128;
    const g = G(s, {class:'plant-choice', role:'button', tabindex:0, 'aria-label':p.n, 'aria-pressed':'false'});
    botanicalSprigs.draw(g,x,68,p);
    const words = p.n.split(' ');
    const lines = p.n.length > 12 ? [words.slice(0,-1).join(' '), words.at(-1)] : [p.n];
    lines.forEach((line, j) => T(g, x, 140 + 19*j, line, {a:'middle',z:19}).classList.add('plant-name'));
    const toggle = () => selectPlant(selected === i ? null : i);
    g.addEventListener('click', toggle);
    g.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); toggle(); }
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); selectPlant(null); }
    });
    plants.push(g);
  });
  T(s, 44, 220, 'A year at each pier', {z:34,d:1});
  const readout = T(s, 1550, 217, '', {z:19,f:MUTE,a:'end'});
  readout.setAttribute('aria-live','polite');
  T(s, 44, 266, 'Colour shows flower or autumn leaf. A dot marks scent. A green ring marks evergreen foliage.', {z:18,f:MUTE});
  L(s, 44, 291, 1550, 291, .8, .36);
  names.forEach((name, pier) => {
    const col = pier % 3, row = Math.floor(pier / 3);
    const x = 159 + 515 * col, y = 445 + 282 * row;
    const yearly = PL.map((p,i) => ({p,i})).filter(({p}) => p.pier.includes(pier));
    const group = G(s, {role:'group','aria-label':name + ' pier'});
    const charts = G(group, {transform:`translate(${x} ${y})`});
    C(charts,0,0,105,{stroke:'#ced4c7','stroke-width':.8,'stroke-dasharray':'1 5'});
    if (yearly.some(({p})=>p.ever)) C(charts, 0, 0, 20, {stroke:'#75946e','stroke-width':4,fill:'#f6f7ef'});
    for (let m = 0; m < 12; m++) {
      const angle = m * Math.PI/6 - Math.PI/2;
      const arm = G(charts, {transform:`rotate(${m*30})`});
      L(arm,0,-94,0,-107,.8,.35);
      const active = yearly.filter(({p})=>p.mo.includes(m+1));
      el(arm,'path',{d:'M-3 -26 Q-8 -36 0 -45 Q8 -36 3 -26 Z',fill:'#e9ebe2',stroke:'#c6cdbe','stroke-width':.7});
      active.forEach(({p,i}, j) => {
        const inner = 25 + 22*j, outer = inner+38, width = 9+j*2.5;
        const layer = G(arm);
        const d = `M0 ${-inner} C${-width} ${-inner-3} ${-width-2} ${-outer+8} 0 ${-outer}
          C${width+2} ${-outer+8} ${width} ${-inner-3} 0 ${-inner} Z`;
        el(layer,'path',{d,fill:p.c,stroke:'#4e544b','stroke-width':.7,'fill-opacity':.91});
        if (p.scent) C(layer,0,-inner-15,1.9,{fill:'#3d473a',stroke:'none'});
        petals.push({group:layer,species:i});
      });
      T(charts, 121*Math.cos(angle), 121*Math.sin(angle)+5, months[m], {z:15,a:'middle',f:MUTE});
    }
    const label = G(group);
    T(label, x+151, y-28, name+' pier', {z:26,d:1});
    yearly.forEach(({p}, i) => {
      C(label, x+155, y-1+22*i, 4, {fill:p.c,stroke:'none'});
      T(label, x+169, y+4+22*i, p.n, {z:18,f:MUTE}).classList.add('plant-name');
    });
    descriptions.push({label,pier});
  });
  selectPlant(null);
  document.documentElement.dataset.drawn = 'true';
  document.dispatchEvent(new Event('ecology:drawn'));
})();
