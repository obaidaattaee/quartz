# Roadmap: Quart

## Overview

Quart is a bilingual (EN/AR) professional services website that must convey trust through polished visuals, showcase work, and convert visitors into leads. The build progresses from foundational infrastructure (locale routing, RTL, design system) through the public marketing pages visitors see, into the admin panel that manages all content, and finally delivers the content marketing features (blog, portfolio) alongside SEO hardening. Each phase produces a coherent, verifiable capability.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Design System** - Locale routing, RTL support, design tokens, animation primitives, and shared layout components
- [ ] **Phase 2: Public Marketing Site** - Landing page, service pages, contact system, about/team, and all visitor-facing content
- [ ] **Phase 3: Admin Panel** - Dashboard, content CRUD, lead management, media library, site settings, and role-based access
- [ ] **Phase 4: Blog, Portfolio & SEO** - Blog system, portfolio gallery, structured data, sitemaps, and SEO optimization

## Phase Details

### Phase 1: Foundation & Design System
**Goal**: Every page rendered in either English (LTR) or Arabic (RTL) looks correct, uses the same design tokens, and has working navigation with smooth transitions
**Depends on**: Nothing (first phase)
**Requirements**: INTL-01, INTL-02, INTL-03, INTL-04, INTL-05, INTL-06, DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05, DSGN-06, DSGN-07, DSGN-08, NAV-01, NAV-02, NAV-03
**Success Criteria** (what must be TRUE):
  1. Navigating to /en/any-page renders in English LTR; navigating to /ar/any-page renders in Arabic RTL with correct typography, and the language switcher preserves the current page
  2. Toggling dark/light mode applies instantly with a smooth transition and persists across page reloads
  3. Page transitions between routes animate smoothly, scroll reveal animations fire on scroll, and all animations respect prefers-reduced-motion
  4. Sticky header with navigation items is visible on desktop and collapses to hamburger menu on mobile; footer displays sitemap links, contact info, and social links; breadcrumbs appear on inner pages; a branded 404 page is shown for unknown routes
  5. All UI components (buttons, cards, inputs, badges) render consistently with hover micro-interactions in both LTR and RTL layouts across mobile, tablet, and desktop breakpoints
**Plans**: 4 plans
**UI hint**: yes

Plans:
- [x] 01-01-PLAN.md -- Locale routing, design tokens, fonts, RTL, i18n infrastructure (Wave 1)
- [x] 01-02-PLAN.md -- Animation system, page transitions, component micro-interactions (Wave 2)
- [x] 01-03-PLAN.md -- PublicLayout, header, footer, breadcrumbs, 404 page (Wave 2)
- [x] 01-04-PLAN.md -- UAT gap closure: middleware lazy eval, CSS fixes, RTL Sheet, REQUIREMENTS tracking (Wave 1)

### Phase 2: Public Marketing Site
**Goal**: Visitors land on a visually polished site, understand what services Quart offers, see proof of quality through testimonials and team credentials, and can reach out through multiple contact channels
**Depends on**: Phase 1
**Requirements**: LAND-01, LAND-02, LAND-03, LAND-04, LAND-05, LAND-06, LAND-07, SRVC-01, SRVC-02, SRVC-03, SRVC-04, SRVC-05, CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07, TEAM-01, TEAM-02, TEAM-03
**Success Criteria** (what must be TRUE):
  1. Landing page displays an animated hero with value proposition, service overview cards linking to detail pages, client logos, testimonials with names/companies, animated statistics counters, an interactive comparison section, and a bottom CTA -- all with scroll reveal animations
  2. Each of the four service detail pages (dev, automation, QA, cybersecurity) presents a problem-solution narrative with visual process steps and a CTA that pre-fills the contact form with the relevant service type
  3. Contact page shows a validated form (name, email, phone, service interest, message) with spam protection, an embedded map, and visible multi-channel contact info (WhatsApp, phone, email); submitting the form stores a lead and sends an email notification to admin
  4. About page presents the company story, team members with real photos/bios/roles, and certifications/badges
  5. Newsletter email capture is functional and stores submissions in the database; FAQ section with accordion is present with structured data markup
**Plans**: 5 plans
**UI hint**: yes

Plans:
- [x] 02-01-PLAN.md -- Backend infrastructure, routes, translations, accordion install (Wave 1)
- [x] 02-02-PLAN.md -- Landing page with all 7 sections (Wave 2)
- [ ] 02-03-PLAN.md -- Service detail pages and About/Team page (Wave 2)
- [ ] 02-04-PLAN.md -- Contact page, FAQ page, newsletter footer wiring (Wave 2)
- [ ] 02-05-PLAN.md -- Full visual and functional verification checkpoint (Wave 3)

### Phase 3: Admin Panel
**Goal**: Non-technical admins and editors can manage all site content, monitor leads, and customize the site's visual identity without touching code
**Depends on**: Phase 2
**Requirements**: ADMN-01, ADMN-02, ADMN-03, ADMN-04, ADMN-05, ADMN-06, ADMN-07, ADMN-08, ADMN-09, ADMN-10
**Success Criteria** (what must be TRUE):
  1. Admin dashboard displays key metrics (recent leads, post count, portfolio count) and provides navigation to all management sections
  2. Admin can create, edit, and delete blog posts with a rich text editor (Tiptap) supporting bilingual fields, image upload, and preview; can manage portfolio/case study entries with images, service categories, and bilingual content
  3. Admin can view contact leads with status tracking (new/read/handled) and filtering; can manage testimonials (add, edit, reorder, show/hide); can edit service page content through structured fields; can manage team members with photos and bios
  4. Admin can upload a logo, pick primary/secondary brand colors, update contact info and social links through site settings; a media library allows uploading, browsing, and reusing images with thumbnail generation
  5. Editor role users can only access blog and portfolio management; admin role users have access to everything; unauthorized sections are not accessible
**Plans**: TBD
**UI hint**: yes

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Blog, Portfolio & SEO
**Goal**: The site has a content marketing engine with a full blog and portfolio gallery, and search engines can properly discover, index, and display all pages in both languages
**Depends on**: Phase 3
**Requirements**: BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06, BLOG-07, BLOG-08, BLOG-09, PORT-01, PORT-02, PORT-03, PORT-04, SEO-01, SEO-02, SEO-03, SEO-04, SEO-05
**Success Criteria** (what must be TRUE):
  1. Blog listing page displays posts with pagination (6-10 per page); posts can be filtered by category or tag; each category and tag has its own filterable page
  2. Blog post detail page renders rich content with reading time estimate, author profile (photo, bio, social links), related posts section, and social sharing buttons (LinkedIn, X, WhatsApp); an RSS feed is auto-generated from published posts
  3. Portfolio gallery displays a visual grid with hover previews filterable by service type; case study detail pages show problem-approach-results narrative with before/after visuals and animated result metrics
  4. Every public page has admin-editable meta titles and descriptions, Open Graph tags, and canonical URLs; hreflang tags link EN/AR versions of each page; an auto-generated XML sitemap includes all public routes, blog posts, and portfolio items
  5. JSON-LD structured data is present on relevant pages (Organization, Service, Article, LocalBusiness, FAQ schemas) and validates without errors in Google's Rich Results Test
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Design System | 2/4 | In Progress|  |
| 2. Public Marketing Site | 0/5 | Not started | - |
| 3. Admin Panel | 0/2 | Not started | - |
| 4. Blog, Portfolio & SEO | 0/2 | Not started | - |
