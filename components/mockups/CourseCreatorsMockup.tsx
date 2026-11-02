import { MockupShell, RailClip } from './MockupShell';

export function CourseCreatorsMockup() {
  return (
    <MockupShell
      tabs={['Modules', 'Chapters']}
      supportPanel={{ title: 'Course sequence', detail: 'Module 2 · 5 lessons', rows: ['Intro edit approved', 'Chapter titles aligned'] }}
      floatingPanel={{ title: 'Lesson packaging', detail: 'Ready for LMS', rows: ['Clean lesson master', 'Promo clip included'] }}
      accent="#a855f7"
      rail={
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
          <p className="mb-2 truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Modules
          </p>
          <div className="space-y-2">
            <RailClip
              number={0}
              active={false}
              title="Module 1"
              gradientId="cc-grad-1"
              from="#a855f7"
              to="#8b5cf6"
            />
            <RailClip
              number={1}
              active={true}
              title="Module 2"
              gradientId="cc-grad-2"
              from="#8b5cf6"
              to="#7c3aed"
            />
            <RailClip
              number={2}
              active={false}
              title="Module 3"
              gradientId="cc-grad-3"
              from="#7c3aed"
              to="#6366f1"
            />
            <RailClip
              number={3}
              active={false}
              title="Bonus"
              gradientId="cc-grad-4"
              from="#6366f1"
              to="#4f46e5"
            />
          </div>
        </div>
      }
      canvas={
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-3">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(124,58,237,0.18),transparent_45%)]" />

            <div className="relative flex aspect-[16/10] flex-col justify-between rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-14 rounded-full bg-purple-400/80" />
                  <span className="h-1.5 w-8 rounded-full bg-violet-400/60" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  Lesson
                </span>
              </div>

              <div className="max-w-[17rem]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-purple-200/80">
                  Chapter list
                </p>
                <div className="mt-2 space-y-1.5">
                  {[
                    { label: 'Intro', done: true },
                    { label: 'Core concept', done: true },
                    { label: 'Example', done: false },
                    { label: 'Practice', done: false },
                  ].map((chapter) => (
                    <div key={chapter.label} className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          chapter.done ? 'bg-purple-400' : 'bg-white/20'
                        }`}
                      />
                      <span className="text-[8px] text-white/60">{chapter.label}</span>
                      {chapter.done && (
                        <span className="ml-auto h-1 w-4 rounded-full bg-purple-400/50" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                <span className="text-[8px] text-white/70">Captions on</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Progress
              </p>
              <span className="text-[9px] text-white/35">4 / 8 lessons</span>
            </div>
            <div className="mt-2 space-y-1.5">
              {[
                { label: 'Module 1', width: '100%' },
                { label: 'Module 2', width: '50%' },
                { label: 'Module 3', width: '0%' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="w-12 shrink-0 truncate text-[8px] text-white/45">
                    {item.label}
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <span
                      className="block h-full rounded-full bg-purple-400"
                      style={{ width: item.width }}
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
            Module intro
          </p>
          <div className="mt-2 space-y-1.5">
            <div className="rounded-md border border-white/10 bg-white/[0.04] p-1.5">
              <span className="block h-1 w-8 rounded-full bg-white/30" />
              <span className="mt-1 block h-1 w-full rounded-full bg-white/10" />
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.04] p-1.5">
              <span className="block h-1 w-6 rounded-full bg-white/30" />
              <span className="mt-1 block h-1 w-3/4 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      }
      buttonLabel="Review"
    />
  );
}
