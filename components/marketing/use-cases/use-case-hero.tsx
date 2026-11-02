import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export interface UseCaseHeroAction {
  label: string;
  href: string;
}

export interface UseCaseHeroProps {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  primaryAction: UseCaseHeroAction;
  secondaryAction: UseCaseHeroAction;
  visual: ReactNode;
}

function renderTitle(title: string, highlight: string) {
  const index = title.indexOf(highlight);

  if (index < 0) return title;

  return (
    <>
      {title.slice(0, index)}
      <span
        className="bg-clip-text text-transparent"
        style={{
          backgroundImage:
            'linear-gradient(90deg, #67e8f9 0%, #60a5fa 35%, #a78bfa 70%, #f472b6 100%)',
        }}
      >
        {highlight}
      </span>
      {title.slice(index + highlight.length)}
    </>
  );
}

export function UseCaseHero({
  eyebrow,
  title,
  highlight,
  description,
  primaryAction,
  secondaryAction,
  visual,
}: UseCaseHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#061321] text-white">
      <style>{`
        @keyframes use-case-hero-rise {
          from { opacity: 0; transform: translate3d(0, 16px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes use-case-hero-enter {
          from { opacity: 0; transform: translate3d(0, 10px, 0) scale(.985); }
          to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes use-case-panel-float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -5px, 0); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .use-case-hero-copy { animation: use-case-hero-rise .65s ease-out both; }
          .use-case-hero-visual { animation: use-case-hero-enter .75s .08s ease-out both; }
          .use-case-panel-float { animation: use-case-panel-float 7s ease-in-out infinite; }
        }
      `}</style>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 70% 50%, rgba(0,180,220,.16), transparent 50%), radial-gradient(ellipse at 10% 90%, rgba(110,65,255,.2), transparent 45%)',
        }}
      />
      <div className="relative mx-auto max-w-screen-1200 px-4 pb-[4.375rem] pt-[4.375rem] sm:px-6 sm:pb-[5rem] sm:pt-[5rem] lg:px-8 lg:pb-[6.25rem] lg:pt-[6.25rem]">
        <div className="grid items-center gap-9 md:grid-cols-[0.96fr_1.04fr] md:gap-7 lg:grid-cols-[48fr_52fr] lg:gap-9 xl:gap-10">
          <div className="use-case-hero-copy min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-[13ch] text-4xl font-semibold leading-[1.03] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.35rem] xl:text-[3.7rem]">
              {renderTitle(title, highlight)}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              {description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href={primaryAction.href} className="btn-cyan">
                {primaryAction.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href={secondaryAction.href}
                className="btn-outline-light inline-flex items-center justify-center"
              >
                {secondaryAction.label}
              </Link>
            </div>
          </div>
          <div className="use-case-hero-visual min-w-0 md:pl-1 lg:pl-0">
            {visual}
          </div>
        </div>
      </div>
    </section>
  );
}
