import { createAdminClient } from '@/lib/supabase/admin';
import type { Json } from '@/types/db';

export interface ActionResult {
  success: boolean;
  error?: string;
}

export interface AuditInput {
  actorId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  meta?: Json | null;
}

/**
 * Writes one row to audit_logs using the service-role client.
 * Never throws: a failed audit write must not break the admin action.
 */
export async function logAudit(input: AuditInput): Promise<void> {
  try {
    const admin = createAdminClient();
    const { error } = await admin.from('audit_logs').insert({
      actor_id: input.actorId,
      action: input.action,
      entity: input.entity,
      entity_id: input.entityId ?? null,
      meta: input.meta ?? null,
    });

    if (error) {
      console.error('Audit log insert failed:', error.message);
    }
  } catch (error) {
    console.error('Audit log failed:', error);
  }
}

export function firstIssue(
  error: { issues: { message: string }[] },
  fallback = 'Invalid input.'
): string {
  return error.issues[0]?.message ?? fallback;
}

/** Removes characters that have a meaning inside PostgREST filter strings. */
export function sanitizeSearch(term: string): string {
  return term.replace(/[,()*%\\"]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
}

export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export function isMissingTable(message: string | undefined | null): boolean {
  if (!message) {
    return false;
  }

  const text = message.toLowerCase();
  return (
    text.includes('does not exist') ||
    text.includes('could not find the table') ||
    text.includes('schema cache')
  );
}

export const EXTRAS_SQL_HINT =
  'Run supabase/admin_extras.sql in the Supabase SQL Editor first.';
