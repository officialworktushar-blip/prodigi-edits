'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { EmptyState } from '@/components/shared/empty-state';
import type { CaseStudy } from '@/lib/config';

const FEATURES = [
  { icon: UsersIcon, title: 'Dedicated team', desc: 'Every order ships to a small, accountable crew — no shared editors you can\'t find contact for.' },
  { icon: ZapIcon, title: 'Multiple editors', desc: 'From VFX compositing to color grading, two editors work independently so reviews stay fast.' },
  { icon: SyncIcon, title: 'Real-time updates', desc: 'Upload once, track progress live. Status syncs automatically across every platform.' },
  { icon: Undo2Icon, title: 'Unlimited revisions', desc: 'A few rounds cover everything. We\'ll always explain the trade-offs before we ask for more.' },
  { icon: ClockIcon, title: '24–48 hour turnaround', desc: 'Fastest packages ship within a day; long-form builds up to three days. Turnaround starts when you do.' },
  { icon: DashboardIcon, title: 'Order dashboard', desc: 'Central control panel: status, drafts, comments, and downloads — all in one place.' },
];

function FeaturesGrid() {
  return (
    <div className="mx-auto max-w-screen-1200px px-6 pb-12">
      <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">How the magic happens</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:shadow-soft-lg transition-shadow"
          >
            <div className="bg-primary-muted flex h-12 w-12 items-center justify-center rounded-full">
              <f.icon size={20} className="text-primary-500" />
            </div>
            <h3 className="mt-3 text-base font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Services tabs ───────────────────────────────────────────────
const SERVICE_TABS = [
  { href: '/services/long-form', label: 'Long-Form Editing', icon: ClipboardText },
  { href: '/services/short-form', label: 'Short-Form Editing', icon: SquareVideo },
  { href: '/services/channel-management', label: 'Channel Management', icon: Channel },
] as const;

function ServicesTabs({ serviceKey = 'long-form' }: { serviceKey?: typeof SERVICE_TABS[number]['href'] }) {
  return (
    <div className="mx-auto max-w-screen-1200px px-6 pt-10">
      <h2 className="text-center mb-8 text-3xl font-bold text-slate-900">Services you need</h2>
      <div className="mx-auto max-w-md space-y-3" role="tablist">
        {SERVICE_TABS.map((tab) => (
          <button
            key={tab.href}
            role="tabbutton"
            aria-selected={serviceKey === tab.href}
            onClick={() => (window.location.href = tab.href)}
            className={`flex items-center gap-3 rounded-full border transition-all ${
              serviceKey === tab.href ? 'bg-primary-gradient border-primary-600 text-white' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span className="text-xl">{tab.icon(20)}</span>
            <span className="font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Icons wrapped as display functions so components stay readable
const UsersIcon = () => <Users size={20} />;
const ZapIcon = () => <Zap size={20} />;
const SyncIcon = () => <Sync size={20} />;
const Undo2Icon = () => <Undo2 size={20} />;
const ClockIcon = () => <Clock size={20} />;
const DashboardIcon = () => <FolderLines size={20} />;
const ClipboardText = () => <ClipboardList size={20} />;
const SquareVideo = () => <SquareVideoIcon size={20} />;
const Channel = () => <ChannelSize={20} />;

// Re-export empty brand for reuse where needed
export { FeaturesGrid, ServicesTabs };
