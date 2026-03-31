# Phase 4: Blog, Portfolio & SEO - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-03-31
**Phase:** 04-Blog, Portfolio & SEO
**Mode:** auto (all decisions auto-selected with recommended defaults)
**Areas discussed:** Blog listing & pagination, Categories & tags, Blog post detail, Portfolio gallery, Case study detail, SEO implementation

---

## Blog Listing & Pagination

| Option | Description | Selected |
|--------|-------------|----------|
| Card grid (2x3) | Featured image, title, excerpt, author, date, category badge, reading time | [auto] |
| Compact list | Title + excerpt rows, no images | |
| Magazine layout | Mixed hero + smaller cards | |

**Auto-selected:** Card grid — matches existing card patterns from Phase 01/02, consistent with scotchpos.com premium aesthetic.

| Option | Description | Selected |
|--------|-------------|----------|
| 6 posts per page | Clean 2x3 grid, BLOG-01 lower bound | [auto] |
| 8 posts per page | 2x4 grid, more content density | |
| 10 posts per page | BLOG-01 upper bound, long pages | |

**Auto-selected:** 6 posts per page — clean grid layout, manageable page length.

## Categories & Tags

| Option | Description | Selected |
|--------|-------------|----------|
| Separate tables + pivots | SEO-friendly URLs, proper relational model, many-to-many | [auto] |
| JSON column on blog_posts | Simpler, no extra tables, but no SEO URLs or relational queries | |
| Taxonomy package (Spatie Tags) | Feature-rich but adds dependency | |

**Auto-selected:** Separate tables with pivot tables — supports SEO-friendly category/tag URLs, proper querying, and scales well.

| Option | Description | Selected |
|--------|-------------|----------|
| Tab-style category filter | Horizontal buttons on listing page, tag links on posts | [auto] |
| Sidebar filter panel | Category/tag checkboxes in sidebar | |
| Dropdown filter | Select menu above listing | |

**Auto-selected:** Tab-style filter — clean, intuitive, works well in RTL layout.

## Blog Post Detail

| Option | Description | Selected |
|--------|-------------|----------|
| Author card below post | Photo, bio, social links, link to author archive | [auto] |
| Author sidebar | Author info in a sidebar next to content | |
| Author inline (byline only) | Name + photo near title, no expanded profile | |

**Auto-selected:** Author card below post — gives proper visibility to author profile per BLOG-04.

| Option | Description | Selected |
|--------|-------------|----------|
| Category-first related posts | Same category, then tags, max 3 | [auto] |
| Tag-similarity scoring | Score by shared tag count | |
| Recency only | Just show latest 3 posts | |

**Auto-selected:** Category-first — straightforward, surfaces relevant content without complex scoring.

| Option | Description | Selected |
|--------|-------------|----------|
| Icon buttons (LinkedIn, X, WhatsApp) | Minimal, share URL-based, no SDKs | [auto] |
| Full branded buttons | Colored buttons with platform names | |
| Native share API | Uses browser share sheet where available | |

**Auto-selected:** Icon buttons — minimal, fast, privacy-respecting, matches BLOG-08 requirements.

## Portfolio Gallery

| Option | Description | Selected |
|--------|-------------|----------|
| Uniform grid with hover overlay | 3-col grid, image fills card, overlay on hover | [auto] |
| Masonry layout | Variable heights, Pinterest-style | |
| Card grid with visible text | Text always visible below image | |

**Auto-selected:** Uniform grid with hover overlay — premium feel, clean layout, consistent card sizes.

| Option | Description | Selected |
|--------|-------------|----------|
| Tab filter by service type | Matches service_category column | [auto] |
| Dropdown filter | More compact but less discoverable | |
| No filter (show all) | Simpler but less useful | |

**Auto-selected:** Tab filter — reuses service_category data, matches the category tab pattern from blog.

## Case Study Detail

| Option | Description | Selected |
|--------|-------------|----------|
| Side-by-side images | Two images in flex row with labels | [auto] |
| Interactive slider | Draggable divider revealing before/after | |
| Stacked with labels | Before image above, after image below | |

**Auto-selected:** Side-by-side — simpler, works in RTL, no complex interaction needed.

| Option | Description | Selected |
|--------|-------------|----------|
| Animated counters in highlight card | Reuses Phase 02 counter pattern | [auto] |
| Static metrics table | Simple number display | |
| Icon + number grid | Each metric with icon | |

**Auto-selected:** Animated counters — creates visual consistency with landing page statistics section.

## SEO Implementation

| Option | Description | Selected |
|--------|-------------|----------|
| DB columns + seo_metadata table | meta columns on content tables, separate table for static pages | [auto] |
| Single seo_metadata table for all | Everything in one table, keyed by page | |
| Config/JSON file-based | No database, settings in files | |

**Auto-selected:** DB columns + seo_metadata table — admin-editable per SEO-01, auto-fills from content if empty.

| Option | Description | Selected |
|--------|-------------|----------|
| Laravel route returning XML | Dynamic, no package dependency | [auto] |
| spatie/laravel-sitemap package | Feature-rich but adds dependency | |
| Static file generation (artisan command) | Needs cron, but cacheable | |

**Auto-selected:** Laravel route returning XML — simple, dynamic, no extra dependency.

| Option | Description | Selected |
|--------|-------------|----------|
| All 5 schemas via JsonLd component | Organization, Service, Article, LocalBusiness, FAQ | [auto] |
| Minimal (Organization + Article only) | Covers most value | |

**Auto-selected:** All 5 schemas — matches SEO-04 requirements, reuses existing JsonLd component.

---

## Claude's Discretion

- Blog card hover effects and transition timing
- Reading time calculation formula refinements
- Related posts algorithm edge cases
- Portfolio hover overlay animation style
- XML sitemap priorities and changefreq values
- JSON-LD optional field selection
- RSS feed format (Atom vs RSS 2.0)
- Social sharing button placement details
- Before/after image aspect ratio handling
- Category/tag slug generation rules

## Deferred Ideas

- Scheduled publishing -- v2 BLOG-10
- Content versioning -- v2 BLOG-11
- Video case studies -- v2 PORT-05
- Newsletter email service integration -- v2 ENGM-01
- Blog search -- v2 ENGM-02
