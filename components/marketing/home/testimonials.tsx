import { Quote, Star } from 'lucide-react';
import type { Testimonial } from '../../../types/db';
import { EmptyState } from '../../shared/empty-state';
import { FadeIn } from '../../shared/fade-in';
import { SectionHeading } from '../../shared/section-heading';

export interface TestimonialsProps {
  testimonials?: Testimonial[];
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  return letters || 'C';
}

export function Testimonials({ testimonials = [] }: TestimonialsProps) {
  const items = (testimonials ?? []).slice(0, 6);

  return (
    <section className="bg-brand-surface">
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Client notes"
          headline="What steady collaboration feels like"
          highlight="steady"
          subcopy="The best feedback is simple: the video landed, the process felt calm, and the next one is already booked."
        />

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white">
            <EmptyState
              icon="message"
              title="Client words are on the way"
              description="We are collecting a few recent reviews. In the meantime, see the work that keeps teams coming back."
              actionLabel="View examples"
              actionHref="/examples"
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((testimonial, index) => (
              <FadeIn
                key={testimonial.id}
                delay={index * 0.04}
                className="h-full"
              >
                <figure className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                  <div className="flex items-center justify-between gap-3">
                    <Quote
                      aria-hidden="true"
                      className="h-5 w-5 fill-indigo-100 text-indigo-500"
                    />
                    <div
                      role="img"
                      aria-label="Five out of five stars"
                      className="flex items-center gap-0.5"
                    >
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          aria-hidden="true"
                          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>

                  <blockquote className="mt-4 flex-1 text-sm leading-7 text-slate-600">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-xs font-semibold text-white">
                      {initials(testimonial.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-brand-ink">
                        {testimonial.name}
                      </span>
                      <span className="block truncate text-xs text-slate-500">
                        {testimonial.role ?? 'Client'}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
