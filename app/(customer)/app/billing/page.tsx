import Link from 'next/link';
import { CalendarClock, CheckCircle2, CreditCard } from 'lucide-react';
import { BillingPurchase } from '@/components/customer/billing/billing-purchase';
import { formatDate } from '@/components/customer/orders/order-utils';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { SUPPORT_EMAIL } from '@/lib/config';
import { getActivePackages } from '@/lib/data/marketing';
import {
  getCustomerCredits,
  getCustomerSubscription,
} from '@/lib/data/customer';
import { requireUser } from '@/lib/guards';
import type { PlanType, Subscription } from '@/types/db';

export const dynamic = 'force-dynamic';

const PLAN_LABELS: Record<PlanType, string> = {
  STARTER: 'Starter plan',
  PRO: 'Pro plan',
};

function SubscriptionCard({
  subscription,
}: {
  subscription: Subscription | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <CreditCard aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-brand-ink">
                {subscription
                  ? PLAN_LABELS[subscription.plan]
                  : 'Pay as you go'}
              </h2>
              <Badge variant={subscription ? 'success' : 'outline'}>
                {subscription ? 'Active' : 'No subscription'}
              </Badge>
            </div>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              {subscription
                ? `${subscription.billing.toLowerCase()} billing keeps a steady flow of edits without reordering each time.`
                : 'Your account runs on credits. Add a package whenever your queue needs a boost, with no recurring commitment.'}
            </p>
          </div>
        </div>

        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
            subscription
              ? 'Manage my subscription'
              : 'Subscription question'
          )}`}
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
        >
          {subscription ? 'Manage plan' : 'Talk to us'}
        </a>
      </div>

      {subscription ? (
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CalendarClock aria-hidden="true" className="h-3.5 w-3.5" />
            {subscription.current_period_end
              ? `Renews ${formatDate(subscription.current_period_end)}`
              : 'Renewal date pending'}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2
              aria-hidden="true"
              className="h-3.5 w-3.5 text-emerald-500"
            />
            Billing status: {subscription.status.toLowerCase()}
          </span>
        </div>
      ) : (
        <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
          Need a monthly plan for a larger team?{' '}
          <Link
            href="/pricing"
            className="font-semibold text-indigo-600 underline-offset-2 hover:underline"
          >
            Compare plans
          </Link>
          {' '}or email {SUPPORT_EMAIL}. Packages above are added directly to
          your credit balance.
        </div>
      )}
    </div>
  );
}

export default async function BillingPage() {
  const { user } = await requireUser();
  const [credits, packages, subscription] = await Promise.all([
    getCustomerCredits(user.id),
    getActivePackages(),
    getCustomerSubscription(user.id),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Billing"
        title="Credits that keep your queue moving"
        highlight="moving"
        description="Top up in a few clicks, track each format balance, and keep your production rhythm steady."
      />

      <BillingPurchase credits={credits} packages={packages} />

      <SubscriptionCard subscription={subscription} />
    </div>
  );
}
