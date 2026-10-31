import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { EmptyState } from '@/components/shared/empty-state';
import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

interface AuditLogPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

interface AuditRow {
  id: string;
  action: string;
  entity: string | null;
  entity_id: string | null;
  meta: unknown;
  created_at: string;
  actor: { name: string | null; email: string | null } | null;
}

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

function safeFilter(value: string): string {
  return /^[a-z0-9_]{1,40}$/.test(value) ? value : '';
}

function formatMeta(meta: unknown): string {
  if (meta === null || meta === undefined) {
    return '';
  }

  const text = JSON.stringify(meta, null, 2);

  return text.length > 1500 ? `${text.slice(0, 1500)}\n…` : text;
}

export default async function AuditLogPage({ searchParams }: AuditLogPageProps) {
  await requireRole(['ADMIN']);

  const entity = safeFilter(first(searchParams.entity));
  const action = safeFilter(first(searchParams.action));
  const admin = createAdminClient();

  let query = admin
    .from('audit_logs')
    .select('id, action, entity, entity_id, meta, created_at, actor:actor_id(name, email)')
    .order('created_at', { ascending: false })
    .limit(200);

  if (entity) {
    query = query.eq('entity', entity);
  }

  if (action) {
    query = query.eq('action', action);
  }

  const [{ data, error }, { data: sample }] = await Promise.all([
    query,
    admin
      .from('audit_logs')
      .select('action, entity')
      .order('created_at', { ascending: false })
      .limit(1000),
  ]);

  const rows = (data ?? []) as unknown as AuditRow[];
  const sampleRows = (sample ?? []) as { action: string; entity: string | null }[];
  const entities = Array.from(
    new Set(sampleRows.map((row) => row.entity).filter((value): value is string => Boolean(value)))
  ).sort();
  const actions = Array.from(new Set(sampleRows.map((row) => row.action))).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Audit log</h1>
          <p className="mt-1 text-sm text-slate-500">Latest 200 admin and staff actions.</p>
        </div>

        <form action="/admin/audit-log" method="get" className="flex flex-wrap items-end gap-2">
          <div>
            <label htmlFor="audit-entity" className="text-xs font-medium text-slate-500">
              Entity
            </label>
            <Select id="audit-entity" name="entity" defaultValue={entity} className="h-10 w-40">
              <option value="">All</option>
              {entities.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="audit-action" className="text-xs font-medium text-slate-500">
              Action
            </label>
            <Select id="audit-action" name="action" defaultValue={action} className="h-10 w-48">
              <option value="">All</option>
              {actions.map((value) => (
                <option key={value} value={value}>
                  {value.replace(/_/g, ' ')}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" variant="outline">
            Filter
          </Button>
          {entity || action ? (
            <Link
              href="/admin/audit-log"
              className="inline-flex h-11 items-center px-2 text-sm font-semibold text-brand-indigo hover:underline"
            >
              Clear
            </Link>
          ) : null}
        </form>
      </div>

      <Card className="overflow-hidden">
        {error ? (
          <EmptyState icon="alert" title="Could not load the log" description={error.message} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon="file"
            title="No activity yet"
            description="Actions taken in the admin panel are recorded here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">When</th>
                  <th className="px-4 py-3 font-semibold">Who</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                  <th className="px-4 py-3 font-semibold">Entity</th>
                  <th className="px-4 py-3 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 align-top">
                {rows.map((row) => {
                  const meta = formatMeta(row.meta);

                  return (
                    <tr key={row.id}>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {row.actor?.name || row.actor?.email || 'System'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-brand-ink">
                        {row.action.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {row.entity ?? ''}
                        {row.entity === 'order' && row.entity_id ? (
                          <Link
                            href={`/admin/orders/${row.entity_id}`}
                            className="ml-2 text-xs font-semibold text-brand-indigo hover:underline"
                          >
                            Open
                          </Link>
                        ) : null}
                      </td>
                      <td className="px-4 py-3">
                        {meta ? (
                          <details>
                            <summary className="cursor-pointer text-xs font-semibold text-brand-indigo">
                              View
                            </summary>
                            <pre className="mt-2 max-w-md overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                              {meta}
                            </pre>
                          </details>
                        ) : (
                          <span className="text-xs text-slate-400">None</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
