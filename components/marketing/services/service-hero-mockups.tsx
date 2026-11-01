import type { ReactNode } from 'react';

interface MockupShellProps {
  label: string;
  status: string;
  children: ReactNode;
}

function MockupShell({ label, status, children }: MockupShellProps) {
  return (
    <div aria-hidden="true" className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-sky-300/25 via-violet-300/20 to-pink-300/25 blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] shadow-[0_30px_80px_-30px_rgba(15,23,42,0.65)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <p className="truncate text-[11px] font-semibold text-white/90">
            {label}
          </p>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-sky-200">
            {status}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

const LONG_FORM_CHAPTERS = [
  { label: 'Cold open', width: '58%', color: '#38bdf8' },
  { label: 'The question', width: '82%', color: '#a78bfa' },
  { label: 'Turning point', width: '68%', color: '#f472b6' },
  { label: 'What changed', width: '44%', color: '#fbbf24' },
];

export function LongFormHeroMockup() {
  return (
    <MockupShell label="Long-form · paper edit" status="Story locked">
      <div className="grid gap-3 p-3 sm:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Story map
            </p>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>

          <div className="mt-3 space-y-2">
            {LONG_FORM_CHAPTERS.map((chapter, index) => (
              <div
                key={chapter.label}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[10px] font-semibold text-white/80">
                    {chapter.label}
                  </span>
                  <span
                    className="h-1.5 w-6 rounded-full"
                    style={{ backgroundColor: chapter.color }}
                  />
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: chapter.width,
                      backgroundColor: chapter.color,
                    }}
                  />
                </div>
                <div
                  className="mt-1 h-1 rounded-full bg-white/10"
                  style={{ width: index % 2 === 0 ? '64%' : '46%' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Paper edit timeline
              </p>
              <span className="text-[9px] text-white/35">Chapter map</span>
            </div>

            <svg viewBox="0 0 256 92" className="mt-3 w-full">
              <rect x="4" y="18" width="244" height="7" rx="3.5" fill="#ffffff" fillOpacity="0.1" />
              <rect x="4" y="18" width="58" height="7" rx="3.5" fill="#38bdf8" />
              <rect x="65" y="18" width="78" height="7" rx="3.5" fill="#a78bfa" />
              <rect x="146" y="18" width="58" height="7" rx="3.5" fill="#f472b6" />
              <rect x="207" y="18" width="41" height="7" rx="3.5" fill="#fbbf24" />

              {[4, 62, 143, 204, 248].map((x) => (
                <g key={x}>
                  <path d={`M${x} 25v18`} stroke="#ffffff" strokeOpacity="0.3" />
                  <path
                    d={`M${x} 25l8 4-8 4z`}
                    fill="#ffffff"
                    fillOpacity="0.55"
                  />
                </g>
              ))}

              <rect x="4" y="46" width="244" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.08" />
              <rect x="4" y="46" width="112" height="5" rx="2.5" fill="#38bdf8" fillOpacity="0.6" />
              <rect x="122" y="46" width="80" height="5" rx="2.5" fill="#a78bfa" fillOpacity="0.5" />

              <rect x="4" y="60" width="244" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.08" />
              <rect x="54" y="60" width="98" height="5" rx="2.5" fill="#f472b6" fillOpacity="0.55" />
              <rect x="158" y="60" width="46" height="5" rx="2.5" fill="#fbbf24" fillOpacity="0.5" />

              <rect x="4" y="74" width="244" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.08" />
              <rect x="88" y="74" width="102" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.25" />
            </svg>

            <div className="mt-2 flex items-center justify-between text-[8px] uppercase tracking-[0.12em] text-white/30">
              <span>Open</span>
              <span>Turn</span>
              <span>Proof</span>
              <span>Close</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2">
              <p className="text-[9px] font-semibold text-white/70">
                Chapter markers
              </p>
              <div className="mt-1.5 h-1 w-12 rounded-full bg-sky-400/80" />
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2">
              <p className="text-[9px] font-semibold text-white/70">
                Clean exports
              </p>
              <div className="mt-1.5 h-1 w-10 rounded-full bg-violet-400/80" />
            </div>
          </div>
        </div>
      </div>
    </MockupShell>
  );
}

const SHORT_FORM_FRAMES = [
  { from: '#0ea5e9', to: '#4f46e5', caption: '48%' },
  { from: '#8b5cf6', to: '#db2777', caption: '64%' },
  { from: '#f59e0b', to: '#f43f5e', caption: '38%' },
];

export function ShortFormHeroMockup() {
  return (
    <MockupShell label="Short-form · vertical cut" status="Hook ready">
      <div className="p-3">
        <div className="grid gap-3 sm:grid-cols-[1.12fr_0.88fr]">
          <div className="grid grid-cols-3 gap-2">
            {SHORT_FORM_FRAMES.map((frame, index) => (
              <div
                key={frame.from}
                className={`relative aspect-[9/16] overflow-hidden rounded-xl border p-1.5 ${
                  index === 1 ? 'border-sky-400' : 'border-white/10'
                }`}
                style={{
                  backgroundImage: `linear-gradient(155deg, ${frame.from}, ${frame.to})`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="h-1 w-5 rounded-full bg-white/70" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                </div>

                <span className="absolute left-1.5 top-4 h-1.5 w-8 rounded-full bg-white/55" />
                <span className="absolute left-1.5 top-7 h-1 w-5 rounded-full bg-white/35" />

                <div className="absolute inset-x-1.5 bottom-2 space-y-1">
                  <span className="block h-1.5 w-full rounded-full bg-white/90" />
                  <span
                    className="block h-1.5 rounded-full bg-white/90"
                    style={{ width: frame.caption }}
                  />
                  <span className="block h-1 w-2/3 rounded-full bg-white/50" />
                </div>

                <span className="absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white/70" />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Caption style
              </p>
              <div className="mt-2 rounded-lg bg-white p-2">
                <span className="block h-2 w-full rounded-full bg-slate-900" />
                <span className="mt-1 block h-2 w-3/4 rounded-full bg-amber-400" />
                <span className="mt-1 block h-1 w-1/2 rounded-full bg-slate-300" />
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                {['#0ea5e9', '#8b5cf6', '#f59e0b', '#f43f5e'].map((color) => (
                  <span
                    key={color}
                    className="h-2.5 w-2.5 rounded-full border border-white/30"
                    style={{ backgroundColor: color }}
                  />
                ))}
                <span className="ml-auto text-[8px] text-white/35">Brand</span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                  Hook timeline
                </p>
                <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
              </div>
              <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-white/10">
                <span className="h-full w-[34%] bg-sky-400" />
                <span className="h-full w-[30%] bg-violet-400" />
                <span className="h-full w-[22%] bg-pink-400" />
                <span className="h-full flex-1 bg-amber-300" />
              </div>
              <div className="mt-2 space-y-1.5">
                <span className="block h-1.5 w-full rounded-full bg-white/15" />
                <span className="block h-1.5 w-4/5 rounded-full bg-white/10" />
                <span className="block h-1.5 w-3/5 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[9px] text-white/55">
          <span>Caption style applied</span>
          <span className="font-semibold text-sky-200">Vertical master</span>
        </div>
      </div>
    </MockupShell>
  );
}

const CHANNEL_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const CHANNEL_THUMBNAILS = [
  { from: '#0ea5e9', to: '#4f46e5' },
  { from: '#8b5cf6', to: '#db2777' },
  { from: '#f59e0b', to: '#f43f5e' },
];

export function ChannelManagementHeroMockup() {
  return (
    <MockupShell label="Channel · weekly plan" status="On track">
      <div className="grid gap-3 p-3 sm:grid-cols-[1.02fr_0.98fr]">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Content calendar
            </p>
            <span className="h-1.5 w-6 rounded-full bg-sky-400/70" />
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1">
            {CHANNEL_DAYS.map((day, index) => (
              <span
                key={`${day}-${index}`}
                className="text-center text-[8px] font-semibold text-white/35"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1">
            {Array.from({ length: 21 }).map((_, index) => {
              const active = index === 3 || index === 10 || index === 17;

              return (
                <span
                  key={index}
                  className={`h-3.5 rounded-[3px] ${
                    active ? 'bg-sky-400/80' : 'bg-white/[0.06]'
                  }`}
                />
              );
            })}
          </div>

          <div className="mt-3 space-y-1.5">
            {[
              { label: 'Flagship edit', width: '72%', color: '#38bdf8' },
              { label: 'Short-form batch', width: '48%', color: '#a78bfa' },
              { label: 'Publish window', width: '62%', color: '#f472b6' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="w-16 shrink-0 truncate text-[8px] text-white/45">
                  {item.label}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: item.width, backgroundColor: item.color }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Thumbnail concepts
            </p>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {CHANNEL_THUMBNAILS.map((thumb, index) => (
                <div
                  key={thumb.from}
                  className={`rounded-md border p-1 ${
                    index === 1 ? 'border-violet-400' : 'border-white/10'
                  }`}
                >
                  <div
                    className="flex aspect-video flex-col justify-end rounded-[3px] p-1"
                    style={{
                      backgroundImage: `linear-gradient(145deg, ${thumb.from}, ${thumb.to})`,
                    }}
                  >
                    <span className="h-1 w-full rounded-full bg-white/85" />
                    <span className="mt-1 h-1 w-2/3 rounded-full bg-white/55" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
              Performance recap
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2">
                <span className="block h-1.5 w-10 rounded-full bg-white/20" />
                <div className="mt-2 flex h-10 items-end gap-1">
                  {[36, 58, 44, 72, 62].map((height, index) => (
                    <span
                      key={index}
                      className="flex-1 rounded-sm bg-sky-400/70"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2">
                <span className="block h-1.5 w-10 rounded-full bg-white/20" />
                <div className="mt-2 space-y-1.5">
                  <span className="block h-1.5 w-full rounded-full bg-violet-400/70" />
                  <span className="block h-1.5 w-4/5 rounded-full bg-white/15" />
                  <span className="block h-1.5 w-3/5 rounded-full bg-white/10" />
                  <span className="block h-1.5 w-2/3 rounded-full bg-pink-400/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MockupShell>
  );
}
