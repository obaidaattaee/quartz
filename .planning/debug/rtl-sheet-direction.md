---
status: investigating
trigger: "Investigate why the mobile navigation Sheet opens from the RIGHT side even on the Arabic (RTL) locale."
created: 2026-03-28T00:00:00Z
updated: 2026-03-28T00:01:00Z
---

## Current Focus

hypothesis: HandleInertiaRequests::share() eagerly evaluates locale/direction BEFORE SetLocale route middleware runs, so props.direction is always 'ltr' regardless of URL locale
test: Traced middleware execution order and share() evaluation timing
expecting: direction prop is 'ltr' on /ar routes because share() runs before SetLocale
next_action: Confirm root cause and report

## Symptoms

expected: On /ar (Arabic RTL locale), the mobile navigation Sheet should open from the LEFT side with slide-in-from-left, left-0, border-r classes
actual: Sheet opens from the RIGHT side with slide-in-from-right, right-0, border-l classes regardless of locale
errors: UAT test failure - RTL sheet direction not flipped
reproduction: Visit /ar at mobile viewport, tap hamburger menu
started: Always broken (middleware ordering issue since implementation)

## Eliminated

## Evidence

- timestamp: 2026-03-28T00:00:30Z
  checked: resources/js/components/ui/sheet.tsx - SheetContent component
  found: SheetContent accepts a `side` prop (default "right") and applies appropriate CSS classes per side. Component correctly supports both "left" and "right" sides.
  implication: Sheet component itself is NOT the problem - it correctly handles side="left"

- timestamp: 2026-03-28T00:00:35Z
  checked: resources/js/components/site-header.tsx line 138
  found: SheetContent already has `side={isRTL ? 'left' : 'right'}` - RTL-aware logic EXISTS in the consumer
  implication: The RTL logic in site-header.tsx is correct; isRTL must be evaluating to false

- timestamp: 2026-03-28T00:00:40Z
  checked: resources/js/hooks/use-locale.tsx
  found: isRTL = direction === 'rtl', where direction comes from props.direction via usePage()
  implication: If props.direction is 'ltr', isRTL will be false and Sheet opens from right

- timestamp: 2026-03-28T00:00:45Z
  checked: app/Http/Middleware/HandleInertiaRequests.php lines 38, 48
  found: share() eagerly evaluates `$locale = app()->getLocale()` then `'direction' => $locale === 'ar' ? 'rtl' : 'ltr'` - NOT a closure
  implication: The direction value is computed at call time, not lazily at render time

- timestamp: 2026-03-28T00:00:50Z
  checked: vendor/inertiajs/inertia-laravel/src/Middleware.php line 116 vs 138
  found: `Inertia::share($this->share($request))` is called on line 116 BEFORE `$response = $next($request)` on line 138. share() is evaluated in the request phase.
  implication: share() runs before route middleware (SetLocale) in the pipeline

- timestamp: 2026-03-28T00:00:55Z
  checked: bootstrap/app.php - middleware registration
  found: HandleInertiaRequests is registered as global web middleware via `$middleware->web(append: [...])`. SetLocale is route-level middleware applied in routes/web.php.
  implication: Global middleware runs before route middleware. HandleInertiaRequests::share() captures locale='en'/direction='ltr' before SetLocale sets locale to 'ar'

- timestamp: 2026-03-28T00:01:00Z
  checked: resources/views/app.blade.php line 4
  found: `dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}"` evaluates correctly because Blade renders AFTER all middleware (including SetLocale) have processed
  implication: HTML dir="rtl" is correct on /ar, but Inertia props.direction is 'ltr' - creating a disconnect

## Resolution

root_cause: Middleware ordering issue. HandleInertiaRequests is a global web middleware that calls share() with eagerly-evaluated locale/direction values BEFORE the route-level SetLocale middleware runs. When visiting /ar, share() captures app()->getLocale() as 'en' (the default) because SetLocale hasn't set it to 'ar' yet. The direction prop is therefore always 'ltr', causing useLocale().isRTL to always be false, and SheetContent always receives side="right". The Blade template's dir attribute works correctly because it evaluates after all middleware, creating a confusing inconsistency where the HTML has dir="rtl" but React components think direction is LTR.
fix:
verification:
files_changed: []
