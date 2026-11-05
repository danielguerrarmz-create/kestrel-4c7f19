// Dated design studies, not fabrication approvals.
export const chapters = [
  {
    "id": "engine",
    "kicker": "The engine",
    "heading": "Design engine",
    "layout": "system",
    "status": "Bower One at revision R13 · 15 September 2026",
    "summary": "The engine models timber parts, joints and fasteners, measures their quantities, and prepares drawings for engineering review.",
    "body": [
      "The engine starts from a relaxed, doubly curved surface and ends with named solid parts, their joints and fasteners, measured sections, and a package an engineer can review.",
      "Rib curves are projected onto the surface at 10 mm plan spacing; constant timber sections are lofted along each and closed as valid solids at 0.01 mm tolerance in Rhino 7; tongues, receivers, pegs, keys, knife plates, bolts and anchors each get a modeled clearance; then the model is loaded, checked and handed to an engineer with plans, elevations, measured sections and open questions.",
      "Every dimension describes the model. Timber properties, fabrication and structural performance are left to be confirmed, and the package says so on every page."
    ],
    "stats": [
      {
        "value": "939",
        "label": "closed model parts",
        "note": "92 primary timbers"
      },
      {
        "value": "12.651 m³",
        "label": "primary timber volume",
        "note": "Excludes timber keys"
      }
    ],
    "images": [
      {
        "src": "/assets/tech/bower-engine-one-plan.webp",
        "caption": "Plan, R13: two families of 40 ribs between four arches",
        "alt": "Plan view of Bower One: a square footprint with two crossing families of curved ribs around a central ring",
        "plate": true
      },
      {
        "src": "/assets/tech/bower-engine-one-elevation.webp",
        "caption": "Elevation, R13: timber base at 250 mm, ring at 5,400 mm",
        "alt": "Elevation of Bower One showing the bowed arches, the rib lattice and the tilted ring",
        "plate": true
      }
    ]
  },
  {
    "id": "surface",
    "kicker": "Doubly curved",
    "heading": "Surface geometry",
    "summary": "Two crossing rib families follow a doubly curved surface. This earlier Bower Three study tests 64 ribs across an 11.7 m canopy.",
    "body": [
      "The ribs follow a surface that curves in both directions. In Bower Three, 32 clockwise and 32 counterclockwise ribs are projected onto a relaxed surface about 11.7 m across, with an oculus tilted 12 degrees at the crown.",
      "Bower One carries the same idea into a jointed design: four bowed arches, 40 ribs each way and a ring tilted 16 degrees, with a clear bore of 1,440 mm."
    ],
    "images": [
      {
        "src": "/assets/tech/bower-engine-three-perspective.webp",
        "caption": "Bower Three, revision R01: a form and stock study, 64 ribs and an oculus",
        "alt": "Rhino model view of Bower Three: a relaxed canopy on four feet, two crossing families of ribs and an oculus at the top",
        "plate": true,
        "span": "wide"
      }
    ],
    "layout": "grid",
    "status": "Historical form studies: Bower One R13 and Bower Three R01"
  },
  {
    "id": "stock",
    "kicker": "Material",
    "heading": "Timber and steel",
    "summary": "Constant timber sections, with local cuts at each joint. Species, grade and moisture remain subject to engineering review.",
    "body": [
      "Each family of parts has one constant section, cut locally at its joints. The model measures volumes; it leaves species, grade and moisture for the timber engineer and assigns no density or design mass."
    ],
    "images": [],
    "tables": [
      {
        "caption": "Bower One, R13 stock",
        "columns": [
          "Part",
          "Count",
          "Section (mm)"
        ],
        "rows": [
          {
            "cells": [
              "Arches",
              "4",
              "300 x 400"
            ]
          },
          {
            "cells": [
              "Ribs, clockwise and counterclockwise",
              "40 + 40",
              "90 x 160"
            ],
            "highlight": true
          },
          {
            "cells": [
              "Ring sectors",
              "4",
              "360 radial x 360 normal"
            ]
          },
          {
            "cells": [
              "Removable caps",
              "4",
              "540 radial x 64 normal"
            ]
          }
        ]
      },
      {
        "caption": "Steel and base, model dimensions",
        "columns": [
          "Part",
          "Count",
          "Size (mm)"
        ],
        "rows": [
          {
            "cells": [
              "Base plates",
              "4",
              "800 x 800 x 30"
            ]
          },
          {
            "cells": [
              "Knife plates",
              "8",
              "180 x 280 x 12"
            ]
          },
          {
            "cells": [
              "M20 heel bolts",
              "8",
              "478 long"
            ]
          },
          {
            "cells": [
              "M24 anchors",
              "16",
              "890 long"
            ]
          }
        ]
      }
    ],
    "layout": "grid"
  },
  {
    "id": "joints",
    "kicker": "Joints and fasteners",
    "heading": "Connection details",
    "summary": "Four connection types, sectioned directly through the model. Dimensions describe the study, not an approved fabrication fit.",
    "body": [
      "Ribs meet the arches with a 54 x 100 mm tongue and a 20 mm peg, in a receiver 0.6 mm larger. They meet the ring with headed keys, and they cross each other on 12 x 22 mm fitted keys.",
      "Bower One carries 80 arch joints, 40 paired ring stations and 503 keys. The clearances are modeled allowances, not an approved production fit."
    ],
    "images": [
      {
        "src": "/assets/tech/bower-engine-section-foot.webp",
        "caption": "Foot: arch heel, knife plates, M20 bolts, base plate",
        "alt": "Measured section through the foot of an arch, showing the timber heel, two steel knife plates with bolts, a base plate and the concrete reference",
        "plate": true,
        "group": "sections",
        "groupLabel": "Measured sections, R13",
        "groupCols": 2
      },
      {
        "src": "/assets/tech/bower-engine-section-rib-to-arch.webp",
        "caption": "Rib to arch: 54 x 100 tongue, 150 projection, 20 mm peg",
        "alt": "Measured section of a rib tongue entering an arch receiver, with its peg",
        "plate": true,
        "group": "sections"
      },
      {
        "src": "/assets/tech/bower-engine-section-rib-to-ring.webp",
        "caption": "Rib to ring: two tiers of tongues, headed keys, keepers",
        "alt": "Measured section through the ring at a rib station, showing ring sectors, tongues, keys and keepers",
        "plate": true,
        "group": "sections"
      },
      {
        "src": "/assets/tech/bower-engine-section-rib-crossing.webp",
        "caption": "Rib crossing: a 12 x 22 fitted key through both ribs",
        "alt": "Oblique section through a rib crossing with a timber key through both ribs",
        "plate": true,
        "group": "sections"
      }
    ],
    "layout": "grid"
  },
  {
    "id": "checks",
    "kicker": "Checks",
    "heading": "Geometry checks",
    "layout": "system",
    "status": "A 12 page review package, 15 September 2026 · structural results pending",
    "summary": "The engine checks closed solids, measures part contact and reconciles rib crossings against the joint schedule.",
    "body": [
      "Before any analysis, the engine checks what geometry can prove: every solid is valid and closed, contact between parts is measured, and every rib crossing is reconciled against the joint records. What it cannot prove is written down as a question for the engineer.",
      "Nothing here is construction ready. The package is for design review only."
    ],
    "stats": [
      {
        "value": "503 of 560",
        "label": "scheduled rib crossings keyed",
        "note": "57 still to reconcile"
      },
      {
        "value": "14",
        "label": "contact residuals left open, and listed"
      }
    ],
    "study": {
      "status": "documented",
      "title": "Engineering review",
      "points": [
        "Foot: stiffness, uplift restraint and anchor capacity.",
        "Rib to arch: tongue, peg and receiver capacity.",
        "Rib to ring: net sections and cap restraint.",
        "Crossings: restraint, slip and rotation."
      ],
      "source": "Bower engineer review package D09, 15 September 2026"
    },
    "images": []
  },
  {
    "id": "structure",
    "kicker": "Structural tests",
    "heading": "Structural model",
    "layout": "system",
    "status": "Gridshell study, model export of 3 September 2026 · results pending the engineer",
    "summary": "This earlier gridshell study assigns plant loads to 26,606 nodes and defines 10 load cases. None of the load cases has been solved yet.",
    "body": [
      "The engine also writes the structural tests. On the gridshell study, an earlier Bower design of 263 timber laths, it generates 10 load cases (dead load, the plant ungrown and grown, wind uplift bare and in leaf, snow) and 5 combinations, each one labelled with how much is known: measured, assumed, scoping only, or pending.",
      "It applies the grown plant cases to the model as 53,212 nodal loads over 26,606 nodes, each node carrying its share of the surface, and the totals reproduce the cases exactly. It runs 11 forming checks over 43,239 points along the laths: 7 pass, 3 fail and 1 is retired. None of the load cases has been solved; that analysis is the engineer’s, and the combinations stay pending until the dead load is fixed."
    ],
    "stats": [
      {
        "value": "10",
        "label": "load cases",
        "note": "1 measured, 4 assumed, 3 scoping, 2 pending"
      },
      {
        "value": "53,212",
        "label": "nodal loads across two plant cases",
        "note": "Totals 17.9 and 44.7 kN, exactly"
      }
    ],
    "images": [
      {
        "src": "/assets/tech/bower-engine-gridshell-load-lc4.webp",
        "caption": "Load case LC4, grown plant high: 44.7 kN applied to 26,606 nodes of the gridshell model; one arrow in seventy drawn, supports in black",
        "alt": "Axonometric line drawing of the gridshell model with vertical load arrows on its nodes and four square supports",
        "plate": true
      }
    ],
    "tables": [
      {
        "caption": "Load cases, as the engine labels them",
        "columns": [
          "Case",
          "Load",
          "Total",
          "Status"
        ],
        "rows": [
          {
            "cells": [
              "LC1",
              "Dead, structure",
              "not yet set",
              "Pending"
            ]
          },
          {
            "cells": [
              "LC2",
              "Plant, ungrown",
              "0 kN",
              "Measured"
            ]
          },
          {
            "cells": [
              "LC3",
              "Plant, grown, low (20 kg/m²)",
              "17.9 kN",
              "Assumed"
            ]
          },
          {
            "cells": [
              "LC4",
              "Plant, grown, high (50 kg/m²)",
              "44.7 kN",
              "Assumed"
            ],
            "highlight": true
          },
          {
            "cells": [
              "LC5",
              "Uplift, bare, optimistic",
              "13.9 kN",
              "Assumed"
            ]
          },
          {
            "cells": [
              "LC6",
              "Uplift, bare, pessimistic",
              "41.6 kN",
              "Assumed"
            ]
          },
          {
            "cells": [
              "LC7",
              "Uplift, in leaf, inland",
              "62.4 kN",
              "Scoping only"
            ]
          },
          {
            "cells": [
              "LC8",
              "Uplift, in leaf, exposed site",
              "126.6 kN",
              "Scoping only"
            ]
          },
          {
            "cells": [
              "LC9",
              "Brief’s reference figure",
              "28.3 kN",
              "Scoping only"
            ]
          },
          {
            "cells": [
              "LC10",
              "Snow and ice",
              "not yet set",
              "Pending"
            ]
          }
        ]
      },
      {
        "caption": "Combinations, all pending the dead load",
        "columns": [
          "Combination",
          "Terms",
          "Status"
        ],
        "rows": [
          {
            "cells": [
              "C1, governing",
              "0.9 dead + uplift in leaf, 45% on one quadrant",
              "Pending"
            ],
            "highlight": true
          },
          {
            "cells": [
              "C2, exposed site",
              "0.9 dead + exposed uplift, 45% on one quadrant",
              "Pending"
            ]
          },
          {
            "cells": [
              "C3, erection, year one",
              "0.9 dead + bare uplift",
              "Pending"
            ]
          },
          {
            "cells": [
              "C4, grown gravity",
              "1.35 dead + 1.5 grown plant high",
              "Pending"
            ]
          },
          {
            "cells": [
              "C5, creep",
              "dead + grown plant low",
              "Pending"
            ]
          }
        ]
      }
    ]
  }
];
