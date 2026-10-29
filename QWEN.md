# PROJECT
Productized video-editing service platform ("CutCrew", brand name stored only in lib/config.ts).
3 surfaces: (1) public marketing site, (2) customer panel at /app, (3) admin panel at /admin.

# ABSOLUTE RULES (never break)
1. NEVER run shell/terminal commands. Never install packages. Never start a server. Only create/edit files.
2. If a package is needed, add it to package.json by hand and list it in PROGRESS.md under "Packages to install".
3. Always write COMPLETE files. Never write "// rest of code", "TODO", "...", or placeholders.
4. One task at a time. Do only what the task asks. Do not refactor unrelated files.
5. Before coding, print a short plan (file list + one line each). Then implement.
6. After finishing, append to PROGRESS.md: task name, files created, anything left undone.
7. Original copy only. Never copy text/images from tastyedits.com or beautiful.ai.

# STACK
Next.js 14 App Router, TypeScript, Tailwind CSS, lucide-react, framer-motion, Prisma + SQLite, NextAuth (credentials), zod, react-hook-form, recharts.
Hand-written UI components in components/ui (shadcn style). No external image URLs.

# FOLDERS
app/(marketing)  app/(auth)  app/(customer)/app  app/(admin)/admin  app/api
components/ui  components/shared  components/marketing  components/customer  components/admin
lib/config.ts  lib/db.ts  lib/auth.ts  lib/guards.ts  lib/storage.ts  lib/payments.ts  lib/mailer.ts
prisma/schema.prisma  prisma/seed.ts

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