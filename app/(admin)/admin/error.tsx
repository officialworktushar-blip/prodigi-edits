'use client';

import Link from 'next/link';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminDashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminDashboardError({
  error,
  reset,
}: AdminDashboardErrorProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-10">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-soft">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <AlertCircle aria-hidden="true" className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-brand-ink">
          We could not load the admin dashboard
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Something went wrong while fetching orders or subscription data. Try
          again, or return to the admin workspace.
        </p>
        {error.digest ? (
          <p className="mt-3 text-xs text-slate-400">
            Reference: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset}>
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Try again
          </Button>
          <Link
            href="/admin"
            className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
          >
            Back to overview
          </Link>
        </div>
      </div>
    </div>
  );
}
