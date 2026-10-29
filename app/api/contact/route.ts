import { z } from 'zod';
import { SUPPORT_EMAIL } from '@/lib/config';
import prisma from '@/lib/db';
import { BRAND_NAME } from '@/lib/config';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = contactSchema.parse(body);

    const result = await prisma.notification.create({
      data: {
        userId: '00000000-0000-0000-0000-000000000000', // sentinel — system notification
        title: `New message from ${validated.name}`,
        body: `${validated.email}\n\n${validated.message}`,
        href: '/contact',
        readAt: null,
      },
    });

    // Also create an AuditLog entry
    await prisma.auditLog.create({
      data: {
        actorId: null,
        action: 'contact_submitted',
        entity: 'Contact',
        entityId: result.id,
        meta: JSON.stringify({ email: validated.email, name: validated.name }),
      },
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: error.errors[0].message }), { status: 400 });
    }
    console.error('Contact API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
