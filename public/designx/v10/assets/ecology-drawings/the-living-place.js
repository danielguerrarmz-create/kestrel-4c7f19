/* Imported drawing routines from ecology-drawings, 0270bbb. See SOURCES.md. */
/* ---------- drawing 5: the whole site in isometric, orbiting, on a cut plug of ground ---------- */
/* Timber, cables and planting stations are Clay's six-bay model (window.BW_MODEL, metres, x east, y north, z up).
   Everything else (trees, paths, meadow, swale, roots, water table) is entourage drawn by eye.
   The ground is solid: what is below it shows only on the cut edge of the plug. */
(function(){
  const canvas=document.getElementById('siteC'),lab=document.getElementById('date5'),MD=window.BW_MODEL;if(!canvas||!MD)return;
  const W=1600,H=960,k=drawingScale(W,H,1.25),SC=36,PHI=28*Math.PI/180,SPH=Math.sin(PHI),CPH=Math.cos(PHI),CX=800,CY0=506,RB=15.5,DEP=3.6;
  const walker = makeWalker(k);
  canvas.width=W*k;canvas.height=H*k;
  const g=canvas.getContext('2d');g.setTransform(k,0,0,k,0,0);g.lineCap='round';g.lineJoin='round';
  const r=rng(7117),t=rng(8228);let AC=PAPER;
  let ca=1,sa=0;
  const P=(x,y,z)=>{const xr=x*ca-y*sa,yr=x*sa+y*ca;return[CX+SC*xr,CY0-SC*(z*CPH+yr*SPH),yr];};
  const key=(x,y,z)=>(x*sa+y*ca)*CPH-z*SPH;
  const nrm=v=>{const l=Math.hypot(v[0],v[1],v[2])||1;return[v[0]/l,v[1]/l,v[2]/l];};
  const PIERS=[[-3.1,-5.369],[3.1,-5.369],[6.2,0],[3.1,5.369],[-3.1,5.369],[-6.2,0]];
  const OAK=[-10.74,6.2],OAKD=.6,RPA=12*OAKD,SWALE=[9.6,-7.4];
  const swaleD=(x,y)=>{const dx=x-SWALE[0],dy=y-SWALE[1],u=dx*Math.cos(.5)+dy*Math.sin(.5),v=-dx*Math.sin(.5)+dy*Math.cos(.5);return Math.hypot(u/2.9,v/1.5);};

  /* ---- paths: a ring round the Bower, the way in from the south, and three that lead off to the oak, the swale and the hedge ---- */
  const chaikin=(pts,n)=>{for(let q=0;q<n;q++){const o=[pts[0]];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];o.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75]);}o.push(pts[pts.length-1]);pts=o;}return pts;};
  const ringP=[];for(let i=0;i<=72;i++){const a=i*6.2832/72;ringP.push([Math.cos(a)*7.45,Math.sin(a)*7.45]);}
  const PATHS=[{p:ringP,w:1.9},{p:[[0,-8.3],[0,-11.5],[0,-RB+.06]],w:1.9},
    {p:chaikin([[-7.2,2],[-9.2,2.9],[-11.2,4.05],[-14.6,5]],2),w:1.3},
    {p:chaikin([[5.7,-4.8],[7.6,-6.2],[9.6,-7.4],[11.6,-8.6],[13.4,-7.6]],2),w:1.2},
    {p:chaikin([[3.75,6.45],[6.2,8.6],[8.6,10.6],[9.8,11.8]],2),w:1.3}];
  const segD=(x,y,a,b)=>{const dx=b[0]-a[0],dy=b[1]-a[1],L=dx*dx+dy*dy||1,u=clamp(((x-a[0])*dx+(y-a[1])*dy)/L,0,1);return Math.hypot(x-a[0]-dx*u,y-a[1]-dy*u);};
  const dPath=(x,y,skip)=>{let d=99;PATHS.forEach((pa,pi)=>{if(pi===skip)return;for(let i=0;i<pa.p.length-1;i++){const q=segD(x,y,pa.p[i],pa.p[i+1])-pa.w/2;if(q<d)d=q;}});return d;};
  const EDGE=[],GRAVEL=[],PLANK=[];
  PATHS.forEach((pa,pi)=>{[-1,1].forEach(sd=>{let run=[];for(let i=0;i<pa.p.length;i++){const a=pa.p[Math.max(0,i-1)],b=pa.p[Math.min(pa.p.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,
          x=pa.p[i][0]-dy/l*sd*pa.w/2,y=pa.p[i][1]+dx/l*sd*pa.w/2;
        if(dPath(x,y,pi)<0||Math.hypot(x,y)>RB-.03){if(run.length>1)EDGE.push(run);run=[];}else run.push([x,y]);}
      if(run.length>1)EDGE.push(run);});
    for(let i=0;i<pa.p.length-1;i++){const a=pa.p[i],b=pa.p[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]),nx=-(b[1]-a[1])/L,ny=(b[0]-a[0])/L;
      for(let q=0;q<L*pa.w*5;q++){const u=t(),o=(t()-.5)*pa.w*.86,x=a[0]+(b[0]-a[0])*u+nx*o,y=a[1]+(b[1]-a[1])*u+ny*o;if(Math.hypot(x,y)<RB-.1&&swaleD(x,y)>1)GRAVEL.push([x,y]);}
      if(pi===3)for(let u=0;u<1;u+=.22/L){const x=a[0]+(b[0]-a[0])*u,y=a[1]+(b[1]-a[1])*u;if(swaleD(x,y)<1.08)PLANK.push([x-nx*.62,y-ny*.62,x+nx*.62,y+ny*.62]);}}});

  /* ---- things above ground: one list, depth-sorted every frame ---- */
  const items=[];
  /* timber: every member is a prism with the model's own section (width by depth, in metres), framed without twist along its length.
     Drawn face by face, so a glulam arch reads as one solid beam with two faces, lit from the south-west. */
  const sub3=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],crs=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dot3=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const SUN=nrm([-.5,-.6,.62]);
  MD.m.forEach(m=>{const role=m[0],w=m[1]/1000,d=m[2]/1000,pts=m[3],n=pts.length,closed=Math.hypot(pts[0][0]-pts[n-1][0],pts[0][1]-pts[n-1][1],pts[0][2]-pts[n-1][2])<.06;
    const tan=i=>closed?nrm(sub3(pts[(i+1)%(n-1)],pts[(i-1+n-1)%(n-1)])):nrm(sub3(pts[Math.min(n-1,i+1)],pts[Math.max(0,i-1)]));
    const Bfix=role==='arch'?nrm(crs(sub3(pts[n-1],pts[0]),[0,0,1])):null;let N=null;const fr=[];
    for(let i=0;i<n;i++){const T=tan(i),p=pts[i];
      if(role==='arch')N=nrm(crs(T,Bfix));
      else{let ref=N;if(!ref||role==='crown'||closed){const rr=Math.hypot(p[0],p[1])||1;ref=role==='crown'?[0,0,1]:[p[0]/rr,p[1]/rr,.7];if(Math.abs(dot3(nrm(ref),T))>.93)ref=[0,0,1];}
        const dt=dot3(ref,T);N=nrm([ref[0]-T[0]*dt,ref[1]-T[1]*dt,ref[2]-T[2]*dt]);}
      const B=nrm(crs(T,N));fr.push({N,B,c:[[1,1],[1,-1],[-1,-1],[-1,1]].map(q=>[p[0]+N[0]*q[0]*d/2+B[0]*q[1]*w/2,p[1]+N[1]*q[0]*d/2+B[1]*q[1]*w/2,p[2]+N[2]*q[0]*d/2+B[2]*q[1]*w/2])});}
    const big=role==='arch'?2:role==='crown'||role==='ring'||role==='hoop'?1:0;
    for(let i=0;i<n-1;i++){const f0=fr[i],f1=fr[i+1];items.push({ty:0,a:f0.c,c:f1.c,N:nrm([f0.N[0]+f1.N[0],f0.N[1]+f1.N[1],f0.N[2]+f1.N[2]]),B:nrm([f0.B[0]+f1.B[0],f0.B[1]+f1.B[1],f0.B[2]+f1.B[2]]),big,mid:[(pts[i][0]+pts[i+1][0])/2,(pts[i][1]+pts[i+1][1])/2,(pts[i][2]+pts[i+1][2])/2],b:0});}});
  const ST=MD.s.map(s=>s[1]),dSt=p=>{let d=99;ST.forEach(s=>{const q=Math.hypot(p[0]-s[0],p[1]-s[1]);if(q<d)d=q;});return d;};
  const pierOf=(x,y)=>{let bi=0,bd=1e9;PIERS.forEach((pc,i)=>{const d=Math.hypot(x-pc[0],y-pc[1]);if(d<bd){bd=d;bi=i;}});return bi;};
  const GRW={"P1.wisteria":{"hi":[1.52,2.57,3.84,4.67,4.92,4.95,5.76,6.33,6.33,6.33],"fl":[0,0,0,0,15,43,98,173,206,279]},"P1.rose":{"hi":[1.48,2.81,3.59,3.59,4.2,4.5,4.5,4.5,4.5,4.5],"fl":[0,4,36,56,73,103,103,93,114,88]},"P1.star-jasmine":{"hi":[1.09,1.52,1.8,2.33,2.59,3.02,3.46,3.62,3.86,4.04],"fl":[0,6,19,45,88,116,145,181,211,249]},"P1.winter-clematis":{"hi":[0.71,1.32,1.81,2.38,2.89,3.05,3.4,3.6,3.78,4.01],"fl":[1,11,33,78,119,185,215,247,281,336]},"P2.rose":{"hi":[1.39,2.79,3.72,3.95,4.1,4.23,4.31,4.31,4.31,4.31],"fl":[0,18,38,93,110,120,109,114,113,113]},"P2.star-jasmine":{"hi":[1.09,1.52,1.77,2.25,2.56,2.87,3.3,3.62,3.8,4.02],"fl":[0,6,21,45,72,110,157,187,220,276]},"P2.winter-clematis":{"hi":[0.56,1.17,1.66,2.21,2.58,3.01,3.13,3.38,3.59,3.82],"fl":[0,11,34,80,102,151,193,254,266,288]},"P2.honeysuckle":{"hi":[0.96,1.91,3.16,3.98,4.67,4.91,4.91,5.08,6.02,6.37],"fl":[0,14,35,95,179,296,379,412,492,562]},"P3.akebia":{"hi":[1.1,1.41,1.88,2.41,2.99,3.43,3.8,4.03,4.31,4.42],"fl":[0,3,18,61,114,162,214,273,297,346]},"P3.honeysuckle":{"hi":[0.85,1.82,2.89,3.8,4.46,4.86,4.92,5.0,5.35,6.3],"fl":[0,15,75,162,270,321,423,525,593,728]},"P3.summer-clematis":{"hi":[2.12,2.64,2.74,2.64,2.59,2.56,2.47,2.55,2.51,2.45],"fl":[5,59,74,68,74,67,55,70,59,58]},"P3.evergreen-honeysuckle":{"hi":[0.64,0.8,1.51,2.3,2.89,3.48,3.85,4.31,4.4,4.7],"fl":[0,0,0,0,0,0,0,0,0,9]},"P4.hydrangea":{"hi":[0.48,0.7,1.1,1.57,2.3,2.75,3.3,3.6,3.86,4.19],"fl":[0,0,0,0,0,3,11,18,25,42]},"P4.evergreen-honeysuckle":{"hi":[0.44,0.6,1.4,2.13,2.69,3.48,3.89,4.27,4.64,4.85],"fl":[0,0,0,0,0,0,0,0,0,8]},"P4.ivy":{"hi":[0.44,0.6,1.4,2.17,2.75,3.48,3.89,4.27,4.69,4.86],"fl":[0,0,0,0,0,0,0,0,0,8]},"P4.akebia":{"hi":[0.64,0.8,1.58,2.37,2.97,3.43,3.91,4.33,4.67,4.86],"fl":[0,0,0,0,0,0,0,0,0,8]},"P5.evergreen-honeysuckle":{"hi":[0.44,0.6,1.42,2.16,2.75,3.43,3.7,4.16,4.34,4.68],"fl":[0,0,0,0,0,0,0,0,0,13]},"P5.ivy":{"hi":[0.44,0.6,1.4,2.17,2.75,3.48,3.89,4.27,4.67,4.86],"fl":[0,0,0,0,0,0,0,0,0,4]},"P5.akebia":{"hi":[0.44,0.6,1.4,2.13,2.69,3.48,3.89,4.27,4.64,4.85],"fl":[0,0,0,0,0,0,0,0,0,8]},"P5.evergreen-honeysuckle.2":{"hi":[0.64,0.8,1.49,2.29,2.85,3.44,3.83,4.31,4.67,4.84],"fl":[0,0,0,0,0,0,0,0,0,12]},"P6.japanese-wisteria":{"hi":[1.6,2.71,4.03,4.67,4.92,5.07,6.1,6.34,6.34,6.34],"fl":[0,0,0,3,33,117,234,372,474,603]},"P6.spring-clematis":{"hi":[1.13,1.74,2.37,2.89,3.59,3.94,4.36,4.67,4.87,4.9],"fl":[0,5,22,54,125,183,299,391,521,496]},"P6.trumpet-vine":{"hi":[0.56,1.17,1.64,2.21,2.57,3.09,3.56,3.77,3.98,4.3],"fl":[0,0,2,11,24,26,36,45,54,55]},"P6.vine":{"hi":[2.28,3.83,4.9,5.02,6.32,6.32,6.37,6.37,6.37,6.37],"fl":[0,0,0,13,46,114,160,222,341,441]}};
  const KP=[{wis:'P1.wisteria',rose:'P1.rose',eg:'P1.star-jasmine'},{wood:'P2.honeysuckle',rose:'P2.rose',eg:'P2.star-jasmine'},{wood:'P3.honeysuckle',clem:'P3.summer-clematis',eg:'P3.akebia'},{ivy:'P4.ivy',hyd:'P4.hydrangea'},{ivy:'P5.ivy',hyd:'P5.ivy'},{jwis:'P6.japanese-wisteria',vine:'P6.vine',eg:'P6.spring-clematis',camp:'P6.trumpet-vine'}],TOP=['P1.wisteria','P2.honeysuckle','P3.honeysuckle','P4.ivy','P5.ivy','P6.vine'];
  const GB=(pi,kd,z)=>{const h=GRW[(kd&&KP[pi][kd])||TOP[pi]].hi;if(z>h[9])return 9;let x=9,a=.2;for(let i=0;i<10;i++){if(h[i]>=z){x=i+(z<=a?0:(z-a)/(h[i]-a));break;}a=h[i];}return clamp((12*x-2)/111,0,.99);};
  const FF=(pi,kd)=>{const fl=GRW[KP[pi][kd]||TOP[pi]].fl,i=fl.findIndex(v=>v>0);return i<0?9:clamp((12*i+3)/111,0,.99);};
  // growth on the Bower: a woody stem up every cable, leaders along the timber, then leaf and flower by the plant that stands at that pier
  MD.c.forEach(c=>{const pi=pierOf(c[0][0],c[0][1]),woody=pi===0||pi===5;for(let i=0;i<c.length-1;i+=2){const ch=c.slice(i,i+3);items.push({ty:1,pts:ch,mid:ch[1]||ch[0],woody,ox:1.5,b:GB(pi,null,(ch[1]||ch[0])[2])});}});
  MD.m.forEach(m=>{const pts=m[3],role=m[0];
    if(role!=='arch'&&role!=='crown')for(let i=0;i<pts.length-1;i+=3){const ch=pts.slice(i,i+4);if(ch.length<2)break;const md=ch[ch.length>>1];if(md[2]<.2)continue;items.push({ty:1,pts:ch,mid:md,ox:2.4,b:GB(pierOf(md[0],md[1]),null,md[2])});}
    const dens=role==='arch'?.55:role==='crown'?.8:1.5;
    for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]),n=L*dens*(a[2]>4.6?.6:1);
      for(let q=0;q<n;q++){if(n-q<1&&t()>n-q)continue;const u=t(),p=[a[0]+(b[0]-a[0])*u+(t()-.5)*.34,a[1]+(b[1]-a[1])*u+(t()-.5)*.34,a[2]+(b[2]-a[2])*u+(t()-.5)*.28];
        if(p[2]<.2)continue;const pi=pierOf(p[0],p[1]),z=p[2],rn=t();let kd;
        if(pi===0)kd=z>3?'wis':rn<.5?'rose':'eg';
        else if(pi===1)kd=z>3.4?'wood':rn<.5?'rose':'eg';
        else if(pi===2)kd=z>2.2?'wood':rn<.5?'clem':'eg';
        else if(pi===3)kd=z<3.6&&rn<.55?'ivy':'hyd';
        else if(pi===4)kd=z<3.8&&rn<.7?'ivy':'hyd';
        else kd=z>3?(rn<.5?'jwis':'vine'):(rn<.4?'eg':'camp');
        const row=kd==='eg'||kd==='ivy'?2:kd==='vine'||kd==='hyd'?3:0,fr=t();let fl=0;
        if(z>2.3){if(kd==='wis'&&fr<.13)fl=1;else if(kd==='jwis'&&fr<.15)fl=2;else if(kd==='wood'&&fr<.14)fl=3;else if(kd==='hyd'&&fr<.2)fl=4;}
        const droop=(kd==='wis'||kd==='jwis'||kd==='wood')&&z>2.2&&t()<.2?5+t()*8:0;
        items.push({ty:2,p,mid:p,row,an:t()*6.283,sz:(row===2?.75:row===3?.9:.7)+t()*.6,fl,droop,ff:FF(pi,kd),b:GB(pi,kd,z)+t()*.03});}}});

  /* trees: a trunk and limbs drawn as tapered solids that fork cleanly, carrying a crown of foliage masses.
     Each mass is an opaque scalloped clump, shaded on its lower right, so the tree has one outline and a body.
     A planted tree is a whole small tree that grows about its base. */
  const SHADOW=[],TREES=[],NV=8;
  function tree(x0,y0,Ht,o){const gr={x0,y0,s:1,b0:o.b0,b1:o.b1,s0:o.s0||1,sr:Ht*.36};TREES.push(gr);const rr=rng(o.seed);
    const push=it=>{it.gr=gr;it.b=o.b0;items.push(it);};
    const clump=(c,R)=>push({ty:4,p:c,mid:c,R,v:(rr()*NV)|0,light:o.birch?1:0});
    function br(p,dir,len,w,d){const n=Math.max(3,Math.round(len/.35)),pts=[p.slice()];
      for(let i=0;i<n;i++){dir=nrm([dir[0]+(rr()-.5)*o.wig,dir[1]+(rr()-.5)*o.wig,dir[2]+(rr()-.5)*o.wig*.5+(d>0?o.lift:0)]);p=[p[0]+dir[0]*len/n,p[1]+dir[1]*len/n,p[2]+dir[2]*len/n];pts.push(p.slice());}
      const w1=w*(d===0?.74:.62),bk=[];for(let i=0;i<n*2;i++)bk.push([rr(),rr()-.5,rr()]);
      push({ty:3,pts,w0:w,w1,mid:pts[n>>1],bk,birch:o.birch});
      if(d<o.depth){const kids=d===0?o.fork:2+(rr()<o.extra?1:0),a0=rr()*6.283;
        for(let q=0;q<kids;q++){const az=a0+q*6.283/kids+(rr()-.5)*.7,sp=o.spread*(d===0?1.12:1)*(.75+rr()*.5);
          br(p,nrm([dir[0]*Math.cos(sp)+Math.cos(az)*Math.sin(sp),dir[1]*Math.cos(sp)+Math.sin(az)*Math.sin(sp),dir[2]*Math.cos(sp)+.12]),len*(o.len+rr()*.14),w1*(kids>2?.64:.72),d+1);}
        if(d>=o.depth-2)clump([p[0],p[1],p[2]+o.R*.35],o.R*(.85+rr()*.4));}
      else{clump([p[0]+dir[0]*o.R*.45,p[1]+dir[1]*o.R*.45,p[2]+dir[2]*o.R*.45],o.R*(.7+rr()*.5));
        if(o.droop)for(let q=0;q<2;q++){const a=rr()*6.283,L=.5+rr()*.7,tp=[p[0]+Math.cos(a)*.35,p[1]+Math.sin(a)*.35,p[2]-L];push({ty:3,pts:[p.slice(),[p[0]+Math.cos(a)*.25,p[1]+Math.sin(a)*.25,p[2]-L*.4],tp],w0:.01,w1:.01,mid:tp,bk:[]});clump(tp,o.R*.5);}}}
    const w0=o.dia||Ht/o.thick;br([x0,y0,0],[0,0,1],Ht*o.bole,w0,0);
    if(o.flare)for(let q=0;q<6;q++){const a=q*1.047+rr()*.5;push({ty:3,pts:[[x0+Math.cos(a)*w0*.3,y0+Math.sin(a)*w0*.3,.55],[x0+Math.cos(a)*w0*.8,y0+Math.sin(a)*w0*.8,.16],[x0+Math.cos(a)*w0*1.7,y0+Math.sin(a)*w0*1.7,0]],w0:w0*.5,w1:w0*.16,mid:[x0+Math.cos(a)*w0*.6,y0+Math.sin(a)*w0*.6,.2],bk:[]});}
    const sr=gr.sr,sh=[];for(let v=-sr*.75;v<=sr*.75;v+=.27){const hf=sr*Math.sqrt(Math.max(0,1-Math.pow(v/(sr*.75),2)))*(.85+t()*.15);sh.push([sr*.25-hf,sr*.3+v,sr*.25+hf,sr*.3+v]);}
    SHADOW.push({sh,gr});}
  tree(OAK[0],OAK[1],9,{seed:11,depth:4,fork:4,extra:.55,spread:.8,wig:.3,lift:.03,len:.6,bole:.29,R:1.02,dia:OAKD,flare:1,b0:0,b1:0});
  tree(10.4,-3.2,6,{seed:23,depth:3,fork:3,extra:.5,spread:.6,wig:.24,lift:.06,len:.62,bole:.3,R:.85,thick:24,s0:.42,b0:.05,b1:.96});
  tree(7.2,-10.8,6.4,{seed:37,depth:3,fork:3,extra:.3,spread:.36,wig:.2,lift:.1,len:.7,bole:.36,R:.55,thick:40,birch:1,droop:1,s0:.4,b0:.2,b1:1});
  tree(8.3,-10,5.2,{seed:41,depth:3,fork:3,extra:.3,spread:.36,wig:.2,lift:.1,len:.7,bole:.36,R:.5,thick:40,birch:1,droop:1,s0:.4,b0:.3,b1:1});
  tree(-4.2,-12.4,3.6,{seed:53,depth:3,fork:3,extra:.6,spread:.85,wig:.4,lift:.02,len:.6,bole:.3,R:.6,thick:18,s0:.45,b0:.3,b1:1});
  // a clipped hedge on the north-east edge, with a gap where the path goes through
  {const hr=rng(77);for(let q=0;q<64;q++){const a=.25+q*.02;if(Math.abs(a-.876)<.075)continue;for(let z=0;z<2;z++){const rad=14+(z?.22:-.22)+(hr()-.5)*.12,p=[Math.cos(a)*rad,Math.sin(a)*rad,.42+z*.4+hr()*.14];items.push({ty:4,p,mid:p,R:.33+hr()*.08,v:(hr()*NV)|0,light:0,b:0});}}}
  // a bench under the oak, beside the path
  items.push({ty:7,mid:[OAK[0],OAK[1]-1.4,.4],b:0});
  const BENCH=(()=>{const x0=OAK[0]-.8,x1=OAK[0]+.8,y0=OAK[1]-1.62,y1=OAK[1]-1.17;return{seat:[[x0,y0,.45],[x1,y0,.45],[x1,y1,.45],[x0,y1,.45]],lines:[[[x0,y1,.45],[x0,y1,.92]],[[x1,y1,.45],[x1,y1,.92]],[[x0,y1,.92],[x1,y1,.92]],[[x0,y1,.72],[x1,y1,.72]],[[x0+.1,y0+.05,0],[x0+.1,y0+.05,.45]],[[x1-.1,y0+.05,0],[x1-.1,y0+.05,.45]],[[x0+.1,y1,0],[x0+.1,y1,.45]],[[x1-.1,y1,0],[x1-.1,y1,.45]]]};})();

  /* ---- meadow: long grass everywhere that is not floor, path, or water ---- */
  const tufts=[];
  for(let q=0;q<3600;q++){const a=t()*6.283,rr=Math.sqrt(t())*(RB-.25),x=Math.cos(a)*rr,y=Math.sin(a)*rr;
    if(rr<8.5||dPath(x,y)<.12)continue;if(Math.hypot(x-OAK[0],y-OAK[1])<1.3)continue;
    const sw=swaleD(x,y);if(sw<.75)continue;const wet=sw<1.5;
    tufts.push({x,y,h:(wet?.55:.2)+t()*(wet?.6:.42),le:(t()-.5)*.3,n:2+(t()*3|0),b:.02+t()*.3+(wet?.08:0),head:t()<.12?1+(t()*3|0):0,hb:.2+t()*.5});}

  /* ---- below ground, seen only on the cut edge: roots near the rim, soil, horizons, water, bedrock ---- */
  const segs=[];
  function roots(x0,y0,spec,o){let budget=o.budget,tmax=1;const mine=[];
    function grow(p,az,pitch,w,type,gen,tm){const decay=type==='lat'?(o.dl||.985):type==='sink'?(o.ds||.965):.94;
      while(w>.3&&budget-->0){pitch+=(r()-.5)*.35+((type==='lat'?.08:1.35)-pitch)*.07;az+=(r()-.5)*(type==='lat'?.3:.6);
        const n=[p[0]+Math.cos(az)*Math.cos(pitch)*.17,p[1]+Math.sin(az)*Math.cos(pitch)*.17,p[2]-Math.sin(pitch)*.17];
        if(n[2]>-.1){n[2]=-.1;pitch=Math.abs(pitch)+.05;}
        const rr=Math.hypot(n[0],n[1]);if(rr>RB-.05||n[2]<-DEP+.12)break;
        if(rr>RB-3.2)mine.push([p[0],p[1],p[2],n[0],n[1],n[2],Math.max(.45,w),clamp(.3+w*.14,0,.85)*clamp(1+n[2]/(DEP*1.12),.2,1)*clamp((rr-(RB-3.2))/1.6,.15,1),tm]);
        tm++;if(tm>tmax)tmax=tm;p=n;w*=decay;
        if(gen<5&&r()<(type==='fine'?.05:type==='sink'?.07:.1)){const cw=w*(.45+r()*.25);grow(p,az+(r()<.5?-1:1)*(.5+r()*.9),type==='lat'&&r()<.6?1.1+r()*.4:pitch+(r()-.5)*.8,cw,cw<1.1?'fine':(type==='lat'&&r()<.3?'lat':'sink'),gen+1,tm);}}}
    spec.forEach(q=>grow([x0,y0,-.1],q[0],q[2]==='lat'?.1:1.3,q[1],q[2],0,0));
    mine.forEach(s=>{s[8]=o.b0+(o.b1-o.b0)*s[8]/tmax;segs.push(s);});}
  roots(OAK[0],OAK[1],[[1.9,12,'lat'],[2.4,11,'lat'],[2.9,12,'lat'],[3.4,11,'lat'],[3.9,10,'lat'],[1.3,9,'lat'],[4.5,9,'lat'],[2.6,10,'sink'],[3.3,10,'sink']],{budget:9000,dl:.992,ds:.98,b0:0,b1:0});
  roots(10.4,-3.2,[[-.3,6,'lat'],[.2,5.5,'lat'],[-.9,5.5,'lat'],[.7,5,'lat'],[0,5,'sink']],{budget:2600,dl:.99,b0:.05,b1:.98});
  roots(7.6,-10.5,[[-.95,5,'lat'],[-.5,4.5,'lat'],[-1.4,4.5,'lat'],[-.9,4.5,'sink']],{budget:1800,dl:.99,b0:.24,b1:1});
  roots(-4.2,-12.4,[[-1.9,4.5,'lat'],[-1.4,4,'lat'],[-2.4,4,'lat'],[-1.9,4,'sink']],{budget:1500,dl:.99,b0:.3,b1:1});
  const stip=[];for(let q=0;q<3400;q++){const d=Math.pow(t(),1.3)*(DEP-.55);stip.push([t()*6.283,-d,d<.45?0:d<1.5?1:2]);}
  const wetl=[];for(let q=0;q<420;q++)wetl.push([t()*6.283,-2.72-t()*.36,.25+t()*.5]);
  const hair=[];for(let q=0;q<620;q++)hair.push([t()*6.283,.12+Math.pow(t(),2)*.9,t()*6,.02+t()*.3]);
  const stone=[];for(let q=0;q<70;q++)stone.push([t()*6.283,-.6-t()*1.9,.05+t()*.1,t()*6]);

  /* ---- people ---- */
  const WALK=[{rad:3.1,v:1.05,a0:.4,h:1.68,o:{skirt:1,bun:1}},{rad:7.45,v:-1.15,a0:2.2,h:1.76,o:{coat:1}},{rad:7.45,v:-1.15,a0:2.33,h:1.16,o:{head:1.28}}];

  /* leaf sprays and foliage arcs are stamped from one small pre-drawn atlas: thousands a frame would be too slow as paths */
  const AQ=k*1.5,CELL=24,atlas=document.createElement('canvas');atlas.width=Math.ceil(12*CELL*AQ);atlas.height=Math.ceil(5*CELL*AQ);
  {const x=atlas.getContext('2d');x.lineCap='round';const el2=(cx,cy,rx,ry,an,al)=>{x.beginPath();x.ellipse(cx,cy,rx,ry,an,0,7);x.fillStyle=AC;x.fill();x.strokeStyle=ink(al);x.lineWidth=.5;x.stroke();};
    for(let i=0;i<12;i++){const an0=i*.5236,at=row=>{AC=row===2?'#86ab7f':'#b7d39a';x.setTransform(AQ,0,0,AQ,(i+.5)*CELL*AQ,(row+.5)*CELL*AQ);};
      at(0);for(let z=0;z<3;z++){const an=an0+z*2.1;el2(Math.cos(an)*3.6,Math.sin(an)*3.6,5,2.1,an,.62);}
      at(1);x.beginPath();x.arc(0,0,6,an0,an0+1.6+(i%4)*.7);x.strokeStyle=ink(.4);x.lineWidth=.7;x.stroke();
      at(2);for(let z=0;z<6;z++){const an=an0+z*1.05+(z%2)*.3,d=2.2+(z%3)*1.5;el2(Math.cos(an)*d,Math.sin(an)*d,2.7,1.6,an+.6,.78);}
      at(3);for(let z=0;z<2;z++){const an=an0+z*2.6,cx=Math.cos(an)*4,cy=Math.sin(an)*4;el2(cx,cy,5.2,4.3,an,.66);x.beginPath();x.moveTo(cx-Math.cos(an)*4,cy-Math.sin(an)*4);x.lineTo(cx+Math.cos(an)*4,cy+Math.sin(an)*4);x.strokeStyle=ink(.35);x.lineWidth=.35;x.stroke();}
      at(4);for(let z=0;z<5;z++){const an=an0+z*1.257;el2(Math.cos(an)*4.6,Math.sin(an)*4.6,4.6,2.2,an+.3,.58);}}}
  /* foliage masses: eight dense and eight light clumps, drawn once. Scalloped outline, heavier and hatched on the lower right. */
  const R0=26,CC=72,catlas=document.createElement('canvas');catlas.width=Math.ceil(NV*CC*AQ);catlas.height=Math.ceil(2*CC*AQ);
  {const x=catlas.getContext('2d');x.lineCap='round';x.lineJoin='round';const cr=rng(4242);
    for(let row=0;row<2;row++)for(let v=0;v<NV;v++){x.setTransform(AQ,0,0,AQ,(v+.5)*CC*AQ,(row+.5)*CC*AQ);
      const n=row?8+(cr()*3|0):12+(cr()*4|0),a0=cr()*6.283,pts=[];
      for(let i=0;i<n;i++){const an=a0+(i+(cr()-.5)*.5)*6.283/n,rad=R0*(.8+cr()*.26);pts.push([Math.cos(an)*rad,Math.sin(an)*rad*.9]);}
      const lobe=i=>{const a=pts[i],b=pts[(i+1)%n],mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,l=Math.hypot(mx,my)||1;x.quadraticCurveTo(mx+mx/l*R0*.24,my+my/l*R0*.24,b[0],b[1]);return Math.atan2(my,mx);};
      const outline=()=>{x.beginPath();x.moveTo(pts[0][0],pts[0][1]);for(let i=0;i<n;i++)lobe(i);x.closePath();};
      outline();x.fillStyle='#d3e3c1';x.fill();x.save();outline();x.clip();
      if(!row){x.beginPath();for(let d=R0*.3;d<R0*2;d+=3.1){x.moveTo(d*.707-R0,d*.707+R0);x.lineTo(d*.707+R0,d*.707-R0);}x.strokeStyle=ink(.3);x.lineWidth=.45;x.stroke();}
      for(let q=0,m=row?5:10;q<m;q++){const an=cr()*6.283,rad=R0*(.12+cr()*.6),cx=Math.cos(an)*rad,cy=Math.sin(an)*rad,ra=R0*(.17+cr()*.12),s0=Math.PI*(.95+cr()*.3);
        if(!row){x.beginPath();x.arc(cx,cy,ra,0,7);x.fillStyle='#deebd0';x.fill();}
        x.beginPath();x.arc(cx,cy,ra,s0,s0+Math.PI*(.8+cr()*.4));x.strokeStyle=ink(row?.5:.6);x.lineWidth=.6;x.stroke();
        if(!row){x.beginPath();x.arc(cx,cy,ra,.1,1.5);x.strokeStyle=ink(.5);x.lineWidth=.9;x.stroke();}}
      x.restore();outline();x.strokeStyle=ink(row?.6:.72);x.lineWidth=row?.7:.8;x.stroke();
      for(let i=0;i<n;i++){x.beginPath();x.moveTo(pts[i][0],pts[i][1]);const an=lobe(i);if(an>-.2&&an<1.9){x.strokeStyle=ink(.88);x.lineWidth=row?1:1.35;x.stroke();}}}}
  // Each bloom has a fixed screen-space shape. Paint those four original
  // silhouettes once and reuse them as the camera turns.
  const flowers = ['', '#9a7fcb', '#b9a3e3', '#e6a93c', '#e4edd6'].map((colour, type) => {
    if (!type) return null;
    const resolution = Math.max(2, Math.ceil(k * 2));
    const sprite = document.createElement('canvas');
    sprite.width = 16 * resolution;
    sprite.height = 48 * resolution;
    const pen = sprite.getContext('2d');
    pen.setTransform(resolution, 0, 0, resolution, 8 * resolution, 10 * resolution);
    pen.lineCap = 'round';
    pen.lineJoin = 'round';
    function stem(x, y, ex, ey, alpha, width) {
      pen.beginPath();
      pen.moveTo(x, y);
      pen.lineTo(ex, ey);
      pen.strokeStyle = ink(alpha);
      pen.lineWidth = width;
      pen.stroke();
    }
    function petal(x, y, radius) {
      pen.beginPath();
      pen.arc(x, y, radius, 0, 7);
      pen.fillStyle = colour;
      pen.fill();
      pen.strokeStyle = ink(.7);
      pen.lineWidth = .45;
      pen.stroke();
    }
    if (type <= 2) {
      const count = type === 2 ? 13 : 6;
      stem(0, 0, 0, count * 2.5, .5, .4);
      for (let i = 0; i < count; i++) petal(i % 2 ? 1.2 : -1.2, 4 + i * 2.4, 1.5 - i * .07);
    } else if (type === 3) {
      for (let i = -2; i <= 2; i++) {
        const angle = -1.57 + i * .45;
        const x = Math.cos(angle) * 5, y = -3 + Math.sin(angle) * 5;
        stem(0, -3, x, y, .6, .45);
        petal(x, y, .9);
      }
    } else {
      for (let i = 0; i < 7; i++) petal(Math.cos(i * .9) * 4.2, -4 + Math.sin(i * .9) * 2, 1.3);
    }
    return sprite;
  });
  const stamp=(row,i,x,y,d)=>g.drawImage(atlas,i*CELL*AQ,row*CELL*AQ,CELL*AQ,CELL*AQ,x-d/2,y-d/2,d,d);
  const line=(pts,w,al,close)=>{g.beginPath();pts.forEach(p=>g.lineTo(p[0],p[1]));if(close)g.closePath();g.strokeStyle=ink(al);g.lineWidth=w;g.stroke();};
  const ring=(cx,cy,rx,ry,rot,z,n)=>{const o=[];for(let i=0;i<=(n||40);i++){const a=i*6.2832/(n||40),x=Math.cos(a)*rx,y=Math.sin(a)*ry;o.push(P(cx+x*Math.cos(rot)-y*Math.sin(rot),cy+x*Math.sin(rot)+y*Math.cos(rot),z||0));}return o;};
  const MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
  let shown='';

  function draw(f,al,sec,az){
    ca=Math.cos(az);sa=Math.sin(az);const VW=[-CPH*sa,-CPH*ca,SPH];
    TREES.forEach(gr=>{const u=gr.b1>gr.b0?clamp((f-gr.b0)/(gr.b1-gr.b0),0,1):1;gr.s=gr.s0+(1-gr.s0)*u*u*(3-2*u);});
    const GP=(it,p)=>{const gr=it.gr;return gr?P(gr.x0+(p[0]-gr.x0)*gr.s,gr.y0+(p[1]-gr.y0)*gr.s,p[2]*gr.s):P(p[0],p[1],p[2]);};
    g.fillStyle=PAPER;g.fillRect(0,0,W,H);
    const BY=CY0+DEP*CPH*SC,RX=RB*SC,RY=RX*SPH;
    /* the cut edge of the plug */
    const front=a=>Math.cos(a)*sa+Math.sin(a)*ca<0,F=(a,z)=>P(Math.cos(a)*RB,Math.sin(a)*RB,z);
    // Submit the cut-face stipple once per pencil tone.
    [.36, .26, .17].forEach((alpha, layer) => {
      g.beginPath();
      g.fillStyle = ink(alpha);
      for (const mark of stip) {
        if (mark[2] !== layer || !front(mark[0])) continue;
        const p = F(mark[0], mark[1]);
        g.rect(p[0], p[1], 1.15, 1.15);
      }
      g.fill();
    });
    const band=(z,wob,dash,w,a)=>{g.setLineDash(dash);g.beginPath();let pen=false;for(let i=0;i<=240;i++){const an=i*6.2832/240;if(!front(an)){pen=false;continue;}const p=F(an,z+wob*Math.sin(an*9+z));pen?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);pen=true;}g.strokeStyle=ink(a);g.lineWidth=w;g.stroke();g.setLineDash([]);};
    band(-.45,.05,[12,7],.6,.24);band(-1.5,.07,[12,7],.6,.22);band(-2.62,.02,[11,6],.9,.55);
    g.beginPath();wetl.forEach(s=>{if(!front(s[0])||!front(s[0]+s[2]/RB))return;const p=F(s[0],s[1]),q=F(s[0]+s[2]/RB,s[1]);g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);});g.strokeStyle=ink(.22);g.lineWidth=.5;g.stroke();
    g.beginPath();for(let row=0;row<2;row++)for(let i=0;i<84;i++){const a0=(i+(row?.5:0))*6.2832/84,a1=a0+6.2832/84*.9;if(!front(a0)||!front(a1))continue;const z0=-3.1-row*.25,q=[F(a0,z0),F(a1,z0-.02),F(a1,z0-.23),F(a0,z0-.21)];g.moveTo(q[0][0],q[0][1]);q.forEach(p=>g.lineTo(p[0],p[1]));g.closePath();}g.strokeStyle=ink(.3);g.lineWidth=.6;g.stroke();
    stone.forEach(s=>{if(!front(s[0]))return;const p=F(s[0],s[1]);g.beginPath();g.ellipse(p[0],p[1],s[2]*SC*1.3,s[2]*SC*.8,s[3],0,7);g.fillStyle=PAPER;g.fill();g.strokeStyle=ink(.4);g.lineWidth=.6;g.stroke();});
    // grass roots hanging from the turf, then the tree roots that reach the edge
    g.beginPath();hair.forEach(h=>{if(!front(h[0])||h[3]>f)return;for(let q=0;q<=4;q++){const p=F(h[0]+.004*Math.sin(h[2]+q*1.7),-.04-h[1]*q/4);q?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);}});g.strokeStyle=ink(.34);g.lineWidth=.5;g.stroke();
    {const B={};for(let i=0;i<segs.length;i++){const s=segs[i];if(s[8]>f||s[0]*sa+s[1]*ca>1.5)continue;const kq=(s[6]<1?0:s[6]<2.2?1:s[6]<4.5?2:s[6]<7?3:4)*4+Math.min(3,(s[7]*5)|0);(B[kq]=B[kq]||new Path2D());
        B[kq].moveTo(CX+SC*(s[0]*ca-s[1]*sa),CY0-SC*(s[2]*CPH+(s[0]*sa+s[1]*ca)*SPH));B[kq].lineTo(CX+SC*(s[3]*ca-s[4]*sa),CY0-SC*(s[5]*CPH+(s[3]*sa+s[4]*ca)*SPH));}
      g.save();g.beginPath();g.rect(CX-RX,CY0,2*RX,BY-CY0+RY+2);g.ellipse(CX,CY0,RX,RY,0,0,2*Math.PI);g.clip('evenodd');
      for(const kq in B){g.strokeStyle=ink((.14+(kq&3)*.22)*(.75+.25*al));g.lineWidth=[.6,1.4,3,5.4,8.5][kq>>2];g.stroke(B[kq]);}
      g.restore();}
    {const an=Math.atan2(-ca,-sa),p=F(an+.5,-2.62);g.beginPath();g.moveTo(p[0]-7,p[1]-12);g.lineTo(p[0]+7,p[1]-12);g.lineTo(p[0],p[1]-2);g.closePath();g.fillStyle=PAPER;g.fill();g.strokeStyle=ink(.7);g.lineWidth=.9;g.stroke();line([[p[0]-5,p[1]+3],[p[0]+5,p[1]+3]],.7,.6);line([[p[0]-3,p[1]+6],[p[0]+3,p[1]+6]],.7,.6);}
    // outline of the plug, and the ground itself: solid paper, so nothing shows through it
    line([[CX-RX,CY0],[CX-RX,BY]],1.4,.9);line([[CX+RX,CY0],[CX+RX,BY]],1.4,.9);
    g.beginPath();g.ellipse(CX,BY,RX,RY,0,0,Math.PI);g.strokeStyle=ink(.9);g.lineWidth=1.4;g.stroke();
    g.beginPath();g.ellipse(CX,CY0,RX,RY,0,0,2*Math.PI);g.fillStyle=PAPER;g.fill();
    g.beginPath();g.ellipse(CX,CY0,RX,RY,0,Math.PI,2*Math.PI);g.strokeStyle=ink(.55);g.lineWidth=1;g.stroke();
    g.beginPath();g.ellipse(CX,CY0,RX,RY,0,0,Math.PI);g.strokeStyle=ink(.9);g.lineWidth=1.7;g.stroke();
    /* marks on the ground: shade under the trees, paths, floor, beds, swale */
    SHADOW.forEach(s=>{const gr=s.gr;if(f<gr.b0)return;g.beginPath();s.sh.forEach(q=>{if(Math.hypot(gr.x0+q[0]*gr.s,gr.y0+q[1]*gr.s)>RB-.1||Math.hypot(gr.x0+q[2]*gr.s,gr.y0+q[3]*gr.s)>RB-.1)return;const p=P(gr.x0+q[0]*gr.s,gr.y0+q[1]*gr.s,0),p2=P(gr.x0+q[2]*gr.s,gr.y0+q[3]*gr.s,0);g.moveTo(p[0],p[1]);g.lineTo(p2[0],p2[1]);});g.strokeStyle=ink(.2);g.lineWidth=.6;g.stroke();});
    {g.setLineDash([7,5]);g.beginPath();let pen=false;for(let i=0;i<=120;i++){const a=i*6.2832/120,x=OAK[0]+Math.cos(a)*RPA,y=OAK[1]+Math.sin(a)*RPA;if(Math.hypot(x,y)>RB-.05){pen=false;continue;}const p=P(x,y,0);pen?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);pen=true;}g.strokeStyle=ink(.6);g.lineWidth=.9;g.stroke();g.setLineDash([]);}
    g.beginPath();
    g.fillStyle = ink(.3);
    for (const mark of GRAVEL) {
      const p = P(mark[0], mark[1], 0);
      g.rect(p[0], p[1], 1, 1);
    }
    g.fill();
    EDGE.forEach(run=>line(run.map(q=>P(q[0],q[1],0)),.8,.6));
    g.beginPath();PLANK.forEach(q=>{const p=P(q[0],q[1],.12),p2=P(q[2],q[3],.12);g.moveTo(p[0],p[1]);g.lineTo(p2[0],p2[1]);});g.strokeStyle=ink(.85);g.lineWidth=1.5;g.stroke();
    line(ring(0,0,5.5,5.5,0,0,60),.9,.5);
    for(let d=0;d<360;d+=15){const a=d*Math.PI/180;line([P(Math.cos(a)*1.2,Math.sin(a)*1.2,0),P(Math.cos(a)*5.5,Math.sin(a)*5.5,0)],.5,.1);}
    [2.6,4].forEach(rr=>line(ring(0,0,rr,rr,0,0,48),.5,.09));
    PIERS.forEach(pc=>{g.setLineDash([5,5]);line(ring(pc[0]*.9,pc[1]*.9,1.25,1.25,0,0,28),.8,.5);g.setLineDash([]);
      const lo=ring(pc[0],pc[1],.62,.62,0,.06,6),hi=ring(pc[0],pc[1],.62,.62,0,.2,6);line(lo,1,.9);for(let q=0;q<6;q++)line([lo[q],hi[q]],q%2?1:2.4,.9);
      g.beginPath();hi.forEach(p=>g.lineTo(p[0],p[1]));g.closePath();g.fillStyle=PAPER;g.fill();g.strokeStyle=ink(.92);g.lineWidth=1.5;g.stroke();});
    ST.forEach(s=>{const p=P(s[0],s[1],0);g.fillStyle=ink(.85);g.beginPath();g.arc(p[0],p[1],1.6,0,7);g.fill();});
    line(ring(SWALE[0],SWALE[1],2.9,1.5,.5,0,36),.8,.55);line(ring(SWALE[0],SWALE[1],2,.95,.5,0,30),.9,.7);
    for(let q=1;q<4;q++){const o=[];for(let i=-6;i<=6;i++){const u=i/6*(1.9-q*.35),v=-.5+q*.32+.05*Math.sin(i+q);o.push(P(SWALE[0]+u*Math.cos(.5)-v*Math.sin(.5),SWALE[1]+u*Math.sin(.5)+v*Math.cos(.5),0));}line(o,.5,.35);}
    {const c=[-11.6,-8.4],a=P(c[0],c[1]-.9,0),b=P(c[0],c[1]+1.1,0),l=P(c[0]-.35,c[1]+.45,0),rr=P(c[0]+.35,c[1]+.45,0),n=P(c[0],c[1]+1.75,0);g.beginPath();ring(c[0],c[1],1,1,0,0,24).forEach(p=>g.lineTo(p[0],p[1]));g.fillStyle=PAPER;g.fill();line(ring(c[0],c[1],.9,.9,0,0,24),.7,.6);line([a,b],1.1,.85);line([l,b,rr],1.1,.85);
      g.font='500 15px Safiro,Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle=ink(.85);g.fillText('N',n[0],n[1]);}
    /* meadow, behind then in front of everything standing */
    const grass=back=>{[0,1].forEach(tall=>{g.beginPath();tufts.forEach(tf=>{if(tf.b>f||(tf.h>.5?1:0)!==tall)return;const yr=tf.x*sa+tf.y*ca;if((yr>0)!==back)return;const p=P(tf.x,tf.y,0),hh=tf.h*SC*CPH*clamp((f-tf.b)*6,0,1);
          for(let q=0;q<tf.n;q++){const lx=(tf.le+(q-1)*.07)*SC;g.moveTo(p[0]+q*1.3,p[1]);g.quadraticCurveTo(p[0]+q*1.3+lx*.3,p[1]-hh*.6,p[0]+q*1.3+lx,p[1]-hh*(1-.12*q));}});g.strokeStyle=ink((tall?.5:.38)*(.4+.6*al));g.lineWidth=.55;g.stroke();});
      tufts.forEach(tf=>{if(!tf.head||tf.hb>f)return;const yr=tf.x*sa+tf.y*ca;if((yr>0)!==back)return;const p=P(tf.x,tf.y,0),hh=(tf.h+.25)*SC*CPH,x=p[0],y=p[1]-hh;line([[p[0],p[1]],[x,y]],.6,.6*al);
        if(tf.head===1){
          g.beginPath();
          for(let z=0;z<8;z++){
            g.moveTo(x,y);
            g.lineTo(x+Math.cos(z*.785)*3.2,y+Math.sin(z*.785)*3.2);
          }
          g.strokeStyle=ink(.6*al);g.lineWidth=.5;g.stroke();
        }else if(tf.head===2){g.beginPath();g.arc(x,y,2.2,0,7);g.fillStyle=PAPER;g.fill();g.strokeStyle=ink(.7*al);g.lineWidth=.5;g.stroke();}
        else for(let z=0;z<4;z++){g.beginPath();g.ellipse(x+(z%2?1.4:-1.4),y+z*2.2,1.3,1.8,0,0,7);g.fillStyle=PAPER;g.fill();g.strokeStyle=ink(.7*al);g.lineWidth=.5;g.stroke();}});};
    grass(true);
    const L=[];for(let i=0;i<items.length;i++){const it=items[i];if(it.b>f)continue;const gr=it.gr;it.k=gr?key(gr.x0+(it.mid[0]-gr.x0)*gr.s,gr.y0+(it.mid[1]-gr.y0)*gr.s,it.mid[2]*gr.s):key(it.mid[0],it.mid[1],it.mid[2]);L.push(it);}
    WALK.forEach(w=>{const d=sec*w.v,th=w.a0+d/w.rad,x=Math.cos(th)*w.rad,y=Math.sin(th)*w.rad,p=P(x,y,0),p2=P(Math.cos(th+.02*Math.sign(w.v))*w.rad,Math.sin(th+.02*Math.sign(w.v))*w.rad,0);
      L.push({ty:5,k:key(x,y,.8),x:p[0],y:p[1],h:w.h*SC*CPH*1.06,dir:p2[0]>=p[0]?1:-1,ph:6.283*Math.abs(d)*SC/(.8*w.h*SC),o:w.o,b:0});});
    L.sort((p,q)=>q.k-p.k);
    const quad=(p,q,r2,s2)=>{g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.lineTo(r2[0],r2[1]);g.lineTo(s2[0],s2[1]);g.closePath();};
    const seg=(p,q,w,a)=>{g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.strokeStyle=ink(a);g.lineWidth=w;g.stroke();};
    for(let i=0;i<L.length;i++){const it=L[i];g.globalAlpha=it.gr?1:it.b>0?al:1;
      if(it.ty===0){ // one length of timber: the two faces turned to the eye, their outer edges firm and the arris between them light
        const sN=dot3(it.N,VW)>=0?1:-1,sB=dot3(it.B,VW)>=0?1:-1,ci=(n,b)=>n>0?(b>0?0:1):(b>0?3:2),ia=ci(sN,sB),i1=ci(sN,-sB),i2=ci(-sN,sB);
        const A0=P(it.a[ia][0],it.a[ia][1],it.a[ia][2]),A1=P(it.c[ia][0],it.c[ia][1],it.c[ia][2]),S0=P(it.a[i1][0],it.a[i1][1],it.a[i1][2]),S1=P(it.c[i1][0],it.c[i1][1],it.c[i1][2]),U0=P(it.a[i2][0],it.a[i2][1],it.a[i2][2]),U1=P(it.c[i2][0],it.c[i2][1],it.c[i2][2]);
        quad(S0,S1,U1,U0);g.fillStyle=PAPER;g.fill();g.strokeStyle=PAPER;g.lineWidth=.7;g.stroke();
        const far=clamp((it.mid[0]*sa+it.mid[1]*ca-.5)/5,0,1),nr=1-.55*far,lN=sN*dot3(it.N,SUN),lB=sB*dot3(it.B,SUN);
        if(lN<.12){quad(A0,A1,S1,S0);g.fillStyle=ink((lN<-.25?.2:.11)*nr);g.fill();}
        if(lB<.12){quad(A0,A1,U1,U0);g.fillStyle=ink((lB<-.25?.2:.11)*nr);g.fill();}
        const w=it.big===2?1.5:it.big?1.05:.8;
        g.beginPath();
        g.moveTo(S0[0],S0[1]);g.lineTo(S1[0],S1[1]);
        g.moveTo(U0[0],U0[1]);g.lineTo(U1[0],U1[1]);
        g.strokeStyle=ink(.93*nr);g.lineWidth=w;g.stroke();
        if(it.big)seg(A0,A1,it.big===2?.6:.45,.5*nr);}
      else if(it.ty===3){ // a limb: tapered, open at its base so it joins the limb it grows from
        const sc=it.gr?it.gr.s:1,pp=it.pts.map(p=>GP(it,p)),n=pp.length-1,wa=it.w0*SC*sc,wb=it.w1*SC*sc;
        if(wa<1.5){g.beginPath();pp.forEach(p=>g.lineTo(p[0],p[1]));g.strokeStyle=ink(.75);g.lineWidth=Math.max(.55,wa);g.stroke();continue;}
        const Lf=[],Rt=[];for(let q=0;q<=n;q++){const a=pp[Math.max(0,q-1)],c=pp[Math.min(n,q+1)],dx=c[0]-a[0],dy=c[1]-a[1],l=Math.hypot(dx,dy)||1,hw=(wa+(wb-wa)*q/n)/2;Lf.push([pp[q][0]-dy/l*hw,pp[q][1]+dx/l*hw]);Rt.push([pp[q][0]+dy/l*hw,pp[q][1]-dx/l*hw]);}
        g.beginPath();Lf.forEach(p=>g.lineTo(p[0],p[1]));for(let q=n;q>=0;q--)g.lineTo(Rt[q][0],Rt[q][1]);g.closePath();g.fillStyle=PAPER;g.fill();
        const sh=Lf[n>>1][0]>Rt[n>>1][0]?Lf:Rt,ot=sh===Lf?Rt:Lf; // the side to the right of the page is in shade
        if(wa>3){g.beginPath();sh.forEach(p=>g.lineTo(p[0],p[1]));for(let q=n;q>=0;q--)g.lineTo(sh[q][0]+(ot[q][0]-sh[q][0])*.36,sh[q][1]+(ot[q][1]-sh[q][1])*.36);g.closePath();g.fillStyle=ink(it.birch?.1:.2);g.fill();}
        if(wa>5)it.bk.forEach(k=>{const q=Math.min(n-1,(k[0]*n)|0),u=.5+k[1]*.8,x0=Lf[q][0]+(Rt[q][0]-Lf[q][0])*u,y0=Lf[q][1]+(Rt[q][1]-Lf[q][1])*u,x1=Lf[q+1][0]+(Rt[q+1][0]-Lf[q+1][0])*u,y1=Lf[q+1][1]+(Rt[q+1][1]-Lf[q+1][1])*u;
          if(it.birch)seg([x0-wa*.22,y0],[x0+wa*.12,y0+.5],.8,.75);else seg([x0,y0],[x0+(x1-x0)*(.3+k[2]*.5),y0+(y1-y0)*(.3+k[2]*.5)],.45,.4);});
        const lw=wa>7?1.4:wa>3?1.05:.8;g.beginPath();Lf.forEach(p=>g.lineTo(p[0],p[1]));g.strokeStyle=ink(.9);g.lineWidth=lw;g.stroke();g.beginPath();Rt.forEach(p=>g.lineTo(p[0],p[1]));g.stroke();}
      else if(it.ty===1){g.beginPath();it.pts.forEach(p=>{const q=P(p[0],p[1],p[2]);g.lineTo(q[0]+it.ox,q[1]-it.ox*.5);});g.strokeStyle=ink(.85);g.lineWidth=it.woody?1.3+1.5*f:1.1;g.stroke();}
      else if(it.ty===2){const p=P(it.p[0],it.p[1],it.p[2]),s=it.sz*clamp((f-it.b)*9,.35,1),ix=(it.an*1.9099|0)%12;
        if(it.fl && f > it.ff) {
          const sprite = flowers[it.fl];
          g.drawImage(sprite, p[0] - 8, p[1] - 10, 16, 48);
        }
        stamp(it.row,ix,p[0],p[1],24*s);
        if(it.droop&&s>.6){g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(p[0]+1,p[1]+it.droop);g.strokeStyle=ink(.7);g.lineWidth=.6;g.stroke();stamp(it.row,(ix+5)%12,p[0]+1,p[1]+it.droop,20*s);}}
      else if(it.ty===4){const p=GP(it,it.p),d=CC/R0*it.R*SC*(it.gr?.55+.45*it.gr.s:1);g.drawImage(catlas,it.v*CC*AQ,it.light*CC*AQ,CC*AQ,CC*AQ,p[0]-d/2,p[1]-d/2,d,d);}
      else if(it.ty===7){const q=BENCH.seat.map(p=>P(p[0],p[1],p[2]));BENCH.lines.slice(4).forEach(l=>line(l.map(p=>P(p[0],p[1],p[2])),1.2,.9));
        g.beginPath();q.forEach(p=>g.lineTo(p[0],p[1]));g.closePath();g.fillStyle=PAPER;g.fill();g.strokeStyle=ink(.9);g.lineWidth=1.1;g.stroke();BENCH.lines.slice(0,4).forEach(l=>line(l.map(p=>P(p[0],p[1],p[2])),1.2,.9));}
      else {g.globalAlpha=1;walker(g,it.x,it.y,it.h,it.dir,it.ph,it.o,.86);}
    }
    g.globalAlpha=1;
    grass(false);
    for(let i=0;i<3;i++){const x=((sec*(26+i*7)+i*430)%(1250))-40,y=60+i*30+9*Math.sin(sec*.6+i*2),fl=Math.sin(sec*8+i*1.7)*4;[-1,1].forEach(sd=>{g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+sd*4,y-3-fl,x+sd*8,y-fl*.6);g.strokeStyle=ink(.6);g.lineWidth=.8;g.stroke();});}
    const m=2+Math.round(f*111/3)*3,txt=MN[m%12]+' '+(2027+Math.floor(m/12));if(txt!==shown){shown=txt;lab.textContent=txt;}
  }
  const AZ0=.5,CYC=30000;
  const start = () => loopDrawing(canvas, now => {
    const e = now % CYC;
    draw(Math.min(e / 21000, 1), Math.min((CYC - e) / 1000, 1),
      now / 1000, AZ0 + now * Math.PI * 2 / 80000);
  }, () => draw(1, 1, 3, AZ0));
  document.fonts.load('19px Safiro').then(start, start);
})();
