import { routes } from '../routing';

const LINKS = [
  { href: routes.gallery, label: 'Works' },
  { href: routes.process, label: 'Making' },
  { href: routes.practice, label: 'Practice' },
  { href: routes.contact, label: 'Enquire' },
] as const;

/** The quiet navigation shared by every public-facing editorial page. */
export function EditorialHeader({ tone = 'ink' }: { tone?: 'ink' | 'white' }) {
  const colour = tone === 'white' ? 'text-white' : 'text-[#11110e]';
  const muted = tone === 'white' ? 'text-white/74' : 'text-black/55';
  const line = tone === 'white' ? 'hover:border-white/70' : 'hover:border-black/55';

  return (
    <header className={`absolute inset-x-0 top-0 z-30 px-gutter py-6 ${colour} md:py-8`}>
      <div className="mx-auto flex w-full max-w-canvas flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <a href={routes.home} aria-label="Bower, home" className="w-fit font-sans text-[17px] font-medium tracking-[0.22em] focus-visible:outline-current">
          BOWER
        </a>
        <nav aria-label="Primary" className={`grid w-full grid-cols-4 gap-3 font-sans text-[9px] uppercase tracking-[0.16em] ${muted} sm:flex sm:w-auto sm:gap-8 sm:text-[10px]`}>
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className={`border-b border-transparent pb-1 transition-colors ${line} hover:text-current focus-visible:outline-current`}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
