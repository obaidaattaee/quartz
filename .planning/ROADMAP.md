# Roadmap: Quartz

## Milestones

- v1.0 MVP - Phases 1-4 (shipped 2026-03-31)
- v1.1 Brand Redesign & 3D Interactive Experience - Phases 5-9 (in progress)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

<details>
<summary>v1.0 MVP (Phases 1-4) - SHIPPED 2026-03-31</summary>

- [x] **Phase 1: Foundation & Design System** - Locale routing, RTL support, design tokens, animation primitives, and shared layout components
- [x] **Phase 2: Public Marketing Site** - Landing page, service pages, contact system, about/team, and all visitor-facing content
- [x] **Phase 3: Admin Panel** - Dashboard, content CRUD, lead management, media library, site settings, and role-based access
- [x] **Phase 4: Blog, Portfolio & SEO** - Blog system, portfolio gallery, structured data, sitemaps, and SEO optimization

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

Plans:
- [x] 01-01-PLAN.md -- Locale routing, design tokens, fonts, RTL, i18n infrastructure (Wave 1)
- [x] 01-02-PLAN.md -- Animation system, page transitions, component micro-interactions (Wave 2)
- [x] 01-03-PLAN.md -- PublicLayout, header, footer, breadcrumbs, 404 page (Wave 2)
- [x] 01-04-PLAN.md -- UAT gap closure: middleware lazy eval, CSS fixes, RTL Sheet, REQUIREMENTS tracking (Wave 1)

### Phase 2: Public Marketing Site
**Goal**: Visitors land on a visually polished site, understand what services Quartz offers, see proof of quality through testimonials and team credentials, and can reach out through multiple contact channels
**Depends on**: Phase 1
**Requirements**: LAND-01, LAND-02, LAND-03, LAND-04, LAND-05, LAND-06, LAND-07, SRVC-01, SRVC-02, SRVC-03, SRVC-04, SRVC-05, CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07, TEAM-01, TEAM-02, TEAM-03
**Success Criteria** (what must be TRUE):
  1. Landing page displays an animated hero with value proposition, service overview cards linking to detail pages, client logos, testimonials with names/companies, animated statistics counters, an interactive comparison section, and a bottom CTA -- all with scroll reveal animations
  2. Each of the four service detail pages (dev, automation, QA, cybersecurity) presents a problem-solution narrative with visual process steps and a CTA that pre-fills the contact form with the relevant service type
  3. Contact page shows a validated form (name, email, phone, service interest, message) with spam protection, an embedded map, and visible multi-channel contact info (WhatsApp, phone, email); submitting the form stores a lead and sends an email notification to admin
  4. About page presents the company story, team members with real photos/bios/roles, and certifications/badges
  5. Newsletter email capture is functional and stores submissions in the database; FAQ section with accordion is present with structured data markup
**Plans**: 5 plans

Plans:
- [x] 02-01-PLAN.md -- Backend infrastructure, routes, translations, accordion install (Wave 1)
- [x] 02-02-PLAN.md -- Landing page with all 7 sections (Wave 2)
- [x] 02-03-PLAN.md -- Service detail pages and About/Team page (Wave 2)
- [x] 02-04-PLAN.md -- Contact page, FAQ page, newsletter footer wiring (Wave 2)
- [x] 02-05-PLAN.md -- Full visual and functional verification checkpoint (Wave 3)

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
**Plans**: 6 plans

Plans:
- [x] 03-01-PLAN.md -- Backend foundation: migrations, models, services, middleware, routes, dashboard, sidebar (Wave 1)
- [x] 03-02-PLAN.md -- Media library and shared admin components: Tiptap editor, bilingual tabs, data table (Wave 2)
- [x] 03-03-PLAN.md -- Blog post CRUD with Tiptap rich text and Portfolio CRUD with case studies (Wave 3)
- [x] 03-04-PLAN.md -- Contact lead management, testimonial CRUD with reorder, team member CRUD (Wave 3)
- [x] 03-05-PLAN.md -- Service page structured editing, site settings with color picker, user management (Wave 3)
- [x] 03-06-PLAN.md -- Content seeders, DB-backed public pages transition, full verification checkpoint (Wave 4)

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
**Plans**: 6 plans

Plans:
- [x] 04-01-PLAN.md -- Database schema, SEO infrastructure, SeoService, TypeScript types, reading time helpers (Wave 1)
- [x] 04-02-PLAN.md -- Public blog pages: listing, detail, category/tag/author archives (Wave 2)
- [x] 04-03-PLAN.md -- Public portfolio pages: gallery with filters, case study detail (Wave 2)
- [x] 04-04-PLAN.md -- Admin category CRUD, SEO settings, extended blog/portfolio forms (Wave 3)
- [x] 04-05-PLAN.md -- RSS feed, XML sitemap, JSON-LD structured data, SEO wiring (Wave 3)
- [x] 04-06-PLAN.md -- Verification seeder and full Phase 4 verification checkpoint (Wave 4)

</details>

### v1.1 Brand Redesign & 3D Interactive Experience (In Progress)

**Milestone Goal:** Transform the current template-looking site into a unique, premium consultancy brand with an interactive 3D hero that makes Quartz instantly memorable and drives lead generation.

- [ ] **Phase 5: Brand Design System** - New color palette, typography, component language, motion patterns, service icons, and asset sourcing
- [ ] **Phase 6: Landing Page Redesign** - Rebuilt landing page with Mailchimp-inspired content-first layout, robot mascot illustrations, and scroll-driven storytelling
- [ ] **Phase 7: Portfolio Case Studies** - In-depth case study pages with narrative structure, animated metrics, project imagery, and related navigation
- [ ] **Phase 8: Lead Generation** - Strategic CTAs, animated statistics, client logo marquee, trust signals, and WhatsApp floating button
- [ ] **Phase 9: 3D Interactive Hero** - Three.js Earth globe with Roblox-style robot characters, interactive controls, loading transition, and mobile fallback

## Phase Details

### Phase 5: Brand Design System
**Goal**: The entire public site speaks a cohesive, premium visual language -- new colors, typography, component shapes, motion patterns, and custom icons -- that feels hand-crafted rather than templated
**Depends on**: Phase 4 (v1.0 complete)
**Requirements**: BRAND-01, BRAND-02, BRAND-03, BRAND-04, BRAND-05, BRAND-06, BRAND-07
**Success Criteria** (what must be TRUE):
  1. Light and dark modes each use a distinct, intentionally designed OKLCH color palette (not an auto-inversion) with semantic tokens applied consistently across all public page components
  2. A new display font and body font render correctly in both English and Arabic, with proper weight, size scale, and line-height in both LTR and RTL layouts
  3. All public-facing cards, buttons, inputs, and section containers use the new border-radius, shadow scale, and spacing rhythm -- visually distinct from the v1.0 design
  4. Page entrance animations, scroll reveals, hover interactions, and ambient motion all follow a defined, consistent motion language across every public page
  5. Each of the four services (dev, automation, QA, cybersecurity) has a custom icon matching the new brand aesthetic, and all required font files, icon assets, and illustration textures are downloaded and committed to the repository
**Plans**: TBD
**UI hint**: yes

### Phase 6: Landing Page Redesign
**Goal**: Visitors land on a Mailchimp-inspired, content-first page that unfolds as a trust-building narrative -- bold value proposition, service explanations with custom icons, robot mascot brand characters, redesigned testimonials, and intentional visual rhythm
**Depends on**: Phase 5
**Requirements**: LAND-01, LAND-02, LAND-03, LAND-04, LAND-05, LAND-06, LAND-07
**Success Criteria** (what must be TRUE):
  1. The hero section displays a bold, clear value proposition with a single primary CTA above the fold, styled in the new brand language (not the v1.0 hero)
  2. Scrolling through the landing page feels like a narrative -- sections unfold progressively, building from "what we do" through "proof of quality" to a conversion CTA at the bottom
  3. Service overview section shows all four services with custom brand icons and concise copy; robot mascot SVG illustrations appear in at least two sections as brand personality elements
  4. Testimonials section has a noticeably stronger visual treatment than v1.0 (not a plain card grid) with client names, companies, and visual emphasis
  5. All sections use intentional spacing rhythm and visual hierarchy from the Phase 5 design system; the page renders correctly in both EN (LTR) and AR (RTL)
**Plans**: TBD
**UI hint**: yes

### Phase 7: Portfolio Case Studies
**Goal**: Each portfolio project tells a complete story -- problem, approach, results -- with professional visuals, animated metrics, and client proof that demonstrates Quartz's competence to prospective clients
**Depends on**: Phase 5
**Requirements**: PORT-01, PORT-02, PORT-03, PORT-04, PORT-05, PORT-06
**Success Criteria** (what must be TRUE):
  1. Case study pages display a Problem, Approach, and Results narrative structure with dedicated database fields populated through the admin panel
  2. Result metrics animate on scroll (count-up numbers, percentage bars) and before/after comparisons are visually presented where applicable
  3. Each case study shows full-bleed project imagery with device mockup frames and a lightbox gallery for additional screenshots; technology/tools used appear as branded badges
  4. Client testimonials tied to specific case studies appear inline; a "Related Projects" section and "Next Project" navigation appear at the bottom of each case study
**Plans**: TBD
**UI hint**: yes

### Phase 8: Lead Generation
**Goal**: Every page in the site is optimized for conversion -- strategic CTAs appear after trust-building moments, animated social proof reinforces credibility, and visitors can reach Quartz instantly via WhatsApp
**Depends on**: Phase 6, Phase 7
**Requirements**: LEAD-01, LEAD-02, LEAD-03, LEAD-04, LEAD-05
**Success Criteria** (what must be TRUE):
  1. CTAs appear after trust-building content (testimonials, case study results, statistics) on the landing page, service pages, and portfolio pages -- not just at the top and bottom
  2. A statistics section with animated count-up numbers triggers on scroll; a client logo marquee auto-scrolls continuously and logos shift from grayscale to color on hover
  3. Trust signals ("Trusted by 50+ companies" or similar) are placed directly adjacent to CTA buttons throughout the site
  4. A WhatsApp floating action button is visible on all public pages, positioned correctly in both LTR and RTL layouts, and links to the configured WhatsApp number
**Plans**: TBD
**UI hint**: yes

### Phase 9: 3D Interactive Hero
**Goal**: The landing page hero features a Three.js Earth globe with Roblox-style robot characters representing each service, creating an instantly memorable first impression that differentiates Quartz from every competitor
**Depends on**: Phase 6
**Requirements**: 3DHR-01, 3DHR-02, 3DHR-03, 3DHR-04, 3DHR-05, 3DHR-06
**Success Criteria** (what must be TRUE):
  1. The landing page hero displays a 3D Earth globe rendered via React Three Fiber with a branded atmosphere effect; the globe and scene load without blocking initial page paint (lazy-loaded with Suspense)
  2. Four Roblox-style robot characters are positioned on the globe, each representing a service; hovering a robot shows a tooltip with the service name
  3. Users can rotate and zoom the globe; the interactive controls work on both desktop (mouse) and mobile (touch)
  4. A branded loading placeholder (matching the design system) cross-fades into the 3D scene once assets are loaded; devices that cannot sustain 24+ FPS automatically fall back to a static illustration
  5. All 3D robot models (GLTF/GLB) and Earth textures are sourced, optimized, and committed to the repository; the Three.js bundle is isolated in a separate Vite chunk and only downloaded on the landing page
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 5 -> 6 -> 7 -> 8 -> 9
(Phase 7 can begin after Phase 5 completes, in parallel with Phase 6. Phase 8 depends on both 6 and 7.)

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation & Design System | v1.0 | 4/4 | Complete | - |
| 2. Public Marketing Site | v1.0 | 5/5 | Complete | - |
| 3. Admin Panel | v1.0 | 6/6 | Complete | - |
| 4. Blog, Portfolio & SEO | v1.0 | 6/6 | Complete | 2026-03-31 |
| 5. Brand Design System | v1.1 | 0/0 | Not started | - |
| 6. Landing Page Redesign | v1.1 | 0/0 | Not started | - |
| 7. Portfolio Case Studies | v1.1 | 0/0 | Not started | - |
| 8. Lead Generation | v1.1 | 0/0 | Not started | - |
| 9. 3D Interactive Hero | v1.1 | 0/0 | Not started | - |
