import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface PageHeroProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  actions?: ReactNode;
  visual?: ReactNode;
  children?: ReactNode;
  size?: 'default' | 'compact';
  className?: string;
}

function renderTitle(title: string, highlight?: string) {
  const target = highlight?.trim();

  if (target) {
    const index = title.indexOf(target);

    if (index >= 0) {
      const before = title.slice(0, index);
      const after = title.slice(index + target.length);

      return (
        <>
          {before}
          <span className="text-gradient-hero animate-text-shimmer">
            {target}
          </span>
          {after}
        </>
      );
    }
  }

  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 1) {
    return title;
  }

  const lastWord = words[words.length - 1];
  const leadingWords = words.slice(0, -1).join(' ');

  return (
    <>
      {leadingWords}{' '}
      <span className="text-gradient-hero animate-text-shimmer">{lastWord}</span>
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  actions,
  visual,
  children,
  size = 'default',
  className,
}: PageHeroProps) {
  const padding =
    size === 'compact'
      ? 'pt-[3.75rem] pb-[3.75rem] sm:pt-[4.375rem] sm:pb-[4.375rem]'
      : 'pt-[5rem] pb-[5rem] sm:pt-[6.25rem] sm:pb-[6.25rem] lg:pt-[7.5rem] lg:pb-[7.5rem]';

  return (
    <section
      className={cn(
        'relative isolate overflow-hidden bg-hero-dark text-white',
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 animate-glow-drift rounded-full bg-violet-600/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 animate-glow-drift rounded-full bg-pink-600/20 blur-3xl"
        style={{ animationDelay: '-9s' }}
      />

      <div
        className={cn(
          'relative mx-auto max-w-screen-1200 px-4 sm:px-6 lg:px-8',
          padding
        )}
      >
        <div
          className={
            visual
              ? 'grid items-center gap-10 text-center lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:text-left'
              : 'text-center'
          }
        >
          <div>
            {eyebrow ? (
              <p className="animate-hero-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                {eyebrow}
              </p>
            ) : null}

            <h1
              className={cn(
                'animate-hero-fade-up font-semibold leading-[1.06] tracking-[-0.03em] text-white',
                eyebrow ? 'mt-4' : '',
                size === 'compact'
                  ? 'text-3xl sm:text-4xl lg:text-5xl'
                  : 'text-4xl sm:text-5xl lg:text-6xl'
              )}
              style={{ animationDelay: '0.08s' }}
            >
              {renderTitle(title, highlight)}
            </h1>

            {description ? (
              <p
                className={cn(
                  'mx-auto mt-5 max-w-2xl animate-hero-fade-up text-base leading-7 text-slate-200/90 sm:text-lg',
                  visual ? 'lg:mx-0' : ''
                )}
                style={{ animationDelay: '0.16s' }}
              >
                {description}
              </p>
            ) : null}

            {actions ? (
              <div
                className={cn(
                  'mt-8 flex animate-hero-fade-up flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center',
                  visual ? 'lg:justify-start' : ''
                )}
                style={{ animationDelay: '0.24s' }}
              >
                {actions}
              </div>
            ) : null}

            {children ? (
              <div
                className="mt-8 animate-hero-fade-up"
                style={{ animationDelay: '0.32s' }}
              >
                {children}
              </div>
            ) : null}
          </div>
          {visual ? (
            <div
              className="hero-mockup-glow animate-hero-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              {visual}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
