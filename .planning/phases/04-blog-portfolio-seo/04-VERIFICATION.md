---
phase: 04-blog-portfolio-seo
verified: 2026-03-31T00:00:00Z
status: gaps_found
score: 10/18 must-haves verified
re_verification: false
gaps:
  - truth: "Server-side OG tags, canonical URLs, and hreflang tags render in initial HTML for crawlers"
    status: failed
    reason: "SeoService returns mismatched keys: 'og_image' instead of 'image', no 'url' key at all, and hreflang as array of objects [{locale, url}] instead of a key-value map {en: url, ar: url}. app.blade.php iterates hreflang as $lang => $href (expects map), so server-side hreflang tags render blank. og:image and og:url meta tags also break."
    artifacts:
      - path: "app/Services/SeoService.php"
        issue: "Returns 'og_image' key instead of 'image', missing 'url' key entirely, hreflang format is [{locale, url}] not {en: url, ar: url}"
      - path: "resources/views/app.blade.php"
        issue: "Iterates hreflang as $lang => $href — works only if hreflang is associative. Also references $seo['image'] which doesn't exist (SeoService uses 'og_image')."
    missing:
      - "SeoService must return 'image' (not 'og_image'), 'url' key, and hreflang as associative array ['en' => '...', 'ar' => '...']"

  - truth: "SeoHead React component renders meta tags for client-side SPA navigation"
    status: partial
    reason: "SeoHead component itself is correct. However, the seo data passed from controllers has mismatched keys: 'og_image' instead of 'image', missing 'url'. Component would render og:url as empty/undefined and og:image would be blank."
    artifacts:
      - path: "app/Services/SeoService.php"
        issue: "Missing 'url' key in return array. SeoHead.seo.url would be undefined causing og:url to render empty. og:image also empty because key is 'og_image' not 'image'."
    missing:
      - "SeoService must return 'url' key (pointing to canonical URL), and rename 'og_image' to 'image'"

  - truth: "Reading time estimate appears near post title"
    status: failed
    reason: "reading_time_en and reading_time_ar are declared in BlogPostSummary TypeScript type and read in show.tsx and blog-card.tsx, but no database column exists and BlogController never computes or appends these values. All blog posts render undefined as reading time."
    artifacts:
      - path: "app/Http/Controllers/BlogController.php"
        issue: "Does not compute or append reading_time_en/reading_time_ar to blog post data before passing to Inertia"
      - path: "database/migrations/2026_03_28_000006_create_blog_posts_table.php"
        issue: "No reading_time_en or reading_time_ar columns"
    missing:
      - "Either add reading_time_en/ar columns to blog_posts table (computed on save) OR compute them in BlogController before returning to Inertia. The calculateReadingTime() helper exists in resources/js/lib/seo.ts but is never called server-side."

  - truth: "Portfolio gallery displays a visual grid with 3 columns on desktop, 2 on tablet, 1 on mobile"
    status: partial
    reason: "Portfolio card grid uses 'sm:grid-cols-2 lg:grid-cols-3' — correct layout. However, PortfolioController never passes 'serviceCategories' prop to the frontend. PortfolioIndex expects this prop (type Props has serviceCategories: string[]) and uses it to render filter tabs. With undefined serviceCategories, the component would throw or show no filter UI."
    artifacts:
      - path: "app/Http/Controllers/PortfolioController.php"
        issue: "index() passes only 'items' and 'seo' — missing 'serviceCategories' prop"
      - path: "resources/js/pages/public/portfolio/index.tsx"
        issue: "Destructures serviceCategories from props but controller never sends it — results in runtime error or empty filter"
    missing:
      - "PortfolioController::index() must compute and pass serviceCategories: PortfolioItem::published()->distinct()->pluck('service_category')->sort()->values()"

  - truth: "Tab-style filter by service type works with fade animation"
    status: failed
    reason: "Filter UI depends on serviceCategories prop which PortfolioController does not provide. Filter tabs will not render."
    artifacts:
      - path: "app/Http/Controllers/PortfolioController.php"
        issue: "Missing serviceCategories in Inertia render payload"
    missing:
      - "Same fix as above: PortfolioController must pass serviceCategories"

  - truth: "JSON-LD structured data on home (Organization), services (Service), blog posts (Article), contact (LocalBusiness)"
    status: partial
    reason: "Home (Organization), contact (LocalBusiness), FAQ (FAQPage), and blog show (BlogPosting) all have JSON-LD. Individual service pages (development.tsx etc.) have Service schema. However services/show.tsx does not exist — the plan expected it but implementation uses per-service files (development.tsx, automation.tsx, qa.tsx, cybersecurity.tsx). JSON-LD is present on the per-service files so functional coverage exists, but the plan's artifact is missing."
    artifacts:
      - path: "resources/js/pages/public/services/show.tsx"
        issue: "File does not exist — implementation uses separate per-slug files instead"
    missing:
      - "This is not a functional gap (per-service files have JSON-LD) but the plan artifact is missing — acceptable as implementation variation"

  - truth: "Admin SEO settings page allows editing meta titles and descriptions for static pages"
    status: partial
    reason: "routes/admin.php has a duplicate SEO route block inside role:admin middleware (lines 62-63) that references undeclared class AdminSeoSettingController. This causes a PHP fatal error when an admin user accesses SEO settings. The non-admin-only SEO routes on lines 36-37 (using correctly-imported SeoSettingController) are accessible to all authenticated users but the admin-group duplicate will crash."
    artifacts:
      - path: "routes/admin.php"
        issue: "Lines 62-63 reference AdminSeoSettingController which is never imported. This is a fatal PHP error. Lines 36-37 define the same routes correctly but are redundantly overridden."
    missing:
      - "Remove lines 61-63 from routes/admin.php (the duplicate route block inside role:admin middleware group). The SEO routes are already correctly defined on lines 36-37."

  - truth: "RSS feed at /{locale}/feed.xml returns valid RSS 2.0 XML with published blog posts"
    status: partial
    reason: "RssFeedController is substantive and queries published posts. Routes are registered. However, the route is only defined once (inside the locale prefix group which is registered twice in web.php — portfolio routes also duplicated). The duplicate routes may cause Laravel route naming conflicts."
    artifacts:
      - path: "routes/web.php"
        issue: "sitemap.xml route is defined twice (lines 17 and 23). Portfolio routes are defined twice (lines 50-51 and 66-67). Named route conflicts may cause unexpected behavior."
    missing:
      - "Remove duplicate route definitions from routes/web.php (lines 23, 66-67)"
---

# Phase 4: Blog, Portfolio, and SEO Verification Report

**Phase Goal:** The site has a content marketing engine with a full blog and portfolio gallery, and search engines can properly discover, index, and display all pages in both languages
**Verified:** 2026-03-31
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Category and Tag models exist with bilingual fields and slug | VERIFIED | Category.php and Tag.php exist with name_en, name_ar, slug, belongsToMany BlogPost |
| 2 | BlogPost has many-to-many relationships with categories and tags | VERIFIED | BlogPost.php has categories() and tags() belongsToMany; sync() called in BlogPostController |
| 3 | User model has bio_en, bio_ar, avatar_media_id, and social_links fields | VERIFIED | migration 000008 adds these columns |
| 4 | SEO metadata can be stored for static pages | VERIFIED | SeoMetadata model and create_seo_metadata_table migration exist |
| 5 | Server-side OG tags, canonical URLs, and hreflang tags render in initial HTML | FAILED | SeoService key mismatch: 'og_image' vs 'image', missing 'url', hreflang format incompatible with Blade iteration |
| 6 | SeoHead React component renders meta tags for client-side SPA navigation | PARTIAL | Component logic correct but receives 'og_image' not 'image', missing 'url' — og:image and og:url render empty |
| 7 | Reading time estimate appears near post title | FAILED | reading_time_en/ar not in DB, not computed in controller. Renders undefined |
| 8 | Blog listing shows a grid of post cards with pagination at 6 per page | VERIFIED | BlogController::index paginate(6), BlogIndex renders post grid with Pagination component |
| 9 | Blog post detail renders rich content with author card, related posts, share buttons | VERIFIED | BlogShow has all these sections wired to real data from controller |
| 10 | Category, tag, and author archive pages show filtered post grids | VERIFIED | BlogController has category(), tag(), author() actions; Inertia renders to blog/category, blog/tag, blog/author |
| 11 | Portfolio gallery displays a visual grid with 3 columns on desktop | PARTIAL | Grid CSS is correct (lg:grid-cols-3), but serviceCategories prop missing from controller |
| 12 | Portfolio cards show featured image with hover overlay | VERIFIED | PortfolioCard has overlay div with opacity-0 group-hover:opacity-100 |
| 13 | Tab-style filter by service type works with fade animation | FAILED | serviceCategories prop not passed by PortfolioController — filter tabs never render |
| 14 | Case study detail shows problem-approach-results narrative | VERIFIED | PortfolioShow renders content via dangerouslySetInnerHTML, shows results_metrics, before/after images |
| 15 | Before/after images display side-by-side | VERIFIED | BeforeAfterImages component uses flex-row on md, flex-col on mobile |
| 16 | Results metrics display as animated counters using scroll-triggered count-up | VERIFIED | ResultsMetrics uses useCounter hook from use-counter.ts, scroll-triggered |
| 17 | RSS feed at /{locale}/feed.xml returns valid RSS 2.0 XML | VERIFIED | RssFeedController queries published BlogPosts and returns XML with items |
| 18 | XML sitemap at /sitemap.xml includes all public routes, blog posts, and portfolio items | VERIFIED | SitemapController queries BlogPost::published() and PortfolioItem::published(), generates per-locale URLs with hreflang alternates |
| 19 | Every public page has OG tags, canonical URL, and hreflang in server-rendered HTML | FAILED | All controllers call SeoService::forStaticPage() + withViewData(['seo']), but SeoService returns wrong key names and hreflang format. Blade template can't render them correctly |
| 20 | JSON-LD structured data on home, services, blog posts, contact | PARTIAL | Home (Organization), contact (LocalBusiness), FAQ (FAQPage), blog show (BlogPosting) all have JsonLd. Service pages use per-slug files (not show.tsx) but each has Service schema |
| 21 | Hreflang tags include both self-reference and alternate language | FAILED | SeoService hreflang format is [{locale, url}] array; both Blade foreach and SeoHead expect {en: url, ar: url} map |
| 22 | Admin can manage categories through CRUD interface | VERIFIED | CategoryController + CategoryIndex page with create/edit/delete flows |
| 23 | Blog post forms include category multi-select, tag input, and SEO fields | VERIFIED | blog/create.tsx has category_ids[], tags[], meta_title_en/ar, meta_description_en/ar |
| 24 | Admin SEO settings page allows editing meta titles and descriptions | PARTIAL | SeoSettings page is functional. But routes/admin.php has undeclared AdminSeoSettingController in admin-only group causing PHP fatal error for admin-role users |

**Score:** 10/18 must-haves verified (6 failed, 2 partial counted as failed for scoring)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/Models/Category.php` | Category model with bilingual name, slug | VERIFIED | Exists, substantive, used by BlogPost |
| `app/Models/Tag.php` | Tag model with bilingual name, slug | VERIFIED | Exists, substantive, used by BlogPost |
| `app/Models/SeoMetadata.php` | SEO metadata for static pages | VERIFIED | Exists with ogImage relationship |
| `app/Services/SeoService.php` | Centralized SEO data resolution | STUB/BROKEN | Exists and substantive but returns wrong key names breaking all consumers |
| `resources/js/components/seo-head.tsx` | SeoHead component | VERIFIED | Correct implementation; broken by upstream data mismatch |
| `resources/js/lib/seo.ts` | calculateReadingTime and getShareUrls | VERIFIED | Both functions present and correct |
| `resources/js/types/blog.ts` | TypeScript blog/portfolio types | VERIFIED | All types defined correctly |
| `app/Http/Controllers/BlogController.php` | Public blog routes | VERIFIED | All 5 actions implemented with DB queries |
| `resources/js/pages/public/blog/index.tsx` | Blog listing page | VERIFIED | Grid, category filter tabs, pagination present |
| `resources/js/pages/public/blog/show.tsx` | Blog post detail | PARTIAL | All sections present but reading_time renders undefined |
| `resources/js/components/blog-card.tsx` | Blog post card | PARTIAL | Exists and wired; reading_time renders undefined |
| `resources/js/components/author-card.tsx` | Author profile card | VERIFIED | Photo, bio, social links all rendered |
| `resources/js/components/share-buttons.tsx` | Social sharing buttons | VERIFIED | LinkedIn, X, WhatsApp buttons present using getShareUrls |
| `app/Http/Controllers/PortfolioController.php` | Portfolio routes | PARTIAL | index() and show() exist but index() missing serviceCategories |
| `resources/js/pages/public/portfolio/index.tsx` | Portfolio gallery | PARTIAL | Grid and filter UI present but serviceCategories prop will be undefined |
| `resources/js/pages/public/portfolio/show.tsx` | Case study detail | VERIFIED | Results, before/after, content all wired |
| `resources/js/components/portfolio-card.tsx` | Portfolio card with hover | VERIFIED | Hover overlay implemented |
| `resources/js/components/before-after-images.tsx` | Before/after images | VERIFIED | Side-by-side layout with mobile stack |
| `resources/js/components/results-metrics.tsx` | Animated counter metrics | VERIFIED | Uses useCounter hook for scroll-triggered count-up |
| `app/Http/Controllers/RssFeedController.php` | RSS 2.0 feed | VERIFIED | Queries published posts, returns valid XML |
| `app/Http/Controllers/SitemapController.php` | XML sitemap | VERIFIED | Queries blog+portfolio, includes hreflang alternates |
| `app/Http/Controllers/Admin/CategoryController.php` | Admin category CRUD | VERIFIED | Full CRUD with sync |
| `app/Http/Controllers/Admin/SeoSettingController.php` | Admin SEO settings | PARTIAL | Exists and functional for non-admin roles; broken for admin role via duplicate undefined route |
| `resources/js/pages/admin/categories/index.tsx` | Category management page | VERIFIED | Full CRUD UI with inline editing |
| `resources/js/pages/admin/seo/index.tsx` | Static page SEO settings | VERIFIED | Per-page accordion with meta title/description/OG image |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/Services/SeoService.php` | `resources/views/app.blade.php` | withViewData(['seo' => ...]) | BROKEN | withViewData call exists in all controllers, but SeoService returns wrong keys — og_image vs image, missing url, and hreflang format incompatible with Blade foreach |
| `resources/js/components/seo-head.tsx` | @inertiajs/react Head | Head component | VERIFIED | Uses Head from @inertiajs/react correctly |
| `app/Models/BlogPost.php` | `app/Models/Category.php` | belongsToMany | VERIFIED | Both directions (posts() on Category, categories() on BlogPost) |
| `app/Http/Controllers/BlogController.php` | `app/Services/SeoService.php` | SeoService::forBlogPost() | VERIFIED | All BlogController actions call SeoService |
| `app/Http/Controllers/PortfolioController.php` | `app/Services/SeoService.php` | SeoService::forPortfolioItem() | VERIFIED | Both PortfolioController actions call SeoService |
| `app/Http/Controllers/SitemapController.php` | `app/Models/BlogPost.php` | BlogPost::published() | VERIFIED | Queries published posts for sitemap URLs |
| `app/Http/Controllers/RssFeedController.php` | `app/Models/BlogPost.php` | BlogPost::published() | VERIFIED | Queries published posts for feed items |
| `app/Http/Controllers/HomeController.php` | `app/Services/SeoService.php` | SeoService::forStaticPage() | VERIFIED | HomeController calls forStaticPage('home', ...) |
| `resources/js/components/results-metrics.tsx` | `resources/js/hooks/use-counter.ts` | useCounter hook | VERIFIED | MetricCard imports and uses useCounter |
| `resources/js/pages/admin/blog/create.tsx` | `app/Http/Controllers/Admin/BlogPostController.php` | POST with categories, tags, SEO | VERIFIED | Form sends category_ids[], tags[], meta_title_en/ar to controller which syncs them |
| `app/Http/Controllers/Admin/BlogPostController.php` | `app/Models/Category.php` | categories()->sync() | VERIFIED | Lines 64 and 109 in BlogPostController |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|-------------------|--------|
| `blog/index.tsx` | `posts.data` | `BlogPost::published()->paginate(6)` | Yes | FLOWING |
| `blog/show.tsx` | `post.reading_time_en/ar` | Not computed anywhere — no DB column, no controller calculation | No | DISCONNECTED |
| `portfolio/index.tsx` | `serviceCategories` | Not passed by PortfolioController — prop is undefined | No | HOLLOW_PROP |
| `seo-head.tsx` | `seo.url` | SeoService doesn't return 'url' key | No | DISCONNECTED |
| `seo-head.tsx` | `seo.image` | SeoService returns 'og_image' not 'image' | No | DISCONNECTED |
| `seo-head.tsx` | `seo.hreflang` | SeoService returns [{locale, url}] but SeoHead expects Record<string,string> | No | STATIC (wrong format) |
| `results-metrics.tsx` | `metrics` | `PortfolioItem.results_metrics` JSON column | Yes | FLOWING |
| `before-after-images.tsx` | `beforeImage/afterImage` | PortfolioController loads beforeImage/afterImage relations | Yes | FLOWING |

### Behavioral Spot-Checks

Step 7b: SKIPPED — server not running, cannot execute HTTP checks.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|------------|-------------|-------------|--------|----------|
| BLOG-01 | 04-02, 04-06 | Blog listing page with pagination | SATISFIED | BlogController::index paginate(6), BlogIndex renders grid |
| BLOG-02 | 04-02, 04-06 | Blog post detail with rich content rendering | SATISFIED | BlogShow renders dangerouslySetInnerHTML content |
| BLOG-03 | 04-01, 04-02, 04-06 | Categories and tags with filterable pages | SATISFIED | Category/Tag models, archive pages all implemented |
| BLOG-04 | 04-02, 04-06 | Author profiles with photo, bio, social links | SATISFIED | AuthorCard component, author archive page |
| BLOG-05 | 04-01, 04-04, 04-06 | SEO metadata per post | SATISFIED | Meta title/description fields in BlogPost, admin forms include them |
| BLOG-06 | 04-02, 04-06 | Related posts section | SATISFIED | BlogController::show queries relatedPosts, shown in BlogShow |
| BLOG-07 | 04-01, 04-02, 04-06 | Reading time estimate | BLOCKED | reading_time_en/ar not in DB and not computed — renders undefined |
| BLOG-08 | 04-02, 04-06 | Social sharing buttons | SATISFIED | ShareButtons component with LinkedIn, X, WhatsApp |
| BLOG-09 | 04-05, 04-06 | RSS feed auto-generated | SATISFIED | RssFeedController returns valid RSS 2.0 XML |
| PORT-01 | 04-03, 04-06 | Portfolio grid with hover previews and filtering | PARTIAL | Grid and hover implemented; filter broken (missing serviceCategories prop) |
| PORT-02 | 04-03, 04-06 | Case study detail pages | SATISFIED | PortfolioShow with content, description fallback |
| PORT-03 | 04-03, 04-06 | Before/after visuals | SATISFIED | BeforeAfterImages component, PortfolioController loads relations |
| PORT-04 | 04-03, 04-06 | Results metrics with animated counters | SATISFIED | ResultsMetrics with useCounter hook |
| SEO-01 | 04-01, 04-04, 04-06 | Admin-editable meta titles and descriptions per page | PARTIAL | SeoSettings page functional; admin-role PHP error via undeclared class |
| SEO-02 | 04-01, 04-05, 04-06 | OG and social sharing meta tags on all pages | BLOCKED | SeoService returns wrong keys (og_image vs image, missing url) — OG tags broken |
| SEO-03 | 04-05, 04-06 | XML sitemap including all routes | SATISFIED | SitemapController queries and generates full sitemap |
| SEO-04 | 04-05, 04-06 | JSON-LD structured data | SATISFIED | Home, contact, FAQ, blog posts, service pages all have JSON-LD |
| SEO-05 | 04-01, 04-05, 04-06 | Canonical URLs and hreflang tags | BLOCKED | SeoService hreflang format incompatible with both Blade and SeoHead consumers |

**Orphaned requirements check:** All 18 requirement IDs (BLOG-01 through BLOG-09, PORT-01 through PORT-04, SEO-01 through SEO-05) appear in at least one plan's requirements field. No orphaned requirements.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `routes/web.php` | 17, 23 | Duplicate `Route::get('/sitemap.xml', ...)` | Warning | Route naming conflict — last-defined wins, but may cause unexpected resolution |
| `routes/web.php` | 50-51, 66-67 | Duplicate portfolio routes inside same prefix group | Warning | Named route conflict for 'portfolio.index' and 'portfolio.show' |
| `routes/admin.php` | 62-63 | Undeclared class `AdminSeoSettingController` | Blocker | PHP fatal error when admin-role user hits GET/PUT /admin/seo — admin SEO management broken for admin role |
| `app/Services/SeoService.php` | 40, 68, 98 | Key 'og_image' instead of expected 'image' | Blocker | All OG image meta tags render empty across every page |
| `app/Services/SeoService.php` | 42-45, 72-75, 102-105 | hreflang returned as sequential array of objects | Blocker | Blade foreach($hreflang as $lang => $href) iterates numerically; hreflang links render as '0'/'1' instead of 'en'/'ar' |
| `app/Services/SeoService.php` | All returns | Missing 'url' key | Blocker | SeoHead renders `<meta property="og:url" content="">` — empty og:url on every page |
| `resources/js/types/blog.ts` | 48-49 | reading_time_en/ar in type but no DB column | Blocker | reading_time renders as undefined string in blog cards and show pages |

### Human Verification Required

#### 1. Visual filter fade animation on portfolio

**Test:** Visit `/en/portfolio` with published items spanning multiple service categories, click a service type filter tab
**Expected:** Items fade out and fade in with the filtered set (AnimatePresence mode="wait")
**Why human:** AnimatePresence + motion.div animation requires visual inspection

#### 2. Blog post reading time display

**Test:** Visit a blog post detail page (once reading_time gap is fixed)
**Expected:** Clock icon + "X min read" appears in the article header meta row
**Why human:** Requires a published blog post with real content to verify the computed value is reasonable

#### 3. RTL layout correctness for Arabic pages

**Test:** Visit `/ar/blog` and `/ar/portfolio`, check that text flows right-to-left and UI elements are mirrored correctly
**Expected:** cn(isRTL && 'text-right') and flex-row-reverse applied, Arabic numeral dates
**Why human:** RTL layout requires visual inspection

#### 4. Hreflang tags once gap is fixed

**Test:** View source on `/en/blog` and check for `<link rel="alternate" hreflang="ar" ...>` and `<link rel="alternate" hreflang="en" ...>`
**Expected:** Two hreflang links in page `<head>` pointing to the correct localized URLs
**Why human:** Requires running server and inspecting rendered HTML source

### Gaps Summary

**4 blocker gaps prevent the phase goal from being achieved:**

**Gap 1 — SeoService key mismatch (root cause of SEO-02, SEO-05 failures):**
`SeoService` returns `og_image` (not `image`), no `url` key, and `hreflang` as a sequential array of objects rather than an associative map. This breaks server-side rendering in `app.blade.php` (hreflang tags output literal `0`/`1` as language codes), breaks the `SeoHead` React component (og:image and og:url empty), and violates the `SeoData` TypeScript contract. This one file needs 3 fixes: rename `og_image` to `image`, add `'url' => $canonical`, and reformat `hreflang` as `['en' => url, 'ar' => url]`.

**Gap 2 — Reading time not computed (BLOG-07 failure):**
`reading_time_en` and `reading_time_ar` are typed in `BlogPostSummary` and read in `BlogCard` and `BlogShow`, but neither the database schema nor the controller computes these values. The `calculateReadingTime()` helper already exists in `resources/js/lib/seo.ts`. The fix is to compute these in `BlogController` using a PHP equivalent, or add them as computed properties/stored columns.

**Gap 3 — Portfolio service filter broken (PORT-01 partial):**
`PortfolioController::index()` does not pass `serviceCategories` to the frontend. The `PortfolioIndex` component destructures it from props and would throw (or silently fail with an empty array if TypeScript non-null assumptions hold). The fix: `$serviceCategories = PortfolioItem::published()->distinct()->pluck('service_category')->sort()->values()` and add it to the Inertia render payload.

**Gap 4 — Undeclared AdminSeoSettingController (SEO-01 partial):**
Lines 62-63 of `routes/admin.php` reference `AdminSeoSettingController::class` which is never imported. This causes a PHP fatal error whenever an admin-role user navigates to `/admin/seo`. The SEO routes are already correctly defined on lines 36-37 for all authenticated users. Fix: delete lines 61-63 from admin.php.

**Secondary issues (warnings, not blockers):**
- Duplicate route definitions in `web.php` (sitemap on lines 17+23, portfolio on lines 50-51 and 66-67) — Laravel uses last-defined, may cause subtle route resolution issues
- `app.blade.php` has two `@isset($seo)` blocks that duplicate OG/canonical/hreflang output — should be deduplicated

---

_Verified: 2026-03-31_
_Verifier: Claude (gsd-verifier)_
