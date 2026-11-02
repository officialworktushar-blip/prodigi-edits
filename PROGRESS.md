# Hero Mockups Implementation

## Task Summary
Created hero mockups for 10 pages (3 services + 7 use cases) with a shared dark editor window shell, matching the Home page's HeroProductWindow style.

## Files Created

### Shared Shell
- `components/mockups/mockup-styles.ts` - CSS string with `.pem` container, dark window chrome, animations
- `components/mockups/MockupShell.tsx` - Server component with window chrome, helpers (RailClip, PopoverSwatches, Cursor)
- `components/mockups/index.tsx` - Registry mapping route slugs to mockup components

### Service Mockups
- `components/mockups/LongFormMockup.tsx` - Teal to violet palette, timeline editor with chapter markers
- `components/mockups/ShortFormMockup.tsx` - Pink to orange palette, vertical 9:16 phone frame with captions
- `components/mockups/ChannelManagementMockup.tsx` - Indigo to cyan palette, calendar grid + thumbnail concepts

### Use Case Mockups
- `components/mockups/YouTubersMockup.tsx` - Mint to teal palette, retention curve + thumbnail A/B test
- `components/mockups/BusinessesMockup.tsx` - Charcoal with sky/yellow/orange-red accents, brand kit panel + roles
- `components/mockups/PodcastersMockup.tsx` - Peach to coral palette, multitrack audio editor + toggle switches
- `components/mockups/RealtorsMockup.tsx` - Burnt orange to gold palette, house illustration + lower third
- `components/mockups/CourseCreatorsMockup.tsx` - Lilac to violet palette, chapter list with progress bars
- `components/mockups/DoctorsMockup.tsx` - Calm sky blue to teal palette, patient education with simple shapes
- `components/mockups/LawyersMockup.tsx` - Deep indigo to violet palette, document icon + scales illustration

## Files Modified
- `app/(marketing)/services/[slug]/page.tsx` - Updated imports to use new mockups from `@/components/mockups/index`
- `app/(marketing)/use-cases/[slug]/page.tsx` - Added `getHeroMockup()` helper, updated imports and hero visual

## Route → Mockup Mapping
- `/services/long-form` → LongFormMockup
- `/services/short-form` → ShortFormMockup
- `/services/channel-management` → ChannelManagementMockup
- `/use-cases/youtubers` → YouTubersMockup
- `/use-cases/businesses` → BusinessesMockup
- `/use-cases/podcasters` → PodcastersMockup
- `/use-cases/realtors` → RealtorsMockup
- `/use-cases/course-creators` → CourseCreatorsMockup
- `/use-cases/doctors` → DoctorsMockup
- `/use-cases/lawyers` → LawyersMockup

## Verification Results
- **TypeScript**: `npx tsc --noEmit` → ✓ 0 errors
- **Lint**: No lint script configured in package.json
- **Build**: `npm run build` → ✓ Success (53 pages generated, 3 service routes + 7 use-case routes)
- **SVG IDs**: All unique (checked: law-doc, doc-calm, real-grad-house, pod-wave1, pod-wave2, yt-retention, plus dynamic IDs with index/props)

## Design Notes
- Shared chrome: dark bar (#1b1f2b), rail (#232327), canvas (#2e2e33 gradient)
- CSS uses container queries (`container-type: inline-size`) for responsive scaling
- All sizes in `cqw` (container query width) units
- Animations respect `prefers-reduced-motion`
- Each mockup has unique accent color via CSS variable `--pem-accent`
- Cursor animation only runs when reduced-motion is not preferred
- No external images, fonts, or dependencies - all inline SVG + CSS

## Task: Inner page hero mockup integration

### Files created
- `components/marketing/inner-page-hero-mockups.tsx` - Original page-specific visual compositions for About, case studies, Contact, Examples, Platform, Pricing, privacy, and terms heroes.

### Files modified
- `components/marketing/marketing-page-shell.tsx` - Added an optional page-specific hero visual slot.
- `components/marketing/page-hero.tsx` - Added a responsive visual slot for legal page heroes.
- `app/(marketing)/about/page.tsx`
- `app/(marketing)/case-studies/page.tsx`
- `app/(marketing)/case-studies/[slug]/page.tsx`
- `app/(marketing)/contact/page.tsx`
- `app/(marketing)/examples/page.tsx`
- `app/(marketing)/platform/page.tsx`
- `app/(marketing)/pricing/page.tsx`
- `app/(marketing)/privacy/page.tsx`
- `app/(marketing)/terms/page.tsx`

### Existing unique mockups retained
- Service heroes: long-form editing, short-form editing, and channel management.
- Use-case heroes: YouTubers, businesses, podcasters, realtors, course creators, doctors, and lawyers.

### Anything left undone
- Production build and browser checks were not run because the project instructions prohibit shell commands and server runs; the user runs `npm run build`.
- Homepage and backend files were not modified.

## Task: Fix case study PageHero TypeScript props

### Files modified
- `app/(marketing)/case-studies/[slug]/page.tsx` - Removed `tone` and `pill` props that belong to the separate sections PageHero API. The imported marketing PageHero is already dark by default and renders no pill.
- `PROGRESS.md` - Recorded this targeted fix.

### Verification
- `npm run build` - Passed (Next.js 14.2.35; 53 static pages generated).
- Confirmed `pill={null}` was also unsupported by the marketing PageHero props and was removed from that usage.
- No backend or routing behavior changed.

## Task: Replace inner-page hero mockups with layered UI compositions

### Files created
- None.

### Files modified
- `components/mockups/MockupShell.tsx` - Added layered support and floating panels to the service and use-case hero compositions.
- `components/mockups/LongFormMockup.tsx`
- `components/mockups/ShortFormMockup.tsx`
- `components/mockups/ChannelManagementMockup.tsx`
- `components/mockups/YouTubersMockup.tsx`
- `components/mockups/BusinessesMockup.tsx`
- `components/mockups/PodcastersMockup.tsx`
- `components/mockups/RealtorsMockup.tsx`
- `components/mockups/CourseCreatorsMockup.tsx`
- `components/mockups/DoctorsMockup.tsx`
- `components/mockups/LawyersMockup.tsx`
- `components/marketing/inner-page-hero-mockups.tsx` - Added distinct layered support and floating panels to the remaining inner-page mockups.

### Anything left undone
- Browser-based desktop, tablet, and mobile visual inspection was not run; no server was started per project instructions.
- Homepage, backend, APIs, and business logic were not modified.

### Verification
- `npm run build` - Passed (Next.js 14.2.35; 53 static pages generated).

## Task: Replace service hero mockups with uploaded transparent images

### Files created
- `public/service-mockups/service-long-form-editing.png`
- `public/service-mockups/service-channel-management.png`
- `public/service-mockups/service-short-form-editing.png`

### Files modified
- `app/(marketing)/services/[slug]/page.tsx` - Maps each service route to its supplied transparent image using Next Image.
- `components/mockups/index.tsx` - Removed service mockups from the component registry.
- `PROGRESS.md` - Recorded this task.

### Files removed
- `components/mockups/LongFormMockup.tsx`
- `components/mockups/ShortFormMockup.tsx`
- `components/mockups/ChannelManagementMockup.tsx`
- `components/marketing/services/service-hero-mockups.tsx` (unused older service mockups)

### Anything left undone
- Production build and browser viewport inspection were not run because the project instructions prohibit shell commands and starting a server.
- Homepage and backend files were not modified.

## Task: Scale service hero mockups by 20%

### Files modified
- `app/(marketing)/services/[slug]/page.tsx` - Applied a 1.2 scale to all service hero images at the desktop two-column breakpoint, preserving mobile sizing and image aspect ratio.
- `PROGRESS.md` - Recorded this task.

### Anything left undone
- Build and browser visual checks were not run; project instructions prohibit shell commands and server runs.

## Task: Redesign all seven use case heroes

### Files created
- `components/marketing/use-cases/use-case-hero.tsx` - Responsive dark split-layout hero with preserved page data, CTA links, gradient phrase highlighting, and reduced-motion-aware entrance animation.
- `components/marketing/use-cases/use-case-hero-visuals.tsx` - Seven distinct dark product interface compositions for the actual use case audiences.

### Files modified
- `app/(marketing)/use-cases/[slug]/page.tsx` - Replaced the shared hero and old visual mapping with the new UseCaseHero and route-specific visuals.
- `PROGRESS.md` - Recorded this task.

### Files removed
- Removed the obsolete `components/mockups` package, including its seven old use case mockups and shared shell; no other source files referenced it after the route switch.

### Verification
- `npm run build` - Passed; TypeScript and Next.js build completed, 53 static pages generated.
- Confirmed the seven existing use case slugs remain unchanged: YouTubers, Businesses, Podcasters, Realtors, Course Creators, Doctors, and Lawyers.
- Homepage, navigation, footer, other page sections, and backend/business logic were not modified.

### Anything left undone
- Browser-based desktop, tablet, and mobile visual inspection was not run; no server was started.

## Task: Increase service hero vertical spacing by 25%

### Files modified
- `components/sections/page-hero.tsx` - Added a container class override for page-specific vertical spacing.
- `app/(marketing)/services/[slug]/page.tsx` - Increased top and bottom padding by 25% at base, small, and large breakpoints for all three service pages.
- `PROGRESS.md` - Recorded this task.

### Anything left undone
- Build and browser checks were not run; the project instructions prohibit shell commands and server runs.

## Task: Increase inner-page hero vertical spacing

### Files modified
- `components/sections/page-hero.tsx` - Increased default top and bottom padding by 30% for inner pages using the shared section hero.
- `app/(marketing)/services/[slug]/page.tsx` - Set service hero top and bottom padding to 10% above the original values.
- `components/marketing/page-hero.tsx` - Increased compact and default legal/case-study hero padding by 30%.
- `components/marketing/use-cases/use-case-hero.tsx` - Increased use case hero padding by 30%.
- `PROGRESS.md` - Recorded this task.

### Anything left undone
- Build and browser checks were not run; the project instructions prohibit shell commands and server runs.
- Homepage hero remains unchanged.
## Task: Increase all non-homepage hero vertical spacing by 25%

- Updated top and bottom hero padding for service pages and all shared inner-page hero variants to 25% above their original baseline values at each breakpoint.
- Left the homepage hero unchanged.
- Files modified: `components/sections/page-hero.tsx`, `app/(marketing)/services/[slug]/page.tsx`, `components/marketing/page-hero.tsx`, `components/marketing/use-cases/use-case-hero.tsx`, `PROGRESS.md`.
- Build/browser checks were not run; project instructions prohibit shell commands and server runs.

## Task: Widen and enlarge the three service hero mockups

- Added service-only hero layout classes to widen the text/mockup split, reduce horizontal padding, and allocate about 25% more mockup width at 1440px and above while keeping a 24px right margin.
- Removed the previous CSS scale transform so the image sizing is accounted for by layout dimensions. At laptop and smaller widths, the mockup follows the available grid width and stacks on mobile.
- Kept service copy and image assets unchanged. No other pages or homepage files were modified.
- Files modified: `components/sections/page-hero.tsx`, `app/(marketing)/services/[slug]/page.tsx`, `PROGRESS.md`.

### Anything left undone
- Production build and visual browser checks were not run because the project instructions prohibit shell commands and server runs.

## Task: Add left margin to service hero text

- Added a responsive left margin to the text column in service heroes only, using 12px on mobile, 16px at small breakpoints, and 20px on desktop.
- Files modified: `components/sections/page-hero.tsx`, `app/(marketing)/services/[slug]/page.tsx`, `PROGRESS.md`.
- Build and browser checks were not run per project instructions.

