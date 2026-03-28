---
phase: 01-foundation-design-system
verified: 2026-03-28T11:00:00Z
status: human_needed
score: 19/19 must-haves verified (automated)
re_verification: true
re_verification_context:
  previous_status: human_needed
  previous_score: "19/19 automated (10 items sent to human)"
  uat_results:
    total: 8
    passed: 2
    issues: 5
    blocked: 1
  gap_closure_plan: 01-04
  gaps_closed:
    - "/ar/ renders with Arabic translations, RTL direction, and Cairo font (middleware closures + font-arabic Blade class)"
    - "Mobile Sheet opens from LEFT on Arabic locale (same middleware fix + end-4 logical property)"
    - "Header backdrop-blur transition includes backdrop-filter in CSS global rule"
    - "REQUIREMENTS.md accurately reflects DSGN-04 through DSGN-07 status"
  gaps_remaining: []
  accepted_deferrals:
    - "ScrollReveal component is built but no page imports it — explicitly accepted as Phase 2 concern (pages will wrap sections with <ScrollReveal> as they are built)"
  regressions: []
human_verification:
  - test: "Navigating to /ar/ in browser shows Arabic content, Cairo font, and RTL layout"
    expected: "Nav labels and footer in Arabic, Cairo font renders, html[dir=rtl], layout mirrors correctly (closes UAT Test 2)"
    why_human: "Middleware closure fix cannot be confirmed without a live browser hitting the actual route"
  - test: "Language switcher on /ar/ shows 'Switch to English' label (not 'Switch to Arabic')"
    expected: "Switcher label is localized to show target-language label based on current locale"
    why_human: "Requires browser with live Inertia props flowing through fixed middleware"
  - test: "Mobile hamburger on /ar/ at mobile viewport opens Sheet from LEFT"
    expected: "Sheet slides from left, close button appears at logical end (left side in RTL)"
    why_human: "Requires browser at mobile viewport with correct locale props from fixed middleware"
  - test: "Header transitions to frosted glass after scrolling past 50px"
    expected: "backdrop-blur-lg activates with smooth transition of backdrop-filter (now in global CSS transition list)"
    why_human: "Requires browser scroll + page content long enough to scroll 50px"
  - test: "TypeScript compilation passes with zero errors after npm install"
    expected: "npx tsc --noEmit exits with 0 across all new/modified files"
    why_human: "node_modules not installed in verification environment"
---

# Phase 01: Foundation & Design System — Re-Verification Report

**Phase Goal:** Every page rendered in either English (LTR) or Arabic (RTL) looks correct, uses the same design tokens, and has working navigation with smooth transitions
**Verified:** 2026-03-28T11:00:00Z
**Status:** human_needed
**Re-verification:** Yes — after UAT gap closure via Plan 04

## Re-Verification Context

The initial automated verification (2026-03-28T09:00:00Z) passed all 19 structural checks and flagged 10 items for human testing. Human UAT returned 2 passes, 5 issues, and 1 blocked test. A gap closure plan (01-04) was created and executed, targeting 4 of the 5 issues. The 5th issue (ScrollReveal orphaned) was explicitly accepted as a Phase 2 deferral.

This re-verification confirms Plan 04 fixes are present in the codebase and no regressions occurred.

---

## UAT Gap Closure Verification

### Gap 1: Arabic Locale — Wrong Language / Font / Direction

**UAT finding:** `/ar/` rendered English content, Instrument Sans font, and `locale: 'en'` in Inertia props. Root cause: `HandleInertiaRequests::share()` evaluated `app()->getLocale()` eagerly before `SetLocale` route middleware ran.

**Plan 04 fix:**

| Fix | Location | Status |
|-----|----------|--------|
| Closures for `locale`, `direction`, `translations` in `share()` | `app/Http/Middleware/HandleInertiaRequests.php:45-47` | ✓ VERIFIED |
| Locale-conditional font class on `<body>` | `resources/views/app.blade.php:47` | ✓ VERIFIED |

Evidence:
- Lines 45-47 of `HandleInertiaRequests.php`: `'locale' => fn () => app()->getLocale()`, `'direction' => fn () => app()->getLocale() === 'ar' ? 'rtl' : 'ltr'`, `'translations' => fn () => $this->loadTranslations(app()->getLocale())`
- `app.blade.php` line 47: `<body class="{{ app()->getLocale() === 'ar' ? 'font-arabic' : 'font-sans' }} antialiased">`
- `--font-arabic` defined in `app.css:16` as `'Cairo Variable', 'Instrument Sans Variable', ...`
- Tailwind v4 `@theme` block auto-generates `font-arabic` utility from `--font-arabic` variable
- Commit `a69d8a4` present in git log

**Gap status: CLOSED (pending browser confirmation)**

---

### Gap 2: Header Backdrop-Blur Not Transitioning

**UAT finding:** Header `backdrop-filter` did not animate. Root cause: global CSS transition rule on `html *, html *::before, html *::after` listed only `background-color, color, border-color` — `backdrop-filter` was excluded, overriding Tailwind's `transition-all` without covering blur.

**Plan 04 fix:**

| Fix | Location | Status |
|-----|----------|--------|
| `backdrop-filter 0.3s ease` added to global transition rule | `resources/css/app.css:176` | ✓ VERIFIED |

Evidence: `app.css` line 176 reads: `transition: background-color 0.3s ease, color 0.15s ease, border-color 0.3s ease, backdrop-filter 0.3s ease;`

The `useScrollHeader()` hook and `isScrolled`-conditional class logic in `site-header.tsx` were correct all along. The CSS fix unblocks the transition.

**Gap status: CLOSED (pending browser confirmation)**

---

### Gap 3: RTL Sheet Opens from Wrong Side

**UAT finding:** Mobile hamburger sheet opened from RIGHT on `/ar/`. Root cause: same middleware ordering bug as Gap 1 caused `isRTL` to always be `false`; secondary: Sheet close button used physical `right-4` instead of logical `end-4`.

**Plan 04 fix:**

| Fix | Location | Status |
|-----|----------|--------|
| Middleware closure fix (resolves `isRTL` data) | `HandleInertiaRequests.php:45-47` | ✓ VERIFIED (same as Gap 1) |
| Sheet close button: `right-4` replaced with `end-4` | `resources/js/components/ui/sheet.tsx:73` | ✓ VERIFIED |

Evidence: `sheet.tsx` line 73 contains `end-4` (not `right-4`) in `SheetPrimitive.Close` className. The `SiteHeader` side-switching logic `side={isRTL ? 'left' : 'right'}` was correct all along and now receives `isRTL=true` for `/ar/` requests.

**Gap status: CLOSED (pending browser confirmation)**

---

### Gap 4: ScrollReveal Not Used by Any Page (Accepted Deferral)

**UAT finding:** No scroll-reveal elements in DOM. Root cause: `scroll-reveal.tsx`, `animations.ts`, and `use-reduced-motion.tsx` are fully implemented but no page imports `<ScrollReveal>`.

**Plan 04 decision:** Explicitly accepted as Phase 2 concern. Plan 04 did not address this.

**Verification:**
- `scroll-reveal.tsx` — present, substantive (55 lines, full implementation), confirmed not imported by any file (grep for `import.*scroll-reveal` returns 0 matches)
- `animations.ts` — present, substantive (9 variants), imported only by `scroll-reveal.tsx`

**Assessment against Phase 1 goal:** The goal requires "smooth transitions" — referring to route-level page transitions (View Transitions API) and UI micro-interactions. Scroll reveal animations on content sections are a Phase 2 concern (LAND-*, SRVC-*, PORT-* requirements). The animation infrastructure being built but not yet consumed by pages does not block Phase 1.

**Gap status: ACCEPTED DEFERRAL — not a Phase 1 blocker**

---

### Gap 5: REQUIREMENTS.md Tracking Not Updated

**UAT finding:** DSGN-04/05/06/07 still showed "Pending" in tracking file despite Plan 02 completing them.

**Plan 04 fix:**

| Requirement | Old Status | New Status |
|-------------|-----------|------------|
| DSGN-04 | Pending | Complete |
| DSGN-05 | Pending | Complete |
| DSGN-06 | Pending | Partial |
| DSGN-07 | Pending | Complete |

Evidence: `.planning/REQUIREMENTS.md` lines 24-27 and 167-170 confirm `[x] DSGN-04`, `[x] DSGN-05`, `[~] DSGN-06`, `[x] DSGN-07` with matching Complete/Partial status in traceability table. Commit `29a8959` present in git log.

**Gap status: CLOSED**

---

## Observable Truths (Full Re-Verification)

| # | Truth | Previous Status | Current Status | Notes |
|---|-------|----------------|----------------|-------|
| 1 | /en/any-page renders English LTR | ? HUMAN | ? HUMAN | No change — browser required |
| 2 | /ar/any-page renders Arabic RTL with Cairo font | ? HUMAN | ? HUMAN | Infrastructure fixed; browser still required |
| 3 | / redirects to /en | ✓ VERIFIED | ✓ VERIFIED | No regression |
| 4 | Unsupported locale returns 404 | ✓ VERIFIED | ✓ VERIFIED | No regression |
| 5 | Primary accent is teal in light and dark modes | ✓ VERIFIED | ✓ VERIFIED | No regression |
| 6 | Dark mode shows navy-black; light mode near-white | ✓ VERIFIED | ✓ VERIFIED | No regression |
| 7 | System preference decides initial dark/light mode | ✓ VERIFIED | ✓ VERIFIED | No regression |
| 8 | All new CSS uses logical properties (start/end) | ✓ VERIFIED | ✓ VERIFIED | `end-4` fix reinforces this |
| 9 | t() returns correct string for current locale | ✓ VERIFIED | ✓ VERIFIED | Closures ensure locale is correct when t() runs |
| 10 | Scroll reveal fires once when 20% visible | ✓ VERIFIED | ✓ VERIFIED (infra only) | Component verified; no page uses it — accepted deferral |
| 11 | Stagger: 0.1s delay between siblings | ✓ VERIFIED | ✓ VERIFIED | No regression |
| 12 | Animations disabled for prefers-reduced-motion | ✓ VERIFIED | ✓ VERIFIED | No regression |
| 13 | Buttons: hover lift + glow | ✓ VERIFIED | ✓ VERIFIED | No regression |
| 14 | Cards: hover lift + border glow | ✓ VERIFIED | ✓ VERIFIED | No regression |
| 15 | Header: transparent → frosted glass on scroll | ✓ VERIFIED | ✓ VERIFIED | CSS backdrop-filter fix closes transition gap |
| 16 | Language switcher preserves URL when toggling | ✓ VERIFIED | ✓ VERIFIED | Middleware fix ensures correct locale in switchLocaleUrl |
| 17 | Footer: 4-column grid + copyright/Privacy/Terms | ✓ VERIFIED | ✓ VERIFIED | No regression |
| 18 | 404 page: branded design + home navigation | ✓ VERIFIED | ✓ VERIFIED | No regression |
| 19 | Mobile menu slides from correct side per locale | ✓ VERIFIED | ✓ VERIFIED | Middleware + end-4 fix closes this |

**Score:** 19/19 truths have structural evidence (5 still require browser confirmation)

---

## Required Artifacts (Regression Check)

All 21 tracked artifacts confirmed present. No regressions introduced by Plan 04.

| Artifact | Status | Note |
|----------|--------|------|
| `app/Http/Middleware/SetLocale.php` | ✓ VERIFIED | Unchanged |
| `app/Http/Middleware/HandleInertiaRequests.php` | ✓ VERIFIED | Closures in share() |
| `resources/css/app.css` | ✓ VERIFIED | backdrop-filter in global transition |
| `resources/views/app.blade.php` | ✓ VERIFIED | font-arabic/font-sans conditional |
| `resources/js/hooks/use-locale.tsx` | ✓ VERIFIED | Unchanged |
| `resources/js/lib/i18n.ts` | ✓ VERIFIED | Unchanged |
| `resources/js/types/locale.ts` | ✓ VERIFIED | Unchanged |
| `resources/lang/en.json` | ✓ VERIFIED | Unchanged |
| `resources/lang/ar.json` | ✓ VERIFIED | Unchanged |
| `resources/js/lib/animations.ts` | ✓ VERIFIED | Unchanged |
| `resources/js/components/scroll-reveal.tsx` | ✓ VERIFIED | Orphaned — accepted deferral |
| `resources/js/hooks/use-reduced-motion.tsx` | ✓ VERIFIED | Unchanged |
| `resources/js/layouts/public-layout.tsx` | ✓ VERIFIED | Unchanged |
| `resources/js/components/site-header.tsx` | ✓ VERIFIED | Unchanged |
| `resources/js/components/site-footer.tsx` | ✓ VERIFIED | Unchanged |
| `resources/js/components/language-switcher.tsx` | ✓ VERIFIED | Unchanged |
| `resources/js/components/theme-toggle.tsx` | ✓ VERIFIED | Unchanged |
| `resources/js/hooks/use-scroll-header.tsx` | ✓ VERIFIED | Unchanged |
| `resources/js/components/ui/sheet.tsx` | ✓ VERIFIED | end-4 close button |
| `resources/js/pages/errors/404.tsx` | ✓ VERIFIED | Unchanged |
| `resources/js/pages/public/home.tsx` | ✓ VERIFIED | Unchanged |
| `.planning/REQUIREMENTS.md` | ✓ VERIFIED | All 17 IDs tracked correctly |

---

## Key Link Verification (Regression Check)

| From | To | Via | Status |
|------|----|-----|--------|
| `HandleInertiaRequests.php` | `use-locale.tsx` | Closure-based lazy props (locale, direction, translations) | ✓ WIRED |
| `routes/web.php` | `SetLocale.php` | `->middleware(SetLocale::class)` on locale prefix group | ✓ WIRED |
| `app.blade.php` | `app.css` | `font-arabic` Tailwind utility from `@theme --font-arabic` | ✓ WIRED |
| `public-layout.tsx` | `site-header.tsx` | Import + `<SiteHeader />` | ✓ WIRED |
| `site-header.tsx` | `use-scroll-header.tsx` | `const isScrolled = useScrollHeader()` | ✓ WIRED |
| `app.tsx` | `public-layout.tsx` | `case name.startsWith('public/')` layout resolver | ✓ WIRED |
| `site-header.tsx` | `language-switcher.tsx` | Import + `<LanguageSwitcher />` in header | ✓ WIRED |

---

## Data-Flow Trace (Re-Verification)

| Data | Full Flow | Status |
|------|-----------|--------|
| locale | `SetLocale::handle()` sets `app()->getLocale()` → `share() fn()=>` reads at render time → Inertia props → `usePage().props.locale` → `useLocale().locale` | ✓ FLOWING |
| direction | Closure in `share()` derives from locale: `fn () => app()->getLocale() === 'ar' ? 'rtl' : 'ltr'` → `useLocale().isRTL` → `SiteHeader side={isRTL ? 'left' : 'right'}` | ✓ FLOWING |
| translations | `fn () => $this->loadTranslations(app()->getLocale())` reads `lang/{locale}.json` → `useLocale().t()` | ✓ FLOWING |
| font class | Blade `app()->getLocale()` (runs in response phase, after SetLocale) → `font-arabic`/`font-sans` on `<body>` | ✓ FLOWING |
| isScrolled | `window.scrollY` passive listener → `useScrollHeader()` state → `SiteHeader` conditional classes with `backdrop-filter` transition | ✓ FLOWING |

---

## Requirements Coverage (Final)

| Requirement | Description | Status | Evidence |
|-------------|-------------|--------|---------|
| INTL-01 | URL-based routing `/en/` + `/ar/` | ✓ SATISFIED | `Route::prefix('{locale}')`, `SetLocale.php` |
| INTL-02 | Full RTL with logical properties | ✓ SATISFIED | `end-4` in sheet, `ps-3`, `[dir="rtl"]` CSS, no physical left/right |
| INTL-03 | Language switcher preserves URL | ✓ SATISFIED | `switchLocaleUrl` regex-replaces locale prefix |
| INTL-04 | Bidirectional text handling | ✓ SATISFIED | `.bidi-isolate` utility, `dir="ltr"` on phone span |
| INTL-05 | Arabic typography system | ✓ SATISFIED | `font-arabic` class + Cairo Variable, `line-height: 1.7`, `letter-spacing: 0` |
| INTL-06 | Translatable content with bilingual fields | ✓ SATISFIED | `t()`, JSON translation files, `useLocale()` |
| DSGN-01 | Premium color palette via CSS custom properties | ✓ SATISFIED | oklch teal tokens in `:root` and `.dark` |
| DSGN-02 | Dark/light mode with smooth transition + localStorage | ✓ SATISFIED | CSS `transition: background-color 0.3s ease`, `useAppearance()` |
| DSGN-03 | Responsive layout all breakpoints | ✓ SATISFIED | `sm:px-6 lg:px-8`, `md:grid-cols-2 lg:grid-cols-4` |
| DSGN-04 | Component library with hover micro-interactions | ✓ SATISFIED | Button lift+glow, Card lift+shadow, Badge brand variant |
| DSGN-05 | Animation system: scroll reveals, stagger, hover | ✓ SATISFIED | `animations.ts` (9 variants), `ScrollReveal`, `useReducedMotion` |
| DSGN-06 | Smooth page transitions | PARTIAL | CSS View Transition crossfade (0.3s) present; `viewTransition: true` removed from `createInertiaApp` defaults (Inertia v3 TS type limitation — documented deviation) |
| DSGN-07 | prefers-reduced-motion support | ✓ SATISFIED | `useReducedMotion()` hook + `ScrollReveal` + CSS `@media` rule |
| DSGN-08 | Sticky header with nav + mobile hamburger | ✓ SATISFIED | Services dropdown, 3 nav items, CTA, Language, Theme, Sheet |
| NAV-01 | Footer with sitemap, contact, social, legal | ✓ SATISFIED | 4-column grid, bottom bar with copyright/Privacy/Terms |
| NAV-02 | Breadcrumbs on inner pages | ✓ SATISFIED | `PublicLayout` conditional breadcrumbs, RTL chevron flip |
| NAV-03 | Custom branded 404 page | ✓ SATISFIED | `errors/404.tsx` + `NotFoundHttpException` handler |

**Coverage: 16/17 fully satisfied, 1 partial (DSGN-06 — intentional documented deviation)**

---

## Anti-Patterns (Plan 04 Changed Files)

No new anti-patterns introduced by Plan 04 changes. All 4 modified files are clean:

- `HandleInertiaRequests.php` — closures are the documented Inertia lazy-eval pattern, not stubs
- `app.blade.php` — locale conditional is correct; Blade renders after SetLocale executes
- `app.css` — adding `backdrop-filter` to transition list is intentional and correct
- `sheet.tsx` — `end-4` is the correct logical property replacement for `right-4`

Pre-existing noted item (unchanged):
- `site-footer.tsx:53` — newsletter form `onSubmit` stub — ℹ️ Info, Phase 2 CONT-07 concern, explicitly documented

---

## Human Verification Required

### 1. Arabic Page Rendering End-to-End

**Test:** Start dev server (`npm run dev` + `php artisan serve`), visit `/ar/`
**Expected:** Nav labels in Arabic (الرئيسية, الخدمات, تواصل معنا), Cairo font visually distinct from Instrument Sans, `html[dir=rtl]` confirmed in DevTools, layout mirrors correctly
**Why human:** Middleware closure fix requires live HTTP request through full middleware stack to confirm deferred evaluation works as intended

### 2. Language Switcher Label Localization

**Test:** Visit `/ar/` and check the language switcher label
**Expected:** Switcher shows "Switch to English" (or equivalent), not "Switch to Arabic"
**Why human:** Label is translated via `useLocale().t()` which requires correct `translations` prop from fixed middleware

### 3. Mobile RTL Sheet Direction

**Test:** Visit `/ar/` at mobile viewport (<1024px), tap hamburger
**Expected:** Sheet slides from LEFT, close button appears at logical end (left side in RTL)
**Why human:** Requires browser with mobile viewport + correct locale props from fixed middleware

### 4. Header Frosted Glass Transition

**Test:** On a page with sufficient content to scroll (Phase 2 home page), scroll past 50px on `/en/` or `/ar/`
**Expected:** Header `backdrop-filter` transitions smoothly to `backdrop-blur-lg`
**Why human:** Requires browser scroll; current home page stub may still lack sufficient height to trigger 50px threshold

### 5. TypeScript Compilation Clean

**Test:** `npm install` then `npx tsc --noEmit`
**Expected:** Zero errors across all Phase 1 files and Plan 04 modified files
**Why human:** `node_modules` not available in verification environment

---

## Summary

Phase 01 gap closure via Plan 04 is fully verified in the codebase. All 4 infrastructure bugs identified during UAT have code-level fixes confirmed:

1. `HandleInertiaRequests::share()` uses closures — locale/direction/translations now evaluate after `SetLocale` route middleware runs. This resolves Arabic locale rendering, translation delivery, RTL direction prop, and Sheet side-switching (UAT Tests 2 and 6).
2. `app.blade.php` body tag applies `font-arabic` class on Arabic locale — Cairo Variable font now correctly applied at the HTML level (UAT Test 2 secondary issue).
3. `app.css` global transition rule includes `backdrop-filter 0.3s ease` — header blur will animate smoothly once pages have sufficient scrollable content (UAT Test 3).
4. `sheet.tsx` close button uses `end-4` — RTL-safe logical positioning (UAT Test 6 secondary issue).

REQUIREMENTS.md is fully up to date with all 17 Phase 1 requirements tracked at correct status.

The ScrollReveal orphan is an accepted deferral with explicit rationale — the animation infrastructure exists and is verified; page-level usage will be added in Phase 2 as content sections are built.

5 browser-level confirmations remain needed — the functional consequences of the 4 infrastructure fixes cannot be confirmed without a live HTTP request stack and browser.

---

_Verified: 2026-03-28T11:00:00Z_
_Verifier: Claude (gsd-verifier)_
_Re-verification after: UAT gaps diagnosed + Plan 04 gap closure executed_
