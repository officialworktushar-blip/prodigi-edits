import { MockupShell, RailClip, PopoverSwatches } from './MockupShell';

export function BusinessesMockup() {
  return (
    <MockupShell
      tabs={['Brand', 'Review']}
      accent="#f59e0b"
      rail={
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
          <p className="mb-2 truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Clips
          </p>
          <div className="space-y-2">
            <RailClip
              number={0}
              active={false}
              title="Product demo"
              gradientId="biz-grad-1"
              from="#f59e0b"
              to="#f97316"
            />
            <RailClip
              number={1}
              active={true}
              title="Customer story"
              gradientId="biz-grad-2"
              from="#ef4444"
              to="#f97316"
            />
            <RailClip
              number={2}
              active={false}
              title="Launch teaser"
              gradientId="biz-grad-3"
              from="#f97316"
              to="#fbbf24"
            />
            <RailClip
              number={3}
              active={false}
              title="Social cut"
              gradientId="biz-grad-4"
              from="#fbbf24"
              to="#fcd34d"
            />
          </div>
        </div>
      }
      canvas={
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-3">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(239,68,68,0.18),transparent_45%)]" />

            <div className="relative flex aspect-[16/10] flex-col justify-between rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-14 rounded-full bg-amber-400/80" />
                  <span className="h-1.5 w-8 rounded-full bg-orange-400/60" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  Product film
                </span>
              </div>

              <div className="max-w-[17rem]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-200/80">
                  Brand kit
                </p>
                <div className="mt-2 rounded-md border border-white/10 bg-white/[0.04] p-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-white/10" />
                    <div className="flex-1 space-y-1">
                      <span className="block h-1 w-12 rounded-full bg-white/30" />
                      <span className="block h-1 w-8 rounded-full bg-white/20" />
                    </div>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {['#f59e0b', '#f97316', '#ef4444', '#3b82f6'].map((color) => (
                      <span
                        key={color}
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 text-[9px] text-white/60 font-serif">
                    Aa
                  </div>
                </div>
              </div>

              <div className="flex gap-1.5">
                {['Viewer', 'Manager', 'Owner'].map((role) => (
                  <span
                    key={role}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[8px] text-white/60"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Roles
              </p>
              <span className="text-[9px] text-white/35">3 people</span>
            </div>
            <div className="mt-2 space-y-1.5">
              {[
                { label: 'Can view', width: '100%', color: '#f59e0b' },
                { label: 'Can edit', width: '40%', color: '#f97316' },
                { label: 'Owner', width: '15%', color: '#ef4444' },
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
        <PopoverSwatches
          title="Brand kit"
          swatches={['#f59e0b', '#f97316', '#ef4444', '#3b82f6', '#0ea5e9', '#fcd34d']}
        />
      }
      buttonLabel="Review"
    />
  );
}
