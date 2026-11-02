import { MockupShell, PopoverSwatches } from './MockupShell';

export function ChannelManagementMockup() {
  return (
    <MockupShell
      tabs={['Plan', 'Thumbnails']}
      accent="#6366f1"
      rail={
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
          <p className="mb-2 truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Days
          </p>
          <div className="space-y-2">
            {[
              { title: 'Mon upload', from: '#6366f1', to: '#8b5cf6', active: false },
              { title: 'Wed short', from: '#8b5cf6', to: '#a855f7', active: false },
              { title: 'Fri upload', from: '#6366f1', to: '#3b82f6', active: false },
              { title: 'Sun recap', from: '#3b82f6', to: '#06b6d4', active: false },
            ].map((day, index) => (
              <div key={day.title} className="space-y-1">
                <div
                  className={`overflow-hidden rounded-md border-2 transition ${
                    day.active ? 'border-indigo-400' : 'border-transparent'
                  }`}
                >
                  <svg viewBox="0 0 64 38" aria-hidden="true" className="block h-auto w-full">
                    <defs>
                      <linearGradient id={`cm-grad-${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={day.from} />
                        <stop offset="100%" stopColor={day.to} />
                      </linearGradient>
                    </defs>
                    <rect width="64" height="38" fill={`url(#cm-grad-${index})`} />
                    <rect y="20" width="64" height="18" fill="#0f172a" fillOpacity="0.24" />
                    <rect x="8" y="6" width="28" height="2" rx="1" fill="#ffffff" fillOpacity="0.7" />
                    <rect x="8" y="12" width="20" height="1.5" rx="0.75" fill="#ffffff" fillOpacity="0.45" />
                  </svg>
                </div>
                <p
                  className={`truncate text-[9px] ${
                    day.active ? 'font-semibold text-white/80' : 'text-white/35'
                  }`}
                >
                  {day.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      }
      canvas={
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Week calendar
              </p>
              <div className="mt-2 grid grid-cols-7 gap-0.5">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
                  <span
                    key={day}
                    className="text-center text-[7px] font-semibold text-white/35"
                  >
                    {day}
                  </span>
                ))}
              </div>
              <div className="mt-1.5 grid grid-cols-7 gap-0.5">
                {Array.from({ length: 21 }).map((_, index) => {
                  const active = index === 2 || index === 9 || index === 16;
                  return (
                    <span
                      key={index}
                      className={`h-2.5 rounded-[2px] ${
                        active ? 'bg-indigo-400/80' : 'bg-white/[0.06]'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Thumbnails
              </p>
              <div className="mt-2 grid grid-cols-3 gap-1">
                {[
                  { from: '#6366f1', to: '#8b5cf6', active: false },
                  { from: '#8b5cf6', to: '#a855f7', active: true },
                  { from: '#3b82f6', to: '#06b6d4', active: false },
                ].map((thumb, index) => (
                  <div
                    key={index}
                    className={`rounded-md border p-0.5 ${
                      thumb.active ? 'border-indigo-400' : 'border-white/10'
                    }`}
                  >
                    <div
                      className="flex aspect-video flex-col justify-end rounded-[2px] p-0.5"
                      style={{
                        backgroundImage: `linear-gradient(145deg, ${thumb.from}, ${thumb.to})`,
                      }}
                    >
                      <span className="h-0.5 w-full rounded-full bg-white/85" />
                      <span className="mt-0.5 h-0.5 w-2/3 rounded-full bg-white/55" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Upload schedule
              </p>
              <span className="text-[9px] text-white/35">3 videos</span>
            </div>
            <div className="mt-2 space-y-1.5">
              {[
                { label: 'Flagship', width: '72%', color: '#6366f1' },
                { label: 'Short batch', width: '48%', color: '#8b5cf6' },
                { label: 'Recap', width: '62%', color: '#3b82f6' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="w-12 shrink-0 truncate text-[8px] text-white/45">
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
        </div>
      }
      popover={
        <div className="rounded-xl border border-white/10 bg-[#0f172a]/95 p-2.5 shadow-xl backdrop-blur">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Weekly plan
          </p>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {['#6366f1', '#8b5cf6', '#a855f7', '#3b82f6', '#06b6d4'].map((color) => (
              <span
                key={color}
                className="h-3.5 w-3.5 rounded-full ring-offset-1 ring-offset-slate-900"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="mt-2 space-y-1">
            {['Draft', 'Review', 'Scheduled'].map((status) => (
              <span
                key={status}
                className="block rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[8px] text-white/60"
              >
                {status}
              </span>
            ))}
          </div>
        </div>
      }
      buttonLabel="Schedule"
    />
  );
}
