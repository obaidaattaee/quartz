# Architecture

**Analysis Date:** 2026-03-28

## Pattern Overview

**Overall:** Full-stack Laravel with Inertia.js and React frontend - Server-driven full-stack monolith with Server-Side Rendering (SSR) support and client-side interactivity.

**Key Characteristics:**
- Server-rendered pages via Laravel/Inertia reducing JavaScript complexity
- Type-safe routing via @laravel/vite-plugin-wayfinder (generates TypeScript route helpers)
- React 19 with Inertia adapter for progressive page updates
- Middleware-driven request processing with form validation on both sides
- Trait-based architecture (TwoFactorAuthenticatable, HasFactory, Notifiable)
- Component-based UI with Radix UI primitives and Tailwind CSS
- Layout composition system (AppLayout, AuthLayout, SettingsLayout)

## Layers

**HTTP Request Layer:**
- Purpose: Handle incoming HTTP requests, validate input, apply middleware
- Location: `app/Http/Controllers/`, `app/Http/Requests/`, `app/Http/Middleware/`
- Contains: Controllers, FormRequest validation classes, middleware
- Depends on: Models, Services, Traits, Features (Laravel Fortify)
- Used by: Routing system, external HTTP clients

**Model/Data Layer:**
- Purpose: Represent database entities with validation rules and relationships
- Location: `app/Models/`
- Contains: Eloquent models with attributes, casts, and traits
- Depends on: Database, Traits (TwoFactorAuthenticatable, HasFactory, Notifiable)
- Used by: Controllers, Requests, Factories

**Action/Service Layer:**
- Purpose: Encapsulate business logic and complex operations
- Location: `app/Actions/`, `app/Concerns/`
- Contains: Reusable action classes, shared validation concerns
- Depends on: Models, Requests, Laravel Fortify Features
- Used by: Controllers, Middleware, other Actions

**Middleware Layer:**
- Purpose: Cross-cutting concerns like authentication, appearance handling, Inertia setup
- Location: `app/Http/Middleware/`
- Contains: HandleInertiaRequests, HandleAppearance, authentication middleware
- Key: HandleInertiaRequests - shares auth user and sidebar state to frontend

**React Frontend Layer:**
- Purpose: Render pages and handle client-side interactivity
- Location: `resources/js/pages/`, `resources/js/components/`, `resources/js/layouts/`
- Contains: Page components, UI components, layout wrappers
- Depends on: Inertia.js, React hooks, route helpers (generated), UI library
- Used by: Inertia as page renderers

**Rendering Layer:**
- Purpose: Define page layouts and structural composition
- Location: `resources/js/layouts/`
- Contains: AppLayout (sidebar+header), AuthLayout (centered card), SettingsLayout (nested)
- Pattern: Nested layouts for complex pages (settings uses both AppLayout and SettingsLayout)
- Used by: Page components via layout assignment

**UI Component Layer:**
- Purpose: Reusable design system components
- Location: `resources/js/components/ui/` (Radix primitives), `resources/js/components/` (business components)
- Contains: Button, Input, Dialog, Card, SelectMenu (primitives); DeleteUser, TwoFactorSetup (business)
- Depends on: Radix UI, Tailwind CSS, lucide-react icons
- Pattern: Composable primitives + domain-specific wrappers

**State & Hooks Layer:**
- Purpose: Client-side state management and reusable logic
- Location: `resources/js/hooks/`
- Contains: useAppearance (theme system), useTwoFactorAuth, useMobileNavigation, etc.
- Pattern: Custom React hooks with external store subscription (useSyncExternalStore for theme)

**Routing Layer:**
- Purpose: Type-safe route references and navigation
- Location: Auto-generated from `routes/*.php` via @laravel/vite-plugin-wayfinder
- Contains: Route helper functions (e.g., dashboard(), profile.edit(), login.store())
- Pattern: Generated TypeScript functions matching Laravel route definitions
- Used by: All frontend components for navigation

**Type System Layer:**
- Purpose: Shared type definitions between frontend and backend
- Location: `resources/js/types/`, global type augmentation
- Contains: Auth types (User), Navigation types (BreadcrumbItem, NavItem), UI types
- Pattern: Types exported from index.ts with re-exports from specific modules

## Data Flow

**Page Request Flow:**

1. User navigates to route (e.g., `/settings/profile`)
2. Laravel router matches route in `routes/web.php` or `routes/settings.php`
3. Route middleware executes (auth, verified, password.confirm as needed)
4. Controller action (e.g., ProfileController::edit) executes
5. Controller calls Inertia::render('settings/profile', $data)
6. HandleInertiaRequests middleware adds shared props (auth.user, name, sidebarOpen)
7. React page component receives props via inertiaJS.usePage()
8. Page renders with appropriate layout (determined by name prefix in app.tsx)
9. Layout wraps page in AppLayout > SettingsLayout composition
10. Initial HTML sent to client with bundled React/Inertia JavaScript

**Form Submission Flow:**

1. React Form component (from @inertiajs/react) captures user input
2. Form.submit() sends PATCH/POST to Laravel route with validation errors attached to form props
3. Laravel Controller receives FormRequest - validated automatically
4. On validation failure: Response sent with errors array
5. On validation success: Model updated, response redirects or re-renders with status
6. React Form receives response, updates errors/recentlySuccessful state
7. User sees success message or validation errors inline

**Theme/Appearance Flow:**

1. InitializeTheme() called in app.tsx entry point
2. useAppearance hook retrieves from localStorage (client-side) or cookie (SSR)
3. applyTheme() sets document.documentElement class "dark" and CSS colorScheme
4. System theme changes trigger mediaQuery listener callback
5. Theme updates trigger useSyncExternalStore listeners - re-renders consuming components
6. Updates synced to localStorage and cookie for persistence

**Authentication Flow:**

1. User submits login form via Inertia Form
2. Laravel Fortify handles authentication (configurable guards and providers)
3. On success: Session cookie set, redirects to dashboard
4. HandleInertiaRequests middleware adds auth.user prop to all responses
5. Frontend components access auth data via usePage().props.auth.user
6. Login/register pages use page layout determination in app.tsx (case name.startsWith('auth/'))
7. Two-factor authentication challenge intercepts on login if enabled

## Key Abstractions

**FormRequest Classes:**
- Purpose: Validate incoming HTTP request data with reusable rules
- Examples: `app/Http/Requests/Settings/ProfileUpdateRequest.php`, `PasswordUpdateRequest.php`
- Pattern: Extend FormRequest, define rules(), authorize() - automatically validates before controller receives data

**Validation Concerns:**
- Purpose: Share validation rule definitions across multiple form contexts
- Examples: `app/Concerns/ProfileValidationRules.php`, `PasswordValidationRules.php`
- Pattern: Trait-based - imported by FormRequest classes to DRY validation rules

**Inertia Response Middleware:**
- Purpose: Centralize shared data available to all page renders
- Location: `app/Http/Middleware/HandleInertiaRequests.php`
- Methods: share() - returns array of data passed to every render
- Example: auth.user, app.name, sidebarOpen cookie state

**React Layout System:**
- Purpose: Compose nested layouts without duplicating structural markup
- Example: `resources/js/pages/settings/profile.tsx` uses Profile.layout property to specify breadcrumbs
- Pattern: Page components can assign layout descriptors; app.tsx determines which layouts to wrap based on route name

**Route Helpers (Generated):**
- Purpose: Type-safe navigation without hardcoding URLs
- Example: dashboard(), edit() from @/routes/profile
- Generated from: `routes/web.php`, `routes/settings.php` via wayfinder plugin
- Used by: All navigation, form actions, Link components

## Entry Points

**Backend Entry Point:**
- Location: `routes/web.php` (main routing), `routes/settings.php` (settings routes)
- Triggers: HTTP requests from client
- Responsibilities: Route definition, middleware assignment, controller dispatch

**Frontend Entry Point:**
- Location: `resources/js/app.tsx`
- Triggers: Initial page load (server sends React bundle)
- Responsibilities:
  - Initialize Inertia app with createInertiaApp()
  - Configure layout routing logic (auth/ vs settings/ vs app)
  - Initialize theme system
  - Wrap app in providers (TooltipProvider)

**CSS Entry Point:**
- Location: `resources/css/app.css`
- Imports: Tailwind CSS, tw-animate-css, custom theme variables
- Scoped to: Tailwind @source directives for Blade files and pagination views

**Build Entry Point:**
- Location: `vite.config.ts`
- Plugins: Laravel Vite Plugin, Inertia plugin, React compiler, Tailwind CSS v4, Wayfinder
- Outputs: JavaScript bundle (`resources/js/app.tsx`), CSS bundle (`resources/css/app.css`)

## Error Handling

**Strategy:** Validation-first on server, form state management on client, fallback 500 error pages.

**Patterns:**
- FormRequest validation failures return 422 with errors array in response props
- React Form component receives errors, displays inline via InputError component
- Unhandled exceptions in production return generic error response via Blade error pages
- Client-side axios/fetch errors caught by Inertia adapter for redirect/reload

## Cross-Cutting Concerns

**Logging:** Laravel default logging (config/logging.php) - uses stack driver with single and daily channels

**Validation:**
- Server-side: FormRequest classes with rule definitions, validation concerns for sharing
- Client-side: Inertia Form wrapper handles error display, processing state

**Authentication:**
- Laravel Guard (configurable) with session driver
- Fortify package provides routes (login, register, password reset, two-factor)
- TwoFactorAuthenticatable trait on User model
- Middleware: auth (requires authentication), verified (requires email verification), password.confirm (requires password confirmation for sensitive actions)

**Authorization:**
- Method-level control via controller constructor or middleware
- Form-level control via FormRequest authorize() method
- Fortify Features class gates available features (registration, two-factor, recovery codes)

---

*Architecture analysis: 2026-03-28*
