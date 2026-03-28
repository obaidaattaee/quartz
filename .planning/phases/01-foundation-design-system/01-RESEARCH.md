# Phase 1: Foundation & Design System - Research

**Researched:** 2026-03-28
**Domain:** Bilingual (EN/AR) routing, RTL layout, design tokens, animation system, shared layout components
**Confidence:** HIGH

## Summary

Phase 1 establishes the infrastructure every subsequent phase depends on: locale-aware URL routing (`/en/`, `/ar/`), full RTL layout support using CSS logical properties, a teal/dark premium design token system, animation primitives (Motion for page transitions and component animation, GSAP for scroll-triggered reveals), and shared layout components (sticky header, footer, breadcrumbs, 404 page).

The existing codebase provides a strong foundation: Radix UI primitives (button, card, input, badge, breadcrumb, navigation-menu, sheet) are already installed and use the shadcn/ui "new-york" style with CSS custom properties in oklch. The `useAppearance` hook already handles dark/light mode with localStorage + cookie persistence. Tailwind CSS v4 ships with native logical property utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`, `float-start`, `float-end`, `inset-s-*`, `inset-e-*`), making RTL support straightforward without plugins.

**Primary recommendation:** Use Tailwind CSS v4 logical properties for all spacing/positioning (no RTL plugins needed), `laravel-react-i18n` for translation bridge, Motion 12 for page transitions and component animation, GSAP 3.14 + ScrollTrigger for scroll-reveal animations, and Inertia v3's built-in View Transitions API for the crossfade page transitions.

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
| INTL-01 | URL-based language routing with /en/ and /ar/ prefixes on all public routes | Laravel route prefix group with `{locale}` parameter + LocaleMiddleware, validated locale constraint |
| INTL-02 | Full RTL layout for Arabic using CSS logical properties (start/end, not left/right) | Tailwind CSS v4 native logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`), `dir="rtl"` on HTML element |
| INTL-03 | Language switcher in header that preserves current page when switching | Inertia Link component with same path but swapped locale prefix, shared locale prop from middleware |
| INTL-04 | Bidirectional text handling for mixed EN/AR content (brand names, technical terms) | CSS `unicode-bidi: isolate` and `dir="ltr"` on inline elements containing LTR content within RTL context |
| INTL-05 | Arabic typography system with proper fonts, line-height (1.6-1.8x), and no letter-spacing | Cairo variable font via Fontsource, CSS custom properties for Arabic-specific typography, Tailwind theme extension |
| INTL-06 | All translatable content stored with bilingual fields (EN + AR) | `laravel-react-i18n` package bridging Laravel lang files to React, JSON translation files |
| DSGN-01 | Premium color palette with primary/secondary colors, applied via CSS custom properties | Replace existing oklch neutral palette with teal/emerald brand colors in `app.css` `:root` and `.dark` |
| DSGN-02 | Dark/light mode toggle with smooth transition and localStorage persistence | Existing `useAppearance` hook already handles this; enhance with transition CSS for smooth color swap |
| DSGN-03 | Responsive layout system tested at all breakpoints (mobile, tablet, desktop) | Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`), existing breakpoint system |
| DSGN-04 | Consistent component library with hover micro-interactions | Existing Radix UI components re-themed with brand colors; add hover transforms/glow via Tailwind classes |
| DSGN-05 | Animation system using Motion + GSAP for scroll reveals, staggered entrances, and hover effects | Motion 12 for component animation, GSAP 3.14 + ScrollTrigger for scroll-triggered reveals with `useGSAP` hook |
| DSGN-06 | Smooth page transitions between routes (Inertia + View Transitions / AnimatePresence) | Inertia v3 native View Transitions API with `viewTransition: true` global config for crossfade |
| DSGN-07 | prefers-reduced-motion support -- disable animations for users who opt out | Motion `MotionConfig reducedMotion="user"`, GSAP `gsap.matchMedia()` with `(prefers-reduced-motion: reduce)` |
| DSGN-08 | Sticky header navigation with 4-6 items and mobile hamburger menu | New `PublicLayout` with `SiteHeader` using Radix NavigationMenu for desktop, Sheet for mobile drawer |
| NAV-01 | Footer with sitemap links, contact info, social links, and legal | `SiteFooter` component with 4-column responsive grid matching D-11 |
| NAV-02 | Breadcrumbs on inner pages (services, blog, portfolio) | Existing Breadcrumb component from Radix UI, wired into PublicLayout via Inertia shared props |
| NAV-03 | Custom branded 404 error page with navigation back to key pages | Laravel fallback route rendering Inertia 404 page component with brand styling and nav links |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Tech stack locked:** Laravel 12 + Inertia.js 3 + React 19 + Tailwind CSS 4 -- no alternative frameworks
- **Bilingual first-class:** All user-facing content in both EN and AR
- **Animation library:** Must integrate with React + Inertia page transitions
- **Naming:** React components PascalCase, hooks kebab-case with `use-` prefix, utilities camelCase
- **Imports:** Always use `@/*` path alias, never relative imports
- **Code style:** Prettier (4-space, single quotes, semicolons), ESLint with strict TypeScript
- **Module design:** Default exports for components, named exports for utilities/hooks
- **Type imports:** Separated with `import type`
- **Print width:** 80 characters
- **Testing attributes:** `data-test="kebab-case-name"` on critical elements

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | 12.38.0 | Component animation, page transitions, hover effects | Industry standard React animation library, native React 19 support, AnimatePresence for exit animations |
| gsap | 3.14.2 | Scroll-triggered animations, timeline sequences | Most capable scroll animation library, now 100% free (Webflow acquisition), ScrollTrigger plugin |
| @gsap/react | 2.1.2 | React integration for GSAP | Official useGSAP hook with automatic cleanup, scoped selectors, SSR-safe |
| laravel-react-i18n | 2.0.5 | Laravel translation files to React bridge | Purpose-built for Laravel+React, uses Laravel's lang files directly, provides t() and tChoice() |
| @fontsource-variable/cairo | 5.2.7 | Self-hosted Cairo Arabic variable font | Self-hosted for performance, variable font for flexible weights (200-1000), includes arabic subset |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @fontsource-variable/instrument-sans | 5.2.8 | Self-hosted Instrument Sans English font | Replace Google Fonts CDN link for consistent self-hosted approach |
| tailwindcss (v4) | 4.0.0 | Already installed -- provides native logical property utilities | RTL support via ms-*/me-*/ps-*/pe-*/text-start/text-end |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| laravel-react-i18n | react-i18next | More features but doesn't natively read Laravel lang files; extra translation sync step needed |
| Inertia View Transitions API | Motion AnimatePresence for page transitions | AnimatePresence has known issue with Inertia (component removed from DOM before exit animation); View Transitions API is native, zero-config crossfade |
| GSAP ScrollTrigger | Motion scroll-linked animations | Motion's scroll animations are simpler but less capable for complex scroll triggers, timelines, stagger |
| @fontsource-variable/cairo | Google Fonts CDN | CDN adds external dependency, FOIT risk, privacy concerns; self-hosted bundles with app |

**Installation:**
```bash
npm install motion gsap @gsap/react laravel-react-i18n @fontsource-variable/cairo @fontsource-variable/instrument-sans
```

**Version verification:** All versions confirmed via `npm view [package] version` on 2026-03-28.

## Architecture Patterns

### Recommended Project Structure (new files for Phase 1)
```
resources/js/
  layouts/
    public/
      public-layout.tsx         # New public site layout (header + footer + breadcrumbs)
  components/
    site/
      site-header.tsx           # Sticky header with nav, language switcher, theme toggle
      site-footer.tsx           # 4-column footer
      language-switcher.tsx     # EN/AR toggle preserving current page
      mobile-nav.tsx            # Mobile hamburger menu using Sheet
      scroll-reveal.tsx         # Reusable scroll-reveal animation wrapper
      page-transition.tsx       # View transition configuration wrapper (if needed)
  hooks/
    use-locale.ts               # Access current locale, direction, available locales
    use-scroll-reveal.ts        # GSAP ScrollTrigger hook for scroll animations
    use-reduced-motion.ts       # Detects prefers-reduced-motion preference
  pages/
    [locale]/                   # Public pages under locale prefix (or flat with locale prop)
      index.tsx                 # Placeholder home page for Phase 1
    errors/
      404.tsx                   # Branded 404 page
  lib/
    i18n.ts                     # i18n configuration and helpers
    animation.ts                # Animation constants (durations, easings, variants)
app/
  Http/
    Middleware/
      SetLocale.php             # Locale detection and app locale setting
    Controllers/
      PageController.php        # Public page controller (or individual controllers later)
routes/
  web.php                       # Updated with locale prefix group
lang/
  en.json                       # English translations
  ar.json                       # Arabic translations
resources/css/
  app.css                       # Updated with brand color tokens, Arabic font-face
```

### Pattern 1: Locale Routing with Middleware
**What:** All public routes wrapped in `Route::prefix('{locale}')` group with SetLocale middleware
**When to use:** Every public-facing route
**Example:**
```php
// routes/web.php
Route::prefix('{locale}')
    ->where(['locale' => 'en|ar'])
    ->middleware(App\Http\Middleware\SetLocale::class)
    ->group(function () {
        Route::inertia('/', 'public/home')->name('home');
        Route::inertia('/about', 'public/about')->name('about');
        // ... all public routes
    });

// Root redirect
Route::get('/', function () {
    return redirect('/en');
});
```

```php
// app/Http/Middleware/SetLocale.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\URL;

class SetLocale
{
    public function handle(Request $request, Closure $next): mixed
    {
        $locale = $request->route('locale', 'en');

        if (!in_array($locale, ['en', 'ar'])) {
            abort(404);
        }

        App::setLocale($locale);
        URL::defaults(['locale' => $locale]);

        return $next($request);
    }
}
```

### Pattern 2: Sharing Locale Data via Inertia
**What:** Locale, direction, and translations shared to all frontend pages via HandleInertiaRequests middleware
**When to use:** Global -- every page render
**Example:**
```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'name' => config('app.name'),
        'locale' => app()->getLocale(),
        'direction' => app()->getLocale() === 'ar' ? 'rtl' : 'ltr',
        'auth' => [
            'user' => $request->user(),
        ],
    ];
}
```

### Pattern 3: HTML Dir Attribute and Font Switching
**What:** Set `dir` and `lang` attributes on `<html>` element based on locale, load appropriate font
**When to use:** Every page render
**Example:**
```blade
{{-- resources/views/app.blade.php --}}
<html
    lang="{{ app()->getLocale() }}"
    dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}"
    @class(['dark' => ($appearance ?? 'system') == 'dark'])
>
```

### Pattern 4: Public Layout with Sticky Header
**What:** New PublicLayout separate from existing AppLayout (admin sidebar layout)
**When to use:** All public-facing pages
**Example:**
```tsx
// resources/js/layouts/public/public-layout.tsx
import type { BreadcrumbItem } from '@/types';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';

type Props = {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export default function PublicLayout({ children, breadcrumbs }: Props) {
    return (
        <div className="min-h-screen flex flex-col">
            <SiteHeader />
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumbs items={breadcrumbs} />
            )}
            <main className="flex-1">{children}</main>
            <SiteFooter />
        </div>
    );
}
```

### Pattern 5: Inertia View Transitions (Crossfade)
**What:** Enable native View Transitions API globally for all page navigation
**When to use:** Configured once in `app.tsx`
**Example:**
```tsx
// resources/js/app.tsx
createInertiaApp({
    // ... existing config
    defaults: {
        visitOptions: () => ({
            viewTransition: true,
        }),
    },
});
```

```css
/* resources/css/app.css -- custom crossfade timing */
::view-transition-old(root),
::view-transition-new(root) {
    animation-duration: 0.3s;
}
```

### Pattern 6: Scroll Reveal with GSAP + useGSAP
**What:** Reusable scroll-reveal component using GSAP ScrollTrigger
**When to use:** Section entrances, card staggers, text reveals
**Example:**
```tsx
// resources/js/components/site/scroll-reveal.tsx
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

type Props = {
    children: React.ReactNode;
    className?: string;
    stagger?: number;
    delay?: number;
};

export function ScrollReveal({
    children,
    className,
    stagger = 0.1,
    delay = 0,
}: Props) {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const prefersReduced = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        if (prefersReduced) {
            return;
        }

        const elements = container.current?.children;

        if (!elements) {
            return;
        }

        gsap.from(elements, {
            y: 20,
            opacity: 0,
            duration: 0.4,
            stagger,
            delay,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: container.current,
                start: 'top 80%',
                once: true,
            },
        });
    }, { scope: container });

    return (
        <div ref={container} className={className}>
            {children}
        </div>
    );
}
```

### Pattern 7: Design Tokens as CSS Custom Properties
**What:** Brand colors defined as CSS custom properties in oklch, consumed by Tailwind
**When to use:** All color references throughout the app
**Example:**
```css
/* Quart brand colors -- teal/emerald accent on dark premium base */
:root {
    --background: oklch(0.985 0 0);         /* near-white */
    --foreground: oklch(0.145 0 0);         /* near-black */
    --primary: oklch(0.697 0.149 180.8);    /* teal #14B8A6 */
    --primary-foreground: oklch(1 0 0);     /* white on teal */
    --accent: oklch(0.648 0.141 181.5);     /* deeper teal #0D9488 */
    /* ... remaining tokens */
}

.dark {
    --background: oklch(0.145 0.014 254);   /* deep navy/near-black */
    --foreground: oklch(0.95 0 0);          /* light gray text */
    --primary: oklch(0.697 0.149 180.8);    /* teal stays same */
    --primary-foreground: oklch(0.145 0 0); /* dark text on teal */
    /* ... remaining tokens */
}
```

### Pattern 8: Reduced Motion Global Strategy
**What:** Dual approach -- Motion's MotionConfig for component animations, GSAP matchMedia for scroll animations
**When to use:** Wrap app root in MotionConfig, check in every GSAP useGSAP callback
**Example:**
```tsx
// In app.tsx or PublicLayout
import { MotionConfig } from 'motion/react';

<MotionConfig reducedMotion="user">
    {children}
</MotionConfig>
```

### Anti-Patterns to Avoid
- **Using `left/right` instead of `start/end`:** All spacing, positioning, and alignment must use logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`). Never use `ml-*`, `mr-*`, `pl-*`, `pr-*` for any content that must flip in RTL.
- **Using AnimatePresence for Inertia page transitions:** Inertia removes components from the DOM immediately on navigation, causing exit animations to never render. Use Inertia's native View Transitions API instead.
- **Importing GSAP ScrollTrigger in SSR context:** ScrollTrigger requires the DOM. Guard with `typeof window !== 'undefined'` or use `useGSAP` which handles this automatically.
- **Hardcoding translation strings in components:** All user-visible text must go through the `t()` function from `laravel-react-i18n`, not inline strings.
- **Using `translateX` for RTL-aware motion:** CSS `transform: translateX()` does not flip in RTL. Use logical properties or negate the value based on direction for directional animations.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Translation system | Custom JSON loader + context provider | `laravel-react-i18n` | Reads Laravel lang files directly, handles pluralization, locale switching, SSR-compatible |
| Scroll reveal animations | Custom IntersectionObserver + CSS classes | GSAP ScrollTrigger + `useGSAP` | Handles cleanup automatically, supports stagger/timeline, `once` trigger, `matchMedia` for reduced motion |
| Page crossfade transitions | Custom AnimatePresence wrapper with DOM cloning | Inertia v3 View Transitions API | Native browser API, zero JS bundle cost, built into Inertia, graceful fallback |
| Dark/light mode toggle | New implementation | Existing `useAppearance` hook | Already handles localStorage + cookie persistence + system preference detection |
| RTL layout flipping | Custom direction-aware utility classes | Tailwind CSS v4 logical properties | Native in Tailwind v4, no plugin needed, `ms-*`/`me-*`/`ps-*`/`pe-*` auto-flip |
| Mobile navigation drawer | Custom animated panel | Radix Sheet component (already installed) | Handles focus trapping, portal rendering, animations, accessibility |
| Breadcrumbs | Custom breadcrumb component | Existing Radix Breadcrumb component | Already installed, accessible, composable |

**Key insight:** The existing codebase already has 80% of the UI primitives needed. The work is theming them with brand colors, adding the public layout shell, and wiring up the locale/animation infrastructure.

## Common Pitfalls

### Pitfall 1: translateX and RTL
**What goes wrong:** CSS `transform: translateX()` does not reverse in RTL mode. Scroll-reveal animations that slide from left appear to slide from the wrong direction in Arabic.
**Why it happens:** `transform` is a physical property with no logical equivalent in CSS.
**How to avoid:** Use only `translateY` for scroll reveals (as per D-04: fade-in + translate-y). For any horizontal motion, read the `dir` attribute or use a CSS custom property like `--dir-multiplier: 1` (LTR) / `-1` (RTL) and multiply.
**Warning signs:** Elements sliding off-screen in the wrong direction in Arabic mode.

### Pitfall 2: GSAP ScrollTrigger Not Refreshing After Inertia Navigation
**What goes wrong:** ScrollTrigger calculates positions on page load. After an Inertia page transition (which swaps components without full page reload), trigger positions become stale.
**Why it happens:** Inertia replaces the page component but doesn't fire a native page load event. ScrollTrigger's cached measurements become invalid.
**How to avoid:** Call `ScrollTrigger.refresh()` after Inertia page transitions complete, or use `useGSAP` with proper dependencies that recreate triggers on component mount. The `useGSAP` hook's automatic cleanup and recreation on mount handles this if each page component creates its own triggers.
**Warning signs:** Scroll animations firing at wrong scroll positions or not firing at all after navigating.

### Pitfall 3: Arabic Font Loading Delay (FOIT/FOUT)
**What goes wrong:** Cairo font file is large (variable font ~200-500KB for Arabic subset). Without preloading, text is invisible (FOIT) or flashes unstyled (FOUT).
**Why it happens:** Arabic Unicode ranges are large. Variable fonts include multiple weight axes.
**How to avoid:** Use Fontsource to self-host with subsetting. Only import the arabic + latin subsets. Use `font-display: swap` (Fontsource default). Preload the critical weight (400) for the current locale. Consider loading Cairo only when locale is `ar` to avoid penalizing English-only visitors.
**Warning signs:** Flash of unstyled text when switching to Arabic, layout shift as font loads.

### Pitfall 4: CSS Custom Property Transitions and Dark Mode
**What goes wrong:** Toggling dark mode causes jarring instant color changes instead of smooth transitions.
**Why it happens:** CSS custom properties are not animatable by default. Adding `.dark` class swaps all variables instantly.
**How to avoid:** Add `transition: background-color 0.3s, color 0.3s, border-color 0.3s` to body and key containers. This transitions the computed values even though the custom properties change instantly. The existing `useAppearance` hook toggles the `.dark` class -- add the transition CSS.
**Warning signs:** Hard color snap when toggling dark/light mode.

### Pitfall 5: View Transitions API Browser Support
**What goes wrong:** The View Transitions API is not supported in Firefox (as of early 2026) or older Safari versions.
**Why it happens:** The API is relatively new (Chrome 111+, Safari 18+).
**How to avoid:** Inertia's View Transitions implementation gracefully degrades -- navigation still works, just without the crossfade animation. This is acceptable per DSGN-06 requirements. No polyfill needed.
**Warning signs:** No transitions in Firefox -- this is expected behavior, not a bug.

### Pitfall 6: Logical Property Gaps in Tailwind CSS v4
**What goes wrong:** Some CSS properties lack logical equivalents in Tailwind: `border-radius` corners, `box-shadow` offsets, `background-position`.
**Why it happens:** CSS logical properties spec doesn't cover all physical properties yet.
**How to avoid:** For border-radius, use the standard `rounded-*` classes (they're symmetrical). For directional shadows or backgrounds, use RTL-specific overrides: `[dir="rtl"] &` or Tailwind's `rtl:` variant (if configured). For most layouts, logical properties cover 95%+ of cases.
**Warning signs:** Subtle visual asymmetries in Arabic mode on elements with directional styling.

### Pitfall 7: Header Transparent-to-Frosted Glass Contrast
**What goes wrong:** Text in the transparent header becomes unreadable when scrolling over light-colored content sections.
**Why it happens:** Transparent header with white text works on dark hero sections but fails on light backgrounds.
**How to avoid:** The frosted glass (backdrop-blur + bg-opacity) transition should activate early enough. Use `IntersectionObserver` on the hero section -- once the hero scrolls past, switch to frosted glass mode. Ensure the frosted glass has enough opacity to maintain contrast. Consider a text shadow or subtle dark overlay behind header text for the transparent state.
**Warning signs:** Header text invisible or hard to read on certain page sections.

## Code Examples

### Verified: Motion Page Component Animation
```tsx
// Source: https://motion.dev/docs/react-animation
import { motion } from 'motion/react';

// Fade-in entrance for a page section
export function HeroSection() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/* Hero content */}
        </motion.section>
    );
}
```

### Verified: GSAP useGSAP with ScrollTrigger
```tsx
// Source: https://gsap.com/resources/React/
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function AnimatedSection() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from('.card', {
            y: 20,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: container.current,
                start: 'top 80%',
                once: true,
            },
        });
    }, { scope: container });

    return (
        <div ref={container}>
            <div className="card">Card 1</div>
            <div className="card">Card 2</div>
            <div className="card">Card 3</div>
        </div>
    );
}
```

### Verified: GSAP matchMedia for Reduced Motion
```tsx
// Source: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal(containerRef: React.RefObject<HTMLElement>) {
    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add('(prefers-reduced-motion: no-preference)', () => {
            gsap.from(containerRef.current?.children ?? [], {
                y: 20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    once: true,
                },
            });
        });

        // No animation created for reduce-motion -- elements visible by default
    }, { scope: containerRef });
}
```

### Verified: laravel-react-i18n Setup
```tsx
// Source: https://github.com/EugeneMeles/laravel-react-i18n
// resources/js/app.tsx
import { LaravelReactI18nProvider } from 'laravel-react-i18n';

createInertiaApp({
    // ...
    withApp(app) {
        return (
            <LaravelReactI18nProvider
                locale={/* from shared props */}
                fallbackLocale="en"
                files={import.meta.glob('/lang/*.json')}
            >
                <TooltipProvider delayDuration={0}>
                    {app}
                </TooltipProvider>
            </LaravelReactI18nProvider>
        );
    },
});
```

```tsx
// Usage in a component
import { useLaravelReactI18n } from 'laravel-react-i18n';

export function ServiceCard() {
    const { t } = useLaravelReactI18n();

    return (
        <Card>
            <CardTitle>{t('services.development.title')}</CardTitle>
            <CardDescription>
                {t('services.development.description')}
            </CardDescription>
        </Card>
    );
}
```

### Verified: Fontsource Cairo Import
```tsx
// Source: https://fontsource.org/fonts/cairo/install
// resources/js/app.tsx (or a dedicated font-loader)
import '@fontsource-variable/cairo/index.css';
import '@fontsource-variable/instrument-sans/index.css';
```

```css
/* resources/css/app.css */
@theme {
    --font-sans: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
    --font-arabic: 'Cairo Variable', ui-sans-serif, system-ui, sans-serif;
}

/* Arabic-specific typography */
[dir="rtl"] {
    font-family: var(--font-arabic);
    line-height: 1.7;
    letter-spacing: 0;
}
```

### Verified: Inertia View Transitions Global Setup
```tsx
// Source: https://inertiajs.com/view-transitions
// resources/js/app.tsx
createInertiaApp({
    defaults: {
        visitOptions: () => ({
            viewTransition: true,
        }),
    },
    // ... rest of config
});
```

```css
/* Custom crossfade timing per D-05 */
::view-transition-old(root),
::view-transition-new(root) {
    animation-duration: 0.3s;
    animation-timing-function: ease-in-out;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package (import from `motion/react`) | 2025 | Same API, different import path. Use `motion` not `framer-motion` |
| GSAP paid Club plugins | All GSAP free (Webflow acquisition) | Late 2024 | ScrollTrigger, SplitText, all plugins free for commercial use |
| Tailwind RTL plugin (`tailwindcss-rtl`) | Tailwind v4 native logical properties | 2025 (v4 release) | No plugin needed. `ms-*`, `me-*`, `ps-*`, `pe-*` built in |
| Google Fonts CDN for Arabic fonts | Self-hosted via Fontsource with subsetting | Ongoing | Better performance, privacy, no external dependency |
| AnimatePresence for page transitions | View Transitions API (native browser) | 2024-2025 | Less JS, native browser optimization, Inertia v3 support built in |
| useEffect + gsap.context for GSAP cleanup | useGSAP hook (@gsap/react) | 2024 | Automatic cleanup, scoped selectors, SSR-safe |

**Deprecated/outdated:**
- `framer-motion` npm package: Renamed to `motion`. Still works but won't receive updates.
- `tailwindcss-rtl` / `tailwindcss-logical` plugins: Unnecessary with Tailwind CSS v4's native logical property support.
- `left/right` Tailwind utilities for bidirectional layouts: Use `start/end` equivalents instead.

## Open Questions

1. **laravel-react-i18n Vite Plugin Compatibility with Vite 8**
   - What we know: The package's Vite plugin was last published October 2024. The project uses Vite 8.0.
   - What's unclear: Whether the `laravel-react-i18n/vite` plugin works with Vite 8 without issues.
   - Recommendation: Test during initial setup. If the Vite plugin fails, fall back to manually loading JSON translation files via `import.meta.glob('/lang/*.json')` -- the provider accepts this directly.

2. **Inertia v3 `defaults` Config for View Transitions**
   - What we know: Inertia v2 docs show `defaults.visitOptions` for global view transition config. The v3 docs page redirects to v2 content with a "v3 is now default" banner.
   - What's unclear: Whether the `defaults` API is identical in v3 or has changed.
   - Recommendation: Check Inertia v3 changelog/migration guide during implementation. If `defaults` doesn't exist, apply `viewTransition: true` via the Inertia router event listener or per-Link props.

3. **Cairo Variable Font Bundle Size Impact**
   - What we know: Cairo variable font with Arabic subset is substantial. Fontsource splits into subsets.
   - What's unclear: Exact bundle size after subsetting with only arabic + latin subsets.
   - Recommendation: Measure after installation. If too large, consider loading Cairo font only when `locale === 'ar'` using dynamic imports.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| PHP | Laravel backend | Yes | 8.3.27 | -- |
| Node.js | Vite, npm packages | Yes | 20.19.5 | -- |
| npm | Package installation | Yes | 10.8.2 | -- |
| Composer | PHP dependencies | Yes | 2.8.6 | -- |

**Missing dependencies with no fallback:** None -- all required tools are available.

## Sources

### Primary (HIGH confidence)
- npm registry -- verified versions: motion@12.38.0 (2026-03-17), gsap@3.14.2 (2025-12-12), @gsap/react@2.1.2 (2025-01-15), laravel-react-i18n@2.0.5 (2024-10-01), @fontsource-variable/cairo@5.2.7 (2025-09-17)
- [Motion official docs](https://motion.dev/docs/react-animation) -- AnimatePresence, MotionConfig, useReducedMotion
- [GSAP official docs](https://gsap.com/resources/React/) -- useGSAP hook, ScrollTrigger, gsap.matchMedia()
- [Inertia.js View Transitions docs](https://inertiajs.com/view-transitions) -- viewTransition option, global defaults, CSS customization
- [Tailwind CSS v4 docs](https://tailwindcss.com/docs/padding) -- logical property utilities (ms-*, me-*, ps-*, pe-*)
- [Fontsource Cairo install docs](https://fontsource.org/fonts/cairo/install) -- variable font setup, subset options
- Existing codebase: `resources/css/app.css`, `resources/js/app.tsx`, `resources/js/hooks/use-appearance.tsx`, `components.json`

### Secondary (MEDIUM confidence)
- [laravel-react-i18n GitHub](https://github.com/EugeneMeles/laravel-react-i18n) -- Setup guide, Vite plugin, hooks API (last npm release October 2024)
- [GSAP community forum](https://gsap.com/community/forums/topic/36352-gsap-scrolltrigger-not-working-with-inertiajs-ssr/) -- SSR issues with ScrollTrigger + Inertia
- [christalks.dev](https://christalks.dev/post/setting-up-locale-based-routing-in-laravel-with-middleware-a278d43a) -- Laravel locale routing middleware pattern
- [CSS-Tricks logical properties](https://css-tricks.com/css-logical-properties-and-values/) -- RTL pitfalls with transform, border-radius, box-shadow
- [Webflow blog](https://webflow.com/blog/gsap-becomes-free) -- GSAP free license confirmation (Webflow acquisition late 2024)

### Tertiary (LOW confidence)
- [Motion AnimateView docs](https://motion.dev/docs/react-animate-view) -- Requires react@canary; NOT recommended for production use yet
- laravel-react-i18n Vite 8 compatibility -- not verified, may need fallback

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages verified on npm with current versions, official docs confirmed APIs
- Architecture: HIGH -- patterns derived from existing codebase conventions + official library docs
- Pitfalls: HIGH -- confirmed through official forums (GSAP+Inertia SSR), MDN (logical property gaps), codebase inspection (existing patterns)
- i18n integration: MEDIUM -- laravel-react-i18n is purpose-built but hasn't been updated in 17 months; Vite 8 compat unverified
- View Transitions API: MEDIUM -- Inertia v3 docs still reference v2 content for this feature; API likely stable but exact v3 config syntax needs runtime verification

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable ecosystem, major libraries recently updated)
