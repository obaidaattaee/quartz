<?php

namespace Database\Seeders;

use App\Models\ServicePage;
use Illuminate\Database\Seeder;

/**
 * Full bilingual copy for the six public service pages.
 *
 * Runs after ContentSeeder and overwrites the service rows with the
 * structured content the redesigned pages render (tagline, audience,
 * pains, engagements, tools, FAQ, process durations). Everything here is
 * editable from the admin afterwards.
 *
 * Copy rules: no invented clients, numbers, certifications or prices.
 * The only proof figures used anywhere on the site are 13+ live products
 * and 500K+ users, and they live on the index page, not here.
 */
class ServicePageContentSeeder extends Seeder
{
    public function run(): void
    {
        foreach (self::content() as $slug => $content) {
            $attributes = ['tools' => $content['tools']];

            foreach (['en', 'ar'] as $locale) {
                $c = $content[$locale];

                $attributes += [
                    "title_{$locale}" => $c['title'],
                    "tagline_{$locale}" => $c['tagline'],
                    "subtitle_{$locale}" => $c['subtitle'],
                    "audience_{$locale}" => $c['audience'],
                    "problem_{$locale}" => $c['problem'],
                    "pains_{$locale}" => array_map(
                        fn (array $p) => ['problem' => $p[0], 'solution' => $p[1]],
                        $c['pains'],
                    ),
                    "approach_{$locale}" => $c['approach'],
                    "process_steps_{$locale}" => array_map(
                        fn (array $s) => ['title' => $s[0], 'duration' => $s[1], 'description' => $s[2]],
                        $c['steps'],
                    ),
                    "deliverables_{$locale}" => $c['deliverables'],
                    "engagements_{$locale}" => array_map(
                        fn (array $e) => [
                            'title' => $e[0],
                            'duration' => $e[1],
                            'description' => $e[2],
                            'best_for' => $e[3],
                        ],
                        $c['engagements'],
                    ),
                    "faqs_{$locale}" => array_map(
                        fn (array $f) => ['question' => $f[0], 'answer' => $f[1]],
                        $c['faqs'],
                    ),
                    "cta_text_{$locale}" => $c['cta'],
                ];
            }

            ServicePage::updateOrCreate(['slug' => $slug], $attributes);
        }
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public static function content(): array
    {
        return [
            'development' => self::development(),
            'automation' => self::automation(),
            'web-development' => self::webDevelopment(),
            'mobile-apps' => self::mobileApps(),
            'qa' => self::qa(),
            'cybersecurity' => self::cybersecurity(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function development(): array
    {
        return [
            'tools' => ['Laravel', 'React', 'Next.js', 'Node.js', 'TypeScript', 'React Native', 'Flutter', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'AWS', 'GitHub Actions'],
            'en' => [
                'title' => 'Software Development',
                'tagline' => 'Software shaped around how your business actually runs.',
                'subtitle' => 'Custom web platforms, internal systems and mobile apps, designed with your team, built in agreed stages and handed over with full ownership.',
                'audience' => 'For business owners and operations leads whose spreadsheets, off-the-shelf tools or ageing systems can no longer keep up.',
                'problem' => 'Most growing companies reach a point where the tools that got them here start slowing them down. Work moves between spreadsheets and apps that don’t talk to each other, and every change takes longer than it should.',
                'pains' => [
                    ['Your team runs the business on spreadsheets and WhatsApp groups.', 'One system with roles, approvals and a single source of truth, in Arabic and English.'],
                    ['Off-the-shelf software forces you to change how you work.', 'Software built around your process, with only the features you actually use.'],
                    ['Your current system is slow, fragile, and only one person understands it.', 'We stabilise it, document it, and modernise it in stages without stopping operations.'],
                    ['Your ERP, CRM, e-invoicing and website each live on their own.', 'Documented APIs connecting your ERP, CRM and e-invoicing systems.'],
                ],
                'approach' => 'One team owns your project end to end. You review working software at agreed milestones and can adjust priorities between stages.',
                'steps' => [
                    ['Diagnostic', '', 'We map your workflows, users and systems, then agree scope, architecture and a capped estimate.'],
                    ['Design', '', 'Clickable screens in Arabic and English, reviewed with the people who will use them.'],
                    ['Build', '', 'Agreed build stages, each ending in a demo on a live staging link.'],
                    ['Launch and support', '', 'Data migration, go-live and team training, then a support plan that suits you.'],
                ],
                'deliverables' => [
                    'Web platform or internal system, live on your cloud account',
                    'iOS and Android apps where you need them',
                    'Admin panel your team can run without a developer',
                    'APIs and integrations with the tools you already use',
                    'Automated tests and a deployment pipeline',
                    'Source code, documentation and admin access, all in your name',
                ],
                'engagements' => [
                    ['Product diagnostic', 'Fixed scope, agreed up front', 'We map the workflows, users and systems and give you a written plan: scope, architecture, schedule and a capped estimate, agreed before signing. The plan is yours, whoever builds it.', 'You know the problem, not yet the solution.'],
                    ['Project build', 'Scoped to your project', 'A defined first release built in agreed stages. After the diagnostic, scope, schedule and cost ceiling are agreed in a written plan before signing.', 'A clear first version you want to launch.'],
                    ['Monthly retainer', 'Ongoing, on a monthly retainer', 'New features, fixes, hosting and monitoring from the team that built it. Priorities can change every month.', 'Products that keep growing.'],
                ],
                'faqs' => [
                    ['Who owns the code?', 'You do. The repository, cloud accounts and admin access are in your name from the start, and everything is handed over with documentation.'],
                    ['How long does a first version take?', 'The schedule depends on scope and complexity. After the diagnostic, we agree scope and schedule in a written plan before signing.'],
                    ['Is Arabic built in?', 'Yes. Interfaces are designed in Arabic and English from the start, with proper right-to-left layouts, Arabic search, and Hijri dates where you need them.'],
                    ['We already have developers. Can you work with them?', 'Yes. We can take a defined part of the system, review the architecture, or work inside your repository alongside your team.'],
                    ['Where is the system hosted?', 'On your own cloud account, usually AWS, Azure or Google Cloud, or a local provider when data has to stay in the country. We set it up and document it.'],
                ],
                'cta' => 'Discuss your project',
            ],
            'ar' => [
                'title' => 'تطوير البرمجيات',
                'tagline' => 'برمجيات تُبنى على طريقة عملك، لا العكس.',
                'subtitle' => 'منصات ويب وأنظمة داخلية وتطبيقات جوال مخصّصة، نصمّمها مع فريقك ونبنيها على مراحل متّفق عليها، ثم نسلّمك ملكيتها كاملة.',
                'audience' => 'لأصحاب الشركات ومديري العمليات الذين لم تعد الجداول أو الأنظمة الجاهزة أو القديمة تواكب نموّ أعمالهم.',
                'problem' => 'تصل معظم الشركات النامية إلى مرحلة تصبح فيها الأدوات التي أوصلتها إلى هنا عائقاً أمامها: العمل يتنقّل بين جداول وتطبيقات لا يتّصل بعضها ببعض، وكل تعديل يستغرق أطول مما ينبغي.',
                'pains' => [
                    ['فريقك يدير العمل عبر جداول Excel ومجموعات واتساب.', 'نظام واحد بصلاحيات واعتمادات ومصدر بيانات موحّد، بالعربية والإنجليزية.'],
                    ['البرامج الجاهزة تفرض عليك تغيير طريقة عملك.', 'برنامج مصمّم حول إجراءاتك، بالميزات التي تحتاجها فعلاً ولا شيء غيرها.'],
                    ['نظامك الحالي بطيء وهشّ، ولا يفهمه إلا شخص واحد.', 'نثبّته ونوثّقه، ثم نحدّثه على مراحل دون أن يتوقف العمل.'],
                    ['نظام ERP وإدارة العملاء والفوترة الإلكترونية والموقع، كلٌّ في جزيرة منفصلة.', 'نربط نظام ERP وإدارة العملاء والفوترة الإلكترونية عبر واجهات API موثّقة.'],
                ],
                'approach' => 'يتولّى مشروعك فريق واحد من البداية إلى النهاية. تراجع برنامجاً يعمل عند محطات متّفق عليها، ويمكنك تعديل الأولويات بين المراحل.',
                'steps' => [
                    ['التشخيص', '', 'نرسم سير العمل والمستخدمين والأنظمة، ثم نتفق على النطاق والبنية التقنية وتقدير بسقف محدد.'],
                    ['التصميم', '', 'شاشات تفاعلية بالعربية والإنجليزية نراجعها مع من سيستخدمونها فعلاً.'],
                    ['البناء', '', 'مراحل بناء متّفق عليها، تنتهي كلٌّ منها بعرض على رابط تجريبي حيّ.'],
                    ['الإطلاق والدعم', '', 'ترحيل البيانات والتشغيل الفعلي وتدريب الفريق، ثم خطة دعم تناسبك.'],
                ],
                'deliverables' => [
                    'منصة ويب أو نظام داخلي يعمل على حسابك السحابي',
                    'تطبيقات iOS وAndroid عند الحاجة إليها',
                    'لوحة تحكم يديرها فريقك دون الحاجة إلى مبرمج',
                    'واجهات API وتكاملات مع الأدوات التي تستخدمها',
                    'اختبارات آلية وخط نشر جاهز',
                    'الشيفرة المصدرية والتوثيق وصلاحيات الإدارة، كلها باسمك',
                ],
                'engagements' => [
                    ['تشخيص المنتج', 'نطاق محدّد ومتّفق عليه مسبقاً', 'نرسم سير العمل والمستخدمين والأنظمة، ونسلّمك خطة مكتوبة: النطاق والبنية والجدول وتقدير بسقف محدد، نتفق عليها قبل التوقيع. الخطة لك، أيّاً كان من سينفّذها.', 'تعرف المشكلة، ولم يتضح الحل بعد.'],
                    ['بناء المشروع', 'حسب نطاق مشروعك', 'إصدار أول محدد المعالم نبنيه على مراحل متّفق عليها. بعد التشخيص، نتفق على النطاق والجدول وسقف التكلفة في خطة مكتوبة قبل التوقيع.', 'إصدار أول واضح تريد إطلاقه.'],
                    ['عقد دعم شهري', 'مستمر، بعقد دعم شهري', 'ميزات جديدة وإصلاحات واستضافة ومراقبة من الفريق نفسه الذي بنى النظام، مع إمكانية تغيير الأولويات كل شهر.', 'منتجات قائمة تواصل النمو.'],
                ],
                'faqs' => [
                    ['من يملك الشيفرة المصدرية؟', 'أنت. المستودع والحسابات السحابية وصلاحيات الإدارة باسمك منذ البداية، ونسلّمك كل شيء مع التوثيق.'],
                    ['كم يستغرق الإصدار الأول؟', 'يعتمد الجدول على نطاق المشروع وتعقيده. بعد التشخيص، نتفق على النطاق والجدول في خطة مكتوبة قبل التوقيع.'],
                    ['هل يدعم النظام العربية بالكامل؟', 'نعم. نصمّم الواجهات بالعربية والإنجليزية من البداية، باتجاه صحيح من اليمين إلى اليسار، وبحث عربي، والتاريخ الهجري عند الحاجة.'],
                    ['لدينا مطوّرون، فهل تعملون معهم؟', 'نعم. يمكننا تولّي جزء محدد من النظام، أو مراجعة البنية التقنية، أو العمل داخل مستودعكم جنباً إلى جنب مع فريقكم.'],
                    ['أين يُستضاف النظام؟', 'على حسابك السحابي الخاص، غالباً لدى AWS أو Azure أو Google Cloud، أو لدى مزوّد محلي إذا كان يلزم بقاء البيانات داخل الدولة. نتولّى الإعداد والتوثيق.'],
                ],
                'cta' => 'ناقش مشروعك معنا',
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function automation(): array
    {
        return [
            'tools' => ['n8n', 'Make', 'Zapier', 'Power Automate', 'Python', 'Google Workspace', 'Microsoft 365', 'Odoo', 'Zoho', 'HubSpot', 'OpenAI API', 'REST APIs and webhooks'],
            'en' => [
                'title' => 'Automation',
                'tagline' => 'Move orders and invoices between systems without repeated data entry.',
                'subtitle' => 'We connect your ERP, CRM, spreadsheets and inboxes so orders, invoices, approvals and reports move on their own, with a person in the loop where judgement matters.',
                'audience' => 'For operations, finance and sales teams who spend time re-entering data, chasing approvals or rebuilding the same report.',
                'problem' => 'Manual work hides inside every growing company: copying orders into the ERP, matching invoices, sending the same reminder. It is slow, it causes errors, and it grows with every new customer.',
                'pains' => [
                    ['Your team re-enters the same data into two or three systems.', 'Systems that sync on their own, with checks that flag mismatches instead of hiding them.'],
                    ['Approvals stall in email and WhatsApp threads.', 'Approval flows with a clear owner, automatic reminders and an audit trail.'],
                    ['Month-end reports depend on repetitive copying and pasting.', 'Reports and dashboards that build themselves from live data.'],
                    ['Invoices and purchase orders arrive as PDFs someone has to read.', 'Document intake that extracts the fields, validates them, and only asks a person when it is unsure.'],
                ],
                'approach' => 'We start with the work, not the tool. We watch how a task is done today, measure how long it takes, and automate the steps that repeat. Every flow has logs, alerts and a manual fallback.',
                'steps' => [
                    ['Process audit', '', 'We map your workflows, time each manual step, and rank what to automate first by hours saved.'],
                    ['First flow', '', 'We automate the highest-value process first and run it alongside the manual way until you trust it.'],
                    ['Roll-out', '', 'We extend to the next processes, connect the remaining systems and train the owner of each flow.'],
                    ['Monitor', '', 'Failure alerts, a monthly report on runs and errors, and fixes when a connected system changes.'],
                ],
                'deliverables' => [
                    'A ranked map of your manual processes and the hours each one costs',
                    'Working automations between the systems you already use',
                    'Approval and notification flows with an audit trail',
                    'Reports and dashboards that update themselves',
                    'Run logs, failure alerts and a manual fallback for every flow',
                    'Short guides so your team can adjust flows on their own',
                ],
                'engagements' => [
                    ['Automation audit', 'Fixed scope, agreed up front', 'We time your manual work and hand you a ranked list of what to automate, the right tool for each, and a capped estimate.', 'You can feel the waste but can’t size it yet.'],
                    ['First automation', 'Scoped to your project', 'One high-value process automated end to end and run in parallel with the manual way until the results match. After the diagnostic, we agree scope and schedule in a written plan before signing.', 'One painful process you want gone.'],
                    ['Automation retainer', 'Ongoing, on a monthly retainer', 'New flows each month, monitoring of the ones already running, and fixes when a connected system changes.', 'Teams automating step by step.'],
                ],
                'faqs' => [
                    ['Do we need to replace our current systems?', 'Usually not. We connect what you already use, such as your ERP, CRM, Google Workspace or Microsoft 365, through their APIs. Where a system has no API, we discuss safe alternatives with you.'],
                    ['What happens when an automation fails?', 'Every flow logs each run and alerts a named person when something fails. Nothing is dropped silently, and there is always a manual way to finish the task.'],
                    ['Do you use AI?', 'Where it genuinely helps, for example reading invoices or sorting incoming requests. A person reviews anything the model is unsure about, and your data never goes to a tool you haven’t approved.'],
                    ['Which tools do you build with?', 'It depends on your systems and budget: n8n or Make for most flows, Power Automate if you work in Microsoft 365, and custom code when volume or logic calls for it. The audit ends with a recommendation.'],
                    ['How do we know it was worth it?', 'The audit records how long each task takes today. After launch, we report runs and time saved against that baseline every month.'],
                ],
                'cta' => 'Automate a process',
            ],
            'ar' => [
                'title' => 'الأتمتة',
                'tagline' => 'دع الأنظمة تتولّى النقل والنسخ، ليتفرّغ فريقك لما يهمّ.',
                'subtitle' => 'نربط نظام ERP وCRM والجداول والبريد الإلكتروني، لتنتقل الطلبات والفواتير والموافقات والتقارير تلقائياً، مع إبقاء القرار للإنسان حيث يلزم.',
                'audience' => 'لفرق العمليات والمالية والمبيعات التي يستهلك وقتها إعادة إدخال البيانات، أو ملاحقة الموافقات، أو إعداد التقرير نفسه مرة بعد مرة.',
                'problem' => 'في كل شركة نامية عمل يدوي مختبئ: نسخ الطلبات إلى نظام ERP، ومطابقة الفواتير، وإرسال التذكير نفسه كل يوم. إنه بطيء ويسبّب الأخطاء، ويزداد مع كل عميل جديد.',
                'pains' => [
                    ['فريقك يُدخل البيانات نفسها في نظامين أو ثلاثة.', 'أنظمة تتزامن تلقائياً، مع تحقّق ينبّهك إلى أي اختلاف بدل أن يخفيه.'],
                    ['الموافقات تتعطّل بين البريد الإلكتروني ورسائل واتساب.', 'مسارات اعتماد بمسؤول واضح وتذكيرات تلقائية وسجلّ تدقيق.'],
                    ['تقارير نهاية الشهر تستنزف الفريق بالنسخ واللصق.', 'تقارير ولوحات متابعة تُبنى تلقائياً من البيانات الحية.'],
                    ['تصل الفواتير وأوامر الشراء في ملفات PDF، ويقرأها الموظفون لإدخال بياناتها يدوياً.', 'استقبال آلي للمستندات يستخرج الحقول ويتحقق منها، ولا يرجع إلى الموظف إلا عند الشك.'],
                ],
                'approach' => 'نبدأ بالعمل لا بالأداة: نراقب كيف تُنجز المهمة اليوم، ونقيس الوقت الذي تستغرقه، ثم نؤتمت الخطوات المتكررة. لكل مسار سجلّات وتنبيهات وبديل يدوي عند الحاجة.',
                'steps' => [
                    ['تدقيق العمليات', '', 'نرسم سير العمل ونقيس زمن كل خطوة يدوية، ثم نرتّب أولويات الأتمتة حسب الساعات التي ستوفّرها.'],
                    ['المسار الأول', '', 'نؤتمت العملية الأعلى قيمة أولاً، ونشغّلها بالتوازي مع الطريقة اليدوية حتى تطمئن إليها.'],
                    ['التوسّع', '', 'ننتقل إلى العمليات التالية، ونربط بقية الأنظمة، وندرّب المسؤول عن كل مسار.'],
                    ['المتابعة', '', 'تنبيهات عند الأعطال، وتقرير شهري بعدد مرات التشغيل والأخطاء، وإصلاحات عند تغيّر أي نظام مرتبط.'],
                ],
                'deliverables' => [
                    'خريطة مرتّبة لعملياتك اليدوية والساعات التي تستهلكها كلٌّ منها',
                    'مسارات أتمتة تعمل بين الأنظمة التي تستخدمها اليوم',
                    'مسارات اعتماد وتنبيهات مع سجلّ تدقيق',
                    'تقارير ولوحات متابعة تتحدّث تلقائياً',
                    'سجلّ تشغيل وتنبيهات أعطال وبديل يدوي لكل مسار',
                    'أدلة مختصرة تمكّن فريقك من تعديل المسارات بنفسه',
                ],
                'engagements' => [
                    ['تدقيق الأتمتة', 'نطاق محدّد ومتّفق عليه مسبقاً', 'نقيس العمل اليدوي ونسلّمك قائمة مرتّبة بما يستحق الأتمتة، والأداة المناسبة لكلٍّ منها، وتقديراً بسقف محدد.', 'تشعر بالهدر لكنك لا تعرف حجمه بعد.'],
                    ['الأتمتة الأولى', 'حسب نطاق مشروعك', 'عملية واحدة عالية القيمة نؤتمتها بالكامل، ونشغّلها بالتوازي مع الطريقة اليدوية حتى تتطابق النتائج. بعد التشخيص، نتفق على النطاق والجدول في خطة مكتوبة قبل التوقيع.', 'عملية مرهقة واحدة تريد التخلص منها.'],
                    ['عقد أتمتة شهري', 'مستمر، بعقد دعم شهري', 'مسارات جديدة كل شهر، ومراقبة للمسارات العاملة، وإصلاحات عند تغيّر أي نظام مرتبط.', 'فرق تريد الأتمتة خطوة بخطوة.'],
                ],
                'faqs' => [
                    ['هل نحتاج إلى استبدال أنظمتنا الحالية؟', 'غالباً لا. نربط ما تستخدمه أصلاً، مثل نظام ERP أو CRM أو Google Workspace أو Microsoft 365، عبر واجهاتها البرمجية. وإن لم يكن للنظام واجهة برمجية، نناقش معك بدائل آمنة.'],
                    ['ماذا يحدث إذا تعطّلت الأتمتة؟', 'يسجّل كل مسار عمليات التشغيل، وينبّه شخصاً محدداً عند أي عطل. لا يضيع شيء بصمت، وتبقى هناك دائماً طريقة يدوية لإنجاز المهمة.'],
                    ['هل تستخدمون الذكاء الاصطناعي؟', 'حيث يفيد فعلاً، كقراءة الفواتير أو فرز الطلبات الواردة. يراجع موظف كل ما لا يكون النموذج متأكداً منه، ولا نرسل بياناتك إلى أي أداة لم توافق عليها.'],
                    ['ما الأدوات التي تستخدمونها؟', 'يعتمد ذلك على أنظمتك وميزانيتك: n8n أو Make لمعظم المسارات، وPower Automate إن كنتم تعملون على Microsoft 365، وبرمجة مخصّصة حين يتطلب حجم العمل أو منطقه ذلك. ونقدّم التوصية في نهاية التدقيق.'],
                    ['كيف نعرف أن الأتمتة كانت مجدية؟', 'يسجّل التدقيق الوقت الذي تستغرقه كل مهمة اليوم، وبعد الإطلاق نرفع إليك تقريراً شهرياً بعدد مرات التشغيل والوقت الموفَّر مقارنةً بذلك.'],
                ],
                'cta' => 'ابدأ بأتمتة عملية',
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function webDevelopment(): array
    {
        return [
            'tools' => ['Laravel', 'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'WordPress', 'PostgreSQL', 'Cloudflare', 'Google Analytics 4', 'Google Search Console'],
            'en' => [
                'title' => 'Web Development',
                'tagline' => 'Websites and web apps that load fast and read right in Arabic.',
                'subtitle' => 'Company websites, customer portals and web applications, bilingual from the first screen, fast on mobile networks, and easy for your team to update.',
                'audience' => 'For companies whose website is slow, hard to update or only half translated, and for teams that need a portal for customers, partners or staff.',
                'problem' => 'Your website is often the first thing a buyer checks. If it is slow on a phone, broken in Arabic, or needs a developer for every text change, it quietly costs you leads.',
                'pains' => [
                    ['The Arabic version feels like an afterthought.', 'Arabic and English designed together: right-to-left layouts, proper Arabic type and mirrored navigation.'],
                    ['Pages are slow on mobile.', 'Performance budgets, optimised images and server rendering, checked against Core Web Vitals.'],
                    ['Every content change needs a developer.', 'An admin panel your marketing team can use for pages, posts and SEO fields.'],
                    ['Customers email you for things a portal could do.', 'Self-service portals for orders, bookings, documents and account status.'],
                ],
                'approach' => 'We design in both languages at once, build on proven frameworks, and measure speed and accessibility on every release, not once at launch.',
                'steps' => [
                    ['Scope', '', 'Pages, user journeys, integrations and content owners, agreed in writing.'],
                    ['Design', '', 'Desktop and mobile screens in Arabic and English, plus a small design system.'],
                    ['Build', '', 'Previews at agreed milestones on a staging link, with content loaded through the admin panel.'],
                    ['Launch', '', 'Redirects, analytics, Search Console, speed checks and a handover session.'],
                ],
                'deliverables' => [
                    'Bilingual website or web app, live on your domain',
                    'Admin panel for pages, posts, media and SEO',
                    'Design system with reusable components',
                    'Analytics, Search Console and structured data set up',
                    'Speed and accessibility report at launch',
                    'Hosting, backups and SSL configured on your account',
                ],
                'engagements' => [
                    ['Website review', 'Fixed scope, agreed up front', 'We audit speed, Arabic quality, SEO and how content gets updated, and give you a prioritised fix list with a capped estimate.', 'An existing site that underperforms.'],
                    ['Website or portal build', 'Scoped to your project', 'Design and build in both languages, with an admin panel. After the diagnostic, we agree scope and schedule in a written plan before signing.', 'A new site, a redesign or a customer portal.'],
                    ['Care plan', 'Ongoing, on a monthly retainer', 'Updates, security patches, uptime monitoring and a set number of change hours each month.', 'Sites whose content changes often.'],
                ],
                'faqs' => [
                    ['How do you protect search visibility during a redesign?', 'We plan redirects, preserve metadata and monitor Search Console after launch to reduce the risk of losing visibility.'],
                    ['Will our team be able to edit the content?', 'Yes. Pages, posts, images and SEO fields are editable from an admin panel in both languages, and we train your team at handover.'],
                    ['Do you use WordPress?', 'When it is the right fit for a content site, yes. Portals and web apps we build with Laravel or Next.js. We recommend based on who will maintain the site later.'],
                    ['How do we agree the website scope?', 'After the website review, we agree pages, user journeys, integrations, scope and schedule in a written plan before signing.'],
                ],
                'cta' => 'Plan your website',
            ],
            'ar' => [
                'title' => 'تطوير الويب',
                'tagline' => 'مواقع وتطبيقات ويب سريعة، تُقرأ بالعربية كما يجب.',
                'subtitle' => 'مواقع الشركات وبوابات العملاء وتطبيقات الويب، ثنائية اللغة من أول شاشة، سريعة على شبكات الجوال، وسهلة التحديث لفريقك.',
                'audience' => 'للشركات التي موقعها بطيء أو صعب التحديث أو مترجم نصف ترجمة، وللفرق التي تحتاج بوابة لعملائها أو شركائها أو موظفيها.',
                'problem' => 'غالباً ما يكون موقعك أول ما يتفقّده العميل. فإن كان بطيئاً على الجوال، أو مختلّاً بالعربية، أو يحتاج مبرمجاً لتغيير كل نص، فهو يخسّرك فرصاً دون أن تشعر.',
                'pains' => [
                    ['النسخة العربية تبدو وكأنها أُضيفت لاحقاً.', 'تصميم عربي وإنجليزي متوازٍ: اتجاه صحيح من اليمين إلى اليسار، وخطوط عربية مناسبة، وتنقّل معكوس.'],
                    ['الصفحات بطيئة على الجوال.', 'ميزانية أداء وصور محسّنة وعرض من جهة الخادم، نتحقق منها بمؤشرات Core Web Vitals.'],
                    ['كل تعديل في المحتوى يحتاج مبرمجاً.', 'لوحة تحكم يستخدمها فريق التسويق لتحرير الصفحات والمقالات وحقول الظهور في محركات البحث.'],
                    ['عملاؤك يراسلونك لأمور يمكن أن تنجزها بوابة إلكترونية.', 'بوابات خدمة ذاتية للطلبات والحجوزات والمستندات ومتابعة الحساب.'],
                ],
                'approach' => 'نصمّم باللغتين معاً، ونبني على أُطر عمل مجرّبة، ونقيس السرعة وسهولة الوصول مع كل إصدار، لا مرة واحدة عند الإطلاق.',
                'steps' => [
                    ['تحديد النطاق', '', 'نتفق كتابياً على الصفحات ورحلات المستخدم والتكاملات والمسؤول عن كل محتوى.'],
                    ['التصميم', '', 'شاشات للحاسوب والجوال بالعربية والإنجليزية، مع نظام تصميم مصغّر.'],
                    ['البناء', '', 'معاينات عند محطات متّفق عليها على رابط تجريبي، وإدخال المحتوى عبر لوحة التحكم.'],
                    ['الإطلاق', '', 'تحويل الروابط القديمة، والتحليلات، وGoogle Search Console، وفحوصات السرعة، وجلسة تسليم.'],
                ],
                'deliverables' => [
                    'موقع أو تطبيق ويب ثنائي اللغة يعمل على نطاقك',
                    'لوحة تحكم للصفحات والمقالات والوسائط وتحسين الظهور',
                    'نظام تصميم بمكوّنات قابلة لإعادة الاستخدام',
                    'إعداد التحليلات وSearch Console والبيانات المنظّمة',
                    'تقرير السرعة وسهولة الوصول عند الإطلاق',
                    'استضافة ونسخ احتياطي وشهادة SSL مُعدّة على حسابك',
                ],
                'engagements' => [
                    ['مراجعة الموقع', 'نطاق محدّد ومتّفق عليه مسبقاً', 'نراجع السرعة وجودة النسخة العربية والظهور في محركات البحث وطريقة تحديث المحتوى، ونسلّمك قائمة إصلاحات مرتّبة مع تقدير بسقف محدد.', 'موقع قائم لا يؤدي كما ينبغي.'],
                    ['بناء موقع أو بوابة', 'حسب نطاق مشروعك', 'تصميم وتطوير باللغتين مع لوحة تحكم. بعد التشخيص، نتفق على النطاق والجدول في خطة مكتوبة قبل التوقيع.', 'موقع جديد أو إعادة تصميم أو بوابة عملاء.'],
                    ['خطة رعاية شهرية', 'مستمر، بعقد دعم شهري', 'تحديثات وترقيعات أمنية ومراقبة لتوفّر الموقع، مع عدد محدد من ساعات التعديل كل شهر.', 'مواقع يتغيّر محتواها باستمرار.'],
                ],
                'faqs' => [
                    ['كيف تحافظون على ظهور الموقع عند إعادة تصميمه؟', 'نخطّط لتحويل الروابط والحفاظ على البيانات الوصفية، ونتابع Search Console بعد الإطلاق لتقليل مخاطر تراجع الظهور.'],
                    ['هل سيتمكن فريقنا من تعديل المحتوى؟', 'نعم. الصفحات والمقالات والصور وحقول الظهور في محركات البحث قابلة للتعديل من لوحة التحكم باللغتين، وندرّب فريقك عند التسليم.'],
                    ['هل تستخدمون ووردبريس؟', 'نعم، حين يكون الأنسب لموقع محتوى. أما البوابات وتطبيقات الويب فنبنيها بـ Laravel أو Next.js، وتعتمد توصيتنا على من سيتولّى صيانة الموقع لاحقاً.'],
                    ['كيف نتفق على نطاق الموقع؟', 'بعد مراجعة الموقع، نتفق على الصفحات ورحلات المستخدم والتكاملات والنطاق والجدول في خطة مكتوبة قبل التوقيع.'],
                ],
                'cta' => 'خطّط لموقعك',
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function mobileApps(): array
    {
        return [
            'tools' => ['React Native', 'Expo', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Sentry', 'TestFlight', 'Google Play Console'],
            'en' => [
                'title' => 'Mobile Apps',
                'tagline' => 'Mobile apps built around the tasks your customers and teams need to complete.',
                'subtitle' => 'iOS and Android apps for customers, field teams and operations, built from one codebase where possible, in Arabic and English, and taken through store review for you.',
                'audience' => 'For businesses launching a customer app, replacing paper and WhatsApp for field staff, or rescuing an app that crashes and collects poor reviews.',
                'problem' => 'Mobile projects tend to stumble in the same places: two separate apps that drift apart, a store rejection on launch day, and nobody watching crashes after release.',
                'pains' => [
                    ['Maintaining separate iOS and Android codebases adds development and maintenance work.', 'One React Native or Flutter codebase for iOS and Android, with native code only where it matters.'],
                    ['Field teams still use paper forms and photos sent over WhatsApp.', 'An app with offline forms, photos and location that syncs when the signal returns.'],
                    ['The app was rejected by the store, or launched and nobody used it.', 'We handle store listings, privacy labels and review, and set up analytics from the start.'],
                    ['Crashes and one-star reviews, with no idea why.', 'Crash reporting, performance monitoring and a release routine that fixes the biggest issues first.'],
                ],
                'approach' => 'We prove the core journey on real devices early, build on one shared codebase, and treat store submission and post-launch monitoring as part of the job.',
                'steps' => [
                    ['Prototype', '', 'A clickable prototype of the core journey, tested on real phones with real users.'],
                    ['Build', '', 'Agreed build stages with test builds on TestFlight and Google Play internal testing.'],
                    ['Store launch', '', 'Listings, screenshots in both languages, privacy labels and store review.'],
                    ['Grow', '', 'Crash monitoring, OS updates and new features on a steady release cycle.'],
                ],
                'deliverables' => [
                    'iOS and Android apps published under your developer accounts',
                    'Backend API and admin panel',
                    'Push notifications, deep links and offline mode where needed',
                    'Store listings in Arabic and English',
                    'Crash reporting and product analytics',
                    'Source code and release documentation',
                ],
                'engagements' => [
                    ['App prototype', 'Fixed scope, agreed up front', 'A clickable prototype of the core journey, tested with users, plus a scoped build plan and a capped estimate.', 'Testing an idea before committing a budget.'],
                    ['App build', 'Scoped to your project', 'Design, build and store launch for iOS and Android. After the diagnostic, we agree scope and schedule in a written plan before signing.', 'A first release with a clear feature list.'],
                    ['App care', 'Ongoing, on a monthly retainer', 'Crash fixes, OS and SDK updates, store compliance and new features every month.', 'Live apps with active users.'],
                ],
                'faqs' => [
                    ['Native or cross-platform?', 'For most business apps, one cross-platform codebase (React Native or Flutter) is faster to build and cheaper to maintain. We go native when an app depends heavily on device hardware.'],
                    ['Whose store account is the app published under?', 'Yours. We help you open Apple and Google developer accounts in your company’s name, so you keep full control.'],
                    ['Can the app work without internet?', 'Yes, for the parts that need it. Forms, lists and photos can be saved offline and synced when the connection returns.'],
                    ['We already have an app. Can you take it over?', 'Usually, yes. We start with a short review of the code and the store listings, fix whatever blocks releases, then plan improvements.'],
                    ['Will Apple’s review delay our launch?', 'Store review depends on the application and the store’s requirements. After the diagnostic, we agree scope and schedule in a written plan before signing, account for store review, and submit test builds early.'],
                ],
                'cta' => 'Plan your app',
            ],
            'ar' => [
                'title' => 'تطبيقات الجوال',
                'tagline' => 'تطبيقات جوال تساعد عملاءك وفرقك على إنجاز مهامهم.',
                'subtitle' => 'تطبيقات iOS وAndroid لعملائك وفرقك الميدانية وعملياتك، من قاعدة شيفرة واحدة حين يمكن، بالعربية والإنجليزية، ونتولّى عنك مراجعة المتاجر.',
                'audience' => 'للشركات التي تطلق تطبيقاً لعملائها، أو تستبدل الورق ومحادثات واتساب لفرقها الميدانية، أو تريد إنقاذ تطبيق كثير الأعطال وضعيف التقييم.',
                'problem' => 'تتعثّر مشاريع الجوال غالباً في المواضع نفسها: تطبيقان منفصلان يبتعد أحدهما عن الآخر، ورفض من المتجر يوم الإطلاق، ولا أحد يراقب الأعطال بعد النشر.',
                'pains' => [
                    ['بناء تطبيقين منفصلين يزيد جهد التطوير والصيانة.', 'قاعدة شيفرة واحدة بـ React Native أو Flutter لنظامي iOS وAndroid، وشيفرة أصلية حيث يلزم فقط.'],
                    ['فرقك الميدانية ما زالت تستخدم النماذج الورقية وصور واتساب.', 'تطبيق بنماذج تعمل دون اتصال، وصور وموقع جغرافي، ومزامنة عند عودة الشبكة.'],
                    ['رُفض التطبيق من المتجر، أو أُطلق ولم يستخدمه أحد.', 'نتولّى صفحات المتجر وبيانات الخصوصية والمراجعة، ونجهّز التحليلات منذ البداية.'],
                    ['أعطال وتقييمات بنجمة واحدة دون معرفة السبب.', 'تتبّع الأعطال ومراقبة الأداء، ودورة إصدارات تعالج أكثر المشكلات تأثيراً أولاً.'],
                ],
                'approach' => 'نختبر الرحلة الأساسية على أجهزة حقيقية مبكراً، ونبني على قاعدة شيفرة مشتركة، ونعدّ النشر في المتاجر ومراقبة ما بعد الإطلاق جزءاً من العمل لا إضافة عليه.',
                'steps' => [
                    ['النموذج الأولي', '', 'نموذج تفاعلي للرحلة الأساسية نجرّبه على هواتف حقيقية مع مستخدمين حقيقيين.'],
                    ['البناء', '', 'مراحل بناء متّفق عليها، مع نسخ تجريبية عبر TestFlight والاختبار الداخلي في Google Play.'],
                    ['النشر في المتاجر', '', 'صفحات المتجر ولقطات الشاشة باللغتين وبيانات الخصوصية ومراجعة المتجر.'],
                    ['التطوير المستمر', '', 'مراقبة الأعطال، وتحديثات أنظمة التشغيل، وميزات جديدة بدورة إصدارات منتظمة.'],
                ],
                'deliverables' => [
                    'تطبيقا iOS وAndroid منشوران على حسابات المطوّر الخاصة بك',
                    'واجهة API خلفية ولوحة تحكم',
                    'إشعارات وروابط عميقة وعمل دون اتصال عند الحاجة',
                    'صفحات المتجر بالعربية والإنجليزية',
                    'تتبّع الأعطال وتحليلات الاستخدام',
                    'الشيفرة المصدرية وتوثيق خطوات الإصدار',
                ],
                'engagements' => [
                    ['نموذج أولي للتطبيق', 'نطاق محدّد ومتّفق عليه مسبقاً', 'نموذج تفاعلي للرحلة الأساسية نختبره مع المستخدمين، مع خطة بناء محددة وتقدير بسقف واضح.', 'التحقق من الفكرة قبل الالتزام بميزانية.'],
                    ['بناء التطبيق', 'حسب نطاق مشروعك', 'تصميم وتطوير ونشر في متجري Apple وGoogle. بعد التشخيص، نتفق على النطاق والجدول في خطة مكتوبة قبل التوقيع.', 'إصدار أول بقائمة ميزات واضحة.'],
                    ['رعاية التطبيق', 'مستمر، بعقد دعم شهري', 'إصلاح الأعطال، وتحديثات أنظمة التشغيل والمكتبات، والالتزام بسياسات المتاجر، وميزات جديدة كل شهر.', 'تطبيقات قائمة لها مستخدمون نشطون.'],
                ],
                'faqs' => [
                    ['تطبيق أصلي أم متعدد المنصات؟', 'لمعظم تطبيقات الأعمال، قاعدة شيفرة واحدة متعددة المنصات (React Native أو Flutter) أسرع في البناء وأقل كلفة في الصيانة. ونلجأ إلى التطوير الأصلي حين يعتمد التطبيق كثيراً على عتاد الجهاز.'],
                    ['باسم من يُنشر التطبيق في المتاجر؟', 'باسمك. نساعدك في فتح حسابات المطوّر لدى Apple وGoogle باسم شركتك، لتبقى السيطرة الكاملة بيدك.'],
                    ['هل يعمل التطبيق دون إنترنت؟', 'نعم، في الأجزاء التي تحتاج ذلك. يمكن حفظ النماذج والقوائم والصور دون اتصال ومزامنتها عند عودة الشبكة.'],
                    ['لدينا تطبيق قائم، فهل يمكنكم تولّيه؟', 'في الغالب نعم. نبدأ بمراجعة قصيرة للشيفرة ولصفحات المتجر، ونصلح ما يعيق الإصدارات، ثم نخطّط للتحسينات.'],
                    ['هل تؤخّر مراجعة Apple موعد الإطلاق؟', 'تعتمد المراجعة على التطبيق ومتطلبات المتجر. بعد التشخيص، نتفق على النطاق والجدول في خطة مكتوبة قبل التوقيع، ونراعي مراجعة المتجر ونرسل نسخاً تجريبية مبكراً.'],
                ],
                'cta' => 'خطّط لتطبيقك',
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function qa(): array
    {
        return [
            'tools' => ['Playwright', 'Cypress', 'Selenium', 'Appium', 'Postman', 'k6', 'JMeter', 'BrowserStack', 'GitHub Actions', 'Jira'],
            'en' => [
                'title' => 'Quality Assurance',
                'tagline' => 'Find the bugs before your customers do.',
                'subtitle' => 'Manual and automated testing for web and mobile products. We test the journeys that make you money, automate the checks you repeat, and tell you plainly whether a release is ready.',
                'audience' => 'For product owners and CTOs whose releases keep breaking something, who have no dedicated testers, or who are about to launch and want a second pair of eyes.',
                'problem' => 'When testing is whatever the developer had time for, bugs reach customers. Every release feels risky, so releases slow down, and the list of “small issues” keeps growing.',
                'pains' => [
                    ['Every release breaks something that used to work.', 'Automated regression tests on your key journeys, run on every change.'],
                    ['Customers find bugs before your team does.', 'Structured test plans and exploratory testing on real devices and browsers, in Arabic as well as English.'],
                    ['You don’t know if the system will survive a sale or a big launch.', 'Load tests that show where it slows down and what to fix first.'],
                    ['“Ready to release” is a gut feeling.', 'Clear release reports: what was tested, what failed, and the risk of shipping.'],
                ],
                'approach' => 'We start with the journeys that matter most to your business, test them by hand first, then automate what repeats. The tests live in your repository and run in your pipeline.',
                'steps' => [
                    ['QA assessment', '', 'We review your product, current tests and release process, and list the riskiest gaps.'],
                    ['Test plan', '', 'Critical journeys, devices, browsers and test data, agreed with your team.'],
                    ['Automate', '', 'A regression suite for the critical journeys, wired into your CI pipeline.'],
                    ['Release support', '', 'Manual and automated runs before each release, with a clear go or no-go report.'],
                ],
                'deliverables' => [
                    'Test strategy and plan for your critical journeys',
                    'Automated end-to-end and API tests in your repository',
                    'Tests running in your CI pipeline on every change',
                    'Load test results with bottlenecks and fixes',
                    'Bug reports with steps, screenshots and severity',
                    'A release readiness report before every launch',
                ],
                'engagements' => [
                    ['QA assessment', 'Fixed scope, agreed up front', 'We test your critical journeys, review your process, and give you a bug list and a ranked plan to close the gaps, with a capped estimate.', 'Frequent regressions, or a launch coming up.'],
                    ['Test automation build', 'Scoped to your project', 'A regression suite for your key journeys, running in your pipeline and documented for your developers. After the diagnostic, we agree scope and schedule in a written plan before signing.', 'Teams releasing often without a safety net.'],
                    ['QA retainer', 'Ongoing, on a monthly retainer', 'Testing for every release, test upkeep as the product changes, and a monthly quality report.', 'Products with a regular release cycle.'],
                ],
                'faqs' => [
                    ['Can you test software another company built?', 'Yes. Most QA work starts on an existing product. We need access to a test environment and someone who can answer questions about expected behaviour.'],
                    ['Manual or automated testing?', 'Both. Automation covers the journeys you repeat every release; manual and exploratory testing finds what no script anticipates, especially in Arabic layouts.'],
                    ['Do you test mobile apps on real devices?', 'Yes. We combine real iOS and Android phones with cloud device labs such as BrowserStack for wider coverage.'],
                    ['Who maintains the automated tests?', 'We do while we work together. The tests live in your repository with documentation, so your developers can take them over at any time.'],
                    ['How quickly do you report bugs?', 'Blocking issues are reported the same day with steps to reproduce. Everything else goes into your tracker, Jira or similar, ranked by severity.'],
                ],
                'cta' => 'Get a QA assessment',
            ],
            'ar' => [
                'title' => 'ضمان الجودة',
                'tagline' => 'اكتشف الأخطاء قبل أن يكتشفها عملاؤك.',
                'subtitle' => 'اختبارات يدوية وآلية لمنتجات الويب والجوال: نختبر الرحلات التي يعتمد عليها دخلك، ونؤتمت الفحوصات المتكررة، ونخبرك بوضوح إن كان الإصدار جاهزاً.',
                'audience' => 'لمالكي المنتجات والمديرين التقنيين الذين تكسر إصداراتهم شيئاً في كل مرة، أو ليس لديهم مختبِرون متفرّغون، أو يستعدّون لإطلاق ويريدون عيناً ثانية.',
                'problem' => 'حين يقتصر الاختبار على ما يتّسع له وقت المطوّر، تصل الأخطاء إلى العملاء. يصبح كل إصدار مخاطرة، فتتباطأ الإصدارات، وتتراكم «المشكلات الصغيرة» بلا نهاية.',
                'pains' => [
                    ['كل إصدار جديد يكسر شيئاً كان يعمل.', 'اختبارات انحدار آلية لرحلاتك الأساسية، تعمل مع كل تعديل.'],
                    ['عملاؤك يكتشفون الأخطاء قبل فريقك.', 'خطط اختبار منظّمة واختبار استكشافي على أجهزة ومتصفحات حقيقية، بالعربية والإنجليزية.'],
                    ['لا تعرف إن كان النظام سيصمد في موسم العروض أو عند إطلاق كبير.', 'اختبارات ضغط تكشف أين يتباطأ النظام وما الذي يجب إصلاحه أولاً.'],
                    ['قرار الإطلاق يعتمد على الإحساس.', 'تقارير إصدار واضحة: ما الذي اختُبر، وما الذي فشل، وحجم مخاطرة الإطلاق.'],
                ],
                'approach' => 'نبدأ بالرحلات الأهم لعملك، فنختبرها يدوياً أولاً، ثم نؤتمت ما يتكرر. تبقى الاختبارات في مستودعك وتعمل ضمن خط النشر لديك.',
                'steps' => [
                    ['تقييم الجودة', '', 'نراجع منتجك واختباراتك الحالية وطريقة الإصدار، ونحدّد أخطر الثغرات.'],
                    ['خطة الاختبار', '', 'نتفق مع فريقك على الرحلات الحرجة والأجهزة والمتصفحات وبيانات الاختبار.'],
                    ['الأتمتة', '', 'حزمة اختبارات الانحدار للرحلات الحرجة، مربوطة بخط التكامل المستمر لديك.'],
                    ['دعم الإصدارات', '', 'تشغيل يدوي وآلي قبل كل إصدار، مع تقرير واضح بالموافقة على الإطلاق أو تأجيله.'],
                ],
                'deliverables' => [
                    'استراتيجية وخطة اختبار لرحلاتك الحرجة',
                    'اختبارات آلية شاملة واختبارات API داخل مستودعك',
                    'اختبارات تعمل في خط التكامل المستمر مع كل تعديل',
                    'نتائج اختبارات الضغط مع نقاط الاختناق وحلولها',
                    'بلاغات أخطاء بخطوات إعادة الإنتاج ولقطات الشاشة ودرجة الخطورة',
                    'تقرير جاهزية قبل كل إطلاق',
                ],
                'engagements' => [
                    ['تقييم الجودة', 'نطاق محدّد ومتّفق عليه مسبقاً', 'نختبر رحلاتك الحرجة ونراجع طريقة العمل، ونسلّمك قائمة بالأخطاء وخطة مرتّبة لسدّ الثغرات مع تقدير بسقف محدد.', 'أعطال متكررة، أو إطلاق قريب.'],
                    ['بناء الاختبارات الآلية', 'حسب نطاق مشروعك', 'حزمة اختبارات الانحدار لرحلاتك الأساسية، تعمل ضمن خط النشر وموثّقة لمطوّريك. بعد التشخيص، نتفق على النطاق والجدول في خطة مكتوبة قبل التوقيع.', 'فرق تُصدر باستمرار دون شبكة أمان.'],
                    ['عقد جودة شهري', 'مستمر، بعقد دعم شهري', 'اختبار كل إصدار، وصيانة الاختبارات مع تطوّر المنتج، وتقرير جودة شهري.', 'منتجات ذات دورة إصدارات منتظمة.'],
                ],
                'faqs' => [
                    ['هل يمكنكم اختبار برنامج بنته شركة أخرى؟', 'نعم، فمعظم أعمال الجودة تبدأ على منتج قائم. نحتاج فقط إلى بيئة اختبار، وشخص يجيب عن أسئلتنا حول السلوك المتوقّع.'],
                    ['اختبار يدوي أم آلي؟', 'الاثنان معاً. الأتمتة تغطي الرحلات التي تتكرر مع كل إصدار، والاختبار اليدوي والاستكشافي يكشف ما لا يتوقّعه أي سيناريو مكتوب، خصوصاً في الواجهات العربية.'],
                    ['هل تختبرون تطبيقات الجوال على أجهزة حقيقية؟', 'نعم. نجمع بين هواتف iOS وAndroid حقيقية ومختبرات أجهزة سحابية مثل BrowserStack لتغطية أوسع.'],
                    ['من يتولّى صيانة الاختبارات الآلية؟', 'نتولّاها نحن طوال فترة التعاون، وتبقى الاختبارات في مستودعك مع توثيقها، فيستطيع مطوّروك تسلّمها في أي وقت.'],
                    ['متى تصلنا بلاغات الأخطاء؟', 'نبلّغ عن الأخطاء المعيقة في اليوم نفسه مع خطوات إعادة إنتاجها، أما البقية فتُسجَّل في نظام المتابعة لديك، مثل Jira، مرتّبة حسب الخطورة.'],
                ],
                'cta' => 'اطلب تقييماً للجودة',
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function cybersecurity(): array
    {
        return [
            'tools' => ['Burp Suite', 'OWASP ZAP', 'Nmap', 'Nessus', 'Semgrep', 'Trivy', 'OWASP ASVS', 'CIS Benchmarks', 'Cloudflare'],
            'en' => [
                'title' => 'Cybersecurity',
                'tagline' => 'Find and fix security weaknesses before an attacker exploits them.',
                'subtitle' => 'Security testing and hardening for web apps, APIs and cloud setups, with findings in plain language, fixes in priority order, and a retest to confirm they are closed.',
                'audience' => 'For companies handling sensitive data, preparing for a client’s security review or working toward SOC 2 readiness and ISO 27001-aligned controls.',
                'problem' => 'Most breaches start with something ordinary: an exposed admin panel, an outdated library, a leaked key, or a password reused across systems. Without regular testing, nobody knows these exist until it is too late.',
                'pains' => [
                    ['A client or partner has asked for a penetration test report.', 'A scoped penetration test of your web app and APIs, with a report you can share.'],
                    ['You don’t know what is exposed to the internet.', 'An external attack-surface review: domains, open services, leaked credentials and misconfigurations.'],
                    ['Your cloud was set up in a hurry and never reviewed.', 'A cloud configuration review against CIS Benchmarks, with fixes applied or guided.'],
                    ['You need to map security requirements to practical controls.', 'A gap review that maps your systems to the controls that apply, with practical next steps.'],
                ],
                'approach' => 'We test the way attackers work, using OWASP Top 10, ASVS and the OWASP Testing Guide, and report in two layers: a short summary for management and step-by-step fixes for your developers.',
                'steps' => [
                    ['Scope', '', 'Systems in scope, test windows, accounts and rules of engagement, agreed in writing.'],
                    ['Test', '', 'Automated scanning plus manual testing of login, access control, business logic and APIs.'],
                    ['Report', '', 'Findings ranked by severity, with evidence, business impact and fix steps.'],
                    ['Fix and retest', '', 'We help your team fix the issues, then retest and update the report.'],
                ],
                'deliverables' => [
                    'Penetration test report with an executive summary and technical detail',
                    'Findings ranked by severity, each with clear fix steps',
                    'A retest and updated report once fixes are in',
                    'Cloud and server hardening checklist',
                    'Security checks added to your development pipeline',
                    'Gap review against NIST CSF, ISO 27001-aligned controls and applicable NIS2 requirements',
                ],
                'engagements' => [
                    ['Security snapshot', 'Fixed scope, agreed up front', 'An external attack-surface review plus a focused test of your main application, with a prioritised fix list and a capped estimate for anything further.', 'You have never had a security review.'],
                    ['Penetration test', 'Scoped to your project', 'A full test of the agreed applications, APIs or cloud setup, including the report and one retest. After the diagnostic, we agree scope and schedule in a written plan before signing.', 'Client requirements, audits or a major launch.'],
                    ['Security retainer', 'Ongoing, on a monthly retainer', 'Monthly scanning, security review of new features, dependency monitoring and a yearly penetration test.', 'Products that change every month.'],
                ],
                'faqs' => [
                    ['Will testing affect our live system?', 'We agree test windows and limits in advance and test on a staging environment where possible. Anything risky is confirmed with you first.'],
                    ['Do you sign an NDA?', 'Yes, before we receive any access or data. Test data and credentials are deleted when the engagement ends.'],
                    ['Does a security assessment establish compliance?', 'An assessment provides technical findings and evidence for your review. We help close gaps against the requirements that apply; compliance decisions and final sign-off remain with your team and advisers.'],
                    ['What do we receive at the end?', 'A report with an executive summary for management, detailed findings with evidence and fix steps for developers, and an updated version after the retest.'],
                    ['Can you fix the issues as well?', 'Yes. The same team builds software, so we can fix findings directly or pair with your developers, and then retest.'],
                ],
                'cta' => 'Request a security review',
            ],
            'ar' => [
                'title' => 'الأمن السيبراني',
                'tagline' => 'اكتشف الثغرات الأمنية وأصلحها قبل أن يستغلّها مهاجم.',
                'subtitle' => 'اختبار أمني وتحصين لتطبيقات الويب وواجهات API والبيئات السحابية، بنتائج مكتوبة بلغة واضحة، وإصلاحات مرتّبة حسب الأولوية، وإعادة فحص للتأكد من إغلاقها.',
                'audience' => 'للشركات التي تتعامل مع بيانات حساسة، أو تستعد لمراجعة أمنية يطلبها عميل، أو تعمل للاستعداد لتدقيق SOC 2 ومواءمة ضوابطها مع ISO 27001.',
                'problem' => 'تبدأ معظم الاختراقات بشيء عادي: لوحة إدارة مكشوفة، أو مكتبة قديمة، أو مفتاح مسرّب، أو كلمة مرور مكرّرة بين الأنظمة. ومن دون فحص دوري، لا يعرف أحد بوجودها حتى فوات الأوان.',
                'pains' => [
                    ['عميل أو شريك طلب منك تقرير اختبار اختراق.', 'اختبار اختراق محدد النطاق لتطبيقك وواجهاته البرمجية، مع تقرير يمكنك مشاركته.'],
                    ['لا تعرف ما المكشوف من أنظمتك على الإنترنت.', 'مراجعة لسطح الهجوم الخارجي: النطاقات والخدمات المفتوحة وبيانات الدخول المسرّبة والإعدادات الخاطئة.'],
                    ['بيئتك السحابية أُعدّت على عجل ولم تُراجع قط.', 'مراجعة لإعدادات السحابة وفق معايير CIS، مع تطبيق الإصلاحات أو الإرشاد إليها.'],
                    ['تحتاج إلى ربط متطلبات الأمن بضوابط عملية.', 'مراجعة فجوات تربط أنظمتك بالضوابط المنطبقة عليها، مع خطوات عملية واضحة.'],
                ],
                'approach' => 'نختبر بالطريقة التي يعمل بها المهاجمون، مستندين إلى OWASP Top 10 وASVS ودليل OWASP للاختبار، ونكتب التقرير على مستويين: ملخص مختصر للإدارة، وخطوات إصلاح تفصيلية للمطوّرين.',
                'steps' => [
                    ['تحديد النطاق', '', 'نتفق كتابياً على الأنظمة المشمولة ونوافذ الاختبار والحسابات وقواعد العمل.'],
                    ['الاختبار', '', 'فحص آلي مع اختبار يدوي لتسجيل الدخول والصلاحيات ومنطق العمل وواجهات API.'],
                    ['التقرير', '', 'نتائج مرتّبة حسب الخطورة، مع الأدلة والأثر على العمل وخطوات الإصلاح.'],
                    ['الإصلاح وإعادة الفحص', '', 'نساعد فريقك في الإصلاح، ثم نعيد الفحص ونحدّث التقرير.'],
                ],
                'deliverables' => [
                    'تقرير اختبار اختراق بملخص تنفيذي وتفاصيل تقنية',
                    'نتائج مرتّبة حسب الخطورة، لكلٍّ منها خطوات إصلاح واضحة',
                    'إعادة فحص وتقرير محدّث بعد الإصلاح',
                    'قائمة تحصين للسحابة والخوادم',
                    'فحوصات أمنية مضافة إلى خط التطوير لديك',
                    'مراجعة فجوات وفق NIST CSF وضوابط متوافقة مع ISO 27001 ومتطلبات NIS2 المنطبقة',
                ],
                'engagements' => [
                    ['فحص أمني أولي', 'نطاق محدّد ومتّفق عليه مسبقاً', 'مراجعة لسطح الهجوم الخارجي واختبار مركّز لتطبيقك الرئيسي، مع قائمة إصلاحات مرتّبة وتقدير بسقف محدد لأي عمل إضافي.', 'لم تُجرِ أي مراجعة أمنية من قبل.'],
                    ['اختبار اختراق', 'حسب نطاق مشروعك', 'اختبار كامل للتطبيقات أو الواجهات البرمجية أو البيئة السحابية المتفق عليها، يشمل التقرير وإعادة فحص واحدة. بعد التشخيص، نتفق على النطاق والجدول في خطة مكتوبة قبل التوقيع.', 'متطلبات العملاء أو التدقيق أو إطلاق كبير.'],
                    ['عقد أمني شهري', 'مستمر، بعقد دعم شهري', 'فحص شهري، ومراجعة أمنية للميزات الجديدة، ومتابعة للمكتبات المستخدمة، واختبار اختراق سنوي.', 'منتجات تتغيّر كل شهر.'],
                ],
                'faqs' => [
                    ['هل يؤثّر الاختبار على النظام أثناء تشغيله؟', 'نتفق مسبقاً على نوافذ الاختبار وحدوده، ونختبر على بيئة تجريبية متى أمكن. وأي خطوة فيها مخاطرة نؤكدها معك أولاً.'],
                    ['هل توقّعون اتفاقية عدم إفصاح؟', 'نعم، قبل استلام أي صلاحية أو بيانات. وتُحذف بيانات الاختبار وبيانات الدخول عند انتهاء العمل.'],
                    ['هل يثبت التقييم الأمني امتثالنا؟', 'يوفّر التقييم نتائج تقنية وأدلة للمراجعة. نساعد في سدّ الفجوات وفق المتطلبات المنطبقة، وتبقى قرارات الامتثال والاعتماد النهائي لدى فريقك ومستشاريك.'],
                    ['ماذا نستلم في النهاية؟', 'تقريراً يتضمن ملخصاً تنفيذياً للإدارة، ونتائج تفصيلية بالأدلة وخطوات الإصلاح للمطوّرين، ونسخة محدّثة بعد إعادة الفحص.'],
                    ['هل يمكنكم إصلاح الثغرات أيضاً؟', 'نعم. الفريق نفسه يبني البرمجيات، فنستطيع إصلاح الثغرات مباشرة أو العمل مع مطوّريك، ثم نعيد الفحص.'],
                ],
                'cta' => 'اطلب مراجعة أمنية',
            ],
        ];
    }
}
