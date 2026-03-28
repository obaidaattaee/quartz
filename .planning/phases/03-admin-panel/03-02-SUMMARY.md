---
phase: 03-admin-panel
plan: 02
subsystem: ui
tags: [tiptap, media-library, drag-drop, rich-text-editor, bilingual, rtl, data-table, pagination, sortable-list, intervention-image]

# Dependency graph
requires:
  - phase: 03-01
    provides: "Admin layout, sidebar, dashboard, Media model + service, admin types"
provides:
  - "MediaController with upload/list/delete JSON + Inertia endpoints"
  - "MediaUploadZone drag-and-drop component"
  - "MediaLibraryModal with thumbnail grid, search, and selection"
  - "ImagePickerField for form integration with media library"
  - "Standalone media library management page"
  - "TiptapEditor with StarterKit, Image, Link extensions and RTL support"
  - "TiptapToolbar with formatting, headings, lists, blocks, link/image insert"
  - "BilingualTabs with forceMount preventing content loss on tab switch"
  - "DataTable generic component with search and column rendering"
  - "AdminPagination matching Laravel pagination links structure"
  - "SortableList with move-up/move-down reordering controls"
affects: [03-03, 03-04, 03-05, 03-06]

# Tech tracking
tech-stack:
  added: ["@tiptap/react", "@tiptap/starter-kit", "@tiptap/extension-image", "@tiptap/extension-link", "@tiptap/pm", "shadcn table", "shadcn tabs", "shadcn textarea", "shadcn switch"]
  patterns: ["MediaLibraryModal fetch-based JSON API for modal usage", "forceMount on bilingual tabs to preserve editor state", "Generic DataTable<T> with Column<T> pattern", "AdminPagination wrapping Laravel links array"]

key-files:
  created:
    - "app/Http/Controllers/Admin/MediaController.php"
    - "app/Http/Requests/Admin/StoreMediaRequest.php"
    - "resources/js/components/admin/media-upload-zone.tsx"
    - "resources/js/components/admin/media-library-modal.tsx"
    - "resources/js/components/admin/image-picker-field.tsx"
    - "resources/js/pages/admin/media/index.tsx"
    - "resources/js/components/admin/tiptap-editor.tsx"
    - "resources/js/components/admin/tiptap-toolbar.tsx"
    - "resources/js/components/admin/bilingual-tabs.tsx"
    - "resources/js/components/admin/data-table.tsx"
    - "resources/js/components/admin/admin-pagination.tsx"
    - "resources/js/components/admin/sortable-list.tsx"
    - "resources/js/components/ui/table.tsx"
    - "resources/js/components/ui/tabs.tsx"
    - "resources/js/components/ui/textarea.tsx"
    - "resources/js/components/ui/switch.tsx"
  modified:
    - "routes/admin.php"
    - "package.json"
    - "package-lock.json"

key-decisions:
  - "Used fetch API for MediaLibraryModal JSON requests instead of Inertia router (modal context requires non-page JSON responses)"
  - "forceMount + data-[state=inactive]:hidden on BilingualTabs to prevent Tiptap content loss on tab switch"
  - "setContent with emitUpdate:false to handle external content prop changes in TiptapEditor without infinite loops"
  - "Simple move-up/move-down SortableList pattern instead of @dnd-kit (suitable for small item counts)"

patterns-established:
  - "Media fetch pattern: components use fetch('/admin/media', Accept: 'application/json') for modal browsing, Inertia for page rendering"
  - "Generic DataTable<T> with Column<T> render functions for all admin list pages"
  - "AdminPagination wrapping Laravel pagination links with Inertia Link components"
  - "TiptapEditor with isExternalUpdate ref to break update cycles"

requirements-completed: [ADMN-08]

# Metrics
duration: 8min
completed: 2026-03-28
---

# Phase 03 Plan 02: Media Library & Shared Admin Components Summary

**Media library with drag-drop upload, thumbnail browsing, and modal selection plus Tiptap rich text editor, bilingual tabs, data table, pagination, and sortable list reusable components for all admin CRUD pages**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-28T08:54:17Z
- **Completed:** 2026-03-28T09:02:09Z
- **Tasks:** 2
- **Files modified:** 19

## Accomplishments
- Full media library backend (upload, list, delete) with thumbnail generation via Intervention Image, supporting both JSON and Inertia responses
- Drag-and-drop upload zone, browsable modal with search/pagination, image picker field for forms, and standalone media management page
- Tiptap rich text editor with toolbar (formatting, headings, lists, blocks, link/image insert) and RTL direction support
- BilingualTabs with forceMount preventing content loss when switching between EN/AR (critical Pitfall 1 from research)
- Generic DataTable, AdminPagination, and SortableList components ready for all admin CRUD pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Media library backend, upload zone, modal, and standalone page** - `38eafbe` (feat)
2. **Task 2: Tiptap editor, bilingual tabs, data table, pagination, and sortable list** - `2a6abec` (feat)

## Files Created/Modified
- `app/Http/Controllers/Admin/MediaController.php` - Media CRUD controller with JSON + Inertia responses
- `app/Http/Requests/Admin/StoreMediaRequest.php` - Image upload validation (10MB max, jpeg/png/webp/gif)
- `resources/js/components/admin/media-upload-zone.tsx` - Drag-and-drop upload with progress and error handling
- `resources/js/components/admin/media-library-modal.tsx` - Dialog-based media browser with search and Load More
- `resources/js/components/admin/image-picker-field.tsx` - Form field with preview, change, and remove
- `resources/js/pages/admin/media/index.tsx` - Standalone media library page with grid, search, delete
- `resources/js/components/admin/tiptap-editor.tsx` - Rich text editor with StarterKit + Image + Link
- `resources/js/components/admin/tiptap-toolbar.tsx` - Editor toolbar with all formatting controls
- `resources/js/components/admin/bilingual-tabs.tsx` - EN/AR tabbed editor with forceMount
- `resources/js/components/admin/data-table.tsx` - Generic table with search and column rendering
- `resources/js/components/admin/admin-pagination.tsx` - Laravel pagination links wrapper
- `resources/js/components/admin/sortable-list.tsx` - Reorderable list with up/down controls
- `resources/js/components/ui/table.tsx` - shadcn Table primitive
- `resources/js/components/ui/tabs.tsx` - shadcn Tabs primitive
- `resources/js/components/ui/textarea.tsx` - shadcn Textarea primitive
- `resources/js/components/ui/switch.tsx` - shadcn Switch primitive
- `routes/admin.php` - Added media routes (index, store, destroy)
- `package.json` - Added Tiptap dependencies
- `package-lock.json` - Dependency lock file updated

## Decisions Made
- Used fetch API (not Inertia router) for MediaLibraryModal since modal context needs non-page JSON responses
- Applied forceMount + CSS hidden to BilingualTabs to keep both editors mounted and prevent content loss
- Used emitUpdate:false option in TiptapEditor setContent to prevent infinite update loops on external content changes
- Simple move-up/move-down SortableList over @dnd-kit since admin lists typically have 5-10 items

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TiptapEditor setContent API for Tiptap v3**
- **Found during:** Task 2 (TiptapEditor component)
- **Issue:** Tiptap v3 changed setContent second parameter from boolean to options object -- passing `false` caused TypeScript error
- **Fix:** Changed `setContent(content, false)` to `setContent(content, { emitUpdate: false })`
- **Files modified:** `resources/js/components/admin/tiptap-editor.tsx`
- **Verification:** TypeScript compilation passes with no new errors
- **Committed in:** `2a6abec` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Minor API correction for Tiptap v3 compatibility. No scope creep.

## Issues Encountered
- Build (`npm run build`) fails in worktree because wayfinder plugin requires PHP vendor directory -- this is a pre-existing worktree limitation, not related to this plan's changes. TypeScript compilation (`tsc --noEmit`) confirms no new type errors.

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all components are fully functional with real data sources wired.

## Next Phase Readiness
- All shared admin components are built and ready for Blog CRUD (Plan 03), Portfolio CRUD (Plan 04), and other content management pages
- MediaLibraryModal is importable from any admin form for image selection
- TiptapEditor supports RTL direction for Arabic content editing
- BilingualTabs safely preserves editor content across tab switches
- DataTable, AdminPagination, and SortableList are generic and typed for reuse

## Self-Check: PASSED

All 16 created files verified present. Both task commits (38eafbe, 2a6abec) verified in git history.

---
*Phase: 03-admin-panel*
*Completed: 2026-03-28*
