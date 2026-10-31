import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import type { CaseStudy, FaqItem, Testimonial } from '@/types/db';
import { ContentManager } from './content-manager';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  await requireRole(['ADMIN']);
  const admin = createAdminClient();

  const [testimonialResult, caseStudyResult, faqResult] = await Promise.all([
    admin.from('testimonials').select('*').order('created_at', { ascending: false }),
    admin.from('case_studies').select('*').order('created_at', { ascending: false }),
    admin
      .from('faq_items')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
  ]);

  const error =
    testimonialResult.error?.message ??
    caseStudyResult.error?.message ??
    faqResult.error?.message ??
    null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-ink">Content</h1>
        <p className="mt-1 text-sm text-slate-500">
          Testimonials, case studies and FAQ shown on the public website.
        </p>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          Could not load content: {error}
        </p>
      ) : null}

      <ContentManager
        testimonials={(testimonialResult.data ?? []) as Testimonial[]}
        caseStudies={(caseStudyResult.data ?? []) as CaseStudy[]}
        faqs={(faqResult.data ?? []) as FaqItem[]}
      />
    </div>
  );
}
