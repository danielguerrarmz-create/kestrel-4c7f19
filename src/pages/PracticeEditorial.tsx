import { useEffect, useState, useRef, type ReactNode, type CSSProperties } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { requestGarland } from '../engine/gongbi/painter';
import { PAGE_SPECIES } from './about/species';
import { CLUSTERS } from './about/clusters';
import './bower-direction.css';
import './practice-garden.css';
import { routes } from '../routing';
import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { useReducedMotion } from '../ui/useReducedMotion';
import { PROJECTS, TEAM } from './about/projects';

const MILESTONES = [
  { year: 2022, lead: 'early-2022', title: 'A shared studio', text: 'A shared desk, late nights, and the first experiments in making.', caption: 'Late nights in the studio.' },
  { year: 2023, lead: 'together', title: 'Designing with growth', text: 'Planting, materials, and machine vision opened new directions.', caption: 'Plentify: a building conceived to grow.' },
  { year: 2024, lead: 'dougherty', title: 'From models to material', text: 'Studio proposals met physical models, robotic tools, and material trials.', caption: 'Dougherty Arts Center: the catenary entrances.' },
  { year: 2025, lead: 'factory', title: 'Bringing systems together', text: 'Computation, fabrication, and landscape began to converge.', caption: 'Robotic Factory: the section assembles.' },
];
const HISTORY_CAPTIONS: Record<string, string[]> = {
  'early-2022': ['Late nights in the studio.'], medical: ['A folded-cardboard care device.'],
  together: ['Plentify: a building conceived to grow.'], research: ['Reading geometry through machine vision.'],
  making: ['Testing the Plentify composite.'], robotics: ['KUKA material experiments.', 'A Texas Robotics mechanism.'],
  llo: ['LLO: an articulated desk lamp.'], resia: ['Clay presenting Resia.'],
  dougherty: ['Dougherty Arts Center: catenary entrances.', 'The cardboard study model.', 'A shared studio review.'],
  factory: ['Robotic Factory: the section assembles.'], newyork: ['Door study at Rogers Partners, NYC.'],
};
const HISTORY_GIFS = new Map(PROJECTS.flatMap(project => project.images.filter(image=>image.video?.gif).map(image=>[image.src,image.video!.gif!])));
const DISCIPLINES = [
  ['Engineering', 'Structure and foundations.'],
  ['Fabrication', 'Timber, trials and assembly.'],
  ['Landscape', 'Planting and long-term care.'],
  ['Planning', 'Permissions for each place.'],
];

type VinePanel = { top: number; height: number; width: number; paths: [number, number][][] };
function curve(points: number[]): [number, number][] {
  const [x0,y0,x1,y1,x2,y2,x3,y3] = points;
  return Array.from({length: 61}, (_, i) => {
    const t=i/60, u=1-t;
    return [u*u*u*x0+3*u*u*t*x1+3*u*t*t*x2+t*t*t*x3, u*u*u*y0+3*u*u*t*y1+3*u*t*t*y2+t*t*t*y3];
  });
}
function spiralTip(x:number, mirror:number): [number,number][] {
  return Array.from({length:70},(_,i)=>{
    const t=i/69, angle=t*Math.PI*1.65, radius=5+t*34;
    return [x+mirror*Math.cos(angle)*radius,50+Math.sin(angle)*radius];
  });
}
function PaintedRoute({ panel }: { panel: VinePanel }) {
  const [src, setSrc] = useState<string>();
  useEffect(() => {
    let live=true;
    requestGarland({seed:PAGE_SPECIES, voice:'pigment', width:panel.width, height:panel.height+80,
      vines:panel.paths.map(path => {
        const length=path.slice(1).reduce((sum,point,i)=>sum+Math.hypot(point[0]-path[i][0],point[1]-path[i][1]),0);
        const count=Math.max(1,Math.round(length/110));
        return {path:path.map(([x,y])=>[x,y+40] as [number,number]), stations:Array.from({length:count},(_,i)=>({t:(i+.4)/(count+.5),organ:i%4===1?'bloom' as const:'leaf' as const}))};
      }),
      scale:.65, rootWidth:1.15, tube:true}).then(url=>{if(live)setSrc(url);}).catch(()=>{});
    return ()=>{live=false;};
  },[panel]);
  return src ? <img src={src} alt="" style={{position:'absolute',top:panel.top-40,left:0,width:panel.width,height:panel.height+80}}/> : null;
}
/** Measured ornament follows the media perimeter; each panel shares its end with the next. */
function ConnectedVine() {
  const ref=useRef<HTMLDivElement>(null);
  const [panels,setPanels]=useState<VinePanel[]>([]);
  useEffect(()=>{
    const main=ref.current?.parentElement;
    if(!main)return;
    let frame=0;
    const measure=()=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        const base=main.getBoundingClientRect(), width=main.clientWidth, mobile=width<768;
        const center=mobile?28:width/2;
        const opening=main.querySelector('.practice-opening-copy')?.getBoundingClientRect();
        const ending=main.querySelector('.practice-vine-signature')?.getBoundingClientRect();
        const rows=Array.from(main.querySelectorAll('.practice-milestone'));
        if(!opening||!ending||!rows.length)return;
        const start=opening.bottom-base.top+45;
        const first=rows[0].getBoundingClientRect().top-base.top;
        const h=first-start;
        const leftTip=spiralTip(width*.13,1), rightTip=spiralTip(width*.87,-1);
        const leftEnd=leftTip[leftTip.length-1], rightEnd=rightTip[rightTip.length-1];
        const out:VinePanel[]=[{top:start,height:h,width,paths:[
          mobile ? [...curve([width*.28,10,width*.8,60,center,100,center,170]),...curve([center,170,center-8,h*.5,center+8,h*.8,center,h])] : [...leftTip,...curve([leftEnd[0],leftEnd[1],width*.62,130,center-65,h*.45,center,h])],
          mobile ? curve([width*.72,0,width*.35,80,center,110,center,170]) : [...rightTip,...curve([rightEnd[0],rightEnd[1],width*.38,140,center+65,h*.45,center,h])]]}];
        rows.forEach((row,index)=>{
          const rect=row.getBoundingClientRect(), media=row.querySelector('.milestone-record')!.getBoundingClientRect();
          const top=rect.top-base.top;
          const bottom=index+1<rows.length?rows[index+1].getBoundingClientRect().top-base.top:ending.top-base.top;
          const height=bottom-top;
          // Smooth S curves through the gutter, with vertical tangents at every join.
          // The media stays on either side of this corridor; no branch crosses a caption.
          const head=row.querySelector('.milestone-copy')!.getBoundingClientRect();
          const startY=head.bottom-rect.top+20;
          const imageHeight=media.height;
          const bands=Math.max(1,Math.ceil(row.querySelectorAll('figure').length/2));
          const path:[number,number][]=[];
          let previousY=0, previousX=center;
          for(let band=0;band<=bands;band++) {
            const y=band===bands?height:startY+imageHeight*(band+.5)/bands;
            const x=band===bands?center:mobile?center+(band%2?7:-7):center+(band%2?-48:48);
            const span=y-previousY;
            path.push(...curve([previousX,previousY,previousX,previousY+span*.48,x,y-span*.48,x,y]));
            previousX=x; previousY=y;
          }
          const branches: [number, number][][] = [];
          const branch = (y: number, endX: number, variation: number, radius: number) => {
            const origin = path.reduce((best, point) => Math.abs(point[1]-y) < Math.abs(best[1]-y) ? point : best);
            const direction = Math.sign(endX-origin[0]);
            const ellipse = .72 + (variation%3)*.14;
            const turns = 1.45 + (variation%4)*.19;
            const endY = y-radius*.5;
            const twig = curve([origin[0],origin[1],origin[0]+direction*55,y-radius*.35,endX-direction*radius*.7,endY,endX,endY]);
            for (let i=1;i<=100;i++) {
              const t=i/100, angle=-Math.PI/2+t*Math.PI*turns, r=radius*(1-.87*t);
              twig.push([endX+direction*Math.cos(angle)*r,endY+radius*ellipse+Math.sin(angle)*r*ellipse]);
            }
            branches.push(twig);
          };
          if (!mobile) branch(head.height*.43, width*(index%2===0?.78:.22), index, Math.min(width*.115,head.height*.68));
          // Only branch between complete media rows, never across an image or caption.
          const figures = Array.from(row.querySelectorAll('figure')).map(figure=>figure.getBoundingClientRect()).sort((a,b)=>a.top-b.top);
          let occupiedBottom=figures[0]?.bottom ?? media.top;
          let pocket=0;
          for (const figure of figures.slice(1)) {
            const gap=figure.top-occupiedBottom;
            if (gap>=70) {
              // The two 2024 pockets have different visual clearances: lift the
              // Resia-side twig, lower the studio-review-side twig.
              const placement = index===2 ? (pocket===1?.18:pocket===2?.88:.45) : .45;
              const y=(occupiedBottom+gap*placement)-rect.top;
              branch(y, mobile ? width*(pocket%2===0?.65:.48) : width*(pocket%2===0?.25:.75), index*3+pocket+1, Math.min(gap*.34,mobile?width*.19:width*.105));
              pocket++;
            }
            occupiedBottom=Math.max(occupiedBottom,figure.bottom);
          }
          out.push({top,height,width,paths:[path,...branches]});
        });
        setPanels(previous=>JSON.stringify(previous)===JSON.stringify(out)?previous:out);
      });
    };
    const observer=new ResizeObserver(measure);observer.observe(main);measure();
    return ()=>{observer.disconnect();cancelAnimationFrame(frame);};
  },[]);
  return <div ref={ref} className="practice-contour-vines" aria-hidden="true">{panels.map((panel,i)=><PaintedRoute key={i} panel={panel}/>)}</div>;
}

function VineSignature() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const update = () => setNarrow(query.matches);
    update(); query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90%', 'end 65%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 45, damping: 22, mass: .8 });
  const opacity = useTransform(progress, [.55, .95], [0, 1]);
  const wordOpacity = useTransform(progress, [.72, 1], [0, 1]);
  const stemOpacity = useTransform(progress, [.38, .58], [1, 0]);
  const scale = useTransform(progress, [.55, 1], [.65, 1]);
  const curl = useTransform(progress, [0, .65], [
    `M${narrow ? 0 : 100} 0 C100 60 100 90 100 140 C100 180 100 220 100 260`,
    `M${narrow ? 0 : 100} 0 C100 80 185 135 145 210 C85 305 5 175 100 160`,
  ]);
  return <div ref={ref} className="practice-vine-signature" aria-hidden="true">
    <svg viewBox="0 0 200 320" preserveAspectRatio="none" fill="none">
      <motion.path d={curl} stroke="#738369" strokeWidth="1.4" style={{ pathLength: reduced ? 1 : progress, opacity: reduced ? 0 : stemOpacity }} />
    </svg>
    <motion.img className="signature-emblem" src="/assets/brand/bower-logo-evergreen-emblem.png" alt="" style={{ opacity: reduced ? 1 : opacity, scale: reduced ? 1 : scale }} />
    <motion.div className="signature-wordmark" style={{ opacity: reduced ? 1 : wordOpacity }}><img src="/assets/brand/bower-logo-evergreen-horizontal.png" alt="" /></motion.div>
  </div>;
}

export function PracticeEditorial({ portfolio }: { portfolio?: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <div className="practice-renewed practice-garden editorial-page">
      <main>
        <ConnectedVine />
        <section className="practice-opening relative">
          <EditorialHeader logoSrc="/assets/brand/bower-logo-evergreen-horizontal-transparent.png" />
          <div className="practice-opening-copy">
            <h1>A shared curiosity.</h1>
            <div className="practice-questions">
              <p>How can a building become more alive with time?</p>
              <p>What if nature could shape its future, helping the landscape regenerate as it grows?</p>
            </div>
          </div>
        </section>

        <div className="practice-growing-story">
          <section className="practice-people" aria-label="Founders">
            <div className="practice-founders">
              {TEAM.map((person) => <article key={person.id} className="practice-person">
                <div className="practice-person-heading">
                  {person.image && <img src={person.image} alt={person.name} loading="lazy" />}
                  <h3>{person.name}</h3>
                </div>
                <p className="practice-person-role">{person.id === 'clay' ? 'Cofounder · Design & research' : 'Cofounder · Engine & systems'}</p>
                <p>{person.facts.find((fact) => fact.label === 'Built')?.value}</p>
              </article>)}
            </div>
          </section>

          <section className="practice-history" aria-label="Our history">
            <div className="practice-milestones">
              {MILESTONES.map((milestone) => {
                const clusters = CLUSTERS.filter(cluster => Math.floor(cluster.year) === milestone.year);
                const items = clusters.flatMap(cluster => cluster.nodes.filter(node=>!node.media.pending).map((node,index)=>({media:node.media,caption:HISTORY_CAPTIONS[cluster.id]?.[index] ?? cluster.hint})));
                return <article className="practice-milestone timeline-chapter" key={milestone.year}>
                  <header className="milestone-copy">
                    <p className="milestone-year">{milestone.year}</p>
                    <h3>{milestone.title}</h3>
                    <p>{milestone.text}</p>
                  </header>
                  <div className="milestone-record">
                    {items.map(({media,caption},index)=><figure key={media.src} className={`timeline-plate timeline-plate-${index%4}`} style={{'--media-ratio':media.ratio} as CSSProperties}>
                        {HISTORY_GIFS.has(media.src) && !reduced ? <img src={HISTORY_GIFS.get(media.src)} alt={media.alt} loading="lazy" style={{aspectRatio:media.ratio}} /> : media.video ? <video autoPlay={!reduced} loop muted controls={reduced} playsInline preload="metadata" poster={media.src} aria-label={media.alt}><source src={media.video.mp4} type="video/mp4" /></video> : <img src={media.src} alt={media.alt} loading="lazy" style={{aspectRatio:media.ratio,objectFit:media.fit??'contain'}}/>}
                        <figcaption><span>{milestone.year} · </span>{caption}</figcaption>
                    </figure>)}
                  </div>
                </article>;
              })}
            </div>
            <VineSignature />
          </section>

          <section className="practice-record" aria-labelledby="projects-title">
            <div className="practice-section-heading">
              <h2 id="projects-title">Projects &amp; research.</h2>
            </div>
            <div className="practice-portfolio-frame">{portfolio}</div>
          </section>

          <section className="practice-delivery" aria-labelledby="delivery-title">
            <div className="practice-section-heading">
              <h2 id="delivery-title">Building living structures together.</h2>
              <p>We are forming the specialist partnerships for Bower’s first permanent works. Each team will be shaped around its landscape.</p>
            </div>
            <div className="practice-disciplines">
              {DISCIPLINES.map(([title, description]) => <div key={title}><h3>{title}</h3><p>{description}</p></div>)}
            </div>
            <div className="practice-invitation practice-invitation-merged">
              <a href={routes.contact}>Start a commission <span aria-hidden="true">↗</span></a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
