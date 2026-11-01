import type { PageHeroMockup } from '@/components/sections';

const FALLBACK_CLIPS = [
  { label: 'Opening', from: '#38bdf8', to: '#6366f1' },
  { label: 'Story', from: '#a78bfa', to: '#ec4899' },
  { label: 'Proof', from: '#fbbf24', to: '#fb7185' },
  { label: 'Close', from: '#2dd4bf', to: '#3b82f6' },
];

const FALLBACK_SEGMENTS = [
  { label: 'Intro', width: '22%', color: '#38bdf8' },
  { label: 'Main cut', width: '46%', color: '#a78bfa' },
  { label: 'Details', width: '20%', color: '#f472b6' },
  { label: 'Outro', width: '12%', color: '#fbbf24' },
];

const FALLBACK_SWATCHES = ['#38bdf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399'];

interface UseCaseHeroMockupProps {
  mockup: PageHeroMockup;
}

export function UseCaseHeroMockup({ mockup }: UseCaseHeroMockupProps) {
  const clips = (mockup.clips ?? FALLBACK_CLIPS).slice(0, 4);
  const activeClip = Math.min(
    Math.max(mockup.activeClipIndex ?? 0, 0),
    Math.max(clips.length - 1, 0)
  );
  const segments = mockup.timelineSegments ?? FALLBACK_SEGMENTS;
  const swatches = mockup.swatches ?? FALLBACK_SWATCHES;
  const toolbarItems = mockup.toolbarItems ?? ['Plan', 'Edit', 'Review', 'Deliver'];

  return (
    <div aria-hidden="true" className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-sky-300/30 via-violet-300/25 to-pink-300/30 blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] shadow-[0_30px_80px_-30px_rgba(15,23,42,0.65)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="min-w-0 text-center">
            <p className="truncate text-[11px] font-semibold text-white/90">
              {mockup.windowTitle ?? 'Project workspace'}
            </p>
            <p className="truncate text-[10px] text-white/40">
              {mockup.toolbarLabel ?? 'Current project · in motion'}
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-sky-200">
            {mockup.status ?? 'On track'}
          </span>
        </div>

        <div className="flex items-center gap-4 border-b border-white/10 px-4 py-2 text-[10px] font-medium text-white/45">
          {toolbarItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
          <span className="ml-auto rounded-md bg-white/10 px-2 py-1 text-white/70">
            Share
          </span>
        </div>

        <div className="grid gap-3 p-3 sm:grid-cols-[68px_1fr]">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
            <p className="mb-2 truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
              {mockup.railLabel ?? 'Clips'}
            </p>
            <div className="space-y-2">
              {clips.map((clip, index) => {
                const active = index === activeClip;
                const gradientId = `use-case-hero-clip-${index}`;

                return (
                  <div key={`${clip.label}-${index}`} className="space-y-1">
                    <div
                      className={`overflow-hidden rounded-md border-2 transition ${
                        active ? 'border-sky-400' : 'border-transparent'
                      }`}
                    >
                      <svg viewBox="0 0 64 38" className="block h-auto w-full">
                        <defs>
                          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={clip.from} />
                            <stop offset="100%" stopColor={clip.to} />
                          </linearGradient>
                        </defs>
                        <rect width="64" height="38" fill={`url(#${gradientId})`} />
                        <rect y="24" width="64" height="14" fill="#0f172a" fillOpacity="0.2" />
                        <rect x="7" y="8" width="30" height="2.5" rx="1.25" fill="#ffffff" fillOpacity="0.7" />
                        <rect x="7" y="14" width="20" height="2" rx="1" fill="#ffffff" fillOpacity="0.45" />
                        <rect x="7" y="27" width="42" height="2" rx="1" fill="#ffffff" fillOpacity="0.55" />
                      </svg>
                    </div>
                    <p
                      className={`truncate text-[9px] ${
                        active ? 'font-semibold text-white/80' : 'text-white/35'
                      }`}
                    >
                      {clip.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="min-w-0">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-3">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.18),transparent_45%)]" />

              <div className="relative flex aspect-[16/10] flex-col justify-between rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-14 rounded-full bg-sky-400/80" />
                    <span className="h-1.5 w-8 rounded-full bg-violet-400/60" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/45">
                    Workspace
                  </span>
                </div>

                <div className="max-w-[17rem]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-200/80">
                    {mockup.canvasLabel ?? 'Main canvas'}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-5 text-white">
                    {mockup.canvasCaption ?? 'A clear story, shaped for the audience'}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="h-1.5 w-16 rounded-full bg-sky-400/80" />
                    <span className="h-1.5 w-9 rounded-full bg-violet-400/70" />
                    <span className="h-1.5 w-5 rounded-full bg-pink-400/60" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="rounded-md border border-white/10 bg-white/[0.04] p-1.5"
                    >
                      <span className="block h-1 w-6 rounded-full bg-white/30" />
                      <span className="mt-1 block h-1 w-full rounded-full bg-white/10" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute right-2 top-9 w-28 rounded-xl border border-white/10 bg-[#0f172a]/95 p-2.5 shadow-xl backdrop-blur sm:right-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  {mockup.popoverTitle ?? 'Project palette'}
                </p>
                <div className="mt-2 grid grid-cols-5 gap-1">
                  {swatches.slice(0, 10).map((swatch, index) => (
                    <span
                      key={`${swatch}-${index}`}
                      className={`h-3.5 w-3.5 rounded-full ring-offset-1 ring-offset-slate-900 ${
                        index === 0 ? 'ring-2 ring-white' : ''
                      }`}
                      style={{ backgroundColor: swatch }}
                    />
                  ))}
                </div>
              </div>

              <div className="animate-cursor-move absolute bottom-[34%] left-[52%] z-10">
                <svg viewBox="0 0 24 32" className="h-7 w-5 drop-shadow-lg">
                  <path
                    d="M2 2l18 13-8 1.5 4.5 9-4 2-4.5-9L2 24z"
                    fill="#ffffff"
                    stroke="#0f172a"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="absolute left-4 top-5 rounded-full bg-violet-600 px-1.5 py-0.5 text-[8px] font-semibold text-white">
                  You
                </span>
              </div>
            </div>

            <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-2">
              <div className="flex items-center justify-between text-[9px] text-white/40">
                <span>{mockup.timelineLabel ?? 'Timeline'}</span>
                <span>Ready for review</span>
              </div>
              <div className="mt-1.5 flex h-3 overflow-hidden rounded-full bg-white/10">
                {segments.map((segment, index) => (
                  <span
                    key={`${segment.label}-${index}`}
                    className="h-full border-r border-[#0b1220] last:border-r-0"
                    style={{ width: segment.width, backgroundColor: segment.color }}
                    title={segment.label}
                  />
                ))}
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[8px] uppercase tracking-[0.12em] text-white/30">
                <span>{segments[0]?.label ?? 'Start'}</span>
                <span>{segments[segments.length - 1]?.label ?? 'Finish'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
