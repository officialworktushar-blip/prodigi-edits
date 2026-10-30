'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Mail, MessageCircle, Send } from 'lucide-react';
import { BRAND_NAME, SUPPORT_EMAIL } from '../../lib/config';

type ContactValues = {
  name: string;
  email: string;
  message: string;
};

type ContactResponse = {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

const EMPTY_VALUES: ContactValues = {
  name: '',
  email: '',
  message: '',
};

export default function ContactPage() {
  const [values, setValues] = useState<ContactValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof ContactValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
    setFormError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as ContactResponse;

      if (!response.ok || !result.ok) {
        setErrors(result.fieldErrors ?? {});
        setFormError(result.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setSuccess(result.message ?? 'Your message was sent.');
      setValues(EMPTY_VALUES);
    } catch {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-50/80 via-blue-50/40 to-transparent" />

      <div className="relative mx-auto max-w-screen-1200 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Talk to the crew
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#0F1222] sm:text-5xl">
            Tell us what you want to <span className="gradient-text">ship next</span>
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-500">
            Whether you want an estimate, a custom workflow, or a demo, send a
            note below and we will get back within one business day.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <aside className="rounded-2xl border border-slate-200 bg-[#FAFAFC] p-8 shadow-soft">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] text-lg font-semibold text-white">
              {BRAND_NAME.slice(0, 1)}
            </div>
            <h2 className="mt-5 text-xl font-semibold tracking-tight text-[#0F1222]">
              {BRAND_NAME}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              A productized editing team for creators who need reliable
              turnaround without managing a roster of freelancers.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-indigo-500" />
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-medium text-slate-700 underline-offset-4 hover:underline"
                >
                  {SUPPORT_EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-indigo-500" />
                <span>Replies within one business day</span>
              </li>
            </ul>

            <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm leading-6 text-indigo-900">
              Include your channel link, average video length, and monthly volume
              so we can suggest the right package on the first reply.
            </div>
          </aside>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
            {success ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-[#0F1222]">
                  Message sent
                </h2>
                <p className="mt-2 text-sm leading-6 text-emerald-800">{success}</p>
                <button
                  type="button"
                  onClick={() => setSuccess(null)}
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <h2 className="text-xl font-semibold tracking-tight text-[#0F1222]">
                  Send a message
                </h2>

                {formError ? (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>{formError}</p>
                  </div>
                ) : null}

                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={values.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Alex Morgan"
                  />
                  {errors.name ? (
                    <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={values.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    placeholder="you@company.com"
                  />
                  {errors.email ? (
                    <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Project details
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    required
                    value={values.message}
                    onChange={(event) => updateField('message', event.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Tell us about your channel, video style, and monthly volume."
                  />
                  {errors.message ? (
                    <p className="mt-1.5 text-sm text-red-600">{errors.message}</p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Sending...' : 'Send message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
