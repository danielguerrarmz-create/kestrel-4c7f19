import { CONTACT } from '../data/config';
import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { usePageSnap } from '../ui/usePageSnap';
import { INTRO, QUESTIONS, RING } from './questions/copy';

function Question({ n, item }: { n: number; item: (typeof QUESTIONS)[number] }) {
  return (
    <section
      id={item.id}
      data-snap-section
      className="flex min-h-[76svh] snap-start items-center border-t border-black/10 px-gutter py-[clamp(6rem,12vw,11rem)]"
    >
      <div className="mx-auto grid w-full max-w-canvas gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-black/38">
            {String(n).padStart(2, '0')}
          </p>
          <h2 className="mt-5 max-w-[11ch] font-serifDisplay text-[clamp(2.5rem,5.2vw,5.4rem)] leading-[0.98] tracking-[-0.04em]">
            {item.q}
          </h2>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-9">
          <div className="flex max-w-[42rem] flex-col gap-5">
            {item.a.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="font-serifDisplay text-[clamp(1.1rem,1.55vw,1.35rem)] leading-[1.62] text-black/72">
                {paragraph}
              </p>
            ))}
          </div>

          {item.rows && (
            <dl className="mt-10 border-t border-black/10">
              {item.rows.map((row) => (
                <div key={row.stage} className="flex flex-col gap-1 border-b border-black/10 py-4 sm:flex-row sm:justify-between sm:gap-8">
                  <dt className="font-serifDisplay text-[17px]">{row.stage}</dt>
                  <dd className="font-serifDisplay text-[17px] italic text-black/50">{row.span}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}

export function QuestionsPage() {
  usePageSnap();

  return (
    <div className="min-h-screen bg-white text-[#11110e]">
      <main>
        <section data-snap-section className="relative flex min-h-[100svh] snap-start items-end px-gutter py-[clamp(5rem,10vw,10rem)]">
          <EditorialHeader />
          <div className="mx-auto grid w-full max-w-canvas gap-12 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-black/45">{INTRO.eyebrow}</p>
              <h1 className="mt-6 max-w-[9ch] font-serifDisplay text-[clamp(4rem,10vw,10rem)] leading-[0.84] tracking-[-0.06em]">
                {INTRO.title}
              </h1>
            </div>
            <p className="max-w-[32rem] font-serifDisplay text-[clamp(1.15rem,1.8vw,1.55rem)] leading-[1.5] text-black/58 md:col-span-4">
              {INTRO.standfirst}
            </p>
          </div>
        </section>

        {QUESTIONS.map((item, index) => (
          <Question key={item.id} n={index + 1} item={item} />
        ))}

        <section id="ring" data-snap-section className="flex min-h-[100svh] snap-start items-center border-t border-black/10 px-gutter py-[clamp(6rem,12vw,11rem)]">
          <div className="mx-auto grid w-full max-w-canvas gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-black/38">
                {String(QUESTIONS.length + 1).padStart(2, '0')}
              </p>
              <h2 className="mt-5 max-w-[9ch] font-serifDisplay text-[clamp(3.5rem,7vw,7.5rem)] leading-[0.9] tracking-[-0.05em]">
                {RING.q}
              </h2>
            </div>

            <div className="md:col-span-6 md:col-start-7 md:pt-9">
              <p className="font-serifDisplay text-[clamp(1.6rem,2.8vw,2.75rem)] leading-[1.08]">{CONTACT.name}</p>
              <div className="mt-5 flex flex-col items-start gap-2 font-sans text-[11px] uppercase tracking-[0.14em]">
                <a href={`tel:${CONTACT.phoneHref}`} className="border-b border-black/25 pb-1 transition-colors hover:border-black">{CONTACT.phone}</a>
                <a href={`mailto:${CONTACT.email}`} className="border-b border-black/25 pb-1 transition-colors hover:border-black">{CONTACT.email}</a>
              </div>
              <div className="mt-12 flex max-w-[42rem] flex-col gap-5 text-black/68">
                <p className="font-serifDisplay text-[clamp(1.1rem,1.55vw,1.35rem)] leading-[1.62]">{RING.first}</p>
                <p className="font-serifDisplay text-[clamp(1.1rem,1.55vw,1.35rem)] leading-[1.62]">{RING.study}</p>
                <p className="font-serifDisplay text-[clamp(1.1rem,1.55vw,1.35rem)] leading-[1.62]">{RING.next}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
