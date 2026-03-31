---
phase: 04-blog-portfolio-seo
plan: 01
subsystem: database, seo
tags: [eloquent, migrations, seo, og-tags, hreflang, tailwind-typography, react, inertia]

# Dependency graph
requires:
  - phase: 03-admin-panel
    provides: "BlogPost, PortfolioItem, User, Media models; admin types"
provides:
  - "Category and Tag models with many-to-many relationships to BlogPost"
  - "SeoMetadata model for static page SEO management"
  - "SeoService with forBlogPost, forPortfolioItem, forStaticPage methods"
  - "Server-side OG/canonical/hreflang meta tags in app.blade.php"
  - "SeoHead React component for client-side SPA navigation meta tags"
  - "BlogPost and PortfolioItem SEO columns (meta_title, meta_description, og_image)"
  - "User author profile columns (bio_en/ar, avatar_media_id, social_links)"
  - "PortfolioItem before/after image columns"
  - "TypeScript types for blog/portfolio public pages and admin entities"
  - "Reading time calculator and share URL helpers"
  - "@tailwindcss/typography for prose content rendering"
affects: [04-02, 04-03, 04-04, 04-05, 04-06]

# Tech tracking
tech-stack:
  added: ["@tailwindcss/typography@0.5.19"]
  patterns: ["Dual-render SEO strategy (Blade server-side + SeoHead client-side)", "withViewData(['seo' => ...]) pattern for passing SEO data to Blade", "head-key attribute deduplication for Inertia Head"]

key-files:
  created:
    - "database/migrations/2026_03_31_000001_create_categories_table.php"
    - "database/migrations/2026_03_31_000002_create_tags_table.php"
    - "database/migrations/2026_03_31_000003_create_blog_post_category_table.php"
    - "database/migrations/2026_03_31_000004_create_blog_post_tag_table.php"
    - "database/migrations/2026_03_31_000005_create_seo_metadata_table.php"
    - "database/migrations/2026_03_31_000006_add_seo_columns_to_blog_posts_table.php"
    - "database/migrations/2026_03_31_000007_add_seo_columns_to_portfolio_items_table.php"
    - "database/migrations/2026_03_31_000008_add_author_profile_columns_to_users_table.php"
    - "database/migrations/2026_03_31_000009_add_before_after_images_to_portfolio_items_table.php"
    - "app/Models/Category.php"
    - "app/Models/Tag.php"
    - "app/Models/SeoMetadata.php"
    - "app/Services/SeoService.php"
    - "resources/js/components/seo-head.tsx"
    - "resources/js/lib/seo.ts"
    - "resources/js/types/blog.ts"
  modified:
    - "app/Models/BlogPost.php"
    - "app/Models/PortfolioItem.php"
    - "app/Models/User.php"
    - "resources/views/app.blade.php"
    - "resources/js/types/admin.ts"
    - "resources/js/types/index.ts"
    - "resources/css/app.css"

key-decisions:
  - "Dual-render SEO: server-side Blade meta tags for crawlers + SeoHead React component for SPA navigation"
  - "Static SeoService class with data-array returns compatible with withViewData pattern"

patterns-established:
  - "SeoService::forX() returns array for withViewData(['seo' => ...]) -- controllers use this to inject SEO into Blade"
  - "SeoHead component uses head-key attributes on meta tags to prevent duplicates during Inertia navigation"
  - "Reading time: 200 wpm English, 180 wpm Arabic"

requirements-completed: [BLOG-03, BLOG-04, BLOG-05, BLOG-07, SEO-01, SEO-02, SEO-05]

# Metrics
duration: 4min
completed: 2026-03-31
---

# Phase 04 Plan 01: Blog/Portfolio/SEO Foundation Summary

**Database schema for categories/tags/SEO metadata, SeoService with dual-render strategy, SeoHead React component, TypeScript types, and reading time/share helpers**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-31T03:12:19Z
- **Completed:** 2026-03-31T03:16:31Z
- **Tasks:** 2
- **Files modified:** 25

## Accomplishments
- Created 9 database migrations adding categories, tags, SEO metadata, pivot tables, and new columns to blog_posts/portfolio_items/users
- Built SeoService with forBlogPost, forPortfolioItem, and forStaticPage methods that resolve SEO data with fallback chains
- Implemented dual-render SEO strategy: server-side OG/canonical/hreflang tags in app.blade.php for crawlers + SeoHead React component for SPA navigation
- Defined comprehensive TypeScript types for blog/portfolio public pages (BlogPostSummary, BlogPostDetail, etc.) and admin entities (AdminCategory, AdminTag, SeoMetadataItem)
- Created reading time calculator and social share URL helpers

## Task Commits

Each task was committed atomically:

1. **Task 1: Database schema -- migrations, models, and relationships** - `e02e5ea` (feat)
2. **Task 2: SEO infrastructure -- SeoService, Blade template, SeoHead component, types, helpers** - `263230a` (feat)

## Files Created/Modified
- `database/migrations/2026_03_31_000001_create_categories_table.php` - Categories table with bilingual names and sort_order
- `database/migrations/2026_03_31_000002_create_tags_table.php` - Tags table with bilingual names
- `database/migrations/2026_03_31_000003_create_blog_post_category_table.php` - Blog post to category pivot table
- `database/migrations/2026_03_31_000004_create_blog_post_tag_table.php` - Blog post to tag pivot table
- `database/migrations/2026_03_31_000005_create_seo_metadata_table.php` - SEO metadata for static pages
- `database/migrations/2026_03_31_000006_add_seo_columns_to_blog_posts_table.php` - SEO columns on blog_posts
- `database/migrations/2026_03_31_000007_add_seo_columns_to_portfolio_items_table.php` - SEO columns on portfolio_items
- `database/migrations/2026_03_31_000008_add_author_profile_columns_to_users_table.php` - Author profile columns on users
- `database/migrations/2026_03_31_000009_add_before_after_images_to_portfolio_items_table.php` - Before/after images on portfolio_items
- `app/Models/Category.php` - Category model with posts() belongsToMany and ordered() scope
- `app/Models/Tag.php` - Tag model with posts() belongsToMany
- `app/Models/SeoMetadata.php` - SEO metadata model with ogImage() relationship
- `app/Models/BlogPost.php` - Extended with categories, tags, ogImage, and published scope
- `app/Models/PortfolioItem.php` - Extended with ogImage, beforeImage, afterImage, and published scope
- `app/Models/User.php` - Extended with bio, avatar, social_links, and blogPosts relationship
- `app/Services/SeoService.php` - Centralized SEO data resolution with fallback chains
- `resources/views/app.blade.php` - Server-side OG/canonical/hreflang/twitter meta tags
- `resources/js/components/seo-head.tsx` - Reusable SeoHead component with head-key deduplication
- `resources/js/lib/seo.ts` - Reading time calculator and share URL helpers
- `resources/js/types/blog.ts` - TypeScript types for public blog/portfolio pages
- `resources/js/types/admin.ts` - Extended with AdminCategory, AdminTag, SeoMetadataItem types
- `resources/js/types/index.ts` - Added blog.ts to barrel re-exports
- `resources/css/app.css` - Added @tailwindcss/typography plugin

## Decisions Made
- Dual-render SEO strategy: Blade server-side meta tags ensure crawlers see OG/canonical/hreflang in initial HTML; SeoHead React component handles meta tag updates during client-side SPA navigation with head-key deduplication
- Static SeoService class returns plain arrays compatible with Inertia's withViewData pattern, keeping the SEO data flow simple and testable

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All database tables created and migrated (categories, tags, pivots, seo_metadata, plus alterations)
- Models have correct relationships and scopes ready for controllers
- SeoService ready for use in blog/portfolio controllers via withViewData
- SeoHead component ready for page-level SEO in React pages
- TypeScript types defined for all blog/portfolio/SEO entities
- @tailwindcss/typography installed for blog content prose rendering

## Self-Check: PASSED

- All 16 created files verified present
- Commit e02e5ea (Task 1) verified in git log
- Commit 263230a (Task 2) verified in git log

---
*Phase: 04-blog-portfolio-seo*
*Completed: 2026-03-31*
