'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireUser } from '../../lib/guards';
import { createAdminClient } from '../../lib/supabase/admin';
import { createClient } from '../../lib/supabase/server';
import type { Invite } from '../../types/db';

function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return configured.replace(/\/$/, '');
}

export async function signInWithPassword(input: {
  email: string;
  password: string;
}): Promise<{ error?: string }> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    return { error: error.message };
  }

  const userId = data.user?.id;

  if (!userId) {
    return { error: 'Unable to sign in. Please try again.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  const role = (profile as { role?: string } | null)?.role;

  if (role === 'ADMIN') {
    redirect('/admin');
  }

  if (role === 'EDITOR') {
    redirect('/admin/orders');
  }

  redirect('/app');
}

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
}): Promise<{ error?: string; success?: string }> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
      },
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/app`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    redirect('/app');
  }

  return {
    success: 'Check your inbox to confirm your email, then sign in.',
  };
}

export async function resetPasswordForEmail(input: {
  email: string;
}): Promise<{ error?: string; success?: string }> {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: 'If that email is registered, a reset link is on its way.',
  };
}

export async function updateUser(input: {
  password: string;
}): Promise<{ error?: string; success?: string }> {
  await requireUser();

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    password: input.password,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: 'Your password has been updated. You can now sign in with it.',
  };
}

export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function acceptInvite(input: {
  token: string;
}): Promise<{ error?: string; success?: string }> {
  const auth = await requireUser();
  const token = input.token.trim();

  if (!token) {
    return { error: 'Missing invitation token.' };
  }

  const email = auth.user.email?.toLowerCase();

  if (!email) {
    return { error: 'Your account does not have an email address.' };
  }

  const admin = createAdminClient();
  const { data: inviteData, error: inviteError } = await admin
    .from('invites')
    .select('*')
    .eq('token', token)
    .eq('status', 'PENDING')
    .maybeSingle();

  if (inviteError) {
    return { error: 'Unable to validate this invitation right now.' };
  }

  if (!inviteData) {
    return { error: 'This invitation is invalid or has already been used.' };
  }

  const invite = inviteData as Invite;

  if (invite.email.toLowerCase() !== email) {
    return { error: 'This invitation was sent to a different email address.' };
  }

  const { error: memberError } = await admin.from('workspace_members').upsert(
    {
      workspace_id: invite.workspace_id,
      user_id: auth.user.id,
      role: invite.role,
    },
    { onConflict: 'workspace_id,user_id' }
  );

  if (memberError) {
    return { error: 'Could not add you to the workspace. Please try again.' };
  }

  const { error: updateError } = await admin
    .from('invites')
    .update({ status: 'ACCEPTED' })
    .eq('id', invite.id);

  if (updateError) {
    return {
      error:
        'Your membership was added, but the invitation could not be closed. Please contact support.',
    };
  }

  revalidatePath('/app');
  revalidatePath('/admin');

  return {
    success: 'Invitation accepted. You now have access to the workspace.',
  };
}
