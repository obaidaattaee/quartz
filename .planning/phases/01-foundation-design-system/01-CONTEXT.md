# Phase 1: Foundation & Design System - Context

**Gathered:** 2026-03-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Locale routing (EN/AR with URL prefixes), full RTL support, design tokens and color system, animation primitives, dark/light mode, and shared layout components (header, footer, breadcrumbs, 404 page). This phase establishes the visual foundation and bilingual infrastructure that all subsequent phases build on.

</domain>

<decisions>
## Implementation Decisions

### Brand Colors & Visual Tone
- **D-01:** Dark premium visual tone — deep navy/near-black backgrounds, teal accent glows, white/light gray text. Think Linear, Vercel, Stripe aesthetic.
- **D-02:** Primary accent color is teal/emerald (#14B8A6 primary, #0D9488 deeper glow, teal-to-emerald gradient). Used for CTAs, links, focus rings, glow effects, accent borders.
- **D-03:** Both dark and light modes get equal design attention — neither is the "default." System preference decides initial mode. Both must feel equally polished.

### Animation Personality
- **D-04:** Scroll reveal animations are subtle — fade-in + translate-y(20px), duration 0.3-0.5s, stagger 0.1s between items. Scroll trigger fires once at 20% visible. Hero gets slightly bolder entrance, cards get gentle stagger, text gets simple fade-in.
- **D-05:** Page transitions use crossfade — opacity crossfade between pages (~0.3s total). Snappy, SPA-like feel. Excellent Inertia compatibility.
- **D-06:** prefers-reduced-motion must be respected — disable all animations for users who opt out (DSGN-07).

### Arabic Font & Typography
- **D-07:** Arabic font family is Cairo (Google Fonts). Contemporary, distinctive style with 200-1000 weight range (variable font available). Pairs with Instrument Sans for English.
- **D-08:** Arabic typography follows INTL-05 requirements: line-height 1.6-1.8x, no letter-spacing, proper Arabic rendering.

### Header Navigation & Site Structure
- **D-09:** Header has 4 nav items + CTA: Logo (acts as Home link) | Services (dropdown: Dev, Automation, QA, Cybersecurity) | Portfolio | Blog | About — plus "Contact Us" CTA button. Right side: language switcher + dark/light toggle.
- **D-10:** Header starts transparent over hero sections, transitions to frosted glass (backdrop-blur + bg-opacity) on scroll. Smooth 0.3s transition. Needs contrast handling for text over varied hero content.
- **D-11:** Footer uses 4-column grid layout: (1) Logo + tagline + newsletter capture, (2) Services links, (3) Quick links (Blog, Portfolio, About, FAQ), (4) Contact info + social icons. Bottom bar: copyright + Privacy + Terms.
- **D-12:** Breadcrumbs on all inner pages (services, blog, portfolio) per NAV-02.

### Claude's Discretion
- Glass-morphism and glow effect intensity — calibrate during implementation based on what looks best in context
- Hover micro-interactions on buttons and cards — choose appropriate approach (lift+glow, scale+shift, etc.)
- Arabic font loading strategy — pick best approach (subset+swap, preload, etc.) considering performance
- 404 page design and personality — branded, on-theme, with navigation back to key pages

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Internationalization
- `.planning/REQUIREMENTS.md` — INTL-01 through INTL-06: URL-based routing, RTL layout, language switcher, bidirectional text, Arabic typography, bilingual content storage

### Design System
- `.planning/REQUIREMENTS.md` — DSGN-01 through DSGN-08: Color palette, dark/light mode, responsive layout, component library, animation system, page transitions, reduced-motion, sticky header

### Navigation
- `.planning/REQUIREMENTS.md` — NAV-01 through NAV-03: Footer structure, breadcrumbs, 404 page

### Existing Codebase
- `resources/css/app.css` — Current theme variables (oklch colors, CSS custom properties) that need to be replaced with Quart brand colors
- `resources/js/hooks/use-appearance.tsx` — Existing dark/light mode toggle hook
- `resources/js/components/ui/` — Radix UI component primitives already installed (button, card, input, badge, breadcrumb, etc.)
- `resources/js/layouts/app-layout.tsx` — Current sidebar-based layout (admin); public site needs a new header-based layout

### Project Context
- `.planning/PROJECT.md` — Vision, constraints, and key decisions
- `.planning/ROADMAP.md` — Phase 1 success criteria and requirement mapping
- `.planning/STATE.md` — Known blockers: Arabic font subsetting investigation, GSAP ScrollTrigger.refresh() with Inertia

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Radix UI components (button, card, input, badge, breadcrumb, dialog, dropdown-menu, sheet, navigation-menu) — already installed, can be themed with Quart brand colors
- `useAppearance` hook — handles dark/light mode toggle with localStorage persistence
- `useMobile` hook — detects mobile viewport
- `cn()` utility in `resources/js/lib/utils` — Tailwind class merging with clsx
- Breadcrumb component exists in `resources/js/components/ui/breadcrumb.tsx`

### Established Patterns
- CSS custom properties via oklch in `app.css` — extend this for Quart brand tokens (teal primary, dark backgrounds)
- `.dark` class variant for dark mode — already configured in Tailwind
- Component composition with Radix UI primitives — follow same pattern for new components
- Path alias `@/*` maps to `resources/js/*` — use consistently

### Integration Points
- `resources/js/app.tsx` — entry point where page transitions (AnimatePresence/crossfade) should be wired
- `resources/css/app.css` — where brand color tokens and Arabic font-face declarations go
- `routes/web.php` — where locale prefix routing (/en/, /ar/) needs to be configured
- `app/Http/Middleware/HandleInertiaRequests.php` — where locale/direction data gets shared to frontend
- New public layout needed alongside existing AppLayout (admin) and AuthLayout

</code_context>

<specifics>
## Specific Ideas

- Dark premium aesthetic inspired by scotchpos.com — but with subtle, refined animations rather than heavy parallax
- Teal/emerald as accent color gives Quart a distinctive identity in the tech agency space
- Cairo font chosen for Arabic — has "personality" and distinctive character, works well for an agency brand
- Header transparent-to-frosted-glass transition matches the premium feel
- Both language modes (EN/AR) should feel equally premium — Arabic is not a "translated afterthought"

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-design-system*
*Context gathered: 2026-03-28*
