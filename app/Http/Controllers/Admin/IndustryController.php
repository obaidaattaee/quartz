<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\IndustryController as PublicIndustryController;
use App\Http\Requests\Admin\UpdateIndustryRequest;
use App\Models\Industry;
use App\Models\ServicePage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class IndustryController extends Controller
{
    /**
     * List every industry row (visible or hidden) in display order.
     */
    public function index(): Response
    {
        $industries = Industry::ordered()->get();

        return Inertia::render('admin/industries/index', [
            'industries' => $industries,
        ]);
    }

    public function edit(Industry $industry): Response
    {
        return Inertia::render('admin/industries/edit', [
            'industry' => $industry,
            'services' => self::serviceOptions(),
        ]);
    }

    public function update(UpdateIndustryRequest $request, Industry $industry): RedirectResponse
    {
        $industry->update($request->validated());

        return redirect()
            ->route('admin.industries.index')
            ->with('success', 'Industry page updated.');
    }

    /**
     * Services a solution card or the hero button can point to.
     *
     * @return list<array{value: string, label: string}>
     */
    private static function serviceOptions(): array
    {
        $titles = ServicePage::whereIn('slug', PublicIndustryController::SERVICES)
            ->pluck('title_en', 'slug');

        return array_map(
            fn (string $slug) => ['value' => $slug, 'label' => $titles[$slug] ?? $slug],
            PublicIndustryController::SERVICES,
        );
    }
}
