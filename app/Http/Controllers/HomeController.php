<?php

namespace App\Http\Controllers;

use App\Models\Industry;
use App\Models\PortfolioItem;
use App\Models\Testimonial;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $locale = app()->getLocale();
        $seo = SeoService::forStaticPage('home', $locale, config('app.name'), "/{$locale}");

        $industries = Industry::visible()
            ->ordered()
            ->get([
                'id',
                'slug',
                'title_en',
                'title_ar',
                'solutions_en',
                'solutions_ar',
            ]);

        $featuredCase = PortfolioItem::published()
            ->orderBy('sort_order')
            ->with('featuredImage')
            ->first();

        return Inertia::render('public/home', [
            'testimonials' => Testimonial::where('is_visible', true)
                ->orderBy('sort_order')
                ->get(),
            'industries' => $industries,
            'featuredCase' => $featuredCase,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }
}
