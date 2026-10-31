import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import type { AddOn, Package } from '@/types/db';
import { PricingManager } from './pricing-manager';

export const dynamic = 'force-dynamic';

export default async function AdminPricingPage() {
  await requireRole(['ADMIN']);
  const admin = createAdminClient();

  const [packageResult, addOnResult] = await Promise.all([
    admin
      .from('packages')
      .select('*')
      .order('kind', { ascending: true })
      .order('video_count', { ascending: true }),
    admin.from('add_ons').select('*').order('name', { ascending: true }),
  ]);

  const error = packageResult.error?.message ?? addOnResult.error?.message ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-ink">Pricing</h1>
        <p className="mt-1 text-sm text-slate-500">
          Packages and add-ons shown on the public pricing page and in the order wizard.
        </p>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          Could not load pricing: {error}
        </p>
      ) : null}

      <PricingManager
        packages={(packageResult.data ?? []) as Package[]}
        addOns={(addOnResult.data ?? []) as AddOn[]}
      />
    </div>
  );
}
