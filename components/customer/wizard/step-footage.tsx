'use client';

import {
  AlertTriangle,
  Clock3,
  HardDrive,
  Link2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FileUploader } from './file-uploader';
import { fieldError } from './format';
import type { FootageValues } from './types';

export interface StepFootageProps {
  workspaceId: string;
  orderId: string | null;
  values: FootageValues;
  errors?: Record<string, string[]>;
  onChange: (patch: Partial<FootageValues>) => void;
  onUploadingChange?: (isUploading: boolean) => void;
}

export function StepFootage({
  workspaceId,
  orderId,
  values,
  errors,
  onChange,
  onUploadingChange,
}: StepFootageProps) {
  const linkError = fieldError(errors, 'cloudLink');
  const minutesError = fieldError(errors, 'rawFootageMinutes');
  const sizeError = fieldError(errors, 'footageSizeGb');

  const minutes = Number(values.rawFootageMinutes) || 0;
  const sizeGb = Number(values.footageSizeGb) || 0;
  const overMinutes = values.rawFootageMinutes.trim() !== '' && minutes > 60;
  const overSize = values.footageSizeGb.trim() !== '' && sizeGb > 20;
  const showWarning = overMinutes || overSize;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-brand-ink sm:text-2xl">
          Share the footage
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Upload files straight from your browser or paste a cloud link, then
          tell us roughly how much footage the project includes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Clock3 aria-hidden="true" className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-ink">60 minutes included</p>
            <p className="mt-0.5 text-xs leading-5 text-slate-500">
              Across the raw clips used for this order.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <HardDrive aria-hidden="true" className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-ink">20 GB project size</p>
            <p className="mt-0.5 text-xs leading-5 text-slate-500">
              If you are above either allowance, we will confirm the scope.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="footage-cloud-link"
          className="text-sm font-semibold text-brand-ink"
        >
          Cloud footage link <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <div className="relative mt-2">
          <Link2
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <Input
            id="footage-cloud-link"
            name="cloudLink"
            type="url"
            value={values.cloudLink}
            onChange={(event) => onChange({ cloudLink: event.target.value })}
            placeholder="https://drive.google.com/..."
            aria-invalid={linkError ? true : undefined}
            aria-describedby={
              linkError ? 'footage-cloud-link-error' : 'footage-cloud-link-help'
            }
            className="pl-10"
          />
        </div>
        <p id="footage-cloud-link-help" className="mt-1.5 text-xs text-slate-400">
          Google Drive, Dropbox, Frame.io, or WeTransfer links all work. Check
          that sharing is enabled for anyone with the link.
        </p>
        {linkError ? (
          <p
            id="footage-cloud-link-error"
            className="mt-1.5 text-xs font-medium text-red-600"
            role="alert"
          >
            {linkError}
          </p>
        ) : null}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-brand-ink">
          Upload footage <span className="font-normal text-slate-400">(optional)</span>
        </h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Files upload directly to secure storage and are attached to this
          draft order.
        </p>
        <div className="mt-3">
          {orderId ? (
            <FileUploader
              workspaceId={workspaceId}
              orderId={orderId}
              onUploadingChange={onUploadingChange}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
              Save the first step to create a draft before uploading files.
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="footage-minutes"
            className="text-sm font-semibold text-brand-ink"
          >
            Raw footage minutes
          </label>
          <div className="relative mt-2">
            <Input
              id="footage-minutes"
              name="rawFootageMinutes"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              value={values.rawFootageMinutes}
              onChange={(event) =>
                onChange({ rawFootageMinutes: event.target.value })
              }
              placeholder="45"
              aria-invalid={minutesError ? true : undefined}
              aria-describedby={
                minutesError ? 'footage-minutes-error' : undefined
              }
              className="pr-16"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              minutes
            </span>
          </div>
          {minutesError ? (
            <p
              id="footage-minutes-error"
              className="mt-1.5 text-xs font-medium text-red-600"
              role="alert"
            >
              {minutesError}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="footage-size"
            className="text-sm font-semibold text-brand-ink"
          >
            Estimated project size
          </label>
          <div className="relative mt-2">
            <Input
              id="footage-size"
              name="footageSizeGb"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              value={values.footageSizeGb}
              onChange={(event) =>
                onChange({ footageSizeGb: event.target.value })
              }
              placeholder="12"
              aria-invalid={sizeError ? true : undefined}
              aria-describedby={sizeError ? 'footage-size-error' : undefined}
              className="pr-12"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              GB
            </span>
          </div>
          {sizeError ? (
            <p
              id="footage-size-error"
              className="mt-1.5 text-xs font-medium text-red-600"
              role="alert"
            >
              {sizeError}
            </p>
          ) : null}
        </div>
      </div>

      {showWarning ? (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4"
        >
          <AlertTriangle
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
          />
          <div>
            <p className="text-sm font-semibold text-amber-950">
              This is above the included allowance
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-800">
              {overMinutes && overSize
                ? `You entered ${minutes} minutes and ${sizeGb} GB.`
                : overMinutes
                  ? `You entered ${minutes} minutes.`
                  : `You entered ${sizeGb} GB.`}{' '}
              You can continue, but our team may follow up about storage or an
              adjusted scope before editing starts.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
