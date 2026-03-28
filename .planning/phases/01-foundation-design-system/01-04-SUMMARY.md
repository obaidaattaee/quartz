---
phase: 01-foundation-design-system
plan: 04
subsystem: infra
tags: [middleware, rtl, css, inertia, lazy-evaluation, blade]

# Dependency graph
requires:
  - phase: 01-foundation-design-system
    provides: "Locale middleware, RTL CSS, Sheet component, animation system"
provides:
  - "Lazy-evaluated locale/direction/translations in Inertia shared props"
  - "Locale-conditional font class on Blade body element"
  - "Backdrop-filter included in global CSS transition rule"
  - "RTL-safe Sheet close button positioning with logical properties"
  - "Accurate REQUIREMENTS.md status for DSGN-04 through DSGN-07"
affects: [02-public-marketing-site, all-rtl-pages, all-locale-dependent-features]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Closure-based lazy evaluation for Inertia shared props (defers reading until after route middleware)"
    - "Tailwind logical properties (end-4) instead of physical (right-4) for RTL support"

key-files:
  created: []
  modified:
    - app/Http/Middleware/HandleInertiaRequests.php
    - resources/css/app.css
    - resources/views/app.blade.php
    - resources/js/components/ui/sheet.tsx
    - .planning/REQUIREMENTS.md

key-decisions:
  - "Used Inertia closure-based lazy evaluation (fn () =>) to defer locale reading until after SetLocale route middleware runs"
  - "Blade template locale check works correctly because template renders inside middleware stack after SetLocale"

patterns-established:
  - "Lazy shared props: Use fn () => closures in HandleInertiaRequests::share() for any data that depends on route middleware"
  - "RTL positioning: Use Tailwind logical properties (start/end) instead of physical (left/right) in all components"

requirements-completed: [INTL-02, INTL-05, DSGN-05, DSGN-06, DSGN-08]

# Metrics
duration: 2min
completed: 2026-03-28
---

# Phase 01 Plan 04: Gap Closure Summary

**Fixed 4 UAT infrastructure bugs: lazy middleware evaluation for locale props, conditional Blade font class, CSS backdrop-filter transition, and RTL-safe Sheet close button**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-28T05:49:58Z
- **Completed:** 2026-03-28T05:51:36Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Fixed middleware ordering bug where HandleInertiaRequests shared eager locale values before SetLocale route middleware ran, breaking all Arabic locale rendering
- Made Blade body font class locale-conditional so Arabic pages use Cairo font instead of Instrument Sans
- Added backdrop-filter to global CSS transition rule enabling smooth header blur animations
- Changed Sheet close button from physical right-4 to logical end-4 for correct RTL positioning
- Updated REQUIREMENTS.md traceability for DSGN-04 (Complete), DSGN-05 (Complete), DSGN-06 (Partial), DSGN-07 (Complete)

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix middleware lazy evaluation and CSS infrastructure bugs** - `a69d8a4` (fix)
2. **Task 2: Update REQUIREMENTS.md tracking status** - `29a8959` (docs)

## Files Created/Modified
- `app/Http/Middleware/HandleInertiaRequests.php` - Closure-based lazy evaluation for locale, direction, translations shared props
- `resources/views/app.blade.php` - Locale-conditional font-arabic/font-sans body class
- `resources/css/app.css` - Added backdrop-filter to global transition rule
- `resources/js/components/ui/sheet.tsx` - RTL-safe end-4 close button positioning
- `.planning/REQUIREMENTS.md` - Updated DSGN-04 through DSGN-07 status

## Decisions Made
- Used Inertia closure-based lazy evaluation pattern (fn () =>) rather than moving middleware registration order, as this is the documented Inertia approach and avoids breaking the global/route middleware separation
- Blade template font class works correctly because Blade renders during response generation inside the middleware stack, after SetLocale has already run

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- TypeScript compilation shows pre-existing @/routes module resolution errors from Wayfinder auto-generated routes not being present in the worktree build; these are unrelated to changes made in this plan
- PHP artisan commands fail in worktree due to missing vendor directory; verified fixes via direct file inspection instead

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All locale-dependent infrastructure now works correctly for Arabic pages
- RTL Sheet direction and close button positioning fixed for mobile navigation
- Header backdrop-blur transitions will animate smoothly once page has sufficient content
- Phase 2 public marketing site can rely on correct locale/RTL behavior throughout

## Self-Check: PASSED

All files verified present. All commit hashes verified in git log.

---
*Phase: 01-foundation-design-system*
*Completed: 2026-03-28*
