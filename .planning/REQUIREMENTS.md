# Requirements: Quart

**Defined:** 2026-03-28
**Core Value:** Visitors immediately understand what services are offered, see proof of quality through case studies and testimonials, and can easily get in touch — in a visually polished, professional experience that builds trust.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation & Bilingual

- [x] **INTL-01**: URL-based language routing with /en/ and /ar/ prefixes on all public routes
- [x] **INTL-02**: Full RTL layout for Arabic using CSS logical properties (start/end, not left/right)
- [x] **INTL-03**: Language switcher in header that preserves current page when switching
- [x] **INTL-04**: Bidirectional text handling for mixed EN/AR content (brand names, technical terms)
- [x] **INTL-05**: Arabic typography system with proper fonts, line-height (1.6-1.8x), and no letter-spacing
- [x] **INTL-06**: All translatable content stored with bilingual fields (EN + AR)

### Design System & Visual Foundation

- [x] **DSGN-01**: Premium color palette with primary/secondary colors, applied via CSS custom properties
- [x] **DSGN-02**: Dark/light mode toggle with smooth transition and localStorage persistence
- [x] **DSGN-03**: Responsive layout system tested at all breakpoints (mobile, tablet, desktop)
- [x] **DSGN-04**: Consistent component library (buttons, cards, inputs, badges) with hover micro-interactions
- [x] **DSGN-05**: Animation system using Motion + GSAP for scroll reveals, staggered entrances, and hover effects
- [~] **DSGN-06**: Smooth page transitions between routes (Inertia + View Transitions / AnimatePresence)
- [x] **DSGN-07**: prefers-reduced-motion support — disable animations for users who opt out
- [x] **DSGN-08**: Sticky header navigation with 4-6 items and mobile hamburger menu

### Landing Page

- [x] **LAND-01**: Hero section with animated entrance, clear value proposition, and primary CTA
- [x] **LAND-02**: Service overview section with 4 cards (dev, automation, QA, cybersecurity) linking to detail pages
- [x] **LAND-03**: Client/partner logo bar (horizontal scroll or flex grid)
- [x] **LAND-04**: Client testimonials section with quotes, names, companies, and optional photos
- [x] **LAND-05**: Animated statistics/counter section with scroll-triggered count-up (3-4 key metrics)
- [x] **LAND-06**: "Old Way vs New Way" interactive comparison section
- [x] **LAND-07**: Bottom CTA section driving visitors to contact

### Service Pages

- [x] **SRVC-01**: Individual detail page for each service (software dev, automation, QA, cybersecurity)
- [x] **SRVC-02**: Problem-solution framing: client pain point → approach → deliverables
- [x] **SRVC-03**: Process overview with visual step-by-step flow
- [x] **SRVC-04**: Per-service CTA that pre-fills contact form with service type
- [x] **SRVC-05**: Scroll reveal animations on service page sections

### Portfolio & Case Studies

- [ ] **PORT-01**: Visual portfolio grid with hover previews and filtering by service type
- [ ] **PORT-02**: Case study detail pages with problem → approach → results and metrics
- [ ] **PORT-03**: Before/after visuals or image comparison layouts
- [ ] **PORT-04**: Results metrics display with animated counters

### Blog System

- [ ] **BLOG-01**: Blog listing page with pagination (6-10 posts per page)
- [ ] **BLOG-02**: Blog post detail page with rich content rendering
- [ ] **BLOG-03**: Categories and tags with filterable category/tag pages
- [ ] **BLOG-04**: Author profiles with photo, bio, social links, and authored posts list
- [ ] **BLOG-05**: SEO metadata per post (title, description, OG image)
- [ ] **BLOG-06**: Related posts section (2-3 posts by category/tag relevance)
- [ ] **BLOG-07**: Reading time estimate displayed near title
- [ ] **BLOG-08**: Social sharing buttons (LinkedIn, Twitter/X, WhatsApp)
- [ ] **BLOG-09**: RSS feed auto-generated from published posts

### Contact & Lead Generation

- [x] **CONT-01**: Contact form with validation (name, email, phone, service interest, message)
- [x] **CONT-02**: Multi-channel contact info visible on contact page and footer (WhatsApp, phone, email)
- [x] **CONT-03**: Contact page with embedded map or location display
- [x] **CONT-04**: Email notification sent to admin on form submission
- [x] **CONT-05**: Spam protection on contact form (honeypot or rate limiting)
- [x] **CONT-06**: FAQ section with accordion and FAQ structured data (JSON-LD)
- [x] **CONT-07**: Newsletter email capture stored in database

### About & Team

- [x] **TEAM-01**: About page with company story and mission
- [x] **TEAM-02**: Team member section with real photos, names, roles, and bios
- [x] **TEAM-03**: Certifications and badges display

### Navigation & Structure

- [x] **NAV-01**: Footer with sitemap links, contact info, social links, and legal
- [x] **NAV-02**: Breadcrumbs on inner pages (services, blog, portfolio)
- [x] **NAV-03**: Custom branded 404 error page with navigation back to key pages

### SEO

- [ ] **SEO-01**: Admin-editable meta titles and descriptions per page
- [ ] **SEO-02**: Open Graph and social sharing meta tags on all pages
- [ ] **SEO-03**: Auto-generated XML sitemap including all public routes, blog posts, and portfolio items
- [ ] **SEO-04**: JSON-LD structured data (Organization, Service, Article, LocalBusiness, FAQ schemas)
- [ ] **SEO-05**: Canonical URLs and hreflang tags linking EN/AR versions of each page

### Admin Panel

- [x] **ADMN-01**: Admin dashboard with key metrics (recent leads, post count, portfolio count)
- [x] **ADMN-02**: Blog post CRUD with rich text editor (Tiptap), bilingual fields, image upload, and preview
- [x] **ADMN-03**: Portfolio/case study CRUD with images, service category, and bilingual content
- [ ] **ADMN-04**: Contact lead list with status tracking (new, read, handled) and filtering
- [ ] **ADMN-05**: Testimonial management — add, edit, reorder, show/hide
- [x] **ADMN-06**: Service page content editing — structured fields for headings, descriptions, process steps
- [x] **ADMN-07**: Site settings — logo upload, primary/secondary color pickers, contact info, social links
- [x] **ADMN-08**: Media library — upload, browse, and reuse images with thumbnail generation
- [x] **ADMN-09**: Multi-role access — admin (everything) and editor (blog + portfolio only)
- [ ] **ADMN-10**: Team member management — add, edit, reorder team members with photos and bios

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Content

- **BLOG-10**: Scheduled/draft post publishing with publish date
- **BLOG-11**: Content versioning / revision history
- **PORT-05**: Video case studies with embedded player

### Advanced Engagement

- **ENGM-01**: Newsletter integration with email service (Mailchimp/SendGrid)
- **ENGM-02**: Search functionality when blog exceeds 50+ posts
- **ENGM-03**: Interactive service comparison tool with custom data

### Advanced Admin

- **ADMN-11**: Activity log / audit trail for admin actions
- **ADMN-12**: Content scheduling and workflow (draft → review → publish)
- **ADMN-13**: Analytics dashboard with traffic data integration

### Compliance

- **CMPL-01**: Cookie consent banner (if targeting EU markets)
- **CMPL-02**: Privacy policy and terms pages (admin-editable)

## Out of Scope

| Feature | Reason |
|---------|--------|
| User registration / visitor accounts | Showcase site, not a platform. Adds GDPR burden with zero business value |
| Real-time chat / chatbot | Requires real-time staffing or AI investment. WhatsApp + form higher-converting for services |
| E-commerce / payments | No products sold. PCI compliance burden unjustified |
| Client portal / project dashboard | Separate application domain, not a marketing site feature |
| Page builder / drag-and-drop admin | Enormous complexity. Structured editing is safer and sufficient |
| Auto-playing video with sound | Universally disliked, increases bounce rate |
| Infinite scroll on blog | Hurts SEO, prevents reaching footer, loses user position |
| Auto language detection / forced redirect | Frustrates expats and bilingual users. Let users choose |
| Social media feed embeds | Slow, break layout control, age poorly |
| Complex search (Elasticsearch) | Blog volume doesn't justify it for v1 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INTL-01 | Phase 1 | Complete |
| INTL-02 | Phase 1 | Complete |
| INTL-03 | Phase 1 | Complete |
| INTL-04 | Phase 1 | Complete |
| INTL-05 | Phase 1 | Complete |
| INTL-06 | Phase 1 | Complete |
| DSGN-01 | Phase 1 | Complete |
| DSGN-02 | Phase 1 | Complete |
| DSGN-03 | Phase 1 | Complete |
| DSGN-04 | Phase 1 | Complete |
| DSGN-05 | Phase 1 | Complete |
| DSGN-06 | Phase 1 | Partial |
| DSGN-07 | Phase 1 | Complete |
| DSGN-08 | Phase 1 | Complete |
| NAV-01 | Phase 1 | Complete |
| NAV-02 | Phase 1 | Complete |
| NAV-03 | Phase 1 | Complete |
| LAND-01 | Phase 2 | Complete |
| LAND-02 | Phase 2 | Complete |
| LAND-03 | Phase 2 | Complete |
| LAND-04 | Phase 2 | Complete |
| LAND-05 | Phase 2 | Complete |
| LAND-06 | Phase 2 | Complete |
| LAND-07 | Phase 2 | Complete |
| SRVC-01 | Phase 2 | Complete |
| SRVC-02 | Phase 2 | Complete |
| SRVC-03 | Phase 2 | Complete |
| SRVC-04 | Phase 2 | Complete |
| SRVC-05 | Phase 2 | Complete |
| CONT-01 | Phase 2 | Complete |
| CONT-02 | Phase 2 | Complete |
| CONT-03 | Phase 2 | Complete |
| CONT-04 | Phase 2 | Complete |
| CONT-05 | Phase 2 | Complete |
| CONT-06 | Phase 2 | Complete |
| CONT-07 | Phase 2 | Complete |
| TEAM-01 | Phase 2 | Complete |
| TEAM-02 | Phase 2 | Complete |
| TEAM-03 | Phase 2 | Complete |
| ADMN-01 | Phase 3 | Complete |
| ADMN-02 | Phase 3 | Complete |
| ADMN-03 | Phase 3 | Complete |
| ADMN-04 | Phase 3 | Pending |
| ADMN-05 | Phase 3 | Pending |
| ADMN-06 | Phase 3 | Complete |
| ADMN-07 | Phase 3 | Complete |
| ADMN-08 | Phase 3 | Complete |
| ADMN-09 | Phase 3 | Complete |
| ADMN-10 | Phase 3 | Pending |
| BLOG-01 | Phase 4 | Pending |
| BLOG-02 | Phase 4 | Pending |
| BLOG-03 | Phase 4 | Pending |
| BLOG-04 | Phase 4 | Pending |
| BLOG-05 | Phase 4 | Pending |
| BLOG-06 | Phase 4 | Pending |
| BLOG-07 | Phase 4 | Pending |
| BLOG-08 | Phase 4 | Pending |
| BLOG-09 | Phase 4 | Pending |
| PORT-01 | Phase 4 | Pending |
| PORT-02 | Phase 4 | Pending |
| PORT-03 | Phase 4 | Pending |
| PORT-04 | Phase 4 | Pending |
| SEO-01 | Phase 4 | Pending |
| SEO-02 | Phase 4 | Pending |
| SEO-03 | Phase 4 | Pending |
| SEO-04 | Phase 4 | Pending |
| SEO-05 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 67 total
- Mapped to phases: 67
- Unmapped: 0

---
*Requirements defined: 2026-03-28*
*Last updated: 2026-03-28 after roadmap creation*
