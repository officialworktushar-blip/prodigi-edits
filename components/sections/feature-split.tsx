import type { ReactNode } from 'react';
import { Check, MousePointer2 } from 'lucide-react';
import { FadeIn } from '../shared/fade-in';
import { cn } from '../../lib/utils';

export interface FeatureSplitBullet {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export interface FeatureSplitProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  bullets: FeatureSplitBullet[];
  mockup?: ReactNode;
  reverse?: boolean;
  className?: string;
}

const THEME_CARDS = [
  { from: '#bae6fd', to: '#6366f1', dot: '#0ea5e9' },
  { from: '#ddd6fe', to: '#a855f7', dot: '#8b5cf6' },
  { from: '#fbcfe8', to: '#ec4899', dot: '#db2777' },
  { from: '#fde68a', to: '#f97316', dot: '#f59e0b' },
  { from: '#bbf7d0', to: '#14b8a6', dot: '#10b981' },
  { from: '#c7d2fe', to: '#2563eb', dot: '#4f46e5' },
];

function renderTitle(title: string, highlight?: string) {
  const target = highlight?.trim();

  if (target) {
    const index = title.indexOf(target);

    if (index >= 0) {
      return (
        <>
          {title.slice(0, index)}
          <span className="text-gradient">{target}</span>
          {title.slice(index + target.length)}
        </>
      );
    }
  }

  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 1) {
    return <span className="text-gradient">{title}</span>;
  }

  const accent = words.slice(-2).join(' ');
  const leading = words.slice(0, -2).join(' ');

  return (
    <>
      {leading} <span className="text-gradient">{accent}</span>
    </>
  );
}

function DefaultSplitMockup() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <p className="text-sm font-semibold text-brand-ink">Switch Theme</p>
          <p className="mt-1 text-xs text-slate-400">
            One brand system, every asset.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {['#0ea5e9', '#8b5cf6', '#ec4899'].map((color) => (
            <span
              key={color}
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {THEME_CARDS.map((card, index) => (
          <div
            key={card.from}
            className="rounded-xl border border-slate-100 bg-slate-50 p-2"
          >
            <div
              className="relative h-14 overflow-hidden rounded-lg"
              style={{
                backgroundImage: `linear-gradient(135deg, ${card.from}, ${card.to})`,
              }}
            >
              <span className="absolute left-2 top-2 h-1.5 w-8 rounded-full bg-white/70" />
              <span className="absolute left-2 top-5 h-1 w-5 rounded-full bg-white/50" />
              <span
                className="absolute bottom-2 right-2 h-3.5 w-3.5 rounded-full border-2 border-white/80"
                style={{ backgroundColor: card.dot }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="h-1.5 w-8 rounded-full bg-slate-200" />
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: card.dot }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Check aria-hidden="true" className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-medium text-slate-600">
            Brand applied to all 6 layouts
          </span>
        </div>
        <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-400">
          Auto
        </span>
      </div>

      <div aria-hidden="true" className="animate-cursor-move absolute bottom-6 right-10">
        <MousePointer2 className="h-5 w-5 fill-violet-600 text-white drop-shadow" />
      </div>
    </div>
  );
}

export function FeatureSplit({
  eyebrow,
  title,
  highlight,
  description,
  bullets,
  mockup,
  reverse = false,
  className,
}: FeatureSplitProps) {
  return (
    <section className={cn('bg-white', className)}>
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn
            className={cn(reverse ? 'lg:order-2' : 'lg:order-1')}
            delay={0.05}
          >
            <div className="max-w-xl">
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
              </h2>
              {description ? (
                <p className="mt-4 text-base leading-7 text-slate-500">
                  {description}
                </p>
              ) : null}

              <ul className="mt-7 space-y-4">
                {bullets.map((bullet, index) => (
                  <li key={`${bullet.title}-${index}`} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-indigo-600 shadow-soft">
                      {bullet.icon ?? (
                        <Check aria-hidden="true" className="h-4 w-4" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-brand-ink">
                        {bullet.title}
                      </span>
                      {bullet.description ? (
                        <span className="mt-1 block text-sm leading-6 text-slate-500">
                          {bullet.description}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn
            className={cn(reverse ? 'lg:order-1' : 'lg:order-2')}
            delay={0.12}
          >
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-100/70 p-4 shadow-soft sm:p-6">
              {mockup ?? <DefaultSplitMockup />}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
