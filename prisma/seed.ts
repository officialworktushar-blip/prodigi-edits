import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { ADDON_LABELS, ADDON_PRICES_CENTS } from '../lib/config';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Demo@1234', 10);

  // ──────────────────────────────────────────────────────────────
  // USERS
  // ──────────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@demo.com',
      passwordHash,
      role: 'ADMIN',
      avatarUrl: null,
    },
  });

  const editor1 = await prisma.user.create({
    data: {
      name: 'Sarah Chen',
      email: 'editor1@demo.com',
      passwordHash,
      role: 'EDITOR',
      avatarUrl: null,
    },
  });

  const editor2 = await prisma.user.create({
    data: {
      name: 'Marcus Rivera',
      email: 'editor2@demo.com',
      passwordHash,
      role: 'EDITOR',
      avatarUrl: null,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Demo Customer',
      email: 'customer@demo.com',
      passwordHash,
      role: 'CUSTOMER',
      avatarUrl: null,
    },
  });

  // ──────────────────────────────────────────────────────────────
  // PACKAGES
  // ──────────────────────────────────────────────────────────────
  const packages = [
    // Horizontal packages
    { name: 'Essential Horizontal', kind: 'HORIZONTAL', videoCount: 1, pricePerVideo: 9900, discountPercent: 0, isActive: true },
    { name: 'Standard Horizontal', kind: 'HORIZONTAL', videoCount: 4, pricePerVideo: 8900, discountPercent: 7, isActive: true },
    { name: 'Pro Horizontal', kind: 'HORIZONTAL', videoCount: 8, pricePerVideo: 7900, discountPercent: 15, isActive: true },
    // Vertical packages
    { name: 'Essential Vertical', kind: 'VERTICAL', videoCount: 1, pricePerVideo: 7900, discountPercent: 0, isActive: true },
    { name: 'Standard Vertical', kind: 'VERTICAL', videoCount: 15, pricePerVideo: 6900, discountPercent: 0, isActive: true },
    { name: 'Pro Vertical', kind: 'VERTICAL', videoCount: 30, pricePerVideo: 5900, discountPercent: 0, isActive: true },
  ];

  await prisma.package.createMany({ data: packages });

  // ──────────────────────────────────────────────────────────────
  // ADD-ONS
  // ──────────────────────────────────────────────────────────────
  const addons = [
    { name: ADDON_LABELS.thumbnail, price: ADDON_PRICES_CENTS.thumbnail, isActive: true },
    { name: ADDON_LABELS.vertical, price: ADDON_PRICES_CENTS.vertical, isActive: true },
  ];

  await prisma.addOn.createMany({ data: addons });

  // ──────────────────────────────────────────────────────────────
  // TESTIMONIALS (6)
  // ──────────────────────────────────────────────────────────────
  const testimonials = [
    {
      content:
        'Working with CutCrew was a game-changer for our TikTok content. Our engagement tripled after we started shipping vertical edits they produced for us.',
      author: 'Jenna Ortiz',
      role: 'Social Media Manager at ByteBloom',
    },
    {
      content:
        'I sent raw footage and a loose brief at noon. By the next morning, I had a polished cut ready for client review. The 24-hour turnaround is real.',
      author: 'Dylan Park',
      role: 'Founder at Neon Labs',
    },
    {
      content:
        'The quality exceeds what our in-house editor delivered at half the cost. Every frame, every color grade — thoughtful and precise.',
      author: 'Maya Singh',
      role: 'Director at Meridian Films',
    },
    {
      content:
        'The portal was so straightforward that my assistant could place an order without my help. Uploading footage and tracking progress has never been easier.',
      author: 'Carlos Mendez',
      role: 'CMO at Apex Fitness',
    },
    {
      content:
        'They captured the tone I described perfectly on the first draft. No endless back-and-forth — exactly what busy creators need.',
      author: 'Zoe Reynolds',
      role: 'YouTuber',
    },
    {
      content:
        'From the initial call to the final deliverables, the entire team made our product launch feel seamless. We will never edit in-house again.',
      author: 'Amanda Cho',
      role: 'Head of Content at Solstice',
    },
  ];

  await prisma.testimonial.createMany({ data: testimonials });

  // ──────────────────────────────────────────────────────────────
  // CASE STUDIES (3)
  // ──────────────────────────────────────────────────────────────
  const caseStudies = [
    {
      title: 'ByteBloom — 90 Clips in 30 Days',
      summary:
        'ByteBloom needed 30 days of vertical social content for a product launch. CutCrew delivered 90 polished clips on schedule, helping them double their follower count and hit their launch KPIs.',
      result: '2.1x follower growth; 98% on-time delivery',
    },
    {
      title: 'Meridian Films — Wedding Highlight Film',
      summary:
        'Meridian had raw wedding ceremony footage with no structure. CutCrew shaped it into a 5-minute highlight film that exceeded the couple\'s expectations and became the talk of the reception.',
      result: 'Delivered in 18 hours; client referral within 48h',
    },
    {
      title: 'Apex Fitness — Monthly Content Retainer',
      summary:
        'Apex Fitness needed consistent monthly video content but lacked an in-house editor. CutCrew\'s monthly retainer delivered 8 videos per month for 6 months, driving a 40% increase in social engagement.',
      result: '40% engagement lift; zero missed deadlines',
    },
  ];

  await prisma.caseStudy.createMany({ data: caseStudies });

  // ──────────────────────────────────────────────────────────────
  // FAQ ITEMS (6)
  // ──────────────────────────────────────────────────────────────
  const faqItems = [
    {
      question: 'What do I need to send to get started?',
      answer:
        'Just fill out your brief and share your raw footage via our upload portal or a shared drive link. We handle the rest.',
    },
    {
      question: 'How long does delivery take?',
      answer:
        'Our standard turnaround is 48 hours. Need it faster? Choose our 24-hour option at checkout.',
    },
    {
      question: 'What\'s included in the footage allowance?',
      answer:
        'Every order includes up to 60 minutes of raw footage or 20 GB of uploaded files, whichever comes first.',
    },
    {
      question: 'How does the review process work?',
      answer:
        'We deliver a draft link where you can leave timestamped comments and approve or request revisions. Loop until you\'re thrilled.',
    },
    {
      question: 'Do you offer bulk discounts?',
      answer:
        'Yes — our Pro packages include 8 or more videos with up to 15% savings. Custom plans available for high-volume creators.',
    },
    {
      question: 'What add-ons are available?',
      answer:
        'Choose thumbnail cover art or a vertical 9:16 reformat for $43 each. Select them when placing your order.',
    },
  ];

  await prisma.faqItem.createMany({ data: faqItems });

  // ──────────────────────────────────────────────────────────────
  // WORKSPACE
  // ──────────────────────────────────────────────────────────────
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Demo Studios',
      ownerId: customer.id,
      type: 'CUSTOMER',
      notes: 'Seed demo workspace',
      logoUrl: null,
    },
  });

  // ──────────────────────────────────────────────────────────────
  // ORDERS (2)
  // ──────────────────────────────────────────────────────────────
  const now = new Date();
  const dueIn48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const order1 = await prisma.order.create({
    data: {
      orderNo: 'ORD-0001',
      workspaceId: workspace.id,
      customerId: customer.id,
      kind: 'HORIZONTAL',
      title: 'Q4 Product Launch Teaser',
      brief: '30-second teaser for our new SaaS platform launch. Modern aesthetic, upbeat music, highlight the dashboard in action.',
      referenceLinks: null,
      rawFootageMinutes: 45,
      status: 'IN_REVIEW',
      dueAt: dueIn48h,
      managerId: null,
      editorId: editor1.id,
      thumbnailArtistId: null,
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNo: 'ORD-0002',
      workspaceId: workspace.id,
      customerId: customer.id,
      kind: 'VERTICAL',
      title: 'Weekly TikTok Series',
      brief: '5 vertical videos (9:16) for TikTok, showcasing 5 product features. Need text overlays and trending sound.',
      referenceLinks: null,
      rawFootageMinutes: 30,
      status: 'APPROVED',
      dueAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      managerId: null,
      editorId: editor2.id,
      thumbnailArtistId: null,
    },
  });

  // ──────────────────────────────────────────────────────────────
  // DRAFT (1) — on order1
  // ──────────────────────────────────────────────────────────────
  const draft = await prisma.draft.create({
    data: {
      orderId: order1.id,
      version: 1,
      videoUrl: 'https://assets.cutcrew.com/demo/drafts/ord-0001-v1.mp4',
      thumbnailUrl: 'https://assets.cutcrew.com/demo/drafts/ord-0001-thumb.jpg',
      note: 'Initial rough cut — pacing needs tightening in the first 10 seconds.',
      createdById: editor1.id,
    },
  });

  // ──────────────────────────────────────────────────────────────
  // REVIEW COMMENTS (3) — on the draft
  // ──────────────────────────────────────────────────────────────
  await prisma.reviewComment.createMany({
    data: [
      {
        draftId: draft.id,
        authorId: customer.id,
        timestampSec: 12,
        body: 'Could we slow down the transition at the 12-second mark? It feels rushed.',
        status: 'OPEN',
        parentId: null,
      },
      {
        draftId: draft.id,
        authorId: customer.id,
        timestampSec: 28,
        body: 'Love the color grade here. Maybe add a subtle text overlay for the tagline?',
        status: 'OPEN',
        parentId: null,
      },
      {
        draftId: draft.id,
        authorId: editor1.id,
        timestampSec: 0,
        body: 'Acknowledged — revising now. New cut by tomorrow morning.',
        status: 'RESOLVED',
        parentId: null,
      },
    ],
  });

  console.log('Seed completed successfully.');
  console.log('Demo logins:');
  console.log('  admin@demo.com / Demo@1234  (ADMIN)');
  console.log('  editor1@demo.com / Demo@1234 (EDITOR)');
  console.log('  editor2@demo.com / Demo@1234 (EDITOR)');
  console.log('  customer@demo.com / Demo@1234 (CUSTOMER)');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });