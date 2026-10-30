export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'CUSTOMER' | 'EDITOR' | 'ADMIN';
export type MemberRole = 'OWNER' | 'MANAGER' | 'VIEWER';
export type OrderKind = 'HORIZONTAL' | 'VERTICAL' | 'THUMBNAIL';
export type OrderStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'IN_REVIEW'
  | 'REVISION_REQUESTED'
  | 'APPROVED'
  | 'DELIVERED'
  | 'CANCELLED';
export type CommentStatus = 'OPEN' | 'RESOLVED';
export type PlanType = 'STARTER' | 'PRO';
export type BillingType = 'QUARTERLY' | 'ANNUAL';

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Workspace {
  id: string;
  owner_id: string;
  name: string;
  type: string | null;
  notes: string | null;
  logo_url: string | null;
  created_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: MemberRole;
  created_at: string;
}

export interface Invite {
  id: string;
  workspace_id: string;
  email: string;
  role: MemberRole;
  token: string;
  status: string;
  created_at: string;
}

export interface Package {
  id: string;
  name: string;
  kind: OrderKind;
  video_count: number;
  price_per_video: number;
  discount_percent: number;
  is_active: boolean;
  created_at: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  is_active: boolean;
  created_at: string;
}

export interface Credit {
  id: string;
  user_id: string;
  kind: OrderKind;
  balance: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_no: number;
  workspace_id: string;
  customer_id: string;
  kind: OrderKind;
  title: string;
  brief: string | null;
  reference_links: string | null;
  raw_footage_minutes: number | null;
  status: OrderStatus;
  due_at: string | null;
  manager_id: string | null;
  editor_id: string | null;
  thumbnail_artist_id: string | null;
  created_at: string;
}

export interface OrderAddOn {
  order_id: string;
  add_on_id: string;
}

export interface FootageFile {
  id: string;
  order_id: string;
  name: string;
  size: number | null;
  path: string | null;
  url: string | null;
  source: string;
  created_at: string;
}

export interface Draft {
  id: string;
  order_id: string;
  version: number;
  path: string | null;
  thumbnail_path: string | null;
  note: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ReviewComment {
  id: string;
  draft_id: string;
  author_id: string;
  timestamp_sec: number | null;
  body: string;
  status: CommentStatus;
  parent_id: string | null;
  created_at: string;
}

export interface Deliverable {
  id: string;
  order_id: string;
  name: string;
  path: string | null;
  type: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  order_id: string | null;
  workspace_id: string;
  sender_id: string;
  body: string;
  attachment_path: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  href: string | null;
  read_at: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: PlanType;
  billing: BillingType;
  status: string;
  current_period_end: string | null;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: string | null;
  value: number;
  expires_at: string | null;
  usage_limit: number | null;
  used: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  is_published: boolean;
  created_at: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  body: string | null;
  is_published: boolean;
  created_at: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity: string | null;
  entity_id: string | null;
  meta: Json | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}
