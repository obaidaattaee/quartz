---
phase: 03-admin-panel
plan: 03
subsystem: admin
tags: [blog, portfolio, tiptap, crud, bilingual, inertia, react]

# Dependency graph
requires:
  - phase: 03-admin-panel/02
    provides: "Shared admin components (TiptapEditor, BilingualTabs, DataTable, ImagePickerField, MediaLibraryModal)"
provides:
  - "Blog post CRUD with Tiptap rich text editor for EN/AR content"
  - "Portfolio item CRUD with service category filter and dynamic results metrics"
  - "6 admin React pages (blog index/create/edit, portfolio index/create/edit)"
  - "4 FormRequest validators with bilingual attribute names"
  - "2 resource controllers with search, filter, pagination"
affects: [03-admin-panel/04, 03-admin-panel/05, 03-admin-panel/06, 04-blog-portfolio]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Resource controller with Inertia search/filter/pagination", "Dynamic array field management in useForm (results_metrics)", "Delete confirmation dialog pattern with state-managed Dialog"]

key-files:
  created:
    - app/Http/Controllers/Admin/BlogPostController.php
    - app/Http/Controllers/Admin/PortfolioItemController.php
    - app/Http/Requests/Admin/StoreBlogPostRequest.php
    - app/Http/Requests/Admin/UpdateBlogPostRequest.php
    - app/Http/Requests/Admin/StorePortfolioItemRequest.php
    - app/Http/Requests/Admin/UpdatePortfolioItemRequest.php
    - resources/js/pages/admin/blog/index.tsx
    - resources/js/pages/admin/blog/create.tsx
    - resources/js/pages/admin/blog/edit.tsx
    - resources/js/pages/admin/portfolio/index.tsx
    - resources/js/pages/admin/portfolio/create.tsx
    - resources/js/pages/admin/portfolio/edit.tsx
  modified:
    - routes/admin.php

key-decisions:
  - "Blog post published_at set on first publish, cleared on revert to draft, preserved on subsequent updates"
  - "Delete confirmation uses Dialog component with state-managed open/close rather than window.confirm"
  - "PaginatedData type defined locally per page (not shared) matching Laravel paginate() response shape"

patterns-established:
  - "Admin CRUD pattern: Resource controller + Store/Update FormRequests + index/create/edit pages with shared components"
  - "Dynamic array fields: useState for metrics array with add/remove/update helpers, indexed error access via keyof typeof errors cast"
  - "Status filter: Select component driving router.get with preserveState for filter persistence"

requirements-completed: [ADMN-02, ADMN-03]

# Metrics
duration: 6min
completed: 2026-03-28
---

# Phase 03 Plan 03: Blog & Portfolio CRUD Summary

**Blog post and portfolio item CRUD with Tiptap rich text, bilingual tabs, media library integration, and dynamic results metrics**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-28T09:05:34Z
- **Completed:** 2026-03-28T09:12:15Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments
- Blog post CRUD with Tiptap editor for rich EN/AR content, featured image via media library, status filtering, search, and pagination
- Portfolio item CRUD with service category filter, bilingual fields, TiptapEditor for optional case study content, and dynamic results metrics (add/remove metric rows)
- Both list pages use DataTable with search, filter dropdowns, and Dialog-based delete confirmation
- All FormRequests include bilingual attribute names for user-friendly validation error messages

## Task Commits

Each task was committed atomically:

1. **Task 1: Blog post CRUD** - `5a4647d` (feat)
2. **Task 2: Portfolio item CRUD** - `f5ffaec` (feat)

## Files Created/Modified
- `app/Http/Controllers/Admin/BlogPostController.php` - Blog CRUD with search, status filter, pagination
- `app/Http/Controllers/Admin/PortfolioItemController.php` - Portfolio CRUD with category filter
- `app/Http/Requests/Admin/StoreBlogPostRequest.php` - Blog creation validation with bilingual attributes
- `app/Http/Requests/Admin/UpdateBlogPostRequest.php` - Blog update validation with slug unique ignore
- `app/Http/Requests/Admin/StorePortfolioItemRequest.php` - Portfolio creation with category and metrics validation
- `app/Http/Requests/Admin/UpdatePortfolioItemRequest.php` - Portfolio update with slug unique ignore
- `resources/js/pages/admin/blog/index.tsx` - Blog list with DataTable, status filter, delete dialog
- `resources/js/pages/admin/blog/create.tsx` - Blog create with TiptapEditor, BilingualTabs, ImagePickerField
- `resources/js/pages/admin/blog/edit.tsx` - Blog edit with pre-filled form data
- `resources/js/pages/admin/portfolio/index.tsx` - Portfolio list with category filter, delete dialog
- `resources/js/pages/admin/portfolio/create.tsx` - Portfolio create with dynamic results metrics
- `resources/js/pages/admin/portfolio/edit.tsx` - Portfolio edit with pre-filled metrics
- `routes/admin.php` - Added blog and portfolio resource routes

## Decisions Made
- Blog post published_at set on first publish, cleared on revert to draft, preserved on subsequent updates -- prevents losing original publish timestamp on re-saves
- Delete confirmation uses Dialog component with state-managed target instead of window.confirm -- more consistent with admin panel UX pattern
- PaginatedData type defined locally per page rather than shared -- keeps each page self-contained and matches the locally-defined type in media/index.tsx

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all forms are fully wired to controllers with real database operations.

## Next Phase Readiness
- Blog and portfolio CRUD complete, ready for remaining admin features (testimonials, services, team, contacts)
- Established reusable patterns for admin CRUD pages that plans 04-06 can follow
- routes/admin.php updated with placeholder comments for remaining resource routes

## Self-Check: PASSED

All 13 created files verified present on disk. Both task commits (5a4647d, f5ffaec) verified in git log.

---
*Phase: 03-admin-panel*
*Completed: 2026-03-28*
