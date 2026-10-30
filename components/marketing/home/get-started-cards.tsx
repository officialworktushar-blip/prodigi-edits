import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Clapperboard,
  Layers,
  Megaphone,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { FadeIn } from '../../shared/fade-in';
import { SectionHeading } from '../../shared/section-heading';

interface GetStartedCard {
  title: string;
  tag: string;
  description: string;
  features: string[];
  href: string;
  cta: string;
  icon: LucideIcon;
  featured?: boolean;
}

const cards: GetStartedCard[] = [
  {
    title: 'Order one video',
    tag: 'Single project',
    description:
      'Perfect for a launch, interview, or flagship upload. Send the brief and footage; we return a polished cut.',
    features: [
      'One dedicated editor',
      'Two revision rounds',
      'Every export format',
    ],
    href: '/signup',
    cta: 'Start an order',
    icon: Clapperboard,
  },
  {
    title: 'Buy a package',
    tag: 'Most popular',
    description:
      'Reserve a monthly block of edits and keep a steady publishing rhythm with priority scheduling.',
    features: [
      'Priority turnaround',
      'Rollover editing hours',
      'Monthly strategy check-in',
    ],
    href: '/pricing',
    cta: 'Compare packages',
    icon: Layers,
    featured: true,
  },
  {
    title: 'Channel management',
    tag: 'Full service',
    description:
      'Hand over publishing, titles, thumbnails, and weekly planning to a crew that knows the channel.',
    features: [
      'Upload and scheduling',
      'Thumbnail concepts',
      'Performance recap',
    ],
    href: '/services/channel-management',
    cta: 'Explore management',
    icon: Megaphone,
  },
];

export function GetStartedCards() {
  return (
    <section className="bg-brand-surface">
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Start where you are"
          headline="Choose the way you want to work"
          highlight="work"
          subcopy="One project or a full publishing rhythm. Every route includes a real editor, clear revisions, and one place to track it all."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <FadeIn key={card.title} delay={index * 0.06} className="h-full">
                <article
                  className={cn(
                    'group flex h-full flex-col rounded-2xl border bg-white p-6 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-soft-lg',
                    card.featured
                      ? 'border-brand-indigo/25 ring-1 ring-brand-indigo/10'
                      : 'border-slate-200'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[11px] font-semibold',
                        card.featured
                          ? 'bg-indigo-50 text-brand-indigo'
                          : 'bg-slate-100 text-slate-500'
                      )}
                    >
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold tracking-tight text-brand-ink">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {card.description}
                  </p>

                  <ul className="mt-5 space-y-2">
                    {card.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <Check
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-emerald-600"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto border-t border-slate-100 pt-5">
                    <Link
                      href={card.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-indigo transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                    >
                      {card.cta}
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
