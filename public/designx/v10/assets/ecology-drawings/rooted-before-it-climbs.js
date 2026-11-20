/* Imported drawing routines from ecology-drawings, 0270bbb. See SOURCES.md. */
function scene(canvas,o){
  const V=o.view,k=o.k,sp=o.sp,main=!!o.main,LW=o.lw||1,LS=o.leafScale||1;
  canvas.width=Math.round(V.w*k);canvas.height=Math.round(V.h*k);
  const mk=c=>{const x=c.getContext('2d');x.setTransform(k,0,0,k,-V.x*k,-V.y*k);x.lineCap='round';x.lineJoin='round';return x;};
  const cA=document.createElement('canvas'),cR=document.createElement('canvas');[cA,cR].forEach(c=>{c.width=canvas.width;c.height=canvas.height;});
  let a=mk(cA); const rc=mk(cR),g=mk(canvas);
  const r=rng(sp.seed),t=rng(sp.seed+46);
  const F=300,S=375,CX=595,top=V.y-8,bot=V.y+V.h,XL=V.x,XR=V.x+V.w-(main?290:0);
  const ln=(c,x1,y1,x2,y2,w,al)=>{c.strokeStyle=ink(al);c.lineWidth=w*LW;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();};
  const dot=(c,x,y,rad,al)=>{c.fillStyle=ink(al);c.beginPath();c.arc(x,y,rad,0,7);c.fill();};
  const edge=x=>clamp((XR-x)/170,0,1)*clamp((x-XL)/(main?70:140),main?.3:0,1);
  const dep=y=>clamp(1-(y-S)/((bot-S)*1.05),.1,1);

  /* ---- static layer ---- */
  a.fillStyle=PAPER;a.fillRect(V.x,V.y,V.w,V.h);
  if(main){[-1,.5,1,1.5,2,2.5].forEach(m=>{const y=S+m*250;ln(a,XL,y,XL+1120,y,.6,.11);ln(a,XL,y,XL+20,y,.9,.6);});ln(a,XL,F,XL+20,F,.9,.6);}
  a.setLineDash([9,7]);ln(a,XL+26,F,440,F,1,.55);ln(a,440,F,440,S,1,.55);a.setLineDash([]);
  // ground: crumbly topsoil, sparser subsoil, stones deeper down, two faint horizons
  const D=bot-S,NS_=Math.round(V.w*D/200);
  for(let i=0;i<NS_;i++){const x=XL+t()*(XR-XL),d=Math.pow(t(),1.25)*D;if(d>80&&t()<.5)continue;const f=dep(S+d)*edge(x);
    if(d<80&&t()<.3)ln(a,x,S+d,x+2+t()*4,S+d+(t()-.5)*3,.6,.3*f);else dot(a,x,S+d,(.5+t()*.5)*LW,(d<80?.34:.22)*f);}
  [85,300].forEach(h=>{a.setLineDash([18,9]);a.beginPath();for(let x=XL;x<=XR;x+=20)a.lineTo(x,S+h+6*Math.sin(x/70+h));a.strokeStyle=ink(.2);a.lineWidth=.6*LW;a.stroke();a.setLineDash([]);});
  for(let i=0;i<NS_/55;i++){const x=XL+10+t()*(XR-XL-20),d=70+t()*(D-90),sz=2.5+t()*4+d/130,a0=t()*7,f=dep(S+d)*edge(x);
    a.beginPath();const n=6+(t()*3|0);for(let q=0;q<n;q++){const an=a0+q*6.283/n,rr=sz*(.7+t()*.5);a.lineTo(x+rr*1.3*Math.cos(an),S+d+rr*.8*Math.sin(an));}a.closePath();
    a.fillStyle=PAPER;a.fill();a.strokeStyle=ink(.5*f);a.lineWidth=.6*LW;a.stroke();ln(a,x,S+d+sz*.25,x+sz*.8,S+d+sz*.45,.4,.35*f);}
  for(let i=0;i<4;i++){const x=XL+110+t()*(XR-XL-300),y=S+25+t()*45;a.beginPath();for(let q=0;q<=14;q++)a.lineTo(x+q*2.6,y+3*Math.sin(q*.9+i));a.strokeStyle=ink(.5*edge(x));a.lineWidth=1.3;a.stroke();}
  // glulam legs
  const legs=[{x:950,w:65,k:14,g:-46},{x:785,w:22,k:70,g:15},{x:710,w:22,k:120,g:15},{x:667,w:18,k:165,g:13}];
  const timberLayer = document.createElement('canvas');
  timberLayer.width=canvas.width; timberLayer.height=canvas.height;
  a=mk(timberLayer);
  const timberEnd=S+59;
  const cxAt=(L,y)=>L.x-L.k*Math.pow(Math.max(0,F-y)/300,2);
  const legPath=(L,dx)=>{a.beginPath();for(let y=timberEnd;y>=top;y-=6)a.lineTo(cxAt(L,y)+dx-L.w/2,y);for(let y=top;y<=timberEnd;y+=6)a.lineTo(cxAt(L,y)+dx+L.w/2,y);a.lineTo(cxAt(L,timberEnd)+dx+L.w/2,timberEnd);a.closePath();};
  const H=timberEnd-top;
  a.save(); a.beginPath(); a.rect(XL,top,V.w,S-top); a.clip();
  legs.forEach(L=>{legPath(L,L.g);a.fillStyle=PAPER;a.fill();a.strokeStyle=ink(.38);a.lineWidth=.6*LW;a.stroke();
    for(let j=0;j<L.w*.6*H/294;j++){const of=(t()-.5)*L.w*.8,y0=top+t()*H,len=30+t()*50;a.beginPath();for(let y=y0;y<Math.min(timberEnd,y0+len);y+=6)a.lineTo(cxAt(L,y)+L.g+of,y);a.strokeStyle=ink(.13);a.lineWidth=.4*LW;a.stroke();}});
  a.restore();
  legs.forEach(L=>{
    legPath(L,0);a.fillStyle=PAPER;a.fill();a.save();legPath(L,0);a.clip();
    const n=Math.max(2,Math.round(L.w/7)),lam=L.w/n;
    for(let j=0;j<L.w*5*H/294;j++){const of=(t()-.5)*L.w,y0=top+t()*H,len=14+t()*60,ph=t()*7;a.beginPath();for(let y=y0;y<y0+len;y+=4)a.lineTo(cxAt(L,y)+of+.9*Math.sin(y/9+ph),y);a.strokeStyle=ink(.14+t()*.16);a.lineWidth=.4*LW;a.stroke();}
    for(let q=0;q<(L.w>30?4:1);q++){const y=top+28+t()*(H-70),x=cxAt(L,y)+(t()-.5)*(L.w-10);[1,.55].forEach(sc=>{a.beginPath();a.ellipse(x,y,2.6*sc,5*sc,0,0,7);a.strokeStyle=ink(.5);a.lineWidth=.5*LW;a.stroke();});}
    for(let q=1;q<n;q++){a.beginPath();for(let y=timberEnd;y>=top;y-=6)a.lineTo(cxAt(L,y)-L.w/2+q*lam,y);a.strokeStyle=ink(.42);a.lineWidth=.55*LW;a.stroke();
      if(L.w>30){const fy=top+48+t()*(H-110),fx=cxAt(L,fy)-L.w/2+q*lam;a.beginPath();for(let z=0;z<=6;z++)a.lineTo(fx-lam+z*lam/6,fy+(z%2?4:-4));a.strokeStyle=ink(.45);a.lineWidth=.5*LW;a.stroke();}}
    a.restore();legPath(L,0);a.strokeStyle=ink(.95);a.lineWidth=2;a.stroke();
  });
  a=mk(cA);
  // root zone, mulch chips, ground line, grass
  a.setLineDash([7,6]);a.lineWidth=.9*LW;a.strokeStyle=ink(.6);a.strokeRect(CX-125,S,250,150);a.setLineDash([]);
  for(let i=0;i<330;i++){const x=446+t()*612;if(Math.abs(x-CX)<17)continue;const y=S-3-t()*11,an=(t()-.5)*1.2,w=3+t()*4,h=1.2+t()*1.6,co=Math.cos(an),sn=Math.sin(an);
    a.beginPath();[[-w,-h],[w,-h*.6],[w*.8,h],[-w*.9,h*.8]].forEach(p=>a.lineTo(x+p[0]*co-p[1]*sn,y+p[0]*sn+p[1]*co));a.closePath();a.fillStyle=PAPER;a.fill();a.strokeStyle=ink(.55);a.lineWidth=.55*LW;a.stroke();}
  ln(a,XL,S,XR,S,1.6/LW,.9);
  for(let x=1066;x<XR;x+=5+t()*6){const nb=3+(t()*3|0);for(let b=0;b<nb;b++){const h=7+t()*16,lean=(t()-.5)*10;a.beginPath();a.moveTo(x+b*1.5,S);a.quadraticCurveTo(x+b*1.5+lean*.3,S-h*.6,x+b*1.5+lean,S-h);a.strokeStyle=ink(.6*edge(x));a.lineWidth=.6*LW;a.stroke();}}
  if(main){const bx=V.x+1170;ln(a,bx,1010,bx+250,1010,2.2,.95);[0,125,250].forEach(d=>ln(a,bx+d,1002,bx+d,1010,1.4,.95));}

  /* ---- fixed items drawn over the roots each frame: piles, drip, cables ---- */
  const cabA=y=>cxAt(legs[3],y)-legs[3].w/2-12,cabB=y=>cxAt(legs[2],y)-legs[2].w/2-12;
  drawPierFoundation(mk(timberLayer),820,S,1,legs.map(leg=>({x:leg.x-820,w:leg.w})));
  function fixed(c){
    c.save(); c.setTransform(1,0,0,1,0,0);
    c.drawImage(timberLayer,0,0); c.restore();
    dot(c,CX+42,S-7,4.2,.95);c.fillStyle=PAPER;c.beginPath();c.arc(CX+42,S-7,1.7,0,7);c.fill();
    [cabA,cabB].forEach(cb=>{c.beginPath();for(let y=292;y>=top;y-=6)c.lineTo(cb(y),y);c.strokeStyle=ink(.85);c.lineWidth=.9*LW;c.stroke();
      c.fillStyle=PAPER;c.fillRect(cb(284)-2.5,277,5,13);c.strokeStyle=ink(.9);c.lineWidth=.8;c.strokeRect(cb(284)-2.5,277,5,13);
      for(let y=270;y>top;y-=122){ln(c,cb(y),y,cb(y)+12,y,1.4/LW,.9);c.beginPath();c.arc(cb(y),y,2.6,0,7);c.fillStyle=PAPER;c.fill();c.strokeStyle=ink(.95);c.lineWidth=1;c.stroke();}});
  }

  /* ---- roots: generated once with a birth time, drawn as they come due ---- */
  const segs=[];let budget=o.budget,tmax=1;
  function grow(x,y,an,w,type,gen,tm){
    const decay=type==='lat'?.992:type==='sink'?.972:.95;
    while(w>.22&&budget-->0){
      const tgt=type==='lat'?(Math.cos(an)>=0?.12:Math.PI-.12):Math.PI/2;
      an+=(r()-.5)*(type==='lat'?.3:.5)+(tgt-an)*(type==='lat'?.06:.07);
      let nx=x+Math.cos(an)*5,ny=y+Math.sin(an)*5;
      if(ny<S+6){ny=S+6;an=Math.atan2(Math.abs(Math.sin(an))+.05,Math.cos(an));}
      const inZone=Math.abs(nx-CX)<125&&ny<S+150;
      const fade=dep(ny)*clamp(1-Math.abs(nx-CX)/1000,.2,1)*(inZone?1:.5)*clamp((XR-nx)/170,0,1)*(main?1:clamp((nx-XL)/140,0,1));
      segs.push([x,y,nx,ny,Math.max(.35,w),clamp(.35+w*.14,0,.9)*fade,tm]);tm++;if(tm>tmax)tmax=tm;
      x=nx;y=ny;w*=decay;
      if(gen<6&&r()<(type==='fine'?.05:type==='sink'?.06:.085)){
        const cw=w*(.45+r()*.25),side=r()<.5?-1:1;
        const ca=type==='lat'?(r()<.7?Math.PI/2+(r()-.5)*.9:an+side*(.5+r()*.5)):an+side*(.6+r()*.7);
        grow(x,y,ca,cw,cw<1.2?'fine':(type==='lat'&&r()<.3?'lat':'sink'),gen+1,tm);}
      if(x<XL-20||x>XR+10||y>bot)break;
    }
  }
  sp.roots.forEach(q=>grow(CX,S+6,q[0],q[1],q[2],0,0));
  segs.sort((p,q)=>p[6]-q[6]);
  let ri=0;
  const rootsTo=p=>{while(ri<segs.length&&segs[ri][6]/tmax<=p){const s=segs[ri++];ln(rc,s[0],s[1],s[2],s[3],s[4]/LW*Math.min(LW,1.25),s[5]);}};
  const rootsClear=()=>{rc.save();rc.setTransform(1,0,0,1,0,0);rc.clearRect(0,0,cR.width,cR.height);rc.restore();ri=0;};

  /* ---- the plant ---- */
  const bez=(p0,p1,p2,p3,n)=>{const out=[];for(let i=0;i<=n;i++){const u0=i/n,u=1-u0;out.push([u*u*u*p0[0]+3*u*u*u0*p1[0]+3*u*u0*u0*p2[0]+u0*u0*u0*p3[0],u*u*u*p0[1]+3*u*u*u0*p1[1]+3*u*u0*u0*p2[1]+u0*u0*u0*p3[1]]);}return out;};
  const along=(cb,y0,w)=>{const out=[];if(sp.spiral)for(let y=y0-4;y>=top;y-=4)out.push([cb(y)+4.5*Math.sin((y0-y)/8),y]);else for(let y=y0-6;y>=top;y-=6)out.push([cb(y)-w/2-3,y]);return out;};
  const offA=sp.spiral?0:sp.w/2+3,offB=sp.spiral?0:sp.w2/2+3;
  const T=bez([CX,S+4],[CX,S-40],[cabA(250)-30,290],[cabA(250)-offA,250],24).concat(along(cabA,250,sp.w));
  const i0=T.findIndex(p=>p[1]<=sp.by),p0=T[i0],yb=p0[1]-80;
  const Sh=bez(p0,[p0[0]+12,p0[1]-30],[cabB(yb)-22,p0[1]-46],[cabB(yb)-offB,yb],18).concat(along(cabB,yb,sp.w2));
  const stems=[{P:T,w:sp.w,t0:0,flare:true},{P:Sh,w:sp.w2,t0:i0/T.length*.9,side:.5}];
  stems.forEach(st=>{st.sprigs=[];st.flowers=[];st.ties=[];st.bark=[];
    st.P.forEach((p,i)=>{if(i>(st.flare?26:6)&&i%sp.every===0&&p[1]<238)st.sprigs.push([i,Math.PI+(st.side||0)+(r()-.5)*1.3]);
      if(st.w>=10&&i>0&&i<st.P.length-2)st.bark.push([i,(r()-.5),(r()-.5)*1.5,2+r()*7,.3+r()*.25]);});
    const nf=st.flare?sp.nfl:Math.ceil(sp.nfl/2);for(let j=0;j<nf;j++)st.flowers.push(Math.floor(st.P.length*(.36+.58*(j+.5)/nf)));
    if(!sp.spiral)st.P.forEach((p,i)=>{if(i>26&&i%13===0)st.ties.push(i);});});
  function plant(c,p){LEAFC=sp.lc;FLOWC=sp.fc||sp.c;const tt=p;p=GH(sp,tt)/sp.gh[9];
    const sg=clamp(p/.8,0,1),wf=.4+.6*p,cabOf=st=>st.flare?cabA:cabB;
    stems.forEach(st=>{
      const q=clamp((sg-st.t0)/(1-st.t0),0,1),n=Math.floor(q*(st.P.length-1));if(n<1)return;
      const wd=i=>(st.flare&&i<10?st.w*(1.45-.045*i):st.w)*wf*clamp((n-i)/8,.25,1);
      if(st.w*wf<3.4){c.beginPath();for(let i=0;i<=n;i++)c.lineTo(st.P[i][0],st.P[i][1]);c.strokeStyle=ink(.9);c.lineWidth=Math.max(1.2,st.w*wf*.7);c.stroke();}
      else{[0,1].forEach(pass=>{for(let i=1;i<=n;i++){const w=wd(i);c.strokeStyle=pass?PAPER:ink(.92);c.lineWidth=pass?Math.max(.2,w-2.6):w;c.beginPath();c.moveTo(st.P[i-1][0],st.P[i-1][1]);c.lineTo(st.P[i][0],st.P[i][1]);c.stroke();}});
        st.bark.forEach(b=>{if(b[0]<n-2){const of=b[1]*(wd(b[0])-4);if(wd(b[0])>6)ln(c,st.P[b[0]][0]+of,st.P[b[0]][1],st.P[b[0]+1][0]+of+b[2],st.P[b[0]+1][1]-b[3],.45,b[4]);}});}
      const cb=cabOf(st);st.ties.forEach(i=>{if(i<n-3){const y=st.P[i][1];ln(c,st.P[i][0]-st.w*wf/2-1,y,cb(y)+1,y,1.5/LW,.95);}});
      st.sprigs.forEach(s=>{if(s[0]<n){const sc=clamp((n-s[0])/6,0,1)*(.55+.45*p)*LS;leafAt(c,st.P[s[0]][0]-(sp.spiral?0:3),st.P[s[0]][1],s[1],sp.leaf,sc);
        if(sp.leaf==='heart'&&sc>.6){const x=st.P[s[0]][0]+6,y=st.P[s[0]][1];c.beginPath();for(let z=0;z<=14;z++)c.lineTo(x+z*.6+4*Math.sin(z*.9)*(1-z/16),y-z*1.1+4*Math.cos(z*.9)*(1-z/16)-4);c.strokeStyle=ink(.6);c.lineWidth=.5;c.stroke();}}});
      if(tt>sp.ff)st.flowers.forEach(i=>{if(i<n){const sc=clamp((tt-sp.ff)/.12,0,1)*(LS>1?1.5:1);flowerAt(c,st.P[i][0]-(sp.flower==='raceme'||sp.flower==='bunch'?20:16),st.P[i][1]+(sp.flower==='raceme'||sp.flower==='bunch'?4:-4),sp.flower,sc);}});
    });
  }

  /* ---- frame ---- */
  function draw(p,al){
    rootsTo(clamp(p/.9,0,1));
    g.save();g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,canvas.width,canvas.height);g.drawImage(cA,0,0);g.globalAlpha=al;g.drawImage(cR,0,0);g.restore();
    fixed(g);g.globalAlpha=al;plant(g,p);g.globalAlpha=1;
  }
  let cycle = -1;
  loopDrawing(canvas, now => {
    const nextCycle = Math.floor(now / CYCLE);
    if (nextCycle !== cycle) { rootsClear(); cycle = nextCycle; }
    const e = now % CYCLE;
    draw(Math.min(e / GROW, 1), Math.min((CYCLE - e) / FADE, 1));
  }, () => { cycle = -1; rootsClear(); draw(1, 1); });
  return{cabA,cxAt,legs,S,F,CX};
}

/* ---------- 1. the section ---------- */
(function(){
  const V={x:190,y:0,w:1600,h:1040};
  const sc=scene(document.getElementById('mainC'),{view:V,k:drawingScale(V.w,V.h,2),sp:SP.wisteria,main:true,budget:80000});
  const s=document.getElementById('mainL');
  const A=[
    ['Wisteria, tied to a cable beside the rib',sc.cabA(70)-9,70],
    ['Glulam legs of the pier',sc.cxAt(sc.legs[0],170)+32,170],
    ['Stainless steel sleeve at the soil line',986,sc.S+18],
    ['Buried steel frame on screw piles',1007,sc.S+78],
    ['Open soil kept for the roots',sc.CX+125,sc.S+90],
    ['Screw piles in place of a concrete pad',961,640]
  ].map(q=>({txt:q[0],x:q[1]-V.x,y:q[2]})).sort((p,q)=>p.y-q.y);
  const EX=1128,slot=i=>130+i*130;
  const cross=(i,j)=>{const p=A[i],q=A[j],ya=slot(i)-6,yb=slot(j)-6,d=(px,py,qx,qy,rx,ry)=>(qx-px)*(ry-py)-(qy-py)*(rx-px);
    return d(EX,ya,p.x,p.y,EX,yb)*d(EX,ya,p.x,p.y,q.x,q.y)<0&&d(EX,yb,q.x,q.y,EX,ya)*d(EX,yb,q.x,q.y,p.x,p.y)<0;};
  for(let pass=0,sw=true;sw&&pass<40;pass++){sw=false;for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++)if(cross(i,j)){const q=A[i];A[i]=A[j];A[j]=q;sw=true;}}
  A.forEach((q,i)=>{const y=slot(i);
    el(s,'polyline',{points:`1160,${y-6} ${EX},${y-6} ${q.x.toFixed(1)},${q.y.toFixed(1)}`,class:'plead'});
    el(s,'circle',{cx:q.x.toFixed(1),cy:q.y.toFixed(1),r:3,fill:'var(--pencil)'});
    el(s,'text',{x:1170,y,class:'pl'},q.txt);});
  const tx=(x,y,txt,anchor)=>el(s,'text',{x,y,'text-anchor':anchor||'start',class:'pl sm'},txt);
  tx(1170,1032,'0','middle');tx(1295,1032,'0.5','middle');tx(1420,1032,'1 m','middle');
  [[-1,'+1.0 m'],[0,'soil 0'],[.5,'0.5'],[1,'1.0'],[1.5,'1.5'],[2,'2.0'],[2.5,'2.5 m']].forEach(d=>tx(26,sc.S+d[0]*250-6,d[1]));
})();
