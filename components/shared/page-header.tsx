import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface PageHeaderProps {
  eyebrow?: string;
  title?: string;
  headline?: string;
  highlight?: string;
  description?: string;
  actions?: ReactNode;
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
          <span className="text-gradient">{target}</span>
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
      {leadingWords} <span className="text-gradient">{lastWord}</span>
    </>
  );
}

export function PageHeader({
  eyebrow,
  title,
  headline,
  highlight,
  description,
  actions,
  className,
}: PageHeaderProps) {
  const heading = title ?? headline ?? '';

  return (
    <header
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className="max-w-3xl">
        {eyebrow ? (
          <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
            {eyebrow}
          </span>
        ) : null}
        <h1
          className={cn(
            'text-3xl font-semibold leading-tight tracking-tight text-brand-ink sm:text-4xl',
            eyebrow ? 'mt-4' : ''
          )}
        >
          {renderTitle(heading, highlight)}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
