# Phase 5: Brand Design System - Research

**Researched:** 2026-04-04
**Domain:** CSS design tokens (OKLCH), typography (variable fonts), component styling (Tailwind CSS v4), motion design (motion/react), SVG icon creation
**Confidence:** HIGH

## Summary

Phase 5 transforms the existing v1.0 design tokens, typography, component styles, motion patterns, and service icons into a cohesive premium brand language. The codebase already has a fully functional OKLCH token system in `app.css` with `:root` and `.dark` blocks, Fontsource-based self-hosted variable fonts (Instrument Sans + Cairo), a Framer Motion animation system in `animations.ts`, and 31 Radix UI/shadcn components using CVA for variant composition. All CSS tokens flow through Tailwind CSS v4's `@theme` directive, meaning token updates automatically propagate to every utility class usage across the codebase.

The critical architectural concern is **admin isolation**: the current CSS tokens in `:root`/`.dark` are global and affect both public pages (PublicLayout) and admin pages (AppLayout). Since CONTEXT.md decision D-10 changes the border-radius from 10px to 8px and decisions D-01 through D-05 refine the color palette, these changes will also affect admin components unless scoping is applied. The sidebar tokens (`--sidebar-*`) are already separate, but card, button, input, and other shared component tokens are global. The safest approach is to update `:root`/`.dark` tokens globally (since both public and admin benefit from refined colors) and only apply new component styling (glass-morphism, shadow changes, new radius) to public-facing components via Tailwind class updates rather than token changes that would break admin.

**Primary recommendation:** Update global OKLCH color tokens in `app.css` (safe for both layouts), add Space Grotesk as a new `--font-display` via Fontsource, extend `animations.ts` with new motion variants, and update public-facing component classes in the specific UI components and page files. Do NOT change `--radius` globally -- instead use explicit Tailwind classes on public components.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Evolve the existing teal/emerald palette into a richer, more nuanced system -- keep teal as the primary brand color (established identity from v1.0) but expand with more semantic depth and intentional contrast ratios
- **D-02:** 8 semantic token groups in oklch: background, foreground, primary (teal), secondary, accent, muted, card, border -- each with light and dark mode variants. Total ~16-20 CSS custom properties (matching the existing `app.css` variable structure)
- **D-03:** Light mode: clean, warm whites with subtle teal tinting on surfaces. Not sterile/cold -- feels inviting and premium. Background should have slight warmth, cards slightly elevated
- **D-04:** Dark mode: intentionally designed with adjusted saturation and custom surface colors (BRAND-06). Deep navy/slate backgrounds (not pure black), teal accent glows with reduced chroma for eye comfort. Surfaces differentiated by lightness steps (3-4 elevation levels)
- **D-05:** All color tokens use oklch for perceptual uniformity. Chroma and lightness calibrated so that swapping between modes feels like a designed experience, not a CSS filter
- **D-06:** English display font: Space Grotesk -- geometric, modern, distinctive personality. Used for h1-h3 headings, hero text, section titles. Variable font for weight flexibility (300-700)
- **D-07:** English body font: keep Instrument Sans -- proven readability from v1.0, pairs well with Space Grotesk as display/body contrast. Used for paragraphs, UI text, navigation
- **D-08:** Arabic font: keep Cairo Variable -- established in v1.0 (Phase 1 D-07), distinctive character with good weight range (200-1000). Used for both display and body in Arabic
- **D-09:** Type scale: define 7 size steps (xs, sm, base, lg, xl, 2xl, 3xl) with corresponding line-heights. Display headings use Space Grotesk with tighter tracking; body text uses Instrument Sans with standard tracking. Arabic line-height remains 1.6-1.8x per Phase 1 D-08
- **D-10:** Border radius: 8px base (--radius), with computed variants (md: 6px, sm: 4px, lg: 12px, xl: 16px). Modern tech aesthetic -- rounded but not pill-shaped. Replaces current 0.625rem (10px) base
- **D-11:** Shadow scale: 3 levels (sm/md/lg) plus an "inner" variant. Light mode: subtle gray shadows with slight teal tinting. Dark mode: shadows replaced by subtle border glow and surface elevation
- **D-12:** Spacing rhythm: 4px base grid (4/8/12/16/20/24/32/40/48/64/80). Section padding uses larger steps (48-80px). Component internal padding uses 12-24px
- **D-13:** Cards: subtle glass-morphism effect in dark mode (backdrop-blur + translucent background). Light mode: clean white with soft shadow elevation. Hover state: subtle lift (translateY -2px) + shadow increase. Border: 1px with low-opacity border color
- **D-14:** Buttons: solid primary (teal bg, white text), outline variant (teal border, transparent bg), ghost variant (no border, teal text on hover). All buttons use the new border-radius. Hover: slight brightness shift + subtle scale(1.02). Focus: visible ring using --ring token
- **D-15:** Inputs and form elements: consistent border-radius, focus ring matches primary color. Slightly rounded but not excessively. Placeholder text uses muted-foreground token
- **D-16:** Extend the existing v1.0 animation system (animations.ts) rather than replacing it. Keep scroll reveals (fadeInUp, staggerContainer) and page crossfade transitions. Add new patterns for interaction and ambient motion
- **D-17:** Entrance animations: keep existing fadeInUp (20px, 0.3-0.5s) for scroll reveals. Add fadeInScale (scale 0.95 to 1.0) for modal/overlay entrances. Add slideInFromSide for drawer/panel animations
- **D-18:** Interaction animations: hover lift (translateY -2px, 0.2s ease), press scale (scale 0.98, 0.1s), focus ring expansion (ring grows from element center, 0.15s). All use spring-based easing for natural feel
- **D-19:** Ambient animations: subtle gradient shifts on hero/feature sections (slow oklch hue rotation, 10-15s cycle). Floating geometric accent elements with gentle oscillation (translateY +/-5px, 3-4s). These are decorative and disabled when prefers-reduced-motion is set
- **D-20:** Transition timing tokens: fast (0.15s), default (0.3s), slow (0.5s), ambient (3-10s). Easing: ease-out for reveals, spring for interactions, linear for ambient. All respect prefers-reduced-motion (Phase 1 D-06)
- **D-21:** Duotone style -- line icons with brand accent (teal) fills on key elements. Consistent 24px base size with 1.5px stroke width. Scalable to 48px and 64px for feature sections
- **D-22:** Four service icons: Software Development (code brackets with gear), Automation (robot arm or circuit loop), QA/Testing (checkmark shield with magnifier), Cybersecurity (lock with circuit pattern). Each icon uses the primary teal as accent fill
- **D-23:** Icons delivered as custom SVGs (not from Lucide or other generic libraries). Designed to match the brand aesthetic -- clean, geometric, modern. Committed to `resources/assets/icons/services/` or similar
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

### Deferred Ideas (OUT OF SCOPE)
- Robot mascot illustrations (2D/SVG) -- Phase 6 (LAND-04, LAND-07)
- 3D robot models and Earth textures -- Phase 9 (3DHR-06)
- Client logo assets -- Phase 8 (LEAD-03)
- Landing page section redesign applying new brand -- Phase 6
- Portfolio visual refresh with new brand -- Phase 7
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BRAND-01 | New color palette (6-8 semantic tokens) for light and dark modes using oklch | Existing `app.css` has 8 token groups in oklch already (background, foreground, primary, secondary, accent, muted, card, border + destructive, chart, sidebar). Update values in-place. Tailwind v4 `@theme` auto-propagates. |
| BRAND-02 | New typography pairing -- display font + body font with Arabic glyph support | Space Grotesk Variable via `@fontsource-variable/space-grotesk` (v5.2.10, weight 300-700). Add as `--font-display` in `@theme`. Instrument Sans + Cairo already installed. |
| BRAND-03 | Component design language -- new card styles, button designs, border radius, shadow scale, spacing rhythm | Update CVA class strings in `button.tsx`, `card.tsx`, `input.tsx`. Add shadow/radius CSS custom properties. Glass-morphism via `backdrop-blur` + translucent bg in dark mode. |
| BRAND-04 | Motion design language -- defined entrance, transition, interaction, and ambient animation patterns | Extend `animations.ts` with new Framer Motion variants. Add ambient gradient animation as CSS @keyframes. Motion v12 supports oklch color animation natively. |
| BRAND-05 | Custom service icons matching the brand aesthetic (dev, automation, QA, cybersecurity) | Create 4 custom SVG icons with duotone style. Currently using Lucide icons (Code2, Zap, ShieldCheck, Shield). Replace with custom SVGs in `resources/assets/icons/services/`. |
| BRAND-06 | Dark mode palette that feels designed (adjusted saturation, custom surfaces) not inverted | Existing `.dark` block uses navy/slate backgrounds with teal accents. Refine oklch lightness steps for 3-4 surface elevation levels. Add glass-morphism card treatment. |
| BRAND-07 | Source and download all brand assets -- fonts, icons, illustrations, textures | Fontsource handles font WOFF2 files automatically via npm. Custom SVGs created in-phase. Noise texture as base64-encoded SVG or committed PNG. All in repo, no CDN. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | 4.0.0 (installed) | Utility CSS + `@theme` token system | Already in stack; `@theme` directive is the canonical way to define design tokens in v4 |
| motion | 12.38.0 (installed) | React animation (Framer Motion) | Already in stack; v12 supports oklch color animation natively |
| class-variance-authority | 0.7.1 (installed) | Component variant composition | Already in stack; all UI components use CVA for variant management |
| @fontsource-variable/space-grotesk | 5.2.10 | Display font self-hosting | Matches existing Fontsource pattern (Instrument Sans + Cairo already use this approach) |
| @fontsource-variable/instrument-sans | 5.2.8 (installed) | Body font self-hosting | Already installed, no changes needed |
| @fontsource-variable/cairo | 5.2.7 (installed) | Arabic font self-hosting | Already installed, no changes needed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tailwind-merge | 3.0.1 (installed) | Smart class merging via `cn()` | When composing Tailwind classes in components |
| gsap | 3.14.2 (installed) | Complex timeline animations | Only for ambient animations if CSS @keyframes proves insufficient |
| tw-animate-css | 1.4.0 (installed) | Pre-built animation utilities | For simple entrance/exit animations |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Fontsource for Space Grotesk | Manual WOFF2 download + @font-face | Fontsource auto-handles subsetting, unicode ranges, font-display:swap. Manual approach requires managing files yourself. Fontsource is the established pattern in this project. |
| CSS @keyframes for ambient gradients | Framer Motion animate() | CSS @keyframes is more performant for continuous ambient animations (runs on compositor thread). Framer Motion better for JS-triggered transitions. Use CSS for ambient. |
| Updating `:root` tokens globally | Scoped tokens via layout class | Global tokens are simpler and both admin/public benefit from refined colors. Component-level styling differences handled via Tailwind classes, not token scoping. |

**Installation:**
```bash
npm install @fontsource-variable/space-grotesk@5.2.10
```

**Version verification:** Space Grotesk verified at 5.2.10 on npm registry (2026-04-04). Motion 12.38.0 verified. All other packages already installed at current versions.

## Architecture Patterns

### Recommended Project Structure
```
resources/
├── css/
│   └── app.css                          # OKLCH tokens (:root/.dark), @theme, @font-face, shadow/radius vars
├── fonts/                               # (empty -- Fontsource handles via node_modules)
├── assets/
│   ├── icons/
│   │   └── services/
│   │       ├── development.svg          # Custom duotone icon
│   │       ├── automation.svg           # Custom duotone icon
│   │       ├── qa.svg                   # Custom duotone icon
│   │       └── cybersecurity.svg        # Custom duotone icon
│   └── textures/
│       ├── noise.svg                    # Subtle grain texture for dark mode
│       └── geometric-accent.svg         # Decorative background shape
├── js/
│   ├── app.tsx                          # Add: import '@fontsource-variable/space-grotesk'
│   ├── lib/
│   │   └── animations.ts               # Extended with new motion variants
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx              # Updated CVA classes for brand
│   │   │   ├── card.tsx                # Updated with glass-morphism dark mode
│   │   │   └── input.tsx               # Updated border-radius and focus ring
│   │   └── service-icon.tsx            # New: renders custom SVG service icons
│   └── hooks/
│       └── use-reduced-motion.tsx       # Existing, unchanged
```

### Pattern 1: OKLCH Token Architecture in app.css
**What:** All design tokens defined as CSS custom properties using oklch() in `:root` (light) and `.dark` (dark) blocks, referenced via Tailwind's `@theme` directive.
**When to use:** For any color, radius, or shadow value that should be consistent across the entire public site.
**Example:**
```css
/* resources/css/app.css */
:root {
    /* Light mode: warm whites with teal tinting */
    --background: oklch(0.985 0.005 180);    /* Warm white with hint of teal */
    --foreground: oklch(0.145 0.014 186);    /* Near-black with teal undertone */
    --primary: oklch(0.704 0.14 182.503);    /* Teal -- kept from v1.0 */
    --card: oklch(0.975 0.006 180);          /* Slightly elevated surface */
    /* ... etc */
}

.dark {
    /* Dark mode: deep navy with teal accents, 3-4 elevation levels */
    --background: oklch(0.13 0.012 245);     /* Deep navy-slate */
    --card: oklch(0.17 0.015 240);           /* Surface level 1 */
    --secondary: oklch(0.21 0.015 240);      /* Surface level 2 */
    --muted: oklch(0.25 0.012 240);          /* Surface level 3 */
    --primary: oklch(0.75 0.13 182);         /* Teal, reduced chroma for comfort */
    /* ... etc */
}
```

### Pattern 2: Display Font Registration via @theme
**What:** Add `--font-display` to Tailwind's `@theme` block for Space Grotesk, creating a `font-display` utility class.
**When to use:** For all display headings (h1-h3, hero text, section titles) on public pages.
**Example:**
```css
@theme {
    --font-sans: 'Instrument Sans Variable', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
    --font-display: 'Space Grotesk Variable', 'Instrument Sans Variable', ui-sans-serif, system-ui, sans-serif;
    --font-arabic: 'Cairo Variable', 'Instrument Sans Variable', ui-sans-serif, system-ui, sans-serif;
    /* ... */
}
```
Usage in JSX: `<h1 className="font-display text-3xl font-bold tracking-tight">`

### Pattern 3: Glass-Morphism Card in Dark Mode
**What:** Cards use `backdrop-blur` + translucent background in dark mode, clean white + shadow in light mode.
**When to use:** For all public-facing card components.
**Example:**
```tsx
// card.tsx updated CVA or className
className={cn(
    "bg-card text-card-foreground flex flex-col gap-6 rounded-lg border border-border/50 py-6",
    "shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
    "dark:bg-card/80 dark:backdrop-blur-xl dark:border-border/30 dark:hover:border-primary/20",
    className
)}
```

### Pattern 4: Extended Animation Variants
**What:** New Framer Motion variants added to `animations.ts` alongside existing ones.
**When to use:** For modal entrances, side panel slides, and interaction feedback.
**Example:**
```typescript
// New variants added to animations.ts
export const fadeInScale: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
};

export const slideInFromLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
};

export const slideInFromRight: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
};

// Spring-based interaction transition
export const springTransition = {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
};
```

### Pattern 5: Ambient CSS Animation (Not Framer Motion)
**What:** Slow hue-shifting gradient as CSS @keyframes, disabled for reduced motion.
**When to use:** On hero and feature section backgrounds for visual interest.
**Example:**
```css
@keyframes ambient-gradient {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

.ambient-gradient {
    background: linear-gradient(135deg,
        oklch(0.704 0.14 175) 0%,
        oklch(0.704 0.14 185) 50%,
        oklch(0.704 0.14 195) 100%
    );
    background-size: 200% 200%;
    animation: ambient-gradient 12s ease infinite;
}

@media (prefers-reduced-motion: reduce) {
    .ambient-gradient {
        animation: none;
        background-position: 0% 50%;
    }
}
```

### Pattern 6: Custom Service Icon Component
**What:** A React component that renders inline SVGs from imported files.
**When to use:** For service icons across service pages, cards, and feature sections.
**Example:**
```tsx
// resources/js/components/service-icon.tsx
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

type ServiceType = 'development' | 'automation' | 'qa' | 'cybersecurity';

type Props = {
    service: ServiceType;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
};

const SIZE_MAP = { sm: 'size-6', md: 'size-12', lg: 'size-16' };

export default function ServiceIcon({ service, size = 'md', className }: Props) {
    return (
        <img
            src={`/assets/icons/services/${service}.svg`}
            alt=""
            className={cn(SIZE_MAP[size], className)}
            aria-hidden="true"
        />
    );
}
```

### Anti-Patterns to Avoid
- **Changing `--radius` globally in `:root`:** This would affect admin panel components (sidebar, settings). Instead, update the `--radius` value but verify admin components still look acceptable, or apply explicit radius classes on public components.
- **Using CSS `hue-rotate()` filter for dark mode:** Produces washed-out, unnatural colors. Use intentionally designed oklch values per token instead (D-05).
- **Stacking multiple `backdrop-blur` layers:** Causes severe GPU performance issues on mobile. Limit glass-morphism to 1 layer per viewport (cards OR header, not nested).
- **Loading Space Grotesk from Google Fonts CDN:** Violates D-27 (all assets committed, no external CDN). Use Fontsource npm package.
- **Replacing existing animation variants:** D-16 explicitly says extend, not replace. Keep all existing `fadeInUp`, `staggerContainer`, etc.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font self-hosting with subsetting | Manual @font-face with WOFF2 files | `@fontsource-variable/space-grotesk` npm package | Fontsource auto-generates unicode-range subsets, handles font-display:swap, matches existing project pattern |
| OKLCH color scale generation | Manual lightness/chroma calculations | [OKLCH Color Picker](https://oklch.com) or [Huetone](https://huetone.ardov.me) for initial values | OKLCH perceptual uniformity means equal L steps look equal, but getting initial values right requires a visual tool |
| Spring physics for animations | Custom spring math | `motion/react` spring transition type | Motion's spring implementation handles mass/stiffness/damping correctly with velocity inheritance |
| SVG icon optimization | Manual SVG cleanup | SVGO (if needed for optimization) | SVG hand-written for this phase; SVGO can strip unnecessary attributes if file size is a concern |
| Component variant composition | Manual className conditionals | CVA (class-variance-authority) | Already established pattern; all UI components use it |

**Key insight:** This phase is primarily about updating CSS token values and component class strings. The infrastructure (Tailwind @theme, CVA variants, Framer Motion, Fontsource) is already in place from v1.0. The work is calibration and refinement, not new architecture.

## Common Pitfalls

### Pitfall 1: Admin Panel Visual Regression
**What goes wrong:** Updating `:root`/`.dark` CSS tokens changes colors in the admin panel too, creating an inconsistent or broken admin experience.
**Why it happens:** Both PublicLayout and AppLayout inherit from the same `:root` CSS tokens. There is no layout-level CSS scope.
**How to avoid:** The color token updates (D-01 through D-05) are improvements that should look fine in admin too (same teal, refined surfaces). For component-specific changes (glass-morphism cards, new radius, shadows), update the component Tailwind classes directly rather than changing global tokens. Test admin pages after each token change.
**Warning signs:** Sidebar items look wrong, settings page cards have unexpected glass-morphism, admin buttons have wrong radius.

### Pitfall 2: Arabic Text with Space Grotesk
**What goes wrong:** Space Grotesk has no Arabic glyphs. If accidentally applied to Arabic text, characters fall back to system fonts creating a jarring mismatch.
**Why it happens:** Adding Space Grotesk as `--font-sans` instead of a separate `--font-display` would override Arabic body text.
**How to avoid:** Register Space Grotesk as `--font-display` (a new, separate token), not replacing `--font-sans`. Arabic layout (`[dir="rtl"]`) continues using `--font-arabic` (Cairo). Display headings in Arabic use Cairo since D-08 says no separate Arabic display font needed.
**Warning signs:** Broken Arabic characters, tofu boxes, inconsistent heading styles between languages.

### Pitfall 3: Glass-Morphism Performance on Mobile
**What goes wrong:** `backdrop-blur` is GPU-intensive. Multiple blurred elements or deeply nested blur layers cause frame drops, especially on mid-range Android devices.
**Why it happens:** Each `backdrop-filter: blur()` creates a new compositing layer and requires re-rendering the underlying content on every frame.
**How to avoid:** Apply glass-morphism to cards only in dark mode (D-13 specifies this). Limit to 1 blur level in the viewport at a time. Use `will-change: backdrop-filter` sparingly. Test on real mobile hardware. Consider reducing blur from `xl` (24px) to `lg` (12px) on mobile via responsive class.
**Warning signs:** Scrolling jank on service pages, FPS drops below 30 on mobile, battery drain complaints.

### Pitfall 4: OKLCH Browser Fallback
**What goes wrong:** Very old browsers (pre-2022) don't support oklch().
**Why it happens:** oklch() support shipped in Chrome 111+ (Mar 2023), Firefox 113+ (May 2023), Safari 15.4+ (Mar 2022).
**How to avoid:** Tailwind CSS v4 targets these browser versions as baseline. The project already uses oklch in v1.0 without fallbacks, confirming browser support is acceptable for the target audience. No fallback needed.
**Warning signs:** None expected -- this is already validated by v1.0 deployment.

### Pitfall 5: Ambient Animation Battery/CPU Drain
**What goes wrong:** Continuous CSS animations (gradient shifts, floating elements) consume CPU/GPU even when not visible, draining battery on mobile.
**Why it happens:** CSS animations run regardless of viewport visibility unless explicitly paused.
**How to avoid:** Use `animation-play-state: paused` when elements are outside the viewport (IntersectionObserver). Always disable via `prefers-reduced-motion: reduce` (D-20). Keep ambient cycles long (10-15s) to minimize repaints. Prefer `background-position` animation over `filter` animation.
**Warning signs:** High CPU usage on idle pages, fan noise on laptops, mobile battery complaints.

### Pitfall 6: Font Loading Flash (FOUT/FOIT)
**What goes wrong:** Space Grotesk loads after page paint, causing a visible flash where headings briefly render in the fallback font then jump to Space Grotesk.
**Why it happens:** Variable font files are 20-100KB. Even with local hosting, there's a loading delay on first visit.
**How to avoid:** Fontsource uses `font-display: swap` by default, which is the correct strategy (show text immediately in fallback, swap when loaded). The Fontsource WOFF2 files are small enough that this flash is minimal. For extra polish, add a `<link rel="preload">` for the Space Grotesk WOFF2 file in `app.blade.php`.
**Warning signs:** Visible layout shift on first page load, CLS score increase in Lighthouse.

## Code Examples

Verified patterns from the existing codebase and official sources:

### Updating OKLCH Tokens in app.css (Existing Pattern)
```css
/* Source: resources/css/app.css (current structure -- values to be updated) */
:root {
    --background: oklch(0.985 0.005 180);
    --foreground: oklch(0.145 0.014 186);
    --card: oklch(0.975 0.006 180);
    --card-foreground: oklch(0.145 0.014 186);
    --primary: oklch(0.704 0.14 182.503);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.95 0.01 180);
    --secondary-foreground: oklch(0.205 0.015 186);
    --muted: oklch(0.95 0.01 180);
    --muted-foreground: oklch(0.49 0.014 186);
    --accent: oklch(0.777 0.152 181.912);
    --accent-foreground: oklch(0.145 0.014 186);
    --border: oklch(0.902 0.01 180);
    --input: oklch(0.902 0.01 180);
    --ring: oklch(0.704 0.14 182.503);
    --radius: 0.5rem; /* 8px per D-10 */
}
```

### Adding Space Grotesk via Fontsource (New)
```typescript
// resources/js/app.tsx -- add import at top alongside existing fonts
import '@fontsource-variable/instrument-sans';
import '@fontsource-variable/cairo';
import '@fontsource-variable/space-grotesk'; // NEW
```

### Registering Display Font in @theme (New)
```css
/* resources/css/app.css -- @theme block update */
@theme {
    --font-sans: 'Instrument Sans Variable', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    --font-display: 'Space Grotesk Variable', 'Instrument Sans Variable', ui-sans-serif, system-ui, sans-serif;
    --font-arabic: 'Cairo Variable', 'Instrument Sans Variable', ui-sans-serif, system-ui, sans-serif;
    /* ... rest of @theme */
}
```

### Updated Card Component with Glass-Morphism (D-13)
```tsx
// Source: resources/js/components/ui/card.tsx (to be updated)
function Card({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card"
            className={cn(
                "bg-card text-card-foreground flex flex-col gap-6 rounded-lg border border-border/50 py-6",
                "shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
                "dark:bg-card/80 dark:backdrop-blur-xl dark:border-border/30",
                "dark:hover:border-primary/20 dark:hover:shadow-primary/5",
                className
            )}
            {...props}
        />
    );
}
```

### Updated Button with Brand Styling (D-14)
```tsx
// Source: resources/js/components/ui/button.tsx -- default variant update
variant: {
    default:
        "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
    outline:
        "border border-primary/50 bg-transparent text-primary shadow-xs hover:bg-primary/5 hover:border-primary transition-all duration-200",
    ghost:
        "hover:bg-primary/5 hover:text-primary transition-all duration-200",
    // ... other variants unchanged
}
```

### New Animation Variants (D-16, D-17, D-18)
```typescript
// Source: resources/js/lib/animations.ts (additions)
import type { Variants, Transition } from 'motion/react';

// D-17: Modal/overlay entrance
export const fadeInScale: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
};

// D-17: Drawer/panel slide-in (LTR)
export const slideInFromLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
};

export const slideInFromRight: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
};

// D-20: Transition timing tokens
export const transitionFast: Transition = { duration: 0.15, ease: 'easeOut' };
export const transitionDefault: Transition = { duration: 0.3, ease: 'easeOut' };
export const transitionSlow: Transition = { duration: 0.5, ease: 'easeOut' };

// D-18: Spring-based interaction transition
export const interactionSpring: Transition = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
};
```

### Custom Service Icon SVG Example (D-21, D-22)
```svg
<!-- resources/assets/icons/services/development.svg -->
<!-- Duotone: 1.5px stroke, teal accent fill on key elements -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Code brackets (line) -->
    <path d="M8 7L3 12L8 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 7L21 12L16 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Gear accent (teal fill) -->
    <circle cx="12" cy="12" r="3" fill="var(--primary, oklch(0.704 0.14 182.503))" opacity="0.3"/>
    <path d="M12 9V15M9 12H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>
```

### Noise Texture for Dark Mode (D-26)
```css
/* Inline SVG noise texture -- no external file needed */
.dark .noise-overlay::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.03;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| HSL color tokens | OKLCH color tokens | Tailwind v4 (Jan 2025) | Perceptually uniform -- equal L steps look equal. Already adopted in v1.0. |
| `framer-motion` package | `motion` package (motion/react) | Motion v11 (mid-2024) | Renamed and independent from Framer. Already using `motion/react` in v1.0. |
| Static font weights (400, 600, 700) | Variable fonts (weight axis 300-700) | Widespread 2023+ | Single font file, any weight. Already using for Instrument Sans and Cairo. |
| Google Fonts CDN | Fontsource self-hosting via npm | Fontsource v5 (2023+) | No external CDN dependency, better performance, already established pattern. |
| Separate light/dark stylesheets | CSS custom properties + `.dark` class | Standard since 2022 | Already in v1.0. Single stylesheet, instant theme switching. |

**Deprecated/outdated:**
- `framer-motion` import path: Use `motion/react` instead (already done in v1.0)
- `tailwind.config.js`: Replaced by `@theme` in CSS for Tailwind v4 (already done in v1.0)
- RGB/HSL tokens: oklch is the standard in Tailwind v4 (already done in v1.0)

## Open Questions

1. **Shadow scale exact values for teal-tinted shadows**
   - What we know: D-11 specifies 3 levels + inner variant, teal-tinted in light mode, border-glow in dark mode.
   - What's unclear: Exact blur/spread/color values for each level need visual calibration.
   - Recommendation: Define as CSS custom properties (`--shadow-sm`, `--shadow-md`, `--shadow-lg`) and calibrate visually during implementation. Start with Tailwind defaults and add teal tinting.

2. **Admin panel radius change impact**
   - What we know: D-10 changes `--radius` from 0.625rem (10px) to 0.5rem (8px). This is a global token.
   - What's unclear: Whether admin components (sidebar items, settings cards, form inputs) will look acceptable at 8px vs 10px.
   - Recommendation: The difference is 2px -- likely acceptable. Change globally, visual-check admin. If problematic, override `--radius` on admin layout wrapper.

3. **`app.blade.php` font preload**
   - What we know: Fontsource handles font loading, but first-visit FOUT is possible.
   - What's unclear: Whether to add `<link rel="preload">` for Space Grotesk WOFF2.
   - Recommendation: Add preload for the latin subset WOFF2 file. The exact path comes from node_modules after installing the package.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | npm install, Vite build | Verified via existing project | LTS | -- |
| npm | Package installation | Verified via existing project | 8+ | -- |
| @fontsource-variable/space-grotesk | BRAND-02 font | Not yet installed | 5.2.10 | npm install during phase |
| Vite | Asset compilation | Verified | 8.0.0 | -- |
| motion/react | Animation variants | Verified | 12.38.0 | -- |

**Missing dependencies with no fallback:**
- None -- all infrastructure exists.

**Missing dependencies with fallback:**
- `@fontsource-variable/space-grotesk` -- not installed yet, install step required (trivial: `npm install`).

## Sources

### Primary (HIGH confidence)
- `resources/css/app.css` -- Current token structure, `:root`/`.dark` blocks, `@theme` directive, font declarations
- `resources/js/lib/animations.ts` -- Current Framer Motion variants and transition presets
- `resources/js/app.tsx` -- Fontsource import pattern, layout routing logic
- `resources/js/components/ui/button.tsx`, `card.tsx`, `input.tsx` -- Current CVA component styles
- `package.json` -- Installed dependencies and versions
- `.planning/phases/05-brand-design-system/05-CONTEXT.md` -- All 27 locked decisions
- [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme) -- `@theme` directive documentation
- [Tailwind CSS v4 Colors](https://tailwindcss.com/docs/customizing-colors) -- OKLCH token approach
- [Fontsource Space Grotesk Install](https://fontsource.org/fonts/space-grotesk/install) -- Package installation and import
- [Space Grotesk - Google Fonts](https://fonts.google.com/specimen/Space+Grotesk) -- Font weight range 300-700, OpenType features

### Secondary (MEDIUM confidence)
- [Motion Transition docs](https://www.framer.com/motion/transition/) -- Spring animation configuration
- [Evil Martians OKLCH + Tailwind](https://evilmartians.com/chronicles/better-dynamic-themes-in-tailwind-with-oklch-color-magic) -- OKLCH palette design patterns
- [OKLCH explained for designers](https://uxdesign.cc/oklch-explained-for-designers-dc6af4433611) -- Luminance-first token design
- [Epic Web Glassmorphism with Tailwind](https://www.epicweb.dev/tips/creating-glassmorphism-effects-with-tailwind-css) -- backdrop-blur patterns

### Tertiary (LOW confidence)
- [Medium: Dark Glassmorphism 2026](https://medium.com/@developer_89726/dark-glassmorphism-the-aesthetic-that-will-define-ui-in-2026-93aa4153088f) -- General glassmorphism patterns, used for approach validation only

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- All packages verified in npm registry, existing patterns confirmed in codebase
- Architecture: HIGH -- Token system, component patterns, and animation infrastructure all exist from v1.0. This phase extends, not builds
- Pitfalls: HIGH -- Admin isolation concern verified by inspecting CSS scope. Font/performance concerns well-documented
- Color tokens: MEDIUM -- Exact oklch values need visual calibration; approach is well-understood
- Service icons: MEDIUM -- SVG creation is design work; the component pattern and file structure are straightforward

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (stable -- CSS/font/animation technologies are mature)
