import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Accessibility,
  ChartColumn,
  ChevronDown,
  CirclePlay,
  CirclePlus,
  CircleQuestionMark,
  Contrast,
  Droplets,
  Grid2x2,
  Grip,
  House,
  LayoutGrid,
  Lightbulb,
  MessageCirclePlus,
  Palette,
  Play,
  Settings,
  Share,
} from 'lucide-react';

const SLIDES = [
  {
    color: '#e8e15c',
    timecode: '00:12',
    caption: 'Intro hook',
    status: 'Approved',
    delay: '0.7s',
  },
  {
    color: '#d4a5f0',
    timecode: '02:48',
    caption: 'Main story',
    status: 'In review',
    delay: '0.85s',
  },
  {
    color: '#5468ff',
    timecode: '06:30',
    caption: 'Outro + call to action',
    status: 'Draft',
    delay: '1s',
  },
];

const RINGS = [
  { radius: 78, value: 1, stroke: '#e9d5ff' },
  { radius: 60, value: 0.72, stroke: '#c084fc' },
  { radius: 42, value: 0.35, stroke: '#d8b4fe' },
];

const TOP_RAIL_ICONS: LucideIcon[] = [
  Droplets,
  LayoutGrid,
  Grip,
  Lightbulb,
  CirclePlay,
];

const BOTTOM_RAIL_ICONS: LucideIcon[] = [
  Settings,
  Accessibility,
  MessageCirclePlus,
];

export function HeroProductWindow() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[71.68rem]">
      <div className="absolute inset-x-[10%] -bottom-10 h-24 rounded-full bg-cyan-400/50 blur-3xl" />

      <div className="glass-window relative overflow-hidden rounded-[22px] text-left sm:rounded-[28px]">
        <div className="flex h-12 items-center justify-between border-b border-white/10 bg-[#1b1f2b] sm:h-14">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center bg-black sm:h-14 sm:w-14">
              <House
                aria-hidden="true"
                className="h-5 w-5"
                style={{ color: '#4cc9ff' }}
              />
            </div>

            <div className="hidden items-center gap-4 pl-4 sm:flex">
              <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-slate-300">
                Order
                <ChevronDown aria-hidden="true" className="h-3 w-3" />
              </span>
              <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-slate-300">
                <Palette aria-hidden="true" className="h-4 w-4" />
                Style
                <ChevronDown aria-hidden="true" className="h-3 w-3" />
              </span>
              <ChartColumn aria-hidden="true" className="h-4 w-4 text-slate-300" />
            </div>
          </div>

          <div className="flex items-center gap-3 pr-2 sm:gap-4 sm:pr-3">
            <span className="hidden items-center gap-1 text-[11px] uppercase tracking-wider text-slate-300 sm:flex">
              <CirclePlay aria-hidden="true" className="h-4 w-4" />
              Review
              <ChevronDown aria-hidden="true" className="h-3 w-3" />
            </span>
            <span className="hidden items-center gap-1 text-[11px] uppercase tracking-wider text-slate-300 sm:flex">
              <Share aria-hidden="true" className="h-4 w-4" />
              Share
            </span>
            <Contrast
              aria-hidden="true"
              className="hidden h-4 w-4 text-slate-300 sm:block"
            />
            <CircleQuestionMark
              aria-hidden="true"
              className="hidden h-4 w-4 text-slate-300 sm:block"
            />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              p.
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-[1fr] bg-gradient-to-br from-[#4a4468] via-[#3a3558] to-[#2a2644] sm:grid-cols-[48px_1fr_56px]">
          <div className="hidden justify-center pt-3 sm:flex">
            <Grid2x2 aria-hidden="true" className="h-5 w-5 text-slate-300" />
          </div>

          <div className="relative space-y-5 p-3 sm:p-6">
            <div className="rounded-xl bg-white p-4 sm:p-8">
              <p className="text-center text-xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
                Launch film — cut 02
              </p>

              <div className="mt-5 grid grid-cols-3 gap-3 sm:mt-8 sm:gap-5">
                {SLIDES.map((slide) => (
                  <figure key={slide.caption}>
                    <div
                      className="animate-hero-fade-up relative flex aspect-[4/3] items-center justify-center rounded-md min-[1088px]:aspect-auto min-[1088px]:h-48"
                      style={{
                        backgroundColor: slide.color,
                        animationDelay: slide.delay,
                      }}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 sm:h-12 sm:w-12">
                        <Play
                          aria-hidden="true"
                          className="h-4 w-4 fill-current text-brand-ink sm:h-5 sm:w-5"
                        />
                      </span>
                      <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium leading-none text-white">
                        {slide.timecode}
                      </span>
                    </div>
                    <figcaption className="mt-3 text-center">
                      <span className="block text-xs font-bold text-brand-ink sm:text-base">
                        {slide.caption}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-slate-500 sm:text-sm">
                        {slide.status}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <div className="hidden overflow-hidden rounded-xl bg-[#1f1747] sm:grid sm:grid-cols-2">
              <div className="flex min-h-[200px] items-center justify-center bg-gradient-to-br from-[#8f86f2] to-[#6d5fe0]">
                <div className="flex h-44 w-24 items-center justify-center rounded-[18px] border-2 border-white/80 bg-white/10">
                  <Play
                    aria-hidden="true"
                    className="h-6 w-6 fill-current text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 p-4">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 200"
                  className="h-36 w-36 -rotate-90 sm:h-40 sm:w-40"
                >
                  {RINGS.map((ring) => {
                    const circumference = 2 * Math.PI * ring.radius;
                    const offset = circumference * (1 - ring.value);

                    return (
                      <g key={ring.radius}>
                        <circle
                          cx="100"
                          cy="100"
                          r={ring.radius}
                          fill="none"
                          stroke="rgba(255,255,255,.08)"
                          strokeWidth="12"
                        />
                        <circle
                          cx="100"
                          cy="100"
                          r={ring.radius}
                          fill="none"
                          stroke={ring.stroke}
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          className="animate-draw-arc"
                          style={
                            {
                              '--arc-length': circumference,
                              '--arc-offset': offset,
                            } as CSSProperties
                          }
                        />
                      </g>
                    );
                  })}
                </svg>

                <div className="space-y-2 text-xs text-white/80">
                  <p>Brief 100%</p>
                  <p>Edit 72%</p>
                  <p>Review 35%</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-1 top-1/3 hidden flex-col items-center gap-1 lg:flex">
              <CirclePlus aria-hidden="true" className="h-7 w-7 text-white/80" />
              <span className="text-[10px] uppercase tracking-wider text-white/70">
                Add note
              </span>
            </div>
          </div>

          <div className="hidden flex-col border-l border-white/10 sm:flex">
            <div className="flex flex-col">
              {TOP_RAIL_ICONS.map((Icon, index) => (
                <div
                  key={`top-${index}`}
                  className="flex h-10 items-center justify-center text-slate-300"
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </div>
              ))}
            </div>

            <div className="mt-auto flex flex-col">
              {BOTTOM_RAIL_ICONS.map((Icon, index) => (
                <div
                  key={`bottom-${index}`}
                  className="flex h-10 items-center justify-center border-t border-white/10 text-slate-300"
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
