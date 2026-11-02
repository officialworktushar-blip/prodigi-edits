import { MockupShell, RailClip } from './MockupShell';

export function DoctorsMockup() {
  return (
    <MockupShell
      tabs={['Explain', 'Captions']}
      accent="#0ea5e9"
      rail={
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
          <p className="mb-2 truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Sections
          </p>
          <div className="space-y-2">
            <RailClip
              number={0}
              active={false}
              title="Welcome"
              gradientId="doc-grad-1"
              from="#0ea5e9"
              to="#38bdf8"
            />
            <RailClip
              number={1}
              active={true}
              title="What to expect"
              gradientId="doc-grad-2"
              from="#38bdf8"
              to="#0d9488"
            />
            <RailClip
              number={2}
              active={false}
              title="Aftercare"
              gradientId="doc-grad-3"
              from="#0d9488"
              to="#14b8a6"
            />
            <RailClip
              number={3}
              active={false}
              title="Questions"
              gradientId="doc-grad-4"
              from="#14b8a6"
              to="#06b6d4"
            />
          </div>
        </div>
      }
      canvas={
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-3">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(13,148,136,0.18),transparent_45%)]" />

            <div className="relative flex aspect-[16/10] flex-col justify-between rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-14 rounded-full bg-sky-400/80" />
                  <span className="h-1.5 w-8 rounded-full bg-teal-400/60" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  Education
                </span>
              </div>

              <div className="max-w-[17rem]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-200/80">
                  Patient education
                </p>
                <svg viewBox="0 0 200 50" className="mt-2 w-full">
                  <defs>
                    <linearGradient id="doc-calm" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="25" r="18" fill="url(#doc-calm)" />
                  <rect x="94" y="15" width="12" height="20" rx="2" fill="#ffffff" fillOpacity="0.3" />
                  <rect x="97" y="10" width="6" height="6" rx="1" fill="#ffffff" fillOpacity="0.4" />
                  <rect x="97" y="32" width="6" height="6" rx="1" fill="#ffffff" fillOpacity="0.4" />
                </svg>
              </div>

              <div className="space-y-1">
                <span className="block h-1.5 w-full rounded-full bg-white/90" />
                <span className="block h-1.5 w-3/4 rounded-full bg-white/70" />
                <span className="block h-1 w-1/2 rounded-full bg-white/50" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Clarity check
              </p>
              <span className="text-[9px] text-white/35">Ready</span>
            </div>
            <div className="mt-2 flex gap-2">
              {['Captions on', 'Plain wording', 'Clean look'].map((check) => (
                <div
                  key={check}
                  className="flex-1 rounded-md border border-white/10 bg-white/[0.04] p-1.5"
                >
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    <span className="text-[8px] text-white/60">{check}</span>
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
            Clarity check
          </p>
          <div className="mt-2 flex gap-2">
            {['Captions on', 'Plain wording', 'Clean look'].map((check) => (
              <div
                key={check}
                className="flex-1 rounded-md border border-white/10 bg-white/[0.04] p-1.5"
              >
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  <span className="text-[8px] text-white/60">{check}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      buttonLabel="Review"
    />
  );
}
