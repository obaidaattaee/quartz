<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\LandingProcessStepRequest;
use App\Models\LandingProcessStep;
use Illuminate\Http\RedirectResponse;

class LandingProcessStepController extends LandingContentController
{
    protected function modelClass(): string
    {
        return LandingProcessStep::class;
    }

    protected function section(): string
    {
        return 'process-steps';
    }

    protected function label(): string
    {
        return 'Process step';
    }

    public function store(LandingProcessStepRequest $request): RedirectResponse
    {
        return $this->storeValidated($request->validated());
    }

    public function update(LandingProcessStepRequest $request, string $item): RedirectResponse
    {
        return $this->updateValidated($item, $request->validated());
    }
}
