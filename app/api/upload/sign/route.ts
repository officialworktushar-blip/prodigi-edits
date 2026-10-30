import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireUser } from '@/lib/guards';
import { createUploadUrl } from '@/lib/storage';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const ALLOWED_EXACT_TYPES = new Set([
  'application/zip',
  'application/pdf',
]);

function isAllowedContentType(value: string): boolean {
  const normalized = value.split(';')[0]?.trim().toLowerCase() ?? '';

  return (
    normalized.startsWith('video/') ||
    normalized.startsWith('image/') ||
    normalized.startsWith('audio/') ||
    ALLOWED_EXACT_TYPES.has(normalized)
  );
}

const signUploadSchema = z.object({
  orderId: z.string().uuid('Choose a valid order.'),
  fileName: z
    .string()
    .trim()
    .min(1, 'Choose a file.')
    .max(255, 'The file name is too long.'),
  size: z.number().int().positive('The file is empty.'),
  contentType: z
    .string()
    .trim()
    .min(1, 'The file type is missing.')
    .max(200, 'The file type is invalid.')
    .refine(
      isAllowedContentType,
      'Upload video, image, audio, zip, or PDF files only.'
    ),
});

function safeFileName(fileName: string): string {
  const base = fileName.split(/[\\/]/).pop() ?? 'upload';
  const normalized = base
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/[._-]{2,}/g, '-')
    .replace(/^[-_.]+|[-_.]+$/g, '')
    .slice(0, 120);

  return normalized || 'upload';
}

export async function POST(request: Request) {
  await requireUser();

  let input: unknown;

  try {
    input = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Send a valid JSON request body.' },
      { status: 400 }
    );
  }

  const parsed = signUploadSchema.safeParse(input);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ??
          'Check the upload details and try again.',
      },
      { status: 422 }
    );
  }

  const data = parsed.data;
  const supabase = createClient();
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, workspace_id')
    .eq('id', data.orderId)
    .eq('status', 'DRAFT')
    .maybeSingle();

  if (orderError || !order) {
    return NextResponse.json(
      { error: 'This draft is not accepting uploads.' },
      { status: 404 }
    );
  }

  const row = order as { id: string; workspace_id: string };
  const uniqueName = `${Date.now()}-${randomUUID().slice(0, 8)}`;
  const path = `${row.workspace_id}/${row.id}/${uniqueName}-${safeFileName(
    data.fileName
  )}`;

  try {
    const ticket = await createUploadUrl(path);

    return NextResponse.json({
      path: ticket.path,
      token: ticket.token,
    });
  } catch {
    return NextResponse.json(
      { error: 'Could not prepare this upload. Try again.' },
      { status: 500 }
    );
  }
}
