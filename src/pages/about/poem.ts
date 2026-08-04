/**
 * about/poem.ts — the POEM that was `/about` for part of 2026-08-04.
 *
 * SUPERSEDED THE SAME DAY, BY CLAY HIMSELF: his final version (`about/aboutCopy.ts`) returned
 * to the manifesto's core prose, keeping this poem's year-one/year-two/year-three couplet and
 * its founders' coda. This file stays, unrendered and unimported, as the record of the verse
 * version — same nothing-was-deleted rule as `manifesto.ts`.
 *
 * THE COPY IS CLAY'S, SUPPLIED VERBATIM. The first version of this file transcribed the Restless
 * Egg pitch-deck poem; Clay then rewrote it the same day, and THIS is the revision he sent —
 * longer in the middle (the software/robot stanza, the year-ten stanza), and with a new close
 * that turns the reader toward the contact conversation ("Tell us about yours. We'll show you
 * how it grows.") instead of asking an abstract question.
 *
 * THE ONLY EDIT IS THE HOUSE DASH RULE, exactly as it was the only edit ever made to the
 * manifesto: em dashes are banned in on-screen copy site-wide, so "a bower — not finished"
 * became a colon, "year ten — which is frankly absurd" a comma, and "ignored —" a colon.
 * Nothing else was smoothed, reordered or "improved" — this is founder voice, and it is the one
 * thing the rest of the site cannot fake.
 *
 * LINES TO KNOW ABOUT, all kept deliberately:
 *   - "they wrote a little software that could reckon and bend, / that could cost every curve"
 *     and "a robot cut the timber" are narrative history, not links to the dev-only engine. They
 *     name no tool and claim no capability a reader could go and fail to find.
 *   - The poem narrates a built, inhabited bower ("the swifts find a rafter") in an openly
 *     fabulist register. The factual record ("Has one been built? Not yet") lives on /questions
 *     Q6 and the home's own founding line; a fable does not overwrite a fact stated plainly two
 *     pages away.
 *   - The coda is the one place outside /about/practice where both founders are named together
 *     in body copy. That is its job: the poem is fun, and the plain line under it says two real
 *     people are standing behind it.
 */

/** The poem, stanza by stanza. Each inner array is one stanza's lines, rendered as line breaks. */
export const POEM_STANZAS: readonly (readonly string[])[] = [
  [
    'There once was a world where the buildings were boring,',
    'where straight lines ran cold and the corners went warring.',
    'They were stacked in the cities. They were spread down the lanes.',
    'And nobody asked if a wall could have veins.',
  ],
  [
    'So two friends said, “Enough. We’ve a notion to tell:',
    'if boring can sell, then a garden can as well.”',
  ],
  [
    'So they wrote a little software that could reckon and bend,',
    'that could cost every curve from beginning to end.',
    'Then a robot cut the timber, and the timber took the turn',
    'to a shape that a carpenter would take a life to learn.',
  ],
  [
    'They called it a bower: not finished when done,',
    'for a bower’s a promise. A bower’s begun.',
  ],
  [
    'Year one, it’s a lattice.',
    'Year two, there are leaves.',
    'Year three, it’s a room made of blossom and eaves.',
  ],
  [
    'And the wisteria takes it. And the bees come to call.',
    'And the swifts find a rafter. And the children find a hall.',
    'It was drawn for the people. It was drawn for the bird.',
    'And it’s better in year ten, which is frankly absurd.',
  ],
  [
    'For the wild’s not a thing to be paved and ignored:',
    'it’s the rarest of riches a soul can afford.',
  ],
  [
    'A bower’s a start. There are gardens to sow.',
    'Tell us about yours. We’ll show you how it grows.',
  ],
];

/**
 * The coda, below the verse. Clay's spec: "Then, in plain type below, no verse." It is set in
 * the page's body register, not the poem's, and it is the one factual sentence on the page.
 */
export const POEM_CODA =
  'We’re Clay Seifert and Daniel Guerra. Founding commissions from 2027.';

/** The one door onward, to the founders and the work. Same door the manifesto held. */
export const POEM_LINK = {
  label: 'About the company',
  href: '/about/practice',
} as const;
