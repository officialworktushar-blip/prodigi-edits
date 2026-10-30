-- =============================================================================
-- CutCrew storage, realtime, and seed data
-- Run AFTER supabase/schema.sql.
-- Idempotent: safe to run multiple times in the Supabase SQL Editor.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Storage buckets
-- Private: footage, drafts, deliverables
-- Public: avatars
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('footage', 'footage', false),
  ('drafts', 'drafts', false),
  ('deliverables', 'deliverables', false),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Storage object policies
-- Path convention: {workspace_id}/{order_id}/{filename}
-- -----------------------------------------------------------------------------
drop policy if exists "footage_select_workspace" on storage.objects;
create policy "footage_select_workspace"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'footage'
    and public.has_workspace_access(((storage.foldername(name))[1])::uuid)
  );

drop policy if exists "footage_insert_workspace" on storage.objects;
create policy "footage_insert_workspace"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'footage'
    and public.has_workspace_access(((storage.foldername(name))[1])::uuid)
  );

drop policy if exists "drafts_select_workspace_or_staff" on storage.objects;
create policy "drafts_select_workspace_or_staff"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'drafts'
    and (
      public.has_workspace_access(((storage.foldername(name))[1])::uuid)
      or public.is_staff()
    )
  );

drop policy if exists "drafts_insert_staff" on storage.objects;
create policy "drafts_insert_staff"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'drafts' and public.is_staff());

drop policy if exists "drafts_update_staff" on storage.objects;
create policy "drafts_update_staff"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'drafts' and public.is_staff())
  with check (bucket_id = 'drafts' and public.is_staff());

drop policy if exists "drafts_delete_staff" on storage.objects;
create policy "drafts_delete_staff"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'drafts' and public.is_staff());

drop policy if exists "deliverables_select_workspace_or_staff" on storage.objects;
create policy "deliverables_select_workspace_or_staff"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'deliverables'
    and (
      public.has_workspace_access(((storage.foldername(name))[1])::uuid)
      or public.is_staff()
    )
  );

drop policy if exists "deliverables_insert_staff" on storage.objects;
create policy "deliverables_insert_staff"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'deliverables' and public.is_staff());

drop policy if exists "deliverables_update_staff" on storage.objects;
create policy "deliverables_update_staff"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'deliverables' and public.is_staff())
  with check (bucket_id = 'deliverables' and public.is_staff());

drop policy if exists "deliverables_delete_staff" on storage.objects;
create policy "deliverables_delete_staff"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'deliverables' and public.is_staff());

-- -----------------------------------------------------------------------------
-- Realtime publication
-- Adds messages, notifications, review_comments, and orders once each.
-- -----------------------------------------------------------------------------
do $$
declare
  table_name text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    for table_name in
      select unnest(array['messages', 'notifications', 'review_comments', 'orders'])
    loop
      if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = table_name
      ) then
        execute format(
          'alter publication supabase_realtime add table public.%I',
          table_name
        );
      end if;
    end loop;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- Seed: packages
-- -----------------------------------------------------------------------------
insert into public.packages (name, kind, video_count, price_per_video, discount_percent, is_active)
select 'Solo Cut', 'HORIZONTAL', 1, 129.00, 0, true
where not exists (
  select 1 from public.packages where name = 'Solo Cut' and kind = 'HORIZONTAL'
);

insert into public.packages (name, kind, video_count, price_per_video, discount_percent, is_active)
select 'Creator Batch', 'HORIZONTAL', 4, 119.00, 7, true
where not exists (
  select 1 from public.packages where name = 'Creator Batch' and kind = 'HORIZONTAL'
);

insert into public.packages (name, kind, video_count, price_per_video, discount_percent, is_active)
select 'Channel Volume', 'HORIZONTAL', 8, 109.00, 15, true
where not exists (
  select 1 from public.packages where name = 'Channel Volume' and kind = 'HORIZONTAL'
);

insert into public.packages (name, kind, video_count, price_per_video, discount_percent, is_active)
select 'Shorts One', 'VERTICAL', 1, 99.00, 0, true
where not exists (
  select 1 from public.packages where name = 'Shorts One' and kind = 'VERTICAL'
);

insert into public.packages (name, kind, video_count, price_per_video, discount_percent, is_active)
select 'Shorts Fifteen', 'VERTICAL', 15, 89.00, 10, true
where not exists (
  select 1 from public.packages where name = 'Shorts Fifteen' and kind = 'VERTICAL'
);

insert into public.packages (name, kind, video_count, price_per_video, discount_percent, is_active)
select 'Shorts Thirty', 'VERTICAL', 30, 79.00, 20, true
where not exists (
  select 1 from public.packages where name = 'Shorts Thirty' and kind = 'VERTICAL'
);

-- -----------------------------------------------------------------------------
-- Seed: add-ons
-- -----------------------------------------------------------------------------
insert into public.add_ons (name, price, is_active)
select 'Thumbnail / Cover Art', 43.00, true
where not exists (
  select 1 from public.add_ons where name = 'Thumbnail / Cover Art'
);

insert into public.add_ons (name, price, is_active)
select 'Vertical (9:16) Reformat', 43.00, true
where not exists (
  select 1 from public.add_ons where name = 'Vertical (9:16) Reformat'
);

-- -----------------------------------------------------------------------------
-- Seed: testimonials
-- -----------------------------------------------------------------------------
insert into public.testimonials (name, role, quote, is_published)
select 'Maya Chen', 'YouTube creator', 'The edits land faster than I can film. My retention curve finally points the right way.', true
where not exists (
  select 1 from public.testimonials where name = 'Maya Chen'
);

insert into public.testimonials (name, role, quote, is_published)
select 'Daniel Okafor', 'Startup founder', 'We stopped juggling freelancers and started shipping product demos every week. The consistency paid for itself.', true
where not exists (
  select 1 from public.testimonials where name = 'Daniel Okafor'
);

insert into public.testimonials (name, role, quote, is_published)
select 'Priya Raman', 'Podcast host', 'Three hours of raw conversation comes back tight and listenable, without losing the moments that matter.', true
where not exists (
  select 1 from public.testimonials where name = 'Priya Raman'
);

insert into public.testimonials (name, role, quote, is_published)
select 'Jonas Weber', 'Real estate broker', 'Listing tours that used to eat my weekend now arrive before the open house. Clients notice the polish.', true
where not exists (
  select 1 from public.testimonials where name = 'Jonas Weber'
);

insert into public.testimonials (name, role, quote, is_published)
select 'Elena Rossi', 'Course creator', 'Every module intro feels like it belongs to the same course. That coherence keeps students moving forward.', true
where not exists (
  select 1 from public.testimonials where name = 'Elena Rossi'
);

insert into public.testimonials (name, role, quote, is_published)
select 'Chris Alvarez', 'Agency producer', 'One workspace, every client, no chasing files. This is the calmest our production calendar has ever been.', true
where not exists (
  select 1 from public.testimonials where name = 'Chris Alvarez'
);

-- -----------------------------------------------------------------------------
-- Seed: case studies
-- -----------------------------------------------------------------------------
insert into public.case_studies (slug, title, summary, body, is_published)
values (
  'daily-uploads-without-a-team',
  'Daily uploads without a team',
  'How a solo creator tripled output while keeping every cut on brand.',
  'A weekly uploader came in with a backlog of raw footage and a calendar that refused to move. We split the workload into repeatable edit recipes, paired each video with a thumbnail pass, and kept a single editor on the account. Within six weeks the channel was publishing daily and the creator was filming more, not editing longer.',
  true
)
on conflict (slug) do nothing;

insert into public.case_studies (slug, title, summary, body, is_published)
values (
  'launch-week-without-the-scramble',
  'Launch week without the scramble',
  'A product team shipped nine launch assets in four days with one shared workspace.',
  'The launch plan called for a hero film, six feature clips, and two vertical cutdowns, all due in the same week. Instead of hiring a temporary crew, the team queued every request in one workspace with a shared brief and a single review thread. Editors worked in parallel, comments stayed attached to timecodes, and every asset landed a day before the deadline.',
  true
)
on conflict (slug) do nothing;

insert into public.case_studies (slug, title, summary, body, is_published)
values (
  'a-podcast-that-sounds-like-a-show',
  'A podcast that sounds like a show',
  'Long recordings became polished episodes with a consistent sonic identity.',
  'The show had great guests and uneven audio. We built a repeatable cleanup pass for noise, levels, and filler words, then added a branded intro and outro to every episode. The host now records once and publishes twice a week, with a back catalog that finally sounds like one program.',
  true
)
on conflict (slug) do nothing;

-- -----------------------------------------------------------------------------
-- Seed: FAQ items
-- -----------------------------------------------------------------------------
insert into public.faq_items (question, answer, sort_order, is_published)
select 'How fast will I get my first cut?', 'Most orders return a first cut within 24 to 48 hours, depending on the package and how much footage you upload. You can follow every status change in your workspace.', 1, true
where not exists (
  select 1 from public.faq_items where question = 'How fast will I get my first cut?'
);

insert into public.faq_items (question, answer, sort_order, is_published)
select 'What counts as a revision?', 'A revision is a focused pass on an existing draft: trimming a section, swapping a clip, adjusting captions, or changing the music. New concepts or extra deliverables are quoted separately.', 2, true
where not exists (
  select 1 from public.faq_items where question = 'What counts as a revision?'
);

insert into public.faq_items (question, answer, sort_order, is_published)
select 'Can I upload footage in any format?', 'We accept common camera, phone, and screen-recording formats. If a file is unusually large or uses a niche codec, upload it anyway and we will flag anything that needs a different export.', 3, true
where not exists (
  select 1 from public.faq_items where question = 'Can I upload footage in any format?'
);

insert into public.faq_items (question, answer, sort_order, is_published)
select 'Who owns the final video?', 'You do. Once an order is delivered, the finished files are yours to publish, repurpose, and monetize. We keep working files private to your workspace.', 4, true
where not exists (
  select 1 from public.faq_items where question = 'Who owns the final video?'
);

insert into public.faq_items (question, answer, sort_order, is_published)
select 'Can my team share a workspace?', 'Yes. Invite teammates as viewers, managers, or owners and keep every brief, draft, and comment in one place. Roles control who can change orders and billing details.', 5, true
where not exists (
  select 1 from public.faq_items where question = 'Can my team share a workspace?'
);

insert into public.faq_items (question, answer, sort_order, is_published)
select 'What happens if I need to cancel?', 'You can cancel a draft before it is submitted at no cost. After work begins, we finish the current milestone and settle the remaining balance based on the package terms.', 6, true
where not exists (
  select 1 from public.faq_items where question = 'What happens if I need to cancel?'
);

-- Promote your own account to ADMIN after signing up.
-- update public.profiles set role='ADMIN' where email='YOUR_EMAIL';
