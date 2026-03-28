# Phase 3: Admin Panel - Context

**Gathered:** 2026-03-28 (auto mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Dashboard with key metrics, full CRUD for blog posts (with Tiptap rich text editor and bilingual fields), portfolio/case study entries, contact lead management with status tracking, testimonial management, service page content editing, team member management, media library with upload/browse/reuse and thumbnail generation, site settings (logo, brand colors, contact info, social links), and role-based access (admin + editor). All admin pages use the existing AppLayout sidebar pattern and are React-based via Inertia.js (same stack as the public site).

</domain>

<decisions>
## Implementation Decisions

### Admin Navigation & Section Structure
- **D-01:** Reuse existing AppLayout with sidebar (`app-sidebar.tsx`). Extend `mainNavItems` array with grouped sections. No new layout needed — the sidebar-based admin layout already exists.
- **D-02:** Sidebar groups: **Content** (Blog Posts, Portfolio/Case Studies), **Website** (Services, Testimonials, Team Members), **Communication** (Contact Leads, Newsletter Subscribers), **System** (Site Settings, Media Library, Users/Roles). Dashboard stays as top-level nav item.
- **D-03:** Each admin section gets its own index (list) page and create/edit form pages. Consistent pattern: list with search/filter → create/edit form → delete confirmation dialog.
- **D-04:** Admin pages live under `resources/js/pages/admin/` directory (e.g., `admin/blog/index.tsx`, `admin/blog/create.tsx`, `admin/blog/edit.tsx`). Routes grouped under `/admin/` prefix with auth middleware.

### Rich Text Editor (Tiptap)
- **D-05:** Use Tiptap as the rich text editor for blog posts and any long-form bilingual content (ADMN-02). Standard content toolbar: headings (H2, H3, H4), bold, italic, strikethrough, ordered/unordered lists, blockquote, code block, links, images (via media library), horizontal rule.
- **D-06:** Bilingual editing uses a tabbed interface — EN and AR tabs on the same form. Each tab shows the same form fields but for that locale. Switching tabs preserves unsaved content in both locales. Both locales saved together on form submit.
- **D-07:** Image insertion in Tiptap triggers the media library modal (D-11). Uploaded/selected images are inserted as responsive `<img>` tags with alt text.
- **D-08:** Blog post preview opens the post rendered with the public site layout in a new tab, showing exactly how it will look to visitors.

### Media Library
- **D-09:** Media library is a modal overlay browser accessible from any image upload field across the admin panel. Also available as a standalone page under System section for bulk management.
- **D-10:** Upload via drag-and-drop zone or file picker button. Multiple file upload supported. Server generates thumbnails (small: 150x150, medium: 400x300) on upload using Laravel image processing (Intervention Image or native GD).
- **D-11:** Files stored in `storage/app/public/media/` with organized subdirectories by year/month (e.g., `media/2026/03/filename.jpg`). Public URL via Laravel's storage symlink (`/storage/media/...`).
- **D-12:** Media library list view shows thumbnail grid with file name, dimensions, size, and upload date. Search by filename. No folder/tag system for v1 — kept simple.

### Content Data Migration Strategy
- **D-13:** New database tables created for all admin-managed content: `blog_posts`, `portfolio_items`, `testimonials`, `service_pages`, `team_members`. Each table has bilingual columns (e.g., `title_en`, `title_ar`, `content_en`, `content_ar`).
- **D-14:** Database seeders populate initial content from existing Phase 02 JSON translation files (`en.json`/`ar.json`). This is the migration path established in Phase 02 D-14: JSON → database with admin UI.
- **D-15:** Frontend controllers pass database content as Inertia props. Public pages read from database (not JSON files) once admin panel is live. JSON translations remain for UI strings (button labels, nav items, form labels) but not for managed content.
- **D-16:** A `media` table stores uploaded file metadata (path, filename, mime_type, size, dimensions, thumbnails, created_at). Media items can be associated with any content type.

### Role & Permission System
- **D-17:** Simple `role` enum column added to `users` table with values: `admin`, `editor`. Default role is `editor`. No external package (Spatie) — two roles don't justify the overhead.
- **D-18:** Authorization enforced via Laravel Gates and Policies. Middleware `role:admin` protects admin-only routes (site settings, user management, service page editing, testimonials, team members). Editor role accesses blog posts and portfolio management only (ADMN-09).
- **D-19:** Admin sidebar dynamically shows/hides sections based on user role. Editors see only Content section (Blog Posts, Portfolio). Admins see everything.
- **D-20:** No self-registration for admin/editor users. Admins create editor accounts through the Users management section.

### Site Settings & Theme Customization
- **D-21:** Single `site_settings` table with `key` (string, unique) and `value` (JSON) columns. Settings grouped logically: branding (logo, favicon, site name), colors (primary color, secondary color), contact (phone, email, WhatsApp, address), social (LinkedIn, Twitter/X, GitHub, Instagram URLs).
- **D-22:** Color picker component for primary/secondary brand colors. Selected colors stored as hex values. Applied at runtime by injecting CSS custom property overrides via Inertia shared data (HandleInertiaRequests middleware). This overrides the design tokens from Phase 01's `app.css`.
- **D-23:** Logo upload uses the media library. Uploaded logo replaces the AppLogo component's source dynamically. Site name is editable and used in meta tags and header.
- **D-24:** Settings are cached in Laravel application cache with a configurable TTL. Cache is busted on settings update. Shared to all pages via HandleInertiaRequests middleware.

### Claude's Discretion
- Dashboard widget design and metric card styling — use the existing card/border patterns from the starter kit
- Exact sidebar icon choices for each section (Lucide icons)
- Table component design for list views (use existing Radix UI Table or a simple Tailwind table)
- Form validation UX details (inline errors, toast notifications on save)
- Tiptap extension selection and configuration details
- Thumbnail generation sizing and quality settings
- Admin pagination style (simple prev/next or numbered pages)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Admin Panel Requirements
- `.planning/REQUIREMENTS.md` -- ADMN-01 through ADMN-10: Dashboard, blog CRUD, portfolio CRUD, contact leads, testimonials, service editing, site settings, media library, roles, team management

### Phase 01 Foundation (Must Reuse)
- `resources/js/layouts/app-layout.tsx` -- Existing AppLayout with sidebar, to be extended with admin nav sections
- `resources/js/components/app-sidebar.tsx` -- Sidebar component with NavMain pattern, extend for admin sections
- `resources/js/components/ui/` -- Radix UI primitives (button, card, input, badge, dialog, dropdown-menu, table, etc.)
- `resources/css/app.css` -- Design tokens and CSS custom properties that site settings will override

### Phase 02 Content (Data Migration Source)
- `resources/lang/en.json` -- English content strings to seed into database tables
- `resources/lang/ar.json` -- Arabic content strings to seed into database tables
- `app/Models/Contact.php` -- Existing Contact model with status field (new/read/handled)
- `app/Models/NewsletterSubscriber.php` -- Existing newsletter model
- `app/Models/User.php` -- User model to be extended with role column

### Auth & Middleware
- `app/Http/Middleware/HandleInertiaRequests.php` -- Where site settings and role data will be shared to frontend
- `app/Providers/FortifyServiceProvider.php` -- Fortify auth configuration

### Phase 01 & 02 Context (Design Decisions)
- `.planning/phases/01-foundation-design-system/01-CONTEXT.md` -- Brand colors, animation personality, layout decisions
- `.planning/phases/02-public-marketing-site/02-CONTEXT.md` -- Content data strategy (D-12 through D-14), contact system, newsletter

### Project Context
- `.planning/PROJECT.md` -- Vision, constraints, key decisions
- `.planning/ROADMAP.md` -- Phase 3 success criteria and requirement mapping

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `AppLayout` + `AppSidebar` -- sidebar-based admin layout already functional, just needs more nav items
- `NavMain` component -- renders sidebar nav items from an array, supports icons and active state
- `NavUser` component -- user menu in sidebar footer (profile, settings, logout)
- Radix UI components -- Button, Card, Input, Dialog, DropdownMenu, Table, Badge, Select, Textarea all available
- `Contact` model -- already has status field and CRUD potential, needs list/filter UI
- `NewsletterSubscriber` model -- simple model, needs admin list view
- `PlaceholderPattern` -- used in current dashboard, will be replaced with real metric widgets
- `InputError` component -- validation error display, reuse for all admin forms
- `cn()` utility -- Tailwind class merging
- Inertia `useForm()` hook -- handles form state, validation errors, submission

### Established Patterns
- Page layout assignment: `Component.layout = { breadcrumbs: [...] }` pattern for all admin pages
- Controller → Inertia::render() with props → React page component pattern
- FormRequest validation on server, error display via useForm on client
- Route grouping in separate files (web.php, settings.php) — add admin.php for admin routes
- Wayfinder generates TypeScript route helpers — admin routes will auto-generate

### Integration Points
- `routes/` -- new `admin.php` route file for all admin routes, grouped with auth + role middleware
- `app/Http/Controllers/Admin/` -- new controller namespace for admin operations
- `app/Http/Middleware/` -- new `EnsureUserHasRole` middleware for role-based access
- `database/migrations/` -- new tables: blog_posts, portfolio_items, testimonials, service_pages, team_members, media, site_settings; alter users table for role column
- `app/Models/` -- new models for each content type
- `resources/js/pages/admin/` -- new page directory for all admin pages
- `resources/js/components/admin/` -- shared admin components (data tables, form builders, media picker)
- `app/Http/Middleware/HandleInertiaRequests.php` -- share site_settings and user role to all pages

</code_context>

<specifics>
## Specific Ideas

- Admin panel uses the same Inertia.js + React stack as the public site — no separate SPA, no different framework
- The existing AppLayout sidebar is the admin shell — extend it, don't replace it
- Phase 02 established the JSON → database migration path (D-14) — this phase executes that transition
- Non-technical users must manage content without touching code (PROJECT.md constraint)
- Tiptap RTL has known issues (STATE.md blocker) — needs validation during implementation
- Editor role is for content team members who need blog/portfolio access without full admin (ADMN-09)

</specifics>

<deferred>
## Deferred Ideas

- Content scheduling and workflow (draft → review → publish) -- v2 ADMN-12
- Activity log / audit trail for admin actions -- v2 ADMN-11
- Analytics dashboard with traffic data -- v2 ADMN-13
- Content versioning / revision history -- v2 BLOG-11
- Advanced search when blog exceeds 50+ posts -- v2 ENGM-02

</deferred>

---

*Phase: 03-admin-panel*
*Context gathered: 2026-03-28*
