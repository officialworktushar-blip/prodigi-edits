'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  Clock,
  FolderOpen,
  Megaphone,
  Radio,
  RefreshCw,
  SquarePlay,
  Undo2,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  {
    icon: Users,
    title: 'Dedicated team',
    desc: 'Every order ships to a small, accountable crew — no shared editors you cannot find contact for.',
  },
  {
    icon: Zap,
    title: 'Multiple editors',
    desc: 'From VFX compositing to color grading, two editors work independently so reviews stay fast.',
  },
  {
    icon: RefreshCw,
    title: 'Real-time updates',
    desc: 'Upload once, track progress live. Status syncs automatically across every platform.',
  },
  {
    icon: Undo2,
    title: 'Unlimited revisions',
    desc: 'A few rounds cover everything. We will always explain the trade-offs before we ask for more.',
  },
  {
    icon: Clock,
    title: '24–48 hour turnaround',
    desc: 'Fastest packages ship within a day; long-form builds up to three days. Turnaround starts when you do.',
  },
  {
    icon: FolderOpen,
    title: 'Order dashboard',
    desc: 'Central control panel: status, drafts, comments, and downloads — all in one place.',
  },
];

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-screen-1200 px-6 pb-12">
      <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">
        How the magic happens
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition-shadow hover:shadow-soft-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
                <Icon size={20} className="text-primary-500" />
              </div>
              <h3 className="mt-3 text-base font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {feature.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

const SERVICE_TABS = [
  {
    href: '/services/long-form',
    label: 'Long-Form Editing',
    icon: ClipboardList,
  },
  {
    href: '/services/short-form',
    label: 'Short-Form Editing',
    icon: SquarePlay,
  },
  {
    href: '/services/channel-management',
    label: 'Channel Management',
    icon: Radio,
  },
] as const;

export function ServicesTabs({ serviceKey = '/services/long-form' }: {
  serviceKey?: string;
}) {
  return (
    <section className="mx-auto max-w-screen-1200 px-6 pt-10">
      <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">
        Services you need
      </h2>
      <div className="mx-auto max-w-md space-y-3" role="tablist">
        {SERVICE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = serviceKey === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              role="tab"
              aria-selected={isActive}
              className={`flex items-center gap-3 rounded-full border px-5 py-3 transition-all ${
                isActive
                  ? 'border-primary-600 bg-primary-600 text-white'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon size={20} />
              <span className="font-semibold">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function ChannelManagementCard() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <Megaphone size={20} className="text-primary-500" />
      <p className="text-sm text-slate-600">
        Let our team handle publishing, titles, and thumbnails while you focus on
        the next upload.
      </p>
    </div>
  );
}
