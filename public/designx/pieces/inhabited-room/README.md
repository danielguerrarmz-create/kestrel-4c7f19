# inhabited-room: a drawing to explore

One garden room, the ground it stands in, one of its piers, and what changes when that pier is
designed differently. A viewer goes where they like and comes back to the whole. This folder is the
whole of it: open `index.html` from here, with no server.

It is the hand-off between two pieces of work.

- **The scene study owns what is in this folder's data**: the scene, its three configurations, the
  pictures, the layer masks, where each named place falls in each picture, and the numbers. All of it
  is made by `bower-blender/studies/inhabited-room` (see its README) and should be changed there.
- **The deck owns how it is presented**: which places to offer, in what order, with what controls and
  words, and how it sits in a slide. `index.html` here is a plain reference page that proves the data
  can be explored. The deck may drive it in an `iframe`, or read `manifest.js` and draw its own.

## Nothing is computed when it is shown

Every picture, mask, place and quantity was made beforehand. The page chooses which to show. It
measures nothing, evaluates nothing and needs no GPU. `manifest.computed` says the same in the data,
and every quantity carries a `from` saying whether it was measured from the configuration's geometry,
carried from the grown planting, or authored as a proposal.

## What is in it

| File | What |
|---|---|
| `manifest.js` | `window.BOWER_PLACE = {...}`: everything below, readable from a folder. `manifest.json` is the same data. |
| `frames/<configuration>-<view>.webp` | The picture: one of three fixed cameras, in one configuration. |
| `frames/<configuration>-<view>-<layer>.webp` | One layer alone in the same frame, in its own colour, clear elsewhere. Timber and people hide what stands behind them; the ground does not. Lay it over the picture as an image. The colour is baked in (from `stations.json`, by `package_explorer.py`) because a CSS mask does not load from a folder opened without a server. |
| `index.html`, `explore.js`, `explore.css` | The reference page. |

### Configurations: the same room, designed three ways

| id | What it is |
|---|---|
| `found` | The room as the existing work has it. The footing is the ground draft's steel cap; the climbers are where the grown planting starts them. Every climber stands on a cap. |
| `baseline` | Corrected: nothing on steel. Two root zones outside each pier, a feeder cable up each arch leg, a hand-over to the training lines above head height. |
| `proposal` | The pier opened (snapshot `six-bay-radial-open-pier`) and stood on a frame in place of a plate, so each climber roots at the foot of its own line. The floor is round; the plants are tended from its edge. |

Choosing one changes the picture, the masks, the places and the quantities together: they are all
under `manifest.configurations[id]`.

### Views: three cameras that never move

`arrival` (the eye of someone walking in from the south), `whole` (the whole place from the south,
raised) and `pier` (pier `R1.P1`, left of the entrance, from above). All three look north, so west
stays on the left. `manifest.views[id].camera` gives each camera's position, turn and lens in the
scene's own frame (metres, Z up, Y north).

### Layers: what can be picked out

`timber`, `footings`, `root-zones`, `plant-routes` (each climber, and its feeder and hand-overs where
it has them), `support-lines` (training lines), `walking-route`, `care-area`, `water`. Each has a mask in every
view where it shows, and `manifest.configurations[id].objects[layer]` lists the scene objects it holds.
Cables are drawn thicker than they are in the masks (12 to 30 mm for a 4 mm cable) so that they show. People stand in front of every layer. In the `pier` view the layers stop 9 m from the camera, so that the far piers do not show behind the near one; the root zones are shown as they lie on the bed, not as the 0.6 m of soil below.

### Places: stable names, and where each falls in each picture

`manifest.configurations[id].points[view][name]` is `[u, v, depth]`: fractions of the frame from its
left and top, and metres in front of the camera (negative: behind it). The names are the scene's own:

| Name | What |
|---|---|
| `pier.R1.P1` … `pier.R1.P6`, `pier.<id>.foot` | A pier, 1.5 m up and at the floor. |
| `footing.<pier>`, `pile.<pier>.<n>`, `pile.<pier>.<n>.tip` | A footing's middle, a pile's head and its tip. |
| `rooted.<pier>.<n>`, `meets.<pier>.<n>` | Where the pier's n-th climber is rooted, and the lowest place it meets its training lines. The same names in every configuration. |
| `way-in.west`, `way-in.east`, `way-in.middle` | The innermost legs of the entrance bay, at the floor. |
| `path.west`, `path.east`, `floor.middle`, `floor.edge.<pier>` | The path's edges at the threshold; the floor. |
| `tended.<pier>`, `care-path.west`, `care-path.east`, `standpipe`, `hollow` | Where the climbers at a pier are tended from; the care path; water. |
| `crown`, `person.<name>` | The top of the timber; each figure. |

Member IDs are not places here: the timber is one layer. They are in the scene itself
(`TM_<member id>` in `inhabited_room*.blend`) and in the snapshots.

### Quantities

`manifest.configurations[id].quantities[key]` is `{value, unit, says, from}`. `says` is a few words
ready to show. The keys: `climbers`, `climbers_in_soil`, `meets_its_lines_m`, `cable_on_the_arches_m`,
`steel_over_the_ground_m2`, `soil_per_climber_m3`, `soil_all_m3`, `way_in_m`, `piles`,
`training_line_m`, `line_out_of_reach_m` (baseline only), `floor_m2`, `tended`.
`manifest.configurations[id].to_review` lists what the configuration's own checks did not pass.

### Stations: an offered set of places to look from

`manifest.stations` is the reference page's own content, written in
`bower-blender/studies/inhabited-room/explore/stations.json`: a view, the layers switched on, a
caption, a few labels pinned to places, the quantities shown, and hotspots that lead elsewhere. It
is a suggestion. The deck can ignore it and compose its own from views, layers, places and quantities.

## Driving the page from a slide

```html
<iframe src="pieces/inhabited-room/index.html?embed&station=whole&configuration=baseline"></iframe>
```

`?embed` leaves only the picture and its marks. Also `?layers=a,b`, `?paper=EEF3EA`, `?ink=102820`,
`?still` (no movement between pictures; also honoured from the system's reduced-motion setting).

From the same origin, call the frame's hooks:

```js
frame.contentWindow.__goTo('pier')                 // a station id; returns the state
frame.contentWindow.__setConfiguration('proposal') // found | baseline | proposal
frame.contentWindow.__setLayers(['footings', 'root-zones'])
frame.contentWindow.__state()                      // {station, configuration, layers, view, stations, configurations}
frame.contentWindow.__onState(fn)                  // called on every change; returns a function that stops it
```

From anywhere, including a `file://` copy, by message, in the manner of the factory drawings:

```js
frame.contentWindow.postMessage({ type: 'bower-place:command', requestId: 1, action: 'goTo', args: ['pier'] }, '*')
// the page answers { type: 'bower-place:reply', requestId, result } or { ..., error }
// and sends { type: 'bower-place:ready', state } once, then { type: 'bower-place:state', state } on every change
```

Actions: `goTo(station, {keepConfiguration})`, `setConfiguration(id)`, `setLayers(ids)`, `state()`.
Going to a station that names a configuration (the pier opens on `found`) switches to it unless
`keepConfiguration` is true. Nothing plays by itself: the page holds still until it is told to go
somewhere, and each move is a short cross-fade.

## Making it again

```
cd bower-blender/studies/inhabited-room
python set_out_ground.py                                        # ground/<configuration>.json
.\run_headless.ps1 --config found    --samples 24 --export export
.\run_headless.ps1 --config baseline --samples 24 --export export
.\run_headless.ps1 --config proposal --samples 24 --export export
python package_explorer.py                                      # writes this folder
```

## Where it stands

The pictures are quick previews (1280 by 800, 24 samples) made to prove the route through the
drawing: whole room, ground, pier, change, whole room. They are not finished pictures. The frame
footing of the proposal is authored for the study and is not engineered; its own check finds a pile
0.24 m from a climber where the ground draft asks for 0.3 m. No growth is simulated in any picture:
the climbers are diagrams of a plant as put in.
