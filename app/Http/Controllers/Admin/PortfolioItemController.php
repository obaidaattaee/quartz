<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePortfolioItemRequest;
use App\Http\Requests\Admin\UpdatePortfolioItemRequest;
use App\Models\PortfolioItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioItemController extends Controller
{
    /**
     * Display a listing of portfolio items.
     */
    public function index(Request $request): Response
    {
        $items = PortfolioItem::with('featuredImage')
            ->when($request->search, fn ($q, $s) => $q->where('title_en', 'like', "%{$s}%")->orWhere('title_ar', 'like', "%{$s}%"))
            ->when($request->category, fn ($q, $c) => $q->where('service_category', $c))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/portfolio/index', [
            'items' => $items,
            'filters' => $request->only('search', 'category'),
        ]);
    }

    /**
     * Show the form for creating a new portfolio item.
     */
    public function create(): Response
    {
        return Inertia::render('admin/portfolio/create');
    }

    /**
     * Store a newly created portfolio item.
     */
    public function store(StorePortfolioItemRequest $request)
    {
        PortfolioItem::create($request->validated());

        return redirect()->route('admin.portfolio.index')->with('success', 'Portfolio item created.');
    }

    /**
     * Show the form for editing the specified portfolio item.
     */
    public function edit(PortfolioItem $portfolio): Response
    {
        $portfolio->load(['featuredImage', 'ogImage', 'beforeImage', 'afterImage']);

        return Inertia::render('admin/portfolio/edit', [
            'item' => $portfolio,
        ]);
    }

    /**
     * Update the specified portfolio item.
     */
    public function update(UpdatePortfolioItemRequest $request, PortfolioItem $portfolio)
    {
        $portfolio->update($request->validated());

        return redirect()->route('admin.portfolio.index')->with('success', 'Portfolio item updated.');
    }

    /**
     * Remove the specified portfolio item.
     */
    public function destroy(PortfolioItem $portfolio)
    {
        $portfolio->delete();

        return redirect()->route('admin.portfolio.index')->with('success', 'Portfolio item deleted.');
    }
}
