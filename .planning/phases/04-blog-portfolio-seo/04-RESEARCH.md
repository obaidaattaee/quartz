# Phase 4: Blog, Portfolio & SEO - Research

**Researched:** 2026-03-31
**Domain:** Blog system, portfolio gallery, SEO infrastructure (Laravel + Inertia + React)
**Confidence:** HIGH

## Summary

Phase 4 builds public-facing blog and portfolio pages on top of existing admin CRUD (Phase 3) and design system (Phase 1), plus site-wide SEO hardening. The codebase already has `BlogPost` and `PortfolioItem` models with bilingual fields, a Tiptap editor for content creation, and a `JsonLd` component for structured data. The primary work involves: (1) new database tables for categories, tags, and SEO metadata; (2) new public controllers and React pages for blog listing/detail, portfolio gallery/case study; (3) extending admin forms with category/tag selectors and SEO fields; (4) server-side meta tag rendering for social crawlers; (5) XML sitemap and RSS feed generation.

The most critical architectural finding is that **Inertia.js without SSR does not render React Head component output in the initial HTML**. Social crawlers (Facebook, Twitter, LinkedIn) will not see OG tags set only via the React Head component. The solution is to use Inertia's `withViewData()` method to pass meta data to the Blade template, rendering OG/canonical/hreflang tags server-side in `app.blade.php`. The React Head component should also set these tags for proper client-side navigation updates.

**Primary recommendation:** Use a dual-rendering strategy for SEO meta tags -- server-side via `withViewData()` in the Blade template for initial page loads and crawler visibility, plus client-side via Inertia Head component for SPA navigation. Install `@tailwindcss/typography` for blog post rich content rendering with the `prose` class.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Card-based grid layout for blog listing -- 2 columns on desktop (2x3 grid), single column on mobile. Each card shows: featured image, title, excerpt (2-3 lines), author avatar + name, publish date, category badge, and reading time estimate.
- D-02: Standard pagination with 6 posts per page. Numbered page buttons, not infinite scroll. Previous/Next navigation.
- D-03: Category filter on listing page using horizontal tab-style buttons (e.g., "All | Development | Automation | QA | Cybersecurity"). Tag pages accessible via tag links on individual posts.
- D-04: Separate `categories` table (id, name_en, name_ar, slug, sort_order) and `tags` table (id, name_en, name_ar, slug). Pivot tables `blog_post_category` and `blog_post_tag` for many-to-many relationships.
- D-05: A blog post can belong to multiple categories and multiple tags. Categories are admin-managed (pre-defined set matching service types + general topics). Tags are free-form, created inline during post editing.
- D-06: Category and tag archive pages show filtered post listings using the same card grid layout as the main blog listing.
- D-07: Blog post detail renders rich Tiptap content with proper typography, code blocks, images, and blockquotes. Reading time estimate displayed near the title -- calculated from word count (average 200 words/minute for English, 180 for Arabic).
- D-08: Author profile card displayed below the post content -- shows author photo, name, bio, and social links. Clicking the author name links to an author archive page listing all their published posts.
- D-09: Related posts section at the bottom showing 2-3 posts. Selection logic: posts sharing the same primary category first, then posts sharing tags, excluding the current post. Falls back to most recent posts if no matches.
- D-10: Social sharing buttons (LinkedIn, Twitter/X, WhatsApp) displayed as icon buttons near the post title. Uses share URLs (no SDK embeds).
- D-11: RSS feed auto-generated from published posts. Laravel route returning XML at `/feed.xml` (or `/en/feed.xml`, `/ar/feed.xml` per locale). No external package -- manual XML generation.
- D-12: Visual grid layout with uniform card sizes -- 3 columns on desktop, 2 on tablet, 1 on mobile. Each card shows: featured image filling the card, with a hover overlay revealing project title, service type badge, and client name.
- D-13: Tab-style filter by service type (Development, Automation, QA, Cybersecurity, All). Reuses the existing `service_category` column on `portfolio_items` table. Filter transitions use fade animation.
- D-14: Clicking a portfolio card navigates to the case study detail page.
- D-15: Case study detail follows a problem-approach-results narrative structure. Sections: hero with project title and client name, problem statement, approach/methodology, results with metrics, and before/after visuals.
- D-16: Before/after visuals use a side-by-side image layout -- two images in a flex row with labels "Before" and "After". Stacks vertically on mobile. RTL-safe (uses flex with logical properties). No interactive slider.
- D-17: Results metrics displayed as animated counters in a highlight card section. Reuses the scroll-triggered count-up animation pattern from Phase 02 statistics section. Metrics data comes from the existing `results_metrics` JSON column on `portfolio_items`.
- D-18: Add `meta_title_en`, `meta_title_ar`, `meta_description_en`, `meta_description_ar`, and `og_image_id` columns to both `blog_posts` and `portfolio_items` tables. Auto-fill from title/excerpt if left empty by admin. A separate `seo_metadata` table for static pages.
- D-19: Open Graph meta tags on every public page. Twitter Card meta tags included. Rendered via Inertia Head component, populated from database SEO fields.
- D-20: Auto-generated XML sitemap at `/sitemap.xml`. Generated dynamically by a Laravel controller. Includes lastmod, changefreq, and priority attributes.
- D-21: JSON-LD structured data using the existing `JsonLd` component. Schemas: Organization (site-wide), LocalBusiness (contact page), Service (service pages), Article (blog posts), FAQPage (FAQ -- already implemented in Phase 02).
- D-22: Canonical URLs on all pages. Hreflang tags linking EN/AR versions of each page.
- D-23: Admin can edit meta titles and descriptions for any page through the admin panel. Blog and portfolio SEO fields appear in their respective edit forms. Static page SEO edited through a new "SEO Settings" section in admin.

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

### Deferred Ideas (OUT OF SCOPE)
- Scheduled/draft post publishing with publish date -- v2 BLOG-10
- Content versioning / revision history -- v2 BLOG-11
- Video case studies with embedded player -- v2 PORT-05
- Newsletter integration with email service (Mailchimp/SendGrid) -- v2 ENGM-01
- Search functionality when blog exceeds 50+ posts -- v2 ENGM-02
- Cookie consent banner -- v2 CMPL-01
- Analytics dashboard integration -- v2 ADMN-13
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BLOG-01 | Blog listing page with pagination (6-10 posts per page) | Laravel paginate(6) + Inertia pagination props; card grid with ScrollReveal; established pattern from admin listing |
| BLOG-02 | Blog post detail page with rich content rendering | `@tailwindcss/typography` prose class for Tiptap HTML output; `dangerouslySetInnerHTML` pattern |
| BLOG-03 | Categories and tags with filterable category/tag pages | New categories/tags tables + pivot tables; horizontal tab filter UI; same card grid layout for archives |
| BLOG-04 | Author profiles with photo, bio, social links, authored posts | Add bio_en/ar, avatar_media_id, social_links JSON to users table; author archive page |
| BLOG-05 | SEO metadata per post (title, description, OG image) | New meta columns on blog_posts; `withViewData()` for server-side meta rendering; Inertia Head for client-side |
| BLOG-06 | Related posts section (2-3 posts by category/tag relevance) | Query: same-category posts first, then same-tag, fallback to recent; exclude current post |
| BLOG-07 | Reading time estimate displayed near title | Word count calculation: 200 wpm EN, 180 wpm AR; `strip_tags()` on content, split by whitespace |
| BLOG-08 | Social sharing buttons (LinkedIn, Twitter/X, WhatsApp) | URL-based sharing with `encodeURIComponent`; no SDK embeds; Lucide icons for platforms |
| BLOG-09 | RSS feed auto-generated from published posts | Laravel controller returning `Response` with `text/xml` content type; RSS 2.0 format; per-locale feeds |
| PORT-01 | Visual portfolio grid with hover previews and filtering | 3-column grid with image fill + hover overlay; tab filter by service_category; fade animation via Motion |
| PORT-02 | Case study detail pages with problem-approach-results | Structured sections; hero, problem, approach, results; Tiptap content rendering for descriptions |
| PORT-03 | Before/after visuals or image comparison layouts | Side-by-side flex layout with logical properties (RTL-safe); vertical stack on mobile; labeled containers |
| PORT-04 | Results metrics display with animated counters | Reuse `useCounter` hook from home page StatisticsSection; parse `results_metrics` JSON from PortfolioItem |
| SEO-01 | Admin-editable meta titles and descriptions per page | New `seo_metadata` table for static pages; SEO fields on blog/portfolio edit forms; admin SEO settings page |
| SEO-02 | Open Graph and social sharing meta tags on all pages | Dual rendering: server-side via `withViewData()` in Blade + client-side via Head component |
| SEO-03 | Auto-generated XML sitemap including all public routes | SitemapController generating XML response; includes static pages, blog posts, portfolio items with lastmod |
| SEO-04 | JSON-LD structured data (Organization, Service, Article, LocalBusiness, FAQ) | Existing JsonLd component; new schemas for Article/BlogPosting, Organization, Service, LocalBusiness |
| SEO-05 | Canonical URLs and hreflang tags linking EN/AR versions | Server-side rendering in Blade template; `<link rel="canonical">` and `<link rel="alternate" hreflang="">` |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Tech stack**: Laravel 12 + Inertia.js 3 + React + Tailwind CSS -- already established
- **Bilingual**: All user-facing content must work in both English (LTR) and Arabic (RTL)
- **SEO**: Server-side rendering via Inertia for search engine visibility
- **Admin UX**: Non-technical users must be able to manage all content without touching code
- **Code style**: Prettier with 4-space tabs, single quotes, semicolons always
- **Import paths**: Use `@/*` alias, never relative imports
- **Components**: PascalCase filenames, default exports for components
- **Hooks**: kebab-case with `use-` prefix
- **Types**: Centralized in `resources/js/types/`, re-exported from `index.ts`
- **GSD Workflow**: All changes through GSD commands

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Laravel | 13.2.0 | Backend framework | Already installed; controllers, models, migrations |
| Inertia.js | 3.0.0 | SPA bridge | Already installed; server-side routing with React rendering |
| React | 19.2.0 | UI framework | Already installed; all frontend components |
| Tailwind CSS | 4.0.0 | Styling | Already installed; utility-first CSS |
| Motion (Framer Motion) | 12.38.0 | Animations | Already installed; ScrollReveal, fade transitions |
| Tiptap | 3.21.0 | Rich text editor | Already installed; StarterKit, Image, Link extensions |
| Lucide React | 0.475.0 | Icons | Already installed; all icon needs |

### New Dependencies Required
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tailwindcss/typography | 0.5.19 | Prose class for rich content rendering | Blog post detail, portfolio case study content display |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @tailwindcss/typography | Custom prose CSS | Typography plugin handles all edge cases (tables, nested lists, blockquotes, code blocks) that custom CSS would miss; maintained by Tailwind team |
| Manual XML sitemap | spatie/laravel-sitemap | Package is overkill for a simple dynamic sitemap; manual gives full control with ~50 lines of code |
| RSS package | spatie/laravel-feed | Manual RSS 2.0 XML is straightforward (~40 lines); no need for package dependency |
| SSR for meta tags | withViewData() + Blade | SSR adds Node.js deployment complexity; `withViewData()` achieves same crawler visibility for meta tags |

**Installation:**
```bash
npm install @tailwindcss/typography
```

**CSS Configuration (add to `resources/css/app.css`):**
```css
@plugin "@tailwindcss/typography";
```

## Architecture Patterns

### New Files Structure
```
app/
├── Http/
│   ├── Controllers/
│   │   ├── BlogController.php          # Public blog pages
│   │   ├── PortfolioController.php     # Public portfolio pages
│   │   ├── SitemapController.php       # XML sitemap generation
│   │   ├── RssFeedController.php       # RSS feed generation
│   │   └── Admin/
│   │       ├── BlogPostController.php  # EXTEND with categories/tags/SEO
│   │       ├── PortfolioItemController.php  # EXTEND with SEO fields
│   │       ├── CategoryController.php  # NEW: Category CRUD
│   │       └── SeoSettingController.php # NEW: Static page SEO
│   └── Middleware/
│       └── ShareSeoData.php            # NEW: Inject SEO data into Blade
├── Models/
│   ├── Category.php                    # NEW
│   ├── Tag.php                         # NEW
│   ├── SeoMetadata.php                 # NEW
│   ├── BlogPost.php                    # EXTEND with relationships
│   ├── PortfolioItem.php               # EXTEND with SEO fields
│   └── User.php                        # EXTEND with author fields
├── Services/
│   └── SeoService.php                  # NEW: Meta tag resolution logic
database/
├── migrations/
│   ├── create_categories_table.php
│   ├── create_tags_table.php
│   ├── create_blog_post_category_table.php
│   ├── create_blog_post_tag_table.php
│   ├── create_seo_metadata_table.php
│   ├── add_seo_columns_to_blog_posts_table.php
│   ├── add_seo_columns_to_portfolio_items_table.php
│   └── add_author_profile_columns_to_users_table.php
resources/
├── js/
│   ├── pages/
│   │   ├── public/
│   │   │   ├── blog/
│   │   │   │   ├── index.tsx           # Blog listing with pagination
│   │   │   │   ├── show.tsx            # Blog post detail
│   │   │   │   ├── category.tsx        # Category archive
│   │   │   │   ├── tag.tsx             # Tag archive
│   │   │   │   └── author.tsx          # Author archive
│   │   │   └── portfolio/
│   │   │       ├── index.tsx           # Portfolio gallery grid
│   │   │       └── show.tsx            # Case study detail
│   │   └── admin/
│   │       ├── blog/
│   │       │   ├── create.tsx          # EXTEND with categories/tags/SEO
│   │       │   └── edit.tsx            # EXTEND with categories/tags/SEO
│   │       ├── portfolio/
│   │       │   ├── create.tsx          # EXTEND with SEO fields
│   │       │   └── edit.tsx            # EXTEND with SEO fields
│   │       ├── categories/
│   │       │   └── index.tsx           # Category management
│   │       └── seo/
│   │           └── index.tsx           # Static page SEO settings
│   ├── components/
│   │   ├── blog-card.tsx               # Blog post card for listing
│   │   ├── portfolio-card.tsx          # Portfolio item card with hover
│   │   ├── author-card.tsx             # Author profile card
│   │   ├── share-buttons.tsx           # Social sharing buttons
│   │   ├── reading-time.tsx            # Reading time display
│   │   ├── before-after-images.tsx     # Side-by-side image comparison
│   │   ├── seo-head.tsx               # Reusable SEO Head component
│   │   └── results-metrics.tsx         # Animated counter metrics
│   ├── types/
│   │   └── admin.ts                    # EXTEND with Category, Tag, SeoMetadata types
│   └── lib/
│       └── seo.ts                      # SEO helper functions (reading time, share URLs)
├── views/
│   └── app.blade.php                   # EXTEND with server-side meta tag rendering
```

### Pattern 1: Dual SEO Meta Tag Rendering (CRITICAL)
**What:** Render OG tags, canonical URLs, and hreflang tags both server-side (Blade) and client-side (Inertia Head).
**When to use:** Every public-facing page that needs social crawler visibility.
**Why:** Inertia without SSR only renders Head component output after JavaScript execution. Social crawlers (Facebook, LinkedIn, Twitter) and some search engine bots do not execute JavaScript. The `withViewData()` method passes data to the Blade template for server-rendered meta tags.

**Server-side (Controller):**
```php
// Source: Inertia.js documentation - https://inertiajs.com/responses
public function show(string $locale, string $slug)
{
    $post = BlogPost::with(['author', 'categories', 'tags', 'featuredImage'])
        ->where('slug', $slug)
        ->where('status', 'published')
        ->firstOrFail();

    $seo = [
        'title' => $locale === 'ar'
            ? ($post->meta_title_ar ?: $post->title_ar)
            : ($post->meta_title_en ?: $post->title_en),
        'description' => $locale === 'ar'
            ? ($post->meta_description_ar ?: $post->excerpt_ar)
            : ($post->meta_description_en ?: $post->excerpt_en),
        'image' => $post->ogImage?->url ?? $post->featuredImage?->url,
        'url' => url("/{$locale}/blog/{$slug}"),
        'type' => 'article',
        'canonical' => url("/en/blog/{$slug}"),
        'hreflang' => [
            'en' => url("/en/blog/{$slug}"),
            'ar' => url("/ar/blog/{$slug}"),
        ],
    ];

    return Inertia::render('public/blog/show', [
        'post' => $post,
        'relatedPosts' => $this->getRelatedPosts($post),
    ])->withViewData(['seo' => $seo]);
}
```

**Server-side (Blade template `app.blade.php`):**
```blade
@isset($seo)
    <meta name="description" content="{{ $seo['description'] ?? '' }}">
    <meta property="og:title" content="{{ $seo['title'] ?? config('app.name') }}">
    <meta property="og:description" content="{{ $seo['description'] ?? '' }}">
    <meta property="og:image" content="{{ $seo['image'] ?? '' }}">
    <meta property="og:url" content="{{ $seo['url'] ?? request()->url() }}">
    <meta property="og:type" content="{{ $seo['type'] ?? 'website' }}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $seo['title'] ?? config('app.name') }}">
    <meta name="twitter:description" content="{{ $seo['description'] ?? '' }}">
    <meta name="twitter:image" content="{{ $seo['image'] ?? '' }}">
    <link rel="canonical" href="{{ $seo['canonical'] ?? request()->url() }}">
    @isset($seo['hreflang'])
        @foreach($seo['hreflang'] as $lang => $href)
            <link rel="alternate" hreflang="{{ $lang }}" href="{{ $href }}">
        @endforeach
    @endisset
@endisset
```

**Client-side (React -- for SPA navigation):**
```tsx
// Source: Inertia.js documentation - https://inertiajs.com/title-and-meta
import { Head } from '@inertiajs/react';

function SeoHead({ seo }: { seo: SeoData }) {
    return (
        <Head>
            <title>{seo.title}</title>
            <meta head-key="description" name="description" content={seo.description} />
            <meta head-key="og:title" property="og:title" content={seo.title} />
            <meta head-key="og:description" property="og:description" content={seo.description} />
            <meta head-key="og:image" property="og:image" content={seo.image ?? ''} />
            <meta head-key="og:url" property="og:url" content={seo.url} />
            <meta head-key="og:type" property="og:type" content={seo.type} />
            <link head-key="canonical" rel="canonical" href={seo.canonical} />
        </Head>
    );
}
```

### Pattern 2: Rich Content Rendering with Tailwind Typography
**What:** Render Tiptap HTML content on public pages using the `prose` class for proper typography.
**When to use:** Blog post detail, portfolio case study content sections.
**Example:**
```tsx
// Tiptap outputs standard HTML (h2, h3, p, strong, em, ul, ol, blockquote, code, img, a)
// The prose class from @tailwindcss/typography styles all these elements
<article
    className={cn(
        'prose dark:prose-invert max-w-none',
        isRTL && 'prose-headings:text-right prose-p:text-right'
    )}
    dangerouslySetInnerHTML={{ __html: content }}
    dir={isRTL ? 'rtl' : 'ltr'}
/>
```

### Pattern 3: Reusable Blog Listing with Filter State
**What:** Blog card grid with category tab filter and pagination, reused across listing, category, tag, and author archive pages.
**When to use:** Any page displaying a list of blog posts.
**Example:**
```tsx
// The same card grid component is used across:
// - /en/blog (main listing)
// - /en/blog/category/{slug} (category archive)
// - /en/blog/tag/{slug} (tag archive)
// - /en/blog/author/{id} (author archive)

type BlogListingProps = {
    posts: PaginatedResponse<BlogPostSummary>;
    categories?: Category[];
    activeCategory?: string;
    title: string;
};
```

### Pattern 4: SEO Data Resolution with Fallbacks
**What:** Centralized logic for resolving meta title/description with fallback chain.
**When to use:** Every public controller that renders pages.
**Example:**
```php
// app/Services/SeoService.php
class SeoService
{
    public static function forBlogPost(BlogPost $post, string $locale): array
    {
        $title = $locale === 'ar'
            ? ($post->meta_title_ar ?: $post->title_ar)
            : ($post->meta_title_en ?: $post->title_en);

        $description = $locale === 'ar'
            ? ($post->meta_description_ar ?: $post->excerpt_ar)
            : ($post->meta_description_en ?: $post->excerpt_en);

        return [
            'title' => $title,
            'description' => Str::limit(strip_tags($description), 160),
            'image' => $post->ogImage?->url ?? $post->featuredImage?->url,
            // ... canonical, hreflang, type
        ];
    }

    public static function forStaticPage(string $pageKey, string $locale): array
    {
        $seo = SeoMetadata::where('page_key', $pageKey)->first();

        return [
            'title' => $locale === 'ar'
                ? ($seo->meta_title_ar ?? null)
                : ($seo->meta_title_en ?? null),
            'description' => $locale === 'ar'
                ? ($seo->meta_description_ar ?? null)
                : ($seo->meta_description_en ?? null),
            // ...
        ];
    }
}
```

### Anti-Patterns to Avoid
- **Client-only meta tags:** Never rely solely on the React Head component for OG tags -- social crawlers will not see them without SSR. Always pair with `withViewData()` for server-side rendering.
- **Inline Tiptap editor for rendering:** Do not instantiate a Tiptap editor instance on the public side just to render content. The HTML output is already valid HTML -- use `dangerouslySetInnerHTML` with the `prose` class instead.
- **N+1 queries on blog listing:** Always eager-load relationships (`author`, `featuredImage`, `categories`) when fetching post lists for cards.
- **Hardcoded category/tag slugs:** Use the slug from the database, not hardcoded values. Categories map to service types but may expand.
- **Building RSS with a package:** D-11 explicitly states no external package -- use a Laravel controller with `Response` and manual XML.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Rich text typography | Custom CSS for every HTML element | `@tailwindcss/typography` `prose` class | Handles 30+ HTML elements including nested lists, tables, blockquotes, code blocks, images; dark mode built-in |
| Reading time calculation | Complex NLP-based word counting | `strip_tags()` + `str_word_count()` (PHP) or split by whitespace (JS) | Simple and accurate enough; D-07 specifies 200 wpm EN / 180 wpm AR |
| Social sharing URLs | SDK embeds or iframe integrations | URL-based share links (`https://www.linkedin.com/shareArticle?...`) | D-10 explicitly requires URL-based sharing; faster, privacy-respecting, no third-party JS |
| Pagination UI | Custom pagination logic | Laravel's built-in `paginate()` + Inertia's pagination props | Already used in admin; handles edge cases, URL query strings |
| Slug generation | Custom slug function | Laravel `Str::slug()` (backend) + existing `slugify()` function (frontend) | Already established pattern in the codebase |
| Counter animations | Custom animation code | Existing `useCounter` hook from `@/hooks/use-counter.ts` | Already built and tested in Phase 02; uses `requestAnimationFrame` with easing |
| Scroll reveal animations | Custom intersection observer | Existing `ScrollReveal` component | Already built with reduced motion support; uses Motion library |

**Key insight:** Phase 4 should maximize reuse of Phase 01/02 components (ScrollReveal, useCounter, card patterns, animation variants) rather than building new animation/interaction primitives.

## Common Pitfalls

### Pitfall 1: Social Crawlers Missing OG Tags
**What goes wrong:** OG tags rendered only via React Head component are invisible to social crawlers that don't execute JavaScript (Facebook, LinkedIn, Twitter card validators).
**Why it happens:** Inertia without SSR renders React components client-side only. The initial HTML from Laravel contains only what's in the Blade template.
**How to avoid:** Use `withViewData()` to pass SEO data to the Blade template. Render meta tags in `app.blade.php` using `@isset($seo)` guards. The React Head component handles subsequent SPA navigations.
**Warning signs:** Open Graph Debugger (Facebook) shows blank/default data; Twitter Card Validator shows no image; LinkedIn preview shows only site name.

### Pitfall 2: Duplicate Meta Tags on Client-Side Navigation
**What goes wrong:** When navigating between pages via Inertia, meta tags from the previous page persist and duplicate with new ones.
**Why it happens:** Inertia Head component stacks all non-title tags unless `head-key` is used.
**How to avoid:** Always use `head-key` attribute on meta tags: `<meta head-key="description" name="description" content="..." />`. Each `head-key` value ensures only one instance exists.
**Warning signs:** Viewing page source after navigation shows multiple `og:title` or `description` meta tags.

### Pitfall 3: N+1 Query on Blog Listing
**What goes wrong:** Loading 6 blog posts with author, categories, and featured image triggers 6+ additional queries per relationship.
**Why it happens:** Eloquent lazy-loads relationships by default.
**How to avoid:** Always use `with()` for eager loading: `BlogPost::with(['author', 'categories', 'featuredImage'])`.
**Warning signs:** Laravel Debugbar shows 20+ queries on the blog listing page.

### Pitfall 4: Tiptap Content XSS Risk
**What goes wrong:** Using `dangerouslySetInnerHTML` with untrusted content could allow XSS attacks.
**Why it happens:** Tiptap HTML output from the admin editor could contain script tags if the editor allows arbitrary HTML.
**How to avoid:** The Tiptap editor with StarterKit only allows specific node types (paragraphs, headings, lists, etc.) -- it does NOT allow script tags or arbitrary HTML by design. The content stored in the database is already "sanitized" by Tiptap's schema. However, for defense in depth, consider stripping `<script>` tags server-side when serving content.
**Warning signs:** Content containing `<script>` tags executing on the public page.

### Pitfall 5: Prose Class RTL Issues
**What goes wrong:** The `prose` class from `@tailwindcss/typography` may not properly handle RTL text alignment and direction for Arabic content.
**Why it happens:** Typography plugin defaults to LTR text alignment.
**How to avoid:** Wrap content in a container with `dir="rtl"` for Arabic. Add RTL-specific prose overrides in CSS if needed. Test with actual Arabic blog content.
**Warning signs:** Arabic text left-aligned instead of right-aligned inside prose container; blockquote borders on wrong side.

### Pitfall 6: XML Sitemap Content-Type Header
**What goes wrong:** Browsers or search engines reject the sitemap because it returns with `text/html` content type.
**Why it happens:** Laravel's default response content type is `text/html`.
**How to avoid:** Set explicit content type: `return response($xml, 200, ['Content-Type' => 'application/xml'])`.
**Warning signs:** Sitemap opens as plain text in browser; Google Search Console reports sitemap errors.

### Pitfall 7: Category/Tag Filter Losing Pagination State
**What goes wrong:** Clicking a category filter resets pagination to page 1, but the URL still shows `?page=3`.
**Why it happens:** Filter navigation doesn't reset the page parameter.
**How to avoid:** When changing category/tag filter, navigate to the category/tag URL without preserving the page query parameter. Each filter change starts at page 1.
**Warning signs:** Empty results when filtering on later pages.

### Pitfall 8: Missing Hreflang Self-Reference
**What goes wrong:** Google ignores hreflang tags because the current page doesn't include a self-referencing hreflang.
**Why it happens:** Developers often only add the alternate language hreflang, not the current page's.
**How to avoid:** Always include BOTH hreflang tags: `<link rel="alternate" hreflang="en" href="...">` AND `<link rel="alternate" hreflang="ar" href="...">` on EVERY page, including a self-reference.
**Warning signs:** Google Search Console shows hreflang errors; language versions not connected in search results.

## Code Examples

Verified patterns from the existing codebase and official sources:

### Reading Time Calculation
```typescript
// Source: D-07 decision, standard word-count approach
export function calculateReadingTime(
    htmlContent: string,
    locale: 'en' | 'ar'
): number {
    // Strip HTML tags to get plain text
    const text = htmlContent.replace(/<[^>]*>/g, '');
    // Split by whitespace to count words
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    // Different reading speeds per language
    const wordsPerMinute = locale === 'ar' ? 180 : 200;

    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
```

### Social Share URLs
```typescript
// Source: D-10 decision, standard share URL patterns
export function getShareUrls(url: string, title: string) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return {
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    };
}
```

### RSS 2.0 Feed Generation
```php
// Source: D-11 decision, RSS 2.0 specification - https://www.rssboard.org/rss-specification
public function show(string $locale)
{
    $posts = BlogPost::where('status', 'published')
        ->with('featuredImage')
        ->orderBy('published_at', 'desc')
        ->take(20)
        ->get();

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">' . "\n";
    $xml .= '<channel>' . "\n";
    $xml .= '<title>' . e(config('app.name')) . '</title>' . "\n";
    $xml .= '<link>' . url("/{$locale}") . '</link>' . "\n";
    $xml .= '<description>' . e(config('app.name') . ' Blog') . '</description>' . "\n";
    $xml .= '<language>' . $locale . '</language>' . "\n";

    foreach ($posts as $post) {
        $title = $locale === 'ar' ? $post->title_ar : $post->title_en;
        $description = $locale === 'ar' ? $post->excerpt_ar : $post->excerpt_en;

        $xml .= '<item>' . "\n";
        $xml .= '<title>' . e($title) . '</title>' . "\n";
        $xml .= '<link>' . url("/{$locale}/blog/{$post->slug}") . '</link>' . "\n";
        $xml .= '<description>' . e($description) . '</description>' . "\n";
        $xml .= '<pubDate>' . $post->published_at->toRfc2822String() . '</pubDate>' . "\n";
        $xml .= '<guid>' . url("/{$locale}/blog/{$post->slug}") . '</guid>' . "\n";
        $xml .= '</item>' . "\n";
    }

    $xml .= '</channel></rss>';

    return response($xml, 200, ['Content-Type' => 'application/xml']);
}
```

### XML Sitemap Generation
```php
// Source: D-20 decision, Google sitemap protocol
public function index()
{
    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    // Static pages
    $staticPages = ['', '/about', '/contact', '/faq',
        '/services/development', '/services/automation',
        '/services/qa', '/services/cybersecurity',
        '/blog', '/portfolio'];

    foreach (['en', 'ar'] as $locale) {
        foreach ($staticPages as $page) {
            $xml .= '<url>';
            $xml .= '<loc>' . url("/{$locale}{$page}") . '</loc>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>0.8</priority>';
            $xml .= '</url>' . "\n";
        }
    }

    // Blog posts
    $posts = BlogPost::where('status', 'published')->get();
    foreach ($posts as $post) {
        foreach (['en', 'ar'] as $locale) {
            $xml .= '<url>';
            $xml .= '<loc>' . url("/{$locale}/blog/{$post->slug}") . '</loc>';
            $xml .= '<lastmod>' . $post->updated_at->toW3cString() . '</lastmod>';
            $xml .= '<changefreq>monthly</changefreq>';
            $xml .= '<priority>0.6</priority>';
            $xml .= '</url>' . "\n";
        }
    }

    // Portfolio items
    $items = PortfolioItem::where('status', 'published')->get();
    foreach ($items as $item) {
        foreach (['en', 'ar'] as $locale) {
            $xml .= '<url>';
            $xml .= '<loc>' . url("/{$locale}/portfolio/{$item->slug}") . '</loc>';
            $xml .= '<lastmod>' . $item->updated_at->toW3cString() . '</lastmod>';
            $xml .= '<changefreq>monthly</changefreq>';
            $xml .= '<priority>0.6</priority>';
            $xml .= '</url>' . "\n";
        }
    }

    $xml .= '</urlset>';

    return response($xml, 200, ['Content-Type' => 'application/xml']);
}
```

### BlogPosting JSON-LD Schema
```typescript
// Source: Google Article structured data - https://developers.google.com/search/docs/appearance/structured-data/article
const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.featuredImage?.url ? [url(post.featuredImage.url)] : [],
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
        '@type': 'Person',
        name: post.author.name,
        url: `/${locale}/blog/author/${post.author.id}`,
    },
    publisher: {
        '@type': 'Organization',
        name: 'Quart',
    },
};
```

### Organization JSON-LD Schema
```typescript
// Source: Google Organization structured data
const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Quart',
    url: url('/'),
    logo: siteSettings.logo_url,
    sameAs: [
        siteSettings.social_linkedin,
        siteSettings.social_twitter,
        siteSettings.social_github,
    ].filter(Boolean),
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: siteSettings.contact_phone,
        email: siteSettings.contact_email,
        contactType: 'customer service',
    },
};
```

### Related Posts Query
```php
// Source: D-09 decision
private function getRelatedPosts(BlogPost $post, int $limit = 3): Collection
{
    $categoryIds = $post->categories->pluck('id');
    $tagIds = $post->tags->pluck('id');

    // First: posts sharing categories
    $related = BlogPost::where('id', '!=', $post->id)
        ->where('status', 'published')
        ->whereHas('categories', fn ($q) => $q->whereIn('categories.id', $categoryIds))
        ->with(['featuredImage', 'author', 'categories'])
        ->orderBy('published_at', 'desc')
        ->take($limit)
        ->get();

    if ($related->count() < $limit) {
        // Fill with tag-related posts
        $existingIds = $related->pluck('id')->push($post->id);
        $tagRelated = BlogPost::where('status', 'published')
            ->whereNotIn('id', $existingIds)
            ->whereHas('tags', fn ($q) => $q->whereIn('tags.id', $tagIds))
            ->with(['featuredImage', 'author', 'categories'])
            ->orderBy('published_at', 'desc')
            ->take($limit - $related->count())
            ->get();
        $related = $related->merge($tagRelated);
    }

    if ($related->count() < $limit) {
        // Fallback to most recent
        $existingIds = $related->pluck('id')->push($post->id);
        $recent = BlogPost::where('status', 'published')
            ->whereNotIn('id', $existingIds)
            ->with(['featuredImage', 'author', 'categories'])
            ->orderBy('published_at', 'desc')
            ->take($limit - $related->count())
            ->get();
        $related = $related->merge($recent);
    }

    return $related;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind Typography via JS config | `@plugin "@tailwindcss/typography"` in CSS | Tailwind CSS v4 (2025) | CSS-based plugin registration; no config file needed |
| Inertia `@inertiaHead` directive | `<x-inertia::head>` component | Inertia v3 (2025) | Same functionality, component syntax |
| Framer Motion package | `motion` package | 2025 rebrand | Import from `motion/react` instead of `framer-motion` |
| JSON-LD NewsArticle for blogs | BlogPosting for blog content | Google recommendation | BlogPosting is more specific and appropriate for blog posts |

**Deprecated/outdated:**
- `framer-motion` package name: Project already uses `motion` (v12.38.0) correctly
- Tailwind Typography JS plugin config: Use `@plugin` CSS directive in v4
- `@inertiaHead` blade directive: Use `<x-inertia::head>` component (already used in codebase)

## Open Questions

1. **Tiptap RTL Rendering on Public Pages**
   - What we know: STATE.md notes "Tiptap RTL has known issues (GitHub #3957)." The admin editor uses a `direction` prop. Public rendering uses `dangerouslySetInnerHTML` with `dir="rtl"` on the container.
   - What's unclear: Whether the HTML output from Tiptap's Arabic content editor has proper RTL markers embedded, or if the container `dir="rtl"` is sufficient for all content types (code blocks, nested lists, mixed-direction text).
   - Recommendation: Test with real Arabic content during implementation. The `dir="rtl"` attribute on the prose container should handle most cases. If issues arise, add CSS overrides for specific prose elements.

2. **Before/After Images Data Model**
   - What we know: D-16 specifies side-by-side image layout. The PortfolioItem model has `content_en/ar` (longText) for rich content.
   - What's unclear: How before/after images are stored -- are they part of the Tiptap content, or separate columns? The CONTEXT.md doesn't specify a separate `before_image_id` / `after_image_id` column.
   - Recommendation: Add `before_image_id` and `after_image_id` foreign key columns to `portfolio_items` table. This keeps them separate from Tiptap content and allows the structured layout described in D-16. The planner should include a migration for these columns.

3. **Author Profile Data on User Model**
   - What we know: D-08 requires author photo, name, bio, and social links. The User model currently only has name, email, role.
   - What's unclear: Whether `bio_en`/`bio_ar` should be separate bilingual fields or a single `bio` field. Also whether author profiles should be a separate table or extend the users table.
   - Recommendation: Extend the `users` table with `bio_en` (text, nullable), `bio_ar` (text, nullable), `avatar_media_id` (FK to media, nullable), and `social_links` (JSON, nullable). This follows the established bilingual column pattern and keeps it simple since authors ARE users.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| PHP | Backend | Yes | 8.3.27 | -- |
| Node.js | Frontend build | Yes | 20.19.5 | -- |
| NPM | Package management | Yes | 10.8.2 | -- |
| Laravel | Backend framework | Yes | 13.2.0 | -- |
| SQLite | Development DB | Yes | (built-in) | -- |
| @tailwindcss/typography | Rich content styling | No (needs install) | 0.5.19 (latest) | Custom prose CSS (not recommended) |

**Missing dependencies with no fallback:**
- None -- all critical dependencies are available

**Missing dependencies with fallback:**
- `@tailwindcss/typography` needs to be installed via `npm install @tailwindcss/typography` and added to CSS via `@plugin`

## Database Schema Reference

### New Tables

**categories**
```
id              - bigint PK
name_en         - varchar(255)
name_ar         - varchar(255)
slug            - varchar(255) UNIQUE
sort_order      - integer DEFAULT 0
created_at      - timestamp
updated_at      - timestamp
```

**tags**
```
id              - bigint PK
name_en         - varchar(255)
name_ar         - varchar(255)
slug            - varchar(255) UNIQUE
created_at      - timestamp
updated_at      - timestamp
```

**blog_post_category** (pivot)
```
blog_post_id    - FK -> blog_posts.id CASCADE
category_id     - FK -> categories.id CASCADE
PRIMARY KEY (blog_post_id, category_id)
```

**blog_post_tag** (pivot)
```
blog_post_id    - FK -> blog_posts.id CASCADE
tag_id          - FK -> tags.id CASCADE
PRIMARY KEY (blog_post_id, tag_id)
```

**seo_metadata**
```
id                      - bigint PK
page_key                - varchar(255) UNIQUE (e.g., 'home', 'about', 'contact', 'faq', 'services.development')
meta_title_en           - varchar(255) nullable
meta_title_ar           - varchar(255) nullable
meta_description_en     - text nullable
meta_description_ar     - text nullable
og_image_id             - FK -> media.id nullable
created_at              - timestamp
updated_at              - timestamp
```

### Altered Tables

**blog_posts** (add columns)
```
meta_title_en           - varchar(255) nullable
meta_title_ar           - varchar(255) nullable
meta_description_en     - text nullable
meta_description_ar     - text nullable
og_image_id             - FK -> media.id nullable
```

**portfolio_items** (add columns)
```
meta_title_en           - varchar(255) nullable
meta_title_ar           - varchar(255) nullable
meta_description_en     - text nullable
meta_description_ar     - text nullable
og_image_id             - FK -> media.id nullable
before_image_id         - FK -> media.id nullable
after_image_id          - FK -> media.id nullable
```

**users** (add columns)
```
bio_en                  - text nullable
bio_ar                  - text nullable
avatar_media_id         - FK -> media.id nullable
social_links            - json nullable
```

### New Routes Summary

**Public routes (under `/{locale}` prefix with SetLocale middleware):**
```
GET  /{locale}/blog                      -> BlogController@index
GET  /{locale}/blog/{slug}               -> BlogController@show
GET  /{locale}/blog/category/{slug}      -> BlogController@category
GET  /{locale}/blog/tag/{slug}           -> BlogController@tag
GET  /{locale}/blog/author/{user}        -> BlogController@author
GET  /{locale}/portfolio                 -> PortfolioController@index
GET  /{locale}/portfolio/{slug}          -> PortfolioController@show
```

**Non-locale routes:**
```
GET  /sitemap.xml                        -> SitemapController@index
GET  /{locale}/feed.xml                  -> RssFeedController@show
```

**Admin routes (extend existing):**
```
GET    /admin/categories                 -> CategoryController@index
POST   /admin/categories                 -> CategoryController@store
PUT    /admin/categories/{category}      -> CategoryController@update
DELETE /admin/categories/{category}      -> CategoryController@destroy
GET    /admin/seo                        -> SeoSettingController@index
PUT    /admin/seo                        -> SeoSettingController@update
```

## Sources

### Primary (HIGH confidence)
- Existing codebase analysis -- models, controllers, migrations, components, routes
- Inertia.js documentation (https://inertiajs.com/title-and-meta, https://inertiajs.com/responses) -- Head component, withViewData API
- Google Article structured data (https://developers.google.com/search/docs/appearance/structured-data/article) -- BlogPosting JSON-LD schema
- RSS 2.0 specification (https://www.rssboard.org/rss-specification) -- Feed format requirements
- Tailwind CSS v4 documentation -- `@plugin` directive for typography plugin
- npm registry -- `@tailwindcss/typography` v0.5.19 confirmed compatible with Tailwind CSS v4

### Secondary (MEDIUM confidence)
- GitHub discussions on Tailwind v4 typography configuration (https://github.com/tailwindlabs/tailwindcss/discussions/15904) -- `@plugin` import syntax verified
- Inertia.js SSR documentation (https://inertiajs.com/server-side-rendering) -- confirmed SSR not configured in project

### Tertiary (LOW confidence)
- Tiptap RTL issues (GitHub #3957 referenced in STATE.md) -- needs validation during implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- only one new dependency (`@tailwindcss/typography`), everything else already installed
- Architecture: HIGH -- patterns follow established codebase conventions, dual SEO rendering verified against Inertia docs
- Pitfalls: HIGH -- based on direct Inertia documentation analysis and known SSR limitations
- Database schema: HIGH -- follows existing bilingual column pattern, pivot table pattern is standard Laravel
- SEO implementation: HIGH -- `withViewData()` verified in Inertia docs; JSON-LD schemas from Google documentation

**Research date:** 2026-03-31
**Valid until:** 2026-04-30 (stable domain, no fast-moving dependencies)
