# Research Summary

**Project:** Quart — Professional Bilingual Services Website
**Synthesized:** 2026-03-28
**Overall Confidence:** HIGH

---

## Executive Summary

Quart is a professional tech-services marketing site (software development, automation, QA, cybersecurity) built on an already-configured Laravel 13 + Inertia.js 3 + React 19 + TypeScript + Tailwind CSS 4 stack. The architectural challenge is not the tech stack itself — that foundation is solid and modern — but rather the deep bilingual (EN/AR) requirement. Arabic RTL support is not a UI overlay; it is a foundational architectural concern that touches every layout component, every animation, every data model, and every SEO output. Research is unanimous: retrofitting RTL after the fact requires rewriting virtually every component. The single most important decision is to build every component with CSS logical properties (`ps-4`, `text-start`, `ms-4`) and a `useDirection()` hook from the very first line of code.

The recommended approach is a single Laravel monolith with three zones (public marketing site, admin CMS, auth) all served through Inertia. No separate API, no Filament, no separate SPA. The public site lives at `/{locale}/...` routes (URL-based i18n is the only SEO-correct approach), the admin at `/admin/...`. Content is stored in JSON translatable columns via `spatie/laravel-translatable`. Animations use Motion (formerly Framer Motion) for component-level interactions and `AnimatePresence` for page transitions, with GSAP + ScrollTrigger for scroll-pinned timeline sequences. Inertia v3's built-in View Transitions API handles the cross-page morph layer.

The key risks are: (1) RTL treated as an afterthought causing a component-level rewrite, (2) exit animations silently failing because `AnimatePresence` is placed inside rather than above the Inertia page swap point, (3) SSR not enabled from the start causing Arabic pages to be invisible to search engine crawlers, and (4) admin file uploads stored in PHP-executable directories creating an RCE vulnerability. All four are preventable if addressed in the correct phase order — and all four are catastrophic if discovered late.

---

## Key Findings

### From STACK.md

**Core stack (locked, already configured):**
- Laravel 13 + Inertia.js 3 + React 19 + TypeScript 5.7 + Tailwind CSS 4 + Vite 8
- Dark/light mode already fully implemented via CSS variables and `useAppearance()` hook
- `build:ssr` script already present in `package.json` — SSR groundwork is laid

**New libraries to add:**

| Library | Version | Purpose |
|---------|---------|---------|
| `motion` | 12.38.0 | Component animations, AnimatePresence, scroll reveals, page transitions |
| `gsap` + `@gsap/react` | 3.14.2 / 2.1.2 | Scroll-pinned timeline sequences, parallax, hero orchestration |
| `lenis` | 1.3.21 | Smooth momentum scrolling (add only if native scroll feels insufficient) |
| `react-i18next` + `i18next` | 16.6.6 | UI string translation with RTL direction detection via `i18n.dir()` |
| `@tiptap/react` + starter-kit + extensions | 3.20.5 | Headless rich text editor for blog/CMS, bilingual-aware |
| `spatie/laravel-medialibrary` | 11.21.0 | Image uploads with automatic WebP conversions and responsive images |
| `artesaos/seotools` | 1.3.2 | Server-side SEO meta, OG tags, JSON-LD structured data |
| `spatie/laravel-sitemap` | latest | Auto-generated XML sitemaps with hreflang support |
| `vite-plugin-laravel-i18next` | dev | Converts Laravel `/lang/*.php` files to i18next-compatible JSON at build time |

**Critical version note:** Inertia v3 View Transitions (`viewTransition: true`) are built-in — no separate library needed for page transitions.

**Arabic font recommendation:** IBM Plex Sans Arabic paired with the existing Instrument Sans. Load via `@font-face` and scope to `[dir="rtl"]` in CSS.

---

### From FEATURES.md

**Table stakes (must be present at launch):**
- Hero with clear value proposition + primary CTA above the fold
- 4 service detail pages (software dev, automation, QA, cybersecurity) with problem-solution framing
- Contact form with lead storage and admin email notification
- Sticky header, mobile-responsive layout, SSL/HTTPS
- Client testimonials, client logos, team section with real photos
- Per-page meta titles/descriptions, Open Graph tags, XML sitemap, JSON-LD structured data
- URL-based bilingual routing (`/en/`, `/ar/`) with full RTL layout for Arabic
- Language switcher (persistent, visible, preserves current page)

**Differentiators (set Quart apart):**
- Scroll-triggered reveal animations and hero motion graphics (scotchpos.com style)
- Smooth page transitions (Inertia View Transitions + AnimatePresence)
- Hover micro-interactions on all interactive elements
- Visual portfolio grid with service-category filtering
- Rich blog system with WYSIWYG editor, categories, author profiles, related posts
- Admin CMS with dashboard, bilingual content editing, media library, lead management
- Admin-configurable theme (logo, brand colors via CSS custom properties)
- Animated statistics/counter section, FAQ with accordion

**Anti-features (explicitly do not build):**
- User registration/visitor accounts
- Real-time chat or chatbot
- E-commerce or payment processing
- Client portal or project dashboard
- Full drag-and-drop page builder
- Autoplay video with sound
- Cookie consent banners in v1
- Infinite scroll on blog (use pagination for SEO)
- Multilingual auto-detection with forced redirect
- Social media feed embeds

**Defer to v2+:**
- Full case study pages (start with portfolio gallery)
- Complex search (add when blog exceeds 50+ posts)
- Newsletter integration with email service (capture emails in DB first)
- RSS feed (add when blog is active)

---

### From ARCHITECTURE.md

**Architecture:** Single Laravel monolith, three zones (public, admin, auth), all served via Inertia. No API layer.

**Key patterns:**

| Pattern | Decision |
|---------|----------|
| Locale routing | `Route::prefix('{locale}')` with `SetLocale` middleware. Every URL has `/en/` or `/ar/` prefix. |
| Content data model | `spatie/laravel-translatable` JSON columns on all content models. Single table, no joins needed. |
| Site settings | `spatie/laravel-settings` typed classes (SiteSettings, ContactSettings, SeoSettings). Shared to frontend via Inertia HandleInertiaRequests. |
| Media handling | `spatie/laravel-medialibrary` with media collections per model. WebP and thumbnail conversions auto-generated. |
| RTL support | Three layers: `<html dir="rtl">` on root Blade template, Tailwind logical properties (`ps-`, `pe-`, `ms-`, `me-`, `text-start`), `useDirection()` hook for animation/icon mirroring. |
| i18n translation | Two systems: Laravel `lang/en.json` + `lang/ar.json` for UI strings (passed via shared Inertia props), `spatie/laravel-translatable` for DB content. |
| Animation | Motion `AnimatePresence` in `PublicLayout` (keyed by URL, above Inertia page swap), reusable `<Reveal>` and `<StaggerContainer>` components, GSAP for scroll timelines. |
| Admin panel | Separate `/admin/...` route file + `AdminLayout`. Shares the Inertia stack. Role-based access via `EnsureRole` middleware. |
| Layout routing | Determined in `app.tsx` by page component name prefix (`public/`, `admin/`, `auth/`). |

**Core content models:** Service, Post (Blog), Category, Tag, PortfolioItem, Testimonial, Lead. All translatable models implement `HasTranslations` + `InteractsWithMedia`.

**Suggested build order from architecture research:** Foundation -> Public layout + core pages -> Admin panel -> Blog + portfolio -> Polish + SEO.

---

### From PITFALLS.md

**Critical pitfalls (cause rewrites if missed):**

| Pitfall | Risk | Prevention |
|---------|------|-----------|
| RTL as CSS flip | Every component needs individual fixes; Tailwind v4 physical properties do NOT auto-mirror on `dir="rtl"` | Use CSS logical properties (`ps-`, `pe-`, `text-start`) from the very first component. Never use `ml-`, `mr-`, `text-left`, `text-right`. |
| AnimatePresence placement | Exit animations silently never play; users see abrupt page swaps | Place `AnimatePresence` in `PublicLayout` ABOVE the Inertia page swap point, keyed by URL. Never place it inside a page component. |
| SSR + bilingual SEO gaps | Arabic pages invisible to crawlers; no hreflang = duplicate content penalty | Enable SSR from the start. Set `<html lang dir>` in Blade template. Inject hreflang middleware on every response. |
| Admin file upload RCE | Remote code execution via polyglot image uploads (multiple documented CVEs) | Store uploads outside webroot. Re-encode all images via Intervention Image. Reject SVGs or sanitize. Validate dimensions, not just MIME type. |

**Moderate pitfalls (significant rework if missed):**

| Pitfall | Risk | Prevention |
|---------|------|-----------|
| Heavy animations destroying Core Web Vitals | Lighthouse mobile score drops to 30-50; LCP and CLS penalties | Reserve space for animated elements; never hide the LCP element behind an animation; animate only `opacity` + `transform`. |
| Arabic typography rendering failures | Disconnected letters, clipped diacriticals, unreadable text | Arabic-specific `line-height` (1.6-1.8x), never apply `letter-spacing` to Arabic, proper Arabic font family, avoid `text-decoration: underline`. |
| Translation data model that doesn't scale | Cannot search by locale; no way to detect missing Arabic translations | Plan completeness checker in admin; use side-by-side EN/AR editing UI; defer full-text search to Laravel Scout + Meilisearch when needed. |
| Admin theme customization causing color contrast violations | Illegible text in certain admin-chosen color combinations | Constrain color picker to pre-tested palette or auto-derive WCAG-safe variants using oklch; store theme in cookie (not just localStorage) to prevent SSR flash. |
| Rich text editor RTL failures | Arabic blog posts appear left-aligned with broken paragraph flow | Set Tiptap `dir` based on current editing locale; use TextDirection extension; inject `dir` attributes into stored HTML. |

**Minor pitfalls:**
- Horizontal animations reversed in RTL — parameterize `x` values using `useDirection()`.
- Route duplication complexity — single `{locale}` prefix group with middleware validation.
- Font loading CLS on language switch — preload both fonts on every page.
- RBAC prop leaking — never pass unauthorized data to Inertia props; authorize in controllers, not React components.
- Inertia SSR Node.js memory leaks — use PM2 with memory limits; do not import animation libraries in SSR context.

---

## Implications for Roadmap

Based on the combined research, five phases emerge. The ordering is strictly dictated by hard dependencies.

### Suggested Phase Structure

**Phase 1: Foundation**
Rationale: Every subsequent phase depends on locale routing working correctly and RTL being baked into the layout system. Retrofitting either is a rewrite. Build all data models now even if their corresponding pages come later — this prevents migration drift.

Delivers:
- SetLocale middleware + `/{locale}/` route structure
- `<html lang dir>` set in Blade root template (SSR-ready)
- All content models and migrations (Service, Post, Category, Tag, PortfolioItem, Testimonial, Lead)
- SiteSettings / ContactSettings / SeoSettings classes
- HandleInertiaRequests updated with locale, direction, settings as shared props
- TypeScript SharedProps types
- `useDirection()` + `useTranslations()` hooks
- Arabic font loaded, RTL typography CSS rules in place
- Tailwind logical property convention enforced (lint rule or team agreement)
- i18n translation file structure (`lang/en.json`, `lang/ar.json`)

Pitfalls to avoid: RTL as afterthought (Pitfall 1), route duplication bugs (Pitfall 11), font CLS (Pitfall 12).

**Phase 2: Public Marketing Site**
Rationale: Validates that the data model works for public rendering before building 20 admin forms against it. Delivers the core business value (the site visitors actually see).

Delivers:
- PublicLayout with sticky navbar, footer, locale switcher, theme toggle
- AnimatePresence page transitions (above Inertia swap point, keyed by URL)
- `<Reveal>` and `<StaggerContainer>` animation primitives
- Home page: hero with motion graphics, service overview cards, testimonials, client logos, animated stats, CTA
- 4 Service detail pages with problem-solution framing and per-service CTA
- Contact page with form, lead storage, and email notification
- 404 page
- Basic SEO: Inertia `<Head>` with meta, OG tags, hreflang middleware, `lang/` sitemap
- Breadcrumbs on inner pages

Pitfalls to avoid: AnimatePresence placement (Pitfall 2), animations hurting Core Web Vitals (Pitfall 5), Arabic typography (Pitfall 6).

**Phase 3: Admin CMS**
Rationale: Content must be manageable before building blog and portfolio pages. Admin panel gates the ability to populate real content.

Delivers:
- AdminLayout (sidebar, breadcrumbs, extends existing AppLayout)
- Auth guard: `EnsureRole` middleware, admin/editor roles
- Dashboard with key metrics (recent leads, post count, portfolio count)
- Service content editing (structured fields, not free-form page builder)
- Testimonial management (CRUD, drag-to-reorder)
- Lead management (list view, status tracking)
- Site settings (logo upload, brand colors, contact info)
- Media library (Tiptap-integrated image upload, WebP conversions via medialibrary)
- TranslationTabs component for all bilingual content editing

Pitfalls to avoid: File upload RCE (Pitfall 4), RBAC prop leaking (Pitfall 13), admin theme color contrast (Pitfall 8).

**Phase 4: Blog and Portfolio**
Rationale: Depends on the admin panel being functional (editors need to create content before public pages have anything to render). Delivers content marketing infrastructure.

Delivers:
- Blog index with pagination (6-10 posts/page), categories, tag filtering
- Blog post detail with reading time, author profile, related posts, social sharing
- Tiptap rich text editor with RTL support, image upload, code blocks
- Blog SEO metadata per post (meta title, description, OG image)
- Portfolio gallery with service-category filtering
- RSS feed

Pitfalls to avoid: Rich text editor RTL (Pitfall 9), translation data model scalability (Pitfall 7).

**Phase 5: Polish, SEO, and Production Hardening**
Rationale: Layers onto working functionality. Performance optimization is most effective as a last pass when the full component tree is known.

Delivers:
- JSON-LD structured data (Organization, Service, Article schemas via artesaos/seotools)
- XML sitemaps with hreflang (`/en/sitemap.xml`, `/ar/sitemap.xml`)
- Hero motion graphics polish (GSAP scroll timeline, staggered entrance sequences)
- Hover micro-interactions on all cards and buttons
- FAQ section with accordion and FAQ schema
- Animated statistics counters
- Dark/light mode verification in both locales
- Admin-configurable theme (color picker with WCAG guardrails)
- SSR verification and performance audit (Lighthouse mobile target: 80+)
- PM2 process management for SSR Node.js process
- Image optimization pipeline verification (WebP, responsive srcsets, lazy loading)
- `prefers-reduced-motion` support across all animations

Pitfalls to avoid: SSR memory leaks (Pitfall 14), Core Web Vitals degradation (Pitfall 5), SSR SEO gaps (Pitfall 3).

---

### Research Flags

The following phases have well-documented patterns and should not need additional deep research during roadmap planning:

- **Phase 1 (Foundation):** Standard Laravel localization patterns. Highly documented. No research needed.
- **Phase 2 (Public Site):** Motion/GSAP integration patterns are well-established. Inertia AnimatePresence placement is documented in community guides.
- **Phase 3 (Admin CMS):** Standard Laravel CRUD + Inertia pattern. spatie packages have extensive docs.

The following phases may benefit from `/gsd:research-phase` during detailed planning:

- **Phase 4 (Blog/Portfolio):** Tiptap 3 RTL behavior has known open issues (GitHub #3957). Worth a targeted research spike on the specific TextDirection extension configuration before implementation.
- **Phase 5 (SEO/Polish):** SSR configuration specifics for Inertia v3 in production (PM2 integration, memory management under load) are less documented than development setup. A targeted spike before the SSR work would reduce risk.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Existing codebase is the foundation. New library selections are current stable versions verified on npm/Packagist as of 2026-03-28. |
| Features | HIGH | Sources include professional services website best practices, RTL design guides, and validated SEO research for 2026. Feature set is scoped and realistic. |
| Architecture | HIGH | Patterns verified against official Inertia v3 docs, Tailwind v4 docs, and the actual existing codebase (existing layout routing, useAppearance hook, build:ssr script). |
| Pitfalls | HIGH | Critical pitfalls are backed by documented CVEs (file upload RCE) and confirmed via Inertia GitHub issues and official docs. RTL pitfalls verified against multiple RTL design guides. |

**Overall confidence: HIGH**

### Gaps to Address

1. **Tiptap RTL in production** — GitHub issue #3957 indicates known RTL bugs in Tiptap. The TextDirection extension is the mitigation, but it needs hands-on validation before blog implementation begins.

2. **Arabic font subsetting** — Arabic fonts are 200-500KB. Which character ranges to subset for this specific use case (technical services content) is not covered in research and needs a brief investigation during Phase 1 typography work.

3. **GSAP + Lenis integration in Inertia context** — GSAP ScrollTrigger requires refresh calls on page navigation to recalculate scroll positions. The exact hook placement for `ScrollTrigger.refresh()` after Inertia page loads needs validation during Phase 2 animation work.

4. **`spatie/laravel-settings` vs database-driven settings** — The architecture recommends `spatie/laravel-settings` (PHP class-based typed settings). This needs to be validated against the project's requirement for admin-editable settings — the package stores in database but the interface is PHP classes, which may require extra migration work when adding new settings fields. Not a blocker, but worth confirming before Phase 3.

---

## Sources (Aggregated)

### STACK.md Sources
- [Motion (formerly Framer Motion) - Official Site](https://motion.dev/)
- [GSAP ScrollTrigger Documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP is now 100% free - Webflow Blog](https://webflow.com/blog/gsap-becomes-free)
- [Lenis - Smooth Scroll](https://www.lenis.dev/)
- [react-i18next Documentation](https://react.i18next.com/)
- [Tiptap Editor v3](https://tiptap.dev/tiptap-editor-v3)
- [Inertia.js v3 View Transitions](https://inertiajs.com/docs/v3/the-basics/view-transitions)
- [spatie/laravel-medialibrary v11](https://spatie.be/docs/laravel-medialibrary/v11/introduction)
- [artesaos/seotools GitHub](https://github.com/artesaos/seotools)

### FEATURES.md Sources
- [How to Build a Services Website: Best Practices](https://webflow.com/blog/website-for-services)
- [The 10 Best Professional Services Website Examples in 2026](https://www.blendb2b.com/blog/the-10-best-professional-services-website-examples)
- [RTL Arabic Website Design Best Practices](https://www.aivensoft.com/en/blog/rtl-arabic-website-design-guide)
- [Website Animations in 2026: Pros, Cons & Best Practices](https://www.shadowdigital.cc/resources/do-you-need-website-animations)
- [Structured Data & Schema Markup for SEO in 2026](https://doesinfotech.com/the-role-of-structured-data-schema-markup-in-seo/)

### ARCHITECTURE.md Sources
- [Inertia.js v3 Layouts Documentation](https://inertiajs.com/docs/v3/the-basics/layouts)
- [Motion AnimatePresence](https://motion.dev/docs/react-animate-presence)
- [spatie/laravel-translatable v6](https://spatie.be/docs/laravel-translatable/v6/introduction)
- [spatie/laravel-settings](https://github.com/spatie/laravel-settings)
- [Tailwind CSS v4 Logical Properties](https://tailwindcss.com/blog/tailwindcss-v4)

### PITFALLS.md Sources
- [Inertia.js SSR Documentation](https://inertiajs.com/server-side-rendering)
- [CVE-2023-24249: laravel-admin Arbitrary File Upload](https://github.com/advisories/GHSA-g857-47pm-3r32)
- [Core Web Vitals Optimization Guide 2025](https://www.ableneo.com/insight/how-to-improve-core-web-vitals-lcp-inp-cls-in-modern-web-apps/)
- [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling/)
- [GitHub: TipTap RTL Issue #3957](https://github.com/ueberdosis/tiptap/issues/3957)
- [spatie/laravel-translatable](https://github.com/spatie/laravel-translatable)
- [GitHub: Inertia Page Transitions Discussion #810](https://github.com/inertiajs/inertia/discussions/810)
