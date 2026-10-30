'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/guards';
import { createClient } from '@/lib/supabase/server';
import { ACTIVE_WORKSPACE_COOKIE } from '@/lib/customer/workspace';

export async function setActiveWorkspace(formData: FormData): Promise<void> {
  await requireUser();

  const workspaceId = String(formData.get('workspaceId') ?? '').trim();

  if (!workspaceId) {
    redirect('/app');
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('workspaces')
    .select('id')
    .eq('id', workspaceId)
    .maybeSingle();

  if (error || !data) {
    redirect('/app');
  }

  cookies().set(ACTIVE_WORKSPACE_COOKIE, workspaceId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  revalidatePath('/app', 'layout');
  redirect('/app');
}

export async function markNotificationRead(id: string): Promise<void> {
  const { user } = await requireUser();

  if (!id) {
    return;
  }

  const supabase = createClient();
  await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)
    .is('read_at', null);

  revalidatePath('/app', 'layout');
}

export async function markAllNotificationsRead(): Promise<void> {
  const { user } = await requireUser();
  const supabase = createClient();

  await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .is('read_at', null);

  revalidatePath('/app', 'layout');
}

export async function signOutAction(): Promise<void> {
  await requireUser();

  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
