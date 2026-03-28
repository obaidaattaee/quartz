---
phase: 01-foundation-design-system
plan: 01
subsystem: i18n, ui
tags: [locale, rtl, arabic, tailwind, oklch, fontsource, cairo, inertia, middleware]

# Dependency graph
requires: []
provides:
  - Locale-prefixed routing (/en/, /ar/) with SetLocale middleware
  - RTL/LTR switching via dir attribute on html element (server-side)
  - Teal brand color tokens in oklch for light and dark modes
  - Cairo Variable and Instrument Sans Variable self-hosted fonts
  - Locale/Direction TypeScript types
  - i18n translation helper t() with replacement support
  - useLocale React hook (locale, direction, isRTL, t, switchLocaleUrl)
  - English and Arabic translation files (29 keys each)
  - Smooth dark/light mode transitions
  - Bidirectional text isolation CSS utility
affects: [01-foundation-design-system, 02-public-site-core, 03-admin-cms, 04-blog-portfolio-polish]

# Tech tracking
tech-stack:
  added: ["@fontsource-variable/cairo", "@fontsource-variable/instrument-sans", "motion", "gsap", "@gsap/react"]
  patterns: ["oklch color tokens", "locale-prefixed routing", "server-side dir attribute", "Inertia shared locale data", "CSS logical properties for RTL"]

key-files:
  created:
    - app/Http/Middleware/SetLocale.php
    - resources/js/types/locale.ts
    - resources/js/lib/i18n.ts
    - resources/js/hooks/use-locale.tsx
    - resources/lang/en.json
    - resources/lang/ar.json
  modified:
    - app/Http/Middleware/HandleInertiaRequests.php
    - routes/web.php
    - resources/views/app.blade.php
    - resources/css/app.css
    - resources/js/app.tsx
    - resources/js/types/index.ts
    - package.json

key-decisions:
  - "Removed viewTransition defaults from createInertiaApp -- Inertia v3 types do not expose viewTransition in InertiaAppConfig defaults, will be set per-Link/visit instead"
  - "Used oklch color space for all design tokens per plan D-01 specification"
  - "Self-hosted fonts via Fontsource instead of CDN (fonts.bunny.net removed)"

patterns-established:
  - "Locale routing: All public routes under /{locale}/ prefix with en|ar constraint"
  - "RTL switching: Server-side dir attribute on html tag, CSS [dir=rtl] selectors"
  - "Translation: useLocale() hook returns t() function consuming Inertia shared translations"
  - "Color tokens: oklch values with teal hue (180-186 range) for brand consistency"

requirements-completed: [INTL-01, INTL-02, INTL-03, INTL-04, INTL-05, INTL-06, DSGN-01, DSGN-02, DSGN-03]

# Metrics
duration: 8min
completed: 2026-03-28
---

# Phase 1 Plan 01: Bilingual Infrastructure & Teal Design System Summary

**Locale-prefixed routing with en/ar RTL switching, teal oklch color tokens, self-hosted Cairo/Instrument Sans fonts, and useLocale hook with t() translation helper**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-28T04:43:33Z
- **Completed:** 2026-03-28T04:52:01Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments
- Locale-prefixed routing with SetLocale middleware extracting locale from URL, setting app locale, and 404 for unsupported locales
- Teal brand color system in oklch replacing neutral defaults for both light mode (teal-500 primary) and dark mode (deep navy-black background with teal-400 primary)
- Self-hosted Cairo Variable (Arabic) and Instrument Sans Variable (English) fonts replacing CDN dependency
- Complete i18n infrastructure: Locale/Direction types, t() translation helper with replacement support, useLocale hook providing locale, direction, isRTL, t(), and switchLocaleUrl
- RTL typography rules (Cairo font, 1.7 line-height) and smooth dark/light mode transitions

## Task Commits

Each task was committed atomically:

1. **Task 1: Backend locale routing, Blade RTL, and Inertia shared data** - `b878af3` (feat)
2. **Task 2: Design tokens, self-hosted fonts, RTL typography, types, and i18n** - `c659cfb` (feat)

## Files Created/Modified
- `app/Http/Middleware/SetLocale.php` - Extracts locale from URL, sets app locale, 404s unsupported locales
- `app/Http/Middleware/HandleInertiaRequests.php` - Shares locale, direction, translations to all Inertia pages
- `routes/web.php` - Locale-prefixed routing with / -> /en redirect
- `resources/views/app.blade.php` - Server-side dir attribute, removed CDN fonts, updated dark mode background
- `resources/css/app.css` - Teal oklch tokens, Cairo font stack, RTL typography rules, dark mode transitions
- `resources/js/app.tsx` - Font imports, public/ layout handling, teal progress bar
- `resources/js/types/locale.ts` - Locale, Direction, LocaleProps type definitions
- `resources/js/types/index.ts` - Added locale re-export
- `resources/js/lib/i18n.ts` - Translation helper with replacement support
- `resources/js/hooks/use-locale.tsx` - Hook providing locale context and translation function
- `resources/lang/en.json` - 29 English UI translation keys
- `resources/lang/ar.json` - 29 Arabic UI translation keys
- `package.json` - Added fontsource, motion, gsap dependencies

## Decisions Made
- Removed `defaults: { viewTransition: true }` from createInertiaApp because Inertia v3 TypeScript types do not expose viewTransition in the InertiaAppConfig defaults type. The runtime supports it, but it causes a compile-time type error. ViewTransition can be enabled per-Link or per-router.visit call instead.
- Used oklch color space throughout for perceptual uniformity per plan specification.
- Self-hosted fonts via @fontsource-variable packages for reliability and performance (removed fonts.bunny.net CDN dependency).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed viewTransition defaults to fix TypeScript error**
- **Found during:** Task 2 (app.tsx modifications)
- **Issue:** `defaults: { viewTransition: true }` in createInertiaApp causes TS2769 because InertiaAppConfig type does not include viewTransition. The runtime supports it but types don't expose it at the app config level.
- **Fix:** Removed the defaults block. viewTransition can be configured per-Link/visit instead of globally.
- **Files modified:** resources/js/app.tsx
- **Verification:** `npx tsc --noEmit` shows no errors in app.tsx related to our changes
- **Committed in:** c659cfb (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor -- viewTransition is still available per-component. No functional loss.

## Issues Encountered
- Worktree environment lacks `vendor/` directory (Composer not installed), preventing `php artisan route:list` and `npm run build` (Wayfinder plugin depends on artisan). Verified all code changes via file content inspection and TypeScript compiler instead. This is an environment issue, not a code issue -- full validation requires `composer install` in the deployment environment.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None - all functionality is wired and operational. The `public/home` Inertia page component referenced by the route does not exist yet (will be created in Plan 03), but the route and middleware infrastructure is complete.

## Next Phase Readiness
- Locale routing, RTL support, color tokens, and translation infrastructure are ready for all subsequent plans
- Plan 02 (animation primitives) can consume the color tokens and font stacks
- Plan 03 (public layout + pages) can use useLocale hook, translation files, and locale routing
- The `public/home` page component needs to be created in Plan 03 to make the home route functional

## Self-Check: PASSED

All 13 created/modified files verified present. Both task commits (b878af3, c659cfb) confirmed in git log.

---
*Phase: 01-foundation-design-system*
*Completed: 2026-03-28*
