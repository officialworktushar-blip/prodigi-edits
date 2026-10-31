'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import { firstIssue, logAudit, type ActionResult } from '@/lib/admin/audit';

const adjustCreditsSchema = z.object({
  userId: z.string().uuid('Invalid customer.'),
  kind: z.enum(['HORIZONTAL', 'VERTICAL', 'THUMBNAIL']),
  delta: z
    .number()
    .int('Use a whole number.')
    .refine((value) => value !== 0, 'Enter a non-zero amount.')
    .refine((value) => Math.abs(value) <= 1000, 'Maximum change is 1000 credits.'),
  reason: z
    .string()
    .trim()
    .min(3, 'A reason is required.')
    .max(300, 'Reason is too long.'),
});

export async function adjustCredits(
  input: z.infer<typeof adjustCreditsSchema>
): Promise<ActionResult & { balance?: number }> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = adjustCreditsSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const { userId, kind, delta, reason } = parsed.data;
  const admin = createAdminClient();

  const { data: customer } = await admin
    .from('profiles')
    .select('id, role')
    .eq('id', userId)
    .maybeSingle();

  if (!customer) {
    return { success: false, error: 'Customer not found.' };
  }

  const { data: existing, error: readError } = await admin
    .from('credits')
    .select('id, balance')
    .eq('user_id', userId)
    .eq('kind', kind)
    .maybeSingle();

  if (readError) {
    return { success: false, error: readError.message };
  }

  const currentBalance = (existing as { balance: number } | null)?.balance ?? 0;
  const nextBalance = currentBalance + delta;

  if (nextBalance < 0) {
    return {
      success: false,
      error: `Balance cannot go below zero (current balance is ${currentBalance}).`,
    };
  }

  if (existing) {
    const { data: updatedRows, error: updateError } = await admin
      .from('credits')
      .update({ balance: nextBalance })
      .eq('id', (existing as { id: string }).id)
      .eq('balance', currentBalance)
      .select('id');

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    if (!updatedRows || updatedRows.length === 0) {
      return {
        success: false,
        error: 'The balance changed while you were editing. Reload and try again.',
      };
    }
  } else {
    const { error: insertError } = await admin
      .from('credits')
      .insert({ user_id: userId, kind, balance: nextBalance });

    if (insertError) {
      return { success: false, error: insertError.message };
    }
  }

  await admin.from('notifications').insert({
    user_id: userId,
    title: 'Your credits were updated',
    body: `${delta > 0 ? '+' : ''}${delta} ${kind.toLowerCase()} credit(s). ${reason}`,
    href: '/app/billing',
  });

  await logAudit({
    actorId: user.id,
    action: 'adjust_credits',
    entity: 'credit',
    entityId: userId,
    meta: { kind, delta, reason, balance_before: currentBalance, balance_after: nextBalance },
  });

  revalidatePath(`/admin/customers/${userId}`);
  revalidatePath('/admin/customers');
  revalidatePath('/app/billing');

  return { success: true, balance: nextBalance };
}
