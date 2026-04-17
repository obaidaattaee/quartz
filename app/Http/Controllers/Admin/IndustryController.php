<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Industry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndustryController extends Controller
{
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
        ]);
    }

    public function update(Request $request, Industry $industry): RedirectResponse
    {
        $validated = $request->validate([
            'title_en' => ['required', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'hero_blurb_en' => ['required', 'string'],
            'hero_blurb_ar' => ['required', 'string'],
            'challenges_en' => ['required', 'array'],
            'challenges_en.*.title' => ['required', 'string', 'max:255'],
            'challenges_en.*.description' => ['required', 'string'],
            'challenges_ar' => ['required', 'array'],
            'challenges_ar.*.title' => ['required', 'string', 'max:255'],
            'challenges_ar.*.description' => ['required', 'string'],
            'solutions_en' => ['required', 'array'],
            'solutions_en.*.title' => ['required', 'string', 'max:255'],
            'solutions_en.*.description' => ['required', 'string'],
            'solutions_ar' => ['required', 'array'],
            'solutions_ar.*.title' => ['required', 'string', 'max:255'],
            'solutions_ar.*.description' => ['required', 'string'],
            'compliance_note_en' => ['nullable', 'string'],
            'compliance_note_ar' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string'],
            'sort_order' => ['required', 'integer'],
            'is_visible' => ['required', 'boolean'],
        ]);

        $industry->update($validated);

        return redirect()
            ->route('admin.industries.index')
            ->with('status', 'Industry updated.');
    }
}
