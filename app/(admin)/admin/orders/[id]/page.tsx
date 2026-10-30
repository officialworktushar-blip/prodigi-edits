'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, FileVideo, Download, Calendar, User, Clock, FileText, History, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/shared/status-badge';
import {
  getOrderById,
  getStaffProfiles,
  assignStaff,
  setDueDate,
  updateInternalNotes,
  uploadDraft,
  uploadDeliverable,
  updateStatus,
  cancelOrder,
} from '../actions';
import { createDownloadUrl } from '@/lib/storage';
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

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const orderId = params.id;
  const [data, setData] = useState<any>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

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
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [draftForm, setDraftForm] = useState({
    path: '',
    thumbnailPath: '',
    note: '',
  });
  const [deliverableForm, setDeliverableForm] = useState({
    name: '',
    path: '',
    type: '',
  });
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    loadData();
  }, [orderId]);

  async function loadData() {
    setLoading(true);
    try {
      const [orderData, staffData] = await Promise.all([
        getOrderById(orderId),
        getStaffProfiles(),
      ]);
      setData(orderData);
      setStaff(staffData);

      if (orderData?.order) {
        setAssignForm({
          managerId: orderData.order.manager_id || '',
          editorId: orderData.order.editor_id || '',
          thumbnailArtistId: orderData.order.thumbnail_artist_id || '',
        });
        setDueDate(orderData.order.due_at ? orderData.order.due_at.slice(0, 16) : '');
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
    const result = await setDueDate({
      orderId,
      dueAt: dueDate ? new Date(dueDate).toISOString() : null,
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
      setDraftForm({ path: '', thumbnailPath: '', note: '' });
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
      setDeliverableForm({ name: '', path: '', type: '' });
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

  async function handleFileUpload(type: 'draft' | 'draftThumbnail' | 'deliverable', file: File) {
    try {
      const signRes = await fetch('/api/upload/sign-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: `${orderId}/${type}/${Date.now()}-${file.name}`,
          bucket: type === 'deliverable' ? 'deliverables' : 'drafts',
        }),
      });

      if (!signRes.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { signedUrl, path } = await signRes.json();

      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload file');
      }

      if (type === 'draft') {
        setDraftForm({ ...draftForm, path });
      } else if (type === 'draftThumbnail') {
        setDraftForm({ ...draftForm, thumbnailPath: path });
      } else {
        setDeliverableForm({ ...deliverableForm, path });
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    }
  }

  async function handleDownload(path: string, bucket: string) {
    try {
      const url = await createDownloadUrl(path, 3600, bucket);
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

  const { order, drafts, deliverables, comments, auditLogs } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="ghost" size="icon">
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
        <div className="lg:col-span-2 space-y-6">
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
                    <Badge variant="outline">{KIND_LABELS[order.kind]}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Due Date
                  </label>
                  <div className="mt-1 text-sm text-slate-600">
                    {order.due_at
                      ? new Date(order.due_at).toLocaleString()
                      : 'Not set'}
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
                  <div className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">
                    {order.brief}
                  </div>
                </div>
              )}

              {order.reference_links && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Reference Links
                  </label>
                  <div className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">
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
              <CardDescription>
                Video drafts for customer review
              </CardDescription>
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
                        <div className="mt-0.5 text-xs text-slate-500">
                          {draft.note}
                        </div>
                      )}
                      <div className="mt-1 text-xs text-slate-400">
                        {new Date(draft.created_at).toLocaleString()}
                      </div>
                    </div>
                    {draft.path && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(draft.path, 'drafts')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}

              <Dialog open={draftDialogOpen} onOpenChange={setDraftDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Draft
                  </Button>
                </DialogTrigger>
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
                      {draftForm.path && (
                        <div className="mt-1 text-xs text-green-600">
                          File ready to upload
                        </div>
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
                          setDraftForm({ ...draftForm, note: e.target.value })
                        }
                        placeholder="Add a note for the customer..."
                        className="mt-1"
                      />
                    </div>

                    <Button
                      onClick={handleUploadDraft}
                      disabled={uploading || !draftForm.path}
                      className="w-full"
                    >
                      {uploading ? 'Uploading...' : 'Upload Draft'}
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
              <CardDescription>
                Final files for customer download
              </CardDescription>
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
                      <div className="font-semibold text-brand-ink">
                        {del.name}
                      </div>
                      {del.type && (
                        <div className="mt-0.5 text-xs text-slate-500">
                          {del.type}
                        </div>
                      )}
                      <div className="mt-1 text-xs text-slate-400">
                        {new Date(del.created_at).toLocaleString()}
                      </div>
                    </div>
                    {del.path && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(del.path, 'deliverables')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}

              <Dialog
                open={deliverableDialogOpen}
                onOpenChange={setDeliverableDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Deliverable
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Deliverable</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Name *
                      </label>
                      <Input
                        value={deliverableForm.name}
                        onChange={(e) =>
                          setDeliverableForm({
                            ...deliverableForm,
                            name: e.target.value,
                          })
                        }
                        placeholder="e.g., Final video v1"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        File *
                      </label>
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload('deliverable', file);
                            if (!deliverableForm.name) {
                              setDeliverableForm({
                                ...deliverableForm,
                                name: file.name,
                              });
                            }
                          }
                        }}
                        className="mt-1"
                      />
                      {deliverableForm.path && (
                        <div className="mt-1 text-xs text-green-600">
                          File ready to upload
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Type (optional)
                      </label>
                      <Input
                        value={deliverableForm.type}
                        onChange={(e) =>
                          setDeliverableForm({
                            ...deliverableForm,
                            type: e.target.value,
                          })
                        }
                        placeholder="e.g., MP4, MOV"
                        className="mt-1"
                      />
                    </div>

                    <Button
                      onClick={handleUploadDeliverable}
                      disabled={uploading || !deliverableForm.path}
                      className="w-full"
                    >
                      {uploading ? 'Uploading...' : 'Upload Deliverable'}
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
              <CardDescription>
                Customer feedback on drafts
              </CardDescription>
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
                        <div className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">
                          {comment.body}
                        </div>
                        {comment.timestamp_sec && (
                          <div className="mt-1 text-xs text-slate-400">
                            Timestamp: {Math.floor(comment.timestamp_sec)}s
                          </div>
                        )}
                      </div>
                      <Badge
                        variant={comment.status === 'OPEN' ? 'warning' : 'success'}
                      >
                        {comment.status}
                      </Badge>
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

              <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Assign Staff
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Staff</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Manager
                      </label>
                      <Select
                        value={assignForm.managerId}
                        onChange={(e) =>
                          setAssignForm({ ...assignForm, managerId: e.target.value })
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
                        Editor
                      </label>
                      <Select
                        value={assignForm.editorId}
                        onChange={(e) =>
                          setAssignForm({ ...assignForm, editorId: e.target.value })
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
                          setAssignForm({
                            ...assignForm,
                            thumbnailArtistId: e.target.value,
                          })
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
                {order.due_at
                  ? new Date(order.due_at).toLocaleString()
                  : 'Not set'}
              </div>

              <Dialog open={dueDateDialogOpen} onOpenChange={setDueDateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Set Due Date
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Due Date</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Due Date & Time
                      </label>
                      <Input
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
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
              <div className="text-sm text-slate-600 whitespace-pre-wrap">
                {order.brief || 'No notes'}
              </div>

              <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Edit Notes
                  </Button>
                </DialogTrigger>
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
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="REVISION_REQUESTED">Revision Requested</option>
                <option value="APPROVED">Approved</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </Select>

              {order.status !== 'CANCELLED' && (
                <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="danger" className="w-full">
                      <X className="mr-2 h-4 w-4" />
                      Cancel Order
                    </Button>
                  </DialogTrigger>
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
                        variant="danger"
                        className="w-full"
                      >
                        Confirm Cancellation
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
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
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
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
                          {log.action.replace(/_/g, ' ')}
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
