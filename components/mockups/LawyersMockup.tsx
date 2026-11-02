import { MockupShell, RailClip } from './MockupShell';

export function LawyersMockup() {
  return (
    <MockupShell
      tabs={['Explainer', 'Brand']}
      supportPanel={{ title: 'Firm video kit', detail: 'Client story · approved', rows: ['Disclosure card included', 'Firm look applied'] }}
      floatingPanel={{ title: 'Review controls', detail: 'Partner sign-off', rows: ['Final language checked', 'Share link restricted'] }}
      accent="#4f46e5"
      rail={
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
          <p className="mb-2 truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Sections
          </p>
          <div className="space-y-2">
            <RailClip
              number={0}
              active={false}
              title="Intro"
              gradientId="law-grad-1"
              from="#4f46e5"
              to="#6366f1"
            />
            <RailClip
              number={1}
              active={true}
              title="Key points"
              gradientId="law-grad-2"
              from="#6366f1"
              to="#8b5cf6"
            />
            <RailClip
              number={2}
              active={false}
              title="Next steps"
              gradientId="law-grad-3"
              from="#8b5cf6"
              to="#a855f7"
            />
            <RailClip
              number={3}
              active={false}
              title="Contact"
              gradientId="law-grad-4"
              from="#a855f7"
              to="#7c3aed"
            />
          </div>
        </div>
      }
      canvas={
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-3">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,70,229,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.18),transparent_45%)]" />

            <div className="relative flex aspect-[16/10] flex-col justify-between rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-14 rounded-full bg-indigo-500/80" />
                  <span className="h-1.5 w-8 rounded-full bg-violet-400/60" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  Explainer
                </span>
              </div>

              <div className="max-w-[17rem]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-200/80">
                  Plain-language cut
                </p>
                <svg viewBox="0 0 200 50" className="mt-2 w-full">
                  <defs>
                    <linearGradient id="law-doc" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>
                  <rect x="70" y="10" width="60" height="30" rx="2" fill="url(#law-doc)" />
                  <rect x="80" y="15" width="40" height="2" fill="#ffffff" fillOpacity="0.4" />
                  <rect x="80" y="20" width="30" height="2" fill="#ffffff" fillOpacity="0.3" />
                  <rect x="80" y="25" width="35" height="2" fill="#ffffff" fillOpacity="0.3" />
                  <path d="M85 35 L100 35 L100 40 L90 40 L85 35" fill="#ffffff" fillOpacity="0.2" />
                  <path d="M100 35 L115 35 L115 40 L100 40 Z" fill="#ffffff" fillOpacity="0.15" />
                </svg>
              </div>

              <div className="space-y-1">
                <span className="block h-1.5 w-full rounded-full bg-white/90" />
                <span className="block h-1.5 w-4/5 rounded-full bg-white/70" />
                <span className="block h-1 w-3/5 rounded-full bg-white/50" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Firm branding
              </p>
              <span className="text-[9px] text-white/35">Applied</span>
            </div>
            <div className="mt-2 rounded-md border border-white/10 bg-white/[0.04] p-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-indigo-500/20" />
                <div className="flex-1 space-y-1">
                  <span className="block h-1 w-12 rounded-full bg-white/30" />
                  <span className="block h-1 w-8 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      popover={
        <div className="rounded-xl border border-white/10 bg-[#0f172a]/95 p-2.5 shadow-xl backdrop-blur">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Firm branding
          </p>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {['#4f46e5', '#6366f1', '#8b5cf6', '#a855f7', '#7c3aed'].map((color) => (
              <span
                key={color}
                className="h-3.5 w-3.5 rounded-full ring-offset-1 ring-offset-slate-900"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      }
      buttonLabel="Review"
    />
  );
}
