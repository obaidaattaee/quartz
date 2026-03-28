---
status: diagnosed
phase: 01-foundation-design-system
source: [01-VERIFICATION.md]
started: 2026-03-28T08:30:00.000Z
updated: 2026-03-28T10:00:00.000Z
---

## Current Test

[testing complete]

## Tests

### 1. TypeScript compilation
expected: `npm install` then `npx tsc --noEmit` completes with no errors
result: pass

### 2. English/Arabic page rendering
expected: `/en/` renders LTR with Instrument Sans; `/ar/` renders RTL with Cairo font; teal brand colors visible; nav labels translated
result: issue
reported: "/ar/ has dir=rtl and teal brand colors, but all content remains in English (nav labels, headings, footer). Cairo font not loaded — still using Instrument Sans. Language switcher on /ar still says 'Switch to Arabic' instead of 'Switch to English'."
severity: major

### 3. Header frosted glass on scroll
expected: Scrolling past 50px triggers transparent-to-backdrop-blur transition on header
result: issue
reported: "Header stays bg-transparent with no backdrop-filter after scrolling. Header has transition-all duration-300 classes but scroll handler never changes them. Page content too minimal to scroll past 50px threshold, but no frosted glass logic detected."
severity: major

### 4. Language switcher URL preservation
expected: Clicking switcher on `/en/about` navigates to `/ar/about` (and vice versa)
result: blocked
blocked_by: prior-phase
reason: "Sub-pages (/en/about, /en/portfolio, etc.) return 404. Cannot test URL path preservation. Switcher on home page links to /ar without path segment."

### 5. Dark mode system preference on fresh load
expected: Clear localStorage, OS in dark mode — no flash of light background on load
result: pass

### 6. Mobile RTL Sheet direction
expected: On Arabic locale at mobile viewport, hamburger menu opens Sheet from the LEFT
result: issue
reported: "Sheet slides from RIGHT (has slide-in-from-right class, right-0, border-l). Does not adapt direction for RTL locale. Hamburger is on top-left in RTL but sheet opens from opposite side."
severity: major

### 7. ScrollReveal animations
expected: Elements fade in + translate-y(20px) when entering viewport; disabled with OS prefers-reduced-motion
result: issue
reported: "No scroll-reveal elements found in DOM. No data-scroll, data-aos, or animation-related classes on any elements. No Framer Motion or GSAP detected. Animation system not implemented."
severity: major

### 8. REQUIREMENTS.md tracking update
expected: DSGN-04, DSGN-05, DSGN-06, DSGN-07 updated from Pending to reflect implementation status
result: issue
reported: "All four requirements (DSGN-04 through DSGN-07) still marked as Pending in REQUIREMENTS.md despite Phase 1 execution completing."
severity: minor

## Summary

total: 8
passed: 2
issues: 5
pending: 0
skipped: 0
blocked: 1

## Gaps

- truth: "/ar/ renders RTL with Cairo font; nav labels translated"
  status: failed
  reason: "User reported: /ar/ has dir=rtl and teal brand colors, but all content remains in English. Cairo font not loaded. Language switcher label not localized."
  severity: major
  test: 2
  root_cause: "Two issues: (1) HandleInertiaRequests::share() evaluates app()->getLocale() before SetLocale route middleware runs, so locale/direction/translations props are always 'en'/'ltr'/English. (2) CSS font specificity: Tailwind font-sans on <body> overrides inherited --font-arabic from [dir=rtl] on <html>."
  artifacts:
    - path: "app/Http/Middleware/HandleInertiaRequests.php"
      issue: "share() eagerly evaluates locale before SetLocale middleware runs"
    - path: "bootstrap/app.php"
      issue: "HandleInertiaRequests registered as global middleware; SetLocale is route-level"
    - path: "resources/css/app.css"
      issue: "[dir=rtl] font rule on html overridden by font-sans on body"
    - path: "resources/views/app.blade.php"
      issue: "body class font-sans always applies Instrument Sans regardless of locale"
  missing:
    - "Use closures in share(): 'locale' => fn() => app()->getLocale(), 'direction' => fn() => app()->getLocale() === 'ar' ? 'rtl' : 'ltr', 'translations' => fn() => $this->loadTranslations(app()->getLocale())"
    - "Fix font: conditionally apply font class in Blade template based on locale"
  debug_session: ".planning/debug/arabic-page-english-content.md"

- truth: "Scrolling past 50px triggers transparent-to-backdrop-blur transition on header"
  status: failed
  reason: "User reported: Header stays bg-transparent with no backdrop-filter after scrolling. No scroll handler changes header classes."
  severity: major
  test: 3
  root_cause: "Two issues: (1) Home page is a stub with minimal content — document height barely exceeds viewport, so scrollY never reaches 50px threshold. useScrollHeader hook and SiteHeader conditional classes ARE correctly implemented. (2) Global CSS transition rule in app.css (html *, html *::before, html *::after) overrides Tailwind's transition-all utility, excluding backdrop-filter from the transition list."
  artifacts:
    - path: "resources/js/pages/public/home.tsx"
      issue: "Stub page with insufficient content to enable scrolling past 50px"
    - path: "resources/css/app.css"
      issue: "Lines 173-177: global transition rule overrides Tailwind transition-all, excludes backdrop-filter"
  missing:
    - "Add real homepage content (hero, services, testimonials) to make page scrollable"
    - "Fix global transition rule: move into @layer base or scope more narrowly to not conflict with component transitions"
  debug_session: ".planning/debug/header-frosted-glass-scroll.md"

- truth: "On Arabic locale at mobile viewport, hamburger menu opens Sheet from the LEFT"
  status: failed
  reason: "User reported: Sheet slides from RIGHT with slide-in-from-right class. Does not adapt for RTL."
  severity: major
  root_cause: "Same middleware ordering bug as Test 2: HandleInertiaRequests::share() captures direction as 'ltr' before SetLocale runs, so useLocale().isRTL is always false, and SiteHeader passes side='right' to SheetContent. The RTL logic in SiteHeader (side={isRTL ? 'left' : 'right'}) is correct but receives wrong data. Secondary: Sheet close button uses hardcoded right-4 instead of logical end-4."
  test: 6
  artifacts:
    - path: "app/Http/Middleware/HandleInertiaRequests.php"
      issue: "share() eagerly evaluates direction before SetLocale runs (same as Test 2)"
    - path: "resources/js/components/ui/sheet.tsx"
      issue: "Close button uses hardcoded right-4 instead of end-4 for RTL"
  missing:
    - "Fix middleware ordering (same fix as Test 2 resolves this)"
    - "Change Sheet close button from right-4 to end-4"
  debug_session: ".planning/debug/rtl-sheet-direction.md"

- truth: "Elements fade in + translate-y(20px) when entering viewport; disabled with prefers-reduced-motion"
  status: failed
  reason: "User reported: No scroll-reveal elements, animation classes, or animation library (Framer Motion/GSAP) found in DOM."
  severity: major
  test: 7
  root_cause: "ScrollReveal component (scroll-reveal.tsx), animation variants (animations.ts), and reduced motion hook (use-reduced-motion.tsx) are all fully implemented. However, NO page, layout, or component imports or uses <ScrollReveal>. The component is orphaned — built but never consumed. Home page is a stub with no animation wrappers."
  artifacts:
    - path: "resources/js/components/scroll-reveal.tsx"
      issue: "Complete component, never imported by any page"
    - path: "resources/js/lib/animations.ts"
      issue: "9 animation variants exported, only imported by scroll-reveal.tsx"
    - path: "resources/js/pages/public/home.tsx"
      issue: "Stub page with no ScrollReveal usage"
  missing:
    - "Import and wrap content sections with <ScrollReveal> in page components"
    - "Will resolve naturally as pages are built out in Phase 2+"
  debug_session: ".planning/debug/missing-scroll-reveal-animations.md"

- truth: "DSGN-04, DSGN-05, DSGN-06, DSGN-07 updated from Pending to reflect implementation status"
  status: failed
  reason: "User reported: All four requirements still marked Pending in REQUIREMENTS.md."
  severity: minor
  test: 8
  root_cause: "Executor never updated REQUIREMENTS.md after Plan 02 completed. 01-02-SUMMARY.md claims requirements-completed: [DSGN-04, DSGN-05, DSGN-06, DSGN-07] but the tracking file was not touched."
  artifacts:
    - path: ".planning/REQUIREMENTS.md"
      issue: "DSGN-04/05/06/07 status not updated after Phase 1 execution"
  missing:
    - "Update DSGN-04: Pending → Complete (components with hover micro-interactions exist)"
    - "Update DSGN-05: Pending → Complete (animation system built, ScrollReveal component exists)"
    - "Update DSGN-06: Pending → Partial (CSS crossfade exists but global viewTransition removed due to TS type issue)"
    - "Update DSGN-07: Pending → Complete (useReducedMotion hook + CSS media query implemented)"
  debug_session: ""
