# A room through time: camera and material experiment

This is a separate v8 study. The original `approach-ink` film and the existing
Time slide are retained. These films do not load timber or plant meshes in the
presentation browser: they are rendered beforehand from the existing model.

## The same room, three camera treatments

- **Low orbit:** a 180-degree arc at a constant 21.03 m plan radius, using the
  original approach lens. Eye height rises gradually from 1.7 m to 2.6 m. It
  ends opposite the original approach, looking through the corresponding bay.
- **Rising orbit:** the same radial arc and timing, with eye height rising to
  16 m. This is an elevated comparison of enclosure and canopy, not the
  preferred representation of standing inside the room.
- **Eye-level:** the matching original ink and timber approach films, with
  their fixed camera preserved. The baked title and old timeline are cropped
  from y=130 to y=900; the remaining image is cover-fitted to the slide.

Assembly is shown in ink. Once the timber is standing at 12 seconds, a two-second
crossfade introduces the source renderer's timber colour, grain and shading.
This is an authored presentation transition, not a material simulation. Timber
species, finish, weathering and colour remain illustrative design information.

## Source and clock

The orbit films use the unchanged `six-bay-radial-v1` release and the full
`trained-10y` growth record in `drawings-in-code`. They use the existing studio's
perspective camera, plant renderer, timber materials, light and shadows. No
building or plant geometry is invented for this export. The studio and generators
are not edited; the export page temporarily disables interactive camera damping
so that the authored camera path can be set precisely for each frame.

Each film is 51 seconds: 12 assembly, 1 planting, 36 growth, 2 final hold.
The source growth record begins on 1 March 2027; planting is day 11, 12 March 2027.
The film ends at the final midsummer, 20 June 2036, day 3399: approximately 9.28
years after planting. The dates identify a simulated scenario; they are neither
a forecast nor measured establishment. Assembly's internal negative-day clock
is a playback device and must not be presented as elapsed construction time.

The fixed camera sources are read from
`C:/BOWER/drawings-in-code/exports/approach-ink/` and `approach-timber/`.
`fixed-source.json` records their hashes and the presentation crop.

## Playback and authored inhabitants

The orbit images are rendered at 1600 × 900 and 12 frames per second from the full
growth record, then encoded as 24 fps H.264 using repeated frames. This controls
export cost without substituting simplified plant geometry. The fixed film uses
the original 30 fps source renders. All films are silent and use yuv420p and
fast-start metadata for browser playback.

`manifest.json` records film hashes, the scenario timeline and camera matrices.
Matrix samples map Three.js world coordinates to clip space and are stored
column-major. Convert a source building point `[x,y,z]` (east,north,up) to
`[x,z,-y,1]` before multiplying. Eye positions remain in source building axes.
The fixed-view matrices include the crop transform. These projections support
the separately authored ghost inhabitants; those paths are not behavioural or
collision simulations and are not part of the rendered films.

## Authored everyday life

Two ghost inhabitants follow curved routes: one crosses the room between the
southeast and northwest bays, pausing to look up at the timber. The other skirts
the east perimeter, enters the room, stops to look toward the canopy, then
approaches the flowering honeysuckle. Travel eases into and out of stops at
an average of approximately 1.2 m per playback second. Pace varies gently
within each walk, with small deviations from the centre of the route. The walk
atlas advances once per 1.4 m. Each person uses one complete rendered pose at a
time: mixing raster views caused doubled silhouettes. The standing pose takes
over as speed approaches zero.
During pauses the feet stay planted while the skeleton changes pose.
The first walker leaves before the later flower visit and does not return
within the film. This keeps the flower visitor clear in the low and fixed views.
These everyday vignettes sit over accelerated scenario years; they do not
represent a person taking years to cross the room.

After establishment begins, two occasional bird visits take different routes.
One arrives from the southeast at the surface above joint
`lap:R1.B2.hoop0:R1.fine.cw.15`, at `[3.228, -4.444, 3.32]` m. The other arrives
from the northwest at `lap:R1.B4.hoop0:R1.fine.cw.23`, at
`[2.235, 5.018, 3.32]` m, and departs eastward. Both fold their wings to perch.

The requested hummingbird visits the held final summer, day 3399 (20 June 2036).
It hovers between two actual generated honeysuckle flower records:
`P4.honeysuckle/side_shoot5933`, at `[2.1835, 5.006, 1.4599]` m,
open day 3395 / spent day 3414; and `P4.evergreen-honeysuckle/side_shoot58238`, at
`[2.4542, 5.0492, 1.825]` m, open 3387 / spent 3408. The lower cluster has
begun opening; the upper cluster is fully open at the held moment. This
two-second hold makes the relationship
inspectable; individual blooms during accelerated growth pass in fractions
of a playback second. A nearby person leans toward the lower cluster.

The birds are original projected canvas silhouettes. Swept transparent wing
positions suggest the hummingbird's hover without claiming a literal wingbeat
frequency. Hummingbirds are native to the Americas; this user-requested visit
is an authored geographic possibility, not a British wildlife forecast or
evidence that these specific planting taxa support it. See
[Smithsonian hummingbird guidance](https://nationalzoo.si.edu/migratory-birds/hummingbirds).
People, wingbeats and flight all share the film clock, so pause and scrub
remain deterministic across the three cameras.

## Occlusion against the building and planting

The browser compares the inhabitants with a separately exported depth pass
from the same timber meshes, full growth record, organ deformation shaders
and film camera matrices. Timber and leaves in front hide the corresponding
part of a person or bird; openings preserve the view through the structure.
The film remains pre-rendered. This does not load plant geometry or create a
live plant simulation in the presentation.

`depth/manifest.json` describes 768 × 432 depth frames sampled at 12 fps, packed
in lossless WebP tiles. Red and green store a 16-bit camera-axis depth over
64 m; 65535 marks the clear background. Each tile contains one second, and only
three decoded tiles are retained. The current camera loads on demand and the
next second is prefetched. Film playback briefly waits if a required tile is
still loading; if depth is unavailable, the film remains usable with the
inhabitants suppressed rather than drawn through solid objects.

The people are still projected sprites. Their depth varies from foot to head;
they are not articulated 3D meshes in the runtime scene. Depth-edge coverage
is interpolated instead of mixing near and far surface distances. A 6 cm bias
avoids surface flicker. The depth pass matches the 12 fps orbit films; the fixed
30 fps source is sampled at 12 fps, so fine moving leaf edges can differ between
samples. The birds use the depth of their body centre. These are presentation
approximations, not collision or occupancy evidence.

The run's planting includes ivy and honeysuckles. Climbers can provide cover,
bird nesting opportunities and flowers for pollinating insects; see the
[RHS growing guide](https://www.rhs.org.uk/plants/types/climbers/growing-guide).
The visits suggest possible use as cover develops. They do not validate a
species, arrival date, nesting outcome or habitat performance. Added plant
weight, wind loading, moisture and maintenance effects are not demonstrated
by these films; no structural response is animated or claimed.

## Reproduction

From the Auxin repository root, with the existing local dependencies installed:

```powershell
node deck/designx/v8/scripts/render-time-experiment.mjs --probe
node deck/designx/v8/scripts/render-time-experiment.mjs --fixed
node deck/designx/v8/scripts/render-time-experiment.mjs --render=orbit
node deck/designx/v8/scripts/render-time-experiment.mjs --render=roof
node deck/designx/v8/scripts/render-time-experiment.mjs --manifest
node deck/designx/v8/scripts/render-time-depth.mjs
node deck/designx/v8/scripts/check-time-life.mjs
```

Run the rendering jobs serially. Intermediate images and visual proofs go to
ignored `v8/.qa/time-experiment/`; runtime media and provenance stay here.
