'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  id: string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error('Tabs components must be used inside <Tabs>.');
  }

  return context;
}

function getTabId(baseId: string, value: string) {
  return `${baseId}-tab-${value.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

function getPanelId(baseId: string, value: string) {
  return `${baseId}-panel-${value.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({
  value,
  defaultValue = '',
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const id = React.useId();
  const currentValue = value ?? internalValue;

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [onValueChange, value]
  );

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue, id }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-slate-100 p-1',
        className
      )}
      {...props}
    />
  )
);

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  TabsTriggerProps
>(({ className, value, disabled, onClick, onKeyDown, children, ...props }, ref) => {
  const { value: selectedValue, setValue, id } = useTabsContext();
  const isActive = selectedValue === value;

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    onKeyDown?.(event);

    if (
      event.defaultPrevented ||
      !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
    ) {
      return;
    }

    const tabs = Array.from(
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not([disabled])'
      ) ?? []
    );

    if (tabs.length === 0) {
      return;
    }

    event.preventDefault();

    const currentIndex = tabs.indexOf(event.currentTarget);
    let nextIndex = currentIndex;

    if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1;
    } else if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    }

    const nextTab = tabs[nextIndex];
    const nextValue = nextTab?.dataset.value;

    if (nextTab && nextValue) {
      nextTab.focus();
      setValue(nextValue);
    }
  }

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={getTabId(id, value)}
      aria-selected={isActive}
      aria-controls={getPanelId(id, value)}
      tabIndex={isActive ? 0 : -1}
      data-value={value}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          setValue(value);
        }
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-white text-brand-ink shadow-soft'
          : 'text-slate-500 hover:text-slate-800',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const { value: selectedValue, id } = useTabsContext();

    if (selectedValue !== value) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={getPanelId(id, value)}
        aria-labelledby={getTabId(id, value)}
        className={cn('mt-4 outline-none', className)}
        {...props}
      />
    );
  }
);

TabsContent.displayName = 'TabsContent';
