export default function CustomerDashboardLoading() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard" className="space-y-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="h-9 w-72 max-w-full animate-pulse rounded-xl bg-slate-200" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="h-11 w-32 animate-pulse rounded-full bg-slate-200" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
          >
            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />
            <div className="mt-4 h-8 w-20 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded-full bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="h-5 w-32 animate-pulse rounded-lg bg-slate-200" />
            <div className="mt-2 h-3 w-56 animate-pulse rounded-full bg-slate-200" />
          </div>
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 px-6 py-5">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-48 max-w-full animate-pulse rounded-full bg-slate-200" />
                  <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200" />
                </div>
                <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-64 animate-pulse rounded-2xl bg-slate-300" />
          <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
