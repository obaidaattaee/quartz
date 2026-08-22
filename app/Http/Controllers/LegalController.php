<?php

namespace App\Http\Controllers;

use App\Models\LegalPage;
use App\Services\LegalContentService;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    /**
     * Display a public legal document (privacy policy, terms of service).
     */
    public function show(string $locale, string $slug): Response
    {
        $page = LegalPage::published()->where('slug', $slug)->firstOrFail();

        $locale = app()->getLocale();
        $seo = SeoService::forStaticPage(
            $slug,
            $locale,
            $page->{'title_'.$locale},
            "/{$locale}/{$slug}",
        );

        return Inertia::render('public/legal', [
            'page' => LegalContentService::present($page, $locale),
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }
}
