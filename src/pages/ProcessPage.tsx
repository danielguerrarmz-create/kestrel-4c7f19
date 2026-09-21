import { useState, useId, type ReactNode } from 'react';
import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { srcSetFor } from '../ui/responsiveImg';
import parts from '../data/process-parts.json';
import './bower-direction.css';
import './process-journey.css';

const study=(name:string)=>`/assets/studies/${name}.webp`;

function Photo({src,alt,eager=false}:{src:string;alt:string;eager?:boolean}) {
 return <img src={src} srcSet={srcSetFor(src)} sizes="(max-width:767px) 1000px,100vw" alt={alt} loading={eager?'eager':'lazy'}/>;
}
function Detail({title,children}:{title:string;children:ReactNode}) {
 const [open,setOpen]=useState(false);
 const id=useId();
 return <div className="process-detail"><button className="process-detail-toggle" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(!open)}>{title}<span aria-hidden="true">{open?'−':'+'}</span></button><div id={id} className={`process-detail-body ${open?'is-open':''}`} aria-hidden={!open}>{children}</div></div>;
}
const siteTopics=[
 {name:'Sun & shelter',text:'Follow the light through the day. Decide where a canopy should shade, open or shelter, and which plants will thrive there.',x:67,y:22},
 {name:'Views & movement',text:'Keep the views that matter. Place openings around the way people arrive, gather and move through the garden.',x:47,y:62},
 {name:'Ground & planting',text:'Understand levels, roots, soil and access before choosing where the structure meets the ground.',x:24,y:78},
];
function SiteReading(){
 const [active,setActive]=useState(0);
 const topic=siteTopics[active];
 return <div className="site-reading">
  <div className="site-reading-image"><Photo src={study('growth-01-installation')} alt="Garden design study used to illustrate sunlight, movement and ground considerations"/>
   <div className="site-marker" style={{left:`${topic.x}%`,top:`${topic.y}%`}} aria-hidden="true"><span/>{topic.name}</div>
   <span className="image-note">Illustrative site study</span>
  </div>
  <div className="site-reading-notes"><div className="process-choices" aria-label="Site considerations">{siteTopics.map((item,i)=><button key={item.name} aria-pressed={active===i} onClick={()=>setActive(i)}>{item.name}</button>)}</div><p aria-live="polite">{topic.text}</p></div>
 </div>;
}
function PartsWorkbench(){
 const [choice,setChoice]=useState(1);
 const current=parts[choice];
 const sample=current.pieces.slice(0,8);
 const max=Math.max(...parts.flatMap(p=>p.pieces.map(piece=>piece.lengthM)));
 return <div className="parts-workbench">
  <div className="parts-explanation"><h3>Change the size.<br/>Recalculate the parts.</h3><p>These three studies come from Bower Engine. Choose a footprint to see its timber schedule update.</p>
   <div className="process-choices" aria-label="Example footprint">{parts.map((part,i)=><button key={part.footprintM2} aria-pressed={choice===i} onClick={()=>setChoice(i)}>{part.footprintM2} m²</button>)}</div>
   <dl aria-live="polite"><div><dt>Timber pieces</dt><dd>{current.count}</dd></div><div><dt>Total timber length</dt><dd>{current.lengthM} <small>m</small></dd></div></dl>
   <p className="process-fine">Precomputed engine studies. Same height, spacing and joint family. Engineering and fabrication review remain ahead.</p>
  </div>
  <figure className="parts-drawing"><svg viewBox="0 0 640 465" role="img" aria-label={`Eight sample timber lengths from the ${current.footprintM2} square metre engine study`}>
   <defs><linearGradient id="timber-face" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d8bd94"/><stop offset="1" stopColor="#b49267"/></linearGradient></defs>
   {sample.map((piece,i)=>{const y=38+i*53,w=piece.lengthM/max*415;return <g key={piece.id}>
    <path d={`M42 ${y} l8 -7 h${w} l-8 7 Z`} fill="#ead6b6"/>
    <path d={`M${42+w} ${y} l8 -7 v23 l-8 7 Z`} fill="#917653"/>
    <rect x="42" y={y} width={w} height="23" fill="url(#timber-face)"/>
    {[6,11,17].map(offset=><path key={offset} d={`M48 ${y+offset} Q${70+w*.35} ${y+offset-3} ${36+w} ${y+offset}`} fill="none" stroke="#8b6b43" strokeOpacity=".23"/>) }
    <path d={`M${w+58} ${y+11} H515`} stroke="#b6bcaf" strokeDasharray="2 4"/>
    <text x="632" textAnchor="end" y={y+16} fill="#354d40" fontSize="14">{Math.round(piece.lengthM*1000)} mm</text>
   </g>})}
  </svg><figcaption>Sample piece lengths from the model, not machining profiles.</figcaption></figure>
 </div>;
}
function JointStudy(){
 return <figure className="joint-study"><div className="joint-placeholder" role="img" aria-label="Joint detail image placeholder"><span>Joint detail</span><small>Image to come</small></div></figure>;
}
function AssemblyPlaceholder(){
 return <figure className="assembly-placeholder process-video-placeholder" role="img" aria-label="Placeholder for a Bower assembly film"><p>Bower assembly film</p><span className="placeholder-status">Video to come</span></figure>;
}
const growth=[
 {name:'Frame',image:'growth-01-installation',text:'Prepare the planting beds and support system alongside the timber frame.'},
 {name:'Establishing',image:'growth-02-establishing',text:'Train new growth, water through establishment and check ties as stems develop.'},
 {name:'Maturing',image:'growth-03-mature',text:'Prune, inspect and maintain access to the structure as the planting fills out.'},
];
function LivingSequence(){
 const [active,setActive]=useState(0);
 return <div className="living-sequence"><figure><Photo key={growth[active].name} src={study(growth[active].image)} alt={`${growth[active].name} planting design study`}/><figcaption>Illustrative growth sequence. Timing and coverage depend on species, site and care.</figcaption></figure><div className="living-sequence-controls"><div className="process-choices" aria-label="Planting stages">{growth.map((item,i)=><button key={item.name} aria-pressed={i===active} onClick={()=>setActive(i)}>{item.name}</button>)}</div><p aria-live="polite">{growth[active].text}</p></div></div>;
}
export function ProcessPage(){
 return <div className="bower-v2 process-workshop"><EditorialHeader tone="white"/><main>
  <section className="workshop-opening" aria-labelledby="process-title"><Photo src="/assets/gallery/favorites/timber-joinery-detail.webp" alt="Close-up design study of timber grain and a pegged connection" eager/><h1 id="process-title">Making<br/><em>a Bower.</em></h1><span className="image-note">Timber connection study</span></section>
  <section className="workshop-site" aria-labelledby="site-title"><div className="workshop-introduction"><h2 id="site-title">First, the place.</h2><p>Before drawing a structure, we look at how you want to use it, what already grows there and what the landscape needs.</p><p>Sun, views, access and ground conditions help shape the brief.</p></div><SiteReading/><Detail title="What we establish on site"><p>A survey, orientation, existing trees, soil conditions, access and the planning route inform the design. Our engine helps study geometry and sunlight; it does not replace a site survey or planning advice.</p></Detail></section>
  <section className="workshop-form" aria-labelledby="form-title"><div className="workshop-form-copy"><h2 id="form-title">Drawing the form.</h2><p>A low canopy can make a room in a garden. A taller opening can frame a view or welcome a gathering.</p><p>We explore the footprint, height and openings together. Bower Engine carries those choices into the geometry of the frame and its individual timber pieces.</p><Detail title="How the model responds"><p>The current engine varies footprint, rise, lattice spacing, opening direction and joint family. It generates identified members and connections, then derives piece lengths and a material schedule. Structural performance still requires specialist review.</p></Detail></div><figure><Photo src={study('swept-garden-canopy')} alt="Design study of an open timber canopy shaped around a garden"/><figcaption>Form study</figcaption></figure></section>
  <section className="workshop-parts" aria-label="From form to timber pieces"><PartsWorkbench/></section>
  <section className="workshop-joints" aria-labelledby="joints-title"><JointStudy/><div><h2 id="joints-title">Working out<br/>the meeting.</h2><p>Each piece needs a place, an angle and a connection. Those meetings are resolved alongside the overall form.</p><p>Timber, metalwork and planting supports have different jobs. We develop the details with structural and fabrication partners, then test how they fit and weather.</p></div></section>
  <section className="workshop-making" aria-labelledby="making-title"><div className="workshop-introduction"><h2 id="making-title">From model to workshop.</h2><p>Piece lengths, profiles and connection details become the starting point for fabrication. Trial cuts and physical mock-ups check what a model cannot: tool access, fit, grain and finish.</p></div><figure className="workshop-film"><div className="process-video-placeholder" role="img" aria-label="Placeholder for a Bower fabrication film"><span aria-hidden="true">▷</span><p>Bower fabrication film</p><small>Cutting, connection trials and workshop assembly</small><span className="placeholder-status">Video to come</span></div></figure><div className="workshop-making-notes"><p>The engine groups timber pieces and studies how they fit into stock lengths and sheets. The fabricator develops the machine operations and checks the results through trials.</p><Detail title="From a schedule to machine instructions"><p>The current stock layout uses conservative packing estimates. It is not validated CNC toolpath code. Tooling, fixtures, tolerances and production timing must be resolved with the fabrication partner before manufacture.</p></Detail></div></section>
  <section className="workshop-assembly" aria-labelledby="assembly-title"><div className="workshop-introduction"><h2 id="assembly-title">Putting it together.</h2><p>Assembly is planned before the pieces leave the workshop. Ground conditions, delivery access and the order of installation belong in the same conversation.</p></div><AssemblyPlaceholder/></section>
  <section className="workshop-growing" aria-labelledby="growing-title"><div className="workshop-introduction"><h2 id="growing-title">A structure for growth.</h2><p>The timber gives the plants a framework. Planting brings shade, seasonal change and a different character over time.</p><p>Species, growing conditions and ongoing care are considered from the first design conversations.</p></div><LivingSequence/></section>
  <section className="workshop-close"><h2>Tell us about<br/><em>your place.</em></h2><a href="/contact">Start a conversation <span aria-hidden="true">↗</span></a><p>Structural, manufacturing and delivery partnerships for the first permanent works are forming.</p></section>
 </main><Footer/></div>;
}
