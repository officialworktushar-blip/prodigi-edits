import {
  Cloud,
  ExternalLink,
  HardDrive,
  UploadCloud,
  Video,
} from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import type { FootageFile } from '@/types/db';
import {
  formatBytes,
  formatDateTime,
  safeHttpUrl,
} from './order-utils';

const sourceLabels: Record<string, string> = {
  UPLOAD: 'Direct upload',
  CLOUD_LINK: 'Cloud link',
  SIZE_ESTIMATE: 'Size estimate',
};

function sourceIcon(source: string) {
  if (source === 'CLOUD_LINK') {
    return Cloud;
  }

  if (source === 'SIZE_ESTIMATE') {
    return HardDrive;
  }

  return UploadCloud;
}

export interface OrderFootageProps {
  files: FootageFile[];
}

export function OrderFootage({ files }: OrderFootageProps) {
  if (files.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-soft">
        <EmptyState
          icon="video"
          title="No footage attached yet"
          description="Uploaded files, cloud links, and size estimates for this order will appear here."
        />
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold tracking-tight text-brand-ink">
          Footage
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {files.length === 1
            ? '1 footage item is attached to this order.'
            : `${files.length} footage items are attached to this order.`}
        </p>
      </div>
      <ul className="divide-y divide-slate-100">
        {files.map((file) => {
          const Icon = sourceIcon(file.source);
          const cloudUrl =
            file.source === 'CLOUD_LINK' ? safeHttpUrl(file.url) : null;

          return (
            <li
              key={file.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-brand-ink">
                    {file.name}
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                    <span>{sourceLabels[file.source] ?? 'Footage item'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatBytes(file.size)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatDateTime(file.created_at)}</span>
                  </p>
                </div>
              </div>

              {cloudUrl ? (
                <a
                  href={cloudUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                >
                  <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                  Open link
                </a>
              ) : file.path ? (
                <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <Video aria-hidden="true" className="h-3.5 w-3.5" />
                  Stored securely
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
