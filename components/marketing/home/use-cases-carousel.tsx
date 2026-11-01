'use client';

import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, useAnimation } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Reveal } from '../../shared/reveal';

const useCases = [
  {
    title: 'YouTubers',
    label: 'Use case',
    description: 'Daily uploads without the editing bottleneck.',
    href: '/use-cases/youtubers',
    backgroundColor: '#7DF9B0',
    textColor: '#021B26',
    art: (
      <div className="relative h-full w-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="h-32 w-48 rounded-2xl border-4 border-current opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-current">
                <Play aria-hidden="true" className="h-5 w-5 fill-current" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 h-1 rounded-full bg-current opacity-20" />
        <div className="absolute bottom-4 left-4 h-1 w-1/3 rounded-full bg-current" />
      </div>
    ),
  },
  {
    title: 'Businesses',
    label: 'Use case',
    description: 'Brand films that convert and teams that trust.',
    href: '/use-cases/businesses',
    backgroundColor: '#1B1B1B',
    textColor: '#FFFFFF',
    art: (
      <div className="relative h-full w-full">
        <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-current opacity-20" />
        <div className="absolute right-12 top-16 h-16 w-16 rotate-45 bg-current opacity-30" />
        <div className="absolute bottom-12 left-12 h-20 w-20 -rotate-12 rounded-lg bg-current opacity-25" />
        <div className="absolute right-8 bottom-8 h-28 w-28 rounded-full border-4 border-current opacity-15" />
      </div>
    ),
  },
  {
    title: 'Podcasters',
    label: 'Use case',
    description: 'Show-ready audio and video from raw recordings.',
    href: '/use-cases/podcasters',
    backgroundColor: 'linear-gradient(135deg, #FFB5A7 0%, #FCD5CE 100%)',
    textColor: '#021B26',
    art: (
      <div className="relative h-full w-full">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 400 250"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="podWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M0,125 Q50,85 100,125 T200,125 T300,125 T400,125"
            fill="none"
            stroke="url(#podWave)"
            strokeWidth="4"
          />
          <path
            d="M0,125 Q50,85 100,125 T200,125 T300,125 T400,125"
            fill="none"
            stroke="url(#podWave)"
            strokeWidth="4"
            opacity="0.6"
            transform="translate(0, 30)"
          />
          <path
            d="M0,125 Q50,85 100,125 T200,125 T300,125 T400,125"
            fill="none"
            stroke="url(#podWave)"
            strokeWidth="4"
            opacity="0.4"
            transform="translate(0, -30)"
          />
        </svg>
      </div>
    ),
  },
  {
    title: 'Realtors',
    label: 'Use case',
    description: 'Property videos that move listings faster.',
    href: '/use-cases/realtors',
    backgroundColor: 'linear-gradient(135deg, #D4A574 0%, #C4956A 100%)',
    textColor: '#021B26',
    art: (
      <div className="relative h-full w-full">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 400 250"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M200,60 L320,110 L320,190 L200,240 L80,190 L80,110 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            opacity="0.3"
          />
          <path
            d="M200,60 L200,240"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            opacity="0.3"
          />
          <path
            d="M80,110 L320,110"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            opacity="0.3"
          />
          <path
            d="M200,60 L200,30 L260,60"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            opacity="0.4"
          />
        </svg>
      </div>
    ),
  },
  {
    title: 'Course creators',
    label: 'Use case',
    description: 'Polished lessons that students finish.',
    href: '/use-cases/course-creators',
    backgroundColor: '#D4CCF0',
    textColor: '#021B26',
    art: (
      <div className="relative h-full w-full p-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-current opacity-20 p-3">
            <div className="h-2 w-3/4 rounded bg-current opacity-60" />
            <div className="mt-2 h-12 rounded bg-current opacity-30" />
          </div>
          <div className="rounded-lg bg-current opacity-15 p-3">
            <div className="h-2 w-2/3 rounded bg-current opacity-50" />
            <div className="mt-2 h-12 rounded bg-current opacity-25" />
          </div>
          <div className="rounded-lg bg-current opacity-18 p-3">
            <div className="h-2 w-4/5 rounded bg-current opacity-55" />
            <div className="mt-2 h-12 rounded bg-current opacity-28" />
          </div>
          <div className="rounded-lg bg-current opacity-22 p-3">
            <div className="h-2 w-1/2 rounded bg-current opacity-65" />
            <div className="mt-2 h-12 rounded bg-current opacity-32" />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Doctors',
    label: 'Use case',
    description: 'Patient education videos that build trust.',
    href: '/use-cases/doctors',
    backgroundColor: '#BFE9FB',
    textColor: '#021B26',
    art: (
      <div className="relative h-full w-full">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-4 rounded-full bg-current opacity-40" />
              <div className="absolute h-4 w-16 rounded-full bg-current opacity-40" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-6 right-6 rounded-lg bg-white/80 p-3">
          <div className="h-2 w-1/3 rounded bg-current opacity-60" />
          <div className="mt-2 h-2 w-2/3 rounded bg-current opacity-40" />
        </div>
      </div>
    ),
  },
  {
    title: 'Lawyers',
    label: 'Use case',
    description: 'Firm videos that communicate authority.',
    href: '/use-cases/lawyers',
    backgroundColor: '#3730A3',
    textColor: '#FFFFFF',
    art: (
      <div className="relative h-full w-full">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg
            className="h-24 w-24"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <rect x="30" y="10" width="40" height="3" fill="currentColor" opacity="0.4" />
            <rect x="35" y="20" width="30" height="50" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            <line x1="50" y1="70" x2="50" y2="85" stroke="currentColor" strokeWidth="2" opacity="0.4" />
            <line x1="40" y1="85" x2="60" y2="85" stroke="currentColor" strokeWidth="2" opacity="0.4" />
          </svg>
        </div>
        <div className="absolute bottom-6 right-6 h-16 w-12 border-2 border-current opacity-30" />
        <div className="absolute bottom-10 right-8 h-8 w-2 bg-current opacity-40" />
      </div>
    ),
  },
];

export function UseCasesCarousel() {
  const reduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;

    const scrollAmount = scrollRef.current.clientWidth * 0.85;
    const newScroll =
      direction === 'left'
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;

    scrollRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowLeft') {
      scroll('left');
    } else if (event.key === 'ArrowRight') {
      scroll('right');
    }
  };

  useEffect(() => {
    if (reduceMotion) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        if (scrollRef.current.scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right');
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [reduceMotion]);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: 'var(--hs-navy)',
        backgroundImage: 'radial-gradient(ellipse at 50% 60%, rgba(90,90,148,.55), transparent 60%)',
      }}
    >
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-center text-[clamp(2rem,4vw,3.25rem)] font-medium tracking-tight text-white [-webkit-font-smoothing:antialiased]">
            Edits tailored for every team.
          </h2>
          <p className="mx-auto mt-4 max-w-[60ch] text-center text-base leading-relaxed text-white/90">
            Kick off your next upload with a workflow built for your audience. Every edit style comes with the same crew, the same dashboard and the same clear process.
          </p>

          <Link
            href="/use-cases/youtubers"
            className="mx-auto mt-8 inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--hs-navy)]"
          >
            Explore use cases
          </Link>
        </Reveal>

        <div className="mt-12 relative">
          <button
            type="button"
            aria-label="Previous use cases"
            onClick={() => scroll('left')}
            onKeyDown={handleKeyDown}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 lg:-ml-16"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Next use cases"
            onClick={() => scroll('right')}
            onKeyDown={handleKeyDown}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 lg:-mr-16"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth px-4 pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {useCases.map((useCase, index) => (
              <Link
                key={useCase.title}
                href={useCase.href}
                className="group relative flex-shrink-0 w-[85vw] max-w-[500px] snap-center transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--hs-navy)] sm:w-[45vw] lg:w-[30vw]"
              >
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative aspect-[16/10] overflow-hidden rounded-3xl"
                  style={{
                    background: useCase.backgroundColor,
                    color: useCase.textColor,
                  }}
                >
                  <div className="absolute inset-0 p-6">
                    <span className="inline-block text-xs font-semibold uppercase tracking-wider opacity-70">
                      {useCase.label}
                    </span>
                    <h3 className="mt-4 text-3xl font-bold tracking-tight [-webkit-font-smoothing:antialiased]">
                      {useCase.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed opacity-90">
                      {useCase.description}
                    </p>
                  </div>

                  <div className="absolute inset-0 opacity-30">
                    {useCase.art}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
