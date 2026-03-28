---
phase: 03-admin-panel
plan: 04
subsystem: admin
tags: [laravel, inertia, react, crud, bilingual, sortable, contacts, testimonials, team]

# Dependency graph
requires:
  - phase: 03-02
    provides: Shared admin components (DataTable, SortableList, BilingualTabs, ImagePickerField, MediaLibraryModal)
provides:
  - ContactLeadController with list, detail, and status management
  - TestimonialController with full CRUD, reorder, and visibility toggle
  - TeamMemberController with full CRUD and reorder
  - 8 React admin pages for contacts, testimonials, and team members
  - 4 form request validation classes with bilingual field attributes
affects: [03-05, 03-06, public-site-testimonials, public-site-team]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Sort order swap pattern for reorderable admin lists"
    - "Status card filtering pattern for contact lead management"
    - "Delete confirmation dialog pattern with Dialog component"

key-files:
  created:
    - app/Http/Controllers/Admin/ContactLeadController.php
    - app/Http/Controllers/Admin/TestimonialController.php
    - app/Http/Controllers/Admin/TeamMemberController.php
    - app/Http/Requests/Admin/StoreTestimonialRequest.php
    - app/Http/Requests/Admin/UpdateTestimonialRequest.php
    - app/Http/Requests/Admin/StoreTeamMemberRequest.php
    - app/Http/Requests/Admin/UpdateTeamMemberRequest.php
    - resources/js/pages/admin/contacts/index.tsx
    - resources/js/pages/admin/contacts/show.tsx
    - resources/js/pages/admin/testimonials/index.tsx
    - resources/js/pages/admin/testimonials/create.tsx
    - resources/js/pages/admin/testimonials/edit.tsx
    - resources/js/pages/admin/team/index.tsx
    - resources/js/pages/admin/team/create.tsx
    - resources/js/pages/admin/team/edit.tsx
  modified:
    - routes/admin.php

key-decisions:
  - "Used sort_order swap pattern (find adjacent item, swap values) for reordering instead of bulk reindex"
  - "Contact leads are read-only with status tracking -- no create/edit/delete since they come from public form"
  - "Testimonials and team pages load all items without pagination since collections are typically small"

patterns-established:
  - "Sort order swap: find adjacent by direction, swap sort_order values between two records"
  - "Status card filter: clickable cards that filter list via router.get with preserveState"
  - "Delete confirmation: Dialog with destructive button, state-driven open/close"

requirements-completed: [ADMN-04, ADMN-05, ADMN-10]

# Metrics
duration: 7min
completed: 2026-03-28
---

# Phase 03 Plan 04: Contacts, Testimonials & Team Admin Summary

**Contact lead management with status filtering, testimonial CRUD with visibility toggle and reorder, team member CRUD with photo upload and reorder -- all admin-only routes**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-28T09:05:42Z
- **Completed:** 2026-03-28T09:13:29Z
- **Tasks:** 2
- **Files modified:** 16

## Accomplishments
- Contact lead management with paginated list, status summary cards (total/new/read/handled), detail view with full message, and status update buttons
- Auto-mark new leads as read when admin views the detail page
- Testimonial CRUD with bilingual tabs, image picker, sort_order reorder, and visibility toggle via Switch
- Team member CRUD with bilingual tabs, image picker, sort_order reorder, and photo thumbnail display
- All admin-only routes protected by role:admin middleware group

## Task Commits

Each task was committed atomically:

1. **Task 1: Contact lead management** - `4a67fba` (feat)
2. **Task 2: Testimonial and team member CRUD with reorder** - `923a607` (feat)

## Files Created/Modified
- `app/Http/Controllers/Admin/ContactLeadController.php` - Contact lead list, detail, status update
- `app/Http/Controllers/Admin/TestimonialController.php` - Testimonial CRUD with reorder
- `app/Http/Controllers/Admin/TeamMemberController.php` - Team member CRUD with reorder
- `app/Http/Requests/Admin/StoreTestimonialRequest.php` - Testimonial creation validation
- `app/Http/Requests/Admin/UpdateTestimonialRequest.php` - Testimonial update validation
- `app/Http/Requests/Admin/StoreTeamMemberRequest.php` - Team member creation validation
- `app/Http/Requests/Admin/UpdateTeamMemberRequest.php` - Team member update validation
- `resources/js/pages/admin/contacts/index.tsx` - Contact lead list with status cards and DataTable
- `resources/js/pages/admin/contacts/show.tsx` - Contact detail with status update buttons
- `resources/js/pages/admin/testimonials/index.tsx` - Testimonial list with SortableList and visibility toggle
- `resources/js/pages/admin/testimonials/create.tsx` - Testimonial create form with BilingualTabs
- `resources/js/pages/admin/testimonials/edit.tsx` - Testimonial edit form pre-filled
- `resources/js/pages/admin/team/index.tsx` - Team member list with SortableList and photo thumbnails
- `resources/js/pages/admin/team/create.tsx` - Team member create form with BilingualTabs
- `resources/js/pages/admin/team/edit.tsx` - Team member edit form pre-filled
- `routes/admin.php` - Added contact, testimonial, and team routes in role:admin group

## Decisions Made
- Used sort_order swap pattern for reordering (find adjacent item by direction, swap sort_order values) -- simple and reliable for small collections
- Contact leads are read-only with status management only -- they come from the public contact form
- No pagination for testimonials and team members since collections are typically small enough to display and reorder on one page
- Delete confirmation uses Dialog component with state-driven open/close pattern

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Contact lead, testimonial, and team member admin sections complete
- Ready for Plan 05 (service page editor) and Plan 06 (settings/navigation)
- Testimonial and team data can be consumed by public-facing pages in future phases

## Self-Check: PASSED

- All 16 files verified present on disk
- Both task commits (4a67fba, 923a607) verified in git history

---
*Phase: 03-admin-panel*
*Completed: 2026-03-28*
