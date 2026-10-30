import { Skeleton } from '@/components/ui/skeleton';

export default function OrderDetailLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading order details"
      className="space-y-6"
    >
      <div className="space-y-4">
        <Skeleton className="h-4 w-28 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-10 w-96 max-w-full" />
          <Skeleton className="h-6 w-64 rounded-full" />
        </div>
      </div>

      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-9 w-28 shrink-0 rounded-full"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
            <Skeleton className="h-5 w-28 rounded-full" />
            <Skeleton className="mt-2 h-4 w-64 max-w-full rounded-full" />
            <div className="mt-7 space-y-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex gap-4">
                  <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-36 rounded-full" />
                    <Skeleton className="h-3 w-64 max-w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
            <Skeleton className="h-5 w-32 rounded-full" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-11/12 rounded-full" />
              <Skeleton className="h-4 w-3/4 rounded-full" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <Skeleton className="h-5 w-24 rounded-full" />
            <div className="mt-5 flex gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32 rounded-full" />
                <Skeleton className="h-3 w-24 rounded-full" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <Skeleton className="h-5 w-28 rounded-full" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32 rounded-full" />
                    <Skeleton className="h-3 w-24 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
