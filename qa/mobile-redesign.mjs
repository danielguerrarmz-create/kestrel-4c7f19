import { launch } from './lib.mjs';
import { mkdir } from 'node:fs/promises';
const {browser, page} = await launch({width:390,height:844,mobile:true});
await mkdir('qa/shots/mobile-redesign', {recursive:true});
const failures=[];
page.on('pageerror', e=>failures.push(e.message));
for (const width of [320,390,768,1440]) {
 await page.setViewport({width,height:844,isMobile:width<800,hasTouch:width<800});
 for (const route of ['/', '/gallery', '/process', '/about/practice', '/contact']) {
  await page.goto('http://127.0.0.1:5173'+route, {waitUntil:'networkidle0'});
  await page.evaluate(()=>document.fonts.ready);
  const overflow = await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth);
  if(overflow) failures.push(`${width} ${route} overflow`);
  if(width===390) await page.screenshot({path:`qa/shots/mobile-redesign/${route.replaceAll('/','_') || 'home'}.png`});
  if(route==='/gallery' && width===390) {
   await page.locator('button[aria-label="Enlarge Wisteria walk"]').click();
   await page.waitForSelector('dialog[open]');
   await page.locator('button[aria-label="Zoom in"]').click();
   if(!await page.$eval('.viewer-canvas img', el=>el.style.transform.includes('1.5'))) failures.push('zoom failed');
   await page.locator('button[aria-label="Next image"]').click();
   if(!await page.$eval('.viewer-canvas img', el=>el.alt.includes('walled garden') && el.style.transform.includes('scale(1)'))) failures.push('next/reset failed');
   await page.screenshot({path:'qa/shots/mobile-redesign/viewer.png'});
   await page.keyboard.press('Escape');
   if(await page.$('dialog[open]')) failures.push('Escape failed');
  }
 }
}
console.log(JSON.stringify({failures}));
await browser.close();
if(failures.length) process.exitCode=1;
