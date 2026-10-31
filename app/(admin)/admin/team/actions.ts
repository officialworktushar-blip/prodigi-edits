'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import { firstIssue, logAudit, type ActionResult } from '@/lib/admin/audit';

const roleSchema = z.enum(['CUSTOMER', 'EDITOR', 'ADMIN']);

const changeRoleSchema = z.object({
  userId: z.string().uuid('Invalid user.'),
  role: roleSchema,
});

export async function changeRole(
  input: z.infer<typeof changeRoleSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = changeRoleSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const { userId, role } = parsed.data;

  if (userId === user.id) {
    return { success: false, error: 'You cannot change your own role.' };
  }

  const admin = createAdminClient();
  const { data: target } = await admin
    .from('profiles')
    .select('id, role, email')
    .eq('id', userId)
    .maybeSingle();

  if (!target) {
    return { success: false, error: 'User not found.' };
  }

  const current = (target as { role: string }).role;

  if (current === role) {
    return { success: true };
  }

  if (current === 'ADMIN' && role !== 'ADMIN') {
    const { count } = await admin
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'ADMIN');

    if ((count ?? 0) <= 1) {
      return { success: false, error: 'You cannot remove the last admin.' };
    }
  }

  const { error } = await admin.from('profiles').update({ role }).eq('id', userId);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: 'change_role',
    entity: 'profile',
    entityId: userId,
    meta: { from: current, to: role, email: (target as { email: string | null }).email },
  });

  revalidatePath('/admin/team');
  revalidatePath('/admin/customers');

  return { success: true };
}

const promoteSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  role: z.enum(['EDITOR', 'ADMIN']),
});

export async function promoteByEmail(
  input: z.infer<typeof promoteSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = promoteSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const { email, role } = parsed.data;
  const admin = createAdminClient();
  const { data: rows } = await admin
    .from('profiles')
    .select('id, role, email')
    .ilike('email', email.replace(/[%_\\]/g, (char) => `\\${char}`))
    .limit(1);

  const target = ((rows ?? []) as { id: string; role: string; email: string | null }[])[0];

  if (!target) {
    return {
      success: false,
      error: 'No account with that email. Ask them to sign up first, then add them here.',
    };
  }

  if (target.role === role) {
    return { success: false, error: `That person is already ${role.toLowerCase()}.` };
  }

  const { error } = await admin.from('profiles').update({ role }).eq('id', target.id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: 'change_role',
    entity: 'profile',
    entityId: target.id,
    meta: { from: target.role, to: role, email: target.email },
  });

  revalidatePath('/admin/team');
  revalidatePath('/admin/customers');

  return { success: true };
}
