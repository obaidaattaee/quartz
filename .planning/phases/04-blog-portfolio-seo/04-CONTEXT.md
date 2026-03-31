# Phase 4: Blog, Portfolio & SEO - Context

**Gathered:** 2026-03-31 (auto mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Public-facing blog system with listing, detail pages, categories/tags, author profiles, RSS feed, and social sharing. Portfolio gallery with filterable grid and case study detail pages with before/after visuals and results metrics. SEO hardening across the entire site: admin-editable meta titles/descriptions, Open Graph tags, canonical URLs, hreflang tags, XML sitemap, and JSON-LD structured data. All pages bilingual (EN/AR) using the established i18n and design system from Phase 01.

</domain>

<decisions>
## Implementation Decisions

### Blog Listing & Pagination
- **D-01:** Card-based grid layout for blog listing — 2 columns on desktop (2x3 grid), single column on mobile. Each card shows: featured image, title, excerpt (2-3 lines), author avatar + name, publish date, category badge, and reading time estimate. Consistent with the card patterns established in Phase 01/02.
- **D-02:** Standard pagination with 6 posts per page (BLOG-01 lower bound). Numbered page buttons, not infinite scroll (explicitly out of scope per REQUIREMENTS.md). Previous/Next navigation.
- **D-03:** Category filter on listing page using horizontal tab-style buttons (e.g., "All | Development | Automation | QA | Cybersecurity"). Tag pages accessible via tag links on individual posts.

### Categories & Tags Schema
- **D-04:** Separate `categories` table (id, name_en, name_ar, slug, sort_order) and `tags` table (id, name_en, name_ar, slug). Pivot tables `blog_post_category` and `blog_post_tag` for many-to-many relationships. This supports SEO-friendly URLs like `/en/blog/category/development` and `/en/blog/tag/laravel`.
- **D-05:** A blog post can belong to multiple categories and multiple tags. Categories are admin-managed (pre-defined set matching service types + general topics). Tags are free-form, created inline during post editing.
- **D-06:** Category and tag archive pages show filtered post listings using the same card grid layout as the main blog listing (BLOG-03).

### Blog Post Detail Page
- **D-07:** Blog post detail renders rich Tiptap content with proper typography, code blocks, images, and blockquotes. Reading time estimate displayed near the title (BLOG-07) — calculated from word count (average 200 words/minute for English, 180 for Arabic).
- **D-08:** Author profile card displayed below the post content — shows author photo, name, bio, and social links (BLOG-04). Clicking the author name links to an author archive page listing all their published posts.
- **D-09:** Related posts section at the bottom showing 2-3 posts (BLOG-06). Selection logic: posts sharing the same primary category first, then posts sharing tags, excluding the current post. Falls back to most recent posts if no matches.
- **D-10:** Social sharing buttons (LinkedIn, Twitter/X, WhatsApp) displayed as icon buttons near the post title (BLOG-08). Uses share URLs (no SDK embeds) — simple, fast, privacy-respecting.
- **D-11:** RSS feed auto-generated from published posts (BLOG-09). Laravel route returning XML at `/feed.xml` (or `/en/feed.xml`, `/ar/feed.xml` per locale). No external package — manual XML generation via Blade template or controller response.

### Portfolio Gallery
- **D-12:** Visual grid layout with uniform card sizes — 3 columns on desktop, 2 on tablet, 1 on mobile. Each card shows: featured image filling the card, with a hover overlay revealing project title, service type badge, and client name. Consistent with dark premium aesthetic from Phase 01.
- **D-13:** Tab-style filter by service type (Development, Automation, QA, Cybersecurity, All). Reuses the existing `service_category` column on `portfolio_items` table. Filter transitions use fade animation.
- **D-14:** Clicking a portfolio card navigates to the case study detail page.

### Case Study Detail Pages
- **D-15:** Case study detail follows a problem-approach-results narrative structure (PORT-02). Sections: hero with project title and client name, problem statement, approach/methodology, results with metrics, and before/after visuals.
- **D-16:** Before/after visuals use a side-by-side image layout — two images in a flex row with labels "Before" and "After" (PORT-03). Stacks vertically on mobile. RTL-safe (uses flex with logical properties). No interactive slider — simpler implementation, works universally.
- **D-17:** Results metrics displayed as animated counters in a highlight card section (PORT-04). Reuses the scroll-triggered count-up animation pattern from Phase 02 statistics section. Metrics data comes from the existing `results_metrics` JSON column on `portfolio_items`.

### SEO Implementation
- **D-18:** Add `meta_title_en`, `meta_title_ar`, `meta_description_en`, `meta_description_ar`, and `og_image_id` columns to both `blog_posts` and `portfolio_items` tables. Auto-fill from title/excerpt if left empty by admin. A separate `seo_metadata` table (page_key, meta_title_en/ar, meta_description_en/ar, og_image_id) stores SEO data for static pages (home, about, contact, services, FAQ).
- **D-19:** Open Graph meta tags (og:title, og:description, og:image, og:url, og:type) on every public page (SEO-02). Twitter Card meta tags included. Rendered via Inertia Head component, populated from database SEO fields.
- **D-20:** Auto-generated XML sitemap at `/sitemap.xml` including all public routes, published blog posts, and published portfolio items (SEO-03). Generated dynamically by a Laravel controller — no package dependency. Includes lastmod, changefreq, and priority attributes.
- **D-21:** JSON-LD structured data using the existing `JsonLd` component (SEO-04). Schemas: Organization (site-wide), LocalBusiness (contact page), Service (service pages), Article (blog posts), FAQPage (FAQ — already implemented in Phase 02). Validated against Google Rich Results Test.
- **D-22:** Canonical URLs on all pages. Hreflang tags linking EN/AR versions of each page (SEO-05). Format: `<link rel="alternate" hreflang="en" href="..." />` and `<link rel="alternate" hreflang="ar" href="..." />`. Rendered via Inertia Head component.
- **D-23:** Admin can edit meta titles and descriptions for any page through the admin panel (SEO-01). Blog and portfolio SEO fields appear in their respective edit forms. Static page SEO edited through a new "SEO Settings" section in admin.

### Claude's Discretion
- Blog card hover effects and transition timing
- Exact reading time calculation formula refinements
- Related posts algorithm edge cases and fallback behavior
- Portfolio hover overlay opacity and animation style
- XML sitemap changefreq and priority values per page type
- JSON-LD schema field completeness (which optional fields to include)
- RSS feed format details (Atom vs RSS 2.0)
- Social sharing button placement and styling refinements
- Before/after image container aspect ratio handling
- Category/tag slug generation rules

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Blog Requirements
- `.planning/REQUIREMENTS.md` -- BLOG-01 through BLOG-09: Listing, detail, categories/tags, author profiles, SEO per post, related posts, reading time, social sharing, RSS feed

### Portfolio Requirements
- `.planning/REQUIREMENTS.md` -- PORT-01 through PORT-04: Visual grid, case study detail, before/after visuals, result metrics

### SEO Requirements
- `.planning/REQUIREMENTS.md` -- SEO-01 through SEO-05: Meta tags, OG tags, XML sitemap, JSON-LD structured data, canonical URLs, hreflang

### Existing Models & Migrations (Phase 3)
- `app/Models/BlogPost.php` -- Blog post model with bilingual fields, author relationship, featured image
- `app/Models/PortfolioItem.php` -- Portfolio model with service_category, results_metrics JSON, sort_order
- `database/migrations/2026_03_28_000006_create_blog_posts_table.php` -- Blog posts schema (title, slug, excerpt, content, status, published_at)
- `database/migrations/2026_03_28_000007_create_portfolio_items_table.php` -- Portfolio items schema (title, slug, description, content, service_category, results_metrics)

### Existing Components (Reuse)
- `resources/js/components/json-ld.tsx` -- JsonLd component for structured data injection (used in FAQ page)
- `resources/js/components/scroll-reveal.tsx` -- ScrollReveal for section animations
- `resources/js/lib/animations.ts` -- Motion animation variants (fadeInUp, stagger, etc.)
- `resources/js/hooks/use-locale.tsx` -- i18n hook for translations and locale detection
- `resources/js/layouts/public-layout.tsx` -- PublicLayout shell (header, footer) for all public pages
- `resources/js/pages/public/home.tsx` -- Landing page with statistics counters (reuse counter pattern for portfolio metrics)

### Admin Pages (Extend with SEO fields)
- `resources/js/pages/admin/blog/` -- Blog post admin CRUD (add SEO fields to create/edit forms)
- `resources/js/pages/admin/portfolio/` -- Portfolio admin CRUD (add SEO fields to create/edit forms)

### Prior Phase Context
- `.planning/phases/01-foundation-design-system/01-CONTEXT.md` -- Brand colors, animation personality, card patterns, typography
- `.planning/phases/02-public-marketing-site/02-CONTEXT.md` -- Content data strategy, statistics counter pattern, landing page structure
- `.planning/phases/03-admin-panel/03-CONTEXT.md` -- Tiptap editor, bilingual tabs, media library, admin layout, data migration strategy

### Project Context
- `.planning/PROJECT.md` -- Vision, constraints, key decisions
- `.planning/ROADMAP.md` -- Phase 4 success criteria and requirement mapping
- `.planning/STATE.md` -- Known blocker: Tiptap RTL issues (GitHub #3957) need validation

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `BlogPost` model -- bilingual fields, author relationship, featured image FK, status enum (draft/published), published_at datetime. Ready for public queries (scope by published status).
- `PortfolioItem` model -- bilingual fields, service_category, results_metrics JSON, sort_order, featured image FK. Ready for public display with filtering.
- `JsonLd` component -- renders JSON-LD script tags via Inertia Head. Already used in FAQ page. Extend for Article, Organization, Service, LocalBusiness schemas.
- `ScrollReveal` component -- scroll-triggered fade animations. Use on blog listing, portfolio grid, case study sections.
- Statistics counter pattern from Phase 02 home page -- requestAnimationFrame count-up animation triggered on scroll. Reuse for portfolio results metrics (PORT-04).
- `PublicLayout` -- header/footer shell for all public pages. Blog and portfolio pages use this.
- `useLocale()` hook -- locale detection, translation, direction, RTL support.
- Tiptap editor (admin) -- already configured for blog post content creation. Public rendering needs a Tiptap content renderer or HTML sanitization approach.
- Media library -- upload/browse/reuse system. Blog featured images and portfolio images already use this.
- Admin blog/portfolio CRUD pages -- exist at `resources/js/pages/admin/blog/` and `resources/js/pages/admin/portfolio/`. SEO meta fields need to be added to these forms.

### Established Patterns
- Card-based layouts with hover micro-interactions (Phase 01 design system)
- Inertia `Head` component for per-page meta tags -- extend for OG tags, hreflang, canonical
- `Component.layout` pattern for assigning PublicLayout to pages
- Laravel controllers render Inertia pages with props
- Route grouping under locale prefix (`/en/...`, `/ar/...`)
- Bilingual columns (`title_en`, `title_ar`) on all content models
- CSS custom properties (oklch) for brand theming

### Integration Points
- `routes/web.php` -- add public blog routes (`/en/blog`, `/en/blog/{slug}`, `/en/blog/category/{slug}`, `/en/blog/tag/{slug}`), portfolio routes (`/en/portfolio`, `/en/portfolio/{slug}`), sitemap, RSS feed
- `database/migrations/` -- new tables: categories, tags, blog_post_category, blog_post_tag, seo_metadata. Alter blog_posts and portfolio_items for SEO columns.
- `app/Models/` -- new models: Category, Tag. Update BlogPost with category/tag relationships.
- `app/Models/User.php` -- add bio, social_links (JSON), and avatar fields for author profiles (BLOG-04)
- `resources/js/pages/public/` -- new pages: blog/index, blog/show, blog/category, blog/tag, blog/author, portfolio/index, portfolio/show
- `resources/js/components/` -- new components: blog-card, portfolio-card, author-card, share-buttons, reading-time, before-after-images
- `app/Http/Controllers/` -- new public controllers: BlogController, PortfolioController, SitemapController, RssFeedController

</code_context>

<specifics>
## Specific Ideas

- Blog cards should follow the same dark premium card aesthetic from Phase 01 — subtle shadows, rounded corners, hover lift effect
- Portfolio grid hover overlay should feel premium — smooth opacity transition revealing project info over the image
- Statistics counter reuse from Phase 02 creates visual consistency between landing page and portfolio case studies
- Social sharing buttons should be minimal and clean — icon-only, matching the site's teal accent color
- RSS feed and sitemap are SEO infrastructure — they don't need a visual design, just correct XML output
- Author profiles add credibility to the blog — showing real people behind the content builds trust (aligns with core value)
- Category/tag system maps naturally to the 4 service types (dev, automation, QA, cybersecurity) plus general topics

</specifics>

<deferred>
## Deferred Ideas

- Scheduled/draft post publishing with publish date -- v2 BLOG-10
- Content versioning / revision history -- v2 BLOG-11
- Video case studies with embedded player -- v2 PORT-05
- Newsletter integration with email service (Mailchimp/SendGrid) -- v2 ENGM-01
- Search functionality when blog exceeds 50+ posts -- v2 ENGM-02
- Cookie consent banner -- v2 CMPL-01
- Analytics dashboard integration -- v2 ADMN-13

</deferred>

---

*Phase: 04-blog-portfolio-seo*
*Context gathered: 2026-03-31*
