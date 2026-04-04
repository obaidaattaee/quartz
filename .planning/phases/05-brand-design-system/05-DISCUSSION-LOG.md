# Phase 5: Brand Design System - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-04-04
**Phase:** 05-Brand Design System
**Mode:** auto (all questions auto-resolved with recommended defaults)
**Areas discussed:** Color palette evolution, Typography pairing, Component shape language, Motion design expansion, Service icon style, Asset sourcing approach

---

## Color Palette Evolution

| Option | Description | Selected |
|--------|-------------|----------|
| Evolve teal -- richer palette | Keep teal as primary, expand semantic depth | ✓ |
| New primary color | Shift away from teal to a different accent | |
| Dual accent system | Two equal primary colors (teal + secondary) | |

**User's choice:** [auto] Evolve teal -- richer palette with more semantic depth
**Notes:** Teal/emerald is established identity from v1.0. Evolution preserves brand recognition while adding sophistication.

| Option | Description | Selected |
|--------|-------------|----------|
| 8 semantic token groups | background, foreground, primary, secondary, accent, muted, card, border | ✓ |
| 6 minimal tokens | Fewer groups, simpler system | |
| 12 extended tokens | More granular, includes success/warning/info | |

**User's choice:** [auto] 8 semantic token groups in oklch
**Notes:** Matches existing app.css structure. 8 groups provide enough differentiation without excessive complexity.

| Option | Description | Selected |
|--------|-------------|----------|
| Intentionally designed dark mode | Custom surfaces, adjusted saturation, teal glows | ✓ |
| Computed inversion | Algorithmic light-to-dark mapping | |

**User's choice:** [auto] Intentionally designed with adjusted saturation and custom surfaces
**Notes:** BRAND-06 explicitly requires this. Dark navy/slate backgrounds, not pure black.

---

## Typography Pairing

| Option | Description | Selected |
|--------|-------------|----------|
| Space Grotesk display | Geometric, modern, distinctive personality | ✓ |
| Plus Jakarta Sans | Rounded, friendly, less distinctive | |
| General Sans | Clean geometric, similar to Inter | |

**User's choice:** [auto] Space Grotesk for display headings
**Notes:** Geometric personality distinguishes from generic sans-serif sites. Variable font available.

| Option | Description | Selected |
|--------|-------------|----------|
| Keep Cairo for Arabic | Established, distinctive, good weight range | ✓ |
| Switch to Noto Sans Arabic | More neutral, wider ecosystem support | |
| IBM Plex Arabic | Technical feel, good pairing with geometric fonts | |

**User's choice:** [auto] Keep Cairo -- established and distinctive
**Notes:** Cairo was deliberately chosen in Phase 1 (D-07) for its personality. No reason to change.

| Option | Description | Selected |
|--------|-------------|----------|
| Keep Instrument Sans body | Proven readability, complements Space Grotesk | ✓ |
| Switch body to Space Grotesk | Single font family, simpler loading | |
| Switch to Inter | Universal fallback, maximum readability | |

**User's choice:** [auto] Keep Instrument Sans as body font
**Notes:** Display/body contrast (Space Grotesk / Instrument Sans) creates visual hierarchy.

---

## Component Shape Language

| Option | Description | Selected |
|--------|-------------|----------|
| Medium rounded (8px base) | Modern tech aesthetic, not pill-shaped | ✓ |
| Sharp geometric (4px base) | Crisp, editorial feel | |
| Soft rounded (16px base) | Friendly, approachable, more playful | |

**User's choice:** [auto] Medium rounded (8px base)
**Notes:** 8px is the industry sweet spot for modern SaaS/tech brands. Reduces from current 10px.

| Option | Description | Selected |
|--------|-------------|----------|
| 3-level shadow scale | sm/md/lg with mode-specific treatment | ✓ |
| 2-level minimal | Flat with minimal shadow, border-focused | |
| 5-level detailed | Full elevation system like Material Design | |

**User's choice:** [auto] 3-level shadow scale
**Notes:** Light mode uses subtle gray shadows; dark mode uses surface elevation + subtle border glow.

| Option | Description | Selected |
|--------|-------------|----------|
| 4px base grid | 4/8/12/16/20/24/32/40/48/64/80 | ✓ |
| 8px base grid | Simpler, fewer steps | |

**User's choice:** [auto] 4px base grid
**Notes:** 4px gives finer control needed for component internals while keeping section spacing clean.

---

## Motion Design Expansion

| Option | Description | Selected |
|--------|-------------|----------|
| Extend existing system | Keep scroll reveals and crossfade, add interaction + ambient | ✓ |
| Full redesign | New animation philosophy from scratch | |
| Minimal extension | Only add what's explicitly required | |

**User's choice:** [auto] Extend existing -- keep proven patterns, add new categories
**Notes:** v1.0 animations work well. Adding interaction and ambient patterns completes the language.

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle ambient motion | Gradient shifts + floating elements, hero/features only | ✓ |
| No ambient motion | Static backgrounds, motion only on user interaction | |
| Bold ambient motion | Prominent background animations across all sections | |

**User's choice:** [auto] Subtle ambient motion on hero/feature sections
**Notes:** Decorative and scoped. Disabled for prefers-reduced-motion users (Phase 1 D-06).

---

## Service Icon Style

| Option | Description | Selected |
|--------|-------------|----------|
| Duotone (line + accent fill) | Line icons with teal accent fills, consistent stroke | ✓ |
| Line only | Minimal stroke icons, no fills | |
| Filled | Solid teal shapes with white negative space | |
| Illustrative | Detailed mini-illustrations per service | |

**User's choice:** [auto] Duotone -- line icons with brand accent fills
**Notes:** Duotone creates brand-specific visual language. Teal fills tie icons to palette.

---

## Asset Sourcing Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Google Fonts self-hosted | Space Grotesk + Cairo as WOFF2 variable fonts | ✓ |
| Premium font license | Purchased commercial font | |
| System font stack | No custom fonts, native system fonts | |

**User's choice:** [auto] Google Fonts (Space Grotesk + Cairo) self-hosted as variable fonts
**Notes:** Free, high quality, variable font support. Self-hosted for performance and no CDN dependency.

| Option | Description | Selected |
|--------|-------------|----------|
| Custom SVGs to brand spec | Icons designed specifically for the brand | ✓ |
| Adapted from icon library | Start from Lucide/Heroicons, customize | |
| Stock icon set | Purchase pre-made icon set | |

**User's choice:** [auto] Custom SVGs designed to brand spec
**Notes:** Generic library icons don't match the duotone brand requirement. Custom ensures cohesion.

---

## Claude's Discretion

- Exact oklch values for all color tokens
- Space Grotesk weight selection per heading level
- Shadow color values and blur/spread amounts
- Ambient animation specific easing curves and timing
- Service icon detailed geometry
- Noise/grain texture intensity
- Geometric accent shape designs

## Deferred Ideas

- Robot mascot illustrations -- Phase 6
- 3D robot models and Earth textures -- Phase 9
- Client logo assets -- Phase 8
