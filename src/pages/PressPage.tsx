import { CONTACT } from '../data/config';
import { Footer } from '../ui/Footer';
import { SplashHeader } from './splash/SplashHeader';

export function PressPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paperVellum text-inkBlack">
      <SplashHeader transparent logoPill />
      <main className="mx-auto flex w-full max-w-canvas flex-1 items-center px-gutter pb-20 pt-[calc(var(--header-h)+4rem)]">
        <div className="max-w-[48rem]">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-inkBlack/40">Press</p>
          <h1 className="mt-5 max-w-[12ch] font-serifDisplay text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.98] tracking-[-0.025em]">Press enquiries.</h1>
          <p className="mt-8 max-w-[38ch] font-serifDisplay text-[clamp(1.15rem,2vw,1.45rem)] leading-[1.55] text-inkBlack/65">
            For press enquiries, please contact us.
          </p>
          <a href={`mailto:${CONTACT.email}?subject=Press%20enquiry`} className="mt-8 inline-flex border-b border-inkBlack/30 pb-1 font-serifDisplay text-[18px] transition-colors hover:border-mossDeep hover:text-mossDeep">
            {CONTACT.email}
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
