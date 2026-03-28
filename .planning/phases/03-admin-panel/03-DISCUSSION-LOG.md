# Phase 3: Admin Panel - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 03-admin-panel
**Mode:** auto
**Areas discussed:** Admin Navigation, Rich Text Editor, Media Library, Content Data Migration, Role & Permission System, Site Settings & Theming

---

## Admin Navigation & Section Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Grouped sidebar sections | Extend existing AppLayout sidebar with Content/Website/Communication/System groups | auto |
| Tabbed top navigation | Horizontal tabs instead of sidebar sections | |
| Separate admin SPA | Standalone admin app with different framework | |

**User's choice:** [auto] Grouped sidebar sections (recommended default)
**Notes:** Reuses the existing AppLayout/AppSidebar pattern from the starter kit. Most natural fit for the current codebase architecture.

---

## Rich Text Editor (Tiptap) — Bilingual Editing UX

| Option | Description | Selected |
|--------|-------------|----------|
| Tabbed EN/AR interface | EN and AR tabs on same form, switch between locales | auto |
| Side-by-side editors | Two Tiptap editors visible simultaneously | |
| Separate create pages | Different form pages per locale | |

**User's choice:** [auto] Tabbed EN/AR interface (recommended default)
**Notes:** Tabs keep the form compact and consistent. Side-by-side is useful but doubles screen real estate. Tabs align with how most CMS bilingual editors work.

## Rich Text Editor — Toolbar Configuration

| Option | Description | Selected |
|--------|-------------|----------|
| Standard content toolbar | H2-H4, bold/italic/strike, lists, blockquote, code, links, images, HR | auto |
| Minimal toolbar | Bold, italic, lists, links, images only | |
| Full-featured toolbar | Above + tables, embeds, color picker, font size | |

**User's choice:** [auto] Standard content toolbar (recommended default)
**Notes:** Covers blog and portfolio content needs without adding complexity. Full-featured deferred to v2 if needed.

---

## Media Library UX

| Option | Description | Selected |
|--------|-------------|----------|
| Modal overlay browser | Triggered from image fields, also available standalone | auto |
| Inline browser | Embedded browser widget on each page | |
| Upload-only | Simple upload with no browsing/reuse | |

**User's choice:** [auto] Modal overlay browser (recommended default)
**Notes:** Modal pattern is standard for CMS media management. Allows reuse across all content types without page navigation.

---

## Content Data Migration Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| New DB tables + seeders from JSON | Bilingual columns, seed from existing en/ar.json | auto |
| EAV (entity-attribute-value) | Flexible schema for all content types | |
| Keep JSON + add DB overlay | JSON as source of truth, DB for overrides | |

**User's choice:** [auto] New DB tables + seeders from JSON (recommended default)
**Notes:** Clean separation of concerns. Follows Phase 02 D-14 migration path. EAV adds query complexity for simple use case. JSON overlay creates confusing dual source of truth.

---

## Role & Permission System

| Option | Description | Selected |
|--------|-------------|----------|
| Simple role column + Gate/Policy | Enum column on users table, Laravel Gates for authorization | auto |
| Spatie Laravel Permission | Full-featured package with DB-backed permissions | |
| Custom permission table | Separate permissions table with user-permission mapping | |

**User's choice:** [auto] Simple role column + Gate/Policy (recommended default)
**Notes:** Only 2 roles needed (admin/editor). Spatie adds migration overhead and package dependency for a simple binary check. Can upgrade to Spatie later if roles grow.

---

## Site Settings & Theme Customization

| Option | Description | Selected |
|--------|-------------|----------|
| Key-value settings table with cache | Single table, JSON values, Laravel cache | auto |
| Settings model per section | Separate models for branding, contact, social | |
| .env / config file based | Store in environment or config files | |

**User's choice:** [auto] Key-value settings table with cache (recommended default)
**Notes:** Single table is flexible and simple. Separate models add unnecessary complexity for ~15-20 settings. Config-file approach requires code deployment to change settings — defeats the purpose.

---

## Claude's Discretion

- Dashboard widget design and metric card styling
- Sidebar icon choices (Lucide icons)
- Table component design for list views
- Form validation UX details
- Tiptap extension configuration specifics
- Thumbnail generation sizing
- Admin pagination style

## Deferred Ideas

- Content scheduling workflow (draft → review → publish) -- v2
- Activity log / audit trail -- v2
- Analytics dashboard -- v2
- Content versioning -- v2
- Advanced search -- v2
