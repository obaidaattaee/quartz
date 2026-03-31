<?php

namespace App\Http\Controllers;

use App\Models\ServicePage;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display a service detail page with database-sourced content.
     */
    public function show(string $locale, string $slug): Response
    {
        $service = ServicePage::where('slug', $slug)->firstOrFail();
        $seo = SeoService::forStaticPage("services.{$slug}", $locale, $service->{"title_{$locale}"}, "/{$locale}/services/{$slug}");

        return Inertia::render('public/services/'.$slug, [
            'service' => $service,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }
}
