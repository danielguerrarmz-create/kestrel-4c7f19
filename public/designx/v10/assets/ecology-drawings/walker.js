/* Imported drawing routines from ecology-drawings, 0270bbb. See SOURCES.md. */
function makeWalker(scale) {
  const k = scale;
  const fc = document.createElement('canvas');
  fc.width = Math.ceil(190 * k);
  fc.height = Math.ceil(200 * k);
  const f = fc.getContext('2d');
  f.setTransform(k, 0, 0, k, 0, 0);
  f.lineCap = 'round';
  f.lineJoin = 'round';
  function ln(ctx, x1, y1, x2, y2, width, alpha) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = width;
    ctx.strokeStyle = ink(alpha);
    ctx.stroke();
  }
  /* people: side-view walkers with a true walk cycle, drawn as one outline and laid in translucent */
  const OX=95,OY=186;
  function walker(c,x,fy,h,dir,ph,o,al){
    const leg=p=>{const th=.42*Math.sin(p),kn=.1+.6*Math.max(0,Math.cos(p)),hip=[0,.53],knee=[.25*Math.sin(th),.53-.25*Math.cos(th)],sh=th-kn,ank=[knee[0]+.245*Math.sin(sh),knee[1]-.245*Math.cos(sh)];return{hip,knee,ank,toe:[ank[0]+.085,ank[1]-.028]};};
    const arm=p=>{const ua=-.36*Math.sin(p),el=[.15*Math.sin(ua),.80-.15*Math.cos(ua)],fa=ua+.32;return{sh:[0,.80],el,wr:[el[0]+.14*Math.sin(fa),el[1]-.14*Math.cos(fa)]};};
    const l1=leg(ph),l2=leg(ph+Math.PI),a1=arm(ph),a2=arm(ph+Math.PI),lift=.03-Math.min(l1.ank[1],l2.ank[1],l1.toe[1]+.01,l2.toe[1]+.01),hd=o.head||1;
    const Pt=q=>[OX+q[0]*h*dir,OY-(q[1]+lift)*h],parts=[],det=[];
    const cap=(p1,w1,p2,w2)=>parts.push(['c',Pt(p1),w1*h,Pt(p2),w2*h]),ell=(c0,rx,ry)=>parts.push(['e',Pt(c0),rx*h,ry*h]),poly=pts=>parts.push(['p',pts.map(Pt)]),dl=(p1,p2)=>det.push([Pt(p1),Pt(p2)]);
    const limb=L=>{cap(L.hip,.075,L.knee,.058);cap(L.knee,.058,L.ank,.04);cap(L.ank,.04,L.toe,.026);};
    const armP=A=>{cap(A.sh,.05,A.el,.042);cap(A.el,.042,A.wr,.034);ell([A.wr[0]+.012,A.wr[1]-.02],.017,.024);};
    armP(a2);limb(l2);limb(l1);
    poly([[-.02,.84],[.035,.835],[.058,.79],[.06,.70],[.04,.61],[.05,.54],[-.07,.54],[-.052,.62],[-.066,.78]]);
    const kf=Math.max(l1.knee[0],l2.knee[0]),kb=Math.min(l1.knee[0],l2.knee[0]);
    if(o.skirt)poly([[.045,.60],[kf*.6+.07,.47],[kf+.05,.33],[kb-.05,.34],[kb*.6-.075,.48],[-.058,.61]]);
    if(o.coat)poly([[-.07,.80],[.062,.79],[.072,.62],[kf*.5+.07,.40],[kb*.5-.075,.40],[-.076,.62]]);
    cap([0,.885],.045,[-.004,.845],.05);ell([.012,.845+.09*hd],.045*hd,.058*hd);if(o.bun)ell([-.036,.957],.024,.022);
    armP(a1);
    dl([-.03,.845+.13*hd],[.03,.845+.135*hd]);dl([-.04*hd,.845+.105*hd],[0,.845+.14*hd]);dl([-.045,.61],[.042,.605]);
    if(o.skirt)[[-.03,-.6],[0,-.2],[.025,.3],[.04,.8]].forEach(q=>dl([q[0],.6],[(q[1]>0?kf:kb)*Math.abs(q[1])+q[0],.35]));
    if(o.coat){dl([.03,.79],[.05,.42]);dl([.03,.79],[.0,.835]);dl([.045,.56],[.07,.555]);}
    if(o.bag){dl([-.02,.83],[-.075,.56]);[[-.105,.56,-.05,.56],[-.105,.56,-.10,.49],[-.10,.49,-.045,.49],[-.045,.49,-.05,.56]].forEach(q=>dl([q[0],q[1]],[q[2],q[3]]));}
    for(let q=0;q<9;q++)dl([-.055+q*.004,.78-q*.02],[-.03+q*.004,.765-q*.02]);
    const path=p=>{f.beginPath();if(p[0]==='c'){const an=Math.atan2(p[3][1]-p[1][1],p[3][0]-p[1][0]);f.arc(p[1][0],p[1][1],p[2]/2,an+Math.PI/2,an-Math.PI/2);f.arc(p[3][0],p[3][1],p[4]/2,an-Math.PI/2,an+Math.PI/2);f.closePath();}
      else if(p[0]==='e')f.ellipse(p[1][0],p[1][1],p[2],p[3],0,0,7);else{p[1].forEach(q=>f.lineTo(q[0],q[1]));f.closePath();}};
    f.save();f.setTransform(1,0,0,1,0,0);f.clearRect(0,0,fc.width,fc.height);f.restore();
    parts.forEach(p=>{path(p);f.strokeStyle=ink(.9);f.lineWidth=Math.max(1.5,h/70);f.stroke();});
    parts.forEach(p=>{path(p);f.fillStyle=PAPER;f.fill();});
    det.forEach(d=>ln(f,d[0][0],d[0][1],d[1][0],d[1][1],Math.max(.45,h/260),.55));
    c.globalAlpha=al;c.drawImage(fc,x-OX,fy-OY,fc.width/k,fc.height/k);c.globalAlpha=1;
    for(let q=0;q<6;q++)ln(c,x-h*.14+q*h*.05,fy+1.5,x-h*.09+q*h*.05,fy+1.5+h*.012,.5,.2);
  }
  return walker;
}
