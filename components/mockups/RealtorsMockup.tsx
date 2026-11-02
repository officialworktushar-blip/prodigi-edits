import { MockupShell, RailClip } from './MockupShell';

export function RealtorsMockup() {
  return (
    <MockupShell
      tabs={['Tour', 'Branding']}
      supportPanel={{ title: 'Listing kit', detail: '742 Willow · ready', rows: ['Wide property tour', 'Vertical agent cut'] }}
      floatingPanel={{ title: 'Tour details', detail: '4 bed · 3 bath', rows: ['Lower third applied', 'Open house card added'] }}
      accent="#ea580c"
      rail={
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
          <p className="mb-2 truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Rooms
          </p>
          <div className="space-y-2">
            <RailClip
              number={0}
              active={false}
              title="Exterior"
              gradientId="real-grad-1"
              from="#ea580c"
              to="#f97316"
            />
            <RailClip
              number={1}
              active={true}
              title="Living room"
              gradientId="real-grad-2"
              from="#f97316"
              to="#fbbf24"
            />
            <RailClip
              number={2}
              active={false}
              title="Kitchen"
              gradientId="real-grad-3"
              from="#fbbf24"
              to="#fcd34d"
            />
            <RailClip
              number={3}
              active={false}
              title="Neighbourhood"
              gradientId="real-grad-4"
              from="#f97316"
              to="#ea580c"
            />
          </div>
        </div>
      }
      canvas={
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-3">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(234,88,12,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(251,191,36,0.18),transparent_45%)]" />

            <div className="relative flex aspect-[16/10] flex-col justify-between rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-14 rounded-full bg-orange-600/80" />
                  <span className="h-1.5 w-8 rounded-full bg-amber-500/60" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  Tour
                </span>
              </div>

              <div className="max-w-[17rem]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-200/80">
                  Room view
                </p>
                <svg viewBox="0 0 200 50" className="mt-2 w-full">
                  <defs>
                    <linearGradient id="real-grad-house" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ea580c" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <rect x="40" y="10" width="120" height="30" rx="4" fill="url(#real-grad-house)" />
                  <path d="M40 10 L100 2 L160 10" fill="#ea580c" fillOpacity="0.6" />
                  <rect x="85" y="20" width="30" height="20" fill="#ffffff" fillOpacity="0.15" />
                  <rect x="60" y="15" width="12" height="10" fill="#ffffff" fillOpacity="0.1" />
                  <rect x="128" y="15" width="12" height="10" fill="#ffffff" fillOpacity="0.1" />
                </svg>
              </div>

              <div className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5">
                <span className="text-[8px] text-white/70">Open house this weekend</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Formats
              </p>
              <span className="text-[9px] text-white/35">3 exports</span>
            </div>
            <div className="mt-2 flex gap-2">
              {['Wide', 'Vertical', 'Square'].map((format) => (
                <div
                  key={format}
                  className="flex-1 rounded-md border border-white/10 bg-white/[0.04] p-1.5 text-center"
                >
                  <span className="text-[8px] text-white/60">{format}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      popover={
        <div className="rounded-xl border border-white/10 bg-[#0f172a]/95 p-2.5 shadow-xl backdrop-blur">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Lower third
          </p>
          <div className="mt-2 rounded-md border border-white/10 bg-white/[0.04] p-2">
            <span className="block h-1 w-10 rounded-full bg-white/30" />
            <span className="mt-1 block h-1 w-full rounded-full bg-white/10" />
          </div>
        </div>
      }
      buttonLabel="Export"
    />
  );
}
