import { writeFileSync } from 'node:fs';
import { runEngine } from '../src/engine';
const studies = [12,15,18].map(footprintM2 => {
 const result=runEngine({footprintM2,riseM:2.3,strutSpacingM:.55,apertureDeg:90,jointSystem:'lamella',speciesId:'clematis',year:0});
 return {footprintM2, count:result.components.totalCount, lengthM:Math.round(result.components.totalLengthM*10)/10,
 pieces:result.geometry.pieces.filter(p=>p.kind==='lamella').slice(0,16).map(p=>({id:p.id,lengthM:p.lengthM,depthM:p.depthM})),
 sheetCount:result.nesting.sheets.length};
});
writeFileSync('src/data/process-parts.json',JSON.stringify(studies));
