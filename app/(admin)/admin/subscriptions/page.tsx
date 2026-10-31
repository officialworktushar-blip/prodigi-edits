import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import { currentMonthKey } from '@/lib/admin/checklist';
import {
  SubscriptionsManager,
  type SubscriptionView,
} from './subscriptions-manager';

export const dynamic = 'force-dynamic';

interface SubscriptionRow {
  id: string;
  plan: 'STARTER' | 'PRO';
  billing: 'QUARTERLY' | 'ANNUAL';
  status: string;
  current_period_end: string | null;
  customer: { name: string | null; email: string | null } | null;
}

export default async function AdminSubscriptionsPage() {
  await requireRole(['ADMIN']);
  const admin = createAdminClient();
  const month = currentMonthKey();

  const { data, error } = await admin
    .from('subscriptions')
    .select('id, plan, billing, status, current_period_end, customer:user_id(name, email)')
    .order('created_at', { ascending: false });

  const rows = (data ?? []) as unknown as SubscriptionRow[];
  const ids = rows.map((row) => row.id);

  const doneByStore = new Map<string, string[]>();
  let checklistAvailable = true;

  if (ids.length > 0) {
    const { data: checklistRows, error: checklistError } = await admin
      .from('subscription_checklist')
      .select('subscription_id, item, done')
      .eq('month', month)
      .eq('done', true)
      .in('subscription_id', ids);

    if (checklistError) {
      checklistAvailable = false;
    } else {
      for (const row of (checklistRows ?? []) as { subscription_id: string; item: string }[]) {
        const list = doneByStore.get(row.subscription_id) ?? [];
        list.push(row.item);
        doneByStore.set(row.subscription_id, list);
      }
    }
  }

  const subscriptions: SubscriptionView[] = rows.map((row) => ({
    id: row.id,
    plan: row.plan,
    billing: row.billing,
    status: row.status,
    currentPeriodEnd: row.current_period_end,
    name: row.customer?.name ?? null,
    email: row.customer?.email ?? null,
    done: doneByStore.get(row.id) ?? [],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-ink">Subscriptions</h1>
        <p className="mt-1 text-sm text-slate-500">
          Channel management customers and their monthly delivery checklist.
        </p>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          Could not load subscriptions: {error.message}
        </p>
      ) : null}

      <SubscriptionsManager
        subscriptions={subscriptions}
        month={month}
        checklistAvailable={checklistAvailable}
      />
    </div>
  );
}
