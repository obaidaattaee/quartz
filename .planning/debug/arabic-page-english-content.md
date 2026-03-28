---
status: investigating
trigger: "Investigate why the Arabic page (/ar/) renders all content in English instead of Arabic"
created: 2026-03-28T00:00:00Z
updated: 2026-03-28T00:00:01Z
---

## Current Focus

hypothesis: ROOT CAUSE CONFIRMED - Two distinct issues found
test: Complete - traced full pipeline
expecting: N/A
next_action: Report findings

## Symptoms

expected: /ar/ page should show Arabic text, Cairo font, RTL layout with Arabic nav labels, headings, and footer
actual: HTML has dir="rtl" and lang="ar" but all visible content is English. Cairo font not loaded. Language switcher says "Switch to Arabic" instead of "Switch to English"
errors: No runtime errors reported - content is simply not translated
reproduction: Visit /ar/ route
started: Unknown - may have never worked

## Eliminated

- hypothesis: Translation files are missing
  evidence: resources/lang/ar.json exists with full Arabic translations (30 keys). resources/lang/en.json also exists.
  timestamp: 2026-03-28T00:00:01Z

- hypothesis: React components are not using the translation system
  evidence: SiteHeader, SiteFooter, LanguageSwitcher, Home page all use useLocale() hook and t() function correctly
  timestamp: 2026-03-28T00:00:01Z

- hypothesis: The useLocale hook is broken
  evidence: useLocale correctly reads props.locale, props.direction, props.translations from Inertia page props. The hook works; the data it receives is wrong.
  timestamp: 2026-03-28T00:00:01Z

- hypothesis: Cairo font package not installed
  evidence: @fontsource-variable/cairo@5.2.7 is installed and imported in app.tsx line 2
  timestamp: 2026-03-28T00:00:01Z

## Evidence

- timestamp: 2026-03-28T00:00:01Z
  checked: routes/web.php - how locale routing works
  found: Routes use {locale} prefix with SetLocale middleware applied at ROUTE level (not global)
  implication: SetLocale runs as route middleware, not global web middleware

- timestamp: 2026-03-28T00:00:01Z
  checked: bootstrap/app.php - global middleware registration
  found: HandleInertiaRequests is registered as global web middleware via $middleware->web(append: [...])
  implication: HandleInertiaRequests runs BEFORE route-level SetLocale middleware

- timestamp: 2026-03-28T00:00:01Z
  checked: vendor/inertiajs/inertia-laravel/src/Middleware.php line 116
  found: Inertia::share($this->share($request)) is called BEFORE $next($request) on line 138
  implication: HandleInertiaRequests::share() executes BEFORE the request reaches route middleware

- timestamp: 2026-03-28T00:00:01Z
  checked: HandleInertiaRequests::share() method
  found: $locale = app()->getLocale() is called eagerly, 'locale', 'direction', and 'translations' closure (which captures $locale by value) are all set using this value
  implication: When share() runs, SetLocale hasn't run yet, so app()->getLocale() returns 'en' (default). All three props get English values.

- timestamp: 2026-03-28T00:00:01Z
  checked: app.blade.php - HTML attributes
  found: lang="{{ app()->getLocale() }}" and dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}" use app()->getLocale() at RENDER time (after all middleware)
  implication: Blade template renders AFTER SetLocale runs, so HTML attributes are correct. But Inertia props were already captured with wrong locale.

- timestamp: 2026-03-28T00:00:01Z
  checked: app.blade.php line 47 and app.css lines 11-14 and 149-151
  found: body has class="font-sans antialiased" which sets font-family via Tailwind to --font-sans (Instrument Sans). CSS rule [dir="rtl"] { font-family: var(--font-arabic); } sets on html element but body's direct class overrides inherited font.
  implication: Even when dir="rtl" is correctly set, Cairo font doesn't apply because body's font-sans class wins over html's inherited font-family

## Resolution

root_cause: |
  TWO ISSUES:

  1. MIDDLEWARE ORDERING (primary): HandleInertiaRequests is global web middleware but SetLocale is route-level middleware. In Laravel, global middleware runs before route middleware. HandleInertiaRequests::share() calls app()->getLocale() EAGERLY during handle() (line 116 of Inertia Middleware.php, before $next($request) on line 138). At this point SetLocale hasn't run yet, so locale defaults to 'en'. The closure for translations also captures $locale='en' by value. Result: all three shared props (locale, direction, translations) always carry English values regardless of URL.

  2. CSS FONT SPECIFICITY (secondary): The [dir="rtl"] { font-family: var(--font-arabic) } rule sets font on the html element, but the body has class="font-sans" which directly applies font-family: var(--font-sans). Body's direct property overrides html's inherited font-family.

fix:
verification:
files_changed: []
