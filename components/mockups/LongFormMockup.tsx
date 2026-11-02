import { MockupShell, RailClip, PopoverSwatches } from './MockupShell';

export function LongFormMockup() {
  return (
    <MockupShell
      tabs={['Story', 'Style']}
      accent="#0d9488"
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
              gradientId="lf-grad-1"
              from="#0d9488"
              to="#4f46e5"
            />
            <RailClip
              number={1}
              active={true}
              title="Interview"
              gradientId="lf-grad-2"
              from="#8b5cf6"
              to="#6366f1"
            />
            <RailClip
              number={2}
              active={false}
              title="B-roll pass"
              gradientId="lf-grad-3"
              from="#a855f7"
              to="#7c3aed"
            />
            <RailClip
              number={3}
              active={false}
              title="Outro"
              gradientId="lf-grad-4"
              from="#14b8a6"
              to="#3b82f6"
            />
          </div>
        </div>
      }
      canvas={
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-3">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(13,148,136,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.18),transparent_45%)]" />

            <div className="relative flex aspect-[16/10] flex-col justify-between rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-14 rounded-full bg-teal-400/80" />
                  <span className="h-1.5 w-8 rounded-full bg-violet-400/60" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  Preview
                </span>
              </div>

              <div className="max-w-[17rem]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-200/80">
                  Chapter 02
                </p>
                <p className="mt-1 text-sm font-semibold leading-5 text-white">
                  Interview, 14 min
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="h-1.5 w-16 rounded-full bg-teal-400/80" />
                  <span className="h-1.5 w-9 rounded-full bg-violet-400/70" />
                  <span className="h-1.5 w-5 rounded-full bg-purple-400/60" />
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
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Timeline
              </p>
              <span className="text-[9px] text-white/35">04:12 / 14:00</span>
            </div>

            <svg viewBox="0 0 256 64" className="mt-2 w-full">
              <rect x="4" y="8" width="244" height="4" rx="2" fill="#ffffff" fillOpacity="0.1" />
              <rect x="4" y="8" width="48" height="4" rx="2" fill="#0d9488" />
              <rect x="55" y="8" width="68" height="4" rx="2" fill="#8b5cf6" />
              <rect x="126" y="8" width="52" height="4" rx="2" fill="#a855f7" />
              <rect x="181" y="8" width="67" height="4" rx="2" fill="#14b8a6" />

              <rect x="4" y="18" width="244" height="4" rx="2" fill="#ffffff" fillOpacity="0.08" />
              <rect x="4" y="18" width="112" height="4" rx="2" fill="#0d9488" fillOpacity="0.6" />
              <rect x="120" y="18" width="80" height="4" rx="2" fill="#8b5cf6" fillOpacity="0.5" />

              <rect x="4" y="28" width="244" height="4" rx="2" fill="#ffffff" fillOpacity="0.08" />
              <rect x="54" y="28" width="98" height="4" rx="2" fill="#a855f7" fillOpacity="0.55" />
              <rect x="158" y="28" width="46" height="4" rx="2" fill="#14b8a6" fillOpacity="0.5" />

              {[4, 52, 123, 175, 248].map((x) => (
                <g key={x}>
                  <path d={`M${x} 35v14`} stroke="#ffffff" strokeOpacity="0.3" />
                  <path d={`M${x} 35l6 3-6 3z`} fill="#ffffff" fillOpacity="0.55" />
                </g>
              ))}
            </svg>

            <div className="mt-2 flex items-center justify-between text-[8px] uppercase tracking-[0.12em] text-white/30">
              <span>00:00</span>
              <span>04:12</span>
              <span>08:24</span>
              <span>12:36</span>
              <span>14:00</span>
            </div>
          </div>
        </div>
      }
      popover={
        <PopoverSwatches
          title="Chapter markers"
          swatches={['#0d9488', '#8b5cf6', '#a855f7', '#14b8a6', '#06b6d4', '#3b82f6']}
        />
      }
      buttonLabel="Export"
    />
  );
}
