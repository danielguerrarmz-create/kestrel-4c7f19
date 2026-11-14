/* Selected public drawing metadata; source cards and research files are not published. */
window.DESIGNX_FACTORY_CATALOG=[
  {
    "id": "overview",
    "number": null,
    "title": "Process overview",
    "stage": "Factory",
    "whatHappens": "Fourteen connected operations, from timber preparation to a finished rib.",
    "bower": "Proposed manufacturing process. This arrangement explains the sequence; it is not a verified factory floor plan.",
    "testing": "Engineering drawings in development. Equipment, process performance and the proposed tower clamps still require validation.",
    "sourceLinks": []
  },
  {
    "id": "01-condition",
    "number": "01",
    "title": "Condition",
    "stage": "Prepare",
    "whatHappens": "Packs from the sawmill are restacked on spacer sticks and wait in a steady climate until each board meters 10 to 12%. Boards then leave one at a time for grading.",
    "bower": "Nothing new here. A conditioning store with stickered stacks, air flow and moisture checks is industry practice. The chain deck, layer gantry, stick placer, rack, lift table and roller conveyor are standard handling. This station has no Bower-specific machine. Nothing is steamed.",
    "testing": "EN 14080 Annex G covers moisture, but its values are paywalled and were not read. The store's temperature and humidity setpoints, the dwell time in the store, the stick size and any kiln schedule have no source, so none is drawn or printed. The 10 to 12% target is a definition of this line, not a measured result.",
    "sourceLinks": [
      {
        "title": "EN 14080:2013, glued laminated timber: requirements. The contents list shows Annex G, which covers moisture. Its values are paywalled and were not read. Industry practice, standard contents page (iTeh sample, read).",
        "url": "https://iteh.es/catalog/standards/cen/f5a36e99-021d-44cb-8dec-9e41df42d7a5/en-14080-2013"
      },
      {
        "title": "Kiilto Kestopur 1010, a one-component PUR glue: the maker runs its open-time test at 15% wood moisture. Industry practice. Product page (snippet).",
        "url": "https://kiilto.com/product/kestopur-1010"
      }
    ]
  },
  {
    "id": "02-grade",
    "number": "02",
    "title": "Grade",
    "stage": "Prepare",
    "whatHappens": "An approved grader classes each board and marks defects. A saw cuts unplaceable knots; clean lengths go on by class.",
    "bower": "Bower-specific proposal: a knot map of every lamella, so the engine can place boards with their knots where the rib's curve is gentle. It does not grade strength. Strength grading is industry practice: an approved machine running approved settings under EN 14081, checked by an outside body. Placing boards by knot map is published for straight glulam (KIT, seen in snippets only); nobody has published it for bent lamellae.",
    "testing": "Knot placement on bent lamellae: not published, assumed, to be tested. Which knots can be placed and which must be cut is drawn as a schematic. Yield from sawn board to finished rib (register T5): assumed, to be tested.",
    "sourceLinks": [
      {
        "title": "Microtec Goldeneye: X-ray, 3D laser, scattering laser and colour camera in one scanner. Models 702, 706, 802 and 806 are listed as certified for strength grading under EN 14081. Industry practice. Vendor page (read).",
        "url": "https://stories.microtec.eu/en/products/goldeneye"
      },
      {
        "title": "Kodytek et al., F1000Research 2022: an open set of about 20,275 images of wood surface defects in 10 classes, from a production line, licence CC BY 4.0. Open research to start the knot map from (read).",
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9277195/"
      }
    ]
  },
  {
    "id": "03-join",
    "number": "03",
    "title": "Join",
    "stage": "Prepare",
    "whatHappens": "A shaper mills fingers into both ends of each clean piece, glue goes on the teeth, and an end press joins the pieces into one lamella that rests in a rack.",
    "bower": "Nothing new here. The finger-joint shaper, the glue applicator, the end press and the rest rack are industry practice of the Weinig Grecon ProfiJoint class. Bower keeps the standard machine, or buys lamellae already jointed. This station has no Bower-specific machine. A robot is not proposed here: it would be slower, and no robotic finger-jointing of glulam lamellae was found.",
    "testing": "Finger length, end pressure and rest time before planing (register T1): no sourced figure exists, so none is drawn or printed; assumed, to be tested. The rest time comes from the adhesive datasheet, which was not read.",
    "sourceLinks": [
      {
        "title": "Weinig Solid Joint PS 2000, the current short-timber finger-jointing line: a modular entry model for vertical and horizontal joints, with finger lengths of 4 mm, 10/11 mm and 15/16.5 mm. Industry practice. Official Weinig product page (read). The 2010 Grecon ProfiJoint brochure (shaper, flank-jet glue, press at 2 to 6 cycles a minute) was read earlier; its file host no longer serves the PDF.",
        "url": "https://www.weinig.co.uk/en/products/finger-jointing-lines/short-wood-lines/solid-joint-ps-2000.html"
      },
      {
        "title": "Weinig, finger-jointing for glulam lamellae: lamellae pressed on an endless assembly, continuous, cycle or front-end press; horizontal jointing avoids mismatch; a flying saw trims to length at the exit. Industry practice. Vendor page (read, no numbers on the page).",
        "url": "https://www.weinig.com/en/system-solutions/examples-of-applications-uses/glulam-duo-and-trio-beams/5-finger-jointing.html"
      }
    ]
  },
  {
    "id": "04-plane",
    "number": "04",
    "title": "Plane",
    "stage": "Prepare",
    "whatHappens": "The jointed lamella is planed on all four sides to 25 mm, shavings to extraction, then runs out toward the glue line.",
    "bower": "Industry practice. A four-sided planer with extraction, roller conveyors and a chain cross transfer are standard machines. This station has no Bower-specific machine. The bending rules belong to the engine's choice of thickness, not to the planer.",
    "testing": "Planing allowance (how much the rough lamella is over 25 mm) and the rest a finger joint needs before planing: not sourced, so neither is drawn or given; assumed, to be tested. Gluing within about 48 h of planing is a secondary source, not a Bower measurement. The planer to glue line layout is unresolved.",
    "sourceLinks": [
      {
        "title": "Buckland Timber technical guide: required plank thickness is the radius divided by 200 (radius at least 200 times thickness, so about 5 m for 25 mm). A UK laminator's house rule, not a code. Industry practice (read).",
        "url": "https://www.bucklandtimber.co.uk/wp-content/uploads/2024/02/technical-guide_022024.pdf"
      },
      {
        "title": "Eurocode 5, EN 1995-1-1, clause 6.4.3: for curved members the bending strength is cut by the factor k_r when the inner radius is below 240 times the lamination thickness. A strength reduction, not a minimum radius. Code text read on an unofficial host.",
        "url": "https://shop.standards.ie/en-ie/standards/en-1995-1-1-2004-331636_saig_cen_cen_2801172/"
      },
      {
        "title": "EN 14080 (2013), glued laminated timber: covers lamellas 6 to 45 mm thick. Scope only (snippet); the clause on curved members is paywalled and was not read.",
        "url": "https://iteh.es/catalog/standards/cen/f5a36e99-021d-44cb-8dec-9e41df42d7a5/en-14080-2013"
      }
    ]
  },
  {
    "id": "05-press",
    "number": "05",
    "title": "Press",
    "stage": "Form",
    "whatHappens": "Robot-set pins guide the glued lamellae. Yokes close, then a scan of the released rib corrects the next setting.",
    "bower": "Bower-specific proposal: the design engine sets the pin positions, and the scan of each released rib corrects the next setting. The pin bed hardware is prior art.",
    "testing": "Glue window and clamp time, release strength, and springback with achievable pin spacing: assumed, to be tested. Bio-based glue passing EN 302: assumed, to be tested. The loads are estimates: assumed, to be tested.",
    "sourceLinks": [
      {
        "title": "Minda sells an adjustable press for curved glulam, plus or minus 1 mm per post. Industry practice. Brochure, LIGNA 2019 (snippet).",
        "url": "https://www.messe.de/apollo/ligna_2019/obs/Binary/A922895/922895_01820560.pdf"
      },
      {
        "title": "Fraunhofer IPA set the pins of a carbon fibre tool with a robot. Industry practice. fruitcore article, 2025 (read).",
        "url": "https://www.fruitcore-robotics.com/en/horstblog-news/reducing-costs-with-industrial-robots-in-cfrp-production"
      },
      {
        "title": "US patent 2472006, granted 1949: an adjustable jig for laminated timbers. Prior art. Patent record (read).",
        "url": "https://patents.google.com/patent/US2472006A/en"
      }
    ]
  },
  {
    "id": "06-cure",
    "number": "06",
    "title": "Cure",
    "stage": "Form",
    "whatHappens": "The clamped stack moves, still in its yokes, to a second bed to cure. The forming bed starts the next rib.",
    "bower": "Industry practice. A second bed that frees the forming bed, the pins and yokes, the crane with its spreader beam, the robot on its track and a one-component PUR glue are all industry practice. Stacked or tiered beds are a Bower idea only, untested, and are not drawn. This station has no Bower-specific machine.",
    "testing": "Glue open time and clamp time on Bower lamellae (register T2), release strength and the rest after release (register T3), and a cure time for this curved member: assumed, to be tested. Cure time in hours for curved members and moving clamped members off the jig before cure were not found in print. Stacked or tiered beds: untested, not drawn (open question O2).",
    "sourceLinks": [
      {
        "title": "Hordener Holzwerk, a German glulam plant, switched to a faster one-component PUR glue and aimed for 20% or more extra output; it runs two presses with two chambers each. Industry practice, plant claim, not a Bower measurement. Timber-Online, July 2024 (snippet).",
        "url": "https://www.timber-online.net/timber_construction/2024/07/more-output-with-little-effort.html"
      },
      {
        "title": "Kiilto Kestopur G 10: one-component PUR for EN 14080 glulam, glue-line pressure 0.6 to 1.0 N/mm², open time 10 min. Industry practice. Datasheet (read).",
        "url": "https://www.kiilto.com/product/kestopur-g-10/"
      },
      {
        "title": "Dynea Prefere 4535 (MUF): softwood glulam pressed at 0.6 to 1.0 N/mm²; press time for straight members 3 to 12 h, longer for curved. Industry practice. Distributor-hosted data sheet (read).",
        "url": "https://www.bijlard.com/upload/producten_pdf_1/3048_Prefere4535-1GB.pdf"
      }
    ]
  },
  {
    "id": "07-scan",
    "number": "07",
    "title": "Scan",
    "stage": "Form",
    "whatHappens": "The crane lays the rib on unclamped trestles to rest. The press robot scans it against the target shape.",
    "bower": "Bower-specific proposal: the measured springback updates the model for the next rib. This is geometry, not machine learning. The trestles and the scanner hardware are industry practice.",
    "testing": "The 24 h rest before scanning (register T3): assumed, to be tested. Springback per species and batch, which the scan loop exists to measure (register T4): assumed, to be tested.",
    "sourceLinks": [
      {
        "title": "ZAZA Timber, MeKA and Svilans et al. scanned 15 free-form glulam prototypes and compared them with the digital model: mean deviation 0.32 to 3.84 mm per beam. Industry precedent, not this rib. EC3 2026 paper (read).",
        "url": "https://ec-3.org/wp-content/uploads/2026/08/EC32026_412.pdf"
      },
      {
        "title": "Yu, Khaloian and van de Kuilen model the springback and residual stress of curved glulam with mechanics, not learning. Computers and Structures, 2025 (snippet, abstract only; not read in full).",
        "url": "https://repository.tudelft.nl/record/uuid:3f73fc6a-d833-42a6-8588-7af2e04def99"
      }
    ]
  },
  {
    "id": "08-slice",
    "number": "08",
    "title": "Slice",
    "stage": "Reform",
    "whatHappens": "The cured blank, curved in plan, is resawn into layers and planed. Each layer keeps the first curve; the rest goes back for the next pass.",
    "bower": "Industry practice. Two-step lamination (bend and glue, slice, bend and glue again) has been done by Blumer-Lehmann and ZAZA. The band resaw, the planer and the roller support are standard machines. This station has no Bower-specific proposal.",
    "testing": "Resaw yield, the extra loss from slicing a glued blank into layers (register T5): not found, assumed, to be tested. Kerf width and planing allowance per cut: not sourced, so none is drawn or given. Layer thickness is set by resaw capacity.",
    "sourceLinks": [
      {
        "title": "Blumer-Lehmann, Swatch headquarters: single-curved glulam beams were cut and glued again at a second radius, so they were bent in two directions. Industry practice. DBZ, May 2020 (read).",
        "url": "https://www.blumer-lehmann.com/en/dam/jcr:cc4ee762-4495-467e-b66f-1fb35e9df97a/2020-05-dbz-deutsche-bauzeitschrift-swatch-losgr%C3%B6sse-1-fuer-die-holzgittertraeger.pdf"
      },
      {
        "title": "ZAZA Timber, MeKA and Svilans: a two-step route on a free-form press prototype, first step in a single-curved press, second step with 50 mm layers. Research prototype. EC3 2026 (read).",
        "url": "https://ec-3.org/wp-content/uploads/2026/08/EC32026_412.pdf"
      },
      {
        "title": "Svilans, GluLamb, EC3 2021: blank model and lamella thickness for curved glulam; with the ZAZA paper, the process source for the two-step route. Research (read).",
        "url": "https://doi.org/10.35490/EC3.2021.194"
      }
    ]
  },
  {
    "id": "09-press",
    "number": "09",
    "title": "Press",
    "stage": "Reform",
    "whatHappens": "Layers are glued again and bent onto a row of towers, then clamped. The robot only sets each tower.",
    "bower": "Bower-specific proposal: robot-set towers whose position, height and roll come from the design engine, for the second lamination of a full-length rib. The towers and their clamp shoes are not designed yet. Laminating twice is industry practice (Blumer-Lehmann, ZAZA).",
    "testing": "Tower and clamp design (register T11): to be designed, then assumed, to be tested. The clamp shoes are drawn as a proposal only; no clamp force or shoe pressure is given. Glue open time and clamp time (register T2): assumed, to be tested.",
    "sourceLinks": [
      {
        "title": "Blumer-Lehmann, Swatch headquarters: single-curved glulam beams were cut and glued again at a second radius, bent and twisted in two directions. Industry practice. DBZ, May 2020 (read).",
        "url": "https://www.blumer-lehmann.com/en/dam/jcr:cc4ee762-4495-467e-b66f-1fb35e9df97a/2020-05-dbz-deutsche-bauzeitschrift-swatch-losgr%C3%B6sse-1-fuer-die-holzgittertraeger.pdf"
      },
      {
        "title": "ZAZA Timber, MeKA and Svilans: a second press with articulated modular heads, 50 mm step-2 layers, 15 spruce prototypes. The heads are set by hand; motor actuation is planned. Research prototype. EC3 2026 (read).",
        "url": "https://ec-3.org/wp-content/uploads/2026/08/EC32026_412.pdf"
      },
      {
        "title": "Lund University thesis, Robotic Free-Form Timber, 2025: an ABB IRB 140 with traditional clamping tools made multi-curvature laminated timber. Qualitative results only. Student research (read, abstract).",
        "url": "https://lup.lub.lu.se/student-papers/record/9201320"
      }
    ]
  },
  {
    "id": "10-scan",
    "number": "10",
    "title": "Scan",
    "stage": "Reform",
    "whatHappens": "The doubly curved rib cures on unclamped trestles. The robot scans it again against the target shape.",
    "bower": "Bower-specific proposal: the measured second springback updates the model for the next rib's tower settings. This is the same geometry as station 07, not machine learning: line the scan up with the model, compare, correct. The trestles, the crane, the robot, the track and the scanner hardware are industry practice.",
    "testing": "Bower's second-press springback is unmeasured (making-line: open). Springback per species and batch, which the scan loop exists to measure (register T4): assumed, to be tested.",
    "sourceLinks": [
      {
        "title": "ZAZA Timber, MeKA and Svilans et al. scanned 15 free-form glulam prototypes and compared them with the digital model: mean deviation 0.32 to 3.84 mm per beam, greater in the direction of the second pressing, attributed to more springback in fewer, thicker layers. Industry precedent, not this rib. EC3 2026 paper (read).",
        "url": "https://ec-3.org/wp-content/uploads/2026/08/EC32026_412.pdf"
      },
      {
        "title": "Yu, Khaloian and van de Kuilen model the springback and residual stress of curved glulam with mechanics, not learning. Computers and Structures, 2025 (snippet, abstract only; not read in full).",
        "url": "https://repository.tudelft.nl/record/uuid:3f73fc6a-d833-42a6-8588-7af2e04def99"
      }
    ]
  },
  {
    "id": "11-cut",
    "number": "11",
    "title": "Cut",
    "stage": "Detail",
    "whatHappens": "The robot mills half-laps in the rib on trestles, scans the cut faces, then carves ornament with the same spindle.",
    "bower": "Three Bower-specific proposals: the joint schedule from the engine becomes the toolpath; the fit is checked by scanning the cut faces; ornament is carved into structural timber in a reserved depth. The robot, track, spindle, tool changer and half-lap milling are industry practice.",
    "testing": "Robot-milled finger and Japanese splices on a rib-depth curved offcut (register T6): assumed, to be tested. Only laps and scarf are proven on a robot; the finger splice stays on its fixed machine (03). The accept limit for joint fit (T7): assumed, to be tested. A scan-based fit check of the cut faces, with no published practice (T8): assumed, to be tested. Robot milling stiffness on a 22 m rib, since a robot arm is over 50 times less stiff than a gantry (T10): assumed, to be tested.",
    "sourceLinks": [
      {
        "title": "ICD Stuttgart, BUGA Wood Pavilion 2019: two KUKA KR 500 FORTEC robots milled finger joints and openings to 0.3 mm. Industry precedent, plywood plates, not glulam (KUKA case study, snippet).",
        "url": "https://kuka.com/en-cn/industries/loesungsdatenbank/2019/07/icd-wooden-pavilion-for-buga"
      },
      {
        "title": "UAS Technikum Wien, DAAAM 2024: a KUKA KR 16-2 with a spindle milled classic wood joints; 13 of 14 measured cuts fell within -0.020 to +0.378 mm. Research precedent, not Bower's result (read).",
        "url": "https://www.daaam.info/Downloads/Pdfs/proceedings/proceedings_2024/034.pdf"
      },
      {
        "title": "Monumental Labs carves architectural stone with KUKA robot arms and hand finishing. Stone, not timber (Architectural Record, 2026, read).",
        "url": "https://www.architecturalrecord.com/articles/18004-monumental-labs-turns-to-automation-and-robots-to-revive-the-art-of-stone-carving"
      }
    ]
  },
  {
    "id": "12-finish",
    "number": "12",
    "title": "Finish",
    "stage": "Detail",
    "whatHappens": "The rib from 11 is trimmed to length at both ends, sanded, coated and set on a drying rack.",
    "bower": "Industry practice. Trimming, sanding, coating and a drying rack after gluing are standard finishing practice. This station has no Bower-specific machine. Ornament is cut one station back, at 11, so the finish covers the carved surface.",
    "testing": "Durability classes under the current EN 350 were not read, so no class is given for larch, Douglas fir or oak (open). The coating product, its build and its dry time have no source, so none is drawn or given. Treatment after gluing only reaches the surface, so species choice and detailing carry durability.",
    "sourceLinks": [
      {
        "title": "Buckland Timber, a UK maker of curved glulam in Devon: its technical guide is the making line's read source for this station. Industry practice (read).",
        "url": "https://www.bucklandtimber.co.uk/wp-content/uploads/2024/02/technical-guide_022024.pdf"
      },
      {
        "title": "IAAC, Learning Smooth: supervised learning for hardwood sanding with a 6-axis robot. A research precedent for automated sanding, not a production line (snippet).",
        "url": "https://www.iaacblog.com/programs/learning-smooth/"
      }
    ]
  },
  {
    "id": "13-test",
    "number": "13",
    "title": "Test",
    "stage": "Prove",
    "whatHappens": "Samples from each day's run are soaked or sheared on purpose to prove the glue lines hold. Results join the run record, an outside body audits it, and each rib is marked.",
    "bower": "Nothing new here. Factory production control under EN 14080 (daily delamination and shear tests, run records, an outside audit and marking) is industry practice. Without it the glulam is not certified, and no engineer will sign the structure. This station has no Bower-specific machine.",
    "testing": "Test frequencies were not found (open), so no daily count is drawn. The curvature clause I.5.1 is paywalled and was not read. The delamination and shear methods are outlined, not read: no soak time, soak pressure, shear load or pass value is drawn or printed. The finger-joint bending test belongs to the same control; its rig is not drawn. Fees for factory production control and marking: not found (register Q6).",
    "sourceLinks": [
      {
        "title": "EN 14080:2013, glued laminated timber requirements. Its annexes C, D, E, G and I cover testing; factory production control is the plant's own testing and records, audited by an outside body. Industry practice. Contents page, iTeh sample (read); the test methods are outlined, not read.",
        "url": "https://iteh.es/catalog/standards/cen/f5a36e99-021d-44cb-8dec-9e41df42d7a5/en-14080-2013"
      },
      {
        "title": "Hasslacher Nordlam: an example UKCA certificate for EN 14080 glulam, issued after factory production control is checked by an outside body. Industry practice. Certificate (snippet).",
        "url": "https://www.hasslacher.com/data/_dateimanager/zertifikate/en/Glued_laminated_timber/UKCA-Certificate_Block_glued_glulam_EN_14080-2013_NORDLAM_GmbH_NL1_en.pdf"
      },
      {
        "title": "EN 302-2, adhesives for load-bearing timber structures: determination of resistance to delamination. Delamination testing under EN 302-2 / EN 391 is used to assess glue lines. Industry practice. Standards listing (snippet, title only; the standard is paywalled).",
        "url": "https://www.evs.ee/en/evs-en-302-2-2023"
      }
    ]
  },
  {
    "id": "14-ship",
    "number": "14",
    "title": "Ship",
    "stage": "Prove",
    "whatHappens": "The finished rib is stored in erection order, scanned one last time, and loaded on a long trailer. At 22 m it is an abnormal load.",
    "bower": "Bower-specific proposal: every rib ships with its own as-built scan record, so the engine and the site work from the real geometry, not the drawing. The storage cradle, the scanner hardware, the crane and the trailer are industry practice, and the 18.75 m notice and attendant rule is UK regulation.",
    "testing": "The curved rib's width and height as a load are unchecked (open), so no load width, height or escort class is drawn. No trailer length, axle load, route or travel time is drawn or printed. Over 30 m a special order applies; a 22 m rib is below that, so no special order is drawn. The record format the site will use: to be agreed.",
    "sourceLinks": [
      {
        "title": "UK special types: a rigid load over 18.75 m long needs 2 days' notice to the police and an attendant; over 30 m it needs a special order. Industry practice, set by the regulations, not by Bower. Gov.uk Special Types enforcement guide (read via summary).",
        "url": "https://www.gov.uk/government/publications/special-types-enforcement-guide/special-types-enforcement-guide"
      },
      {
        "title": "ZAZA Timber, MeKA and Svilans et al. scanned 15 free-form glulam prototypes and compared them with the digital model: mean deviation 0.32 to 3.84 mm per beam. Industry precedent for the scan, not this rib and not a shipping record. EC3 2026 paper (read).",
        "url": "https://ec-3.org/wp-content/uploads/2026/08/EC32026_412.pdf"
      }
    ]
  }
];
