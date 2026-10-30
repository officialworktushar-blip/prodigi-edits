import {
  Clock,
  FolderOpen,
  RefreshCw,
  Undo2,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { FadeIn } from '../../shared/fade-in';
import { SectionHeading } from '../../shared/section-heading';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Users,
    title: 'Dedicated team',
    description:
      'Every order goes to a small, accountable crew with a named contact and a clear handoff.',
  },
  {
    icon: Zap,
    title: 'Multiple specialists',
    description:
      'Editing, motion, color, and sound sit in the same workflow, so polish never waits in a queue.',
  },
  {
    icon: RefreshCw,
    title: 'Live progress',
    description:
      'Track drafts, comments, and approvals in one place instead of chasing updates across inboxes.',
  },
  {
    icon: Undo2,
    title: 'Useful revisions',
    description:
      'Leave timecoded notes and get a clear response. We explain the trade-offs before pushing back.',
  },
  {
    icon: Clock,
    title: '24–48 hour turnaround',
    description:
      'Most packages start shipping within a day. Long-form builds get a schedule you can plan around.',
  },
  {
    icon: FolderOpen,
    title: 'One order dashboard',
    description:
      'Status, footage, drafts, comments, and final downloads stay together from kickoff to delivery.',
  },
];

export function FeaturesGrid() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Built into every order"
          headline="The details that keep edits moving"
          highlight="moving"
          subcopy="A production setup designed for feedback, deadlines, and the very real need to publish again next week."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <FadeIn key={feature.title} delay={index * 0.04} className="h-full">
                <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-soft-lg">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold tracking-tight text-brand-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
