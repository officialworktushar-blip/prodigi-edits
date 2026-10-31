-- =============================================================================
-- Admin extras: run ONCE in the Supabase SQL Editor (after schema.sql).
-- Safe to run again.
-- =============================================================================

-- 1) Internal notes for an order (staff only, never visible to customers).
create table if not exists public.order_notes (
  order_id uuid primary key references public.orders(id) on delete cascade,
  body text,
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.order_notes enable row level security;

drop policy if exists "order_notes_staff_access" on public.order_notes;
create policy "order_notes_staff_access"
  on public.order_notes for all
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.orders o
      where o.id = order_notes.order_id
        and (
          o.manager_id = auth.uid()
          or o.editor_id = auth.uid()
          or o.thumbnail_artist_id = auth.uid()
        )
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.orders o
      where o.id = order_notes.order_id
        and (
          o.manager_id = auth.uid()
          or o.editor_id = auth.uid()
          or o.thumbnail_artist_id = auth.uid()
        )
    )
  );

-- 2) Monthly checklist for channel-management subscriptions (admin only).
create table if not exists public.subscription_checklist (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  month text not null check (month ~ '^[0-9]{4}-[0-9]{2}$'),
  item text not null,
  done boolean not null default false,
  done_at timestamptz,
  unique (subscription_id, month, item)
);

alter table public.subscription_checklist enable row level security;

drop policy if exists "subscription_checklist_admin" on public.subscription_checklist;
create policy "subscription_checklist_admin"
  on public.subscription_checklist for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
