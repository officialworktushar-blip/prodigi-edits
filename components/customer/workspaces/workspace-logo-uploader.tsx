'use client';

import { useRef, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Image as ImageIcon,
  Loader2,
  UploadCloud,
} from 'lucide-react';
import { updateWorkspaceLogo } from '@/app/(customer)/app/workspaces/actions';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

interface SignImageResponse {
  bucket?: string;
  path?: string;
  token?: string;
  error?: string;
}

export interface WorkspaceLogoUploaderProps {
  workspaceId: string;
  workspaceName: string;
  initialLogoUrl: string | null;
  canEdit: boolean;
  primaryColor: string;
  accentColor: string;
}

export function WorkspaceLogoUploader({
  workspaceId,
  workspaceName,
  initialLogoUrl,
  canEdit,
  primaryColor,
  accentColor,
}: WorkspaceLogoUploaderProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFile(file: File) {
    const contentType = file.type.split(';')[0]?.trim().toLowerCase() ?? '';

    if (!ALLOWED_TYPES.has(contentType)) {
      setError('Upload a JPG, PNG, WebP, GIF, or AVIF image.');
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setError('Choose an image smaller than 5 MB.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const signResponse = await fetch('/api/upload/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: 'workspace-logo',
          workspaceId,
          fileName: file.name,
          size: file.size,
          contentType,
        }),
      });

      let signPayload: SignImageResponse = {};

      try {
        signPayload = (await signResponse.json()) as SignImageResponse;
      } catch {
        signPayload = {};
      }

      if (
        !signResponse.ok ||
        !signPayload.bucket ||
        !signPayload.path ||
        !signPayload.token
      ) {
        throw new Error(
          signPayload.error || 'Could not prepare this image upload.'
        );
      }

      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from(signPayload.bucket)
        .uploadToSignedUrl(signPayload.path, signPayload.token, file, {
          contentType,
          cacheControl: '3600',
        });

      if (uploadError) {
        throw new Error(uploadError.message || 'The image upload failed.');
      }

      const saved = await updateWorkspaceLogo({
        workspaceId,
        path: signPayload.path,
      });

      if (!saved.ok || !saved.logoUrl) {
        throw new Error(saved.message);
      }

      setLogoUrl(saved.logoUrl);
      router.refresh();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Could not upload the logo. Try again.'
      );
    } finally {
      setIsUploading(false);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      void uploadFile(file);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span
          className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-white shadow-soft"
          style={{
            backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${workspaceName} logo`}
              className="h-full w-full object-cover"
            />
          ) : (
            <Building2 aria-hidden="true" className="h-8 w-8" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-brand-ink">
            Workspace logo
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            A square image works best. JPG, PNG, WebP, GIF, or AVIF up to 5 MB.
          </p>
          {canEdit ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                onChange={handleFileChange}
                className="sr-only"
                aria-label="Upload workspace logo"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                isLoading={isUploading}
                onClick={() => inputRef.current?.click()}
              >
                {isUploading ? null : (
                  <UploadCloud aria-hidden="true" className="h-4 w-4" />
                )}
                {logoUrl ? 'Replace logo' : 'Upload logo'}
              </Button>
              <span className="flex items-center gap-1 text-[10px] text-slate-400">
                <ImageIcon aria-hidden="true" className="h-3 w-3" />
                Public image
              </span>
            </div>
          ) : (
            <p className="mt-2 text-xs font-medium text-slate-400">
              Only workspace managers can change the logo.
            </p>
          )}
        </div>
      </div>

      {isUploading ? (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <Loader2
            aria-hidden="true"
            className="h-3.5 w-3.5 animate-spin"
          />
          Uploading and saving...
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="mt-3 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
