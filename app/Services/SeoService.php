<?php

namespace App\Services;

use App\Models\BlogPost;
use App\Models\PortfolioItem;

class SeoService
{
    /**
     * Generate SEO metadata for a blog post.
     *
     * @return array<string, mixed>
     */
    public static function forBlogPost(BlogPost $post, string $locale): array
    {
        $title = $locale === 'ar' ? $post->title_ar : $post->title_en;
        $description = $locale === 'ar' ? $post->excerpt_ar : $post->excerpt_en;
        $url = url("/{$locale}/blog/{$post->slug}");
        $altLocale = $locale === 'en' ? 'ar' : 'en';

        return [
            'title' => $title,
            'description' => $description,
            'image' => $post->featuredImage ? asset($post->featuredImage->url) : null,
            'url' => $url,
            'type' => 'article',
            'canonical' => $url,
            'hreflang' => [
                $locale => $url,
                $altLocale => url("/{$altLocale}/blog/{$post->slug}"),
            ],
        ];
    }

    /**
     * Generate SEO metadata for a portfolio item.
     *
     * @return array<string, mixed>
     */
    public static function forPortfolioItem(PortfolioItem $item, string $locale): array
    {
        $title = $locale === 'ar' ? $item->title_ar : $item->title_en;
        $description = $locale === 'ar' ? $item->description_ar : $item->description_en;
        $url = url("/{$locale}/portfolio/{$item->slug}");
        $altLocale = $locale === 'en' ? 'ar' : 'en';

        return [
            'title' => $title,
            'description' => $description,
            'image' => $item->featuredImage ? asset($item->featuredImage->url) : null,
            'url' => $url,
            'type' => 'website',
            'canonical' => $url,
            'hreflang' => [
                $locale => $url,
                $altLocale => url("/{$altLocale}/portfolio/{$item->slug}"),
            ],
        ];
    }

    /**
     * Generate SEO metadata for a static page.
     *
     * @return array<string, mixed>
     */
    public static function forStaticPage(string $pageKey, string $locale, ?string $fallbackTitle = null, ?string $path = null): array
    {
        $title = $fallbackTitle ?? config('app.name').' - '.ucfirst(str_replace('.', ' ', $pageKey));
        $url = $path ? url($path) : url("/{$locale}");
        $altLocale = $locale === 'en' ? 'ar' : 'en';
        $altPath = $path ? str_replace("/{$locale}", "/{$altLocale}", $path) : "/{$altLocale}";

        return [
            'title' => $title,
            'description' => config('app.name').' - '.$title,
            'image' => null,
            'url' => $url,
            'type' => 'website',
            'canonical' => $url,
            'hreflang' => [
                $locale => $url,
                $altLocale => url($altPath),
            ],
        ];
    }
}
