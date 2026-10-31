import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/lib/guards';
import { createUploadUrl } from '@/lib/storage';

const signUploadSchema = z.object({
  path: z.string(),
  bucket: z.enum(['footage', 'drafts', 'deliverables', 'avatars']).default('drafts'),
});

export async function POST(request: NextRequest) {
  try {
    await requireRole(['ADMIN', 'EDITOR']);

    const body = await request.json();
    const validated = signUploadSchema.parse(body);

    const ticket = await createUploadUrl(validated.path, validated.bucket);

    return NextResponse.json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Upload signing error:', error);
    return NextResponse.json(
      { error: 'Failed to create upload URL' },
      { status: 500 }
    );
  }
}
