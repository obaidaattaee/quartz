<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ServiceController;
use App\Models\SeoMetadata;
use App\Models\ServicePage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SeoSettingController extends Controller
{
    /**
     * Static pages that can carry SEO overrides, keyed by the page_key the
     * public controllers pass to SeoService::forStaticPage().
     *
     * @return array<string, string>
     */
    private function pages(): array
    {
        $pages = [
            'home' => 'Home',
            'about' => 'About',
            'services' => 'Services',
        ];

        $titles = ServicePage::whereIn('slug', ServiceController::ORDER)->pluck('title_en', 'slug');

        foreach (ServiceController::ORDER as $slug) {
            $pages["services.{$slug}"] = 'Services: '.($titles[$slug] ?? $slug);
        }

        return $pages + [
            'industries' => 'Industries',
            'portfolio' => 'Work',
            'blog' => 'Blog',
            'faq' => 'FAQ',
            'contact' => 'Contact',
        ];
    }

    /**
     * Display the SEO settings page.
     */
    public function index(): Response
    {
        $pages = $this->pages();

        return Inertia::render('admin/seo/index', [
            'seoData' => SeoMetadata::with('ogImage')
                ->whereIn('page_key', array_keys($pages))
                ->get()
                ->keyBy('page_key'),
            'pageKeys' => collect($pages)
                ->map(fn (string $label, string $key) => ['key' => $key, 'label' => $label])
                ->values(),
        ]);
    }

    /**
     * Save SEO metadata for every page submitted by the form.
     */
    public function update(Request $request): RedirectResponse
    {
        $keys = array_keys($this->pages());

        $validated = $request->validate([
            'pages' => ['required', 'array'],
            'pages.*.meta_title_en' => ['nullable', 'string', 'max:70'],
            'pages.*.meta_title_ar' => ['nullable', 'string', 'max:70'],
            'pages.*.meta_description_en' => ['nullable', 'string', 'max:160'],
            'pages.*.meta_description_ar' => ['nullable', 'string', 'max:160'],
            'pages.*.og_image_id' => ['nullable', 'integer', 'exists:media,id'],
        ]);

        foreach ($validated['pages'] as $pageKey => $fields) {
            if (! in_array($pageKey, $keys, true)) {
                continue;
            }

            $fields = array_intersect_key($fields, array_flip([
                'meta_title_en', 'meta_title_ar', 'meta_description_en', 'meta_description_ar', 'og_image_id',
            ]));

            $existing = SeoMetadata::where('page_key', $pageKey)->first();
            $isEmpty = collect($fields)->every(fn ($value) => blank($value));

            // Don't create empty rows for pages nobody customised.
            if (! $existing && $isEmpty) {
                continue;
            }

            SeoMetadata::updateOrCreate(['page_key' => $pageKey], $fields);
        }

        return redirect()->back()->with('success', 'SEO settings updated.');
    }
}
