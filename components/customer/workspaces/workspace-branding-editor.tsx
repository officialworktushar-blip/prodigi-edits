'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { updateWorkspaceBranding } from '@/app/(customer)/app/workspaces/actions';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { Workspace } from '@/types/db';
import { WorkspaceLogoUploader } from './workspace-logo-uploader';

const DEFAULT_PRIMARY = '#4F46E5';
const DEFAULT_ACCENT = '#3B82F6';

interface BrandingForm {
  name: string;
  notes: string;
  brandHeadingFont: string;
  brandBodyFont: string;
  brandPrimaryColor: string;
  brandAccentColor: string;
}

type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

function isHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function initialForm(workspace: Workspace): BrandingForm {
  return {
    name: workspace.name,
    notes: workspace.notes ?? '',
    brandHeadingFont: workspace.brand_heading_font || 'Inter',
    brandBodyFont: workspace.brand_body_font || 'Inter',
    brandPrimaryColor: isHexColor(workspace.brand_primary_color)
      ? workspace.brand_primary_color
      : DEFAULT_PRIMARY,
    brandAccentColor: isHexColor(workspace.brand_accent_color)
      ? workspace.brand_accent_color
      : DEFAULT_ACCENT,
  };
}

function serialize(form: BrandingForm): string {
  return JSON.stringify(form);
}

export interface WorkspaceBrandingEditorProps {
  workspace: Workspace;
  canEdit: boolean;
}

export function WorkspaceBrandingEditor({
  workspace,
  canEdit,
}: WorkspaceBrandingEditorProps) {
  const [form, setForm] = useState<BrandingForm>(() =>
    initialForm(workspace)
  );
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const lastSavedSnapshotRef = useRef(serialize(initialForm(workspace)));
  const requestIdRef = useRef(0);
  const latestRef = useRef(form);
  latestRef.current = form;

  useEffect(() => {
    if (!canEdit) {
      return;
    }

    const snapshot = serialize(form);

    if (snapshot === lastSavedSnapshotRef.current) {
      return;
    }

    setStatus('dirty');
    setError(null);

    const timer = window.setTimeout(() => {
      const requestId = ++requestIdRef.current;
      setStatus('saving');

      void updateWorkspaceBranding({
        workspaceId: workspace.id,
        name: form.name,
        notes: form.notes,
        brandHeadingFont: form.brandHeadingFont,
        brandBodyFont: form.brandBodyFont,
        brandPrimaryColor: form.brandPrimaryColor,
        brandAccentColor: form.brandAccentColor,
      })
        .then((result) => {
          if (requestId !== requestIdRef.current) {
            return;
          }

          if (!result.ok) {
            setError(result.message);
            setStatus('error');
            return;
          }

          lastSavedSnapshotRef.current = snapshot;
          setLastSavedAt(result.savedAt ?? new Date().toISOString());
          setError(null);
          setStatus(
            serialize(latestRef.current) === snapshot ? 'saved' : 'dirty'
          );
        })
        .catch(() => {
          if (requestId !== requestIdRef.current) {
            return;
          }

          setError('Could not save these workspace details. Try again.');
          setStatus('error');
        });
    }, 800);

    return () => window.clearTimeout(timer);
  }, [canEdit, form, retryCount, workspace.id]);

  function updateField<K extends keyof BrandingForm>(
    key: K,
    value: BrandingForm[K]
  ) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  const headingFamily = form.brandHeadingFont.trim() || 'Inter';
  const bodyFamily = form.brandBodyFont.trim() || 'Inter';

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-brand-ink">
              Brand and workspace details
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Changes save automatically for workspace owners and managers.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {!canEdit ? <Badge variant="outline">Read-only</Badge> : null}
            {canEdit ? (
              <span
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold',
                  status === 'saving' || status === 'dirty'
                    ? 'bg-amber-50 text-amber-700'
                    : status === 'error'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-emerald-50 text-emerald-700'
                )}
              >
                {status === 'saving' ? (
                  <Loader2
                    aria-hidden="true"
                    className="h-3 w-3 animate-spin"
                  />
                ) : status === 'error' ? (
                  <AlertCircle aria-hidden="true" className="h-3 w-3" />
                ) : (
                  <Check aria-hidden="true" className="h-3 w-3" />
                )}
                {status === 'saving'
                  ? 'Saving...'
                  : status === 'dirty'
                    ? 'Unsaved changes'
                    : status === 'error'
                      ? 'Save failed'
                      : status === 'saved'
                        ? 'Saved'
                        : 'Autosave on'}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-5 space-y-6">
          <WorkspaceLogoUploader
            workspaceId={workspace.id}
            workspaceName={form.name || workspace.name}
            initialLogoUrl={workspace.logo_url}
            canEdit={canEdit}
            primaryColor={
              isHexColor(form.brandPrimaryColor)
                ? form.brandPrimaryColor
                : DEFAULT_PRIMARY
            }
            accentColor={
              isHexColor(form.brandAccentColor)
                ? form.brandAccentColor
                : DEFAULT_ACCENT
            }
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="workspace-name"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
              >
                Workspace name
              </label>
              <Input
                id="workspace-name"
                value={form.name}
                onChange={(event) =>
                  updateField('name', event.target.value)
                }
                maxLength={80}
                disabled={!canEdit}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="workspace-type"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
              >
                Workspace type
              </label>
              <Input
                id="workspace-type"
                value={workspace.type ?? 'Personal'}
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="workspace-notes"
              className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
            >
              Notes for your editor
            </label>
            <Textarea
              id="workspace-notes"
              value={form.notes}
              onChange={(event) =>
                updateField('notes', event.target.value)
              }
              maxLength={2000}
              disabled={!canEdit}
              placeholder="Tone of voice, recurring series details, brand dos and don'ts..."
              className="min-h-[130px]"
            />
            <p className="text-right text-[10px] text-slate-400">
              {form.notes.length}/2000
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="workspace-heading-font"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
              >
                Heading font
              </label>
              <Input
                id="workspace-heading-font"
                value={form.brandHeadingFont}
                onChange={(event) =>
                  updateField('brandHeadingFont', event.target.value)
                }
                list="workspace-font-options"
                maxLength={80}
                disabled={!canEdit}
                placeholder="Inter"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="workspace-body-font"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
              >
                Body font
              </label>
              <Input
                id="workspace-body-font"
                value={form.brandBodyFont}
                onChange={(event) =>
                  updateField('brandBodyFont', event.target.value)
                }
                list="workspace-font-options"
                maxLength={80}
                disabled={!canEdit}
                placeholder="Inter"
              />
            </div>
          </div>

          <datalist id="workspace-font-options">
            <option value="Inter" />
            <option value="DM Sans" />
            <option value="Manrope" />
            <option value="Sora" />
            <option value="Space Grotesk" />
            <option value="Georgia" />
            <option value="Arial" />
          </datalist>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="workspace-primary-color"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
              >
                Primary color
              </label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  aria-label="Pick primary color"
                  value={
                    isHexColor(form.brandPrimaryColor)
                      ? form.brandPrimaryColor
                      : DEFAULT_PRIMARY
                  }
                  onChange={(event) =>
                    updateField('brandPrimaryColor', event.target.value)
                  }
                  disabled={!canEdit}
                  className="h-11 w-14 cursor-pointer p-1"
                />
                <Input
                  id="workspace-primary-color"
                  value={form.brandPrimaryColor}
                  onChange={(event) =>
                    updateField('brandPrimaryColor', event.target.value)
                  }
                  onBlur={() => {
                    if (!isHexColor(form.brandPrimaryColor)) {
                      updateField('brandPrimaryColor', DEFAULT_PRIMARY);
                    }
                  }}
                  maxLength={7}
                  disabled={!canEdit}
                  aria-invalid={!isHexColor(form.brandPrimaryColor)}
                  className="font-mono uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="workspace-accent-color"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
              >
                Accent color
              </label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  aria-label="Pick accent color"
                  value={
                    isHexColor(form.brandAccentColor)
                      ? form.brandAccentColor
                      : DEFAULT_ACCENT
                  }
                  onChange={(event) =>
                    updateField('brandAccentColor', event.target.value)
                  }
                  disabled={!canEdit}
                  className="h-11 w-14 cursor-pointer p-1"
                />
                <Input
                  id="workspace-accent-color"
                  value={form.brandAccentColor}
                  onChange={(event) =>
                    updateField('brandAccentColor', event.target.value)
                  }
                  onBlur={() => {
                    if (!isHexColor(form.brandAccentColor)) {
                      updateField('brandAccentColor', DEFAULT_ACCENT);
                    }
                  }}
                  maxLength={7}
                  disabled={!canEdit}
                  aria-invalid={!isHexColor(form.brandAccentColor)}
                  className="font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {error ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span>{error}</span>
              {canEdit ? (
                <button
                  type="button"
                  onClick={() => setRetryCount((count) => count + 1)}
                  className="font-semibold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  Retry
                </button>
              ) : null}
            </div>
          ) : null}

          {lastSavedAt ? (
            <p className="text-[10px] text-slate-400">
              Last saved at{' '}
              {new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
              }).format(new Date(lastSavedAt))}
            </p>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5">
          <Sparkles
            aria-hidden="true"
            className="h-4 w-4 text-indigo-500"
          />
          <h3 className="text-sm font-semibold text-brand-ink">
            Brand preview
          </h3>
        </div>
        <div className="relative overflow-hidden p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-20 blur-3xl"
            style={{
              backgroundColor: isHexColor(form.brandAccentColor)
                ? form.brandAccentColor
                : DEFAULT_ACCENT,
            }}
          />
          <div className="relative">
            <span
              className="inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
              style={{
                backgroundColor: isHexColor(form.brandPrimaryColor)
                  ? form.brandPrimaryColor
                  : DEFAULT_PRIMARY,
              }}
            >
              Brand system
            </span>
            <h3
              className="mt-4 text-3xl font-semibold tracking-tight text-brand-ink"
              style={{ fontFamily: `"${headingFamily}", sans-serif` }}
            >
              {form.name || 'Your workspace'}
            </h3>
            <p
              className="mt-3 max-w-xl text-sm leading-7 text-slate-600"
              style={{ fontFamily: `"${bodyFamily}", sans-serif` }}
            >
              This preview reflects your selected fonts and colors so every
              deliverable can carry the same recognizable look.
            </p>
            <div className="mt-6 flex gap-2">
              <span
                className="h-8 w-14 rounded-full"
                style={{
                  backgroundColor: isHexColor(form.brandPrimaryColor)
                    ? form.brandPrimaryColor
                    : DEFAULT_PRIMARY,
                }}
              />
              <span
                className="h-8 w-14 rounded-full"
                style={{
                  backgroundColor: isHexColor(form.brandAccentColor)
                    ? form.brandAccentColor
                    : DEFAULT_ACCENT,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
