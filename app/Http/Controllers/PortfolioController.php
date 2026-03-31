<?php

namespace App\Http\Controllers;

use App\Models\PortfolioItem;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    /**
     * Display the portfolio gallery page.
     */
    public function index(Request $request, string $locale)
    {
        $items = PortfolioItem::published()
            ->with(['featuredImage'])
            ->orderBy('sort_order')
            ->get();

        $seo = SeoService::forStaticPage('portfolio', $locale);

        return Inertia::render('public/portfolio/index', [
            'items' => $items,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Display a single portfolio item / case study.
     */
    public function show(Request $request, string $locale, string $slug)
    {
        $item = PortfolioItem::published()
            ->with(['featuredImage', 'beforeImage', 'afterImage'])
            ->where('slug', $slug)
            ->firstOrFail();

        $seo = SeoService::forPortfolioItem($item, $locale);

        return Inertia::render('public/portfolio/show', [
            'item' => $item,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }
}
