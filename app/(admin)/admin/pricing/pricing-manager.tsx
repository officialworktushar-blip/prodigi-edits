'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { AddOn, OrderKind, Package } from '@/types/db';
import {
  deleteAddOn,
  deletePackage,
  saveAddOn,
  savePackage,
  setAddOnActive,
  setPackageActive,
} from './actions';

export interface PricingManagerProps {
  packages: Package[];
  addOns: AddOn[];
}

interface PackageDraft {
  id?: string;
  name: string;
  kind: OrderKind;
  videoCount: string;
  pricePerVideo: string;
  discountPercent: string;
  isActive: boolean;
}

interface AddOnDraft {
  id?: string;
  name: string;
  price: string;
  isActive: boolean;
}

const EMPTY_PACKAGE: PackageDraft = {
  name: '',
  kind: 'HORIZONTAL',
  videoCount: '1',
  pricePerVideo: '',
  discountPercent: '0',
  isActive: true,
};

const EMPTY_ADD_ON: AddOnDraft = { name: '', price: '', isActive: true };

function money(value: number): string {
  return `$${Number(value).toFixed(2)}`;
}

export function PricingManager({ packages, addOns }: PricingManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [packageDraft, setPackageDraft] = useState<PackageDraft | null>(null);
  const [addOnDraft, setAddOnDraft] = useState<AddOnDraft | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);

  function run(task: () => Promise<{ success: boolean; error?: string }>, onDone?: () => void) {
    setMessage(null);
    setDialogError(null);
    startTransition(async () => {
      const result = await task();

      if (result.success) {
        onDone?.();
        router.refresh();
      } else {
        const text = result.error ?? 'Something went wrong.';
        setMessage(text);
        setDialogError(text);
      }
    });
  }

  function submitPackage() {
    if (!packageDraft) {
      return;
    }

    const draft = packageDraft;

    run(
      () =>
        savePackage({
          id: draft.id,
          name: draft.name,
          kind: draft.kind,
          videoCount: Number(draft.videoCount),
          pricePerVideo: Number(draft.pricePerVideo),
          discountPercent: Number(draft.discountPercent || 0),
          isActive: draft.isActive,
        }),
      () => setPackageDraft(null)
    );
  }

  function submitAddOn() {
    if (!addOnDraft) {
      return;
    }

    const draft = addOnDraft;

    run(
      () =>
        saveAddOn({
          id: draft.id,
          name: draft.name,
          price: Number(draft.price),
          isActive: draft.isActive,
        }),
      () => setAddOnDraft(null)
    );
  }

  return (
    <div className="space-y-6">
      {message ? (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {message}
        </p>
      ) : null}

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Packages</CardTitle>
          <Button
            size="sm"
            onClick={() => {
              setDialogError(null);
              setPackageDraft(EMPTY_PACKAGE);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New package
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {packages.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No packages yet.</p>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="py-2 pr-3 font-semibold">Name</th>
                  <th className="py-2 pr-3 font-semibold">Type</th>
                  <th className="py-2 pr-3 text-right font-semibold">Videos</th>
                  <th className="py-2 pr-3 text-right font-semibold">Per video</th>
                  <th className="py-2 pr-3 text-right font-semibold">Discount</th>
                  <th className="py-2 pr-3 font-semibold">Status</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {packages.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 pr-3 font-semibold text-brand-ink">{item.name}</td>
                    <td className="py-3 pr-3 text-slate-600">{item.kind.toLowerCase()}</td>
                    <td className="py-3 pr-3 text-right text-slate-600">{item.video_count}</td>
                    <td className="py-3 pr-3 text-right text-slate-600">
                      {money(item.price_per_video)}
                    </td>
                    <td className="py-3 pr-3 text-right text-slate-600">
                      {Number(item.discount_percent)}%
                    </td>
                    <td className="py-3 pr-3">
                      <Badge variant={item.is_active ? 'success' : 'outline'}>
                        {item.is_active ? 'Active' : 'Hidden'}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setDialogError(null);
                            setPackageDraft({
                              id: item.id,
                              name: item.name,
                              kind: item.kind,
                              videoCount: String(item.video_count),
                              pricePerVideo: String(item.price_per_video),
                              discountPercent: String(item.discount_percent),
                              isActive: item.is_active,
                            });
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isPending}
                          onClick={() =>
                            run(() => setPackageActive({ id: item.id, isActive: !item.is_active }))
                          }
                        >
                          {item.is_active ? 'Hide' : 'Show'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          disabled={isPending}
                          onClick={() => {
                            if (window.confirm(`Delete package "${item.name}"?`)) {
                              run(() => deletePackage({ id: item.id }));
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Add-ons</CardTitle>
          <Button
            size="sm"
            onClick={() => {
              setDialogError(null);
              setAddOnDraft(EMPTY_ADD_ON);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New add-on
          </Button>
        </CardHeader>
        <CardContent>
          {addOns.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No add-ons yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {addOns.map((item) => (
                <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold text-brand-ink">{item.name}</p>
                    <p className="text-sm text-slate-500">{money(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant={item.is_active ? 'success' : 'outline'}>
                      {item.is_active ? 'Active' : 'Hidden'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setDialogError(null);
                        setAddOnDraft({
                          id: item.id,
                          name: item.name,
                          price: String(item.price),
                          isActive: item.is_active,
                        });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={isPending}
                      onClick={() =>
                        run(() => setAddOnActive({ id: item.id, isActive: !item.is_active }))
                      }
                    >
                      {item.is_active ? 'Hide' : 'Show'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      disabled={isPending}
                      onClick={() => {
                        if (window.confirm(`Delete add-on "${item.name}"?`)) {
                          run(() => deleteAddOn({ id: item.id }));
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={packageDraft !== null}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setPackageDraft(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{packageDraft?.id ? 'Edit package' : 'New package'}</DialogTitle>
          </DialogHeader>
          {packageDraft ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="pkg-name" className="text-sm font-medium text-slate-700">
                  Name
                </label>
                <Input
                  id="pkg-name"
                  value={packageDraft.name}
                  onChange={(event) => setPackageDraft({ ...packageDraft, name: event.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="pkg-kind" className="text-sm font-medium text-slate-700">
                    Type
                  </label>
                  <Select
                    id="pkg-kind"
                    value={packageDraft.kind}
                    onChange={(event) =>
                      setPackageDraft({ ...packageDraft, kind: event.target.value as OrderKind })
                    }
                    className="mt-1"
                  >
                    <option value="HORIZONTAL">Horizontal</option>
                    <option value="VERTICAL">Vertical</option>
                    <option value="THUMBNAIL">Thumbnail</option>
                  </Select>
                </div>
                <div>
                  <label htmlFor="pkg-count" className="text-sm font-medium text-slate-700">
                    Videos
                  </label>
                  <Input
                    id="pkg-count"
                    type="number"
                    min={1}
                    step={1}
                    value={packageDraft.videoCount}
                    onChange={(event) =>
                      setPackageDraft({ ...packageDraft, videoCount: event.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="pkg-price" className="text-sm font-medium text-slate-700">
                    Price per video ($)
                  </label>
                  <Input
                    id="pkg-price"
                    type="number"
                    min={0}
                    step="0.01"
                    value={packageDraft.pricePerVideo}
                    onChange={(event) =>
                      setPackageDraft({ ...packageDraft, pricePerVideo: event.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="pkg-discount" className="text-sm font-medium text-slate-700">
                    Discount (%)
                  </label>
                  <Input
                    id="pkg-discount"
                    type="number"
                    min={0}
                    max={100}
                    step="0.01"
                    value={packageDraft.discountPercent}
                    onChange={(event) =>
                      setPackageDraft({ ...packageDraft, discountPercent: event.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={packageDraft.isActive}
                  onChange={(event) =>
                    setPackageDraft({ ...packageDraft, isActive: event.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
                Visible on the pricing page
              </label>
              {dialogError ? (
                <p role="alert" className="text-sm text-red-600">
                  {dialogError}
                </p>
              ) : null}
              <DialogFooter>
                <Button variant="outline" onClick={() => setPackageDraft(null)}>
                  Cancel
                </Button>
                <Button onClick={submitPackage} isLoading={isPending}>
                  Save
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={addOnDraft !== null}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setAddOnDraft(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{addOnDraft?.id ? 'Edit add-on' : 'New add-on'}</DialogTitle>
          </DialogHeader>
          {addOnDraft ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="addon-name" className="text-sm font-medium text-slate-700">
                  Name
                </label>
                <Input
                  id="addon-name"
                  value={addOnDraft.name}
                  onChange={(event) => setAddOnDraft({ ...addOnDraft, name: event.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="addon-price" className="text-sm font-medium text-slate-700">
                  Price ($)
                </label>
                <Input
                  id="addon-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={addOnDraft.price}
                  onChange={(event) => setAddOnDraft({ ...addOnDraft, price: event.target.value })}
                  className="mt-1"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={addOnDraft.isActive}
                  onChange={(event) =>
                    setAddOnDraft({ ...addOnDraft, isActive: event.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
                Available in the order wizard
              </label>
              {dialogError ? (
                <p role="alert" className="text-sm text-red-600">
                  {dialogError}
                </p>
              ) : null}
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddOnDraft(null)}>
                  Cancel
                </Button>
                <Button onClick={submitAddOn} isLoading={isPending}>
                  Save
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
