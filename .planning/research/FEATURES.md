# Feature Research

**Domain:** Premium agency/consultancy website redesign -- 3D interactive hero, brand system, portfolio case studies, lead generation
**Researched:** 2026-04-04
**Confidence:** HIGH
**Milestone:** v1.1 Brand Redesign & 3D Interactive Experience

**Scope note:** This research focuses exclusively on NEW features for the v1.1 milestone. The existing v1 features (landing page, service pages, contact form, blog, portfolio grid, admin panel, bilingual support, dark/light mode, SEO) are already shipped and are not re-documented here except where they serve as dependencies.

---

## Feature Landscape

### Table Stakes (Users Expect These)

These are features that premium agency/consultancy websites in 2025-2026 routinely ship. Missing these means the Quartz site will still look "template-y" rather than custom and professional. Organized by the four focus areas.

#### 1. 3D Interactive Hero Experience

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 3D Earth globe as hero centerpiece | Awwwards-level agency sites now routinely use Three.js/R3F hero scenes. A static hero with floating shapes (current state) reads as template. The globe directly ties to Quartz's global reach narrative | HIGH | React Three Fiber wrapping Three.js. Globe.gl or custom sphere geometry with GeoJSON country outlines. Must lazy-load the canvas to protect LCP |
| Animated robot characters on the globe | The Roblox-style robots representing each service (dev, automation, QA, cybersecurity) are the brand signature. Without them the globe is just another globe | HIGH | 4 low-poly GLTF models. Pre-modeled in Blender, exported as compressed .glb files (draco compression). Each robot needs idle animation loop + hover/click interaction |
| Smooth loading transition | Users on slower connections see a jarring blank canvas while Three.js initializes. Premium sites mask this with a branded loading state | MEDIUM | Suspense boundary with a lightweight 2D placeholder that cross-fades into the 3D scene. Show the 2D hero text immediately, load 3D in background |
| Mobile fallback / adaptive quality | 40%+ of Quartz's target audience (SE Asia, Middle East) uses mid-range mobile devices where WebGL is slow or unsupported | MEDIUM | PerformanceMonitor from R3F to auto-downgrade DPR and disable post-processing. Below threshold: show high-quality static illustration or CSS animation instead of 3D |
| Reduced motion respect | Accessibility requirement. Users with `prefers-reduced-motion` should not see the animated 3D scene | LOW | Already have `useReducedMotion` hook in codebase. Extend to disable the Three.js canvas entirely and show static fallback |
| Hero text overlay with clear value proposition | The 3D scene is background/accent -- the text message must still dominate. Agencies that make the 3D compete with the copy lose conversions | LOW | Layer text above canvas with pointer-events-none on the canvas. Current hero text pattern is solid, carry forward |
| Interactive globe controls (rotate, zoom) | Users expect to be able to interact with a 3D element they see. A non-interactive 3D scene feels broken | MEDIUM | OrbitControls from R3F with constrained rotation (no flip). Auto-rotate when idle, user takes over on drag, returns to auto-rotate after timeout |

#### 2. Brand Design System

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Cohesive color palette (light + dark + accent) | The current palette is generic Tailwind defaults. Premium consultancy sites have a distinct, recognizable color identity that carries through every element | MEDIUM | Define 6-8 semantic color tokens (brand-primary, brand-secondary, surface, accent, etc.) as CSS custom properties in Tailwind config. Must work across light and dark modes |
| Custom typography scale | Generic system fonts or default Inter reads as template. Typography is the single highest-impact branding lever | LOW | 2 typefaces max: display/heading font (distinctive, possibly geometric sans) + body font (highly readable). Must support Arabic glyphs -- this eliminates many display fonts. Use variable fonts for performance |
| Component design language (cards, sections, buttons) | Every UI element should feel "Quartz" not "Shadcn default." Card radiuses, shadow depths, border treatments, spacing rhythm all need to be intentional and consistent | MEDIUM | Design tokens file defining border-radius scale, shadow scale, spacing rhythm. Update all existing Shadcn/Radix components to use the token system |
| Icon and illustration style | Inconsistent icon styles (mixing Lucide with custom SVGs with stock) breaks the premium feel | MEDIUM | Choose one icon approach: custom service icons in a consistent stroke weight and style that match the robot characters' aesthetic. Lucide for UI chrome is fine, but service/feature icons should be custom |
| Motion design language | Animations should feel intentional and branded, not generic fade-in-up on everything. Premium sites have a recognizable motion signature | MEDIUM | Define 3-4 motion patterns: entrance (how elements appear), transition (page to page), interaction (hover/click feedback), ambient (subtle background motion). Currently using motion/react (Framer Motion) -- good foundation |
| Responsive spacing and layout grid | Current layout likely uses ad-hoc padding/margins. A system ensures every page feels cohesive | LOW | Define a spacing scale (4, 8, 12, 16, 24, 32, 48, 64, 96, 128) and section rhythm. All sections use the same vertical padding pattern |
| Dark/light mode that feels designed, not inverted | Current dark mode is likely a simple color inversion. Premium dark modes have their own carefully chosen palette | MEDIUM | Separate dark palette with adjusted saturation (dark backgrounds need less saturated accent colors). The 3D scene should also adapt -- darker ambient lighting, adjusted globe colors |

#### 3. Portfolio Case Studies

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Problem-Approach-Results narrative structure | Every premium agency portfolio follows this arc. The current portfolio show page has title/description/content but no structured storytelling framework | MEDIUM | Database schema needs: challenge field, approach field, results field (structured, not just rich text). Admin form needs matching sections. Front-end renders each as a distinct visual block |
| Quantified results with visual metrics | Case studies that say "improved performance" are weak. "Reduced load time by 62%" with a big number display converts. 72% of B2B buyers say case studies influence purchase decisions | MEDIUM | ResultsMetrics component already exists in codebase. Enhance to support animated number counters (count-up on scroll), percentage bars, before/after comparisons |
| Full-bleed project imagery and screenshots | Portfolio pages with small inline images look amateur. Premium case studies use edge-to-edge hero images, device mockups, and UI screenshots that showcase the work | MEDIUM | Image gallery component with lightbox. Support for browser mockup frames, phone mockup frames, and full-width hero images. Lazy loading with blur-up placeholder |
| Client testimonial per case study | A testimonial specifically tied to the project is far more convincing than a generic homepage testimonial | LOW | Add optional testimonial fields (quote, name, title, avatar) to the portfolio item model. Display as a styled pull-quote block within the case study |
| Technology/tools used badges | Visitors (especially technical decision-makers) want to see the tech stack used. Signals competence and relevance | LOW | Tag-style badges for technologies. Already have service_category -- extend to support multiple tech tags per project |
| Related projects / next project navigation | Once a visitor is engaged with case studies, guide them deeper. "Next Project" or "Similar Work" keeps them in the portfolio | LOW | Query related items by service_category. Show as cards at bottom of case study page. "Next Project" navigation with arrow |

#### 4. Lead Generation Optimization

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Strategic CTA placement throughout all pages | Current site has a single CTA section component. Premium B2B sites place CTAs after every trust-building moment (after testimonials, after case study results, in-line within service descriptions) | LOW | Multiple CTA variants: inline (within content), section-break (between sections), sticky (floating), and end-of-page (final pitch). Pages with a single repeated CTA goal outperform competing CTAs by 20-30% |
| Animated statistics/social proof section | "150+ projects delivered," "98% client retention," "4 countries served" -- big animated numbers that build trust at a glance. The existing statistics-section.tsx is a foundation but needs enhancement | MEDIUM | Count-up animation on scroll intersection. Use real numbers from the admin panel. Display prominently on homepage and about page |
| Client logo showcase (enhanced) | The existing client-logos.tsx component needs to feel premium -- auto-scrolling marquee, grayscale-to-color on hover, proper sizing | LOW | Infinite scroll marquee animation. Grayscale filter with color on hover. Admin-managed logo upload already exists |
| Trust signals near conversion points | Testimonial quotes, client count, project count placed directly adjacent to CTAs and contact forms. Placing proof next to action reduces hesitation | LOW | Design pattern: every CTA section includes a one-liner proof point ("Trusted by 50+ companies across 4 countries") |
| Contact form with service pre-selection | Current form already supports service query param. Enhance with multi-step progressive disclosure to reduce perceived friction | MEDIUM | Step 1: Name + email + service. Step 2: Budget range + timeline + message. Reduces initial friction while capturing qualification data |
| WhatsApp floating action button | WhatsApp is the dominant business communication channel in SE Asia and Middle East (Quartz's primary markets). A floating WhatsApp button provides instant conversion path | LOW | Floating button, bottom-right (bottom-left for RTL), with pulse animation. Links to wa.me with pre-filled message. Only show on mobile or when WhatsApp is contextually relevant |

---

### Differentiators (Competitive Advantage)

Features that go beyond table stakes and create a memorable, distinctive experience. These are what separate Quartz from template-based competitor sites.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Robot characters as brand mascots across the site | The Roblox-style robots become a visual thread beyond the hero -- appearing in service sections, loading states, error pages, even the admin panel. Creates brand recall that generic stock imagery cannot | HIGH | Requires 4 base robot models + additional poses/variants. High asset creation cost but enormous brand differentiation. Start with hero robots, extend to other pages incrementally |
| Scroll-driven storytelling on landing page | Instead of static sections, the landing page unfolds as a narrative: globe zooms in > robots introduce themselves > services appear > social proof builds > CTA lands. GSAP ScrollTrigger + R3F integration | HIGH | GSAP ScrollTrigger controlling Three.js camera positions and React component visibility. Complex to build but creates the "I have to show you this" shareability factor |
| Custom cursor interactions | Cursor morphs contextually: default arrow becomes "View" on portfolio items, "Explore" on the globe, "Contact" on CTA buttons. Agency signature move from Awwwards-winning sites | MEDIUM | Custom cursor component that reads hover target data attributes. Must be disabled on touch devices. CSS pointer-events management is tricky with the 3D canvas layer |
| Page transitions with shared elements | When clicking a portfolio item, the card image expands into the case study hero image. Service cards morph into service page headers. Creates spatial continuity | HIGH | Inertia.js page transitions + Framer Motion layout animations. Requires careful coordination between Inertia's navigation and React's animation lifecycle. The existing Inertia + motion/react setup supports this but needs custom work |
| Interactive service visualization on globe | Each robot on the globe corresponds to a service. Hovering/clicking a robot highlights that service region on the globe, shows a tooltip, and provides a direct link to the service page | HIGH | Raycasting in R3F to detect hover/click on individual robot meshes. Tooltip overlay positioned via 3D-to-2D coordinate projection. Must work with both mouse and touch |
| Dark mode 3D scene adaptation | The globe and robots visually transform between light and dark mode -- not just background color but lighting, atmosphere glow, robot material properties | MEDIUM | Separate material configurations for light/dark. Smooth transition between them using lerped values. Tied to the existing appearance system |
| Animated case study timeline | Instead of static problem/approach/results sections, the case study scrolls through a visual timeline with animated data reveals, slide-in screenshots, and progressive number counting | MEDIUM | Scroll-triggered section reveals with staggered child animations. Builds on existing ScrollReveal but with more sophisticated choreography |
| Bilingual 3D labels and tooltips | Globe annotations and robot tooltips render in the active locale (EN/AR). Arabic text in 3D space requires SDF text rendering or HTML overlay approach | MEDIUM | HTML overlays positioned via CSS3DRenderer or projected 2D overlays are simpler and more reliable than 3D text geometry. Use the existing locale system |

---

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Full-screen 3D-only hero with no text | "Make it more immersive like a game" | Destroys conversion. Users cannot understand the value proposition. Google cannot index it. Accessibility disaster. Mobile users see nothing useful while 3D loads | 3D as background/accent with text overlay. The message is primary, the 3D is atmosphere |
| Auto-playing background video hero | "Every premium site has video" | Massive performance cost (2-5MB minimum), delays LCP, uses bandwidth on mobile, accessibility issues. The 3D globe IS the visual interest -- adding video on top is redundant | The 3D interactive hero IS the video replacement. It is better because it is interactive and lighter when done right |
| Chatbot / AI assistant on the site | "Everyone has chatbots now" | For a services company with 4 offerings, a chatbot adds friction not value. The decision tree is simple: learn about services > see proof > contact. A chatbot interrupts this flow | Clear CTAs, visible contact channels (WhatsApp, email, phone), and a simple contact form. Direct human connection, not bot deflection |
| Parallax scrolling on every section | "The scotchpos.com inspiration uses parallax" | Excessive parallax causes motion sickness, breaks on mobile, conflicts with RTL layout mirroring, and competes with the 3D hero for GPU resources | Selective scroll-triggered reveals (already implemented via ScrollReveal). Reserve parallax for 1-2 hero/feature sections maximum |
| Animated page loader / splash screen | "Show our logo animation before the site loads" | Adds artificial delay to an already-complex loading experience (3D assets loading). Users interpret loaders as slowness. Every second of loader loses ~7% of visitors | Skeleton screens and progressive loading. Show content structure immediately, load 3D in background, fade in when ready |
| Portfolio filtering with complex animation | "Animate cards shuffling when filtering" | Layout animation with mixed-direction (LTR/RTL) content is fragile. Filter animations with Inertia.js server-side rendering create jank. Over-engineering a simple feature | Instant filter with subtle fade transition. The current filterable portfolio grid works -- enhance the card design, not the filter animation |
| Mega-menu navigation | "We need dropdowns for services, portfolio, blog sub-categories" | Quartz has 5-6 top-level pages. A mega-menu signals complexity that does not exist. Adds mobile hamburger menu complexity | Clean horizontal nav with active state indicators. Service sub-pages accessible from the services overview page. Keep navigation flat |
| Real-time visitor counter / "X people viewing" | "Shows we are popular" | Feels manipulative on a services website. Appropriate for e-commerce, inappropriate for B2B professional services. Requires WebSocket infrastructure for questionable value | Static social proof: "Trusted by 50+ companies" with client logos. Genuine, verifiable, no infrastructure cost |
| Heavy post-processing effects (bloom, chromatic aberration, film grain) | "Make the 3D look cinematic" | Destroys performance on mid-range devices (Quartz's SE Asia/Middle East audience). Bloom on text makes it unreadable. Film grain over the globe obscures the actual content | Clean, well-lit 3D with quality materials and subtle environment mapping. Let the models and design speak, not the effects |

---

## Feature Dependencies

```
[Brand Design System (color palette, typography, tokens)]
    |
    +--required-by--> [3D Hero Scene (materials reference brand colors)]
    +--required-by--> [Landing Page Redesign (all components use tokens)]
    +--required-by--> [Portfolio Case Study Redesign (card styles, typography)]
    +--required-by--> [Lead Gen CTAs (button styles, visual hierarchy)]

[3D Robot Character Models (Blender assets)]
    |
    +--required-by--> [3D Hero Globe Scene]
    +--required-by--> [Robot Mascots Across Site (differentiator)]
    +--required-by--> [Interactive Service Visualization on Globe]

[3D Hero Globe Scene (R3F + globe geometry)]
    |
    +--required-by--> [Scroll-Driven Storytelling (GSAP integration)]
    +--required-by--> [Interactive Service Visualization]
    +--required-by--> [Dark Mode 3D Adaptation]

[Portfolio Schema Redesign (problem/approach/results fields)]
    |
    +--required-by--> [Case Study Narrative Pages]
    +--required-by--> [Animated Case Study Timeline (differentiator)]
    +--required-by--> [Per-Case-Study Testimonials]

[Existing Admin Panel]
    +--required-by--> [Brand Token Management (admin can adjust colors)]
    +--required-by--> [Portfolio Schema Redesign (new admin form fields)]
    +--required-by--> [Statistics Management (admin edits numbers)]

[Existing i18n System (useLocale hook)]
    +--required-by--> [Bilingual 3D Labels]
    +--required-by--> [RTL-Aware Cursor Interactions]
    +--required-by--> [All New Components (must support EN/AR)]

[Existing Contact Form]
    +--enhances--> [Multi-Step Progressive Form]
    +--enhances--> [WhatsApp Floating Button]
    +--enhances--> [Strategic CTA Placement]
```

### Dependency Notes

- **Brand Design System must come first:** Every other feature depends on the color palette, typography, and design tokens. Building the 3D scene or redesigning the portfolio without the brand system means rework.
- **3D Robot Models are an external dependency:** These need to be created in Blender by a 3D artist (or the developer if skilled). They block the hero scene entirely. Starting model creation early is critical path.
- **Portfolio Schema Redesign blocks case study pages:** The current database schema stores title/description/content. The new structured case study format needs challenge/approach/results/metrics/testimonial fields. Migration must happen before front-end redesign.
- **Existing admin panel is a dependency, not a blocker:** New features extend the admin, they do not require admin rewrites. Add fields to existing forms.
- **i18n system is already solid:** The `useLocale` hook and URL-based routing (`/en/`, `/ar/`) are in place. New components just need to follow the established pattern.

---

## MVP Definition

### Launch With (v1.1 Core)

The minimum set that delivers the "wow this is not a template" transformation.

- [ ] **Brand design system** -- New color palette, typography, design tokens applied to all existing components. This is the highest-impact, lowest-risk change. Without it, everything else still looks template-y
- [ ] **3D Earth globe hero with robot characters** -- The signature feature. Globe with 4 robots representing services, auto-rotate, basic hover interaction, mobile fallback. Does not need scroll-driven storytelling or complex interactions for launch
- [ ] **Landing page section redesign** -- New visual hierarchy, section layouts, and flow using the brand system. Rebuild the homepage with the new design language
- [ ] **Portfolio case study structure** -- Problem > Approach > Results narrative with quantified metrics, full-bleed imagery, per-project testimonial. Redesign the portfolio show page
- [ ] **Strategic CTA placement** -- Multiple CTA touchpoints on every page, trust signals near conversion points, enhanced statistics section with animated counters
- [ ] **Enhanced client logo showcase** -- Marquee/scroll animation, grayscale-to-color hover

### Add After Validation (v1.1.x)

Features to layer on once the core redesign is live and performing.

- [ ] **Scroll-driven storytelling on landing page** -- GSAP ScrollTrigger controlling globe camera + section reveals. Add after core 3D hero is stable and performing well
- [ ] **Custom cursor interactions** -- Contextual cursor states on hover. Add after the base design is polished and tested across browsers
- [ ] **Page transitions with shared elements** -- Portfolio card to case study expansion. Add after Inertia page transitions are stable with the new 3D scene
- [ ] **Interactive service visualization on globe** -- Click/hover robots to navigate services. Add after basic globe interaction is proven performant
- [ ] **Multi-step contact form** -- Progressive disclosure form. Add after measuring current form conversion baseline
- [ ] **Robot mascots in other pages** -- Error pages, loading states, service sections. Extend after hero robots are finalized

### Future Consideration (v1.2+)

- [ ] **Animated case study timeline** -- Requires significant scroll animation engineering. Defer until case study content is populated and the simpler structure is validated
- [ ] **Dark mode 3D adaptation** -- Separate lighting/materials for dark mode. Nice but not critical -- a single well-lit scene works for both modes with background color changes
- [ ] **Bilingual 3D labels** -- Arabic text in 3D overlays. Complex with RTL considerations. Defer until the globe interactions are mature
- [ ] **Admin-controlled brand tokens** -- Let admin adjust brand colors/fonts. Defer until the brand is established and stable

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Brand design system (palette, typography, tokens) | HIGH | MEDIUM | P1 |
| 3D Earth globe hero (basic) | HIGH | HIGH | P1 |
| Robot character models (4 service robots) | HIGH | HIGH | P1 |
| Landing page section redesign | HIGH | MEDIUM | P1 |
| Portfolio case study narrative structure | HIGH | MEDIUM | P1 |
| Strategic CTA placement | HIGH | LOW | P1 |
| Animated statistics counters | MEDIUM | LOW | P1 |
| Enhanced client logo marquee | MEDIUM | LOW | P1 |
| Mobile 3D fallback | HIGH | MEDIUM | P1 |
| Globe interactive controls (rotate/zoom) | MEDIUM | LOW | P1 |
| Per-case-study testimonial | MEDIUM | LOW | P1 |
| Technology badges on case studies | LOW | LOW | P1 |
| Related projects navigation | MEDIUM | LOW | P1 |
| WhatsApp floating button | MEDIUM | LOW | P1 |
| Scroll-driven storytelling (GSAP) | HIGH | HIGH | P2 |
| Custom cursor interactions | MEDIUM | MEDIUM | P2 |
| Interactive service viz on globe | HIGH | HIGH | P2 |
| Page transitions with shared elements | MEDIUM | HIGH | P2 |
| Multi-step contact form | MEDIUM | MEDIUM | P2 |
| Robot mascots across site | MEDIUM | MEDIUM | P2 |
| Animated case study timeline | MEDIUM | HIGH | P3 |
| Dark mode 3D adaptation | LOW | MEDIUM | P3 |
| Bilingual 3D labels | LOW | HIGH | P3 |
| Admin brand token management | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for v1.1 launch -- delivers the "this is not a template" transformation
- P2: Should have, layer in after core is stable -- enhances the wow factor
- P3: Nice to have, future milestone -- polish and depth

---

## Competitor Feature Analysis

Analysis of how premium tech service/agency sites handle each feature area.

| Feature Area | Premium Agencies (Awwwards-level) | Mid-tier Agency Sites | Quartz v1.1 Approach |
|-------------|-----------------------------------|----------------------|---------------------|
| **Hero section** | Full 3D scenes (Three.js/R3F), scroll-driven narratives, custom shaders, 5-15s load acceptable for the "wow" | Static image/video hero, basic parallax, Lottie animations | 3D globe with robot characters. Prioritize fast loading with progressive enhancement. Not as heavy as Awwwards winners but significantly above mid-tier |
| **Brand identity** | Completely custom design language: unique typography, color, illustration style. Zero template smell | Customized templates with brand colors. Often mix-and-match component styles | Full custom design token system. 2 typefaces, 6-8 colors, consistent component language. Should feel as custom as premium tier |
| **Portfolio/case studies** | Full narrative case studies with immersive scroll, video walkthroughs, animated data visualization, 2000+ word depth | Grid of thumbnails with short descriptions. Minimal case study depth | Structured narrative (problem > approach > results) with quantified metrics, full-bleed imagery, testimonials. Mid-way between depth extremes |
| **Lead generation** | Subtle: premium sites let the work speak and have minimal CTAs. Contact page is often the only conversion point | Aggressive: popups, chatbots, multiple competing CTAs, newsletter signup walls | Strategic: CTAs placed at natural decision points (after proof sections), trust signals adjacent to conversion actions, one clear primary action per page |
| **Animation** | GSAP + R3F + custom shaders. Scroll-driven everything. 3-5 second initial loads acceptable | Basic CSS transitions, occasional Lottie, generic scroll reveals | motion/react (Framer Motion) for UI, GSAP for scroll-driven sequences, R3F for 3D. Targeted animation that enhances meaning, not decoration |
| **Mobile experience** | Often degraded significantly. Some Awwwards sites are barely functional on mobile | Responsive but boring. Same content, less visual impact | Full responsive with adaptive 3D quality. Static fallback for low-end devices. Mobile is first-class because target markets are mobile-heavy |

---

## Bilingual (RTL/LTR) Considerations for New Features

These apply across all feature areas and are specific to the Quartz constraint of supporting English and Arabic.

| Feature | RTL Impact | Mitigation |
|---------|-----------|------------|
| 3D Globe | Globe rotation direction should reverse for RTL (spin right-to-left). Robot placement is not directional so no change needed | Auto-rotate direction tied to `document.dir`. Minor config change |
| Custom cursor | Cursor offset calculations invert in RTL. Context labels must be translated | Use CSS logical properties for positioning. Labels from i18n system |
| Scroll storytelling | Horizontal scroll direction and parallax direction must reverse for RTL | GSAP ScrollTrigger supports RTL with `direction` config. Test early |
| Statistics counters | Arabic numerals (Eastern Arabic digits) may be expected in Arabic locale | Use `Intl.NumberFormat` with locale parameter. Already standard practice |
| Client logo marquee | Scroll direction should reverse for RTL | CSS animation-direction or JS-based marquee with direction prop |
| Case study layout | Full-bleed images are direction-neutral but text alignment and before/after image ordering needs RTL treatment | Use CSS logical properties (margin-inline-start vs margin-left). BeforeAfterImages component needs direction awareness |
| WhatsApp FAB | Position bottom-left in RTL instead of bottom-right | Use `inset-inline-end` instead of `right` in Tailwind |

---

## Sources

### 3D Interactive Hero
- [Three.js Agencies Overview (Utsubo, 2026)](https://www.utsubo.com/blog/top-threejs-agencies)
- [3D Web Design with Three.js (Mivi, 2026)](https://mivibzzz.com/resources/web-development/3d-web-design-threejs-modern-libraries)
- [React Three Fiber Performance Scaling (pmnd.rs docs)](https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance)
- [Hero Section Design Best Practices 2026 (Perfect Afternoon)](https://www.perfectafternoon.com/2025/hero-section-design/)
- [Globe.GL Library](https://globe.gl/)
- [r3f-globe React Three Fiber Globe Component](https://github.com/vasturiano/r3f-globe)
- [Awwwards Interactive 3D Hero Sections](https://www.awwwards.com/inspiration/interactive-3d-hero-section-carl-gordon-portfolio-c-2024)

### Brand Design Systems
- [Design Systems Examples for 2026 (Superside)](https://www.superside.com/blog/design-systems-examples)
- [Visual Branding Guide 2026 (Tenet)](https://www.wearetenet.com/blog/visual-branding)
- [Brand Identity System Guide 2025 (Spellbrand)](https://spellbrand.com/blog/brand-identity-system)
- [Design System Benefits for Modern Brands (Superside)](https://www.superside.com/blog/design-systems)

### Portfolio Case Studies
- [Portfolio Case Study Examples Guide 2026 (InfluenceFlow)](https://influenceflow.io/resources/portfolio-case-study-examples-the-complete-2026-guide-for-creative-professionals/)
- [How to Write Portfolio Case Studies That Drive Sales (Taylor Nguyen)](https://taylornguyen.ca/posts/website-case-studies)
- [Writing Agency Website Case Studies (New Media Campaigns)](https://www.newmediacampaigns.com/blog/tips-for-writing-agency-website-case-studies)
- [Webflow Portfolio Design Examples](https://webflow.com/blog/design-portfolio-examples)

### Lead Generation & Conversion
- [B2B Lead Generation Trends 2026 (Leadinfo)](https://www.leadinfo.com/en/blog/b2b-lead-generation-trends-in-2026-the-7-channels-and-tactics-that-actually-work/)
- [15 B2B Website Best Practices 2026 (Directive)](https://directiveconsulting.com/blog/15-b2b-website-best-practices-for-2026-built-for-buyers-not-just-browsers/)
- [Social Proof Conversion Statistics 2026 (Genesys Growth)](https://genesysgrowth.com/blog/social-proof-conversion-stats-for-marketing-leaders)
- [CTA Placement Strategies 2026 (LandingPageFlow)](https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages)
- [B2B Trust in 2026 (Search Engine Journal)](https://www.searchenginejournal.com/addressing-the-b2b-trust-deficit-how-to-win-buyers-in-2026/559267/)
- [B2B CRO Guide 2026 (Grow Conversions)](https://grow-conversions.com/blog/b2b-conversion-rate-optimization/)

### Animation & Interaction
- [CSS/JS Animation Trends 2026 (Web Peak)](https://webpeak.org/blog/css-js-animation-trends/)
- [Website Animations Pros/Cons 2026 (Shadow Digital)](https://www.shadowdigital.cc/resources/do-you-need-website-animations)
- [Interactive Elements in Agency Web Development 2026 (OneWebCare)](https://onewebcare.com/blog/interactive-elements-in-agency-website-development/)

### RTL / Bilingual
- [Arabic RTL Web Design Best Practices (Bycom Solutions)](https://bycomsolutions.com/blog/arabic-rtl-web-design-best-practices/)
- [Challenges in English-Arabic Applications (Monterail)](https://www.monterail.com/blog/challenges-solutions-developing-english-arabic-applications)
- [RTL Website Design Mistakes & Best Practices (Reffine)](https://www.reffine.com/en/blog/rtl-website-design-and-development-mistakes-best-practices)

---
*Feature research for: Quartz v1.1 Brand Redesign & 3D Interactive Experience*
*Researched: 2026-04-04*
