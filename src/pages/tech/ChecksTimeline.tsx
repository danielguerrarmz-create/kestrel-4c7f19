import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../ui/useReducedMotion';
import { observeIntroduction } from './introduction';

const stages = [
  { title: 'Forming the timber', points: [
    'Our engine screens each rib for bending and twist against material and forming assumptions.',
    'It compares alternative forms and groups ribs by their forming requirements.',
  ] },
  { title: 'Assembling the geometry', points: [
    'We checked for closed solids, contact between parts and agreement between crossing geometry and joint records.',
    'Unresolved contacts and connections were recorded for review.',
  ] },
  { title: 'Testing the connections', points: [
    'Modelled allowances give us something specific to prototype.',
    'Physical forming trials, joint testing and engineering review must establish the production fit and capacity.',
  ] },
];

/** A one-time reading cue, never a gate: future stages remain legible throughout. */
export function ChecksTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const played = useRef(false);
  const controller = useRef<ReturnType<typeof observeIntroduction>>();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState('complete');
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!ref.current || reduced || played.current) {
      played.current ||= reduced;
      setPhase('complete');
      return;
    }
    setPhase('ready');
    const intro = observeIntroduction(ref.current, {
      duration: 11100,
      steps: [3300, 7100],
      onStart: () => { played.current = true; setPhase('playing'); },
      onStep: index => setActive(index + 1),
      onFinish: () => setPhase('complete'),
    });
    controller.current = intro;
    return intro.dispose;
  }, [reduced]);

  return <div ref={ref} className="tech-checks-guide" data-intro={phase}>
    <ol className="tech-checks-timeline" aria-label="Design review stages">
      {stages.map((stage, index) => <li key={stage.title}
        data-reached={phase === 'complete' || index <= active}
        data-active={phase === 'playing' && index === active}>
        <span className="tech-checks-track" aria-hidden="true"><i /></span>
        <div className="tech-checks-content">
          <h3>{stage.title}</h3>
          <ul>{stage.points.map(point => <li key={point}>{point}</li>)}</ul>
        </div>
      </li>)}
    </ol>
    <div className="tech-checks-controls">
      <button type="button" onClick={() => controller.current?.stop()}
        tabIndex={phase === 'complete' ? -1 : 0} disabled={phase === 'complete'}>Show all</button>
    </div>
  </div>;
}
