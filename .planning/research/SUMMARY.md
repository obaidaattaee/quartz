# Project Research Summary

**Project:** Quartz — Professional Bilingual Services Website (v1 + v1.1 3D Hero)
**Domain:** Bilingual (EN/AR) animated tech-services marketing site with 3D WebGL hero
**Researched:** 2026-04-04 (v1.1 update; base research 2026-03-28)
**Confidence:** HIGH

---

## Executive Summary

Quartz is a professional tech-services marketing site (software development, automation, QA, cybersecurity) built on an already-configured Laravel 13 + Inertia.js 3 + React 19 + TypeScript + Tailwind CSS 4 stack. The v1 research established the core architectural challenge: Arabic RTL support is not a UI overlay but a foundational concern touching every layout component, animation, data model, and SEO output. That challenge remains central. The v1.1 milestone adds a second major challenge — a 3D interactive hero featuring a WebGL globe with Roblox-style robot characters representing each service — which introduces three.js, React Three Fiber, and a dedicated 3D asset pipeline on top of the existing stack.

The recommended approach remains a single Laravel monolith with three zones (public marketing site, admin CMS, auth) served via Inertia. For the 3D hero specifically: three new npm packages are required (`three`, `@react-three/fiber`, `@react-three/drei`) with one optional addition (`@react-three/postprocessing`) for the globe atmosphere glow effect. The Three.js bundle must be isolated in a separate Vite chunk (~160-190KB gzipped) so it is only downloaded when visiting the landing page. The brand redesign requires zero new packages — the existing Tailwind CSS 4 `@theme` token architecture absorbs all new brand values without tooling changes. Both the RTL and 3D concerns have well-established prevention patterns; the risk is not the patterns themselves but failing to apply them at the right phase.

The four critical risks identified in v1 research remain unchanged and are the highest priority: (1) RTL treated as an afterthought causing component-level rewrites, (2) exit animations silently failing because `AnimatePresence` is placed inside rather than above the Inertia page swap point, (3) SSR not enabled from the start causing Arabic pages to be invisible to crawlers, and (4) admin file uploads stored in PHP-executable directories creating an RCE vulnerability. The v1.1 milestone adds two more important concerns: (5) the 3D Canvas cannot render server-side and must be wrapped in a client-only guard to avoid SSR crashes, and (6) mobile performance on SE Asia and MENA markets (mobile-first regions) requires `PerformanceMonitor`, DPR scaling at `[1, 1.5]`, and a graceful static-image fallback for devices that cannot sustain 24+ FPS.

---

## Key Findings

### Recommended Stack

The v1 foundation (Laravel 13, Inertia 3, React 19, Tailwind CSS 4, Vite 8, GSAP 3.14, Motion 12, Tiptap 3, react-i18next) is locked and validated against the existing codebase. The v1.1 milestone adds a minimal 3D pipeline on top.

**New libraries to add (3D hero only):**

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| `three` | ^0.183.0 | WebGL/3D rendering engine | The only standard. R3F and Drei depend on it. v0.183+ has WebGPU support with WebGL 2 fallback. |
| `@react-three/fiber` | ^9.5.0 | React renderer for Three.js | The only production-grade way to write Three.js declaratively in React. v9 specifically targets React 19.2. |
| `@react-three/drei` | ^10.7.0 | Pre-built R3F helpers | Provides `useGLTF`, `OrbitControls`, `Float`, `PerformanceMonitor`, `Detailed` (LOD), `Environment`. Saves weeks of boilerplate. |
| `@react-three/postprocessing` | ^3.0.0 | Post-processing effects | Selective bloom for globe atmosphere glow and robot character highlights. Merges multiple effects into a single GPU pass. |
| `@types/three` | dev | TypeScript types | Three.js type declarations. Install as devDependency. |

**Brand redesign stack: zero new packages.** Tailwind CSS 4 `@theme`, OKLCH CSS variables, `class-variance-authority`, and `tailwind-merge` already cover all brand token needs.

**Libraries explicitly not to add:**
- `react-globe.gl` / `globe.gl` — data-viz wrappers, cannot host custom 3D robot models
- `@react-three/xr` — XR/VR extensions, irrelevant for a website hero
- `@react-three/cannon` / `rapier` — physics engines, unnecessary for camera rotation + hover
- `leva` — dev debug panel, must never ship to production
- `@theatre/core` — ~200KB cinematic tool, GSAP already covers all animation needs
- Style Dictionary / Figma Tokens / Cobalt — overkill; `@theme` in `app.css` is the token system

**Critical version compatibility:**
- `@react-three/fiber@^9.5.0` requires `react@^19.0.0` — confirmed compatible with project's React 19.2
- `@react-three/drei@^10.7.0` pairs with Fiber 9 (do not mix with Drei 11 alpha + Fiber 10 alpha)
- Fiber 10 + Drei 11 are alpha — skip until RC status

**Vite chunk isolation (required):**

Add to existing `manualChunks` in `vite.config.ts`:
```typescript
if (id.includes('three') || id.includes('@react-three') || id.includes('postprocessing')) {
    return 'vendor-three';
}
```

This keeps the ~160-190KB gzipped Three.js bundle out of the main bundle. Every page except the landing page pays zero 3D cost.

**3D asset pipeline:**
- Blender 4.x for model creation, export as GLB with Draco compression
- `npx gltfjsx Model.glb --types --transform` converts GLB to typed React component + optimized binary (70-90% size reduction)
- Store optimized GLBs in `public/models/`
- Robot models target: < 300KB each; Earth texture: 2K desktop / 1K mobile; total models: < 2MB

**Performance budget for 3D hero:**
- Three.js chunk (gzipped): < 160KB
- Initial page paint: not blocked (lazy-load Canvas via `React.lazy` + `Suspense`)
- Mobile FPS: > 30 FPS via `PerformanceMonitor` + DPR cap at `[1, 1.5]`
- Fallback trigger: static image for devices below 24 FPS for 3+ seconds

---

### Expected Features

**Must have (table stakes):**
- Hero with clear value proposition + primary CTA above the fold
- 4 service detail pages (software dev, automation, QA, cybersecurity) with problem-solution framing
- Contact form with lead storage and admin email notification
- Sticky header, mobile-responsive layout, SSL/HTTPS
- Client testimonials, client logos, team section with real photos
- Per-page meta titles/descriptions, Open Graph tags, XML sitemap, JSON-LD structured data
- URL-based bilingual routing (`/en/`, `/ar/`) with full RTL layout for Arabic
- Language switcher (persistent, visible, preserves current page)

**Should have (competitive differentiators):**
- 3D interactive hero: WebGL globe with Roblox-style robot characters per service
- Scroll-triggered reveal animations and hero motion graphics (scotchpos.com style)
- Smooth page transitions (Inertia View Transitions + AnimatePresence)
- Hover micro-interactions on all interactive elements
- Visual portfolio grid with service-category filtering
- Rich blog system with WYSIWYG editor, categories, author profiles, related posts
- Admin CMS with dashboard, bilingual content editing, media library, lead management
- Admin-configurable theme (logo, brand colors via CSS custom properties)
- Animated statistics/counter section, FAQ with accordion

**Defer to v2+:**
- Full case study pages (start with portfolio gallery)
- Complex search (add when blog exceeds 50+ posts)
- Newsletter integration with email service (capture emails in DB first)
- RSS feed (add when blog is active)
- WebGPU renderer (revisit when R3F v10 reaches RC and browser coverage exceeds 98%)

**Anti-features (explicitly do not build):**
- User registration or visitor accounts
- Real-time chat or chatbot
- E-commerce or payment processing
- Client portal or project dashboard
- Full drag-and-drop page builder
- Autoplay video with sound
- Cookie consent banners in v1
- Infinite scroll on blog (use pagination for SEO)
- Multilingual auto-detection with forced redirect
- Social media feed embeds

---

### Architecture Approach

Single Laravel monolith with three zones (public marketing, admin CMS, auth), all served through Inertia.js. No separate API, no Filament, no separate SPA. Public routes live at `/{locale}/...` (URL-prefix i18n is the only SEO-correct approach), admin at `/admin/...`. Content uses `spatie/laravel-translatable` JSON columns. Animations use Motion `AnimatePresence` in `PublicLayout` above the Inertia page swap point, with GSAP for scroll timelines. The 3D hero is a `React.lazy`-loaded component that renders only on the landing page — all other pages never download the Three.js chunk.

**Major components:**

| Component | Responsibility |
|-----------|---------------|
| `SetLocale` middleware | Extracts locale from URL, sets `App::setLocale()`, injects into `URL::defaults` |
| `HandleInertiaRequests` | Shares locale, direction, translations, settings, auth to every page render |
| `PublicLayout` | Marketing pages wrapper: navbar, footer, locale switcher, `AnimatePresence` page transitions |
| `AdminLayout` | CMS wrapper: sidebar nav, breadcrumbs, extends existing `AppLayout` |
| `Hero3D` component | `React.lazy`-loaded R3F Canvas: globe + robot models, lazy-loaded, with static fallback |
| `ThemeProvider` | Reads admin settings from Inertia shared props, injects CSS custom properties into `:root` |
| `useDirection()` hook | Provides `isRTL`, `direction`, `locale` for RTL-aware animations and icon mirroring |
| Translatable Models | `Service`, `Post`, `Category`, `Tag`, `PortfolioItem`, `Testimonial`, `Lead` — all with `HasTranslations` + `InteractsWithMedia` |
| `SiteSettings` / `ContactSettings` / `SeoSettings` | `spatie/laravel-settings` typed classes, cached and shared via Inertia props |

**RTL architecture — three layers:**
1. `<html lang dir>` set in root Blade template based on current locale
2. Tailwind logical properties (`ps-`, `pe-`, `ms-`, `me-`, `text-start`) throughout all components — never use `ml-`, `mr-`, `text-left`, `text-right`
3. `useDirection()` hook for animation direction inversion and icon mirroring

**3D/SSR boundary:**
The R3F `<Canvas>` uses WebGL which cannot render server-side. The `Hero3D` component must be wrapped in a client-only guard (`typeof window !== 'undefined'` or a `ClientOnly` wrapper). SSR renders the static placeholder; client hydrates the 3D scene.

---

### Critical Pitfalls

1. **RTL as a CSS flip instead of a design system concern** — Tailwind v4 physical properties (`pl-`, `mr-`, `text-left`) do NOT auto-mirror on `dir="rtl"`. Every component will need individual manual fixes if this is not addressed from the first line of code. Prevention: use CSS logical properties exclusively from day one; lint for physical direction utilities.

2. **AnimatePresence inside a page component instead of above the Inertia swap point** — Exit animations silently never play. Place `AnimatePresence` in `PublicLayout` keyed by the Inertia page URL. Never put it inside a page component itself.

3. **SSR not enabled from the start with bilingual meta tags** — Arabic pages become invisible to search engine crawlers. Set `<html lang dir>` in Blade template server-side. Enable SSR from Phase 1. Inject hreflang alternates via middleware on every response.

4. **Admin file uploads stored in PHP-executable directory** — Multiple CVEs document polyglot image RCE via MIME-type validation bypass. Store uploads outside webroot via Laravel Storage. Re-encode all images through Intervention Image. Never accept SVGs without sanitization.

5. **3D Canvas rendering attempted in SSR context** — WebGL APIs do not exist in Node.js. Attempting to render the R3F Canvas server-side crashes the SSR process. Wrap `Hero3D` in a `ClientOnly` guard; SSR serves the static placeholder.

6. **Mobile performance on mobile-first markets (SE Asia, MENA)** — Complex 3D on mid-range Android phones will drop below 30 FPS. Use `PerformanceMonitor` from Drei, cap DPR at `[1, 1.5]`, use `frameloop="demand"` for idle rendering, and provide a graceful static-image fallback for devices that cannot sustain 24 FPS.

---

## Implications for Roadmap

Based on combined research, five phases emerge. The ordering is dictated by hard dependency chains.

### Phase 1: Foundation

**Rationale:** Every subsequent phase depends on locale routing and RTL being correct. Retrofitting either requires rewriting all components. All data models should be created now to prevent migration drift.

**Delivers:**
- `SetLocale` middleware + `/{locale}/` route structure
- `<html lang dir>` in Blade root template (SSR-ready)
- All content models and migrations (Service, Post, Category, Tag, PortfolioItem, Testimonial, Lead)
- `SiteSettings`, `ContactSettings`, `SeoSettings` typed classes
- `HandleInertiaRequests` updated with locale, direction, settings as shared props
- TypeScript `SharedProps` types
- `useDirection()` + `useTranslations()` hooks
- Arabic font loaded, RTL typography CSS rules in place
- Tailwind logical property convention enforced across codebase
- `lang/en.json` and `lang/ar.json` translation file structure

**Avoids:** RTL as afterthought (Pitfall 1), route duplication bugs, font CLS on language switch

**Research flags:** Standard Laravel localization pattern. Well-documented. No additional research needed.

---

### Phase 2: Public Marketing Site

**Rationale:** Validates the data model works for public rendering before building 20 admin forms against it. Delivers the core business value — what visitors actually see.

**Delivers:**
- `PublicLayout` with sticky navbar, footer, locale switcher, theme toggle
- `AnimatePresence` page transitions (in `PublicLayout`, keyed by Inertia page URL)
- `<Reveal>` and `<StaggerContainer>` animation primitives
- Home page: hero section, service overview cards, testimonials, client logos, animated stats, CTA
- 4 Service detail pages with problem-solution framing and per-service CTA
- Contact page with form, lead storage, email notification
- 404 page
- Basic SEO: `<Head>` meta, OG tags, hreflang middleware, locale sitemaps
- Breadcrumbs on inner pages

**Avoids:** AnimatePresence placement failure (Pitfall 2), animations hurting Core Web Vitals (Pitfall 5), Arabic typography failures (Pitfall 6)

**Research flags:** Motion AnimatePresence placement is documented. GSAP + Inertia navigation `ScrollTrigger.refresh()` hook needs hands-on validation during implementation (identified gap).

---

### Phase 2.5: 3D Hero (v1.1 Milestone)

**Rationale:** Distinct sub-milestone layered onto Phase 2's completed home page. Separated because it introduces a new technology stack (R3F), requires external asset work (Blender models), and has specific mobile performance constraints that are independent of the rest of the marketing site.

**Delivers:**
- `npm install three @react-three/fiber @react-three/drei @react-three/postprocessing`
- `vendor-three` Vite chunk isolation in `vite.config.ts`
- `ClientOnly` wrapper to guard against SSR crashes
- `Hero3D` component: R3F Canvas, Earth globe (`SphereGeometry` + 2K/1K texture), 4-6 robot GLB models (one per service)
- `PerformanceMonitor` with static-image fallback for < 24 FPS devices
- DPR scaling at `[1, 1.5]`, `frameloop="demand"` for idle rendering
- LOD variants via `<Detailed>` — low-poly globe on mobile
- Selective bloom post-processing for globe atmosphere
- GSAP timeline integration for camera fly-in and robot entrance sequences
- Brand redesign: updated `@theme` tokens in `app.css` (new OKLCH color values, typography scale)
- All design tokens read from CSS custom properties by 3D materials for dark/light mode consistency

**Avoids:** SSR crash from WebGL in Node context (Pitfall 5.2), mobile FPS failure on SE Asia/MENA markets, bundle bloat on non-landing pages

**Research flags:** R3F v9 + React 19 compatibility confirmed (HIGH confidence). `leva` debug panel must be stripped from production build — dynamic import behind environment check. R3F v10 (WebGPU-first) is alpha — do not upgrade until RC.

---

### Phase 3: Admin CMS

**Rationale:** Content must be manageable before building blog and portfolio pages. The admin panel gates the ability to populate real content for Phase 4.

**Delivers:**
- `AdminLayout` (sidebar, breadcrumbs, extends existing `AppLayout`)
- `EnsureRole` middleware; admin/editor role separation
- Dashboard with key metrics (recent leads, post count, portfolio count)
- Service content editing (structured bilingual fields)
- Testimonial CRUD with drag-to-reorder
- Lead management (list view, status tracking)
- Site settings (logo upload, brand colors with WCAG guardrails, contact info)
- Media library (`spatie/laravel-medialibrary`, WebP conversions, image re-encoding)
- `TranslationTabs` component for side-by-side EN/AR content editing
- Translation completeness checker (flag missing Arabic translations)

**Avoids:** File upload RCE (Pitfall 4), RBAC prop leaking (Pitfall 13), admin theme color contrast violations (Pitfall 8)

**Research flags:** `spatie/laravel-settings` vs database-driven settings needs validation for admin-editable fields with schema migrations (identified gap). Standard Laravel CRUD otherwise — no deep research needed.

---

### Phase 4: Blog and Portfolio

**Rationale:** Depends on admin panel being functional — editors need the CMS before public blog/portfolio pages have anything to render.

**Delivers:**
- Blog index with pagination (6-10 posts/page), category and tag filtering
- Blog post detail with reading time, author profile, related posts, social sharing (WhatsApp priority for MENA)
- Tiptap rich text editor with RTL support, `TextDirection` extension, `dir` attributes in stored HTML
- Blog SEO metadata per post (meta title, description, OG image fields)
- Portfolio gallery with service-category filtering
- RSS feed

**Avoids:** Tiptap RTL failures (Pitfall 9), translation data model search scalability (Pitfall 7)

**Research flags:** Tiptap 3 TextDirection extension has known open issues (GitHub #3957). A targeted research spike on specific RTL configuration is recommended before beginning blog editor implementation.

---

### Phase 5: SEO, Polish, and Production Hardening

**Rationale:** Performance optimization is most effective as a last pass when the full component tree is known. SEO structured data layers onto working routes and models.

**Delivers:**
- JSON-LD structured data (Organization, Service, Article schemas via `artesaos/seotools`)
- XML sitemaps with hreflang (`/en/sitemap.xml`, `/ar/sitemap.xml` via `spatie/laravel-sitemap`)
- Hero motion graphics polish (GSAP scroll timeline, staggered entrance sequences)
- Hover micro-interactions across all cards, buttons, and links
- FAQ section with accordion and FAQ schema
- Animated statistics counters (IntersectionObserver-triggered)
- Dark/light mode verification in both locales
- Admin-configurable theme color picker with WCAG contrast guardrails
- SSR verification and Lighthouse audit (mobile target: 80+)
- PM2 process management for SSR Node.js process (memory threshold restart)
- Image optimization pipeline verification (WebP, responsive srcsets, lazy loading)
- `prefers-reduced-motion` support across all animations
- 3D hero performance audit under real mobile conditions (SE Asia / MENA device profiles)

**Avoids:** SSR memory leaks (Pitfall 14), Core Web Vitals degradation (Pitfall 5), SSR/SEO bilingual gaps (Pitfall 3)

**Research flags:** Inertia v3 SSR production configuration (PM2 integration, memory management under load) is less documented than development setup. A targeted spike before SSR hardening work would reduce risk.

---

### Phase Ordering Rationale

- Foundation before everything: RTL and locale routing cannot be retrofitted without rewriting all components. This is the single most expensive mistake in this domain.
- Public site before admin: validates the data model works before 20 admin forms are built against it; delivers visible business value early.
- 3D hero as a distinct sub-milestone: isolated from core marketing site work due to separate technology stack, external asset pipeline (Blender), and mobile performance constraints.
- Admin before blog/portfolio: editors need the CMS to populate content before the public pages have anything to render.
- Polish and SEO last: optimization is most effective when the complete component tree is known; structured data requires routes and models to be stable.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack (v1 base) | HIGH | Existing codebase is the foundation. All new library selections verified on npm/Packagist as of research dates. |
| Stack (v1.1 3D) | HIGH | R3F v9 + React 19 compatibility confirmed via official docs. three@0.183, fiber@9.5, drei@10.7 all at current stable. |
| Features | HIGH | Sources include professional services website best practices, RTL design guides, and SEO research for 2026. Scope is realistic. |
| Architecture | HIGH | Patterns verified against official Inertia v3 docs, Tailwind v4 docs, and the actual existing codebase. |
| Pitfalls | HIGH | Critical pitfalls backed by documented CVEs and confirmed Inertia GitHub issues. RTL pitfalls verified across multiple RTL guides. |

**Overall confidence: HIGH**

### Gaps to Address

1. **Tiptap RTL in production** — GitHub issue #3957 documents known RTL bugs in Tiptap. The `TextDirection` extension is the mitigation, but needs hands-on validation before blog implementation begins. Run a targeted spike at the start of Phase 4.

2. **Arabic font subsetting** — Arabic fonts are 200-500KB. Which character ranges to subset for technical services content is not covered in research. Investigate during Phase 1 typography work.

3. **GSAP + Inertia ScrollTrigger refresh** — GSAP ScrollTrigger requires `ScrollTrigger.refresh()` calls after Inertia page navigation to recalculate scroll positions. The exact hook placement needs validation during Phase 2 animation work.

4. **`spatie/laravel-settings` admin editing** — The package stores settings in a database but the interface is PHP classes. Adding new settings fields requires migrations. Validate this workflow against the admin-editable settings requirement before Phase 3.

5. **R3F v10 / WebGPU readiness** — R3F v10 and Drei v11 are both in alpha as of 2026-04-04. Monitor for RC status. WebGPU is not yet viable for the project's mobile-first target markets (SE Asia, MENA) where WebGL has 98%+ coverage and WebGPU is still sparse.

6. **Draco CDN availability in target markets** — The default `useGLTF` Draco decoder uses `gstatic.com` (Google CDN). Verify this CDN is accessible in all target markets. If blocked, self-host the Draco WASM decoder.

---

## Sources

### Primary (HIGH confidence)

**Stack (3D)**
- [@react-three/fiber npm](https://www.npmjs.com/package/@react-three/fiber) — v9.5.0, React 19 compatibility confirmed
- [@react-three/drei npm](https://www.npmjs.com/package/@react-three/drei) — v10.7.7 latest stable
- [three npm](https://www.npmjs.com/package/three) — v0.183.2 latest stable
- [@react-three/postprocessing npm](https://www.npmjs.com/package/@react-three/postprocessing) — v3.0.4 latest
- [R3F Installation docs](https://r3f.docs.pmnd.rs/getting-started/installation) — Fiber 9 + React 19 compatibility verified
- [R3F Performance Scaling docs](https://r3f.docs.pmnd.rs/advanced/scaling-performance) — PerformanceMonitor, LOD, DPR, on-demand rendering
- [R3F Loading Models docs](https://r3f.docs.pmnd.rs/tutorials/loading-models) — useGLTF, Draco defaults, preloading
- [gltfjsx GitHub](https://github.com/pmndrs/gltfjsx) — v6.5.3, `--types --transform` flags confirmed
- [Tailwind CSS 4 Theme docs](https://tailwindcss.com/docs/theme) — CSS-first design tokens, `@theme` directive

**Stack (v1 base)**
- [Motion (formerly Framer Motion)](https://motion.dev/) — AnimatePresence, page transitions
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — scroll timeline animations
- [Tiptap Editor v3](https://tiptap.dev/tiptap-editor-v3) — rich text editor
- [spatie/laravel-medialibrary v11](https://spatie.be/docs/laravel-medialibrary/v11/introduction) — media handling
- [artesaos/seotools GitHub](https://github.com/artesaos/seotools) — server-side SEO meta + JSON-LD
- [Inertia.js v3 View Transitions](https://inertiajs.com/view-transitions) — built-in page transition API

**Architecture**
- [Inertia.js v3 Layouts](https://inertiajs.com/layouts) — layout routing pattern
- [Motion AnimatePresence](https://motion.dev/docs/react-animate-presence) — exit animation placement
- [spatie/laravel-translatable v6](https://spatie.be/docs/laravel-translatable/v6/introduction) — JSON column translation
- [spatie/laravel-settings](https://github.com/spatie/laravel-settings) — typed settings classes
- [Tailwind CSS v4 Logical Properties](https://tailwindcss.com/blog/tailwindcss-v4) — RTL layout system

**Pitfalls**
- [Inertia.js SSR Documentation](https://inertiajs.com/server-side-rendering) — SSR setup, memory management
- [CVE-2023-24249: laravel-admin Arbitrary File Upload](https://github.com/advisories/GHSA-g857-47pm-3r32) — RCE via polyglot images
- [Core Web Vitals Optimization Guide 2025](https://www.ableneo.com/insight/how-to-improve-core-web-vitals-lcp-inp-cls-in-modern-web-apps/) — animation impact on CWV
- [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling/) — logical properties reference
- [GitHub: Inertia Page Transitions #810](https://github.com/inertiajs/inertia/discussions/810) — AnimatePresence + Inertia pattern

### Secondary (MEDIUM confidence)

- [100 Three.js Performance Tips (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips) — DPR capping, LOD, instancing, texture compression
- [Codrops: Building Efficient Three.js Scenes (2025)](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/) — GPU resource management
- [GitHub: TipTap RTL Issue #3957](https://github.com/ueberdosis/tiptap/issues/3957) — known RTL bugs, TextDirection extension
- [spatie/laravel-translatable](https://github.com/spatie/laravel-translatable) — JSON translation approach tradeoffs

### Tertiary (LOW confidence — needs validation)

- [React Postprocessing Bloom docs](https://react-postprocessing.docs.pmnd.rs/effects/bloom) — selective bloom configuration (verify against v3.0.4 API)
- Draco CDN availability in SE Asia / MENA target markets — not researched, needs validation before production deployment

---

*Research completed: 2026-04-04 (v1.1 update incorporating 3D hero + brand redesign stack)*
*Base research: 2026-03-28*
*Ready for roadmap: yes*
