import { MockupShell, PopoverSwatches } from './MockupShell';

export function ShortFormMockup() {
  return (
    <MockupShell
      tabs={['Hook', 'Captions']}
      supportPanel={{ title: 'Clip batch', detail: '6 vertical cuts', rows: ['Safe zones checked', 'Captions proofed'] }}
      floatingPanel={{ title: 'Social export', detail: '9:16 · 1080 × 1920', rows: ['Reels · Shorts · TikTok', 'Burned-in captions'] }}
      accent="#ec4899"
      rail={
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
          <p className="mb-2 truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Clips
          </p>
          <div className="space-y-2">
            {[
              { title: 'Hook', from: '#ec4899', to: '#f97316', active: false },
              { title: 'Beat 2', from: '#f43f5e', to: '#f97316', active: true },
              { title: 'Call to action', from: '#fb7185', to: '#f59e0b', active: false },
            ].map((clip, index) => (
              <div key={clip.title} className="space-y-1">
                <div
                  className={`overflow-hidden rounded-md border-2 transition ${
                    clip.active ? 'border-pink-400' : 'border-transparent'
                  }`}
                >
                  <svg viewBox="0 0 32 56" aria-hidden="true" className="block h-auto w-full">
                    <defs>
                      <linearGradient id={`sf-grad-${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={clip.from} />
                        <stop offset="100%" stopColor={clip.to} />
                      </linearGradient>
                    </defs>
                    <rect width="32" height="56" fill={`url(#sf-grad-${index})`} />
                    <rect y="32" width="32" height="24" fill="#0f172a" fillOpacity="0.24" />
                    <circle cx="16" cy="20" r="6" fill="#ffffff" fillOpacity="0.85" />
                    <path d="M14.5 17v6l5-3z" fill="#0f172a" />
                  </svg>
                </div>
                <p
                  className={`truncate text-[9px] ${
                    clip.active ? 'font-semibold text-white/80' : 'text-white/35'
                  }`}
                >
                  {clip.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      }
      canvas={
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-3">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.18),transparent_45%)]" />

            <div className="relative mx-auto flex aspect-[9/16] max-w-[140px] flex-col justify-between rounded-lg border border-white/10 bg-black/20 p-2">
              <div className="h-1 w-12 rounded-full bg-white/70" />
              <div className="space-y-1.5">
                <span className="block h-2 w-full rounded-full bg-white/90" />
                <span className="block h-2 w-3/4 rounded-full bg-amber-400" />
                <span className="block h-1 w-1/2 rounded-full bg-white/50" />
              </div>
              <div className="flex items-center justify-between">
                <span className="h-1 w-8 rounded-full bg-white/55" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              </div>
            </div>

            <div className="absolute right-2 top-8 flex flex-col gap-1.5">
              <span className="h-1 w-1 rounded-full bg-white/60" />
              <span className="h-1 w-1 rounded-full bg-white/60" />
              <span className="h-1 w-1 rounded-full bg-white/60" />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Hook timeline
              </p>
              <span className="text-[9px] text-white/35">00:08 / 00:24</span>
            </div>
            <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-white/10">
              <span className="h-full w-[34%] bg-pink-400" />
              <span className="h-full w-[30%] bg-violet-400" />
              <span className="h-full w-[22%] bg-rose-400" />
              <span className="h-full flex-1 bg-amber-300" />
            </div>
            <div className="mt-2 space-y-1.5">
              <span className="block h-1.5 w-full rounded-full bg-white/15" />
              <span className="block h-1.5 w-4/5 rounded-full bg-white/10" />
              <span className="block h-1.5 w-3/5 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      }
      popover={
        <div className="rounded-xl border border-white/10 bg-[#0f172a]/95 p-2.5 shadow-xl backdrop-blur">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Caption style
          </p>
          <div className="mt-2 space-y-1.5">
            <div className="rounded-md bg-white p-1.5">
              <span className="block h-1.5 w-full rounded-full bg-slate-900" />
              <span className="mt-1 block h-1.5 w-3/4 rounded-full bg-amber-400" />
            </div>
            <div className="rounded-md border border-white/20 p-1.5">
              <span className="block h-1.5 w-full rounded-full bg-white/90" />
              <span className="mt-1 block h-1.5 w-3/4 rounded-full bg-pink-400" />
            </div>
            <div className="rounded-md bg-amber-400/20 p-1.5">
              <span className="block h-1.5 w-full rounded-full bg-white/90" />
              <span className="mt-1 block h-1.5 w-3/4 rounded-full bg-slate-900" />
            </div>
          </div>
        </div>
      }
      buttonLabel="Captions"
    />
  );
}
