<?php

namespace App\Http\Controllers;

use App\Models\PortfolioItem;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    /**
     * Display the portfolio gallery grid.
     */
    public function index(string $locale): Response
    {
        $items = PortfolioItem::published()
            ->with('featuredImage')
            ->orderBy('sort_order')
            ->get();

        $serviceCategories = $items->pluck('service_category')
            ->unique()
            ->values()
            ->all();

        $seo = SeoService::forStaticPage('portfolio', $locale, 'Portfolio', "/{$locale}/portfolio");

        return Inertia::render('public/portfolio/index', [
            'items' => $items,
            'serviceCategories' => $serviceCategories,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Display a single portfolio case study.
     */
    public function show(string $locale, string $slug): Response
    {
        $item = PortfolioItem::published()
            ->with(['featuredImage', 'ogImage', 'beforeImage', 'afterImage'])
            ->where('slug', $slug)
            ->firstOrFail();

        $seo = SeoService::forPortfolioItem($item, $locale);

        return Inertia::render('public/portfolio/show', [
            'item' => $item,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }
}
