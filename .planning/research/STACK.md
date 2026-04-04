# Stack Research: 3D Interactive Hero & Brand Redesign

**Domain:** 3D WebGL interactive experience + brand design system for existing Laravel/Inertia/React site
**Researched:** 2026-04-04
**Confidence:** HIGH

> This document covers ONLY new stack additions for the v1.1 milestone. The existing stack (Laravel 12, Inertia.js 3, React 19.2, Tailwind CSS 4, GSAP 3.14, Motion 12, Radix UI, Tiptap 3, react-i18next, bilingual EN/AR, dark/light mode, admin panel, blog, portfolio, SEO) is validated and not re-researched.

## Recommended Stack

### Core Technologies (3D Rendering)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| three | ^0.183.0 (r171+) | 3D rendering engine | The standard WebGL/WebGPU library. R3F and all helpers depend on it. Version 0.183+ includes WebGPU support with automatic WebGL 2 fallback, and global code-split entrypoints. No alternative has comparable ecosystem, documentation, or tooling. |
| @react-three/fiber | ^9.5.0 | React renderer for Three.js | The only production-grade way to write Three.js scenes declaratively in React. v9 is specifically built for React 19 compatibility (supports 19.0 through 19.2, including the Activity feature). Integrates with React Suspense, concurrent features, and the component lifecycle the codebase already uses. |
| @react-three/drei | ^10.7.0 | Pre-built R3F helpers | Provides `useGLTF` (model loading with automatic Draco CDN), `OrbitControls` (camera interaction), `Float` (idle animation), `Detailed` (LOD), `PerformanceMonitor` (adaptive quality), `Environment` (lighting presets), `Html` (DOM overlay in 3D), `useTexture`, and `Preload`. Saves weeks of boilerplate. |

### Supporting Libraries (3D Pipeline)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @react-three/postprocessing | ^3.0.0 | Post-processing effects | Apply bloom glow to the globe atmosphere, selective bloom on robot character highlights, and vignette for cinematic framing. Wraps the `postprocessing` library for R3F integration. Add only when visual effects beyond basic lighting are needed -- the globe atmosphere glow will almost certainly require it. |
| postprocessing | ^6.36.0 | Underlying post-processing engine | Peer dependency of @react-three/postprocessing. Installed automatically. Listed for awareness. |

### Development Tools (3D Pipeline)

| Tool | Purpose | Notes |
|------|---------|-------|
| gltfjsx (npx) | Convert GLTF/GLB models to typed React components | Run `npx gltfjsx Model.glb --types --transform` to generate TypeScript JSX components with 70-90% size reduction via Draco compression. Use the `--transform` flag to create optimized binary GLB files. No install needed -- use via npx. v6.5.3 latest. |
| Online: gltf.pmnd.rs | Browser-based GLTF to R3F converter | Drag-and-drop alternative to CLI gltfjsx. Useful for quick prototyping before committing to the CLI workflow. |
| Blender 4.x | 3D model creation and export | For creating/editing the Roblox-style robot characters and the Earth globe model. Export as GLB (binary GLTF) with Draco compression enabled. Not an npm dependency -- external tool. |

### Brand Design System (No New Dependencies)

The brand redesign requires **zero new npm packages**. The existing stack already provides everything needed:

| Existing Technology | How It Serves the Brand Redesign |
|---------------------|----------------------------------|
| Tailwind CSS 4 `@theme` directive | Already in `app.css`. Extend with new brand color tokens, typography scale tokens, spacing tokens. All design tokens become CSS custom properties automatically -- inspectable in DevTools and overridable at runtime. |
| OKLCH color space | Already used in `:root` and `.dark` blocks. OKLCH provides perceptually uniform color steps -- ideal for generating consistent brand palettes across light/dark modes. |
| CSS custom properties | Already wired through `var(--primary)`, `var(--accent)`, etc. Brand redesign swaps values, not architecture. |
| `@fontsource-variable/*` | Already installed for Cairo and Instrument Sans. Add new brand fonts through the same `@fontsource-variable` pattern if the rebrand changes typefaces. |
| class-variance-authority | Already installed (0.7.1). Use for component variant definitions in the new brand component library. |
| tailwind-merge | Already installed (3.0.1). Continue using for safe class merging in redesigned components. |
| Admin theme customization | Already has the CSS variable architecture. Store brand tokens in DB, pass as Inertia shared props, inject as inline `style` on `<html>`. The existing `--color-*: var(--*)` chain picks them up with zero refactoring. |

## Installation

```bash
# 3D Core -- these are the only REQUIRED new packages
npm install three @react-three/fiber @react-three/drei

# 3D Post-processing -- add when bloom/glow effects are needed for globe atmosphere
npm install @react-three/postprocessing

# Type definitions for Three.js
npm install -D @types/three
```

**Total new dependencies: 3 required + 1 optional + 1 dev.**

No new packages needed for brand redesign, design tokens, or theming.

## Vite Build Configuration

The existing `vite.config.ts` manual chunk strategy must be extended to isolate the Three.js bundle. Add this block to the existing `manualChunks` function:

```typescript
// Add to existing manualChunks in vite.config.ts
if (id.includes('three') || id.includes('@react-three') || id.includes('postprocessing')) {
    return 'vendor-three';
}
```

This keeps the ~600KB Three.js bundle (gzipped ~150KB) in a separate chunk. Pages that do not render the 3D hero (every page except the landing page) never download it. The existing chunks for react, ui, inertia, motion, and fonts remain unchanged.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| @react-three/fiber (R3F) | Raw Three.js (no React wrapper) | Never for this project. The codebase is 100% React components with hooks, Suspense, and lifecycle. Raw Three.js would mean imperative DOM manipulation alongside declarative React -- a maintenance nightmare and architectural inconsistency. R3F gives you the full React paradigm for free. |
| @react-three/fiber v9 (stable) | @react-three/fiber v10 (alpha) | Not yet. v10 adds WebGPU-first rendering and a new scheduler, but it is alpha with Drei v11 also in alpha. Mixing alpha 3D libraries with a production site is reckless. v9 is production-grade with React 19 support. Revisit when v10 reaches RC. |
| @react-three/drei | Building helpers from scratch | Never. Drei provides battle-tested `useGLTF`, `OrbitControls`, `PerformanceMonitor`, `Float`, `Detailed` (LOD) and 100+ other helpers. Reimplementing any of these is wasted effort with zero upside. |
| @react-three/postprocessing | Three.js EffectComposer directly | Only if you need a single trivial effect. The `postprocessing` library merges multiple effects into a single shader pass for better GPU performance. For bloom + vignette + tone mapping, the merged-pass approach is measurably faster than chained composers. |
| GLB (binary GLTF) format | FBX, OBJ, or Blender native | Never for web delivery. GLB is the standard web 3D format: single binary file, Draco compressible, natively supported by Three.js/R3F with zero config. FBX and OBJ require additional loaders and produce larger payloads. |
| Draco compression (CDN) | Self-hosted Draco WASM | Only if offline/airgapped deployment is required. The default CDN (`gstatic.com/draco/versioned/decoders/`) is Google-hosted, globally cached, and requires zero configuration with `useGLTF`. |
| Custom R3F globe scene | react-globe.gl / globe.gl | react-globe.gl is a data-visualization wrapper (pins, arcs, hex layers). The Quartz hero needs custom robot characters placed on the globe surface with hover interaction, custom materials, and atmospheric glow. This requires full R3F scene control, not a data-viz abstraction. |
| Tailwind CSS 4 @theme tokens | Style Dictionary / Figma Tokens pipeline | Overkill. The project already uses `@theme` with CSS custom properties flowing through to Tailwind utilities. Adding a separate token build pipeline for a single site creates unnecessary tooling complexity with no incremental benefit. |
| Extend existing OKLCH palette | Completely new color system | The existing OKLCH variable architecture is sound. The brand redesign changes the _values_ (hue, chroma, lightness) not the _architecture_. Ripping out the token system to replace it with something else would be destructive churn. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `react-globe.gl` / `globe.gl` / `three-globe` | Opinionated data-visualization wrappers. Cannot place custom 3D models (robot characters) on the globe surface. Limited control over materials, lighting, and per-object interaction. | Build the globe with a `SphereGeometry` + Earth texture in R3F. Full control over placing robot models at lat/long positions using spherical coordinate math. |
| `@react-three/xr` | XR/VR/AR extensions. Not needed for a website hero section. Adds significant bundle weight for completely unused features. | Skip entirely. |
| `@react-three/cannon` or `@react-three/rapier` | Physics engines. The globe interaction is camera rotation and hover highlights, not physics simulation. Adding a physics engine for a hero section is massive overhead for zero user-facing benefit. | Use GSAP or R3F `useFrame` for smooth camera/object animation. |
| `leva` | Debug panel for R3F. Excellent for development but must not ship to production. | Use only in dev behind a dynamic import and environment check. Strip from production build entirely. |
| `@theatre/core` | Cinematic animation timeline tool. Massive bundle (~200KB gzipped). Overkill for a hero section with a handful of animated elements. | Use existing GSAP (`gsap` ^3.14.2 already installed) for timeline-based 3D animation coordination with `useFrame`. GSAP timelines can do everything Theatre does for this scale of animation. |
| WebGPU renderer (`three/webgpu`) | Not universally supported on older mobile browsers. The hero must work on all devices visitors might use -- including 2-3 year old phones. WebGL has 98%+ coverage. | Stick with WebGL renderer (default in R3F v9). Revisit WebGPU when R3F v10 stabilizes and browser coverage exceeds 98%. |
| Separate design token tools (Style Dictionary, Figma Tokens, Cobalt) | Unnecessary build step. Tailwind CSS 4 natively produces CSS custom properties from `@theme`. The site already uses this architecture. Adding a token pipeline creates tool sprawl for one website. | Use `@theme` directive in `app.css` directly. Extend the existing token structure with new brand values. |
| New animation libraries for the redesign | The project already has Motion 12 (page/component animations), GSAP (scroll/timeline animations), and tw-animate-css (CSS micro-interactions). Adding anime.js, react-spring, or auto-animate would create animation system fragmentation. | Use Motion for component enter/exit/hover/scroll-reveal. Use GSAP for pinned scroll sequences and 3D timeline coordination. These two cover every animation need. |

## Stack Patterns by Variant

**If the 3D hero is a simple rotating globe without robot characters:**
- Skip `@react-three/postprocessing`
- Use `useTexture` from drei for Earth texture + a `SphereGeometry`
- Total new packages: 3 (three, fiber, drei)
- Estimated 3D bundle: ~160KB gzipped

**If the 3D hero includes robot characters with glow/atmosphere effects (the plan):**
- Add `@react-three/postprocessing` for selective bloom on atmosphere and character highlights
- Use `gltfjsx --types --transform` to convert each robot GLB model to a typed React component
- Total new packages: 4 (three, fiber, drei, postprocessing)
- Estimated 3D bundle: ~190KB gzipped + model assets

**If mobile performance is critical (it is -- SE Asia and MENA are mobile-first markets):**
- Use `PerformanceMonitor` from drei to detect low-FPS devices
- Implement graceful fallback: static image or CSS-animated illustration for devices below 24 FPS for 3+ seconds
- Set `dpr={[1, 1.5]}` on Canvas to cap pixel ratio (prevents massive GPU fill on high-DPI mobile screens)
- Use `frameloop="demand"` for on-demand rendering when the globe is idle (not being interacted with)
- Lazy-load the entire 3D scene with `React.lazy()` + `Suspense` so it never blocks initial page paint
- Use LOD via `<Detailed>` component: low-poly globe on mobile, detailed globe on desktop

**If Inertia SSR is enabled (it should be for SEO):**
- The R3F `<Canvas>` uses WebGL which cannot render server-side
- Wrap the 3D hero component in a client-only guard: check `typeof window !== 'undefined'` or use a `ClientOnly` wrapper component
- SSR will render the fallback/placeholder (static image or skeleton), then hydrate the 3D scene client-side
- This is the standard pattern for any canvas-based content with SSR -- not a blocker, just a known integration point

## Performance Budget

| Metric | Target | How |
|--------|--------|-----|
| Three.js chunk (gzipped) | < 160KB | Separate vendor chunk via manualChunks, tree-shaking via ES module imports |
| GLB models total | < 2MB | Draco compression via gltfjsx --transform (70-90% reduction), LOD variants for mobile |
| Each robot model | < 300KB | Low-poly Roblox style is inherently lightweight. Draco compression + texture atlasing. |
| Earth globe (texture + mesh) | < 500KB | Use 2K texture for desktop, 1K for mobile. Sphere geometry is procedural (zero mesh cost). |
| Initial page paint | Not blocked by 3D | Lazy-load Canvas via React.lazy + Suspense, show placeholder/skeleton first |
| Mobile FPS | > 30 FPS | PerformanceMonitor + DPR scaling at [1, 1.5] + on-demand rendering |
| Desktop FPS | > 55 FPS | Full quality rendering at device DPR (capped at 2) |
| Fallback trigger | < 24 FPS for 3 sec | Switch to static image hero on incapable devices via PerformanceMonitor onDecline |
| Time to interactive (3D) | < 3s on 4G | Progressive loading: placeholder -> low-res -> full-res |

## 3D Asset Pipeline

```
Blender (.blend)
    |
    v  Export as GLB with Draco compression
Model.glb (raw export)
    |
    v  npx gltfjsx Model.glb --types --transform
Model.tsx (typed React component) + model-transformed.glb (optimized, 70-90% smaller)
    |
    v  Place optimized GLB in public/models/
useGLTF('/models/model-transformed.glb')  <-- auto Draco CDN decode, cached
```

Key decisions in the pipeline:
- **GLB over GLTF**: Single binary file, no external texture references to manage
- **Draco compression on**: Both at Blender export and via gltfjsx `--transform` for maximum reduction
- **Textures baked into GLB**: Avoids separate texture file management and CORS issues
- **Robot models**: 4-6 robot characters (one per service), each targeting < 300KB compressed
- **Globe model**: Earth sphere is procedural (`SphereGeometry`), only the texture is an asset. Use a 2048x1024 Earth texture for desktop, 1024x512 for mobile.
- **Preloading**: Call `useGLTF.preload('/models/robot-dev.glb')` etc. at module level so loading starts before the component mounts

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| @react-three/fiber@^9.5.0 | react@^19.0.0, three@>=0.170.0 | v9 specifically targets React 19. Do not use with React 18. The project uses React 19.2 -- fully compatible. |
| @react-three/drei@^10.7.0 | @react-three/fiber@^9.0.0, three@>=0.170.0 | Drei 10 pairs with Fiber 9. Drei 11 (alpha) pairs with Fiber 10 (alpha) -- do not mix major versions. |
| @react-three/postprocessing@^3.0.0 | @react-three/fiber@^9.0.0, postprocessing@^6.36.0 | Automatically installs postprocessing as peer dep. |
| three@^0.183.0 | @react-three/fiber@^9.5.0 | Use latest stable three.js. R3F v9 supports three.js r170+. |
| gsap@^3.14.2 (already installed) | @react-three/fiber@^9.0.0 | GSAP works alongside R3F via `useFrame`. Use GSAP for timeline coordination, R3F `useFrame` for per-frame mutations. No compatibility issues -- they operate at different levels. |
| motion@^12.38.0 (already installed) | N/A (separate from 3D) | Motion handles page transitions and DOM animations. It does NOT reach inside the R3F Canvas. Clear boundary: Motion animates the container `<div>`, R3F animates everything inside `<Canvas>`. |
| @types/three (devDep) | three@^0.183.0 | Three.js ships its own types since r137, but @types/three sometimes provides more complete declarations. Install as devDep and check if needed. |

## Integration Points with Existing Stack

### GSAP + R3F (3D Animation Coordination)
GSAP is already installed (`gsap@^3.14.2`, `@gsap/react@^2.1.2`). Inside the R3F `<Canvas>`, use GSAP timelines to coordinate complex multi-object animations: camera fly-in on page load, robot character entrance sequences, globe rotation choreography. Access Three.js objects via React refs and animate with GSAP's `gsap.to(ref.current.position, { x: 1, duration: 2 })`. This is the standard pattern for R3F + GSAP integration.

### Motion + R3F (Boundary Definition)
Motion/Framer Motion (already installed as `motion@^12.38.0`) handles all DOM-level animations: page transitions, scroll reveals, hover effects on non-3D elements. It does NOT and should NOT animate anything inside the R3F Canvas. The boundary is: Motion animates the `<section>` wrapper around the hero, R3F animates everything inside `<Canvas>`.

### Tailwind CSS 4 Design Tokens + 3D Materials
The brand colors defined in `@theme` (e.g., `--primary`, `--accent`) can be read from CSS custom properties and passed to Three.js materials:
```typescript
const style = getComputedStyle(document.documentElement);
const primary = style.getPropertyValue('--primary').trim();
// Use primary color for 3D glow, robot highlights, etc.
```
This keeps the 3D scene visually consistent with dark/light mode switches and any admin-configured brand color changes.

### Inertia.js Page Transitions
The 3D hero only renders on the landing page. On Inertia navigation to other pages, the Canvas unmounts cleanly (R3F handles Three.js resource disposal automatically). Use `React.lazy` + `Suspense` so the Three.js chunk is only downloaded when visiting the landing page -- all other pages pay zero 3D cost.

### RTL/Bilingual
The 3D hero is language-agnostic (globe + robots are visual, not textual). Any text overlays near the hero (headline, tagline) use existing RTL-aware React components positioned outside the Canvas. If text labels are needed inside the 3D scene, drei's `<Html>` component renders DOM elements within the 3D space and inherits the document's `dir` attribute.

### Admin Panel
The admin panel does not render 3D content. No Three.js code should be imported in admin routes. The code-split vendor chunk strategy ensures the Three.js bundle is only loaded on public-facing pages that use it.

## Sources

- [@react-three/fiber npm](https://www.npmjs.com/package/@react-three/fiber) -- v9.5.0, React 19 compatibility confirmed (HIGH confidence)
- [@react-three/drei npm](https://www.npmjs.com/package/@react-three/drei) -- v10.7.7 latest (HIGH confidence)
- [three npm](https://www.npmjs.com/package/three) -- v0.183.2 latest (HIGH confidence)
- [@react-three/postprocessing npm](https://www.npmjs.com/package/@react-three/postprocessing) -- v3.0.4 latest (HIGH confidence)
- [R3F Installation docs](https://r3f.docs.pmnd.rs/getting-started/installation) -- Fiber 9 pairs with React 19, verified (HIGH confidence)
- [R3F Performance Scaling docs](https://r3f.docs.pmnd.rs/advanced/scaling-performance) -- PerformanceMonitor, on-demand rendering, LOD, instancing, DPR scaling, movement regression, React 18+ concurrency (HIGH confidence)
- [R3F Loading Models tutorial](https://r3f.docs.pmnd.rs/tutorials/loading-models) -- useGLTF, Draco defaults, preloading (HIGH confidence)
- [gltfjsx GitHub](https://github.com/pmndrs/gltfjsx) -- v6.5.3, --types --transform flags confirmed (HIGH confidence)
- [Drei useGLTF docs](https://drei.docs.pmnd.rs/loaders/gltf-use-gltf) -- Default Draco CDN (`gstatic.com/draco/`), preloading, caching confirmed (HIGH confidence)
- [Tailwind CSS 4 Theme docs](https://tailwindcss.com/docs/theme) -- CSS-first design tokens, `@theme` directive, CSS custom properties auto-generated (HIGH confidence)
- [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4) -- 5x faster builds, @property CSS rules (HIGH confidence)
- [Three.js r171 release](https://github.com/mrdoob/three.js/releases/tag/r171) -- WebGPU entrypoints, global code-split (HIGH confidence)
- [100 Three.js Performance Tips (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips) -- DPR capping, LOD, instancing, texture compression (MEDIUM confidence)
- [Codrops - Building Efficient Three.js Scenes (2025)](https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes-optimize-performance-while-maintaining-quality/) -- Asset optimization, GPU resource management (MEDIUM confidence)
- [React Postprocessing Bloom docs](https://react-postprocessing.docs.pmnd.rs/effects/bloom) -- Selective bloom, luminance threshold, kernel size (HIGH confidence)

---
*Stack research for: 3D Interactive Hero & Brand Redesign (v1.1 milestone)*
*Researched: 2026-04-04*
