/* Imported drawing routines from ecology-drawings, 0270bbb. See SOURCES.md. */
/* ---------- drawing 6: why these plants, shown one plant at a time across four small diagrams ---------- */
/* Months, leaf habit, climbing habit, height and role are read from the taxon files in the Auxin model (Horti-code-ture/species).
   Piers are the trial planting (scenes/six-bay-radial-open-pier/planting.json). Akebia and Lonicera henryi are left out;
   star jasmine and ivy stand in for them. The elevation and the climbing route are the six-bay model itself (window.BW_MODEL). */
(function(){
  const S0=document.getElementById('logicS'),MD=window.BW_MODEL;if(!S0)return;let s=S0;const OFF=document.createElementNS(NS,'g');
  const INK='var(--pencil)',MUTE='var(--mute)',WH='var(--white)';
  const T=(p,x,y,txt,o)=>{o=o||{};return el(p,'text',{x,y,'text-anchor':o.a||'start','font-size':o.z||17,style:'fill:'+(o.f||'var(--ink)')+(o.w?';font-weight:500':'')+(o.d?';font-family:var(--display);font-style:italic':'')},txt);};
  const L=(p,x1,y1,x2,y2,w,op,dash)=>el(p,'line',{x1,y1,x2,y2,stroke:INK,'stroke-width':w||1,'stroke-opacity':op==null?.8:op,'stroke-dasharray':dash||'none','stroke-linecap':'round'});
  const C=(p,cx,cy,r,o)=>el(p,'circle',Object.assign({cx,cy,r,fill:'none',stroke:INK,'stroke-width':1},o||{}));
  const G=(p,o)=>el(p||s,'g',o||{});
  el(s,'style',{},'#logicS .fd{transition:opacity .5s ease}#logicS .gr{transition:stroke-dasharray .9s ease}#logicS .pk{cursor:pointer}');
  const defs=el(s,'defs',{}),pat=el(defs,'pattern',{id:'lgCool',width:9,height:9,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'});el(pat,'line',{x1:0,y1:0,x2:0,y2:9,stroke:INK,'stroke-width':.6,'stroke-opacity':.5});

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
  const N=PL.length,upd=[];

  s=OFF;
  /* ---- the field: seventeen in the model, twelve planted ---- */
  T(s,40,46,'Seventeen climbers in the model',{z:19,w:1});
  for(let i=0;i<17;i++){const x=356+i*26,y=40;
    if(i<12)C(s,x,y,8,{fill:INK});else if(i<15)C(s,x,y,8,{'stroke-width':1.3});else{C(s,x,y,8,{'stroke-width':1.3,'stroke-opacity':.5});L(s,x-5,y-5,x+5,y+5,1.5,.9);L(s,x-5,y+5,x+5,y-5,1.5,.9);}}
  T(s,820,46,'12 planted',{z:16});T(s,930,46,'3 set aside',{z:16,f:MUTE});T(s,1044,46,'2 left out as invasive risks in Britain',{z:16,f:MUTE});

  /* ---- the roster: one sprig each. The dark one is the plant the four diagrams are showing. ---- */
  s=S0;
  const ros=PL.map((p,i)=>{const cx=103+i*126.7,cy=160,g=G(s,{class:'fd pk',transform:'translate(0,-78)'});
    const ring=C(g,cx,cy,50,{fill:WH,'stroke-width':1});sprig(g,cx,cy,p);
    const w=p.n.split(' '),two=w.length>1&&p.n.length>11,l1=two?w.slice(0,Math.ceil(w.length/2)).join(' '):p.n,l2=two?w.slice(Math.ceil(w.length/2)).join(' '):'';
    const t1=T(g,cx,236,l1,{a:'middle',z:15}),t2=l2?T(g,cx,255,l2,{a:'middle',z:15}):null;
    upd.push(k=>{const on=k===i;g.setAttribute('opacity',on?1:.9);ring.setAttribute('stroke-width',on?3:1);[t1,t2].forEach(t=>{if(t)t.style.fontWeight=on?500:400;});});
    return g;});
  s=OFF;
  const nameT=T(s,40,330,'',{z:44,d:1}),roleT=T(s,40,366,'',{z:19,f:MUTE});
  upd.push(k=>{nameT.textContent=PL[k].n;roleT.textContent=PL[k].role;});
  L(s,40,398,1560,398,1,.35);

  const X0=[40,440,840,1240],CYD=660,capT=[];
  ['When it works','Where it stands','How it holds on','How high it climbs'].forEach((h,i)=>{C(s,X0[i]+16,446,16,{'stroke-width':1.3});T(s,X0[i]+16,453,String(i+1),{a:'middle',z:19,w:1});T(s,X0[i]+44,455,h,{z:27,d:1});
    capT.push(T(s,X0[i],898,'',{z:18,w:1}));});
  const everT=T(s,X0[0],922,'Leaf all year',{z:16,f:MUTE});everT.setAttribute('class','fd');

  /* ---- 1. when: a year wheel. One ring of dots per plant at work in that month; the active plant's dots fill. ---- */
  {const cx=X0[0]+170,cy=CYD,g=G(s),pol=(r,m)=>{const a=(m-.5)/12*6.2832-Math.PI/2;return[cx+r*Math.cos(a),cy+r*Math.sin(a)];};
    C(g,cx,cy,90,{'stroke-opacity':.5});C(g,cx,cy,160,{'stroke-opacity':.5});
    for(let m=0;m<12;m++){const a=m/12*6.2832-Math.PI/2;L(g,cx+90*Math.cos(a),cy+90*Math.sin(a),cx+160*Math.cos(a),cy+160*Math.sin(a),.6,.3);const p=pol(178,m+1);T(g,p[0],p[1]+5,'JFMAMJJASOND'[m],{a:'middle',z:14,f:MUTE});}
    const wd=[];for(let m=0;m<12;m++){const a0=m/12*6.2832-Math.PI/2,a1=(m+1)/12*6.2832-Math.PI/2,q=(r,a)=>(cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1);
      const w=el(g,'path',{d:'M'+q(90,a0)+'A90,90 0 0 1 '+q(90,a1)+'L'+q(160,a1)+'A160,160 0 0 0 '+q(160,a0)+'Z',fill:INK,'fill-opacity':.1,stroke:'none',class:'fd'});wd.push(w);}
    const stack={},dots=PL.map(()=>[]);
    PL.forEach((p,i)=>p.mo.forEach(m=>{const k=stack[m]=(stack[m]||0)+1,q=pol(88+k*12.6,m);dots[i].push(C(g,q[0],q[1],5,{fill:p.c,'stroke-width':.8}));}));
    const evr=C(g,cx,cy,78,{'stroke-width':7,'stroke-opacity':.75,'stroke-dasharray':'2 4'});evr.setAttribute('class','fd');
    const arc=el(g,'path',{fill:'none',stroke:INK,'stroke-width':3,'stroke-linecap':'round'});
    T(g,cx,cy+5,'the year',{a:'middle',z:14,f:MUTE});
    upd.push(k=>{dots.forEach((ds,i)=>ds.forEach(d=>{d.setAttribute('stroke-width',i===k?2.4:.8);d.setAttribute('opacity',i===k?1:.7);}));
      wd.forEach((w,m)=>{w.setAttribute('fill',PL[k].c);w.setAttribute('fill-opacity',.32);w.setAttribute('opacity',PL[k].mo.indexOf(m+1)>=0?1:0);});
      const mo=PL[k].mo,st=mo.find(m=>mo.indexOf(m===1?12:m-1)<0),a0=(st-1)/12*6.2832-Math.PI/2+.05,a1=(st-1+mo.length)/12*6.2832-Math.PI/2-.05,R=167;
      arc.setAttribute('d','M'+(cx+R*Math.cos(a0)).toFixed(1)+','+(cy+R*Math.sin(a0)).toFixed(1)+'A'+R+','+R+' 0 '+(a1-a0>Math.PI?1:0)+' 1 '+(cx+R*Math.cos(a1)).toFixed(1)+','+(cy+R*Math.sin(a1)).toFixed(1));
      evr.setAttribute('opacity',PL[k].ever?1:0);everT.setAttribute('opacity',PL[k].ever?1:0);capT[0].textContent=PL[k].when;});}

  /* ---- 2. where: the room in plan, north up. Sun to the south, the cool side hatched. ---- */
  {const cx=X0[1]+170,cy=CYD,g=G(s),sc=17.4,PR=[[-3.1,-5.369],[3.1,-5.369],[6.2,0],[3.1,5.369],[-3.1,5.369],[-6.2,0]];
    el(g,'path',{d:'M'+(cx-150)+','+cy+' A150,150 0 0 1 '+(cx+150)+','+cy+' Z',fill:'url(#lgCool)',stroke:'none'});
    C(g,cx,cy,150,{'stroke-opacity':.3,'stroke-dasharray':'3 5'});C(g,cx,cy,5.5*sc,{fill:WH,'stroke-opacity':.6});
    el(g,'path',{d:PR.map((p,i)=>(i?'L':'M')+(cx+p[0]*sc).toFixed(1)+','+(cy-p[1]*sc).toFixed(1)).join('')+'Z',fill:'none',stroke:INK,'stroke-width':1,'stroke-opacity':.45});
    L(g,cx,cy+22,cx,cy-20,1.4,.9);el(g,'path',{d:'M'+(cx-7)+','+(cy-8)+' L'+cx+','+(cy-24)+' L'+(cx+7)+','+(cy-8),fill:'none',stroke:INK,'stroke-width':1.4});T(g,cx,cy-32,'N',{a:'middle',z:15,w:1});
    {const Rs=172,p=d=>[cx+Rs*Math.cos(d*Math.PI/180),cy+Rs*Math.sin(d*Math.PI/180)],A=p(25),B=p(155);
      el(g,'path',{d:'M'+A[0].toFixed(1)+','+A[1].toFixed(1)+' A'+Rs+','+Rs+' 0 0 1 '+B[0].toFixed(1)+','+B[1].toFixed(1),fill:'none',stroke:INK,'stroke-width':1,'stroke-dasharray':'2 6','stroke-opacity':.7});
      [45,90,135].forEach(d=>{const q=p(d);C(g,q[0],q[1],6.5,{fill:WH});for(let i=0;i<8;i++){const a=i*Math.PI/4;L(g,q[0]+Math.cos(a)*9.5,q[1]+Math.sin(a)*9.5,q[0]+Math.cos(a)*13,q[1]+Math.sin(a)*13,.8,.7);}});}
    T(g,cx,cy-160,'cool side',{a:'middle',z:14,f:MUTE});T(g,cx,cy+204,'most sun',{a:'middle',z:14,f:MUTE});
    const pd=PR.map(p=>{const x=cx+p[0]*sc,y=cy-p[1]*sc;return[C(g,x,y,9,{fill:WH,'stroke-width':1.6}),C(g,x,y,16,{'stroke-width':1.2,'stroke-opacity':.8})];});
    pd.forEach(q=>q[1].setAttribute('class','fd'));
    upd.push(k=>{pd.forEach((q,i)=>{const on=PL[k].pier.indexOf(i)>=0;q[0].setAttribute('fill',on?PL[k].c:WH);q[1].setAttribute('opacity',on?1:0);});capT[1].textContent=PL[k].where;});}

  /* ---- 3. how: four ways to hold on, each with the support it needs ---- */
  {const gl=[['twines','cable'],['clasps','fine laths'],['clings','bare timber'],['is tied','tie points']].map((q,i)=>{const x=X0[2]+92+(i%2)*170,y=CYD-92+(i>>1)*186,g=G(s,{class:'fd'}),k=1.7,h=30*k;
      if(i===0){L(g,x,y-h,x,y+h,1.2,.9);let d='';for(let j=0;j<=60;j++){const u=j/60;d+=(j?'L':'M')+(x+11*Math.sin(u*15)).toFixed(1)+','+(y+h-u*2*h).toFixed(1);}el(g,'path',{d,fill:'none',stroke:INK,'stroke-width':3.2,'stroke-linecap':'round'});}
      else if(i===1){[-20,0,20].forEach(o=>L(g,x+o,y-h,x+o,y+h,1.1,.8));el(g,'path',{d:'M'+(x-10)+','+(y+h)+' C'+(x-14)+','+(y+14)+' '+(x+10)+','+(y-10)+' '+(x+8)+','+(y-h),fill:'none',stroke:INK,'stroke-width':2.8,'stroke-linecap':'round'});
        [[-10,24,-20],[4,-2,20],[8,-30,0]].forEach(q2=>el(g,'path',{d:'M'+(x+q2[0])+','+(y+q2[1])+' q'+((q2[2]-q2[0])*.6)+',-14 '+(q2[2]-q2[0])+',-3 q3,8 -5,8',fill:'none',stroke:INK,'stroke-width':1.3,'stroke-linecap':'round'}));}
      else if(i===2){el(g,'rect',{x:x-24,y:y-h,width:27,height:2*h,fill:WH,stroke:INK,'stroke-width':1.6});[-15,-6].forEach(o=>L(g,x+o,y-h,x+o,y+h,.6,.35));L(g,x+11,y-h,x+11,y+h,3.2,.9);for(let j=0;j<10;j++)L(g,x+11,y-h+8+j*10,x+3,y-h+11+j*10,1,.85);}
      else{el(g,'rect',{x:x-24,y:y-h,width:17,height:2*h,fill:WH,stroke:INK,'stroke-width':1.6});el(g,'path',{d:'M'+(x+6)+','+(y+h)+' C'+(x+20)+','+(y+10)+' '+(x+2)+','+(y-12)+' '+(x+16)+','+(y-h),fill:'none',stroke:INK,'stroke-width':3.2,'stroke-linecap':'round'});
        [30,-22].forEach(o=>{L(g,x-7,y+o,x+13,y+o,2,.95);C(g,x-7,y+o,3.4,{fill:WH,'stroke-width':1.2});});}
      T(g,x,y+h+24,q[0],{a:'middle',z:17,w:1});T(g,x,y+h+43,q[1],{a:'middle',z:14,f:MUTE});return g;});
    upd.push(k=>{gl.forEach((g,i)=>g.setAttribute('opacity',PL[k].grip===i?1:.3));capT[2].textContent=PL[k].how;});}

  /* ---- 4. how high: half the frame in elevation, from the model, and the plant's reach along one cable to the crown ---- */
  {const g=G(s),sc=47,x0=X0[3]+8,yb=CYD+178,X=y=>x0+(y+6.5)*sc,Y=z=>yb-z*sc;
    L(g,x0-4,yb,x0+6.9*sc,yb,1.4,.9);
    [0,2,4,6].forEach(z=>{L(g,x0-4,Y(z),x0+4,Y(z),1,.8);T(g,x0-10,Y(z)+5,z+(z===6?' m':''),{a:'end',z:13,f:MUTE});});
    L(g,X(0),Y(0),X(0),Y(6.6),.7,.5,'8 4 2 4');
    if(MD){let d='';MD.m.forEach(m=>{const p=m[3];for(let i=0;i<p.length-1;i++){if(p[i][1]>.05||p[i+1][1]>.05)continue;d+='M'+X(p[i][1]).toFixed(1)+','+Y(p[i][2]).toFixed(1)+'L'+X(p[i+1][1]).toFixed(1)+','+Y(p[i+1][2]).toFixed(1);}});
      el(g,'path',{d,fill:'none',stroke:INK,'stroke-width':.7,'stroke-opacity':.3,'stroke-linecap':'round'});}
    const cab=MD?MD.c[0].map(p=>[p[1],p[2]]):[[-4.42,.05],[-4.42,3.28],[-3.8,4.41],[-2.07,4.98],[-1.03,5.01]];cab.push([-.72,5.6],[-.6,6.3]);
    const dP=cab.map((p,i)=>(i?'L':'M')+X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1)).join('');let len=0;for(let i=1;i<cab.length;i++)len+=Math.hypot(cab[i][0]-cab[i-1][0],cab[i][1]-cab[i-1][1]);
    el(g,'path',{d:dP,fill:'none',stroke:INK,'stroke-width':1,'stroke-opacity':.8,'stroke-dasharray':'3 4'});
    const may=el(g,'path',{d:dP,fill:'none',stroke:INK,'stroke-width':2.2,'stroke-opacity':.55,'stroke-linecap':'round',class:'gr'}),sure=el(g,'path',{d:dP,fill:'none',stroke:INK,'stroke-width':5.5,'stroke-linecap':'round',class:'gr'});
    T(g,X(-.6)+10,Y(6.3)+4,'crown',{z:13,f:MUTE});T(g,X(-4.42)-8,Y(1.25),'hand',{a:'end',z:13,f:MUTE});L(g,X(-4.42)-5,Y(1.3),X(-4.42)+5,Y(1.3),1,.8);
    T(g,X(0)-6,Y(0)+22,'route to the crown '+len.toFixed(1)+' m',{a:'end',z:13,f:MUTE});
    upd.push(k=>{const h=PL[k].h,a=Math.min(h[0],len)*sc,b=Math.min(h[1]==null?len:h[1],len)*sc;sure.setAttribute('stroke-dasharray',a.toFixed(0)+' 9999');may.setAttribute('stroke-dasharray',b.toFixed(0)+' 9999');
      capT[3].textContent=h[1]==null?'Climbs past '+h[0]+' m':'Climbs '+h[0]+' to '+h[1]+' m';});}

  /* ---- palettes: stack every plant at a pier across the year. Colour is flower or autumn leaf, the green line is leaf held all year,
     and the haze that rises off a band is scent. ---- */
  s=S0;
  {const g=G(s,{transform:'translate(0,-748)'}),x0=330,x1=1560,mw=(x1-x0)/12,y0=1076,rh=80,bh=40,NM=['South-west pier','South-east pier','East pier','North-east pier','North-west pier','West pier'];
    L(s,40,956,1560,956,1,.35);T(g,40,1004,'What each pier adds up to through the year',{z:27,d:1});T(g,x1,1004,'colour is flower or autumn leaf, haze is scent, the green line is leaf all year',{a:'end',z:14,f:MUTE});
    'JFMAMJJASOND'.split('').forEach((c,m)=>T(g,x0+(m+.5)*mw,1044,c,{a:'middle',z:14,f:MUTE}));
    const fl=el(defs,'filter',{id:'lgHaze',x:'-10%',y:'-80%',width:'120%',height:'260%'});el(fl,'feGaussianBlur',{stdDeviation:'7 5'});
    const runs=mo=>{const st=mo.find(m=>mo.indexOf(m===1?12:m-1)<0),e=st-1+mo.length;return e>12?[[st-1,12],[0,e-12]]:[[st-1,e]];};
    const bands=PL.map(()=>[]);
    NM.forEach((nm,pi)=>{const y=y0+pi*rh,here=PL.map((p,i)=>i).filter(i=>PL[i].pier.indexOf(pi)>=0);
      T(g,40,y+13,nm,{z:16,w:1});T(g,40,y+31,here.map(i=>PL[i].n.toLowerCase()).join(', ').replace(/(.{38}[^,]*,) /,'$1\n').split('\n')[0],{z:12.5,f:MUTE});
      {const rest=here.map(i=>PL[i].n.toLowerCase()).join(', ').replace(/(.{38}[^,]*,) /,'$1\n').split('\n')[1];if(rest)T(g,40,y+46,rest,{z:12.5,f:MUTE});}
      for(let m=0;m<=12;m++)L(g,x0+m*mw,y-22,x0+m*mw,y+bh,.5,.14);
      L(g,x0,y+bh,x1,y+bh,.8,.5);
      if(here.some(i=>PL[i].ever))el(g,'rect',{x:x0,y:y+bh+3,width:x1-x0,height:5,fill:'#86ab7f',stroke:'none'});
      here.forEach(i=>{const p=PL[i];runs(p.mo).forEach(r=>{const xa=x0+r[0]*mw+3,w=(r[1]-r[0])*mw-6;
          if(p.scent){el(g,'rect',{x:xa+6,y:y-14,width:w-12,height:22,fill:p.c,'fill-opacity':.5,filter:'url(#lgHaze)',stroke:'none'});
            for(let q=0;q<Math.round(w/34);q++){const cx=xa+17+q*34;let d='';for(let z=0;z<=10;z++)d+=(z?'L':'M')+(cx+5*Math.sin(z*.9+q)).toFixed(1)+','+(y-2-z*2).toFixed(1);el(g,'path',{d,fill:'none',stroke:p.c,'stroke-width':1.2,'stroke-opacity':.75,'stroke-linecap':'round'});}}
          bands[i].push(el(g,'rect',{x:xa,y:y,width:w,height:bh,rx:9,fill:p.c,'fill-opacity':.6,stroke:INK,'stroke-width':0,style:'mix-blend-mode:multiply'}));});});});
    upd.push(k=>bands.forEach((bs,i)=>bs.forEach(b=>b.setAttribute('stroke-width',i===k?1.6:0))));}

  /* ---- one plant at a time, in a loop. Pointing at a sprig holds on that plant. ---- */

  let cur = 0;
  let holdUntil = 0;
  let lastChange = 0;
  function show(k) { cur = k; upd.forEach(fn => fn(k)); }
  function holdPlant(index, duration) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    holdUntil = performance.now() + duration;
    show(index);
  }
  ros.forEach((g, index) => {
    g.addEventListener('pointerenter', () => holdPlant(index, 5000));
    g.addEventListener('click', () => holdPlant(index, 9000));
  });
  loopDrawing(s, elapsed => {
    if (elapsed === 0) show(0);
    else if (elapsed - lastChange >= 2800 && performance.now() >= holdUntil) {
      show((cur + 1) % N);
      lastChange = elapsed;
    }
  }, () => show(0), 2800);
})();
