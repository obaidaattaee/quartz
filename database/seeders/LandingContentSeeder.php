<?php

namespace Database\Seeders;

use App\Models\LandingCaseStudy;
use App\Models\LandingClientLogo;
use App\Models\LandingFaq;
use App\Models\LandingProcessStep;
use App\Models\LandingProduct;
use App\Models\LandingService;
use Illuminate\Database\Seeder;

class LandingContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedServices();
        $this->seedProducts();
        $this->seedProcessSteps();
        $this->seedCaseStudies();
        $this->seedFaqs();
        $this->seedClientLogos();
    }

    private function seedServices(): void
    {
        $services = [
            [
                'code' => 'S_01',
                'title_en' => 'Custom Software Development',
                'title_ar' => 'تطوير برمجيات مخصّصة',
                'body_en' => 'Custom business systems, internal tools and APIs for work your existing software cannot handle.',
                'body_ar' => 'نبني أنظمة لإدارة أعمالك وأدوات داخلية وواجهات API عندما لا تلبّي البرامج الجاهزة احتياجاتك.',
                'tags_en' => ['Web', 'Mobile', 'APIs', 'Integrations'],
                'tags_ar' => ['ويب', 'جوال', 'APIs', 'تكاملات'],
            ],
            [
                'code' => 'S_02',
                'title_en' => 'Quality Assurance',
                'title_ar' => 'ضمان الجودة',
                'body_en' => 'Manual, automated and performance tests run alongside your release process, with clear results before launch.',
                'body_ar' => 'نربط الاختبارات الآلية واليدوية واختبارات الأداء بمسار النشر، لتعرف جاهزية كل إصدار.',
                'tags_en' => ['E2E', 'Load', 'Regression', 'CI'],
                'tags_ar' => ['E2E', 'اختبار الأحمال', 'اختبارات الانحدار', 'CI'],
            ],
            [
                'code' => 'S_03',
                'title_en' => 'Cybersecurity',
                'title_ar' => 'الأمن السيبراني',
                'body_en' => 'Penetration testing, security assessments, support for security operations teams and staff awareness training.',
                'body_ar' => 'اختبارات اختراق، وتقييم للوضع الأمني، ودعم لفرق العمليات الأمنية (SOC)، وتدريب الموظفين على التهديدات الشائعة.',
                'tags_en' => ['Pentest', 'SOC', 'Posture', 'Awareness'],
                'tags_ar' => ['اختراق', 'SOC', 'تقييم أمني', 'توعية'],
            ],
            [
                'code' => 'S_04',
                'title_en' => 'Business Automation',
                'title_ar' => 'أتمتة الأعمال',
                'body_en' => 'We connect systems and automate repetitive tasks, then measure the time saved and errors reduced.',
                'body_ar' => 'نربط الأنظمة ونؤتمت المهام المتكررة، ثم نقيس الوقت الذي وفّرته والأخطاء التي انخفضت.',
                'tags_en' => ['RPA', 'Workflow', 'ETL', 'Ops'],
                'tags_ar' => ['RPA', 'تدفّق', 'ETL', 'عمليات'],
            ],
        ];

        foreach ($services as $i => $s) {
            LandingService::updateOrCreate(
                ['code' => $s['code']],
                array_merge($s, ['sort_order' => $i]),
            );
        }
    }

    private function seedProducts(): void
    {
        $products = [
            [
                'code' => 'P_01',
                'name' => 'Quartz POS',
                'kind_en' => 'Point-of-Sale · E-commerce · CRM',
                'kind_ar' => 'نقاط بيع · تجارة إلكترونية · CRM',
                'pitch_en' => 'One stack to run the store, the site, and the customer relationship.',
                'pitch_ar' => 'حزمة واحدة لتشغيل المتجر والموقع والعلاقة مع العميل.',
                'url' => 'bo.quartz-solutions.net',
                'stats_en' => [
                    ['k' => 'Avg. checkout', 'v' => ''],
                    ['k' => 'Connected channels', 'v' => ''],
                    ['k' => 'Deployment scope', 'v' => 'Agreed per project'],
                ],
                'stats_ar' => [
                    ['k' => 'متوسط الدفع', 'v' => ''],
                    ['k' => 'قنوات متّصلة', 'v' => ''],
                    ['k' => 'نطاق النشر', 'v' => 'حسب نطاق المشروع'],
                ],
                'demo_kind' => 'bo',
            ],
            [
                'code' => 'P_02',
                'name' => 'Quartz Cyber',
                'kind_en' => 'Human-risk platform',
                'kind_ar' => 'منصّة المخاطر البشرية',
                'pitch_en' => 'Phishing, vishing, calendar and invoice simulations — measure the weakest link, then harden it.',
                'pitch_ar' => 'محاكاة تصيّد وهندسة صوتية ودعوات تقويم وفواتير — قس الحلقة الأضعف ثم حصّنها.',
                'url' => 'cyber.quartz-solutions.net',
                'stats_en' => [
                    ['k' => 'Attack vectors', 'v' => ''],
                    ['k' => 'Avg. click-rate lift', 'v' => ''],
                    ['k' => 'Templates', 'v' => ''],
                ],
                'stats_ar' => [
                    ['k' => 'قنوات هجوم', 'v' => ''],
                    ['k' => 'متوسط تحسّن النقر', 'v' => ''],
                    ['k' => 'قوالب', 'v' => ''],
                ],
                'demo_kind' => 'cyber',
            ],
        ];

        foreach ($products as $i => $p) {
            LandingProduct::updateOrCreate(
                ['code' => $p['code']],
                array_merge($p, ['sort_order' => $i]),
            );
        }
    }

    private function seedProcessSteps(): void
    {
        $steps = [
            [
                'n' => '01',
                'title_en' => 'Discover',
                'title_ar' => 'الاكتشاف',
                'body_en' => 'Workshops, system audits, threat models. We map what exists before proposing what’s next.',
                'body_ar' => 'ورش، مراجعات أنظمة، نمذجة تهديدات. نرسم ما هو قائم قبل أن نقترح ما بعده.',
                'duration_en' => '',
                'duration_ar' => '',
                'deliverable_en' => 'Findings doc',
                'deliverable_ar' => 'وثيقة نتائج',
            ],
            [
                'n' => '02',
                'title_en' => 'Design',
                'title_ar' => 'التصميم',
                'body_en' => 'We review and approve the architecture, user experience and security requirements with you before development starts.',
                'body_ar' => 'نراجع البنية التقنية وتجربة المستخدم ومتطلبات الأمن معك، ونعتمد التصميم قبل بدء البرمجة.',
                'duration_en' => '',
                'duration_ar' => '',
                'deliverable_en' => 'Signed spec',
                'deliverable_ar' => 'مواصفات موقّعة',
            ],
            [
                'n' => '03',
                'title_en' => 'Build',
                'title_ar' => 'البناء',
                'body_en' => 'Agreed build stages with working demos at each milestone. You see how the budget supports your priorities.',
                'body_ar' => 'مراحل بناء متّفق عليها، مع عروض عملية عند كل محطة. ترى كيف تخدم الميزانية أولوياتك.',
                'duration_en' => '',
                'duration_ar' => '',
                'deliverable_en' => 'Milestone demos',
                'deliverable_ar' => 'عروض عند المحطات المتّفق عليها',
            ],
            [
                'n' => '04',
                'title_en' => 'Harden',
                'title_ar' => 'التحصين',
                'body_en' => 'We test functionality, security and performance before the system goes live.',
                'body_ar' => 'نجري اختبارات الجودة والاختراق والأحمال لاكتشاف الأعطال والثغرات قبل التشغيل الفعلي.',
                'duration_en' => '',
                'duration_ar' => '',
                'deliverable_en' => 'Pentest report',
                'deliverable_ar' => 'تقرير اختراق',
            ],
            [
                'n' => '05',
                'title_en' => 'Operate',
                'title_ar' => 'التشغيل',
                'body_en' => 'We monitor your system under an agreed service level, with an engineer who knows its architecture and tools.',
                'body_ar' => 'نراقب النظام وفق اتفاقية مستوى خدمة، ويتابعك مهندس يعرف بنيته وأدواته.',
                'duration_en' => '',
                'duration_ar' => '',
                'deliverable_en' => 'SLA + runbook',
                'deliverable_ar' => 'SLA + دليل تشغيل',
            ],
        ];

        foreach ($steps as $i => $s) {
            LandingProcessStep::updateOrCreate(
                ['n' => $s['n']],
                array_merge($s, ['sort_order' => $i]),
            );
        }
    }

    private function seedCaseStudies(): void
    {
        $cases = [
            [
                'tag_en' => 'RETAIL',
                'tag_ar' => 'تجزئة',
                'client_en' => 'Northwind Retail, 42 stores',
                'client_ar' => 'نورثويند للتجزئة، 42 فرع',
                'headline_en' => 'Replaced 3 point-solutions with Quartz POS with an agreed project scope.',
                'headline_ar' => 'استبدلنا 3 حلول منفصلة بـ Quartz POS وفق نطاق متّفق عليه.',
                'metric' => '+18%',
                'metric_label_en' => 'avg. basket size',
                'metric_label_ar' => 'متوسط حجم السلّة',
            ],
            [
                'tag_en' => 'FINANCE',
                'tag_ar' => 'تمويل',
                'client_en' => 'Meridian Credit Union',
                'client_ar' => 'اتحاد ميريديان الائتماني',
                'headline_en' => 'Phishing click-through cut from 31% to 6%.',
                'headline_ar' => 'تقليص نقرات التصيّد من 31% إلى 6%.',
                'metric' => '−81%',
                'metric_label_en' => 'human-risk exposure',
                'metric_label_ar' => 'تقليل المخاطر البشرية',
            ],
            [
                'tag_en' => 'LOGISTICS',
                'tag_ar' => 'لوجستيات',
                'client_en' => 'Cascade Freight',
                'client_ar' => 'كاسكيد للشحن',
                'headline_en' => 'Automated dispatch workflow saving 2,100 hrs/mo.',
                'headline_ar' => 'أتمتة تدفق التوزيع توفّر 2,100 ساعة شهرياً.',
                'metric' => '2.1k',
                'metric_label_en' => 'hrs reclaimed / month',
                'metric_label_ar' => 'ساعة مستعادة / شهرياً',
            ],
        ];

        foreach ($cases as $i => $c) {
            // Placeholder clients and metrics — kept for reference but
            // hidden until replaced with verified, client-approved results.
            LandingCaseStudy::updateOrCreate(
                ['headline_en' => $c['headline_en']],
                array_merge($c, ['sort_order' => $i, 'is_visible' => false]),
            );
        }
    }

    private function seedFaqs(): void
    {
        $faqs = [
            [
                'question_en' => 'Do you work with existing teams or only new projects?',
                'question_ar' => 'هل تعملون مع فرق قائمة أم مشاريع جديدة فقط؟',
                'answer_en' => 'Both. We can deliver a defined part of the project alongside your developers, with documentation and a handover to your team.',
                'answer_ar' => 'نعمل مع الفرق القائمة والمشاريع الجديدة. يمكننا تنفيذ جزء محدد مع مطوّريك، مع توثيق العمل وتسليمه لفريقك.',
            ],
            [
                'question_en' => 'How are projects priced?',
                'question_ar' => 'كيف تُسعَّر المشاريع؟',
                'answer_en' => 'Discovery has an agreed scope. Development is billed for the team’s time within an agreed cost ceiling, with optional monthly support.',
                'answer_ar' => 'نتفق على نطاق التشخيص مسبقاً. ويُسعَّر التطوير بحسب وقت الفريق، مع سقف تكلفة مكتوب، ويكون الدعم الشهري اختيارياً.',
            ],
            [
                'question_en' => 'Where is your team based?',
                'question_ar' => 'أين يقع فريقكم؟',
                'answer_en' => 'We work remotely with clients worldwide, mostly in the US and Europe, with one dedicated lead per project.',
                'answer_ar' => 'نعمل عن بُعد مع عملاء حول العالم، أغلبهم في الولايات المتحدة وأوروبا، مع قائد مخصّص لكل مشروع.',
            ],
            [
                'question_en' => 'Is Quartz Cyber a SaaS or self-hosted?',
                'question_ar' => 'هل Quartz Cyber خدمة سحابية أم استضافة ذاتية؟',
                'answer_en' => 'Cloud-hosted by default with regional data residency; on-prem available for regulated sectors.',
                'answer_ar' => 'سحابي افتراضياً مع الإقامة الإقليمية للبيانات؛ والاستضافة الذاتية متاحة للقطاعات المنظّمة.',
                // Company platforms are not marketed on the services site.
                'is_visible' => false,
            ],
            [
                'question_en' => 'What’s the smallest engagement you’ll take?',
                'question_ar' => 'هل تقبلون مشاريع صغيرة؟',
                'answer_en' => 'A fixed-scope diagnostic. We agree scope and schedule per project in a written plan before signing. The diagnostic roadmap is yours, whoever builds it.',
                'answer_ar' => 'تشخيص بنطاق محدّد. نتفق على النطاق والجدول حسب مشروعك في خطة مكتوبة قبل التوقيع. خارطة الطريق لك، أيّاً كان من سينفّذها.',
            ],
        ];

        foreach ($faqs as $i => $f) {
            LandingFaq::updateOrCreate(
                ['question_en' => $f['question_en']],
                array_merge(['is_visible' => true], $f, ['sort_order' => $i]),
            );
        }
    }

    private function seedClientLogos(): void
    {
        $logos = [
            ['en' => 'NORTHWIND', 'ar' => 'نورثويند'],
            ['en' => 'ACME INDUSTRIES', 'ar' => 'أكمي'],
            ['en' => 'HELIOS GROUP', 'ar' => 'هيلوس'],
            ['en' => 'MERIDIAN', 'ar' => 'ميريديان'],
            ['en' => 'FORGEWORKS', 'ar' => 'فورجووركس'],
            ['en' => 'AURELIA', 'ar' => 'أوريليا'],
            ['en' => 'CASCADE CO.', 'ar' => 'كاسكيد'],
            ['en' => 'OBSIDIAN LABS', 'ar' => 'أوبسيديان لابس'],
            ['en' => 'VERTEX', 'ar' => 'فيرتكس'],
            ['en' => 'STRATUS', 'ar' => 'ستراتوس'],
        ];

        foreach ($logos as $i => $l) {
            LandingClientLogo::updateOrCreate(
                ['label_en' => $l['en']],
                [
                    'label_en' => $l['en'],
                    'label_ar' => $l['ar'],
                    'sort_order' => $i,
                ],
            );
        }
    }
}
