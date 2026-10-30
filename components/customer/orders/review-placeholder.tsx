import { MessageSquare, Sparkles } from 'lucide-react';

export function ReviewPlaceholder() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-sky-50 text-indigo-600">
          <MessageSquare aria-hidden="true" className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-xl font-semibold tracking-tight text-brand-ink">
          Drafts & Review
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Review tool coming in next task
        </p>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
          This space will hold draft versions, timestamped notes, and the
          approval conversation with your editor.
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          In development
        </span>
      </div>
    </section>
  );
}
