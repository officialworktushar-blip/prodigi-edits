'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { CHECKLIST_ITEMS } from '@/lib/admin/checklist';
import {
  createSubscription,
  renewSubscription,
  setSubscriptionStatus,
  toggleChecklistItem,
} from './actions';

export interface SubscriptionView {
  id: string;
  plan: 'STARTER' | 'PRO';
  billing: 'QUARTERLY' | 'ANNUAL';
  status: string;
  currentPeriodEnd: string | null;
  name: string | null;
  email: string | null;
  done: string[];
}

export interface SubscriptionsManagerProps {
  subscriptions: SubscriptionView[];
  month: string;
  checklistAvailable: boolean;
}

type Task = () => Promise<{ success: boolean; error?: string }>;

export function SubscriptionsManager({
  subscriptions,
  month,
  checklistAvailable,
}: SubscriptionsManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<'STARTER' | 'PRO'>('STARTER');
  const [billing, setBilling] = useState<'QUARTERLY' | 'ANNUAL'>('QUARTERLY');
  const [message, setMessage] = useState<string | null>(null);

  function run(task: Task, onDone?: () => void) {
    setMessage(null);
    startTransition(async () => {
      const result = await task();

      if (result.success) {
        onDone?.();
        router.refresh();
      } else {
        setMessage(result.error ?? 'Something went wrong.');
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add a subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-[1fr_140px_150px_auto] sm:items-end">
            <div>
              <label htmlFor="sub-email" className="text-sm font-medium text-slate-700">
                Customer email
              </label>
              <Input
                id="sub-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="sub-plan" className="text-sm font-medium text-slate-700">
                Plan
              </label>
              <Select
                id="sub-plan"
                value={plan}
                onChange={(event) => setPlan(event.target.value as 'STARTER' | 'PRO')}
                className="mt-1"
              >
                <option value="STARTER">Starter</option>
                <option value="PRO">Pro</option>
              </Select>
            </div>
            <div>
              <label htmlFor="sub-billing" className="text-sm font-medium text-slate-700">
                Billing
              </label>
              <Select
                id="sub-billing"
                value={billing}
                onChange={(event) => setBilling(event.target.value as 'QUARTERLY' | 'ANNUAL')}
                className="mt-1"
              >
                <option value="QUARTERLY">Quarterly</option>
                <option value="ANNUAL">Annual</option>
              </Select>
            </div>
            <Button
              isLoading={isPending}
              disabled={!email.trim()}
              onClick={() =>
                run(
                  () => createSubscription({ email, plan, billing }),
                  () => setEmail('')
                )
              }
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {message ? (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {message}
        </p>
      ) : null}

      {!checklistAvailable ? (
        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          The monthly checklist needs a table that is not created yet. Run
          supabase/admin_extras.sql in the Supabase SQL Editor.
        </p>
      ) : null}

      {subscriptions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-slate-500">
            No subscriptions yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {subscriptions.map((subscription) => {
            const completed = CHECKLIST_ITEMS.filter((item) =>
              subscription.done.includes(item)
            ).length;

            return (
              <Card key={subscription.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="truncate">
                        {subscription.name || subscription.email || 'Unknown customer'}
                      </CardTitle>
                      <p className="truncate text-xs text-slate-500">{subscription.email}</p>
                    </div>
                    <Badge variant={subscription.status === 'ACTIVE' ? 'success' : 'outline'}>
                      {subscription.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <span className="font-semibold text-brand-ink">
                      {subscription.plan === 'PRO' ? 'Pro' : 'Starter'} ·{' '}
                      {subscription.billing.toLowerCase()}
                    </span>
                    <span>
                      Renews{' '}
                      {subscription.currentPeriodEnd
                        ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                        : 'not set'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      aria-label="Subscription status"
                      value={subscription.status}
                      disabled={isPending}
                      onChange={(event) =>
                        run(() =>
                          setSubscriptionStatus({
                            id: subscription.id,
                            status: event.target.value as 'ACTIVE' | 'PAUSED' | 'CANCELLED',
                          })
                        )
                      }
                      className="h-9 w-36"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="PAUSED">Paused</option>
                      <option value="CANCELLED">Cancelled</option>
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => run(() => renewSubscription({ id: subscription.id }))}
                    >
                      Renew period
                    </Button>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Checklist for {month} ({completed}/{CHECKLIST_ITEMS.length})
                    </p>
                    <ul className="mt-2 space-y-2">
                      {CHECKLIST_ITEMS.map((item) => (
                        <li key={item}>
                          <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input
                              type="checkbox"
                              checked={subscription.done.includes(item)}
                              disabled={isPending || !checklistAvailable}
                              onChange={(event) =>
                                run(() =>
                                  toggleChecklistItem({
                                    subscriptionId: subscription.id,
                                    month,
                                    item,
                                    done: event.target.checked,
                                  })
                                )
                              }
                              className="h-4 w-4 rounded border-slate-300"
                            />
                            {item}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
