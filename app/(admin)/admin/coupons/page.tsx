import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Coupon } from '@/types/db';
import { CouponManager } from './coupon-manager';

export const dynamic = 'force-dynamic';

export default async function AdminCouponsPage() {
  await requireRole(['ADMIN']);
  const admin = createAdminClient();

  const { data, error } = await admin
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-ink">Coupons</h1>
        <p className="mt-1 text-sm text-slate-500">
          Discount codes customers can apply in the order wizard.
        </p>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          Could not load coupons: {error.message}
        </p>
      ) : null}

      <CouponManager coupons={(data ?? []) as Coupon[]} />
    </div>
  );
}
