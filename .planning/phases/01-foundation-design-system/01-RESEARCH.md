# Phase 1: Foundation & Design System - Research

**Researched:** 2026-03-28
**Domain:** Bilingual (EN/AR) locale routing, RTL layout, design tokens, animation system, page transitions, shared layout components
**Confidence:** HIGH

## Summary

Phase 1 establishes the bilingual infrastructure and visual foundation for the entire Quartz website. The work spans three core domains: (1) locale-based URL routing with `/en/` and `/ar/` prefixes, middleware for `setLocale`, and RTL layout via CSS logical properties in Tailwind CSS v4; (2) a premium dark/teal design system with oklch color tokens, Cairo + Instrument Sans typography, and dark/light mode toggle; (3) animation primitives using Motion (formerly Framer Motion) for scroll reveals and page transitions via Inertia.js v3 View Transitions API, plus GSAP ScrollTrigger for scroll-driven effects.

The existing codebase provides a strong foundation: Radix UI components (25 primitives installed), a working `useAppearance` hook for dark/light mode, a Blade template already wiring `lang` from Laravel's locale, and a `@theme` block in `app.css` using oklch CSS custom properties. The main gaps to fill are: adding `dir` attribute to the Blade template, creating locale routing middleware, building a new public-site layout (header + footer vs. the existing admin sidebar layout), wiring the Cairo Arabic font, replacing neutral oklch tokens with teal brand colors, and adding animation libraries.

**Primary recommendation:** Build locale routing manually (no third-party package) using Laravel route groups with `{locale}` prefix and a `SetLocale` middleware. Use Tailwind v4's built-in logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`) for RTL -- no plugin needed. Use Inertia v3's native View Transitions API for page crossfade. Use Motion for declarative React animations (scroll reveal, micro-interactions) and GSAP + ScrollTrigger for complex scroll-driven sequences.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Dark premium visual tone -- deep navy/near-black backgrounds, teal accent glows, white/light gray text. Think Linear, Vercel, Stripe aesthetic.
- **D-02:** Primary accent color is teal/emerald (#14B8A6 primary, #0D9488 deeper glow, teal-to-emerald gradient). Used for CTAs, links, focus rings, glow effects, accent borders.
- **D-03:** Both dark and light modes get equal design attention -- neither is the "default." System preference decides initial mode. Both must feel equally polished.
- **D-04:** Scroll reveal animations are subtle -- fade-in + translate-y(20px), duration 0.3-0.5s, stagger 0.1s between items. Scroll trigger fires once at 20% visible. Hero gets slightly bolder entrance, cards get gentle stagger, text gets simple fade-in.
- **D-05:** Page transitions use crossfade -- opacity crossfade between pages (~0.3s total). Snappy, SPA-like feel. Excellent Inertia compatibility.
- **D-06:** prefers-reduced-motion must be respected -- disable all animations for users who opt out (DSGN-07).
- **D-07:** Arabic font family is Cairo (Google Fonts). Contemporary, distinctive style with 200-1000 weight range (variable font available). Pairs with Instrument Sans for English.
- **D-08:** Arabic typography follows INTL-05 requirements: line-height 1.6-1.8x, no letter-spacing, proper Arabic rendering.
- **D-09:** Header has 4 nav items + CTA: Logo (acts as Home link) | Services (dropdown: Dev, Automation, QA, Cybersecurity) | Portfolio | Blog | About -- plus "Contact Us" CTA button. Right side: language switcher + dark/light toggle.
- **D-10:** Header starts transparent over hero sections, transitions to frosted glass (backdrop-blur + bg-opacity) on scroll. Smooth 0.3s transition. Needs contrast handling for text over varied hero content.
- **D-11:** Footer uses 4-column grid layout: (1) Logo + tagline + newsletter capture, (2) Services links, (3) Quick links (Blog, Portfolio, About, FAQ), (4) Contact info + social icons. Bottom bar: copyright + Privacy + Terms.
- **D-12:** Breadcrumbs on all inner pages (services, blog, portfolio) per NAV-02.

### Claude's Discretion
- Glass-morphism and glow effect intensity -- calibrate during implementation based on what looks best in context
- Hover micro-interactions on buttons and cards -- choose appropriate approach (lift+glow, scale+shift, etc.)
- Arabic font loading strategy -- pick best approach (subset+swap, preload, etc.) considering performance
- 404 page design and personality -- branded, on-theme, with navigation back to key pages

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INTL-01 | URL-based language routing with /en/ and /ar/ prefixes on all public routes | Laravel route group with `{locale}` prefix, SetLocale middleware, URL::defaults() for locale |
| INTL-02 | Full RTL layout for Arabic using CSS logical properties (start/end, not left/right) | Tailwind v4 built-in logical properties (ms-*, me-*, ps-*, pe-*, start-*, end-*, float-start, text-start, rounded-s-*, border-s-*) |
| INTL-03 | Language switcher in header that preserves current page when switching | Inertia `usePage()` to get current URL, swap locale prefix, `Link` component for navigation |
| INTL-04 | Bidirectional text handling for mixed EN/AR content (brand names, technical terms) | CSS `unicode-bidi: isolate` and `dir="auto"` on mixed content spans |
| INTL-05 | Arabic typography system with proper fonts, line-height (1.6-1.8x), and no letter-spacing | Cairo variable font via @fontsource-variable/cairo, CSS custom properties for Arabic-specific typography |
| INTL-06 | All translatable content stored with bilingual fields (EN + AR) | JSON translation files + Inertia shared data for UI strings; database models with `_en`/`_ar` field pairs for dynamic content |
| DSGN-01 | Premium color palette with primary/secondary colors via CSS custom properties | oklch color tokens replacing current neutral palette with teal brand colors |
| DSGN-02 | Dark/light mode toggle with smooth transition and localStorage persistence | Existing `useAppearance` hook + extend with CSS `transition` on color-scheme change |
| DSGN-03 | Responsive layout system tested at all breakpoints (mobile, tablet, desktop) | Tailwind responsive prefixes (sm, md, lg, xl) on new PublicLayout |
| DSGN-04 | Consistent component library with hover micro-interactions | Extend existing Radix UI components with Motion hover animations and teal brand styling |
| DSGN-05 | Animation system using Motion + GSAP for scroll reveals, staggered entrances, hover effects | Motion 12.x for React declarative animations, GSAP 3.14.x + ScrollTrigger for scroll-driven sequences |
| DSGN-06 | Smooth page transitions between routes | Inertia v3 View Transitions API with `viewTransition: true` in createInertiaApp defaults |
| DSGN-07 | prefers-reduced-motion support -- disable animations for users who opt out | CSS `@media (prefers-reduced-motion: reduce)` and Motion's `useReducedMotion()` hook |
| DSGN-08 | Sticky header navigation with 4-6 items and mobile hamburger menu | New SiteHeader component with scroll-aware frosted glass, Radix NavigationMenu for desktop, Sheet for mobile |
| NAV-01 | Footer with sitemap links, contact info, social links, and legal | New SiteFooter component with 4-column responsive grid |
| NAV-02 | Breadcrumbs on inner pages (services, blog, portfolio) | Existing Breadcrumb Radix UI component, integrated into PublicLayout |
| NAV-03 | Custom branded 404 error page with navigation back to key pages | Laravel `render` method for 404 returning Inertia page, branded React error component |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | 12.38.0 | React animation (scroll reveals, hover effects, entrance animations) | Industry standard React animation library, 30M+ monthly npm downloads, declarative API, AnimatePresence for mount/unmount |
| gsap | 3.14.2 | Scroll-driven animations, complex timelines | Industry standard animation platform, now 100% free (Webflow acquisition), ScrollTrigger is best-in-class |
| @gsap/react | 2.1.2 | React integration hook for GSAP | Official React adapter with useGSAP() hook, auto-cleanup in strict mode |
| @fontsource-variable/cairo | 5.2.7 | Arabic typography (variable font, 200-1000 weight) | Self-hosted variable font, subset support (arabic, latin), no external CDN dependency |
| @fontsource-variable/instrument-sans | 5.2.8 | English typography (variable font, 400-700 weight) | Replaces current CDN link, self-hosted for performance consistency |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @radix-ui/react-navigation-menu | 1.2.5 | Desktop header navigation with dropdown | Already installed, use for Services dropdown in header |
| @radix-ui/react-dialog (Sheet) | 1.1.6 | Mobile hamburger menu overlay | Already installed, Sheet component wraps this |
| class-variance-authority | 0.7.1 | Component variant management | Already installed, use for button/card/badge variants |
| tailwind-merge | 3.0.1 | Safe Tailwind class merging | Already installed, via cn() utility |
| lucide-react | 0.475.0 | SVG icon library | Already installed, use for nav icons, social icons, UI elements |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Motion | CSS @keyframes only | CSS-only is lighter but lacks declarative mount/unmount, stagger, and gesture support |
| GSAP ScrollTrigger | Intersection Observer API | IO is native but requires manual timeline building; GSAP provides start/end pinning, scrub, and snap |
| Manual locale routing | mcamara/laravel-localization | Package has unclear Laravel 13 compatibility; manual approach is ~50 lines and fully controlled |
| View Transitions API | Motion AnimatePresence | AnimatePresence requires wrapping app entry point and managing keys; View Transitions is native and Inertia v3 supports it directly |
| Fontsource (self-hosted) | Google Fonts CDN | CDN adds external dependency and CORS headers; self-hosted bundles with Vite for zero network overhead |

**Installation:**
```bash
npm install motion gsap @gsap/react @fontsource-variable/cairo @fontsource-variable/instrument-sans
```

**Version verification:** Versions confirmed via `npm view` on 2026-03-28.

## Architecture Patterns

### Recommended Project Structure
```
resources/js/
├── components/
│   ├── ui/                    # Existing Radix UI primitives (button, card, etc.)
│   ├── site-header.tsx        # Public site sticky header with nav
│   ├── site-footer.tsx        # Public site 4-column footer
│   ├── language-switcher.tsx  # EN/AR toggle preserving current page
│   ├── theme-toggle.tsx       # Dark/light mode toggle button
│   └── scroll-reveal.tsx      # Reusable Motion scroll reveal wrapper
├── layouts/
│   ├── public-layout.tsx      # New: Header + Footer + breadcrumbs for public pages
│   ├── app-layout.tsx         # Existing: Admin sidebar layout (untouched)
│   ├── auth-layout.tsx        # Existing: Auth card layout (untouched)
│   └── settings/layout.tsx    # Existing: Settings nested layout (untouched)
├── hooks/
│   ├── use-appearance.tsx     # Existing: Dark/light mode (extend, don't replace)
│   ├── use-locale.tsx         # New: Current locale, direction, translation helper
│   ├── use-scroll-header.tsx  # New: Scroll position for header transparency transition
│   └── use-reduced-motion.tsx # New: prefers-reduced-motion detection (wraps Motion)
├── lib/
│   ├── utils.ts               # Existing: cn() utility
│   ├── i18n.ts                # New: Translation loading, t() function
│   └── animations.ts          # New: Shared animation variants (fadeInUp, stagger, etc.)
├── types/
│   └── index.ts               # Extend with locale types (Locale, Direction)
└── pages/
    └── errors/
        └── 404.tsx            # New: Branded 404 error page

app/Http/
├── Middleware/
│   ├── SetLocale.php          # New: Extract locale from URL prefix, set app locale
│   └── HandleInertiaRequests.php  # Extend: Share locale, direction to frontend
├── Controllers/
│   └── LocaleController.php   # New: Handle root / redirect to /en/ or /ar/

routes/
├── web.php                    # Modify: Wrap public routes in locale prefix group
└── settings.php               # Untouched (admin routes, no locale prefix)

resources/
├── css/
│   └── app.css                # Modify: Replace neutral tokens with teal brand, add Arabic font
└── lang/
    ├── en.json                # New: English UI translations
    └── ar.json                # New: Arabic UI translations
```

### Pattern 1: Locale Route Group with Middleware
**What:** All public routes wrapped in a `{locale}` prefix group with a `SetLocale` middleware that calls `app()->setLocale()` and `URL::defaults(['locale' => $locale])`
**When to use:** Every public-facing route (landing, services, portfolio, blog, about, contact)
**Example:**
```php
// routes/web.php
Route::redirect('/', '/en');

Route::prefix('{locale}')
    ->where(['locale' => 'en|ar'])
    ->middleware(SetLocale::class)
    ->group(function () {
        Route::inertia('/', 'home')->name('home');
        Route::inertia('/about', 'about')->name('about');
        // ... all public routes
    });

// Admin/auth routes remain WITHOUT locale prefix
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});
```

### Pattern 2: Inertia Shared Data for Locale
**What:** HandleInertiaRequests shares locale information to every React page
**When to use:** Always -- every component needs to know locale and direction
**Example:**
```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    $locale = app()->getLocale();
    return [
        ...parent::share($request),
        'locale' => $locale,
        'direction' => $locale === 'ar' ? 'rtl' : 'ltr',
        'translations' => fn () => $this->loadTranslations($locale),
    ];
}
```

### Pattern 3: Blade Template with Dynamic dir Attribute
**What:** The root Blade template sets both `lang` and `dir` attributes on `<html>`
**When to use:** Required for CSS logical properties and screen readers
**Example:**
```blade
<html
    lang="{{ app()->getLocale() }}"
    dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}"
    @class(['dark' => ($appearance ?? 'system') == 'dark'])
>
```

### Pattern 4: View Transitions for Page Crossfade
**What:** Inertia v3's native View Transitions API for cross-fade between pages
**When to use:** All page navigation (globally enabled)
**Example:**
```tsx
// resources/js/app.tsx
createInertiaApp({
    // ... existing config
    defaults: {
        visitOptions: (_href, _options) => {
            return { viewTransition: true };
        },
    },
});
```

### Pattern 5: Motion Scroll Reveal Component
**What:** Reusable wrapper component for scroll-triggered fade-in animations
**When to use:** Sections on landing page, service pages, any content that should animate on scroll
**Example:**
```tsx
// resources/js/components/scroll-reveal.tsx
import { motion, useReducedMotion } from 'motion/react';

type Props = {
    children: React.ReactNode;
    delay?: number;
    className?: string;
};

export function ScrollReveal({ children, delay = 0, className }: Props) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
```

### Pattern 6: GSAP useGSAP with ScrollTrigger Cleanup
**What:** GSAP animations with proper React cleanup via useGSAP hook
**When to use:** Complex scroll-driven sequences (timelines, pinning, scrub)
**Example:**
```tsx
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function AnimatedSection() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from('.stat-number', {
            textContent: 0,
            duration: 1.5,
            snap: { textContent: 1 },
            scrollTrigger: {
                trigger: container.current,
                start: 'top 80%',
                once: true,
            },
        });
    }, { scope: container });

    return <div ref={container}>...</div>;
}
```

### Pattern 7: Public Layout Composition
**What:** A new PublicLayout wrapping all public pages with header, footer, and breadcrumbs
**When to use:** All public-facing pages (not admin, not auth)
**Example:**
```tsx
// resources/js/layouts/public-layout.tsx
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';

export default function PublicLayout({ children, breadcrumbs = [] }: PublicLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
            <main className="flex-1">{children}</main>
            <SiteFooter />
        </div>
    );
}
```

Wire into `app.tsx` layout resolver:
```tsx
layout: (name) => {
    switch (true) {
        case name.startsWith('public/'):
            return PublicLayout;
        case name.startsWith('auth/'):
            return AuthLayout;
        case name.startsWith('settings/'):
            return [AppLayout, SettingsLayout];
        default:
            return AppLayout;
    }
},
```

### Anti-Patterns to Avoid
- **Hardcoded `left`/`right` in CSS:** Use `start`/`end` logical properties instead. The existing Sheet component and some Radix UI components use `left-0`, `right-0` etc. -- these need RTL-aware overrides or replacements with `inset-inline-start-0` / `start-0`.
- **Translation strings in component code:** Never hardcode English or Arabic text in JSX. Always use a `t()` translation function that reads from JSON files.
- **Separate animation libraries per component:** Don't mix Motion and GSAP in the same component for the same effect. Use Motion for declarative React animations and GSAP for scroll-timeline sequences.
- **Font loading via CDN link tags:** The existing `fonts.bunny.net` link in the Blade template and `welcome.tsx` should be replaced with self-hosted Fontsource imports bundled via Vite.
- **Using `ml-*`/`mr-*`/`pl-*`/`pr-*` for directional spacing:** Always use `ms-*`/`me-*`/`ps-*`/`pe-*` logical equivalents in all new code.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll reveal animations | Custom IntersectionObserver + CSS keyframes | Motion `whileInView` with viewport options | Handles mount/unmount, stagger, reduced-motion, SSR |
| Page transitions | Custom DOM manipulation + CSS | Inertia v3 View Transitions API (`viewTransition: true`) | Native browser API, graceful degradation, zero JS overhead |
| Dark/light mode toggle | New implementation from scratch | Extend existing `useAppearance` hook | Already handles localStorage, cookies, system preference, SSR flash prevention |
| RTL layout flipping | Custom CSS with direction-specific rules | Tailwind v4 logical properties (ms-*, ps-*, start-*, border-s-*, rounded-s-*) | Automatic LTR/RTL based on `dir` attribute, no duplication |
| Variable font subsetting | Manual @font-face with unicode-range | @fontsource-variable/cairo package | Pre-built subsets (arabic, latin, latin-ext), tree-shakeable imports |
| GSAP cleanup in React | Manual gsap.context() + useEffect | @gsap/react useGSAP() hook | Handles React 18 strict mode double-mounting, auto-revert on unmount |
| Navigation menu with dropdown | Custom dropdown from scratch | Radix UI NavigationMenu (already installed) | Accessible, keyboard nav, focus management, animation built-in |
| Mobile slide-out menu | Custom overlay + transition | Radix UI Dialog via Sheet component (already installed) | Focus trap, scroll lock, portal rendering, accessible |

**Key insight:** The existing codebase already has most UI primitives installed (Radix UI, CVA, Tailwind Merge). The work is extending and theming them, not building from scratch.

## Common Pitfalls

### Pitfall 1: RTL Breadcrumb Separator Direction
**What goes wrong:** ChevronRight separator in breadcrumbs points wrong direction in RTL
**Why it happens:** The existing Breadcrumb component uses `<ChevronRight />` as separator, which is visually incorrect in RTL
**How to avoid:** Use CSS `transform: scaleX(-1)` when `dir="rtl"`, or conditionally render ChevronLeft for Arabic, or use a CSS logical property approach with `rotate`
**Warning signs:** Breadcrumb arrows pointing left-to-right in Arabic layout

### Pitfall 2: Sheet/Mobile Menu Slide Direction in RTL
**What goes wrong:** Mobile menu slides in from the right in both LTR and RTL, but should slide from the left in RTL
**Why it happens:** Sheet component uses hardcoded `right-0` and `slide-in-from-right` classes
**How to avoid:** Use the `side` prop dynamically based on locale direction, or override with logical properties
**Warning signs:** Hamburger menu on left side of RTL header but drawer opens from right

### Pitfall 3: GSAP ScrollTrigger Not Refreshing After Inertia Page Load
**What goes wrong:** ScrollTrigger positions are calculated on first render, become stale after Inertia navigation
**Why it happens:** Inertia swaps page content without full page reload; ScrollTrigger's start/end positions were calculated for previous content
**How to avoid:** Call `ScrollTrigger.refresh()` after Inertia page transitions complete. Hook into Inertia's `router.on('navigate')` event or use `useEffect` in layout component
**Warning signs:** Scroll animations triggering at wrong positions after navigating between pages

### Pitfall 4: Flash of Unstyled/Wrong-Direction Content
**What goes wrong:** Page briefly renders in LTR before RTL styles apply, or shows light mode before dark mode applies
**Why it happens:** The `dir` attribute is set dynamically after hydration, not server-side
**How to avoid:** Set `dir` in Blade template (server-side) based on route locale, not in React. The existing `lang` attribute pattern in app.blade.php already does this for `lang` -- extend it for `dir`
**Warning signs:** Brief layout shift when loading Arabic pages

### Pitfall 5: View Transitions and Reduced Motion Conflict
**What goes wrong:** Page crossfade still plays for users who prefer reduced motion
**Why it happens:** View Transitions API doesn't automatically respect `prefers-reduced-motion`
**How to avoid:** Add CSS rule: `@media (prefers-reduced-motion: reduce) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; } }`
**Warning signs:** Accessibility audit failures for motion-sensitive users

### Pitfall 6: oklch Color Space Browser Fallbacks
**What goes wrong:** Colors don't render in older browsers
**Why it happens:** oklch is relatively new (supported in Chrome 111+, Safari 15.4+, Firefox 113+)
**How to avoid:** The existing codebase already uses oklch without fallbacks, which is acceptable given the Tailwind v4 requirement (which itself requires modern browsers). No action needed unless targeting very old browsers.
**Warning signs:** Only relevant if analytics show significant IE/old browser traffic

### Pitfall 7: Arabic Font Weight Mismatch
**What goes wrong:** Arabic text appears too thin or too bold compared to English
**Why it happens:** Cairo and Instrument Sans have different optical weights at the same numeric weight
**How to avoid:** Define separate font-weight tokens for Arabic if needed; test body text (400), semi-bold (600), and bold (700) side-by-side in both languages
**Warning signs:** Arabic body text looking heavier than English at same weight

### Pitfall 8: Wayfinder Route Helpers with Locale Prefix
**What goes wrong:** Generated route helpers (from @laravel/vite-plugin-wayfinder) don't include locale prefix
**Why it happens:** Wayfinder generates routes from PHP definitions; locale is a route parameter that needs to be passed explicitly
**How to avoid:** Pass locale parameter to Wayfinder-generated route functions, or create a wrapper that automatically injects current locale
**Warning signs:** Links missing /en/ or /ar/ prefix, 404 errors on navigation

## Code Examples

### Example 1: SetLocale Middleware
```php
// app/Http/Middleware/SetLocale.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->route('locale', 'en');
        $supported = ['en', 'ar'];

        if (!in_array($locale, $supported)) {
            abort(404);
        }

        app()->setLocale($locale);
        URL::defaults(['locale' => $locale]);

        return $next($request);
    }
}
```

### Example 2: Teal Brand Color Tokens (oklch)
```css
/* resources/css/app.css -- replace :root and .dark blocks */
:root {
    /* Backgrounds */
    --background: oklch(0.985 0 0);         /* Near white */
    --foreground: oklch(0.145 0.014 186);   /* Near black with slight teal tint */
    --card: oklch(0.97 0.005 180);          /* Subtle warm white */
    --card-foreground: oklch(0.145 0.014 186);

    /* Brand: Teal */
    --primary: oklch(0.704 0.14 182.503);   /* Teal-500: #14B8A6 */
    --primary-foreground: oklch(0.985 0 0);
    --accent: oklch(0.777 0.152 181.912);   /* Teal-400 */
    --accent-foreground: oklch(0.145 0.014 186);

    /* Ring/focus uses teal */
    --ring: oklch(0.704 0.14 182.503);

    /* Keep existing secondary, muted, destructive... */
}

.dark {
    /* Backgrounds */
    --background: oklch(0.13 0.01 240);     /* Deep navy-black */
    --foreground: oklch(0.95 0.01 180);     /* Light with teal hint */
    --card: oklch(0.17 0.015 230);          /* Slightly lighter navy */
    --card-foreground: oklch(0.95 0.01 180);

    /* Brand: Teal (slightly brighter in dark mode) */
    --primary: oklch(0.777 0.152 181.912);  /* Teal-400 for dark mode */
    --primary-foreground: oklch(0.13 0.01 240);
    --accent: oklch(0.704 0.14 182.503);    /* Teal-500 */
    --accent-foreground: oklch(0.95 0.01 180);

    --ring: oklch(0.777 0.152 181.912);
}
```

### Example 3: Font Setup in app.css
```css
/* resources/css/app.css -- @theme block */
@theme {
    --font-sans:
        'Instrument Sans Variable', ui-sans-serif, system-ui, sans-serif,
        'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
        'Noto Color Emoji';

    --font-arabic:
        'Cairo Variable', 'Instrument Sans Variable', ui-sans-serif, system-ui, sans-serif;
}

/* Arabic typography overrides */
[dir="rtl"] {
    font-family: var(--font-arabic);
}

[dir="rtl"] body {
    line-height: 1.7;        /* INTL-05: 1.6-1.8x */
    letter-spacing: 0;       /* INTL-05: no letter-spacing */
}
```

### Example 4: Font Import in app.tsx
```tsx
// resources/js/app.tsx
import '@fontsource-variable/instrument-sans';
import '@fontsource-variable/cairo';
```

### Example 5: Language Switcher Component
```tsx
// resources/js/components/language-switcher.tsx
import { Link, usePage } from '@inertiajs/react';

export function LanguageSwitcher() {
    const { url, props } = usePage();
    const currentLocale = props.locale as string;
    const targetLocale = currentLocale === 'en' ? 'ar' : 'en';

    // Replace locale prefix in current URL
    const targetUrl = url.replace(
        new RegExp(`^/${currentLocale}(/|$)`),
        `/${targetLocale}$1`
    );

    return (
        <Link
            href={targetUrl}
            className="text-sm font-medium"
        >
            {currentLocale === 'en' ? 'العربية' : 'English'}
        </Link>
    );
}
```

### Example 6: Reduced Motion CSS for View Transitions
```css
/* resources/css/app.css */
@media (prefers-reduced-motion: reduce) {
    ::view-transition-group(*),
    ::view-transition-old(*),
    ::view-transition-new(*) {
        animation: none !important;
    }
}
```

### Example 7: Sticky Header with Frosted Glass
```tsx
// resources/js/hooks/use-scroll-header.tsx
import { useState, useEffect } from 'react';

export function useScrollHeader(threshold = 50) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > threshold);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return isScrolled;
}

// Usage in SiteHeader:
// const isScrolled = useScrollHeader();
// className={cn(
//     'fixed top-0 inset-x-0 z-50 transition-all duration-300',
//     isScrolled
//         ? 'bg-background/80 backdrop-blur-lg border-b border-border/50'
//         : 'bg-transparent'
// )}
```

### Example 8: Animation Variants Library
```tsx
// resources/js/lib/animations.ts
import type { Variants } from 'motion/react';

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const defaultTransition = {
    duration: 0.4,
    ease: [0.25, 0.1, 0.25, 1] as const, // easeOutCubic
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package (import from `motion/react`) | 2025 | Same API, new package name. Both work, but new projects should use `motion` |
| GSAP paid plugins (ScrollTrigger, SplitText) | All GSAP plugins free | 2025 (Webflow acquisition) | No license concerns, install directly from npm |
| `ltr:`/`rtl:` Tailwind variants for RTL | CSS logical properties built into Tailwind v4 | 2024 (Tailwind v4) | Use `ms-*`/`me-*`/`ps-*`/`pe-*` instead of conditional `rtl:ml-*` |
| AnimatePresence wrapping for page transitions | View Transitions API in Inertia v3 | 2025 (Inertia v3) | Native browser API, no React wrapper overhead, graceful degradation |
| Google Fonts CDN `<link>` tag | Self-hosted via Fontsource + Vite | Ongoing trend | Eliminates external network dependency, better caching, subset control |
| HSL color space for design tokens | oklch color space | 2023-2024 | Perceptually uniform, better for generating consistent palettes |

**Deprecated/outdated:**
- `framer-motion` package name: Still works as a redirect but `motion` is the canonical package
- mcamara/laravel-localization: Has open compatibility issue with Laravel 13; avoid for this project
- Google Fonts CDN: Still functional but adds external dependency and CORS complexity

## Open Questions

1. **Wayfinder Route Helpers with Locale Parameter**
   - What we know: Wayfinder auto-generates TypeScript route helpers from PHP route definitions
   - What's unclear: Whether Wayfinder handles the `{locale}` prefix parameter automatically or needs manual injection
   - Recommendation: Test during implementation. If Wayfinder doesn't auto-inject, create a thin wrapper: `const localizedRoute = (route: string, params?: object) => route({ ...params, locale: currentLocale })`

2. **Translation File Loading Strategy**
   - What we know: Laravel has native JSON translation files (`lang/en.json`, `lang/ar.json`) and Inertia can share them via middleware
   - What's unclear: For a site with potentially hundreds of translations, whether to load all translations upfront or lazy-load per page
   - Recommendation: Start with full-load via Inertia shared data (simpler). If performance becomes an issue, switch to page-specific translation loading

3. **Cairo Font File Size with Full Arabic Subset**
   - What we know: Variable font with arabic+latin subsets. STATE.md flags this as a concern (200-500KB)
   - What's unclear: Exact file size of the arabic subset in woff2 variable format
   - Recommendation: Install @fontsource-variable/cairo and measure. Variable fonts are typically smaller than loading multiple static weights. Preload the woff2 file for the arabic subset when `dir="rtl"`

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build tooling, Vite | Yes | v20.19.5 | -- |
| npm | Package management | Yes | 10.8.2 | -- |
| PHP | Laravel backend | Yes | 8.3.27 | -- |
| Composer | PHP dependencies | Yes | (installed) | -- |

No missing dependencies. All required runtimes are available.

## Project Constraints (from CLAUDE.md)

The following directives from CLAUDE.md must be respected during planning:

- **Tech stack locked:** Laravel 12+ (currently 13.0) + Inertia.js 3 + React 19 + Tailwind CSS 4 -- no alternative frameworks
- **Bilingual requirement:** All user-facing content must work in both English (LTR) and Arabic (RTL)
- **Animation integration:** Must integrate cleanly with React + Inertia page transitions
- **SEO:** Server-side rendering via Inertia for search engine visibility (affects how locale/dir is set)
- **Naming conventions:** React components PascalCase, hooks `use-` prefix kebab-case, utilities camelCase
- **Import paths:** Always use `@/*` alias, never relative imports
- **Code style:** 4-space indent, single quotes, always semicolons, 80-char print width
- **Default exports** for components, **named exports** for hooks and utilities
- **`data-slot` attributes** on UI components (existing Radix pattern)
- **GSD Workflow:** Must use GSD commands for file changes -- planner should structure tasks accordingly

## Sources

### Primary (HIGH confidence)
- npm registry -- verified versions for motion (12.38.0), gsap (3.14.2), @gsap/react (2.1.2), @fontsource-variable/cairo (5.2.7), @fontsource-variable/instrument-sans (5.2.8)
- [Inertia.js v3 View Transitions docs](https://inertiajs.com/docs/v3/the-basics/view-transitions) -- global viewTransition config, CSS customization, browser support
- [GSAP React docs](https://gsap.com/resources/React/) -- useGSAP hook, contextSafe, cleanup patterns
- [Tailwind CSS v4 docs](https://tailwindcss.com/docs/padding) -- logical properties (ms-*, me-*, ps-*, pe-*, start-*, end-*)
- [Tailwind CSS Colors](https://tailwindcss.com/docs/colors) -- oklch values for teal-400 through teal-700
- [Motion docs](https://motion.dev/docs/react) -- AnimatePresence, whileInView, useReducedMotion
- [Fontsource Cairo install](https://fontsource.org/fonts/cairo/install) -- variable font import, subsets, axes
- Existing codebase inspection -- app.css, app.tsx, use-appearance.tsx, Blade template, package.json, components.json

### Secondary (MEDIUM confidence)
- [Can I Use - View Transitions](https://caniuse.com/view-transitions) -- Chrome 111+, Safari 18+, Firefox 133+ for same-document transitions
- [Laravel Daily - Multi-Language Routes](https://laraveldaily.com/post/multi-language-routes-and-locales-with-auth) -- manual locale routing pattern
- [christalks.dev - Locale Middleware](https://christalks.dev/post/setting-up-locale-based-routing-in-laravel-with-middleware-a278d43a) -- SetLocale middleware implementation

### Tertiary (LOW confidence)
- mcamara/laravel-localization Laravel 13 compatibility -- open GitHub issue, status unclear. Decision: avoid package, use manual routing.
- codezero/laravel-localized-routes -- original maintainer passed away, fork (opgginc) has unclear Laravel 13 support. Decision: avoid.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages verified via npm registry, APIs confirmed via official docs
- Architecture: HIGH -- patterns derived from official Inertia v3, Tailwind v4, and GSAP docs; validated against existing codebase structure
- Pitfalls: HIGH -- drawn from official docs (GSAP cleanup, View Transitions reduced motion) and codebase audit (RTL hardcoded classes, breadcrumb separators)
- Locale routing: MEDIUM -- manual implementation well-documented but Wayfinder integration with locale prefix untested

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable technologies, 30-day window)
