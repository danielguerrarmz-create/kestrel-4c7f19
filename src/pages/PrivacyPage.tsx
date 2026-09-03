import { CONTACT } from '../data/config';
import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';

const UPDATED = '3 September 2026';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-[#11110e]">
      <EditorialHeader />
      <main className="px-gutter pb-[clamp(5rem,10vw,9rem)] pt-[clamp(9rem,16vw,14rem)]">
        <article className="mx-auto w-full max-w-read">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/42">Privacy notice · Updated {UPDATED}</p>
          <h1 className="mt-7 max-w-[9ch] font-quote text-[clamp(3.8rem,8vw,7.5rem)] leading-[0.88] tracking-[-0.05em]">Privacy, plainly.</h1>
          <p className="mt-9 max-w-[42rem] font-serifDisplay text-[clamp(1.2rem,2vw,1.55rem)] leading-[1.55] text-black/58">
            This notice explains what information Bower receives through this website, why we use it and the choices available to you.
          </p>

          <div className="mt-[clamp(4rem,9vw,7rem)] space-y-12 font-serifDisplay text-[17px] leading-[1.7] text-black/68">
            <section>
              <h2 className="font-quote text-[clamp(2rem,4vw,3.25rem)] leading-none text-black">Who is responsible</h2>
              <p className="mt-5">Bower is responsible for the personal information described here. Questions and requests can be sent to <a className="border-b border-black/30 text-black" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p>
            </section>

            <section>
              <h2 className="font-quote text-[clamp(2rem,4vw,3.25rem)] leading-none text-black">What we collect</h2>
              <ul className="mt-5 list-disc space-y-3 pl-5">
                {/* `organisation` came out of this list on 2026-09-03 with the form field itself.
                    A privacy notice that names a field the form does not have is not a harmless
                    leftover — it is an inaccurate statement about what is collected, on the one
                    page whose entire job is to be accurate about that. */}
                <li>The details you provide in an enquiry, including your name, email address, project location, time zone and message.</li>
                <li>Information contained in later correspondence with us.</li>
                <li>Technical and usage information produced when the site is visited, such as pages viewed, device and browser information, approximate location and interactions with the site.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-quote text-[clamp(2rem,4vw,3.25rem)] leading-none text-black">How we use it</h2>
              <p className="mt-5">We use enquiry details to reply, assess whether a commission may be a credible fit, prepare requested next steps and maintain relevant business records. We use technical and usage information to operate, secure and improve the website. We do not sell personal information or use an enquiry for unrelated marketing unless you ask us to.</p>
            </section>

            <section>
              <h2 className="font-quote text-[clamp(2rem,4vw,3.25rem)] leading-none text-black">Our service providers</h2>
              <p className="mt-5">The website is hosted by Vercel. Enquiry emails are delivered through Resend. We use Vercel Web Analytics and PostHog to understand visits and use of the site. PostHog may provide session replay. These providers process information on our behalf and may process it outside the United Kingdom under their applicable safeguards.</p>
            </section>

            <section>
              <h2 className="font-quote text-[clamp(2rem,4vw,3.25rem)] leading-none text-black">Lawful bases and retention</h2>
              <p className="mt-5">For commission enquiries, we process information to take steps you request before a possible contract. We also rely on legitimate interests to respond to other correspondence, keep proportionate business records, protect the site and understand how it is used. Where consent is required for non-essential analytics, we rely on consent.</p>
              <p className="mt-4">We keep information only for as long as it is needed for these purposes, including any legal, accounting or dispute requirements. Analytics information follows the retention settings of the relevant provider.</p>
            </section>

            <section>
              <h2 className="font-quote text-[clamp(2rem,4vw,3.25rem)] leading-none text-black">Your choices and rights</h2>
              <p className="mt-5">Depending on the law that applies, you may ask for access to your information, correction, deletion, restriction, portability or object to its use. You may withdraw consent where processing relies on it. Contact us using the address above. You may also raise a concern with the <a className="border-b border-black/30 text-black" href="https://ico.org.uk/make-a-complaint/data-protection-complaints/" rel="external">UK Information Commissioner’s Office</a> or the relevant authority where you live.</p>
            </section>
          </div>
        </article>
      </main>
      <Footer measure="read" />
    </div>
  );
}
