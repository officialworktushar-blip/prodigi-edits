import { MockupShell, RailClip } from './MockupShell';

export function PodcastersMockup() {
  return (
    <MockupShell
      tabs={['Episode', 'Clips']}
      supportPanel={{ title: 'Episode mix', detail: '42:18 · mastered', rows: ['Noise removed', 'Voice levels matched'] }}
      floatingPanel={{ title: 'Audio polish', detail: 'Broadcast ready', rows: ['Loudness normalized', '3 social clips queued'] }}
      accent="#fb923c"
      rail={
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
          <p className="mb-2 truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Clips
          </p>
          <div className="space-y-2">
            <RailClip
              number={0}
              active={false}
              title="Cold open"
              gradientId="pod-grad-1"
              from="#fb923c"
              to="#f97316"
            />
            <RailClip
              number={1}
              active={true}
              title="Guest intro"
              gradientId="pod-grad-2"
              from="#f97316"
              to="#ef4444"
            />
            <RailClip
              number={2}
              active={false}
              title="Best moment"
              gradientId="pod-grad-3"
              from="#f472b6"
              to="#ec4899"
            />
            <RailClip
              number={3}
              active={false}
              title="Outro"
              gradientId="pod-grad-4"
              from="#fb7185"
              to="#fbbf24"
            />
          </div>
        </div>
      }
      canvas={
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-3">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(244,114,182,0.18),transparent_45%)]" />

            <div className="relative flex aspect-[16/10] flex-col justify-between rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-14 rounded-full bg-orange-400/80" />
                  <span className="h-1.5 w-8 rounded-full bg-rose-400/60" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  Audio mix
                </span>
              </div>

              <div className="max-w-[17rem]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-200/80">
                  Multitrack editor
                </p>
                <svg viewBox="0 0 200 50" className="mt-2 w-full">
                  <defs>
                    <linearGradient id="pod-wave1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fb923c" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#fb923c" stopOpacity="0.2" />
                    </linearGradient>
                    <linearGradient id="pod-wave2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="5" width="200" height="18" rx="4" fill="#ffffff" fillOpacity="0.05" />
                  <rect x="10" y="8" width="180" height="12" rx="3" fill="url(#pod-wave1)" />
                  <rect x="0" y="27" width="200" height="18" rx="4" fill="#ffffff" fillOpacity="0.05" />
                  <rect x="20" y="30" width="160" height="12" rx="3" fill="url(#pod-wave2)" />
                  <rect x="50" y="0" width="100" height="50" fill="#ffffff" fillOpacity="0.08" />
                  <rect x="50" y="0" width="2" height="50" fill="#fb923c" />
                  <rect x="148" y="0" width="2" height="50" fill="#fb923c" />
                </svg>
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
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Audio polish
              </p>
              <span className="text-[9px] text-white/35">Ready</span>
            </div>
            <div className="mt-2 flex gap-2">
              {[
                { label: 'Levels', on: true },
                { label: 'Noise', on: true },
                { label: 'Intro music', on: false },
              ].map((toggle) => (
                <div
                  key={toggle.label}
                  className="flex-1 rounded-md border border-white/10 bg-white/[0.04] p-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-white/60">{toggle.label}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        toggle.on ? 'bg-orange-400' : 'bg-white/20'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      popover={
        <div className="rounded-xl border border-white/10 bg-[#0f172a]/95 p-2.5 shadow-xl backdrop-blur">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Audio polish
          </p>
          <div className="mt-2 flex gap-2">
            {[
              { label: 'Levels', on: true },
              { label: 'Noise', on: true },
              { label: 'Intro music', on: false },
            ].map((toggle) => (
              <div
                key={toggle.label}
                className="flex-1 rounded-md border border-white/10 bg-white/[0.04] p-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] text-white/60">{toggle.label}</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      toggle.on ? 'bg-orange-400' : 'bg-white/20'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      buttonLabel="Export"
    />
  );
}
