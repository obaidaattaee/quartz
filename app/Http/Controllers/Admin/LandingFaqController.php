<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\LandingFaqRequest;
use App\Models\LandingFaq;
use Illuminate\Http\RedirectResponse;

class LandingFaqController extends LandingContentController
{
    protected function modelClass(): string
    {
        return LandingFaq::class;
    }

    protected function section(): string
    {
        return 'faqs';
    }

    protected function label(): string
    {
        return 'FAQ';
    }

    public function store(LandingFaqRequest $request): RedirectResponse
    {
        return $this->storeValidated($request->validated());
    }

    public function update(LandingFaqRequest $request, string $item): RedirectResponse
    {
        return $this->updateValidated($item, $request->validated());
    }
}
