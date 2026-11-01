'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Reveal } from '../../shared/reveal';

const features = [
  {
    title: 'Live progress you can see',
    description:
      'Track drafts, comments, and approvals in one place instead of chasing updates across inboxes.',
    media: (
      <div
        className="relative h-full w-full overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #FF6B6B 0%, #A855F7 100%)',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center gap-8 p-6">
          <div className="flex flex-col items-center">
            <svg
              className="h-28 w-28"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset="0"
                initial={{ strokeDashoffset: 251.2 }}
                whileInView={{ strokeDashoffset: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
              <text
                x="50"
                y="55"
                textAnchor="middle"
                className="text-2xl font-semibold fill-white"
              >
                100%
              </text>
            </svg>
            <span className="mt-2 text-xs font-medium text-white/80">Brief</span>
          </div>

          <div className="flex flex-col items-center">
            <svg
              className="h-28 w-28"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset="70.34"
                initial={{ strokeDashoffset: 251.2 }}
                whileInView={{ strokeDashoffset: 70.34 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
              />
              <text
                x="50"
                y="55"
                textAnchor="middle"
                className="text-2xl font-semibold fill-white"
              >
                72%
              </text>
            </svg>
            <span className="mt-2 text-xs font-medium text-white/80">Edit</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Timecoded notes that get answered',
    description:
      'Leave timecoded notes and get a clear response. We explain the trade-offs before pushing back.',
    media: (
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#1a1a2e]">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4CCFFF" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#A855F7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 Q50,60 100,100 T200,100 T300,100 T400,100"
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="3"
          />
          <path
            d="M0,100 Q50,60 100,100 T200,100 T300,100 T400,100"
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="3"
            opacity="0.5"
            transform="translate(0, 20)"
          />
          <path
            d="M0,100 Q50,60 100,100 T200,100 T300,100 T400,100"
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="3"
            opacity="0.3"
            transform="translate(0, -20)"
          />
        </svg>

        <div className="absolute left-1/2 top-1/2 h-0.5 w-full -translate-x-1/2 -translate-y-1/2 bg-white/20" />

        <div className="absolute left-[20%] top-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="h-4 w-4 rounded-full bg-[#4CCFFF]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-2 border-[#4CCFFF] opacity-50 animate-pulse" />
          </div>
        </div>

        <div className="absolute left-[50%] top-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="h-4 w-4 rounded-full bg-[#A855F7]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-2 border-[#A855F7] opacity-50 animate-pulse" />
          </div>
        </div>

        <div className="absolute left-[80%] top-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="h-4 w-4 rounded-full bg-[#EC4899]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-2 border-[#EC4899] opacity-50 animate-pulse" />
          </div>
        </div>

        <div className="absolute bottom-4 left-4 rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm">
          <div className="flex items-start gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4CCFFF]">
              <svg
                className="h-3 w-3 fill-[#1a1a2e]"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-white/90">1:24</p>
              <p className="text-[9px] text-white/60">Cut this tighter</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Delivery you can publish',
    description:
      'Approve the final cut, download every format, or hand off publishing to us.',
    media: (
      <div className="relative h-full w-full overflow-hidden rounded-2xl" style={{ backgroundColor: 'var(--hs-navy)' }}>
        <div className="absolute inset-0 p-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white/10 p-3">
              <p className="text-2xl font-semibold text-white">24-48h</p>
              <p className="text-[10px] text-white/60">Turnaround</p>
            </div>
            <div className="rounded-lg bg-white/10 p-3">
              <p className="text-2xl font-semibold text-white">4.9/5</p>
              <p className="text-[10px] text-white/60">Rating</p>
            </div>
            <div className="rounded-lg bg-white/10 p-3">
              <p className="text-2xl font-semibold text-white">1,200+</p>
              <p className="text-[10px] text-white/60">Videos</p>
            </div>
            <div className="rounded-lg bg-white/10 p-3">
              <p className="text-2xl font-semibold text-white">87%</p>
              <p className="text-[10px] text-white/60">Reorder</p>
            </div>
          </div>

          <div className="mt-3 flex gap-3">
            <div className="flex-1 rounded-lg bg-white/10 p-3">
              <svg
                className="h-16 w-full"
                viewBox="0 0 100 100"
                aria-hidden="true"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#4CCFFF"
                  strokeWidth="6"
                  strokeDasharray="175.93"
                  strokeDashoffset="26.39"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>

            <div className="flex-1 rounded-lg bg-white/10 p-3">
              <div className="flex h-full items-end gap-1">
                <div className="h-8 w-1/5 rounded-t bg-[#4CCFFF]/60" />
                <div className="h-12 w-1/5 rounded-t bg-[#4CCFFF]/80" />
                <div className="h-6 w-1/5 rounded-t bg-[#4CCFFF]/50" />
                <div className="h-16 w-1/5 rounded-t bg-[#4CCFFF]" />
                <div className="h-10 w-1/5 rounded-t bg-[#4CCFFF]/70" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 h-1"
          style={{ backgroundColor: 'var(--hs-sky)' }}
        />
      </div>
    ),
  },
];

export function KeepCalmSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg at bottom left, var(--hs-teal), #5A5A94)',
      }}
    >
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-xl">
            <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-medium tracking-tight text-white [-webkit-font-smoothing:antialiased] leading-[1.15]">
              Keep every review calm and every deadline visible
            </h2>
            <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-white/90">
              Track drafts, leave timecoded notes, and approve with confidence — or hand off publishing to us.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.1}>
              <div className="flex flex-col gap-4">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl shadow-soft">
                  {feature.media}
                </div>
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-white [-webkit-font-smoothing:antialiased]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
