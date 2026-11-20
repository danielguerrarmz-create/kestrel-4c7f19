# DesignX V10 deck review

November 20, 2026. This revision is based on `aa69e73`. The default presentation has 21 slides.

## What changed and why

| Slide | Revision |
| --- | --- |
| 02. Opening day. Five summers later. | Uses the existing clear winter render of the family. The pale corner building, shopfront and bench give the audience landmarks through the seasonal cuts. |
| 04. From room to canopy | Both projections reach the original overhead view. The final hold dissolves to the existing evergreen Bower emblem. The dissolve is part of the presentation player. The source film and pavilion geometry retain their original form. |
| 05. Light through the day | Fits each entire source panel within its own bounds. The sun and its rays stay inside the panel at the morning and evening extremes and below the plan at noon. |
| 06. Nature makes space | Keeps the pencil timberwork, staggered bays and walking figures. Roots extend as the climbers establish. Wisteria hangs from the crown in spring, rose and honeysuckle flower in summer, crimson glory vine reddens in autumn, and ivy stays through winter. The presenter can pause or select a season. |
| 08. Rooted before it climbs | Draws the timber entering the soil inside a stainless steel sleeve, with a buried frame on screw piles. The section identifies the outstanding drainage and timber durability questions. |
| 09. One pier, four climbers | Shows the four south-west pier plants on a single timber fan. Cables, ties and fine laths accommodate their different climbing habits. Flowering details identify the species across the year. |
| 10. Why these plants | Six circular calendars share a January starting point. Coloured petals show the source records’ active months, dots indicate scent and green centres indicate evergreen foliage. Selecting a botanical sprig highlights that species across the six piers. |
| 17. Dreaming Systems | Selecting a node highlights its direct connections. The graph includes the garden’s effect on local growing conditions and the proposed return of light and soil moisture observations to the growth forecast. |

## How to verify

Open the [V10 deck](https://www.bowerbuild.org/designx/v10/#slide-02). Use G for the slide index. On slide 4, scrub into the last three seconds of either projection. On slide 6, compare spring, autumn and winter. On slide 10, select winter clematis to see the season wrap through January. On slide 17, select Growing, then Growing conditions.

The [print view](https://www.bowerbuild.org/designx/v10/?print=1) uses the revised stills. The [earlier opening](https://www.bowerbuild.org/designx/v10/?opening=original#slide-04) uses different slide numbers. To share a specific slide, copy its URL including the fragment.

Chromium checks covered the winter cut, the end of both orbit films, the morning, noon and afternoon light presets, all five growth stops, plant selection and direct graph connections. Checks also covered the four revised print stills and touch input in 390 by 844 and 844 by 390 emulated viewports. The source frames contain a sun marker in all 111 light panels. The production build completed.

## What's left

The sleeve, support arrangements, canopy spread and root drawings are proposals for review. The planted dimensions, service life and suitability of the combined planting need specialist input.

The full test suite reported 1,026 passing tests and one unrelated stale generated mirror for the technology page.

## Files touched

Deck edits live under `public/designx/v10/` in the mission opening, orbit, growth player, ecology and Dreaming Systems modules. Editable artwork and print stills live under `assets/ecology-drawings/` within that directory. That folder's `SOURCES.md` records the drawing assumptions.

## Local revision following the slide annotations

The local V10 deck uses a shared white, sage, leaf green and dark green palette. Smaller captions sit lower on the drawing slides. Slide 11 supplies the green accent used for the factory introduction and the site-partner invitation. Individual words in titles now use the surrounding title style.

On slide 6 the nearest walker passes behind the timber columns. Slide 9 pairs each climber with its support, and slide 10 places the calendar legend above the six pier diagrams. The factory overview introduces the proposed factory before inviting visitors to select a station. The three manufacturing drawings sit lower. The deck omits the recurring working-drawing footers. Source records remain in the drawing package.

Slide 2 opens with an ink illustration based on the original opening-day image. Use the [opening-day review view](http://127.0.0.1:5376/designx/v10/?study=opening-day#slide-02) to hold that frame on screen. Daniel will direct the remaining seasonal artwork.

The shared styles are in `public/designx/v10/presentation.css`. Ecology artwork and print stills are in `public/designx/v10/assets/ecology-drawings/`. The opening image is in `public/designx/v10/assets/mission-opening/`. The deck uses the same V10 route and the existing 21-slide sequence.

Slide 6 shows all three near piers in section, including sleeves, a buried steel frame and two screw piles at each pier. Slide 8 uses the same foundation drawing at detail scale and carries timber grain and lamination lines through the soil line. Slide 9 uses the botanical sprigs from slide 10 beside the four climbing habits. Slide 15 pairs the pavilion drawing with an invitation for a site partner. The six revised opening and full-growth stills support print and reduced motion.
