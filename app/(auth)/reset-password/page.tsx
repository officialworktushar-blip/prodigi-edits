'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Lock } from 'lucide-react';
import { updateUser } from '../actions';

const resetSchema = z
  .object({
    password: z.string().min(8, 'Use at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type ResetValues = z.infer<typeof resetSchema>;

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';

export default function ResetPasswordPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: ResetValues) {
    setFormError(null);
    const result = await updateUser({ password: values.password });

    if (result?.error) {
      setFormError(result.error);
      return;
    }

    if (result?.success) {
      setSuccess(result.success);
    }
  }

  if (success) {
    return (
      <div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#0F1222]">
            Password updated
          </h1>
          <p className="mt-2 text-sm leading-6 text-emerald-800">{success}</p>
        </div>
        <Link
          href="/app"
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
        >
          Continue to your workspace
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold text-indigo-600">Choose a new password</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0F1222]">
          Secure your <span className="gradient-text">account</span>
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Pick something memorable and at least eight characters long.
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

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            New password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className={inputClass}
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : undefined}
              {...register('password')}
            />
          </div>
          {errors.password ? (
            <p id="password-error" className="mt-2 text-sm text-red-600">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Confirm new password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              className={inputClass}
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              aria-describedby={
                errors.confirmPassword ? 'confirm-password-error' : undefined
              }
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword ? (
            <p id="confirm-password-error" className="mt-2 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Updating password...' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
