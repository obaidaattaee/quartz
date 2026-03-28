# Technology Stack

**Analysis Date:** 2026-03-28

## Languages

**Primary:**
- PHP 8.3+ - Backend server logic, routing, database layer
- TypeScript 5.7.2 - Frontend application and React components
- React 19.2.0 - UI components and views

**Secondary:**
- CSS 4 (Tailwind CSS) - Styling and responsive design
- JavaScript - Asset compilation and build tooling

## Runtime

**Environment:**
- PHP 8.3+ with Laravel 13.0
- Node.js (no version constraint file detected - use LTS)

**Package Managers:**
- Composer for PHP dependencies
- NPM for JavaScript/Node dependencies (see `package.json` for package-lock.json presence)

## Frameworks

**Core:**
- Laravel 13.0 - Full-stack PHP framework for routing, ORM, authentication, and business logic
- React 19.2.0 - UI framework for frontend components and state management
- Inertia.js 3.0.0 - Adapter connecting React to Laravel server-side routing

**Frontend Building:**
- Vite 8.0.0 - Build tool and development server (`vite.config.ts`)
- Laravel Vite Plugin 3.0.0 - Integration between Laravel and Vite
- Inertia Vite Plugin 3.0.0 - SSR and asset handling for Inertia

**UI Component Libraries:**
- Radix UI (multiple components) - Headless UI primitives
  - `@radix-ui/react-avatar` 1.1.3
  - `@radix-ui/react-checkbox` 1.1.4
  - `@radix-ui/react-collapsible` 1.1.3
  - `@radix-ui/react-dialog` 1.1.6
  - `@radix-ui/react-dropdown-menu` 2.1.6
  - `@radix-ui/react-label` 2.1.2
  - `@radix-ui/react-navigation-menu` 1.2.5
  - `@radix-ui/react-select` 2.1.6
  - `@radix-ui/react-separator` 1.1.2
  - `@radix-ui/react-slot` 1.2.3
  - `@radix-ui/react-toggle` 1.1.2
  - `@radix-ui/react-toggle-group` 1.1.2
  - `@radix-ui/react-tooltip` 1.1.8
- Headless UI 2.2.0 - Alternative headless UI components
- Lucide React 0.475.0 - SVG icon library

**Styling:**
- Tailwind CSS 4.0.0 - Utility-first CSS framework
- Tailwind CSS Vite Plugin 4.1.11 - Vite integration for Tailwind
- Class Variance Authority 0.7.1 - CSS class composition utility
- Tailwind Merge 3.0.1 - Smart merging of Tailwind class lists
- tw-animate-css 1.4.0 - Animation utilities
- Prettier Plugin Tailwind CSS 0.6.11 - Automatic Tailwind class sorting

**Testing:**
- PHPUnit 12.5.12 - PHP unit testing framework (`phpunit.xml` configured with Unit/Feature suites)
- Mockery 1.6 - PHP mocking library
- Faker 1.24 - Data generation for testing

**Code Quality:**
- ESLint 9.17.0 - JavaScript/TypeScript linting
- Prettier 3.4.2 - Code formatting (4-space tabs for most files, 2-space for YAML)
- Pint 1.27 - PHP code formatter and linter
- Laravel Pail 1.2.5 - Log viewer
- PHP Artisan - Laravel CLI tool

**Compilers & Transformers:**
- Babel Plugin React Compiler 1.0.0 - React compilation optimization
- Laravel Wayfinder 0.1.14 - Route-based component discovery
- TypeScript 5.7.2 - Type checking for JavaScript

**Development:**
- Concurrently 9.0.1 - Run multiple npm scripts in parallel
- Laravel Sail 1.53 - Docker-based development environment support
- Collision 8.9 - Exception handler for PHPUnit
- Vite 8.0.0 with Vitejs React Plugin 5.2.0

**Optional Dependencies (Platform-Specific):**
- Rollup binaries for Linux x64 and Windows x64 (cross-platform building)
- Tailwind CSS Oxide binaries for Linux x64 and Windows x64 (performance)
- Lightning CSS binaries for Linux x64 and Windows x64 (CSS processing)

## Key Dependencies

**Critical:**
- `laravel/framework` 13.0 - Core Laravel application framework
- `laravel/fortify` 1.34 - Fortified authentication scaffolding (login, registration, 2FA)
- `inertiajs/inertia-laravel` 3.0 - Server-side Inertia adapter
- `@inertiajs/react` 3.0.0 - React adapter for Inertia
- React 19.2.0 - UI rendering library
- Tailwind CSS 4.0.0 - Styling system

**Infrastructure:**
- `laravel/tinker` 3.0 - Interactive REPL for artisan
- Laravel Pail 1.2.5 - Real-time log viewer

## Configuration Files

**Environment:**
- `.env.example` - Template for environment variables
  - Database: SQLite by default, configurable to MySQL, MariaDB, PostgreSQL, SQL Server
  - Mail: Log driver by default (configurable to Postmark, Resend, SES, Mailgun)
  - Cache: Database-backed (configurable to Redis or Memcached)
  - Queue: Database-driven (configurable to Redis or Beanstalk)
  - Session: Database driver
  - Authentication: Web guard
  - 2FA: Enabled via Laravel Fortify

**Build & Dev:**
- `vite.config.ts` - Vite configuration with Laravel, Inertia, React, Tailwind, and Wayfinder plugins
- `eslint.config.js` - ESLint configuration with React and import plugins
- `.prettierrc` - Prettier formatting rules (4-space tabs, Tailwind plugin)
- `pint.json` - Pint (PHP linter) configuration
- `phpunit.xml` - PHPUnit test configuration (Unit/Feature suites, SQLite in-memory DB for testing)
- `components.json` - Component library configuration (likely for shadcn/ui-style components)

**TypeScript:**
- `tsconfig.json` - TypeScript compiler options (strict mode enabled, React JSX)

**Editor:**
- `.editorconfig` - Cross-editor configuration
- `.npmrc` - NPM settings
- `.prettierignore` - Files to ignore during formatting

## Database Drivers

**Default:** SQLite (file-based at `database/database.sqlite`)

**Supported:**
- MySQL 5.7+/8.0+
- MariaDB 10.3+
- PostgreSQL
- SQL Server

**Connection via:**
- PDO abstraction layer
- Eloquent ORM

## Queue & Job Processing

**Driver:** Database-backed (configurable)
**Alternative Drivers:** Redis, Beanstalk, SQS

## Session Management

**Driver:** Database-backed
**Alternatives:** File, Redis, Memcached, Cookie

## Caching

**Default:** Database-backed
**Alternatives:** Redis, Memcached, File, Array (in-memory)
**Redis Support:** PhpRedis client configured

## Platform Requirements

**Development:**
- PHP 8.3+
- Composer (PHP package manager)
- Node.js LTS (recommended)
- NPM 8+
- SQLite 3 (for default development database)

**Production:**
- PHP 8.3+
- Composer installed
- Node.js (for asset building) or pre-built assets
- Database: MySQL 8.0+, PostgreSQL, or SQL Server
- Optional: Redis for caching/sessions/queue
- Optional: Mail service (Postmark, Resend, AWS SES, Mailgun)

---

*Stack analysis: 2026-03-28*
