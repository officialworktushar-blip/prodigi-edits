'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
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
  from: string;
  to: string;
}

const EXAMPLES: ExampleItem[] = [
  {
    id: 'founder-interview',
    title: 'The founder interview that opened a launch',
    category: 'Long-form',
    format: 'Brand film',
    description:
      'A patient conversation shaped into a launch story with room for the product to breathe.',
    from: '#7dd3fc',
    to: '#4f46e5',
  },
  {
    id: 'product-demo',
    title: 'A product demo with no wasted seconds',
    category: 'Long-form',
    format: 'Product walkthrough',
    description:
      'Feature steps ordered around the buyer question, not the internal feature list.',
    from: '#c4b5fd',
    to: '#7c3aed',
  },
  {
    id: 'podcast-episode',
    title: 'A weekly podcast, cut for both ears and eyes',
    category: 'Long-form',
    format: 'Video podcast',
    description:
      'Multi-camera footage cleaned up, tightened, and finished with a consistent show identity.',
    from: '#f9a8d4',
    to: '#db2777',
  },
  {
    id: 'keynote-cutdowns',
    title: 'Three hooks from one keynote',
    category: 'Short-form',
    format: 'Cutdowns',
    description:
      'Complete ideas pulled from a long talk and paced for a fast-moving social feed.',
    from: '#fde68a',
    to: '#f97316',
  },
  {
    id: 'course-intro',
    title: 'A course intro that gets to the first lesson',
    category: 'Short-form',
    format: 'Module intro',
    description:
      'A short opening that sets the outcome, removes hesitation, and makes starting feel easy.',
    from: '#a7f3d0',
    to: '#0d9488',
  },
  {
    id: 'client-story',
    title: 'A client story with the volume turned down',
    category: 'Short-form',
    format: 'Testimonial',
    description:
      'A credible, measured testimonial built around the moment the client decided to act.',
    from: '#bae6fd',
    to: '#2563eb',
  },
  {
    id: 'property-tour',
    title: 'A listing tour that starts at the front door',
    category: 'Vertical',
    format: '9:16 property tour',
    description:
      'A clear room-by-room walkthrough with a pace that respects a buyer attention span.',
    from: '#ddd6fe',
    to: '#4f46e5',
  },
  {
    id: 'podcast-clip',
    title: 'The clip that carries the whole interview',
    category: 'Vertical',
    format: '9:16 highlight',
    description:
      'One strong answer, framed and captioned so the guest point lands without context.',
    from: '#fbcfe8',
    to: '#be185d',
  },
  {
    id: 'patient-tip',
    title: 'A patient tip without the clinic stiffness',
    category: 'Vertical',
    format: '9:16 explainer',
    description:
      'Plain-language health guidance with a warmer tone and a calm, readable visual rhythm.',
    from: '#99f6e4',
    to: '#0f766e',
  },
  {
    id: 'weekly-system',
    title: 'A weekly upload system in one workspace',
    category: 'Channel management',
    format: 'Publishing system',
    description:
      'Briefs, footage, review notes, and delivery files organized around the same weekly cadence.',
    from: '#bae6fd',
    to: '#4338ca',
  },
  {
    id: 'thumbnail-series',
    title: 'A thumbnail set for a six-part series',
    category: 'Channel management',
    format: 'Thumbnail package',
    description:
      'A cohesive visual family that still gives every episode its own clear reason to click.',
    from: '#fde68a',
    to: '#ea580c',
  },
  {
    id: 'launch-week',
    title: 'A launch week, packaged and scheduled',
    category: 'Channel management',
    format: 'Launch package',
    description:
      'A hero film, feature clips, and vertical cutdowns prepared as one coordinated release.',
    from: '#c4b5fd',
    to: '#db2777',
  },
];

function ExampleCover({ item }: { item: ExampleItem }) {
  return (
    <div
      role="img"
      aria-label={`${item.format} example cover for ${item.title}`}
      className="relative aspect-video overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, ${item.from}, ${item.to})`,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute -left-10 -top-12 h-36 w-36 rounded-full bg-white/25 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-12 -right-6 h-40 w-40 rounded-full bg-slate-950/20 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02),rgba(15,23,42,0.32))]"
      />

      <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
        <span className="rounded-full border border-white/40 bg-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
          {item.format}
        </span>
        <span className="rounded-full bg-slate-950/30 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
          Layout example
        </span>
      </div>

      <div className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/25 text-white shadow-[0_10px_30px_-12px_rgba(15,23,42,0.8)] backdrop-blur">
        <Play
          aria-hidden="true"
          className="ml-0.5 h-5 w-5 fill-white text-white"
        />
      </div>

      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-16 rounded-full bg-white/80" />
          <span className="h-1.5 w-9 rounded-full bg-white/55" />
          <span className="h-1.5 w-5 rounded-full bg-white/35" />
        </div>
        <span className="rounded-md border border-white/25 bg-slate-950/25 px-2 py-1 text-[10px] font-medium text-white/85 backdrop-blur">
          {item.category}
        </span>
      </div>
    </div>
  );
}

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
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
              Example library
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Representative format previews, not published client reels.
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
                    ? 'border-transparent bg-[#4cc9ff] text-[#062033] shadow-soft'
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
              <ExampleCover item={item} />
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">
                    {item.category}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    Not a client reel
                  </span>
                </div>
                <h3 className="mt-3 text-base font-semibold tracking-tight text-brand-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
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
