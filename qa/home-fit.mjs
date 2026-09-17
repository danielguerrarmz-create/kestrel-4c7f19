import { launch } from './lib.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
const { browser, page } = await launch();
const failures=[]; const results=[];
page.on('pageerror',e=>failures.push(e.message));
await mkdir('qa/shots/home-fit',{recursive:true});
await page.evaluateOnNewDocument(()=>sessionStorage.setItem('bower.intro.played','1'));
try {
 for(const [width,height] of [[1440,900],[1366,768],[1920,1080],[768,1024],[390,844],[320,568],[844,390]]) {
  await page.setViewport({width,height,isMobile:width<768,hasTouch:width<768});
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle0'});
  await page.evaluate(()=>document.fonts.ready);
  const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,snap:getComputedStyle(document.documentElement).scrollSnapType,sections:[...document.querySelectorAll('.home-page > section')].map(e=>({class:e.className,height:Math.round(e.getBoundingClientRect().height)}))}));
  if(metrics.overflow) failures.push(`${width} horizontal overflow`);
  // Chrome omits the default proximity keyword in computed serialization.
  if(!['y', 'y proximity'].includes(metrics.snap)) failures.push(`${width} missing proximity snap`);
  await page.$eval('.home-time',e=>e.scrollIntoView({behavior:'instant'}));
  for (const img of await page.$$('.home-time img')) {
   await img.evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));
   await img.evaluate(e=>e.decode());
  }
  await page.$eval('.mobile-image-rail',e=>e.scrollTo({left:0,behavior:'instant'}));
  await page.$eval('.home-time',e=>e.scrollIntoView({behavior:'instant'}));
  await page.screenshot({path:`qa/shots/home-fit/time-${width}.png`});
  if(width===1440) {
   await page.$eval('.home-gathering',e=>e.scrollIntoView({behavior:'instant'}));
   await page.$eval('.home-gathering img',e=>e.decode());
   await page.$eval('.home-gathering',e=>e.scrollIntoView({behavior:'instant'}));
   await page.screenshot({path:'qa/shots/home-fit/gathering.png'});
  }
  if(width<768) {
   const rail=await page.$eval('.mobile-image-rail',async e=>{e.scrollTo({left:e.scrollWidth,behavior:'instant'}); await new Promise(r=>requestAnimationFrame(r)); return {left:e.scrollLeft,max:e.scrollWidth-e.clientWidth};});
   if(Math.abs(rail.left-rail.max)>2)failures.push(`${width} cannot reach final image`);
  }
  await page.$eval('footer',e=>e.scrollIntoView({behavior:'instant',block:'end'}));
  const footer=await page.$eval('footer',e=>e.getBoundingClientRect().bottom<=innerHeight+2);
  if(!footer)failures.push(`${width} footer unreachable`);
  results.push({width,height,...metrics});
 }
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 if(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollSnapType)!=='none')failures.push('reduced motion still snaps');
 await writeFile('qa/shots/home-fit/results.json',JSON.stringify({results,failures},null,2));
 console.log(JSON.stringify({results,failures},null,2));
} finally {await browser.close();}
if(failures.length)process.exitCode=1;
