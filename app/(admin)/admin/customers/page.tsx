import Link from 'next/link';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/empty-state';
import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import { sanitizeSearch } from '@/lib/admin/audit';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 25;

interface CustomersPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

interface CustomerRow {
  id: string;
  name: string | null;
  email: string | null;
  created_at: string;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  await requireRole(['ADMIN']);

  const q = sanitizeSearch(first(searchParams.q));
  const page = Math.max(1, Number.parseInt(first(searchParams.page), 10) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const admin = createAdminClient();
  let query = admin
    .from('profiles')
    .select('id, name, email, created_at', { count: 'exact' })
    .eq('role', 'CUSTOMER')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (q) {
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data, count, error } = await query;
  const customers = (data ?? []) as CustomerRow[];
  const total = count ?? customers.length;
  const ids = customers.map((customer) => customer.id);

  const orderCounts = new Map<string, number>();
  const creditTotals = new Map<string, number>();

  if (ids.length > 0) {
    const [{ data: orderRows }, { data: creditRows }] = await Promise.all([
      admin.from('orders').select('customer_id').in('customer_id', ids),
      admin.from('credits').select('user_id, balance').in('user_id', ids),
    ]);

    for (const row of (orderRows ?? []) as { customer_id: string }[]) {
      orderCounts.set(row.customer_id, (orderCounts.get(row.customer_id) ?? 0) + 1);
    }

    for (const row of (creditRows ?? []) as { user_id: string; balance: number }[]) {
      creditTotals.set(row.user_id, (creditTotals.get(row.user_id) ?? 0) + row.balance);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageHref = (target: number) =>
    `/admin/customers?${new URLSearchParams({
      ...(q ? { q } : {}),
      page: String(target),
    }).toString()}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">
            {total} customer{total === 1 ? '' : 's'} in total
          </p>
        </div>

        <form action="/admin/customers" method="get" className="flex w-full gap-2 sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <Input
              name="q"
              defaultValue={q}
              placeholder="Search name or email"
              aria-label="Search customers"
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="outline">
            Search
          </Button>
        </form>
      </div>

      <Card className="overflow-hidden">
        {error ? (
          <EmptyState
            icon="alert"
            title="Could not load customers"
            description={error.message}
          />
        ) : customers.length === 0 ? (
          <EmptyState
            icon="users"
            title={q ? 'No customers match your search' : 'No customers yet'}
            description={
              q
                ? 'Try a different name or email.'
                : 'Customers appear here after they sign up.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                  <th className="px-4 py-3 text-right font-semibold">Orders</th>
                  <th className="px-4 py-3 text-right font-semibold">Credits</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-brand-ink">
                        {customer.name || 'Unnamed'}
                      </div>
                      <div className="text-xs text-slate-500">{customer.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {orderCounts.get(customer.id) ?? 0}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {creditTotals.get(customer.id) ?? 0}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="text-sm font-semibold text-brand-indigo hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link
                href={pageHref(page - 1)}
                className="inline-flex h-9 items-center gap-1 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Previous
              </Link>
            ) : null}
            {page < totalPages ? (
              <Link
                href={pageHref(page + 1)}
                className="inline-flex h-9 items-center gap-1 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Next
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
