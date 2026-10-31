'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  EXTRAS_SQL_HINT,
  firstIssue,
  isMissingTable,
  logAudit,
  type ActionResult,
} from '@/lib/admin/audit';
import { CHECKLIST_ITEMS, addMonths } from '@/lib/admin/checklist';

const planSchema = z.enum(['STARTER', 'PRO']);
const billingSchema = z.enum(['QUARTERLY', 'ANNUAL']);

function monthsFor(billing: 'QUARTERLY' | 'ANNUAL'): number {
  return billing === 'ANNUAL' ? 12 : 3;
}

function refresh() {
  revalidatePath('/admin/subscriptions');
  revalidatePath('/admin');
}

const createSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address.'),
  plan: planSchema,
  billing: billingSchema,
});

export async function createSubscription(
  input: z.infer<typeof createSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = createSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const { email, plan, billing } = parsed.data;
  const admin = createAdminClient();
  const { data: rows } = await admin
    .from('profiles')
    .select('id')
    .ilike('email', email.replace(/[%_\\]/g, (char) => `\\${char}`))
    .limit(1);

  const customer = ((rows ?? []) as { id: string }[])[0];

  if (!customer) {
    return { success: false, error: 'No account with that email.' };
  }

  const { data: existing } = await admin
    .from('subscriptions')
    .select('id')
    .eq('user_id', customer.id)
    .eq('status', 'ACTIVE')
    .limit(1);

  if ((existing ?? []).length > 0) {
    return { success: false, error: 'This customer already has an active subscription.' };
  }

  const { data: created, error } = await admin
    .from('subscriptions')
    .insert({
      user_id: customer.id,
      plan,
      billing,
      status: 'ACTIVE',
      current_period_end: addMonths(new Date(), monthsFor(billing)).toISOString(),
    })
    .select('id')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: 'create_subscription',
    entity: 'subscription',
    entityId: (created as { id: string } | null)?.id ?? null,
    meta: { user_id: customer.id, plan, billing },
  });

  refresh();

  return { success: true };
}

const statusSchema = z.object({
  id: z.string().uuid('Invalid subscription.'),
  status: z.enum(['ACTIVE', 'PAUSED', 'CANCELLED']),
});

export async function setSubscriptionStatus(
  input: z.infer<typeof statusSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = statusSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('subscriptions')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: 'set_subscription_status',
    entity: 'subscription',
    entityId: parsed.data.id,
    meta: { status: parsed.data.status },
  });

  refresh();

  return { success: true };
}

const renewSchema = z.object({ id: z.string().uuid('Invalid subscription.') });

export async function renewSubscription(
  input: z.infer<typeof renewSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = renewSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const admin = createAdminClient();
  const { data: subscription } = await admin
    .from('subscriptions')
    .select('id, billing, current_period_end')
    .eq('id', parsed.data.id)
    .maybeSingle();

  if (!subscription) {
    return { success: false, error: 'Subscription not found.' };
  }

  const row = subscription as { billing: 'QUARTERLY' | 'ANNUAL'; current_period_end: string | null };
  const start =
    row.current_period_end && new Date(row.current_period_end).getTime() > Date.now()
      ? new Date(row.current_period_end)
      : new Date();
  const nextEnd = addMonths(start, monthsFor(row.billing));

  const { error } = await admin
    .from('subscriptions')
    .update({ current_period_end: nextEnd.toISOString(), status: 'ACTIVE' })
    .eq('id', parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: 'renew_subscription',
    entity: 'subscription',
    entityId: parsed.data.id,
    meta: { current_period_end: nextEnd.toISOString() },
  });

  refresh();

  return { success: true };
}

const checklistSchema = z.object({
  subscriptionId: z.string().uuid('Invalid subscription.'),
  month: z.string().regex(/^[0-9]{4}-[0-9]{2}$/, 'Invalid month.'),
  item: z.enum(CHECKLIST_ITEMS),
  done: z.boolean(),
});

export async function toggleChecklistItem(
  input: z.infer<typeof checklistSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = checklistSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const value = parsed.data;
  const admin = createAdminClient();
  const { error } = await admin.from('subscription_checklist').upsert(
    {
      subscription_id: value.subscriptionId,
      month: value.month,
      item: value.item,
      done: value.done,
      done_at: value.done ? new Date().toISOString() : null,
    },
    { onConflict: 'subscription_id,month,item' }
  );

  if (error) {
    return {
      success: false,
      error: isMissingTable(error.message) ? EXTRAS_SQL_HINT : error.message,
    };
  }

  await logAudit({
    actorId: user.id,
    action: 'toggle_checklist',
    entity: 'subscription',
    entityId: value.subscriptionId,
    meta: { month: value.month, item: value.item, done: value.done },
  });

  revalidatePath('/admin/subscriptions');

  return { success: true };
}
