'use client';

import {
  Check,
  Plus,
  Sparkles,
  StickyNote,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMoney } from './format';
import type { WizardAddOn } from './types';

export interface StepStyleProps {
  workspaceName: string;
  workspaceNotes: string | null;
  addOns: WizardAddOn[];
  selectedAddOnIds: string[];
  onToggleAddOn: (addOnId: string) => void;
}

export function StepStyle({
  workspaceName,
  workspaceNotes,
  addOns,
  selectedAddOnIds,
  onToggleAddOn,
}: StepStyleProps) {
  const selectedAddOns = addOns.filter((addOn) =>
    selectedAddOnIds.includes(addOn.id)
  );
  const selectedTotal = selectedAddOns.reduce(
    (total, addOn) => total + addOn.price,
    0
  );
  const notes = workspaceNotes?.trim();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-brand-ink sm:text-2xl">
          Match the house style
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Your editor sees the workspace notes below. Add any finishing touches
          that belong with this order.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
          <StickyNote
            aria-hidden="true"
            className="h-4 w-4 text-indigo-600"
          />
          <div>
            <h3 className="text-sm font-semibold text-brand-ink">
              Workspace notes preview
            </h3>
            <p className="text-xs text-slate-500">{workspaceName}</p>
          </div>
        </div>
        <div className="bg-brand-surface px-5 py-5">
          {notes ? (
            <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
              {notes}
            </p>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4">
              <p className="text-sm font-medium text-slate-600">
                No standing workspace notes yet
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Brand voice, fonts, colours, and recurring instructions can live
                in your workspace so every editor starts from the same brief.
              </p>
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-brand-ink">
              Add-ons for this order
            </h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Pick only what this project needs. You can change extras before
              submitting.
            </p>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            {selectedAddOns.length === 0
              ? 'No extras selected'
              : `${selectedAddOns.length} selected · ${formatMoney(selectedTotal)}`}
          </p>
        </div>

        {addOns.length === 0 ? (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Sparkles aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-ink">
                No add-ons are available right now
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                You can continue with the base edit. Your producer can add extras
                later if the scope changes.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {addOns.map((addOn) => {
              const isSelected = selectedAddOnIds.includes(addOn.id);

              return (
                <button
                  key={addOn.id}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => onToggleAddOn(addOn.id)}
                  className={cn(
                    'flex items-start gap-3 rounded-2xl border p-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2',
                    isSelected
                      ? 'border-brand-indigo bg-indigo-50/70 shadow-soft'
                      : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft'
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors',
                      isSelected
                        ? 'border-brand-indigo bg-brand-indigo text-white'
                        : 'border-slate-300 bg-white text-transparent'
                    )}
                  >
                    {isSelected ? (
                      <Check aria-hidden="true" className="h-3.5 w-3.5" />
                    ) : (
                      <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold text-brand-ink">
                        {addOn.name}
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-slate-600">
                        +{formatMoney(addOn.price)}
                      </span>
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Added to this order and visible in the final review.
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
