import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../ui/useReducedMotion';
import { observeIntroduction } from './introduction';

/** Explanatory geometry and force directions, not calculated structural behaviour. */
export function LoadDirections() {
  const ref = useRef<HTMLElement>(null);
  const played = useRef(false);
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState('complete');
  useEffect(() => {
    if (!ref.current || reduced || played.current) { played.current ||= reduced; setPhase('complete'); return; }
    setPhase('ready');
    const intro = observeIntroduction(ref.current, {
      duration: 6600,
      onStart: () => { played.current = true; setPhase('playing'); },
      onFinish: () => setPhase('complete'),
    });
    return intro.dispose;
  }, [reduced]);
  return <figure ref={ref} className="tech-load-directions" data-intro={phase}>
    <svg viewBox="0 0 720 235" role="img" aria-labelledby="load-directions-title load-directions-desc">
      <title id="load-directions-title">Loads on a planted canopy</title>
      <desc id="load-directions-desc">Three schematic perspective views show planting weight descending, wind crossing the canopy with uplift underneath, and snow settling before its weight is applied. Arrows show directions only; the canopy does not deform.</desc>
      <defs>
        <marker id="load-direction-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1 7 4 1 7" fill="none" stroke="currentColor" strokeWidth="1.2" /></marker>
        <g id="load-direction-canopy" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round">
          <path d="M28 181 C28 116 172 116 172 181 L196 161 C196 96 52 96 52 161 Z" fill="currentColor" fillOpacity=".035" />
          <path d="M52 199 V161 C52 96 196 96 196 161 V199 M28 219 V181 C28 116 172 116 172 181 V219 M34 219 V181 C34 124 166 124 166 181 V219" />
          <g strokeOpacity=".5" strokeWidth="1"><path d="M28 181 52 161 M36 157 60 137 M55 142 79 122 M78 134 102 114 M100 132 124 112 M122 134 146 114 M145 142 169 122 M164 157 188 137 M172 181 196 161 M28 219 52 199 M172 219 196 199" /><path d="M40 171 C40 106 184 106 184 171" /></g>
          <path d="M18 221 H43 M162 221 H187 M45 201 H62 M186 201 H207" />
        </g>
        <g id="load-leaf" fill="currentColor" stroke="currentColor" strokeWidth=".8"><path d="M0 6 Q-15 1-10-10 Q2-8 0 6 M1 3 Q12-12 16-4 Q16 6 1 3" /><path d="M0 6 0 12" fill="none" /></g>
        <g id="load-snowflake" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M0-6V6 M-5-3 5 3 M-5 3 5-3" /></g>
      </defs>
      <g className="tech-load-canopies"><use href="#load-direction-canopy" /><use href="#load-direction-canopy" x="240" /><use href="#load-direction-canopy" x="480" /></g>
      <g className="load-planting load-motion"><use href="#load-leaf" x="52" y="137" /><use href="#load-leaf" x="86" y="124" /><use href="#load-leaf" x="124" y="126" /><use href="#load-leaf" x="155" y="142" /></g>
      <g className="tech-load-forces" fill="none" stroke="currentColor" strokeWidth="1.7" markerEnd="url(#load-direction-arrow)">
        <g className="load-weight load-motion">{['M56 53 V106', 'M100 42 V93', 'M144 53 V107'].map(d => <path key={d} d={d} />)}</g>
        <g className="load-wind load-motion">{['M245 123 C264 123 270 98 290 98', 'M249 145 C269 145 277 114 302 114', 'M256 79 C282 79 293 86 320 86'].map(d => <path key={d} d={d} />)}</g>
        <g className="load-uplift load-motion">{['M322 195 V160', 'M363 195 V160'].map(d => <path key={d} d={d} />)}</g>
        <g className="load-snow-weight load-motion">{['M536 53 V106', 'M580 42 V93', 'M624 53 V107'].map(d => <path key={d} d={d} />)}</g>
      </g>
      <g className="tech-load-season">
        <g className="load-snowflakes"><use href="#load-snowflake" x="525" y="98" /><use href="#load-snowflake" x="558" y="80" /><use href="#load-snowflake" x="600" y="85" /><use href="#load-snowflake" x="646" y="109" /></g>
        <path className="load-snow-cap load-motion" d="M512 165 C530 120 630 120 648 165" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
    <div className="tech-load-labels" aria-hidden="true"><span>Timber + planting</span><span>Wind + uplift</span><span>Snow + ice</span></div>
    <figcaption className="tech-caption">Load directions, schematic</figcaption>
  </figure>;
}
