import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { createClient } from './supabase/server';
import type { MemberRole, Profile, UserRole } from '../types/db';

export interface AuthContext {
  user: User;
  profile: Profile | null;
}

export async function getUser(): Promise<AuthContext | null> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    return { user, profile: null };
  }

  return { user, profile: (profile as Profile | null) ?? null };
}

export async function requireUser(): Promise<AuthContext> {
  const auth = await getUser();

  if (!auth) {
    redirect('/login');
  }

  return auth;
}

export async function requireRole(roles: UserRole[]): Promise<AuthContext> {
  const auth = await requireUser();
  const role = auth.profile?.role;

  if (!role || !roles.includes(role)) {
    redirect('/app');
  }

  return auth;
}

export async function requireWorkspaceAccess(
  workspaceId: string,
  minRole: MemberRole = 'VIEWER'
): Promise<AuthContext> {
  const auth = await requireUser();

  if (auth.profile?.role === 'ADMIN') {
    return auth;
  }

  const supabase = createClient();
  const { data, error } = await supabase.rpc('has_workspace_access', {
    ws: workspaceId,
    min_role: minRole,
  });

  if (error || data !== true) {
    redirect('/app');
  }

  return auth;
}
