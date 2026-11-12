Quartz bilingual copy and inquiry implementation report — 2026-11-13

1. Files changed

Implemented the requested worldwide positioning, bilingual copy edits, form validation and persistence, offer context, service links, illustration labelling and contrast, Arabic SEO titles, breadcrumbs and localized RSS metadata. Work is uncommitted.

Backend and seeded copy:

- `app/Http/Controllers/ContactController.php`
- `app/Http/Controllers/RssFeedController.php`
- `app/Http/Controllers/ServiceController.php`
- `app/Http/Requests/ContactRequest.php`
- `app/Services/SeoService.php`
- `database/seeders/IndustryContentSeeder.php`
- `database/seeders/LandingContentSeeder.php`
- `database/seeders/LegalPageSeeder.php`
- `database/seeders/Phase04VerificationSeeder.php`
- `database/seeders/ServicePageContentSeeder.php`

Public components and translations:

- `resources/js/components/contact-form.tsx`
- `resources/js/components/industries/industry-visual.tsx`
- `resources/js/components/landing-b/landing-cases.tsx`
- `resources/js/components/landing-b/landing-contact.tsx`
- `resources/js/components/landing-b/landing-faq.tsx`
- `resources/js/components/landing-b/landing-footer.tsx`
- `resources/js/components/landing-b/landing-hero.tsx`
- `resources/js/components/landing-b/landing-nav.tsx`
- `resources/js/components/landing-b/landing-platform-cards.tsx`
- `resources/js/components/landing-b/landing-process.tsx`
- `resources/js/components/landing-b/landing-services.tsx`
- `resources/js/components/landing-b/landing-world.tsx`
- `resources/js/components/services/service-detail.tsx`
- `resources/js/components/services/service-visual.tsx`
- `resources/js/layouts/public-layout.tsx`
- `resources/js/pages/public/home.tsx`
- `resources/js/pages/public/industries/show.tsx`
- `resources/js/pages/public/services/index.tsx`
- `resources/lang/ar.json`
- `resources/lang/en.json`
- `resources/js/hooks/use-contact-draft.ts`
- `resources/js/lib/contact-validation.ts`

Tests and review artifacts:

- `tests/Feature/IndustryPagesTest.php`
- `tests/Feature/PublicContentAuditTest.php`
- `tests/Feature/ServicePagesTest.php`
- `tests/Feature/ServicesIndexTest.php`
- `tests/Feature/WorldwideCopyTest.php`
- `scripts/check-public-copy.sh`
- `docs/audits/2026-11-13-copy-self-check.txt`
- `docs/audits/2026-11-13-copy-implementation-report.md`

`resources/js/hooks/use-locale.tsx` also has a concurrent workspace change; this implementation did not modify it. The original input audit was already present as an untracked file and was not edited.

2. Important copy before → after

| Location | Before | After |
|---|---|---|
| Hero, EN accessible heading | We build software, automation, quality and security that lasts. | We build custom software, connect your systems, and test and secure what you rely on. |
| Hero, AR accessible heading | نبني برمجيات وأتمتة وجودة وحماية تدوم. | نبني برمجيات تناسب عملك، ونربط أنظمتك ونختبرها ونؤمّنها. |
| Hero, visible rotating text | We build [software / automation / quality / security] that lasts. / نبني [برمجيات / أتمتة / جودة / حماية] تدوم. | We [build / connect / test / secure] your software. / برمجياتك، [نبنيها / نربطها / نختبرها / نؤمّنها] لتخدم عملك. |
| Footer, EN | Software, automation, QA and cybersecurity from one remote team serving the Gulf and the wider region. | Software, automation, QA and cybersecurity from a remote team working with clients worldwide, mostly in the US and Europe. |
| Footer, AR | برمجيات وأتمتة وضمان جودة وأمن سيبراني، من فريق واحد يعمل عن بُعد ويخدم دول الخليج والمنطقة. | برمجيات وأتمتة وضمان جودة وأمن سيبراني، من فريق يعمل عن بُعد مع عملاء حول العالم، أغلبهم في الولايات المتحدة وأوروبا. |
| Team-location FAQ, EN | A remote team serving the Gulf and the wider region, with one dedicated lead per project. | We work remotely with clients worldwide, mostly in the US and Europe, with one dedicated lead per project. |
| Team-location FAQ, AR | فريق عن بُعد يخدم دول الخليج والمنطقة، بقائد مخصّص لكل مشروع. | نعمل عن بُعد مع عملاء حول العالم، أغلبهم في الولايات المتحدة وأوروبا، مع قائد مخصّص لكل مشروع. |
| CTA, EN / AR | Book a Call / احجز مكالمة | Request a call / اطلب مكالمة |
| Home service-group label, EN / AR | Scope / النطاق | Service you need / الخدمة التي تحتاجها |
| Home message label, EN / AR | What do you need built or secured? / ما الذي تحتاج بناءه أو تأمينه؟ | What do you need help with? / ما المشكلة التي تريد حلّها؟ |
| Name validation, EN / AR | Browser/framework required-field messages | Enter your name. / أدخل اسمك. |
| Missing email, EN / AR | Browser/framework required-field messages | Enter your email address. / أدخل بريدك الإلكتروني. |
| Invalid email, EN / AR | Browser-specific explanation about @, sometimes English on Arabic pages | Enter a valid email address, such as name@company.com. / أدخل بريداً إلكترونياً صالحاً، مثل name@company.com. |
| Service validation, EN / AR | The service field is required. / حقل الخدمة مطلوب. | Choose a service, or select General Inquiry. / اختر خدمة، أو اختر «استفسار عام». |
| Message validation and up-front hint, EN / AR | Browser/framework length errors; no hint on /contact | Please write at least 10 characters. / اكتب رسالة من 10 أحرف على الأقل. |

Industry standards (these are project requirements we build for/review against; the client retains final compliance sign-off):

| Sector and language | Before | After |
|---|---|---|
| retail-pos, EN | ZATCA e-invoicing (Fatoora)؛ VAT across GCC markets؛ Customer data under PDPL؛ An audit trail for every sale | PCI DSS scope reduction؛ EN 16931 / Peppol e-invoicing؛ GDPR / CCPA customer data؛ WCAG storefront accessibility |
| retail-pos, AR | الفوترة الإلكترونية (فاتورة)؛ ضريبة القيمة المضافة في دول الخليج؛ بيانات العملاء ونظام حماية البيانات الشخصية؛ سجل تدقيق لكل عملية بيع | تقليل نطاق PCI DSS؛ الفوترة الإلكترونية وفق EN 16931 وPeppol؛ بيانات العملاء وفق GDPR وCCPA؛ سهولة الوصول للمتاجر وفق WCAG |
| healthcare, EN | PDPL and health data؛ NPHIES insurance exchange؛ HL7 FHIR interoperability؛ Hosting and data location | HIPAA safeguards؛ GDPR special-category health data؛ HL7 FHIR interoperability؛ Audit trails and data residency |
| healthcare, AR | نظام حماية البيانات الشخصية والبيانات الصحية؛ منصة نفيس للتأمين الصحي؛ التشغيل البيني عبر HL7 FHIR؛ الاستضافة وموقع البيانات | ضمانات HIPAA؛ البيانات الصحية ذات الفئة الخاصة وفق GDPR؛ التشغيل البيني عبر HL7 FHIR؛ سجلات التدقيق وموقع البيانات |
| financial-services, EN | SAMA Cyber Security Framework؛ NCA Essential Cybersecurity Controls؛ PDPL and customer records؛ An audit trail by design | PCI DSS and SOC 2 readiness؛ PSD2 and open-banking APIs؛ DORA operational resilience؛ KYC / AML workflows and GDPR |
| financial-services, AR | إطار الأمن السيبراني للبنك المركزي السعودي؛ الضوابط الأساسية للأمن السيبراني؛ نظام حماية البيانات الشخصية وسجلات العملاء؛ سجل تدقيق مبني في التصميم | PCI DSS والاستعداد لتدقيق SOC 2؛ PSD2 وواجهات الخدمات المصرفية المفتوحة؛ المرونة التشغيلية وفق DORA؛ مسارات KYC وAML وحماية البيانات وفق GDPR |
| government, EN | Digital Government Authority standards؛ WCAG 2.1 AA accessibility؛ National identity sign-in؛ NCA controls and data classification | WCAG 2.2 AA؛ Section 508 and the European Accessibility Act؛ SAML / OpenID Connect SSO؛ Data residency and audit logging |
| government, AR | معايير هيئة الحكومة الرقمية؛ سهولة الوصول وفق WCAG 2.1 AA؛ الدخول عبر الهوية الوطنية؛ ضوابط الهيئة الوطنية للأمن السيبراني وتصنيف البيانات | WCAG 2.2 AA؛ Section 508 وقانون الإتاحة الأوروبي؛ الدخول الموحّد عبر SAML وOpenID Connect؛ توطين البيانات وسجلات التدقيق |
| education, EN | PDPL and minors’ data؛ National education platforms؛ Accessibility and Arabic content؛ Safe messaging | FERPA and COPPA؛ GDPR and minors’ data؛ LTI / xAPI and student information systems؛ WCAG accessibility |
| education, AR | نظام حماية البيانات الشخصية وبيانات القُصّر؛ المنصات التعليمية الوطنية؛ سهولة الوصول والمحتوى العربي؛ تواصل آمن | FERPA وCOPPA؛ GDPR وبيانات القُصّر؛ LTI وxAPI وأنظمة معلومات الطلاب؛ سهولة الوصول وفق WCAG |

The retail page mentions ZATCA once per locale as a local e-invoicing example, alongside EN 16931 / Peppol. Cybersecurity now describes OWASP Top 10 / ASVS testing, NIST CSF, ISO 27001-aligned controls, SOC 2 readiness and applicable NIS2 requirements. No certification claim was added.

The explicit client commitments remain: free intro call; ownership of the diagnostic plan whoever implements it; same-day reporting of blocking QA bugs; a yearly penetration test in the security retainer; NDA before any access; deletion of test data and credentials at the end. The industries index still offers to walk clients through relevant work we are able to share on a call.

3. Audit rows deliberately not applied

- Functional §2 #1 and copy §3 #84–#85: legal placeholders require owner decisions and were explicitly excluded.
- Functional §2 #11: named team and experience information requires verified owner input and was explicitly excluded.
- Functional §2 #13: keyboard alternatives for canvas building selection were explicitly out of scope.
- Functional §2 #14: feed metadata was localized; origin/port handling was explicitly out of scope. Feed URLs still use APP_URL.
- Rows marked OK were preserved, except the binding worldwide footer correction (#73–#74), the global call labels, and the offer CTA specificity expressly required by the functional brief (#127–#128). Home service-choice wording (#89/#93), portfolio empty states, existing contact placeholders and success copy remain as audited.
- #43–#44 use a complete localized template with the quoted option title and agreed scope, rather than joining a title to an ungrammatical duration fragment. #47 uses generic documented e-invoicing integrations to satisfy the positioning correction. #49 translates the shared REST/webhook tool label at render time because the seeded tools array is shared between languages.
- #81 is fixed in `resources/lang/ar.json` because the effective-date label is rendered from `legal.effective`, not stored in LegalPageSeeder. Legal body changes remain limited to the exact #79, #80, #82 and #83 phrases and the requested live-system deletion wording, promptly ⇔ دون تأخير.

4. Self-check output and gates

Full grep output: [2026-11-13-copy-self-check.txt](2026-11-13-copy-self-check.txt). Reproduce with `bash scripts/check-public-copy.sh`.

```text
Marketing copy matches: 0
LegalPageSeeder matches: 8 (6 unchanged legal-regime references; 2 substring matches for نفاذ inside إنفاذ / للإنفاذ)
ZATCA examples: 2 source lines, one in EN retail and one in AR retail; once on each rendered retail page
PHP syntax: 15 changed/new files checked; 0 failures
JSON: both valid; no duplicate keys; 514 identical keys
TypeScript/TSX syntax: 21 files passed (transpile only)
Shared draft and validation helpers: strict TypeScript check passed using cached React types
Client validation: valid/empty fields, invalid email, short/long messages, Arabic text and phone limits passed in both languages
Seeder structure: industry and service array keys, lengths and non-string values preserved
Illustration caption contrast on elevated background: dark 6.19:1; light 5.50:1
Whitespace: git diff --check passed
```

PHPUnit was attempted both for WorldwideCopyTest and the full suite; neither could start because `vendor/autoload.php` is absent. `npm run types:check` could not start because local tsc/dependencies are absent. An offline install of the existing lockfile failed with ENOTCACHED for zod-4.3.6; no package or lockfile changed. A cached compiler confirms syntax and helper types but cannot replace the full application type gate. Docker compose access was denied by the sandbox socket policy. Browser interactions and success focus were not runtime-verified here.

5. Orchestrator follow-up

- Review the diff and run the repository's Docker gates, including PHP tests, TypeScript, lint and build. New regression coverage is in `tests/Feature/WorldwideCopyTest.php`; existing copy assertions were updated.
- Re-seed `LandingContentSeeder`, `ServicePageContentSeeder`, `IndustryContentSeeder` and `LegalPageSeeder` after reviewing any admin-managed DB edits. The landing seeder keeps sample case studies hidden. Obsolete proof figures in publicly supplied legacy product stats and translation values were cleared; only verified product/user proof remains.
- Review existing `seo_metadata` overrides for home/about/services/contact and service or industry detail pages; DB descriptions take precedence over code defaults. The home description in Phase04VerificationSeeder was updated, but update that metadata row specifically rather than running the whole verification seeder and its sample-content setup.
- Do not rerun ContentSeeder or SiteSettingsSeeder solely for this change; no changes there are needed. Clear application/config caches as appropriate after deployment and metadata updates.
- In EN and AR, check empty/invalid submission focus, radio arrows/tab order, locale switches with drafts, explicit new offer context versus an existing draft, successful-submission focus/storage clearing, and storage-disabled browsing. Verify both themes at mobile and desktop widths.
- Verify APP_URL uses the deployment's real public origin (including a local port where relevant), then inspect RSS destinations. Owner legal placeholders, identifiable team information, portfolio publication and the map keyboard alternative remain separate work.
