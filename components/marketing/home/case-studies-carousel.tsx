'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CaseStudy } from '../../../types/db';
import { EmptyState } from '../../shared/empty-state';
import { MediaPlaceholder } from '../../shared/media-placeholder';
import { SectionHeading } from '../../shared/section-heading';

export interface CaseStudiesCarouselProps {
  caseStudies?: CaseStudy[];
}

export function CaseStudiesCarousel({
  caseStudies = [],
}: CaseStudiesCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const items = caseStudies ?? [];

  function scroll(direction: -1 | 1) {
    trackRef.current?.scrollBy({
      left: direction * 420,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Proof, not promises"
            headline="Recent work that shipped on schedule"
            highlight="shipped"
            subcopy="A few projects where the brief was clear, the feedback was focused, and the deadline held."
            className="sm:max-w-2xl"
          />

          {items.length > 1 ? (
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <button
                type="button"
                aria-label="Show previous case studies"
                onClick={() => scroll(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-soft transition-colors hover:border-slate-300 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
              >
                <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Show next case studies"
                onClick={() => scroll(1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-soft transition-colors hover:border-slate-300 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
              >
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-brand-surface">
            <EmptyState
              icon="folder"
              title="Case studies are in production"
              description="We are putting together the first batch of project stories. In the meantime, browse a few finished examples."
              actionLabel="See examples"
              actionHref="/examples"
            />
          </div>
        ) : (
          <div
            ref={trackRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Case studies"
            className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((caseStudy) => (
              <article
                key={caseStudy.id}
                className="w-[85vw] max-w-sm shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft sm:w-[360px] lg:w-[400px]"
              >
                <MediaPlaceholder
                  aspect="wide"
                  badge="Case study"
                  title={caseStudy.title}
                  icon="film"
                  className="rounded-none border-0 shadow-none"
                />
                <div className="p-6">
                  <p className="text-sm leading-6 text-slate-500">
                    {caseStudy.summary ??
                      'A recent project built around a clear brief, a tight review loop, and a publish-ready finish.'}
                  </p>
                  <Link
                    href={`/case-studies/${caseStudy.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-indigo transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                  >
                    Read the story
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
