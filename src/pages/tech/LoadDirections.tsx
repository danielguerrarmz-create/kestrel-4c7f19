import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../ui/useReducedMotion';
import { observeVisibleLoop } from './visibleLoop';

const cases = [
  { id: 'planting', label: 'Timber + planting', description: 'Timber and planting weight acts downwards across the canopy.' },
  { id: 'wind', label: 'Wind + uplift', description: 'Wind crosses the canopy; uplift acts upwards beneath it.' },
  { id: 'snow', label: 'Snow + ice', description: 'Seasonal accumulation adds downward load across the canopy.' },
] as const;

/** The same Bower model in every view makes the changing force directions comparable. */
export function LoadDirections() {
  const [selected, setSelected] = useState(0);
  const [instant, setInstant] = useState(true);
  const [paused, setPaused] = useState(false);
  const controller = useRef<ReturnType<typeof observeVisibleLoop>>();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!ref.current || reduced) return;
    const loop = observeVisibleLoop(ref.current, () => {
      setInstant(false);
      setSelected(index => (index + 1) % cases.length);
    }, 2500);
    controller.current = loop;
    return () => { loop.dispose(); controller.current = undefined; };
  }, [reduced]);
  function pause(value: boolean) {
    controller.current?.setPaused(value);
    setPaused(value);
  }
  useEffect(() => { controller.current?.setPaused(paused); }, [paused, reduced]);
  const current = cases[selected];
  return <figure ref={ref} className="tech-load-directions" data-case={current.id} data-instant={instant || reduced || paused}>
    <svg id="load-direction-view" viewBox="0 0 1212 1130" role="img" aria-labelledby="load-directions-title load-directions-desc">
      <title id="load-directions-title">{`${current.label}: loads on a Bower`}</title>
      <desc id="load-directions-desc">{current.description} Arrows indicate directions, not calculated magnitudes or deformation.</desc>
      <defs>
        <marker id="load-direction-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="4.5" markerHeight="4.5" orient="auto">
          <path d="M2 2 10 6 2 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      <image href="/assets/tech/bower-engine-one-perspective.webp" x="0" y="140" width="1212" height="979" className="tech-load-model" />
      <g key={current.id} className="tech-load-overlay" transform="translate(0 140)">
        {current.id === 'planting' && <>
          <g className="tech-load-foliage" fill="none" stroke="#526d45" strokeLinecap="round" strokeLinejoin="round">
            <path d="M190 425 Q315 340 410 238 Q450 190 496 153 M470 471 Q535 290 554 169 M758 176 Q830 300 1052 393" strokeWidth="22" strokeOpacity=".36" />
            <path d="M190 425 Q315 340 410 238 Q450 190 496 153 M470 471 Q535 290 554 169 M758 176 Q830 300 1052 393" strokeWidth="3" />
            {[[260,378,-35],[325,319,-35],[389,255,-30],[449,197,-28],[491,409,-60],[516,332,-65],[540,240,-65],[810,247,40],[884,315,35],[968,365,25]].map(([x,y,angle],i)=><path key={i} transform={`translate(${x} ${y}) rotate(${angle})`} d="M-12 0 Q-8-24 13-20 Q19-4-12 0 M0 0 Q13 24 31 15 Q25-5 0 0" fill="#637c4f" strokeWidth="1.5" />)}
          </g>
          <g className="tech-load-force tech-load-force--down">
            <path d="M260 126 V287" />
            <path d="M450 -33 V125" />
            <path d="M660 -114 V17" />
            <path d="M860 18 V177" />
            <path d="M1040 137 V295" />
          </g>
        </>}
        {current.id === 'wind' && <>
          <g className="tech-load-force tech-load-force--wind">
            <path d="M55 140 C200 140 248 45 410 45" />
            <path d="M95 250 C255 250 270 136 446 136" />
            <path d="M830 71 C950 71 996 150 1145 150" />
          </g>
          <g className="tech-load-force tech-load-force--up">
            <path d="M390 720 V555" />
            <path d="M620 688 V523" />
            <path d="M865 710 V545" />
          </g>
        </>}
        {current.id === 'snow' && <>
          <g fill="none" stroke="#a4b6b1" strokeWidth="20" strokeLinecap="round" strokeOpacity=".7">
            <path d="M238 242 Q367 196 454 123 M759 102 Q878 209 1026 240 M334 356 Q451 299 510 206" />
          </g>
          <g fill="none" stroke="#f0f4f2" strokeWidth="12" strokeLinecap="round">
            <path d="M238 237 Q367 191 454 118 M759 97 Q878 204 1026 235 M334 351 Q451 294 510 201" />
          </g>
          <g className="tech-load-force tech-load-force--down">
            <path d="M260 24 V185" />
            <path d="M450 -93 V65" />
            <path d="M660 -114 V17" />
            <path d="M860 -42 V117" />
            <path d="M1040 47 V205" />
          </g>
        </>}
      </g>
    </svg>
    <figcaption>
      <div className="tech-load-controls" role="group" aria-label="Load cases">
        {cases.map((loadCase, index) => <button key={loadCase.id} type="button"
          aria-pressed={selected === index} aria-controls="load-direction-view"
          onClick={() => { pause(true); setInstant(true); setSelected(index); }}>{loadCase.label}</button>)}
        {!reduced && <button type="button" onClick={() => pause(!paused)}>
          {paused ? 'Play animation' : 'Pause animation'}
        </button>}
      </div>
      <p className="tech-load-explanation">{current.description}</p>
      <p className="tech-caption"><span className="tech-force-key" aria-hidden="true">↓</span> {current.label}. Load directions, schematic.</p>
    </figcaption>
  </figure>;
}
