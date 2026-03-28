# Architecture Patterns

**Domain:** Bilingual CMS-driven services website (Laravel + Inertia.js 3 + React)
**Researched:** 2026-03-28
**Confidence:** HIGH (verified against existing codebase, Inertia v3 docs, Tailwind v4 docs, Motion docs)

## Recommended Architecture

A single monolithic Laravel application with three logical zones -- public-facing pages, admin panel, and shared infrastructure -- all served through the same Inertia.js 3 stack. No separate SPA, no separate API. The existing codebase pattern (controllers render Inertia pages, React components consume props) extends naturally into every new concern.

```
                     +---------------------------+
                     |     app.blade.php          |
                     |  (root template, dir attr) |
                     +---------------------------+
                                 |
                     +-----------+-----------+
                     |                       |
              +------+------+         +------+------+
              |  Public App |         |  Admin App  |
              | (marketing) |         |  (CMS)      |
              +------+------+         +------+------+
                     |                       |
         +-----------+-----------+   +-------+-------+
         |           |           |   |       |       |
     PublicLayout AdminLayout  AuthLayout  ...layouts
         |           |           |
    +----+----+ +----+----+ +---+---+
    | Pages   | | Pages   | | Pages |
    | /en/*   | | /admin/*| | /auth |
    | /ar/*   | |         | |       |
    +---------+ +---------+ +-------+
                     |
         +-----------+-----------+
         |                       |
    SharedComponents         UIComponents
    (business logic)         (Radix primitives)
```

### Component Boundaries

| Component | Responsibility | Communicates With | Data Direction |
|-----------|---------------|-------------------|----------------|
| **SetLocale Middleware** | Extract locale from URL prefix, set app locale, share to Inertia | Route groups, HandleInertiaRequests | Request -> App |
| **HandleInertiaRequests** | Share locale, direction, translations, auth, theme settings to all pages | All page renders | Server -> Client (shared props) |
| **Route Groups** | Separate public `/{locale}/...`, admin `/admin/...`, auth `/auth/...` routes | Controllers, Middleware | URL -> Controller |
| **Content Controllers** | Fetch translatable content from DB, pass to Inertia pages | Models (via Eloquent), Inertia::render | DB -> Props |
| **Admin Controllers** | CRUD operations for all content models, media, settings | Models, Media Library, Settings | Form -> DB |
| **Translatable Models** | Store bilingual content (JSON columns via spatie/laravel-translatable) | Controllers, Database | Bidirectional |
| **Settings Models** | Store site-wide config (colors, contact info, logos) via spatie/laravel-settings | Admin controllers, shared props | DB -> CSS vars / Props |
| **Media Library** | Associate files with models, generate conversions (thumbnails, webp) | Models, Storage filesystem | Upload -> Storage -> URL |
| **PublicLayout** | Marketing pages wrapper: navigation, footer, locale switcher, page transitions | Page components, AnimationProvider | Children -> Layout |
| **AdminLayout** | Admin dashboard wrapper: sidebar nav, breadcrumbs (extends existing AppLayout) | Admin page components | Children -> Layout |
| **AnimationProvider** | Wraps Inertia page renders with AnimatePresence for transitions + scroll reveal context | PublicLayout, page components | Page key -> Animations |
| **ThemeProvider** | Extends existing useAppearance with admin-customizable CSS custom properties | Settings, CSS variables | Settings -> CSS vars |
| **i18n Context** | React context providing `t()` function, current locale, direction | All components | Shared props -> Context |

### Data Flow

#### 1. Public Page Request (Bilingual)

```
User visits /ar/services/cybersecurity
    |
    v
Route::prefix('{locale}')
    ->middleware(['set-locale'])
    ->group(...)
    |
    v
SetLocale Middleware:
    - Validates locale (en|ar)
    - Sets App::setLocale($locale)
    - Sets URL::defaults(['locale' => $locale])
    |
    v
ServiceController::show('cybersecurity')
    - $service = Service::findBySlug('cybersecurity')
    - Returns Inertia::render('public/services/show', [
        'service' => $service,    // auto-translates via HasTranslations
        'otherServices' => ...,
    ])
    |
    v
HandleInertiaRequests::share()
    - locale: app()->getLocale()        // 'ar'
    - direction: 'rtl'                   // derived from locale
    - translations: loadJsonTranslations()  // UI strings
    - settings: SiteSettings cached       // colors, contact, logos
    - auth: $request->user()
    |
    v
React receives props:
    - Page component renders inside PublicLayout
    - <html lang="ar" dir="rtl">
    - CSS logical properties handle layout mirroring
    - Motion AnimatePresence animates page entry
    - Content already in Arabic (Eloquent auto-translates)
```

#### 2. Admin Content Update

```
Admin edits service page at /admin/services/3/edit
    |
    v
AdminServiceController::edit(Service $service)
    - Returns ALL translations: $service->getTranslations()
    - Returns Inertia::render('admin/services/edit', [
        'service' => [
            'id' => $service->id,
            'title' => $service->getTranslations('title'),
                // { en: "Cybersecurity", ar: "..." }
            'body' => $service->getTranslations('body'),
            'media' => $service->getMedia('hero'),
        ]
    ])
    |
    v
React admin form:
    - TabGroup for en/ar content editing
    - Rich text editor per language tab
    - Media upload component (drag & drop)
    - Form.submit('PUT', route('admin.services.update', service.id))
    |
    v
AdminServiceController::update(ServiceRequest $request, Service $service)
    - $service->setTranslations('title', $request->title)
    - $service->setTranslations('body', $request->body)
    - Handle media uploads via spatie/laravel-medialibrary
    - Redirect back with success flash
```

#### 3. Theme / Settings Flow

```
Admin updates theme at /admin/settings/theme
    |
    v
ThemeSettingsController::update(ThemeRequest $request)
    - SiteSettings::update([
        'primary_color' => $request->primary_color,
        'logo_url' => $request->logo,
        'contact_email' => ...,
    ])
    - Cache::forget('site-settings')
    |
    v
HandleInertiaRequests::share() (on next any request):
    - settings: SiteSettings::cached()
    |
    v
React ThemeProvider:
    - Receives settings.primary_color via usePage().props
    - Injects CSS custom properties into :root
    - document.documentElement.style.setProperty('--primary', value)
    - All Tailwind `bg-primary`, `text-primary` automatically update
    - Combined with existing dark/light toggle (useAppearance unchanged)
```

## Core Architecture Decisions

### 1. Locale Routing: URL Prefix with Middleware

**Pattern:** `/{locale}/...` where locale is `en` or `ar`

**Why:** SEO requires distinct URLs per language. URL-prefix is the standard pattern for bilingual sites -- search engines index `/en/services` and `/ar/services` as separate pages with `hreflang` tags linking them.

**Implementation:**

```php
// routes/web.php
Route::prefix('{locale}')
    ->where(['locale' => 'en|ar'])
    ->middleware(['set-locale'])
    ->group(function () {
        Route::inertia('/', 'public/home')->name('home');
        Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
        Route::get('/services/{slug}', [ServiceController::class, 'show'])->name('services.show');
        Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
        Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');
        Route::get('/portfolio', [PortfolioController::class, 'index'])->name('portfolio.index');
        Route::get('/contact', [ContactController::class, 'show'])->name('contact.show');
        Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
    });

// Root redirect
Route::get('/', function () {
    return redirect()->route('home', ['locale' => 'en']);
});
```

**Middleware:**

```php
// app/Http/Middleware/SetLocale.php
class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->route('locale', 'en');

        if (!in_array($locale, ['en', 'ar'])) {
            abort(404);
        }

        App::setLocale($locale);
        URL::defaults(['locale' => $locale]);

        return $next($request);
    }
}
```

**Shared props addition:**

```php
// HandleInertiaRequests::share()
'locale' => app()->getLocale(),
'direction' => app()->getLocale() === 'ar' ? 'rtl' : 'ltr',
'translations' => fn () => $this->loadTranslations(),
'alternateUrls' => fn () => $this->getAlternateUrls($request),
```

**Confidence:** HIGH -- standard Laravel localization pattern, verified with mcamara/laravel-localization patterns and Inertia shared data docs.

### 2. Admin Panel: Separate Route Group, Shared Stack

**Pattern:** Admin lives at `/admin/...` with its own route file, middleware group, and layout -- but uses the same Inertia.js + React stack.

**Why not a separate SPA or Filament?**
- Filament uses Livewire (different paradigm, doubles the frontend stack)
- A separate SPA requires an API layer (unnecessary complexity for this scale)
- Sharing the Inertia stack means shared components, types, and build pipeline

**Route structure:**

```php
// routes/admin.php
Route::prefix('admin')
    ->middleware(['auth', 'verified', 'role:admin,editor'])
    ->group(function () {
        Route::inertia('/', 'admin/dashboard')->name('admin.dashboard');

        // Content management
        Route::resource('services', AdminServiceController::class)->names('admin.services');
        Route::resource('posts', AdminPostController::class)->names('admin.posts');
        Route::resource('portfolio', AdminPortfolioController::class)->names('admin.portfolio');

        // Settings (admin-only)
        Route::middleware('role:admin')->group(function () {
            Route::get('settings/theme', [ThemeSettingsController::class, 'edit'])->name('admin.settings.theme');
            Route::put('settings/theme', [ThemeSettingsController::class, 'update']);
            Route::get('settings/contact', [ContactSettingsController::class, 'edit'])->name('admin.settings.contact');
            Route::put('settings/contact', [ContactSettingsController::class, 'update']);
        });

        // Leads
        Route::get('leads', [LeadController::class, 'index'])->name('admin.leads.index');
        Route::get('leads/{lead}', [LeadController::class, 'show'])->name('admin.leads.show');
    });
```

**Layout routing in app.tsx:**

```tsx
createInertiaApp({
    layout: (name) => {
        switch (true) {
            case name.startsWith('public/'):
                return PublicLayout;
            case name.startsWith('admin/'):
                return [AdminLayout];  // extends existing AppLayout pattern
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return null;
        }
    },
    // ...
});
```

**Confidence:** HIGH -- this directly extends the existing codebase pattern (see current app.tsx layout routing).

### 3. RTL Architecture: Direction-Aware at Every Layer

**Pattern:** Three-layer RTL support: HTML `dir` attribute, Tailwind logical properties, component-level awareness.

**Layer 1 -- HTML root (Blade template):**

```html
<html lang="{{ app()->getLocale() }}" dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}">
```

This single attribute causes CSS `direction` to propagate to all elements. Flexbox and grid automatically reverse. CSS logical properties (`start`/`end`) adapt.

**Layer 2 -- Tailwind logical properties (already built-in to v4):**

Replace physical direction utilities with logical ones throughout all components:

| Physical (avoid) | Logical (use) | Behavior |
|-------------------|---------------|----------|
| `ml-4` | `ms-4` | margin-inline-start |
| `mr-4` | `me-4` | margin-inline-end |
| `pl-4` | `ps-4` | padding-inline-start |
| `pr-4` | `pe-4` | padding-inline-end |
| `left-0` | `start-0` | inset-inline-start |
| `right-0` | `end-0` | inset-inline-end |
| `text-left` | `text-start` | text-align: start |
| `text-right` | `text-end` | text-align: end |
| `rounded-l-lg` | `rounded-s-lg` | border-start-radius |
| `border-r` | `border-e` | border-inline-end |

**Layer 3 -- Component-level direction awareness:**

Some elements need explicit direction handling (icons that should flip, animations that should reverse direction):

```tsx
// hooks/use-direction.ts
export function useDirection() {
    const { direction, locale } = usePage<SharedProps>().props;
    const isRTL = direction === 'rtl';
    return { direction, locale, isRTL };
}
```

```tsx
// For icons that should flip in RTL (arrows, chevrons)
<ChevronRight className={cn('h-4 w-4', isRTL && 'rotate-180')} />

// For animations that should reverse direction
const slideVariants = {
    enter: { x: isRTL ? -100 : 100, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: isRTL ? 100 : -100, opacity: 0 },
};
```

**Arabic typography:** Load an Arabic-supporting font family alongside the existing Instrument Sans. Use CSS `font-family` override scoped to `[dir="rtl"]`:

```css
/* app.css addition */
@font-face {
    font-family: 'IBM Plex Sans Arabic';
    /* ... font files ... */
}

[dir="rtl"] {
    font-family: 'IBM Plex Sans Arabic', 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
}
```

**Confidence:** HIGH -- Tailwind v4 logical properties are documented, CSS `dir` attribute is a web standard, this approach verified across multiple sources.

### 4. Content Data Model: Spatie Translatable + JSON Columns

**Pattern:** Use `spatie/laravel-translatable` trait on all content models. Translatable fields store JSON: `{"en": "...", "ar": "..."}`.

**Why not separate translation tables?**
- Fewer queries (no joins needed)
- Simpler model code (just add trait + `$translatable` array)
- Eloquent automatically returns the value for the current app locale
- Admin can access all translations via `getTranslations()`

**Core models:**

```
Service
  - id, slug
  - title (json translatable)
  - description (json translatable)
  - body (json translatable, rich text)
  - icon
  - sort_order
  - is_published
  - timestamps

Post (Blog)
  - id, slug
  - title (json translatable)
  - excerpt (json translatable)
  - body (json translatable, rich text)
  - author_id (FK -> users)
  - category_id (FK -> categories)
  - is_published, published_at
  - meta_title (json translatable)
  - meta_description (json translatable)
  - timestamps

Category
  - id, slug
  - name (json translatable)
  - timestamps

Tag
  - id, slug
  - name (json translatable)

PortfolioItem
  - id, slug
  - title (json translatable)
  - description (json translatable)
  - client_name
  - service_id (FK -> services, for filtering)
  - url (external link)
  - is_featured
  - sort_order
  - timestamps

Testimonial
  - id
  - author_name (json translatable)
  - author_title (json translatable)
  - content (json translatable)
  - author_image
  - sort_order
  - is_published
  - timestamps

Lead (Contact submissions)
  - id
  - name, email, phone
  - message
  - source (form, whatsapp referral, etc.)
  - status (new, contacted, closed)
  - timestamps
```

**Media:** All models with images use `spatie/laravel-medialibrary` via the `HasMedia` interface and `InteractsWithMedia` trait. Media collections defined per model:

```php
class Service extends Model implements HasMedia
{
    use HasTranslations, InteractsWithMedia;

    public array $translatable = ['title', 'description', 'body'];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('hero')->singleFile();
        $this->addMediaCollection('gallery');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(400)->height(300)
            ->format('webp');
        $this->addMediaConversion('og')
            ->width(1200)->height(630)
            ->format('jpg');
    }
}
```

**Confidence:** HIGH -- spatie/laravel-translatable v6 is the standard Laravel approach, verified with official docs. spatie/laravel-medialibrary v11 is the standard for file associations.

### 5. Site Settings: Typed Settings Classes

**Pattern:** Use `spatie/laravel-settings` for site-wide configuration that admins can edit.

```php
// app/Settings/SiteSettings.php
class SiteSettings extends Settings
{
    public string $site_name;
    public string $logo_url;
    public string $favicon_url;
    public string $primary_color;    // oklch value
    public string $secondary_color;  // oklch value
    public string $accent_color;     // oklch value

    public static function group(): string
    {
        return 'site';
    }
}

// app/Settings/ContactSettings.php
class ContactSettings extends Settings
{
    public string $email;
    public string $phone;
    public string $whatsapp;
    public string $address_en;
    public string $address_ar;
    public array $social_links;  // [{platform, url}]

    public static function group(): string
    {
        return 'contact';
    }
}

// app/Settings/SeoSettings.php
class SeoSettings extends Settings
{
    public string $default_meta_title_en;
    public string $default_meta_title_ar;
    public string $default_meta_description_en;
    public string $default_meta_description_ar;
    public string $og_image_url;
    public string $google_analytics_id;

    public static function group(): string
    {
        return 'seo';
    }
}
```

**Shared to frontend via HandleInertiaRequests:**

```php
'settings' => fn () => Cache::remember('site-settings', 3600, fn () => [
    'site' => app(SiteSettings::class),
    'contact' => app(ContactSettings::class),
]),
```

**Confidence:** HIGH -- spatie/laravel-settings is the standard typed settings package for Laravel.

### 6. Animation System: Motion + Inertia Page Lifecycle

**Pattern:** Three animation layers: page transitions (AnimatePresence on Inertia navigation), scroll reveals (useInView / whileInView), and micro-interactions (hover/tap variants).

**Page Transitions Architecture:**

Inertia.js does not use a client-side router, so we cannot use React Router's outlet pattern. Instead, we wrap the page content inside the layout with `AnimatePresence`, keyed by the current Inertia page URL.

```tsx
// layouts/public-layout.tsx
import { AnimatePresence, motion } from 'motion/react';
import { usePage } from '@inertiajs/react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();

    return (
        <div className="min-h-screen">
            <PublicNavbar />
            <AnimatePresence mode="wait">
                <motion.main
                    key={url}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    {children}
                </motion.main>
            </AnimatePresence>
            <PublicFooter />
        </div>
    );
}
```

**Why `mode="wait"`:** Ensures the exiting page animates out completely before the new page animates in. Prevents layout thrashing from two pages being in the DOM simultaneously.

**Scroll Reveal Architecture:**

Create a reusable `<Reveal>` wrapper component that animates children into view:

```tsx
// components/animations/reveal.tsx
import { motion, type Variants } from 'motion/react';

const revealVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
};

export function Reveal({
    children,
    delay = 0,
    className,
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
```

**Stagger children pattern (for grids, lists):**

```tsx
// components/animations/stagger-container.tsx
export function StaggerContainer({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
        >
            {children}
        </motion.div>
    );
}
```

**Hero animation:** Complex hero section animations (like scotchpos.com's style) use `motion.div` with staggered children, combined with `useScroll` and `useTransform` for parallax depth effects.

**RTL-aware animations:** Animation `x` values must invert in RTL mode. Use the `useDirection` hook to derive correct slide directions.

**Confidence:** HIGH -- Motion (formerly Framer Motion) AnimatePresence API verified with official docs. Inertia page key pattern verified with community solutions.

### 7. Layout System: Three Layout Zones

The existing codebase has three layout zones (app, auth, settings). We extend to five:

| Layout | URL Pattern | Purpose | Navigation |
|--------|-------------|---------|------------|
| **PublicLayout** | `/{locale}/*` | Marketing pages | Top navbar + footer, locale switcher |
| **AdminLayout** | `/admin/*` | CMS dashboard | Sidebar (extends existing AppLayout) |
| **AuthLayout** | `/auth/*` | Login/register | Centered card (existing) |
| **SettingsLayout** | `/settings/*` | User settings | Sidebar nested in AppLayout (existing) |
| **null** | `/` | Root redirect | None |

**Layout routing in app.tsx (updated):**

```tsx
createInertiaApp({
    layout: (name) => {
        switch (true) {
            case name.startsWith('public/'):
                return PublicLayout;
            case name.startsWith('admin/'):
                return AdminLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return null;
        }
    },
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                <I18nProvider>
                    {app}
                </I18nProvider>
            </TooltipProvider>
        );
    },
    // ...
});
```

**Confidence:** HIGH -- directly extends the existing pattern in the codebase's app.tsx.

### 8. i18n Translation Architecture

**Two translation systems for different purposes:**

| System | What It Translates | Storage | Access Method |
|--------|-------------------|---------|---------------|
| **Laravel lang files** | UI strings (buttons, labels, nav items, form errors) | `lang/en.json`, `lang/ar.json` | `t('key')` via shared props |
| **spatie/laravel-translatable** | Content (blog posts, service descriptions, testimonials) | JSON columns in DB | Automatic via Eloquent |

**UI translation flow:**

```
lang/en.json: { "nav.services": "Services", "nav.blog": "Blog", ... }
lang/ar.json: { "nav.services": "...", "nav.blog": "...", ... }
    |
    v
HandleInertiaRequests shares translations for current locale
    |
    v
React I18nProvider wraps app, provides t() function
    |
    v
Components: <Link href={...}>{t('nav.services')}</Link>
```

**React i18n hook:**

```tsx
// hooks/use-translations.ts
import { usePage } from '@inertiajs/react';

export function useTranslations() {
    const { translations, locale, direction } = usePage<SharedProps>().props;

    function t(key: string, replacements?: Record<string, string>): string {
        let value = translations[key] ?? key;
        if (replacements) {
            Object.entries(replacements).forEach(([k, v]) => {
                value = value.replace(`:${k}`, v);
            });
        }
        return value;
    }

    return { t, locale, direction, isRTL: direction === 'rtl' };
}
```

**Why not laravel-react-i18n package?** It adds a build-time Vite plugin and provider component. For a two-language site, passing translations via Inertia shared props is simpler, gives server control over which strings are loaded, and avoids an extra dependency. The custom hook above is ~20 lines of code.

**Confidence:** MEDIUM -- the custom approach is simpler for two languages but has not been battle-tested at scale. If the translation file grows beyond ~500 keys, consider lazy-loading per-page translation subsets.

## Component Hierarchy

### Public Pages

```
PublicLayout
  +-- PublicNavbar
  |     +-- Logo
  |     +-- NavLinks (translated)
  |     +-- LocaleSwitcher (en/ar toggle)
  |     +-- ThemeToggle (dark/light)
  |     +-- MobileMenu
  |
  +-- AnimatePresence (page transitions)
  |     +-- motion.main (keyed by URL)
  |           +-- [Page Component]
  |                 +-- HeroSection (service-specific hero)
  |                 +-- Reveal (scroll reveal wrapper)
  |                 +-- StaggerContainer (grid animations)
  |                 +-- Section components
  |
  +-- PublicFooter
        +-- ContactInfo (from settings)
        +-- SocialLinks (from settings)
        +-- FooterNav
```

### Admin Pages

```
AdminLayout (extends existing AppLayout sidebar pattern)
  +-- AdminSidebar
  |     +-- NavMain (Dashboard, Services, Blog, Portfolio, Leads, Settings)
  |     +-- NavUser (current admin)
  |
  +-- AdminHeader (breadcrumbs)
  +-- [Admin Page Component]
        +-- Heading
        +-- DataTable or Form
              +-- TranslationTabs (en/ar tab switching for content)
              +-- RichTextEditor
              +-- MediaUploader
```

### Shared Components (used by both zones)

```
components/
  +-- animations/
  |     +-- reveal.tsx           (scroll reveal wrapper)
  |     +-- stagger-container.tsx (staggered child animations)
  |     +-- page-transition.tsx   (AnimatePresence wrapper)
  |
  +-- content/
  |     +-- rich-text-renderer.tsx (render stored rich text safely)
  |     +-- media-image.tsx        (responsive image with conversions)
  |     +-- seo-head.tsx           (meta tags via Inertia Head)
  |
  +-- forms/
  |     +-- translation-tabs.tsx   (en/ar content editing tabs)
  |     +-- media-uploader.tsx     (drag-drop file upload)
  |     +-- rich-text-editor.tsx   (WYSIWYG editor)
  |
  +-- ui/                          (existing Radix primitives)
```

## File Structure (New Additions)

```
app/
  +-- Http/
  |     +-- Controllers/
  |     |     +-- Public/            # Public page controllers
  |     |     |     +-- HomeController.php
  |     |     |     +-- ServiceController.php
  |     |     |     +-- BlogController.php
  |     |     |     +-- PortfolioController.php
  |     |     |     +-- ContactController.php
  |     |     |
  |     |     +-- Admin/             # Admin CMS controllers
  |     |     |     +-- DashboardController.php
  |     |     |     +-- AdminServiceController.php
  |     |     |     +-- AdminPostController.php
  |     |     |     +-- AdminPortfolioController.php
  |     |     |     +-- LeadController.php
  |     |     |     +-- ThemeSettingsController.php
  |     |     |     +-- ContactSettingsController.php
  |     |     |
  |     |     +-- Settings/          # (existing)
  |     |
  |     +-- Middleware/
  |     |     +-- SetLocale.php       # NEW: locale from URL prefix
  |     |     +-- HandleInertiaRequests.php  # MODIFIED: add locale, translations, settings
  |     |     +-- EnsureRole.php      # NEW: role-based access
  |     |
  |     +-- Requests/
  |           +-- Admin/              # Admin form validation
  |
  +-- Models/
  |     +-- Service.php
  |     +-- Post.php
  |     +-- Category.php
  |     +-- Tag.php
  |     +-- PortfolioItem.php
  |     +-- Testimonial.php
  |     +-- Lead.php
  |
  +-- Settings/
  |     +-- SiteSettings.php
  |     +-- ContactSettings.php
  |     +-- SeoSettings.php
  |
  +-- Enums/
        +-- UserRole.php              # admin, editor

resources/js/
  +-- pages/
  |     +-- public/                   # Public marketing pages
  |     |     +-- home.tsx
  |     |     +-- services/
  |     |     |     +-- index.tsx
  |     |     |     +-- show.tsx
  |     |     +-- blog/
  |     |     |     +-- index.tsx
  |     |     |     +-- show.tsx
  |     |     +-- portfolio/
  |     |     |     +-- index.tsx
  |     |     +-- contact.tsx
  |     |
  |     +-- admin/                    # Admin CMS pages
  |     |     +-- dashboard.tsx
  |     |     +-- services/
  |     |     |     +-- index.tsx
  |     |     |     +-- create.tsx
  |     |     |     +-- edit.tsx
  |     |     +-- posts/
  |     |     |     +-- index.tsx
  |     |     |     +-- create.tsx
  |     |     |     +-- edit.tsx
  |     |     +-- portfolio/
  |     |     +-- leads/
  |     |     +-- settings/
  |     |           +-- theme.tsx
  |     |           +-- contact.tsx
  |     |
  |     +-- auth/                     # (existing)
  |     +-- settings/                 # (existing)
  |
  +-- layouts/
  |     +-- public-layout.tsx         # NEW: marketing layout with transitions
  |     +-- admin-layout.tsx          # NEW: admin sidebar layout
  |     +-- app-layout.tsx            # (existing, used by admin)
  |     +-- auth-layout.tsx           # (existing)
  |     +-- settings/layout.tsx       # (existing)
  |
  +-- components/
  |     +-- animations/               # NEW: animation primitives
  |     +-- content/                  # NEW: content rendering
  |     +-- forms/                    # NEW: admin form components
  |     +-- public/                   # NEW: public-facing components
  |     |     +-- navbar.tsx
  |     |     +-- footer.tsx
  |     |     +-- hero-section.tsx
  |     |     +-- service-card.tsx
  |     |     +-- testimonial-card.tsx
  |     |     +-- locale-switcher.tsx
  |     +-- ui/                       # (existing Radix primitives)
  |
  +-- hooks/
  |     +-- use-appearance.tsx        # (existing, unchanged)
  |     +-- use-translations.ts       # NEW: t() function
  |     +-- use-direction.ts          # NEW: RTL awareness
  |
  +-- types/
        +-- content.ts                # NEW: CMS content types
        +-- settings.ts               # NEW: settings types
        +-- shared.ts                 # NEW: SharedProps type

routes/
  +-- web.php                         # MODIFIED: locale-prefixed public routes
  +-- admin.php                       # NEW: admin routes
  +-- settings.php                    # (existing)

lang/
  +-- en.json                         # NEW: English UI strings
  +-- ar.json                         # NEW: Arabic UI strings
```

## Patterns to Follow

### Pattern 1: Translatable Model with Media

Every content model follows the same trait composition:

```php
class Service extends Model implements HasMedia
{
    use HasFactory, HasTranslations, InteractsWithMedia, SoftDeletes;

    public array $translatable = ['title', 'description', 'body'];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];
}
```

**When:** Every content entity that has bilingual text and/or associated images.

### Pattern 2: Admin Form with Translation Tabs

Admin forms for translatable content always use a tabbed interface:

```tsx
<TranslationTabs>
    <TranslationTab locale="en" label="English">
        <Input name="title.en" value={form.data.title.en} />
        <RichTextEditor name="body.en" value={form.data.body.en} />
    </TranslationTab>
    <TranslationTab locale="ar" label="Arabic" dir="rtl">
        <Input name="title.ar" value={form.data.title.ar} />
        <RichTextEditor name="body.ar" value={form.data.body.ar} />
    </TranslationTab>
</TranslationTabs>
```

**When:** Any admin create/edit form for translatable content.

### Pattern 3: Scroll Reveal Composition

Public pages compose `<Reveal>` and `<StaggerContainer>` to build animated sections:

```tsx
<section className="py-20">
    <Reveal>
        <h2>{t('services.heading')}</h2>
    </Reveal>
    <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {services.map((service) => (
            <Reveal key={service.id}>
                <ServiceCard service={service} />
            </Reveal>
        ))}
    </StaggerContainer>
</section>
```

**When:** Every public-facing section that should animate into view on scroll.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Physical Direction Classes

**What:** Using `ml-4`, `pr-8`, `text-left`, `float-right`, etc.
**Why bad:** These break in RTL mode. Arabic users see reversed layouts.
**Instead:** Always use logical properties: `ms-4`, `pe-8`, `text-start`, `float-end`.

### Anti-Pattern 2: Hardcoded Strings in Components

**What:** `<button>Submit</button>` with inline English text.
**Why bad:** Cannot translate. Must find and replace every string later.
**Instead:** `<button>{t('form.submit')}</button>` from day one.

### Anti-Pattern 3: Separate API for Admin

**What:** Building REST/GraphQL endpoints for the admin panel to consume.
**Why bad:** Doubles the controller layer. Inertia already passes data as props.
**Instead:** Admin controllers use `Inertia::render()` just like public controllers. Same pattern, different pages.

### Anti-Pattern 4: Layout State in Page Components

**What:** Each page component managing its own sidebar state, breadcrumbs, or navigation highlighting.
**Why bad:** Duplicated logic, inconsistent behavior, layout state lost on navigation.
**Instead:** Use Inertia v3's `setLayoutProps()` and persistent layouts. Let the layout own its state.

### Anti-Pattern 5: Animating Non-Composited Properties

**What:** Animating `width`, `height`, `top`, `left`, `margin` with Motion.
**Why bad:** Triggers layout recalculation on every frame. Janky on mobile.
**Instead:** Animate only `opacity`, `transform` (x, y, scale, rotate). Motion's `layout` prop handles the rest with FLIP technique.

## Scalability Considerations

| Concern | At Launch | At 1K monthly visitors | At 50K monthly visitors |
|---------|-----------|----------------------|------------------------|
| **Content volume** | 4 services, ~10 blog posts | 50+ posts, 20 portfolio items | 200+ posts, full portfolio |
| **Translations** | In-memory JSON, no caching needed | Cache translations per locale | Consider splitting translations per page |
| **Media** | Local storage | Local storage, webp conversions | CDN (S3 + CloudFront), queue conversions |
| **SSR** | Not needed initially (Inertia handles SEO adequately) | Enable SSR for faster first-paint | SSR + CDN caching for public pages |
| **Settings** | Cache for 1 hour | Cache for 1 hour | Cache until explicitly invalidated |
| **Search** | Simple Eloquent `where` clauses | Still fine | Laravel Scout + Meilisearch |

## Suggested Build Order (Dependencies)

Components have dependencies. The build order should respect them:

```
Phase 1: Foundation
  - SetLocale middleware, RTL setup in Blade template
  - Data models + migrations (all content models)
  - Settings classes + migrations
  - HandleInertiaRequests updates (locale, direction, settings)
  - Shared TypeScript types
  - i18n hook (useTranslations, useDirection)
  DEPENDS ON: existing codebase (already set up)

Phase 2: Public Layout + Core Pages
  - PublicLayout (navbar, footer, locale switcher)
  - Motion animation primitives (Reveal, StaggerContainer, page transition)
  - Home page (hero, service overview, testimonials, CTA)
  - Service pages (index + show)
  DEPENDS ON: Phase 1 (locale routing, models, settings shared)

Phase 3: Admin Panel
  - AdminLayout (sidebar, breadcrumbs)
  - Translation tabs component
  - Rich text editor integration
  - Media uploader component
  - Admin CRUD pages (services, blog, portfolio, testimonials)
  - Settings management (theme, contact)
  - Leads management
  DEPENDS ON: Phase 1 (models), Phase 2 (validates data model works for public rendering)

Phase 4: Blog + Portfolio
  - Blog system (index with pagination, single post, categories/tags)
  - Portfolio gallery (filterable grid)
  - Contact form
  DEPENDS ON: Phase 2 (public layout), Phase 3 (admin can populate content)

Phase 5: Polish + SEO
  - SEO meta tags (Inertia Head component), OG images, structured data
  - Theme customization (admin color picker -> CSS vars)
  - Animation polish (hero motion graphics, hover interactions)
  - Performance optimization (SSR, image lazy loading, font optimization)
  - Role-based permissions (admin vs editor)
  DEPENDS ON: All previous phases
```

**Ordering rationale:**
- Foundation must come first because locale routing and data models are prerequisites for everything else.
- Public layout before admin because it validates the data model works for rendering -- if the model structure is wrong, better to discover it before building 20 admin forms.
- Admin before blog/portfolio because content needs to be manageable before building additional public pages that consume it.
- SEO and polish last because they layer on top of working functionality.

## Sources

- [Inertia.js v3 Layouts Documentation](https://inertiajs.com/docs/v3/the-basics/layouts) -- HIGH confidence, official docs
- [Motion (formerly Framer Motion) AnimatePresence](https://motion.dev/docs/react-animate-presence) -- HIGH confidence, official docs
- [spatie/laravel-translatable v6](https://spatie.be/docs/laravel-translatable/v6/introduction) -- HIGH confidence, official docs
- [spatie/laravel-medialibrary v11](https://spatie.be/docs/laravel-medialibrary/v11/introduction) -- HIGH confidence, official docs
- [spatie/laravel-settings](https://github.com/spatie/laravel-settings) -- HIGH confidence, official repo
- [mcamara/laravel-localization](https://github.com/mcamara/laravel-localization) -- HIGH confidence, referenced for locale routing patterns (though we use a lighter custom middleware)
- [Tailwind CSS v4 Logical Properties](https://tailwindcss.com/blog/tailwindcss-v4) -- HIGH confidence, official announcement
- [Flowbite RTL Implementation Guide](https://flowbite.com/docs/customize/rtl/) -- MEDIUM confidence, third-party but well-documented
- [Laravel Multilang with Inertia + React](https://dev.to/abdasis/laravel-multilang-with-inertia-react-a-real-world-guide-51jg) -- MEDIUM confidence, community guide
- [Laracasts Inertia + React page transitions discussion](https://laracasts.com/discuss/channels/inertia/how-to-achieve-page-transitions-with-inertiareact) -- MEDIUM confidence, community solution

---

*Architecture analysis: 2026-03-28*
