import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import { logAudit } from '@/lib/admin/audit';

export const dynamic = 'force-dynamic';

function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? '' : String(value);

  // Stop spreadsheet apps from running text as a formula.
  if (/^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

interface ExportRow {
  order_no: number;
  title: string;
  kind: string;
  status: string;
  created_at: string;
  due_at: string | null;
  customer: { name: string | null; email: string | null } | null;
  workspace: { name: string } | null;
}

export async function GET() {
  const { user } = await requireRole(['ADMIN']);
  const admin = createAdminClient();

  const { data, error } = await admin
    .from('orders')
    .select(
      'order_no, title, kind, status, created_at, due_at, customer:customer_id(name, email), workspace:workspace_id(name)'
    )
    .order('created_at', { ascending: false })
    .limit(5000);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const header = [
    'Order no',
    'Title',
    'Type',
    'Status',
    'Customer',
    'Customer email',
    'Workspace',
    'Created',
    'Due',
  ];

  const lines = ((data ?? []) as unknown as ExportRow[]).map((row) =>
    [
      row.order_no,
      row.title,
      row.kind,
      row.status,
      row.customer?.name,
      row.customer?.email,
      row.workspace?.name,
      row.created_at,
      row.due_at,
    ]
      .map(csvCell)
      .join(',')
  );

  await logAudit({
    actorId: user.id,
    action: 'export_orders_csv',
    entity: 'finance',
    meta: { rows: lines.length },
  });

  const csv = [header.map(csvCell).join(','), ...lines].join('\r\n');
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="orders-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
