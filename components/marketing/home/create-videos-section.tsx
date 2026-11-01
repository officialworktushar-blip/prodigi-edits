'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Grid3x3 } from 'lucide-react';
import { Reveal } from '../../shared/reveal';

const progressBars = [
  { label: 'Brief', value: 100, color: '#FFC857' },
  { label: 'Edit', value: 72, color: '#B45FE0' },
  { label: 'Review', value: 35, color: '#5B6BF0' },
];

const benefits = [
  {
    title: 'Save hours on every upload',
    description:
      'First cut in 24-48 hours, no timeline wrestling, you keep the creative direction.',
  },
  {
    title: 'Impress any audience',
    description:
      'From subscribers to stakeholders, pacing, sound, captions and color handled by specialists.',
  },
  {
    title: 'Standardize quality across every video',
    description:
      'Share brand notes once; your crew keeps intros, lower thirds and captions consistent every upload.',
  },
];

export function CreateVideosSection() {
  const reduceMotion = useReducedMotion();
  const [animateBars, setAnimateBars] = useState(false);

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--hs-navy)' }}
    >
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <Reveal onViewportEnter={() => setAnimateBars(true)}>
          <h2 className="text-center text-[clamp(2rem,4vw,3.25rem)] font-medium tracking-tight text-white [-webkit-font-smoothing:antialiased]">
            Create videos you&apos;re proud to publish
          </h2>

          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div
                className="overflow-hidden rounded-3xl"
                style={{
                  background: 'linear-gradient(180deg, #0F6FB5 0%, #0B8AD0 50%, var(--hs-navy) 100%)',
                }}
              >
                <div className="rounded-2xl bg-[#2B2A7A] p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-xs font-medium text-white/60">
                      Launch film - cut 02 progress
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl bg-[#1E1550] p-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
                        Order progress
                      </p>
                      <div className="space-y-3">
                        {progressBars.map((bar) => (
                          <div key={bar.label}>
                            <div className="mb-1.5 flex items-center justify-between">
                              <span className="text-xs font-medium text-white/80">
                                {bar.label}
                              </span>
                              <span className="text-xs font-semibold text-white">
                                {bar.value}%
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: bar.color }}
                                initial={reduceMotion ? { width: `${bar.value}%` } : { width: 0 }}
                                animate={reduceMotion || animateBars ? { width: `${bar.value}%` } : { width: 0 }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-[#1E1550] p-4">
                        <p className="text-3xl font-semibold text-white">1,200+</p>
                        <p className="mt-1 text-xs text-white/60">videos shipped</p>
                        <span className="mt-2 inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-semibold text-emerald-400">
                          87% reorder
                        </span>
                      </div>

                      <div className="rounded-xl bg-[#1E1550] p-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                          Formats
                        </p>
                        <svg
                          className="h-20 w-20"
                          viewBox="0 0 100 100"
                          aria-hidden="true"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="12"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#FFC857"
                            strokeWidth="12"
                            strokeDasharray="100.53 150.79"
                            strokeDashoffset="0"
                            transform="rotate(-90 50 50)"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#B45FE0"
                            strokeWidth="12"
                            strokeDasharray="62.83 188.49"
                            strokeDashoffset="-100.53"
                            transform="rotate(-90 50 50)"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#5B6BF0"
                            strokeWidth="12"
                            strokeDasharray="87.96 163.36"
                            strokeDashoffset="-163.36"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#FFC857]" />
                            <span className="text-[10px] text-white/60">Long-form</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#B45FE0]" />
                            <span className="text-[10px] text-white/60">Short-form</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#5B6BF0]" />
                            <span className="text-[10px] text-white/60">Channel</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2B2A7A]"
                    style={{ backgroundColor: 'var(--hs-sky)', color: 'var(--hs-ink)' }}
                  >
                    <Grid3x3 aria-hidden="true" className="h-4 w-4" />
                    + ADD NOTE
                  </button>
                </div>
              </div>
            </div>

            <div className="relative pl-0 lg:pl-8">
              <div
                className="absolute left-0 top-0 h-full w-0.5 lg:block"
                style={{ backgroundColor: 'var(--hs-sky)' }}
                aria-hidden="true"
              />
              <div className="space-y-8">
                {benefits.map((benefit, index) => (
                  <Reveal key={benefit.title} delay={index * 0.1}>
                    <div className="lg:pl-8">
                      <h3 className="text-[clamp(1.5rem,2.5vw,2rem)] font-medium tracking-tight text-white [-webkit-font-smoothing:antialiased]">
                        {benefit.title}
                      </h3>
                      <p className="mt-3 text-base leading-relaxed text-white/90">
                        {benefit.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
