export function formatMoney(value: number): string {
  const safeValue = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: safeValue % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(safeValue);
}

export function optionalNumber(value: string): number | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function fieldError(
  errors: Record<string, string[]> | undefined,
  field: string
): string | undefined {
  return errors?.[field]?.[0];
}
