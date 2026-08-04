/**
 * about/aboutCopy.ts — the content of `/about`. FINAL VERSION, Clay, 2026-08-04.
 *
 * THE PAGE WENT THROUGH THREE VERSIONS IN ONE DAY, all Clay's, all kept in this directory:
 *   1. `manifesto.ts` — the prose manifesto (2026-07-31), ruled "wayyyyy too long".
 *   2. `poem.ts` — the Restless Egg pitch poem, then his rewritten version of it.
 *   3. THIS — sent with "Final version, and then commit and push please": the manifesto's core
 *      paragraphs, with the poem's year-one/year-two/year-three couplet folded in as prose and
 *      the founders' coda kept from the poem version.
 * The earlier files stay, unrendered and unimported, as the record — the same nothing-was-
 * deleted rule that has governed every version of this page.
 *
 * THE COPY IS VERBATIM. It arrived with no em dashes, so for the first time not even the house
 * dash rule had anything to do; the only transformation is the site's typographic apostrophe
 * (it's -> it’s), which is rendering convention, not editing. Do not smooth, reorder, tighten or
 * "improve" any of it — founder voice, same law as both predecessors.
 *
 * The deep green ink (`inkForest`) is unchanged from the poem version: Clay asked for it and has
 * not reversed it.
 */

/** The paragraphs, in order. The short second one is the hinge; give it no special styling —
 *  its length IS the emphasis. */
export const ABOUT_PARAGRAPHS: readonly string[] = [
  'Ask anyone for the most beautiful place they have ever stood in and they rarely name a building. They name a hollow under a beech. A cave mouth above a beach. A path where the hedge grew over into a tunnel.',
  'None of them finished. All of them alive.',
  'We build for that. A Bower is a curved timber lattice: woven, load-bearing, and deliberately incomplete. We make the structure; the garden makes the rest. It takes about three years for wisteria or rose or vine to find its way through the weave, and only then is the thing what it was drawn to be.',
  'Year one, it’s a lattice. Year two, there are leaves. Year three, it’s a room made of blossom and eaves.',
  'We are building the means to make them again and again, without ever making the same one twice.',
];

/** The coda, in plain type below. The one place outside /about/practice where both founders are
 *  named together in body copy: the page is spare, and this line says who is standing behind it. */
export const ABOUT_CODA = 'Clay Seifert and Daniel Guerra. Founding commissions from 2027.';

/** The one door onward, to the founders and the work. The same door every version has held. */
export const ABOUT_LINK = {
  label: 'About the company',
  href: '/about/practice',
} as const;
