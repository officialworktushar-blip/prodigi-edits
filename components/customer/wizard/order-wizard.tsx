'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  FileCheck2,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  previewCoupon,
  saveFootageStep,
  saveIdeaStep,
  saveStyleStep,
  submitOrder,
} from '@/app/(customer)/app/orders/actions';
import { cn } from '@/lib/utils';
import { optionalNumber } from './format';
import { StepFootage } from './step-footage';
import { StepIdea } from './step-idea';
import { StepReview } from './step-review';
import { StepStyle } from './step-style';
import { Stepper } from './stepper';
import type {
  CouponPreview,
  FootageValues,
  IdeaValues,
  SubmittedOrder,
  WizardAddOn,
  WizardCredit,
  WizardPackage,
  WizardQuote,
  WizardWorkspace,
} from './types';

const STEPS = [
  { title: 'Idea' },
  { title: 'Footage' },
  { title: 'Style' },
  { title: 'Review' },
];

const INITIAL_IDEA: IdeaValues = {
  kind: 'HORIZONTAL',
  title: '',
  brief: '',
  referenceLinks: '',
};

const INITIAL_FOOTAGE: FootageValues = {
  cloudLink: '',
  rawFootageMinutes: '',
  footageSizeGb: '',
};

export interface OrderWizardProps {
  workspace: WizardWorkspace;
  addOns: WizardAddOn[];
  packages: WizardPackage[];
  credits: WizardCredit[];
}

export function OrderWizard({
  workspace,
  addOns,
  packages,
  credits,
}: OrderWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNo, setOrderNo] = useState<number | null>(null);
  const [idea, setIdea] = useState<IdeaValues>(INITIAL_IDEA);
  const [footage, setFootage] = useState<FootageValues>(INITIAL_FOOTAGE);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [useCredits, setUseCredits] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponPreview, setCouponPreview] = useState<CouponPreview | null>(
    null
  );
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasActiveUploads, setHasActiveUploads] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string[]>>();
  const [submitted, setSubmitted] = useState<SubmittedOrder | null>(null);

  const matchingPackages = packages
    .filter((item) => item.kind === idea.kind)
    .slice()
    .sort((a, b) => a.pricePerVideo - b.pricePerVideo);
  const basePackage = matchingPackages[0] ?? null;
  const basePrice = basePackage?.pricePerVideo ?? 0;
  const selectedAddOns = addOns.filter((addOn) =>
    selectedAddOnIds.includes(addOn.id)
  );
  const addOnTotal = selectedAddOns.reduce(
    (total, addOn) => total + addOn.price,
    0
  );
  const subtotal = basePrice + addOnTotal;
  const couponDiscount = Math.min(
    subtotal,
    Math.max(0, couponPreview?.discount ?? 0)
  );
  const afterCoupon = Math.max(0, subtotal - couponDiscount);
  const creditBalance = Math.max(
    0,
    credits.find((credit) => credit.kind === idea.kind)?.balance ?? 0
  );
  const creditDiscount =
    useCredits && creditBalance > 0
      ? Math.min(basePrice, afterCoupon)
      : 0;
  const quote: WizardQuote = {
    basePrice,
    addOnTotal,
    subtotal,
    couponDiscount,
    creditDiscount,
    total: Math.max(0, afterCoupon - creditDiscount),
    couponCode: couponPreview?.code ?? null,
  };

  const couponFeedback = couponError
    ? { tone: 'error' as const, message: couponError }
    : couponPreview
      ? { tone: 'success' as const, message: couponPreview.message }
      : null;

  function clearFeedback() {
    setError(null);
    setFieldErrors(undefined);
  }

  function resetWizard() {
    setStepIndex(0);
    setOrderId(null);
    setOrderNo(null);
    setIdea(INITIAL_IDEA);
    setFootage(INITIAL_FOOTAGE);
    setSelectedAddOnIds([]);
    setUseCredits(false);
    setCouponCode('');
    setCouponPreview(null);
    setCouponError(null);
    setIsApplyingCoupon(false);
    setIsSaving(false);
    setHasActiveUploads(false);
    clearFeedback();
    setSubmitted(null);
  }

  function goBack() {
    if (stepIndex === 0) {
      return;
    }

    if (stepIndex === 3) {
      setCouponPreview(null);
      setCouponError(null);
    }

    clearFeedback();
    setStepIndex((current) => Math.max(0, current - 1));
  }

  function toggleAddOn(addOnId: string) {
    setSelectedAddOnIds((current) =>
      current.includes(addOnId)
        ? current.filter((id) => id !== addOnId)
        : [...current, addOnId]
    );
  }

  function handleCouponCodeChange(value: string) {
    setCouponCode(value);
    setCouponPreview(null);
    setCouponError(null);
  }

  async function handleApplyCoupon() {
    if (isApplyingCoupon) {
      return;
    }

    if (!orderId) {
      setCouponError('Save your order before applying a coupon.');
      return;
    }

    if (!couponCode.trim()) {
      setCouponError('Enter a coupon code first.');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponPreview(null);
    setCouponError(null);

    try {
      const result = await previewCoupon({
        workspaceId: workspace.id,
        orderId,
        code: couponCode,
      });

      if (result.ok) {
        setCouponPreview(result.preview);
      } else {
        setCouponError(result.message);
      }
    } catch {
      setCouponError('We could not check that code. Try again.');
    } finally {
      setIsApplyingCoupon(false);
    }
  }

  async function handleContinue() {
    if (isSaving) {
      return;
    }

    if (stepIndex === 1 && hasActiveUploads) {
      setError('Wait for every footage upload to finish before continuing.');
      return;
    }

    clearFeedback();
    setIsSaving(true);

    try {
      if (stepIndex === 0) {
        const result = await saveIdeaStep({
          workspaceId: workspace.id,
          orderId,
          kind: idea.kind,
          title: idea.title,
          brief: idea.brief,
          referenceLinks: idea.referenceLinks,
        });

        if (!result.ok) {
          setError(result.message);
          setFieldErrors(result.fieldErrors);
          return;
        }

        setOrderId(result.orderId);
        setOrderNo(result.orderNo);
        setStepIndex(1);
        return;
      }

      if (!orderId) {
        setError('Your draft is missing. Start again from the first step.');
        return;
      }

      if (stepIndex === 1) {
        const result = await saveFootageStep({
          workspaceId: workspace.id,
          orderId,
          cloudLink: footage.cloudLink,
          rawFootageMinutes: optionalNumber(footage.rawFootageMinutes),
          footageSizeGb: optionalNumber(footage.footageSizeGb),
        });

        if (!result.ok) {
          setError(result.message);
          setFieldErrors(result.fieldErrors);
          return;
        }

        setOrderNo(result.orderNo);
        setStepIndex(2);
        return;
      }

      if (stepIndex === 2) {
        const result = await saveStyleStep({
          workspaceId: workspace.id,
          orderId,
          addOnIds: selectedAddOnIds,
        });

        if (!result.ok) {
          setError(result.message);
          setFieldErrors(result.fieldErrors);
          return;
        }

        setOrderNo(result.orderNo);
        setStepIndex(3);
        return;
      }

      const result = await submitOrder({
        workspaceId: workspace.id,
        orderId,
        addOnIds: selectedAddOnIds,
        useCredits,
        couponCode,
      });

      if (!result.ok) {
        setError(result.message);
        setFieldErrors(result.fieldErrors);

        if (result.fieldErrors?.couponCode?.[0]) {
          setCouponError(result.fieldErrors.couponCode[0]);
          setCouponPreview(null);
        }

        return;
      }

      setSubmitted({
        orderId: result.orderId,
        orderNo: result.orderNo,
        total: result.quote?.total ?? quote.total,
      });
    } catch {
      setError(
        'Something went wrong while saving your order. Your progress is still here — try again.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-soft">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
          Submitted
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-ink">
          {submitted.orderNo
            ? `Order #${submitted.orderNo} is in the queue`
            : 'Your order is in the queue'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          We will match this brief with an editor in {workspace.name} and follow
          up if anything needs clarification. You can track progress from your
          dashboard.
        </p>
        {submitted.total !== null ? (
          <p className="mt-4 text-sm text-slate-500">
            Estimated total:{' '}
            <span className="font-semibold text-brand-ink">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: submitted.total % 1 === 0 ? 0 : 2,
                maximumFractionDigits: 2,
              }).format(submitted.total)}
            </span>
          </p>
        ) : null}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/app"
            className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-5 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
          >
            Back to dashboard
          </Link>
          <Button
            variant="outline"
            onClick={resetWizard}
            className="h-11"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Create another order
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Stepper steps={STEPS} currentStep={stepIndex} />
          {orderNo ? (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              <FileCheck2 aria-hidden="true" className="h-3.5 w-3.5" />
              Draft #{orderNo} saved
            </span>
          ) : (
            <span className="text-[11px] font-medium text-slate-400">
              Progress saves as a draft at every step
            </span>
          )}
        </div>
      </div>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void handleContinue();
        }}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-8"
      >
        <div key={stepIndex} className="animate-fade-up">
          {stepIndex === 0 ? (
            <StepIdea
              values={idea}
              errors={fieldErrors}
              onChange={(patch) =>
                setIdea((current) => ({ ...current, ...patch }))
              }
            />
          ) : null}

          {stepIndex === 1 ? (
            <StepFootage
              workspaceId={workspace.id}
              orderId={orderId}
              values={footage}
              errors={fieldErrors}
              onChange={(patch) =>
                setFootage((current) => ({ ...current, ...patch }))
              }
              onUploadingChange={setHasActiveUploads}
            />
          ) : null}

          {stepIndex === 2 ? (
            <StepStyle
              workspaceName={workspace.name}
              workspaceNotes={workspace.notes}
              addOns={addOns}
              selectedAddOnIds={selectedAddOnIds}
              onToggleAddOn={toggleAddOn}
            />
          ) : null}

          {stepIndex === 3 ? (
            <StepReview
              idea={idea}
              footage={footage}
              workspaceName={workspace.name}
              selectedAddOns={selectedAddOns}
              basePackageName={basePackage?.name ?? null}
              quote={quote}
              creditBalance={creditBalance}
              useCredits={useCredits}
              onUseCreditsChange={setUseCredits}
              couponCode={couponCode}
              onCouponCodeChange={handleCouponCodeChange}
              onApplyCoupon={() => void handleApplyCoupon()}
              isApplyingCoupon={isApplyingCoupon}
              couponFeedback={couponFeedback}
            />
          ) : null}
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700"
          >
            {error}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-400">
            {stepIndex === 1 && hasActiveUploads
              ? 'Keep this step open until every file finishes uploading.'
              : stepIndex === 3
                ? 'Submitting locks in your current brief and extras for the team.'
                : 'You can move back at any time before the final submission.'}
          </p>
          <div className={cn('flex gap-3', stepIndex === 0 && 'sm:ml-auto')}>
            {stepIndex > 0 ? (
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={
                  isSaving || (stepIndex === 1 && hasActiveUploads)
                }
              >
                Back
              </Button>
            ) : null}
            <Button
              type="submit"
              isLoading={isSaving}
              disabled={
                isApplyingCoupon ||
                (stepIndex === 1 && hasActiveUploads)
              }
              className="min-w-[132px]"
            >
              {stepIndex === 3 ? 'Submit order' : 'Continue'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
