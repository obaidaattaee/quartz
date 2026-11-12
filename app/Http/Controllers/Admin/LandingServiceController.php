<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\LandingServiceRequest;
use App\Models\LandingService;
use Illuminate\Http\RedirectResponse;

class LandingServiceController extends LandingContentController
{
    protected function modelClass(): string
    {
        return LandingService::class;
    }

    protected function section(): string
    {
        return 'services';
    }

    protected function label(): string
    {
        return 'Service';
    }

    public function store(LandingServiceRequest $request): RedirectResponse
    {
        // `code` is an internal unique key (used as the React list key on the
        // homepage), so it is generated rather than asked of the editor.
        return $this->storeValidated($request->validated() + ['code' => $this->nextCode()]);
    }

    public function update(LandingServiceRequest $request, string $item): RedirectResponse
    {
        return $this->updateValidated($item, $request->validated());
    }

    private function nextCode(): string
    {
        $n = LandingService::count() + 1;

        while (LandingService::where('code', $code = sprintf('S_%02d', $n))->exists()) {
            $n++;
        }

        return $code;
    }
}
