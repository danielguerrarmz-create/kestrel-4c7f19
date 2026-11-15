# From room to canopy — additional v8 camera test

This is a new slide after the two existing Time drawings. Their source, films,
players and slide definitions are unchanged. `canopy-orbit.js` inserts the test
after the original edition has assembled its eighteen scenes; the displayed
sequence therefore contains nineteen slides. The story map uses the same insert.

## The two projections

Both films use the unchanged `six-bay-radial-v1` building release and the full
`trained-10y` growth record, read through the existing drawing studio.

- **Perspective:** a 33.398° vertical lens, with an authored framing adjustment.
  Near members appear larger and parallel lines converge.
- **Axonometric:** an actual orthographic camera. Parallel lines stay parallel
  and equal objects keep the same scale at different depths. The visible field
  changes gently to accommodate the changing elevation; camera distance does
  not supply perspective scaling.

Both follow the same 360° orbit. Eye height moves from 1.7 m to 3 m, returns to
1.9 m, then rises through 4.8 m and 16 m to 36 m. The initial plan radius is
21.03 m. From playback second 34 it eases inward, reaching zero radius at second
49: the camera is directly above its target, looking vertically down. A changing
up vector preserves orientation through the final vertical view without a flip.
The overhead view is uncut: it shows the complete canopy, not the studio's
roof-cut plan. The final frame holds for six seconds before looping.

Assembly occupies seconds 0–12 in ink; a two-second material transition begins
when the room is standing. Planting begins on 12 March 2027, scenario day 11.
Growth runs from playback seconds 13–49, ending on 20 June 2036, day 3399.
The date is a scenario clock, not a forecast. The assembly sequence is generated
geometry, not a validated erection method or construction schedule. Timber
appearance is illustrative.

## Inhabitants and occlusion

The new films render the same authored walking routes, looking and flower
gestures using the existing CC0 Quaternius skinned person. Each person is one
articulated body. Pose transitions interpolate its skeleton, rather than
crossfading separate raster silhouettes. The feet are recentered and checked
against their authored route for every frame. The studio's depth buffer lets
timber and leaves hide people correctly, including during the overhead turn.
The original Time slide's separate sprite/depth compositor is unchanged.

Birds use small original 3D silhouettes following the existing authored flights
and flower visit. People and birds are illustrative occupation, not behavioural,
collision, accessibility or habitat simulations. See the existing
[inhabitant asset licence](../inhabitants/SOURCES.md) and
[flower-visit provenance](../time-experiment/SOURCES.md).

## Browser delivery and reproduction

The films render at 1600 × 900 and 12 fps, then encode as 24 fps H.264 with
repeated frames, no audio and fast-start metadata. The entire scene, including
inhabitants, is pre-rendered. No plant, timber or human meshes load in the deck.
Autoplay, pause, exact seeking, a shared black timeline and projection switching
remain available. Reduced-motion settings open at the held overhead view.
Print and load failure use the selected projection's overhead still.

`manifest.json` records media hashes and source clocks. The camera JSON files
record the source-coordinate eye, target and up vectors, as well as Three.js
projection, view and combined matrices. The two projection matrices can therefore
be inspected independently of their appearance.

From the Auxin repository root, with the existing dependencies installed:

```powershell
node deck/designx/v8/scripts/render-canopy-orbit.mjs --probe
node deck/designx/v8/scripts/render-canopy-orbit.mjs
node deck/designx/v8/scripts/check-canopy-camera.mjs
node deck/designx/v8/scripts/check-canopy-browser.mjs
```

Run render jobs serially on this machine. Full-model input, generators and frozen
releases are read in place. Frames and review images stay in ignored `.qa/`;
only the new films, camera records, posters, manifest and provenance belong here.
