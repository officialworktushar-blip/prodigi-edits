/**
 * Project configuration constants.
 *
 * The brand name "CutCrew" is defined here and nowhere else in the codebase.
 */

// Brand identity
export const BRAND_NAME = 'CutCrew';
export const BRAND_TAGLINE = 'Professional video editing, simplified';
export const SUPPORT_EMAIL = 'support@cutcrew.com';

// Currency
export const CURRENCY = 'USD' as const;

// Supported currencies mapping to symbols for display
export const CURRENCY_SYMBOLS = {
  USD: '$',
} as const;

// Turnaround times in hours
export const TURNAROUND_HOURS = {
  long: 48,   // 48-hour turnaround
  short: 24,  // 24-hour turnaround
} as const;

// Storage limits included in all orders
export const INCLUDED_STORAGE = {
  DURATION_MINUTES: 60, // minutes of footage
  SIZE_GB: 20,          // gigabytes
} as const;

// Add-on prices in cents (USD)
export const ADDON_PRICES_CENTS = {
  thumbnail: 4300, // $43.00 USD
  vertical: 4300,  // $43.00 USD
} as const;

// Add-on labels for display
export const ADDON_LABELS = {
  thumbnail: 'Thumbnail / Cover Art',
  vertical: 'Vertical (9:16) Reformat',
} as const;

// Order status enum matching the order flow
export const ORDER_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  IN_REVIEW: 'IN_REVIEW',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
  APPROVED: 'APPROVED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// Role enum for users
export const USER_ROLE = {
  CUSTOMER: 'CUSTOMER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

// Helper: format cents to currency string
export function formatPrice(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: dollars % 1 === 0 ? 0 : 2,
  }).format(dollars);
}
