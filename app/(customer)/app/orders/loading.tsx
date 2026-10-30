import { Skeleton } from '@/components/ui/skeleton';

export default function OrdersLoading() {
  return (
    <div aria-busy="true" aria-label="Loading orders" className="space-y-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-10 w-72 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full rounded-full" />
        </div>
        <Skeleton className="h-11 w-32 rounded-full" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Skeleton className="h-11 w-full rounded-xl lg:max-w-xl" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
        <div className="mt-4 flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-9 w-24 shrink-0 rounded-full"
            />
          ))}
        </div>
      </div>

      <Skeleton className="h-4 w-20 rounded-full" />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="hidden border-b border-slate-100 bg-brand-surface px-6 py-3 md:block">
          <Skeleton className="h-3 w-full max-w-xl rounded-full" />
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-5 py-5 sm:px-6"
            >
              <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-56 max-w-full rounded-full" />
                <Skeleton className="h-3 w-32 rounded-full" />
              </div>
              <Skeleton className="hidden h-6 w-24 rounded-full sm:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
