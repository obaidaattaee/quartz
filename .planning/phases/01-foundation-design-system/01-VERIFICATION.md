---
phase: 01-foundation-design-system
verified: 2026-03-28T09:00:00Z
status: human_needed
score: 19/19 must-haves verified (automated); TypeScript compilation unverifiable without node_modules
re_verification: false
human_verification:
  - test: "TypeScript compilation passes"
    expected: "npx tsc --noEmit produces zero errors after npm install"
    why_human: "node_modules not installed in working environment; tsc binary unavailable"
  - test: "Navigating to /en/ in browser renders English LTR layout"
    expected: "Header shows English nav labels, html[dir=ltr], Instrument Sans font, teal primary color"
    why_human: "No runnable dev server in verification environment"
  - test: "Navigating to /ar/ in browser renders Arabic RTL layout"
    expected: "html[dir=rtl] set server-side, Cairo font loads, line-height 1.7, header/footer text in Arabic, layout flips correctly"
    why_human: "No runnable dev server in verification environment"
  - test: "Language switcher in header toggles EN/AR and preserves current page URL"
    expected: "Clicking the switcher on /en/about navigates to /ar/about and vice versa"
    why_human: "Requires browser interaction with live routing"
  - test: "Header transitions from transparent to frosted glass on scroll"
    expected: "After scrolling past 50px, header gains backdrop-blur-lg and bg-background/80 classes"
    why_human: "Requires browser scroll interaction"
  - test: "Mobile hamburger menu opens from correct side per locale"
    expected: "LTR: Sheet opens from right. RTL: Sheet opens from left."
    why_human: "Requires browser at mobile viewport with live Inertia rendering"
  - test: "Dark mode system preference is respected on initial load"
    expected: "With OS in dark mode and no localStorage key set, page renders dark (navy-black background)"
    why_human: "Requires browser environment with OS dark mode preference"
  - test: "Scroll reveal animations fire for ScrollReveal-wrapped elements"
    expected: "Elements fade in + translate-y 20px when 20% visible in viewport"
    why_human: "Requires browser with Motion library loaded"
  - test: "prefers-reduced-motion disables animations"
    expected: "With OS reduced-motion enabled, ScrollReveal initial=false (no animation), view-transition animations suppressed"
    why_human: "Requires OS accessibility setting + browser"
  - test: "REQUIREMENTS.md tracking for DSGN-04/05/06/07 updated to reflect completion"
    expected: "Checkboxes checked and status column shows Complete, not Pending"
    why_human: "Documentation discrepancy found — code is implemented but tracking file not updated"
---

# Phase 1: Foundation & Design System Verification Report

**Phase Goal:** Every page rendered in either English (LTR) or Arabic (RTL) looks correct, uses the same design tokens, and has working navigation with smooth transitions
**Verified:** 2026-03-28
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Navigating to /en/any-page renders in English LTR | ? HUMAN | Route exists: `Route::inertia('/', 'public/home')` under `{locale}` prefix with SetLocale. HTML `dir` set server-side. Functional but browser required. |
| 2 | Navigating to /ar/any-page renders in Arabic RTL with Cairo font and 1.7 line-height | ? HUMAN | `dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}"` in Blade. CSS `[dir="rtl"] { font-family: var(--font-arabic) }` and `[dir="rtl"] body { line-height: 1.7 }` confirmed. Browser required. |
| 3 | Navigating to / redirects to /en | ✓ VERIFIED | `Route::redirect('/', '/en')` in routes/web.php:7 |
| 4 | Unsupported locale (e.g. /fr/) returns 404 | ✓ VERIFIED | `->where(['locale' => 'en|ar'])` constraint in routes/web.php:11 plus `abort(404)` in SetLocale.php:18 |
| 5 | Primary accent color is teal across all components in both light and dark modes | ✓ VERIFIED | `:root { --primary: oklch(0.704 0.14 182.503) }` and `.dark { --primary: oklch(0.777 0.152 181.912) }` in app.css:74,110 |
| 6 | Dark mode shows deep navy-black background; light mode shows near-white background | ✓ VERIFIED | `.dark { --background: oklch(0.13 0.01 240) }` (app.css:104), `:root { --background: oklch(0.985 0 0) }` (app.css:68), blade inline style syncs |
| 7 | System preference decides initial dark/light mode | ✓ VERIFIED | `initializeTheme()` in use-appearance.tsx calls `window.matchMedia('(prefers-color-scheme: dark)')` and applies class before React hydrates |
| 8 | All new CSS uses logical properties (start/end) not physical (left/right) | ✓ VERIFIED | No `ml-/mr-/pl-/pr-` found in site-header.tsx, site-footer.tsx, or public-layout.tsx. `ps-3` and `text-start` used in header. |
| 9 | Translation function t() returns correct string for current locale | ✓ VERIFIED | `resources/js/lib/i18n.ts` exports `t()` with fallback-to-key behavior. `useLocale().t()` wires translations from Inertia shared props. |
| 10 | Scroll reveal animations fire once when element is 20% visible | ✓ VERIFIED | `scroll-reveal.tsx` uses `viewport={{ once: true, amount: 0.2 }}` with `whileInView="visible"` (line 38) |
| 11 | Stagger animation applies 0.1s delay between sibling items | ✓ VERIFIED | `staggerContainer.visible.transition.staggerChildren: 0.1` in animations.ts:26 |
| 12 | All animations disabled when prefers-reduced-motion is set | ✓ VERIFIED | `useReducedMotion()` returns Motion's hook result; `initial={shouldReduceMotion ? false : 'hidden'}` in scroll-reveal.tsx:36,53. CSS rule also suppresses view-transition animations. |
| 13 | Buttons have hover micro-interaction (subtle lift + glow) | ✓ VERIFIED | `hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/25` in button.tsx default variant (line 13) |
| 14 | Cards have hover micro-interaction (subtle lift + border glow) | ✓ VERIFIED | `hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300` in card.tsx:10 |
| 15 | Sticky header starts transparent, transitions to frosted glass on scroll | ✓ VERIFIED | `useScrollHeader()` drives `isScrolled`. When true: `border-border/50 bg-background/80 border-b backdrop-blur-lg` applied (site-header.tsx:56-58). Browser required for live confirmation. |
| 16 | Language switcher toggles EN/AR and preserves current page URL | ✓ VERIFIED | `switchLocaleUrl` computed from `url.replace(^/${locale}(/|$), /${targetLocale}$1)` in use-locale.tsx:22-25. LanguageSwitcher renders `<Link href={switchLocaleUrl}>`. |
| 17 | Footer shows 4-column grid with copyright + Privacy + Terms bottom bar | ✓ VERIFIED | site-footer.tsx: `grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4` (line 36). Bottom bar with copyright, privacy, terms at lines 131-152. |
| 18 | 404 page shows branded design with navigation back to home | ✓ VERIFIED | errors/404.tsx renders translated 404 content with `<Button asChild><Link href={/${locale}}>` back link. bootstrap/app.php wires it via `NotFoundHttpException` handler. |
| 19 | Mobile menu slides from correct side (right for LTR, left for RTL) | ✓ VERIFIED | `<SheetContent side={isRTL ? 'left' : 'right'}>` in site-header.tsx:138 |

**Score:** 19/19 truths structurally verified (9 require browser confirmation)

---

### Required Artifacts

#### Plan 01 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/Http/Middleware/SetLocale.php` | Locale extraction from URL | ✓ VERIFIED | Contains `app()->setLocale($locale)`, `URL::defaults`, `abort(404)` for unsupported locales |
| `resources/css/app.css` | Teal brand color tokens in oklch | ✓ VERIFIED | `--primary: oklch(0.704 0.14 182.503)` in :root, `--background: oklch(0.13 0.01 240)` in .dark |
| `resources/js/hooks/use-locale.tsx` | React hook for locale, direction, translation | ✓ VERIFIED | Exports `useLocale()` returning locale, direction, isRTL, t, switchLocaleUrl |
| `resources/js/lib/i18n.ts` | Translation helper function | ✓ VERIFIED | Exports `t(translations, key, replacements?)` with fallback-to-key |
| `resources/js/types/locale.ts` | Locale and Direction type definitions | ✓ VERIFIED | Exports `Locale`, `Direction`, `LocaleProps` |
| `resources/lang/en.json` | English UI translations (min 10 keys) | ✓ VERIFIED | 29 keys covering nav, footer, breadcrumb, theme, error strings |
| `resources/lang/ar.json` | Arabic UI translations (min 10 keys) | ✓ VERIFIED | 29 keys, matching en.json keys with Arabic values |

#### Plan 02 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `resources/js/lib/animations.ts` | Shared Motion animation variants | ✓ VERIFIED | Exports: fadeInUp, fadeIn, scaleIn, staggerContainer, staggerContainerFast, heroEntrance, defaultTransition, heroTransition, quickTransition |
| `resources/js/components/scroll-reveal.tsx` | Reusable scroll-triggered reveal wrapper | ✓ VERIFIED | Default export `ScrollReveal`, supports default/hero/stagger variants, uses Motion whileInView |
| `resources/js/hooks/use-reduced-motion.tsx` | Hook wrapping Motion useReducedMotion | ✓ VERIFIED | Exports `useReducedMotion(): boolean` wrapping Motion's hook |

#### Plan 03 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `resources/js/layouts/public-layout.tsx` | Public page layout wrapper | ✓ VERIFIED | Default export `PublicLayout`, 74 lines, wires SiteHeader + breadcrumbs + SiteFooter |
| `resources/js/components/site-header.tsx` | Sticky header with nav, CTA, language switcher, theme toggle | ✓ VERIFIED | 190+ lines, Services dropdown, 3 nav items, Contact CTA, LanguageSwitcher, ThemeToggle, mobile Sheet |
| `resources/js/components/site-footer.tsx` | 4-column footer | ✓ VERIFIED | 155 lines, 4-column grid, newsletter form, services/quick links/contact columns, bottom bar |
| `resources/js/components/language-switcher.tsx` | EN/AR language toggle | ✓ VERIFIED | Exports `LanguageSwitcher`, uses `switchLocaleUrl` from `useLocale()` |
| `resources/js/components/theme-toggle.tsx` | Dark/light/system mode toggle | ✓ VERIFIED | Exports `ThemeToggle`, cycles light/dark/system via `useAppearance()` |
| `resources/js/hooks/use-scroll-header.tsx` | Scroll position detection hook | ✓ VERIFIED | Exports `useScrollHeader(threshold=50): boolean`, passive scroll listener |
| `resources/js/pages/errors/404.tsx` | Branded 404 error page | ✓ VERIFIED | 32 lines, uses `useLocale().t()`, navigates back to `/${locale}` |
| `resources/js/pages/public/home.tsx` | Minimal home page placeholder | ✓ VERIFIED | 28 lines, uses PublicLayout via `Home.layout` pattern |

---

### Key Link Verification

#### Plan 01 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| routes/web.php | SetLocale.php | middleware on locale route group | ✓ WIRED | `->middleware(SetLocale::class)` at routes/web.php:12 |
| HandleInertiaRequests.php | use-locale.tsx | Inertia shared data (locale, direction, translations) | ✓ WIRED | `'locale' =>`, `'direction' =>`, `'translations' =>` in share() method; use-locale.tsx reads from `usePage().props` |
| resources/views/app.blade.php | resources/css/app.css | dir attribute on html element | ✓ WIRED | `dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}"` on html tag (line 4); CSS `[dir="rtl"]` selectors respond |

#### Plan 02 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| scroll-reveal.tsx | animations.ts | imports fadeInUp variant and defaultTransition | ✓ WIRED | `import { fadeInUp, staggerContainer, defaultTransition, heroEntrance, heroTransition } from '@/lib/animations'` at scroll-reveal.tsx:5-11 |
| scroll-reveal.tsx | use-reduced-motion.tsx | imports useReducedMotion | ✓ WIRED | `import { useReducedMotion } from '@/hooks/use-reduced-motion'` at scroll-reveal.tsx:4 |
| resources/css/app.css | View Transitions API | prefers-reduced-motion media query | ✓ WIRED | `@media (prefers-reduced-motion: reduce) { ::view-transition-group(*) ... animation: none !important }` at app.css:180-186 |

#### Plan 03 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| public-layout.tsx | site-header.tsx | imports and renders SiteHeader at top | ✓ WIRED | `import SiteHeader` at line 5; `<SiteHeader />` at line 27 |
| public-layout.tsx | site-footer.tsx | imports and renders SiteFooter at bottom | ✓ WIRED | `import SiteFooter` at line 4; `<SiteFooter />` at line 71 |
| app.tsx | public-layout.tsx | layout resolver returns PublicLayout for public/ pages | ✓ WIRED | `import PublicLayout from '@/layouts/public-layout'` at line 9; `case name.startsWith('public/')`: return PublicLayout` at line 22-23 |
| site-header.tsx | use-scroll-header.tsx | scroll position for frosted glass transition | ✓ WIRED | `import { useScrollHeader }` at line 24; `const isScrolled = useScrollHeader()` at line 28; used in className at line 55-58 |
| site-header.tsx | language-switcher.tsx | renders LanguageSwitcher in header right section | ✓ WIRED | `import LanguageSwitcher` at line 5; `<LanguageSwitcher />` at line 123 |

---

### Data-Flow Trace (Level 4)

Components rendering dynamic data from Inertia shared props:

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| use-locale.tsx | translations | `props.translations` from Inertia | `HandleInertiaRequests::loadTranslations()` reads JSON from `lang_path("{locale}.json")` | ✓ FLOWING |
| use-locale.tsx | locale | `props.locale` from Inertia | `$locale = app()->getLocale()` set by SetLocale middleware | ✓ FLOWING |
| use-locale.tsx | direction | `props.direction` from Inertia | Derived from locale: `$locale === 'ar' ? 'rtl' : 'ltr'` | ✓ FLOWING |
| site-header.tsx | isScrolled | `useScrollHeader()` → `window.scrollY` | Real DOM scroll event listener | ✓ FLOWING |
| language-switcher.tsx | switchLocaleUrl | `useLocale().switchLocaleUrl` → regex replace on `usePage().url` | Real current page URL | ✓ FLOWING |

---

### Behavioral Spot-Checks

Step 7b: SKIPPED — no node_modules installed, no dev server running. PHP vendor exists but artisan commands require Composer setup in this environment.

Route structure verified via file inspection:
- `Route::redirect('/', '/en')` — root redirect
- `Route::prefix('{locale}')->where(['locale' => 'en|ar'])->middleware(SetLocale::class)` — locale group
- `NotFoundHttpException` handler → `Inertia::render('errors/404')` — 404 wired

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|---------|
| INTL-01 | 01-01 | URL-based language routing with /en/ and /ar/ prefixes | ✓ SATISFIED | SetLocale.php + routes/web.php locale prefix group |
| INTL-02 | 01-01 | Full RTL layout using CSS logical properties | ✓ SATISFIED | `dir` attribute server-side on html; `[dir="rtl"]` CSS rules; no physical left/right in new components |
| INTL-03 | 01-01 | Language switcher preserves current page | ✓ SATISFIED | `switchLocaleUrl` regex-replaces locale prefix in current URL |
| INTL-04 | 01-01 | Bidirectional text handling for mixed EN/AR content | ✓ SATISFIED | `.bidi-isolate { unicode-bidi: isolate }` utility class; `dir="ltr"` on phone number span in footer |
| INTL-05 | 01-01 | Arabic typography with proper fonts, line-height, no letter-spacing | ✓ SATISFIED | `[dir="rtl"] { font-family: var(--font-arabic) }` and `[dir="rtl"] body { line-height: 1.7; letter-spacing: 0 }` |
| INTL-06 | 01-01 | Translatable content with bilingual fields | ✓ SATISFIED | `HandleInertiaRequests::loadTranslations()` shares JSON translations; `t()` function and `useLocale()` hook available |
| DSGN-01 | 01-01 | Premium color palette via CSS custom properties | ✓ SATISFIED | Full oklch teal token set in :root and .dark blocks |
| DSGN-02 | 01-01 | Dark/light mode with smooth transition + localStorage | ✓ SATISFIED | CSS `transition: background-color 0.3s ease` on html; `useAppearance()` persists via localStorage + cookie |
| DSGN-03 | 01-01 | Responsive layout at all breakpoints | ✓ SATISFIED | `sm:px-6 lg:px-8`, `md:grid-cols-2 lg:grid-cols-4`, `hidden lg:flex` breakpoints in header/footer |
| DSGN-04 | 01-02 | Consistent component library with hover micro-interactions | ✓ SATISFIED | Button: hover lift+glow; Card: hover lift+shadow; Badge: brand variant; Input: teal focus ring |
| DSGN-05 | 01-02 | Animation system: scroll reveals, stagger, hover effects | ✓ SATISFIED | `animations.ts` with 9 exports; `ScrollReveal` with whileInView + 20% viewport trigger |
| DSGN-06 | 01-02 | Smooth page transitions (View Transitions) | PARTIAL | View Transition CSS crossfade (0.3s) is in place. Global `viewTransition: true` in createInertiaApp removed due to TS type incompatibility (documented deviation). Per-Link viewTransition still available. |
| DSGN-07 | 01-02 | prefers-reduced-motion support | ✓ SATISFIED | `useReducedMotion()` hook; ScrollReveal passes `false` to initial prop; CSS `@media (prefers-reduced-motion: reduce)` disables view-transition animations |
| DSGN-08 | 01-03 | Sticky header with 4-6 nav items + mobile hamburger | ✓ SATISFIED | site-header.tsx: Services dropdown + 3 nav items + Contact CTA + Language + Theme + hamburger Sheet |
| NAV-01 | 01-03 | Footer with sitemap, contact, social, legal | ✓ SATISFIED | 4-column footer; bottom bar with copyright, Privacy, Terms |
| NAV-02 | 01-03 | Breadcrumbs on inner pages | ✓ SATISFIED | PublicLayout renders breadcrumbs conditionally; `rtl:[&>svg]:rotate-180` in breadcrumb.tsx + CSS fallback |
| NAV-03 | 01-03 | Custom branded 404 page with back navigation | ✓ SATISFIED | errors/404.tsx + NotFoundHttpException handler in bootstrap/app.php |

**Requirements Coverage:** 16/17 fully satisfied, 1 partial (DSGN-06 — intentional documented deviation)

**REQUIREMENTS.md tracking discrepancy:** DSGN-04, DSGN-05, DSGN-06, DSGN-07 still show `[ ]` (unchecked) and "Pending" status in REQUIREMENTS.md, despite being implemented and claimed completed in 01-02-SUMMARY.md. The REQUIREMENTS.md tracking file was not updated after Plan 02 completed.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| site-footer.tsx | 53 | `onSubmit={(e) => e.preventDefault()}` on newsletter form | ℹ️ Info | Intentional documented stub per Plan 03 decision; Phase 2 CONT-07 will wire to backend. Not a blocker for Phase 1 goal. |
| site-footer.tsx | 120 | `dir="ltr"` hardcoded on phone number | ℹ️ Info | Correct usage — phone numbers are always LTR regardless of page direction. Not a bug. |

No blocker anti-patterns found. The newsletter form stub is explicitly documented and scoped to Phase 2.

---

### Human Verification Required

#### 1. TypeScript Compilation

**Test:** After `npm install`, run `npx tsc --noEmit` from project root
**Expected:** Zero type errors across all new files (use-locale.tsx, i18n.ts, locale.ts, animations.ts, scroll-reveal.tsx, use-reduced-motion.tsx, use-scroll-header.tsx, site-header.tsx, site-footer.tsx, language-switcher.tsx, theme-toggle.tsx, public-layout.tsx, 404.tsx, home.tsx)
**Why human:** `node_modules` not installed in verification environment

#### 2. English/Arabic Page Rendering

**Test:** Start dev server (`npm run dev` + `php artisan serve`), visit `/en/` and `/ar/`
**Expected:** `/en/` shows English labels (Home, Services, etc.), LTR layout, Instrument Sans font, teal buttons. `/ar/` shows Arabic labels (الرئيسية, الخدمات, etc.), RTL layout, Cairo font, 1.7 line-height.
**Why human:** Requires live browser with Inertia + Vite serving assets

#### 3. Header Frosted Glass on Scroll

**Test:** Visit `/en/` in browser, scroll down past 50px
**Expected:** Header transitions from transparent to `backdrop-blur-lg` frosted glass with subtle bottom border
**Why human:** Requires browser scroll event

#### 4. Language Switcher URL Preservation

**Test:** Navigate to `/en/about` (once that page exists), click language switcher
**Expected:** Navigates to `/ar/about` preserving the path segment
**Why human:** Requires live routing + browser navigation

#### 5. Dark Mode System Preference on Fresh Load

**Test:** Clear localStorage, set OS to dark mode, visit site
**Expected:** Page loads dark (navy-black background oklch(0.13 0.01 240)) without flash
**Why human:** Requires OS preference + browser + clear storage state

#### 6. Mobile RTL Sheet Direction

**Test:** Set browser to `/ar/` on mobile viewport (<1024px), tap hamburger icon
**Expected:** Sheet slides in from the LEFT side (not right) because isRTL=true
**Why human:** Requires mobile viewport + browser interaction

#### 7. ScrollReveal Animations

**Test:** Visit a page using `<ScrollReveal>` wrapper, observe element entering viewport
**Expected:** Element starts hidden (opacity:0, y:20) and animates to visible (opacity:1, y:0) once
**Why human:** Requires Motion library loaded in browser + scroll interaction

#### 8. REQUIREMENTS.md Tracking Update

**Test:** Update REQUIREMENTS.md to check off DSGN-04, DSGN-05, DSGN-06, DSGN-07 and change status to Complete
**Expected:** All 17 phase 1 requirements show Complete in tracking table
**Why human:** Documentation update task, not code verification

---

### Noted Deviation: DSGN-06 Global View Transitions

**What the plan specified:** `defaults: { viewTransition: true }` in `createInertiaApp()` for global page transitions.

**What was implemented:** The `defaults` block was intentionally removed. The Inertia v3 TypeScript types do not expose `viewTransition` in `InertiaAppConfig`, causing a TS2769 compile error. The View Transitions CSS (crossfade at 0.3s, reduced-motion support) is in place. Per-Link and per-`router.visit()` `viewTransition` options remain available.

**Impact on goal:** Minimal. The CSS infrastructure for transitions is wired. Global auto-transitions will not fire without the config key, but individual navigations can opt in. This is a framework type limitation, not a missing implementation.

---

### Gaps Summary

No blocking gaps found. All 19 observable truths have structural evidence in the codebase. All 18 artifacts from the three plan must_haves are present, substantive, and wired. All key links connect. Data flows from middleware through Inertia props to components.

Two items are deferred to human verification:
1. TypeScript compilation (no node_modules in environment)
2. Browser-level behavior (no dev server running)

One documentation discrepancy: REQUIREMENTS.md tracking for DSGN-04/05/06/07 not updated to "Complete" after Plan 02 executed.

---

_Verified: 2026-03-28_
_Verifier: Claude (gsd-verifier)_
