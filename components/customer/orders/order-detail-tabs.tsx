import Link from 'next/link';
import {
  Activity,
  Download,
  FolderOpen,
  LayoutDashboard,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type OrderDetailTab =
  | 'overview'
  | 'footage'
  | 'review'
  | 'deliverables'
  | 'activity';

interface TabDefinition {
  value: OrderDetailTab;
  label: string;
  icon: LucideIcon;
}

const TABS: TabDefinition[] = [
  { value: 'overview', label: 'Overview', icon: LayoutDashboard },
  { value: 'footage', label: 'Footage', icon: FolderOpen },
  {
    value: 'review',
    label: 'Drafts & Review',
    icon: MessageSquare,
  },
  {
    value: 'deliverables',
    label: 'Deliverables',
    icon: Download,
  },
  { value: 'activity', label: 'Activity', icon: Activity },
];

export function isOrderDetailTab(
  value: string
): value is OrderDetailTab {
  return TABS.some((tab) => tab.value === value);
}

function tabHref(orderId: string, tab: OrderDetailTab): string {
  if (tab === 'overview') {
    return `/app/orders/${orderId}`;
  }

  return `/app/orders/${orderId}?tab=${tab}`;
}

export interface OrderDetailTabsProps {
  orderId: string;
  activeTab: OrderDetailTab;
}

export function OrderDetailTabs({
  orderId,
  activeTab,
}: OrderDetailTabsProps) {
  return (
    <div className="-mx-1 overflow-x-auto pb-1">
      <nav
        aria-label="Order sections"
        className="flex min-w-max items-center gap-1 rounded-full bg-slate-100 p-1"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.value;

          return (
            <Link
              key={tab.value}
              href={tabHref(orderId, tab.value)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2',
                active
                  ? 'bg-white text-brand-ink shadow-soft'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
