import { createClient } from '../supabase/server';
import type {
  AddOn,
  CaseStudy,
  FaqItem,
  Package,
  Testimonial,
} from '../../types/db';

export async function getActivePackages(): Promise<Package[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', true)
      .order('video_count', { ascending: true });

    if (error) {
      return [];
    }

    return (data as Package[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getActiveAddOns(): Promise<AddOn[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('add_ons')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      return [];
    }

    return (data as AddOn[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return (data as Testimonial[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getPublishedCaseStudies(): Promise<CaseStudy[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return (data as CaseStudy[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getPublishedCaseStudyBySlug(
  slug: string
): Promise<CaseStudy | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('is_published', true)
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as CaseStudy;
  } catch {
    return null;
  }
}

export async function getPublishedFaqItems(): Promise<FaqItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('faq_items')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) {
      return [];
    }

    return (data as FaqItem[] | null) ?? [];
  } catch {
    return [];
  }
}
