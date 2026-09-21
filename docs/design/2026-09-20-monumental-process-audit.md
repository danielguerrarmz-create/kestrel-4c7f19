# Monumental Labs Process audit and Bower redesign decisions

Date: 2026-09-20
Reference: https://www.monumentallabs.co/process
Method: inspected every chapter in the live browser at 1355px and the machinery sequence at 390px; read visible copy and DOM media properties. This replaces the earlier first-screen rationale.

## Observations

The reference communicates a service by showing its successive operations. Its vocabulary is concrete: input objects, modelling software, stone, machines, cutters, hand tools and installation. Technical specificity is attached to an action and a visible object. It does not interrupt the reader with a separate technical sales pitch.

The opening is a moving workshop scene. A short, emphatic title occupies the centre; the product's making supplies the background. The following chapters use compact coloured headings, narrow serif paragraphs and disproportionately large illustrations. Scanners, modelling objects and a screen form a horizontal composition. A stone stack fills another chapter. Paired machines flank the milling text. Tools surround the finishing text. Delivery changes to a split composition. This is an illustrated sequence, not a grid of repeated cards.

The hero video is muted, autoplaying and looped. Scrolling reveals illustrated chapters and a compact dark navigation bar. I found no chapter carousel buttons or user-controlled slide sequence. Mobile rearranges the machinery section into image, explanation, image, explanation rather than shrinking the desktop flanking composition.

## Visual notes from direct screen inspection
- Warm paper is continuous through the illustrated chapters. The line illustrations blend into the field, so there are no accidental white image rectangles.
- Desktop hero has an intentional approximately 24px frame. It is not technically full bleed. Our rejected version combined a white navigation band, white frame and dark gradient treatment without making that framing feel intentional.
- Hero display word measured 200px in this desktop session; chapter headings approximately 42-44px. Display headings are a condensed typeface, while explanations are serif. The difference is functional, not just a size ladder.
- Paragraphs often occupy around a third of the desktop width. They are short enough to read beside an illustration without becoming a text wall.
- Illustrations change composition for the subject. The desktop robot pair and the tools around a central void are especially important: images organize the text rather than sit in a generic card beneath it.
- Space around a drawing is part of that drawing's composition. The page also has long transitions. We should not reproduce those gaps indiscriminately on a smaller Bower page.
- Later imagery includes a photographic/model element within the illustrated setting. This is a change of visual register, not evidence of an interactive slideshow.

## Motion: verified versus unverified
Verified: the hero contains an autoplaying, muted, looping video without visible controls. The navigation presentation changes after scrolling. Content loads/reveals as its chapter comes into view. No observed carousel controls.
Not verified: exact reveal durations, parallax implementation, easing functions or whether every visual has a scroll-linked transform. DOM styles on sampled images reported no CSS keyframe animation. That does not exclude animation on ancestor elements. Do not document invented motion mechanics.
Bower decision: motion must explain a change, such as a part schedule updating or planting states changing. Do not add floating text, automatic slides or decorative scroll effects simply to appear interactive. Keep direct touch controls, reduced-motion support and ordinary document scrolling.

## Why the previous pass failed
- It reproduced an eyebrow/title/paragraph/button template rather than the reference's relationship between making and explanation.
- The scenic hero showed the destination but did not explain the process.
- The wireframe was an engineering-debug view enlarged into an illustration. Thin lines did not communicate material, joint logic or fabrication.
- Numbered category labels added hierarchy without information.
- The same abstract claims were repeated in introductory and chapter text.

## Three routes considered
1. Scenic editorial: attractive landscape renders and short text. Reject as the primary approach because it duplicates Gallery and gives little evidence about making.
2. Engine dashboard: large live model, sliders and measurements. Reject as the page structure because it asks clients to learn a tool and exposes prototype limitations as the whole experience.
3. Illustrated workshop: tangible material imagery, a site-reading composition, a small engine-backed parts demonstration, research footage, assembly explanation and planting sequence. Select this. Computation appears at the exact point where it answers how a design becomes parts.

## Applied design rules
- One direct opening title, no introductory eyebrow, subtitle and action-button stack.
- Full-width image frames touch the page edges. Contained graphics have a visibly deliberate paper field and generous internal padding.
- No numbered category kickers. Titles describe what is being done.
- Use different compositions: annotated landscape, image/detail pairing, parts workbench, wide research film, assembly strip and planting sequence.
- Show actual engine-derived part lengths/counts for preset changes; never claim an unrelated design-study photograph is that computed output.
- Technical detail stays adjacent and optional. Separate evidence of existing research from proposed fabrication operations.
- Keep image-study labels short and local; retain explicit manufacturing status where it affects interpretation.
- Mobile: single-column reading order, meaningful image crops, no hover requirement, 44px minimum controls, no horizontal page overflow.

## Evidence and limits
The inspected engine is src/engine in this website checkout. runEngine computes geometry, addressable pieces, stock layouts and planting-related outputs. It is not structural approval, automatic site-survey ingestion or validated machine code. All price outputs are excluded from this public demonstration. Manufacturing and delivery assumptions need specialist validation. Existing Bower imagery is design-study material; KUKA video is earlier research, not Bower production footage.

## Acceptance criteria
A client can explain the journey from site to form to individual parts to fabrication to assembly to planting without opening technical disclosures. A technical visitor can identify what is computed, what evidence is shown and what still needs validation. Every visual should explain a specific step; no generic wireframe, no numbered labels and no repeated marketing-card template.
