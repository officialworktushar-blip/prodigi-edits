'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { OrderKind } from '@/types/db';
import { adjustCredits } from '../actions';

const KINDS: OrderKind[] = ['HORIZONTAL', 'VERTICAL', 'THUMBNAIL'];

export interface CreditAdjustFormProps {
  userId: string;
  balances: Record<OrderKind, number>;
}

export function CreditAdjustForm({ userId, balances }: CreditAdjustFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [kind, setKind] = useState<OrderKind>('HORIZONTAL');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  function handleSubmit() {
    const delta = Number.parseInt(amount, 10);

    if (!Number.isFinite(delta)) {
      setFeedback({ ok: false, text: 'Enter a whole number, like 5 or -2.' });
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      const result = await adjustCredits({ userId, kind, delta, reason });

      if (result.success) {
        setFeedback({
          ok: true,
          text: `Done. New ${kind.toLowerCase()} balance: ${result.balance ?? 0}.`,
        });
        setAmount('');
        setReason('');
        router.refresh();
      } else {
        setFeedback({ ok: false, text: result.error ?? 'Could not adjust credits.' });
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {KINDS.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-slate-100 bg-slate-50/60 p-3"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {item.toLowerCase()}
            </p>
            <p className="mt-1 text-2xl font-bold text-brand-ink">{balances[item]}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-[160px_120px_1fr]">
        <div>
          <label htmlFor="credit-kind" className="text-sm font-medium text-slate-700">
            Type
          </label>
          <Select
            id="credit-kind"
            value={kind}
            onChange={(event) => setKind(event.target.value as OrderKind)}
            className="mt-1"
          >
            {KINDS.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0) + item.slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="credit-amount" className="text-sm font-medium text-slate-700">
            Change
          </label>
          <Input
            id="credit-amount"
            type="number"
            step={1}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="+5 or -2"
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="credit-reason" className="text-sm font-medium text-slate-700">
            Reason (required)
          </label>
          <Input
            id="credit-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="e.g. Goodwill credit for a late delivery"
            maxLength={300}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleSubmit} isLoading={isPending} disabled={!amount || reason.trim().length < 3}>
          Apply adjustment
        </Button>
        {feedback ? (
          <p
            role="status"
            className={feedback.ok ? 'text-sm text-emerald-600' : 'text-sm text-red-600'}
          >
            {feedback.text}
          </p>
        ) : null}
      </div>
    </div>
  );
}
