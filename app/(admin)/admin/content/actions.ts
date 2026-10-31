'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import { firstIssue, logAudit, type ActionResult } from '@/lib/admin/audit';

function refreshContent(extra?: string) {
  revalidatePath('/admin/content');
  revalidatePath('/');
  revalidatePath('/case-studies');

  if (extra) {
    revalidatePath(extra);
  }
}

const idSchema = z.object({ id: z.string().uuid('Invalid id.') });
const publishSchema = idSchema.extend({ isPublished: z.boolean() });

/* ----------------------------- Testimonials ------------------------------ */

const testimonialSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, 'Name is required.').max(100),
  role: z.string().trim().max(120).nullable(),
  quote: z.string().trim().min(10, 'The quote is too short.').max(1000),
  isPublished: z.boolean(),
});

export async function saveTestimonial(
  input: z.infer<typeof testimonialSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = testimonialSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const value = parsed.data;
  const row = {
    name: value.name,
    role: value.role || null,
    quote: value.quote,
    is_published: value.isPublished,
  };
  const admin = createAdminClient();
  const { error } = value.id
    ? await admin.from('testimonials').update(row).eq('id', value.id)
    : await admin.from('testimonials').insert(row);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: value.id ? 'update_testimonial' : 'create_testimonial',
    entity: 'testimonial',
    entityId: value.id ?? null,
    meta: { name: value.name, is_published: value.isPublished },
  });

  refreshContent();

  return { success: true };
}

export async function setTestimonialPublished(
  input: z.infer<typeof publishSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = publishSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('testimonials')
    .update({ is_published: parsed.data.isPublished })
    .eq('id', parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: 'publish_testimonial',
    entity: 'testimonial',
    entityId: parsed.data.id,
    meta: { is_published: parsed.data.isPublished },
  });

  refreshContent();

  return { success: true };
}

export async function deleteTestimonial(
  input: z.infer<typeof idSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = idSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin.from('testimonials').delete().eq('id', parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: 'delete_testimonial',
    entity: 'testimonial',
    entityId: parsed.data.id,
  });

  refreshContent();

  return { success: true };
}

/* ------------------------------ Case studies ----------------------------- */

const caseStudySchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only use lowercase letters, numbers and dashes.')
    .max(80),
  title: z.string().trim().min(1, 'Title is required.').max(160),
  summary: z.string().trim().max(500).nullable(),
  body: z.string().max(20000).nullable(),
  isPublished: z.boolean(),
});

export async function saveCaseStudy(
  input: z.infer<typeof caseStudySchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = caseStudySchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const value = parsed.data;
  const row = {
    slug: value.slug,
    title: value.title,
    summary: value.summary || null,
    body: value.body || null,
    is_published: value.isPublished,
  };
  const admin = createAdminClient();
  const { error } = value.id
    ? await admin.from('case_studies').update(row).eq('id', value.id)
    : await admin.from('case_studies').insert(row);

  if (error) {
    return {
      success: false,
      error: error.code === '23505' ? 'A case study with this slug already exists.' : error.message,
    };
  }

  await logAudit({
    actorId: user.id,
    action: value.id ? 'update_case_study' : 'create_case_study',
    entity: 'case_study',
    entityId: value.id ?? null,
    meta: { slug: value.slug, is_published: value.isPublished },
  });

  refreshContent(`/case-studies/${value.slug}`);

  return { success: true };
}

export async function setCaseStudyPublished(
  input: z.infer<typeof publishSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = publishSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('case_studies')
    .update({ is_published: parsed.data.isPublished })
    .eq('id', parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: 'publish_case_study',
    entity: 'case_study',
    entityId: parsed.data.id,
    meta: { is_published: parsed.data.isPublished },
  });

  refreshContent();

  return { success: true };
}

export async function deleteCaseStudy(
  input: z.infer<typeof idSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = idSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin.from('case_studies').delete().eq('id', parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: 'delete_case_study',
    entity: 'case_study',
    entityId: parsed.data.id,
  });

  refreshContent();

  return { success: true };
}

/* ---------------------------------- FAQ ---------------------------------- */

const faqSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().trim().min(3, 'The question is too short.').max(300),
  answer: z.string().trim().min(3, 'The answer is too short.').max(4000),
  isPublished: z.boolean(),
});

export async function saveFaq(
  input: z.infer<typeof faqSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = faqSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const value = parsed.data;
  const admin = createAdminClient();
  let error: { message: string } | null = null;

  if (value.id) {
    const result = await admin
      .from('faq_items')
      .update({
        question: value.question,
        answer: value.answer,
        is_published: value.isPublished,
      })
      .eq('id', value.id);

    error = result.error;
  } else {
    const { data: last } = await admin
      .from('faq_items')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const result = await admin.from('faq_items').insert({
      question: value.question,
      answer: value.answer,
      is_published: value.isPublished,
      sort_order: ((last as { sort_order: number } | null)?.sort_order ?? 0) + 1,
    });

    error = result.error;
  }

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: value.id ? 'update_faq' : 'create_faq',
    entity: 'faq',
    entityId: value.id ?? null,
    meta: { question: value.question, is_published: value.isPublished },
  });

  refreshContent();

  return { success: true };
}

export async function setFaqPublished(
  input: z.infer<typeof publishSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = publishSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('faq_items')
    .update({ is_published: parsed.data.isPublished })
    .eq('id', parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: 'publish_faq',
    entity: 'faq',
    entityId: parsed.data.id,
    meta: { is_published: parsed.data.isPublished },
  });

  refreshContent();

  return { success: true };
}

export async function deleteFaq(
  input: z.infer<typeof idSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = idSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin.from('faq_items').delete().eq('id', parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: 'delete_faq',
    entity: 'faq',
    entityId: parsed.data.id,
  });

  refreshContent();

  return { success: true };
}

const moveSchema = idSchema.extend({ direction: z.enum(['up', 'down']) });

export async function moveFaq(
  input: z.infer<typeof moveSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = moveSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const { id, direction } = parsed.data;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('faq_items')
    .select('id, sort_order')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  const items = (data ?? []) as { id: string; sort_order: number }[];
  const index = items.findIndex((item) => item.id === id);
  const target = direction === 'up' ? index - 1 : index + 1;

  if (index === -1 || target < 0 || target >= items.length) {
    return { success: true };
  }

  const reordered = [...items];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

  for (let position = 0; position < reordered.length; position += 1) {
    const item = reordered[position];

    if (item.sort_order !== position + 1) {
      const { error: updateError } = await admin
        .from('faq_items')
        .update({ sort_order: position + 1 })
        .eq('id', item.id);

      if (updateError) {
        return { success: false, error: updateError.message };
      }
    }
  }

  await logAudit({
    actorId: user.id,
    action: 'reorder_faq',
    entity: 'faq',
    entityId: id,
    meta: { direction },
  });

  refreshContent();

  return { success: true };
}
