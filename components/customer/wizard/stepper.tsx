import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepperStep {
  title: string;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  const safeStep = Math.min(Math.max(currentStep, 0), steps.length - 1);
  const progress = ((safeStep + 1) / steps.length) * 100;

  return (
    <div>
      <div className="sm:hidden">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Step {safeStep + 1} of {steps.length}
          </p>
          <p className="text-sm font-semibold text-brand-ink">
            {steps[safeStep]?.title}
          </p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ol className="hidden gap-3 sm:grid sm:grid-cols-4">
        {steps.map((step, index) => {
          const isComplete = index < safeStep;
          const isCurrent = index === safeStep;

          return (
            <li key={step.title} className="relative flex flex-col gap-2">
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute left-11 right-0 top-5 h-px',
                    index < safeStep ? 'bg-indigo-300' : 'bg-slate-200'
                  )}
                />
              ) : null}
              <span
                aria-current={isCurrent ? 'step' : undefined}
                className={cn(
                  'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition-colors',
                  isComplete &&
                    'border-brand-indigo bg-brand-indigo text-white',
                  isCurrent &&
                    'border-brand-indigo bg-white text-indigo-700 ring-4 ring-indigo-50',
                  !isComplete &&
                    !isCurrent &&
                    'border-slate-200 bg-white text-slate-400'
                )}
              >
                {isComplete ? (
                  <Check aria-hidden="true" className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  'text-sm font-medium',
                  isCurrent ? 'text-brand-ink' : 'text-slate-500'
                )}
              >
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
