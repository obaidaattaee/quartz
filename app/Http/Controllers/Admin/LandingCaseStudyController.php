<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\LandingCaseStudyRequest;
use App\Models\LandingCaseStudy;
use App\Models\PortfolioItem;
use Illuminate\Http\RedirectResponse;

class LandingCaseStudyController extends LandingContentController
{
    protected function modelClass(): string
    {
        return LandingCaseStudy::class;
    }

    protected function section(): string
    {
        return 'case-studies';
    }

    protected function label(): string
    {
        return 'Case study';
    }

    protected function formProps(): array
    {
        return [
            'portfolioOptions' => PortfolioItem::orderBy('sort_order')
                ->get(['slug', 'title_en'])
                ->map(fn ($p) => ['slug' => $p->slug, 'title' => $p->title_en]),
        ];
    }

    public function store(LandingCaseStudyRequest $request): RedirectResponse
    {
        return $this->storeValidated($request->validated());
    }

    public function update(LandingCaseStudyRequest $request, string $item): RedirectResponse
    {
        return $this->updateValidated($item, $request->validated());
    }
}
