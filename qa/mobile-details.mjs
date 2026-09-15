import {launch} from './lib.mjs';
const {browser,page}=await launch({width:390,height:844,mobile:true});
for(const [route,selector,name] of [['/','.mobile-material','material'],['/process','.mobile-photo-story','process-close']]) {
 await page.goto('http://127.0.0.1:5173'+route,{waitUntil:'networkidle0'});
 await page.$eval(selector,el=>el.scrollIntoView());
 await new Promise(r=>setTimeout(r,300));
 await page.screenshot({path:`qa/shots/mobile-redesign/${name}.png`});
}
await browser.close();
