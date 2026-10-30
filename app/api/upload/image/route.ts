import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser, requireWorkspaceAccess } from '@/lib/guards';
import { AVATARS_BUCKET, createUploadUrl } from '@/lib/storage';

export const runtime = 'nodejs';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

const imageUploadSchema = z
  .object({
    purpose: z.enum(['avatar', 'workspace-logo']),
    workspaceId: z.string().uuid('Choose a valid workspace.').optional(),
    fileName: z
      .string()
      .trim()
      .min(1, 'Choose an image.')
      .max(255, 'The file name is too long.'),
    size: z
      .number()
      .int()
      .positive('The image is empty.')
      .max(MAX_IMAGE_BYTES, 'Choose an image smaller than 5 MB.'),
    contentType: z
      .string()
      .trim()
      .min(1, 'The image type is missing.')
      .max(200, 'The image type is invalid.')
      .refine(
        (value) => ALLOWED_IMAGE_TYPES.has(value.split(';')[0]?.trim() ?? ''),
        'Upload a JPG, PNG, WebP, GIF, or AVIF image.'
      ),
  })
  .superRefine((value, context) => {
    if (value.purpose === 'workspace-logo' && !value.workspaceId) {
      context.addIssue({
        code: 'custom',
        message: 'Choose a workspace for this logo.',
        path: ['workspaceId'],
      });
    }
  });

function safeFileName(fileName: string): string {
  const base = fileName.split(/[\\/]/).pop() ?? 'image';
  const normalized = base
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/[._-]{2,}/g, '-')
    .replace(/^[-_.]+|[-_.]+$/g, '')
    .slice(0, 100);

  return normalized || 'image';
}

export async function POST(request: Request) {
  const { user } = await requireUser();

  let input: unknown;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Send a valid JSON request body.' },
      { status: 400 }
    );
  }

  const parsed = imageUploadSchema.safeParse(input);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ??
          'Check the image details and try again.',
      },
      { status: 422 }
    );
  }

  const data = parsed.data;

  if (data.purpose === 'workspace-logo' && data.workspaceId) {
    await requireWorkspaceAccess(data.workspaceId, 'MANAGER');
  }

  const scope =
    data.purpose === 'workspace-logo' ? data.workspaceId : user.id;
  const folder =
    data.purpose === 'workspace-logo'
      ? `${scope}/brand`
      : `${scope}/avatar`;
  const uniqueName = `${Date.now()}-${randomUUID().slice(0, 8)}`;
  const path = `${folder}/${uniqueName}-${safeFileName(data.fileName)}`;

  try {
    const ticket = await createUploadUrl(path, AVATARS_BUCKET);

    return NextResponse.json({
      bucket: AVATARS_BUCKET,
      path: ticket.path,
      token: ticket.token,
    });
  } catch {
    return NextResponse.json(
      { error: 'Could not prepare this image upload. Try again.' },
      { status: 500 }
    );
  }
}
