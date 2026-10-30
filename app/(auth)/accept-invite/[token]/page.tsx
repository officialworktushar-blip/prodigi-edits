'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle2, Mail, Users } from 'lucide-react';
import { acceptInvite } from '../../actions';

export default function AcceptInvitePage({
  params,
}: {
  params: { token: string };
}) {
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAccept(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const result = await acceptInvite({ token: params.token });

    setIsSubmitting(false);

    if (result?.error) {
      setFormError(result.error);
      return;
    }

    if (result?.success) {
      setSuccess(result.success);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold text-indigo-600">Workspace invitation</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F1222]">
          Join your <span className="gradient-text">team workspace</span>
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Accept this invitation to collaborate on briefs, drafts, and reviews.
          Use the account that received the invite email.
        </p>
      </div>

      {formError ? (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formError}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-[#0F1222]">
            You are in
          </h2>
          <p className="mt-2 text-sm leading-6 text-emerald-800">{success}</p>
          <Link
            href="/app"
            className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Go to workspace
          </Link>
        </div>
      ) : null}

      <form onSubmit={handleAccept} className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500" />
            <p>
              Your invitation is linked to the email address on this account. If
              the email does not match, ask your workspace owner to send a new
              invite.
            </p>
          </div>
        </div>

        {success ? null : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Accepting...' : 'Accept invitation'}
          </button>
        )}
      </form>

      <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-slate-500">
        <Mail className="h-4 w-4" />
        Need to switch accounts?{' '}
        <Link
          href="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
