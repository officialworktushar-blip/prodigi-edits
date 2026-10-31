export const CHECKLIST_ITEMS = [
  'Content plan shared',
  'Videos edited and delivered',
  'Thumbnails delivered',
  'Monthly report sent',
] as const;

export type ChecklistItem = (typeof CHECKLIST_ITEMS)[number];

export function currentMonthKey(date = new Date()): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function addMonths(date: Date, months: number): Date {
  const next = new Date(date.getTime());
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}
