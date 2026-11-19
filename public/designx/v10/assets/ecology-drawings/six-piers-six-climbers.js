/* Imported drawing routines from ecology-drawings, 0270bbb. See SOURCES.md. */
/* ---------- lattice scene: a patch of the Bower at mid-height, one form per climber ---------- */
const FORMS={wisteria:['diagrid','On a diagrid of crossing ribs.','on a diagrid'],rose:['fan','On fan ribs rising to pointed arches.','on fan ribs'],honeysuckle:['grid','On hoops and meridians.','on hoops'],hydrangea:['hex','On a honeycomb lattice.','on a honeycomb'],ivy:['lamella','On a lamella of short staggered ribs.','on a lamella'],vine:['crown','At the crown ring.','at the crown']};
function lattice(canvas,sp,key,idx){
  const W=780,HH=960,k=Math.min(1.15,Math.max(.5,canvas.clientWidth/780*devicePixelRatio)),LW=1.4,LS=1.7,form=FORMS[key][0];
  canvas.width=Math.round(W*k);canvas.height=Math.round(HH*k);
  const cA=document.createElement('canvas');cA.width=canvas.width;cA.height=canvas.height;
  const mk=c=>{const x=c.getContext('2d');x.setTransform(k,0,0,k,0,0);x.lineCap='round';x.lineJoin='round';return x;};
  const a=mk(cA),g=mk(canvas),r=rng(sp.seed+7),t=rng(sp.seed+99);
  const norm=P=>P.map((p,i)=>{const q=P[Math.min(P.length-1,i+1)],o=P[Math.max(0,i-1)],dx=q[0]-o[0],dy=q[1]-o[1],l=Math.hypot(dx,dy)||1;return[-dy/l,dx/l];});
  const off=(P,N,d)=>P.map((p,i)=>[p[0]+N[i][0]*d,p[1]+N[i][1]*d]);
  const resamp=(P,st)=>{const o=[P[0].slice()];let carry=0;for(let i=1;i<P.length;i++){const ax=P[i-1][0],ay=P[i-1][1],bx=P[i][0],by=P[i][1],L=Math.hypot(bx-ax,by-ay);let d=st-carry;while(d<=L){o.push([ax+(bx-ax)*d/L,ay+(by-ay)*d/L]);d+=st;}carry=L-(d-st);}return o;};
  const samp=(fx,y0,y1)=>{const o=[];for(let y=y0;y>=y1;y-=8)o.push([fx(y),y]);return o;};
  const M=[],R=[];
  if(form==='diagrid'){
    const fa=i=>y=>-330+i*170+(1000-y)*.55+18*Math.sin(y/260+i),fb=i=>y=>1110-i*170-(1000-y)*.55-18*Math.sin(y/260+i);
    for(let i=0;i<7;i++)M.push({P:samp(fa(i),1000,-40),w:24});for(let i=0;i<7;i++)M.push({P:samp(fb(i),1000,-40),w:24});
    R.push({P:samp(fa(3),1000,-40),side:-1,mw:24,t0:0},{P:samp(fb(3),1000,-40),side:1,mw:24,t0:.12});
  }else if(form==='fan'){
    const rib=(px,j)=>y=>{const u=(1080-y)/1000;return px+j*125*Math.pow(u,1.7)+(px<390?55:-55)*u;};
    [140,640].forEach(px=>{for(let j=-2;j<=2;j++)M.push({P:samp(rib(px,j),1000,-40),w:22});});
    const ring=[];for(let x=-40;x<=820;x+=10)ring.push([x,330+16*Math.sin(x/250)]);M.push({P:ring,w:30});
    R.push({P:samp(rib(140,1),1000,-40),side:-1,mw:22,t0:0},{P:samp(rib(640,-1),1000,-40),side:1,mw:22,t0:.12});
  }else if(form==='grid'){
    const hoop=yh=>x=>yh+28*Math.pow((x-390)/390,2),mer=i=>y=>390+(i-2.5)*150*(.72+.28*y/960);
    [130,390,650,910].forEach(yh=>{const P=[];for(let x=-40;x<=820;x+=10)P.push([x,hoop(yh)(x)]);M.push({P,w:22});});
    for(let i=0;i<6;i++)M.push({P:samp(mer(i),1000,-40),w:26});
    const br=[];for(let x=222;x<=600;x+=8)br.push([x,hoop(390)(x)]);
    R.push({P:samp(mer(1),1000,-40),side:-1,mw:26,t0:0},{P:samp(mer(4),1000,-40),side:1,mw:26,t0:.12},{P:br,side:-1,mw:22,t0:.5});
  }else if(form==='hex'){
    const Rr=105,dx=1.5*Rr,dy=Math.sqrt(3)*Rr,seen={},adj={},key2=p=>Math.round(p[0])+','+Math.round(p[1]);
    for(let c=-1;c<=5;c++)for(let q=-1;q<=6;q++){const cx=c*dx+30,cy=q*dy+(c&1?dy/2:0),v=[];for(let z=0;z<6;z++)v.push([cx+Rr*Math.cos(z*Math.PI/3),cy+Rr*Math.sin(z*Math.PI/3)]);
      for(let z=0;z<6;z++){const p=v[z],p2=v[(z+1)%6],ka=key2(p),kb=key2(p2),ek=ka<kb?ka+'|'+kb:kb+'|'+ka;if(seen[ek])continue;seen[ek]=1;M.push({P:[p,p2],w:18});(adj[ka]=adj[ka]||[]).push(p2);(adj[kb]=adj[kb]||[]).push(p);}}
    const walk=(sx,flip)=>{let cur=null,best=1e9;for(const kk in adj){const p=kk.split(',').map(Number);if(p[1]>900&&p[1]<1100){const d=Math.abs(p[0]-sx);if(d<best){best=d;cur=p;}}}
      const P=[cur],vis={};vis[key2(cur)]=1;for(let n=0;n<40&&cur[1]>-60;n++){const nb=(adj[key2(cur)]||[]).filter(p=>!vis[key2(p)]);let up=nb.filter(p=>p[1]<cur[1]-5);if(!up.length)up=nb.filter(p=>Math.abs(p[1]-cur[1])<=5);if(!up.length)break;
        up.sort((p,q)=>flip?q[0]-p[0]:p[0]-q[0]);cur=up[0];flip=!flip;vis[key2(cur)]=1;P.push(cur);}return P;};
    R.push({P:walk(250,false),side:-1,mw:18,t0:0,free:true},{P:walk(560,true),side:1,mw:18,t0:.12,free:true});
  }else if(form==='lamella'){
    const A=[95,150],B=[-95,150],O=[390,480],As=[],Bs=[];
    for(let i=-6;i<=6;i++)for(let j=-6;j<=6;j++){const n=[O[0]+i*A[0]+j*B[0],O[1]+i*A[1]+j*B[1]];if(n[0]<-200||n[0]>980||n[1]<-220||n[1]>1180)continue;
      const d=((i+j)%2+2)%2===0?A:B;(d===A?As:Bs).push({P:[[n[0]-d[0]*.97,n[1]-d[1]*.97],n,[n[0]+d[0]*.97,n[1]+d[1]*.97]],w:18});}
    As.concat(Bs).forEach(m=>M.push(m));
    const zig=(s,first)=>{const P=[s];let cur=s,d=first;while(cur[1]>-80){cur=[cur[0]-d[0],cur[1]-d[1]];P.push(cur);d=d===A?B:A;}return P;};
    R.push({P:zig([390,1080],A),side:-1,mw:18,t0:0,free:true},{P:zig([580,1080],B),side:1,mw:18,t0:.12,free:true});
  }else{
    const C=[390,-260],pt=(Rd,deg)=>[C[0]+Rd*Math.cos(deg*Math.PI/180),C[1]+Rd*Math.sin(deg*Math.PI/180)];
    [420,720,1020,1320].forEach(Rd=>{const P=[];for(let d=15;d<=165;d+=1.5)P.push(pt(Rd,d));M.push({P,w:Rd===420?34:22});});
    const spoke=deg=>{const P=[];for(let Rd=1420;Rd>=300;Rd-=12)P.push(pt(Rd,deg));return P;};
    for(let d=35;d<=145.1;d+=13.75)M.push({P:spoke(d),w:22});
    const sp1=[],sp2=[],arc=[];for(let Rd=1420;Rd>=452;Rd-=12){sp1.push(pt(Rd,76.25));sp2.push(pt(Rd,117.5));}for(let d=62;d<=118;d+=1.2)arc.push(pt(420,d));
    R.push({P:sp1,side:1,mw:22,t0:0},{P:sp2,side:-1,mw:22,t0:.12},{P:arc,side:-1,mw:34,t0:.55});
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
  R.forEach((rt,ri)=>{const B=rt.free?smooth(resamp(rt.P,6)):resamp(rt.P,6),N=norm(B).map((n,i,arr)=>{const p=arr[Math.max(0,i-2)],q=arr[Math.min(arr.length-1,i+2)],x=n[0]+p[0]+q[0],y=n[1]+p[1]+q[1],l=Math.hypot(x,y)||1;return[x/l,y/l];});
    const co=rt.free?0:rt.side*(rt.mw/2+8),cab=off(B,N,co),w=ri===0?sp.w:sp.w2;
    a.beginPath();cab.forEach(p=>a.lineTo(p[0],p[1]));a.strokeStyle=ink(.85);a.lineWidth=1;a.stroke();
    for(let i=8;i<B.length;i+=22){if(rt.free){a.beginPath();a.arc(cab[i][0],cab[i][1],2.6,0,7);a.fillStyle=PAPER;a.fill();a.strokeStyle=ink(.95);a.lineWidth=1;a.stroke();continue;}const e=[B[i][0]+N[i][0]*rt.side*rt.mw/2,B[i][1]+N[i][1]*rt.side*rt.mw/2];a.beginPath();a.moveTo(e[0],e[1]);a.lineTo(cab[i][0],cab[i][1]);a.strokeStyle=ink(.9);a.lineWidth=1.5;a.stroke();a.beginPath();a.arc(cab[i][0],cab[i][1],2.6,0,7);a.fillStyle=PAPER;a.fill();a.strokeStyle=ink(.95);a.lineWidth=1;a.stroke();}
    const P=sp.spiral?B.map((p,i)=>[p[0]+N[i][0]*(co+4.5*Math.sin(i*.75)),p[1]+N[i][1]*(co+4.5*Math.sin(i*.75))]):off(B,N,rt.free?rt.side*(w/2+3):rt.side*(rt.mw/2+10+w/2));
    const st={P,cab,w,t0:rt.t0,sprigs:[],lats:[],flowers:[],ties:[]};
    P.forEach((p,i)=>{const out=Math.atan2(N[i][1]*rt.side,N[i][0]*rt.side);
      if(i>4&&i%sp.every===0)st.sprigs.push([i,out+(r()<.25?Math.PI:0)+(r()-.5)*1.3]);
      if(i>8&&i%17===0){const a0=out+(r()-.5)*.9,L=[];for(let q=1;q<=10;q++){const s=q*7.5;L.push([p[0]+Math.cos(a0)*s,p[1]+Math.sin(a0)*s+.013*s*s]);}st.lats.push({i,L,a0,fl:r()<.6});}
      if(!sp.spiral&&i>6&&i%14===0)st.ties.push(i);});
    for(let j=0;j<sp.nfl;j++)st.flowers.push(Math.floor(P.length*(.2+.75*(j+.5)/sp.nfl)));
    stems.push(st);});

  const hang=sp.flower==='raceme'||sp.flower==='bunch';
  function plant(c,p){LEAFC=sp.lc;FLOWC=sp.fc||sp.c;const tt=p;p=GH(sp,tt)/sp.gh[9];
    const sg=clamp(p/.85,0,1),wf=.45+.55*p,fs=clamp((tt-sp.ff)/.12,0,1)*1.5;
    stems.forEach(st=>{const q=clamp((sg-st.t0)/(1-st.t0),0,1),n=Math.floor(q*(st.P.length-1));if(n<1)return;
      const wd=i=>st.w*wf*clamp((n-i)/8,.25,1);
      st.lats.forEach(L=>{if(L.i>=n)return;const lp=clamp((n-L.i)/16,0,1),m=Math.max(1,Math.floor(lp*10));c.beginPath();c.moveTo(st.P[L.i][0],st.P[L.i][1]);for(let z=0;z<m;z++)c.lineTo(L.L[z][0],L.L[z][1]);c.strokeStyle=ink(.85);c.lineWidth=1.3;c.stroke();
        [3,6,9].forEach((z,zi)=>{if(z<m)leafAt(c,L.L[z][0],L.L[z][1],L.a0+(zi%2?1:-1)*1.1,sp.leaf,lp*LS*.9);});
        if(L.fl&&m>=10&&fs>0)flowerAt(c,L.L[9][0],L.L[9][1]+(hang?3:-3),sp.flower,fs);});
      if(st.w*wf<3.4){c.beginPath();for(let i=0;i<=n;i++)c.lineTo(st.P[i][0],st.P[i][1]);c.strokeStyle=ink(.9);c.lineWidth=Math.max(1.4,st.w*wf*.8);c.stroke();}
      else[0,1].forEach(pass=>{for(let i=1;i<=n;i++){const w=wd(i);c.strokeStyle=pass?PAPER:ink(.92);c.lineWidth=pass?Math.max(.2,w-2.6):w;c.beginPath();c.moveTo(st.P[i-1][0],st.P[i-1][1]);c.lineTo(st.P[i][0],st.P[i][1]);c.stroke();}});
      st.ties.forEach(i=>{if(i<n-3){c.beginPath();c.moveTo(st.P[i][0],st.P[i][1]);c.lineTo(st.cab[i][0],st.cab[i][1]);c.strokeStyle=ink(.95);c.lineWidth=1.6;c.stroke();}});
      st.sprigs.forEach(s=>{if(s[0]<n)leafAt(c,st.P[s[0]][0],st.P[s[0]][1],s[1],sp.leaf,clamp((n-s[0])/6,0,1)*(.55+.45*p)*LS);});
      if(fs>0)st.flowers.forEach(i=>{if(i<n)flowerAt(c,st.P[i][0]+(hang?-18:14),st.P[i][1]+(hang?4:-10),sp.flower,fs);});
    });
  }
  function draw(p,al){g.save();g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,canvas.width,canvas.height);g.drawImage(cA,0,0);g.restore();g.globalAlpha=al;plant(g,p);g.globalAlpha=1;}
  const cycle = 12000;
  loopDrawing(canvas, now => {
    const e = ((now - idx * 450) % cycle + cycle) % cycle;
    draw(Math.min(e / 6500, 1), Math.min((cycle - e) / FADE, 1));
  }, () => draw(1, 1));
}

/* ---------- 2. six piers ---------- */
(function(){
  const host=document.getElementById('six');
  ['wisteria','rose','honeysuckle','hydrangea','ivy','vine'].forEach((key,idx)=>{const sp=SP[key];
    const f=document.createElement('figure'),c=document.createElement('canvas');
    c.setAttribute('role','img');c.setAttribute('aria-label',sp.name+' growing up through the timber lattice of a Bower. '+FORMS[key][1]);
    f.appendChild(c);const cap=document.createElement('figcaption');
    cap.innerHTML=`<h3>${sp.name} ${FORMS[key][2]}</h3><p class="one">${sp.role} ${sp.one}</p>`;f.appendChild(cap);host.appendChild(f);
    lattice(c,sp,key,idx);});
})();
