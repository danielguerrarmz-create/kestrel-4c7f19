/**
 * SplashPage.tsx — the home (`/`), the full-bleed editorial landing.
 *
 * REDUCED 2026-07-17 (round 11, Daniel): the home was cut to the shortest path that
 * explains the product. It is now HERO -> what Bower is -> what happens after you shape
 * it -> begin -> monument. The "keeps becoming" three-season band and the "habitat built
 * in" ecology band were cut, and the pipeline / envelope / strut-field diagrams with them;
 * the full six-section engine walkthrough moved to `/engine`, so nothing was lost, only
 * moved off the front door.
 *
 * AMENDED 2026-07-21: `/engine` and `/studio` are dev-only now (see Root.tsx), so every
 * link into them was removed from this page along with the `#how-it-works` anchor that
 * served the old nav entry. The home no longer links anywhere except `/about` and its own
 * `#register`. This page is the live site's front door and very nearly all of it.
 *
 * The two product photographs (exterior in the garden, and the oculus from within) carry
 * the two middle bands as an alternating split: photo left / text right, then text left /
 * photo right, matching the format Daniel marked up. Each image is its own picture at its
 * own ratio (both 1.34) under the "stop forcing geometry onto something that already knows
 * its shape" rule (CLAUDE.md): no fixed-aspect box, no object-fit, no crop.
 *
 * It still reads the live default design (the store initializes outputs eagerly), so the
 * one production figure shown in the second band (components, lead time) is real engine
 * output, not a written number.
 *
 * Copy note: no em/en dashes anywhere in this page's hand-authored copy.
 *
 * COPY LAW, 2026-07-23 (Clay, on the whole page): "less words across the page, instead of more...
 * nothing left to take away." The home went through two passes that day and they pull in opposite
 * directions unless you read them together: the first added plain speech because a real reader
 * could not tell what Bower does; the second cut everything the page said TWICE. The rule that
 * came out of it, and the one to hold when editing this file:
 *
 *   SAY EACH FACT ONCE, IN THE PLACE THAT OWNS IT.
 *
 * Fixed price, flat components and the build speed belong to the numbered ritual. The noun
 * (pavilions) belongs to the hero. The name's meaning belongs to the dictionary line. "One of a
 * kind" belongs to band 2, because nothing else on the page claims it. When a new sentence wants
 * in, the question is not whether it is true — it is which of those places already says it.
 */
import { useDesign } from '../state/store';
import { useReducedMotion } from '../ui/useReducedMotion';
import { routes } from '../routing';
import { EngineSection, Eyebrow } from './engine/EngineSection';
import { srcSetFor, SIZES } from '../ui/responsiveImg';
import { Footer } from '../ui/Footer';
import { HeroReveal } from './splash/HeroReveal';
import { SplashHeader } from './splash/SplashHeader';
import { AdaptiveCursor } from './splash/AdaptiveCursor';
import { BowerIntro } from './splash/BowerIntro';
import { RegisterInterest } from './splash/RegisterInterest';
import { ritualSteps } from './splash/copy';
import { H2, BODY } from './typeScale';

export function SplashPage() {
  const reduced = useReducedMotion();
  const outputs = useDesign((s) => s.outputs);
  const { components, buildPlan } = outputs;

  return (
    <div className="min-h-screen w-full">
      {/* Adaptive blend-difference cursor for the home page. Self-gates to fine
          pointer + motion-allowed; renders nothing (native cursor) otherwise. */}
      <AdaptiveCursor />

      {/* The "bower" intro: assembles center-screen, flies to the nav wordmark.
          Runs once per tab; reduced-motion / already-played render nothing. */}
      <BowerIntro />

      {/* Global nav: fixed, frozen at the top for the whole scroll session. Holds the
          single [data-wordmark] the intro hands the "bower" lockup onto. */}
      <SplashHeader />

      {/* 1 — HERO: the scroll-scrubbed 2D Oculus -> 3D gridshell -> render reveal */}
      <HeroReveal outputs={outputs} reduced={reduced} />

      {/* 1b — THE DEFINITION, AS A FULL SPREAD (2026-07-23, Clay: "in the section below, put a
          full-spread image, use contrast and put over it what a bower is (the noun definition)").

          This is the page's thesis and it now gets the page's largest gesture: edge to edge, no
          reading frame, the photograph darkened under a scrim so the words carry. The image is
          the wisteria walk from the gallery, chosen because it IS the definition — woven branches,
          climbing plants, a shaded place to sit.

          `object-cover` inside a fixed-height band is deliberate here and does NOT break the
          page's "give the picture its own shape" law: that law protects PLATES, where a crop
          silently loses documentary content. This is the hero pattern — a full-bleed field the
          type sits on — and the same photograph is shown uncropped, at its own ratio, on
          `/gallery`. Nothing is hidden by the crop; it is the same picture doing a different job. */}
      <section className="relative w-full overflow-hidden bg-inkBlack">
        <img
          src="/assets/gallery/01-wisteria-walk.webp"
          srcSet={srcSetFor('/assets/gallery/01-wisteria-walk.webp')}
          sizes="100vw"
          alt="A walk beneath woven timber arches, wisteria hanging through the lattice, cafe tables in the shade beside it"
          loading="lazy"
          decoding="async"
          className="block h-[clamp(420px,72vh,760px)] w-full object-cover object-center"
        />
        {/* THE CONTRAST. A flat wash would grey the photograph out; this is weighted to the
            centre where the words are, so the wisteria and the timber keep their colour at the
            edges and the type still clears AA against the ground behind it. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 50%, rgba(12,10,6,0.72) 0%, rgba(12,10,6,0.62) 45%, rgba(12,10,6,0.34) 100%)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center px-gutter">
          {/* The measure is in `rem`, NOT `ch`: `ch` resolves against THIS element's font-size,
              and the size lives on the children (the clamps below), so `max-w-[30ch]` measured
              against the inherited 16px and squeezed the definition into five narrow lines. */}
          <p className="max-w-[34rem] text-center font-serifDisplay text-paperVellum [text-shadow:0_1px_24px_rgba(0,0,0,0.5)]">
            <span className="block text-[clamp(1.5rem,3.6vw,2.6rem)] italic leading-[1.15]">
              bower,{' '}
              <span className="not-italic" style={{ fontVariant: 'small-caps', letterSpacing: '0.12em' }}>
                noun
              </span>
            </span>
            <span className="mt-5 block text-[clamp(1.15rem,2.2vw,1.75rem)] leading-[1.45] text-paperVellum/90">
              A shaded resting place in a garden, made of woven branches and climbing plants.
            </span>
          </p>
        </div>
      </section>

      {/* 2 — WHAT BOWER IS (vellum). PHOTO LEFT / TEXT RIGHT.
          The product said once, plainly, beside the built thing.
          The `#how-it-works` anchor and the "see the full engine walkthrough" link out to
          /engine were both removed on 2026-07-21 when the engine came off the live site:
          the anchor only existed for a nav entry that no longer ships, and an anchor that
          nothing points at is an orphan. The band itself stays — it is one of the two
          product photographs, and it says what Bower is without showing the tool. */}
      <EngineSection ground="vellum" reduced={reduced} wide>
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <figure className="order-1">
            <img
              src="/assets/product/pavilion-exterior-garden.webp"
              srcSet={srcSetFor('/assets/product/pavilion-exterior-garden.webp')}
              sizes={SIZES.photoBand}
              alt="A woven timber gridshell pavilion in a garden, its open oculus at the crown, wisteria and green planting grown through the lattice, a bed of wildflowers in front"
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </figure>

          <div className="order-2">
            <Eyebrow>What Bower is</Eyebrow>
            {/* The dictionary definition used to sit here as a small italic line. It became the
                page's full-spread band above (2026-07-23, Clay: "put a full-spread image, use
                contrast and put over it what a bower is"), which is the right home for it: the
                definition is the page's thesis, and a thesis should not be a footnote to a
                photograph. It is NOT duplicated here. */}
            <h2 className={`mt-4 ${H2}`}>
              Designed for your garden, and for the <em className="italic">plant</em> that grows
              through it.
            </h2>
            {/* REWRITTEN 2026-07-23, in two passes, and the second one is the point.
                PASS 1 (plain speech): "Not a catalogue of shapes to choose from. A grammar
                computes the one that's yours." over "Bower is a generative design studio. An
                engine computes..." left a first-time reader without the noun. NOTE: that reopened
                the copy half of Daniel's 2026-07-21 "LEAVE THEM" ruling, deliberately and flagged
                on the PR, not smuggled.
                PASS 2 (subtraction — Clay: "nothing left to take away"): pass 1's body ran four
                claims (practice, one of a kind, fixed price, flat components in days) and THREE
                OF THEM ARE THE RITUAL BAND, verbatim, one screen below. A fact stated twice is
                not emphasis, it is noise the reader has to sort. So the body keeps only what
                nothing else on the page says — that yours is not chosen from a set — and the
                rest is left to the numbered steps that already own it. */}
            <p className={BODY}>One of a kind. Never chosen from a catalogue.</p>
          </div>
        </div>
      </EngineSection>

      {/* 3 — FROM DESIGN TO GARDEN. TEXT LEFT / PHOTO RIGHT. The whole process in five lines,
          beside the oculus from within.

          THE FLAT BLUE FIELD IS GONE (2026-07-23 elegance pass). `ground="blue"` painted this
          band `#C3DEF2` edge to edge, and a page built from alternating flat colour blocks is
          the grammar of a software marketing site — it was the loudest thing on the page saying
          "tech". The whole home is now ONE continuous warm paper, divided the way a book
          divides: by a hairline rule and by air (`rule`). The field colours still belong to the
          documentation layer they were designed for (the engine walkthrough), which is where
          DESIGN-DIRECTION.md §5's "one field colour per section" now lives alone. */}
      <EngineSection ground="vellum" reduced={reduced} wide rule>
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
          <div className="order-2 md:order-1">
            <h2 className={H2}>
              From <em className="italic">design</em> to garden.
            </h2>
            {/* The old heading, "What actually happens after you shape it", promised a tool the
                reader cannot open (the engine is dev-only, 2026-07-21). ITS LEAD LINE IS GONE
                TOO (2026-07-23 subtraction pass): "We design it with you, we cut it, you plant
                it, and that's genuinely the whole of it" was a prose summary of the five numbered
                steps directly beneath it — the list says it better, and saying it twice only
                delayed the list. */}

            {/* THE STEPS, AS A RULED LIST RATHER THAN A PRODUCT TABLE (2026-07-23). The numerals
                were mono tabular at 12px on `border-inkNavy/15` rules — the numbered-feature
                block every SaaS page ships. Now: serif numerals in the olive accent, hairlines
                at half the weight, and roughly double the air. Same five facts, read as a
                garden ledger instead of a spec sheet. */}
            <ol className="mt-8 max-w-[560px]">
              {ritualSteps().map((step) => (
                <li
                  key={step.n}
                  className="flex items-baseline gap-6 border-t border-inkBlack/[0.08] py-5 first:border-t-0 sm:py-6"
                >
                  <span className="font-serifDisplay text-[15px] italic text-accentOlive">{step.n}</span>
                  <span className="font-serifDisplay text-[17px] leading-snug sm:text-[18px]">
                    {step.text}
                  </span>
                </li>
              ))}
            </ol>

            {/* The one live engine figure on the front door, and it stays LIVE — but it no longer
                reads as an instrument readout. It was `AnnotationStrip`: 10px mono, uppercase,
                0.12em tracking, i.e. a dimension annotation on a drawing. As an italic serif
                footnote it is the same true numbers in the page's own voice. */}
            <p className="mt-8 font-serifDisplay text-[15px] italic leading-relaxed text-inkBlack/50">
              This one: about {components.totalCount} components, about {buildPlan.leadTimeWeeks} weeks.
            </p>
          </div>

          <figure className="order-1 md:order-2">
            <img
              src="/assets/product/pavilion-oculus-interior.webp"
              srcSet={srcSetFor('/assets/product/pavilion-oculus-interior.webp')}
              sizes={SIZES.photoBand}
              alt="Looking up inside a woven timber gridshell at its open oculus, the lattice converging on the ring with wisteria hanging through it"
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </figure>
        </div>
      </EngineSection>

      {/* 4 — CLOSE (vellum, #register): the low-commitment register, then quiet real doors so
          no reader (buyer, advisor, investor) dead-ends. Each door is a working link. */}
      <EngineSection ground="vellum" reduced={reduced} id="register" rule>
        <h2 className={H2}>
          <em className="italic">Begin.</em>
        </h2>
        {/* The instructions went with the 2026-07-23 subtraction pass: "Put your name down, which
            takes about ten seconds, or find your way in below" narrated a form that is directly
            beneath it, already labelled "register interest", beside a door already labelled "Who
            is behind this". Copy that describes the widget next to it is the easiest kind of
            sentence to cut. */}
        <p className={BODY}>These are the first Bowers. Yours could be among them.</p>

        <RegisterInterest />

        {/* THE DOORS, 2026-07-28. There was one, and it was a trapdoor: "Who is behind this /
            The people building Bower" was the home's ONLY outbound link, and it opened onto a
            timeline of Vision Transformers, saliency heatmaps, a robotic factory and two
            conference papers. That page is right for an investor or a journalist and wrong for
            the person who came here about a garden: it promises people and delivers research,
            and it does not contain a single garden pavilion.
            The fix is not to rewrite About. It is to stop sending the wrong reader there and to
            SAY what it is, so the label sets the expectation the page actually meets. So:
            questions first (the practical door, and the only route to a person), about second,
            renamed to what it honestly holds. */}
        <div className="mt-12 grid gap-x-10 gap-y-6 border-t border-inkBlack/15 pt-8 sm:grid-cols-2">
          <Door
            label="Questions"
            href={routes.questions}
            note="What one costs, planning, and how long it takes."
          />
          <Door
            label="Our background"
            href={routes.about}
            note="The practice, the research, and the work so far."
          />
        </div>
      </EngineSection>

      {/* The monument: one quiet, viewport-wide lowercase wordmark closing the page. (It used to
          be captioned "Bower is the company, Eden its one product" — the two-name system Clay
          retired on 2026-07-23. There is one name now; see data/config.ts.) */}
      <div className="w-full overflow-hidden bg-paperVellum pb-10">
        <div className="mx-auto w-full max-w-read border-t border-inkBlack/15 px-gutter pt-8">
          <p className="whitespace-nowrap font-serifDisplay font-semibold lowercase leading-none tracking-[-0.03em] text-inkBlack text-[clamp(4rem,20vw,14rem)]">
            bower
          </p>
        </div>
      </div>

      {/* THE FOOTER, added 2026-07-23 on Clay's ask. The home had suppressed it deliberately so
          the monument stayed the page's unique big gesture — but that left the front door as the
          one page with no way out of it and no company line, while `/about` and `/gallery` both
          close properly. The two now read as one close rather than a competition: the monument is
          the gesture, and the footer is the small print beneath it (mark, wordmark, the ways on,
          the year). `Footer` draws its own mark rather than using `BowerMark`, so it never mints a
          second `[data-wordmark]` for the intro to fly onto. */}
      <Footer />
    </div>
  );
}

/** One "door" in the close: a labelled way in (buyer, advisor, investor), each a real link.
 *  A left-origin olive underline grows on hover, matching the nav's quiet motion register. */
function Door({ label, href, note }: { label: string; href: string; note: string }) {
  return (
    <a href={href} className="group block">
      <span className="font-serifDisplay text-[19px] leading-tight text-inkBlack">
        {label}
        <span className="ml-1.5 inline-block text-accentOlive transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </span>
      <span className="mt-1 block font-serifDisplay text-[15px] italic leading-relaxed text-inkBlack/50">
        {note}
      </span>
    </a>
  );
}
