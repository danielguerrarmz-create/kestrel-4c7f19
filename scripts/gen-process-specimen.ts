/** Static specimen only; the development engine remains private. */
import { writeFileSync } from "node:fs";
import { generateGeometry } from "../src/engine/geometry";
const geometry = generateGeometry({
  footprintM2: 15,
  riseM: 2.3,
  strutSpacingM: 0.55,
  apertureDeg: 90,
  jointSystem: "lamella",
  speciesId: "clematis",
  year: 0,
});
writeFileSync(
  "src/data/process-specimen.json",
  JSON.stringify(
    geometry.members.map((m) => ({
      id: m.id,
      piece: m.pieceId,
      a: m.start,
      b: m.end,
    })),
  ) + "\n",
);
