import { FadeIn } from '../../shared/fade-in';
import { SectionHeading } from '../../shared/section-heading';
import { StatCard } from '../../shared/stat-card';

const stats = [
  {
    value: '24–48h',
    label: 'Typical first-cut turnaround',
    hint: 'Starts when footage lands',
    icon: 'clock',
  },
  {
    value: '4.9/5',
    label: 'Average review score',
    hint: 'Across 300+ deliveries',
    icon: 'sparkles',
  },
  {
    value: '1,200+',
    label: 'Videos shipped',
    hint: 'Long-form, short-form, and ads',
    icon: 'video',
  },
  {
    value: '87%',
    label: 'Teams that reorder',
    hint: 'Within their first month',
    icon: 'trend',
  },
];

export function Stats() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The rhythm"
          headline="A production pace you can plan around"
          highlight="plan"
          subcopy="No black-box queues. Clear turnarounds, visible progress, and a dashboard that tells you what happens next."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.05} className="h-full">
              <StatCard {...stat} className="h-full" />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
