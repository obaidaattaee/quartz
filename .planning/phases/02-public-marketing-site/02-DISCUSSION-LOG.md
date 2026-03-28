# Phase 2: Public Marketing Site - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 02-public-marketing-site
**Mode:** auto (all decisions auto-selected)
**Areas discussed:** Hero visual approach, Service pages structure, Contact system, Content data strategy, Landing page sections, About & team, FAQ, Newsletter

---

## Hero Visual Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Animated gradient + geometric accents | Dark gradient with teal glows, floating SVG shapes, bold text entrance | ✓ |
| Video background | Full-screen video with overlay text | |
| 3D/WebGL elements | Interactive 3D scene (Three.js) | |
| Static hero image | Full-width image with text overlay | |

**User's choice:** [auto] Animated gradient + geometric accents (recommended: matches Phase 01 design decisions D-01/D-02, no heavy dependencies)
**Notes:** Avoids video/3D complexity. Gradient approach is fast-loading, works in both themes, and aligns with Linear/Vercel aesthetic.

---

## Service Pages Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Full dedicated pages | Problem→approach→deliverables with visual process steps per service | ✓ |
| Tabs on single page | All 4 services on one page with tab navigation | |
| Compact cards only | Service info contained within landing page cards, no detail pages | |

**User's choice:** [auto] Full dedicated pages (recommended: directly satisfies SRVC-01 through SRVC-05)
**Notes:** Each service gets proper SEO weight as its own URL. Problem-solution framing matches SRVC-02.

---

## Contact System & Spam Protection

| Option | Description | Selected |
|--------|-------------|----------|
| Honeypot + rate limiting | Hidden field catches bots, server limits submissions per IP | ✓ |
| reCAPTCHA v3 | Google invisible CAPTCHA, score-based | |
| hCaptcha | Privacy-focused CAPTCHA alternative | |

**User's choice:** [auto] Honeypot + rate limiting (recommended: cleanest UX, no third-party dependency)
**Notes:** For a service business site, contact form volume is low. Honeypot handles most spam bots effectively.

---

## Content Data Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Translation JSON files | Extend en.json/ar.json with structured content keys | ✓ |
| Database models immediately | Create content models and seeders now | |
| Markdown files | Content in markdown files loaded at build time | |

**User's choice:** [auto] Translation JSON files (recommended: reuses Phase 01 i18n system, clean migration to Phase 3 admin)
**Notes:** Database models only needed for user-submitted data (contacts, newsletter). Static content stays in JSON until admin panel in Phase 3.

---

## Statistics & Counters

| Option | Description | Selected |
|--------|-------------|----------|
| 4 key metrics with count-up | Years, Projects, Clients, Team — requestAnimationFrame counter | ✓ |
| Infographic style | Visual charts/graphs embedded | |
| No counters | Skip statistics section | |

**User's choice:** [auto] 4 key metrics with count-up (recommended: standard social proof for tech agencies)
**Notes:** Counter values stored in translation JSON. Animation uses requestAnimationFrame — no external library.

---

## Comparison Section (Old Way vs New Way)

| Option | Description | Selected |
|--------|-------------|----------|
| Side-by-side cards | Two columns: pain points vs benefits, scroll reveal | ✓ |
| Interactive slider | Drag slider to reveal before/after | |
| Toggle switch | Click to swap between old/new views | |

**User's choice:** [auto] Side-by-side cards (recommended: simpler, works in RTL, accessible)
**Notes:** Interactive slider is cool but fragile in RTL layouts. Static cards with ScrollReveal keep it clean.

---

## Claude's Discretion

- Hero gradient colors and animation timing
- Service page icon selection
- Contact form field layout
- Statistics counter animation easing
- Team member card hover effect
- FAQ placeholder content
- ScrollReveal thresholds per section

## Deferred Ideas

- Email service integration for newsletter (Mailchimp/SendGrid) — v2 ENGM-01
- Portfolio gallery — Phase 4
- Blog — Phase 4
- Admin-managed content — Phase 3
