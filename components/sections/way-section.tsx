import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface WaySectionAction {
  label: string;
  href: string;
}

export interface WaySectionCard {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  linkLabel?: string;
  illustration: ReactNode;
}

export interface WaySectionProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  cta?: WaySectionAction;
  cards: WaySectionCard[];
  periodClassName?: string;
  className?: string;
}

function renderTitle(title: string, highlight?: string) {
  const cleanTitle = title.replace(/\.\s*$/, '');
  const explicitTarget = highlight?.trim();
  const words = cleanTitle.split(/\s+/).filter(Boolean);
  let target = explicitTarget ?? words.slice(-2).join(' ');
  let index = cleanTitle.indexOf(target);

  if (index < 0) {
    target = words.slice(-2).join(' ');
    index = cleanTitle.indexOf(target);
  }

  if (index >= 0) {
    return (
      <>
        {cleanTitle.slice(0, index)}
        <span className="text-gradient">{target}</span>
        {cleanTitle.slice(index + target.length)}
      </>
    );
  }

  return cleanTitle;
}

export function WaySection({
  eyebrow,
  title,
  highlight,
  description,
  cta,
  cards,
  periodClassName = 'text-pink-500',
  className,
}: WaySectionProps) {
  return (
    <section className={cn('bg-white', className)}>
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow ? (
            <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
              {eyebrow}
            </span>
          ) : null}
          <h2
            className={cn(
              'text-3xl font-semibold leading-tight tracking-tight text-brand-ink sm:text-4xl lg:text-5xl',
              eyebrow ? 'mt-4' : ''
            )}
          >
            {renderTitle(title, highlight)}
            <span className={periodClassName}>.</span>
          </h2>
          {description ? (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
              {description}
            </p>
          ) : null}
          {cta ? (
            <div className="mt-8 flex justify-center">
              <Link href={cta.href} className="btn-cyan">
                {cta.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          ) : null}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {cards.map((card, index) => (
            <article
              key={`${card.title}-${index}`}
              className="group overflow-hidden rounded-[1.6rem] border-2 border-[#0b3b3f] bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:rotate-[-0.35deg] hover:scale-[1.01] hover:shadow-soft-lg"
            >
              <div className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-violet-50 to-pink-50 p-5">
                <div
                  aria-hidden="true"
                  className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-sky-200/50 blur-2xl"
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-pink-200/50 blur-2xl"
                />
                <div className="relative overflow-hidden rounded-2xl border border-white/80 bg-white/50 shadow-soft">
                  {card.illustration}
                </div>
              </div>

              <div className="border-t border-[#0b3b3f]/10 bg-slate-50 p-6 sm:p-7">
                {card.eyebrow ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
                    {card.eyebrow}
                  </p>
                ) : null}
                <h3 className={cn('text-xl font-semibold tracking-tight text-brand-ink', card.eyebrow ? 'mt-2' : '')}>
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {card.description}
                </p>
                <Link
                  href={card.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-indigo transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                >
                  {card.linkLabel ?? 'Learn more'}
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
