<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateServicePageRequest;
use App\Models\ServicePage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServicePageController extends Controller
{
    /**
     * Display a listing of all service pages.
     */
    public function index(): Response
    {
        $services = ServicePage::all();

        return Inertia::render('admin/services/index', [
            'services' => $services,
        ]);
    }

    /**
     * Show the form for editing the specified service page.
     */
    public function edit(ServicePage $service): Response
    {
        return Inertia::render('admin/services/edit', [
            'service' => $service,
        ]);
    }

    /**
     * Update the specified service page in storage.
     */
    public function update(UpdateServicePageRequest $request, ServicePage $service): RedirectResponse
    {
        $service->update($request->validated());

        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service page updated.');
    }
}
