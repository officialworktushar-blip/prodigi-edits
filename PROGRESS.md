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