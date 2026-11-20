/* The soil line is y=0. Both section drawings use slide 8's frame and pile geometry. */
function drawPierFoundation(ctx, centre, soil, scale, legs) {
  ctx.save();
  ctx.translate(centre, soil);
  ctx.scale(scale, scale);
  const line = (x1,y1,x2,y2,weight,opacity) => {
    ctx.strokeStyle = ink(opacity);
    ctx.lineWidth = Math.max(.65 / scale, weight);
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  };
  function steel(x,y,w,h) {
    ctx.fillStyle = '#e6e9e6';
    ctx.fillRect(x,y,w,h);
    ctx.strokeStyle = ink(.85);
    ctx.lineWidth = Math.max(1.35,.85/scale);
    ctx.strokeRect(x,y,w,h);
  }
  // Sleeve walls in section leave the face of each timber leg visible.
  for (const leg of legs) {
    const left = leg.x-leg.w/2, right = leg.x+leg.w/2;
    steel(left-3,-10,3,74);
    steel(right,-10,3,74);
    steel(left-3,59,leg.w+6,5);
    line(left-3,-10,right+3,-10,.8,.55);
  }
  steel(-187,64,374,30);
  line(-186,70,186,70,.85,.65);
  line(-186,88,186,88,.85,.7);
  for (let x=-184; x<184; x+=6) line(x,89,x+3,93,.55,.38);
  for (const x of [-172,-63,130]) {
    steel(x-15,64,30,30);
    ctx.fillStyle=PAPER; ctx.fillRect(x-10,69,20,20);
  }
  for (const x of [-63,130]) {
    ctx.beginPath();
    ctx.moveTo(x-11,95); ctx.lineTo(x+11,95); ctx.lineTo(x+11,623);
    ctx.lineTo(x,647); ctx.lineTo(x-11,623); ctx.closePath();
    ctx.fillStyle=PAPER; ctx.fill(); ctx.strokeStyle=ink(.9);
    ctx.lineWidth=Math.max(1.6,1/scale); ctx.stroke();
    line(x+6,103,x+6,622,.8,.38);
    steel(x-20,94,40,6);
    for (const dy of [4,0]) {
      ctx.beginPath(); ctx.ellipse(x,575+dy,38,7,-.14,0,Math.PI*2);
      ctx.fillStyle='#e6e9e6'; ctx.fill(); ctx.strokeStyle=ink(.8); ctx.stroke();
    }
  }
  ctx.restore();
}
