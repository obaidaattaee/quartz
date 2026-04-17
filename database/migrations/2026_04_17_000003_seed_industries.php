<?php

use App\Models\Industry;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $rows = [
            [
                'slug' => 'retail-pos',
                'sort_order' => 10,
                'title_en' => 'Retail & POS',
                'title_ar' => 'التجزئة وأنظمة البيع',
                'hero_blurb_en' => 'Modern retail runs on real-time data — from stock to sales to the customer experience. We build the platforms that make that possible across stores, warehouses, and checkout.',
                'hero_blurb_ar' => 'تجارة التجزئة الحديثة تعتمد على البيانات اللحظية — من المخزون إلى المبيعات إلى تجربة العميل. نبني المنصات التي تجعل ذلك ممكنًا عبر الفروع والمستودعات ونقاط البيع.',
                'challenges_en' => [
                    ['title' => 'Siloed inventory', 'description' => 'Different stock numbers across POS, warehouse, and online store frustrate customers and staff.'],
                    ['title' => 'Slow checkout', 'description' => 'Legacy POS terminals crash at peak hours; offline mode is brittle or missing.'],
                    ['title' => 'No customer insight', 'description' => 'Transaction data never reaches marketing or product — each team decides in the dark.'],
                ],
                'challenges_ar' => [
                    ['title' => 'مخزون مُجزّأ', 'description' => 'أرقام مخزون مختلفة بين نقاط البيع والمستودعات والمتجر الإلكتروني تربك العملاء والموظفين.'],
                    ['title' => 'بطء الدفع', 'description' => 'أجهزة POS القديمة تتعطل في ساعات الذروة، ووضع عدم الاتصال ضعيف أو غير موجود.'],
                    ['title' => 'غياب رؤية العميل', 'description' => 'بيانات المعاملات لا تصل إلى التسويق أو المنتج — كل فريق يقرر في العتمة.'],
                ],
                'solutions_en' => [
                    ['title' => 'Unified inventory API', 'description' => 'Single source of truth across channels, synced in real time with offline fallback.'],
                    ['title' => 'Resilient POS frontends', 'description' => 'Native or web-based terminals with tested offline mode and fast sync on reconnect.'],
                    ['title' => 'Customer data platform', 'description' => 'Transaction-to-insight pipeline feeding marketing, loyalty, and merchandising.'],
                ],
                'solutions_ar' => [
                    ['title' => 'واجهة مخزون موحّدة', 'description' => 'مصدر بيانات واحد عبر القنوات مع تزامن لحظي ووضع عدم اتصال موثوق.'],
                    ['title' => 'واجهات POS مرنة', 'description' => 'أجهزة أصلية أو ويب مع وضع عدم اتصال مُختبَر ومزامنة سريعة عند الاتصال.'],
                    ['title' => 'منصة بيانات العملاء', 'description' => 'مسار من المعاملات إلى الرؤى يُغذّي التسويق والولاء وإدارة التشكيلة.'],
                ],
                'compliance_note_en' => 'PCI DSS handling for card data, GDPR for customer records, and local consumer-protection rules across the GCC and EU.',
                'compliance_note_ar' => 'الامتثال لـ PCI DSS لبيانات البطاقات، وGDPR لبيانات العملاء، وقوانين حماية المستهلك في دول الخليج وأوروبا.',
            ],
            [
                'slug' => 'healthcare',
                'sort_order' => 20,
                'title_en' => 'Healthcare',
                'title_ar' => 'الرعاية الصحية',
                'hero_blurb_en' => 'Healthcare teams need software that respects patient safety, clinical workflow, and strict compliance — without slowing clinicians down.',
                'hero_blurb_ar' => 'فِرق الرعاية الصحية تحتاج برمجيات تحترم سلامة المريض وسير العمل السريري والامتثال الصارم — دون إبطاء الأطباء.',
                'challenges_en' => [
                    ['title' => 'Fragmented patient records', 'description' => 'Clinicians waste minutes per encounter chasing records across EMR, labs, and imaging.'],
                    ['title' => 'Compliance drag', 'description' => 'Every new feature stalls in HIPAA/GDPR review; audit trails are reconstructed after the fact.'],
                    ['title' => 'Integration debt', 'description' => 'HL7/FHIR integrations behave differently per vendor; errors surface at the bedside.'],
                ],
                'challenges_ar' => [
                    ['title' => 'سجلات مرضى مُجزّأة', 'description' => 'الأطباء يضيعون دقائق في كل زيارة بحثًا عن السجلات بين EMR والمختبرات والأشعة.'],
                    ['title' => 'إعاقة الامتثال', 'description' => 'كل ميزة جديدة تتعثر في مراجعات HIPAA/GDPR، وسجلات التدقيق تُبنى لاحقًا.'],
                    ['title' => 'دين التكاملات', 'description' => 'تكاملات HL7/FHIR تختلف من مزود لآخر، وتظهر أخطاء عند سرير المريض.'],
                ],
                'solutions_en' => [
                    ['title' => 'Clinician-first UX', 'description' => 'Workflow-aware interfaces that reduce clicks per task, validated with real users.'],
                    ['title' => 'Audit-by-default', 'description' => 'Every read/write logged with tamper-evident storage. Compliance becomes a toggle, not a project.'],
                    ['title' => 'Interoperability layer', 'description' => 'Normalised HL7/FHIR gateway with automated vendor-drift tests on every deploy.'],
                ],
                'solutions_ar' => [
                    ['title' => 'تجربة مصمّمة للطبيب أولًا', 'description' => 'واجهات تعرف سير العمل تقلل النقرات لكل مهمة، تُختبَر مع مستخدمين حقيقيين.'],
                    ['title' => 'تدقيق افتراضي', 'description' => 'كل قراءة وكتابة مُسجّلة بتخزين مُقاوم للعبث. الامتثال يصبح مفتاحًا لا مشروعًا.'],
                    ['title' => 'طبقة قابلية للتشغيل البيني', 'description' => 'بوابة HL7/FHIR معيارية مع اختبارات تلقائية لاختلافات المزودين عند كل نشر.'],
                ],
                'compliance_note_en' => 'HIPAA in the US, GDPR in the EU, and local health-data laws in Saudi Arabia (PDPL), UAE, and other markets we serve.',
                'compliance_note_ar' => 'HIPAA في الولايات المتحدة، وGDPR في أوروبا، وقوانين البيانات الصحية المحلية في السعودية (PDPL) والإمارات وغيرها.',
            ],
            [
                'slug' => 'financial-services',
                'sort_order' => 30,
                'title_en' => 'Financial Services',
                'title_ar' => 'الخدمات المالية',
                'hero_blurb_en' => 'Banks, insurers, and fintechs need software that is fast, auditable, and beyond reproach — because every bug becomes a regulatory story.',
                'hero_blurb_ar' => 'البنوك وشركات التأمين والتقنيات المالية تحتاج برمجيات سريعة قابلة للتدقيق ولا تشوبها شائبة — لأن كل خطأ يتحول إلى حكاية تنظيمية.',
                'challenges_en' => [
                    ['title' => 'Legacy core systems', 'description' => 'Mainframe-era transaction systems hold back every modernisation effort above them.'],
                    ['title' => 'Real-time fraud pressure', 'description' => 'Detection windows measured in milliseconds; false positives annoy customers; false negatives cost millions.'],
                    ['title' => 'Regulatory overhead', 'description' => 'New products stall for months in legal review — compliance cannot be bolted on late.'],
                ],
                'challenges_ar' => [
                    ['title' => 'أنظمة أساسية قديمة', 'description' => 'أنظمة معاملات من عصر الميناينفريم تعيق كل محاولة تحديث فوقها.'],
                    ['title' => 'ضغط كشف الاحتيال', 'description' => 'نوافذ كشف تُقاس بالمللي ثانية؛ الإنذارات الكاذبة تزعج العملاء والحقيقية تكلّف ملايين.'],
                    ['title' => 'عبء تنظيمي', 'description' => 'المنتجات الجديدة تتعثر شهورًا في المراجعة القانونية — الامتثال لا يُضاف في النهاية.'],
                ],
                'solutions_en' => [
                    ['title' => 'Strangler-fig modernisation', 'description' => 'Route traffic away from legacy cores gradually, with safety nets and reversibility at every step.'],
                    ['title' => 'Low-latency fraud rules', 'description' => 'Stream-processed rule engines with ML-assisted tuning and reviewed-by-humans thresholds.'],
                    ['title' => 'Compliance as code', 'description' => 'Policies expressed as tests; every feature ships with an auditable trail from day one.'],
                ],
                'solutions_ar' => [
                    ['title' => 'تحديث تدريجي (نمط الشجرة الخانقة)', 'description' => 'تحويل الحركة تدريجيًا من الأنظمة القديمة مع شبكات أمان وإمكانية التراجع في كل خطوة.'],
                    ['title' => 'قواعد كشف احتيال منخفضة الزمن', 'description' => 'محركات قواعد عبر التدفق مع ضبط مدعوم بالتعلّم الآلي وعتبات تُراجع بشريًا.'],
                    ['title' => 'الامتثال بصورة كود', 'description' => 'السياسات مُعبَّر عنها اختبارات، وكل ميزة تُسلَّم مع أثر تدقيق من اليوم الأول.'],
                ],
                'compliance_note_en' => 'SAMA regulations in Saudi Arabia, CBUAE for the UAE, PSD2/GDPR across Europe, and SOC 2 Type II for US fintech partners.',
                'compliance_note_ar' => 'أنظمة ساما في السعودية، والمركزي الإماراتي، وPSD2/GDPR في أوروبا، وSOC 2 Type II لشركاء التقنية المالية في الولايات المتحدة.',
            ],
            [
                'slug' => 'government',
                'sort_order' => 40,
                'title_en' => 'Government',
                'title_ar' => 'القطاع الحكومي',
                'hero_blurb_en' => 'Government services touch everyone — the systems behind them need to be accessible, resilient, and respectful of public trust.',
                'hero_blurb_ar' => 'الخدمات الحكومية تمسّ الجميع — الأنظمة خلفها يجب أن تكون سهلة الوصول وموثوقة وتحترم ثقة الجمهور.',
                'challenges_en' => [
                    ['title' => 'Digital inclusion gaps', 'description' => 'Services fail for citizens with low bandwidth, older devices, or accessibility needs.'],
                    ['title' => 'Identity sprawl', 'description' => 'Every agency has its own login — citizens re-verify repeatedly, integration is brittle.'],
                    ['title' => 'Procurement-heavy delivery', 'description' => 'Multi-year contracts deliver software that was obsolete the day it went live.'],
                ],
                'challenges_ar' => [
                    ['title' => 'فجوات الشمول الرقمي', 'description' => 'الخدمات تفشل مع مواطنين بعرض نطاق محدود أو أجهزة قديمة أو احتياجات وصول.'],
                    ['title' => 'تشتت الهوية', 'description' => 'كل جهة لها تسجيل دخول خاص — المواطن يوثّق نفسه مرارًا، والتكامل هشّ.'],
                    ['title' => 'تسليم مُثقل بالمشتريات', 'description' => 'عقود متعددة السنوات تسلّم برمجيات بالية قبل إطلاقها.'],
                ],
                'solutions_en' => [
                    ['title' => 'Accessibility-first delivery', 'description' => 'WCAG 2.1 AA baseline, tested with assistive tech, works on 2G and 10-year-old phones.'],
                    ['title' => 'Federated identity', 'description' => 'Standards-based SSO layer (OIDC/SAML) that respects each agency while unifying the citizen experience.'],
                    ['title' => 'Agile-in-a-procurement-shell', 'description' => 'Structured contracts that still allow iterative delivery and pivoting on evidence.'],
                ],
                'solutions_ar' => [
                    ['title' => 'تسليم يبدأ من إمكانية الوصول', 'description' => 'معيار WCAG 2.1 AA مع اختبارات بتقنيات مساعدة، يعمل على شبكات 2G وأجهزة عمرها عشر سنوات.'],
                    ['title' => 'هوية اتحادية', 'description' => 'طبقة SSO قياسية (OIDC/SAML) تحترم كل جهة وتوحّد تجربة المواطن.'],
                    ['title' => 'أجايل داخل إطار مشتريات', 'description' => 'عقود منظّمة تسمح بتسليم تكراري والتحوّل بناءً على الأدلة.'],
                ],
                'compliance_note_en' => 'National Cybersecurity Authority (NCA) in Saudi Arabia, ISO 27001 across the region, and open-data/accessibility mandates in Europe.',
                'compliance_note_ar' => 'الهيئة الوطنية للأمن السيبراني (NCA) في السعودية، وISO 27001 إقليميًا، ومتطلبات البيانات المفتوحة وإمكانية الوصول في أوروبا.',
            ],
            [
                'slug' => 'education',
                'sort_order' => 50,
                'title_en' => 'Education',
                'title_ar' => 'التعليم',
                'hero_blurb_en' => 'Schools, universities, and edtech platforms need software students want to use, teachers can manage, and administrators can trust with data.',
                'hero_blurb_ar' => 'المدارس والجامعات ومنصات التعليم التقني تحتاج برمجيات يحبها الطلاب ويستطيع المعلمون إدارتها ويثق بها الإداريون مع البيانات.',
                'challenges_en' => [
                    ['title' => 'LMS fatigue', 'description' => 'Students juggle five tools to do one assignment; teachers juggle ten to teach one class.'],
                    ['title' => 'Data without insight', 'description' => 'Dashboards show attendance and grades but not who is at risk of falling behind.'],
                    ['title' => 'Safeguarding', 'description' => 'Minors online means stricter rules — COPPA, KSA Child Data Protection — easy to get wrong.'],
                ],
                'challenges_ar' => [
                    ['title' => 'إرهاق نظام إدارة التعلم', 'description' => 'الطلاب يستخدمون خمس أدوات لأداء واجب واحد، والمعلمون عشر أدوات لتدريس صف واحد.'],
                    ['title' => 'بيانات بلا رؤية', 'description' => 'لوحات الحضور والدرجات لا تُظهر من هو في خطر التأخر.'],
                    ['title' => 'حماية القاصرين', 'description' => 'وجود القاصرين على الإنترنت يعني قواعد أشد — COPPA وحماية بيانات الأطفال — من السهل الخطأ فيها.'],
                ],
                'solutions_en' => [
                    ['title' => 'Unified learner experience', 'description' => 'Single sign-on, one timeline, one submission flow — regardless of backend tool zoo.'],
                    ['title' => 'Early-warning analytics', 'description' => 'Models that flag at-risk students early enough for a human to intervene meaningfully.'],
                    ['title' => 'Privacy-by-design', 'description' => 'Data minimisation, role-based access, parental consent flows built in — not added later.'],
                ],
                'solutions_ar' => [
                    ['title' => 'تجربة متعلم موحّدة', 'description' => 'تسجيل دخول واحد، جدول زمني واحد، مسار تسليم واحد — مهما تعددت الأدوات الخلفية.'],
                    ['title' => 'تحليلات الإنذار المبكر', 'description' => 'نماذج تُنبّه إلى الطلاب المعرّضين للتأخر مبكرًا بما يكفي لتدخّل بشري فعّال.'],
                    ['title' => 'الخصوصية في التصميم', 'description' => 'تقليل البيانات، وصلاحيات حسب الدور، ومسارات موافقة ولي الأمر مدمجة من البداية.'],
                ],
                'compliance_note_en' => 'COPPA and FERPA in the US, GDPR in Europe, and child-data-protection regulations across the GCC.',
                'compliance_note_ar' => 'COPPA وFERPA في الولايات المتحدة، وGDPR في أوروبا، وأنظمة حماية بيانات الأطفال في دول الخليج.',
            ],
        ];

        foreach ($rows as $row) {
            Industry::updateOrCreate(['slug' => $row['slug']], $row);
        }
    }

    public function down(): void
    {
        Industry::whereIn('slug', [
            'retail-pos',
            'healthcare',
            'financial-services',
            'government',
            'education',
        ])->delete();
    }
};
