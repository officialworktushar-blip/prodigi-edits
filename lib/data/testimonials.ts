import type { Testimonial } from '../../types/db';

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'client-note-maya-chen',
    name: 'Maya Chen',
    role: 'YouTube creator',
    quote:
      'The edits land faster than I can film. My retention curve finally points the right way.',
    is_published: true,
    created_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'client-note-daniel-okafor',
    name: 'Daniel Okafor',
    role: 'Startup founder',
    quote:
      'We stopped juggling freelancers and started shipping product demos every week. The consistency paid for itself.',
    is_published: true,
    created_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'client-note-priya-raman',
    name: 'Priya Raman',
    role: 'Podcast host',
    quote:
      'Three hours of raw conversation comes back tight and listenable, without losing the moments that matter.',
    is_published: true,
    created_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'client-note-jonas-weber',
    name: 'Jonas Weber',
    role: 'Real estate broker',
    quote:
      'Listing tours that used to eat my weekend now arrive before the open house. Clients notice the polish.',
    is_published: true,
    created_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'client-note-elena-rossi',
    name: 'Elena Rossi',
    role: 'Course creator',
    quote:
      'Every module intro feels like it belongs to the same course. That coherence keeps students moving forward.',
    is_published: true,
    created_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'client-note-chris-alvarez',
    name: 'Chris Alvarez',
    role: 'Agency producer',
    quote:
      'One workspace, every client, no chasing files. This is the calmest our production calendar has ever been.',
    is_published: true,
    created_at: '2024-01-01T00:00:00.000Z',
  },
];
