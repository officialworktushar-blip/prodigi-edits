import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { BRAND_NAME, BRAND_TAGLINE } from '../../lib/config';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[#0F1222] lg:grid lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#0F1222] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-[#4F46E5]/40 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#3B82F6]/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#EC4899]/25 blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <span className="text-lg font-semibold tracking-tight">{BRAND_NAME}</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-200">
            Built for creators who ship
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Your next edit is{' '}
            <span className="bg-gradient-to-r from-indigo-300 via-blue-300 to-pink-300 bg-clip-text text-transparent">
              already in motion.
            </span>
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-300">
            {BRAND_TAGLINE}. One workspace for briefs, footage, drafts, and feedback
            so you can publish faster without managing a production team.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-slate-200">
            {[
              'A dedicated editor on every order',
              'Review cuts with timecoded comments',
              'Delivery in as little as 24 hours',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-slate-500">
          Private workspaces. Clear timelines. No surprise invoices.
        </p>
      </aside>

      <main className="flex min-h-screen flex-col justify-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-base font-semibold tracking-tight text-[#0F1222]">
              {BRAND_NAME}
            </span>
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
