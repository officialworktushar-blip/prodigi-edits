'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireUser, requireWorkspaceAccess } from '@/lib/guards';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type {
  AddOn,
  Coupon,
  Order,
  Package,
} from '@/types/db';
import type {
  CouponPreviewResult,
  WizardActionResult,
  WizardQuote,
} from '@/components/customer/wizard/types';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const workspaceSchema = z.object({
  workspaceId: z.string().uuid('Choose a workspace.'),
});

const couponCodeSchema = z
  .string()
  .trim()
  .max(64, 'Coupon codes are 64 characters or fewer.')
  .refine(
    (value) => value === '' || /^[a-z0-9_-]+$/i.test(value),
    'Use letters, numbers, hyphens, or underscores only.'
  );

const ideaSchema = workspaceSchema.extend({
  orderId: z.string().uuid().nullish(),
  kind: z.enum(['HORIZONTAL', 'VERTICAL', 'THUMBNAIL']),
  title: z
    .string()
    .trim()
    .min(3, 'Give your order a title of at least 3 characters.')
    .max(140, 'Keep the title under 140 characters.'),
  brief: z
    .string()
    .trim()
    .min(20, 'Add at least 20 characters so the editor understands the goal.')
    .max(5000, 'Keep the brief under 5,000 characters.'),
  referenceLinks: z
    .string()
    .trim()
    .max(2000, 'Keep reference links under 2,000 characters.')
    .optional()
    .default(''),
});

const footageSchema = workspaceSchema.extend({
  orderId: z.string().uuid('Save the idea step first.'),
  cloudLink: z
    .string()
    .trim()
    .max(2000, 'Keep the cloud link under 2,000 characters.')
    .refine(
      (value) => value === '' || /^https?:\/\/\S+$/i.test(value),
      'Enter a complete link starting with http:// or https://.'
    )
    .optional()
    .default(''),
  rawFootageMinutes: z
    .number()
    .finite()
    .min(0, 'Footage minutes cannot be negative.')
    .max(100000, 'That footage estimate is too large.')
    .nullable(),
  footageSizeGb: z
    .number()
    .finite()
    .min(0, 'Footage size cannot be negative.')
    .max(100000, 'That footage size is too large.')
    .nullable(),
});

const styleSchema = workspaceSchema.extend({
  orderId: z.string().uuid('Save the idea step first.'),
  addOnIds: z.array(z.string().uuid()).max(20).default([]),
});

const reviewSchema = workspaceSchema.extend({
  orderId: z.string().uuid('Save the idea step first.'),
  addOnIds: z.array(z.string().uuid()).max(20).default([]),
  useCredits: z.boolean().default(false),
  couponCode: couponCodeSchema.optional().default(''),
});

const couponSchema = workspaceSchema.extend({
  orderId: z.string().uuid('Save the idea step first.'),
  code: z
    .string()
    .trim()
    .min(2, 'Enter a coupon code.')
    .max(64, 'Coupon codes are 64 characters or fewer.')
    .regex(
      /^[a-z0-9_-]+$/i,
      'Use letters, numbers, hyphens, or underscores only.'
    ),
});

function failure(
  message: string,
  fieldErrors?: Record<string, string[]>
): WizardActionResult {
  return { ok: false, message, fieldErrors };
}

function zodFields(error: z.ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path ?? [];
    const key = path.length > 0 ? String(path[0]) : 'form';

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(issue.message);
  }

  return result;
}

function readWorkspaceId(input: unknown): string {
  if (
    typeof input === 'object' &&
    input !== null &&
    'workspaceId' in input
  ) {
    return String(
      (input as { workspaceId?: unknown }).workspaceId ?? ''
    ).trim();
  }

  return '';
}

async function authorizeAction(
  input: unknown
): Promise<
  | { ok: true; userId: string; workspaceId: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> }
> {
  const { user } = await requireUser();
  const workspaceId = readWorkspaceId(input);

  if (!UUID_PATTERN.test(workspaceId)) {
    return {
      ok: false,
      message: 'Choose a valid workspace before continuing.',
      fieldErrors: { workspaceId: ['Choose a workspace.'] },
    };
  }

  await requireWorkspaceAccess(workspaceId);

  return { ok: true, userId: user.id, workspaceId };
}

function numberValue(value: number | string | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function loadDraftOrder(
  supabase: SupabaseClient,
  orderId: string,
  userId: string,
  workspaceId: string
): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('customer_id', userId)
    .eq('workspace_id', workspaceId)
    .eq('status', 'DRAFT')
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Order;
}

async function getValidAddOns(
  supabase: SupabaseClient,
  addOnIds: string[]
): Promise<AddOn[]> {
  const uniqueIds = Array.from(new Set(addOnIds));

  if (uniqueIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('add_ons')
    .select('*')
    .in('id', uniqueIds)
    .eq('is_active', true);

  if (error || !data) {
    return [];
  }

  return data as AddOn[];
}

async function getOrderAddOnIds(
  supabase: SupabaseClient,
  orderId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('order_add_ons')
    .select('add_on_id')
    .eq('order_id', orderId);

  if (error || !data) {
    return [];
  }

  return (data as Array<{ add_on_id: string }>).map(
    (row) => row.add_on_id
  );
}

async function getBasePrice(
  supabase: SupabaseClient,
  kind: Order['kind']
): Promise<number> {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('kind', kind)
    .eq('is_active', true)
    .order('price_per_video', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return 0;
  }

  return numberValue((data as Package).price_per_video);
}

async function replaceOrderAddOns(
  supabase: SupabaseClient,
  orderId: string,
  addOns: AddOn[]
): Promise<boolean> {
  const { error: deleteError } = await supabase
    .from('order_add_ons')
    .delete()
    .eq('order_id', orderId);

  if (deleteError) {
    return false;
  }

  if (addOns.length === 0) {
    return true;
  }

  const { error: insertError } = await supabase
    .from('order_add_ons')
    .insert(
      addOns.map((addOn) => ({
        order_id: orderId,
        add_on_id: addOn.id,
      }))
    );

  return !insertError;
}

async function findCoupon(code: string): Promise<Coupon | null> {
  const normalized = code.trim();

  if (!normalized) {
    return null;
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('coupons')
      .select('*')
      .ilike('code', normalized)
      .limit(20);

    if (error || !data) {
      return null;
    }

    const coupon = (data as Coupon[]).find(
      (row) =>
        row.code.trim().toLowerCase() === normalized.toLowerCase()
    );

    if (!coupon) {
      return null;
    }

    if (
      coupon.expires_at &&
      new Date(coupon.expires_at).getTime() < Date.now()
    ) {
      return null;
    }

    if (
      coupon.usage_limit !== null &&
      numberValue(coupon.used) >= numberValue(coupon.usage_limit)
    ) {
      return null;
    }

    return coupon;
  } catch {
    return null;
  }
}

function couponDiscount(coupon: Coupon, subtotal: number): number {
  const value = numberValue(coupon.value);
  const type = coupon.type?.toUpperCase() ?? '';
  const isPercentage = type.includes('PERCENT');
  const rawDiscount = isPercentage ? subtotal * (value / 100) : value;

  return Math.min(subtotal, Math.max(0, rawDiscount));
}

async function buildQuote(
  supabase: SupabaseClient,
  userId: string,
  order: Order,
  addOns: AddOn[],
  couponCode: string,
  useCredits: boolean
): Promise<WizardQuote> {
  const basePrice = await getBasePrice(supabase, order.kind);
  const addOnTotal = addOns.reduce(
    (total, addOn) => total + numberValue(addOn.price),
    0
  );
  const subtotal = basePrice + addOnTotal;
  const coupon = couponCode ? await findCoupon(couponCode) : null;
  const discount = coupon ? couponDiscount(coupon, subtotal) : 0;
  const afterCoupon = Math.max(0, subtotal - discount);

  const { data: creditRow } = await supabase
    .from('credits')
    .select('balance')
    .eq('user_id', userId)
    .eq('kind', order.kind)
    .maybeSingle();

  const creditBalance = numberValue(
    (creditRow as { balance?: number | string } | null)?.balance
  );
  const creditApplication =
    useCredits && creditBalance > 0
      ? Math.min(basePrice, afterCoupon)
      : 0;

  return {
    basePrice,
    addOnTotal,
    subtotal,
    couponDiscount: discount,
    creditDiscount: creditApplication,
    total: Math.max(0, afterCoupon - creditApplication),
    couponCode: coupon?.code ?? null,
  };
}

async function recordSubmission(
  order: Order,
  userId: string,
  quote: WizardQuote,
  addOns: AddOn[],
  useCredits: boolean
): Promise<void> {
  try {
    const admin = createAdminClient();
    const orderLabel = `#${order.order_no}`;

    await admin.from('audit_logs').insert({
      actor_id: userId,
      action: 'order.submitted',
      entity: 'order',
      entity_id: order.id,
      meta: {
        order_no: order.order_no,
        workspace_id: order.workspace_id,
        kind: order.kind,
        add_on_ids: addOns.map((addOn) => addOn.id),
        use_credits: useCredits,
        coupon_code: quote.couponCode,
        base_price: quote.basePrice,
        add_on_total: quote.addOnTotal,
        coupon_discount: quote.couponDiscount,
        credit_discount: quote.creditDiscount,
        total: quote.total,
      },
    });

    await admin.from('notifications').insert({
      user_id: userId,
      title: `Order ${orderLabel} submitted`,
      body: 'Your brief is in the queue. We will match it with an editor shortly.',
      href: `/app/orders/${order.id}`,
    });
  } catch {
    return;
  }
}

export async function saveIdeaStep(
  input: unknown
): Promise<WizardActionResult> {
  const auth = await authorizeAction(input);

  if (!auth.ok) {
    return failure(auth.message, auth.fieldErrors);
  }

  const parsed = ideaSchema.safeParse(input);

  if (!parsed.success) {
    return failure('Check the idea details and try again.', zodFields(parsed.error));
  }

  const data = parsed.data;
  const supabase = createClient();
  const payload = {
    kind: data.kind,
    title: data.title,
    brief: data.brief,
    reference_links: data.referenceLinks || null,
  };

  if (data.orderId) {
    const { data: updated, error } = await supabase
      .from('orders')
      .update(payload)
      .eq('id', data.orderId)
      .eq('customer_id', auth.userId)
      .eq('workspace_id', auth.workspaceId)
      .eq('status', 'DRAFT')
      .select('id, order_no')
      .maybeSingle();

    if (error || !updated) {
      return failure(
        'This draft could not be updated. Refresh the page and try again.'
      );
    }

    const row = updated as { id: string; order_no: number | null };

    return {
      ok: true,
      orderId: row.id,
      orderNo: row.order_no ?? null,
    };
  }

  const { data: created, error } = await supabase
    .from('orders')
    .insert({
      ...payload,
      workspace_id: auth.workspaceId,
      customer_id: auth.userId,
      status: 'DRAFT',
    })
    .select('id, order_no')
    .single();

  if (error || !created) {
    return failure(
      'We could not start this draft. Check your workspace and try again.'
    );
  }

  const row = created as { id: string; order_no: number | null };

  return {
    ok: true,
    orderId: row.id,
    orderNo: row.order_no ?? null,
  };
}

export async function saveFootageStep(
  input: unknown
): Promise<WizardActionResult> {
  const auth = await authorizeAction(input);

  if (!auth.ok) {
    return failure(auth.message, auth.fieldErrors);
  }

  const parsed = footageSchema.safeParse(input);

  if (!parsed.success) {
    return failure(
      'Check the footage details and try again.',
      zodFields(parsed.error)
    );
  }

  const data = parsed.data;
  const supabase = createClient();
  const order = await loadDraftOrder(
    supabase,
    data.orderId,
    auth.userId,
    auth.workspaceId
  );

  if (!order) {
    return failure(
      'This draft is no longer editable. Start a new order or refresh the page.'
    );
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({ raw_footage_minutes: data.rawFootageMinutes })
    .eq('id', order.id)
    .eq('status', 'DRAFT');

  if (updateError) {
    return failure('We could not save your footage details. Try again.');
  }

  const { error: clearError } = await supabase
    .from('footage_files')
    .delete()
    .eq('order_id', order.id)
    .in('source', ['CLOUD_LINK', 'SIZE_ESTIMATE']);

  if (clearError) {
    return failure('We could not update the footage link. Try again.');
  }

  if (data.cloudLink || data.footageSizeGb !== null) {
    const sizeBytes =
      data.footageSizeGb === null
        ? null
        : Math.round(data.footageSizeGb * 1024 * 1024 * 1024);

    const { error: insertError } = await supabase
      .from('footage_files')
      .insert({
        order_id: order.id,
        name: data.cloudLink
          ? 'Cloud footage link'
          : 'Footage size estimate',
        size: sizeBytes,
        path: null,
        url: data.cloudLink || null,
        source: data.cloudLink ? 'CLOUD_LINK' : 'SIZE_ESTIMATE',
      });

    if (insertError) {
      return failure('We could not save the footage link. Try again.');
    }
  }

  return { ok: true, orderId: order.id, orderNo: order.order_no ?? null };
}

export async function saveStyleStep(
  input: unknown
): Promise<WizardActionResult> {
  const auth = await authorizeAction(input);

  if (!auth.ok) {
    return failure(auth.message, auth.fieldErrors);
  }

  const parsed = styleSchema.safeParse(input);

  if (!parsed.success) {
    return failure('Check the selected extras and try again.', zodFields(parsed.error));
  }

  const data = parsed.data;
  const supabase = createClient();
  const order = await loadDraftOrder(
    supabase,
    data.orderId,
    auth.userId,
    auth.workspaceId
  );

  if (!order) {
    return failure(
      'This draft is no longer editable. Start a new order or refresh the page.'
    );
  }

  const addOns = await getValidAddOns(supabase, data.addOnIds);

  if (!(await replaceOrderAddOns(supabase, order.id, addOns))) {
    return failure('We could not save the selected extras. Try again.');
  }

  return { ok: true, orderId: order.id, orderNo: order.order_no ?? null };
}

export async function previewCoupon(
  input: unknown
): Promise<CouponPreviewResult> {
  const auth = await authorizeAction(input);

  if (!auth.ok) {
    return { ok: false, message: auth.message };
  }

  const parsed = couponSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message:
        zodFields(parsed.error).code?.[0] ??
        'Enter a valid coupon code.',
    };
  }

  const data = parsed.data;
  const supabase = createClient();
  const order = await loadDraftOrder(
    supabase,
    data.orderId,
    auth.userId,
    auth.workspaceId
  );

  if (!order) {
    return { ok: false, message: 'Save your order before applying a coupon.' };
  }

  const addOnIds = await getOrderAddOnIds(supabase, order.id);
  const addOns = await getValidAddOns(supabase, addOnIds);
  const basePrice = await getBasePrice(supabase, order.kind);
  const subtotal =
    basePrice +
    addOns.reduce(
      (total, addOn) => total + numberValue(addOn.price),
      0
    );
  const coupon = await findCoupon(data.code);

  if (!coupon) {
    return {
      ok: false,
      message: 'That coupon code is not available for this order.',
    };
  }

  return {
    ok: true,
    preview: {
      code: coupon.code,
      discount: couponDiscount(coupon, subtotal),
      message: `Coupon ${coupon.code} applied.`,
    },
  };
}

export async function submitOrder(
  input: unknown
): Promise<WizardActionResult> {
  const auth = await authorizeAction(input);

  if (!auth.ok) {
    return failure(auth.message, auth.fieldErrors);
  }

  const parsed = reviewSchema.safeParse(input);

  if (!parsed.success) {
    return failure(
      'Check the final details and try again.',
      zodFields(parsed.error)
    );
  }

  const data = parsed.data;
  const supabase = createClient();
  const order = await loadDraftOrder(
    supabase,
    data.orderId,
    auth.userId,
    auth.workspaceId
  );

  if (!order) {
    return failure(
      'This draft is no longer editable. Start a new order or refresh the page.'
    );
  }

  if (!order.title.trim() || !order.brief?.trim()) {
    return failure(
      'Add a title and brief before submitting your order.',
      {
        title: ['Add an order title.'],
        brief: ['Add a project brief.'],
      }
    );
  }

  const addOns = await getValidAddOns(supabase, data.addOnIds);
  const requestedCoupon = data.couponCode.trim();
  const coupon = requestedCoupon
    ? await findCoupon(requestedCoupon)
    : null;

  if (requestedCoupon && !coupon) {
    return failure(
      'That coupon code is not available for this order.',
      {
        couponCode: [
          'That coupon code is not available for this order.',
        ],
      }
    );
  }

  if (!(await replaceOrderAddOns(supabase, order.id, addOns))) {
    return failure(
      'We could not save the selected extras. Your draft has not been submitted.'
    );
  }

  const quote = await buildQuote(
    supabase,
    auth.userId,
    order,
    addOns,
    data.couponCode,
    data.useCredits
  );

  const { data: updated, error } = await supabase
    .from('orders')
    .update({ status: 'SUBMITTED' })
    .eq('id', order.id)
    .eq('status', 'DRAFT')
    .select('id, order_no')
    .maybeSingle();

  if (error || !updated) {
    return failure(
      'Your order is still a draft because submission failed. Try again.'
    );
  }

  const row = updated as { id: string; order_no: number | null };

  await recordSubmission(
    { ...order, order_no: row.order_no ?? order.order_no },
    auth.userId,
    quote,
    addOns,
    data.useCredits
  );

  revalidatePath('/app');

  return {
    ok: true,
    orderId: row.id,
    orderNo: row.order_no ?? null,
    quote,
  };
}
