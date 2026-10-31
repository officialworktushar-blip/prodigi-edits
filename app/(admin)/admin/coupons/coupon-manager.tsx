'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { Coupon } from '@/types/db';
import { deleteCoupon, saveCoupon } from './actions';

export interface CouponManagerProps {
  coupons: Coupon[];
}

interface CouponDraft {
  id?: string;
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: string;
  expiresOn: string;
  usageLimit: string;
}

const EMPTY_DRAFT: CouponDraft = {
  code: '',
  type: 'PERCENT',
  value: '',
  expiresOn: '',
  usageLimit: '',
};

function toDateInput(iso: string | null): string {
  if (!iso) {
    return '';
  }

  const date = new Date(iso);

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

export function CouponManager({ coupons }: CouponManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useState<CouponDraft | null>(null);
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!draft) {
      return;
    }

    const current = draft;
    const value = Number(current.value);
    const limit = current.usageLimit.trim() ? Number(current.usageLimit) : null;
    const expiresAt = current.expiresOn
      ? new Date(`${current.expiresOn}T23:59:59`).toISOString()
      : null;

    setError(null);
    startTransition(async () => {
      const result = await saveCoupon({
        id: current.id,
        code: current.code,
        type: current.type,
        value,
        expiresAt,
        usageLimit: limit,
      });

      if (result.success) {
        setDraft(null);
        router.refresh();
      } else {
        setError(result.error ?? 'Could not save the coupon.');
      }
    });
  }

  function remove(coupon: Coupon) {
    if (!window.confirm(`Delete coupon ${coupon.code}?`)) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await deleteCoupon({ id: coupon.id });

      if (result.success) {
        router.refresh();
      } else {
        setError(result.error ?? 'Could not delete the coupon.');
      }
    });
  }

  const now = Date.now();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {coupons.length} coupon{coupons.length === 1 ? '' : 's'}
        </p>
        <Button
          size="sm"
          onClick={() => {
            setError(null);
            setDraft(EMPTY_DRAFT);
          }}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New coupon
        </Button>
      </div>

      {error && !draft ? (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <Card className="overflow-hidden">
        <CardContent className="overflow-x-auto p-0">
          {coupons.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">No coupons yet.</p>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Code</th>
                  <th className="px-4 py-3 font-semibold">Discount</th>
                  <th className="px-4 py-3 font-semibold">Used</th>
                  <th className="px-4 py-3 font-semibold">Expires</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((coupon) => {
                  const expired =
                    coupon.expires_at !== null && new Date(coupon.expires_at).getTime() < now;
                  const exhausted =
                    coupon.usage_limit !== null && coupon.used >= coupon.usage_limit;
                  const isPercent = (coupon.type ?? '').toUpperCase().includes('PERCENT');

                  return (
                    <tr key={coupon.id}>
                      <td className="px-4 py-3 font-mono font-semibold text-brand-ink">
                        {coupon.code}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {isPercent ? `${Number(coupon.value)}%` : `$${Number(coupon.value).toFixed(2)}`}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {coupon.used}
                        {coupon.usage_limit !== null ? ` / ${coupon.usage_limit}` : ''}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-4 py-3">
                        {expired ? (
                          <Badge variant="danger">Expired</Badge>
                        ) : exhausted ? (
                          <Badge variant="warning">Used up</Badge>
                        ) : (
                          <Badge variant="success">Active</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setError(null);
                              setDraft({
                                id: coupon.id,
                                code: coupon.code,
                                type: (coupon.type ?? '').toUpperCase().includes('PERCENT')
                                  ? 'PERCENT'
                                  : 'FIXED',
                                value: String(coupon.value),
                                expiresOn: toDateInput(coupon.expires_at),
                                usageLimit: coupon.usage_limit === null ? '' : String(coupon.usage_limit),
                              });
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            disabled={isPending}
                            onClick={() => remove(coupon)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={draft !== null}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setDraft(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{draft?.id ? 'Edit coupon' : 'New coupon'}</DialogTitle>
          </DialogHeader>
          {draft ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="coupon-code" className="text-sm font-medium text-slate-700">
                  Code
                </label>
                <Input
                  id="coupon-code"
                  value={draft.code}
                  onChange={(event) => setDraft({ ...draft, code: event.target.value.toUpperCase() })}
                  placeholder="WELCOME10"
                  className="mt-1 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="coupon-type" className="text-sm font-medium text-slate-700">
                    Type
                  </label>
                  <Select
                    id="coupon-type"
                    value={draft.type}
                    onChange={(event) =>
                      setDraft({ ...draft, type: event.target.value as 'PERCENT' | 'FIXED' })
                    }
                    className="mt-1"
                  >
                    <option value="PERCENT">Percent off</option>
                    <option value="FIXED">Fixed amount ($)</option>
                  </Select>
                </div>
                <div>
                  <label htmlFor="coupon-value" className="text-sm font-medium text-slate-700">
                    {draft.type === 'PERCENT' ? 'Percent' : 'Amount ($)'}
                  </label>
                  <Input
                    id="coupon-value"
                    type="number"
                    min={0}
                    step="0.01"
                    value={draft.value}
                    onChange={(event) => setDraft({ ...draft, value: event.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="coupon-expiry" className="text-sm font-medium text-slate-700">
                    Expires on (optional)
                  </label>
                  <Input
                    id="coupon-expiry"
                    type="date"
                    value={draft.expiresOn}
                    onChange={(event) => setDraft({ ...draft, expiresOn: event.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="coupon-limit" className="text-sm font-medium text-slate-700">
                    Usage limit (optional)
                  </label>
                  <Input
                    id="coupon-limit"
                    type="number"
                    min={1}
                    step={1}
                    value={draft.usageLimit}
                    onChange={(event) => setDraft({ ...draft, usageLimit: event.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              {error ? (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              ) : null}
              <DialogFooter>
                <Button variant="outline" onClick={() => setDraft(null)}>
                  Cancel
                </Button>
                <Button onClick={submit} isLoading={isPending}>
                  Save
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
