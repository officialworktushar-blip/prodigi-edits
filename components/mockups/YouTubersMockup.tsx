import { MockupShell, RailClip, PopoverSwatches } from './MockupShell';

export function YouTubersMockup() {
  return (
    <MockupShell
      tabs={['Retention', 'Thumbnail']}
      accent="#10b981"
      rail={
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
          <p className="mb-2 truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Clips
          </p>
          <div className="space-y-2">
            <RailClip
              number={0}
              active={false}
              title="Hook"
              gradientId="yt-grad-1"
              from="#10b981"
              to="#14b8a6"
            />
            <RailClip
              number={1}
              active={false}
              title="Setup"
              gradientId="yt-grad-2"
              from="#34d399"
              to="#10b981"
            />
            <RailClip
              number={2}
              active={true}
              title="Payoff"
              gradientId="yt-grad-3"
              from="#0d9488"
              to="#06b6d4"
            />
            <RailClip
              number={3}
              active={false}
              title="End screen"
              gradientId="yt-grad-4"
              from="#14b8a6"
              to="#3b82f6"
            />
          </div>
        </div>
      }
      canvas={
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-3">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(20,184,166,0.18),transparent_45%)]" />

            <div className="relative flex aspect-[16/10] flex-col justify-between rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-14 rounded-full bg-emerald-400/80" />
                  <span className="h-1.5 w-8 rounded-full bg-teal-400/60" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  Video frame
                </span>
              </div>

              <div className="max-w-[17rem]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200/80">
                  Retention curve
                </p>
                <svg viewBox="0 0 200 40" className="mt-2 w-full">
                  <defs>
                    <linearGradient id="yt-retention" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 40 L0 30 Q20 28 40 32 T80 25 T120 18 T160 22 T200 15 L200 40 Z"
                    fill="url(#yt-retention)"
                  />
                  <path
                    d="M0 30 Q20 28 40 32 T80 25 T120 18 T160 22 T200 15"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  <circle cx="80" cy="25" r="3" fill="#ffffff" />
                  <text x="85" y="22" fill="#ffffff" fontSize="8" fontWeight="600">
                    Hook fixed
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div className="rounded-md border border-white/10 bg-white/[0.04] p-1.5">
                  <span className="block h-1 w-8 rounded-full bg-white/30" />
                  <span className="mt-1 block h-1 w-full rounded-full bg-white/10" />
                </div>
                <div className="rounded-md border border-emerald-400/50 bg-emerald-400/10 p-1.5">
                  <span className="block h-1 w-8 rounded-full bg-emerald-400/60" />
                  <span className="mt-1 block h-1 w-full rounded-full bg-emerald-400/30" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Thumbnail A/B
              </p>
              <span className="text-[9px] text-white/35">Test active</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-md border border-white/10 bg-white/[0.04] p-1.5">
                <div className="flex aspect-video items-center justify-center rounded bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                  <span className="text-[8px] text-white/60">A</span>
                </div>
              </div>
              <div className="rounded-md border border-emerald-400/50 bg-emerald-400/10 p-1.5">
                <div className="flex aspect-video items-center justify-center rounded bg-gradient-to-br from-teal-500/30 to-cyan-500/30">
                  <span className="text-[8px] text-emerald-300">B</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      popover={
        <PopoverSwatches
          title="Thumbnail test"
          swatches={['#10b981', '#14b8a6', '#34d399', '#0d9488', '#06b6d4', '#3b82f6']}
        />
      }
      buttonLabel="Review"
    />
  );
}
