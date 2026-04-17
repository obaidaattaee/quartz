<?php

use App\Models\ServicePage;
use Illuminate\Database\Migrations\Migration;

/**
 * Seed service_pages rows for the two new services introduced in the
 * Quartz redesign (2026-04): web-development and mobile-apps.
 */
return new class extends Migration
{
    public function up(): void
    {
        ServicePage::updateOrCreate(
            ['slug' => 'web-development'],
            [
                'title_en' => 'Web Development',
                'title_ar' => 'تطوير الويب',
                'subtitle_en' => 'Fast, accessible, modern web apps — engineered to last beyond the trend cycle.',
                'subtitle_ar' => 'تطبيقات ويب حديثة سريعة وسهلة الوصول مصمّمة لتصمد طويلاً.',
                'problem_en' => 'Most business web apps are stuck on aging stacks — slow, hard to iterate, painful to maintain. Teams want to ship new features, but every release fights the framework.',
                'problem_ar' => 'معظم تطبيقات الويب التجارية عالقة على تقنيات قديمة — بطيئة وصعبة التطوير ومُكلفة في الصيانة. الفِرق تريد إطلاق ميزات جديدة، لكن كل إصدار يصارع التقنية نفسها.',
                'approach_en' => 'We build on modern frameworks (React, Next.js, Laravel, Nuxt) with first-class accessibility, performance budgets, and SEO baked in from day one. Your app is typed end-to-end and deploys in minutes.',
                'approach_ar' => 'نبني على أُطر حديثة (React وNext.js وLaravel وNuxt) مع إمكانية الوصول والأداء وتحسين محركات البحث من اليوم الأول. التطبيق مكتوب بأنواع صارمة من البداية للنهاية وينشر خلال دقائق.',
                'process_steps_en' => [
                    ['title' => 'Discover', 'description' => 'Understand user flows, integrations, and non-negotiables.'],
                    ['title' => 'Design', 'description' => 'Component library, design tokens, accessibility baseline.'],
                    ['title' => 'Build', 'description' => 'Type-safe full-stack delivery with CI/CD from day one.'],
                    ['title' => 'Launch', 'description' => 'Monitored deploy, performance audit, hand-off or ongoing care.'],
                ],
                'process_steps_ar' => [
                    ['title' => 'الاستكشاف', 'description' => 'فهم رحلات المستخدم والتكاملات والمتطلبات الأساسية.'],
                    ['title' => 'التصميم', 'description' => 'مكتبة مكونات، ومعايير تصميم، وأساس لإمكانية الوصول.'],
                    ['title' => 'البناء', 'description' => 'تسليم كامل بأنواع صارمة مع تكامل ونشر مستمرّين.'],
                    ['title' => 'الإطلاق', 'description' => 'نشر موثّق ومراقب، وتدقيق أداء، وتسليم أو رعاية مستمرّة.'],
                ],
                'deliverables_en' => [
                    'Responsive web application (SPA, SSR, or hybrid)',
                    'Component library aligned with your brand',
                    'Accessibility audit passing WCAG 2.1 AA',
                    'CI/CD pipeline and preview environments',
                    'Analytics, SEO, and performance monitoring',
                ],
                'deliverables_ar' => [
                    'تطبيق ويب متجاوب (SPA أو SSR أو هجين)',
                    'مكتبة مكونات متوافقة مع هوية علامتك',
                    'تدقيق إمكانية الوصول بمعايير WCAG 2.1 AA',
                    'خط أنابيب CI/CD وبيئات معاينة',
                    'مراقبة تحليلية وSEO وأداء',
                ],
                'cta_text_en' => 'Start your web project',
                'cta_text_ar' => 'ابدأ مشروع الويب',
            ]
        );

        ServicePage::updateOrCreate(
            ['slug' => 'mobile-apps'],
            [
                'title_en' => 'Mobile Apps',
                'title_ar' => 'تطبيقات الجوال',
                'subtitle_en' => 'Native and cross-platform apps for iOS and Android — built for users, tuned for the stores.',
                'subtitle_ar' => 'تطبيقات أصلية ومتعددة المنصات لنظامي iOS وAndroid — مبنية للمستخدم ومضبوطة للمتاجر.',
                'problem_en' => 'Mobile projects stall on platform politics — native teams for each OS, inconsistent UX, slow release cadence, and app-store surprises on launch day.',
                'problem_ar' => 'مشاريع الجوال تتعثّر بسبب متطلبات كل منصة — فرق منفصلة لكل نظام، وتجربة مستخدم غير متناسقة، ودورات إصدار بطيئة، ومفاجآت من متاجر التطبيقات يوم الإطلاق.',
                'approach_en' => 'We pick the right tool per project — React Native for rapid cross-platform delivery, Swift/Kotlin where it matters. A single codebase where possible, native performance where required.',
                'approach_ar' => 'نختار الأداة المناسبة لكل مشروع — React Native للتسليم السريع متعدد المنصات، وSwift/Kotlin حيث يلزم. قاعدة كود واحدة قدر الإمكان، وأداء أصلي حيث يجب.',
                'process_steps_en' => [
                    ['title' => 'Prototype', 'description' => 'Clickable proof of value on real devices within weeks.'],
                    ['title' => 'Build', 'description' => 'Production codebase with shared component library and tests.'],
                    ['title' => 'Submit', 'description' => 'App Store and Play Store handling, privacy labels, screenshots.'],
                    ['title' => 'Iterate', 'description' => 'Release cadence, crash-free monitoring, feature experimentation.'],
                ],
                'process_steps_ar' => [
                    ['title' => 'النموذج الأولي', 'description' => 'إثبات قيمة قابل للتجربة على أجهزة حقيقية خلال أسابيع.'],
                    ['title' => 'البناء', 'description' => 'قاعدة كود إنتاجية مع مكتبة مكونات مشتركة واختبارات.'],
                    ['title' => 'النشر', 'description' => 'إدارة المتاجر والتسميات وبيانات الخصوصية واللقطات.'],
                    ['title' => 'التكرار', 'description' => 'دورة إصدارات ومراقبة للأعطال وتجارب للميزات.'],
                ],
                'deliverables_en' => [
                    'iOS and Android apps from one codebase where possible',
                    'Deep links, push notifications, offline support',
                    'App Store and Google Play listings, privacy reviews',
                    'Crashlytics and analytics instrumentation',
                    'Ongoing release and store-management support',
                ],
                'deliverables_ar' => [
                    'تطبيقات iOS وAndroid من قاعدة كود واحدة عند الإمكان',
                    'روابط عميقة وإشعارات وتشغيل بلا اتصال',
                    'نشر في App Store و Google Play ومراجعات الخصوصية',
                    'تتبّع الأعطال وأدوات التحليل',
                    'دعم مستمر للإصدارات وإدارة المتاجر',
                ],
                'cta_text_en' => 'Plan your mobile app',
                'cta_text_ar' => 'خطّط لتطبيقك على الجوال',
            ]
        );
    }

    public function down(): void
    {
        ServicePage::whereIn('slug', ['web-development', 'mobile-apps'])->delete();
    }
};
