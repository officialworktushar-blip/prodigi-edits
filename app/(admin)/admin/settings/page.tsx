import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  CURRENCY,
  INCLUDED_STORAGE,
  SUPPORT_EMAIL,
  TURNAROUND_HOURS,
} from '@/lib/config';

export const dynamic = 'force-dynamic';

function StatusRow({ label, ok, hint }: { label: string; ok: boolean; hint?: string }) {
  return (
    <li className="flex items-start justify-between gap-3 py-3">
      <div>
        <p className="text-sm font-medium text-brand-ink">{label}</p>
        {hint && !ok ? <p className="mt-0.5 text-xs text-slate-500">{hint}</p> : null}
      </div>
      <Badge variant={ok ? 'success' : 'warning'}>{ok ? 'Ready' : 'Needs attention'}</Badge>
    </li>
  );
}

export default async function AdminSettingsPage() {
  await requireRole(['ADMIN']);
  const admin = createAdminClient();

  const [notesCheck, checklistCheck] = await Promise.all([
    admin.from('order_notes').select('order_id', { count: 'exact', head: true }),
    admin.from('subscription_checklist').select('id', { count: 'exact', head: true }),
  ]);

  const rows: { label: string; value: string }[] = [
    { label: 'Brand name', value: BRAND_NAME },
    { label: 'Tagline', value: BRAND_TAGLINE },
    { label: 'Support email', value: SUPPORT_EMAIL },
    { label: 'Currency', value: CURRENCY },
    { label: 'Long-form turnaround', value: `${TURNAROUND_HOURS.long} hours` },
    { label: 'Short-form turnaround', value: `${TURNAROUND_HOURS.short} hours` },
    {
      label: 'Included footage',
      value: `${INCLUDED_STORAGE.DURATION_MINUTES} min / ${INCLUDED_STORAGE.SIZE_GB} GB`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-ink">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Read-only overview. Brand values live in lib/config.ts.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Brand and service</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-slate-100">
              {rows.map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-sm text-slate-500">{row.label}</dt>
                  <dd className="text-right text-sm font-medium text-brand-ink">{row.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System checks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-slate-100">
              <StatusRow
                label="Supabase URL"
                ok={Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)}
                hint="Set NEXT_PUBLIC_SUPABASE_URL."
              />
              <StatusRow
                label="Supabase anon key"
                ok={Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)}
                hint="Set NEXT_PUBLIC_SUPABASE_ANON_KEY."
              />
              <StatusRow
                label="Service role key"
                ok={Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)}
                hint="Set SUPABASE_SERVICE_ROLE_KEY (server only)."
              />
              <StatusRow
                label="Site URL"
                ok={Boolean(process.env.NEXT_PUBLIC_SITE_URL)}
                hint="Set NEXT_PUBLIC_SITE_URL to your live domain."
              />
              <StatusRow
                label="Order notes table"
                ok={!notesCheck.error}
                hint="Run supabase/admin_extras.sql in the SQL Editor."
              />
              <StatusRow
                label="Subscription checklist table"
                ok={!checklistCheck.error}
                hint="Run supabase/admin_extras.sql in the SQL Editor."
              />
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              Payments and email delivery are not connected yet. Customer purchases only add
              credits.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
