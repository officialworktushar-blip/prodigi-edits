import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../../shared/reveal';

const services = [
  {
    title: 'Long-form',
    description:
      'Interviews, essays, documentaries, and flagship uploads shaped into something people finish.',
    href: '/services/long-form',
    art: (
      <div className="relative h-full w-full">
        <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
          Story map
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="space-y-2">
            <div className="h-2 rounded-full bg-white/40" />
            <div className="h-2 w-3/4 rounded-full bg-white/60" />
            <div className="h-2 w-1/2 rounded-full bg-white/50" />
          </div>
          <div className="mt-3 flex gap-1">
            <div className="h-8 w-2 rounded-full bg-white/60" />
            <div className="h-12 w-2 rounded-full bg-white/80" />
            <div className="h-6 w-2 rounded-full bg-white/50" />
            <div className="h-10 w-2 rounded-full bg-white/70" />
            <div className="h-8 w-2 rounded-full bg-white/60" />
            <div className="h-14 w-2 rounded-full bg-white/90" />
            <div className="h-7 w-2 rounded-full bg-white/55" />
            <div className="h-9 w-2 rounded-full bg-white/65" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Short-form',
    description:
      'Vertical clips with a strong hook, readable captions, and pacing that survives a fast feed.',
    href: '/services/short-form',
    art: (
      <div className="relative h-full w-full">
        <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
          Hook + captions
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
          <div className="flex-1 rounded-lg bg-white/60 p-2">
            <div className="mb-1 h-1.5 w-1/2 rounded-full bg-white/80" />
            <div className="h-16 rounded bg-white/40" />
            <div className="mt-1 h-1 w-3/4 rounded-full bg-white/70" />
          </div>
          <div className="flex-1 rounded-lg bg-white/50 p-2">
            <div className="mb-1 h-1.5 w-2/3 rounded-full bg-white/80" />
            <div className="h-16 rounded bg-white/30" />
            <div className="mt-1 h-1 w-1/2 rounded-full bg-white/60" />
          </div>
          <div className="flex-1 rounded-lg bg-white/70 p-2">
            <div className="mb-1 h-1.5 w-1/3 rounded-full bg-white/90" />
            <div className="h-16 rounded bg-white/50" />
            <div className="mt-1 h-1 w-2/3 rounded-full bg-white/80" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Channel management',
    description:
      'Hand over the weekly rhythm: planning, titles, thumbnails, uploads, and a clear performance recap.',
    href: '/services/channel-management',
    art: (
      <div className="relative h-full w-full">
        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-700">
            Upload
          </span>
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-700">
            Thumbnails
          </span>
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-700">
            Planning
          </span>
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-700">
            Recap
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="grid grid-cols-3 gap-1.5">
            <div className="aspect-square rounded bg-white/60" />
            <div className="aspect-square rounded bg-white/40" />
            <div className="aspect-square rounded bg-white/70" />
            <div className="aspect-square rounded bg-white/50" />
            <div className="aspect-square rounded bg-white/80" />
            <div className="aspect-square rounded bg-white/55" />
          </div>
          <div className="mt-2 h-1 w-full rounded-full bg-white/40" />
          <div className="mt-1.5 h-1 w-2/3 rounded-full bg-white/60" />
        </div>
      </div>
    ),
  },
];

export function ThreeWaysSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-center text-[clamp(2rem,4vw,3.25rem)] font-medium tracking-tight [-webkit-font-smoothing:antialiased]" style={{ color: 'var(--hs-ink)' }}>
            Three ways to build faster with ProdigiEdits
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg" style={{ backgroundColor: 'var(--hs-light)' }}>
                <div
                  className="relative h-48 w-full overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #CDEEFB 0%, #EAF6FB 100%)',
                  }}
                >
                  {service.art}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-[clamp(1.5rem,2.5vw,2rem)] font-medium tracking-tight [-webkit-font-smoothing:antialiased]" style={{ color: 'var(--hs-ink)' }}>
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-slate-600">
                    {service.description}
                  </p>

                  <Link
                    href={service.href}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hs-cyan)] focus-visible:ring-offset-2"
                    style={{ color: 'var(--hs-cyan)' }}
                  >
                    Learn more
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
