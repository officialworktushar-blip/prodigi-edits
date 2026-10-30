-- =============================================================================
-- CutCrew Supabase schema
-- Idempotent: safe to run multiple times in the Supabase SQL Editor.
-- Contains: extensions, enums, tables, indexes, functions, triggers, RLS.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Extensions
-- -----------------------------------------------------------------------------
create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
do $$
begin
  create type public.user_role as enum ('CUSTOMER', 'EDITOR', 'ADMIN');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.member_role as enum ('OWNER', 'MANAGER', 'VIEWER');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.order_kind as enum ('HORIZONTAL', 'VERTICAL', 'THUMBNAIL');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.order_status as enum (
    'DRAFT',
    'SUBMITTED',
    'ASSIGNED',
    'IN_PROGRESS',
    'IN_REVIEW',
    'REVISION_REQUESTED',
    'APPROVED',
    'DELIVERED',
    'CANCELLED'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.comment_status as enum ('OPEN', 'RESOLVED');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.plan_type as enum ('STARTER', 'PRO');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.billing_type as enum ('QUARTERLY', 'ANNUAL');
exception
  when duplicate_object then null;
end $$;

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  role public.user_role not null default 'CUSTOMER',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  type text,
  notes text,
  logo_url text,
  brand_heading_font text not null default 'Inter',
  brand_body_font text not null default 'Inter',
  brand_primary_color text not null default '#4F46E5',
  brand_accent_color text not null default '#3B82F6',
  created_at timestamptz not null default now()
);

alter table public.workspaces
  add column if not exists brand_heading_font text not null default 'Inter',
  add column if not exists brand_body_font text not null default 'Inter',
  add column if not exists brand_primary_color text not null default '#4F46E5',
  add column if not exists brand_accent_color text not null default '#3B82F6';

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.member_role not null default 'VIEWER',
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text not null,
  role public.member_role not null default 'VIEWER',
  token text not null unique,
  status text not null default 'PENDING',
  created_at timestamptz not null default now()
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind public.order_kind not null,
  video_count int not null default 0,
  price_per_video numeric(12, 2) not null default 0,
  discount_percent numeric(5, 2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.add_ons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12, 2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind public.order_kind not null,
  balance int not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, kind)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no bigint generated always as identity unique,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  kind public.order_kind not null,
  title text not null,
  brief text,
  reference_links text,
  raw_footage_minutes numeric(8, 2),
  status public.order_status not null default 'DRAFT',
  due_at timestamptz,
  manager_id uuid references public.profiles(id) on delete set null,
  editor_id uuid references public.profiles(id) on delete set null,
  thumbnail_artist_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_add_ons (
  order_id uuid not null references public.orders(id) on delete cascade,
  add_on_id uuid not null references public.add_ons(id) on delete cascade,
  primary key (order_id, add_on_id)
);

create table if not exists public.footage_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  name text not null,
  size bigint,
  path text,
  url text,
  source text not null default 'UPLOAD',
  created_at timestamptz not null default now()
);

create table if not exists public.drafts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  version int not null default 1,
  path text,
  thumbnail_path text,
  note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (order_id, version)
);

create table if not exists public.review_comments (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null references public.drafts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  timestamp_sec numeric(10, 2),
  body text not null,
  status public.comment_status not null default 'OPEN',
  parent_id uuid references public.review_comments(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.deliverables (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  name text not null,
  path text,
  type text,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  attachment_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan public.plan_type not null,
  billing public.billing_type not null,
  status text not null default 'ACTIVE',
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  type text,
  value numeric(12, 2) not null default 0,
  expires_at timestamptz,
  usage_limit int,
  used int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  quote text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  body text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity text,
  entity_id text,
  meta jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_email on public.profiles(email);

create index if not exists idx_workspaces_owner on public.workspaces(owner_id);
create index if not exists idx_workspace_members_workspace on public.workspace_members(workspace_id);
create index if not exists idx_workspace_members_user on public.workspace_members(user_id);
create index if not exists idx_invites_workspace on public.invites(workspace_id);
create index if not exists idx_invites_email on public.invites(email);

create index if not exists idx_credits_user on public.credits(user_id);

create index if not exists idx_orders_workspace on public.orders(workspace_id);
create index if not exists idx_orders_customer on public.orders(customer_id);
create index if not exists idx_orders_manager on public.orders(manager_id);
create index if not exists idx_orders_editor on public.orders(editor_id);
create index if not exists idx_orders_thumbnail_artist on public.orders(thumbnail_artist_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_due_at on public.orders(due_at);

create index if not exists idx_footage_files_order on public.footage_files(order_id);
create index if not exists idx_drafts_order on public.drafts(order_id);
create index if not exists idx_review_comments_draft on public.review_comments(draft_id);
create index if not exists idx_review_comments_author on public.review_comments(author_id);
create index if not exists idx_deliverables_order on public.deliverables(order_id);
create index if not exists idx_messages_order on public.messages(order_id);
create index if not exists idx_messages_workspace on public.messages(workspace_id);
create index if not exists idx_messages_sender on public.messages(sender_id);
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_notifications_unread on public.notifications(user_id) where read_at is null;
create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_audit_logs_actor on public.audit_logs(actor_id);
create index if not exists idx_case_studies_published on public.case_studies(is_published);
create index if not exists idx_faq_items_published on public.faq_items(is_published, sort_order);

-- -----------------------------------------------------------------------------
-- Functions
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'ADMIN'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('ADMIN', 'EDITOR')
  );
$$;

create or replace function public.has_workspace_access(ws uuid, min_role text default 'VIEWER')
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when auth.uid() is null then false
    when public.is_admin() then true
    when exists (
      select 1
      from public.workspaces w
      where w.id = ws
        and w.owner_id = auth.uid()
    ) then true
    else exists (
      select 1
      from public.workspace_members m
      where m.workspace_id = ws
        and m.user_id = auth.uid()
        and case upper(min_role)
              when 'OWNER' then 3
              when 'MANAGER' then 2
              else 1
            end <= case m.role::text
              when 'OWNER' then 3
              when 'MANAGER' then 2
              else 1
            end
    )
  end;
$$;

create or replace function public.can_access_order(p_order_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.orders o
    where o.id = p_order_id
      and (
        public.is_admin()
        or public.has_workspace_access(o.workspace_id)
        or (
          public.is_staff()
          and (
            o.manager_id = auth.uid()
            or o.editor_id = auth.uid()
            or o.thumbnail_artist_id = auth.uid()
          )
        )
      )
  );
$$;

create or replace function public.can_manage_order(p_order_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.orders o
    where o.id = p_order_id
      and (
        public.is_admin()
        or (
          public.is_staff()
          and (
            o.manager_id = auth.uid()
            or o.editor_id = auth.uid()
            or o.thumbnail_artist_id = auth.uid()
          )
        )
      )
  );
$$;

create or replace function public.can_access_draft(p_draft_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.drafts d
    where d.id = p_draft_id
      and public.can_access_order(d.order_id)
  );
$$;

create or replace function public.can_manage_draft(p_draft_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.drafts d
    where d.id = p_draft_id
      and public.can_manage_order(d.order_id)
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_workspace_id uuid;
begin
  v_name := coalesce(
    nullif(new.raw_user_meta_data ->> 'name', ''),
    split_part(coalesce(new.email, ''), '@', 1)
  );

  if v_name is null or btrim(v_name) = '' then
    v_name := 'New User';
  end if;

  insert into public.profiles (id, name, email, role)
  values (new.id, v_name, new.email, 'CUSTOMER')
  on conflict (id) do nothing;

  insert into public.workspaces (owner_id, name, type)
  values (new.id, v_name || '''s Workspace', 'PERSONAL')
  returning id into v_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (v_workspace_id, new.id, 'OWNER')
  on conflict (workspace_id, user_id) do nothing;

  insert into public.notifications (user_id, title, body, href)
  values (
    new.id,
    'Welcome to CutCrew',
    'Your workspace is ready. Start by creating your first order.',
    '/app'
  );

  return new;
end;
$$;

create or replace function public.enforce_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null
     and new.role is distinct from old.role
     and not public.is_admin() then
    raise exception 'Only admins can change a profile role';
  end if;

  return new;
end;
$$;

create or replace function public.enforce_order_sensitive_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null
     and not public.is_staff()
     and (
       new.manager_id is distinct from old.manager_id
       or new.editor_id is distinct from old.editor_id
       or new.thumbnail_artist_id is distinct from old.thumbnail_artist_id
       or new.due_at is distinct from old.due_at
     ) then
    raise exception 'Only staff can change order assignment or due date';
  end if;

  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Triggers
-- -----------------------------------------------------------------------------
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

drop trigger if exists profiles_enforce_role on public.profiles;
create trigger profiles_enforce_role
  before update on public.profiles
  for each row
  execute function public.enforce_profile_role();

drop trigger if exists orders_enforce_sensitive_fields on public.orders;
create trigger orders_enforce_sensitive_fields
  before update on public.orders
  for each row
  execute function public.enforce_order_sensitive_fields();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.invites enable row level security;
alter table public.packages enable row level security;
alter table public.add_ons enable row level security;
alter table public.credits enable row level security;
alter table public.orders enable row level security;
alter table public.order_add_ons enable row level security;
alter table public.footage_files enable row level security;
alter table public.drafts enable row level security;
alter table public.review_comments enable row level security;
alter table public.deliverables enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.subscriptions enable row level security;
alter table public.coupons enable row level security;
alter table public.testimonials enable row level security;
alter table public.case_studies enable row level security;
alter table public.faq_items enable row level security;
alter table public.audit_logs enable row level security;
alter table public.contact_messages enable row level security;

-- profiles --------------------------------------------------------------------
drop policy if exists "profiles_select_own_or_staff" on public.profiles;
create policy "profiles_select_own_or_staff"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_staff());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- workspaces ------------------------------------------------------------------
drop policy if exists "workspaces_select_access" on public.workspaces;
create policy "workspaces_select_access"
  on public.workspaces for select
  to authenticated
  using (public.has_workspace_access(id));

drop policy if exists "workspaces_insert_owner" on public.workspaces;
create policy "workspaces_insert_owner"
  on public.workspaces for insert
  to authenticated
  with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists "workspaces_update_manager" on public.workspaces;
create policy "workspaces_update_manager"
  on public.workspaces for update
  to authenticated
  using (public.has_workspace_access(id, 'MANAGER') or public.is_admin())
  with check (public.has_workspace_access(id, 'MANAGER') or public.is_admin());

drop policy if exists "workspaces_delete_owner" on public.workspaces;
create policy "workspaces_delete_owner"
  on public.workspaces for delete
  to authenticated
  using (public.has_workspace_access(id, 'OWNER') or public.is_admin());

-- workspace_members -----------------------------------------------------------
drop policy if exists "workspace_members_select_access" on public.workspace_members;
create policy "workspace_members_select_access"
  on public.workspace_members for select
  to authenticated
  using (public.has_workspace_access(workspace_id));

drop policy if exists "workspace_members_insert_manager" on public.workspace_members;
create policy "workspace_members_insert_manager"
  on public.workspace_members for insert
  to authenticated
  with check (public.has_workspace_access(workspace_id, 'MANAGER') or public.is_admin());

drop policy if exists "workspace_members_update_manager" on public.workspace_members;
create policy "workspace_members_update_manager"
  on public.workspace_members for update
  to authenticated
  using (public.has_workspace_access(workspace_id, 'MANAGER') or public.is_admin())
  with check (public.has_workspace_access(workspace_id, 'MANAGER') or public.is_admin());

drop policy if exists "workspace_members_delete_manager" on public.workspace_members;
create policy "workspace_members_delete_manager"
  on public.workspace_members for delete
  to authenticated
  using (public.has_workspace_access(workspace_id, 'MANAGER') or public.is_admin());

-- invites ---------------------------------------------------------------------
drop policy if exists "invites_select_access" on public.invites;
create policy "invites_select_access"
  on public.invites for select
  to authenticated
  using (public.has_workspace_access(workspace_id, 'MANAGER') or public.is_admin());

drop policy if exists "invites_insert_manager" on public.invites;
create policy "invites_insert_manager"
  on public.invites for insert
  to authenticated
  with check (public.has_workspace_access(workspace_id, 'MANAGER') or public.is_admin());

drop policy if exists "invites_update_manager" on public.invites;
create policy "invites_update_manager"
  on public.invites for update
  to authenticated
  using (public.has_workspace_access(workspace_id, 'MANAGER') or public.is_admin())
  with check (public.has_workspace_access(workspace_id, 'MANAGER') or public.is_admin());

drop policy if exists "invites_delete_manager" on public.invites;
create policy "invites_delete_manager"
  on public.invites for delete
  to authenticated
  using (public.has_workspace_access(workspace_id, 'MANAGER') or public.is_admin());

-- packages --------------------------------------------------------------------
drop policy if exists "packages_public_read" on public.packages;
create policy "packages_public_read"
  on public.packages for select
  to anon, authenticated
  using (true);

drop policy if exists "packages_admin_write" on public.packages;
create policy "packages_admin_write"
  on public.packages for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- add_ons ---------------------------------------------------------------------
drop policy if exists "add_ons_public_read" on public.add_ons;
create policy "add_ons_public_read"
  on public.add_ons for select
  to anon, authenticated
  using (true);

drop policy if exists "add_ons_admin_write" on public.add_ons;
create policy "add_ons_admin_write"
  on public.add_ons for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- credits ---------------------------------------------------------------------
drop policy if exists "credits_select_own_or_admin" on public.credits;
create policy "credits_select_own_or_admin"
  on public.credits for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "credits_admin_write" on public.credits;
create policy "credits_admin_write"
  on public.credits for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- orders ----------------------------------------------------------------------
drop policy if exists "orders_select_access" on public.orders;
create policy "orders_select_access"
  on public.orders for select
  to authenticated
  using (
    public.is_admin()
    or customer_id = auth.uid()
    or public.has_workspace_access(workspace_id)
    or editor_id = auth.uid()
    or manager_id = auth.uid()
    or thumbnail_artist_id = auth.uid()
  );

drop policy if exists "orders_insert_access" on public.orders;
create policy "orders_insert_access"
  on public.orders for insert
  to authenticated
  with check (
    public.is_admin()
    or (customer_id = auth.uid() and public.has_workspace_access(workspace_id))
    or public.has_workspace_access(workspace_id, 'MANAGER')
  );

drop policy if exists "orders_update_access" on public.orders;
create policy "orders_update_access"
  on public.orders for update
  to authenticated
  using (public.can_access_order(id))
  with check (
    public.is_admin()
    or public.has_workspace_access(workspace_id)
    or (
      public.is_staff()
      and (
        manager_id = auth.uid()
        or editor_id = auth.uid()
        or thumbnail_artist_id = auth.uid()
      )
    )
  );

drop policy if exists "orders_delete_manager" on public.orders;
create policy "orders_delete_manager"
  on public.orders for delete
  to authenticated
  using (public.has_workspace_access(workspace_id, 'MANAGER') or public.is_admin());

-- order_add_ons ---------------------------------------------------------------
drop policy if exists "order_add_ons_select_access" on public.order_add_ons;
create policy "order_add_ons_select_access"
  on public.order_add_ons for select
  to authenticated
  using (public.can_access_order(order_id));

drop policy if exists "order_add_ons_insert_access" on public.order_add_ons;
create policy "order_add_ons_insert_access"
  on public.order_add_ons for insert
  to authenticated
  with check (public.can_access_order(order_id));

drop policy if exists "order_add_ons_delete_access" on public.order_add_ons;
create policy "order_add_ons_delete_access"
  on public.order_add_ons for delete
  to authenticated
  using (public.can_access_order(order_id));

-- footage_files ---------------------------------------------------------------
drop policy if exists "footage_files_select_access" on public.footage_files;
create policy "footage_files_select_access"
  on public.footage_files for select
  to authenticated
  using (public.can_access_order(order_id));

drop policy if exists "footage_files_insert_access" on public.footage_files;
create policy "footage_files_insert_access"
  on public.footage_files for insert
  to authenticated
  with check (public.can_access_order(order_id));

drop policy if exists "footage_files_update_access" on public.footage_files;
create policy "footage_files_update_access"
  on public.footage_files for update
  to authenticated
  using (public.can_access_order(order_id))
  with check (public.can_access_order(order_id));

drop policy if exists "footage_files_delete_access" on public.footage_files;
create policy "footage_files_delete_access"
  on public.footage_files for delete
  to authenticated
  using (public.can_access_order(order_id));

-- drafts ----------------------------------------------------------------------
drop policy if exists "drafts_select_access" on public.drafts;
create policy "drafts_select_access"
  on public.drafts for select
  to authenticated
  using (public.can_access_order(order_id));

drop policy if exists "drafts_insert_staff" on public.drafts;
create policy "drafts_insert_staff"
  on public.drafts for insert
  to authenticated
  with check (public.can_manage_order(order_id));

drop policy if exists "drafts_update_staff" on public.drafts;
create policy "drafts_update_staff"
  on public.drafts for update
  to authenticated
  using (public.can_manage_order(order_id))
  with check (public.can_manage_order(order_id));

drop policy if exists "drafts_delete_staff" on public.drafts;
create policy "drafts_delete_staff"
  on public.drafts for delete
  to authenticated
  using (public.can_manage_order(order_id));

-- review_comments -------------------------------------------------------------
drop policy if exists "review_comments_select_access" on public.review_comments;
create policy "review_comments_select_access"
  on public.review_comments for select
  to authenticated
  using (public.can_access_draft(draft_id));

drop policy if exists "review_comments_insert_access" on public.review_comments;
create policy "review_comments_insert_access"
  on public.review_comments for insert
  to authenticated
  with check (author_id = auth.uid() and public.can_access_draft(draft_id));

drop policy if exists "review_comments_update_author_or_staff" on public.review_comments;
create policy "review_comments_update_author_or_staff"
  on public.review_comments for update
  to authenticated
  using (
    (author_id = auth.uid() and public.can_access_draft(draft_id))
    or public.can_manage_draft(draft_id)
  )
  with check (
    (author_id = auth.uid() and public.can_access_draft(draft_id))
    or public.can_manage_draft(draft_id)
  );

drop policy if exists "review_comments_delete_author_or_staff" on public.review_comments;
create policy "review_comments_delete_author_or_staff"
  on public.review_comments for delete
  to authenticated
  using (
    (author_id = auth.uid() and public.can_access_draft(draft_id))
    or public.can_manage_draft(draft_id)
  );

-- deliverables ----------------------------------------------------------------
drop policy if exists "deliverables_select_access" on public.deliverables;
create policy "deliverables_select_access"
  on public.deliverables for select
  to authenticated
  using (public.can_access_order(order_id));

drop policy if exists "deliverables_insert_staff" on public.deliverables;
create policy "deliverables_insert_staff"
  on public.deliverables for insert
  to authenticated
  with check (public.can_manage_order(order_id));

drop policy if exists "deliverables_update_staff" on public.deliverables;
create policy "deliverables_update_staff"
  on public.deliverables for update
  to authenticated
  using (public.can_manage_order(order_id))
  with check (public.can_manage_order(order_id));

drop policy if exists "deliverables_delete_staff" on public.deliverables;
create policy "deliverables_delete_staff"
  on public.deliverables for delete
  to authenticated
  using (public.can_manage_order(order_id));

-- messages --------------------------------------------------------------------
drop policy if exists "messages_select_access" on public.messages;
create policy "messages_select_access"
  on public.messages for select
  to authenticated
  using (
    (order_id is not null and public.can_access_order(order_id))
    or public.has_workspace_access(workspace_id)
  );

drop policy if exists "messages_insert_access" on public.messages;
create policy "messages_insert_access"
  on public.messages for insert
  to authenticated
  with check (
    (sender_id = auth.uid() or public.is_admin())
    and (
      (order_id is not null and public.can_access_order(order_id))
      or public.has_workspace_access(workspace_id)
    )
  );

drop policy if exists "messages_update_sender" on public.messages;
create policy "messages_update_sender"
  on public.messages for update
  to authenticated
  using (sender_id = auth.uid() or public.is_admin())
  with check (
    (sender_id = auth.uid() or public.is_admin())
    and (
      (order_id is not null and public.can_access_order(order_id))
      or public.has_workspace_access(workspace_id)
    )
  );

drop policy if exists "messages_delete_sender" on public.messages;
create policy "messages_delete_sender"
  on public.messages for delete
  to authenticated
  using (sender_id = auth.uid() or public.is_admin());

-- notifications ---------------------------------------------------------------
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own"
  on public.notifications for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "notifications_insert_staff" on public.notifications;
create policy "notifications_insert_staff"
  on public.notifications for insert
  to authenticated
  with check (public.is_staff());

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own"
  on public.notifications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- subscriptions ---------------------------------------------------------------
drop policy if exists "subscriptions_select_own_or_admin" on public.subscriptions;
create policy "subscriptions_select_own_or_admin"
  on public.subscriptions for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "subscriptions_admin_write" on public.subscriptions;
create policy "subscriptions_admin_write"
  on public.subscriptions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- coupons ---------------------------------------------------------------------
drop policy if exists "coupons_admin_all" on public.coupons;
create policy "coupons_admin_all"
  on public.coupons for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- testimonials ----------------------------------------------------------------
drop policy if exists "testimonials_public_read" on public.testimonials;
create policy "testimonials_public_read"
  on public.testimonials for select
  to anon, authenticated
  using (is_published or public.is_admin());

drop policy if exists "testimonials_admin_write" on public.testimonials;
create policy "testimonials_admin_write"
  on public.testimonials for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- case_studies ----------------------------------------------------------------
drop policy if exists "case_studies_public_read" on public.case_studies;
create policy "case_studies_public_read"
  on public.case_studies for select
  to anon, authenticated
  using (is_published or public.is_admin());

drop policy if exists "case_studies_admin_write" on public.case_studies;
create policy "case_studies_admin_write"
  on public.case_studies for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- faq_items -------------------------------------------------------------------
drop policy if exists "faq_items_public_read" on public.faq_items;
create policy "faq_items_public_read"
  on public.faq_items for select
  to anon, authenticated
  using (is_published or public.is_admin());

drop policy if exists "faq_items_admin_write" on public.faq_items;
create policy "faq_items_admin_write"
  on public.faq_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- audit_logs ------------------------------------------------------------------
drop policy if exists "audit_logs_admin_all" on public.audit_logs;
create policy "audit_logs_admin_all"
  on public.audit_logs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- contact_messages ------------------------------------------------------------
drop policy if exists "contact_messages_public_insert" on public.contact_messages;
create policy "contact_messages_public_insert"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

drop policy if exists "contact_messages_admin_select" on public.contact_messages;
create policy "contact_messages_admin_select"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

-- =============================================================================
-- End of schema
-- =============================================================================
