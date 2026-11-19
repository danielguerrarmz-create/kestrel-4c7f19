import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Produce versioned drawing pages from the authored factory SVGs without
// changing the original pages or storing a second copy of their scene data.
export async function prepareV10Factory(root) {
  const source = resolve(root, '5/factory');
  const destination = resolve(root, 'v10/factory');
  const files = (await readdir(source)).filter(file => file.endsWith('.html'));
  await mkdir(destination, { recursive: true });

  for (const file of files) {
    let html = await readFile(resolve(source, file), 'utf8');
    const adaptations = [
      ['let factoryStatic=factoryMedia.matches;', 'let factoryRate=1;\nlet factoryStatic=factoryMedia.matches;'],
      ['duration:DUR,time:factoryTime,', 'duration:DUR,time:factoryTime,playbackRate:factoryRate,'],
      ['(factoryTime+(now-factoryLast)/1000)%DUR', '(factoryTime+(now-factoryLast)*factoryRate/1000)%DUR'],
      ['  seek:factorySeek,', `  setRate(value){
    const rate=Number(value);
    if(Number.isFinite(rate)&&rate>=.25&&rate<=4)factoryRate=rate;
    factoryNotify();return factoryState();
  },
  seek:factorySeek,`],
      ["play:'play',pause:'pause',seek:'seek'", "play:'play',pause:'pause',setRate:'setRate',seek:'seek'"]
    ];
    for (const [original, versioned] of adaptations) {
      if (html.split(original).length !== 2) throw new Error(`Unexpected factory playback adapter in ${file}`);
      html = html.replace(original, versioned);
    }
    await writeFile(resolve(destination, file), html);
  }
}
