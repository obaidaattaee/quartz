<?php

namespace App\Http\Controllers;

use App\Models\Industry;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class IndustryController extends Controller
{
    public function index(string $locale): Response
    {
        $industries = Industry::visible()
            ->ordered()
            ->get([
                'id', 'slug', 'title_en', 'title_ar',
                'hero_blurb_en', 'hero_blurb_ar',
                'cover_image',
            ]);

        $title = $locale === 'ar' ? 'القطاعات' : 'Industries';
        $seo = SeoService::forStaticPage(
            'industries',
            $locale,
            $title,
            "/{$locale}/industries",
        );

        return Inertia::render('public/industries/index', [
            'industries' => $industries,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    public function show(string $locale, string $slug): Response
    {
        $industry = Industry::visible()
            ->where('slug', $slug)
            ->firstOrFail();

        $title = $locale === 'ar' ? $industry->title_ar : $industry->title_en;
        $seo = SeoService::forStaticPage(
            "industries.{$slug}",
            $locale,
            $title,
            "/{$locale}/industries/{$slug}",
        );

        return Inertia::render('public/industries/show', [
            'industry' => $industry,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }
}
