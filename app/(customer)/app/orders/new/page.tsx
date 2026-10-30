import Link from 'next/link';
import { cookies } from 'next/headers';
import {
  ArrowLeft,
  FolderPlus,
  Layers,
} from 'lucide-react';
import { OrderWizard } from '@/components/customer/wizard/order-wizard';
import type {
  WizardAddOn,
  WizardCredit,
  WizardPackage,
} from '@/components/customer/wizard/types';
import {
  ACTIVE_WORKSPACE_COOKIE,
  resolveActiveWorkspace,
} from '@/lib/customer/workspace';
import {
  getCustomerCredits,
  getCustomerWorkspaces,
} from '@/lib/data/customer';
import { requireUser } from '@/lib/guards';
import { createClient } from '@/lib/supabase/server';
import type { AddOn, Package } from '@/types/db';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'New order',
  description: 'Brief a new video edit and send it to the production queue.',
};

function numberValue(value: number | string | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function getCatalog(): Promise<{
  addOns: WizardAddOn[];
  packages: WizardPackage[];
}> {
  try {
    const supabase = createClient();
    const [addOnResult, packageResult] = await Promise.all([
      supabase
        .from('add_ons')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true }),
      supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('price_per_video', { ascending: true }),
    ]);

    const addOns = ((addOnResult.data as AddOn[] | null) ?? []).map(
      (addOn) => ({
        id: addOn.id,
        name: addOn.name,
        price: numberValue(addOn.price),
      })
    );

    const packages = ((packageResult.data as Package[] | null) ?? []).map(
      (item) => ({
        id: item.id,
        name: item.name,
        kind: item.kind,
        videoCount: numberValue(item.video_count),
        pricePerVideo: numberValue(item.price_per_video),
        discountPercent: numberValue(item.discount_percent),
      })
    );

    return { addOns, packages };
  } catch {
    return { addOns: [], packages: [] };
  }
}

export default async function NewOrderPage() {
  const { user } = await requireUser();

  const [workspaces, credits, catalog] = await Promise.all([
    getCustomerWorkspaces(),
    getCustomerCredits(user.id),
    getCatalog(),
  ]);

  const requestedWorkspaceId =
    cookies().get(ACTIVE_WORKSPACE_COOKIE)?.value ?? null;
  const activeWorkspace = resolveActiveWorkspace(
    workspaces,
    requestedWorkspaceId
  );

  const wizardCredits: WizardCredit[] = credits
    .map((credit) => ({
      kind: credit.kind,
      balance: numberValue(credit.balance),
    }))
    .filter((credit) => credit.balance > 0);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to dashboard
        </Link>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
              New order
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
              Brief your next edit
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Four short steps: the idea, the footage, the finish, then a final
              check. Your draft saves as you move forward.
            </p>
          </div>
        </div>
      </div>

      {activeWorkspace ? (
        <OrderWizard
          workspace={{
            id: activeWorkspace.id,
            name: activeWorkspace.name,
            notes: activeWorkspace.notes,
          }}
          addOns={catalog.addOns}
          packages={catalog.packages}
          credits={wizardCredits}
        />
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-soft sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <FolderPlus aria-hidden="true" className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-xl font-bold tracking-tight text-brand-ink">
            A workspace is needed first
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Orders live inside a workspace so your team, files, and billing stay
            together. Create or join a workspace, then come back to this page.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/app/workspaces"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-5 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              <Layers aria-hidden="true" className="h-4 w-4" />
              Manage workspaces
            </Link>
            <Link
              href="/app"
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
