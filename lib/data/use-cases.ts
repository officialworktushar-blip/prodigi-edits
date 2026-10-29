export const USE_CASES = [
  {
    slug: 'youtubers',
    label: 'YouTubers',
    icon: Users,
    description: 'Channel management, thumbnail creation, and batch-formatting for large upload volumes — leaving you free to keep creating content.',
  },
  {
    slug: 'businesses',
    label: 'Businesses',
    icon: Building2,
    description: 'Product demos, launch videos, investor updates, and corporate storytelling — edited professionally so the message lands every single time.',
  },
  {
    slug: 'podcasters',
    label: 'Podcasters',
    icon: Mic,
    description: 'Clean up long recording sessions, normalize mixes, trim filler, add intro/outro bounces, and deliver formats ready for every major podcast platform.',
  },
  {
    slug: 'real-estate',
    label: 'Real Estate Agents',
    icon: MapPin,
    description: 'Agent highlight reels, property tours, and virtual showings — curated for fast booking decisions on listings and listings-focused platforms.',
  },
  {
    slug: 'course-creators',
    label: 'Course Creators',
    icon: GraduationCap,
    description: 'Tutorial episodes, module intros, promo cuts — polished consistently so your course roadmap stays clear and click-friendly.',
  },
  {
    slug: 'doctors',
    label: 'Doctors & dentists',
    icon: MedicalBag,
    description: 'Explainer reels for patients, procedure highlights, and health tips — warmer tone plus tighter cuts than most generic editors deliver.',
  },
  {
    slug: 'lawyers',
    label: 'Lawyers & firms',
    icon: ScaleBalance,
    description: 'Client testimonials, trial cutdowns, firm updates — professional polish with tight pacing, built to look like polished commercials.',
  },
] as const;

export function getUseCasePage(slug: string) {
  return USE_CASES.find((u) => u.slug === slug);
}

export default USE_CASES;