import { z } from 'zod';
import { createClient } from '../../../lib/supabase/server';
import { SUPPORT_EMAIL } from '../../../lib/config';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.'),
});

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json(
      { ok: false, error: 'Please send a valid JSON request body.' },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of parsed.error.issues) {
      const field = issue.path[0];

      if (typeof field === 'string' && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }

    return Response.json(
      {
        ok: false,
        error: 'Please check the highlighted fields and try again.',
        fieldErrors,
      },
      { status: 400 }
    );
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from('contact_messages').insert({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    });

    if (error) {
      console.error('Contact message insert failed:', error.message);

      return Response.json(
        {
          ok: false,
          error: `We could not send your message. Please email ${SUPPORT_EMAIL}.`,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        ok: true,
        message: 'Your message was sent. We will reply within one business day.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact API error:', error);

    return Response.json(
      {
        ok: false,
        error: `We could not send your message. Please email ${SUPPORT_EMAIL}.`,
      },
      { status: 500 }
    );
  }
}
