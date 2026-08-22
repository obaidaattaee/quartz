<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateLegalPageRequest;
use App\Models\LegalPage;
use App\Services\LegalContentService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LegalPageController extends Controller
{
    /**
     * Display a listing of the legal documents.
     */
    public function index(): Response
    {
        return Inertia::render('admin/legal/index', [
            'pages' => LegalPage::orderBy('slug')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified legal document.
     */
    public function edit(LegalPage $legal): Response
    {
        return Inertia::render('admin/legal/edit', [
            'page' => $legal,
            // Surfaced in the editor so authors know which placeholders
            // resolve, and what each currently resolves to.
            'tokens' => LegalContentService::tokens(),
        ]);
    }

    /**
     * Update the specified legal document in storage.
     */
    public function update(UpdateLegalPageRequest $request, LegalPage $legal): RedirectResponse
    {
        $legal->update($request->validated());

        return redirect()
            ->route('admin.legal.index')
            ->with('success', 'Legal page updated.');
    }
}
