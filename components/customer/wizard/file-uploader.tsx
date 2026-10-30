'use client';

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react';
import {
  AlertCircle,
  CheckCircle2,
  File as FileIcon,
  Loader2,
  RotateCcw,
  UploadCloud,
  X,
} from 'lucide-react';
import {
  removeUploadedFootage,
  saveUploadedFootage,
} from '@/app/(customer)/app/orders/upload-actions';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { createClient as createBrowserSupabaseClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const ALLOWED_EXACT_TYPES = new Set([
  'application/zip',
  'application/pdf',
]);

const ACCEPT_ATTRIBUTE =
  'video/*,image/*,audio/*,application/zip,application/pdf,.zip,.pdf';

type UploadStatus =
  | 'queued'
  | 'signing'
  | 'uploading'
  | 'saving'
  | 'completed'
  | 'error'
  | 'cancelled';

interface UploadItem {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  path: string | null;
  error: string | null;
}

interface SignUploadResponse {
  path?: string;
  token?: string;
  error?: string;
}

export interface FileUploaderProps {
  workspaceId: string;
  orderId: string;
  onUploadingChange?: (isUploading: boolean) => void;
}

function isAllowedFile(file: File): boolean {
  const type = file.type.split(';')[0]?.trim().toLowerCase() ?? '';

  return (
    type.startsWith('video/') ||
    type.startsWith('image/') ||
    type.startsWith('audio/') ||
    ALLOWED_EXACT_TYPES.has(type)
  );
}

function formatBytes(value: number): string {
  if (!Number.isFinite(value) || value <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(
    Math.floor(Math.log(value) / Math.log(1024)),
    units.length - 1
  );
  const amount = value / 1024 ** exponent;

  return `${amount.toFixed(amount >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function createItemId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function progressFor(status: UploadStatus): number {
  switch (status) {
    case 'signing':
      return 20;
    case 'uploading':
      return 60;
    case 'saving':
      return 85;
    case 'completed':
      return 100;
    default:
      return 0;
  }
}

function statusLabel(item: UploadItem): string {
  switch (item.status) {
    case 'queued':
      return 'Queued';
    case 'signing':
      return 'Preparing secure upload';
    case 'uploading':
      return 'Uploading directly to storage';
    case 'saving':
      return 'Attaching file to this order';
    case 'completed':
      return 'Uploaded';
    case 'error':
      return item.error ?? 'Upload failed';
    case 'cancelled':
      return 'Upload cancelled';
    default:
      return '';
  }
}

function isActiveStatus(status: UploadStatus): boolean {
  return (
    status === 'queued' ||
    status === 'signing' ||
    status === 'uploading' ||
    status === 'saving'
  );
}

export function FileUploader({
  workspaceId,
  orderId,
  onUploadingChange,
}: FileUploaderProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragDepth = useRef(0);
  const mountedRef = useRef(true);
  const attempts = useRef<Map<string, number>>(new Map());
  const supabaseRef = useRef<ReturnType<
    typeof createBrowserSupabaseClient
  > | null>(null);

  const activeCount = items.filter((item) =>
    isActiveStatus(item.status)
  ).length;

  useEffect(() => {
    onUploadingChange?.(activeCount > 0);
  }, [activeCount, onUploadingChange]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      onUploadingChange?.(false);
    };
  }, [onUploadingChange]);

  function getSupabase() {
    const client =
      supabaseRef.current ?? createBrowserSupabaseClient();
    supabaseRef.current = client;
    return client;
  }

  function nextAttempt(id: string): number {
    const next = (attempts.current.get(id) ?? 0) + 1;
    attempts.current.set(id, next);
    return next;
  }

  function isCurrentAttempt(id: string, attempt: number): boolean {
    return attempts.current.get(id) === attempt;
  }

  function patchItem(id: string, patch: Partial<UploadItem>) {
    if (!mountedRef.current) {
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      )
    );
  }

  async function cleanupObject(path: string) {
    try {
      await removeUploadedFootage({ workspaceId, orderId, path });
    } catch {
      return;
    }
  }

  async function processFile(id: string, file: File, attempt: number) {
    if (!isCurrentAttempt(id, attempt)) {
      return;
    }

    if (!isAllowedFile(file)) {
      patchItem(id, {
        status: 'error',
        error:
          'Upload video, image, audio, zip, or PDF files only.',
        progress: 0,
      });
      return;
    }

    let objectPath: string | null = null;

    try {
      patchItem(id, {
        status: 'signing',
        progress: progressFor('signing'),
        error: null,
      });

      const signResponse = await fetch('/api/upload/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          fileName: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });

      let signPayload: SignUploadResponse = {};

      try {
        signPayload = (await signResponse.json()) as SignUploadResponse;
      } catch {
        signPayload = {};
      }

      if (
        !signResponse.ok ||
        !signPayload.path ||
        !signPayload.token
      ) {
        throw new Error(
          signPayload.error || 'Could not prepare this upload.'
        );
      }

      if (!isCurrentAttempt(id, attempt)) {
        return;
      }

      objectPath = signPayload.path;
      patchItem(id, {
        status: 'uploading',
        progress: progressFor('uploading'),
        path: objectPath,
      });

      const { error: uploadError } = await getSupabase()
        .storage.from('footage')
        .uploadToSignedUrl(objectPath, signPayload.token, file, {
          contentType: file.type,
          cacheControl: '3600',
        });

      if (uploadError) {
        throw new Error(
          uploadError.message || 'The direct upload failed.'
        );
      }

      if (!isCurrentAttempt(id, attempt)) {
        await cleanupObject(objectPath);
        return;
      }

      patchItem(id, {
        status: 'saving',
        progress: progressFor('saving'),
      });

      const saved = await saveUploadedFootage({
        workspaceId,
        orderId,
        path: objectPath,
        name: file.name,
        size: file.size,
      });

      if (!isCurrentAttempt(id, attempt)) {
        await cleanupObject(objectPath);
        return;
      }

      if (!saved.ok) {
        throw new Error(saved.message);
      }

      patchItem(id, {
        status: 'completed',
        progress: progressFor('completed'),
        path: objectPath,
        error: null,
      });
    } catch (error) {
      if (objectPath) {
        await cleanupObject(objectPath);
      }

      if (!isCurrentAttempt(id, attempt)) {
        return;
      }

      patchItem(id, {
        status: 'error',
        progress: 0,
        error:
          error instanceof Error
            ? error.message
            : 'The upload failed. Try again.',
      });
    }
  }

  function queueFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    const accepted: File[] = [];
    const rejected: string[] = [];

    for (const file of files) {
      if (file.size <= 0 || !isAllowedFile(file)) {
        rejected.push(file.name);
      } else {
        accepted.push(file);
      }
    }

    if (rejected.length > 0) {
      setNotice(
        rejected.length === 1
          ? `${rejected[0]} was skipped. Files must contain data and be video, image, audio, zip, or PDF.`
          : `${rejected.length} files were skipped. Files must contain data and be video, image, audio, zip, or PDF.`
      );
    } else {
      setNotice(null);
    }

    if (accepted.length === 0) {
      return;
    }

    const queued: UploadItem[] = accepted.map((file) => ({
      id: createItemId(),
      file,
      status: 'queued',
      progress: 0,
      path: null,
      error: null,
    }));

    setItems((current) => [...queued, ...current]);

    for (const item of queued) {
      const attempt = nextAttempt(item.id);
      void processFile(item.id, item.file, attempt);
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      queueFiles(event.target.files);
    }

    event.target.value = '';
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);

    if (dragDepth.current === 0) {
      setIsDragging(false);
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);

    if (event.dataTransfer.files.length > 0) {
      queueFiles(event.dataTransfer.files);
    }
  }

  function cancelItem(id: string) {
    nextAttempt(id);
    patchItem(id, {
      status: 'cancelled',
      progress: 0,
      error: null,
    });
  }

  function retryItem(id: string) {
    const item = items.find((candidate) => candidate.id === id);

    if (!item) {
      return;
    }

    const attempt = nextAttempt(id);
    patchItem(id, {
      status: 'queued',
      progress: 0,
      path: null,
      error: null,
    });
    void processFile(id, item.file, attempt);
  }

  return (
    <section aria-label="Direct footage upload" className="space-y-4">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'rounded-2xl border-2 border-dashed p-6 text-center transition-colors',
          isDragging
            ? 'border-brand-indigo bg-indigo-50'
            : 'border-indigo-200 bg-indigo-50/40'
        )}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-soft">
          <UploadCloud aria-hidden="true" className="h-6 w-6" />
        </div>
        <p className="mt-3 text-sm font-semibold text-brand-ink">
          Drop footage here
        </p>
        <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
          Video, image, audio, zip, and PDF files go straight from your browser
          to secure storage. Keep this step open until every upload finishes.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTRIBUTE}
          aria-label="Choose footage files"
          onChange={handleInputChange}
          tabIndex={-1}
          className="sr-only"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          className="mt-4"
        >
          Choose files
        </Button>
      </div>

      {notice ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800"
        >
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
          />
          {notice}
        </div>
      ) : null}

      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item) => {
            const isActive = isActiveStatus(item.status);
            const canRetry =
              item.status === 'error' || item.status === 'cancelled';
            const indicatorClass =
              item.status === 'uploading' ? 'animate-pulse' : undefined;

            return (
              <li
                key={item.id}
                className={cn(
                  'rounded-2xl border bg-white p-4',
                  item.status === 'error'
                    ? 'border-red-200'
                    : item.status === 'completed'
                      ? 'border-emerald-200'
                      : 'border-slate-200'
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                    {isActive ? (
                      <Loader2
                        aria-hidden="true"
                        className="h-5 w-5 animate-spin text-indigo-600"
                      />
                    ) : item.status === 'completed' ? (
                      <CheckCircle2
                        aria-hidden="true"
                        className="h-5 w-5 text-emerald-600"
                      />
                    ) : item.status === 'error' ? (
                      <AlertCircle
                        aria-hidden="true"
                        className="h-5 w-5 text-red-500"
                      />
                    ) : (
                      <FileIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-slate-400"
                      />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p
                          className="truncate text-sm font-semibold text-brand-ink"
                          title={item.file.name}
                        >
                          {item.file.name}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {formatBytes(item.file.size)}
                        </p>
                      </div>

                      {isActive ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelItem(item.id)}
                          className="h-8 shrink-0 px-3 text-slate-500"
                        >
                          <X aria-hidden="true" className="h-3.5 w-3.5" />
                          Cancel
                        </Button>
                      ) : canRetry ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => retryItem(item.id)}
                          className="h-8 shrink-0 px-3"
                        >
                          <RotateCcw
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                          />
                          Retry
                        </Button>
                      ) : null}
                    </div>

                    <p
                      aria-live="polite"
                      className={cn(
                        'mt-2 text-xs',
                        item.status === 'error'
                          ? 'font-medium text-red-600'
                          : item.status === 'completed'
                            ? 'font-medium text-emerald-700'
                            : item.status === 'cancelled'
                              ? 'text-slate-400'
                              : 'text-slate-500'
                      )}
                    >
                      {statusLabel(item)}
                    </p>

                    {item.status !== 'queued' &&
                    item.status !== 'cancelled' ? (
                      <Progress
                        value={item.progress}
                        aria-label={`Upload progress for ${item.file.name}`}
                        className="mt-2"
                        indicatorClassName={indicatorClass}
                      />
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
