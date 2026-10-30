'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireUser } from '@/lib/guards';
import { purchasePackageWithCredits } from '@/lib/payments';
import type { OrderKind } from '@/types/db';

const purchaseSchema = z.object({
  packageId: z.string().uuid('Choose a valid package.'),
});

export interface PurchaseActionResult {
  ok: boolean;
  message: string;
  orderKind?: OrderKind;
  creditsAdded?: number;
  balance?: number;
}

export async function purchasePackage(input: {
  packageId: string;
}): Promise<PurchaseActionResult> {
  const { user } = await requireUser();
  const parsed = purchaseSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message:
        parsed.error.issues[0]?.message ?? 'Choose a valid package.',
    };
  }

  const result = await purchasePackageWithCredits({
    userId: user.id,
    packageId: parsed.data.packageId,
  });

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
    };
  }

  revalidatePath('/app/billing');
  return {
    ok: true,
    message: `${result.creditsAdded} credits added to your account.`,
    orderKind: result.orderKind,
    creditsAdded: result.creditsAdded,
    balance: result.balance,
  };
}
