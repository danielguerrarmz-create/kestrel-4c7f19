# Light: a more developed establishment state

This v8-owned export replaces the middle panel of the existing Light drawing.
The original `04-plants-make-space-timber` export and its source plate are unchanged.

The old middle panel showed **21 June 2029** from the `trained-10y` run. The revised
panel shows **21 June 2033** from that same record. The camera, timber, midsummer
sun path, shadow opacity and plant renderer are unchanged. Installation and mature
panels are retained from the original exported images. All 37 frames use the same
6 am–6 pm day sequence and captions.

## Why this state

The brief asks for an establishment drawing that reads as about half covered.
No plants were painted in or fabricated. Noon candidates from 2029 through 2034
were rendered from the existing simulated record and visually compared. The 2033
state has substantial, uneven leaf shade while retaining clear patches of open
lattice; it sits visibly between installation and the mature state.

`probe.json` records a digital image comparison used to help choose the state:
extra noon projected-shadow alpha within the mature shadow footprint, normalized
from installation=0 to mature=1. The old 2029 image scores 0.0228; 2033 scores 0.5060.
This is **not physical canopy coverage**, a field observation, a forecast, or a
claim that the plants will reach this state in that year. Growth remains a scenario
on the source model's provisional assumptions.

## Inputs and reproduction

- Snapshot: `releases/six-bay-radial-v1/` (unchanged).
- Growth: `drawings-in-code/scenes/six-bay-radial-v1/runs/trained-10y/growth.json`.
- Source recipe: `drawings-in-code/plates/04-plants-make-space.json`.
- Rendering: the existing `studio.plate` API, whole growth record, timber=wood,
  plan view cut 2 m above ground, paper EEF3EA, ink 102820, shade 0.36.
- Output: 37 WebP frames, 2234 × 652 px. Each panel 726 px; gutters 28 px. The new middle
  occupies x 754–1479; its pixels can also be used as a standalone replacement.

Run from the repository root:

```powershell
node deck/designx/v8/scripts/render-light-establishment.mjs --probe
node deck/designx/v8/scripts/render-light-establishment.mjs --date=2033-06-21
```

The script writes this asset directory and ignored visual-check images under v8/.qa/light-establishment. Rendering requires the existing local
studio and simulator dependencies; browsing the finished deck requires only the
exported images and manifest. `manifest.json` records the selected date, source
recipe hash, output hashes, shared sun moments and capability statement.
