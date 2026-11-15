# Authored occupants for the v8 drawings

These sprites depict possible occupation, not observed or simulated human behaviour.
The player only loads `manifest.json` and `walk-atlas.webp`; no human mesh or WebGL
is required in the deck.

## Source and licence

**Animated Human** by **Quaternius**, published 3 November 2017 under
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).

- Creator's upload: https://opengameart.org/content/animated-human-low-poly
- Downloaded on 15 November 2026 from the creator's linked archive:
  https://opengameart.org/sites/default/files/Animated%20Human%20by%20%40Quaternius_0.zip
- `QuaterniusHuman.fbx` is the archive's `FBX/Animated Human.fbx`, unchanged.
- `ClothedLightSkin.png` is the archive's original clothing palette, unchanged.
- `LICENSE.txt` is the archive's original licence and creator credit.
- The source FBX SHA-256 is recorded in `manifest.json`.

The source `Human Armature|Walk` animation lasts one second. We render it from
eight eye-level directions and once from above, at 24 sampled poses. The palette
is converted to subdued grey-green tones during rendering. Light and shading
preserve the head, clothes, hands and body volume. The authored presentation uses
a slower 1.35-second cycle; the walking paths and placement belong to the deck.

Cesium Man was also tested, but rejected after visual inspection because its
cylindrical head and toy-like proportions did not suit this drawing. It is not
included in the delivered assets.

## Atlas contract

- Image: `walk-atlas.webp`, **2688 × 1584 px** with transparent background.
- Each cell: **112 × 176 px**; 24 frames across and nine directions down.
- Eye-level people are about 160 px tall, with a fixed foot anchor at `(56, 168)`.
  Keep that anchor fixed across the walk rather than fitting each pose.
- Rows: front, front-left, left, back-left, back, back-right, right, front-right,
  plan. Left/right indicate the direction the figure faces on screen.
- Plan view is centred at `(56, 88)` and should use a ground-position anchor.
- Use opacity in the player (around 0.35) rather than baking it into the atlas.

`walk-preview.png` is a contact sheet for visual inspection, not a runtime asset.

## Reproduce

Run `node deck/designx/v8/scripts/render-inhabitants.mjs` from the repository root.
It uses the installed Three.js, Playwright and Chromium noted in the script, routes
all assets from disk, and writes only this folder. It does not alter the inhabited
scene, a release, or any source geometry.
