# Launch checklist

Open items before and after launching the Quartz public site. Last updated 2026-11-13.

Positioning: Quartz is a remote team working with clients worldwide, mostly in the US and Europe. Owner rules for all copy:
- no delivery timelines;
- no prices;
- no payment-gateway selling points;
- no invented clients, testimonials, certifications or statistics.

The only proof numbers are **13+ live websites/products** and **500K+ users**.

## Owner input (blocks launch)

- [ ] **Legal details.** Admin → Site Settings → *Legal & company details*: registered address, governing law, dispute venue, liability cap. Empty fields show `[… TO BE SPECIFIED]` on `/privacy` and `/terms`.
- [ ] **Legal text review.** The privacy policy and terms still list Saudi PDPL among the applicable laws. GDPR, CCPA and others are already present. Have the documents reviewed for US/EU clients. The legal text was intentionally not rewritten by AI.
- [ ] **Team / About.** Add real people in Admin → Team Members ("Show on website" switch). Delete the 4 invented members (hidden, still stored). An end-user audit found that anonymous people are the biggest trust gap.
- [ ] **Social links.** Admin → Site Settings. LinkedIn, Twitter and GitHub currently point to `/quart` accounts that are not ours.

## Content clean-up (admin)

- [ ] Portfolio: 4 invented items are saved as drafts (TechRetail, FinanceFlow, MedSecure, Quartz POS). Replace them with real work when ready.
- [ ] Blog: 7 stub posts are saved as drafts. Publish real articles; the RSS feed is empty until then.
- [ ] Delete the remaining invented records that are hidden but still stored:
  - 3 testimonials
  - 3 homepage case studies
  - 10 client logos in `landing_client_logos` (Northwind, ACME, …)
  - the `landing_products` rows (Quartz POS / Quartz Cyber), which are no longer marketed

## Production deployment

- [ ] Set `APP_URL=https://quartz-solutions.net`. Canonical tags, the sitemap and RSS links depend on it.
- [ ] Set `ADMIN_SEED_PASSWORD`, and change the existing admin password (dev default: `password`).
- [ ] Run the migrations, then these seeders: `ServicePageContentSeeder`, `IndustryContentSeeder`, `LandingContentSeeder`, `LegalPageSeeder`.
- [ ] Update the home row in `seo_metadata` (Admin → SEO) to the worldwide description. It was changed directly in the dev DB only.
- [ ] Verify lead notifications: does a contact submission email someone, or does it only appear in Admin → Contact Leads?
- [ ] Confirm Inertia SSR runs in production. Titles and meta tags are already rendered server-side in `app.blade.php`.

## Technical follow-ups

- [ ] `LandingContentSeeder` upserts FAQs and case studies by their English text. Changing that text and re-seeding creates duplicates (this happened once on 2026-11-13 and was fixed by hand). Key them on a stable column instead.
- [ ] Homepage map: buildings cannot be selected by keyboard. Add labelled buttons or a text list (audit item #13).
- [ ] Homepage services and process steps have no `is_visible` toggle; FAQs and case studies do.
- [ ] Remove unused code:
  - `landing-b/landing-platform-cards.tsx`, `landing-b/landing-products.tsx`
  - `components/process-steps.tsx`, `industry-tabs.tsx`
  - the old `site-header` / `site-footer`
  - the dead `--site-primary-color` effect in `layouts/public-layout.tsx`
  - the unused `nextSortOrder` prop in `TeamMemberController::create`
- [ ] `routes/admin.php` registers `GET admin/seo` twice; the `role:admin` copy wins. Remove the duplicate.
- [ ] Admin UI is English-only and uses the default teal accent rather than the brand gold.

## Growth (after launch)

- [ ] Real booking for "Request a call": Cal.com or Calendly.
- [ ] Analytics (GA4 or Plausible), Google Search Console, and a cookie-consent banner for EU visitors.
- [ ] LinkedIn company page and a one-page capability PDF (EN + AR).
- [ ] Case studies from the 13+ live products, once they can be shared.

## Reference

- End-user and copy audit: `docs/audits/2026-11-13-end-user-copy-audit.md`
- Copy implementation report: `docs/audits/2026-11-13-copy-implementation-report.md`
- Design briefs:
  - `docs/design/services-inspiration.md`
  - `docs/design/industries-inspiration.md`
