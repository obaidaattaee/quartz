# Phase 1: Foundation & Design System - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-28
**Phase:** 01-Foundation & Design System
**Areas discussed:** Brand colors & visual tone, Animation personality, Arabic font & typography, Header nav & site structure

---

## Brand Colors & Visual Tone

### Visual Tone

| Option | Description | Selected |
|--------|-------------|----------|
| Dark premium | Dark backgrounds, accent glows, metallic/gradient highlights. Conveys high-end tech agency. | :heavy_check_mark: |
| Clean modern | White backgrounds, bold accent color, generous whitespace. Professional but approachable. | |
| Bold gradient | Vibrant gradients as hero elements, dark sections mixed with light. Eye-catching and energetic. | |

**User's choice:** Dark premium
**Notes:** Matches scotchpos.com inspiration. Think Linear, Vercel, Stripe aesthetic.

### Accent Color

| Option | Description | Selected |
|--------|-------------|----------|
| Electric blue / cyan | Tech-forward, trustworthy. Works great with dark backgrounds for glow effects. | |
| Teal / emerald | Growth-oriented, premium feel. Slightly warmer than pure blue. Unique in tech agency space. | :heavy_check_mark: |
| Purple / violet | Creative, innovative. Strong gradient potential. Stands out from typical blue tech sites. | |

**User's choice:** Teal / emerald (#14B8A6 primary, #0D9488 glow)
**Notes:** None

### Light Mode Treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Dark-first, light as alt | Dark mode is the default and hero experience. Light mode is a clean white alternative. | |
| Equal treatment | Both modes get equal design attention. System preference decides. | :heavy_check_mark: |
| Dark only | Skip light mode entirely. | |

**User's choice:** Equal treatment
**Notes:** Neither mode is the "default" — system preference decides.

### Glass-morphism Intensity

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle accents | Light frosted glass on cards, faint teal glow on CTAs. | |
| Bold and prominent | Strong backdrop-blur, visible glow halos, gradient borders. | |
| You decide | Let Claude calibrate during implementation. | :heavy_check_mark: |

**User's choice:** You decide
**Notes:** Claude's discretion.

---

## Animation Personality

### Scroll Reveal Intensity

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle fade + slide | Fade-in + translate-y(20px), 0.3-0.5s duration, stagger 0.1s. Professional, not flashy. | :heavy_check_mark: |
| Dynamic with parallax | Layered parallax, staggered card reveals with scale, sections slide/rotate. scotchpos.com level. | |
| Cinematic / heavy | Full-screen sequences, 3D transforms, text character splitting, magnetic cursor. | |

**User's choice:** Subtle fade + slide
**Notes:** Refined, fast, professional feel.

### Page Transitions

| Option | Description | Selected |
|--------|-------------|----------|
| Crossfade | Simple opacity crossfade (~0.3s). Fast, clean, excellent Inertia compatibility. | :heavy_check_mark: |
| Slide + fade | Content slides slightly in direction of navigation while fading. | |
| No transition | Instant page swap. | |

**User's choice:** Crossfade
**Notes:** Snappy, SPA-like feel.

### Hover Micro-interactions

| Option | Description | Selected |
|--------|-------------|----------|
| Lift + glow | Cards lift slightly with enhanced shadow. Buttons get subtle teal glow ring. | |
| Scale + color shift | Cards scale up slightly (1.02x). Buttons shift background color. | |
| You decide | Let Claude pick appropriate micro-interactions. | :heavy_check_mark: |

**User's choice:** You decide
**Notes:** Claude's discretion.

---

## Arabic Font & Typography

### Arabic Font Family

| Option | Description | Selected |
|--------|-------------|----------|
| IBM Plex Sans Arabic | Geometric, clean, corporate. Good weight range. ~180KB. | |
| Tajawal | Modern, slightly rounded. Softer feel. ~120KB. | |
| Cairo | Contemporary, distinctive. Slightly heavier strokes. ~200KB. Variable font available. | :heavy_check_mark: |

**User's choice:** Cairo
**Notes:** Distinctive personality, works well for an agency brand.

### Font Loading Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Subset + swap | Load only Arabic glyphs needed, font-display: swap. Standard best practice. | |
| Preload critical weights | Preload 400+700 weights in <head>. No swap flash but +400KB. | |
| You decide | Let Claude pick best loading strategy. | :heavy_check_mark: |

**User's choice:** You decide
**Notes:** Claude's discretion.

---

## Header Nav & Site Structure

### Header Navigation Items

| Option | Description | Selected |
|--------|-------------|----------|
| 5 items + CTA | Home, Services, Portfolio, Blog, About + Contact Us CTA. | |
| 4 items + CTA | Logo=Home, Services, Portfolio, Blog, About + Contact Us CTA. | :heavy_check_mark: |
| 6 items + CTA | Home, Services, Portfolio, Blog, About, Careers + Contact Us CTA. | |

**User's choice:** 4 items + CTA
**Notes:** Logo acts as Home link. Services has dropdown with 4 sub-items. Right side: language switcher + dark/light toggle.

### Header Scroll Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Transparent to solid | Starts transparent over hero, gains frosted glass bg on scroll. | :heavy_check_mark: |
| Always solid | Always has solid background matching theme. | |
| Hide on scroll down | Hides scrolling down, reappears scrolling up. | |

**User's choice:** Transparent to solid (frosted glass)
**Notes:** Premium feel, hero gets full visual impact.

### Footer Layout

| Option | Description | Selected |
|--------|-------------|----------|
| 4-column grid | Logo+tagline, Services links, Quick links, Contact+social. Bottom bar with copyright. | :heavy_check_mark: |
| 3-column compact | Logo+about, Navigation links, Contact+social. Tighter layout. | |
| You decide | Let Claude design footer layout. | |

**User's choice:** 4-column grid
**Notes:** Newsletter capture in first column. Bottom bar: copyright + Privacy + Terms.

### 404 Page

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal branded | Logo, "Page not found" message, links to Home and Contact. | |
| Playful illustration | Custom illustration with lighthearted message. | |
| You decide | Let Claude design the 404 page. | :heavy_check_mark: |

**User's choice:** You decide
**Notes:** Claude's discretion — branded, on-theme.

---

## Claude's Discretion

- Glass-morphism and glow effect intensity
- Hover micro-interactions on buttons and cards
- Arabic font loading strategy
- 404 page design and personality

## Deferred Ideas

None — discussion stayed within phase scope.
