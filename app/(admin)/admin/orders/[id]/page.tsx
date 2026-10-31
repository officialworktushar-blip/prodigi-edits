'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Upload,
  FileVideo,
  Download,
  Calendar,
  User,
  Clock,
  FileText,
  History,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/shared/status-badge';
import {
  getOrderById,
  getStaffProfiles,
  assignStaff,
  setDueDate as setDueDateAction,
  updateInternalNotes,
  uploadDraft,
  uploadDeliverable,
  updateStatus,
  cancelOrder,
  getDownloadUrl,
} from '../actions';
import type { OrderStatus, OrderKind } from '@/types/db';

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

const EMPTY_DRAFT_FORM = { path: '', thumbnailPath: '', note: '' };
const EMPTY_DELIVERABLE_FORM = { name: '', path: '', type: '' };

// UTC ISO string -> value for <input type="datetime-local"> in the viewer's local time
function toLocalInput(iso: string) {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const orderId = params.id;
  const [data, setData] = useState<any>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [dueDateDialogOpen, setDueDateDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [draftDialogOpen, setDraftDialogOpen] = useState(false);
  const [deliverableDialogOpen, setDeliverableDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const [assignForm, setAssignForm] = useState({
    managerId: '',
    editorId: '',
    thumbnailArtistId: '',
  });
  const [dueDateInput, setDueDateInput] = useState('');
  const [notes, setNotes] = useState('');
  const [draftForm, setDraftForm] = useState(EMPTY_DRAFT_FORM);
  const [deliverableForm, setDeliverableForm] = useState(EMPTY_DELIVERABLE_FORM);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function loadData() {
    setLoading(true);
    try {
      const [orderData, staffData] = await Promise.all([
        getOrderById(orderId),
        getStaffProfiles(),
      ]);
      setData(orderData);
      setStaff(staffData || []);

      if (orderData?.order) {
        setAssignForm({
          managerId: orderData.order.manager_id || '',
          editorId: orderData.order.editor_id || '',
          thumbnailArtistId: orderData.order.thumbnail_artist_id || '',
        });
        setDueDateInput(
          orderData.order.due_at ? toLocalInput(orderData.order.due_at) : ''
        );
        setNotes(orderData.order.brief || '');
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAssignStaff() {
    const result = await assignStaff({
      orderId,
      managerId: assignForm.managerId || null,
      editorId: assignForm.editorId || null,
      thumbnailArtistId: assignForm.thumbnailArtistId || null,
    });
    if (result.success) {
      setAssignDialogOpen(false);
      loadData();
    } else {
      alert(result.error || 'Failed to assign staff');
    }
  }

  async function handleSetDueDate() {
    const result = await setDueDateAction({
      orderId,
      dueAt: dueDateInput ? new Date(dueDateInput).toISOString() : null,
    });
    if (result.success) {
      setDueDateDialogOpen(false);
      loadData();
    } else {
      alert(result.error || 'Failed to set due date');
    }
  }

  async function handleUpdateNotes() {
    const result = await updateInternalNotes({
      orderId,
      notes: notes || null,
    });
    if (result.success) {
      setNotesDialogOpen(false);
      loadData();
    } else {
      alert(result.error || 'Failed to update notes');
    }
  }

  async function handleUploadDraft() {
    if (!draftForm.path) {
      alert('Please upload a file first');
      return;
    }

    setUploading(true);
    const result = await uploadDraft({
      orderId,
      path: draftForm.path,
      thumbnailPath: draftForm.thumbnailPath || null,
      note: draftForm.note || null,
    });
    setUploading(false);

    if (result.success) {
      setDraftDialogOpen(false);
      setDraftForm(EMPTY_DRAFT_FORM);
      loadData();
    } else {
      alert(result.error || 'Failed to upload draft');
    }
  }

  async function handleUploadDeliverable() {
    if (!deliverableForm.path || !deliverableForm.name) {
      alert('Please fill in all required fields');
      return;
    }

    setUploading(true);
    const result = await uploadDeliverable({
      orderId,
      name: deliverableForm.name,
      path: deliverableForm.path,
      type: deliverableForm.type || null,
    });
    setUploading(false);

    if (result.success) {
      setDeliverableDialogOpen(false);
      setDeliverableForm(EMPTY_DELIVERABLE_FORM);
      loadData();
    } else {
      alert(result.error || 'Failed to upload deliverable');
    }
  }

  async function handleCancelOrder() {
    const result = await cancelOrder({
      orderId,
      reason: cancelReason || undefined,
    });
    if (result.success) {
      setCancelDialogOpen(false);
      setCancelReason('');
      loadData();
    } else {
      alert(result.error || 'Failed to cancel order');
    }
  }

  async function handleStatusChange(newStatus: OrderStatus) {
    const result = await updateStatus({ orderId, status: newStatus });
    if (result.success) {
      loadData();
    } else {
      alert(result.error || 'Failed to update status');
    }
  }

  async function handleFileUpload(
    type: 'draft' | 'draftThumbnail' | 'deliverable',
    file: File
  ) {
    const workspaceId = data?.order?.workspace_id;
    if (!workspaceId) {
      alert('Workspace not found for this order');
      return;
    }

    setFileUploading(true);
    try {
      const requestedPath = `${workspaceId}/${orderId}/${type}-${Date.now()}-${safeFileName(
        file.name
      )}`;

      const signRes = await fetch('/api/upload/sign-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: requestedPath,
          bucket: type === 'deliverable' ? 'deliverables' : 'drafts',
        }),
      });

      if (!signRes.ok) {
        throw new Error('Failed to get upload URL');
      }

      const signed = await signRes.json();
      const signedUrl: string = signed.signedUrl;
      const path: string = signed.path || requestedPath;

      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload file');
      }

      if (type === 'draft') {
        setDraftForm((f) => ({ ...f, path }));
      } else if (type === 'draftThumbnail') {
        setDraftForm((f) => ({ ...f, thumbnailPath: path }));
      } else {
        setDeliverableForm((f) => ({ ...f, path }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setFileUploading(false);
    }
  }

  async function handleDownload(path: string, bucket: 'drafts' | 'deliverables') {
    try {
      const url = await getDownloadUrl(bucket, path);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to generate download link');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-slate-500">Loading order...</div>
      </div>
    );
  }

  if (!data?.order) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-slate-500">Order not found</div>
      </div>
    );
  }

  const order = data.order;
  const drafts: any[] = data.drafts || [];
  const deliverables: any[] = data.deliverables || [];
  const comments: any[] = data.comments || [];
  const auditLogs: any[] = data.auditLogs || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="ghost" className="h-9 w-9 p-0" aria-label="Back to orders">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-brand-ink">
            #{order.order_no} - {order.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {order.workspace?.name || 'Unknown workspace'}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Customer
                  </label>
                  <div className="mt-1 text-sm text-slate-600">
                    {order.customer?.name || order.customer?.email || 'Unknown'}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Kind
                  </label>
                  <div className="mt-1">
                    <span className="inline-flex items-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {KIND_LABELS[order.kind as OrderKind] || order.kind}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Due Date
                  </label>
                  <div className="mt-1 text-sm text-slate-600">
                    {order.due_at ? new Date(order.due_at).toLocaleString() : 'Not set'}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Created
                  </label>
                  <div className="mt-1 text-sm text-slate-600">
                    {new Date(order.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              {order.brief && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Brief
                  </label>
                  <div className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
                    {order.brief}
                  </div>
                </div>
              )}

              {order.reference_links && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Reference Links
                  </label>
                  <div className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
                    {order.reference_links}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileVideo className="h-5 w-5" />
                Drafts
              </CardTitle>
              <p className="text-sm text-slate-500">Video drafts for customer review</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {drafts.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  No drafts uploaded yet
                </div>
              ) : (
                drafts.map((draft: any) => (
                  <div
                    key={draft.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-brand-ink">
                        Version {draft.version}
                      </div>
                      {draft.note && (
                        <div className="mt-0.5 text-xs text-slate-500">{draft.note}</div>
                      )}
                      <div className="mt-1 text-xs text-slate-400">
                        {new Date(draft.created_at).toLocaleString()}
                      </div>
                    </div>
                    {draft.path && (
                      <Button
                        variant="ghost"
                        className="h-9 w-9 p-0"
                        aria-label="Download draft"
                        onClick={() => handleDownload(draft.path, 'drafts')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}

              <Button className="w-full" onClick={() => setDraftDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload New Draft
              </Button>

              <Dialog
                open={draftDialogOpen}
                onOpenChange={(open: boolean) => {
                  setDraftDialogOpen(open);
                  if (!open) setDraftForm(EMPTY_DRAFT_FORM);
                }}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Draft</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Video File *
                      </label>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('draft', file);
                        }}
                        className="mt-1"
                      />
                      {fileUploading && (
                        <div className="mt-1 text-xs text-slate-500">Uploading file...</div>
                      )}
                      {draftForm.path && !fileUploading && (
                        <div className="mt-1 text-xs text-green-600">File uploaded</div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Thumbnail (optional)
                      </label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('draftThumbnail', file);
                        }}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Note (optional)
                      </label>
                      <Textarea
                        value={draftForm.note}
                        onChange={(e) =>
                          setDraftForm((f) => ({ ...f, note: e.target.value }))
                        }
                        placeholder="Add a note for the customer..."
                        className="mt-1"
                      />
                    </div>

                    <Button
                      onClick={handleUploadDraft}
                      disabled={uploading || fileUploading || !draftForm.path}
                      className="w-full"
                    >
                      {uploading ? 'Saving...' : 'Save Draft'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileVideo className="h-5 w-5" />
                Deliverables
              </CardTitle>
              <p className="text-sm text-slate-500">Final files for customer download</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {deliverables.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  No deliverables uploaded yet
                </div>
              ) : (
                deliverables.map((del: any) => (
                  <div
                    key={del.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-brand-ink">{del.name}</div>
                      {del.type && (
                        <div className="mt-0.5 text-xs text-slate-500">{del.type}</div>
                      )}
                      <div className="mt-1 text-xs text-slate-400">
                        {new Date(del.created_at).toLocaleString()}
                      </div>
                    </div>
                    {del.path && (
                      <Button
                        variant="ghost"
                        className="h-9 w-9 p-0"
                        aria-label="Download deliverable"
                        onClick={() => handleDownload(del.path, 'deliverables')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}

              <Button className="w-full" onClick={() => setDeliverableDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Deliverable
              </Button>

              <Dialog
                open={deliverableDialogOpen}
                onOpenChange={(open: boolean) => {
                  setDeliverableDialogOpen(open);
                  if (!open) setDeliverableForm(EMPTY_DELIVERABLE_FORM);
                }}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Deliverable</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Name *</label>
                      <Input
                        value={deliverableForm.name}
                        onChange={(e) =>
                          setDeliverableForm((f) => ({ ...f, name: e.target.value }))
                        }
                        placeholder="e.g., Final video v1"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">File *</label>
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setDeliverableForm((f) =>
                              f.name ? f : { ...f, name: file.name }
                            );
                            handleFileUpload('deliverable', file);
                          }
                        }}
                        className="mt-1"
                      />
                      {fileUploading && (
                        <div className="mt-1 text-xs text-slate-500">Uploading file...</div>
                      )}
                      {deliverableForm.path && !fileUploading && (
                        <div className="mt-1 text-xs text-green-600">File uploaded</div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Type (optional)
                      </label>
                      <Input
                        value={deliverableForm.type}
                        onChange={(e) =>
                          setDeliverableForm((f) => ({ ...f, type: e.target.value }))
                        }
                        placeholder="e.g., MP4, MOV"
                        className="mt-1"
                      />
                    </div>

                    <Button
                      onClick={handleUploadDeliverable}
                      disabled={
                        uploading ||
                        fileUploading ||
                        !deliverableForm.path ||
                        !deliverableForm.name
                      }
                      className="w-full"
                    >
                      {uploading ? 'Saving...' : 'Save Deliverable'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Review Comments
              </CardTitle>
              <p className="text-sm text-slate-500">Customer feedback on drafts</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {comments.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  No review comments yet
                </div>
              ) : (
                comments.map((comment: any) => (
                  <div
                    key={comment.id}
                    className="rounded-lg border border-slate-100 bg-slate-50/50 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-semibold text-brand-ink">
                          {comment.author?.name || comment.author?.email || 'Unknown'}
                        </div>
                        <div className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
                          {comment.body}
                        </div>
                        {comment.timestamp_sec != null && (
                          <div className="mt-1 text-xs text-slate-400">
                            Timestamp: {Math.floor(Number(comment.timestamp_sec))}s
                          </div>
                        )}
                      </div>
                      <span
                        className={
                          comment.status === 'OPEN'
                            ? 'inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700'
                            : 'inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700'
                        }
                      >
                        {comment.status}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-400">
                      {new Date(comment.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Staff Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Manager
                </label>
                <div className="mt-1 text-sm text-slate-600">
                  {order.manager?.name || order.manager?.email || 'Not assigned'}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Editor
                </label>
                <div className="mt-1 text-sm text-slate-600">
                  {order.editor?.name || order.editor?.email || 'Not assigned'}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Thumbnail Artist
                </label>
                <div className="mt-1 text-sm text-slate-600">
                  {order.thumbnail_artist?.name ||
                    order.thumbnail_artist?.email ||
                    'Not assigned'}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setAssignDialogOpen(true)}
              >
                Assign Staff
              </Button>

              <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Staff</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">Manager</label>
                      <Select
                        value={assignForm.managerId}
                        onChange={(e) =>
                          setAssignForm((f) => ({ ...f, managerId: e.target.value }))
                        }
                        className="mt-1"
                      >
                        <option value="">Unassigned</option>
                        {staff.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name || s.email} ({s.role})
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">Editor</label>
                      <Select
                        value={assignForm.editorId}
                        onChange={(e) =>
                          setAssignForm((f) => ({ ...f, editorId: e.target.value }))
                        }
                        className="mt-1"
                      >
                        <option value="">Unassigned</option>
                        {staff.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name || s.email} ({s.role})
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Thumbnail Artist
                      </label>
                      <Select
                        value={assignForm.thumbnailArtistId}
                        onChange={(e) =>
                          setAssignForm((f) => ({
                            ...f,
                            thumbnailArtistId: e.target.value,
                          }))
                        }
                        className="mt-1"
                      >
                        <option value="">Unassigned</option>
                        {staff.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name || s.email} ({s.role})
                          </option>
                        ))}
                      </Select>
                    </div>

                    <Button onClick={handleAssignStaff} className="w-full">
                      Save Assignments
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Due Date
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-slate-600">
                {order.due_at ? new Date(order.due_at).toLocaleString() : 'Not set'}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setDueDateDialogOpen(true)}
              >
                Set Due Date
              </Button>

              <Dialog open={dueDateDialogOpen} onOpenChange={setDueDateDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Due Date</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Due Date &amp; Time
                      </label>
                      <Input
                        type="datetime-local"
                        value={dueDateInput}
                        onChange={(e) => setDueDateInput(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <Button onClick={handleSetDueDate} className="w-full">
                      Save Due Date
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Internal Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="whitespace-pre-wrap text-sm text-slate-600">
                {order.brief || 'No notes'}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setNotesDialogOpen(true)}
              >
                Edit Notes
              </Button>

              <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Internal Notes</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add internal notes..."
                      rows={6}
                    />
                    <Button onClick={handleUpdateNotes} className="w-full">
                      Save Notes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              >
                {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </Select>

              {order.status !== 'CANCELLED' && (
                <>
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => setCancelDialogOpen(true)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel Order
                  </Button>

                  <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cancel Order</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          placeholder="Reason for cancellation (optional)..."
                          rows={3}
                        />
                        <Button
                          onClick={handleCancelOrder}
                          variant="outline"
                          className="w-full border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Confirm Cancellation
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Audit Log
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 space-y-3 overflow-y-auto">
              {auditLogs.length === 0 ? (
                <div className="py-4 text-center text-sm text-slate-500">
                  No activity logged
                </div>
              ) : (
                auditLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="rounded-lg border border-slate-100 bg-slate-50/50 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-semibold text-brand-ink">
                          {String(log.action || '').replace(/_/g, ' ')}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          {log.actor?.name || log.actor?.email || 'System'}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

