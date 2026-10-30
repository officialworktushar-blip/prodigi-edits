'use client';

import { useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Clapperboard,
  Megaphone,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { MediaPlaceholder } from '../../shared/media-placeholder';
import { SectionHeading } from '../../shared/section-heading';

interface ServiceTab {
  key: string;
  label: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: LucideIcon;
  previewIcon: string;
  previewTitle: string;
  previewNote: string;
  features: string[];
}

const SERVICE_TABS: ServiceTab[] = [
  {
    key: 'long-form',
    label: 'Long-form',
    title: 'Deep dives with a story spine',
    description:
      'Interviews, essays, documentaries, and flagship uploads shaped into something people finish.',
    href: '/services/long-form',
    cta: 'Explore long-form editing',
    icon: Clapperboard,
    previewIcon: 'film',
    previewTitle: 'Long-form rhythm',
    previewNote: 'Story map · paper edit · sound and color',
    features: [
      'Story-first paper edit',
      'Color, sound, and captions',
      'Chapter markers and clean exports',
    ],
  },
  {
    key: 'short-form',
    label: 'Short-form',
    title: 'Cuts built for the first three seconds',
    description:
      'Vertical clips with a strong hook, readable captions, and pacing that survives a fast feed.',
    href: '/services/short-form',
    cta: 'Explore short-form editing',
    icon: Smartphone,
    previewIcon: 'play',
    previewTitle: 'Feed-ready frames',
    previewNote: 'Hook · captions · platform-specific crops',
    features: [
      'Hook-first structure',
      'Kinetic captions and clean type',
      'Native exports for every platform',
    ],
  },
  {
    key: 'channel-management',
    label: 'Channel management',
    title: 'A publishing partner, not just an editor',
    description:
      'Hand over the weekly rhythm: planning, titles, thumbnails, uploads, and a clear performance recap.',
    href: '/services/channel-management',
    cta: 'Explore channel management',
    icon: Megaphone,
    previewIcon: 'sparkles',
    previewTitle: 'Weekly publishing system',
    previewNote: 'Plan · package · publish · review',
    features: [
      'Weekly content planning',
      'Titles and thumbnail concepts',
      'Upload scheduling and recaps',
    ],
  },
];

export function ServicesTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const reduceMotion = useReducedMotion();
  const active = SERVICE_TABS[activeTab];

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (index + 1) % SERVICE_TABS.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (index - 1 + SERVICE_TABS.length) % SERVICE_TABS.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = SERVICE_TABS.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    setActiveTab(nextIndex);
    document.getElementById(`service-tab-${nextIndex}`)?.focus();
  }

  return (
    <section className="bg-brand-surface">
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Three ways we edit"
          headline="Pick the format your next idea needs"
          highlight="format"
          subcopy="The same production team, tuned for the length, platform, and publishing rhythm you actually work in."
        />

        <div
          role="tablist"
          aria-label="Editing services"
          className="mx-auto mt-8 flex max-w-2xl flex-col justify-center gap-2 sm:flex-row"
        >
          {SERVICE_TABS.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = index === activeTab;

            return (
              <button
                key={tab.key}
                id={`service-tab-${index}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="service-tab-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={cn(
                  'inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2',
                  isActive
                    ? 'border-transparent bg-gradient-to-r from-brand-indigo to-brand-blue text-white shadow-soft'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-brand-ink'
                )}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.key}
              id="service-tab-panel"
              role="tabpanel"
              aria-labelledby={`service-tab-${activeTab}`}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                  {active.label}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">
                  {active.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                  {active.description}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {active.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <Check
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={active.href}
                  className="mt-7 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                >
                  {active.cta}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>

              <MediaPlaceholder
                aspect="video"
                badge={active.label}
                title={active.previewTitle}
                description={active.previewNote}
                icon={active.previewIcon}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export function ChannelManagementCard() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <Megaphone aria-hidden="true" className="h-5 w-5 text-indigo-600" />
      <p className="text-sm leading-6 text-slate-600">
        Let the team handle publishing, titles, and thumbnails while you focus on
        the next upload.
      </p>
    </div>
  );
}
