<?php

namespace App\Services;

use App\Models\BlogPost;
use App\Models\PortfolioItem;
use App\Models\SeoMetadata;
use Illuminate\Support\Str;

class SeoService
{
    /**
     * Resolve SEO data for a blog post.
     *
     * Usage: Inertia::render(...)->withViewData(['seo' => SeoService::forBlogPost($post, $locale)])
     *
     * @return array{title: string, description: ?string, image: ?string, url: string, type: string, canonical: string, hreflang: array<string, string>}
     */
    public static function forBlogPost(BlogPost $post, string $locale): array
    {
        $title = $locale === 'ar'
            ? ($post->meta_title_ar ?: $post->title_ar)
            : ($post->meta_title_en ?: $post->title_en);

        $description = $locale === 'ar'
            ? ($post->meta_description_ar ?: $post->excerpt_ar)
            : ($post->meta_description_en ?: $post->excerpt_en);

        return [
            'title' => $title,
            'description' => Str::limit(strip_tags($description ?? ''), 160),
            'image' => $post->ogImage?->url ?? $post->featuredImage?->url,
            'url' => url("/{$locale}/blog/{$post->slug}"),
            'type' => 'article',
            'canonical' => url("/en/blog/{$post->slug}"),
            'hreflang' => [
                'en' => url("/en/blog/{$post->slug}"),
                'ar' => url("/ar/blog/{$post->slug}"),
            ],
        ];
    }

    /**
     * Resolve SEO data for a portfolio item.
     *
     * Usage: Inertia::render(...)->withViewData(['seo' => SeoService::forPortfolioItem($item, $locale)])
     *
     * @return array{title: string, description: ?string, image: ?string, url: string, type: string, canonical: string, hreflang: array<string, string>}
     */
    public static function forPortfolioItem(PortfolioItem $item, string $locale): array
    {
        $title = $locale === 'ar'
            ? ($item->meta_title_ar ?: $item->title_ar)
            : ($item->meta_title_en ?: $item->title_en);

        $description = $locale === 'ar'
            ? ($item->meta_description_ar ?: $item->description_ar)
            : ($item->meta_description_en ?: $item->description_en);

        return [
            'title' => $title,
            'description' => Str::limit(strip_tags($description ?? ''), 160),
            'image' => $item->ogImage?->url ?? $item->featuredImage?->url,
            'url' => url("/{$locale}/portfolio/{$item->slug}"),
            'type' => 'website',
            'canonical' => url("/en/portfolio/{$item->slug}"),
            'hreflang' => [
                'en' => url("/en/portfolio/{$item->slug}"),
                'ar' => url("/ar/portfolio/{$item->slug}"),
            ],
        ];
    }

    /**
     * Resolve SEO data for a static page.
     *
     * Usage: Inertia::render(...)->withViewData(['seo' => SeoService::forStaticPage('home', $locale, 'Home', "/{$locale}")])
     *
     * @return array{title: string, description: ?string, image: ?string, url: string, type: string, canonical: string, hreflang: array<string, string>}
     */
    public static function forStaticPage(string $pageKey, string $locale, ?string $fallbackTitle = null, ?string $path = null): array
    {
        $seo = SeoMetadata::where('page_key', $pageKey)->first();
        $resolvedPath = $path ?? "/{$locale}";

        $title = null;
        $description = null;

        if ($seo) {
            $title = $locale === 'ar' ? $seo->meta_title_ar : $seo->meta_title_en;
            $description = $locale === 'ar' ? $seo->meta_description_ar : $seo->meta_description_en;
        }

        return [
            'title' => $title ?? $fallbackTitle ?? config('app.name'),
            'description' => $description ? Str::limit(strip_tags($description), 160) : null,
            'image' => $seo?->ogImage?->url,
            'url' => url($resolvedPath),
            'type' => 'website',
            'canonical' => url(str_replace("/{$locale}", '/en', $resolvedPath)),
            'hreflang' => [
                'en' => url(str_replace("/{$locale}", '/en', $resolvedPath)),
                'ar' => url(str_replace("/{$locale}", '/ar', $resolvedPath)),
            ],
        ];
    }
}
