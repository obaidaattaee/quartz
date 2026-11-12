<?php

namespace App\Services;

use App\Models\BlogPost;
use App\Models\PortfolioItem;
use App\Models\SeoMetadata;

class SeoService
{
    /**
     * Get SEO data for a static page.
     */
    public static function forStaticPage(
        string $pageKey,
        string $locale,
        ?string $overrideTitle = null,
        ?string $overridePath = null,
        ?string $overrideDescription = null,
    ): array {
        $meta = SeoMetadata::where('page_key', $pageKey)->first();

        $titleField = 'meta_title_'.$locale;
        $descField = 'meta_description_'.$locale;

        $siteName = config('app.name', 'Quartz');
        $baseUrl = rtrim(config('app.url'), '/');

        $pageTitles = [
            'home' => $locale === 'en'
                ? 'Enterprise software, automation & cybersecurity'
                : 'برمجيات المؤسسات والأتمتة والأمن السيبراني',
            'about' => $locale === 'en' ? 'About Us' : 'من نحن',
            'contact' => $locale === 'en' ? 'Contact Us' : 'اتصل بنا',
            'faq' => $locale === 'en' ? 'FAQ' : 'الأسئلة الشائعة',
            'blog' => $locale === 'en' ? 'Blog' : 'المدونة',
            'portfolio' => $locale === 'en' ? 'Work' : 'أعمالنا',
            'industries' => $locale === 'en' ? 'Industries' : 'القطاعات',
            'privacy' => $locale === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية',
            'terms' => $locale === 'en' ? 'Terms of Service' : 'شروط الخدمة',
        ];

        $en = $locale === 'en';
        $descriptionDefaults = [
            'home' => $en
                ? 'Quartz builds, tests, secures and automates software for businesses across the Gulf — a remote team with 13+ live products serving 500K+ users.'
                : 'تبني كوارتز البرمجيات وتختبرها وتؤمّنها وتؤتمتها للشركات في دول الخليج — فريق عن بُعد بأكثر من 13 منتجاً قيد التشغيل تخدم أكثر من 500 ألف مستخدم.',
            'about' => $en
                ? 'Quartz is a remote engineering team serving the Gulf and the wider region across software development, QA, cybersecurity and automation.'
                : 'كوارتز فريق هندسي يعمل عن بُعد ويخدم دول الخليج والمنطقة في تطوير البرمجيات وضمان الجودة والأمن السيبراني والأتمتة.',
            'contact' => $en
                ? 'Tell us about your project. Email Quartz or send a message and a dedicated lead will get back to you.'
                : 'أخبرنا عن مشروعك. راسل كوارتز عبر البريد الإلكتروني أو أرسل رسالة وسيتواصل معك قائد مخصّص لمشروعك.',
            'faq' => $en
                ? 'Answers to common questions about how Quartz works: services, timelines, pricing, security and support.'
                : 'إجابات على الأسئلة الشائعة حول طريقة عمل كوارتز: الخدمات والجداول الزمنية والتسعير والأمان والدعم.',
            'blog' => $en
                ? 'Practical guides and engineering notes from the Quartz team on software, QA, cybersecurity and automation.'
                : 'أدلة عملية وملاحظات هندسية من فريق كوارتز حول البرمجيات وضمان الجودة والأمن السيبراني والأتمتة.',
            'portfolio' => $en
                ? 'Selected work and case studies from Quartz across software development, automation, QA and cybersecurity.'
                : 'أعمال ودراسات حالة مختارة من كوارتز في تطوير البرمجيات والأتمتة وضمان الجودة والأمن السيبراني.',
            'services' => $en
                ? 'Software development, web and mobile apps, automation, QA and cybersecurity — delivered by a remote Quartz team serving the Gulf.'
                : 'تطوير البرمجيات وتطبيقات الويب والجوال والأتمتة وضمان الجودة والأمن السيبراني — يقدّمها فريق كوارتز عن بُعد لدول الخليج.',
            'services.development' => $en
                ? 'Custom software engineered for performance, scale and long-term value — from discovery to launch and beyond.'
                : 'برمجيات مخصصة مصمّمة للأداء والتوسع والقيمة طويلة الأمد — من الاكتشاف حتى الإطلاق وما بعده.',
            'services.web-development' => $en
                ? 'Fast, accessible, modern web applications engineered to last.'
                : 'تطبيقات ويب حديثة وسريعة وسهلة الوصول مصمّمة لتدوم.',
            'services.mobile-apps' => $en
                ? 'Native and cross-platform iOS and Android apps, built for users and tuned for the stores.'
                : 'تطبيقات iOS وAndroid أصلية ومتعددة المنصات، مبنية للمستخدم ومضبوطة للمتاجر.',
            'services.automation' => $en
                ? 'Business process and workflow automation that removes repetitive manual work.'
                : 'أتمتة العمليات وسير العمل للتخلص من العمل اليدوي المتكرر.',
            'services.qa' => $en
                ? 'Manual and automated testing that catches issues before your users do.'
                : 'اختبارات يدوية ومؤتمتة تكشف المشاكل قبل أن يصادفها مستخدموك.',
            'services.cybersecurity' => $en
                ? 'Security assessments, hardening and secure development practices to protect your systems and data.'
                : 'تقييمات أمنية وتحصين وممارسات تطوير آمن لحماية أنظمتك وبياناتك.',
            'industries' => $en
                ? 'Software solutions shaped to the operating reality of your sector — retail, healthcare, finance, government, education.'
                : 'حلول برمجية مُصاغة لواقع قطاعك — التجزئة، الرعاية الصحية، المال، الحكومة، التعليم.',
            'privacy' => $en
                ? 'How Quartz collects, uses, shares, and protects personal data across our website, products, and client engagements.'
                : 'كيف تجمع كوارتز البيانات الشخصية وتستخدمها وتشاركها وتحميها عبر موقعنا ومنتجاتنا ومشاريع عملائنا.',
            'terms' => $en
                ? 'The terms that govern your use of the Quartz website, products, and services.'
                : 'الشروط التي تحكم استخدامك لموقع كوارتز ومنتجاتها وخدماتها.',
        ];

        $resolvedTitle = $overrideTitle ?? ($pageTitles[$pageKey] ?? $siteName);
        $title = $meta?->$titleField
            ?? (str_contains($resolvedTitle, $siteName) ? $resolvedTitle : $resolvedTitle.' | '.$siteName);
        $description = $meta?->$descField
            ?: ($overrideDescription ?: ($descriptionDefaults[$pageKey] ?? ''));

        // Path resolution: explicit override wins, otherwise derive from pageKey.
        $path = $overridePath
            ?? ('/'.$locale.($pageKey === 'home' ? '' : '/'.$pageKey));
        $pageUrl = $baseUrl.$path;

        // Hreflang alternates swap the locale segment, keeping the rest of the path.
        $hreflang = [];
        foreach (['en', 'ar'] as $lang) {
            $hreflang[$lang] = $baseUrl.preg_replace(
                '#^/(en|ar)(/|$)#',
                '/'.$lang.'$2',
                $path,
            );
        }

        return [
            'title' => $title,
            'description' => $description,
            'image' => $meta?->ogImage?->path ? $baseUrl.'/storage/'.$meta->ogImage->path : null,
            'url' => $pageUrl,
            'canonical' => $pageUrl,
            'hreflang' => $hreflang,
        ];
    }

    /**
     * Get SEO data for a blog post.
     */
    public static function forBlogPost(BlogPost $post, string $locale): array
    {
        $titleField = 'meta_title_'.$locale;
        $descField = 'meta_description_'.$locale;
        $postTitleField = 'title_'.$locale;
        $postExcerptField = 'excerpt_'.$locale;

        $siteName = config('app.name', 'Quartz');
        $baseUrl = rtrim(config('app.url'), '/');

        $title = $post->$titleField ?? $post->$postTitleField.' | '.$siteName;
        $description = $post->$descField ?? $post->$postExcerptField ?? '';

        $postUrl = $baseUrl.'/'.$locale.'/blog/'.$post->slug;

        return [
            'title' => $title,
            'description' => $description,
            'image' => $post->ogImage?->path
                ? $baseUrl.'/storage/'.$post->ogImage->path
                : ($post->featuredImage?->path ? $baseUrl.'/storage/'.$post->featuredImage->path : null),
            'url' => $postUrl,
            'type' => 'article',
            'canonical' => $postUrl,
            'hreflang' => [
                'en' => $baseUrl.'/en/blog/'.$post->slug,
                'ar' => $baseUrl.'/ar/blog/'.$post->slug,
            ],
        ];
    }

    /**
     * Get SEO data for a portfolio item.
     */
    public static function forPortfolioItem(PortfolioItem $item, string $locale): array
    {
        $titleField = 'meta_title_'.$locale;
        $descField = 'meta_description_'.$locale;
        $itemTitleField = 'title_'.$locale;
        $itemDescField = 'description_'.$locale;

        $siteName = config('app.name', 'Quartz');
        $baseUrl = rtrim(config('app.url'), '/');

        $title = $item->$titleField ?? $item->$itemTitleField.' | '.$siteName;
        $description = $item->$descField ?? $item->$itemDescField ?? '';

        $itemUrl = $baseUrl.'/'.$locale.'/portfolio/'.$item->slug;

        return [
            'title' => $title,
            'description' => $description,
            'image' => $item->ogImage?->path
                ? $baseUrl.'/storage/'.$item->ogImage->path
                : ($item->featuredImage?->path ? $baseUrl.'/storage/'.$item->featuredImage->path : null),
            'url' => $itemUrl,
            'canonical' => $itemUrl,
            'hreflang' => [
                'en' => $baseUrl.'/en/portfolio/'.$item->slug,
                'ar' => $baseUrl.'/ar/portfolio/'.$item->slug,
            ],
        ];
    }
}
