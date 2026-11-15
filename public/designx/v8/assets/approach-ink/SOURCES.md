# Original approach drawing

The user selected `C:/BOWER/drawings-in-code/exports/approach-ink` as the view to
restore. This folder imports its landscape film and final-frame poster byte for
byte. Their SHA-256 hashes and sizes are in `manifest.json`.

- `approach-ink-16x9.mp4`: 1920 × 1080, 30 fps, 51 seconds, H.264 High, no audio.
- `approach-ink-16x9.jpg`: the source film's final-frame poster.
- Source pipeline: `drawings-in-code/pipeline/film.mjs`, using the original
  approach camera and ink timber treatment.

The source pipeline's default sequence gives assembly 12 seconds, planting one
second, growth 36 seconds, then holds the final summer for two seconds. The
imported file's measured duration matches that 51-second sequence. The film's
dates and plant counts are outputs of its source scenario, not observations.

The presentation uses the image region from y = 130 to y = 900 to hide the old
baked title, labels and timeline. This is a presentation crop of the original
image, not a new camera. The film itself remains unchanged. Existing v8 raster
views remain available separately. Ghost people are a separately authored
occupation layer; they are not part of the original film or a behavioural
simulation.

Reimport with:

```powershell
node deck/designx/v8/scripts/import-approach.mjs C:/BOWER/drawings-in-code/exports/approach-ink
```

This script writes only this asset folder. It does not overwrite the source
film, a scene, a generator, or a frozen release.
