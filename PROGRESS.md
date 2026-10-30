# Progress Log

## Task 1: Project config files
Created complete project configuration:
- package.json
- tsconfig.json
- next.config.mjs
- tailwind.config.ts
- postcss.config.js
- .env.example
- .gitignore
- next-env.d.ts
- app/layout.tsx
- app/globals.css
- lib/config.ts

Everything complete.

## Task 2: Prisma schema + DB singleton
Created:
- prisma/schema.prisma — SQLite schema with all 21 models and relations
- lib/db.ts — Prisma singleton for hot-reload support
- String fields with inline comments for enums (SQLite style)

Everything complete.

## Task 3: Prisma seed file (do not run)
Created:
- prisma/seed.ts — complete seed with demo data
- Added bcryptjs: 2.4.3 to package.json

Demo logins (all password "Demo@1234"):
- admin@demo.com / Demo@1234 (ADMIN)
- editor1@demo.com / Demo@1234 (EDITOR)
- editor2@demo.com / Demo@1234 (EDITOR)
- customer@demo.com / Demo@1234 (CUSTOMER)

Task 3 complete.

## Task 4: Authentication
Created:
- lib/auth.ts — NextAuth options (CredentialsProvider + bcryptjs, JWT with id+role)
- app/api/auth/[...nextauth]/route.ts — NextAuth handler
- lib/guards.ts — requireUser, requireRole, requireAdmin, requireEditorOrAdmin, requireCustomer, requireWorkspaceAccess
- middleware.ts — protects /app for CUSTOMER only, /admin for ADMIN+EDITOR only, editors limited to /admin/orders, role-based redirect after login
- app/api/auth/signup/route.ts — zod validation, creates default workspace + welcome notification

Added USER_ROLE enum + UserRole type to lib/config.ts

Task 4 complete.

## MIGRATION: Prisma and NextAuth removed. Backend is now Supabase. Old UI tasks 1-12 are kept; backend files are being rewritten.

## Task 2: Supabase schema.sql
Created:
- supabase/schema.sql — idempotent SQL with extensions, all enums, all tables, indexes, functions (is_admin, is_staff, has_workspace_access, order/draft helpers), triggers (new user setup, profile role guard, order sensitive-field guard), and RLS policies for every table.

Nothing left undone. Storage, realtime, and seed are intentionally excluded from this file.

## Task 3: Storage, realtime, seed, and DB types
Created:
- supabase/storage_seed.sql — private footage/drafts/deliverables buckets, public avatars bucket, storage.objects RLS policies, idempotent realtime publication updates, and seed data for packages, add-ons, testimonials, case studies, and FAQ items.
- types/db.ts — hand-written TypeScript row types for all 22 tables and all 7 enums.

Nothing left undone. Run storage_seed.sql after schema.sql.

## Task 4: Supabase backend foundation
Created:
- lib/supabase/client.ts — browser client via createBrowserClient.
- lib/supabase/server.ts — server client via createServerClient with synchronous cookies() and getAll/setAll.
- lib/supabase/admin.ts — server-only service-role client.
- lib/supabase/middleware.ts — updateSession helper that refreshes auth cookies.
- middleware.ts — refreshed session, /app protection for any logged-in user, /admin protection for ADMIN/EDITOR, EDITOR limited to /admin/orders, and role-based redirects away from /login and /signup.
- lib/guards.ts — getUser, requireUser, requireRole, requireWorkspaceAccess.
- lib/utils.ts — cn helper (file did not exist).
- .env.example — replaced old backend vars with the four Supabase/site vars.

lib/config.ts already contained every required key, so it was not changed.

Nothing left undone.

## Task 5: Supabase auth pages and actions
Created:
- app/(auth)/layout.tsx — split-screen auth layout with gradient mesh value panel and form side.
- app/(auth)/login/page.tsx — react-hook-form + zod sign-in form with inline errors.
- app/(auth)/signup/page.tsx — name/email/password sign-up form with confirmation state.
- app/(auth)/forgot-password/page.tsx — reset-link request form.
- app/(auth)/reset-password/page.tsx — new-password form.
- app/(auth)/accept-invite/[token]/page.tsx — invite acceptance form.
- app/(auth)/actions.ts — signInWithPassword, signUp, resetPasswordForEmail, updateUser, signOut, acceptInvite.
- app/auth/callback/route.ts — exchangeCodeForSession and safe redirect.

No next-auth imports, SessionProvider, useSession, signIn, or signOut usage remained in the codebase. The old auth page files did not exist, so these paths were created once with no duplicates.

Nothing left undone.

## Task 6: Migrate the public site from Prisma to Supabase
Changed:
- app/api/contact/route.ts — replaced the legacy database import and notification/audit writes with zod validation and a `contact_messages` insert through `lib/supabase/server.ts`; returns explicit success, validation-error, and server-error JSON.
- lib/data/marketing.ts — created server-side public data helpers for active packages, active add-ons, published testimonials, published case studies, a case study by slug, and published FAQ items. All helpers use `lib/supabase/server.ts`, `types/db.ts`, snake_case columns, and return `[]` (or `null` for a single case study) on Supabase errors.
- components/marketing/faq.tsx — switched to the `FaqItem` type from `types/db.ts`, removed the invalid trailing export, and kept FAQ rendering compatible with snake_case rows.
- components/marketing/features-grid.tsx — removed unused/legacy case-study typing, replaced undefined icon references, and repaired the services tabs.
- app/contact/page.tsx — rewrote the public contact form to use the new API response shape, show field/server errors, and avoid missing shared components.
- app/robots.ts — repaired the malformed metadata route.
- tsconfig.json — added `baseUrl`, the `@/*` path alias required by existing app imports, and switched module resolution to `Bundler` for the Next.js App Router setup.
- AGENTS.md — reworded legacy-backend references; no policy change.

Final search for `prisma`, `next-auth`, `bcrypt`, `lib/db`, `getServerSession`, and `useSession` found matches only in `PROGRESS.md` and `.gitignore`, as allowed.

No `app/(marketing)` files existed, and no files under `components/marketing` imported the legacy backend. The new public data helpers are ready for future marketing pages; none of those pages exist yet.

Packages needed: none.

## Task FIX-1: lib/data slug lookup TypeScript errors
Changed:
- lib/data/services.ts — added a `ServicePage` union via `typeof SERVICE_PAGE_DATA` and `keyof typeof`, cast the const data to `Record<string, ServicePage | undefined>`, and typed `getServicePage` to return `ServicePage | undefined`.

Checked:
- lib/data/use-cases.ts uses `.find()` and does not index a const object, so no change was needed.
- lib/data/marketing.ts uses Supabase queries and returns arrays or null, so no change was needed.
- No page currently imports or calls any `lib/data` lookup function, so there were no callers requiring `notFound()`.

Nothing left undone.

## Task FIX-2: Replace Google font with system font stack
Changed:
- app/layout.tsx — removed the `next/font/google` Inter import, font configuration, `--font-inter` variable, and dynamic `<html>` class.
- app/globals.css — removed the `--font-inter` variable and set the body font-family to the required system font stack.
- tailwind.config.ts — replaced the `fontFamily.sans` Inter entry with the same system font stack.

Search for `next/font`, `--font-inter`, and Inter usage found no remaining matches. No commands run.

## Task A: Design tokens and base UI
Changed:
- app/globals.css — kept the Tailwind directives, added brand and surface CSS variables, replaced the invalid hero mesh with a blurred indigo/pink/lavender radial-gradient `.bg-hero-mesh`, added `.text-gradient` (with `.gradient-text` kept as an alias), and retained the required system body font stack.
- tailwind.config.ts — added nested brand indigo/blue tokens, ink/muted/surface/border tokens, rounded `pill`/`3xl`, the soft shadow, and content coverage for `app`, `components`, and `lib`.
- app/layout.tsx — mounted `ToastProvider` around the app.
- lib/utils.ts — already existed with `cn` using `clsx` and `tailwind-merge`; left unchanged.

Created in components/ui:
- button.tsx — primary gradient pill, secondary, outline, ghost, danger, and link variants plus sm/md/lg/icon sizes and loading state.
- card.tsx — Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter.
- input.tsx, textarea.tsx, select.tsx — accessible form controls with focus and invalid states.
- badge.tsx — default, secondary, outline, success, warning, danger, and info variants.
- tabs.tsx — accessible controlled/uncontrolled tabs with keyboard navigation.
- dialog.tsx — portal dialog with focus handling, Escape close, body scroll lock, and focus restoration.
- dropdown-menu.tsx — accessible menu with outside-click/Escape handling and arrow-key navigation.
- avatar.tsx — image with loading/error fallback.
- progress.tsx — accessible progress bar.
- skeleton.tsx — pulse placeholder.
- toast.tsx — toast provider, variants, auto-dismiss, actions, and `useToast`.

Nothing left undone. Packages needed: none.

## Task B: Shared components
Existing files found: `components/shared/empty-state.tsx` and `components/shared/stat-card.tsx`. Both were rewritten because their APIs and styling were incomplete or still used retired colour classes.

Created:
- components/shared/logo.tsx — reads `BRAND_NAME`/`BRAND_TAGLINE` from `lib/config.ts`, gradient play mark, optional tagline/href/size/tone, and accessible focus styling.
- components/shared/section-heading.tsx — eyebrow, one gradient-highlighted headline word, optional subcopy, alignment, heading level, and id support.
- components/shared/fade-in.tsx — client framer-motion fade-up using `whileInView`, reduced-motion support, and configurable delay/once.
- components/shared/status-badge.tsx — distinct colours and readable labels for all nine order statuses, including a status dot.
- components/shared/page-header.tsx — eyebrow, gradient-highlighted title (supports both `title` and legacy `headline`), description, and action slot.
- components/shared/media-placeholder.tsx — gradient frame with aspect ratios, badge/title/description, and icon-name mapping instead of images.

Rewrote:
- components/shared/empty-state.tsx — valid brand styling, `Link` action, and icon-name string mapping with a safe fallback.
- components/shared/stat-card.tsx — optional icon-name support, hint text, and consistent card styling.

All icon-bearing shared components accept icon name strings and map them to `lucide-react` components internally, so no icon components are passed across a client boundary. No external images or new packages used.

Nothing left undone. No commands run.

## Task C: Marketing layout, navbar, and footer
Existing files found: `app/(marketing)/contact/page.tsx` only. No marketing layout, navbar, or footer existed.

Created:
- app/(marketing)/layout.tsx — wraps public pages with `Navbar` and `Footer`, adds a skip-to-content link, and keeps the page body in a flex column.
- components/marketing/navbar.tsx — client sticky translucent header with click-to-open Services, Use Cases, and Resources dropdowns; a Pricing link; Log in and Get started actions; Escape/outside-click handling; route-change closing; and an animated mobile slide-in menu with scroll lock, focus restore, grouped links, and CTAs.
- components/marketing/footer.tsx — brand panel with `BRAND_TAGLINE` and `SUPPORT_EMAIL`, plus Services, Use cases, Company, and Account link columns and a dynamic copyright using `BRAND_NAME`.

All required targets are present: the three service pages, seven use-case pages, pricing, examples, case studies, about, platform, contact, login, and signup. Brand copy comes from `lib/config.ts`; the navbar and footer use existing `lucide-react` icons only.

Nothing left undone. No commands run. Packages needed: none.

## Task D: Marketing homepage
Created:
- app/(marketing)/page.tsx — composes the homepage and adds metadata using `BRAND_NAME` from `lib/config.ts`.
- components/marketing/home/hero.tsx — gradient-mesh hero with the required headline and highlighted phrase, two pill CTAs to `/signup` and `/pricing`, a five-star rating strip, and a `MediaPlaceholder` visual with floating delivery-status cards.
- components/marketing/home/trusted-by.tsx — text-only trust strip with five original team names.
- components/marketing/home/stats.tsx — four responsive stat cards using the shared `StatCard` icon-name API.
- components/marketing/home/how-it-works.tsx — client four-step tab/stepper with keyboard navigation and a changing mock UI preview for brief, upload, review, and delivery.
- components/marketing/home/get-started-cards.tsx — three cards for ordering one video, buying a package, and channel management with original copy, feature lists, and CTAs.

Homepage order: hero, trusted-by, stats, how-it-works, get-started cards. No external images, `<img>`, `next/image`, or external URLs were used; the hero and review preview use `MediaPlaceholder`.

Nothing left undone. No commands run. Packages needed: none.

## Task E: Homepage sections and Supabase data wiring
Created in `components/marketing/home`:
- `features-grid.tsx` — six original benefit cards using the shared section heading and fade-in animation.
- `services-tabs.tsx` — accessible long-form, short-form, and channel-management tabs with keyboard navigation, animated panel transitions, preview placeholders, and a `ChannelManagementCard` export.
- `case-studies-carousel.tsx` — client-side scroll-snap carousel with reduced-motion-aware controls, placeholder previews, case-study links, and an empty state.
- `testimonials.tsx` — responsive quote cards with five-star marks, avatar initials, and an empty state.
- `pricing-teaser.tsx` — up to three active package cards with dollar pricing, discount badges, inclusion notes, and an empty state.
- `faq.tsx` — accessible accordion with animated panels, the first answer open by default, and an empty state.
- `final-cta.tsx` — gradient closing call-to-action with signup/contact links and delivery assurances.

Changed:
- `app/(marketing)/page.tsx` — now an async server component. It fetches published testimonials, published case studies, published FAQ items ordered by `sort_order`, and active packages through `createClient()` from `lib/supabase/server.ts` in a `Promise.all`; every failed query or missing environment configuration falls back to empty arrays. Featured packages prefer one package per kind before filling to three.
- `components/marketing/features-grid.tsx` and `components/marketing/faq.tsx` — replaced duplicate implementations with re-exports from `components/marketing/home` so there is only one implementation of each.

Homepage now renders: hero, trusted-by, stats, how-it-works, get-started cards, features grid, services tabs, case studies, testimonials, pricing teaser, FAQ, and final CTA.

Nothing left undone. No commands run. Packages needed: none.

## Task F: Pricing page
Created:
- `app/(marketing)/pricing/page.tsx` — async server page with metadata, a gradient-washed page header, package assurances, safe `getActivePackages()`/`getActiveAddOns()` fetching, the pricing experience, and the shared final CTA.
- `components/marketing/pricing/pricing-experience.tsx` — client tabs for Horizontal, Vertical, and Channel Management; horizontal and vertical package cards show discount badges, per-video pricing, block totals, package features, and `/signup` CTAs; shared “All packages include” grid; add-on cards from the `add_ons` table with a graceful empty state.
- `components/marketing/pricing/channel-management.tsx` — quarterly/annual billing toggle, Starter and Pro cards with billed totals, a 15-row full feature comparison table, mobile horizontal scrolling, and accessible toggle/table semantics.
- `lib/data/channel-plans.ts` — typed quarterly and annual channel plans, billing options, and comparison rows.

Empty or failed Supabase package/add-on results render `EmptyState` blocks instead of crashing. No external images or new packages used.

Nothing left undone. No commands run. Packages needed: none.

## Task G1: Service, use-case, privacy, and terms pages
Created:
- `app/(marketing)/services/[slug]/page.tsx` — static routes for `long-form`, `short-form`, and `channel-management`; `generateStaticParams`, `generateMetadata`, unknown-slug `notFound()`, tailored deliverables/process content, server-rendered lucide icons, and the shared final CTA.
- `app/(marketing)/use-cases/[slug]/page.tsx` — static routes for all seven use-case slugs, including `realtors`; `generateStaticParams`, `generateMetadata`, unknown-slug `notFound()`, tailored project ideas/outcomes, a three-step handoff, and server-side icon rendering.
- `app/(marketing)/privacy/page.tsx` — original privacy copy covering collected data, project files, payments, sharing, retention, security, choices, and contact using `BRAND_NAME`/`SUPPORT_EMAIL`.
- `app/(marketing)/terms/page.tsx` — original terms covering accounts, orders, payment, scheduling, revisions, content ownership, acceptable use, liability, termination, and contact.

Changed:
- `app/(marketing)/contact/page.tsx` — repaired the config import to `@/lib/config`.
- `lib/data/use-cases.ts` — corrected the real-estate slug to `realtors` to match navigation and required routes.
- `app/sitemap.ts` — corrected the use-case URL to `/use-cases/realtors`.

No icon components cross a server-to-client boundary, no external images are used, and no new packages were added.

Nothing left undone. No commands run. Packages needed: none.

## Task G2: Examples, case studies, about, and platform pages
Created:
- `app/(marketing)/examples/page.tsx` — ranked page header, format assurances, the examples gallery, and the shared final CTA.
- `components/marketing/examples/examples-gallery.tsx` — client-side category filter with accessible pressed-state buttons, original representative examples, a responsive media-placeholder card grid, result count, and a case-study link.
- `app/(marketing)/case-studies/page.tsx` — async server page using `getPublishedCaseStudies()`, safe date formatting, a responsive story grid, a graceful empty state pointing to examples, and the final CTA.
- `app/(marketing)/case-studies/[slug]/page.tsx` — async published-case-study lookup with `generateMetadata`, unknown-slug `notFound()`, null-safe summary/body rendering, a project snapshot sidebar, and the final CTA.
- `app/(marketing)/about/page.tsx` — original story, three standards, working principles, all seven use-case links, and the final CTA.
- `app/(marketing)/platform/page.tsx` — order-workspace preview, four platform capabilities, the shared four-step `HowItWorks` workflow, the full order status flow with revision loop, and the final CTA.

Changed:
- `app/sitemap.ts` — corrected `/cases` to `/case-studies`, added `/examples`, `/privacy`, and `/terms`, and removed the unused brand import.
- `components/marketing/footer.tsx` — added Privacy and Terms links to the footer legal/account navigation.

All Supabase reads use existing safe helpers that tolerate missing configuration, null rows, and empty results. No icon components are passed from server pages to client components. No external images or new packages were used.

Nothing left undone. No commands run. Packages needed: none.

## Task H: Customer panel shell and dashboard
Created:
- `lib/customer/workspace.ts` — active workspace cookie constant and a resolver that safely falls back to the first available workspace.
- `lib/data/customer.ts` — null-safe Supabase helpers for customer workspaces, notifications, unread counts, orders, and credits; failed queries and missing configuration return empty arrays or `0`.
- `app/(customer)/app/actions.ts` — `setActiveWorkspace` validates the selected workspace before setting the cookie and refreshing the panel; `signOutAction` signs out and returns to `/login`. Both actions start with `requireUser`.
- `components/customer/sidebar.tsx` — desktop navigation with New Order CTA, active-route states, current workspace summary, and support contact.
- `components/customer/topbar.tsx` — workspace switcher, unread notification menu, user menu, settings links, and sign out.
- `components/customer/mobile-nav.tsx` — seven-destination fixed mobile navigation with accessible active states.
- `app/(customer)/app/layout.tsx` — authenticated customer shell that loads workspaces, notifications, and unread counts, resolves the active workspace from the cookie, and renders sidebar, topbar, main content, and mobile nav.
- `app/(customer)/app/page.tsx` — dashboard with active orders, in-review drafts, credit balance, a review banner, responsive recent orders, New Order card, notification activity, and workspace summary.
- `app/(customer)/app/loading.tsx` — dashboard-shaped skeleton state.
- `app/(customer)/app/error.tsx` — recoverable client error state with retry and dashboard links.

The customer shell and dashboard are complete. All Supabase reads tolerate missing configuration, null rows, RLS-filtered results, and empty arrays. No shell commands were run. Packages needed: none.

Order detail, workspaces, messages, team, billing, and settings pages remain future tasks.

## Task I: Customer order wizard
Created:
- `app/(customer)/app/orders/actions.ts` — server actions for idea, footage, style, coupon preview, and final submission. Every action starts with `requireUser` plus `requireWorkspaceAccess`; drafts are limited to the signed-in customer, selected workspace, and `DRAFT` status; invalid coupons now fail explicitly before extras are replaced or the order is submitted.
- `components/customer/wizard/types.ts` — shared wizard workspace, add-on, package, credit, idea, footage, quote, coupon, and action-result types.
- `components/customer/wizard/format.ts` — currency formatting, optional numeric parsing, and field-error lookup helpers.
- `components/customer/wizard/stepper.tsx` — desktop and mobile progress stepper.
- `components/customer/wizard/step-idea.tsx` — project type, title, brief, and reference-link step with inline validation.
- `components/customer/wizard/step-footage.tsx` — cloud-link handoff, 60-minute/20 GB allowances, warnings, and uploader placeholder.
- `components/customer/wizard/step-style.tsx` — workspace notes preview and selectable active add-ons.
- `components/customer/wizard/step-review.tsx` — brief/footage/extras summary, price breakdown, credit toggle, and coupon entry.
- `components/customer/wizard/order-wizard.tsx` — client state container for all four steps, draft saving, coupon preview, submit success state, and reset flow.
- `app/(customer)/app/orders/new/page.tsx` — protected server page that resolves the active workspace and loads active packages, add-ons, and credits with safe empty fallbacks.

Draft idea and footage data are persisted through `orders`; cloud links and size estimates are stored in `footage_files` with `CLOUD_LINK`/`SIZE_ESTIMATE` sources. Final submission sets `SUBMITTED`, records best-effort service-role audit and notification rows, and returns a success summary instead of redirecting. Customers have no direct notification/audit insert rights under current RLS.

The file uploader remains a cloud-link placeholder by design. Credit use and coupon codes affect the estimate, but credit balances and coupon usage counters are not mutated; billing ledger behavior remains a future task. A page reload starts a new draft; resuming an existing draft is not implemented. No build was run because the project rules prohibit shell commands. Packages needed: none.

## Task J: Direct-to-Supabase footage uploads
Created:
- `lib/storage.ts` — `FOOTAGE_BUCKET`, signed upload/download URL helpers, object removal, upload ticket typing, and object-path normalization that blocks empty, absolute, backslash, and traversal paths.
- `app/api/upload/sign/route.ts` — authenticated signed-upload endpoint. It validates order/file metadata, checks the draft order through the user-scoped Supabase client, builds a unique `{workspace_id}/{order_id}/{timestamp}-{random}-{safe_name}` path, and returns only `{ path, token }`.
- `app/(customer)/app/orders/upload-actions.ts` — `saveUploadedFootage` verifies workspace access, draft status, and order-owned path before inserting a `footage_files` row with `source: 'UPLOAD'`; `removeUploadedFootage` verifies the same path ownership, removes the storage object, and deletes any matching row.
- `components/customer/wizard/file-uploader.tsx` — client drag/drop and multi-file uploader with direct browser `uploadToSignedUrl`, staged progress, file validation, cancel, retry, cleanup, and accessible status/progress states.

Changed:
- `components/customer/wizard/types.ts` — added uploaded-footage and upload/remove result types.
- `components/customer/wizard/step-footage.tsx` — replaced the uploader placeholder with the real uploader, added workspace/order props, and updated the footage handoff copy.
- `components/customer/wizard/order-wizard.tsx` — passes workspace/order context into the footage step and disables Back/Continue while uploads are in progress.

Files upload directly from the browser to the private `footage` bucket; only path/token metadata passes through the app server, so Vercel does not proxy video bytes. Cancelled uploads and failed post-upload saves trigger best-effort object/row cleanup. Retries request a fresh signed path, and attempt tokens prevent an older cancelled request from completing after a retry. This supersedes Task I's uploader-placeholder note.

No build, lint, or typecheck was run because project rules prohibit shell commands. Upload progress is stage-based rather than byte-level because the current Supabase `uploadToSignedUrl` API exposes no progress callback or abort signal. Removing already-completed uploads from the list is not exposed. Packages needed: none.

## Task K: Customer orders list and detail pages
Created:
- `app/(customer)/app/orders/page.tsx` — authenticated orders list with active-workspace scoping, title/order-number search, URL-driven status tabs, result count, responsive table, and filter-aware empty states.
- `app/(customer)/app/orders/[id]/page.tsx` — RLS-scoped order detail page with `notFound()` for unknown or inaccessible IDs, URL-driven tabs, footage, review placeholder, server-signed deliverables, and message activity.
- `app/(customer)/app/orders/loading.tsx` — list-shaped loading skeleton.
- `app/(customer)/app/orders/[id]/loading.tsx` — detail-shaped loading skeleton.
- `components/customer/orders/order-utils.ts` — status/kind labels, search-param parsing, date/size formatting, safe URL handling, overdue detection, initials, and due-countdown metadata.
- `components/customer/orders/order-filters.tsx` — GET search form and accessible status-tab links that preserve the current query.
- `components/customer/orders/orders-table.tsx` — desktop table and mobile order cards.
- `components/customer/orders/order-detail-tabs.tsx` — Overview, Footage, Drafts & Review, Deliverables, and Activity tab navigation.
- `components/customer/orders/order-overview.tsx` — status timeline, deadline, assigned team, project brief, references, and order facts.
- `components/customer/orders/order-status-timeline.tsx` — current-state production timeline with revision, cancellation, and delivered states.
- `components/customer/orders/due-countdown.tsx` — client-side due countdown that refreshes every minute without hydration-time clock assumptions.
- `components/customer/orders/order-footage.tsx` — footage uploads, cloud links, and size estimates with source labels and safe external links.
- `components/customer/orders/review-placeholder.tsx` — `Drafts & Review` placeholder containing the required `Review tool coming in next task` copy.
- `components/customer/orders/order-deliverables.tsx` — final-file list with private download links and expiry notice.
- `components/customer/orders/order-activity.tsx` — newest-first order message history with current-user and team labels.

Changed:
- `lib/storage.ts` — added `DELIVERABLES_BUCKET` and an optional bucket argument to `createDownloadUrl`, preserving the footage default and one-hour expiry default.
- `lib/data/customer.ts` — added safe order-list filtering by status/search, single-order lookup, footage/deliverables/messages loaders, and server-only assigned-team profile lookup.
- `PROGRESS.md` — recorded Task K.

Order detail data is first loaded through the user-scoped Supabase client so RLS decides whether the order exists for this customer. Assigned-team profile names are fetched through the service-role client only after that successful order lookup. Deliverable links are signed server-side from the private `deliverables` bucket and expire after one hour. Activity currently reads order messages only; the customer-visible audit-log policy is admin-only, and there is no status-history table.

No new message composer or footage-download action was added because they were not part of this task. The overview timeline reflects the current status rather than historical transition timestamps. No build, lint, or typecheck was run because project rules prohibit shell commands. Packages needed: none.

## Task L: Customer draft review tool
Created:
- `app/(customer)/app/orders/[id]/review-actions.ts` — server actions for adding comments, resolving/reopening an author's comments, requesting a revision, and approving a cut. Every exported action starts with `requireUser`; order access is resolved through the RLS-scoped server client and then checked with `requireWorkspaceAccess`. Revision and approval updates are conditional on the order still being `IN_REVIEW`.
- `components/customer/review/types.ts` — review draft, author, and server-action result types.
- `components/customer/review/format.ts` — safe review timestamp formatting.
- `components/customer/review/use-review-comments.ts` — Supabase Realtime subscription for new `review_comments` rows filtered to the selected draft, with unique channel names, disconnect handling, and cleanup.
- `components/customer/review/review-player.tsx` — signed-URL HTML5 video player, private-link expiry notice, version pills, poster support, and missing-file state.
- `components/customer/review/timeline-markers.tsx` — deduplicated comment markers across the draft timeline, open/resolved colours, current playhead, and click-to-seek controls.
- `components/customer/review/comment-panel.tsx` — comment composer at the current playhead, threaded replies, timestamp seek links, open/resolved badges, author-only resolve/reopen controls, live indicator, and error/status feedback.
- `components/customer/review/review-actions.tsx` — review decision panel that enables revision/approval only for `IN_REVIEW`, updates local status after success, and refreshes the route.
- `components/customer/review/review-workspace.tsx` — selected-version state, latest-playable default, per-draft comment filtering, realtime merge, seek handling, and empty state when no draft exists.

Changed:
- `lib/storage.ts` — added `DRAFTS_BUCKET`.
- `lib/data/customer.ts` — added `getOrderDrafts` and `getDraftReviewComments`, and reused the existing team-profile loader for comment authors.
- `app/(customer)/app/orders/[id]/page.tsx` — loads drafts and comments, signs every draft video and thumbnail from the private `drafts` bucket server-side with one-hour expiry, loads comment-author profiles, and renders `ReviewWorkspace` in the review tab instead of `ReviewPlaceholder`.
- `PROGRESS.md` — recorded Task L.

Comments are accepted on any non-cancelled order; only the comment author can change its status through the UI because the RLS policy also permits staff updates. Revision and approval are limited to `IN_REVIEW`, and conditional updates prevent stale tabs from overwriting a later status change. Realtime currently merges new comments only; status changes made by collaborators appear after navigation or refresh. No notification, audit-log, or status-history rows are written by these actions.

`components/customer/orders/review-placeholder.tsx` is no longer imported or rendered, but the unused file remains because project rules prohibit shell commands for file deletion. No build, lint, or typecheck was run because project rules prohibit shell commands. Packages needed: none.

## Task M: Customer panel completion
Created:
- `lib/payments.ts` — mock package purchase that looks up an active package with the service-role client and increments or creates the matching credit balance.
- `app/api/upload/image/route.ts` — authenticated signed-upload endpoint for avatars and workspace logos, with MIME/size validation, workspace-manager checks for logos, and scoped storage paths.
- `components/customer/use-notifications-realtime.ts` — Realtime subscription for new notification rows.
- `components/customer/chat/types.ts`, `format.ts`, `use-workspace-messages.ts`, `chat-thread-list.tsx`, `chat-panel.tsx`, and `chat-workspace.tsx` — workspace/order conversations, realtime inserts, optimistic sends, retry, and local unread badges.
- `app/(customer)/app/messages/actions.ts` and `page.tsx` — chat message sending and the messages screen.
- `app/(customer)/app/workspaces/actions.ts` — workspace branding and logo updates with manager checks.
- `components/customer/workspaces/workspace-logo-uploader.tsx` and `workspace-branding-editor.tsx` — logo upload plus debounced autosave brand colours/fonts with preview.
- `app/(customer)/app/workspaces/page.tsx` and `app/(customer)/app/workspaces/[id]/page.tsx` — workspace list and detail/branding screen.
- `app/(customer)/app/team/actions.ts` and `components/customer/team/team-manager.tsx` — invite, remove, and revoke actions plus role-aware team UI.
- `app/(customer)/app/team/page.tsx` — active-workspace team screen with member/profile and invite data.
- `app/(customer)/app/billing/actions.ts`, `components/customer/billing/billing-purchase.tsx`, and `app/(customer)/app/billing/page.tsx` — credit balances, package cards, mock purchases, and subscription summary.
- `app/(customer)/app/settings/actions.ts`, `components/customer/settings/account-settings.tsx`, and `app/(customer)/app/settings/page.tsx` — profile name, avatar upload, and password changes.

Changed:
- `supabase/schema.sql` — added workspace brand heading/body font and primary/accent colour columns, and limited invite reads to workspace managers/admins so viewers cannot inspect invite tokens.
- `types/db.ts` — added the branded workspace fields.
- `supabase/storage_seed.sql` — owner/manager avatar storage policies.
- `lib/storage.ts` — avatar bucket support, public URLs, and optional bucket arguments for uploads/removal.
- `lib/data/customer.ts` — workspace, membership, invite, message, and subscription helpers; team profiles now include email.
- `app/(customer)/app/actions.ts` — mark-one and mark-all notification actions.
- `components/customer/topbar.tsx` and `app/(customer)/app/layout.tsx` — realtime notifications, mark-read controls, and signed-in avatar wiring.
- `components/customer/chat/use-workspace-messages.ts` — failed/rejected sends now mark the optimistic message as failed.
- `PROGRESS.md` — recorded Task M.

The customer panel now has orders, review, messages, workspaces/branding, team management, mock billing/credits, settings, and live notifications. Chat unread badges are stored per browser because there is no message read-receipt table. Invite emails are not sent; existing profiles receive an in-app notification and pending invite links are only sent to workspace managers for copying. Billing is intentionally a mock with no payment provider or ledger. Old avatar/logo objects are not deleted when replaced.

Rerun `supabase/schema.sql` and `supabase/storage_seed.sql` to apply the new columns and avatar policies. No build, lint, or typecheck was run because project rules prohibit shell commands. Packages needed: none.

## Task FIX-3: Draft creation errors and workspace resolution

Changed only:
- `app/(customer)/app/orders/actions.ts` — the draft-idea action now logs Supabase failures with `console.error` using `error.message`, `error.code`, and `error.details`, and returns a message that includes `error.message`.
- Workspace resolution now tries the workspace id from the switcher input or the `active_workspace_id` cookie, but only after `has_workspace_access` confirms access. If neither candidate works, it uses the first workspace the user owns, then the first workspace they are a member of. If none exist it returns `No workspace found for this account`.
- Draft creation reads the signed-in user from `supabase.auth.getUser()`, uses that id for `customer_id`, uses the resolved workspace id for `workspace_id`, and still omits the generated `order_no`. Inserted columns are `kind`, `title`, `brief`, `reference_links`, `workspace_id`, `customer_id`, and `status`, all matching `supabase/schema.sql`.
- Missing or failed `requireUser()`/`getUser()` now returns `Session expired, please log in again` instead of a generic failure.

Nothing left undone. No commands run. Packages needed: none.

## Task FIX-4: Orders SELECT policy without can_access_order

Changed only:
- `supabase/schema.sql` — replaced the `orders_select_access` SELECT policy condition with a direct check: `is_admin() OR customer_id = auth.uid() OR has_workspace_access(workspace_id) OR editor_id = auth.uid() OR manager_id = auth.uid() OR thumbnail_artist_id = auth.uid()`. The policy no longer calls `can_access_order(id)`, which reads the orders table and can fail during an insert with `RETURNING`. The `drop policy if exists` statement remains before `create policy`.

Nothing else changed. No commands run. Packages needed: none.

## Task N: Admin panel shell

Created:
- `app/(admin)/admin/layout.tsx` — admin shell using `requireRole(['ADMIN','EDITOR'])`, desktop sidebar, sticky header, user identity, skip link, and command-palette trigger.
- `app/(admin)/admin/page.tsx` — ADMIN-only operations dashboard; editors are redirected to `/admin/orders`. Includes five KPI cards, orders-by-status and orders-per-week charts, and an overdue-orders table/list.
- `app/(admin)/admin/loading.tsx` and `app/(admin)/admin/error.tsx` — dashboard skeleton and retryable error boundary.
- `components/admin/nav-items.ts` — shared admin navigation definitions and role filtering; editors receive only Orders.
- `components/admin/sidebar.tsx` — role-aware client sidebar with active links and support link.
- `components/admin/command-palette.tsx` — Ctrl/Cmd+K palette with role-filtered page jumps and debounced order search by title or exact order number.
- `components/admin/orders-by-status-chart.tsx` and `components/admin/orders-per-week-chart.tsx` — client-only recharts visualizations receiving serializable data.
- `lib/data/admin.ts` — user-scoped admin order summaries, active subscription count, status labels, and status flow.

The admin dashboard shows new orders today, in-progress, overdue, in-review, and active-subscription counts. Overdue excludes `DELIVERED` and `CANCELLED` orders with a past `due_at`. Charts use the last eight weeks for weekly volume. Order links target `/admin/orders/[id]`, which will be supplied by the admin-orders task. Left undone: the other admin subpages and `/admin/orders` routes are not part of this shell task and still need to be implemented. No packages were added. No build, lint, or typecheck was run because project rules prohibit shell commands.

## Task O: Admin orders system

Created:
- `app/(admin)/admin/orders/actions.ts` — server actions with `requireRole(['ADMIN','EDITOR'])`, zod validation, admin client for writes, and audit-log insertion on every mutation. Actions include `getOrders` (with EDITOR scoping to assigned orders), `getOrderById` (with EDITOR scoping), `getStaffProfiles`, `assignStaff`, `setDueDate`, `updateInternalNotes`, `uploadDraft` (auto-increments version, sets status IN_REVIEW, notifies customer), `uploadDeliverable`, `updateStatus` (notifies customer), and `cancelOrder` (notifies customer).
- `app/api/upload/sign-staff/route.ts` — staff-only signed-upload endpoint for footage/drafts/deliverables/avatars buckets, protected by `requireRole(['ADMIN','EDITOR'])` and zod validation.
- `app/(admin)/admin/orders/page.tsx` — client orders list with table and board (columns-by-status) views, search by title/order-number, filters by status/kind/editor, and status-change dropdown on each card. Editors see only orders where they are assigned as editor, manager, or thumbnail artist.
- `app/(admin)/admin/orders/[id]/page.tsx` — client order detail page with staff assignment (manager/editor/thumbnail-artist), due date, internal notes, draft upload (with optional thumbnail and note, auto versioning), deliverable upload, review comments view, status change, cancel with reason, and audit log. All uploads use the staff sign route and private buckets. Downloads use server-signed URLs with one-hour expiry.

Nothing left undone. No packages were added. No build, lint, or typecheck was run because project rules prohibit shell commands.