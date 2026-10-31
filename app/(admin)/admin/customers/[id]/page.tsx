import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/status-badge';
import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import { isUuid } from '@/lib/admin/audit';
import type { OrderKind, OrderStatus } from '@/types/db';
import { CreditAdjustForm } from './credit-adjust-form';

export const dynamic = 'force-dynamic';

interface CustomerDetailPageProps {
  params: { id: string };
}

interface WorkspaceRow {
  id: string;
  name: string;
  type: string | null;
}

interface OrderRow {
  id: string;
  order_no: number;
  title: string;
  status: OrderStatus;
  kind: OrderKind;
  created_at: string;
}

interface SubscriptionRow {
  id: string;
  plan: string;
  billing: string;
  status: string;
  current_period_end: string | null;
}

interface CreditAuditRow {
  id: string;
  created_at: string;
  meta: { kind?: string; delta?: number; reason?: string } | null;
  actor: { name: string | null; email: string | null } | null;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  await requireRole(['ADMIN']);

  if (!isUuid(params.id)) {
    notFound();
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('id, name, email, role, avatar_url, created_at')
    .eq('id', params.id)
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  const [ownedResult, memberResult, ordersResult, creditsResult, subsResult, auditResult] =
    await Promise.all([
      admin.from('workspaces').select('id, name, type').eq('owner_id', params.id),
      admin
        .from('workspace_members')
        .select('role, workspace:workspace_id(id, name, type)')
        .eq('user_id', params.id),
      admin
        .from('orders')
        .select('id, order_no, title, status, kind, created_at')
        .eq('customer_id', params.id)
        .order('created_at', { ascending: false })
        .limit(20),
      admin.from('credits').select('kind, balance').eq('user_id', params.id),
      admin
        .from('subscriptions')
        .select('id, plan, billing, status, current_period_end')
        .eq('user_id', params.id)
        .order('created_at', { ascending: false }),
      admin
        .from('audit_logs')
        .select('id, created_at, meta, actor:actor_id(name, email)')
        .eq('entity', 'credit')
        .eq('entity_id', params.id)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

  const workspaces = new Map<string, WorkspaceRow & { role: string }>();

  for (const row of (ownedResult.data ?? []) as WorkspaceRow[]) {
    workspaces.set(row.id, { ...row, role: 'OWNER' });
  }

  for (const row of (memberResult.data ?? []) as unknown as {
    role: string;
    workspace: WorkspaceRow | null;
  }[]) {
    if (row.workspace && !workspaces.has(row.workspace.id)) {
      workspaces.set(row.workspace.id, { ...row.workspace, role: row.role });
    }
  }

  const orders = (ordersResult.data ?? []) as OrderRow[];
  const subscriptions = (subsResult.data ?? []) as SubscriptionRow[];
  const creditAudit = (auditResult.data ?? []) as unknown as CreditAuditRow[];

  const balances: Record<OrderKind, number> = {
    HORIZONTAL: 0,
    VERTICAL: 0,
    THUMBNAIL: 0,
  };

  for (const row of (creditsResult.data ?? []) as { kind: OrderKind; balance: number }[]) {
    balances[row.kind] = row.balance;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/customers" aria-label="Back to customers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-bold text-brand-ink">
            {profile.name || 'Unnamed customer'}
          </h1>
          <p className="mt-1 truncate text-sm text-slate-500">{profile.email}</p>
        </div>
        <Badge variant="secondary">{profile.role}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <CreditAdjustForm userId={params.id} balances={balances} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="py-6 text-center text-sm text-slate-500">No orders yet.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <li key={order.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="block truncate font-semibold text-brand-ink hover:underline"
                        >
                          #{order.order_no} · {order.title}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {order.kind.toLowerCase()} ·{' '}
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Joined
                </p>
                <p className="mt-1 text-slate-600">
                  {new Date(profile.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Workspaces
                </p>
                {workspaces.size === 0 ? (
                  <p className="mt-1 text-slate-500">None</p>
                ) : (
                  <ul className="mt-1 space-y-1">
                    {Array.from(workspaces.values()).map((workspace) => (
                      <li key={workspace.id} className="flex items-center justify-between gap-2">
                        <span className="truncate text-slate-700">{workspace.name}</span>
                        <Badge variant="outline">{workspace.role}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {subscriptions.length === 0 ? (
                <p className="text-slate-500">No subscription.</p>
              ) : (
                subscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/60 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-brand-ink">
                        {subscription.plan} · {subscription.billing.toLowerCase()}
                      </span>
                      <Badge variant={subscription.status === 'ACTIVE' ? 'success' : 'outline'}>
                        {subscription.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Renews{' '}
                      {subscription.current_period_end
                        ? new Date(subscription.current_period_end).toLocaleDateString()
                        : 'not set'}
                    </p>
                  </div>
                ))
              )}
              <Link
                href="/admin/subscriptions"
                className="inline-block text-sm font-semibold text-brand-indigo hover:underline"
              >
                Manage subscriptions
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credit history</CardTitle>
            </CardHeader>
            <CardContent>
              {creditAudit.length === 0 ? (
                <p className="text-sm text-slate-500">No manual adjustments yet.</p>
              ) : (
                <ul className="space-y-3">
                  {creditAudit.map((entry) => (
                    <li key={entry.id} className="text-sm">
                      <p className="font-semibold text-brand-ink">
                        {(entry.meta?.delta ?? 0) > 0 ? '+' : ''}
                        {entry.meta?.delta ?? 0} {entry.meta?.kind?.toLowerCase() ?? ''}
                      </p>
                      <p className="text-xs text-slate-500">{entry.meta?.reason ?? ''}</p>
                      <p className="text-xs text-slate-400">
                        {entry.actor?.name || entry.actor?.email || 'System'} ·{' '}
                        {new Date(entry.created_at).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
