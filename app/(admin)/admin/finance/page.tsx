import { Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/stat-card';
import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import type { OrderKind } from '@/types/db';

export const dynamic = 'force-dynamic';

const KINDS: OrderKind[] = ['HORIZONTAL', 'VERTICAL', 'THUMBNAIL'];

function usd(value: number): string {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default async function AdminFinancePage() {
  await requireRole(['ADMIN']);
  const admin = createAdminClient();

  const [ordersResult, packagesResult, creditsResult, subsResult, addOnsResult, orderAddOnsResult] =
    await Promise.all([
      admin.from('orders').select('id, kind, status, created_at').limit(10000),
      admin
        .from('packages')
        .select('kind, price_per_video, discount_percent')
        .eq('is_active', true),
      admin.from('credits').select('kind, balance'),
      admin.from('subscriptions').select('plan, billing, status'),
      admin.from('add_ons').select('id, price'),
      admin.from('order_add_ons').select('order_id, add_on_id').limit(20000),
    ]);

  const orders = (ordersResult.data ?? []) as {
    id: string;
    kind: OrderKind;
    status: string;
    created_at: string;
  }[];
  const billable = orders.filter(
    (order) => order.status !== 'DRAFT' && order.status !== 'CANCELLED'
  );
  const billableIds = new Set(billable.map((order) => order.id));

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const ordersByKind: Record<OrderKind, number> = { HORIZONTAL: 0, VERTICAL: 0, THUMBNAIL: 0 };
  const monthByKind: Record<OrderKind, number> = { HORIZONTAL: 0, VERTICAL: 0, THUMBNAIL: 0 };

  for (const order of billable) {
    ordersByKind[order.kind] += 1;

    if (new Date(order.created_at).getTime() >= monthStart.getTime()) {
      monthByKind[order.kind] += 1;
    }
  }

  const unitPrice: Record<OrderKind, number> = { HORIZONTAL: 0, VERTICAL: 0, THUMBNAIL: 0 };
  const priceSamples: Record<OrderKind, number[]> = { HORIZONTAL: [], VERTICAL: [], THUMBNAIL: [] };

  for (const row of (packagesResult.data ?? []) as {
    kind: OrderKind;
    price_per_video: number;
    discount_percent: number;
  }[]) {
    priceSamples[row.kind].push(
      Number(row.price_per_video) * (1 - Number(row.discount_percent) / 100)
    );
  }

  for (const kind of KINDS) {
    const samples = priceSamples[kind];
    unitPrice[kind] = samples.length
      ? samples.reduce((sum, value) => sum + value, 0) / samples.length
      : 0;
  }

  const addOnPrice = new Map<string, number>();
  for (const row of (addOnsResult.data ?? []) as { id: string; price: number }[]) {
    addOnPrice.set(row.id, Number(row.price));
  }

  let addOnTotal = 0;
  for (const row of (orderAddOnsResult.data ?? []) as { order_id: string; add_on_id: string }[]) {
    if (billableIds.has(row.order_id)) {
      addOnTotal += addOnPrice.get(row.add_on_id) ?? 0;
    }
  }

  const estimateByKind: Record<OrderKind, number> = {
    HORIZONTAL: ordersByKind.HORIZONTAL * unitPrice.HORIZONTAL,
    VERTICAL: ordersByKind.VERTICAL * unitPrice.VERTICAL,
    THUMBNAIL: ordersByKind.THUMBNAIL * unitPrice.THUMBNAIL,
  };
  const estimateTotal =
    estimateByKind.HORIZONTAL + estimateByKind.VERTICAL + estimateByKind.THUMBNAIL + addOnTotal;

  const creditsByKind: Record<OrderKind, number> = { HORIZONTAL: 0, VERTICAL: 0, THUMBNAIL: 0 };
  for (const row of (creditsResult.data ?? []) as { kind: OrderKind; balance: number }[]) {
    creditsByKind[row.kind] += Number(row.balance);
  }

  const activeSubs = ((subsResult.data ?? []) as { plan: string; billing: string; status: string }[]).filter(
    (row) => row.status === 'ACTIVE'
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Finance</h1>
          <p className="mt-1 text-sm text-slate-500">
            Order volume, outstanding credits and subscriptions.
          </p>
        </div>
        <a
          href="/admin/finance/export"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export orders (CSV)
        </a>
      </div>

      <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        Payments are not connected yet, so there is no real revenue data. The figures below are
        estimates: orders (not draft or cancelled) multiplied by the average active package price
        per video, plus add-ons.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Estimated order value" value={usd(estimateTotal)} icon="payment" />
        <StatCard
          label="Billable orders"
          value={billable.length}
          icon="orders"
          hint="Excludes draft and cancelled"
        />
        <StatCard
          label="Orders this month"
          value={monthByKind.HORIZONTAL + monthByKind.VERTICAL + monthByKind.THUMBNAIL}
          icon="trend"
        />
        <StatCard label="Active subscriptions" value={activeSubs.length} icon="users" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>By order type</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pr-3 font-semibold">Type</th>
                <th className="py-2 pr-3 text-right font-semibold">Orders</th>
                <th className="py-2 pr-3 text-right font-semibold">This month</th>
                <th className="py-2 pr-3 text-right font-semibold">Avg price</th>
                <th className="py-2 pr-3 text-right font-semibold">Estimate</th>
                <th className="py-2 text-right font-semibold">Credits left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {KINDS.map((kind) => (
                <tr key={kind}>
                  <td className="py-3 pr-3 font-semibold capitalize text-brand-ink">
                    {kind.toLowerCase()}
                  </td>
                  <td className="py-3 pr-3 text-right text-slate-600">{ordersByKind[kind]}</td>
                  <td className="py-3 pr-3 text-right text-slate-600">{monthByKind[kind]}</td>
                  <td className="py-3 pr-3 text-right text-slate-600">{usd(unitPrice[kind])}</td>
                  <td className="py-3 pr-3 text-right text-slate-600">{usd(estimateByKind[kind])}</td>
                  <td className="py-3 text-right text-slate-600">{creditsByKind[kind]}</td>
                </tr>
              ))}
              <tr>
                <td className="py-3 pr-3 font-semibold text-brand-ink">Add-ons</td>
                <td className="py-3 pr-3" />
                <td className="py-3 pr-3" />
                <td className="py-3 pr-3" />
                <td className="py-3 pr-3 text-right text-slate-600">{usd(addOnTotal)}</td>
                <td className="py-3" />
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {activeSubs.length === 0 ? (
            <p className="text-sm text-slate-500">No active subscriptions.</p>
          ) : (
            <ul className="space-y-1 text-sm text-slate-600">
              {(['STARTER', 'PRO'] as const).map((plan) =>
                (['QUARTERLY', 'ANNUAL'] as const).map((billing) => {
                  const count = activeSubs.filter(
                    (row) => row.plan === plan && row.billing === billing
                  ).length;

                  return count > 0 ? (
                    <li key={`${plan}-${billing}`}>
                      {plan === 'PRO' ? 'Pro' : 'Starter'} · {billing.toLowerCase()}:{' '}
                      <span className="font-semibold text-brand-ink">{count}</span>
                    </li>
                  ) : null;
                })
              )}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
