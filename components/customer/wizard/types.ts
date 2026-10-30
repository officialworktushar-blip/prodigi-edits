import type { OrderKind } from '@/types/db';

export interface WizardWorkspace {
  id: string;
  name: string;
  notes: string | null;
}

export interface WizardAddOn {
  id: string;
  name: string;
  price: number;
}

export interface WizardPackage {
  id: string;
  name: string;
  kind: OrderKind;
  videoCount: number;
  pricePerVideo: number;
  discountPercent: number;
}

export interface WizardCredit {
  kind: OrderKind;
  balance: number;
}

export interface IdeaValues {
  kind: OrderKind;
  title: string;
  brief: string;
  referenceLinks: string;
}

export interface FootageValues {
  cloudLink: string;
  rawFootageMinutes: string;
  footageSizeGb: string;
}

export interface WizardQuote {
  basePrice: number;
  addOnTotal: number;
  subtotal: number;
  couponDiscount: number;
  creditDiscount: number;
  total: number;
  couponCode: string | null;
}

export interface WizardSuccess {
  ok: true;
  orderId: string;
  orderNo: number | null;
  quote?: WizardQuote;
}

export interface WizardFailure {
  ok: false;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export type WizardActionResult = WizardSuccess | WizardFailure;

export interface CouponPreview {
  code: string;
  discount: number;
  message: string;
}

export type CouponPreviewResult =
  | { ok: true; preview: CouponPreview }
  | { ok: false; message: string };

export interface SubmittedOrder {
  orderId: string;
  orderNo: number | null;
  total: number | null;
}

export interface UploadedFootage {
  id: string;
  name: string;
  size: number | null;
  path: string | null;
  createdAt: string;
}

export type UploadFootageResult =
  | { ok: true; file: UploadedFootage }
  | { ok: false; message: string };

export type RemoveUploadResult =
  | { ok: true }
  | { ok: false; message: string };
