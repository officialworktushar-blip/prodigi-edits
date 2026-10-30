export type AdminRole = 'ADMIN' | 'EDITOR';

export interface AdminNavItem {
  label: string;
  href: string;
  icon: string;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: 'Overview', href: '/admin', icon: 'overview' },
  { label: 'Orders', href: '/admin/orders', icon: 'orders' },
  { label: 'Customers', href: '/admin/customers', icon: 'customers' },
  { label: 'Team', href: '/admin/team', icon: 'team' },
  { label: 'Messages', href: '/admin/messages', icon: 'messages' },
  { label: 'Pricing', href: '/admin/pricing', icon: 'pricing' },
  { label: 'Coupons', href: '/admin/coupons', icon: 'coupons' },
  {
    label: 'Subscriptions',
    href: '/admin/subscriptions',
    icon: 'subscriptions',
  },
  { label: 'Finance', href: '/admin/finance', icon: 'finance' },
  { label: 'Content', href: '/admin/content', icon: 'content' },
  { label: 'Settings', href: '/admin/settings', icon: 'settings' },
  { label: 'Audit log', href: '/admin/audit-log', icon: 'audit' },
];

export function getAdminNavItems(role: AdminRole): AdminNavItem[] {
  if (role === 'EDITOR') {
    return ADMIN_NAV_ITEMS.filter((item) => item.href === '/admin/orders');
  }

  return [...ADMIN_NAV_ITEMS];
}
