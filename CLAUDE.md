<!-- GSD:project-start source:PROJECT.md -->
## Project

**Quart**

A professional bilingual (English/Arabic) business website for Quart, a company offering software development, automation, QA, and cybersecurity services. Built on the existing Laravel + Inertia.js + React stack, featuring a premium animated UI inspired by scotchpos.com, with a full-featured blog, portfolio gallery, service pages, and a custom admin panel for complete content and theme management.

**Core Value:** Visitors immediately understand what services are offered, see proof of quality through case studies and testimonials, and can easily get in touch — in a visually polished, professional experience that builds trust.

### Constraints

- **Tech stack**: Laravel 12 + Inertia.js 3 + React + Tailwind CSS — already established in the codebase
- **Bilingual**: All user-facing content must work in both English (LTR) and Arabic (RTL)
- **Animation library**: Must integrate cleanly with React + Inertia page transitions (Framer Motion or similar)
- **SEO**: Server-side rendering via Inertia for search engine visibility
- **Admin UX**: Non-technical users must be able to manage all content without touching code
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- PHP 8.3+ - Backend server logic, routing, database layer
- TypeScript 5.7.2 - Frontend application and React components
- React 19.2.0 - UI components and views
- CSS 4 (Tailwind CSS) - Styling and responsive design
- JavaScript - Asset compilation and build tooling
## Runtime
- PHP 8.3+ with Laravel 13.0
- Node.js (no version constraint file detected - use LTS)
- Composer for PHP dependencies
- NPM for JavaScript/Node dependencies (see `package.json` for package-lock.json presence)
## Frameworks
- Laravel 13.0 - Full-stack PHP framework for routing, ORM, authentication, and business logic
- React 19.2.0 - UI framework for frontend components and state management
- Inertia.js 3.0.0 - Adapter connecting React to Laravel server-side routing
- Vite 8.0.0 - Build tool and development server (`vite.config.ts`)
- Laravel Vite Plugin 3.0.0 - Integration between Laravel and Vite
- Inertia Vite Plugin 3.0.0 - SSR and asset handling for Inertia
- Radix UI (multiple components) - Headless UI primitives
- Headless UI 2.2.0 - Alternative headless UI components
- Lucide React 0.475.0 - SVG icon library
- Tailwind CSS 4.0.0 - Utility-first CSS framework
- Tailwind CSS Vite Plugin 4.1.11 - Vite integration for Tailwind
- Class Variance Authority 0.7.1 - CSS class composition utility
- Tailwind Merge 3.0.1 - Smart merging of Tailwind class lists
- tw-animate-css 1.4.0 - Animation utilities
- Prettier Plugin Tailwind CSS 0.6.11 - Automatic Tailwind class sorting
- PHPUnit 12.5.12 - PHP unit testing framework (`phpunit.xml` configured with Unit/Feature suites)
- Mockery 1.6 - PHP mocking library
- Faker 1.24 - Data generation for testing
- ESLint 9.17.0 - JavaScript/TypeScript linting
- Prettier 3.4.2 - Code formatting (4-space tabs for most files, 2-space for YAML)
- Pint 1.27 - PHP code formatter and linter
- Laravel Pail 1.2.5 - Log viewer
- PHP Artisan - Laravel CLI tool
- Babel Plugin React Compiler 1.0.0 - React compilation optimization
- Laravel Wayfinder 0.1.14 - Route-based component discovery
- TypeScript 5.7.2 - Type checking for JavaScript
- Concurrently 9.0.1 - Run multiple npm scripts in parallel
- Laravel Sail 1.53 - Docker-based development environment support
- Collision 8.9 - Exception handler for PHPUnit
- Vite 8.0.0 with Vitejs React Plugin 5.2.0
- Rollup binaries for Linux x64 and Windows x64 (cross-platform building)
- Tailwind CSS Oxide binaries for Linux x64 and Windows x64 (performance)
- Lightning CSS binaries for Linux x64 and Windows x64 (CSS processing)
## Key Dependencies
- `laravel/framework` 13.0 - Core Laravel application framework
- `laravel/fortify` 1.34 - Fortified authentication scaffolding (login, registration, 2FA)
- `inertiajs/inertia-laravel` 3.0 - Server-side Inertia adapter
- `@inertiajs/react` 3.0.0 - React adapter for Inertia
- React 19.2.0 - UI rendering library
- Tailwind CSS 4.0.0 - Styling system
- `laravel/tinker` 3.0 - Interactive REPL for artisan
- Laravel Pail 1.2.5 - Real-time log viewer
## Configuration Files
- `.env.example` - Template for environment variables
- `vite.config.ts` - Vite configuration with Laravel, Inertia, React, Tailwind, and Wayfinder plugins
- `eslint.config.js` - ESLint configuration with React and import plugins
- `.prettierrc` - Prettier formatting rules (4-space tabs, Tailwind plugin)
- `pint.json` - Pint (PHP linter) configuration
- `phpunit.xml` - PHPUnit test configuration (Unit/Feature suites, SQLite in-memory DB for testing)
- `components.json` - Component library configuration (likely for shadcn/ui-style components)
- `tsconfig.json` - TypeScript compiler options (strict mode enabled, React JSX)
- `.editorconfig` - Cross-editor configuration
- `.npmrc` - NPM settings
- `.prettierignore` - Files to ignore during formatting
## Database Drivers
- MySQL 5.7+/8.0+
- MariaDB 10.3+
- PostgreSQL
- SQL Server
- PDO abstraction layer
- Eloquent ORM
## Queue & Job Processing
## Session Management
## Caching
## Platform Requirements
- PHP 8.3+
- Composer (PHP package manager)
- Node.js LTS (recommended)
- NPM 8+
- SQLite 3 (for default development database)
- PHP 8.3+
- Composer installed
- Node.js (for asset building) or pre-built assets
- Database: MySQL 8.0+, PostgreSQL, or SQL Server
- Optional: Redis for caching/sessions/queue
- Optional: Mail service (Postmark, Resend, AWS SES, Mailgun)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- React components: PascalCase (e.g., `AppShell.tsx`, `DeleteUser.tsx`)
- Hooks: lowercase kebab-case with `use-` prefix (e.g., `use-clipboard.ts`, `use-appearance.tsx`)
- Utility/helper files: lowercase kebab-case (e.g., `input-error.tsx`)
- Type definition files: lowercase (e.g., `auth.ts`, `ui.ts`, `navigation.ts`)
- UI component library exports: PascalCase wrapping primitive names (e.g., `Sidebar`, `Dialog`, `Button`)
- React functional components: PascalCase (e.g., `AppLogo`, `AppShell`, `DeleteUser`)
- Custom hooks: starts with `use`, camelCase (e.g., `useAppearance()`, `useTwoFactorAuth()`)
- Utility functions: camelCase (e.g., `cn()`, `toUrl()`, `isDarkMode()`)
- Event handlers: camelCase starting with `on` or descriptive verb (e.g., `onError`, `handleSystemThemeChange()`)
- State variables: camelCase (e.g., `currentAppearance`, `copiedText`, `qrCodeSvg`)
- Constants: UPPER_SNAKE_CASE (e.g., `OTP_MAX_LENGTH = 6`)
- Props objects: camelCase properties (e.g., `breadcrumbs`, `variant`, `className`)
- Ref objects: camelCase with `Input` or element suffix (e.g., `passwordInput`)
- Type/interface names: PascalCase (e.g., `AppShellProps`, `UseAppearanceReturn`, `User`, `Auth`)
- Exported from barrel files with `type` keyword: `export type * from './auth'`
- React props: named as `Props` or descriptive (e.g., `type Props = { children: ReactNode }`)
- Generic type parameters: Single letter or descriptive (e.g., `T`, `CopiedValue`)
## Code Style
- Prettier 3.4.2 enforces formatting
- Print width: 80 characters
- Tab width: 4 spaces (2 for YAML files)
- Semicolons: Always included
- Single quotes: Enforced for strings
- JSX: Single attribute per line is disabled (multiple attributes on one line allowed)
- ESLint v9.17.0 with flat config
- TypeScript ESLint recommended rules
- React plugin with jsx-runtime (React 17+)
- React Hooks rules enabled
- Import ordering enforced
- Strict TypeScript checking
- `@typescript-eslint/consistent-type-imports`: Type imports separated (`import type`)
- `import/order`: Alphabetically ordered imports (builtin → external → internal → parent → sibling → index)
- `@stylistic/brace-style`: 1tbs (one true brace style), no single-line blocks
- `@stylistic/padding-line-between-statements`: Blank lines around control statements (if, return, for, while, etc.)
- React prop-types: Disabled (TypeScript handles validation)
- `@typescript-eslint/no-explicit-any`: Disabled (allows any type if necessary)
## Import Organization
- `@/*` maps to `./resources/js/*`
- Used consistently throughout (no relative imports like `../`)
- Supports TypeScript module resolution via `tsconfig.json` paths configuration
## Error Handling
- Try-catch blocks wrap async operations (e.g., `fetchQrCode()`, `fetchSetupKey()`)
- Errors collected in state arrays: `const [errors, setErrors] = useState<string[]>([])`
- Error messages are user-friendly strings appended to error state
- Catch blocks don't re-throw; they set state with descriptive messages
- Validation errors displayed via `InputError` component with `message` prop
- No error logging to console; handled silently with user feedback
## Logging
- `console.warn()` used for recoverable issues (e.g., clipboard API unavailable in `use-clipboard.ts`)
- No error-level logging in catch blocks
- Warnings provided with context: `console.warn('Clipboard not supported')`
- Client-side only; no backend logging configuration in frontend code
## Comments
- Credit/attribution for borrowed code (e.g., `// Credit: https://usehooks-ts.com/`)
- Inline comments for complex logic or non-obvious intent
- JSDoc rarely used; TypeScript types provide documentation
- Types and function signatures are self-documenting via TypeScript
- Props documentation implicit through type definitions
- Return types explicitly declared
## Function Design
- `cn()`: 2 lines (utility wrapper)
- `isDarkMode()`: 1 line (boolean check)
- Component functions: 15-40 lines typically; larger components break into smaller pieces
- React components: Single `Props` type parameter or destructured inline
- Utilities: Explicit typed parameters (e.g., `text: string`, `days = 365`)
- Callbacks: Full type annotations (e.g., `callback: () => void`)
- Components: JSX or null (conditional renders return null)
- Hooks: Typed objects returned with `as const` for tuple immutability (e.g., `useClipboard()` returns `[CopiedValue, CopyFn]`)
- Async functions: Always return `Promise<T>`; void for set-state operations
## Module Design
- Default exports for components (e.g., `export default function AppLogo()`)
- Named exports for utility functions (e.g., `export function useAppearance()`)
- Barrel files re-export all types (e.g., `resources/js/types/index.ts`)
- Functions exported with explicit return types
- `resources/js/types/index.ts`: Re-exports all types with `export type * from './module'`
- Enables centralized type imports: `import type { User } from '@/types'`
- Component file: Imports, type definitions, component logic, inline styles
- Hook file: Type definitions at top, helper functions, main hook export
- Type file: Type/interface definitions only
- Utility file: Utility functions, no state
## Testing Attributes
- Used sparingly: `data-test="update-profile-button"`
- Applied to critical user interaction elements
- Pattern: kebab-case, descriptive of action or element purpose
- Example locations: `resources/js/pages/settings/profile.tsx`, `resources/js/components/delete-user.tsx`
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Server-rendered pages via Laravel/Inertia reducing JavaScript complexity
- Type-safe routing via @laravel/vite-plugin-wayfinder (generates TypeScript route helpers)
- React 19 with Inertia adapter for progressive page updates
- Middleware-driven request processing with form validation on both sides
- Trait-based architecture (TwoFactorAuthenticatable, HasFactory, Notifiable)
- Component-based UI with Radix UI primitives and Tailwind CSS
- Layout composition system (AppLayout, AuthLayout, SettingsLayout)
## Layers
- Purpose: Handle incoming HTTP requests, validate input, apply middleware
- Location: `app/Http/Controllers/`, `app/Http/Requests/`, `app/Http/Middleware/`
- Contains: Controllers, FormRequest validation classes, middleware
- Depends on: Models, Services, Traits, Features (Laravel Fortify)
- Used by: Routing system, external HTTP clients
- Purpose: Represent database entities with validation rules and relationships
- Location: `app/Models/`
- Contains: Eloquent models with attributes, casts, and traits
- Depends on: Database, Traits (TwoFactorAuthenticatable, HasFactory, Notifiable)
- Used by: Controllers, Requests, Factories
- Purpose: Encapsulate business logic and complex operations
- Location: `app/Actions/`, `app/Concerns/`
- Contains: Reusable action classes, shared validation concerns
- Depends on: Models, Requests, Laravel Fortify Features
- Used by: Controllers, Middleware, other Actions
- Purpose: Cross-cutting concerns like authentication, appearance handling, Inertia setup
- Location: `app/Http/Middleware/`
- Contains: HandleInertiaRequests, HandleAppearance, authentication middleware
- Key: HandleInertiaRequests - shares auth user and sidebar state to frontend
- Purpose: Render pages and handle client-side interactivity
- Location: `resources/js/pages/`, `resources/js/components/`, `resources/js/layouts/`
- Contains: Page components, UI components, layout wrappers
- Depends on: Inertia.js, React hooks, route helpers (generated), UI library
- Used by: Inertia as page renderers
- Purpose: Define page layouts and structural composition
- Location: `resources/js/layouts/`
- Contains: AppLayout (sidebar+header), AuthLayout (centered card), SettingsLayout (nested)
- Pattern: Nested layouts for complex pages (settings uses both AppLayout and SettingsLayout)
- Used by: Page components via layout assignment
- Purpose: Reusable design system components
- Location: `resources/js/components/ui/` (Radix primitives), `resources/js/components/` (business components)
- Contains: Button, Input, Dialog, Card, SelectMenu (primitives); DeleteUser, TwoFactorSetup (business)
- Depends on: Radix UI, Tailwind CSS, lucide-react icons
- Pattern: Composable primitives + domain-specific wrappers
- Purpose: Client-side state management and reusable logic
- Location: `resources/js/hooks/`
- Contains: useAppearance (theme system), useTwoFactorAuth, useMobileNavigation, etc.
- Pattern: Custom React hooks with external store subscription (useSyncExternalStore for theme)
- Purpose: Type-safe route references and navigation
- Location: Auto-generated from `routes/*.php` via @laravel/vite-plugin-wayfinder
- Contains: Route helper functions (e.g., dashboard(), profile.edit(), login.store())
- Pattern: Generated TypeScript functions matching Laravel route definitions
- Used by: All frontend components for navigation
- Purpose: Shared type definitions between frontend and backend
- Location: `resources/js/types/`, global type augmentation
- Contains: Auth types (User), Navigation types (BreadcrumbItem, NavItem), UI types
- Pattern: Types exported from index.ts with re-exports from specific modules
## Data Flow
## Key Abstractions
- Purpose: Validate incoming HTTP request data with reusable rules
- Examples: `app/Http/Requests/Settings/ProfileUpdateRequest.php`, `PasswordUpdateRequest.php`
- Pattern: Extend FormRequest, define rules(), authorize() - automatically validates before controller receives data
- Purpose: Share validation rule definitions across multiple form contexts
- Examples: `app/Concerns/ProfileValidationRules.php`, `PasswordValidationRules.php`
- Pattern: Trait-based - imported by FormRequest classes to DRY validation rules
- Purpose: Centralize shared data available to all page renders
- Location: `app/Http/Middleware/HandleInertiaRequests.php`
- Methods: share() - returns array of data passed to every render
- Example: auth.user, app.name, sidebarOpen cookie state
- Purpose: Compose nested layouts without duplicating structural markup
- Example: `resources/js/pages/settings/profile.tsx` uses Profile.layout property to specify breadcrumbs
- Pattern: Page components can assign layout descriptors; app.tsx determines which layouts to wrap based on route name
- Purpose: Type-safe navigation without hardcoding URLs
- Example: dashboard(), edit() from @/routes/profile
- Generated from: `routes/web.php`, `routes/settings.php` via wayfinder plugin
- Used by: All navigation, form actions, Link components
## Entry Points
- Location: `routes/web.php` (main routing), `routes/settings.php` (settings routes)
- Triggers: HTTP requests from client
- Responsibilities: Route definition, middleware assignment, controller dispatch
- Location: `resources/js/app.tsx`
- Triggers: Initial page load (server sends React bundle)
- Responsibilities:
- Location: `resources/css/app.css`
- Imports: Tailwind CSS, tw-animate-css, custom theme variables
- Scoped to: Tailwind @source directives for Blade files and pagination views
- Location: `vite.config.ts`
- Plugins: Laravel Vite Plugin, Inertia plugin, React compiler, Tailwind CSS v4, Wayfinder
- Outputs: JavaScript bundle (`resources/js/app.tsx`), CSS bundle (`resources/css/app.css`)
## Error Handling
- FormRequest validation failures return 422 with errors array in response props
- React Form component receives errors, displays inline via InputError component
- Unhandled exceptions in production return generic error response via Blade error pages
- Client-side axios/fetch errors caught by Inertia adapter for redirect/reload
## Cross-Cutting Concerns
- Server-side: FormRequest classes with rule definitions, validation concerns for sharing
- Client-side: Inertia Form wrapper handles error display, processing state
- Laravel Guard (configurable) with session driver
- Fortify package provides routes (login, register, password reset, two-factor)
- TwoFactorAuthenticatable trait on User model
- Middleware: auth (requires authentication), verified (requires email verification), password.confirm (requires password confirmation for sensitive actions)
- Method-level control via controller constructor or middleware
- Form-level control via FormRequest authorize() method
- Fortify Features class gates available features (registration, two-factor, recovery codes)
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
