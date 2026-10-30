import { createAdminClient } from '@/lib/supabase/admin';

export const FOOTAGE_BUCKET = 'footage';
export const DRAFTS_BUCKET = 'drafts';
export const DELIVERABLES_BUCKET = 'deliverables';
export const AVATARS_BUCKET = 'avatars';

export interface SignedUploadTicket {
  path: string;
  token: string;
  signedUrl: string;
}

function normalizeObjectPath(path: string): string {
  const normalized = path.trim().replace(/^\/+/, '');
  const segments = normalized.split('/');

  if (
    !normalized ||
    normalized.includes('\\') ||
    normalized.includes('\0') ||
    segments.some(
      (segment) =>
        segment.length === 0 || segment === '.' || segment === '..'
    )
  ) {
    throw new Error('Invalid storage object path.');
  }

  return normalized;
}

export async function createUploadUrl(
  path: string,
  bucket = FOOTAGE_BUCKET
): Promise<SignedUploadTicket> {
  const objectPath = normalizeObjectPath(path);
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(bucket)
    .createSignedUploadUrl(objectPath);

  if (error || !data?.token) {
    throw new Error(
      error?.message || 'Could not create a signed upload URL.'
    );
  }

  return {
    path: data.path || objectPath,
    token: data.token,
    signedUrl: data.signedUrl,
  };
}

export async function createDownloadUrl(
  path: string,
  expiresInSeconds = 3600,
  bucket = FOOTAGE_BUCKET
): Promise<string> {
  const objectPath = normalizeObjectPath(path);
  const expiresIn = Math.floor(expiresInSeconds);

  if (!Number.isFinite(expiresIn) || expiresIn < 1) {
    throw new Error('Invalid download URL expiry.');
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(bucket)
    .createSignedUrl(objectPath, expiresIn);

  if (error || !data?.signedUrl) {
    throw new Error(
      error?.message || 'Could not create a signed download URL.'
    );
  }

  return data.signedUrl;
}

export function getPublicUrl(path: string, bucket = AVATARS_BUCKET): string {
  const objectPath = normalizeObjectPath(path);
  const admin = createAdminClient();
  const { data } = admin.storage.from(bucket).getPublicUrl(objectPath);

  return data.publicUrl;
}

export async function removeObject(
  path: string,
  bucket = FOOTAGE_BUCKET
): Promise<void> {
  const objectPath = normalizeObjectPath(path);
  const admin = createAdminClient();
  const { error } = await admin.storage.from(bucket).remove([objectPath]);

  if (error) {
    throw new Error(error.message || 'Could not remove the storage object.');
  }
}
