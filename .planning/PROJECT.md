# Quartz

## Current Milestone: v1.1 Brand Redesign & 3D Interactive Experience

**Goal:** Transform the current template-looking site into a unique, premium consultancy brand with an interactive 3D hero that makes Quartz instantly memorable and drives lead generation.

**Target features:**
- Full rebrand — new color palette, typography, logo, icon/illustration style, card/section layouts
- 3D interactive hero — Three.js Earth globe with Roblox-style robot characters representing each service
- Redesigned landing page — new section layouts, visual hierarchy, and flow that builds trust
- Redesigned portfolio — full case studies with depth, professional visuals, social proof
- Lead generation optimization — CTAs, trust signals, conversion paths throughout
- Visual language overhaul — new component designs that feel hand-crafted, not templated

## What This Is

A professional bilingual (English/Arabic) business website for Quartz Solutions, a company offering software development, automation, QA, and cybersecurity services. Built on Laravel + Inertia.js + React with a 3D interactive hero experience, premium brand identity, full-featured blog, portfolio gallery with in-depth case studies, service pages, and a custom admin panel for complete content and theme management.

## Core Value

Visitors immediately understand what services are offered, see proof of quality through case studies and testimonials, and can easily get in touch — in a visually polished, professional experience that builds trust.

## Requirements

### Validated

- [x] English/Arabic bilingual support with URL-based routing (/en/..., /ar/...) and full RTL layout — *Phase 01*
- [x] Dark/light mode toggle with smooth transitions — *Phase 01*
- [x] Scroll reveal animations, hero motion graphics, hover interactions, and page transitions — *Phase 01 + 02*
- [x] Landing page with hero animation, service overview sections, testimonials, and CTA — *Phase 02*
- [x] Individual service detail pages for each service — *Phase 02*
- [x] Multi-channel contact — form, WhatsApp, phone, email all visible — *Phase 02*
- [x] Portfolio gallery with visual grid, filterable by service type — *Phase 04*
- [x] Blog system with rich editor, categories/tags, SEO metadata, author profiles — *Phase 04*
- [x] Admin panel — manage blog posts, case studies, contact leads, all site content — *Phase 03*
- [x] Theme customization in admin — logos, colors, contact information — *Phase 03*
- [x] Multi-role authentication — admin and editor roles — *Phase 03*
- [x] SEO optimization — meta tags, OG images, structured data, sitemap — *Phase 04*

### Active

- [x] Full brand redesign — new color palette, typography, visual language, component designs — *Phase 05*
- [ ] 3D interactive hero — Three.js Earth globe with Roblox-style robot characters per service
- [ ] Landing page redesign — new section layouts, visual hierarchy, trust-building flow
- [ ] Portfolio redesign — full case studies (problem → approach → results), professional visuals, social proof
- [ ] Lead generation optimization — strategic CTAs, trust signals, conversion paths
- [x] Visual language overhaul — icons, cards, sections, animations that feel hand-crafted — *Phase 05*

### Out of Scope

- User registration / visitor accounts — this is a business showcase, not a user platform
- E-commerce / payment processing — no products being sold through the site
- Real-time chat / chatbot — contact form and direct channels are sufficient for v1
- Mobile app — web-first, responsive design covers mobile
- Client portal / project dashboard — separate concern from the marketing site
- Interactive learning courses (Educative-style) — deferred to v1.2 milestone

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
*Last updated: 2026-04-04 after Phase 05 Brand Design System completed*
