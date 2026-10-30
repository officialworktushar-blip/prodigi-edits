import { createAdminClient } from '@/lib/supabase/admin';
import type { Credit, OrderKind, Package } from '@/types/db';

export interface MockPurchaseSuccess {
  ok: true;
  orderKind: OrderKind;
  creditsAdded: number;
  balance: number;
  package: Package;
}

export interface MockPurchaseFailure {
  ok: false;
  message: string;
}

export type MockPurchaseResult =
  | MockPurchaseSuccess
  | MockPurchaseFailure;

export async function purchasePackageWithCredits(input: {
  userId: string;
  packageId: string;
}): Promise<MockPurchaseResult> {
  const admin = createAdminClient();
  const { data: packageData, error: packageError } = await admin
    .from('packages')
    .select('*')
    .eq('id', input.packageId)
    .eq('is_active', true)
    .maybeSingle();

  if (packageError || !packageData) {
    return {
      ok: false,
      message: 'This package is no longer available.',
    };
  }

  const packageRow = packageData as Package;
  const creditsAdded = Math.max(0, Math.floor(packageRow.video_count));

  if (creditsAdded < 1) {
    return {
      ok: false,
      message: 'This package does not include any credits.',
    };
  }

  const { data: existingData, error: existingError } = await admin
    .from('credits')
    .select('*')
    .eq('user_id', input.userId)
    .eq('kind', packageRow.kind)
    .maybeSingle();

  if (existingError) {
    return {
      ok: false,
      message: 'Could not check your current balance. Try again.',
    };
  }

  const existing = (existingData as Credit | null) ?? null;
  const nextBalance = (existing?.balance ?? 0) + creditsAdded;

  if (existing) {
    const { error: updateError } = await admin
      .from('credits')
      .update({ balance: nextBalance })
      .eq('id', existing.id);

    if (updateError) {
      return {
        ok: false,
        message: 'Could not add credits to your balance. Try again.',
      };
    }
  } else {
    const { error: insertError } = await admin.from('credits').insert({
      user_id: input.userId,
      kind: packageRow.kind,
      balance: nextBalance,
    });

    if (insertError) {
      return {
        ok: false,
        message: 'Could not create your credit balance. Try again.',
      };
    }
  }

  return {
    ok: true,
    orderKind: packageRow.kind,
    creditsAdded,
    balance: nextBalance,
    package: packageRow,
  };
}
