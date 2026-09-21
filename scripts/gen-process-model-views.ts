/** Public illustrations derived from model solids; no renderer or engine in the public bundle. */
import { mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import sharp from 'sharp';
import * as THREE from 'three';
import { generateGeometry } from '../src/engine/geometry';
import { memberPrism, sectionFor } from '../src/engine/jointGeometry';
import { buildSteel } from '../src/scene/connectors';
import type { JointSystem, Vec3 } from '../src/engine/types';
const dest='public/assets/process/model'; mkdirSync(dest,{recursive:true});
const faceIds=[[0,3,2,1],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]];
const light=new THREE.Vector3(-.4,.9,1).normalize();
type Face={points:THREE.Vector3[];material:'wood'|'steel'|'bolt'};
function solid(points:Vec3[],material:Face['material']):Face[]{return faceIds.map(ids=>({points:ids.map(i=>new THREE.Vector3(...points[i])),material}));}
function primitive(matrix:THREE.Matrix4,cylinder:boolean,material:Face['material']):Face[]{
 const geometry=cylinder?new THREE.CylinderGeometry(.5,.5,1,16):new THREE.BoxGeometry(1,1,1);
 const pos=geometry.attributes.position,indices=geometry.index!;const faces:Face[]=[];
 for(let i=0;i<indices.count;i+=3)faces.push({points:[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(pos,indices.getX(i+j)).applyMatrix4(matrix)),material});
 geometry.dispose();return faces;
}
function render(name:string,faces:Face[],center:THREE.Vector3,eye:THREE.Vector3,span:number,plant=false){
 const camera=new THREE.OrthographicCamera(-span*.64,span*.64,span*.48,-span*.48,.01,100);camera.position.copy(center).add(eye);camera.lookAt(center);camera.updateMatrixWorld();
 const project=(v:THREE.Vector3)=>{const p=v.clone().project(camera);return {x:(p.x+1)*600,y:(1-p.y)*450,z:p.z}};
 const polygons=faces.map(face=>{
  const normal=face.points[1].clone().sub(face.points[0]).cross(face.points[2].clone().sub(face.points[0])).normalize();
  const tone=.73+.27*Math.abs(normal.dot(light));
  const base=face.material==='wood'?[195,158,106]:face.material==='steel'?[169,180,174]:[86,96,90];
  const color=`rgb(${base.map(c=>Math.round(c*tone)).join(',')})`;
  const points=face.points.map(project);
  return {z:points.reduce((sum,p)=>sum+p.z,0)/points.length,markup:`<polygon points="${points.map(p=>`${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')}" fill="${color}" stroke="${color}" stroke-width=".5"/>`};
 }).sort((a,b)=>b.z-a.z).map(p=>p.markup).join('');
 const leaves=plant?Array.from({length:22},(_,i)=>{const x=330+i*25,y=715-Math.sin(i*.45)*28;return `<path d="M${x} 775 Q${x-30} ${y+15} ${x+5} ${y-50}" fill="none" stroke="#65774e" stroke-width="2"/><ellipse cx="${x}" cy="${y}" rx="8" ry="19" fill="#819269" transform="rotate(-35 ${x} ${y})"/><ellipse cx="${x+5}" cy="${y-35}" rx="7" ry="17" fill="#697f56" transform="rotate(35 ${x+5} ${y-35})"/>`;}).join(''):'';
 writeFileSync(`${dest}/${name}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><defs><radialGradient id="ground"><stop stop-color="#bdc2b6" stop-opacity=".35"/><stop offset="1" stop-color="#f4f3ed" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="900" fill="#f4f3ed"/><ellipse cx="600" cy="730" rx="490" ry="115" fill="url(#ground)"/>${polygons}${leaves}</svg>`);
}
for(const system of ['hub','lamella'] as JointSystem[]){
 const g=generateGeometry({footprintM2:15,riseM:2.3,strutSpacingM:.55,apertureDeg:90,jointSystem:system,speciesId:'clematis',year:0});
 const steel=buildSteel(g);
 const node=g.nodes.find(n=>n.kind==='interior'&&n.v>.3&&n.v<.7)!;
 const center=new THREE.Vector3(...node.position);
 const local:Face[]=[];
 for(const member of g.members.filter(m=>node.memberIds.includes(m.id))){const section=sectionFor(member.type,system);local.push(...solid(memberPrism(member,section.widthM,section.depthM),'wood'));}
 steel.boxes.forEach((matrix,i)=>{if(steel.boxOwners[i].nodeId===node.id)local.push(...primitive(matrix,false,'steel'));});
 steel.cylinders.forEach((matrix,i)=>{if(steel.cylOwners[i].nodeId===node.id)local.push(...primitive(matrix,true,steel.cylRoles[i]==='structural'?'steel':'bolt'));});
 const normal=new THREE.Vector3(...node.normal);const tangent=new THREE.Vector3(1,0,.25).cross(normal).normalize();
 render(`joint-${system}`,local,center,normal.multiplyScalar(2).add(tangent.multiplyScalar(.9)),.85);
 if(system==='lamella'){
  const eye=new THREE.Vector3(6,4.5,7),center=new THREE.Vector3(0,1.15,0);
  for(let stage=0;stage<10;stage++){
   const threshold=[0,.12,.24,.36,.48,.6,.74,.86,1,1][stage];
   const faces:Face[]=[];
   for(const member of g.members){
    const v=(g.nodes.find(n=>n.id===member.nodeStartId)?.v??0)+(g.nodes.find(n=>n.id===member.nodeEndId)?.v??0);
    if(stage===0 || (v/2>threshold))continue;
    const section=sectionFor(member.type,system);faces.push(...solid(memberPrism(member,section.widthM,section.depthM),'wood'));
   }
   const visible=(owner:{nodeId:string;v:number})=>stage>=8 || (stage>0?owner.v<=threshold:g.nodes.find(n=>n.id===owner.nodeId)?.kind==='ground');
   steel.boxes.forEach((matrix,i)=>{if(visible(steel.boxOwners[i]))faces.push(...primitive(matrix,false,'steel'));});
   steel.cylinders.forEach((matrix,i)=>{if(visible(steel.cylOwners[i]))faces.push(...primitive(matrix,true,steel.cylRoles[i]==='structural'?'steel':'bolt'));});
   render(`assembly-${stage}`,faces,center,eye,6.5,stage===9);
  }
 }
}

for(const file of readdirSync(dest).filter(file=>file.endsWith(".svg"))) await sharp(`${dest}/${file}`).resize(1440,1080).webp({quality:92}).toFile(`${dest}/${file.replace(".svg",".webp")}`);
