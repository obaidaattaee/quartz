# Phase 2: Public Marketing Site - Context

**Gathered:** 2026-03-28 (auto mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Landing page with animated hero, service overview, testimonials, statistics, and CTAs. Four individual service detail pages. Contact page with validated form, map, and multi-channel info. About page with company story, team members, and certifications. Newsletter capture and FAQ with structured data. All pages bilingual (EN/AR), using ScrollReveal animations and the design system from Phase 01.

</domain>

<decisions>
## Implementation Decisions

### Hero Section Visual Approach
- **D-01:** Animated gradient background (dark with teal/emerald glow accents) with bold text entrance animation. Floating geometric shapes or abstract tech-inspired SVG elements as background accents — subtle, not distracting.
- **D-02:** Hero text uses staggered fade-in-up animation from Phase 01 animation system. Primary CTA ("Get in Touch" / "Contact Us") uses teal accent button with hover glow effect.
- **D-03:** Hero must work in both dark and light modes with equal visual impact. No video or heavy 3D — keep it fast-loading and accessible.

### Service Pages Structure
- **D-04:** Each of the 4 services (Software Development, Automation, QA, Cybersecurity) gets its own dedicated full-page with: hero banner with service icon, problem statement section, approach/methodology section, deliverables list, and a bottom CTA that pre-fills the contact form with the service type.
- **D-05:** Process/methodology section uses numbered visual steps (1-2-3-4 flow) with icons — not a flowchart or timeline. Steps appear with ScrollReveal stagger animation.
- **D-06:** Service overview on landing page uses 4 cards in a grid linking to detail pages. Cards have icon, title, brief description, and hover micro-interaction (from Phase 01 card component).

### Contact System
- **D-07:** Contact form fields: name (required), email (required), phone (optional), service interest (dropdown with 4 services + "General Inquiry"), message (required). Laravel server-side validation + client-side Inertia form validation.
- **D-08:** Spam protection: honeypot hidden field + server-side rate limiting (5 submissions per IP per hour). No CAPTCHA — cleaner UX for a service business.
- **D-09:** Map: static Google Maps embed (iframe) or styled image with a "View on Google Maps" link. No JavaScript map library needed.
- **D-10:** Email notification to admin on form submission using Laravel Mail notification. Store lead in database with `Contact` model (name, email, phone, service, message, status: new/read/handled).
- **D-11:** Multi-channel display: WhatsApp link (wa.me/...), phone tel: link, email mailto: link — all visible on contact page AND in footer (already in Phase 01 footer).

### Content Data Strategy
- **D-12:** All page content (hero text, service descriptions, about content, testimonials, FAQ, team bios) stored in translation JSON files (en.json/ar.json) using structured keys (e.g., `services.development.title`, `testimonials.0.quote`). This uses the existing i18n system from Phase 01.
- **D-13:** Contact form submissions and newsletter signups are the only database-backed data in Phase 2. A `Contact` model and `NewsletterSubscriber` model are created with migrations.
- **D-14:** When Phase 3 admin panel adds database-driven content management, the JSON content becomes seed data / fallback defaults. The migration path is: JSON → database with admin UI.

### Landing Page Sections
- **D-15:** Section order on landing page: Hero → Service Overview Cards → Client Logo Bar → Statistics Counters → Testimonials → Old Way vs New Way Comparison → Bottom CTA. All sections wrapped in ScrollReveal.
- **D-16:** Statistics section: 4 animated counters (Years of Experience, Projects Completed, Clients Served, Team Members). Count-up animation triggers on scroll using requestAnimationFrame — no external counter library.
- **D-17:** Testimonials: 3-4 static testimonials in a horizontal card layout (not a carousel/slider). Each card: quote text, client name, company name, optional avatar. Data from translation JSON.
- **D-18:** Old Way vs New Way: side-by-side card comparison (two columns). Left card: pain points with the old approach. Right card: benefits of Quart's approach. ScrollReveal entrance. Not interactive (no slider/toggle) — simpler, works in RTL.
- **D-19:** Client logo bar: horizontal flex row of grayscale logos that colorize on hover. 6-8 placeholder logos for now (real logos added via admin in Phase 3).

### About & Team Page
- **D-20:** About page sections: Company story/mission hero, team member grid, certifications/badges section.
- **D-21:** Team members displayed in a card grid: photo, name, role, short bio. 3-4 placeholder entries in translation JSON. Hover reveals social links or expanded bio.
- **D-22:** Certifications section: badge/logo grid with labels — similar to client logo bar styling.

### FAQ Section
- **D-23:** FAQ uses accordion component (Radix UI Accordion already available). 6-8 questions covering common service inquiries. FAQ JSON-LD structured data (CONT-06) added via Inertia Head component for SEO.
- **D-24:** FAQ lives on its own route (/en/faq, /ar/faq) — linked from footer quick links (already in Phase 01 footer).

### Newsletter Capture
- **D-25:** Newsletter email input + submit button in footer (already positioned in Phase 01 footer layout). Backend stores email in `newsletter_subscribers` table with email, locale, and subscribed_at. No email service integration in Phase 2 (deferred to v2 ENGM-01).

### Claude's Discretion
- Exact hero gradient colors and animation timing — calibrate for visual impact
- Service page icon selection (Lucide icons or custom SVGs)
- Contact form field layout (single column vs two-column for name/email)
- Statistics counter animation easing and duration
- Team member card hover effect style
- FAQ content — write reasonable placeholder questions
- ScrollReveal thresholds and stagger timing per section

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Landing Page Requirements
- `.planning/REQUIREMENTS.md` — LAND-01 through LAND-07: Hero, service overview, logos, testimonials, statistics, comparison, CTA

### Service Page Requirements
- `.planning/REQUIREMENTS.md` — SRVC-01 through SRVC-05: Detail pages, problem-solution, process steps, per-service CTA, scroll animations

### Contact & Lead Generation
- `.planning/REQUIREMENTS.md` — CONT-01 through CONT-07: Form, multi-channel, map, email notification, spam protection, FAQ, newsletter

### About & Team
- `.planning/REQUIREMENTS.md` — TEAM-01 through TEAM-03: Company story, team members, certifications

### Phase 01 Foundation (Must Reuse)
- `resources/js/layouts/public-layout.tsx` — PublicLayout shell (header, footer) — all Phase 2 pages use this
- `resources/js/components/scroll-reveal.tsx` — ScrollReveal component for section animations
- `resources/js/lib/animations.ts` — Motion animation variants (fadeInUp, stagger, etc.)
- `resources/js/hooks/use-locale.tsx` — i18n hook for translations
- `resources/js/hooks/use-reduced-motion.tsx` — Accessibility: reduced motion detection
- `resources/js/components/ui/` — Radix UI components (button, card, input, badge, accordion, etc.)
- `resources/lang/en.json` — English translations (extend with Phase 2 content)
- `resources/lang/ar.json` — Arabic translations (extend with Phase 2 content)
- `resources/css/app.css` — Design tokens, brand colors, global styles

### Phase 01 Context (Design Decisions)
- `.planning/phases/01-foundation-design-system/01-CONTEXT.md` — Brand colors, animation personality, typography, layout decisions

### Project Context
- `.planning/PROJECT.md` — Vision, constraints, and key decisions
- `.planning/ROADMAP.md` — Phase 2 success criteria and requirement mapping

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PublicLayout` — header/footer shell, ready for page content
- `ScrollReveal` component — wraps sections with scroll-triggered fade animations
- `animations.ts` — 9 Framer Motion variants (fadeInUp, fadeInDown, staggerContainer, etc.)
- `useLocale()` hook — returns `{ locale, direction, isRTL, t, switchLocaleUrl }`
- `useReducedMotion()` hook — returns boolean for accessibility
- `useScrollHeader()` hook — tracks scroll position for header transition
- Radix UI: Button, Card, Input, Badge, Accordion, Dialog, DropdownMenu, Sheet, NavigationMenu
- `cn()` utility — Tailwind class merging
- `language-switcher.tsx` — locale switching component
- `theme-toggle.tsx` — dark/light mode toggle
- Existing `home.tsx` placeholder — will be replaced with full landing page

### Established Patterns
- Pages use `Component.layout` pattern to assign PublicLayout
- Translations accessed via `t('key.path')` from useLocale hook
- CSS custom properties (oklch) for brand colors in app.css
- Inertia `Head` component for per-page meta tags
- Laravel controllers render Inertia pages with `Inertia::render('page-name', $props)`
- Route model binding with locale prefix: `/en/services/development`, `/ar/services/development`

### Integration Points
- `routes/web.php` — add new public routes (services, contact, about, faq) under locale prefix group
- `resources/lang/en.json` / `ar.json` — extend with all Phase 2 content strings
- `app/Http/Controllers/` — new controllers for Contact form submission, newsletter signup
- `database/migrations/` — new tables: contacts, newsletter_subscribers
- `app/Models/` — new models: Contact, NewsletterSubscriber
- `app/Mail/` or `app/Notifications/` — contact form email notification
- `resources/js/pages/public/` — new page components (home replacement, services, contact, about, faq)
- `resources/js/components/` — new components (hero, service-card, testimonial-card, counter, etc.)

</code_context>

<specifics>
## Specific Ideas

- scotchpos.com inspiration — premium dark gradient hero with floating elements, smooth scroll reveals, polished micro-interactions
- Service cards should "feel" like clicking into a detailed portfolio — visual, not text-heavy
- Contact form should feel effortless — minimal fields, clear validation, instant feedback
- Arabic version should feel native, not translated — layout mirrors naturally, content reads naturally
- Statistics counters add credibility — visible "proof" of track record before reaching testimonials
- FAQ doubles as SEO content (JSON-LD structured data for rich snippets)

</specifics>

<deferred>
## Deferred Ideas

- Email service integration for newsletter (Mailchimp/SendGrid) — v2 ENGM-01
- Portfolio gallery and case studies — Phase 4
- Blog system — Phase 4
- Admin-managed content (replacing JSON translations) — Phase 3
- SEO meta tags and structured data beyond FAQ — Phase 4

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-public-marketing-site*
*Context gathered: 2026-03-28*
