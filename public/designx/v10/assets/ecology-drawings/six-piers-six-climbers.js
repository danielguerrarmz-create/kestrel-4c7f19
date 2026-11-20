/* Shared-pier detail derived from the V10 pencil lattice drawing. */
(function () {
  const canvas = document.getElementById('shared-pier');
  const W = 780, HH = 960, k = drawingScale(W, HH, 1.6);
  const LW = 1.4, LS = 1.6, r = rng(87), t = rng(431);
  canvas.width = Math.round(W*k); canvas.height = Math.round(HH*k);
  const cA = document.createElement('canvas');
  cA.width = canvas.width; cA.height = canvas.height;
  const mk = c => {
    const pen = c.getContext('2d');
    pen.setTransform(k,0,0,k,0,0); pen.lineCap='round'; pen.lineJoin='round';
    return pen;
  };
  const a = mk(cA), g = mk(canvas);
  const norm=P=>P.map((p,i)=>{const q=P[Math.min(P.length-1,i+1)],o=P[Math.max(0,i-1)],dx=q[0]-o[0],dy=q[1]-o[1],l=Math.hypot(dx,dy)||1;return[-dy/l,dx/l];});
  const off=(P,N,d)=>P.map((p,i)=>[p[0]+N[i][0]*d,p[1]+N[i][1]*d]);
  const resamp=(P,st)=>{const o=[P[0].slice()];let carry=0;for(let i=1;i<P.length;i++){const ax=P[i-1][0],ay=P[i-1][1],bx=P[i][0],by=P[i][1],L=Math.hypot(bx-ax,by-ay);let d=st-carry;while(d<=L){o.push([ax+(bx-ax)*d/L,ay+(by-ay)*d/L]);d+=st;}carry=L-(d-st);}return o;};
  const samp=(fx,y0,y1)=>{const o=[];for(let y=y0;y>=y1;y-=8)o.push([fx(y),y]);return o;};
  const M = [], R = [];
  const rib = (j, y) => 389 + j*18 + j*157*Math.pow(Math.max(0,(750-y)/790),1.65);
  for (let j=-3; j<=3; j++) M.push({P:samp(y=>rib(j,y),965,-45),w:Math.abs(j)===3?26:13});
  for (const y of [195,330]) M.push({P:[[-20,y],[800,y+5]],w:18});
  const jasmine = {name:'Star jasmine', w:4, w2:3, every:4, spiral:true, leaf:'oval', lc:'#789273', c:'#f4e7bb', flower:'star', nfl:12};
  const clematis = {name:'Winter clematis', w:4, w2:3, every:3, leaf:'pinnate5', lc:'#8ca07c', c:'#dfcfab', flower:'bell', nfl:8};
  // The accessory cable, tie points and fine laths all share the same timber fan.
  R.push({P:samp(y=>rib(-3,y),960,-36),side:-1,mw:26,t0:0,species:SP.wisteria});
  R.push({P:samp(y=>rib(3,y),960,112),side:1,mw:26,t0:.09,species:SP.rose});
  R.push({P:samp(y=>rib(1,y),960,-20),side:1,mw:13,t0:.06,species:jasmine});
  const lath = y => rib(-1,y) - 54;
  M.push({P:samp(lath,965,368),w:5});
  for (let y=429; y<=885; y+=78) M.push({P:[[lath(y)-14,y],[rib(-1,y),y]],w:4});
  R.push({P:samp(lath,960,368),side:-1,mw:5,t0:.13,species:clematis});
  function detailFlower(c,x,y,type,size) {
    if (type !== 'star' && type !== 'bell') return flowerAt(c,x,y,type,size);
    c.save(); c.translate(x,y); c.scale(size,size); c.fillStyle=FLOWC; c.strokeStyle=ink(.65); c.lineWidth=.7;
    if (type === 'star') {
      for (let i=0;i<5;i++) {
        c.rotate(2*Math.PI/5); c.beginPath(); c.ellipse(0,-4,2.2,5,.37,0,Math.PI*2); c.fill(); c.stroke();
      }
    } else {
      c.beginPath(); c.moveTo(0,0); c.quadraticCurveTo(6,1,7,13); c.quadraticCurveTo(1,10,-6,14);
      c.quadraticCurveTo(-5,3,0,0); c.fill(); c.stroke();
    }
    c.restore();
  }
  /* static: timber members with laminations and grain, then cables */
  a.fillStyle=PAPER;a.fillRect(0,0,W,HH);
  M.forEach(m=>{const P=resamp(m.P,8),N=norm(P),w=m.w,Lp=off(P,N,-w/2),Rp=off(P,N,w/2);
    a.beginPath();Lp.forEach(p=>a.lineTo(p[0],p[1]));for(let i=Rp.length-1;i>=0;i--)a.lineTo(Rp[i][0],Rp[i][1]);a.closePath();a.fillStyle=PAPER;a.fill();
    const cnt=Math.round(P.length*w/12);for(let j=0;j<cnt;j++){const i0=(t()*P.length)|0,n=3+(t()*8|0),o=(t()-.5)*(w-3);a.beginPath();for(let i=i0;i<Math.min(P.length,i0+n);i++)a.lineTo(P[i][0]+N[i][0]*o,P[i][1]+N[i][1]*o);a.strokeStyle=ink(.14+t()*.16);a.lineWidth=.5;a.stroke();}
    const nl=Math.max(2,Math.round(w/8));for(let q=1;q<nl;q++){const o=-w/2+q*w/nl;a.beginPath();P.forEach((p,i)=>a.lineTo(p[0]+N[i][0]*o,p[1]+N[i][1]*o));a.strokeStyle=ink(.4);a.lineWidth=.6;a.stroke();}
    a.beginPath();Lp.forEach(p=>a.lineTo(p[0],p[1]));for(let i=Rp.length-1;i>=0;i--)a.lineTo(Rp[i][0],Rp[i][1]);a.closePath();a.strokeStyle=ink(.92);a.lineWidth=1.7;a.stroke();});
  const smooth=P=>P.map((p,i)=>{let x=0,y=0,n=0;for(let q=Math.max(0,i-22);q<=Math.min(P.length-1,i+22);q++){x+=P[q][0];y+=P[q][1];n++;}return[x/n,y/n];});
  const stems=[];
  R.forEach((rt,ri)=>{const sp=rt.species;const B=rt.free?smooth(resamp(rt.P,6)):resamp(rt.P,6),N=norm(B).map((n,i,arr)=>{const p=arr[Math.max(0,i-2)],q=arr[Math.min(arr.length-1,i+2)],x=n[0]+p[0]+q[0],y=n[1]+p[1]+q[1],l=Math.hypot(x,y)||1;return[x/l,y/l];});
    const co=rt.free?0:rt.side*(rt.mw/2+8),cab=off(B,N,co),w=ri===0?sp.w:sp.w2;
    a.beginPath();cab.forEach(p=>a.lineTo(p[0],p[1]));a.strokeStyle=ink(.85);a.lineWidth=1;a.stroke();
    for(let i=8;i<B.length;i+=22){if(rt.free){a.beginPath();a.arc(cab[i][0],cab[i][1],2.6,0,7);a.fillStyle=PAPER;a.fill();a.strokeStyle=ink(.95);a.lineWidth=1;a.stroke();continue;}const e=[B[i][0]+N[i][0]*rt.side*rt.mw/2,B[i][1]+N[i][1]*rt.side*rt.mw/2];a.beginPath();a.moveTo(e[0],e[1]);a.lineTo(cab[i][0],cab[i][1]);a.strokeStyle=ink(.9);a.lineWidth=1.5;a.stroke();a.beginPath();a.arc(cab[i][0],cab[i][1],2.6,0,7);a.fillStyle=PAPER;a.fill();a.strokeStyle=ink(.95);a.lineWidth=1;a.stroke();}
    const P=sp.spiral?B.map((p,i)=>[p[0]+N[i][0]*(co+4.5*Math.sin(i*.75)),p[1]+N[i][1]*(co+4.5*Math.sin(i*.75))]):off(B,N,rt.free?rt.side*(w/2+3):rt.side*(rt.mw/2+10+w/2));
    const st={sp,P,cab,w,t0:rt.t0,sprigs:[],lats:[],flowers:[],ties:[]};
    P.forEach((p,i)=>{const out=Math.atan2(N[i][1]*rt.side,N[i][0]*rt.side);
      if(i>4&&i%sp.every===0)st.sprigs.push([i,out+(r()<.25?Math.PI:0)+(r()-.5)*1.3]);
      if(i>8&&i%17===0){const a0=out+(r()-.5)*.9,L=[];for(let q=1;q<=10;q++){const s=q*7.5;L.push([p[0]+Math.cos(a0)*s,p[1]+Math.sin(a0)*s+.013*s*s]);}st.lats.push({i,L,a0,fl:r()<.6});}
      if(!sp.spiral&&i>6&&i%14===0)st.ties.push(i);});
    for(let j=0;j<sp.nfl;j++)st.flowers.push(Math.floor(P.length*(.2+.75*(j+.5)/sp.nfl)));
    stems.push(st);});

  function plant(c, progress) {
    stems.forEach(st => {
      const sp = st.sp, hang = sp.flower === 'raceme' || sp.flower === 'bell';
      LEAFC = sp.lc; FLOWC = sp.fc || sp.c;
      const p = progress, sg = p, wf = .45 + .55*p;
      const fs = clamp((p - .75) / .24, 0, 1) * 1.45;
      const q=clamp((sg-st.t0)/(1-st.t0),0,1),n=Math.floor(q*(st.P.length-1));if(n<1)return;
      const wd=i=>st.w*wf*clamp((n-i)/8,.25,1);
      st.lats.forEach(L=>{if(L.i>=n)return;const lp=clamp((n-L.i)/16,0,1),m=Math.max(1,Math.floor(lp*10));c.beginPath();c.moveTo(st.P[L.i][0],st.P[L.i][1]);for(let z=0;z<m;z++)c.lineTo(L.L[z][0],L.L[z][1]);c.strokeStyle=ink(.85);c.lineWidth=1.3;c.stroke();
        [3,6,9].forEach((z,zi)=>{if(z<m)leafAt(c,L.L[z][0],L.L[z][1],L.a0+(zi%2?1:-1)*1.1,sp.leaf,lp*LS*.9);});
        if(L.fl&&m>=10&&fs>0)detailFlower(c,L.L[9][0],L.L[9][1]+(hang?3:-3),sp.flower,fs);});
      if(st.w*wf<3.4){c.beginPath();for(let i=0;i<=n;i++)c.lineTo(st.P[i][0],st.P[i][1]);c.strokeStyle=ink(.9);c.lineWidth=Math.max(1.4,st.w*wf*.8);c.stroke();}
      else[0,1].forEach(pass=>{for(let i=1;i<=n;i++){const w=wd(i);c.strokeStyle=pass?PAPER:ink(.92);c.lineWidth=pass?Math.max(.2,w-2.6):w;c.beginPath();c.moveTo(st.P[i-1][0],st.P[i-1][1]);c.lineTo(st.P[i][0],st.P[i][1]);c.stroke();}});
      st.ties.forEach(i=>{if(i<n-3){c.beginPath();c.moveTo(st.P[i][0],st.P[i][1]);c.lineTo(st.cab[i][0],st.cab[i][1]);c.strokeStyle=ink(.95);c.lineWidth=1.6;c.stroke();}});
      st.sprigs.forEach(s=>{if(s[0]<n)leafAt(c,st.P[s[0]][0],st.P[s[0]][1],s[1],sp.leaf,clamp((n-s[0])/6,0,1)*(.55+.45*p)*LS);});
      if(fs>0)st.flowers.forEach(i=>{if(i<n)detailFlower(c,st.P[i][0]+(hang?-18:14),st.P[i][1]+(hang?4:-10),sp.flower,fs);});
    });
  }
  function draw(p,al){g.save();g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,canvas.width,canvas.height);g.drawImage(cA,0,0);g.restore();g.globalAlpha=al;plant(g,p);g.globalAlpha=1;}
  loopDrawing(canvas, now => draw(clamp(now / 6500, 0, 1), 1), () => draw(1, 1), 180);
})();

document.querySelectorAll('.plant-notes dt').forEach(term => {
  const species = botanicalSprigs.species.find(plant => plant.n === term.textContent);
  botanicalSprigs.draw(term.parentElement.querySelector('svg'),50,50,species);
});
