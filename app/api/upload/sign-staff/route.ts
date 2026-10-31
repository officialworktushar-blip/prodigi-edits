import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/lib/guards';
import { createUploadUrl } from '@/lib/storage';
import { createAdminClient } from '@/lib/supabase/admin';
import { isUuid } from '@/lib/admin/audit';

const signUploadSchema = z.object({
  path: z.string().min(3).max(500),
  bucket: z.enum(['drafts', 'deliverables']).default('drafts'),
});

export async function POST(request: NextRequest) {
  try {
    const { user, profile } = await requireRole(['ADMIN', 'EDITOR']);

    const body = await request.json();
    const validated = signUploadSchema.parse(body);

    // Path convention: {workspace_id}/{order_id}/{filename}
    const segments = validated.path.split('/');

    if (
      segments.length !== 3 ||
      !isUuid(segments[0]) ||
      !isUuid(segments[1]) ||
      !segments[2]
    ) {
      return NextResponse.json(
        { error: 'Invalid upload path.' },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const { data: order } = await admin
      .from('orders')
      .select('id, workspace_id, manager_id, editor_id, thumbnail_artist_id')
      .eq('id', segments[1])
      .eq('workspace_id', segments[0])
      .maybeSingle();

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    const isAdmin = profile?.role === 'ADMIN';
    const isAssigned =
      order.manager_id === user.id ||
      order.editor_id === user.id ||
      order.thumbnail_artist_id === user.id;

    if (!isAdmin && !isAssigned) {
      return NextResponse.json({ error: 'Not allowed.' }, { status: 403 });
    }

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
