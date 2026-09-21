# Process page: image-led journey

Date: 2026-09-20
Status: first screen implemented for visual review; full-page rollout pending that review.

## What changed
- Replaced the abstract opening with a large Bower study image, direct introduction and a six-stage overview.
- Moved the existing interactive component specimen into the computation chapter.
- Added responsive typography, image treatment and touch-sized link for the opening.
- Practice is paused; no further Practice changes in this task.

## Why
Reference: https://www.monumentallabs.co/process
The useful structure is a visual first, a short explanation of the action, then specific evidence. Carry that rhythm into Bower's own typography, material palette and imagery. Do not copy the reference's fabrication claims or borrow its imagery.

## Full-page content and visual plan
| Stage | Client explanation | Main visual | Optional technical depth |
| --- | --- | --- | --- |
| Understand the site | Start with how the place will be used, its views, sunlight, access and existing planting. | Site plan with individually selectable sun, access and view overlays. Use a clearly identified example site until a surveyed site is supplied. | Survey, orientation, ground conditions and planning inputs. Do not imply the current engine automatically ingests surveys or solves planning. |
| Shape the Bower | Explore height, footprint and openings together. A change to the whole changes the parts. | Engine-derived form variants, same camera, with simple touch controls and a side-by-side comparison. | DesignParams, grammar bounds, geometry generation, drawn shape fields. |
| Resolve the details | Work out how the timber meets and how the structure meets the ground. | Whole-to-part transition into an exploded connection with part labels. | Addressable nodes, hub/lamella families, member end planes and clearances. Show engineering review as a necessary step, not a solver output. |
| Make the parts | Turn the chosen design into a coordinated set of pieces for fabrication trials. | Component layout plus stock arrangement, followed by the existing KUKA research clip. | Component decomposition; linear-stock packing versus sheet nesting; allowances and waste. Current shelf packing is a planning estimate, not optimized machine nesting or validated toolpaths. |
| Assemble on site | Prepare the ground, identify the pieces and build in a planned order. | Scrubbable assembly sequence: ground connections, lower frame, lattice, crown, planting support. | Use node height/ring metadata. Ground solution and assembly sequence require site and specialist validation. Avoid unverified crew-size or time promises. |
| Let it grow | Establish the planting and care for the structure as the landscape changes. | Existing installation/establishing/mature image studies with manual timeline control. | Species spacing, support layer and growth assumptions. Illustrations are not growth guarantees. |

## Evidence inspected
- src/engine/index.ts: runEngine recomputes bounds, geometry, components, nesting, growth, ecology, price and build plan. Current solar calculation uses configured SITE latitude.
- src/engine/types.ts: footprint, rise, spacing, opening bearing, joint family, species and year; node identities and normalized assembly-height metadata.
- src/engine/sunpath.ts: solar-position calculations; exposure roll-up is approximate.
- src/engine/nesting.ts: conservative first-fit packing for sheets and linear stock.
- docs/FABRICATION.md: component and joint intent, including TBC fabrication assumptions. Treat narrative production claims as proposals unless independently validated.
- src/pages/ProcessSpecimen.tsx and src/data/process-specimen.json: existing engine-derived centreline specimen. Retained without importing the private 3D studio into the public bundle.
- public/assets/studies/provenance.json: existing design-study imagery provenance.

## Content hierarchy
Each chapter: one action-led title, about 40-60 words of public explanation, one substantial visual, a concise caption, and an optional technical disclosure. Avoid jargon in the default reading flow. Keep status labels near the evidence they qualify instead of repeating long disclaimers.

## Mobile requirements
- Single-column reading order, no hover-only interactions.
- Touch controls at least 44px; explicit labels and keyboard equivalents.
- Use inline SVG or precomputed engine-derived graphics; defer large media until needed.
- Respect reduced motion; no scroll-jacking or forced autoplay.
- Show one coherent view at a time, with deliberate crops on the introductory image and full geometry in explanatory figures.

## How to verify
Open http://127.0.0.1:5180/process at desktop and 390px widths. Inspect heading contrast and wrapping, nav clearance, image crop, caption and Explore link. Existing component control and robotics playback remain in later chapters.

## What's left
Obtain visual sign-off on the first screen as requested by the user's global AGENTS instructions, then implement the six illustrated chapters, interactions and corresponding content checks. Confirm whether the user has a newer external Bower Engine checkout; this pass inspected the engine embedded in this website repository.

## Files touched
- src/pages/ProcessPage.tsx
- src/pages/process-journey.css
- src/agent/agentMirror.generated.test.ts (only if generator changes it)
- public/agent/process.md (generated content, if changed)
- this handoff

## Superseding revision after detailed reference review
The initial screen above was rejected. Its template, numbered labels and wireframe have been removed. The replacement is implemented across Process, not just the opening.

### What changed
- Full-width timber-detail opening with a single title; no eyebrow, subtitle or hero button.
- Site-reading image with tap controls, form study, material workbench, connection image, robotics film, assembly explanation and manual planting sequence.
- Three precomputed Bower Engine studies drive actual timber quantities and sample lengths. No pricing data or private engine code is shipped through this component.
- Technical disclosures explain model boundaries, fabrication trials and current production status near the relevant content.
- Mobile layouts use vertically ordered imagery, touch controls, legible measurements and deliberate image crops. Planting transitions fade briefly and respect reduced motion.

### Why
See docs/design/2026-09-20-monumental-process-audit.md for direct observations, motion verification limits, rejected approaches and the selected illustrated-workshop direction.

### Verification
- Seven focused tests cover production-status distinctions, removal of the rejected wireframe and numbered kickers, published-mirror freshness and quantities matching runEngine for all three presets.
- Typecheck and production build; bundle boundary check confirms private studio and engine routes remain absent.
- Browser: desktop and 390px mobile; footprint buttons change quantities, planting buttons change imagery and care text, images load without failures and the mobile page has no horizontal overflow.

### Remaining limitations
Bower imagery remains design-study material. KUKA footage is prior research. The parts graphic shows length, not physical machining profiles. Site markers are illustrative considerations, not a measured survey. Assembly is a proposed sequence; a site-specific construction animation should follow a reviewed design, rather than invent a buildable geometry.

### Additional files touched
- scripts/gen-process-parts.ts
- src/data/process-parts.json
- src/pages/ProcessPage.test.ts
- src/agent/agentMirror.generated.test.ts
- public/agent/process.md
- docs/design/2026-09-20-monumental-process-audit.md

## Model illustrations, motion and reserved disclosures
- Replaced all native expanding details with accessible toggles and naturally sized reserved copy areas. Opacity transitions take 350ms; reduced-motion removes the transition. Browser measurements confirmed identical section height and following-section position before/after toggling.
- Added long white/paper/sage gradients, including the workshop-to-assembly transition.
- Replaced KUKA footage with an explicitly labeled gray fabrication-video placeholder.
- Generated hub and lamella illustrations from memberPrism and buildSteel, preserving modeled cut planes and connector positions. Visitors can switch joint families. These are model illustrations, not approved manufacturing details.
- Generated ten assembly stages from model node heights, with pause/manual controls, offscreen suspension and reduced-motion handling. Planting is a schematic overlay, not a growth simulation. The sequence omits temporary works and needs construction review.
- All twelve delivered WebP views total about 440 KB. Geometry generation and Three.js stay in the offline script, not the public page bundle.
- Additional source: scripts/gen-process-model-views.ts; assets: public/assets/process/model/.
- Verification: seven focused tests, typecheck, production build and bundle boundary check; desktop/mobile visual and disclosure/animation control checks.


## Composed joints and assembly scrubber

Replaced joint tabs with one generated material composition and two visible descriptions. Image is explicitly labeled AI-generated and reference-based. Source PNG and WebP derivative are retained. Replaced assembly stage buttons with a native range scrubber and compact playback control, initially paused. Removed schematic planting frame from playback. The remaining frames are still model studies; a finished video has not been rendered.

See ../design/2026-09-20-assembly-film.md for the final image prompt, provenance, film storyboard and production plan. Verify slider by keyboard Home/End and mobile dragging; both joint descriptions should remain visible without selection. Files touched: ProcessPage.tsx, process-journey.css, ProcessPage.test.ts, agentMirror.generated.test.ts, generated process mirror, composed joint assets and design brief.


## Placeholder and looping captions

User confirmed the generated hub/lamella visual is not authoritative for Bower One. Replaced it with a neutral joint image placeholder and removed its descriptions, caption and engine disclosure. Original assets retained unused. Authoritative stacked/keyed joint references remain pending. Assembly now loops automatically while in view, retains pause/scrubbing and respects reduced motion. Three short fading captions replace the four-column sequence and removed notes. Caption space is reserved to avoid layout shifts. Verified desktop loop progression, mobile 390 px layout without overflow, typecheck, 7 tests and production build.
