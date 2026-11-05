<!-- GENERATED FILE. Do not edit: src/agent/mirror.ts renders it from the live page
     components, and agentMirror.generated.test.ts fails the suite if it drifts.
     Regenerate: GEN=1 npx vitest run agentMirror.generated -->

# Bower - technology

> Markdown mirror of the Bower technology page (`/tech`) for AI agents and other non-JavaScript readers, generated
> from the same React components the human page renders. Image paths are root-relative
> to this site's origin.

[

![Bower](/assets/brand/bower-logo-evergreen-horizontal-transparent.png)

](/)

[Works](/gallery) [Process](/process) [Technology](/tech) [Practice](/about/practice) [Contact](/contact)

# Technology at Bower

Our design engine turns the form of a Bower into named timber parts, detailed joints and a model for engineering review.

[Explore the engine](#engine)

Pause

[The engine](#engine) [Doubly curved](#surface) [Material](#stock) [Joints and fasteners](#joints) [Checks](#checks) [Structural tests](#structure)

A record of our design studies. Model dimensions and quantities refer to the revisions shown. These are not built structures or construction documents.

## Design engine

The engine models timber parts, joints and fasteners, measures their quantities, and prepares drawings for engineering review.

939

closed model parts92 primary timbers

12.651 m³

primary timber volumeExcludes timber keys

Bower One at revision R13 · 15 September 2026

[

![Plan view of Bower One: a square footprint with two crossing families of curved ribs around a central ring](/assets/tech/bower-engine-one-plan.webp)

](/assets/tech/bower-engine-one-plan.webp)

Plan, R13: two families of 40 ribs between four arches

[

![Elevation of Bower One showing the bowed arches, the rib lattice and the tilted ring](/assets/tech/bower-engine-one-elevation.webp)

](/assets/tech/bower-engine-one-elevation.webp)

Elevation, R13: timber base at 250 mm, ring at 5,400 mm

Technical notes

The engine starts from a relaxed, doubly curved surface and ends with named solid parts, their joints and fasteners, measured sections, and a package an engineer can review.

Rib curves are projected onto the surface at 10 mm plan spacing; constant timber sections are lofted along each and closed as valid solids at 0.01 mm tolerance in Rhino 7; tongues, receivers, pegs, keys, knife plates, bolts and anchors each get a modeled clearance; then the model is loaded, checked and handed to an engineer with plans, elevations, measured sections and open questions.

Every dimension describes the model. Timber properties, fabrication and structural performance are left to be confirmed, and the package says so on every page.

## Surface geometry

Two crossing rib families follow a doubly curved surface. This earlier Bower Three study tests 64 ribs across an 11.7 m canopy.

Historical form studies: Bower One R13 and Bower Three R01

[

![Rhino model view of Bower Three: a relaxed canopy on four feet, two crossing families of ribs and an oculus at the top](/assets/tech/bower-engine-three-perspective.webp)

](/assets/tech/bower-engine-three-perspective.webp)

Bower Three, revision R01: a form and stock study, 64 ribs and an oculus

Technical notes

The ribs follow a surface that curves in both directions. In Bower Three, 32 clockwise and 32 counterclockwise ribs are projected onto a relaxed surface about 11.7 m across, with an oculus tilted 12 degrees at the crown.

Bower One carries the same idea into a jointed design: four bowed arches, 40 ribs each way and a ring tilted 16 degrees, with a clear bore of 1,440 mm.

## Timber and steel

Constant timber sections, with local cuts at each joint. Species, grade and moisture remain subject to engineering review.

Load schedules

Bower One, R13 stock

PartCountSection (mm)

Arches4300 x 400

Ribs, clockwise and counterclockwise40 + 4090 x 160

Ring sectors4360 radial x 360 normal

Removable caps4540 radial x 64 normal

Steel and base, model dimensions

PartCountSize (mm)

Base plates4800 x 800 x 30

Knife plates8180 x 280 x 12

M20 heel bolts8478 long

M24 anchors16890 long

Technical notes

Each family of parts has one constant section, cut locally at its joints. The model measures volumes; it leaves species, grade and moisture for the timber engineer and assigns no density or design mass.

## Connection details

Four connection types, sectioned directly through the model. Dimensions describe the study, not an approved fabrication fit.

[

![Measured section through the foot of an arch, showing the timber heel, two steel knife plates with bolts, a base plate and the concrete reference](/assets/tech/bower-engine-section-foot.webp)

](/assets/tech/bower-engine-section-foot.webp)

Foot: arch heel, knife plates, M20 bolts, base plate

[

![Measured section of a rib tongue entering an arch receiver, with its peg](/assets/tech/bower-engine-section-rib-to-arch.webp)

](/assets/tech/bower-engine-section-rib-to-arch.webp)

Rib to arch: 54 x 100 tongue, 150 projection, 20 mm peg

[

![Measured section through the ring at a rib station, showing ring sectors, tongues, keys and keepers](/assets/tech/bower-engine-section-rib-to-ring.webp)

](/assets/tech/bower-engine-section-rib-to-ring.webp)

Rib to ring: two tiers of tongues, headed keys, keepers

[

![Oblique section through a rib crossing with a timber key through both ribs](/assets/tech/bower-engine-section-rib-crossing.webp)

](/assets/tech/bower-engine-section-rib-crossing.webp)

Rib crossing: a 12 x 22 fitted key through both ribs

Technical notes

Ribs meet the arches with a 54 x 100 mm tongue and a 20 mm peg, in a receiver 0.6 mm larger. They meet the ring with headed keys, and they cross each other on 12 x 22 mm fitted keys.

Bower One carries 80 arch joints, 40 paired ring stations and 503 keys. The clearances are modeled allowances, not an approved production fit.

## Geometry checks

The engine checks closed solids, measures part contact and reconciles rib crossings against the joint schedule.

503 of 560

scheduled rib crossings keyed57 still to reconcile

14

contact residuals left open, and listed

A 12 page review package, 15 September 2026 · structural results pending

### Engineering review

- Foot: stiffness, uplift restraint and anchor capacity.

- Rib to arch: tongue, peg and receiver capacity.

- Rib to ring: net sections and cap restraint.

- Crossings: restraint, slip and rotation.

Bower engineer review package D09, 15 September 2026

Technical notes

Before any analysis, the engine checks what geometry can prove: every solid is valid and closed, contact between parts is measured, and every rib crossing is reconciled against the joint records. What it cannot prove is written down as a question for the engineer.

Nothing here is construction ready. The package is for design review only.

## Structural model

This earlier gridshell study assigns plant loads to 26,606 nodes and defines 10 load cases. None of the load cases has been solved yet.

10

load cases1 measured, 4 assumed, 3 scoping, 2 pending

53,212

nodal loads across two plant casesTotals 17.9 and 44.7 kN, exactly

Gridshell study, model export of 3 September 2026 · results pending the engineer

[

![Axonometric line drawing of the gridshell model with vertical load arrows on its nodes and four square supports](/assets/tech/bower-engine-gridshell-load-lc4.webp)

](/assets/tech/bower-engine-gridshell-load-lc4.webp)

Load case LC4, grown plant high: 44.7 kN applied to 26,606 nodes of the gridshell model; one arrow in seventy drawn, supports in black

Load schedules

Load cases, as the engine labels them

CaseLoadTotalStatus

LC1Dead, structurenot yet setPending

LC2Plant, ungrown0 kNMeasured

LC3Plant, grown, low (20 kg/m²)17.9 kNAssumed

LC4Plant, grown, high (50 kg/m²)44.7 kNAssumed

LC5Uplift, bare, optimistic13.9 kNAssumed

LC6Uplift, bare, pessimistic41.6 kNAssumed

LC7Uplift, in leaf, inland62.4 kNScoping only

LC8Uplift, in leaf, exposed site126.6 kNScoping only

LC9Brief’s reference figure28.3 kNScoping only

LC10Snow and icenot yet setPending

Combinations, all pending the dead load

CombinationTermsStatus

C1, governing0.9 dead + uplift in leaf, 45% on one quadrantPending

C2, exposed site0.9 dead + exposed uplift, 45% on one quadrantPending

C3, erection, year one0.9 dead + bare upliftPending

C4, grown gravity1.35 dead + 1.5 grown plant highPending

C5, creepdead + grown plant lowPending

Technical notes

The engine also writes the structural tests. On the gridshell study, an earlier Bower design of 263 timber laths, it generates 10 load cases (dead load, the plant ungrown and grown, wind uplift bare and in leaf, snow) and 5 combinations, each one labelled with how much is known: measured, assumed, scoping only, or pending.

It applies the grown plant cases to the model as 53,212 nodal loads over 26,606 nodes, each node carrying its share of the surface, and the totals reproduce the cases exactly. It runs 11 forming checks over 43,239 points along the laths: 7 pass, 3 fail and 1 is retired. None of the load cases has been solved; that analysis is the engineer’s, and the combinations stay pending until the dead load is fixed.

[

![Bower](/assets/brand/bower-logo-evergreen-horizontal-transparent.png)

](/)

[Press](/press) [Questions](/questions) [Works](/gallery) [Contact](/contact)

[© 2026 Bower. All rights reserved.](/)
