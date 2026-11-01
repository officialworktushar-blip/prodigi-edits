import { Quote, Star } from 'lucide-react';
import { DEFAULT_TESTIMONIALS } from '../../lib/data/testimonials';
import { cn } from '../../lib/utils';

export interface ReviewsWallItem {
  id?: string;
  name: string;
  role?: string;
  company?: string;
  quote: string;
}

export interface ReviewsWallProps {
  eyebrow?: string;
  title?: string;
  highlight?: string;
  description?: string;
  reviews?: ReviewsWallItem[];
  className?: string;
}

const DEFAULT_REVIEWS: ReviewsWallItem[] = DEFAULT_TESTIMONIALS.map(
  (testimonial) => ({
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.role ?? undefined,
    quote: testimonial.quote,
  })
);

const AVATAR_COLORS = [
  ['#0ea5e9', '#e0f2fe'],
  ['#8b5cf6', '#ede9fe'],
  ['#ec4899', '#fce7f3'],
  ['#14b8a6', '#ccfbf1'],
  ['#f59e0b', '#fef3c7'],
  ['#6366f1', '#e0e7ff'],
] as const;

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return letters || 'C';
}

function ReviewAvatar({ name, index }: { name: string; index: number }) {
  const [fill, background] = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label={`${name} avatar`}
      className="h-10 w-10 shrink-0 rounded-full"
    >
      <circle cx="20" cy="20" r="20" fill={background} />
      <circle cx="20" cy="20" r="18" fill={fill} fillOpacity="0.16" />
      <text
        x="20"
        y="25"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill={fill}
      >
        {initials(name)}
      </text>
    </svg>
  );
}

function renderTitle(title: string, highlight?: string) {
  const target = highlight?.trim();

  if (target) {
    const index = title.indexOf(target);

    if (index >= 0) {
      return (
        <>
          {title.slice(0, index)}
          <span className="text-gradient-hero">{target}</span>
          {title.slice(index + target.length)}
        </>
      );
    }
  }

  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 1) {
    return <span className="text-gradient-hero">{title}</span>;
  }

  const accent = words.slice(-2).join(' ');
  const leading = words.slice(0, -2).join(' ');

  return (
    <>
      {leading} <span className="text-gradient-hero">{accent}</span>
    </>
  );
}

export function ReviewsWall({
  eyebrow = 'Client notes',
  title = 'What steady collaboration feels like',
  highlight = 'feels like',
  description = 'The best feedback is simple: the video landed, the process felt calm, and the next one is already booked.',
  reviews = DEFAULT_REVIEWS,
  className,
}: ReviewsWallProps) {
  const items = reviews.length > 0 ? reviews : DEFAULT_REVIEWS;

  return (
    <section className={cn('relative isolate overflow-hidden bg-[#07131f] text-white', className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-pink-500/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow ? (
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
              {eyebrow}
            </span>
          ) : null}
          <h2
            className={cn(
              'text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl',
              eyebrow ? 'mt-4' : ''
            )}
          >
            {renderTitle(title, highlight)}
          </h2>
          {description ? (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300/80">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((review, index) => (
            <figure
              key={review.id ?? `${review.name}-${index}`}
              className="mb-4 break-inside-avoid rounded-2xl border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="flex items-center justify-between gap-3">
                <div
                  role="img"
                  aria-label="Five out of five stars"
                  className="flex items-center gap-0.5"
                >
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      aria-hidden="true"
                      className="h-3.5 w-3.5 fill-orange-400 text-orange-400"
                    />
                  ))}
                </div>
                <Quote aria-hidden="true" className="h-5 w-5 fill-white/10 text-sky-300/60" />
              </div>

              <blockquote className="mt-4 text-sm leading-7 text-slate-100/90">
                &ldquo;{review.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                <ReviewAvatar name={review.name} index={index} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white">
                    {review.name}
                  </span>
                  <span className="block truncate text-xs text-slate-400">
                    {[review.role, review.company].filter(Boolean).join(' · ') || 'Client'}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
