/**
 * about/manifesto.ts — the content of `/about`, which is the SHORT one.
 *
 * WHAT CHANGED ON 2026-07-31 AND WHY. `/about` used to be the founders' page: a drawn timeline of
 * two careers, sixteen projects, a scroll-grown spine, a research ledger. It is the most elaborate
 * thing in this repo and it answers "are these people serious", at length, to someone who has
 * already decided to look them up.
 *
 * It was never the answer to the question a first-time reader actually arrives with, which is not
 * about us at all. Clay's brief: "very simple, very plain, very elegant." So `/about` is now this
 * page, and the founders' page is nested behind it at `/about/practice` as the EXPANDED version,
 * reached by one link at the bottom. Nothing was deleted; the order was inverted. The short answer
 * comes first and the long one is there for whoever wants it.
 *
 * THE COPY IS CLAY'S, AND THE ONLY THING DONE TO IT WAS THE HOUSE DASH RULE. It arrived with an em
 * dash ("a curved timber lattice — woven") and a double hyphen ("magic -- in spaces"), both of which
 * are banned in on-screen copy across this site and pinned by test in `questions/copy.test.ts` and
 * `config.test.ts`. They became a colon and a comma. **Nothing else was edited, reordered, tightened
 * or "improved"** — this is the one page on the site written in the founder's own voice rather than
 * in the studio's, and an agent smoothing it would be removing the only thing it has that the rest
 * of the site cannot fake.
 *
 * IT OPENS ON THE READER, NOT ON THE COMPANY, which is what makes it work where a founders' page
 * did not. The first paragraph is about a place they have stood in. By the time Bower is named, the
 * thing being described is already theirs.
 *
 * ONE LINE TO WATCH. "We are building the means to make them again and again" is the closest the
 * public site comes to the generative engine, which has been dev-only since 2026-07-21 on Daniel's
 * ruling. It survives because it names no tool, links to nothing, and claims no capability a reader
 * could go and fail to find: it is a statement of what the practice is for. If it ever grows a noun
 * or a link, it is back inside that ruling.
 */

/** The opening, before the creed. Paragraphs in order. */
export const MANIFESTO_OPENING: readonly string[] = [
  'Ask anyone for the most beautiful place they have ever stood in and they rarely name a building. They name a hollow under a beech. A cave mouth above a beach. A path where the hedge grew over into a tunnel. None of them finished. All of them alive.',
  'We build for that. A Bower is a curved timber lattice: woven, load-bearing, and deliberately incomplete. We make the structure; the garden makes the rest. It takes about three years for wisteria or rose or vine to find its way through the weave, and only then is the thing what it was drawn to be. The architecture is only finished once the garden has had its say.',
  'We are building the means to make them again and again, without ever making the same one twice.',
];

/**
 * The creed. Set as its own block, one line each.
 *
 * They are a LIST and not a paragraph on purpose: read as prose the repetition of "We believe"
 * reads as padding, and set as lines it reads as a creed, which is what it is. The page's one
 * typographic decision is giving these room.
 */
export const MANIFESTO_CREED: readonly string[] = [
  'We believe in elevating the human experience.',
  'We believe in maintaining our beautiful planet.',
  'We believe in preserving all life, and giving it the space to grow.',
  'We believe in nature running wild, and the human spirit running free.',
  'We believe in magic, in spaces that feel, and are, alive.',
  'We believe that places like these should be abundant, and never ignored.',
  'We believe in a world of nature. A world of waves, leaves, lights and caves.',
];

/** The last line, alone. */
export const MANIFESTO_CLOSE = 'A world full of Bowers.';

/** The one door onward, to the founders and the work. */
export const MANIFESTO_LINK = {
  label: 'About the practice',
  href: '/about/practice',
} as const;
