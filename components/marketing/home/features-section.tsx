import {
  Users,
  Zap,
  RefreshCw,
  Undo2,
  Clock,
  FolderOpen,
} from 'lucide-react';
import { Reveal } from '../../shared/reveal';
import { preservedFeatures } from '../../../lib/data/home-preserved';

const features = [
  {
    icon: <Users className="h-10 w-10" aria-hidden="true" />,
    title: 'Dedicated team',
    description: preservedFeatures[0].description,
  },
  {
    icon: <Zap className="h-10 w-10" aria-hidden="true" />,
    title: 'Multiple specialists',
    description: preservedFeatures[1].description,
  },
  {
    icon: <RefreshCw className="h-10 w-10" aria-hidden="true" />,
    title: 'Live progress',
    description: preservedFeatures[2].description,
  },
  {
    icon: <Undo2 className="h-10 w-10" aria-hidden="true" />,
    title: 'Useful revisions',
    description: preservedFeatures[3].description,
  },
  {
    icon: <Clock className="h-10 w-10" aria-hidden="true" />,
    title: '24–48 hour turnaround',
    description: preservedFeatures[4].description,
  },
  {
    icon: <FolderOpen className="h-10 w-10" aria-hidden="true" />,
    title: 'One order dashboard',
    description: preservedFeatures[5].description,
  },
];

export function FeaturesSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top left, #FFFFFF 0%, transparent 50%), radial-gradient(ellipse at bottom right, #D9CCF0 0%, transparent 50%), linear-gradient(135deg, #FFFFFF 0%, #BFE9FB 50%, #D9CCF0 100%)',
      }}
    >
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-center text-[clamp(2rem,4vw,3.25rem)] font-medium tracking-tight [-webkit-font-smoothing:antialiased]" style={{ color: 'var(--hs-ink)' }}>
            Everything built into every order
          </h2>
          <p className="mx-auto mt-4 text-center text-base text-slate-600">
            A production setup designed for feedback, deadlines, and consistent quality.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.06}>
              <article className="group flex h-full flex-col rounded-3xl bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{ color: 'var(--hs-cyan)' }}
                >
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-[clamp(1.25rem,2vw,1.6rem)] font-medium tracking-tight [-webkit-font-smoothing:antialiased]" style={{ color: 'var(--hs-ink)' }}>
                  {feature.title}
                </h3>
                <p className="mt-3 flex-1 text-base leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
