<?php

namespace App\Http\Controllers;

use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    /**
     * Display the FAQ page.
     *
     * FAQ content remains in translations for v1.
     */
    public function index(): Response
    {
        $locale = app()->getLocale();
        $seo = SeoService::forStaticPage('faq', $locale, 'FAQ', "/{$locale}/faq");

        return Inertia::render('public/faq', [
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }
}
