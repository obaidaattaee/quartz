<?php

namespace Database\Seeders;

use App\Models\Industry;
use Illuminate\Database\Seeder;

/**
 * Full bilingual copy for the industries index and the five sector pages.
 *
 * Overwrites the rows created by the 2026_04_17 seed migration with the
 * structured content the redesigned pages render. Everything here is
 * editable from the admin afterwards.
 *
 * Copy rules (owner decisions): no timelines or durations, no prices, no
 * payment-gateway selling points, no invented clients, numbers,
 * certifications or testimonials. Regulations are named only as things we
 * build for or review against. Example systems are illustrative and are
 * labelled as such on the page.
 */
class IndustryContentSeeder extends Seeder
{
    public function run(): void
    {
        foreach (self::content() as $slug => $content) {
            $attributes = [
                'sort_order' => $content['sort_order'],
                'primary_service' => $content['primary_service'],
                'is_visible' => true,
            ];

            foreach (['en', 'ar'] as $locale) {
                $c = $content[$locale];

                $attributes += [
                    "title_{$locale}" => $c['title'],
                    "tagline_{$locale}" => $c['tagline'],
                    "hero_blurb_{$locale}" => $c['lead'],
                    "summary_{$locale}" => $c['summary'],
                    "audience_{$locale}" => $c['audience'],
                    "challenges_{$locale}" => array_map(
                        fn (array $p) => ['title' => $p[0], 'description' => $p[1]],
                        $c['realities'],
                    ),
                    "solutions_{$locale}" => array_map(
                        fn (array $s) => ['title' => $s[1], 'description' => $s[2], 'service' => $s[0]],
                        $c['solutions'],
                    ),
                    "compliance_note_{$locale}" => $c['compliance_note'],
                    "compliance_items_{$locale}" => array_map(
                        fn (array $i) => ['name' => $i[0], 'description' => $i[1]],
                        $c['compliance'],
                    ),
                    "examples_{$locale}" => array_map(
                        fn (array $e) => ['title' => $e[0], 'description' => $e[1]],
                        $c['examples'],
                    ),
                    "faqs_{$locale}" => array_map(
                        fn (array $f) => ['question' => $f[0], 'answer' => $f[1]],
                        $c['faqs'],
                    ),
                    "cta_text_{$locale}" => $c['cta'],
                ];
            }

            Industry::updateOrCreate(['slug' => $slug], $attributes);
        }
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public static function content(): array
    {
        return [
            'retail-pos' => [
                'sort_order' => 10,
                'primary_service' => 'development',
                'en' => [
                    'title' => 'Retail & point of sale',
                    'tagline' => 'Retail systems where every branch, shelf and receipt tells the same story',
                    'lead' => 'Point-of-sale, stock and e-invoicing software for retailers with multiple branches and online stores. We build around your process, connect the systems you already run, and test them before your staff rely on them.',
                    'summary' => 'Point-of-sale, multi-branch stock and e-invoicing systems built around how you trade.',
                    'audience' => 'Retail chains, franchise operators and distributors with more than one branch, and the IT and operations leads who run their systems.',
                    'realities' => [
                        ['Stock that disagrees with itself', 'The system says three in stock and the shelf is empty. Branch, warehouse and online counts drift apart long before closing time.'],
                        ['E-invoicing bolted on in a rush', 'E-invoicing was added under deadline pressure, and now a price or tax change can cause rejected invoices.'],
                        ['A till that stops when the internet does', 'A dropped connection at the counter means a queue, handwritten notes and a painful reconciliation at closing.'],
                        ['Reports that arrive after the decision', 'Head office waits for branch spreadsheets to see what sold, so promotions and reorders are guesses.'],
                    ],
                    'solutions' => [
                        ['development', 'Point of sale and back office', 'A till built around your cashiers’ real steps, with an offline mode that queues sales and syncs when the connection returns, plus a back office for prices, promotions and user roles.'],
                        ['development', 'One stock ledger for every branch', 'Branches, warehouse and online store share one stock record, with transfers, counts and low-stock alerts.'],
                        ['automation', 'E-invoicing and accounting sync', 'Invoices generated in the formats your markets require, with sales posted to accounting or ERP without repeated data entry.'],
                        ['qa', 'Peak-season testing', 'Load and offline tests on the checkout flow before your busiest season, and regression checks on every release.'],
                        ['cybersecurity', 'Staff access and sensitive actions', 'Role-based access for cashiers, supervisors and head office, audit logs on refunds and price overrides, and a security review of the till and its integrations.'],
                    ],
                    'compliance_note' => 'We build for and review against the requirements that apply to your project. Your compliance owners and advisers keep the final sign-off.',
                    'compliance' => [
                        ['PCI DSS scope reduction', 'We design data flows to keep card data out of your application where possible, and review storage and access boundaries against PCI DSS requirements.'],
                        ['EN 16931 / Peppol e-invoicing', 'We build and test invoice formats and exchange workflows for the markets you serve, including local regimes such as ZATCA where applicable.'],
                        ['GDPR / CCPA customer data', 'We build consent and privacy-request workflows with retention and access controls, accounting for local data-protection laws wherever you operate.'],
                        ['WCAG storefront accessibility', 'We review storefront journeys for keyboard access, screen-reader support and readable contrast against WCAG, with audit logs for sensitive retail actions.'],
                    ],
                    'examples' => [
                        ['Multi-branch grocery point of sale', 'Tills keep selling offline, sales sync into one stock ledger, invoices reach the required reporting system, and head office sees sales by branch.'],
                        ['Van sales app for a distributor', 'Sales reps take orders on a phone, print the e-invoice on a portable printer, and stock updates as soon as the van is back in coverage.'],
                        ['Franchise reporting hub', 'Each franchisee keeps its own point of sale, and a reporting layer pulls daily sales and franchise fees into one dashboard.'],
                    ],
                    'faqs' => [
                        ['Can you work with the point-of-sale system we already have?', 'Often, yes. If it has an API or a database we can read, we connect it to stock, accounting and e-invoicing. If it is the bottleneck, the written plan says so and proposes replacing it in stages.'],
                        ['Can you support e-invoicing in our markets?', 'We review the invoice formats, exchange protocols and reporting rules that apply, then build and test the integration. Your tax adviser confirms the requirements and signs off on the setup.'],
                        ['Will the till keep selling if the internet drops?', 'That is a design requirement, not an extra. The till stores sales locally and prints receipts, then syncs stock and invoices when the connection returns, and we test exactly that before launch.'],
                        ['How long will it take, and what will it cost?', 'It depends on the number of branches, the integrations and what already exists. After a first call we send a written plan with scope, schedule and cost, and you decide before anything is signed.'],
                        ['Who owns the code and the data?', 'You do. The code lives in your repository, the data in your cloud or on your servers, and the handover includes documentation and full admin access.'],
                    ],
                    'cta' => 'Request a call about your retail system',
                ],
                'ar' => [
                    'title' => 'التجزئة ونقاط البيع',
                    'tagline' => 'أنظمة تجزئة تجعل كل فرع وكل رف وكل فاتورة تنطق بالأرقام نفسها',
                    'lead' => 'نبني أنظمة نقاط البيع والمخزون والفوترة الإلكترونية للمتاجر متعددة الفروع والمتاجر الإلكترونية. نصمّمها حول إجراءاتك، ونربطها بالأنظمة التي تستخدمها، ونختبرها قبل أن يعتمد عليها موظفوك.',
                    'summary' => 'أنظمة نقاط بيع ومخزون موحّد بين الفروع وفوترة إلكترونية، مبنية على طريقة عملك.',
                    'audience' => 'سلاسل التجزئة ومشغّلو الامتياز التجاري والموزّعون الذين لديهم أكثر من فرع، ومديرو التقنية والعمليات الذين يديرون أنظمتهم.',
                    'realities' => [
                        ['مخزون لا يتفق مع نفسه', 'النظام يقول ثلاث قطع والرف فارغ. أرقام الفرع والمستودع والمتجر الإلكتروني تتباعد قبل أن ينتهي اليوم.'],
                        ['فوترة إلكترونية أُضيفت على عجل', 'أُضيفت الفوترة الإلكترونية تحت ضغط الموعد، وصار كل تعديل في السعر أو الضريبة قد يؤدي إلى رفض الفاتورة.'],
                        ['كاشير يتوقف إذا انقطع الإنترنت', 'انقطاع الاتصال عند نقطة البيع يعني طابوراً وأوراقاً بخط اليد وتسوية مرهقة عند الإغلاق.'],
                        ['تقارير تصل بعد فوات القرار', 'تنتظر الإدارة ملفات إكسل من الفروع لتعرف ما بيع، فتصبح العروض وطلبات الشراء تخميناً.'],
                    ],
                    'solutions' => [
                        ['development', 'نقطة بيع ولوحة إدارة', 'نقطة بيع مبنية على خطوات الكاشير الفعلية، تعمل دون اتصال وتحفظ المبيعات ثم تزامنها عند عودة الشبكة، مع لوحة إدارة للأسعار والعروض وصلاحيات المستخدمين.'],
                        ['development', 'سجل مخزون واحد لكل الفروع', 'الفروع والمستودع والمتجر الإلكتروني تتشارك سجل مخزون واحداً، مع التحويل بين الفروع والجرد وتنبيهات النقص.'],
                        ['automation', 'الفوترة الإلكترونية وربط المحاسبة', 'إصدار الفواتير بالصيغ المطلوبة في أسواقك، وترحيل المبيعات إلى نظام المحاسبة أو ERP دون إعادة إدخال البيانات.'],
                        ['qa', 'اختبار مواسم الذروة', 'اختبارات تحمّل وانقطاع اتصال على مسار البيع قبل موسمك الأعلى، واختبارات الانحدار مع كل إصدار جديد.'],
                        ['cybersecurity', 'صلاحيات الموظفين والعمليات الحساسة', 'صلاحيات حسب الدور للكاشير والمشرف والإدارة، وسجل تدقيق للمرتجعات وتعديل الأسعار، ومراجعة أمنية لنقطة البيع وتكاملاتها.'],
                    ],
                    'compliance_note' => 'نبني وفق المتطلبات المنطبقة على مشروعك ونراجع العمل على أساسها. ويبقى الاعتماد النهائي لدى مسؤولي الامتثال ومستشاريك.',
                    'compliance' => [
                        ['تقليل نطاق PCI DSS', 'نصمّم تدفّق البيانات لإبقاء بيانات البطاقات خارج تطبيقك حيثما أمكن، ونراجع حدود التخزين والوصول وفق متطلبات PCI DSS.'],
                        ['الفوترة الإلكترونية وفق EN 16931 وPeppol', 'نبني صيغ الفواتير ومسارات تبادلها ونختبرها وفق متطلبات أسواقك، بما فيها الأنظمة المحلية مثل ZATCA حيث تنطبق.'],
                        ['بيانات العملاء وفق GDPR وCCPA', 'نبني مسارات الموافقة وطلبات الخصوصية وضوابط الاحتفاظ والوصول، مع مراعاة قوانين حماية البيانات المحلية حيثما تعمل.'],
                        ['سهولة الوصول للمتاجر وفق WCAG', 'نراجع مسارات المتجر وفق WCAG لاستخدام لوحة المفاتيح وقارئات الشاشة والتباين المقروء، مع سجلات تدقيق للعمليات الحساسة.'],
                    ],
                    'examples' => [
                        ['نقاط بيع لسلسلة بقالة متعددة الفروع', 'تواصل نقاط البيع العمل دون اتصال، وتتزامن المبيعات في سجل مخزون واحد، وتصل الفواتير إلى نظام الإبلاغ المطلوب، وترى الإدارة المبيعات حسب الفرع.'],
                        ['تطبيق مبيعات لمندوبي التوزيع', 'يستقبل المندوب الطلبات على جواله، ويطبع الفاتورة الإلكترونية على طابعة محمولة، ويتحدّث المخزون بمجرد عودة السيارة إلى نطاق التغطية.'],
                        ['لوحة تقارير للامتياز التجاري', 'يحتفظ كل صاحب امتياز بنظام نقاط البيع الخاص به، وتجمع طبقة التقارير المبيعات اليومية ورسوم الامتياز في لوحة واحدة.'],
                    ],
                    'faqs' => [
                        ['هل يمكن العمل مع نظام نقاط البيع الحالي بدلاً من استبداله؟', 'في حالات كثيرة نعم. إذا كانت له واجهة برمجية أو قاعدة بيانات يمكن قراءتها، نربطه بالمخزون والمحاسبة والفوترة الإلكترونية. وإذا كان هو أصل المشكلة، توضّح الخطة المكتوبة ذلك وتقترح استبداله على مراحل.'],
                        ['هل تدعمون الفوترة الإلكترونية في أسواقنا؟', 'نراجع صيغ الفواتير وبروتوكولات تبادلها وقواعد الإبلاغ المطلوبة، ثم نبني التكامل ونختبره. ويؤكد مستشارك الضريبي المتطلبات ويعتمد الإعدادات النهائية.'],
                        ['هل يستمر البيع إذا انقطع الإنترنت؟', 'هذا شرط في التصميم لا إضافة اختيارية. تحفظ نقطة البيع العمليات محلياً وتطبع الإيصالات، ثم تزامن المخزون والفواتير عند عودة الاتصال، ونختبر هذا السيناريو تحديداً قبل الإطلاق.'],
                        ['كم يستغرق المشروع وكم يكلّف؟', 'يعتمد ذلك على عدد الفروع والتكاملات وما هو موجود لديك. بعد المكالمة الأولى نرسل خطة مكتوبة تحدد النطاق والجدول الزمني والتكلفة، وتقرّر قبل توقيع أي شيء.'],
                        ['لمن تعود ملكية الشيفرة والبيانات؟', 'لك. الشيفرة في مستودعك، والبيانات على سحابتك أو خوادمك، ويشمل التسليم التوثيق وصلاحيات الإدارة كاملة.'],
                    ],
                    'cta' => 'اطلب مكالمة عن نظام متجرك',
                ],
            ],

            'healthcare' => [
                'sort_order' => 20,
                'primary_service' => 'development',
                'en' => [
                    'title' => 'Healthcare',
                    'tagline' => 'Clinic and hospital software that respects patients, clinicians and the data between them',
                    'lead' => 'Appointment, patient-record and insurance workflows for healthcare providers. Designed around patients’ language and access needs, clinicians’ daily work, health-data privacy and the integrations your payers require.',
                    'summary' => 'Patient apps, clinic workflows and insurance integrations, designed around health-data privacy.',
                    'audience' => 'Clinic groups, hospitals, labs, pharmacies and health-tech founders, and the operations and IT leads who run their systems.',
                    'realities' => [
                        ['Bookings that live in the reception phone', 'Appointments are taken by phone and chat, reminders are manual, and a no-show is discovered when the slot is already lost.'],
                        ['Claims rejected for small reasons', 'Insurance claims bounce on a missing code or mismatched data, and staff re-key them between systems.'],
                        ['Records scattered across systems', 'Lab results, prescriptions and visit notes sit in separate tools, so clinicians search instead of treating.'],
                        ['Privacy handled by habit', 'Nobody logs who opened which file, and patient data goes out by email because it is the easy route.'],
                    ],
                    'solutions' => [
                        ['mobile-apps', 'Patient app and portal', 'Booking, reminders, results and visit history in your patients’ languages on mobile and web, with sign-in suited to their needs.'],
                        ['development', 'Clinic workflow system', 'Scheduling, triage, visit notes and referrals in one place, shaped around your clinicians’ actual steps.'],
                        ['automation', 'Insurance and claims automation', 'Eligibility checks, claim preparation and status tracking connected to the insurance exchange your payers use, with rejections routed back for correction.'],
                        ['cybersecurity', 'Access control and audit trail', 'Role-based access to records, every read and edit logged, encrypted storage, and a security review before launch.'],
                        ['qa', 'Clinical-flow testing', 'Scenario tests on booking, prescribing and claims, including Arabic names, Hijri dates and the edge cases that break forms.'],
                    ],
                    'compliance_note' => 'We build for and review against the requirements that apply to your project. Your compliance owners and advisers keep the final sign-off.',
                    'compliance' => [
                        ['HIPAA safeguards', 'Where HIPAA applies, we design access controls, encryption and technical safeguards around your risk assessment and agreed responsibilities.'],
                        ['GDPR special-category health data', 'We build purpose limits, retention rules and patient-rights workflows around the legal basis and conditions your privacy team confirms.'],
                        ['HL7 FHIR interoperability', 'We connect clinical systems through supported FHIR resources, document field mappings and test message validation.'],
                        ['Audit trails and data residency', 'We log access and changes to patient records, and deploy to the location your policies and regulator require, under your control.'],
                    ],
                    'examples' => [
                        ['Booking platform for a clinic group', 'Patients book at any branch in Arabic or English and receive reminders and results, while reception sees one schedule for every doctor.'],
                        ['Claims preparation workflow', 'Visit data is checked for missing codes before submission, claims go out through the insurance exchange, and rejections land in a queue with the reason.'],
                        ['Home-care visit app', 'Nurses see their route, record vitals offline and sync notes to the patient file once they are back online.'],
                    ],
                    'faqs' => [
                        ['Do you build complete hospital information systems?', 'We build what sits around one: patient apps, clinic workflows, claims automation and integrations. If you already run a hospital information system or an EMR, we connect to it rather than compete with it.'],
                        ['Where will patient data be stored?', 'Wherever your policy and regulator require. We deploy to your cloud account or servers, in-country when needed, and you hold the keys.'],
                        ['Do you hold healthcare compliance certificates?', 'We design and review technical controls against the HIPAA and GDPR requirements that apply, document them, and provide evidence for your compliance team. Final compliance sign-off remains with you and your advisers.'],
                        ['Can doctors work in English while patients see Arabic?', 'Yes. Each user picks a language, and records, names and dates are stored once and shown correctly in both.'],
                        ['How do we start?', 'A first call about your workflow and systems, then a written plan with scope, schedule and cost. Nothing is built before you approve it.'],
                    ],
                    'cta' => 'Request a call about your healthcare system',
                ],
                'ar' => [
                    'title' => 'الرعاية الصحية',
                    'tagline' => 'برمجيات للعيادات والمستشفيات تحترم المريض والطبيب والبيانات التي بينهما',
                    'lead' => 'نبني مسارات المواعيد وملفات المرضى والتأمين لمقدّمي الرعاية الصحية، بما يناسب لغة المرضى واحتياجاتهم، وعمل الأطباء اليومي، وخصوصية البيانات الصحية، والتكاملات التي تطلبها شركات التأمين.',
                    'summary' => 'تطبيقات للمرضى، وتنظيم لسير العمل في العيادات، وتكاملات مع التأمين، مصمّمة حول خصوصية البيانات الصحية.',
                    'audience' => 'مجمّعات العيادات والمستشفيات والمختبرات والصيدليات ومؤسسو الشركات الناشئة في التقنية الصحية، ومديرو العمليات والتقنية الذين يديرون أنظمتها.',
                    'realities' => [
                        ['مواعيد تعيش في هاتف الاستقبال', 'الحجوزات تتم بالهاتف والمحادثات، والتذكير يدوي، ولا يُكتشف غياب المريض إلا حين يكون الموعد قد ضاع.'],
                        ['مطالبات تُرفض لأسباب صغيرة', 'ترتدّ مطالبات التأمين بسبب رمز ناقص أو بيانات غير متطابقة، ويعيد الموظفون إدخالها بين الأنظمة.'],
                        ['سجلات موزّعة بين الأنظمة', 'نتائج المختبر والوصفات وملاحظات الزيارة في أنظمة منفصلة، فيقضي الطبيب وقته في البحث بدلاً من العلاج.'],
                        ['خصوصية تُدار بالعادة لا بالنظام', 'لا أحد يسجّل من فتح أي ملف، وتُرسل بيانات المرضى بالبريد الإلكتروني لأنه الطريق الأسهل.'],
                    ],
                    'solutions' => [
                        ['mobile-apps', 'تطبيق وبوابة للمرضى', 'حجز وتذكير ونتائج وسجل زيارات بلغات مرضاك على الجوال والويب، مع طريقة دخول تناسب احتياجاتهم.'],
                        ['development', 'نظام لسير العمل في العيادة', 'الجدولة والفرز وملاحظات الزيارة والإحالات في مكان واحد، مبنية على خطوات أطبائك الفعلية.'],
                        ['automation', 'أتمتة التأمين والمطالبات', 'التحقق من الأهلية وتجهيز المطالبات ومتابعة حالتها، مربوطة بمنصة التبادل التي تعتمدها شركات التأمين، مع إعادة المرفوض منها للتصحيح.'],
                        ['cybersecurity', 'التحكم في الوصول وسجل التدقيق', 'صلاحيات الوصول إلى الملفات حسب الدور، وتسجيل كل اطّلاع وتعديل، وتشفير البيانات المخزّنة، ومراجعة أمنية قبل الإطلاق.'],
                        ['qa', 'اختبار المسارات السريرية', 'اختبارات سيناريوهات للحجز والوصف الطبي والمطالبات، تشمل الأسماء العربية والتاريخ الهجري والحالات الحدّية التي تكسر النماذج.'],
                    ],
                    'compliance_note' => 'نبني وفق المتطلبات المنطبقة على مشروعك ونراجع العمل على أساسها. ويبقى الاعتماد النهائي لدى مسؤولي الامتثال ومستشاريك.',
                    'compliance' => [
                        ['ضمانات HIPAA', 'حيث ينطبق HIPAA، نصمّم ضوابط الوصول والتشفير والضمانات التقنية وفق تقييم المخاطر والمسؤوليات المتّفق عليها.'],
                        ['البيانات الصحية ذات الفئة الخاصة وفق GDPR', 'نبني حدود الغرض وقواعد الاحتفاظ ومسارات حقوق المرضى وفق الأساس القانوني والشروط التي يؤكدها فريق الخصوصية لديك.'],
                        ['التشغيل البيني عبر HL7 FHIR', 'نربط الأنظمة السريرية عبر موارد FHIR المدعومة، ونوثّق مطابقة الحقول ونختبر صحة الرسائل.'],
                        ['سجلات التدقيق وموقع البيانات', 'نسجّل الوصول إلى ملفات المرضى والتعديلات عليها، وننشر النظام في الموقع الذي تشترطه سياستك والجهة التنظيمية وتحت سيطرتك.'],
                    ],
                    'examples' => [
                        ['منصة حجز لمجمّع عيادات', 'يحجز المريض في أي فرع بالعربية أو الإنجليزية وتصله التذكيرات والنتائج، ويرى الاستقبال جدولاً واحداً لكل الأطباء.'],
                        ['مسار تجهيز المطالبات', 'تُفحص بيانات الزيارة بحثاً عن الرموز الناقصة قبل الإرسال، وتُرسل المطالبات عبر منصة التبادل، وتعود المرفوضة إلى قائمة مع سبب الرفض.'],
                        ['تطبيق للرعاية المنزلية', 'يرى الممرّض مسار زياراته، ويسجّل العلامات الحيوية دون اتصال، وتُزامن ملاحظاته مع ملف المريض عند عودة الشبكة.'],
                    ],
                    'faqs' => [
                        ['هل تبنون نظام معلومات مستشفى متكاملاً؟', 'نبني ما يحيط به: تطبيقات المرضى، وسير العمل في العيادات، وأتمتة المطالبات، والتكاملات. وإذا كان لديك نظام معلومات صحي أو سجل طبي إلكتروني، نتكامل معه بدلاً من منافسته.'],
                        ['أين ستُحفظ بيانات المرضى؟', 'حيث تشترط سياستك والجهة التنظيمية. ننشر النظام على حسابك السحابي أو خوادمك، داخل الدولة عند الحاجة، والمفاتيح تبقى بيدك.'],
                        ['هل لديكم شهادات امتثال في القطاع الصحي؟', 'نصمّم الضوابط التقنية ونراجعها وفق متطلبات HIPAA وGDPR المنطبقة، ونوثّقها ونقدّم الأدلة لفريق الامتثال لديك. ويبقى اعتماد الامتثال النهائي مسؤوليتك ومسؤولية مستشاريك.'],
                        ['هل يمكن أن يعمل الأطباء بالإنجليزية بينما يرى المرضى العربية؟', 'نعم. يختار كل مستخدم لغته، وتُحفظ السجلات والأسماء والتواريخ مرة واحدة وتظهر صحيحة باللغتين.'],
                        ['كيف نبدأ؟', 'مكالمة أولى عن سير العمل والأنظمة لديك، ثم خطة مكتوبة تحدد النطاق والجدول الزمني والتكلفة. لا نبني شيئاً قبل موافقتك.'],
                    ],
                    'cta' => 'اطلب مكالمة عن نظامك الصحي',
                ],
            ],

            'financial-services' => [
                'sort_order' => 30,
                'primary_service' => 'automation',
                'en' => [
                    'title' => 'Financial services',
                    'tagline' => 'Financial software that moves quickly and still holds up in an audit',
                    'lead' => 'Onboarding, operations and reporting systems for finance companies, insurers, brokers and fintech teams. We automate repeated steps, connect your systems, and include security and regulatory requirements in the design.',
                    'summary' => 'Customer onboarding, back-office automation and reporting, built with security and regulators’ expectations in the design.',
                    'audience' => 'Finance and leasing companies, insurers, brokerages and fintech start-ups, plus the operations, risk and IT teams inside banks.',
                    'realities' => [
                        ['Onboarding that loses good customers', 'Applications stall on uploads, manual identity checks and back-and-forth emails, and serious applicants give up halfway.'],
                        ['Operations that run on spreadsheets', 'Reconciliations, approvals and reports live in Excel files passed between teams, with no record of who changed what.'],
                        ['Regulatory reports assembled by hand', 'Each reporting cycle means pulling data from several systems and checking it manually under pressure.'],
                        ['Security reviewed only after launch', 'The penetration test arrives at the end, findings pile up, and the release waits.'],
                    ],
                    'solutions' => [
                        ['web-development', 'Digital onboarding', 'Web and mobile application journeys with document capture, national-identity sign-in where available, and a review queue for your compliance team.'],
                        ['automation', 'Back-office automation', 'Reconciliations, approvals and document handling moved from spreadsheets into tracked workflows, each step with a clear owner.'],
                        ['development', 'Reporting and data layer', 'One reporting store fed from your core systems, so regulatory and management reports are generated, not assembled.'],
                        ['cybersecurity', 'Security built into delivery', 'Threat modelling at design, code and dependency scanning on every change, and penetration testing before release, mapped to the framework you report against.'],
                        ['qa', 'Calculation and regression testing', 'Automated tests for fees, profit rates, instalments and rounding, so a change to one rule does not quietly break another.'],
                    ],
                    'compliance_note' => 'We build for and review against the requirements that apply to your project. Your compliance owners and advisers keep the final sign-off.',
                    'compliance' => [
                        ['PCI DSS and SOC 2 readiness', 'We review card-data boundaries and implement access, change-management and logging controls, with evidence your auditors can assess.'],
                        ['PSD2 and open-banking APIs', 'We build API integrations around the consent, authentication and access rules that apply to your role and providers.'],
                        ['DORA operational resilience', 'We review recovery, incident logging and third-party dependencies against applicable EU operational-resilience requirements.'],
                        ['KYC / AML workflows and GDPR', 'We build review queues, approval trails and retention controls for identity checks and customer records. Your compliance team defines the rules and legal basis.'],
                    ],
                    'examples' => [
                        ['Financing application portal', 'Customers apply on web or mobile, upload documents once and track their status, while underwriters work from one queue with the complete file.'],
                        ['Daily reconciliation workflow', 'Bank statements and system records are matched automatically each morning, and only the exceptions reach a person, with a full log.'],
                        ['Insurance claims intake', 'Claims arrive through a multilingual form, documents are read and sorted automatically, and the adjuster opens a prepared file.'],
                    ],
                    'faqs' => [
                        ['Can you work inside our security and vendor-onboarding requirements?', 'Yes. We work through your VPN, accounts and approval process, sign NDAs and data-processing terms, and keep our access limited to what the work needs.'],
                        ['Who signs off on regulatory compliance?', 'Your compliance owners and advisers do. We build and review technical controls against the frameworks that apply, document the work, and support your auditors.'],
                        ['Can you connect to our core banking or policy system?', 'Usually through its APIs, a database replica or file exchange. We map what is possible early, and the written plan states any limits before work starts.'],
                        ['Will our data leave the country?', 'Not unless you decide it should. We deploy to your environment and your region, and we use masked data for testing.'],
                        ['What does the first step look like?', 'A call about the process you want to change, then a written plan with scope, schedule, cost and the security approach. You approve it before anything starts.'],
                    ],
                    'cta' => 'Request a call about your financial process',
                ],
                'ar' => [
                    'title' => 'الخدمات المالية',
                    'tagline' => 'برمجيات مالية سريعة في التنفيذ وثابتة أمام التدقيق',
                    'lead' => 'نبني أنظمة تسجيل العملاء والعمليات والتقارير لشركات التمويل والتأمين والوساطة وفرق التقنية المالية. نؤتمت الخطوات المتكررة، ونربط أنظمتك، ونراعي متطلبات الأمن والجهات الرقابية في التصميم.',
                    'summary' => 'تسجيل العملاء، وأتمتة العمليات الخلفية، والتقارير، مبنية مع مراعاة الأمن وتوقعات الجهات الرقابية من التصميم.',
                    'audience' => 'شركات التمويل والتأجير، وشركات التأمين، وشركات الوساطة، والشركات الناشئة في التقنية المالية، وفرق العمليات والمخاطر والتقنية داخل البنوك.',
                    'realities' => [
                        ['تسجيل يُضيّع العملاء الجادّين', 'تتعثر الطلبات عند رفع المستندات والتحقق اليدوي من الهوية وتبادل الرسائل، فيترك العميل الجاد طلبه في منتصفه.'],
                        ['عمليات تُدار بجداول إكسل', 'التسويات والموافقات والتقارير في ملفات تنتقل بين الفرق، دون سجل يوضح من عدّل ماذا.'],
                        ['تقارير رقابية تُجمع يدوياً', 'كل دورة تقارير تعني سحب البيانات من عدة أنظمة ومراجعتها يدوياً تحت الضغط.'],
                        ['أمن لا يُراجع إلا بعد الإطلاق', 'يأتي اختبار الاختراق في النهاية، فتتراكم الملاحظات، وينتظر الإصدار.'],
                    ],
                    'solutions' => [
                        ['web-development', 'التسجيل الرقمي للعملاء', 'رحلات تقديم على الويب والجوال مع التقاط المستندات، والدخول عبر الهوية الوطنية حيثما يتاح، وقائمة مراجعة لفريق الامتثال لديك.'],
                        ['automation', 'أتمتة العمليات الخلفية', 'نقل التسويات والموافقات ومعالجة المستندات من الجداول إلى مسارات عمل متتبَّعة، لكل خطوة فيها مسؤول واضح.'],
                        ['development', 'طبقة البيانات والتقارير', 'مخزن تقارير واحد يتغذى من أنظمتك الأساسية، فتُولَّد التقارير الرقابية والإدارية بدلاً من تجميعها يدوياً.'],
                        ['cybersecurity', 'أمن مدمج في مراحل التنفيذ', 'نمذجة التهديدات عند التصميم، وفحص الشيفرة والمكتبات مع كل تغيير، واختبار اختراق قبل الإطلاق، مع ربط النتائج بالإطار الذي ترفع تقاريرك وفقه.'],
                        ['qa', 'اختبار الحسابات واختبارات الانحدار', 'اختبارات مؤتمتة للرسوم ونسب الربح والأقساط والتقريب، حتى لا يكسر تعديلُ قاعدةٍ قاعدةً أخرى بصمت.'],
                    ],
                    'compliance_note' => 'نبني وفق المتطلبات المنطبقة على مشروعك ونراجع العمل على أساسها. ويبقى الاعتماد النهائي لدى مسؤولي الامتثال ومستشاريك.',
                    'compliance' => [
                        ['PCI DSS والاستعداد لتدقيق SOC 2', 'نراجع حدود بيانات البطاقات ونطبّق ضوابط الوصول وإدارة التغيير والتسجيل، مع أدلة يستطيع مدققوك تقييمها.'],
                        ['PSD2 وواجهات الخدمات المصرفية المفتوحة', 'نبني تكاملات API وفق قواعد الموافقة والمصادقة والوصول المنطبقة على دورك ومزوّديك.'],
                        ['المرونة التشغيلية وفق DORA', 'نراجع التعافي وتسجيل الحوادث والاعتماد على الأطراف الخارجية وفق متطلبات المرونة التشغيلية الأوروبية المنطبقة.'],
                        ['مسارات KYC وAML وحماية البيانات وفق GDPR', 'نبني قوائم المراجعة وسجلات الموافقة وضوابط الاحتفاظ لفحوص الهوية وسجلات العملاء. ويحدّد فريق الامتثال لديك القواعد والأساس القانوني.'],
                    ],
                    'examples' => [
                        ['بوابة طلبات التمويل', 'يقدّم العميل طلبه عبر الويب أو الجوال، ويرفع مستنداته مرة واحدة، ويتابع حالة طلبه، بينما يعمل المحللون من قائمة واحدة فيها الملف كاملاً.'],
                        ['مسار التسوية اليومية', 'تُطابق كشوف البنك وسجلات النظام تلقائياً كل صباح، ولا يصل إلى الموظف إلا الاستثناءات، مع سجل كامل.'],
                        ['استقبال مطالبات التأمين', 'تصل المطالبات عبر نموذج متعدد اللغات، وتُقرأ المستندات وتُصنَّف آلياً، ويفتح المقيّم ملفاً جاهزاً.'],
                    ],
                    'faqs' => [
                        ['هل تعملون ضمن متطلبات الأمن وتسجيل الموردين لدينا؟', 'نعم. نعمل عبر شبكتك الخاصة وحساباتك وإجراءات الموافقة لديك، ونوقّع اتفاقيات السرية ومعالجة البيانات، ونحصر صلاحياتنا فيما يتطلبه العمل.'],
                        ['من يعتمد الامتثال التنظيمي؟', 'مسؤولو الامتثال ومستشاروك. نبني الضوابط التقنية ونراجعها وفق الأطر المنطبقة، ونوثّق العمل وندعم مدققيك.'],
                        ['هل يمكنكم الربط مع النظام المصرفي الأساسي أو نظام الوثائق لدينا؟', 'غالباً عبر واجهاته البرمجية أو نسخة من قاعدة البيانات أو تبادل الملفات. نحدد المتاح مبكراً، وتذكر الخطة المكتوبة أي قيود قبل بدء العمل.'],
                        ['هل ستخرج بياناتنا من الدولة؟', 'لا، إلا إذا قررت ذلك. ننشر النظام في بيئتك وفي المنطقة التي تحددها، ونستخدم بيانات مموّهة في الاختبار.'],
                        ['كيف تبدو الخطوة الأولى؟', 'مكالمة عن الإجراء الذي تريد تغييره، ثم خطة مكتوبة تحدد النطاق والجدول الزمني والتكلفة والنهج الأمني، وتعتمدها قبل أن يبدأ أي عمل.'],
                    ],
                    'cta' => 'اطلب مكالمة عن عملياتك المالية',
                ],
            ],

            'government' => [
                'sort_order' => 40,
                'primary_service' => 'web-development',
                'en' => [
                    'title' => 'Government & public sector',
                    'tagline' => 'Public services every citizen can use and every auditor can follow',
                    'lead' => 'Portals, public services and internal workflows for public bodies. Accessible across languages, connected through secure SSO standards, and built so decisions and data changes can be traced.',
                    'summary' => 'Accessible e-services, portals and internal workflows, with national identity sign-in and a full audit trail.',
                    'audience' => 'Digital transformation and IT teams in ministries, municipalities, authorities and semi-government companies, and the integrators who serve them.',
                    'realities' => [
                        ['Services that only work for some people', 'Forms fail with screen readers, break on phones and expect perfect Arabic typing, so people call or visit instead.'],
                        ['Paper behind the portal', 'The citizen applies online, then the request is printed, signed and typed in again inside the organisation.'],
                        ['Integration with national platforms', 'Identity, address and records come from national services, each with its own onboarding, specifications and test environment.'],
                        ['Audits that need evidence on demand', 'Auditors and leadership ask who approved what, and when, and the answer is in someone’s inbox.'],
                    ],
                    'solutions' => [
                        ['web-development', 'Accessible e-services and portals', 'Multilingual service journeys designed to WCAG 2.2 AA, tested with screen readers and on modest phones.'],
                        ['development', 'Secure SSO and integrations', 'Single sign-on through SAML or OpenID Connect, with role mapping and integrations to the systems your service depends on.'],
                        ['automation', 'Internal workflow and approvals', 'Requests routed to the right department with service levels, automatic escalation and electronic approvals in place of print-and-sign.'],
                        ['cybersecurity', 'Hardening and security review', 'Infrastructure hardening, secure code review and penetration testing, reviewed against the security controls your entity requires.'],
                        ['qa', 'Accessibility and acceptance testing', 'Automated and manual accessibility audits, plus acceptance tests written with your service owners before launch.'],
                    ],
                    'compliance_note' => 'We build for and review against the requirements that apply to your project. Your compliance owners and advisers keep the final sign-off.',
                    'compliance' => [
                        ['WCAG 2.2 AA', 'We test keyboard access, screen-reader support and contrast, including right-to-left layouts where used, against WCAG 2.2 AA.'],
                        ['Section 508 and the European Accessibility Act', 'We review the applicable US and European accessibility requirements with your team and document technical checks and outstanding issues.'],
                        ['SAML / OpenID Connect SSO', 'We build and test federated sign-in, session handling and role mapping against the identity provider’s specifications.'],
                        ['Data residency and audit logging', 'We design hosting and access around your data-residency requirements, and record sensitive actions and changes for review.'],
                    ],
                    'examples' => [
                        ['Municipal permit e-service', 'Citizens sign in with their national identity, apply and upload documents, and the request moves between departments with service levels and a full log.'],
                        ['Internal correspondence system', 'Incoming letters are registered, referred, approved and archived electronically, and can be found by number, party or subject.'],
                        ['Accessibility fixes for an existing portal', 'An audit against WCAG 2.2 AA, a prioritised list of fixes, and the fixes themselves, re-tested with assistive technology.'],
                    ],
                    'faqs' => [
                        ['Can you connect to our identity provider?', 'Yes, where it supports SAML or OpenID Connect. We agree role mapping and session rules with your team, test the integration, and hand over the configuration.'],
                        ['Do you work through tenders and integrators?', 'Yes. You can contract with us directly or through your integrator, with us as the delivery partner, and we work within your security and documentation requirements.'],
                        ['Where is the system hosted?', 'On your government cloud or approved data centre, in-country. We don’t host government data on our own infrastructure.'],
                        ['How do you show the service is accessible?', 'With an audit report against WCAG 2.2 AA: automated checks, manual keyboard and screen-reader tests in Arabic and English, and the fixes we made.'],
                        ['How is the work scoped?', 'After a first meeting we write a plan with scope, schedule, deliverables and acceptance criteria. It is agreed in writing before any contract is signed.'],
                    ],
                    'cta' => 'Request a call about your e-service',
                ],
                'ar' => [
                    'title' => 'الحكومة والقطاع العام',
                    'tagline' => 'خدمات حكومية يستطيع كل مواطن استخدامها، ويستطيع كل مدقق تتبّعها',
                    'lead' => 'نبني البوابات والخدمات العامة ومسارات العمل الداخلية للجهات العامة، بواجهات سهلة الوصول بلغات متعددة وتسجيل دخول موحّد وآمن وفق معايير معروفة، مع إمكانية تتبّع القرارات وتعديلات البيانات.',
                    'summary' => 'خدمات إلكترونية وبوابات وأنظمة داخلية سهلة الوصول، مع الدخول بالهوية الوطنية وسجل تدقيق كامل.',
                    'audience' => 'فرق التحول الرقمي والتقنية في الوزارات والأمانات والهيئات والشركات شبه الحكومية، والمتكاملون الذين يخدمونها.',
                    'realities' => [
                        ['خدمات لا تعمل إلا لبعض الناس', 'نماذج لا تقرؤها برامج قراءة الشاشة، وتتعطل على الجوال، وتفترض إدخالاً عربياً مثالياً، فيلجأ الناس إلى الاتصال أو المراجعة الحضورية.'],
                        ['ورق خلف البوابة', 'يقدّم المواطن طلبه إلكترونياً، ثم يُطبع الطلب ويوقَّع ويُعاد إدخاله داخل الجهة.'],
                        ['التكامل مع المنصات الوطنية', 'الهوية والعنوان والسجلات تأتي من خدمات وطنية، لكلٍّ منها إجراءات انضمام ومواصفات وبيئة اختبار خاصة.'],
                        ['تدقيق يطلب الأدلة فوراً', 'يسأل المدققون والقيادة من وافق على ماذا ومتى، والإجابة في بريد أحد الموظفين.'],
                    ],
                    'solutions' => [
                        ['web-development', 'خدمات إلكترونية وبوابات سهلة الوصول', 'رحلات خدمة بلغات متعددة مصمّمة وفق WCAG 2.2 AA، ومختبرة بقارئات الشاشة وعلى الأجهزة المتواضعة.'],
                        ['development', 'الدخول الموحّد الآمن والتكاملات', 'تسجيل دخول موحّد عبر SAML أو OpenID Connect، مع ضبط الأدوار والربط بالأنظمة التي تعتمد عليها خدمتك.'],
                        ['automation', 'سير العمل والموافقات الداخلية', 'توجيه الطلبات إلى الإدارة المختصة مع مستويات خدمة محددة وتصعيد تلقائي وموافقات إلكترونية بدلاً من الطباعة والتوقيع.'],
                        ['cybersecurity', 'التحصين والمراجعة الأمنية', 'تحصين البنية التحتية ومراجعة الشيفرة واختبار الاختراق، مع المراجعة وفق ضوابط الأمن التي تشترطها جهتك.'],
                        ['qa', 'اختبار سهولة الوصول والقبول', 'تدقيق آلي ويدوي لسهولة الوصول، واختبارات قبول نكتبها مع مالكي الخدمة قبل الإطلاق.'],
                    ],
                    'compliance_note' => 'نبني وفق المتطلبات المنطبقة على مشروعك ونراجع العمل على أساسها. ويبقى الاعتماد النهائي لدى مسؤولي الامتثال ومستشاريك.',
                    'compliance' => [
                        ['WCAG 2.2 AA', 'نختبر استخدام لوحة المفاتيح وقارئات الشاشة والتباين وفق WCAG 2.2 AA، بما يشمل الواجهات من اليمين إلى اليسار حيث تُستخدم.'],
                        ['Section 508 وقانون الإتاحة الأوروبي', 'نراجع مع فريقك متطلبات سهولة الوصول الأمريكية والأوروبية المنطبقة، ونوثّق الفحوص التقنية والمشكلات المتبقية.'],
                        ['الدخول الموحّد عبر SAML وOpenID Connect', 'نبني تسجيل الدخول الموحّد وإدارة الجلسات وربط الأدوار ونختبرها وفق مواصفات مزوّد الهوية.'],
                        ['توطين البيانات وسجلات التدقيق', 'نصمّم الاستضافة والوصول وفق متطلبات موقع تخزين البيانات لديك، ونسجّل العمليات والتعديلات الحساسة للمراجعة.'],
                    ],
                    'examples' => [
                        ['خدمة إلكترونية لتراخيص البلدية', 'يدخل المواطن بهويته الوطنية ويقدّم طلبه ويرفع مستنداته، وينتقل الطلب بين الإدارات بمستويات خدمة محددة وسجل كامل.'],
                        ['نظام المراسلات والمعاملات الداخلية', 'تُسجَّل المعاملات الواردة وتُحال وتُعتمد وتُؤرشف إلكترونياً، ويمكن البحث عنها برقم المعاملة أو الجهة أو الموضوع.'],
                        ['معالجة سهولة الوصول لبوابة قائمة', 'تدقيق وفق WCAG 2.2 AA، وقائمة إصلاحات مرتبة حسب الأولوية، وتنفيذ الإصلاحات نفسها ثم إعادة اختبارها بالتقنيات المساعدة.'],
                    ],
                    'faqs' => [
                        ['هل يمكنكم الربط مع مزوّد الهوية لدينا؟', 'نعم، إذا كان يدعم SAML أو OpenID Connect. نتفق مع فريقك على ربط الأدوار وقواعد الجلسات، ونختبر التكامل ثم نسلّمكم الإعدادات.'],
                        ['هل تعملون عبر المنافسات أو من خلال متكامل؟', 'نعم. يمكن التعاقد معنا مباشرة أو عبر المتكامل الذي تتعاملون معه بصفتنا شريك التنفيذ، ونلتزم بمتطلبات الأمن والتوثيق لديكم.'],
                        ['أين يُستضاف النظام؟', 'على السحابة الحكومية أو مركز البيانات المعتمد لديكم داخل الدولة. لا نستضيف بيانات حكومية على بنيتنا الخاصة.'],
                        ['كيف تثبتون أن الخدمة سهلة الوصول؟', 'بتقرير تدقيق وفق WCAG 2.2 AA يشمل الفحص الآلي، والاختبار اليدوي بلوحة المفاتيح وبرامج قراءة الشاشة بالعربية والإنجليزية، والإصلاحات التي نفذناها.'],
                        ['كيف يُحدَّد نطاق العمل؟', 'بعد الاجتماع الأول نكتب خطة تحدد النطاق والجدول الزمني والمخرجات ومعايير القبول، ويُتفق عليها كتابياً قبل توقيع أي عقد.'],
                    ],
                    'cta' => 'اطلب مكالمة عن خدمتك الإلكترونية',
                ],
            ],

            'education' => [
                'sort_order' => 50,
                'primary_service' => 'development',
                'en' => [
                    'title' => 'Education',
                    'tagline' => 'School and training platforms that teachers, students and parents actually open',
                    'lead' => 'Learning platforms, parent apps and administration systems for schools, universities and training providers. Built for the languages and devices your community uses, with careful handling of children’s data.',
                    'summary' => 'Learning platforms, parent communication apps and school operations in your community’s languages, with care for student data.',
                    'audience' => 'Private and international schools, school groups, universities and training centres, and the academic and IT leads who choose their systems.',
                    'realities' => [
                        ['Parents hear about it last', 'Grades, absences and announcements travel through group chats and paper slips, and parents find out after it matters.'],
                        ['A learning platform nobody logs into', 'The LMS was bought for its feature list, but it is English-first, slow on phones and hard for teachers to keep up to date.'],
                        ['Administration split across systems', 'Admissions, fees, timetables and transport sit in different tools, so the same student is entered several times.'],
                        ['Children’s data without clear rules', 'Who may see a student’s records, photos and health notes is decided case by case.'],
                    ],
                    'solutions' => [
                        ['mobile-apps', 'Parent and student app', 'Attendance, grades, homework, announcements and messages with teachers in one multilingual app, with notifications parents control.'],
                        ['development', 'A learning platform shaped to your curriculum', 'Courses, assessments and progress tracking built around your curriculum and grading, or an existing LMS extended and connected to your systems.'],
                        ['automation', 'School operations in one flow', 'Admissions, fee invoices, timetables and transport connected, so a student is entered once and every team sees the same record.'],
                        ['cybersecurity', 'Student data protection', 'Role-based access for staff, parents and students, consent records, and a review of who can reach what.'],
                        ['qa', 'Exam-season and device testing', 'Load tests for online exams and results releases, and checks across the phones and tablets your families actually use.'],
                    ],
                    'compliance_note' => 'We build for and review against the requirements that apply to your project. Your compliance owners and advisers keep the final sign-off.',
                    'compliance' => [
                        ['FERPA and COPPA', 'We build access, guardian-consent and disclosure workflows around the US student-privacy and children’s-data requirements that apply to your institution.'],
                        ['GDPR and minors’ data', 'We design age-appropriate privacy flows, limited collection and retention, and rights-request handling based on the rules your privacy team confirms.'],
                        ['LTI / xAPI and student information systems', 'We connect supported learning tools and student information systems through documented interfaces, with structured imports and exports where needed.'],
                        ['WCAG accessibility', 'We review learning journeys for keyboard and screen-reader access, captions and readable content across supported languages.'],
                    ],
                    'examples' => [
                        ['Parent app for a school group', 'One app across campuses: attendance alerts, report cards, fee invoices and class announcements, in Arabic or English as each parent prefers.'],
                        ['Course platform for a training centre', 'Course catalogue, enrolment, live and recorded sessions, short quizzes, and completion certificates issued automatically.'],
                        ['Admissions workflow', 'Online applications, document checks, assessment booking and offer letters in one pipeline the admissions team can follow.'],
                    ],
                    'faqs' => [
                        ['Should we build our own LMS or extend the one we have?', 'Extending is often the better choice. We look at what your teachers already use and recommend the smaller change first; a custom platform makes sense when your curriculum or experience is genuinely different.'],
                        ['Can it connect to our student information system?', 'Where an official integration route exists, yes. Where it doesn’t, we build structured exports and imports so staff stop re-typing.'],
                        ['How do you protect students’ data?', 'Least-privilege access by role, guardian consent, a log of who viewed what, encrypted storage, and hosting in the region you choose.'],
                        ['Will parents with older phones be able to use it?', 'We test on the devices your families actually use and keep the app light, and the key features also work on the web.'],
                        ['How do we start?', 'A call with your academic and IT leads, then a written plan with scope, schedule and cost that fits your academic calendar. You approve it before work begins.'],
                    ],
                    'cta' => 'Request a call about your school platform',
                ],
                'ar' => [
                    'title' => 'التعليم',
                    'tagline' => 'منصات تعليمية يفتحها المعلم والطالب وولي الأمر فعلاً',
                    'lead' => 'نبني منصات التعلّم وتطبيقات أولياء الأمور وأنظمة الإدارة للمدارس والجامعات ومراكز التدريب، بما يناسب لغات مجتمعك وأجهزته، مع العناية بخصوصية بيانات الأطفال.',
                    'summary' => 'منصات تعلّم وتطبيقات تواصل مع أولياء الأمور وأنظمة إدارة مدرسية بلغات مجتمعك، مع العناية ببيانات الطلاب.',
                    'audience' => 'المدارس الأهلية والعالمية ومجموعات المدارس والجامعات ومراكز التدريب، والقيادات الأكاديمية والتقنية التي تختار أنظمتها.',
                    'realities' => [
                        ['ولي الأمر آخر من يعلم', 'الدرجات والغياب والتعاميم تنتقل عبر مجموعات المحادثة والأوراق، فيعلم ولي الأمر بعد فوات الأوان.'],
                        ['منصة تعليمية لا يدخلها أحد', 'اشتُريت المنصة لقائمة ميزاتها، لكنها إنجليزية أولاً، وبطيئة على الجوال، ويصعب على المعلم تحديثها.'],
                        ['إدارة موزّعة بين أنظمة', 'القبول والرسوم والجداول والنقل في أدوات منفصلة، فيُدخَل الطالب نفسه عدة مرات.'],
                        ['بيانات الأطفال بلا قواعد واضحة', 'من يحق له رؤية سجلات الطالب وصوره وملاحظاته الصحية يُقرَّر حالةً بحالة.'],
                    ],
                    'solutions' => [
                        ['mobile-apps', 'تطبيق لولي الأمر والطالب', 'الحضور والدرجات والواجبات والتعاميم والتواصل مع المعلمين في تطبيق واحد عربي أولاً، مع إشعارات يتحكم فيها ولي الأمر.'],
                        ['development', 'منصة تعلّم مبنية على مناهجك', 'مقررات وتقييمات ومتابعة تقدّم مصمّمة على مناهجك ونظام الدرجات لديك، أو تطوير منصة تعلّم قائمة وربطها بأنظمتك.'],
                        ['automation', 'عمليات المدرسة في مسار واحد', 'ربط القبول وفواتير الرسوم والجداول والنقل، فيُدخَل الطالب مرة واحدة وترى كل الإدارات السجل نفسه.'],
                        ['cybersecurity', 'حماية بيانات الطلاب', 'صلاحيات حسب الدور للموظفين وأولياء الأمور والطلاب، وسجل للموافقات، ومراجعة لمن يصل إلى ماذا.'],
                        ['qa', 'اختبار مواسم الامتحانات والأجهزة', 'اختبارات تحمّل للامتحانات الإلكترونية وإعلان النتائج، وفحص على الجوالات والأجهزة اللوحية التي تستخدمها الأسر فعلاً.'],
                    ],
                    'compliance_note' => 'نبني وفق المتطلبات المنطبقة على مشروعك ونراجع العمل على أساسها. ويبقى الاعتماد النهائي لدى مسؤولي الامتثال ومستشاريك.',
                    'compliance' => [
                        ['FERPA وCOPPA', 'نبني مسارات الوصول وموافقة ولي الأمر والإفصاح وفق متطلبات خصوصية الطلاب وبيانات الأطفال الأمريكية المنطبقة على مؤسستك.'],
                        ['GDPR وبيانات القُصّر', 'نصمّم مسارات خصوصية تناسب العمر، وجمعاً واحتفاظاً محدودين بالبيانات، ومعالجة لطلبات الحقوق وفق القواعد التي يؤكدها فريق الخصوصية لديك.'],
                        ['LTI وxAPI وأنظمة معلومات الطلاب', 'نربط أدوات التعلّم وأنظمة معلومات الطلاب المدعومة عبر واجهات موثّقة، مع استيراد وتصدير منظّم للبيانات عند الحاجة.'],
                        ['سهولة الوصول وفق WCAG', 'نراجع مسارات التعلّم لاستخدام لوحة المفاتيح وقارئات الشاشة والترجمة النصية ووضوح المحتوى باللغات المدعومة.'],
                    ],
                    'examples' => [
                        ['تطبيق أولياء أمور لمجموعة مدارس', 'تطبيق واحد لكل الفروع: تنبيهات الحضور، والشهادات، وفواتير الرسوم، وتعاميم الفصول، بالعربية أو الإنجليزية حسب اختيار ولي الأمر.'],
                        ['منصة دورات لمركز تدريب', 'دليل الدورات والتسجيل والجلسات المباشرة والمسجّلة والاختبارات القصيرة، مع إصدار شهادات الإتمام تلقائياً.'],
                        ['مسار القبول والتسجيل', 'طلبات إلكترونية، وتدقيق المستندات، وحجز مواعيد التقييم، وخطابات القبول، في مسار واحد يتابعه فريق القبول.'],
                    ],
                    'faqs' => [
                        ['هل نبني منصة تعلّم خاصة أم نطوّر المنصة الحالية؟', 'التطوير على المنصة الحالية يكون الخيار الأفضل في حالات كثيرة. ندرس ما يستخدمه معلموك ونوصي بالتغيير الأصغر أولاً، وتكون المنصة الخاصة منطقية حين يختلف منهجك أو تجربتك اختلافاً حقيقياً.'],
                        ['هل يمكن الربط مع نظام معلومات الطلاب لدينا؟', 'حيث يوجد مسار تكامل رسمي، نعم. وحيث لا يوجد، نبني تصديراً واستيراداً منظّماً حتى يتوقف الموظفون عن إعادة الإدخال.'],
                        ['كيف تحمون بيانات الطلاب؟', 'صلاحيات بالحد الأدنى حسب الدور، وموافقة ولي الأمر، وسجل لمن اطّلع على ماذا، وتشفير للبيانات المخزّنة، واستضافة في المنطقة التي تختارها.'],
                        ['هل يستطيع أولياء الأمور ذوو الجوالات القديمة استخدامه؟', 'نختبر على الأجهزة التي تستخدمها أسرك فعلاً ونُبقي التطبيق خفيفاً، وتعمل الميزات الأساسية على الويب أيضاً.'],
                        ['كيف نبدأ؟', 'مكالمة مع قيادتك الأكاديمية والتقنية، ثم خطة مكتوبة تحدد النطاق والجدول الزمني والتكلفة بما يناسب التقويم الدراسي، وتعتمدها قبل بدء العمل.'],
                    ],
                    'cta' => 'اطلب مكالمة عن منصتك التعليمية',
                ],
            ],
        ];
    }
}
