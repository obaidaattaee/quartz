# Technology Stack

**Project:** Quart - Professional Bilingual Services Website
**Researched:** 2026-03-28
**Overall Confidence:** HIGH

## Existing Stack (Already Configured)

These are locked in. The codebase is already built on this foundation.

| Technology | Version | Role |
|------------|---------|------|
| Laravel | 13.0 | Backend framework, routing, ORM, auth |
| Inertia.js | 3.0.0 | SPA adapter bridging Laravel + React |
| React | 19.2.0 | UI rendering |
| TypeScript | 5.7.2 | Type safety |
| Tailwind CSS | 4.0.0 | Utility-first styling |
| Vite | 8.0.0 | Build tool and dev server |
| Radix UI | Various | Headless UI primitives (already installed) |
| Lucide React | 0.475.0 | Icon library |
| Laravel Fortify | 1.34 | Authentication scaffolding |

**Already configured in codebase:**
- Dark/light mode with CSS variables + `.dark` class toggle (via `use-appearance` hook and `@custom-variant dark` in CSS)
- shadcn/ui-style component system with CVA + tailwind-merge
- Inertia `<Head>` component for basic title management
- `build:ssr` script in package.json (but SSR entry point not yet created)

---

## Recommended Stack (New Libraries)

### 1. Animation System

#### Primary: Motion (formerly Framer Motion)

| Property | Value |
|----------|-------|
| Package | `motion` |
| Version | 12.38.0 |
| Import | `import { motion, AnimatePresence } from "motion/react"` |
| Confidence | HIGH |

**Why Motion:**
- Built for React. Declarative API (`<motion.div>`) integrates naturally with JSX and component lifecycle.
- Handles layout animations, gesture recognition, scroll-triggered reveals, and exit animations out of the box.
- Hybrid rendering engine: uses Web Animations API for 120fps hardware-accelerated performance, falls back to JS for spring physics and interruptible animations.
- AnimatePresence enables page transition animations between Inertia route changes.
- ~32KB gzipped - reasonable for the animation capability it provides.
- Massive ecosystem: most React animation tutorials and examples target Motion.

**Use for:** Component enter/exit animations, hover interactions, scroll reveal animations, layout transitions, page transition orchestration, hero motion graphics.

```bash
npm install motion
```

#### Secondary: GSAP + ScrollTrigger (for premium scroll sequences)

| Property | Value |
|----------|-------|
| Package | `gsap` |
| Version | 3.14.2 |
| React Hook | `@gsap/react` 2.1.2 |
| Confidence | HIGH |

**Why GSAP alongside Motion:**
- GSAP ScrollTrigger provides pixel-perfect timeline control for complex scroll-driven sequences (parallax sections, pinned scroll scenes, progress-based animations).
- scotchpos.com-style animations require this level of scroll precision - Motion alone cannot match GSAP's timeline scrubbing and pin capabilities.
- Now 100% free (including all bonus plugins like SplitText, MorphSVG) after Webflow acquisition in 2024.
- `@gsap/react` provides `useGSAP()` hook that automatically handles cleanup via `gsap.context()` and works with SSR (falls back to `useEffect` when `window` is undefined).
- ~23KB gzipped (core) + ScrollTrigger module - tree-shakeable.

**Use for:** Scroll-pinned sections, parallax backgrounds, timeline-based hero sequences, text splitting animations, scroll progress indicators.

```bash
npm install gsap @gsap/react
```

#### Supporting: Lenis (smooth scrolling)

| Property | Value |
|----------|-------|
| Package | `lenis` |
| Version | 1.3.21 |
| React Import | `import { ReactLenis, useLenis } from "lenis/react"` |
| Confidence | MEDIUM |

**Why Lenis:**
- Industry standard for smooth momentum-based scrolling on premium marketing sites.
- Integrates cleanly with GSAP ScrollTrigger via the built-in Lenis-ScrollTrigger connection.
- Small bundle size, touch device support, horizontal scrolling capabilities.
- Used by most high-end agency sites that scotchpos.com's style emulates.

**When NOT to use:** If the site feels fine with native scrolling, skip Lenis. Test without it first; add only if the scroll feel isn't premium enough. Some users find smooth scroll disorienting.

```bash
npm install lenis
```

#### What NOT to Use for Animation

| Library | Why Not |
|---------|---------|
| AOS (Animate on Scroll) | Too basic. Only does simple reveal-on-scroll. No timeline control, no gesture support, no layout animations. Fine for blogs, insufficient for scotchpos-style sites. |
| react-spring | Declining ecosystem. Motion has absorbed its spring physics use cases with better DX. |
| CSS-only animations | Insufficient for scroll-driven timelines, gesture-based interactions, and coordinated sequences. Use CSS for simple hover/focus states only. |
| `tw-animate-css` alone | Already installed. Good for basic enter/exit CSS animations on Radix components, but cannot drive scroll-based or gesture-based animations. Keep it for what it does; do not try to build complex animations with it. |

---

### 2. Internationalization (i18n)

#### Primary: react-i18next + i18next

| Property | Value |
|----------|-------|
| Package | `react-i18next` |
| Version | 16.6.6 |
| Core | `i18next` (latest) |
| Confidence | HIGH |

**Why react-i18next:**
- De facto standard for React internationalization. 6,100+ dependents on npm.
- Built-in `i18n.dir()` method returns `"rtl"` or `"ltr"` per locale - critical for Arabic RTL support.
- Hooks-based API (`useTranslation()`) integrates naturally with React function components.
- Supports namespaced translations, pluralization, interpolation, and nested keys.
- Works with SSR (server-side rendering) when i18next is initialized before React renders.

**RTL Integration Pattern:**
```typescript
// Custom hook for direction management
const { i18n } = useTranslation();
useEffect(() => {
  document.documentElement.dir = i18n.dir(i18n.resolvedLanguage);
  document.documentElement.lang = i18n.resolvedLanguage;
}, [i18n.resolvedLanguage]);
```

**URL-Based Routing (`/en/...`, `/ar/...`):**
Language detection happens server-side in Laravel middleware. The locale prefix is extracted from the URL, passed to Inertia as a shared prop, and used to initialize i18next on the frontend. This is the correct approach for SEO (each language version has its own URL).

```bash
npm install react-i18next i18next
```

#### Translation File Strategy

| Approach | Recommendation |
|----------|---------------|
| Laravel PHP translation files + Vite plugin | Use `vite-plugin-laravel-i18next` to convert Laravel's `/lang/en/*.php` and `/lang/ar/*.php` files into i18next-compatible JSON at build time. Single source of truth for translations in Laravel. |
| Standalone JSON files | Alternative: keep `/public/locales/en/translation.json` and `/public/locales/ar/translation.json` loaded via `i18next-http-backend`. Simpler but duplicates translation management outside Laravel. |

**Recommendation:** Use the Vite plugin approach. It keeps translations in Laravel's `/lang` directory (familiar to Laravel devs, works with `__()` helper on server-side too) while making them available to react-i18next on the frontend.

```bash
npm install -D vite-plugin-laravel-i18next
```

#### What NOT to Use for i18n

| Library | Why Not |
|---------|---------|
| `laravel-react-i18n` | Ties you to Laravel's translation format at runtime. react-i18next has a larger ecosystem, better docs, and more React-specific features (suspense support, hooks, etc.). |
| `react-intl` (FormatJS) | Heavier, more opinionated. Better for apps with complex ICU message formatting needs. For a marketing site with two languages, i18next is simpler and sufficient. |
| Manual translation objects | Does not scale. No pluralization, no interpolation, no namespace support. |

---

### 3. Rich Text Editor (Blog/CMS Admin)

#### Primary: Tiptap 3

| Property | Value |
|----------|-------|
| Package | `@tiptap/react` |
| Version | 3.20.5 |
| Core | `@tiptap/pm` (ProseMirror) |
| Confidence | HIGH |

**Why Tiptap:**
- Headless rich text editor built on ProseMirror. You control the UI entirely - matches the existing Radix UI + Tailwind component system.
- 100+ extensions available: headings, images, links, code blocks, tables, embeds, mentions, etc.
- New declarative `<Tiptap />` React component API in v3 for cleaner setup.
- SSR compatible with `immediatelyRender: false` option.
- Outputs HTML or JSON - store as JSON in the database for structured querying, render to HTML for display.
- RTL text support works natively (ProseMirror handles bidirectional text).
- Active development: v3.20.5 released days ago.

**Essential Extensions:**
```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
npm install @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder
npm install @tiptap/extension-code-block-lowlight @tiptap/extension-youtube
npm install @tiptap/extension-text-align @tiptap/extension-underline
```

**What NOT to Use:**

| Editor | Why Not |
|--------|---------|
| TinyMCE | Cloud-hosted, requires API key, opinionated UI that clashes with custom design. |
| CKEditor 5 | Complex licensing (GPL or commercial), heavy bundle, harder to customize UI. |
| Slate.js | Lower-level than Tiptap. You'd rebuild everything Tiptap provides out of the box. |
| Quill | Legacy. Poor React 19 support, limited extension ecosystem. |
| `reactjs-tiptap-editor` | Pre-built UI wrapper. You lose control over styling consistency with your design system. Build your own toolbar with Radix UI components + Tiptap commands. |

---

### 4. SEO (Meta Tags, Structured Data, Sitemap)

#### Frontend: Inertia `<Head>` Component (built-in)

| Property | Value |
|----------|-------|
| Package | `@inertiajs/react` (already installed) |
| Component | `<Head>` |
| Confidence | HIGH |

**Why Inertia Head:**
- Built into Inertia v3. No additional dependency needed.
- Supports `<title>`, `<meta>`, Open Graph, Twitter Card tags.
- `head-key` prop prevents duplicate tags across layout and page components.
- Works with SSR automatically when SSR is enabled.
- Global title callback already configured in `app.tsx`.

**Usage pattern:**
```tsx
import { Head } from '@inertiajs/react';

function ServicePage({ service }) {
  return (
    <>
      <Head>
        <title>{service.title}</title>
        <meta head-key="description" name="description" content={service.excerpt} />
        <meta head-key="og:title" property="og:title" content={service.title} />
        <meta head-key="og:description" property="og:description" content={service.excerpt} />
        <meta head-key="og:image" property="og:image" content={service.ogImage} />
      </Head>
      {/* page content */}
    </>
  );
}
```

#### Backend: artesaos/seotools

| Property | Value |
|----------|-------|
| Package | `artesaos/seotools` |
| Version | 1.3.2 |
| Confidence | MEDIUM |

**Why artesaos/seotools:**
- Laravel-native SEO meta tag management. Provides `SEOMeta`, `OpenGraph`, `TwitterCard`, and `JsonLd` facades.
- Set SEO data in controllers, pass to Inertia as props, render in `<Head>` on the frontend.
- Supports JSON-LD structured data (important for service business schema markup).
- Compatible with Laravel 12+.

**Alternative considered:** `butschster/LaravelMetaTags` (v3.2.0) is more feature-rich but also more complex. For a services website, artesaos/seotools is sufficient and simpler.

```bash
composer require artesaos/seotools
```

#### SSR Configuration

Inertia v3 with the `@inertiajs/vite` plugin handles SSR automatically during development. For production:

1. The `build:ssr` script already exists in `package.json`.
2. Add SSR option to the Inertia Vite plugin in `vite.config.ts` (already using `inertia()` plugin).
3. Run `php artisan inertia:start-ssr` in production.

No separate SSR entry point file is needed in Inertia v3 - the Vite plugin handles it.

#### Sitemap

| Package | Version | Why |
|---------|---------|-----|
| `spatie/laravel-sitemap` | Latest | Automatically crawls routes or allows manual sitemap building. Generates XML sitemaps. Include both `/en/` and `/ar/` versions with `hreflang` alternates. |

```bash
composer require spatie/laravel-sitemap
```

#### What NOT to Use for SEO

| Approach | Why Not |
|----------|---------|
| `react-helmet-async` | Unnecessary. Inertia's built-in `<Head>` component does everything react-helmet-async does, and v3.0.0 of react-helmet-async even delegates to React 19's native head hoisting. Adding it is redundant overhead. |
| Client-side only meta tags | Social media crawlers and some search engines don't execute JavaScript. SSR is required for OG tags to work on WhatsApp, Slack, Twitter previews. |

---

### 5. Dark/Light Mode Theming

**Status: Already implemented. No new libraries needed.**

The codebase already has a complete dark/light/system mode implementation:

| Component | Status |
|-----------|--------|
| CSS variables (oklch) for all theme tokens | Configured in `app.css` |
| `.dark` class toggle on `<html>` | Configured via `@custom-variant dark (&:is(.dark *))` |
| `useAppearance()` hook | Fully implemented with localStorage + cookie persistence |
| `initializeTheme()` | Called on app load, prevents flash of unstyled content |
| System preference detection | `matchMedia('(prefers-color-scheme: dark)')` with change listener |

**What to add:** When implementing the admin theme customization (custom brand colors), extend the existing CSS variable system. The admin panel should update CSS custom properties (`--primary`, `--secondary`, etc.) which the existing theme token system already references.

**Approach for admin-configurable themes:**
1. Store theme colors in the database.
2. Pass them as Inertia shared props.
3. Inject as inline CSS custom properties on `<html>` element.
4. The existing Tailwind token system (`--color-primary: var(--primary)`) picks them up automatically.

---

### 6. Image Optimization & Media Handling

#### Primary: spatie/laravel-medialibrary

| Property | Value |
|----------|-------|
| Package | `spatie/laravel-medialibrary` |
| Version | 11.21.0 |
| Confidence | HIGH |

**Why spatie/laravel-medialibrary:**
- Associate uploaded files with Eloquent models (blog posts, case studies, services).
- Automatic image conversions: thumbnails, responsive images, WebP format.
- Optimization pipeline: runs images through jpegoptim, pngquant, optipng, svgo, gifsicle, cwebp.
- Queue-based conversions for processing uploads in the background.
- Collections and custom properties for organizing media (hero images, gallery images, OG images).
- Works with any filesystem disk (local, S3, etc.).

```bash
composer require spatie/laravel-medialibrary
```

**Required system dependencies (for optimization):**
```bash
# On the server
apt-get install jpegoptim pngquant optipng gifsicle webp
npm install -g svgo
```

#### Frontend Image Components

No separate React image library needed. Use native HTML with responsive images generated by the media library:

```tsx
// Render responsive images from media library conversions
<img
  src={media.url}
  srcSet={media.responsiveImages.srcset}
  sizes="(max-width: 768px) 100vw, 50vw"
  alt={media.alt}
  loading="lazy"
  decoding="async"
/>
```

#### What NOT to Use

| Library | Why Not |
|---------|---------|
| `intervention/image` standalone | spatie/laravel-medialibrary uses it under the hood via spatie/image. No need to install separately. |
| Cloudinary/Imgix | Over-engineered for a services website. Local processing with the media library is sufficient and avoids ongoing SaaS costs. |
| `next/image` patterns | Not applicable - this is Inertia, not Next.js. Use native `<img>` with `srcset` and `loading="lazy"`. |

---

### 7. View Transitions (Page Transitions)

**Built into Inertia v3. No additional library needed.**

| Feature | Implementation |
|---------|---------------|
| Cross-fade transitions | `viewTransition: true` on `router.visit()` or `<Link viewTransition>` |
| Global transitions | Set in `createInertiaApp({ defaults: { visitOptions: () => ({ viewTransition: true }) } })` |
| Custom animations | CSS `::view-transition-old(root)` / `::view-transition-new(root)` pseudo-elements |
| Element transitions | Apply `view-transition-name` CSS property to match elements across pages |

**Combined with Motion:** Use `AnimatePresence` for component-level enter/exit animations within pages, and Inertia View Transitions for page-level transitions. They complement each other - View Transitions handle the cross-page morph, Motion handles the within-page choreography.

---

## Complete Installation Summary

### npm (Frontend)

```bash
# Animation
npm install motion gsap @gsap/react lenis

# Internationalization
npm install react-i18next i18next

# Rich Text Editor
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
npm install @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder
npm install @tiptap/extension-code-block-lowlight @tiptap/extension-youtube
npm install @tiptap/extension-text-align @tiptap/extension-underline

# Dev dependencies
npm install -D vite-plugin-laravel-i18next
```

### Composer (Backend)

```bash
# SEO
composer require artesaos/seotools

# Media handling
composer require spatie/laravel-medialibrary

# Sitemap
composer require spatie/laravel-sitemap
```

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Animation | Motion 12 | Anime.js 4 | Smaller ecosystem for React, no built-in gesture support |
| Scroll animation | GSAP ScrollTrigger | Motion scroll() | GSAP provides timeline scrubbing and pin that Motion lacks |
| Smooth scroll | Lenis | locomotive-scroll | Lenis is lighter, better maintained, and the successor |
| i18n | react-i18next | react-intl (FormatJS) | Heavier, ICU-format complexity unnecessary for 2 languages |
| Rich text | Tiptap 3 | Lexical (Meta) | Lexical is lower-level, requires building more from scratch |
| SEO meta | Inertia Head + artesaos/seotools | butschster/LaravelMetaTags | LaravelMetaTags is more complex than needed |
| Image handling | spatie/laravel-medialibrary | Cloudinary SDK | Avoid SaaS cost and dependency for a project this scale |
| Dark mode | Existing CSS vars + hook | next-themes | next-themes is for Next.js; existing implementation is complete |

---

## RTL-Specific Considerations

These are not libraries but architectural decisions that affect every stack choice:

| Concern | Approach |
|---------|----------|
| Document direction | `i18n.dir()` sets `<html dir="rtl">` for Arabic |
| Tailwind RTL utilities | Use `rtl:` and `ltr:` variants for direction-specific spacing/alignment |
| Fonts | Load an Arabic-optimized font (Noto Sans Arabic, IBM Plex Arabic, or Cairo) alongside the English font |
| Animations | Mirror horizontal animations for RTL (slide-from-right becomes slide-from-left). Motion supports `x` direction values that should be inverted. |
| Tiptap editor | ProseMirror handles bidirectional text natively. Set `dir="auto"` on the editor container. |
| Navigation | Radix UI NavigationMenu supports RTL natively via the `dir` prop. |

**Arabic Font Recommendation:**

| Font | Why |
|------|-----|
| IBM Plex Sans Arabic | Professional, clean, excellent Latin+Arabic coverage, open source (Google Fonts). Pairs well with the existing Instrument Sans for English. |
| Noto Sans Arabic | Broader Unicode coverage if needed. Slightly less distinctive. |

```css
@theme {
  --font-sans: 'Instrument Sans', 'IBM Plex Sans Arabic', ui-sans-serif, system-ui, sans-serif;
}
```

---

## Version Verification Log

| Package | Verified Version | Source | Date |
|---------|-----------------|--------|------|
| motion | 12.38.0 | npm registry | 2026-03-28 |
| gsap | 3.14.2 | npm registry | 2026-03-28 |
| @gsap/react | 2.1.2 | npm registry | 2026-03-28 |
| lenis | 1.3.21 | npm registry | 2026-03-28 |
| react-i18next | 16.6.6 | npm registry | 2026-03-28 |
| @tiptap/react | 3.20.5 | npm registry | 2026-03-28 |
| react-helmet-async | 3.0.0 | npm registry (not recommended) | 2026-03-28 |
| artesaos/seotools | 1.3.2 | Packagist | 2026-03-28 |
| spatie/laravel-medialibrary | 11.21.0 | Packagist | 2026-03-28 |

---

## Sources

- [Motion (formerly Framer Motion) - Official Site](https://motion.dev/)
- [Motion npm package](https://www.npmjs.com/package/motion)
- [GSAP ScrollTrigger Documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP is now 100% free - Webflow Blog](https://webflow.com/blog/gsap-becomes-free)
- [@gsap/react npm](https://www.npmjs.com/package/@gsap/react)
- [Lenis - Smooth Scroll](https://www.lenis.dev/)
- [react-i18next Documentation](https://react.i18next.com/)
- [i18next dir() API](https://www.i18next.com/overview/api)
- [Tiptap Editor v3](https://tiptap.dev/tiptap-editor-v3)
- [Tiptap React Installation](https://tiptap.dev/docs/editor/getting-started/install/react)
- [Inertia.js v3 View Transitions](https://inertiajs.com/docs/v3/the-basics/view-transitions)
- [Inertia.js v3 Title & Meta](https://inertiajs.com/docs/v3/the-basics/title-and-meta)
- [Tailwind CSS v4 Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [spatie/laravel-medialibrary v11](https://spatie.be/docs/laravel-medialibrary/v11/introduction)
- [artesaos/seotools GitHub](https://github.com/artesaos/seotools)
- [vite-plugin-laravel-i18next GitHub](https://github.com/adesege/vite-plugin-laravel-i18next)
- [Inertia.js v3 SSR - Laravel Blog](https://laravel.com/blog/inertiajs-v3-is-now-in-beta)
