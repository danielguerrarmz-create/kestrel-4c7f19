/* Imported drawing routines from ecology-drawings, 0270bbb. See SOURCES.md. */
/* ---------- slide 4, third pass: walking people, lighter background, weathering timber ---------- */
(function(){
  const canvas=document.getElementById('arcE'),lab=document.getElementById('season');
  const W=1600,H=900,k=drawingScale(W,H,2),GY=800,HZ=640,VX=800,PX=[250,800,1350],LS=.66,FS=.6;
  canvas.width=W*k;canvas.height=H*k;
  const cB=document.createElement('canvas'),cF=document.createElement('canvas'),cW=document.createElement('canvas');
  [cB,cF,cW].forEach(c=>{c.width=canvas.width;c.height=canvas.height;});
  const mk=c=>{const x=c.getContext('2d');x.setTransform(k,0,0,k,0,0);x.lineCap='round';x.lineJoin='round';return x;};
  const bx=mk(cB),fx=mk(cF),wx=mk(cW),g=mk(canvas),r=rng(909),t=rng(606);let a=bx;
  const norm=P=>P.map((p,i)=>{const q=P[Math.min(P.length-1,i+1)],o=P[Math.max(0,i-1)],dx=q[0]-o[0],dy=q[1]-o[1],l=Math.hypot(dx,dy)||1;return[-dy/l,dx/l];});
  const off=(P,N,d)=>P.map((p,i)=>[p[0]+N[i][0]*d,p[1]+N[i][1]*d]);
  const resamp=(P,st)=>{const o=[P[0].slice()];let carry=0;for(let i=1;i<P.length;i++){const ax=P[i-1][0],ay=P[i-1][1],bx2=P[i][0],by=P[i][1],L=Math.hypot(bx2-ax,by-ay);let d=st-carry;while(d<=L){o.push([ax+(bx2-ax)*d/L,ay+(by-ay)*d/L]);d+=st;}carry=L-(d-st);}return o;};
  const ln=(c,x1,y1,x2,y2,w,al)=>{c.strokeStyle=ink(al);c.lineWidth=w;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();};
  const rib=(px,j,y0)=>{const s=Math.sign(j),aj=Math.abs(j),A=aj===3?242:aj===2?150:60,yEnd=aj===3?280:-10,P=[];for(let y=y0||GY;y>=yEnd;y-=8)P.push([px+j*11+(y<600?s*A*Math.pow((600-y)/300,1.6):0),y]);return P;};
  function band(P0,w,ow,oa,o){o=o||{};const P=resamp(P0,o.light?5:8),N=norm(P),Lp=off(P,N,-w/2),Rp=off(P,N,w/2);
    const path=c=>{c.beginPath();Lp.forEach(p=>c.lineTo(p[0],p[1]));for(let i=Rp.length-1;i>=0;i--)c.lineTo(Rp[i][0],Rp[i][1]);c.closePath();};
    const clip=c=>{if(o.clip){c.beginPath();c.rect(o.clip[0],-20,o.clip[1]-o.clip[0],H+40);c.clip();}};
    a.save();clip(a);path(a);a.fillStyle=PAPER;a.fill();
    if(!o.light){const cnt=Math.round(P.length*w/11);for(let j=0;j<cnt;j++){const i0=(t()*P.length)|0,n=3+(t()*8|0),d=(t()-.5)*(w-3);a.beginPath();for(let i=i0;i<Math.min(P.length,i0+n);i++)a.lineTo(P[i][0]+N[i][0]*d,P[i][1]+N[i][1]*d);a.strokeStyle=ink((.14+t()*.16)*oa);a.lineWidth=.5;a.stroke();}
      const nl=Math.max(2,Math.round(w/7));for(let q=1;q<nl;q++){const d=-w/2+q*w/nl;a.beginPath();P.forEach((p,i)=>a.lineTo(p[0]+N[i][0]*d,p[1]+N[i][1]*d));a.strokeStyle=ink(.38*oa);a.lineWidth=.5;a.stroke();}}
    path(a);a.strokeStyle=ink(oa);a.lineWidth=ow;a.stroke();
    if(o.mitre)ln(a,o.mitre,o.my0,o.mitre,o.my1,ow,oa);
    a.restore();
    if(a===fx){ // weathering for this member, on its own layer: silvering strokes, checks, lichen, damp at the base
      wx.save();clip(wx);path(wx);wx.globalCompositeOperation='destination-out';wx.fill();wx.globalCompositeOperation='source-over';path(wx);wx.clip();
      const seg=(n0,len,d,lw,al,zig)=>{wx.beginPath();for(let i=n0;i<Math.min(P.length,n0+len);i++){const z=zig?(i%2?1:-1)*zig:0;wx.lineTo(P[i][0]+N[i][0]*(d+z),P[i][1]+N[i][1]*(d+z));}wx.strokeStyle=ink(al);wx.lineWidth=lw;wx.stroke();};
      for(let j=0;j<P.length*w/4.5;j++)seg((t()*P.length)|0,3+(t()*9|0),(t()-.5)*w,.6,.14+t()*.2);
      for(let j=0;j<P.length/7;j++)seg((t()*P.length)|0,2+(t()*4|0),(t()-.5)*(w-3),.95,.6,.8);
      for(let j=0;j<P.length/20;j++){const i=(t()*P.length)|0,d=(t()-.5)*w;for(let q=0;q<5;q++){wx.beginPath();wx.arc(P[i][0]+N[i][0]*d+(t()-.5)*7,P[i][1]+N[i][1]*d+(t()-.5)*7,.8+t()*1.6,0,7);wx.strokeStyle=ink(.5);wx.lineWidth=.5;wx.stroke();}}
      P.forEach((p,i)=>{if(p[1]>700)for(let q=0;q<3;q++){const d=(t()-.5)*w;ln(wx,p[0]+N[i][0]*d,p[1],p[0]+N[i][0]*d,p[1]-4-t()*8,.6,.3*(p[1]-700)/100);}});
      wx.restore();}
  }

  const walker = makeWalker(k);
  const D1=HZ+160*.74,D2=HZ+160*.52;
  const WALK=[{x0:1085,y:D1,h:168*.74,dir:-1,v:26,o:{coat:1},al:.82,mid:1},{x0:1048,y:D1,h:112*.74,dir:-1,v:26,o:{head:1.28},al:.82,mid:1,p0:1.3},
    {x0:650,y:D2,h:164*.52,dir:1,v:17,o:{skirt:1},al:.72,mid:1},{x0:455,y:GY,h:166,dir:1,v:36,o:{skirt:1,bun:1,bag:1},al:.86}];
  function people(c,sec,mid){WALK.forEach(p=>{if(!!p.mid!==mid)return;const d=p.v*sec,span=W+240,x=((p.x0+p.dir*d+120)%span+span)%span-120;walker(c,x,p.y,p.h,p.dir,(p.p0||0)+6.283*d/(.8*p.h),p.o,p.al);});}

  /* ---- back layer: garden, a lighter floor, the far side of the room ---- */
  bx.fillStyle=PAPER;bx.fillRect(0,0,W,H);
  for(let x=20;x<W;x+=60+t()*70){const h=70+t()*120,cx=x+(t()-.5)*10,cy=HZ-h*.62;ln(a,x,HZ,cx,cy+h*.2,1,.2);ln(a,cx,cy+h*.2,cx-h*.12,cy,.6,.18);ln(a,cx,cy+h*.25,cx+h*.14,cy+h*.05,.6,.18);
    for(let q=0;q<90;q++){const an=t()*6.283,rr=Math.sqrt(t()),px=cx+Math.cos(an)*rr*h*.36,py=cy+Math.sin(an)*rr*h*.42,a0=t()*6.283;a.beginPath();a.arc(px,py,2.5+t()*5,a0,a0+1.6+t()*2.4);a.strokeStyle=ink(.18);a.lineWidth=.5;a.stroke();}}
  for(let q=0;q<900;q++){const x=t()*W,y=HZ-2-t()*20,a0=t()*6.283;a.beginPath();a.arc(x,y,2+t()*3.5,a0,a0+2+t()*2);a.strokeStyle=ink(.18);a.lineWidth=.5;a.stroke();}
  ln(a,0,HZ,W,HZ,.6,.25);
  for(let xf=-2400;xf<=4000;xf+=275)ln(a,VX+(xf-VX)*.1,HZ+16,xf,GY,.5,.11);
  for(let z=1.6;z<40;z*=1.9){const s=10/(10+z),y=HZ+160*s;ln(a,0,y,W,y,.5,.06+.08*s);}
  const SF=.45,far=p=>[VX+(p[0]-VX)*SF,HZ+(p[1]-HZ)*SF],FB=HZ+160*SF;
  for(let m=-4;m<=3;m++){const px=VX+(m+.5)*550,fxx=far([px,0])[0],hw=275*SF;
    [-2,2].forEach(j=>band(rib(px,j).map(far),4.5,.5,.26,{light:true}));
    band(rib(px,3).map(far),5.5,.7,.36,{light:true,clip:[fxx,fxx+hw]});band(rib(px,-3).map(far),5.5,.7,.36,{light:true,clip:[fxx-hw,fxx]});
    a.fillStyle=ink(.35);a.fillRect(fxx-20,FB-4,40,4);}
  band([[-2600,250],[4200,250]].map(far),11,.7,.36,{light:true});
  ln(a,0,FB,W,FB,.6,.25);
  for(let x0=-275;x0<=1900;x0+=275){const p=far([x0,250]);ln(a,x0,250,p[0],p[1],.5,.12);}
  PX.forEach(px=>{for(let q=0;q<12;q++){const u=q/11,x1=px-42+84*u,x2=VX+(x1-VX)*.72+70;ln(a,x1,GY,x2,HZ+160*.72,.5,.12);}});

  /* ---- front layer: the structure, the cut ground ---- */
  a=fx;
  /* member sizes after the model: arches 260 mm, hoops and ring 90 to 100, ribs 80, fines 60. One pixel is about a centimetre. */
  for(let x0=-275;x0<1900;x0+=137.5){band([[x0,250],[x0+225,0]],6,.8,.5);band([[x0,250],[x0-225,0]],6,.8,.5);}
  const ALL=[-300,250,800,1350,1900];
  const hoop=y0=>{const P=[];for(let x=-20;x<=1620;x+=20)P.push([x,y0+7*Math.cos(6.2832*(x-250)/550)]);return P;};
  [168,84].forEach(y0=>band(hoop(y0),9,1.2,.8));
  ALL.forEach(px=>[-2,-1,1,2].forEach(j=>band(rib(px,j),Math.abs(j)===2?8:7,1.3,.9)));
  ALL.forEach(px=>band([[px+275,304],[px+275,250]],8,1.3,.9));
  band([[-20,250],[1620,250]],20,1.8,.95);
  ALL.forEach(px=>{band(rib(px,3),26,2.4,.97,{clip:[px,px+275],mitre:px+275,my0:278,my1:318});band(rib(px,-3),26,2.4,.97,{clip:[px-275,px]});});
  wx.save();wx.setTransform(1,0,0,1,0,0);wx.clearRect(0,(GY-8)*k,cW.width,cW.height);wx.restore();
  a.fillStyle=PAPER;a.fillRect(0,GY,W,H-GY);
  for(let i=0;i<4200;i++){const x=t()*W,d=Math.pow(t(),1.4)*98,fd=clamp(1-d/110,.1,1);if(t()<.25)ln(a,x,GY+2+d,x+2+t()*4,GY+2+d+(t()-.5)*3,.6,.3*fd);else{a.fillStyle=ink(.3*fd);a.beginPath();a.arc(x,GY+2+d,.5+t()*.5,0,7);a.fill();}}
  for(let i=0;i<26;i++){const x=t()*W,d=30+t()*60,sz=3+t()*4;a.beginPath();for(let q=0;q<7;q++){const an=q*.9,rr=sz*(.7+t()*.5);a.lineTo(x+rr*1.3*Math.cos(an),GY+d+rr*.8*Math.sin(an));}a.closePath();a.fillStyle=PAPER;a.fill();a.strokeStyle=ink(.4);a.lineWidth=.6;a.stroke();}
  PX.forEach(px=>{[-1,1].forEach(s=>{for(let q=0;q<9;q++){let x=px+s*(40+t()*18),y=GY+3,an=Math.PI/2-s*(.2+t()*1.1),w=2.6-q*.2;a.beginPath();a.moveTo(x,y);for(let z=0;z<14+t()*16;z++){an+=(t()-.5)*.5;x+=Math.cos(an)*5;y=Math.max(GY+3,y+Math.sin(an)*5);a.lineTo(x,y);}a.strokeStyle=ink(.5*clamp(1-(y-GY)/120,.2,1));a.lineWidth=Math.max(.5,w);a.stroke();}});
    a.fillStyle=ink(.95);a.fillRect(px-44,GY-8,88,8);});
  ln(a,0,GY,W,GY,1.6,.9);

  /* ---- plants ---- */
  const SPEC=[[SP.wisteria,SP.rose],[SP.honeysuckle,SP.ivy],[SP.vine,SP.wisteria]];
  function makeLat(p,out){const n=6+(r()*r()*24|0)+(r()<.2?12:0),curl=(r()-.5)*.2,st=3.2+r()*2,L=[],spurs=[];let an=out+(r()-.5)*1.9,x=p[0],y=p[1];
    for(let q=0;q<n;q++){an+=curl+(r()-.5)*.35;if(r()<.16)an+=(r()-.5)*1.3;x+=Math.cos(an)*st;y=Math.min(GY-5,y+Math.sin(an)*st+q*.1);L.push([x,y,an]);if(r()<.32)spurs.push([q,an+(r()<.5?1:-1)*(.8+r()*.8),4+r()*9]);}
    return{L,spurs,j:r(),fl:r()<.55,sz:.7+r()*.8};}
  const stems=[];
  PX.forEach((px,pi)=>[-1,1].forEach((s,si)=>{const sp=SPEC[pi][si],w=clamp(sp.w*.75,4.5,10);
    const B=resamp(rib(px,3*s),6).filter(p=>p[1]>=306),N=norm(B),cab=off(B,N,s*21),P=off(B,N,s*(22+w/2));
    a.beginPath();cab.forEach(p=>a.lineTo(p[0],p[1]));a.strokeStyle=ink(.8);a.lineWidth=.8;a.stroke();
    const iB=P.findIndex(p=>p[1]<=585),R2=resamp(rib(px,2*s,560),6),B2=resamp([P[iB]].concat(off(R2,norm(R2),-s*(9+w*.3))),6);
    [{P,w,t0:0,arch:true},{P:B2,w:w*.55,t0:iB/P.length*.9,arch:false}].forEach(st=>{
      const Nn=norm(st.P);st.sp=sp;st.sprigs=[];st.lats=[];st.flowers=[];let next=8+(r()*8|0);
      st.P.forEach((p,i)=>{const out=Math.atan2(Nn[i][1]*s,Nn[i][0]*s)+(st.arch?0:Math.PI);
        if(i>5&&i%2===0)st.sprigs.push([i,out+(r()<.3?Math.PI:0)+(r()-.5)*1.4,r(),.65+r()*.85]);
        if(i===next){st.lats.push(Object.assign(makeLat(p,out),{i}));next+=3+(r()*7|0);}
        if(st.arch&&p[1]<570&&i%7===3)st.flowers.push([i,r()]);});
      stems.push(st);});}));
  const herbs=[];
  PX.forEach(px=>{for(let q=0;q<9;q++){const ty=['fern','grass','allium','foxglove','hosta','grass','fern'][(r()*7)|0],tall=ty==='allium'||ty==='foxglove';
    herbs.push({x:px+(q%2?-1:1)*(54+r()*105),ty,h:tall?70+r()*70:28+r()*52,rs:Array.from({length:48},()=>r())});}});
  herbs.sort((p,q)=>p.h-q.h);
  const curve=(c,x0,y0,x1,y1,x2,y2,w,al)=>{c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo(x1,y1,x2,y2);c.strokeStyle=ink(al);c.lineWidth=w;c.stroke();};
  function herb(c,hb,S){
    const up=clamp(S.g*3.2,0,1),amt=hb.ty==='grass'?up*(.65+.35*S.leaf):up*Math.max(S.leaf,.1),R=hb.rs,x=hb.x,h=hb.h*amt;if(amt<.04)return;
    if(hb.ty==='grass'){for(let q=0;q<16;q++){const le=(R[q]-.5)*h*1.1,hh=h*(.5+.5*R[q+16]);curve(c,x+(R[q+30]-.5)*10,GY,x+le*.2,GY-hh*.7,x+le,GY-hh,.7,.45+.3*S.leaf);}}
    else if(hb.ty==='fern'){for(let q=0;q<7;q++){const an=-Math.PI/2+(q-3)*.36+(R[q]-.5)*.2,L=h*(.7+.5*R[q+8]),ex=x+Math.cos(an)*L,ey=GY+Math.sin(an)*L*.9+L*.12,mx=x+Math.cos(an)*L*.5,my=GY+Math.sin(an)*L*.75;curve(c,x,GY,mx,my,ex,ey,.8,.7);
        for(let z=1;z<=9;z++){const u=z/10,px2=(1-u)*(1-u)*x+2*(1-u)*u*mx+u*u*ex,py2=(1-u)*(1-u)*GY+2*(1-u)*u*my+u*u*ey,pl=L*.2*(1-u*.75);[-1,1].forEach(sd=>ln(c,px2,py2,px2+Math.cos(an+sd*1.25)*pl,py2+Math.sin(an+sd*1.25)*pl,.5,.6));}}}
    else if(hb.ty==='hosta'){for(let q=0;q<8;q++){const an=-Math.PI/2+(q-3.5)*.42,d=h*.5,cx=x+Math.cos(an)*d,cy=GY+Math.sin(an)*d*.8;c.beginPath();c.ellipse(cx,cy,h*.42,h*.2,an,0,7);c.fillStyle=PAPER;c.fill();c.strokeStyle=ink(.65);c.lineWidth=.7;c.stroke();
        [-.5,0,.5].forEach(o=>curve(c,x,GY,cx+Math.cos(an+1.57)*o*h*.2,cy+Math.sin(an+1.57)*o*h*.2,x+Math.cos(an)*d*1.8,GY+Math.sin(an)*d*1.45,.35,.4));}}
    else{for(let q=0;q<4;q++){const an=-Math.PI/2+(q-1.5)*.6;curve(c,x,GY,x+Math.cos(an)*h*.2,GY-h*.22,x+Math.cos(an)*h*.34,GY-h*.1+h*.05*q,.8,.6);}
      const n=hb.ty==='allium'?2:1;for(let q=0;q<n;q++){const sx=x+(q?12:0),top=GY-h*(q?.82:1),sw=(R[q]-.5)*10;curve(c,sx,GY,sx+sw,GY-h*.5,sx+sw*.5,top,1,.75);
        if(hb.ty==='allium'){const rad=(5+9*S.fl)*(hb.h/110);for(let z=0;z<26;z++){const an=z*2.4,rr=rad*Math.sqrt((z+1)/26);c.beginPath();c.arc(sx+sw*.5+Math.cos(an)*rr,top+Math.sin(an)*rr,1.2+S.fl*.8,0,7);c.fillStyle=PAPER;c.fill();c.strokeStyle=ink(.7);c.lineWidth=.5;c.stroke();}}
        else for(let z=0;z<11;z++){const u=z/11,by=top+(GY-top)*u*.6,bxx=sx+sw*.5+(sw*.5)*u*.3,sd=z%2?1:-1,bs=(2+3.5*S.fl)*(1+u*.6);c.beginPath();c.ellipse(bxx+sd*bs,by+bs*.4,bs*.6,bs,sd*.5,0,7);c.fillStyle=PAPER;c.fill();c.strokeStyle=ink(.7);c.lineWidth=.5;c.stroke();}}}
  }
  function plant(c,S){
    const wf=.45+.55*S.g;
    stems.forEach(st=>{const sp=st.sp;LEAFC=sp.lc;FLOWC=sp.fc||sp.c;const lf=sp.ever?1:S.leaf,fl=sp.barNote||S.g<sp.ff?0:S.fl*(S.mo==null?1:clamp(Math.min(S.mo-sp.bar[0],sp.bar[1]-S.mo)/.4,0,1)),lfA=j=>clamp(lf*1.4-j*.4,0,1),q=clamp((clamp(GH(sp,S.g)/4.94,0,1)-st.t0*.75)/(1-st.t0*.75),0,1),n=Math.floor(q*(st.P.length-1));if(n<1)return;
      const hang=sp.flower==='raceme'||sp.flower==='bunch';
      st.lats.forEach(L=>{if(L.i>=n)return;const lp=clamp((n-L.i)/18,0,1),m=Math.max(1,Math.floor(lp*L.L.length)),h2=Math.ceil(m/2);
        c.beginPath();c.moveTo(st.P[L.i][0],st.P[L.i][1]);for(let z=0;z<h2;z++)c.lineTo(L.L[z][0],L.L[z][1]);c.strokeStyle=ink(.88);c.lineWidth=1.7*wf+.3;c.stroke();
        c.beginPath();c.moveTo(L.L[h2-1][0],L.L[h2-1][1]);for(let z=h2;z<m;z++)c.lineTo(L.L[z][0],L.L[z][1]);c.strokeStyle=ink(.85);c.lineWidth=.9;c.stroke();
        L.spurs.forEach(sr=>{if(sr[0]<m){const b=L.L[sr[0]],ex=b[0]+Math.cos(sr[1])*sr[2],ey=b[1]+Math.sin(sr[1])*sr[2];ln(c,b[0],b[1],ex,ey,.8,.85);c.fillStyle=ink(.85);c.beginPath();c.arc(ex,ey,1.1,0,7);c.fill();}});
        const la=lfA(L.j)*lp*LS*L.sz;if(la>.06)for(let z=1;z<m;z++)leafAt(c,L.L[z][0],L.L[z][1],L.L[z][2]+(z%2?1.1:-1.1),sp.leaf,la*(.8+.4*((z*7)%5)/5));
        if(L.fl&&m>=L.L.length&&fl>.03){const e=L.L[m-1];flowerAt(c,e[0],e[1]+(hang?3:-2),sp.flower,FS*fl*(.8+L.sz*.6));}});
      [0,1].forEach(pass=>{for(let i=1;i<=n;i++){const w=st.w*wf*clamp((n-i)/8,.25,1);c.strokeStyle=pass?PAPER:ink(.92);c.lineWidth=pass?Math.max(.2,w-2.4):w;c.beginPath();c.moveTo(st.P[i-1][0],st.P[i-1][1]);c.lineTo(st.P[i][0],st.P[i][1]);c.stroke();}});
      st.sprigs.forEach(sg=>{if(sg[0]<n){const sc=clamp((n-sg[0])/6,0,1)*(.6+.4*S.g)*LS*lfA(sg[2])*sg[3];if(sc>.06)leafAt(c,st.P[sg[0]][0],st.P[sg[0]][1],sg[1],sp.leaf,sc);}});
      if(fl>.03)st.flowers.forEach(fw=>{if(fw[0]<n-4)flowerAt(c,st.P[fw[0]][0],st.P[fw[0]][1]+(hang?5:9),sp.flower,FS*fl*(.7+.9*fw[1]));});
    });
  }
  const CY=27000;
  function state(e){const age=Math.pow(clamp(e/23000,0,1),1.2);
    if(e<1500)return{g:0,leaf:0,fl:0,mo:null,age,t:'At installation'};
    if(e<7500){const u=(e-1500)/6000;return{g:.6*u,leaf:1,fl:0,mo:null,age,t:'Establishing'};}
    if(e<10000){const u=(e-7500)/2500;return{g:.6+.08*u,leaf:1,fl:Math.sin(Math.PI*u),mo:4.8,age,t:'May, wisteria in flower'};}
    if(e<12500){const u=(e-10000)/2500;return{g:.68+.07*u,leaf:1,fl:Math.sin(Math.PI*u),mo:6.6,age,t:'July, rose and honeysuckle'};}
    if(e<15500){const u=(e-12500)/3000;return{g:.75,leaf:1-clamp(u*1.6,0,1),fl:0,mo:null,age,t:'January, ivy holds its leaf'};}
    if(e<22000){const u=(e-15500)/6500;return{g:.75+.25*u,leaf:clamp(u*2.2,0,1),fl:clamp((u-.3)/.3,0,1),mo:4.4+1.4*clamp((u-.3)/.7,0,1),age,t:'Years on, May into June'};}
    return{g:1,leaf:1,fl:1,mo:5.8,age:1,t:'Years on, late June'};
  }
  let shown='';
  function draw(S,al,sec){
    g.save();g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,canvas.width,canvas.height);g.drawImage(cB,0,0);g.restore();
    people(g,sec,true);
    g.save();g.setTransform(1,0,0,1,0,0);g.drawImage(cF,0,0);g.globalAlpha=S.age*al;g.drawImage(cW,0,0);g.restore();g.globalAlpha=1;
    people(g,sec,false);
    g.globalAlpha=al;plant(g,S);g.globalAlpha=1;if(S.t!==shown){shown=S.t;lab.textContent=S.t;}}
  loopDrawing(canvas, now => {
    const e = now % CY;
    draw(state(e), Math.min((CY - e) / 1000, 1), now / 1000);
  }, () => draw(state(CY - 1500), 1, 3));
})();
