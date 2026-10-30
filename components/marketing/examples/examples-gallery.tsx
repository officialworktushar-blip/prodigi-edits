'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { MediaPlaceholder } from '@/components/shared/media-placeholder';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'All work',
  'Long-form',
  'Short-form',
  'Vertical',
  'Channel management',
] as const;

type Category = (typeof CATEGORIES)[number];

interface ExampleItem {
  id: string;
  title: string;
  category: Exclude<Category, 'All work'>;
  format: string;
  description: string;
  icon: string;
}

const EXAMPLES: ExampleItem[] = [
  {
    id: 'founder-interview',
    title: 'The founder interview that opened a launch',
    category: 'Long-form',
    format: 'Brand film',
    description:
      'A patient conversation shaped into a launch story with room for the product to breathe.',
    icon: 'film',
  },
  {
    id: 'product-demo',
    title: 'A product demo with no wasted seconds',
    category: 'Long-form',
    format: 'Product walkthrough',
    description:
      'Feature steps ordered around the buyer question, not the internal feature list.',
    icon: 'clapperboard',
  },
  {
    id: 'podcast-episode',
    title: 'A weekly podcast, cut for both ears and eyes',
    category: 'Long-form',
    format: 'Video podcast',
    description:
      'Multi-camera footage cleaned up, tightened, and finished with a consistent show identity.',
    icon: 'video',
  },
  {
    id: 'keynote-cutdowns',
    title: 'Three hooks from one keynote',
    category: 'Short-form',
    format: 'Cutdowns',
    description:
      'Complete ideas pulled from a long talk and paced for a fast-moving social feed.',
    icon: 'play',
  },
  {
    id: 'course-intro',
    title: 'A course intro that gets to the first lesson',
    category: 'Short-form',
    format: 'Module intro',
    description:
      'A short opening that sets the outcome, removes hesitation, and makes starting feel easy.',
    icon: 'sparkles',
  },
  {
    id: 'client-story',
    title: 'A client story with the volume turned down',
    category: 'Short-form',
    format: 'Testimonial',
    description:
      'A credible, measured testimonial built around the moment the client decided to act.',
    icon: 'film',
  },
  {
    id: 'property-tour',
    title: 'A listing tour that starts at the front door',
    category: 'Vertical',
    format: '9:16 property tour',
    description:
      "A clear room-by-room walkthrough with a pace that respects a buyer's attention.",
    icon: 'play',
  },
  {
    id: 'podcast-clip',
    title: 'The clip that carries the whole interview',
    category: 'Vertical',
    format: '9:16 highlight',
    description:
      "One strong answer, framed and captioned so the guest's point lands without context.",
    icon: 'video',
  },
  {
    id: 'patient-tip',
    title: 'A patient tip without the clinic stiffness',
    category: 'Vertical',
    format: '9:16 explainer',
    description:
      'Plain-language health guidance with a warmer tone and a calm, readable visual rhythm.',
    icon: 'sparkles',
  },
  {
    id: 'weekly-system',
    title: 'A weekly upload system in one workspace',
    category: 'Channel management',
    format: 'Publishing system',
    description:
      'Briefs, footage, review notes, and delivery files organized around the same weekly cadence.',
    icon: 'image',
  },
  {
    id: 'thumbnail-series',
    title: 'A thumbnail set for a six-part series',
    category: 'Channel management',
    format: 'Thumbnail package',
    description:
      'A cohesive visual family that still gives every episode its own clear reason to click.',
    icon: 'image',
  },
  {
    id: 'launch-week',
    title: 'A launch week, packaged and scheduled',
    category: 'Channel management',
    format: 'Launch package',
    description:
      'A hero film, feature clips, and vertical cutdowns prepared as one coordinated release.',
    icon: 'clapperboard',
  },
];

export function ExamplesGallery() {
  const [activeCategory, setActiveCategory] = useState<Category>('All work');

  const filteredExamples = useMemo(() => {
    if (activeCategory === 'All work') {
      return EXAMPLES;
    }

    return EXAMPLES.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-screen-1200 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-y border-slate-200 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-ink">
              Browse by format
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Representative layouts, not published client reels.
            </p>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
            {filteredExamples.length}{' '}
            {filteredExamples.length === 1 ? 'example' : 'examples'}
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter examples by format"
          className="mt-6 flex flex-wrap gap-2"
        >
          {CATEGORIES.map((category) => {
            const isActive = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2',
                  isActive
                    ? 'border-transparent bg-gradient-to-r from-brand-indigo to-brand-blue text-white shadow-soft'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-brand-ink'
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExamples.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg"
            >
              <MediaPlaceholder
                aspect="video"
                badge={item.format}
                title={item.title}
                icon={item.icon}
                className="rounded-none border-0 shadow-none"
              />
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">
                    {item.category}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    Layout example
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-brand-surface px-6 py-5">
          <p className="text-sm leading-6 text-slate-500">
            Looking for the full story behind a project?{' '}
            <Link
              href="/case-studies"
              className="font-semibold text-brand-indigo underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              Read the published case studies
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
