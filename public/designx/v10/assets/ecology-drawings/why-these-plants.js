/* Imported drawing routines from ecology-drawings, 0270bbb. See SOURCES.md. */
/* Six seasonal calendars use the trial planting and the original botanical sprigs. */
/* Months, leaf habit, climbing habit, height and role are read from the taxon files in the Auxin model (Horti-code-ture/species).
   Piers are the trial planting (scenes/six-bay-radial-open-pier/planting.json). Akebia and Lonicera henryi are left out;
   star jasmine and ivy stand in for them. */
(function(){
  const s = document.getElementById('logicS');
  const INK='var(--pencil)',MUTE='var(--mute)',WH='var(--white)';
  const T=(p,x,y,txt,o)=>{o=o||{};return el(p,'text',{x,y,'text-anchor':o.a||'start','font-size':o.z||17,style:'fill:'+(o.f||'var(--ink)')+(o.w?';font-weight:500':'')+(o.d?';font-family:var(--display);font-style:italic':'')},txt);};
  const L=(p,x1,y1,x2,y2,w,op,dash)=>el(p,'line',{x1,y1,x2,y2,stroke:INK,'stroke-width':w||1,'stroke-opacity':op==null?.8:op,'stroke-dasharray':dash||'none','stroke-linecap':'round'});
  const C=(p,cx,cy,r,o)=>el(p,'circle',Object.assign({cx,cy,r,fill:'none',stroke:INK,'stroke-width':1},o||{}));
  const G=(p,o)=>el(p||s,'g',o||{});


  /* a small pen that writes canvas calls as SVG paths, so the leaves and flowers are the same ones the other drawings use */
  const pen=(p,tint)=>{let d='';const f=v=>(+v).toFixed(1);return{fillStyle:'',strokeStyle:'',lineWidth:1,beginPath(){d='';},moveTo(x,y){d+='M'+f(x)+','+f(y);},lineTo(x,y){d+=(d?'L':'M')+f(x)+','+f(y);},
    quadraticCurveTo(a,b,x,y){d+='Q'+f(a)+','+f(b)+' '+f(x)+','+f(y);},closePath(){d+='Z';},
    ellipse(cx,cy,rx,ry,rot){const c=Math.cos(rot),n=Math.sin(rot),dg=f(rot*57.2958);d+='M'+f(cx+rx*c)+','+f(cy+rx*n)+'A'+f(rx)+','+f(ry)+' '+dg+' 1 0 '+f(cx-rx*c)+','+f(cy-rx*n)+'A'+f(rx)+','+f(ry)+' '+dg+' 1 0 '+f(cx+rx*c)+','+f(cy+rx*n)+'Z';},
    arc(cx,cy,r){this.ellipse(cx,cy,r,r,0);},
    fill(){el(p,'path',{d,fill:tint&&this.fillStyle===PAPER?tint:this.fillStyle,stroke:'none'});},stroke(){el(p,'path',{d,fill:'none',stroke:this.strokeStyle,'stroke-width':this.lineWidth,'stroke-linecap':'round','stroke-linejoin':'round'});}};};
  const out=(c,a)=>{c.fillStyle=PAPER;c.fill();c.strokeStyle=ink(a||.75);c.lineWidth=.7;c.stroke();};
  const leafX=(c,x,y,a,sc)=>{const ex=x+Math.cos(a)*9*sc,ey=y+Math.sin(a)*9*sc;c.beginPath();c.moveTo(x,y);c.lineTo(ex,ey);c.strokeStyle=ink(.7);c.lineWidth=.7;c.stroke();
    [-.75,0,.75].forEach(o=>{const an=a+o,cx=ex+Math.cos(an)*11*sc,cy=ey+Math.sin(an)*11*sc;c.beginPath();c.ellipse(cx,cy,10.5*sc,3.1*sc,an);out(c,.7);c.beginPath();c.moveTo(cx-Math.cos(an)*8*sc,cy-Math.sin(an)*8*sc);c.lineTo(cx+Math.cos(an)*8*sc,cy+Math.sin(an)*8*sc);c.strokeStyle=ink(.4);c.lineWidth=.4;c.stroke();});};
  const flowerX=(c,x,y,type,sc)=>{
    if(type.slice(0,4)==='star'){const n=+type[4];for(let k=0;k<n;k++){const an=k*6.283/n-1.2;c.beginPath();c.ellipse(x+Math.cos(an)*5.4*sc,y+Math.sin(an)*5.4*sc,5.4*sc,2.4*sc,an);out(c);}c.beginPath();c.arc(x,y,1.7*sc);out(c,.9);}
    else if(type==='bell'){c.beginPath();c.moveTo(x,y-4*sc);c.lineTo(x,y);c.strokeStyle=ink(.7);c.lineWidth=.7;c.stroke();c.beginPath();c.moveTo(x-5.5*sc,y);c.quadraticCurveTo(x-8*sc,y+12*sc,x-2*sc,y+13*sc);c.quadraticCurveTo(x,y+10.5*sc,x+2*sc,y+13*sc);c.quadraticCurveTo(x+8*sc,y+12*sc,x+5.5*sc,y);c.closePath();out(c);
      [[-2,5],[1.5,7],[-.5,9.5],[2.5,3.5]].forEach(q=>{c.beginPath();c.arc(x+q[0]*sc,y+q[1]*sc,.7*sc);c.fillStyle=ink(.7);c.fill();});}
    else{[-.75,0,.75].forEach(o=>{const an=-1.57+o,co=Math.cos(an),sn=Math.sin(an),tx=x+co*15*sc,ty=y+sn*15*sc;c.beginPath();c.moveTo(x,y);c.lineTo(tx+sn*3.4*sc,ty-co*3.4*sc);c.lineTo(tx-sn*3.4*sc,ty+co*3.4*sc);c.closePath();out(c);c.beginPath();c.ellipse(tx,ty,4.4*sc,2.2*sc,an+1.57);out(c);});}};
  const sprig=(g,cx,cy,sp)=>{LEAFC=FLOWC=null;const c=pen(g),cl=pen(g,sp.lc),cf=pen(g,sp.c),P0=[cx-19,cy+33],P1=[cx-8,cy-2],P2=[cx+15,cy-27],B=u=>[(1-u)*(1-u)*P0[0]+2*u*(1-u)*P1[0]+u*u*P2[0],(1-u)*(1-u)*P0[1]+2*u*(1-u)*P1[1]+u*u*P2[1]];
    c.beginPath();for(let i=0;i<=12;i++){const p=B(i/12);c.lineTo(p[0],p[1]);}c.strokeStyle=ink(.85);c.lineWidth=1.5;c.stroke();
    [.2,.5,.8].forEach((u,i)=>{const p=B(u),q=B(u+.04),th=Math.atan2(q[1]-p[1],q[0]-p[0]),a=th+(i%2?1:-1)*1.05;if(sp.leaf==='tri')leafX(cl,p[0],p[1],a,sp.ls);else leafAt(cl,p[0],p[1],a,sp.leaf,sp.ls);});
    const hang=sp.fl==='raceme'||sp.fl==='bunch'||sp.fl==='bell',p=hang?B(.62):P2,fx=p[0]+(hang?12:2),fy=p[1]+(hang?2:-3);
    if(/star|bell|trumpet/.test(sp.fl))flowerX(cf,fx,fy,sp.fl,sp.fs);else flowerAt(cf,fx,fy,sp.fl,sp.fs);};

  /* ---- the twelve: months at work, piers (P1 south-west, then anticlockwise seen from above: SE, E, NE, NW, W), grip, height in metres ---- */
  const PL=[
   {n:'Chinese wisteria',role:'The woody canopy and the great flowering of the year.',mo:[5,6],when:'Flowers in May and June',pier:[0],where:'South-west pier',grip:0,how:'Twines round a 4 mm cable',h:[12,null],leaf:'pinnate9',ls:.62,fl:'raceme',fs:.62},
   {n:'Japanese wisteria',role:'Metre-long flowers where there is headroom for them.',mo:[5,6],when:'Flowers in May and June',pier:[5],where:'West pier',grip:0,how:'Twines round a 4 mm cable',h:[8,12],leaf:'pinnate9',ls:.62,fl:'raceme',fs:.8},
   {n:'Climbing rose',role:'Repeat flowers and scent at head height.',mo:[7,8,9,10,11],when:'Flowers from July to November',pier:[0,1],where:'Both south piers',grip:3,how:'Is tied in at fixed points',h:[4,8],leaf:'pinnate5',ls:.85,fl:'rose',fs:1.05},
   {n:'Star jasmine',role:'Evergreen leaf and summer scent in a sheltered spot.',mo:[7,8],ever:1,when:'Scent in July and August',pier:[0,1,2],where:'South and east piers',grip:0,how:'Twines round a 4 mm cable',h:[8,12],leaf:'oval',ls:.9,fl:'star5',fs:.95},
   {n:'Winter clematis',role:'Flowers through the dark months, low enough to see.',mo:[11,12,1,2,3],ever:1,when:'Flowers from November to March',pier:[0,1],where:'Both south piers',grip:1,how:'Clasps fine laths with its leaf stalks',h:[2.5,4],leaf:'tri',ls:.6,fl:'bell',fs:1},
   {n:'Woodbine',role:'Summer scent, pollinators, then berries.',mo:[6,7,8,9,10],when:'Scent from June to October',pier:[1,2],where:'South-east and east piers',grip:0,how:'Twines round a 4 mm cable',h:[4,8],leaf:'oval',ls:.9,fl:'whorl',fs:.95},
   {n:'Summer clematis',role:'Late summer flower at hand height.',mo:[7,8],when:'Flowers in July and August',pier:[2],where:'East pier',grip:1,how:'Clasps fine laths with its leaf stalks',h:[2.5,4],leaf:'pinnate5',ls:.8,fl:'star4',fs:1.25},
   {n:'Climbing hydrangea',role:'White flower for the cool side.',mo:[6],when:'Flowers in June',pier:[3],where:'North-east pier',grip:2,how:'Clings to bare timber by rootlets',h:[12,null],leaf:'ovate',ls:.85,fl:'lacecap',fs:.95},
   {n:'Ivy',role:'Evergreen cover, autumn nectar and winter berries.',mo:[9,10,11],ever:1,when:'Nectar from September to November',pier:[3,4],where:'Both north piers',grip:2,how:'Clings to bare timber by rootlets',h:[8,12],leaf:'lobed',ls:.95,fl:'umbel',fs:1},
   {n:'Spring clematis',role:'Evergreen leaf and the first scent of spring.',mo:[3,4],ever:1,when:'Scent in March and April',pier:[5],where:'West pier',grip:1,how:'Clasps fine laths with its leaf stalks',h:[4,8],leaf:'tri',ls:.78,fl:'star6',fs:1},
   {n:'Trumpet vine',role:'Late orange flower on the warm side.',mo:[8,9,10,11],when:'Flowers from August to November',pier:[5],where:'West pier',grip:2,how:'Clings to bare timber by rootlets',h:[8,12],leaf:'pinnate9',ls:.6,fl:'trumpet',fs:.85},
   {n:'Crimson glory vine',role:'Red leaf in autumn, high in the frame.',mo:[10,11],when:'Red leaf in October and November',pier:[5],where:'West pier',grip:1,how:'Clasps fine laths with tendrils',h:[12,null],leaf:'heart',ls:.72,fl:'bunch',fs:.75}];
  [['#9a7fcb',0],['#b9a3e3',0],['#e08fa3',1],['#ecd98a',1],['#d8c79a',0],['#e6a93c',1],['#7a4aa8',0],['#c3d6a4',0],['#b4b84e',0],['#efc2b6',1],['#e2743a',0],['#b5452f',0]].forEach((q,i)=>{PL[i].c=q[0];PL[i].scent=q[1];PL[i].lc=PL[i].ever?'#86ab7f':'#b7d39a';});

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
    C(g, x, 68, 46, {fill:WH});
    sprig(g, x, 68, p);
    const words = p.n.split(' ');
    const lines = p.n.length > 12 ? [words.slice(0,-1).join(' '), words.at(-1)] : [p.n];
    lines.forEach((line, j) => T(g, x, 140 + 19*j, line, {a:'middle',z:17}));
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
  L(s, 44, 243, 1550, 243, .8, .36);
  names.forEach((name, pier) => {
    const col = pier % 3, row = Math.floor(pier / 3);
    const x = 159 + 515 * col, y = 392 + 282 * row;
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
      T(label, x+169, y+4+22*i, p.n, {z:16,f:MUTE});
    });
    descriptions.push({label,pier});
  });
  T(s,44,853,'Colour marks flower or autumn leaf. A dot marks scent. A green centre marks evergreen foliage.',{z:18,f:MUTE});
  selectPlant(null);
  document.documentElement.dataset.drawn = 'true';
  document.dispatchEvent(new Event('ecology:drawn'));
})();
