import { useState } from "react";
import members from "../data/process-specimen.json";
export function ProcessSpecimen() {
  const [isolated, setIsolated] = useState(false);
  const [part, setPart] = useState(0);
  const pieces = [...new Set(members.map((m) => m.piece))];
  const chosen = pieces[part];
  const point = (p: number[]) => [
    350 + (p[0] * 0.84 - p[2] * 0.54) * 100,
    360 + (p[0] * 0.28 + p[2] * 0.4 - p[1]) * 100,
  ];
  return (
    <figure className="process-specimen">
      <svg
        viewBox="0 0 700 500"
        role="img"
        aria-label={
          isolated
            ? "One component highlighted within the computational prototype"
            : "Centreline geometry of a Bower computational prototype"
        }
      >
        {members.map((m) => {
          const a = point(m.a),
            b = point(m.b);
          const active = m.piece === chosen;
          return (
            <line
              key={m.id}
              x1={a[0]}
              y1={a[1]}
              x2={b[0]}
              y2={b[1]}
              stroke={isolated && active ? "#354d40" : "#8a9c8a"}
              strokeWidth={isolated && active ? 5 : 1.2}
              opacity={isolated && !active ? 0.16 : 1}
            />
          );
        })}
      </svg>
      <div className="specimen-controls">
        <button onClick={() => setIsolated(!isolated)} aria-pressed={isolated}>
          {isolated ? "See the whole" : "Find the part"} ↗
        </button>
        {isolated && (
          <button onClick={() => setPart((part + 1) % pieces.length)}>
            Next component →
          </button>
        )}
      </div>
      <figcaption>
        Computational prototype / centreline study.{" "}
        {isolated ? `Component ${part + 1} of ${pieces.length}. ` : ""}Not an
        engineered or production-ready design.
      </figcaption>
    </figure>
  );
}
