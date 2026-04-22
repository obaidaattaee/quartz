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
                'body_en' => 'Line-of-business platforms, internal tools, API fabrics. We build what off-the-shelf can’t.',
                'body_ar' => 'منصّات لمنطق الأعمال، أدوات داخلية، طبقات واجهات برمجية. نبني ما لا تستطيع الحلول الجاهزة تقديمه.',
                'tags_en' => ['Web', 'Mobile', 'APIs', 'Integrations'],
                'tags_ar' => ['ويب', 'جوال', 'APIs', 'تكاملات'],
            ],
            [
                'code' => 'S_02',
                'title_en' => 'Quality Assurance',
                'title_ar' => 'ضمان الجودة',
                'body_en' => 'Automated, manual and performance testing baked into the pipeline — release with evidence.',
                'body_ar' => 'اختبارات آلية ويدوية وأداء مدمجة في خط الإنتاج — إصدار بأدلّة.',
                'tags_en' => ['E2E', 'Load', 'Regression', 'CI'],
                'tags_ar' => ['E2E', 'حمل', 'انحدار', 'CI'],
            ],
            [
                'code' => 'S_03',
                'title_en' => 'Cybersecurity',
                'title_ar' => 'الأمن السيبراني',
                'body_en' => 'Pentest, posture reviews, SOC augmentation and human-risk training for teams that can’t afford downtime.',
                'body_ar' => 'اختبار اختراق، مراجعة وضعيات، دعم SOC، وتدريب على المخاطر البشرية للفرق التي لا تتحمّل التعطّل.',
                'tags_en' => ['Pentest', 'SOC', 'Posture', 'Awareness'],
                'tags_ar' => ['اختراق', 'SOC', 'وضعية', 'توعية'],
            ],
            [
                'code' => 'S_04',
                'title_en' => 'Business Automation',
                'title_ar' => 'أتمتة الأعمال',
                'body_en' => 'Workflow engines, RPA and ops tooling that turn manual work into measurable throughput.',
                'body_ar' => 'محرّكات تدفّق عمل، RPA، وأدوات تشغيل تحوّل العمل اليدوي إلى إنتاجية قابلة للقياس.',
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
                    ['k' => 'Avg. checkout', 'v' => '1.4s'],
                    ['k' => 'Connected channels', 'v' => '8+'],
                    ['k' => 'Deploy time', 'v' => '2 wks'],
                ],
                'stats_ar' => [
                    ['k' => 'متوسط الدفع', 'v' => '1.4 ث'],
                    ['k' => 'قنوات متّصلة', 'v' => '+8'],
                    ['k' => 'زمن النشر', 'v' => 'أسبوعان'],
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
                    ['k' => 'Attack vectors', 'v' => '6'],
                    ['k' => 'Avg. click-rate lift', 'v' => '−63%'],
                    ['k' => 'Templates', 'v' => '200+'],
                ],
                'stats_ar' => [
                    ['k' => 'قنوات هجوم', 'v' => '6'],
                    ['k' => 'متوسط تحسّن النقر', 'v' => '−63%'],
                    ['k' => 'قوالب', 'v' => '+200'],
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
                'duration_en' => '1–2 wks',
                'duration_ar' => 'أسبوع–أسبوعان',
                'deliverable_en' => 'Findings doc',
                'deliverable_ar' => 'وثيقة نتائج',
            ],
            [
                'n' => '02',
                'title_en' => 'Design',
                'title_ar' => 'التصميم',
                'body_en' => 'Architecture, UX, security posture. Drawn, reviewed, signed-off before a line of code.',
                'body_ar' => 'معمارية، تجربة مستخدم، وضعية أمنية. مرسومة، مراجعة، ومعتمدة قبل كتابة سطر كود.',
                'duration_en' => '2–3 wks',
                'duration_ar' => '2–3 أسابيع',
                'deliverable_en' => 'Signed spec',
                'deliverable_ar' => 'مواصفات موقّعة',
            ],
            [
                'n' => '03',
                'title_en' => 'Build',
                'title_ar' => 'البناء',
                'body_en' => 'Two-week cycles, demoable at every stop. You always see where the budget went.',
                'body_ar' => 'دورات مدتها أسبوعان، قابلة للعرض في كل محطة. ترى دائماً أين ذهبت الميزانية.',
                'duration_en' => '6–12 wks',
                'duration_ar' => '6–12 أسبوعاً',
                'deliverable_en' => 'Weekly demos',
                'deliverable_ar' => 'عروض أسبوعية',
            ],
            [
                'n' => '04',
                'title_en' => 'Harden',
                'title_ar' => 'التحصين',
                'body_en' => 'Test, pentest, load. We break it on purpose so production doesn’t.',
                'body_ar' => 'اختبار، اختراق، حمل. نكسره عمداً كي لا ينكسر الإنتاج.',
                'duration_en' => '1–2 wks',
                'duration_ar' => 'أسبوع–أسبوعان',
                'deliverable_en' => 'Pentest report',
                'deliverable_ar' => 'تقرير اختراق',
            ],
            [
                'n' => '05',
                'title_en' => 'Operate',
                'title_ar' => 'التشغيل',
                'body_en' => 'Observability, SLA, and a named engineer who already knows your stack.',
                'body_ar' => 'قابلية مراقبة، اتفاقية مستوى خدمة، ومهندس مُعيّن يعرف حزمتك مسبقاً.',
                'duration_en' => 'Ongoing',
                'duration_ar' => 'مستمر',
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
                'headline_en' => 'Replaced 3 point-solutions with Quartz POS in 11 weeks.',
                'headline_ar' => 'استبدلنا 3 حلول منفصلة بـ Quartz POS في 11 أسبوعاً.',
                'metric' => '+18%',
                'metric_label_en' => 'avg. basket size',
                'metric_label_ar' => 'متوسط حجم السلّة',
            ],
            [
                'tag_en' => 'FINANCE',
                'tag_ar' => 'تمويل',
                'client_en' => 'Meridian Credit Union',
                'client_ar' => 'اتحاد ميريديان الائتماني',
                'headline_en' => 'Phishing click-through cut from 31% to 6% in one quarter.',
                'headline_ar' => 'تقليص نقرات التصيّد من 31% إلى 6% في ربع واحد.',
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
            LandingCaseStudy::updateOrCreate(
                ['headline_en' => $c['headline_en']],
                array_merge($c, ['sort_order' => $i]),
            );
        }
    }

    private function seedFaqs(): void
    {
        $faqs = [
            [
                'question_en' => 'Do you work with existing teams or only greenfield?',
                'question_ar' => 'هل تعملون مع فرق قائمة أم مشاريع جديدة فقط؟',
                'answer_en' => 'Both. Most engagements plug into an existing engineering org as a capability layer — we embed, document, and leave you stronger than we found you.',
                'answer_ar' => 'كلاهما. معظم ارتباطاتنا تندمج داخل فريق هندسي قائم كطبقة قدرات — نندمج، نوثّق، ونترك فريقك أقوى مما وجدناه.',
            ],
            [
                'question_en' => 'How are projects priced?',
                'question_ar' => 'كيف تُسعَّر المشاريع؟',
                'answer_en' => 'Fixed-scope for discovery, time-and-materials for build, retainer for operate. You always know the ceiling before you sign.',
                'answer_ar' => 'نطاق ثابت للاكتشاف، وقت ومواد للبناء، ومقابل شهري للتشغيل. تعرف السقف دائماً قبل التوقيع.',
            ],
            [
                'question_en' => 'Where is your team based?',
                'question_ar' => 'أين يقع فريقكم؟',
                'answer_en' => 'Distributed across Europe, North Africa, the Gulf, SE Asia and the Americas — with a named lead in your timezone. Every engagement has one accountable engineer on your side.',
                'answer_ar' => 'موزّع على أوروبا وشمال أفريقيا والخليج وجنوب شرق آسيا والأمريكتَين — مع قائد مُعيَّن في منطقتك الزمنية. كل ارتباط له مهندس مسؤول واحد إلى جانبك.',
            ],
            [
                'question_en' => 'Is Quartz Cyber a SaaS or self-hosted?',
                'question_ar' => 'هل Quartz Cyber خدمة سحابية أم استضافة ذاتية؟',
                'answer_en' => 'Cloud-hosted by default with regional data residency; on-prem available for regulated sectors.',
                'answer_ar' => 'سحابي افتراضياً مع الإقامة الإقليمية للبيانات؛ والاستضافة الذاتية متاحة للقطاعات المنظّمة.',
            ],
            [
                'question_en' => 'What’s the smallest engagement you’ll take?',
                'question_ar' => 'ما أصغر ارتباط تقبلونه؟',
                'answer_en' => 'A two-week diagnostic. We return a written roadmap whether or not you continue with us.',
                'answer_ar' => 'تشخيص مدته أسبوعان. نسلّم خارطة طريق مكتوبة سواء أكملت معنا أم لا.',
            ],
        ];

        foreach ($faqs as $i => $f) {
            LandingFaq::updateOrCreate(
                ['question_en' => $f['question_en']],
                array_merge($f, ['sort_order' => $i]),
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
