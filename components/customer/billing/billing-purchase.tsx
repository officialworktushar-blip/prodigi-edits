'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  Check,
  Image as ImageIcon,
  Smartphone,
  Sparkles,
  Video,
} from 'lucide-react';
import { purchasePackage } from '@/app/(customer)/app/billing/actions';
import { ORDER_KIND_LABELS } from '@/components/customer/orders/order-utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/config';
import type { Credit, OrderKind, Package } from '@/types/db';

const CREDIT_KINDS: OrderKind[] = [
  'HORIZONTAL',
  'VERTICAL',
  'THUMBNAIL',
];

const KIND_ICONS = {
  HORIZONTAL: Video,
  VERTICAL: Smartphone,
  THUMBNAIL: ImageIcon,
} as const;

const CREDIT_LABELS: Record<OrderKind, string> = {
  HORIZONTAL: 'Horizontal edits',
  VERTICAL: 'Vertical edits',
  THUMBNAIL: 'Thumbnails',
};

export interface BillingPurchaseProps {
  credits: Credit[];
  packages: Package[];
}

export function BillingPurchase({
  credits,
  packages,
}: BillingPurchaseProps) {
  const router = useRouter();
  const [balances, setBalances] = useState<Record<OrderKind, number>>(() => {
    const initial: Record<OrderKind, number> = {
      HORIZONTAL: 0,
      VERTICAL: 0,
      THUMBNAIL: 0,
    };

    credits.forEach((credit) => {
      initial[credit.kind] = Math.max(0, credit.balance);
    });

    return initial;
  });
  const [pendingPackageId, setPendingPackageId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function buyPackage(packageRow: Package) {
    setPendingPackageId(packageRow.id);
    setError(null);
    setNotice(null);

    try {
      const result = await purchasePackage({ packageId: packageRow.id });

      if (
        !result.ok ||
        !result.orderKind ||
        result.balance === undefined ||
        result.creditsAdded === undefined
      ) {
        setError(result.message);
        return;
      }

      const { orderKind, balance, creditsAdded } = result;

      setBalances((current) => ({
        ...current,
        [orderKind]: balance,
      }));
      setNotice(
        `${creditsAdded} ${ORDER_KIND_LABELS[
          orderKind
        ].toLowerCase()} credits added. New balance: ${balance}.`
      );
      router.refresh();
    } catch {
      setError('The mock purchase did not complete. Try again.');
    } finally {
      setPendingPackageId(null);
    }
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0"
          />
          {error}
        </div>
      ) : null}

      {notice ? (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          {notice}
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-brand-ink">
              Your credits
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Credits apply to future orders by format. They never expire.
            </p>
          </div>
          <Badge variant="secondary">
            <Sparkles aria-hidden="true" className="h-3 w-3" />
            Ready to use
          </Badge>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {CREDIT_KINDS.map((kind) => {
            const Icon = KIND_ICONS[kind];

            return (
              <div
                key={kind}
                className="rounded-xl border border-slate-200 bg-brand-surface px-4 py-4"
              >
                <div className="flex items-center gap-2 text-slate-500">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  <span className="text-xs font-semibold">
                    {CREDIT_LABELS[kind]}
                  </span>
                </div>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-brand-ink">
                  {balances[kind]}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                  Available credits
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-brand-ink">
              Add a package
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Pick a package and add its credits instantly. This is a mock
              purchase for the prototype, so no card is charged.
            </p>
          </div>
          <Badge variant="warning">Mock checkout</Badge>
        </div>

        {packages.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
            No active packages are available right now. Contact support and we
            will help you top up manually.
          </p>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {packages.map((packageRow) => {
              const pricePerVideo = Number(packageRow.price_per_video);
              const discountPercent = Number(packageRow.discount_percent);
              const videoCount = Math.max(0, packageRow.video_count);
              const subtotal = pricePerVideo * videoCount;
              const total = subtotal * (1 - discountPercent / 100);
              const isPending = pendingPackageId === packageRow.id;

              return (
                <div
                  key={packageRow.id}
                  className="flex flex-col rounded-xl border border-slate-200 p-4 transition-colors hover:border-indigo-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-brand-ink">
                        {packageRow.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {ORDER_KIND_LABELS[packageRow.kind]}
                      </p>
                    </div>
                    {discountPercent > 0 ? (
                      <Badge variant="success">
                        {Math.round(discountPercent)}% off
                      </Badge>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <p className="text-2xl font-semibold tracking-tight text-brand-ink">
                      {formatPrice(Math.round(total * 100))}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatPrice(Math.round(pricePerVideo * 100))} per video
                      {discountPercent > 0
                        ? ` · ${formatPrice(Math.round(subtotal * 100))} before discount`
                        : ''}
                    </p>
                  </div>

                  <p className="mt-3 text-xs font-medium text-slate-600">
                    Adds {videoCount} {CREDIT_LABELS[packageRow.kind].toLowerCase()}
                  </p>

                  <Button
                    type="button"
                    size="sm"
                    className="mt-4 w-full"
                    isLoading={isPending}
                    disabled={pendingPackageId !== null}
                    onClick={() => void buyPackage(packageRow)}
                  >
                    Add {videoCount} credits
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
