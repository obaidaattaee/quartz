---
status: diagnosed
trigger: "Header doesn't apply frosted glass (backdrop-blur) effect when scrolling. Classes stay as bg-transparent, no scroll listener triggers."
created: 2026-03-28T00:00:00Z
updated: 2026-03-28T00:00:00Z
---

## Current Focus

hypothesis: Two issues: (1) page has insufficient content to scroll, so isScrolled never becomes true; (2) global CSS transition rule overrides Tailwind's transition-all, blocking backdrop-filter animation
test: Verified by reading all relevant source files and tracing logic
expecting: Root cause confirmed
next_action: Return diagnosis

## Symptoms

expected: Scrolling past 50px should trigger backdrop-blur and background change on the header
actual: Header stays with bg-transparent classes, no visual change on scroll
errors: No errors reported - just no visual change
reproduction: Scroll down any page past 50px
started: Unknown - may never have been implemented fully

## Eliminated

- hypothesis: useScrollHeader hook has a bug in the scroll event listener
  evidence: Code at use-scroll-header.tsx is correct - uses window.addEventListener('scroll'), checks window.scrollY > threshold, cleans up on unmount, runs on mount
  timestamp: 2026-03-28

- hypothesis: SiteHeader component doesn't mount or render
  evidence: User reports seeing the header classes in DOM inspector, confirming the component renders. Route public/home -> PublicLayout -> SiteHeader chain verified.
  timestamp: 2026-03-28

- hypothesis: Scroll events are captured by a nested overflow container instead of window
  evidence: No overflow:auto/scroll/hidden on body, html, or any parent wrapper in public-layout.tsx. The Blade template body only has font-sans antialiased.
  timestamp: 2026-03-28

- hypothesis: Inertia layout conflict (double-wrapping or wrong layout applied)
  evidence: Home.layout render function takes priority over createInertiaApp defaultLayout. Traced through Inertia 3 source - Component.layout arrow function returns valid element, so it's used directly. PublicLayout wraps Home exactly once.
  timestamp: 2026-03-28

## Evidence

- timestamp: 2026-03-28
  checked: resources/js/components/site-header.tsx
  found: Component correctly uses useScrollHeader() and conditionally applies backdrop-blur-lg classes via cn() when isScrolled is true
  implication: The conditional class logic is correct

- timestamp: 2026-03-28
  checked: resources/js/hooks/use-scroll-header.tsx
  found: Hook uses window.addEventListener('scroll') with passive:true, checks window.scrollY > threshold (default 50), runs handleScroll on mount. Code is correct.
  implication: Hook logic is sound; issue must be that scrollY never exceeds threshold

- timestamp: 2026-03-28
  checked: resources/js/pages/public/home.tsx
  found: Home page has minimal content: just a title and tagline inside min-h-[60vh] div. No other public pages exist (only home.tsx in pages/public/).
  implication: Page content is not tall enough to require scrolling

- timestamp: 2026-03-28
  checked: resources/js/layouts/public-layout.tsx
  found: Layout wrapper has min-h-screen flex flex-col. Main area has flex-1 (expands to fill viewport). Header is fixed (doesn't contribute to document flow). Footer is ~300px of content.
  implication: With flex-1 expanding main to fill viewport, total document height = viewport height. No scroll possible.

- timestamp: 2026-03-28
  checked: resources/css/app.css lines 173-177
  found: Global unlayered CSS rule `html *, html *::before, html *::after { transition: background-color 0.3s ease, color 0.15s ease, border-color 0.3s ease; }` overrides Tailwind's layered transition-all utility class. backdrop-filter is NOT in the transition list.
  implication: Even when scroll IS triggered (after adding content), backdrop-blur won't animate smoothly -- it will snap on/off. The transition-all class on the header is effectively dead.

- timestamp: 2026-03-28
  checked: resources/views/app.blade.php
  found: Clean HTML template, no overflow constraints on body or html
  implication: No structural CSS preventing window scroll

## Resolution

root_cause: |
  TWO ROOT CAUSES:

  1. PRIMARY - No scrollable content: The Home page (resources/js/pages/public/home.tsx) has minimal
     content (title + tagline in min-h-[60vh]). The public-layout.tsx wrapper uses min-h-screen with
     flex-col and flex-1 on main, which expands to fill the viewport. Combined with the footer (~300px),
     total document height equals viewport height. window.scrollY never exceeds 0, so isScrolled never
     becomes true, and classes never change.

  2. SECONDARY - CSS transition override: The global unlayered CSS rule in app.css (lines 173-177)
     `html * { transition: background-color 0.3s ease, color 0.15s ease, border-color 0.3s ease; }`
     overrides Tailwind's layered `transition-all` utility on the header. Since Tailwind v4 generates
     utilities inside CSS layers, and unlayered CSS always wins, the header's transition property
     only covers background-color, color, and border-color -- NOT backdrop-filter. Even once scrolling
     works, the frosted glass blur will snap on/off instead of animating smoothly.

fix:
verification:
files_changed: []
