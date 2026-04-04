# Phase 5: Brand Design System - Context

**Gathered:** 2026-04-04 (auto mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

New color palette (6-8 semantic tokens in oklch) for light and dark modes, new typography pairing (display + body) with Arabic glyph support, component design language (cards, buttons, inputs, sections with new border-radius, shadow scale, spacing rhythm), motion design language (entrance, transition, interaction, ambient animation patterns), custom service icons for the four services, dark mode palette that feels designed (not inverted), and sourcing/downloading all brand assets (fonts, icons, illustrations, textures). Scoped to public pages only -- admin panel must not break during rebrand.

</domain>

<decisions>
## Implementation Decisions

### Color Palette Evolution
- **D-01:** Evolve the existing teal/emerald palette into a richer, more nuanced system -- keep teal as the primary brand color (established identity from v1.0) but expand with more semantic depth and intentional contrast ratios
- **D-02:** 8 semantic token groups in oklch: background, foreground, primary (teal), secondary, accent, muted, card, border -- each with light and dark mode variants. Total ~16-20 CSS custom properties (matching the existing `app.css` variable structure)
- **D-03:** Light mode: clean, warm whites with subtle teal tinting on surfaces. Not sterile/cold -- feels inviting and premium. Background should have slight warmth, cards slightly elevated
- **D-04:** Dark mode: intentionally designed with adjusted saturation and custom surface colors (BRAND-06). Deep navy/slate backgrounds (not pure black), teal accent glows with reduced chroma for eye comfort. Surfaces differentiated by lightness steps (3-4 elevation levels)
- **D-05:** All color tokens use oklch for perceptual uniformity. Chroma and lightness calibrated so that swapping between modes feels like a designed experience, not a CSS filter

### Typography Pairing
- **D-06:** English display font: Space Grotesk -- geometric, modern, distinctive personality. Used for h1-h3 headings, hero text, section titles. Variable font for weight flexibility (300-700)
- **D-07:** English body font: keep Instrument Sans -- proven readability from v1.0, pairs well with Space Grotesk as display/body contrast. Used for paragraphs, UI text, navigation
- **D-08:** Arabic font: keep Cairo Variable -- established in v1.0 (Phase 1 D-07), distinctive character with good weight range (200-1000). Used for both display and body in Arabic. No separate Arabic display font needed since Cairo has strong heading presence
- **D-09:** Type scale: define 7 size steps (xs, sm, base, lg, xl, 2xl, 3xl) with corresponding line-heights. Display headings use Space Grotesk with tighter tracking; body text uses Instrument Sans with standard tracking. Arabic line-height remains 1.6-1.8x per Phase 1 D-08

### Component Shape Language
- **D-10:** Border radius: 8px base (--radius), with computed variants (md: 6px, sm: 4px, lg: 12px, xl: 16px). Modern tech aesthetic -- rounded but not pill-shaped. Replaces current 0.625rem (10px) base
- **D-11:** Shadow scale: 3 levels (sm/md/lg) plus an "inner" variant. Light mode: subtle gray shadows with slight teal tinting. Dark mode: shadows replaced by subtle border glow and surface elevation (lighter background steps). No harsh drop shadows
- **D-12:** Spacing rhythm: 4px base grid (4/8/12/16/20/24/32/40/48/64/80). Section padding uses larger steps (48-80px). Component internal padding uses 12-24px. Consistent vertical rhythm across all public sections
- **D-13:** Cards: subtle glass-morphism effect in dark mode (backdrop-blur + translucent background). Light mode: clean white with soft shadow elevation. Hover state: subtle lift (translateY -2px) + shadow increase. Border: 1px with low-opacity border color
- **D-14:** Buttons: solid primary (teal bg, white text), outline variant (teal border, transparent bg), ghost variant (no border, teal text on hover). All buttons use the new border-radius. Hover: slight brightness shift + subtle scale(1.02). Focus: visible ring using --ring token
- **D-15:** Inputs and form elements: consistent border-radius, focus ring matches primary color. Slightly rounded but not excessively. Placeholder text uses muted-foreground token

### Motion Design Language
- **D-16:** Extend the existing v1.0 animation system (animations.ts) rather than replacing it. Keep scroll reveals (fadeInUp, staggerContainer) and page crossfade transitions. Add new patterns for interaction and ambient motion
- **D-17:** Entrance animations: keep existing fadeInUp (20px, 0.3-0.5s) for scroll reveals. Add fadeInScale (scale 0.95 to 1.0) for modal/overlay entrances. Add slideInFromSide for drawer/panel animations
- **D-18:** Interaction animations: hover lift (translateY -2px, 0.2s ease), press scale (scale 0.98, 0.1s), focus ring expansion (ring grows from element center, 0.15s). All use spring-based easing for natural feel
- **D-19:** Ambient animations: subtle gradient shifts on hero/feature sections (slow oklch hue rotation, 10-15s cycle). Floating geometric accent elements with gentle oscillation (translateY +/-5px, 3-4s). These are decorative and disabled when prefers-reduced-motion is set
- **D-20:** Transition timing tokens: fast (0.15s), default (0.3s), slow (0.5s), ambient (3-10s). Easing: ease-out for reveals, spring for interactions, linear for ambient. All respect prefers-reduced-motion (Phase 1 D-06)

### Custom Service Icons
- **D-21:** Duotone style -- line icons with brand accent (teal) fills on key elements. Consistent 24px base size with 1.5px stroke width. Scalable to 48px and 64px for feature sections
- **D-22:** Four service icons: Software Development (code brackets with gear), Automation (robot arm or circuit loop), QA/Testing (checkmark shield with magnifier), Cybersecurity (lock with circuit pattern). Each icon uses the primary teal as accent fill
- **D-23:** Icons delivered as custom SVGs (not from Lucide or other generic libraries). Designed to match the brand aesthetic -- clean, geometric, modern. Committed to `resources/assets/icons/services/` or similar

### Asset Sourcing
- **D-24:** Fonts: Space Grotesk from Google Fonts, self-hosted as variable font files (WOFF2). Cairo already self-hosted from v1.0. Both committed to `resources/fonts/` and loaded via @font-face in app.css
- **D-25:** Service icons: custom SVGs designed to the duotone brand spec (D-21/D-22). Created during this phase and committed to repository
- **D-26:** Illustration textures: subtle noise/grain texture for dark mode surfaces (optional decorative layer). Geometric accent shapes as SVG for hero/feature backgrounds. Committed to `resources/assets/`
- **D-27:** All assets must be committed to the repository (BRAND-07). No external CDN dependencies for brand-critical assets. Font files, icon SVGs, and texture images all local

### Claude's Discretion
- Exact oklch values for all color tokens -- calibrate for visual harmony and accessibility contrast
- Space Grotesk weight selection for each heading level
- Shadow color values and blur/spread amounts per level
- Ambient animation specific easing curves and timing
- Service icon detailed geometry (exact visual design within the described style)
- Noise/grain texture intensity and application method
- Whether to add a font-display strategy beyond swap
- Geometric accent shape designs for backgrounds

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Brand Requirements
- `.planning/REQUIREMENTS.md` -- BRAND-01 through BRAND-07: Color palette, typography, component language, motion patterns, service icons, dark mode, asset sourcing

### Existing Design System (Replace/Evolve)
- `resources/css/app.css` -- Current oklch color tokens (`:root` and `.dark` blocks), font declarations, RTL rules, view transition styles. This file is the primary target for brand token updates
- `resources/js/lib/animations.ts` -- Current Framer Motion variants (fadeInUp, staggerContainer, heroEntrance, transitions). Extend with new patterns
- `resources/js/components/scroll-reveal.tsx` -- ScrollReveal component using motion/react. Reuse as-is, may need updated default variants
- `resources/js/components/ui/button.tsx` -- Button component with CVA variants. Update styling to match new brand
- `resources/js/components/ui/card.tsx` -- Card component. Update with glass-morphism dark mode and new shadow scale
- `resources/js/components/ui/input.tsx` -- Input component. Update border-radius and focus ring

### Phase 1 Design Decisions (Foundation)
- `.planning/phases/01-foundation-design-system/01-CONTEXT.md` -- Original brand colors (D-01/D-02), animation personality (D-04/D-05), typography (D-07/D-08), header/footer patterns (D-09/D-11)

### Project Context
- `.planning/PROJECT.md` -- v1.1 goal: transform template-looking site into unique premium brand. CSS changes scoped to public pages only
- `.planning/ROADMAP.md` -- Phase 5 success criteria and requirement mapping
- `.planning/STATE.md` -- Arabic font subsetting concern still relevant for new font additions

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `resources/css/app.css` -- Complete oklch token system with `:root` (light) and `.dark` blocks, font-family declarations for `--font-sans` and `--font-arabic`, RTL typography rules, view transition styles. All token names can be preserved while updating values
- `resources/js/lib/animations.ts` -- 9 Framer Motion variants + 3 transition presets. Structure supports adding new variants without breaking existing usage
- `resources/js/components/ui/` -- 30 Radix UI component wrappers (button, card, input, badge, etc.) using CVA for variant composition. All reference CSS token variables -- updating tokens updates all components
- `resources/js/hooks/use-appearance.tsx` -- Dark/light mode toggle with localStorage. No changes needed for brand update
- `resources/js/hooks/use-reduced-motion.tsx` -- Reduced motion detection hook. Ambient animations must check this
- `cn()` utility in `resources/js/lib/utils` -- Tailwind class merging. Unchanged

### Established Patterns
- CSS custom properties via oklch in `app.css` -- extend/replace for new brand tokens
- `.dark` class variant for dark mode -- established and working
- CVA (Class Variance Authority) for component variants -- update class strings for new brand
- Tailwind CSS theme extension via `@theme` block in `app.css` -- add new font and spacing tokens here
- `@custom-variant dark (&:is(.dark *))` -- Tailwind dark mode scoping pattern

### Integration Points
- `resources/css/app.css` -- Primary file: update oklch tokens, add Space Grotesk font-face, update radius/shadow values
- `resources/fonts/` -- Add Space Grotesk WOFF2 variable font file(s)
- `resources/assets/icons/services/` -- New directory for custom service icon SVGs
- `resources/assets/textures/` -- New directory for noise/grain textures and geometric accents
- `resources/js/lib/animations.ts` -- Add new motion variants (fadeInScale, slideInFromSide, interaction patterns)
- `resources/js/components/ui/*.tsx` -- Update component styles to reference new brand tokens (cards, buttons, inputs)
- Admin pages must NOT be affected -- brand changes scoped via CSS selectors or layout-specific token overrides

</code_context>

<specifics>
## Specific Ideas

- v1.1 design inspiration: Mailchimp (content-first, playful characters, simple CTA flow) -- per STATE.md decisions
- Space Grotesk adds geometric personality that distinguishes from generic sans-serif sites
- Dark mode should feel like a "designed experience" not a toggle -- surfaces, shadows, and accents all shift intentionally
- Duotone service icons with teal accent create brand-specific visual language that ties icons to the overall palette
- Glass-morphism on dark mode cards creates depth without heavy shadows -- aligns with premium aesthetic
- Ambient gradient motion on hero sections creates visual interest without being distracting
- CSS changes must be scoped to public pages -- admin panel continues using its own sidebar/card patterns untouched

</specifics>

<deferred>
## Deferred Ideas

- Robot mascot illustrations (2D/SVG) -- Phase 6 (LAND-04, LAND-07)
- 3D robot models and Earth textures -- Phase 9 (3DHR-06)
- Client logo assets -- Phase 8 (LEAD-03)
- Landing page section redesign applying new brand -- Phase 6
- Portfolio visual refresh with new brand -- Phase 7

None beyond roadmap-planned work -- discussion stayed within phase scope

</deferred>

---

*Phase: 05-brand-design-system*
*Context gathered: 2026-04-04*
