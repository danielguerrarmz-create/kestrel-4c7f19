# The place: a drawing to explore (rough prototype)

`index.html` starts on the whole place; four click targets open the arrival, the look-out, one pier cut open
and the ground. Each view has a way back (`← The place`, or Escape) and a target or two to a neighbouring view.
A scrubber along the bottom runs through the view's frames, with the named moments as ticks. `pier-study.html`
shows the existing pier study as a design tool would. Nothing is computed when shown: pictures, places and
figures are packed beforehand. Opens from its folder (double-click), no server.

Repack: `python bower-blender/studies/inhabited-room/package_place.py` writes
`drawings-in-code/exports/deck/the-place/`.

**manifest.js** sets `window.BOWER_THE_PLACE`: `moments [{id, day, date, says}]`; `views.<view>.frames
[{day, date, moment?, file}]` (any length: a view may have 2 frames or 400), `size`, `places {name: [x, y]}`
as shares of the cropped picture; `figures` (each with `kind`: simulated / proposal / measured from the model,
and `source`); `stations`; `real`; `life` (status: illustration, not a finding); `pier`.

**Time.** Frames sit on one line of days. A view shows its last frame on or before the chosen day. Play runs
once through the current view's frames: 12 a second from 24 frames, 6 a second from 8, otherwise 1.2 s each.
Fewer than 8 frames dissolve; more just step. Arrow keys step a frame; Escape returns to the whole place.

**URL**: `?embed` (picture and its targets only), `?station=whole|arrival|lookout|plant|section`,
`?moment=year-3` or `?moment=day:837`, `?life=1` (birds), `?still` (no movement).
Pier page: `?state=opened`, `?still`.

**Hooks**: `__goTo(station)`, `__setMoment(id|'day:n'|n)`, `__setLife(bool)`, `__play(bool?)`, `__state()`,
`__ready`.

**postMessage** (same names as the first pass, `inhabited-room`):
`{type: 'bower-place:command', requestId, action: 'goTo'|'setMoment'|'setLife'|'play'|'state', args: [...]}`
is answered with `{type: 'bower-place:reply', requestId, result | error}`; the page sends
`{type: 'bower-place:ready', state}` once and `{type: 'bower-place:state', state}` on every change.
