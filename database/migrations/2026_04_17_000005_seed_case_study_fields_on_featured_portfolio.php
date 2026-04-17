<?php

use App\Models\PortfolioItem;
use Illuminate\Database\Migrations\Migration;

/**
 * Back-fill structured case-study content on the first published portfolio
 * item so the new /portfolio/{slug} layout has something real to render.
 * Later items can be filled in via the admin UI.
 */
return new class extends Migration
{
    public function up(): void
    {
        $item = PortfolioItem::where('status', 'published')
            ->orderBy('sort_order')
            ->first();

        if (! $item) {
            return;
        }

        $item->fill([
            'outcome_headline_en' => $item->outcome_headline_en
                ?: 'Cut checkout abandonment by 38% and lifted average order value by 22% within six months of launch.',
            'outcome_headline_ar' => $item->outcome_headline_ar
                ?: 'خفض التخلّي عن الدفع بنسبة ٣٨٪ ورفع متوسط قيمة الطلب ٢٢٪ خلال ستة أشهر من الإطلاق.',

            'challenge_en' => $item->challenge_en ?? <<<'TXT'
The legacy storefront was built on a decade-old PHP monolith. Checkout relied on three brittle third-party scripts, mobile conversion was half of desktop, and every campaign required a developer to change copy. The team wanted to ship weekly but was averaging one release a quarter.

Leadership was weighing a full rewrite against "another renovation." A previous agency had attempted the rewrite twice and given up both times.
TXT,
            'challenge_ar' => $item->challenge_ar ?? <<<'TXT'
كانت واجهة المتجر تعمل على نظام PHP متجانس عمره عشر سنوات. الدفع كان يعتمد على ثلاث سكربتات خارجية هشّة، وكانت نسبة التحويل على الجوال نصف ما هي عليه على سطح المكتب، وكل حملة تسويقية كانت تتطلب مطورًا لتغيير النصوص. الفريق كان يريد الإطلاق أسبوعيًا لكنه أطلق مرة واحدة كل ربع سنة.

كانت الإدارة تزن خيار إعادة البناء الكاملة مقابل "تجديد آخر". كانت وكالة سابقة قد حاولت إعادة البناء مرتين واستسلمت في كلتا المرتين.
TXT,

            'approach_en' => $item->approach_en ?? <<<'TXT'
We proposed the strangler-fig pattern: no big-bang rewrite, no feature freeze. Over sixteen weeks, we lifted one surface at a time — search, product detail, cart, checkout — onto a fresh Next.js front end while the legacy PHP kept serving everything else.

A shared design system went live in week three. Copy moved from code to a lightweight CMS in week five. By week twelve the marketing team was shipping landing pages without involving engineering.
TXT,
            'approach_ar' => $item->approach_ar ?? <<<'TXT'
اقترحنا نمط "الشجرة الخانقة": لا إعادة بناء بضربة واحدة، ولا تجميد للميزات. خلال ستة عشر أسبوعًا، نقلنا واجهة تلو الأخرى — البحث، صفحة المنتج، السلة، الدفع — إلى واجهة Next.js جديدة بينما استمرّ النظام القديم في خدمة كل ما تبقى.

أُطلقت مكتبة تصميم مشتركة في الأسبوع الثالث. انتقلت النصوص من الكود إلى نظام إدارة محتوى خفيف في الأسبوع الخامس. وبحلول الأسبوع الثاني عشر كان فريق التسويق يطلق صفحات هبوط دون إشراك الهندسة.
TXT,

            'solution_en' => $item->solution_en ?? <<<'TXT'
The new stack is Next.js on the front with a thin BFF layer, PostgreSQL, and a queue-driven integration bus that speaks to the legacy PHP where it still lives. Everything is typed end-to-end; every route has a Playwright smoke test; every deploy runs a Lighthouse budget gate.

Checkout uses a single payment provider with a direct PCI-DSS scope, not three scripts and hope. Feature flags let the team roll changes to 5% of traffic first.
TXT,
            'solution_ar' => $item->solution_ar ?? <<<'TXT'
النظام الجديد يقوم على Next.js في الواجهة مع طبقة BFF خفيفة، وقاعدة بيانات PostgreSQL، ومحور تكامل عبر قوائم انتظار يتحدث مع PHP القديم حيث لا يزال قائمًا. كل شيء مكتوب بأنواع صارمة من البداية إلى النهاية؛ كل مسار له اختبار Playwright سريع؛ كل نشر يمرّ ببوّابة Lighthouse.

الدفع يستخدم مزودًا واحدًا بنطاق PCI-DSS مباشر، بدلًا من ثلاث سكربتات وتمنّيات. تتيح قوائم الميزات للفريق إطلاق التغييرات على ٥٪ من الحركة أولًا.
TXT,

            'results_en' => $item->results_en ?? <<<'TXT'
Six months after launch, checkout abandonment was down 38%. Average order value rose 22%, mostly from the recommendations module that was previously impossible to ship. Mobile conversion reached parity with desktop for the first time in the product's history.

Release cadence moved from one per quarter to three per week. The engineering team reported a significant drop in "oncall" incident noise — the shared design system eliminated an entire class of production regressions.
TXT,
            'results_ar' => $item->results_ar ?? <<<'TXT'
بعد ستة أشهر من الإطلاق، انخفض التخلّي عن الدفع ٣٨٪. ارتفع متوسط قيمة الطلب ٢٢٪، معظمه من وحدة التوصيات التي كان إطلاقها مستحيلًا سابقًا. وصلت نسبة التحويل على الجوال إلى مساواة سطح المكتب لأول مرة في تاريخ المنتج.

انتقل إيقاع الإصدارات من واحد كل ربع إلى ثلاثة أسبوعيًا. أفاد فريق الهندسة بانخفاض ملحوظ في ضوضاء حوادث المناوبة — أزالت مكتبة التصميم المشتركة فئة كاملة من انحدارات الإنتاج.
TXT,

            'timeline' => $item->timeline ?? '16 weeks',
            'team_size' => $item->team_size ?? '6 (3 eng, 1 design, 1 QA, 1 PM)',
            'services_used' => $item->services_used ?: [
                'Next.js',
                'PostgreSQL',
                'Playwright',
                'Stripe',
                'Docker',
                'AWS',
            ],
        ])->save();
    }

    public function down(): void
    {
        // Back-fill is non-destructive; leaving columns populated on rollback.
    }
};
