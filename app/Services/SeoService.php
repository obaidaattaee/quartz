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
    ): array {
        $meta = SeoMetadata::where('page_key', $pageKey)->first();

        $titleField = 'meta_title_' . $locale;
        $descField = 'meta_description_' . $locale;

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
        ];

        $descriptionDefaults = [
            'industries' => $locale === 'en'
                ? 'Software solutions shaped to the operating reality of your sector — retail, healthcare, finance, government, education.'
                : 'حلول برمجية مُصاغة لواقع قطاعك — التجزئة، الرعاية الصحية، المال، الحكومة، التعليم.',
        ];

        $resolvedTitle = $overrideTitle ?? ($pageTitles[$pageKey] ?? $siteName);
        $title = $meta?->$titleField ?? $resolvedTitle . ' | ' . $siteName;
        $description = $meta?->$descField ?? ($descriptionDefaults[$pageKey] ?? '');

        // Path resolution: explicit override wins, otherwise derive from pageKey.
        $path = $overridePath
            ?? ('/' . $locale . ($pageKey === 'home' ? '' : '/' . $pageKey));
        $pageUrl = $baseUrl . $path;

        // Hreflang alternates swap the locale segment, keeping the rest of the path.
        $hreflang = [];
        foreach (['en', 'ar'] as $lang) {
            $hreflang[$lang] = $baseUrl . preg_replace(
                '#^/(en|ar)(/|$)#',
                '/' . $lang . '$2',
                $path,
            );
        }

        return [
            'title' => $title,
            'description' => $description,
            'image' => $meta?->ogImage?->path ? $baseUrl . '/storage/' . $meta->ogImage->path : null,
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
        $titleField = 'meta_title_' . $locale;
        $descField = 'meta_description_' . $locale;
        $postTitleField = 'title_' . $locale;
        $postExcerptField = 'excerpt_' . $locale;

        $siteName = config('app.name', 'Quartz');
        $baseUrl = rtrim(config('app.url'), '/');

        $title = $post->$titleField ?? $post->$postTitleField . ' | ' . $siteName;
        $description = $post->$descField ?? $post->$postExcerptField ?? '';

        $postUrl = $baseUrl . '/' . $locale . '/blog/' . $post->slug;

        return [
            'title' => $title,
            'description' => $description,
            'image' => $post->ogImage?->path
                ? $baseUrl . '/storage/' . $post->ogImage->path
                : ($post->featuredImage?->path ? $baseUrl . '/storage/' . $post->featuredImage->path : null),
            'url' => $postUrl,
            'type' => 'article',
            'canonical' => $postUrl,
            'hreflang' => [
                'en' => $baseUrl . '/en/blog/' . $post->slug,
                'ar' => $baseUrl . '/ar/blog/' . $post->slug,
            ],
        ];
    }

    /**
     * Get SEO data for a portfolio item.
     */
    public static function forPortfolioItem(PortfolioItem $item, string $locale): array
    {
        $titleField = 'meta_title_' . $locale;
        $descField = 'meta_description_' . $locale;
        $itemTitleField = 'title_' . $locale;
        $itemDescField = 'description_' . $locale;

        $siteName = config('app.name', 'Quartz');
        $baseUrl = rtrim(config('app.url'), '/');

        $title = $item->$titleField ?? $item->$itemTitleField . ' | ' . $siteName;
        $description = $item->$descField ?? $item->$itemDescField ?? '';

        $itemUrl = $baseUrl . '/' . $locale . '/portfolio/' . $item->slug;

        return [
            'title' => $title,
            'description' => $description,
            'image' => $item->ogImage?->path
                ? $baseUrl . '/storage/' . $item->ogImage->path
                : ($item->featuredImage?->path ? $baseUrl . '/storage/' . $item->featuredImage->path : null),
            'url' => $itemUrl,
            'canonical' => $itemUrl,
            'hreflang' => [
                'en' => $baseUrl . '/en/portfolio/' . $item->slug,
                'ar' => $baseUrl . '/ar/portfolio/' . $item->slug,
            ],
        ];
    }
}
