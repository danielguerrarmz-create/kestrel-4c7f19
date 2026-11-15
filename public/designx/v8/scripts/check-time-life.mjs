// Deterministic choreography checks, independent of video/network/browser timing.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const environment={window:{}};
vm.runInNewContext(await readFile(new URL('../time-experiment.js',import.meta.url),'utf8'),environment);
const {occupationAt,birdAt,hummingbirdAt}=environment.window.DESIGNX_V8_TIME_EXPERIMENT;
const person=(time,id)=>occupationAt(time).find(p=>p.id===id);
const distance=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i]));
const piers=Array.from({length:6},(_,i)=>[6.2*Math.cos(i*Math.PI/3),6.2*Math.sin(i*Math.PI/3),0]);
for(let time=13;time<51;time+=.05)for(const p of occupationAt(time)){
  assert.ok([...p.point,p.heading,p.phase,p.cycle,p.walkWeight,p.alpha].every(Number.isFinite));
  assert.ok(p.alpha>=0&&p.alpha<=1&&p.phase>=0&&p.phase<=1);
  for(const pier of piers)assert.ok(distance(p.point,pier)>1.2,'People must clear the six timber piers');
}
for(const [id,a,b,action] of [['through',18.3,19,'look'],['around',40.6,41.4,'look'],['around',49.6,50.2,'smell']]){
  const before=person(a,id),after=person(b,id);
  assert.equal(before.action,action);assert.equal(after.action,action);
  assert.equal(distance(before.point,after.point),0,'A pause must hold planted feet');
  assert.equal(before.cycle,after.cycle,'A stopped person must not keep walking');
  assert.ok(after.phase>before.phase,'The skeleton gesture should develop while the feet stay planted');
}
assert.ok(distance(person(21,'through').point,person(22,'through').point)>1,'People resume walking after looking');
assert.ok(distance(birdAt(23).point,birdAt(39.5).point)>10,'Bird arrivals should follow different routes');
assert.ok(distance(birdAt(26).point,birdAt(42.5).point)>8,'Visits should use different timber perches');
assert.equal(hummingbirdAt(47),null);assert.equal(hummingbirdAt(48.5).feeding,false);
const lower=hummingbirdAt(49.2),upper=hummingbirdAt(50.1);
assert.equal(lower.feeding,true);assert.equal(upper.feeding,true);
assert.ok(upper.target[2]-lower.target[2]>.35,'The hummingbird should move between the two recorded flower clusters');
for(const bird of [lower,upper])assert.ok(distance(bird.point,bird.target)<.24,'The hover should be beside the flower');
assert.equal(hummingbirdAt(50.8).feeding,false);assert.equal(hummingbirdAt(51),null);
assert.equal(JSON.stringify(occupationAt(50)),JSON.stringify(occupationAt(50)));
console.log('PASS: grounded pauses and gestures; resumed travel; distinct bird routes; bloom-targeted hummingbird.');
