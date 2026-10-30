# PROJECT
Productized video-editing service platform ("CutCrew", brand name stored only in lib/config.ts).
3 surfaces: (1) public marketing site, (2) customer panel at /app, (3) admin panel at /admin.

# ABSOLUTE RULES (never break)
1. NEVER run shell commands, install packages, or start a server. Only create/edit files. The user runs npm install and npm run build.
2. Use ONLY packages already in package.json. Never invent versions. If another package is needed, list it in PROGRESS.md under "Packages needed" and write a hand-made alternative.
3. Always write COMPLETE files. No "// rest of code", "TODO", "..." or placeholders.
4. One task at a time. Print a short plan first, then implement. After finishing, append to PROGRESS.md: task name, files created, anything left undone.
5. Original copy only. Never copy text/images from tastyedits.com or beautiful.ai.

# STACK
Next.js 14 App Router, TypeScript, Tailwind CSS, lucide-react, framer-motion, Supabase, zod, react-hook-form, recharts.
Hand-written UI components in components/ui (shadcn style). No external image URLs.

# BACKEND
- Backend = Supabase only (Postgres + RLS, Auth, Storage, Realtime) via @supabase/supabase-js and @supabase/ssr. NO legacy ORM, NO legacy auth library, NO SQLite, NO standalone password hashing.
- Server code uses supabase.auth.getUser(), never getSession().
- Service-role key only in lib/supabase/admin.ts, server code only, never in a "use client" file.
- Every server action and route handler starts with requireUser/requireRole from lib/guards.ts.
- DB columns are snake_case, types live in types/db.ts. Pages must never crash if Supabase returns null or empty.

# NEXT.JS 14 RULES
- Next.js is 14.x and React is 18.3: cookies()/headers() are SYNCHRONOUS, and page props `params` and `searchParams` are plain objects (NOT Promises). Use `const cookieStore = cookies()` in lib/supabase/server.ts.

# TAILWIND
- Read the Tailwind version in package.json and write the right rule: v4 uses CSS @theme in globals.css with no tailwind.config.ts; v3 extends tailwind.config.ts.
- Current project uses Tailwind 3.4.4: extend tailwind.config.ts.

# FOLDERS
app/(marketing)  app/(auth)  app/(customer)/app  app/(admin)/admin  app/auth/callback  app/api
components/ui  components/shared  components/marketing  components/customer  components/admin
lib/supabase/client.ts  lib/supabase/server.ts  lib/supabase/admin.ts  lib/supabase/middleware.ts
lib/config.ts  lib/guards.ts  lib/data/*
supabase/schema.sql  types/db.ts

# EXISTING FILES
- Existing files from the old setup (UI, marketing pages, lib/config.ts, lib/data/*) are kept.
- Backend files (lib/guards.ts, middleware.ts, auth pages, anything that imports legacy database, auth, or password modules) must be rewritten for Supabase.

# DESIGN (Beautiful.ai style)
- Airy, lots of whitespace, max width 1200px, bg white / #FAFAFC, text #0F1222
- Primary indigo-blue gradient (#4F46E5 -> #3B82F6); soft blue/pink/lavender blurred gradient mesh in hero only
- Big tight headlines with ONE highlighted gradient word
- Cards rounded-2xl, buttons rounded-full pills, inputs rounded-xl, 1px slate-200 borders, very soft shadows
- framer-motion: fade-up on scroll, hover lift, 200-300ms
- Mobile-first, accessible (labels, focus rings, contrast)

# ROLES
CUSTOMER -> /app/*   |   ADMIN -> /admin/*   |   EDITOR -> limited /admin/orders only

# ORDER STATUS FLOW
DRAFT > SUBMITTED > ASSIGNED > IN_PROGRESS > IN_REVIEW > REVISION_REQUESTED (loops back to IN_PROGRESS) > APPROVED > DELIVERED (or CANCELLED)
