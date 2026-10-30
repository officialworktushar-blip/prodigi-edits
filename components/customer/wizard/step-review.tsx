'use client';

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  CreditCard,
  HardDrive,
  Link2,
  Sparkles,
  Tag,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatMoney } from './format';
import type {
  FootageValues,
  IdeaValues,
  WizardAddOn,
  WizardQuote,
} from './types';
import type { OrderKind } from '@/types/db';

const KIND_LABELS: Record<OrderKind, string> = {
  HORIZONTAL: 'Horizontal video',
  VERTICAL: 'Vertical short',
  THUMBNAIL: 'Thumbnail / cover',
};

export interface StepReviewProps {
  idea: IdeaValues;
  footage: FootageValues;
  workspaceName: string;
  selectedAddOns: WizardAddOn[];
  basePackageName: string | null;
  quote: WizardQuote;
  creditBalance: number;
  useCredits: boolean;
  onUseCreditsChange: (value: boolean) => void;
  couponCode: string;
  onCouponCodeChange: (value: string) => void;
  onApplyCoupon: () => void;
  isApplyingCoupon: boolean;
  couponFeedback: { tone: 'success' | 'error'; message: string } | null;
}

export function StepReview({
  idea,
  footage,
  workspaceName,
  selectedAddOns,
  basePackageName,
  quote,
  creditBalance,
  useCredits,
  onUseCreditsChange,
  couponCode,
  onCouponCodeChange,
  onApplyCoupon,
  isApplyingCoupon,
  couponFeedback,
}: StepReviewProps) {
  const minutes = Number(footage.rawFootageMinutes) || 0;
  const sizeGb = Number(footage.footageSizeGb) || 0;
  const overAllowance =
    (footage.rawFootageMinutes.trim() !== '' && minutes > 60) ||
    (footage.footageSizeGb.trim() !== '' && sizeGb > 20);
  const creditLabel = creditBalance === 1 ? 'credit' : 'credits';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-brand-ink sm:text-2xl">
          Review and submit
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Confirm the brief, footage handoff, and estimated price. Submitting
          places your order in the production queue for {workspaceName}.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center gap-2">
            <Video aria-hidden="true" className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-semibold text-brand-ink">
              Project brief
            </h3>
          </div>
          <p className="mt-3 text-base font-semibold tracking-tight text-brand-ink">
            {idea.title || 'Untitled order'}
          </p>
          <p className="mt-1 text-xs font-medium text-indigo-600">
            {KIND_LABELS[idea.kind]}
          </p>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
            {idea.brief || 'No brief provided.'}
          </p>
          {idea.referenceLinks.trim() ? (
            <div className="mt-4 rounded-xl bg-brand-surface p-3">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Link2 aria-hidden="true" className="h-3.5 w-3.5" />
                Reference links
              </p>
              <p className="mt-1.5 whitespace-pre-line break-all text-xs leading-5 text-slate-500">
                {idea.referenceLinks}
              </p>
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <HardDrive
              aria-hidden="true"
              className="h-4 w-4 text-indigo-600"
            />
            <h3 className="text-sm font-semibold text-brand-ink">Footage</h3>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs text-slate-400">Cloud link</dt>
              <dd className="mt-0.5 break-all text-xs leading-5 text-slate-600">
                {footage.cloudLink.trim() || 'Not provided yet'}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
                Raw minutes
              </dt>
              <dd className="text-xs font-semibold text-slate-600">
                {footage.rawFootageMinutes.trim() || '—'}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="flex items-center gap-1.5 text-xs text-slate-400">
                <HardDrive aria-hidden="true" className="h-3.5 w-3.5" />
                Project size
              </dt>
              <dd className="text-xs font-semibold text-slate-600">
                {footage.footageSizeGb.trim()
                  ? `${footage.footageSizeGb} GB`
                  : '—'}
              </dd>
            </div>
          </dl>
          {overAllowance ? (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              This order is above the included 60 minutes or 20 GB allowance. We
              may confirm scope before production starts.
            </p>
          ) : null}
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <Sparkles
              aria-hidden="true"
              className="h-4 w-4 text-indigo-600"
            />
            <h3 className="text-sm font-semibold text-brand-ink">
              Extras and workspace
            </h3>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Workspace: <span className="font-semibold text-slate-700">{workspaceName}</span>
          </p>
          {selectedAddOns.length === 0 ? (
            <p className="mt-4 rounded-xl bg-brand-surface p-3 text-sm text-slate-500">
              No add-ons selected. The order will include the base edit only.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {selectedAddOns.map((addOn) => (
                <li
                  key={addOn.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-brand-surface px-3 py-2.5"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {addOn.name}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">
                    {formatMoney(addOn.price)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 border-t border-slate-100 pt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-ink">
                  <CreditCard aria-hidden="true" className="h-4 w-4 text-indigo-600" />
                  Use available credits
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  You have {creditBalance} {creditLabel} for this project type.
                  Credit use is confirmed by your producer before billing.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={useCredits}
                aria-label="Use available credits"
                disabled={creditBalance === 0}
                onClick={() => onUseCreditsChange(!useCredits)}
                className={cn(
                  'relative mt-1 h-6 w-11 shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40',
                  useCredits
                    ? 'border-brand-indigo bg-brand-indigo'
                    : 'border-slate-300 bg-slate-200'
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
                    useCredits ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="text-sm font-semibold text-brand-ink">Price summary</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <dt className="text-slate-500">
                Base edit
                {basePackageName ? (
                  <span className="mt-0.5 block text-[11px] text-slate-400">
                    {basePackageName}
                  </span>
                ) : null}
              </dt>
              <dd className="font-semibold text-brand-ink">
                {formatMoney(quote.basePrice)}
              </dd>
            </div>

            {selectedAddOns.map((addOn) => (
              <div key={addOn.id} className="flex items-start justify-between gap-3">
                <dt className="text-slate-500">{addOn.name}</dt>
                <dd className="font-medium text-slate-700">
                  {formatMoney(addOn.price)}
                </dd>
              </div>
            ))}

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
              <dt className="font-medium text-slate-600">Subtotal</dt>
              <dd className="font-semibold text-brand-ink">
                {formatMoney(quote.subtotal)}
              </dd>
            </div>

            {quote.couponDiscount > 0 ? (
              <div className="flex items-center justify-between gap-3">
                <dt className="text-emerald-700">
                  Coupon {quote.couponCode ? `(${quote.couponCode})` : ''}
                </dt>
                <dd className="font-semibold text-emerald-700">
                  −{formatMoney(quote.couponDiscount)}
                </dd>
              </div>
            ) : null}

            {quote.creditDiscount > 0 ? (
              <div className="flex items-center justify-between gap-3">
                <dt className="text-indigo-700">Credit applied</dt>
                <dd className="font-semibold text-indigo-700">
                  −{formatMoney(quote.creditDiscount)}
                </dd>
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
              <dt className="text-base font-semibold text-brand-ink">
                Estimated total
              </dt>
              <dd className="text-xl font-bold tracking-tight text-brand-ink">
                {formatMoney(quote.total)}
              </dd>
            </div>
          </dl>

          <div className="mt-5 border-t border-slate-100 pt-5">
            <label
              htmlFor="coupon-code"
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-ink"
            >
              <Tag aria-hidden="true" className="h-4 w-4 text-indigo-600" />
              Coupon code
            </label>
            <div className="mt-2 flex gap-2">
              <Input
                id="coupon-code"
                name="couponCode"
                value={couponCode}
                onChange={(event) =>
                  onCouponCodeChange(event.target.value.toUpperCase())
                }
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    onApplyCoupon();
                  }
                }}
                placeholder="CREATOR10"
                autoComplete="off"
                className="uppercase placeholder:normal-case"
              />
              <Button
                type="button"
                variant="outline"
                onClick={onApplyCoupon}
                isLoading={isApplyingCoupon}
                disabled={!couponCode.trim()}
                className="shrink-0"
              >
                Apply
              </Button>
            </div>
            {couponFeedback ? (
              <p
                role={couponFeedback.tone === 'error' ? 'alert' : 'status'}
                className={cn(
                  'mt-2 flex items-start gap-1.5 text-xs leading-5',
                  couponFeedback.tone === 'error'
                    ? 'text-red-600'
                    : 'text-emerald-700'
                )}
              >
                {couponFeedback.tone === 'error' ? (
                  <AlertCircle
                    aria-hidden="true"
                    className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  />
                ) : (
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  />
                )}
                {couponFeedback.message}
              </p>
            ) : null}
          </div>

          {quote.basePrice === 0 ? (
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-[11px] leading-5 text-amber-800">
              Base pricing for this format will be confirmed by your producer
              before production starts.
            </p>
          ) : null}
          <p className="mt-4 text-[11px] leading-5 text-slate-400">
            No payment is collected in this step. The estimate is confirmed after
            your producer reviews the footage and scope.
          </p>
        </section>
      </div>
    </div>
  );
}
