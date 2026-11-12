<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ServiceController;
use App\Http\Requests\Admin\UpdateServicePageRequest;
use App\Models\ServicePage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServicePageController extends Controller
{
    /**
     * Display the service pages the public site renders, in the same order.
     * Rows for slugs the site no longer uses stay in the database but are
     * not editable here.
     */
    public function index(): Response
    {
        $services = ServicePage::whereIn('slug', ServiceController::ORDER)
            ->get()
            ->sortBy(fn (ServicePage $service) => array_search($service->slug, ServiceController::ORDER, true))
            ->values();

        return Inertia::render('admin/services/index', [
            'services' => $services,
        ]);
    }

    /**
     * Show the form for editing the specified service page.
     */
    public function edit(ServicePage $service): Response
    {
        $this->ensurePublic($service);

        return Inertia::render('admin/services/edit', [
            'service' => $service,
        ]);
    }

    /**
     * Update the specified service page in storage.
     */
    public function update(UpdateServicePageRequest $request, ServicePage $service): RedirectResponse
    {
        $this->ensurePublic($service);

        $service->update($request->validated());

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service page updated.');
    }

    /**
     * Only the service pages the public site renders can be edited.
     */
    private function ensurePublic(ServicePage $service): void
    {
        abort_unless(in_array($service->slug, ServiceController::ORDER, true), 404);
    }
}
