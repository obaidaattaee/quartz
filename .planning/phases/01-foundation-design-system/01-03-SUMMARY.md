---
phase: 01-foundation-design-system
plan: 03
subsystem: ui
tags: [react, tailwind, inertia, i18n, rtl, layout, navigation, header, footer, breadcrumb, 404]

# Dependency graph
requires:
  - phase: 01-01
    provides: i18n infrastructure (useLocale hook, translation files, locale types), useAppearance hook, UI primitives (Sheet, NavigationMenu, Button, Breadcrumb)
provides:
  - PublicLayout wrapper component for all public pages
  - SiteHeader with sticky frosted glass effect, navigation, Services dropdown, mobile Sheet menu
  - SiteFooter with 4-column grid (newsletter, services, quick links, contact)
  - LanguageSwitcher component for EN/AR toggling
  - ThemeToggle component cycling light/dark/system
  - useScrollHeader hook for scroll-based header transitions
  - RTL-aware breadcrumb separator rotation
  - Branded 404 error page via Inertia
  - Minimal home page placeholder for route validation
  - app.tsx layout resolver for public/ and errors/ page namespaces
affects: [02-public-pages, 03-admin-panel, 04-blog-portfolio]

# Tech tracking
tech-stack:
  added: []
  patterns: [PublicLayout layout composition, scroll-based header transition, RTL-aware mobile Sheet side, logical CSS properties for bidirectional support]

key-files:
  created:
    - resources/js/layouts/public-layout.tsx
    - resources/js/components/site-header.tsx
    - resources/js/components/site-footer.tsx
    - resources/js/components/language-switcher.tsx
    - resources/js/components/theme-toggle.tsx
    - resources/js/hooks/use-scroll-header.tsx
    - resources/js/pages/public/home.tsx
    - resources/js/pages/errors/404.tsx
  modified:
    - resources/js/app.tsx
    - resources/js/components/ui/breadcrumb.tsx
    - resources/css/app.css
    - bootstrap/app.php

key-decisions:
  - "RTL breadcrumb flip uses both Tailwind rtl: variant and CSS fallback rule for maximum compatibility"
  - "Newsletter form in footer is intentional no-op stub -- Phase 2 CONT-07 will wire to backend"
  - "404 page renders standalone (no layout wrapper) via Inertia exception handler in bootstrap/app.php"

patterns-established:
  - "PublicLayout pattern: SiteHeader + optional breadcrumbs + content + SiteFooter"
  - "Scroll-based header transition: transparent -> frosted glass (backdrop-blur-lg + bg-background/80)"
  - "Mobile Sheet side direction: isRTL ? 'left' : 'right' for correct slide direction"
  - "Logical CSS properties only in public components: ms-*, me-*, ps-*, pe-*, text-start (no ml/mr/pl/pr)"

requirements-completed: [DSGN-08, NAV-01, NAV-02, NAV-03]

# Metrics
duration: 6min
completed: 2026-03-28
---

# Phase 1 Plan 3: Public Layout Shell Summary

**Sticky header with frosted glass scroll effect, 4-column footer, language switcher, theme toggle, RTL breadcrumbs, and branded 404 -- all wired into PublicLayout via Inertia layout resolver**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-28T04:55:57Z
- **Completed:** 2026-03-28T05:02:11Z
- **Tasks:** 3 (2 auto + 1 checkpoint auto-approved)
- **Files modified:** 12

## Accomplishments
- Built complete public site layout shell (SiteHeader + SiteFooter + breadcrumbs) wrapping all public pages
- Sticky header transitions from transparent to frosted glass on scroll, with Services dropdown, Contact CTA, language switcher, and theme toggle
- Mobile hamburger menu opens Sheet from correct side based on RTL direction (right for LTR, left for RTL)
- 4-column footer with newsletter capture, service links, quick links, and contact information
- Branded 404 page served via Inertia exception handler with translated content
- All components use useLocale().t() for bilingual support -- zero hardcoded strings

## Task Commits

Each task was committed atomically:

1. **Task 1: Header, footer, language switcher, theme toggle, and scroll hook** - `f357867` (feat)
2. **Task 2: PublicLayout, RTL breadcrumbs, 404 page, home placeholder, and app.tsx wiring** - `237a0ec` (feat)
3. **Task 3: Visual verification of complete public layout shell** - auto-approved checkpoint

## Files Created/Modified
- `resources/js/hooks/use-scroll-header.tsx` - Scroll position detection hook for header transparency transition
- `resources/js/components/language-switcher.tsx` - EN/AR language toggle using useLocale().switchLocaleUrl
- `resources/js/components/theme-toggle.tsx` - Light/dark/system cycle toggle using useAppearance hook
- `resources/js/components/site-header.tsx` - Sticky header with nav, Services dropdown, CTA, mobile Sheet menu
- `resources/js/components/site-footer.tsx` - 4-column footer with newsletter, services, quick links, contact
- `resources/js/layouts/public-layout.tsx` - PublicLayout wrapper with SiteHeader, breadcrumbs, SiteFooter
- `resources/js/pages/public/home.tsx` - Minimal home page placeholder for route validation
- `resources/js/pages/errors/404.tsx` - Branded 404 page with translated content and home link
- `resources/js/app.tsx` - Added PublicLayout import and layout resolver for public/ and errors/ namespaces
- `resources/js/components/ui/breadcrumb.tsx` - Added rtl:[&>svg]:rotate-180 for RTL separator flip
- `resources/css/app.css` - Added CSS fallback rule for RTL breadcrumb separator rotation
- `bootstrap/app.php` - Added NotFoundHttpException handler rendering errors/404 via Inertia

## Decisions Made
- RTL breadcrumb flip uses both Tailwind `rtl:` variant class and a CSS fallback rule targeting `[dir="rtl"] [data-slot="breadcrumb-separator"] svg` for maximum compatibility across Tailwind v4 builds
- Newsletter form in footer intentionally prevents default on submit (no-op) -- backend wiring deferred to Phase 2 CONT-07
- 404 page renders standalone without PublicLayout wrapper (errors/ namespace returns null layout) since the 404 should be a full-page experience
- Used index-based React key for breadcrumb items instead of href to avoid TypeScript key type mismatch with InertiaLinkProps

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed breadcrumb item key type mismatch**
- **Found during:** Task 2
- **Issue:** BreadcrumbItemType.href is `NonNullable<InertiaLinkProps['href']>` which includes `UrlMethodPair`, not assignable to React key type
- **Fix:** Changed from `key={item.href}` to `key={index}` since breadcrumbs are a short ordered list
- **Files modified:** resources/js/layouts/public-layout.tsx
- **Verification:** npx tsc --noEmit produces no errors for our files
- **Committed in:** 237a0ec (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Minor type fix, no scope creep.

## Known Stubs

- `resources/js/components/site-footer.tsx` line 53: Newsletter form `onSubmit` is `(e) => e.preventDefault()` -- intentional stub, Phase 2 CONT-07 will wire to backend

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- PublicLayout is ready to wrap all Phase 2 public pages (landing, services, portfolio, about, contact)
- SiteHeader navigation links point to locale-prefixed URLs that Phase 2 routes will implement
- Footer links similarly ready for Phase 2 page routes
- Breadcrumbs ready for inner pages to pass via props
- 404 page catches all unmatched routes via Inertia exception handler

## Self-Check: PASSED

All 8 created files verified. Both task commits (f357867, 237a0ec) confirmed in git log. SUMMARY.md exists.

---
*Phase: 01-foundation-design-system*
*Completed: 2026-03-28*
