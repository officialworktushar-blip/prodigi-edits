'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Film,
  FolderOpen,
  Megaphone,
  Monitor,
  Music,
  Plus,
  RotateCcw,
  Smartphone,
  Type,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { AddOn, OrderKind, Package } from '../../../types/db';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { EmptyState } from '../../shared/empty-state';
import { FadeIn } from '../../shared/fade-in';
import { ChannelManagementPlans } from './channel-management';

type PackageTabKind = Extract<OrderKind, 'HORIZONTAL' | 'VERTICAL'>;

interface IncludedItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const INCLUDED_ITEMS: IncludedItem[] = [
  {
    icon: Users,
    title: 'A real editor',
    description: 'A named person owns the cut, not an anonymous queue.',
  },
  {
    icon: RotateCcw,
    title: 'Clear revisions',
    description: 'Two rounds with timecoded notes on every package.',
  },
  {
    icon: Type,
    title: 'Captions and titles',
    description: 'Readable captions and on-brand type where the format needs them.',
  },
  {
    icon: Music,
    title: 'Sound and music',
    description: 'Clean dialogue, balanced mix, and licensed music selections.',
  },
  {
    icon: Monitor,
    title: 'Platform exports',
    description: 'The aspect ratios and file formats your channels require.',
  },
  {
    icon: FolderOpen,
    title: 'Project files',
    description: 'Organized source files and final exports, ready when you are.',
  },
];

const PACKAGE_TAB_COPY: Record<
  PackageTabKind,
  { title: string; description: string }
> = {
  HORIZONTAL: {
    title: 'Long-form packages',
    description:
      'Interviews, essays, documentaries, and flagship uploads shaped into something people finish.',
  },
  VERTICAL: {
    title: 'Short-form packages',
    description:
      'Hook-first vertical edits with readable captions and pacing that survives a fast feed.',
  },
};

const PACKAGE_FEATURES: Record<PackageTabKind, string[]> = {
  HORIZONTAL: [
    'Story-first structure',
    'Color, sound, and captions',
    'Two revision rounds',
  ],
  VERTICAL: [
    'Hook-first opening',
    'Captions and clean resizing',
    'Two revision rounds',
  ],
};

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function PackageCard({
  item,
  kind,
}: {
  item: Package;
  kind: PackageTabKind;
}) {
  const discount = item.discount_percent ?? 0;
  const blockTotal = item.price_per_video * item.video_count;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-soft-lg">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          {kind === 'HORIZONTAL' ? 'Long-form' : 'Short-form'}
        </span>
        {discount > 0 ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            Save {discount}%
          </span>
        ) : null}
      </div>

      <h3 className="mt-5 text-xl font-semibold tracking-tight text-brand-ink">
        {item.name}
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        {item.video_count} {item.video_count === 1 ? 'video' : 'videos'} per
        block
      </p>

      <div className="mt-5 flex items-baseline gap-1.5">
        <span className="text-3xl font-bold tracking-tight text-brand-ink">
          {formatMoney(item.price_per_video)}
        </span>
        <span className="text-sm text-slate-500">/ video</span>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        {formatMoney(blockTotal)} total for the block
      </p>

      <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-5">
        {PACKAGE_FEATURES[kind].map((feature) => (
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

      <div className="mt-auto pt-7">
        <Link
          href="/signup"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
        >
          Choose this package
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function IncludedGrid() {
  return (
    <section aria-labelledby="included-heading">
      <div className="max-w-2xl">
        <h3
          id="included-heading"
          className="text-xl font-semibold tracking-tight text-brand-ink sm:text-2xl"
        >
          All packages include
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          No hidden production fees. The essentials are part of every edit.
        </p>
      </div>

      <div className="mt-6 grid gap-4 rounded-3xl border border-slate-200 bg-brand-surface p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
        {INCLUDED_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <h4 className="mt-3 text-sm font-semibold text-brand-ink">
                {item.title}
              </h4>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AddOnsSection({ addOns }: { addOns: AddOn[] }) {
  return (
    <section aria-labelledby="addons-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h3
            id="addons-heading"
            className="text-xl font-semibold tracking-tight text-brand-ink sm:text-2xl"
          >
            Add-ons when you need them
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Optional extras for the uploads that need a little more. Add them
            during checkout or leave them out entirely.
          </p>
        </div>
      </div>

      {addOns.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white">
          <EmptyState
            icon="sparkles"
            title="Add-ons are being refreshed"
            description="Optional extras are being updated. Your package still includes the full editing essentials."
            actionLabel="Ask about extras"
            actionHref="/contact"
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {addOns.map((addOn) => (
            <div
              key={addOn.id}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Plus aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-brand-ink">
                  {addOn.name}
                </h4>
                <p className="mt-1 text-sm text-slate-500">
                  {formatMoney(addOn.price)}{' '}
                  <span className="text-xs text-slate-400">per order</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function PackagePanel({
  kind,
  packages,
  addOns,
}: {
  kind: PackageTabKind;
  packages: Package[];
  addOns: AddOn[];
}) {
  const filtered = packages.filter((item) => item.kind === kind);
  const copy = PACKAGE_TAB_COPY[kind];

  return (
    <div className="space-y-16">
      <section aria-labelledby={`${kind.toLowerCase()}-packages-heading`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2
              id={`${kind.toLowerCase()}-packages-heading`}
              className="text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl"
            >
              {copy.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              {copy.description}
            </p>
          </div>
          <p className="text-xs font-medium text-slate-400">
            Prices per video in USD
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white">
            <EmptyState
              icon="folder"
              title="These packages are being updated"
              description="We are refreshing the options for this format. Tell us what you need and we will put together a clear quote."
              actionLabel="Contact us"
              actionHref="/contact"
            />
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, index) => (
              <FadeIn
                key={item.id}
                delay={index * 0.05}
                className="h-full"
              >
                <PackageCard item={item} kind={kind} />
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      <IncludedGrid />
      <AddOnsSection addOns={addOns} />
    </div>
  );
}

export interface PricingExperienceProps {
  packages?: Package[];
  addOns?: AddOn[];
}

export function PricingExperience({
  packages = [],
  addOns = [],
}: PricingExperienceProps) {
  const safePackages = packages ?? [];
  const safeAddOns = addOns ?? [];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-screen-1200 px-4 pb-20 sm:px-6 lg:px-8">
        <Tabs defaultValue="horizontal">
          <TabsList className="mx-auto flex w-full max-w-2xl flex-col gap-1 rounded-2xl bg-slate-100 p-1.5 sm:w-auto sm:flex-row sm:rounded-full">
            <TabsTrigger
              value="horizontal"
              className="flex-1 gap-2 px-4 py-2.5"
            >
              <Film aria-hidden="true" className="h-4 w-4" />
              Horizontal
            </TabsTrigger>
            <TabsTrigger
              value="vertical"
              className="flex-1 gap-2 px-4 py-2.5"
            >
              <Smartphone aria-hidden="true" className="h-4 w-4" />
              Vertical
            </TabsTrigger>
            <TabsTrigger
              value="channel"
              className="flex-1 gap-2 px-4 py-2.5"
            >
              <Megaphone aria-hidden="true" className="h-4 w-4" />
              Channel Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="horizontal" className="mt-10">
            <PackagePanel
              kind="HORIZONTAL"
              packages={safePackages}
              addOns={safeAddOns}
            />
          </TabsContent>

          <TabsContent value="vertical" className="mt-10">
            <PackagePanel
              kind="VERTICAL"
              packages={safePackages}
              addOns={safeAddOns}
            />
          </TabsContent>

          <TabsContent value="channel" className="mt-10">
            <ChannelManagementPlans />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
