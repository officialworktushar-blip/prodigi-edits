import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../../shared/reveal';

const caseStudies = [
  {
    title: 'Daily uploads without a team',
    label: 'SOLO CREATOR',
    description: 'How a YouTuber scaled from weekly to daily uploads with a dedicated editor.',
    href: '/case-studies/daily-uploads-without-a-team',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    art: (
      <div className="relative h-full w-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-2">
            <div className="h-16 w-24 rounded-lg bg-white/20" />
            <div className="h-16 w-24 rounded-lg bg-white/15" />
            <div className="h-16 w-24 rounded-lg bg-white/25" />
          </div>
        </div>
        <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20" />
        <div className="absolute bottom-8 left-8 h-2 w-16 rounded-full bg-white/30" />
      </div>
    ),
  },
  {
    title: 'Launch week without the scramble',
    label: 'PRODUCT TEAM',
    description: 'A product launch video delivered on schedule with zero last-minute edits.',
    href: '/case-studies/launch-week-without-the-scramble',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    art: (
      <div className="relative h-full w-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-white/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-white/25" />
            </div>
          </div>
        </div>
        <div className="absolute top-6 left-6 h-12 w-2 rounded-full bg-white/20" />
        <div className="absolute top-6 right-6 h-2 w-12 rounded-full bg-white/20" />
        <div className="absolute bottom-6 left-6 h-2 w-12 rounded-full bg-white/20" />
        <div className="absolute bottom-6 right-6 h-12 w-2 rounded-full bg-white/20" />
      </div>
    ),
  },
  {
    title: 'A podcast that sounds like a show',
    label: 'PODCAST STUDIO',
    description: 'Raw recordings turned into broadcast-ready episodes with consistent audio and video.',
    href: '/case-studies/a-podcast-that-sounds-like-a-show',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    art: (
      <div className="relative h-full w-full">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 400 600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="caseWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="white" stopOpacity="0.2" />
              <stop offset="50%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M0,300 Q100,200 200,300 T400,300"
            fill="none"
            stroke="url(#caseWave)"
            strokeWidth="6"
          />
          <path
            d="M0,300 Q100,200 200,300 T400,300"
            fill="none"
            stroke="url(#caseWave)"
            strokeWidth="6"
            opacity="0.6"
            transform="translate(0, 50)"
          />
          <path
            d="M0,300 Q100,200 200,300 T400,300"
            fill="none"
            stroke="url(#caseWave)"
            strokeWidth="6"
            opacity="0.4"
            transform="translate(0, -50)"
          />
        </svg>
        <div className="absolute bottom-6 left-6 right-6 h-1 rounded-full bg-white/30" />
        <div className="absolute bottom-6 left-6 h-1 w-1/3 rounded-full bg-white/60" />
      </div>
    ),
  },
];

export function CaseStudiesSection() {
  return (
    <section style={{ backgroundColor: 'var(--hs-teal)' }}>
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-center text-[clamp(2rem,4vw,3.25rem)] font-medium tracking-tight text-white [-webkit-font-smoothing:antialiased]">
            Recent work that shipped on schedule
          </h2>
          <p className="mx-auto mt-4 text-center text-base text-white/90">
            A few projects where the brief was clear, the feedback was focused, and the deadline held.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((caseStudy, index) => (
            <Reveal key={caseStudy.title} delay={index * 0.08}>
              <Link
                href={caseStudy.href}
                className="group block aspect-[3/4] overflow-hidden rounded-3xl transition-transform duration-500 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--hs-teal)]"
              >
                <div className="relative h-full w-full">
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                    style={{ background: caseStudy.gradient }}
                  >
                    {caseStudy.art}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute inset-0 flex flex-col p-6">
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                      {caseStudy.label}
                    </span>

                    <div className="mt-auto">
                      <h3 className="text-2xl font-semibold tracking-tight text-white [-webkit-font-smoothing:antialiased]">
                        {caseStudy.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/90">
                        {caseStudy.description}
                      </p>

                      <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors group-hover:gap-2.5">
                        Read the story
                        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
