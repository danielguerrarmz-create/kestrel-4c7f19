import { EditorialHeader } from '../ui/EditorialHeader';
import { Footer } from '../ui/Footer';
import { usePageSnap } from '../ui/usePageSnap';

export const PRESS_EMAIL = 'contact@bowerbuild.org';

export function PressPage() {
  usePageSnap();

  return (
    <div className="min-h-screen bg-white text-[#11110e]">
      <main>
        <section data-snap-section className="relative flex min-h-[100svh] snap-start items-center px-gutter py-28">
          <EditorialHeader />
          <div className="mx-auto w-full max-w-canvas">
            <h1 className="font-serifDisplay text-[clamp(2rem,7vw,7.5rem)] font-normal leading-[0.95] tracking-[-0.045em]">
              <a href={`mailto:${PRESS_EMAIL}`} className="border-b border-black/20 pb-2 transition-colors hover:border-black">
                {PRESS_EMAIL}
              </a>
            </h1>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
