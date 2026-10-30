import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/services/long-form`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/services/short-form`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/services/channel-management`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/use-cases/youtubers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/use-cases/businesses`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/use-cases/podcasters`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/use-cases/realtors`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/use-cases/course-creators`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/use-cases/doctors`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/use-cases/lawyers`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/examples`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/case-studies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/platform`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `https://${process.env.NEXT_PUBLIC_SITE_URL ?? 'localhost:3000'}/signup`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
