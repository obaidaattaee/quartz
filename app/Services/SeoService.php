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
    public static function forStaticPage(string $pageKey, string $locale): array
    {
        $meta = SeoMetadata::where('page_key', $pageKey)->first();

        $titleField = 'meta_title_' . $locale;
        $descField = 'meta_description_' . $locale;

        $siteName = config('app.name', 'Quart');
        $baseUrl = rtrim(config('app.url'), '/');
        $altLocale = $locale === 'en' ? 'ar' : 'en';

        $pageTitles = [
            'home' => $locale === 'en' ? 'Software Development & Cybersecurity' : 'تطوير البرمجيات والأمن السيبراني',
            'about' => $locale === 'en' ? 'About Us' : 'من نحن',
            'contact' => $locale === 'en' ? 'Contact Us' : 'اتصل بنا',
            'faq' => $locale === 'en' ? 'FAQ' : 'الأسئلة الشائعة',
            'blog' => $locale === 'en' ? 'Blog' : 'المدونة',
            'portfolio' => $locale === 'en' ? 'Portfolio' : 'أعمالنا',
        ];

        $title = $meta?->$titleField ?? ($pageTitles[$pageKey] ?? $siteName) . ' | ' . $siteName;
        $description = $meta?->$descField ?? '';

        return [
            'title' => $title,
            'description' => $description,
            'og_image' => $meta?->ogImage?->path ? $baseUrl . '/storage/' . $meta->ogImage->path : null,
            'canonical' => $baseUrl . '/' . $locale . ($pageKey === 'home' ? '' : '/' . $pageKey),
            'hreflang' => [
                ['locale' => 'en', 'url' => $baseUrl . '/en' . ($pageKey === 'home' ? '' : '/' . $pageKey)],
                ['locale' => 'ar', 'url' => $baseUrl . '/ar' . ($pageKey === 'home' ? '' : '/' . $pageKey)],
            ],
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

        $siteName = config('app.name', 'Quart');
        $baseUrl = rtrim(config('app.url'), '/');

        $title = $post->$titleField ?? $post->$postTitleField . ' | ' . $siteName;
        $description = $post->$descField ?? $post->$postExcerptField ?? '';

        return [
            'title' => $title,
            'description' => $description,
            'og_image' => $post->ogImage?->path
                ? $baseUrl . '/storage/' . $post->ogImage->path
                : ($post->featuredImage?->path ? $baseUrl . '/storage/' . $post->featuredImage->path : null),
            'canonical' => $baseUrl . '/' . $locale . '/blog/' . $post->slug,
            'hreflang' => [
                ['locale' => 'en', 'url' => $baseUrl . '/en/blog/' . $post->slug],
                ['locale' => 'ar', 'url' => $baseUrl . '/ar/blog/' . $post->slug],
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

        $siteName = config('app.name', 'Quart');
        $baseUrl = rtrim(config('app.url'), '/');

        $title = $item->$titleField ?? $item->$itemTitleField . ' | ' . $siteName;
        $description = $item->$descField ?? $item->$itemDescField ?? '';

        return [
            'title' => $title,
            'description' => $description,
            'og_image' => $item->ogImage?->path
                ? $baseUrl . '/storage/' . $item->ogImage->path
                : ($item->featuredImage?->path ? $baseUrl . '/storage/' . $item->featuredImage->path : null),
            'canonical' => $baseUrl . '/' . $locale . '/portfolio/' . $item->slug,
            'hreflang' => [
                ['locale' => 'en', 'url' => $baseUrl . '/en/portfolio/' . $item->slug],
                ['locale' => 'ar', 'url' => $baseUrl . '/ar/portfolio/' . $item->slug],
            ],
        ];
    }
}
