<?php

namespace App\Http\Controllers;

use App\Models\ServicePage;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display order: the two lead services first, then the specialisms
     * that sit under development, then the supporting services.
     *
     * @var list<string>
     */
    private const ORDER = ['development', 'automation', 'web-development', 'mobile-apps', 'qa', 'cybersecurity'];

    /**
     * Display the list of all services.
     */
    public function index(string $locale): Response
    {
        $services = ServicePage::whereIn('slug', self::ORDER)
            ->get()
            ->sortBy(fn (ServicePage $service) => array_search($service->slug, self::ORDER, true))
            ->values()
            ->map(fn (ServicePage $service) => [
                'slug' => $service->slug,
                'title' => $service->{"title_{$locale}"},
                'subtitle' => $service->{"subtitle_{$locale}"},
                'deliverables' => array_values($service->{"deliverables_{$locale}"} ?? []),
            ]);

        $title = $locale === 'ar' ? 'خدماتنا' : 'Services';
        $seo = SeoService::forStaticPage('services', $locale, $title, "/{$locale}/services");

        return Inertia::render('public/services/index', [
            'services' => $services,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Display a service detail page with database-sourced content.
     */
    public function show(string $locale, string $slug): Response
    {
        $service = ServicePage::where('slug', $slug)->firstOrFail();
        $seo = SeoService::forStaticPage(
            "services.{$slug}",
            $locale,
            $service->{"title_{$locale}"},
            "/{$locale}/services/{$slug}",
            $service->{"subtitle_{$locale}"},
        );

        return Inertia::render('public/services/'.$slug, [
            'service' => $service,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }
}
