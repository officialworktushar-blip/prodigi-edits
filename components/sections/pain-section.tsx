import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface PainSectionItem {
  icon?: ReactNode;
  title: string;
  description: string;
}

export interface PainSectionProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  items: PainSectionItem[];
  className?: string;
}

function renderTitle(title: string, highlight?: string) {
  const target = highlight?.trim();

  if (target) {
    const index = title.indexOf(target);

    if (index >= 0) {
      return (
        <>
          {title.slice(0, index)}
          <span className="bg-gradient-to-r from-orange-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            {target}
          </span>
          {title.slice(index + target.length)}
        </>
      );
    }
  }

  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 1) {
    return (
      <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
        {title}
      </span>
    );
  }

  const accent = words.slice(-2).join(' ');
  const leading = words.slice(0, -2).join(' ');

  return (
    <>
      {leading}{' '}
      <span className="bg-gradient-to-r from-orange-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
        {accent}
      </span>
    </>
  );
}

export function PainSection({
  eyebrow,
  title,
  highlight,
  description,
  items,
  className,
}: PainSectionProps) {
  return (
    <section className={cn('bg-slate-50', className)}>
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow ? (
            <span className="inline-flex items-center rounded-full border border-orange-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
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
          </h2>
          {description ? (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-7 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:shadow-soft-lg"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-300 bg-orange-50/60 text-orange-500 transition-colors group-hover:bg-orange-100/70">
                {item.icon ?? (
                  <AlertTriangle aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                )}
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-brand-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
