'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Film,
  Megaphone,
  Plus,
  Smartphone,
} from 'lucide-react';
import type { AddOn, OrderKind, Package } from '@/types/db';
import { FadeIn } from '@/components/shared/fade-in';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChannelManagementPlans } from './channel-management';

type PackageTabKind = Extract<OrderKind, 'HORIZONTAL' | 'VERTICAL'>;

const FALLBACK_PACKAGES: Package[] = [
  {
    id: 'fallback-solo-cut',
    name: 'Solo Cut',
    kind: 'HORIZONTAL',
    video_count: 1,
    price_per_video: 129,
    discount_percent: 0,
    is_active: true,
    created_at: '',
  },
  {
    id: 'fallback-creator-batch',
    name: 'Creator Batch',
    kind: 'HORIZONTAL',
    video_count: 4,
    price_per_video: 119,
    discount_percent: 7,
    is_active: true,
    created_at: '',
  },
  {
    id: 'fallback-channel-volume',
    name: 'Channel Volume',
    kind: 'HORIZONTAL',
    video_count: 8,
    price_per_video: 109,
    discount_percent: 15,
    is_active: true,
    created_at: '',
  },
  {
    id: 'fallback-shorts-one',
    name: 'Shorts One',
    kind: 'VERTICAL',
    video_count: 1,
    price_per_video: 99,
    discount_percent: 0,
    is_active: true,
    created_at: '',
  },
  {
    id: 'fallback-shorts-fifteen',
    name: 'Shorts Fifteen',
    kind: 'VERTICAL',
    video_count: 15,
    price_per_video: 89,
    discount_percent: 10,
    is_active: true,
    created_at: '',
  },
  {
    id: 'fallback-shorts-thirty',
    name: 'Shorts Thirty',
    kind: 'VERTICAL',
    video_count: 30,
    price_per_video: 79,
    discount_percent: 20,
    is_active: true,
    created_at: '',
  },
];

const FALLBACK_ADD_ONS: AddOn[] = [
  {
    id: 'fallback-thumbnail',
    name: 'Thumbnail / Cover Art',
    price: 43,
    is_active: true,
    created_at: '',
  },
  {
    id: 'fallback-vertical-reformat',
    name: 'Vertical (9:16) Reformat',
    price: 43,
    is_active: true,
    created_at: '',
  },
];

const PACKAGE_COPY: Record<
  PackageTabKind,
  {
    label: string;
    title: string;
    description: string;
    features: string[];
  }
> = {
  HORIZONTAL: {
    label: 'Long-form',
    title: 'Long-form packages',
    description:
      'Flagship videos, interviews, essays, and product stories shaped into a complete watch.',
    features: [
      'Story-first structure',
      'Color, sound, and captions',
      'Two revision rounds',
    ],
  },
  VERTICAL: {
    label: 'Short-form',
    title: 'Short-form packages',
    description:
      'Hook-first vertical edits with readable captions and pacing built for a fast feed.',
    features: [
      'Hook-first opening',
      'Captions and clean resizing',
      'Two revision rounds',
    ],
  },
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
          {PACKAGE_COPY[kind].label}
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
        {PACKAGE_COPY[kind].features.map((feature) => (
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
        <Link href="/signup" className="btn-cyan w-full">
          Choose this package
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function AddOnStrip({ addOns }: { addOns: AddOn[] }) {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-ink">
            Optional add-ons
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Add these during checkout only when the project needs them.
          </p>
        </div>
        <p className="text-xs font-medium text-slate-400">Per order</p>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {addOns.map((addOn) => (
          <li
            key={addOn.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3"
          >
            <span className="flex min-w-0 items-center gap-2.5 text-sm font-medium text-slate-700">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Plus aria-hidden="true" className="h-3.5 w-3.5" />
              </span>
              <span className="truncate">{addOn.name}</span>
            </span>
            <span className="shrink-0 text-sm font-semibold text-brand-ink">
              {formatMoney(addOn.price)}
            </span>
          </li>
        ))}
      </ul>
    </div>
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
  const copy = PACKAGE_COPY[kind];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">
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

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, index) => (
          <FadeIn key={item.id} delay={index * 0.05} className="h-full">
            <PackageCard item={item} kind={kind} />
          </FadeIn>
        ))}
      </div>

      <AddOnStrip addOns={addOns} />
    </div>
  );
}

export interface PricingBoardProps {
  packages?: Package[];
  addOns?: AddOn[];
}

export function PricingBoard({
  packages = [],
  addOns = [],
}: PricingBoardProps) {
  const safePackages = packages.length > 0 ? packages : FALLBACK_PACKAGES;
  const safeAddOns = addOns.length > 0 ? addOns : FALLBACK_ADD_ONS;

  return (
    <section id="pricing" className="scroll-mt-24 bg-white">
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
            The full list
          </span>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-brand-ink sm:text-4xl lg:text-5xl">
            Choose the block or the{' '}
            <span className="text-gradient">channel rhythm</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Every price is shown before the work starts. Package cards include
            the per-video rate and the block total.
          </p>
        </div>

        <div className="mt-10">
          <Tabs defaultValue="horizontal">
            <TabsList className="mx-auto flex w-full max-w-2xl flex-col gap-1 rounded-2xl bg-slate-100 p-1.5 sm:w-auto sm:flex-row sm:rounded-full">
              <TabsTrigger
                value="horizontal"
                className="flex-1 gap-2 px-4 py-2.5"
              >
                <Film aria-hidden="true" className="h-4 w-4" />
                Long-form
              </TabsTrigger>
              <TabsTrigger
                value="vertical"
                className="flex-1 gap-2 px-4 py-2.5"
              >
                <Smartphone aria-hidden="true" className="h-4 w-4" />
                Short-form
              </TabsTrigger>
              <TabsTrigger
                value="channel"
                className="flex-1 gap-2 px-4 py-2.5"
              >
                <Megaphone aria-hidden="true" className="h-4 w-4" />
                Channel management
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
      </div>
    </section>
  );
}
