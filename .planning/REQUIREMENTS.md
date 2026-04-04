# Requirements: Quartz Solutions

**Defined:** 2026-04-04
**Core Value:** Visitors immediately understand what services are offered, see proof of quality through case studies and testimonials, and can easily get in touch — in a visually polished, professional experience that builds trust.

## v1.1 Requirements

Requirements for milestone v1.1: Brand Redesign & 3D Interactive Experience. Each maps to roadmap phases.

### Brand Design System

- [x] **BRAND-01**: New color palette (6-8 semantic tokens) for light and dark modes using oklch
- [x] **BRAND-02**: New typography pairing — display font + body font with Arabic glyph support
- [x] **BRAND-03**: Component design language — new card styles, button designs, border radius, shadow scale, spacing rhythm
- [ ] **BRAND-04**: Motion design language — defined entrance, transition, interaction, and ambient animation patterns
- [ ] **BRAND-05**: Custom service icons matching the brand aesthetic (dev, automation, QA, cybersecurity)
- [x] **BRAND-06**: Dark mode palette that feels designed (adjusted saturation, custom surfaces) not inverted
- [x] **BRAND-07**: Source and download all brand assets — fonts, icons, illustrations, textures

### Landing Page Redesign

- [ ] **LAND-01**: New hero section with bold value proposition and clear CTA (Mailchimp-style content-first)
- [ ] **LAND-02**: Scroll-driven storytelling flow — sections unfold as a narrative building trust toward conversion
- [ ] **LAND-03**: Service overview with custom icons and concise copy that explains each offering
- [ ] **LAND-04**: Robot mascot characters woven into sections as brand illustrations (2D/SVG)
- [ ] **LAND-05**: Redesigned testimonials section with stronger visual treatment
- [ ] **LAND-06**: New section layouts with intentional spacing rhythm and visual hierarchy
- [ ] **LAND-07**: Source and download robot mascot illustrations (2D/SVG) for brand identity

### Portfolio Case Studies

- [ ] **PORT-01**: Problem → Approach → Results narrative structure with dedicated DB fields
- [ ] **PORT-02**: Animated visual metrics — count-up numbers, percentage bars, before/after comparisons
- [ ] **PORT-03**: Full-bleed project imagery with device mockup frames and lightbox gallery
- [ ] **PORT-04**: Client testimonial tied to each case study (optional per project)
- [ ] **PORT-05**: Technology/tools used badges per project
- [ ] **PORT-06**: Related projects navigation and "Next Project" at bottom of case study

### Lead Generation

- [ ] **LEAD-01**: Strategic CTA placement after trust-building moments on all pages
- [ ] **LEAD-02**: Enhanced statistics section with animated count-up numbers on scroll
- [ ] **LEAD-03**: Client logo marquee — auto-scrolling, grayscale-to-color on hover
- [ ] **LEAD-04**: Trust signals placed adjacent to CTAs ("Trusted by 50+ companies")
- [ ] **LEAD-05**: WhatsApp floating action button with RTL positioning support

### 3D Interactive Hero

- [ ] **3DHR-01**: Three.js Earth globe as hero centerpiece using React Three Fiber
- [ ] **3DHR-02**: 4 Roblox-style robot characters on globe representing each service
- [ ] **3DHR-03**: Interactive controls — rotate, zoom, hover robots for tooltips
- [ ] **3DHR-04**: Branded loading transition — placeholder cross-fades into 3D scene
- [ ] **3DHR-05**: Mobile fallback — static illustration for devices that can't run WebGL
- [ ] **3DHR-06**: Source and download 3D robot models (GLTF/GLB) and Earth textures from open libraries

## Future Requirements

### Interactive Learning Platform (v1.2)

- **LEARN-01**: Interactive coding courses and learning paths (Educative-style)
- **LEARN-02**: Software best practices and scaling guides
- **LEARN-03**: Progress tracking for learners

## Out of Scope

| Feature | Reason |
|---------|--------|
| Custom cursor interactions | Added complexity for marginal UX gain — revisit post-launch |
| Page transitions with shared elements | High complexity with Inertia.js coordination — defer to polish phase |
| Full-screen 3D-only hero | Destroys conversion — text must remain primary |
| Auto-playing background video | Redundant with 3D hero, massive performance cost |
| Chatbot / AI assistant | Simple decision tree doesn't need a bot — direct contact is better |
| Mega-menu navigation | Only 5-6 top-level pages — flat nav is sufficient |
| Heavy post-processing effects | Destroys mobile performance for target markets |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BRAND-01 | Phase 5 | Complete |
| BRAND-02 | Phase 5 | Complete |
| BRAND-03 | Phase 5 | Complete |
| BRAND-04 | Phase 5 | Pending |
| BRAND-05 | Phase 5 | Pending |
| BRAND-06 | Phase 5 | Complete |
| BRAND-07 | Phase 5 | Complete |
| LAND-01 | Phase 6 | Pending |
| LAND-02 | Phase 6 | Pending |
| LAND-03 | Phase 6 | Pending |
| LAND-04 | Phase 6 | Pending |
| LAND-05 | Phase 6 | Pending |
| LAND-06 | Phase 6 | Pending |
| LAND-07 | Phase 6 | Pending |
| PORT-01 | Phase 7 | Pending |
| PORT-02 | Phase 7 | Pending |
| PORT-03 | Phase 7 | Pending |
| PORT-04 | Phase 7 | Pending |
| PORT-05 | Phase 7 | Pending |
| PORT-06 | Phase 7 | Pending |
| LEAD-01 | Phase 8 | Pending |
| LEAD-02 | Phase 8 | Pending |
| LEAD-03 | Phase 8 | Pending |
| LEAD-04 | Phase 8 | Pending |
| LEAD-05 | Phase 8 | Pending |
| 3DHR-01 | Phase 9 | Pending |
| 3DHR-02 | Phase 9 | Pending |
| 3DHR-03 | Phase 9 | Pending |
| 3DHR-04 | Phase 9 | Pending |
| 3DHR-05 | Phase 9 | Pending |
| 3DHR-06 | Phase 9 | Pending |

**Coverage:**
- v1.1 requirements: 31 total
- Mapped to phases: 31
- Unmapped: 0

---
*Requirements defined: 2026-04-04*
*Last updated: 2026-04-04 after roadmap creation*
