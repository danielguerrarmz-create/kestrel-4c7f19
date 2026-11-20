# Bower ecology working drawings

## November 20 V10 drawing revisions

The seasonal elevation keeps the original timber, figures and distant garden. Its new crown shoots and extending roots illustrate establishment and seasonal enclosure. Wisteria flowers in the spring view, rose and honeysuckle in summer, crimson glory vine changes colour in autumn, and ivy keeps leaves in winter. The amount of cover and the root paths are drawing choices.

The foundation section studies a stainless steel sleeve at grade on a buried frame. Sleeve thickness, drainage, inspection access and durability require engineering review. The pier drawing brings together the four plants from the south-west trial schedule on one illustrative timber fan. Flowers identify each species across the year. The calendar uses the same twelve plant records, months, scent attributes and pier assignments as the earlier bands.

These five drawings come from draft 20 of the Bower LUMA Studio Pitch ecology set, commit `0270bbb`. The source package contains a standalone HTML page for each drawing and a full-page PNG under `ecology-drawings/slides/`. The deck's `stills/` contains fresh 1600 px wide captures of the drawings at full growth with reduced motion enabled. Each capture contains the artwork alone so the deck can supply its own title and caption.

## What comes from where

Opening-state stills are captured from the same renderers at elapsed time zero. The live slides use these while loading, so playback begins from the pictured state. Print and reduced motion use the full-growth stills. The site view omits its original annotation column and scale bar, and centers the drawing in the space they occupied.

| What appears in the drawings | Source | How it was used |
| --- | --- | --- |
| Timber sections, cables and planting stations in *The living place* | [Room geometry at Auxin commit 641ca40](https://github.com/cseifert512/Auxin/blob/641ca40342fb25da2b41e4819d9e06b6481c438e/drawings-in-code/scenes/six-bay-radial-open-pier/bower.json) | Read from the scene and embedded as `BW_MODEL`. |
| Flowering months, leaf habit, grip and height bands | [Horti-code-ture species records](../../../../../Horti-code-ture/species/) | Each species' `taxon.json` supplied these attributes. |
| Choice of plant at each pier | [Trial planting](https://github.com/cseifert512/Auxin/blob/641ca40342fb25da2b41e4819d9e06b6481c438e/drawings-in-code/scenes/six-bay-radial-open-pier/planting.json) | Adapted for the drawing set with the two substitutions described below. |
| Climber height by year and first flowering year | [Horti-code-ture simulator](../../../../../Horti-code-ture/packages/core/scripts/simulate.ts) | One ten-year design-mode run with trained care and seed 7. Its results are recorded in the source package's `build/growth.json`. The author describes the model as uncalibrated and intended for comparing scenarios. |
| Stem, leaf and flower shapes | Drawn by eye | Individual stems and leaves are illustrated independently of the simulator's 3D geometry. |
| Leaf and flower colours | General botanical knowledge | The drawing author chose the palette. |
| Trees, meadow, swale, hedge, paths, ground layers, water table and bedrock | Drawn by eye | Illustrative site and ground conditions. |
| Oak root circle | Rule recalled from BS 5837 | The drawing author used 12 times the trunk width. The handoff records that the standard's wording still needs checking. |
| Six lattice forms in *Six piers, six climbers* | Invented for this drawing | Diagrammatic alternatives to illustrate climbing habits. |

## Planting and review

The trial planting includes seven specimens of *Akebia quinata* and *Lonicera henryi* across 24 plants. The project audit flagged both species as invasive risks in Britain. The drawing author substituted star jasmine for *A. quinata* and ivy for *L. henryi* in both the drawings and the model run. Clay Seifert's approval of these substitutions is outstanding. In this run the north-west pier carries ivy alone, and the north crown stays bare for all ten years.

The planting is **not reviewed by a horticulturist**. Ivy, hydrangea and trumpet vine can cling directly to timber and hold moisture against it. The ivy species record calls for control of attachment, inspection and spread. Mature plant loads and support sizing still require engineering review.
