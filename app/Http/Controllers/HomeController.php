<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the home page with database-sourced content.
     */
    public function index(): Response
    {
        $locale = app()->getLocale();
        $seo = SeoService::forStaticPage('home', $locale, config('app.name'), "/{$locale}");

        return Inertia::render('public/home', [
            'testimonials' => Testimonial::where('is_visible', true)
                ->orderBy('sort_order')
                ->get(),
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }
}
