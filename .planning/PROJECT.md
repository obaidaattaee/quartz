# Quart

## What This Is

A professional bilingual (English/Arabic) business website for Quart, a company offering software development, automation, QA, and cybersecurity services. Built on the existing Laravel + Inertia.js + React stack, featuring a premium animated UI inspired by scotchpos.com, with a full-featured blog, portfolio gallery, service pages, and a custom admin panel for complete content and theme management.

## Core Value

Visitors immediately understand what services are offered, see proof of quality through case studies and testimonials, and can easily get in touch — in a visually polished, professional experience that builds trust.

## Requirements

### Validated

- [x] English/Arabic bilingual support with URL-based routing (/en/..., /ar/...) and full RTL layout — *Validated in Phase 01: Foundation & Design System*
- [x] Dark/light mode toggle with smooth transitions — *Validated in Phase 01*
- [x] Scroll reveal animations, hero motion graphics, hover interactions, and page transitions (scotchpos.com style) — *Validated in Phase 01 + Phase 02*
- [x] Landing page with hero animation, service overview sections, testimonials, and CTA — *Validated in Phase 02: Public Marketing Site*
- [x] Individual service detail pages for each service (dev, automation, QA, cybersecurity) — *Validated in Phase 02*
- [x] Multi-channel contact — form, WhatsApp, phone, email all visible — *Validated in Phase 02*
- [x] Scroll reveal animations applied to page content sections — *Validated in Phase 02*

### Active

- [ ] Portfolio gallery with visual grid of past work, filterable by service type
- [ ] Blog system with rich editor, categories/tags, SEO metadata, rich media embeds, and author profiles
- [ ] Admin panel — manage blog posts, case studies, contact leads, and all site content
- [ ] Theme customization in admin — logos, primary/secondary colors, contact information
- [ ] Multi-role authentication — admin and editor roles with different permissions
- [ ] SEO optimization — meta tags, OG images, structured data, sitemap

### Out of Scope

- User registration / visitor accounts — this is a business showcase, not a user platform
- E-commerce / payment processing — no products being sold through the site
- Real-time chat / chatbot — contact form and direct channels are sufficient for v1
- Mobile app — web-first, responsive design covers mobile
- Client portal / project dashboard — separate concern from the marketing site

## Context

- Existing Laravel 12 + Inertia.js 3 + React codebase with Tailwind CSS, already configured
- Teams support is already implemented in the starter kit
- Design inspiration: scotchpos.com — premium feel with scroll animations, dynamic hero, hover effects, smooth page transitions
- Target audience: businesses and organizations looking for software/tech services
- Arabic RTL support is a first-class requirement, not an afterthought — layout, typography, and animations must work in both directions
- Admin panel is React-based (not a separate SPA) — uses the same Inertia.js stack

## Constraints

- **Tech stack**: Laravel 12 + Inertia.js 3 + React + Tailwind CSS — already established in the codebase
- **Bilingual**: All user-facing content must work in both English (LTR) and Arabic (RTL)
- **Animation library**: Must integrate cleanly with React + Inertia page transitions (Framer Motion or similar)
- **SEO**: Server-side rendering via Inertia for search engine visibility
- **Admin UX**: Non-technical users must be able to manage all content without touching code

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| URL-based i18n (/en/, /ar/) | Better SEO, shareable language-specific links, cleaner routing | Implemented Phase 01 |
| Portfolio gallery over full case study pages | Quicker to populate, visual-first approach matches service business | — Pending |
| Multi-role auth (admin + editor) | Content team needs access without full admin privileges | — Pending |
| Theme customization in admin panel | Client can rebrand without developer involvement | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-28 after Phase 02 completion*
