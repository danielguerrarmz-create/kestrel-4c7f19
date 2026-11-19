/* Imported drawing routines from ecology-drawings, 0270bbb. See SOURCES.md. */
const NS='http://www.w3.org/2000/svg';
function el(p,n,a,t){const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);if(t!=null)e.textContent=t;p.appendChild(e);return e;}
function rng(seed){return()=>{seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const PAPER='#fdfdfb',ink=a=>`rgba(40,40,38,${a})`;
const CYCLE=17000,GROW=11500,FADE=1000;

const SP={
 wisteria:{name:'Wisteria',role:'The woody frame.',latin:'Wisteria sinensis',one:'Twines. Tied in beside its cable.',leaf:'pinnate9',every:4,flower:'raceme',nfl:4,w:13,w2:5.4,by:150,seed:31,c:'#8b6fb8',bar:[4.2,6],
  roots:[[.02,5,'lat'],[.14,4.5,'lat'],[.34,4,'lat'],[3.1,4.5,'lat'],[2.94,4,'lat'],[2.69,3.5,'lat'],[1.25,4.5,'sink'],[1.8,4,'sink']]},
 rose:{name:'Climbing rose',role:'Scent at head height.',latin:"Rosa 'The Generous Gardener'",one:'Does not grip. Its canes are tied in.',leaf:'pinnate5',every:3,flower:'rose',nfl:7,w:7,w2:6,by:262,seed:52,c:'#d58f9c',bar:[5.2,9.3],
  roots:[[.1,4.5,'lat'],[3.0,4.5,'lat'],[.5,3.5,'lat'],[1.1,5.5,'sink'],[1.55,6,'sink'],[2.0,5,'sink']]},
 honeysuckle:{name:'Honeysuckle',role:'Summer scent and berries.',latin:"Lonicera periclymenum 'Graham Thomas'",one:'Twines round its cable.',leaf:'oval',every:3,flower:'whorl',nfl:6,w:4.2,w2:3.4,by:240,spiral:true,seed:73,c:'#d9a441',bar:[5.5,9],
  roots:[[.03,3.2,'lat'],[.16,3,'lat'],[.3,2.8,'lat'],[.5,2.6,'lat'],[3.11,3.2,'lat'],[2.98,3,'lat'],[2.8,2.8,'lat'],[1.5,2.6,'sink']]},
 hydrangea:{name:'Climbing hydrangea',role:'For the cool side.',latin:'Hydrangea anomala subsp. petiolaris',one:'Clings by rootlets. Slow, then stout.',leaf:'ovate',every:2,flower:'lacecap',nfl:5,w:11,w2:6,by:180,seed:94,c:'#a9b78f',bar:[5.2,7],
  roots:[[.02,3.8,'lat'],[.12,3.6,'lat'],[.24,3.4,'lat'],[.4,3,'lat'],[3.12,3.8,'lat'],[3.0,3.6,'lat'],[2.86,3.2,'lat']]},
 ivy:{name:'Ivy',latin:'Hedera helix',ever:true,role:'Green through winter.',one:'Clings by rootlets. Evergreen.',leaf:'lobed',every:2,flower:'umbel',nfl:5,w:7,w2:5,by:200,seed:115,c:'#2f5a3a',bar:[8.3,11],
  roots:[[.02,2.8,'lat'],[.1,2.6,'lat'],[.2,2.6,'lat'],[.32,2.4,'lat'],[.48,2.2,'lat'],[3.12,2.8,'lat'],[3.02,2.6,'lat'],[2.9,2.4,'lat'],[2.74,2.2,'lat'],[1.6,2.4,'sink']]},
 vine:{name:'Crimson glory vine',role:'Red leaf in autumn.',latin:'Vitis coignetiae',one:'Holds on with tendrils. Big leaves, deep roots.',leaf:'heart',every:5,flower:'bunch',nfl:3,w:12,w2:6,by:120,seed:136,c:'#a8432f',bar:[9,10.7],barNote:'leaf colour',
  roots:[[.08,4.5,'lat'],[3.05,4.5,'lat'],[.4,4,'lat'],[1.0,5.5,'sink'],[1.4,6,'sink'],[1.75,5.5,'sink'],[2.15,5,'sink']]}
};

/* height at each year end over ten years (gh, metres) and the share of the ten years before first flower (ff), from the simulator run in build/growth.json */
function GH(sp,u){const x=clamp(u,0,1)*10,i=Math.floor(x),a=i?sp.gh[i-1]:.2,b=sp.gh[Math.min(9,i)];return a+(b-a)*(x-i);}SP.wisteria.gh=[1.52, 2.57, 3.84, 4.67, 4.92, 4.95, 5.76, 6.33, 6.33, 6.33];SP.wisteria.ff=0.445;SP.rose.gh=[1.48, 2.81, 3.59, 3.59, 4.2, 4.5, 4.5, 4.5, 4.5, 4.5];SP.rose.ff=0.145;SP.honeysuckle.gh=[0.96, 1.91, 3.16, 3.98, 4.67, 4.91, 4.91, 5.08, 6.02, 6.37];SP.honeysuckle.ff=0.145;SP.hydrangea.gh=[0.48, 0.7, 1.1, 1.57, 2.3, 2.75, 3.3, 3.6, 3.86, 4.19];SP.hydrangea.ff=0.545;SP.ivy.gh=[0.44, 0.6, 1.4, 2.17, 2.75, 3.48, 3.89, 4.27, 4.69, 4.86];SP.ivy.ff=0.945;SP.vine.gh=[2.28, 3.83, 4.9, 5.02, 6.32, 6.32, 6.37, 6.37, 6.37, 6.37];SP.vine.ff=0.345;
let LEAFC=null,FLOWC=null;Object.keys(SP).forEach(k=>{SP[k].lc=SP[k].ever?'#86ab7f':'#b7d39a';});SP.ivy.fc='#b4b84e';SP.hydrangea.fc='#e4edd6';
function leafAt(c,x,y,a,type,s){
  const e=(cx,cy,rx,ry,an)=>{c.beginPath();c.ellipse(cx,cy,rx*s,ry*s,an,0,7);c.fillStyle=LEAFC||PAPER;c.fill();c.strokeStyle=ink(.65);c.lineWidth=.6;c.stroke();
    c.beginPath();c.moveTo(cx-rx*s*.75*Math.cos(an),cy-rx*s*.75*Math.sin(an));c.lineTo(cx+rx*s*.75*Math.cos(an),cy+rx*s*.75*Math.sin(an));c.strokeStyle=ink(.4);c.lineWidth=.35;c.stroke();};
  const stalk=L=>{const ex=x+Math.cos(a)*L*s,ey=y+Math.sin(a)*L*s;c.beginPath();c.moveTo(x,y);c.lineTo(ex,ey);c.strokeStyle=ink(.7);c.lineWidth=.7;c.stroke();return[ex,ey];};
  if(type==='pinnate9'||type==='pinnate5'){const big=type==='pinnate9',L=big?28:17,n=big?4:2,[ex,ey]=stalk(L);
    for(let k=1;k<=n;k++){const u=k/(n+.4),bx=x+(ex-x)*u,by=y+(ey-y)*u;[-1,1].forEach(sd=>e(bx-Math.sin(a)*sd*4.5*s,by+Math.cos(a)*sd*4.5*s,big?6:5.5,big?2.3:2.9,a+sd*.7));}
    e(ex+Math.cos(a)*5*s,ey+Math.sin(a)*5*s,big?6:5.5,big?2.3:2.9,a);}
  else if(type==='oval'){[-1,1].forEach(sd=>e(x+Math.cos(a+sd*1.35)*9*s,y+Math.sin(a+sd*1.35)*9*s,8.5,3.8,a+sd*1.35));}
  else if(type==='ovate'){const[ex,ey]=stalk(8);e(ex+Math.cos(a)*9*s,ey+Math.sin(a)*9*s,10,6.5,a);}
  else if(type==='lobed'){const[ex,ey]=stalk(7),cx=ex+Math.cos(a)*7*s,cy=ey+Math.sin(a)*7*s;c.beginPath();
    for(let i=0;i<10;i++){const rr=(i%2?5.2:9.5)*s,an=a+i*Math.PI/5;c.lineTo(cx+rr*Math.cos(an),cy+rr*Math.sin(an));}c.closePath();c.fillStyle=LEAFC||PAPER;c.fill();c.strokeStyle=ink(.7);c.lineWidth=.6;c.stroke();
    c.beginPath();c.moveTo(ex,ey);c.lineTo(cx+Math.cos(a)*7*s,cy+Math.sin(a)*7*s);c.strokeStyle=ink(.4);c.lineWidth=.35;c.stroke();}
  else if(type==='heart'){const[ex,ey]=stalk(12),R=14*s,co=Math.cos(a),sn=Math.sin(a),pt=(u,v)=>[ex+(u*co-v*sn)*R,ey+(u*sn+v*co)*R];
    c.beginPath();[[0,0],[-.25,.5],[.1,.95],[.75,1.05],[1.05,.7],[1.45,.5],[1.3,.2],[1.9,0],[1.3,-.2],[1.45,-.5],[1.05,-.7],[.75,-1.05],[.1,-.95],[-.25,-.5]].forEach(q=>{const p=pt(q[0],q[1]);c.lineTo(p[0],p[1]);});c.closePath();c.fillStyle=LEAFC||PAPER;c.fill();c.strokeStyle=ink(.7);c.lineWidth=.65;c.stroke();
    [[1.9,0],[1.45,.5],[1.45,-.5],[.75,1.05],[.75,-1.05]].forEach(q=>{const p=pt(q[0],q[1]);c.beginPath();c.moveTo(ex,ey);c.lineTo(ex+(p[0]-ex)*.92,ey+(p[1]-ey)*.92);c.strokeStyle=ink(.38);c.lineWidth=.35;c.stroke();});}
}
function flowerAt(c,x,y,type,s){
  const o=(cx,cy,rad,al)=>{c.beginPath();c.arc(cx,cy,Math.max(.3,rad),0,7);c.fillStyle=FLOWC||PAPER;c.fill();c.strokeStyle=ink(al||.75);c.lineWidth=.6;c.stroke();};
  const l=(x1,y1,x2,y2)=>{c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.strokeStyle=ink(.6);c.lineWidth=.5;c.stroke();};
  if(type==='raceme'){const n=Math.round(11*s);l(x,y,x,y+8+n*5.2);for(let k=0;k<n;k++)o(x+(k%2?2.6:-2.6),y+10+k*5.2,3.2-k*.2);}
  else if(type==='rose'){o(x,y,6.5*s);o(x+.8*s,y-.5*s,4*s);o(x-.4*s,y+.6*s,1.8*s);}
  else if(type==='whorl'){for(let k=-3;k<=3;k++){const an=-Math.PI/2+k*.36,ex=x+Math.cos(an)*12*s,ey=y+Math.sin(an)*12*s;l(x,y,ex,ey);o(ex,ey,1.5*s);}}
  else if(type==='lacecap'){for(let k=0;k<9;k++)o(x+Math.cos(k*2.4)*3.4*s,y+Math.sin(k*2.4)*2*s,.9*s);for(let k=0;k<6;k++)o(x+Math.cos(k*1.05)*9*s,y+Math.sin(k*1.05)*5*s,2.6*s);}
  else if(type==='umbel'){l(x,y,x,y-8*s);for(let k=0;k<9;k++)o(x+Math.cos(k*.7)*4.5*s,y-12*s+Math.sin(k*.7)*4.5*s,1.2*s);}
  else if(type==='bunch'){l(x,y,x,y+6);[4,3,2,1].forEach((n,row)=>{for(let k=0;k<n;k++)o(x+(k-(n-1)/2)*4.6*s,y+8+row*4.4*s,2.3*s);});}
}


// A drawing keeps its own elapsed time. Leaving the viewport or hiding the
// document suspends its clock. Reduced motion paints one completed drawing.
function loopDrawing(element, drawFrame, drawStill, interval = 0) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let inView = false;
  let elapsed = 0;
  let previous = null;
  let request = 0;
  let timer = 0;
  let stillPainted = false;

  function signalFirstFrame() {
    if (document.documentElement.dataset.drawn === 'true') return;
    document.documentElement.dataset.drawn = 'true';
    document.dispatchEvent(new Event('ecology:drawn'));
  }

  function frame(now) {
    request = 0;
    if (previous !== null) elapsed += now - previous;
    previous = now;
    drawFrame(elapsed);
    signalFirstFrame();
    if (interval) {
      timer = setTimeout(() => { timer = 0; request = requestAnimationFrame(frame); }, interval);
    } else {
      request = requestAnimationFrame(frame);
    }
  }

  function sync() {
    cancelAnimationFrame(request);
    clearTimeout(timer);
    request = timer = 0;
    previous = null;
    if (!inView || document.hidden) return;
    if (reduced.matches) {
      if (!stillPainted) {
        drawStill();
        signalFirstFrame();
      }
      stillPainted = true;
    } else {
      stillPainted = false;
      request = requestAnimationFrame(frame);
    }
  }
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting && entries[0].intersectionRatio > 0;
    sync();
  }).observe(element);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
}

// Size internal buffers to the display, including its pixel density. Authored
// coordinates, geometry and strokes continue to use the original drawing space.
function drawingScale(width, height, maximum) {
  const fit = Math.min(innerWidth / width, innerHeight / height);
  return Math.min(maximum, Math.max(0.5, fit * devicePixelRatio));
}
