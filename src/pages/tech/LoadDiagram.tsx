import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useReducedMotion } from '../../ui/useReducedMotion';
import { observeIntroduction } from './introduction';
import loads from './loads.generated.json';

export function LoadDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const played = useRef(false);
  const reduced = useReducedMotion();
  const [baseReady, setBaseReady] = useState(false);
  const [phase, setPhase] = useState('complete');
  useEffect(() => {
    if (!ref.current || reduced || played.current) { played.current ||= reduced; setPhase('complete'); return; }
    setPhase('ready');
    if (!baseReady) return;
    const intro = observeIntroduction(ref.current, {
      duration: 6000,
      onStart: () => { played.current = true; setPhase('playing'); },
      onFinish: () => setPhase('complete'),
    });
    return intro.dispose;
  }, [reduced, baseReady]);
  return <div ref={ref} className="tech-load-diagram" data-intro={phase}>
    <img src="/assets/tech/gridshell-c3-base.svg" width={loads.width} height={loads.height} loading="lazy" decoding="async" onLoad={() => setBaseReady(true)} alt="Earlier gridshell load study with plant-load arrows distributed across the canopy and supports shown in black" />
    <svg viewBox={`0 0 ${loads.width} ${loads.height}`} aria-hidden="true" focusable="false">
      {loads.groups.map((group, index) => <g key={index} className="tech-load-wave" style={{ animationDelay: group.delay * 3.4 + 'ms' } as CSSProperties}>
        <path d={group.path} fill="none" stroke="#b16a36" strokeWidth="2.1" />
        {group.tips.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" fill="#b16a36" />)}
      </g>)}
    </svg>
  </div>;
}
