import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import { TeamManager, type TeamMember } from './team-manager';

export const dynamic = 'force-dynamic';

const ACTIVE_STATUSES = [
  'SUBMITTED',
  'ASSIGNED',
  'IN_PROGRESS',
  'IN_REVIEW',
  'REVISION_REQUESTED',
];

const TEAM_CAPACITY = 8;

export default async function TeamPage() {
  const { user } = await requireRole(['ADMIN']);
  const admin = createAdminClient();

  const { data: staffRows, error } = await admin
    .from('profiles')
    .select('id, name, email, role, created_at')
    .in('role', ['ADMIN', 'EDITOR'])
    .order('created_at', { ascending: true });

  const staff = (staffRows ?? []) as {
    id: string;
    name: string | null;
    email: string | null;
    role: 'ADMIN' | 'EDITOR';
  }[];

  const workload = new Map<string, number>();

  if (staff.length > 0) {
    const { data: orderRows } = await admin
      .from('orders')
      .select('id, manager_id, editor_id, thumbnail_artist_id')
      .in('status', ACTIVE_STATUSES);

    for (const order of (orderRows ?? []) as {
      manager_id: string | null;
      editor_id: string | null;
      thumbnail_artist_id: string | null;
    }[]) {
      const people = new Set(
        [order.manager_id, order.editor_id, order.thumbnail_artist_id].filter(
          (id): id is string => Boolean(id)
        )
      );

      for (const id of Array.from(people)) {
        workload.set(id, (workload.get(id) ?? 0) + 1);
      }
    }
  }

  const members: TeamMember[] = staff.map((person) => ({
    id: person.id,
    name: person.name,
    email: person.email,
    role: person.role,
    activeOrders: workload.get(person.id) ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-ink">Team</h1>
        <p className="mt-1 text-sm text-slate-500">
          Editors and admins, with their current workload.
        </p>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          Could not load the team: {error.message}
        </p>
      ) : null}

      <TeamManager members={members} currentUserId={user.id} capacity={TEAM_CAPACITY} />
    </div>
  );
}
