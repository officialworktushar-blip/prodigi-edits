'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, LayoutGrid, Table, MoreVertical, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/shared/status-badge';
import { getOrders, updateStatus } from './actions';
import type { Order, OrderStatus, OrderKind } from '@/types/db';

const STATUS_OPTIONS: OrderStatus[] = [
  'DRAFT',
  'SUBMITTED',
  'ASSIGNED',
  'IN_PROGRESS',
  'IN_REVIEW',
  'REVISION_REQUESTED',
  'APPROVED',
  'DELIVERED',
  'CANCELLED',
];

const KIND_OPTIONS: OrderKind[] = ['HORIZONTAL', 'VERTICAL', 'THUMBNAIL'];

const STATUS_LABELS: Record<OrderStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'In Review',
  REVISION_REQUESTED: 'Revision Requested',
  APPROVED: 'Approved',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const KIND_LABELS: Record<OrderKind, string> = {
  HORIZONTAL: 'Horizontal',
  VERTICAL: 'Vertical',
  THUMBNAIL: 'Thumbnail',
};

export default function OrdersPage() {
  const [view, setView] = useState<'table' | 'board'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [kindFilter, setKindFilter] = useState<OrderKind | ''>('');
  const [editorFilter, setEditorFilter] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [search, statusFilter, kindFilter, editorFilter]);

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await getOrders({
        search: search || undefined,
        status: statusFilter || undefined,
        kind: kindFilter || undefined,
        editorId: editorFilter || undefined,
      });
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    const result = await updateStatus({ orderId, status: newStatus });
    if (result.success) {
      loadOrders();
    } else {
      alert(result.error || 'Failed to update status');
    }
  }

  const statusGroups = STATUS_OPTIONS.filter(
    (s) => s !== 'CANCELLED'
  ).reduce((acc, status) => {
    acc[status] = orders.filter((o) => o.status === status);
    return acc;
  }, {} as Record<OrderStatus, any[]>);

  const editors = Array.from(
    new Set(
      orders
        .map((o) => o.editor)
        .filter((e): e is { id: string; name: string | null } => e != null)
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and track all customer orders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={view === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('table')}
          >
            <Table className="h-4 w-4" />
            Table
          </Button>
          <Button
            variant={view === 'board' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('board')}
          >
            <LayoutGrid className="h-4 w-4" />
            Board
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-soft sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </Select>

          <Select
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value as OrderKind | '')}
          >
            <option value="">All Kinds</option>
            {KIND_OPTIONS.map((kind) => (
              <option key={kind} value={kind}>
                {KIND_LABELS[kind]}
              </option>
            ))}
          </Select>

          <Select
            value={editorFilter}
            onChange={(e) => setEditorFilter(e.target.value)}
          >
            <option value="">All Editors</option>
            {editors.map((editor) => (
              <option key={editor.id} value={editor.id}>
                {editor.name || editor.email || 'Unknown'}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-sm text-slate-500">Loading orders...</div>
        </div>
      ) : view === 'table' ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-soft">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Kind</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Editor</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-semibold text-brand-ink hover:text-brand-indigo"
                      >
                        #{order.order_no}
                      </Link>
                      <div className="mt-0.5 text-xs text-slate-500 line-clamp-1">
                        {order.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {order.customer?.name || order.customer?.email || 'Unknown'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{KIND_LABELS[order.kind]}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {order.editor?.name || order.editor?.email || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {order.due_at
                        ? new Date(order.due_at).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/admin/orders/${order.id}`}>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                          <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Change Status
                          </div>
                          {STATUS_OPTIONS.map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => handleStatusChange(order.id, status)}
                              disabled={order.status === status}
                            >
                              {STATUS_LABELS[status]}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {STATUS_OPTIONS.filter((s) => s !== 'CANCELLED').map((status) => (
            <div
              key={status}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge status={status} />
                  <span className="text-sm font-semibold text-slate-600">
                    {statusGroups[status]?.length || 0}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>

              <div className="flex flex-col gap-2">
                {(statusGroups[status] || []).map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 transition hover:border-slate-200 hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-brand-ink">
                          #{order.order_no}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500 line-clamp-1">
                          {order.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          {order.customer?.name || order.customer?.email || 'Unknown'}
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-[10px]">
                        {KIND_LABELS[order.kind]}
                      </Badge>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mt-2 h-7 w-7 shrink-0"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Change Status
                        </div>
                        {STATUS_OPTIONS.map((s) => (
                          <DropdownMenuItem
                            key={s}
                            onClick={() => handleStatusChange(order.id, s)}
                            disabled={order.status === s}
                          >
                            {STATUS_LABELS[s]}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Link>
                ))}

                {(statusGroups[status] || []).length === 0 && (
                  <div className="py-4 text-center text-xs text-slate-400">
                    No orders
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
