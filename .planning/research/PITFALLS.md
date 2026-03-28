# Domain Pitfalls

**Domain:** Bilingual (EN/AR) animated services website on Laravel 13 + Inertia.js 3 + React 19 + Tailwind CSS v4
**Researched:** 2026-03-28

---

## Critical Pitfalls

Mistakes that cause rewrites, serious regressions, or fundamental architecture flaws.

---

### Pitfall 1: Treating RTL as a CSS Flip Instead of a Design System Concern

**What goes wrong:** Developers build the entire site in LTR, then try to "flip" it for Arabic using `dir="rtl"` and a few overrides. The result: broken layouts, misaligned icons, animations sliding the wrong direction, padding/margins on wrong sides, and navigation menus in wrong order. Fixing this retroactively requires touching nearly every component.

**Why it happens:** RTL is treated as a last-mile concern rather than a foundational design decision. Physical CSS properties (`margin-left`, `padding-right`, `text-align: left`) are baked into every component.

**Consequences:**
- Every component needs individual RTL fixes, creating an LTR/RTL maintenance nightmare
- Tailwind v4 defaults to physical properties -- `pl-4` generates `padding-left` not `padding-inline-start`, so `dir="rtl"` alone does NOT automatically mirror spacing
- Icons like arrows, chevrons, and progress indicators point the wrong direction in RTL
- Scroll-triggered animations that slide elements from left-to-right look jarring in an RTL context
- Navigation menu order stays LTR even when `dir="rtl"` is set (list order does not reverse automatically)

**Prevention:**
1. Use CSS logical properties from day one: `ps-4` / `pe-4` (padding-start/end) instead of `pl-4` / `pr-4` in Tailwind v4
2. Use `text-start` / `text-end` instead of `text-left` / `text-right`
3. Create a shared `useDirection()` hook that reads the current locale and provides direction context to animation components
4. Build a component library checklist: every component must be visually verified in both LTR and RTL during development, not after
5. Mirror directional icons conditionally: arrows, chevrons, quote marks, progress indicators need `rtl:scale-x-[-1]` or conditional SVG variants
6. For horizontal scroll/slide animations, parameterize direction: `x: dir === 'rtl' ? -100 : 100`

**Detection (warning signs):**
- Any use of `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`, `text-right` in component code
- Animations with hardcoded `x` or `translateX` values
- No RTL visual testing in the development workflow

**Phase relevance:** Must be addressed in Phase 1 (foundation/layout system). Retrofitting is extremely expensive.

**Confidence:** HIGH -- based on extensive RTL community documentation, Tailwind v4 official docs, and known behavior of CSS logical vs physical properties.

---

### Pitfall 2: Inertia.js Page Transitions Destroying Exit Animations

**What goes wrong:** When navigating between pages, Inertia.js unmounts the current page component and mounts the new one. Framer Motion's `AnimatePresence` exit animations never play because the component is removed from the DOM before the exit animation can complete. The user sees an abrupt page swap instead of smooth transitions.

**Why it happens:** Inertia controls the component lifecycle -- it swaps the page component immediately on navigation. `AnimatePresence` requires the component to remain mounted during its exit animation, but Inertia unmounts it before `AnimatePresence` gets a chance to animate out.

**Consequences:**
- Page transitions feel broken -- enter animations play but exit animations are invisible
- CSS modules/scoped styles are wiped during transition, causing a flash of unstyled content during the brief overlap
- Developers waste significant time debugging why `exit` props on `motion.div` do nothing

**Prevention:**
1. **Primary approach:** Use Inertia v2's built-in View Transitions API (`viewTransition: true` on links/visits). This handles cross-fade by default and supports custom CSS animations via `::view-transition-*` pseudo-elements. Caveat: only works in Chromium-based browsers as of early 2026; Inertia gracefully degrades in unsupported browsers
2. **Fallback approach:** If supporting Firefox/Safari transitions is critical, wrap the page layout in a persistent `AnimatePresence` that is ABOVE the Inertia page swap point. The `AnimatePresence` component must never unmount -- only its children should change. Use a `key` prop tied to the current URL
3. **Avoid:** Using CSS Modules for animated components -- styles are wiped on page swap. Use Tailwind utility classes or a CSS-in-JS approach for elements involved in transitions
4. Never put `AnimatePresence` inside the page component itself -- it must wrap the swap point in the layout

**Detection (warning signs):**
- `exit` animations defined on page-level `motion.div` components but never visually playing
- Flash of unstyled content between page navigations
- `AnimatePresence` nested inside page components rather than wrapping them

**Phase relevance:** Must be solved during the animation/page-transition phase. The layout architecture must account for this from the start.

**Confidence:** HIGH -- confirmed via Inertia.js official docs (View Transitions API support in v2.2.13+), GitHub issues (#179, #810), and community reports.

---

### Pitfall 3: Inertia SSR SEO Gaps with Bilingual Meta Tags and Structured Data

**What goes wrong:** The site renders in the browser via Inertia (client-side hydration), so search engine crawlers -- especially those that don't execute JavaScript -- see either empty `<head>` tags or incorrect/missing meta data. Bilingual sites compound this because each language version needs its own `<title>`, `<meta description>`, OG tags, `hreflang` links, and JSON-LD structured data. Without proper SSR, the Arabic version may be invisible to search engines entirely.

**Why it happens:** Inertia's `<Head>` component manages meta tags client-side by default. Without SSR enabled and properly configured, crawlers receive the initial HTML shell with a bare `<head>`. Even with SSR enabled, developers often forget to:
- Set `hreflang` alternate links for each language version
- Provide locale-specific OG images and descriptions
- Generate separate sitemaps per locale
- Set the `lang` attribute on `<html>` per page

**Consequences:**
- Google indexes only one language version (usually English) or shows incorrect titles/descriptions
- Social media previews show English metadata when sharing Arabic URLs (or vice versa)
- No `hreflang` means search engines may treat EN and AR pages as duplicate content
- Missing structured data means no rich snippets for services, organization info, or blog articles

**Prevention:**
1. Enable Inertia SSR from the start (`build:ssr` script is already present in `package.json` -- good)
2. Create a Laravel middleware or helper that injects `hreflang` alternate tags into every response based on current locale and available translations
3. Use a server-side approach for critical SEO meta: render `<title>`, `<meta>`, OG tags, and `hreflang` from Laravel's Blade root template (outside the Inertia app div), not from React components alone
4. Set `<html lang="en" dir="ltr">` or `<html lang="ar" dir="rtl">` dynamically in the root Blade template based on the current locale
5. Generate locale-prefixed sitemaps: `/en/sitemap.xml` and `/ar/sitemap.xml` (or a single sitemap with `hreflang` annotations)
6. Add JSON-LD structured data server-side for Organization, Service, Article schemas

**Detection (warning signs):**
- Viewing page source shows empty `<title>` or generic title
- `curl` the URL and check if meta tags are present in the raw HTML
- Google Search Console showing "page not indexed" or "duplicate without canonical" for one language

**Phase relevance:** SSR setup should be in the foundation phase. SEO meta tag system must be built alongside the i18n routing system. Structured data and sitemaps can come in a later SEO-focused phase.

**Confidence:** HIGH -- confirmed via Inertia.js official documentation, Laravel community reports, and established SEO best practices.

---

### Pitfall 4: Admin File Upload Vulnerabilities (Polyglot Image Attacks)

**What goes wrong:** The admin panel allows uploading images for blog posts, portfolio items, team photos, and theme logos. Attackers (or compromised admin accounts) upload a file that passes MIME type validation as an image but contains embedded PHP code. If the file is stored in a publicly accessible, PHP-executable directory, the attacker achieves Remote Code Execution (RCE).

**Why it happens:** Laravel's built-in `image` validation rule checks MIME type via the file header (magic bytes), but polyglot files can have valid image magic bytes AND contain executable PHP. Multiple Laravel admin packages (laravel-admin, Voyager, Sharp) have had CVEs for exactly this vulnerability. The pattern is consistent: validate MIME type -> store in public directory -> attacker requests the file -> PHP executes it.

**Consequences:**
- Full server compromise via RCE
- Data exfiltration (database credentials, user data, admin secrets)
- Defacement of the live site

**Prevention:**
1. **Never store uploads in a PHP-executable directory.** Use Laravel's `storage` disk, not `public/uploads`. Serve files through a controller route or use signed URLs
2. **Re-encode all uploaded images** using Intervention Image (or similar). Re-encoding strips metadata and any embedded code: `Image::make($file)->encode('jpg')->save()`
3. **Validate beyond MIME type:** check file extension against a whitelist (`jpg`, `png`, `webp`, `svg`), validate actual image dimensions exist (malicious PHP files won't have valid dimensions), and reject anything that `getimagesize()` can't parse
4. **SVG uploads are especially dangerous** -- SVGs can contain JavaScript. Either reject SVG uploads entirely or sanitize them server-side (strip `<script>` tags, `on*` event attributes, external references)
5. **Disable PHP execution** in the upload directory via `.htaccess` or Nginx config: `location ~* /storage/.*\.php$ { deny all; }`
6. Add CSRF protection to all admin upload endpoints (Laravel does this by default with Inertia, but verify for any custom AJAX upload handlers)

**Detection (warning signs):**
- Uploads stored directly in `public/` directory
- No image re-encoding step in the upload pipeline
- SVG uploads accepted without sanitization
- `image` validation without additional extension/dimension checks

**Phase relevance:** Must be addressed when building the admin panel's file upload functionality. Non-negotiable security requirement.

**Confidence:** HIGH -- multiple CVEs documented (CVE-2023-24249 for laravel-admin, CVE-2026-33687 for Sharp), with exploit code publicly available.

---

## Moderate Pitfalls

Mistakes that cause significant rework or degraded UX, but not complete rewrites.

---

### Pitfall 5: Heavy Scroll Animations Destroying Core Web Vitals (CLS, LCP, INP)

**What goes wrong:** The scotchpos.com-inspired design calls for hero motion graphics, scroll-reveal animations, hover interactions, and page transitions. Each of these can individually hurt CLS, LCP, and INP scores. Combined, they can drop Lighthouse performance into the 30-50 range, harming SEO rankings and user experience on mobile devices.

**Why it happens:**
- **CLS (Cumulative Layout Shift):** Elements that animate into view from off-screen (scroll-reveal) cause layout shifts if they don't have reserved space. Text that loads after a custom Arabic font causes a reflow
- **LCP (Largest Contentful Paint):** Hero animations that use JavaScript to reveal the largest element delay LCP. If the hero image/text is hidden until an animation plays, the browser reports LCP after the animation completes
- **INP (Interaction to Next Paint):** Complex animation calculations on the main thread block user input responses. Parallax effects and scroll-linked animations running on every frame cause jank

**Prevention:**
1. **Reserve space for animated elements:** Use CSS `min-height` or aspect-ratio containers so scroll-reveal elements don't cause layout shifts when they appear
2. **LCP element must be visible immediately:** The hero's largest element (likely the heading or background image) must be in the initial render, not gated behind an animation. Animate secondary elements, not the primary content
3. **Use `transform` and `opacity` only** for animations -- these properties are composited on the GPU and don't trigger layout/paint. Never animate `height`, `width`, `margin`, `padding`, `top`, `left`
4. **Preload Arabic fonts** with `<link rel="preload">` and use `font-display: swap` or `font-display: optional` to prevent font-triggered CLS
5. **Lazy-initialize scroll animations:** Use `IntersectionObserver` (or Framer Motion's `whileInView`) to only run animations for visible elements. Don't attach scroll listeners to off-screen elements
6. **Test on real mobile devices,** not just Chrome DevTools throttling. Complex animations that run smoothly on a MacBook will stutter on a mid-range Android phone

**Detection (warning signs):**
- Lighthouse performance score below 80 on mobile
- Visible "jump" when scroll-reveal elements appear
- Hero content hidden behind `opacity: 0` or `display: none` on initial load
- Animations using properties other than `transform` and `opacity`

**Phase relevance:** Animation system design phase. Performance testing must happen during animation implementation, not retroactively.

**Confidence:** HIGH -- Core Web Vitals impact of animations is well-documented by Google and confirmed through multiple performance optimization guides.

---

### Pitfall 6: Arabic Typography Rendering Failures

**What goes wrong:** Arabic text appears broken: letters are disconnected (should be cursive-connected), diacritical marks (harakat) are clipped, underlines obscure letter dots, and `letter-spacing` makes words illegible. Line heights are too tight, cutting off characters that extend below the baseline (like the Arabic letter "yaa").

**Why it happens:** Developers use English-first CSS defaults. Standard `line-height: 1.5` is fine for Latin text but too tight for Arabic. `letter-spacing` breaks Arabic because Arabic is a cursive script where letters must connect. `text-decoration: underline` crosses through descender dots.

**Consequences:**
- Arabic text is literally unreadable in parts of the UI
- The site looks amateur to Arabic-speaking visitors, destroying trust
- Accessibility violations for Arabic content

**Prevention:**
1. **Set Arabic-specific line-height:** Use `leading-relaxed` (1.625) or `leading-loose` (2) for Arabic content, vs `leading-normal` (1.5) for English. Apply conditionally based on locale
2. **Never apply `letter-spacing` to Arabic text.** Use `tracking-normal` always for Arabic. If English sections use `tracking-wide`, conditionally remove it for `[lang="ar"]` or `[dir="rtl"]`
3. **Avoid `text-decoration: underline` for Arabic text** -- use `border-bottom` styling instead, which sits below the text and doesn't interfere with letter dots
4. **Choose proper Arabic fonts:** Don't rely on system sans-serif. Use a professionally designed Arabic-supporting font (e.g., Tajawal, Cairo, IBM Plex Arabic, Noto Sans Arabic). Pair it with the English font in the font stack: `font-family: 'Inter', 'Tajawal', sans-serif`
5. **Font loading strategy:** Arabic fonts are typically 200-500KB. Subset to needed character ranges, preload the primary Arabic font, and use `font-display: swap`

**Detection (warning signs):**
- Arabic letters appear separated/disconnected in any UI element
- Diacritical marks clipped at the top or bottom of text containers
- `letter-spacing` or `tracking-*` classes applied globally without locale exclusion
- No Arabic-specific font defined in the font stack

**Phase relevance:** Foundation phase when setting up the typography system and font loading. Must be validated before any content pages are built.

**Confidence:** HIGH -- Arabic typography requirements are well-established and these exact issues are repeatedly documented in RTL design guides.

---

### Pitfall 7: Content Translation Data Model That Doesn't Scale

**What goes wrong:** Every translatable field is stored as a JSON blob in the main table column (e.g., `title: {"en": "...", "ar": "..."}`). This works initially but creates problems: you can't query/search/filter by individual locale efficiently, the admin UI for editing becomes complex, and partial translations (content exists in EN but not AR) are hard to detect. Alternatively, using a separate translations table per model creates a proliferation of tables that are tedious to maintain.

**Why it happens:** Developers pick the simplest initial approach (usually JSON columns via `spatie/laravel-translatable`) without considering the downstream implications for search, admin UX, and translation completeness tracking.

**Consequences:**
- Cannot do `WHERE title LIKE '%keyword%'` efficiently for a specific locale on JSON columns (MySQL JSON queries are slower and index poorly for full-text search)
- Admin panel must build complex JSON-editing UIs for every translatable field
- No easy way to generate a "missing translations" report to identify incomplete Arabic content
- Blog search only works in one language or requires complex JSON path queries

**Prevention:**
1. **Use `spatie/laravel-translatable` (JSON approach) but with a clear strategy:** This is the right choice for a bilingual site with moderate content (not 50+ languages). JSON columns in MySQL 8+ / PostgreSQL support indexing and querying via JSON path operators
2. **Build a translation completeness checker** in the admin panel: scan all translatable models and flag entries where `ar` translation is missing or empty
3. **For blog search:** Use a dedicated search solution (Laravel Scout with Meilisearch or Algolia) that indexes content by locale separately, rather than querying JSON columns directly
4. **Admin UI:** Build a side-by-side translation editor (EN on left, AR on right) rather than separate forms per language. This makes missing translations visually obvious
5. **Validation:** Require both `en` and `ar` for critical fields (title, slug, meta description) at the model level. Allow `ar` to be optional for body content with a "draft" flag

**Detection (warning signs):**
- No search functionality working for Arabic content
- Admin editors can save content without any Arabic translation and there's no warning
- Blog posts appear on the Arabic site with English-only content or empty sections

**Phase relevance:** Must be decided in the database/model design phase (early). Migrating between JSON and separate-table approaches later is painful.

**Confidence:** MEDIUM -- both approaches are valid and commonly used. The pitfall is not choosing wrong but failing to plan for the implications of the choice.

---

### Pitfall 8: Admin Theme Customization Causing Unpredictable Color Contrast

**What goes wrong:** The admin panel allows changing primary/secondary colors and toggling dark/light mode. Admins pick colors that look good in light mode but have terrible contrast in dark mode (or vice versa). Yellow text on white background. Light gray text on light gray background. The site becomes unreadable for some color combinations, violating WCAG accessibility standards.

**Why it happens:** Dynamic theming via CSS custom properties means the color system is no longer under developer control at runtime. The admin picks a brand color; the system derives button colors, text colors, backgrounds, hover states, and focus rings from it. Without guardrails, derived colors can produce illegible combinations.

**Consequences:**
- Text becomes unreadable for certain admin-chosen color combinations
- WCAG contrast ratio violations (< 4.5:1 for normal text, < 3:1 for large text)
- Dark mode looks broken with certain primary colors (e.g., dark blue primary on dark background)
- Theme flicker on page load (SSR renders one theme, client hydration switches to another)

**Prevention:**
1. **Constrain the color picker** -- instead of a free-form color picker, offer a curated palette of pre-tested brand colors that are guaranteed to work in both light and dark modes
2. **If free-form colors are required:** Generate dark/light mode variants automatically using `oklch` color space (better perceptual uniformity than HSL). Derive light-mode and dark-mode surface/text colors from the chosen primary using lightness adjustments
3. **Runtime contrast checking:** When admin selects a color, calculate WCAG contrast ratio against the background and show a warning if it falls below 4.5:1
4. **Prevent theme flicker:** Store the theme preference in a cookie (not just localStorage) so the server can render the correct theme on first load. The Blade root template should read the cookie and set the appropriate class/data-attribute before React hydrates
5. **CSS custom properties architecture:** Define semantic tokens (`--color-primary`, `--color-surface`, `--color-on-primary`) not raw values. Light and dark modes swap the token values, not individual component styles

**Detection (warning signs):**
- No contrast validation in the admin color picker
- Theme stored only in localStorage (causes flash on server-rendered pages)
- Components using raw color values instead of semantic design tokens
- No dark mode preview in the admin theme editor

**Phase relevance:** Admin panel theming phase. Must be designed before implementing the color system.

**Confidence:** MEDIUM -- based on established design system practices and CSS custom property theming patterns. The specific constraint approach depends on the desired admin flexibility.

---

### Pitfall 9: Rich Text Editor Breaking in RTL / Producing LTR-Only HTML

**What goes wrong:** The blog rich text editor (likely TipTap, given the React ecosystem) defaults to LTR. Arabic content typed in the editor has incorrect text direction, mixed bidirectional text renders unpredictably, and the stored HTML lacks `dir` attributes on block elements. When rendered on the blog frontend, paragraphs in Arabic appear left-aligned with broken reading flow.

**Why it happens:** Rich text editors use the browser's contenteditable API, which relies on the Unicode Bidirectional Algorithm (UBA). The UBA works at the character level but doesn't set block-level direction. If the editor wrapper doesn't have `dir="rtl"`, Arabic text will be rendered LTR at the block level even though individual characters appear correct.

**Consequences:**
- Arabic blog posts have left-aligned text with broken paragraph flow
- Mixed content (English code snippets within Arabic text) renders unpredictably
- Editor toolbar icons and controls are mirrored incorrectly or not at all
- Stored HTML doesn't contain `dir` attributes, so frontend rendering also breaks

**Prevention:**
1. **Set editor direction based on current editing locale:** When editing in Arabic, set `dir="rtl"` on the editor root element. TipTap supports `textDirection: 'auto'` | `'ltr'` | `'rtl'` configuration
2. **Use TipTap's `TextDirection` extension** (or equivalent) to automatically detect and set direction per paragraph based on the first strong directional character
3. **Inject `dir` attributes into the stored HTML:** Each `<p>` or `<div>` should have `dir="rtl"` or `dir="ltr"` so the frontend renders correctly regardless of the page-level direction
4. **Test bidirectional content:** Write tests with mixed Arabic/English content, inline code blocks, and URLs within Arabic paragraphs
5. **Editor toolbar mirroring:** Ensure the toolbar layout reverses in RTL mode (alignment buttons, indent/outdent direction)

**Detection (warning signs):**
- Arabic text in the editor is left-aligned
- No `dir` attribute on rendered blog HTML paragraphs
- Toolbar indent/outdent buttons behave identically in LTR and RTL

**Phase relevance:** Blog system implementation phase. The editor configuration must be set up before content creation begins.

**Confidence:** MEDIUM -- TipTap's RTL support exists but has known issues (GitHub issue #3957). Thorough testing is required.

---

## Minor Pitfalls

Issues that cause developer friction or subtle bugs, but have straightforward fixes.

---

### Pitfall 10: Horizontal Scroll Animations Reversed in RTL Without Developer Awareness

**What goes wrong:** A horizontal marquee, carousel, or scroll-triggered horizontal slide looks correct in LTR but moves in the "wrong" direction in RTL. For example, a client logos marquee scrolls left-to-right in LTR but should scroll right-to-left in RTL. Developers often miss this because `dir="rtl"` does not affect CSS animation direction or JavaScript animation values.

**Prevention:**
1. Parameterize all horizontal animation values based on document direction
2. For CSS keyframe animations, create mirrored variants or use `animation-direction: reverse` conditionally
3. For Framer Motion / GSAP, read the current `dir` and multiply `x` values by `-1` for RTL
4. Carousel components (swipe direction, arrow placement) need explicit RTL configuration

**Phase relevance:** Animation implementation phase.

**Confidence:** HIGH

---

### Pitfall 11: URL-Based i18n Route Duplication and Middleware Complexity

**What goes wrong:** URL-based routing (`/en/services`, `/ar/services`) requires every route to be duplicated or wrapped in a locale prefix group. Middleware must detect the locale, set it globally, and ensure all generated URLs include the correct prefix. Missed routes show English content under `/ar/` URLs or throw 404s.

**Prevention:**
1. Use a single route group with `{locale}` prefix and a middleware that validates and sets `App::setLocale()`
2. Create a helper function for URL generation that always includes the current locale prefix (wrap Inertia's `route()` helper)
3. Redirect root `/` to the preferred locale based on browser `Accept-Language` header or a default
4. Add route tests that verify every public route responds correctly with both `/en/` and `/ar/` prefixes
5. Use Laravel's `Wayfinder` (already in the project) carefully -- ensure generated TypeScript route helpers include the locale parameter

**Phase relevance:** Foundation/routing phase.

**Confidence:** HIGH

---

### Pitfall 12: Font Loading Flash Causing CLS on Language Switch

**What goes wrong:** When switching from English to Arabic (or vice versa), the page re-renders with a different font family. If the Arabic font hasn't been loaded yet, the browser shows a fallback font (system sans-serif) and then swaps to the Arabic font, causing a visible layout shift and CLS penalty.

**Prevention:**
1. Preload both the English and Arabic fonts on every page (both are needed since some UI elements like navigation show content in the alternate language)
2. Use `font-display: optional` for non-critical Arabic font weights (browser will skip the font entirely if not cached, avoiding layout shift)
3. Use a font-matching fallback: configure `@font-face` override metrics (`ascent-override`, `descent-override`, `line-gap-override`) so the fallback font closely matches the Arabic font's metrics
4. Prefetch the alternate language's font in the `<head>` so it's cached before the user switches

**Phase relevance:** Typography/font system setup in the foundation phase.

**Confidence:** HIGH

---

### Pitfall 13: RBAC Permissions Bypass Through Inertia Prop Leaking

**What goes wrong:** Inertia passes all page props from the Laravel controller to the React frontend as JSON. If the controller doesn't carefully filter data based on the user's role, an editor-role user can inspect the browser's network tab and see admin-only data (other users' emails, site analytics, unpublished content by other authors). The React UI may hide admin buttons, but the data is fully exposed in the Inertia page props.

**Prevention:**
1. **Authorization in the controller, not the component:** Never pass data to the frontend that the current user shouldn't see. Use Laravel Policies and Gates to filter data before passing it to `Inertia::render()`
2. Use Inertia's `Lazy` and `Deferred` props for sensitive data -- only load it when explicitly requested, behind an authorization check
3. Never rely on hiding UI elements as a security measure -- always enforce permissions server-side
4. Audit all `Inertia::render()` calls to verify that props are scoped to the current user's permissions

**Phase relevance:** Admin panel RBAC implementation phase.

**Confidence:** HIGH -- this is a well-known pattern with Inertia.js and SPA architectures in general. Inertia's official docs emphasize this.

---

### Pitfall 14: Inertia SSR Node.js Process Memory Leaks in Production

**What goes wrong:** Inertia's SSR runs a persistent Node.js process that renders React components server-side. Over time, the process leaks memory (especially with complex components, large datasets, or animation library initialization in SSR context). After days of uptime, the process crashes or becomes unresponsive, causing the site to fall back to client-side-only rendering silently.

**Prevention:**
1. Monitor the SSR Node.js process memory usage in production
2. Set up a process manager (PM2 or systemd) with automatic restart on memory threshold (e.g., restart at 512MB)
3. Avoid importing animation libraries (Framer Motion, GSAP) in SSR context -- use dynamic imports with `typeof window !== 'undefined'` guards or React's `lazy()` for animation components
4. Keep SSR-rendered components simple -- the hero text, meta tags, and core content. Don't SSR complex interactive components
5. Test with `build:ssr` and run the SSR process under load to detect leaks before production deployment

**Phase relevance:** SSR setup and production deployment phase.

**Confidence:** MEDIUM -- memory leaks in SSR are a known category of issues but severity depends on the specific component tree and animation library usage.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| Foundation / Layout System | RTL treated as afterthought (Pitfall 1) | Use logical properties from first line of CSS; build and test every component in both directions simultaneously |
| Typography & Fonts | Arabic text rendering failures (Pitfall 6), font CLS (Pitfall 12) | Choose Arabic fonts early; set locale-conditional line-height/tracking; preload both font families |
| i18n Routing | Route duplication bugs (Pitfall 11) | Single `{locale}` prefix group with middleware; test every route in both locales |
| Animation System | Exit animations not playing (Pitfall 2), CWV degradation (Pitfall 5), RTL animation direction (Pitfall 10) | Use Inertia View Transitions API; reserve space for scroll-reveal elements; parameterize horizontal direction |
| Blog / Rich Text | Editor RTL failures (Pitfall 9), translation model issues (Pitfall 7) | Configure TipTap text direction per locale; plan JSON translation strategy with search and completeness tooling |
| Admin Panel | File upload RCE (Pitfall 4), RBAC prop leaking (Pitfall 13) | Re-encode uploads, store outside webroot; filter all Inertia props by user role |
| Theming (Dark/Light + Admin Colors) | Color contrast violations (Pitfall 8) | Constrain color picker or auto-derive accessible variants; cookie-based theme to prevent flicker |
| SEO | Missing bilingual meta/hreflang (Pitfall 3) | Server-side meta tags in Blade; hreflang middleware; locale-specific sitemaps |
| Production / SSR | Node.js SSR memory leaks (Pitfall 14) | Process manager with memory limits; avoid SSR-rendering animation libraries |

---

## Sources

- [Inertia.js SSR Documentation](https://inertiajs.com/server-side-rendering)
- [Inertia.js View Transitions](https://inertiajs.com/view-transitions)
- [Inertia.js Title & Meta](https://inertiajs.com/title-and-meta)
- [GitHub: Inertia Page Transitions Discussion #810](https://github.com/inertiajs/inertia/discussions/810)
- [GitHub: Framer Motion + Inertia exit animation issue](https://copyprogramming.com/howto/framer-motion-and-exit-property-not-working-with-inertiajs)
- [Tailwind CSS v4.0 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS RTL Discussion #1492](https://github.com/tailwindlabs/tailwindcss/discussions/1492)
- [Flowbite: Tailwind CSS RTL Guide](https://flowbite.com/docs/customize/rtl/)
- [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling/)
- [RTL Website Design Mistakes & Best Practices (Reffine)](https://www.reffine.com/en/blog/rtl-website-design-and-development-mistakes-best-practices)
- [Building Scalable RTL Design Systems](https://omaralmasry.com/blog/building%20scalable%20rtl%20design%20systems%20for%20arabic%20websites:%20strategies%20for%20enterprise%20success/)
- [CVE-2023-24249: laravel-admin Arbitrary File Upload](https://github.com/advisories/GHSA-g857-47pm-3r32)
- [CVE-2026-33687: Sharp Unrestricted File Upload](https://advisories.gitlab.com/pkg/composer/code16/sharp/CVE-2026-33687/)
- [Preventing Malware File Uploads in Laravel](https://medium.com/@rsharifur/how-to-prevent-malware-file-uploads-in-php-laravel-projects-a-web-developers-guide-0f9bf247554f)
- [Polyglot Image Upload Bypass](https://0xmar.medium.com/upload-bypass-using-magic-bytes-to-execute-php-code-via-polyglot-image-e3f03a1bd3ba)
- [Core Web Vitals Optimization Guide 2025](https://www.ableneo.com/insight/how-to-improve-core-web-vitals-lcp-inp-cls-in-modern-web-apps/)
- [TipTap Text Direction Docs](https://tiptap.dev/docs/examples/basics/text-direction)
- [GitHub: TipTap RTL Issue #3957](https://github.com/ueberdosis/tiptap/issues/3957)
- [spatie/laravel-translatable](https://github.com/spatie/laravel-translatable)
- [CSS-Tricks: Dark Mode Complete Guide](https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/)
- [Laravel Localization Docs](https://laravel.com/docs/12.x/localization)
- [butschster/LaravelMetaTags (hreflang support)](https://github.com/butschster/LaravelMetaTags)
