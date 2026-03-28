# Phase 2: Public Marketing Site - Research

**Researched:** 2026-03-28
**Domain:** Full-stack marketing pages — React (Motion animation, Radix UI, i18n), Laravel (controllers, models, mail, rate limiting), bilingual content (EN/AR)
**Confidence:** HIGH

## Summary

Phase 2 builds all visitor-facing pages on top of Phase 01's foundation: a fully built PublicLayout, ScrollReveal component, Motion animation variants, i18n hook (`useLocale`), design tokens (teal/emerald brand colors in oklch), and Radix UI component library. The existing codebase provides a clear pattern for adding pages — create a React component in `resources/js/pages/public/`, assign `PublicLayout` via the `.layout` property, add locale-prefixed routes in `routes/web.php`, and extend `en.json`/`ar.json` translation files. The home page placeholder already exists and will be replaced with the full landing page.

The backend work is limited to two new database tables (`contacts`, `newsletter_subscribers`), two Eloquent models, one controller for contact form handling, one controller for newsletter subscriptions, a Laravel Mailable for admin notification, and rate limiting + honeypot middleware for spam protection. The mail system is already configured (`MAIL_MAILER=log` in development). All content is stored in translation JSON files for now — the migration to database-driven content happens in Phase 3.

The frontend work is component-heavy: hero section with gradient + staggered text animation, service cards, testimonial cards, statistics counters with scroll-triggered count-up (using Motion's `useInView`), client logo bar, comparison section, team cards, FAQ accordion (Radix Accordion needs to be installed), contact form (Inertia `useForm` hook), and newsletter capture. All components must work in both EN/AR with RTL support using the existing i18n and direction infrastructure.

**Primary recommendation:** Structure implementation in 4 plans: (1) Landing page with all sections, (2) Service detail pages, (3) Contact system + FAQ + newsletter backend, (4) About/team page. This follows data dependency order — the contact form controller must exist before service pages can link to it with pre-filled service type.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Animated gradient background (dark with teal/emerald glow accents) with bold text entrance animation. Floating geometric shapes or abstract tech-inspired SVG elements as background accents — subtle, not distracting.
- **D-02:** Hero text uses staggered fade-in-up animation from Phase 01 animation system. Primary CTA ("Get in Touch" / "Contact Us") uses teal accent button with hover glow effect.
- **D-03:** Hero must work in both dark and light modes with equal visual impact. No video or heavy 3D — keep it fast-loading and accessible.
- **D-04:** Each of the 4 services (Software Development, Automation, QA, Cybersecurity) gets its own dedicated full-page with: hero banner with service icon, problem statement section, approach/methodology section, deliverables list, and a bottom CTA that pre-fills the contact form with the service type.
- **D-05:** Process/methodology section uses numbered visual steps (1-2-3-4 flow) with icons — not a flowchart or timeline. Steps appear with ScrollReveal stagger animation.
- **D-06:** Service overview on landing page uses 4 cards in a grid linking to detail pages. Cards have icon, title, brief description, and hover micro-interaction (from Phase 01 card component).
- **D-07:** Contact form fields: name (required), email (required), phone (optional), service interest (dropdown with 4 services + "General Inquiry"), message (required). Laravel server-side validation + client-side Inertia form validation.
- **D-08:** Spam protection: honeypot hidden field + server-side rate limiting (5 submissions per IP per hour). No CAPTCHA.
- **D-09:** Map: static Google Maps embed (iframe) or styled image with a "View on Google Maps" link. No JavaScript map library needed.
- **D-10:** Email notification to admin on form submission using Laravel Mail notification. Store lead in database with `Contact` model (name, email, phone, service, message, status: new/read/handled).
- **D-11:** Multi-channel display: WhatsApp link (wa.me/...), phone tel: link, email mailto: link — all visible on contact page AND in footer.
- **D-12:** All page content stored in translation JSON files (en.json/ar.json) using structured keys. Uses existing i18n system from Phase 01.
- **D-13:** Contact form submissions and newsletter signups are the only database-backed data in Phase 2. A `Contact` model and `NewsletterSubscriber` model are created with migrations.
- **D-14:** When Phase 3 admin panel adds database-driven content management, the JSON content becomes seed data / fallback defaults.
- **D-15:** Section order on landing page: Hero -> Service Overview Cards -> Client Logo Bar -> Statistics Counters -> Testimonials -> Old Way vs New Way Comparison -> Bottom CTA. All sections wrapped in ScrollReveal.
- **D-16:** Statistics section: 4 animated counters. Count-up animation triggers on scroll using requestAnimationFrame — no external counter library.
- **D-17:** Testimonials: 3-4 static testimonials in a horizontal card layout (not a carousel/slider).
- **D-18:** Old Way vs New Way: side-by-side card comparison (two columns). Not interactive — simpler, works in RTL.
- **D-19:** Client logo bar: horizontal flex row of grayscale logos that colorize on hover. 6-8 placeholder logos.
- **D-20:** About page sections: Company story/mission hero, team member grid, certifications/badges section.
- **D-21:** Team members in card grid: photo, name, role, short bio. 3-4 placeholder entries. Hover reveals social links or expanded bio.
- **D-22:** Certifications section: badge/logo grid with labels.
- **D-23:** FAQ uses accordion component (Radix UI Accordion). 6-8 questions. FAQ JSON-LD structured data added via Inertia Head component.
- **D-24:** FAQ lives on its own route (/en/faq, /ar/faq) — linked from footer quick links.
- **D-25:** Newsletter email input + submit button in footer. Backend stores email in `newsletter_subscribers` table. No email service integration in Phase 2.

### Claude's Discretion
- Exact hero gradient colors and animation timing — calibrate for visual impact
- Service page icon selection (Lucide icons or custom SVGs)
- Contact form field layout (single column vs two-column for name/email)
- Statistics counter animation easing and duration
- Team member card hover effect style
- FAQ content — write reasonable placeholder questions
- ScrollReveal thresholds and stagger timing per section

### Deferred Ideas (OUT OF SCOPE)
- Email service integration for newsletter (Mailchimp/SendGrid) — v2 ENGM-01
- Portfolio gallery and case studies — Phase 4
- Blog system — Phase 4
- Admin-managed content (replacing JSON translations) — Phase 3
- SEO meta tags and structured data beyond FAQ — Phase 4
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LAND-01 | Hero section with animated entrance, clear value proposition, and primary CTA | Motion `heroEntrance` variant + `staggerContainer` already built. Hero gradient + floating SVGs per D-01/D-02. `useReducedMotion` for accessibility. |
| LAND-02 | Service overview section with 4 cards linking to detail pages | Existing Card component has hover micro-interaction (lift+shadow). Use stagger animation with ScrollReveal variant="stagger". |
| LAND-03 | Client/partner logo bar | Tailwind `grayscale` + `hover:grayscale-0` filter transition. Flex row with responsive wrapping. |
| LAND-04 | Client testimonials with quotes, names, companies, photos | Static card layout per D-17. Card component + ScrollReveal. Translation JSON for content. |
| LAND-05 | Animated statistics/counter section with scroll-triggered count-up | Motion `useInView` hook (0.6kb, already installed via `motion` package) + `requestAnimationFrame` counter per D-16. |
| LAND-06 | "Old Way vs New Way" comparison section | Two-column grid with Card components. Works in RTL via CSS logical properties. |
| LAND-07 | Bottom CTA section driving visitors to contact | ScrollReveal + Button component linking to contact page. |
| SRVC-01 | Individual detail page for each service | 4 pages under `pages/public/services/`. Route pattern: `/{locale}/services/{slug}`. |
| SRVC-02 | Problem-solution framing | Translation JSON keys: `services.{slug}.problem`, `services.{slug}.approach`, `services.{slug}.deliverables`. |
| SRVC-03 | Process overview with visual step-by-step flow | Numbered steps (1-2-3-4) with Lucide icons + stagger ScrollReveal per D-05. |
| SRVC-04 | Per-service CTA that pre-fills contact form | Inertia Link with query param `?service=development`. Contact form reads `new URL(window.location.href).searchParams`. |
| SRVC-05 | Scroll reveal animations on service page sections | Existing ScrollReveal component wraps each section. |
| CONT-01 | Contact form with validation | Inertia `useForm` hook + Laravel `FormRequest` validation. Fields per D-07. |
| CONT-02 | Multi-channel contact info visible on contact page and footer | Footer already has contact column (Mail, Phone, MapPin icons). Contact page adds WhatsApp + larger display. |
| CONT-03 | Contact page with embedded map | Google Maps iframe embed per D-09. RTL-safe (iframe is direction-agnostic). |
| CONT-04 | Email notification sent to admin on form submission | Laravel Mailable class. `MAIL_MAILER=log` in dev, configurable for production. |
| CONT-05 | Spam protection on contact form | Honeypot hidden field (custom, no external package per decision) + `ThrottleRequests` middleware (5/hour per IP). |
| CONT-06 | FAQ section with accordion and FAQ structured data (JSON-LD) | Radix Accordion (needs `@radix-ui/react-accordion` install or shadcn add). JSON-LD via `<script>` tag in Inertia `<Head>`. |
| CONT-07 | Newsletter email capture stored in database | `NewsletterSubscriber` model + migration. Footer form wired with Inertia `useForm` POST. |
| TEAM-01 | About page with company story and mission | Page component with hero section + ScrollReveal sections. Content from translation JSON. |
| TEAM-02 | Team member section with photos, names, roles, bios | Card grid with placeholder avatar images. Hover effect per Claude's discretion. |
| TEAM-03 | Certifications and badges display | Badge/logo grid similar to client logo bar styling. |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.0 | UI components | Already in stack |
| @inertiajs/react | 3.0.0 | Server-driven SPA, useForm hook | Already in stack, form handling built-in |
| motion | 12.38.0 | Scroll animations, useInView, whileInView | Already in stack, replaces Framer Motion |
| Tailwind CSS | 4.0.0 | Styling, responsive, RTL | Already in stack |
| Radix UI | Various | Headless UI primitives | Already in stack |
| Lucide React | 0.475.0 | Icons for services, process steps | Already in stack |
| Laravel Framework | 13.2.0 | Backend controllers, models, mail, rate limiting | Already in stack |

### Needs Installation
| Library | Version | Purpose | Install Command |
|---------|---------|---------|-----------------|
| @radix-ui/react-accordion | latest | FAQ accordion component | `npx shadcn@latest add accordion` |

**Note:** The shadcn CLI (`npx shadcn@latest add accordion`) will install `@radix-ui/react-accordion` and generate the styled component at `resources/js/components/ui/accordion.tsx`. This follows the existing pattern of all other UI components in the project.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom honeypot | spatie/laravel-honeypot package | Decision D-08 keeps it simple — a hidden field + time check is ~20 lines of code, no package needed |
| Counter library | react-countup | D-16 specifies requestAnimationFrame — custom hook is cleaner than adding a dependency |
| Map library (Leaflet/Google Maps JS) | Static iframe embed | D-09 explicitly rules out JS map libraries |
| Carousel/slider for testimonials | Static horizontal layout | D-17 explicitly says no carousel |

## Architecture Patterns

### Recommended Project Structure
```
resources/js/
  pages/public/
    home.tsx                    # Landing page (replace existing placeholder)
    about.tsx                   # About & team page
    faq.tsx                     # FAQ page
    contact.tsx                 # Contact form page
    services/
      development.tsx           # Software Development detail
      automation.tsx            # Automation detail
      qa.tsx                    # QA detail
      cybersecurity.tsx         # Cybersecurity detail
  components/
    hero-section.tsx            # Landing page hero with gradient + animation
    service-card.tsx            # Service overview card (landing page)
    client-logos.tsx             # Logo bar component
    statistics-section.tsx      # Counter section with animated count-up
    testimonial-card.tsx        # Single testimonial card
    comparison-section.tsx      # Old Way vs New Way
    cta-section.tsx             # Reusable bottom CTA
    process-steps.tsx           # Numbered steps for service pages
    contact-form.tsx            # Contact form with Inertia useForm
    newsletter-form.tsx         # Newsletter capture (replaces footer placeholder)
    team-card.tsx               # Team member card
    json-ld.tsx                 # Reusable JSON-LD structured data helper
  hooks/
    use-counter.ts              # Scroll-triggered count-up animation hook

app/
  Http/
    Controllers/
      ContactController.php     # Contact form submission
      NewsletterController.php  # Newsletter subscription
    Requests/
      ContactRequest.php        # Contact form validation rules
      NewsletterRequest.php     # Newsletter validation rules
  Models/
    Contact.php                 # Contact/lead model
    NewsletterSubscriber.php    # Newsletter subscriber model
  Mail/
    ContactSubmitted.php        # Admin notification email

database/migrations/
    xxxx_create_contacts_table.php
    xxxx_create_newsletter_subscribers_table.php

resources/lang/
    en.json                     # Extended with all Phase 2 content keys
    ar.json                     # Extended with all Phase 2 Arabic content
```

### Pattern 1: Page Component with PublicLayout
**What:** Every public page follows the same pattern — default export function, `.layout` property assignment, Inertia `<Head>` for meta tags.
**When to use:** Every page in Phase 2.
**Example:**
```typescript
// Source: existing resources/js/pages/public/home.tsx pattern
import { Head } from '@inertiajs/react';

import PublicLayout from '@/layouts/public-layout';
import { useLocale } from '@/hooks/use-locale';

export default function About() {
    const { t } = useLocale();

    return (
        <>
            <Head title={t('about.title')} />
            {/* Page content with ScrollReveal sections */}
        </>
    );
}

About.layout = (page: React.ReactNode) => (
    <PublicLayout breadcrumbs={[{ title: 'About', href: '/en/about' }]}>
        {page}
    </PublicLayout>
);
```

### Pattern 2: Inertia useForm for Contact/Newsletter
**What:** Inertia's `useForm` hook handles form state, validation errors, processing state, and submission in one unified API. For Phase 2, use `post()` for contact and newsletter submissions.
**When to use:** Contact form (CONT-01) and newsletter capture (CONT-07).
**Example:**
```typescript
// Source: https://inertiajs.com/docs/v2/the-basics/forms
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
    name: '',
    email: '',
    phone: '',
    service: initialService ?? '',  // Pre-filled from URL param (SRVC-04)
    message: '',
    _honeypot: '',  // Hidden honeypot field (CONT-05)
});

function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    post(`/${locale}/contact`, {
        onSuccess: () => reset(),
    });
}
```

### Pattern 3: Scroll-Triggered Counter Hook
**What:** Custom hook using Motion's `useInView` + `requestAnimationFrame` for count-up animation per D-16.
**When to use:** Statistics section (LAND-05).
**Example:**
```typescript
// Custom hook — no external dependency
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'motion/react';

export function useCounter(target: number, duration: number = 2000) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let start = 0;
        const startTime = performance.now();

        function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            setCount(Math.floor(eased * target));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }, [isInView, target, duration]);

    return { ref, count };
}
```

### Pattern 4: Translation Key Organization
**What:** Flat dot-notation keys in en.json/ar.json per the existing i18n system.
**When to use:** All content in Phase 2.
**Example:**
```json
{
    "hero.title": "Building Digital Excellence",
    "hero.subtitle": "Software development, automation, QA, and cybersecurity",
    "hero.cta": "Get in Touch",
    "services.overview.title": "Our Services",
    "services.development.title": "Software Development",
    "services.development.brief": "Custom solutions built for scale",
    "services.development.problem": "...",
    "services.development.approach": "...",
    "services.development.step1.title": "Discovery",
    "services.development.step1.description": "...",
    "testimonials.0.quote": "Quart transformed our...",
    "testimonials.0.name": "Ahmed Al-Rashid",
    "testimonials.0.company": "TechCorp",
    "stats.years": "Years Experience",
    "stats.projects": "Projects Completed",
    "contact.form.name": "Full Name",
    "contact.form.email": "Email Address",
    "faq.0.question": "What services does Quart offer?",
    "faq.0.answer": "We provide software development..."
}
```

### Pattern 5: JSON-LD Structured Data
**What:** A reusable component that injects JSON-LD into the page `<head>` using Inertia's `<Head>` component.
**When to use:** FAQ page (CONT-06). Also reusable in Phase 4 for broader structured data.
**Example:**
```typescript
import { Head } from '@inertiajs/react';

type Props = { data: Record<string, unknown> };

export default function JsonLd({ data }: Props) {
    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(data),
                }}
            />
        </Head>
    );
}

// Usage in FAQ page:
const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
        },
    })),
};
```

### Pattern 6: Laravel Route Registration
**What:** Add new public routes under the existing locale prefix group in `routes/web.php`.
**When to use:** All new pages.
**Example:**
```php
// Source: existing routes/web.php pattern
Route::prefix('{locale}')
    ->where(['locale' => 'en|ar'])
    ->middleware(SetLocale::class)
    ->group(function () {
        Route::inertia('/', 'public/home')->name('home');

        // Service pages (static Inertia render — no controller needed)
        Route::inertia('/services/development', 'public/services/development')->name('services.development');
        Route::inertia('/services/automation', 'public/services/automation')->name('services.automation');
        Route::inertia('/services/qa', 'public/services/qa')->name('services.qa');
        Route::inertia('/services/cybersecurity', 'public/services/cybersecurity')->name('services.cybersecurity');

        // Static pages
        Route::inertia('/about', 'public/about')->name('about');
        Route::inertia('/faq', 'public/faq')->name('faq');

        // Contact (GET: show form, POST: submit)
        Route::inertia('/contact', 'public/contact')->name('contact.show');
        Route::post('/contact', [ContactController::class, 'store'])
            ->middleware('throttle:contact')
            ->name('contact.store');

        // Newsletter
        Route::post('/newsletter', [NewsletterController::class, 'store'])
            ->middleware('throttle:newsletter')
            ->name('newsletter.store');
    });
```

### Anti-Patterns to Avoid
- **Hand-rolling form state management:** Use Inertia's `useForm` — it handles validation errors, processing state, dirty tracking, and CSRF automatically.
- **Creating separate API endpoints for form submissions:** Inertia POST routes handle everything — the form submits to the same locale-prefixed route, validation errors come back as page props, and success redirects are handled by Inertia.
- **Using `useEffect` to sync URL params into form state:** Read the `service` query param once during initialization with `useForm({ service: new URLSearchParams(window.location.search).get('service') ?? '' })`.
- **Importing `gsap` for counter animation:** D-16 specifies `requestAnimationFrame` — GSAP is in the project for ScrollTrigger concerns but the counter should use native browser APIs.
- **Putting content in component JSX:** All user-visible text goes in `en.json`/`ar.json` and is accessed via `t('key')`. This is required for bilingual support.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form submission + validation | Custom fetch/axios calls | Inertia `useForm` hook | Handles CSRF, error mapping, processing state, redirects automatically |
| FAQ accordion accessibility | Custom expand/collapse with state | Radix UI Accordion (via shadcn) | WAI-ARIA compliant, keyboard navigation, focus management built-in |
| Rate limiting | Custom IP tracking middleware | Laravel's `ThrottleRequests` middleware with named limiters | Battle-tested, supports Redis/file cache, handles response headers |
| Email templating | Raw `mail()` or custom SMTP | Laravel Mailable class | Supports queuing, multiple drivers, Markdown templates, testing helpers |
| RTL layout mirroring | Manual `left`/`right` CSS for Arabic | CSS logical properties (`ps-`, `pe-`, `ms-`, `me-`, `start`, `end`) | Already the convention from Phase 01 — automatic RTL via `dir="rtl"` |
| Scroll detection | Custom scroll event listeners | Motion's `useInView` hook | Uses Intersection Observer API (performant), 0.6kb, already installed |
| JSON structured data | String concatenation of JSON | Type-safe object + `JSON.stringify` in a component | Prevents syntax errors, validates at TypeScript level |

**Key insight:** The existing Phase 01 infrastructure provides nearly every primitive needed. The main work in Phase 2 is composing these primitives into page-level components and adding minimal backend for contact/newsletter.

## Common Pitfalls

### Pitfall 1: Translation Key Explosion
**What goes wrong:** Hundreds of flat dot-notation keys in en.json/ar.json become hard to manage. Typos in keys cause silent fallback to the key string itself.
**Why it happens:** The `t()` function returns the key as fallback when not found, with no console warning by default.
**How to avoid:** Use a consistent prefix convention (`hero.`, `services.development.`, `contact.form.`, etc.). Consider adding a development-only warning when a key is missing. Keep keys in a single flat structure — do NOT nest JSON objects (the existing `t()` function only handles flat key lookup).
**Warning signs:** English key strings appearing on the Arabic version of the site.

### Pitfall 2: Hero Gradient Not Working in Light Mode
**What goes wrong:** Dark gradient hero designed for dark mode looks washed out or invisible in light mode.
**Why it happens:** D-03 requires equal visual impact in both modes but the "dark premium" gradient (D-01) naturally suits dark backgrounds.
**How to avoid:** Design the hero with two distinct gradient schemes — one for dark mode (dark navy + teal glow) and one for light mode (lighter gradient with stronger teal accents). Use Tailwind's `dark:` variant for hero background classes. Test both modes early.
**Warning signs:** Hero section disappearing or becoming unreadable after toggling theme.

### Pitfall 3: Counter Animation Firing Before Visible
**What goes wrong:** Count-up animation runs while the section is off-screen; user scrolls down and sees the final number with no animation.
**Why it happens:** `useEffect` fires on mount regardless of viewport position if `useInView` isn't configured with `once: true`.
**How to avoid:** Always use `useInView(ref, { once: true, amount: 0.5 })` — the `once` flag ensures the animation triggers exactly once when 50% visible.
**Warning signs:** Statistics showing final numbers on initial render.

### Pitfall 4: Contact Form Pre-fill Not Working After Navigation
**What goes wrong:** Clicking "Get Started" on a service page navigates to `/en/contact?service=development` but the form doesn't have the service pre-selected.
**Why it happens:** Inertia navigation may not re-initialize form defaults when only the query string changes. `useForm` initial values are set once.
**How to avoid:** Read `usePage().url` to extract query params and set the initial value of `service` in `useForm`. Use the URL at component mount time, not a static default.
**Warning signs:** Service dropdown showing "General Inquiry" after clicking a service-specific CTA.

### Pitfall 5: Honeypot Field Visible in RTL
**What goes wrong:** The hidden honeypot field becomes visible in RTL layout due to CSS positioning differences.
**Why it happens:** `position: absolute; left: -9999px` becomes right-side overflow in RTL.
**How to avoid:** Use `aria-hidden="true" tabIndex={-1}` with Tailwind `sr-only` class (screen-reader only) or `opacity-0 absolute -z-10 h-0 w-0 overflow-hidden`. These approaches are direction-agnostic.
**Warning signs:** A mysterious empty text field appearing on the contact form in Arabic mode.

### Pitfall 6: Google Maps iframe Not Responsive
**What goes wrong:** Static iframe has fixed width/height that doesn't adapt to container size on mobile.
**Why it happens:** Google Maps embed code uses fixed pixel dimensions.
**How to avoid:** Wrap the iframe in a responsive container: `<div className="aspect-video w-full overflow-hidden rounded-lg"><iframe className="h-full w-full" ... /></div>`.
**Warning signs:** Map overflowing its container on mobile viewports.

### Pitfall 7: Newsletter Form Double Submit
**What goes wrong:** User clicks "Subscribe" multiple times and gets duplicate entries or errors.
**Why it happens:** No processing state feedback on the footer newsletter form.
**How to avoid:** Use Inertia `useForm` with `processing` state to disable the button during submission. Add unique constraint on email column in migration.
**Warning signs:** Duplicate rows in `newsletter_subscribers` table.

### Pitfall 8: ScrollReveal Stacking on Long Pages
**What goes wrong:** Landing page with 7+ sections all using ScrollReveal feels slow and janky as many intersection observers fire.
**Why it happens:** Too many simultaneous animations when scrolling quickly.
**How to avoid:** The existing ScrollReveal uses `viewport={{ once: true, amount: 0.2 }}` which is correct — elements animate once and stop observing. Ensure `shouldReduceMotion` check is respected. Keep animation durations short (0.3-0.5s per Phase 01 D-04).
**Warning signs:** Laggy scroll experience on mobile devices.

## Code Examples

### Contact Form Controller (Laravel)
```php
// app/Http/Controllers/ContactController.php
namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Mail\ContactSubmitted;
use App\Models\Contact;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(ContactRequest $request)
    {
        $contact = Contact::create($request->validated());

        Mail::to(config('mail.admin_address', 'admin@quart.com'))
            ->send(new ContactSubmitted($contact));

        return back()->with('success', true);
    }
}
```

### Contact Form Request (Laravel Validation)
```php
// app/Http/Requests/ContactRequest.php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Public form
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'service' => ['required', 'string', 'in:development,automation,qa,cybersecurity,general'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            '_honeypot' => ['present', 'max:0'], // Must be empty
        ];
    }
}
```

### Contact Model + Migration
```php
// database/migrations/xxxx_create_contacts_table.php
Schema::create('contacts', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email');
    $table->string('phone')->nullable();
    $table->string('service'); // development, automation, qa, cybersecurity, general
    $table->text('message');
    $table->enum('status', ['new', 'read', 'handled'])->default('new');
    $table->timestamps();
});
```

### Newsletter Subscriber Migration
```php
Schema::create('newsletter_subscribers', function (Blueprint $table) {
    $table->id();
    $table->string('email')->unique();
    $table->string('locale', 2)->default('en');
    $table->timestamp('subscribed_at');
    $table->timestamps();
});
```

### Rate Limiter Configuration
```php
// app/Providers/AppServiceProvider.php (boot method)
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('contact', function ($request) {
    return Limit::perHour(5)->by($request->ip());
});

RateLimiter::for('newsletter', function ($request) {
    return Limit::perHour(3)->by($request->ip());
});
```

### Hero Section Component (Key Patterns)
```typescript
// resources/js/components/hero-section.tsx
import { motion } from 'motion/react';

import ScrollReveal from '@/components/scroll-reveal';
import { useLocale } from '@/hooks/use-locale';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { staggerContainer, heroEntrance, heroTransition } from '@/lib/animations';

export default function HeroSection() {
    const { t } = useLocale();
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="relative min-h-screen overflow-hidden">
            {/* Gradient background — adapts to dark/light */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10 dark:from-background dark:via-background dark:to-primary/20" />

            {/* Floating geometric elements (SVG) */}
            {!shouldReduceMotion && <FloatingShapes />}

            {/* Content with staggered entrance */}
            <motion.div
                className="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-20"
                variants={staggerContainer}
                initial={shouldReduceMotion ? false : 'hidden'}
                animate="visible"
            >
                <motion.h1
                    className="text-4xl font-bold tracking-tight md:text-6xl"
                    variants={heroEntrance}
                    transition={heroTransition}
                >
                    {t('hero.title')}
                </motion.h1>
                {/* ... subtitle, CTA */}
            </motion.div>
        </section>
    );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| framer-motion package | motion package (v12+) | 2024 | Same API, renamed package. Project already uses `motion`. Import from `motion/react`. |
| Inertia v2 useForm | Inertia v3 useForm + useHttp | March 2026 | v3 adds optimistic updates and `useHttp` for non-navigation requests. `useForm` API remains compatible. |
| Individual @radix-ui/react-* packages | Unified `radix-ui` package | June 2025 | shadcn CLI now installs unified package. Existing project uses individual packages — migration optional. |
| GSAP ScrollTrigger for counters | Motion useInView + rAF | 2024+ | Simpler, no GSAP license concern for counters. GSAP still available for complex ScrollTrigger use cases. |
| Spatie honeypot package | Simple custom honeypot field | Always available | For 1-2 forms, a hidden field + max:0 validation is simpler than adding a package |

**Deprecated/outdated:**
- `framer-motion` package name: Use `motion` instead (same library, rebranded). Already correct in this project.
- Inertia v2 Axios dependency: v3 has built-in XHR client. No need to install Axios.

## Open Questions

1. **Admin email address for contact notifications**
   - What we know: Laravel Mail is configured with `MAIL_MAILER=log` (dev) and `MAIL_FROM_ADDRESS=hello@example.com`
   - What's unclear: What email should receive contact form notifications in production?
   - Recommendation: Use a `CONTACT_ADMIN_EMAIL` env variable defaulting to `admin@quart.com`. Wire it up in `config/mail.php` or read directly in the controller. This can be changed at deployment time.

2. **Google Maps location coordinates**
   - What we know: Footer shows "Riyadh, Saudi Arabia" as location
   - What's unclear: Exact coordinates/address for the Google Maps iframe embed
   - Recommendation: Use Riyadh center coordinates as placeholder (`24.7136, 46.6753`). The exact location can be updated in Phase 3 admin settings.

3. **Placeholder content quality**
   - What we know: Translation JSON needs ~150+ keys for all Phase 2 content (both languages)
   - What's unclear: Should Arabic content be professionally translated or use auto-translation for placeholder purposes?
   - Recommendation: Write high-quality English content, provide reasonable Arabic translations. Phase 3 admin will allow content editing. Mark all content as "placeholder" in translation keys comments.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| PHP | Backend controllers, models, mail | Yes | 8.3.27 | -- |
| Node.js | Frontend build, dev server | Yes | 20.19.5 | -- |
| NPM | Package management | Yes | 10.8.2 | -- |
| Laravel | All backend functionality | Yes | 13.2.0 | -- |
| SQLite | Development database | Yes | (configured in .env) | -- |
| Mail (log driver) | Contact form notification | Yes | Configured | Log driver sufficient for dev; production needs real SMTP |
| @radix-ui/react-accordion | FAQ component | No | -- | Install via `npx shadcn@latest add accordion` |

**Missing dependencies with no fallback:**
- None -- all critical dependencies are available.

**Missing dependencies with fallback:**
- `@radix-ui/react-accordion`: Not currently installed. Install via shadcn CLI before FAQ implementation.

## Project Constraints (from CLAUDE.md)

- **Tech stack locked:** Laravel 13 + Inertia.js 3 + React 19 + Tailwind CSS 4 -- no alternative frameworks
- **Bilingual required:** All user-facing content must work in EN (LTR) and AR (RTL)
- **Animation library:** Motion (Framer Motion) already integrated -- use it, not alternatives
- **SSR via Inertia:** Server-side rendering for SEO -- use Inertia's `<Head>` for meta tags
- **Code style:** Prettier (4-space tabs, single quotes, semicolons), ESLint (import order, consistent type imports), TypeScript strict mode
- **Naming:** React components PascalCase, hooks kebab-case with `use-` prefix, utilities camelCase
- **Imports:** Always use `@/*` path alias, never relative imports
- **Module design:** Default exports for components, named exports for utilities/hooks
- **Error handling:** No console.error -- errors go to state arrays with user-friendly messages
- **Components:** Use existing Radix UI primitives from `@/components/ui/`, extend with domain-specific wrappers
- **GSD workflow:** All changes through GSD commands -- no direct repo edits outside workflow

## Sources

### Primary (HIGH confidence)
- Existing codebase files -- direct read of all Phase 01 components, hooks, layouts, routes, translations, CSS, and configuration
- `package.json` -- verified all installed dependency versions
- `composer.json` -- verified Laravel and PHP dependency versions
- `.env` -- confirmed database (SQLite), mail (log driver), and app configuration
- Laravel artisan -- confirmed Laravel 13.2.0 and migration status

### Secondary (MEDIUM confidence)
- [Inertia.js v3 Forms Documentation](https://inertiajs.com/docs/v2/the-basics/forms) -- useForm API patterns
- [Motion useInView Documentation](https://motion.dev/docs/react-use-in-view) -- scroll-triggered animation hook
- [Laravel Rate Limiting Documentation](https://laravel.com/docs/12.x/rate-limiting) -- ThrottleRequests middleware
- [shadcn/ui Accordion](https://ui.shadcn.com/docs/components/radix/accordion) -- installation and usage pattern
- [Inertia.js v3 Release Notes](https://laravel-news.com/inertia-3-0-0) -- v3 new features (useHttp, optimistic updates)

### Tertiary (LOW confidence)
- [JSON-LD FAQ schema implementation](https://dev.to/dheeraj_jain/a-developers-guide-to-implementing-json-ld-structured-data-for-better-technical-seo-nmg) -- React implementation approach via dangerouslySetInnerHTML
- [Laravel honeypot patterns](https://github.com/spatie/laravel-honeypot) -- honeypot technique details (used for reference, not installing the package)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed and verified in codebase except Accordion (well-documented install path)
- Architecture: HIGH -- directly extends established Phase 01 patterns; all integration points verified in existing code
- Pitfalls: HIGH -- most pitfalls identified from direct codebase analysis (RTL issues, animation timing, form handling edge cases)

**Research date:** 2026-03-28
**Valid until:** 2026-04-28 (stable -- all core dependencies are released and version-pinned)
