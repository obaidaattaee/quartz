---
phase: 02-public-marketing-site
plan: 04
subsystem: ui
tags: [react, inertia, forms, seo, json-ld, radix-accordion, contact, newsletter, faq]

# Dependency graph
requires:
  - phase: 02-01
    provides: "Backend routes, controllers, validation, translations, and Radix UI accordion component"
provides:
  - "Contact form component with Inertia useForm, validation, honeypot, and URL param pre-fill"
  - "Newsletter form component for footer with success/error states"
  - "Reusable JSON-LD structured data injection component"
  - "Contact page with form, multi-channel info, and Google Maps embed"
  - "FAQ page with 7-question Radix Accordion and FAQPage JSON-LD"
  - "Working newsletter submission in site footer"
affects: [02-05, 03-admin-panel]

# Tech tracking
tech-stack:
  added: []
  patterns: ["JSON-LD structured data via Head component", "Inertia useForm for contact/newsletter submissions", "URL query param pre-fill for service dropdown"]

key-files:
  created:
    - resources/js/components/json-ld.tsx
    - resources/js/components/contact-form.tsx
    - resources/js/components/newsletter-form.tsx
    - resources/js/pages/public/contact.tsx
    - resources/js/pages/public/faq.tsx
  modified:
    - resources/js/components/site-footer.tsx

key-decisions:
  - "Used wasSuccessful to fully replace form with success message rather than inline toast"
  - "FAQ items count stored as constant (FAQ_COUNT=7) to match translation keys"

patterns-established:
  - "JSON-LD pattern: use JsonLd component with data prop for structured data injection"
  - "Form pattern: Inertia useForm with locale-prefixed POST endpoints and preserveScroll"
  - "Page layout pattern: static breadcrumbs in .layout property using PublicLayout"

requirements-completed: [CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07]

# Metrics
duration: 5min
completed: 2026-03-28
---

# Phase 02 Plan 04: Contact & FAQ Summary

**Contact form with honeypot spam protection and URL param pre-fill, FAQ with Radix Accordion and FAQPage JSON-LD, and working newsletter capture in footer**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-28T06:52:23Z
- **Completed:** 2026-03-28T06:56:56Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Contact page with validated form (5 fields + honeypot), multi-channel contact info (email, phone, WhatsApp), and responsive Google Maps iframe embed
- FAQ page with 7-question Radix Accordion (single/collapsible) and FAQPage JSON-LD structured data for SEO
- Newsletter form component wired into site footer, replacing the stub preventDefault handler
- Reusable JSON-LD component for structured data injection across any page

## Task Commits

Each task was committed atomically:

1. **Task 1: Contact form, newsletter form, JSON-LD helper, and contact page** - `576efe4` (feat)
2. **Task 2: FAQ page with accordion and JSON-LD, and wire newsletter form into footer** - `ce29ec5` (feat)

## Files Created/Modified
- `resources/js/components/json-ld.tsx` - Reusable JSON-LD structured data component using Inertia Head
- `resources/js/components/contact-form.tsx` - Contact form with Inertia useForm, honeypot, URL param service pre-fill, validation errors
- `resources/js/components/newsletter-form.tsx` - Compact newsletter email capture form for footer with success/error handling
- `resources/js/pages/public/contact.tsx` - Contact page with form, multi-channel info, Google Maps embed, PublicLayout with breadcrumbs
- `resources/js/pages/public/faq.tsx` - FAQ page with 7-question Radix Accordion, FAQPage JSON-LD, contact CTA
- `resources/js/components/site-footer.tsx` - Replaced newsletter stub form with NewsletterForm component, removed unused Input/Button imports

## Decisions Made
- Used `wasSuccessful` from Inertia to fully replace the contact form with a success message rather than showing an inline toast -- simpler UX and no additional state management needed
- FAQ items count stored as a constant (`FAQ_COUNT = 7`) matching the translation key indices, making it easy to adjust if questions are added
- Contact form reads `?service=` from URL via `URLSearchParams` at component initialization, enabling service pages to link to contact with pre-selected service

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required

None - no external service configuration required.

## Known Stubs

None - all components are fully wired to their backend endpoints. Contact info uses placeholder phone numbers/addresses that are defined in translation files and can be updated there.

## Next Phase Readiness
- Contact form, newsletter, and FAQ pages are ready for end-to-end testing once backend controllers are available
- JSON-LD component is reusable for any future page needing structured data (blog posts, service pages, etc.)
- Footer newsletter form is live across all pages via site-footer

## Self-Check: PASSED

All 6 files verified on disk. Both task commits (576efe4, ce29ec5) verified in git log.

---
*Phase: 02-public-marketing-site*
*Completed: 2026-03-28*
