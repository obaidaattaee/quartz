# Codebase Structure

**Analysis Date:** 2026-03-28

## Directory Layout

```
Ahmed/
├── app/                                # Laravel application code
│   ├── Actions/                       # Business logic actions
│   │   └── Fortify/                   # Laravel Fortify actions (auth)
│   ├── Concerns/                      # Shared traits and concerns
│   ├── Http/
│   │   ├── Controllers/               # Request handlers
│   │   │   └── Settings/              # Settings controllers (Profile, Security)
│   │   ├── Middleware/                # Request middleware
│   │   └── Requests/                  # Form request validation
│   │       └── Settings/              # Settings request validation
│   ├── Models/                        # Eloquent models
│   └── Providers/                     # Service providers
├── bootstrap/                         # Bootstrap files and cache
├── config/                            # Laravel configuration files
├── database/
│   ├── factories/                     # Model factories for testing
│   ├── migrations/                    # Database schema migrations
│   └── seeders/                       # Database seeding classes
├── resources/
│   ├── css/
│   │   └── app.css                    # Main Tailwind CSS entry point with theme variables
│   ├── js/                            # Frontend React application
│   │   ├── app.tsx                    # React app entry point (Inertia initialization)
│   │   ├── components/                # React components
│   │   │   ├── ui/                    # Radix UI primitive components (auto-generated)
│   │   │   └── *.tsx                  # Business domain components (header, sidebar, forms)
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── layouts/                   # Page layout compositions
│   │   │   ├── app/                   # Main app layout (sidebar + header)
│   │   │   ├── auth/                  # Auth layouts (centered, card, split)
│   │   │   └── settings/              # Settings nested layout
│   │   ├── lib/                       # Utility functions (cn for class merging)
│   │   ├── pages/                     # Page components (Inertia renders)
│   │   │   ├── auth/                  # Authentication pages
│   │   │   ├── settings/              # Settings pages
│   │   │   ├── dashboard.tsx          # Main dashboard page
│   │   │   └── welcome.tsx            # Welcome/home page
│   │   ├── routes/                    # Auto-generated route helpers (wayfinder)
│   │   ├── types/                     # TypeScript type definitions
│   │   └── actions/                   # Auto-generated controller helpers (wayfinder)
│   └── views/
│       └── app.blade.php              # Root Blade template (holds React mount point)
├── routes/
│   ├── web.php                        # Web routes (main and dashboard)
│   └── settings.php                   # Settings routes (profile, security, appearance)
├── storage/                           # File storage, logs, cache
├── tests/
│   ├── Feature/                       # Feature/integration tests
│   │   ├── Auth/                      # Auth feature tests
│   │   └── Settings/                  # Settings feature tests
│   └── Unit/                          # Unit tests
├── vite.config.ts                     # Vite build configuration
├── tsconfig.json                      # TypeScript configuration with @ path alias
├── eslint.config.js                   # ESLint configuration
├── .prettierrc                        # Prettier code formatting config
├── package.json                       # Node.js dependencies
├── composer.json                      # PHP dependencies
├── artisan                            # Laravel CLI entry point
└── .env.example                       # Example environment variables
```

## Directory Purposes

**app/**
- Purpose: All Laravel application logic including models, controllers, requests, middleware
- Contains: PHP classes organized by responsibility (Models/, Http/, Actions/, Concerns/)
- Key files: `app/Http/Controllers/Settings/ProfileController.php`, `app/Models/User.php`

**resources/js/**
- Purpose: Complete React frontend application
- Contains: React components, hooks, pages, layouts, type definitions
- Entry point: `resources/js/app.tsx` initialized by Vite

**resources/js/components/**
- Purpose: Reusable UI components
- Contains: Radix UI wrapper components (ui/), domain-specific components (app-header.tsx, user-menu.tsx)
- Pattern: UI primitives auto-generated from component.json; custom components manually maintained

**resources/js/pages/**
- Purpose: Page components rendered by Inertia based on route
- Contains: Auth pages (login.tsx, register.tsx), Settings pages, Dashboard
- Pattern: Each page receives props from Laravel controller via Inertia::render()

**resources/js/layouts/**
- Purpose: Structural layouts wrapping page content
- Contains: AppLayout (sidebar navigation + header), AuthLayout (centered auth form), SettingsLayout (nested in app)
- Pattern: Page components assign layout via `Component.layout = { breadcrumbs: [...] }`

**routes/**
- Purpose: Define Laravel web routes and middleware grouping
- Contains: web.php (main routes), settings.php (nested settings routes)
- Pattern: Routes automatically generate TypeScript helpers via wayfinder plugin

**database/migrations/**
- Purpose: Database schema version control
- Contains: Initial tables (users, cache, jobs), two-factor authentication columns
- Key migration: `2025_08_14_170933_add_two_factor_columns_to_users_table.php`

**tests/**
- Purpose: Automated testing
- Contains: Feature tests (integration with database), Unit tests
- Structure: Mirrors app/ structure (Auth/, Settings/ subdirectories)

## Key File Locations

**Entry Points:**
- `resources/js/app.tsx`: React/Inertia app initialization - creates Inertia app, configures layouts, initializes theme
- `routes/web.php`: Main web route definitions - welcome, dashboard, settings routes
- `vite.config.ts`: Vite build configuration - loads Laravel plugin, Inertia plugin, React compiler

**Configuration:**
- `vite.config.ts`: Build system configuration, plugin setup
- `tsconfig.json`: TypeScript configuration with path aliases (@/* → resources/js/*)
- `eslint.config.js`: Linting rules for JavaScript/TypeScript
- `.prettierrc`: Code formatting rules (semi, singleQuote, tabWidth: 4)

**Core Logic:**
- `app/Http/Controllers/Settings/ProfileController.php`: Handles profile display and update
- `app/Http/Controllers/Settings/SecurityController.php`: Handles security/password/two-factor
- `app/Models/User.php`: User model with Authenticatable, HasFactory, TwoFactorAuthenticatable traits
- `app/Http/Middleware/HandleInertiaRequests.php`: Shares auth data and UI state to all pages

**Testing:**
- `tests/Feature/Auth/AuthenticationTest.php`: Login/logout tests
- `tests/Feature/Settings/ProfileUpdateTest.php`: Profile update tests
- `tests/Feature/Auth/TwoFactorChallengeTest.php`: Two-factor auth tests

## Naming Conventions

**Files:**
- React components: PascalCase with .tsx extension (ProfileSettings.tsx, DeleteUser.tsx)
- React hooks: lowercase with dash, useHook pattern (use-appearance.tsx, use-two-factor-auth.ts)
- PHP classes: PascalCase with .php extension (ProfileController.php, User.php)
- Pages: lowercase kebab-case or match route names (profile.tsx, two-factor-challenge.tsx)

**Directories:**
- Feature directories: PascalCase (Auth/, Settings/, Http/)
- Type/purpose directories: lowercase (hooks/, lib/, pages/, components/)
- Auto-generated directories ignored in eslint: routes/, actions/, wayfinder/

**Variables/Functions:**
- TypeScript/JavaScript: camelCase (useAppearance, handleSubmit, isDarkMode)
- PHP: camelCase (getStoredAppearance, applyTheme, authenticate)
- CSS classes: kebab-case via Tailwind (bg-background, text-foreground)

**Type Names:**
- TypeScript interfaces/types: PascalCase (BreadcrumbItem, NavItem, AuthLayoutProps)
- Type suffixes: Props (ComponentProps), Return (UseAppearanceReturn), Request, Response

## Where to Add New Code

**New Feature:**
- Primary code: `app/Http/Controllers/Features/YourFeatureController.php`
- Tests: `tests/Feature/YourFeatureName/YourFeatureTest.php`
- Requests: `app/Http/Requests/YourFeature/YourFeatureRequest.php`
- Models: `app/Models/YourModel.php` (if new entity)
- Frontend pages: `resources/js/pages/features/your-feature.tsx`
- Routes: `routes/your-features.php` (grouped file)

**New Component/Module:**
- Reusable UI component: `resources/js/components/YourComponent.tsx` (or `components/ui/` if primitive)
- Page layout: `resources/js/layouts/your-section/your-layout.tsx`
- Custom hook: `resources/js/hooks/use-your-feature.ts` or `.tsx` if exports component
- Types: `resources/js/types/your-domain.ts`, export from `resources/js/types/index.ts`

**Utilities:**
- Shared helpers: `resources/js/lib/helper-name.ts` (JavaScript/React utilities)
- Validation concerns: `app/Concerns/YourValidationRules.php` (PHP validation)
- Service classes: `app/Services/YourService.php` (complex business logic)

## Special Directories

**Generated Directories:**
- `resources/js/routes/` - Auto-generated by @laravel/vite-plugin-wayfinder from PHP routes
  - Generated: Yes (from routes/*.php)
  - Committed: No (in .gitignore)
  - Regenerated: On each Vite dev/build with `formVariants: true` config

- `resources/js/actions/` - Auto-generated controller type helpers by wayfinder
  - Generated: Yes (mirrors app/Http/Controllers/ structure)
  - Committed: No (in .gitignore)
  - Used for: Type-safe form helpers (e.g., ProfileController.update.form())

- `bootstrap/ssr/` - Server-side rendering manifest and bundle
  - Generated: Yes (on `npm run build:ssr`)
  - Committed: No
  - Used for: SSR builds in production

**Static/Public Directories:**
- `storage/app/public/` - User uploads accessible via web
- `storage/app/private/` - User uploads not web-accessible
- `public/` - Web-accessible static files (index.php, images)

**Cache/Runtime:**
- `storage/framework/cache/` - Application caches
- `bootstrap/cache/` - Laravel bootstrap caches
- `node_modules/` - Node.js packages (not committed)

---

*Structure analysis: 2026-03-28*
