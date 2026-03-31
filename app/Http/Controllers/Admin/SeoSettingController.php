<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoMetadata;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SeoSettingController extends Controller
{
    /**
     * Static page keys with human-readable labels.
     */
    private const PAGE_KEYS = [
        ['key' => 'home', 'label' => 'Home'],
        ['key' => 'about', 'label' => 'About'],
        ['key' => 'contact', 'label' => 'Contact'],
        ['key' => 'faq', 'label' => 'FAQ'],
        ['key' => 'services.development', 'label' => 'Services: Development'],
        ['key' => 'services.automation', 'label' => 'Services: Automation'],
        ['key' => 'services.qa', 'label' => 'Services: QA'],
        ['key' => 'services.cybersecurity', 'label' => 'Services: Cybersecurity'],
        ['key' => 'blog', 'label' => 'Blog'],
        ['key' => 'portfolio', 'label' => 'Portfolio'],
    ];

    /**
     * Display SEO settings for all static pages.
     */
    public function index(): Response
    {
        $seoData = SeoMetadata::with('ogImage')
            ->get()
            ->keyBy('page_key');

        return Inertia::render('admin/seo/index', [
            'seoData' => $seoData,
            'pageKeys' => self::PAGE_KEYS,
        ]);
    }

    /**
     * Update SEO settings for all static pages.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'pages' => ['required', 'array'],
            'pages.*.meta_title_en' => ['nullable', 'string', 'max:70'],
            'pages.*.meta_title_ar' => ['nullable', 'string', 'max:70'],
            'pages.*.meta_description_en' => ['nullable', 'string', 'max:160'],
            'pages.*.meta_description_ar' => ['nullable', 'string', 'max:160'],
            'pages.*.og_image_id' => ['nullable', 'integer', 'exists:media,id'],
        ]);

        $validPageKeys = array_column(self::PAGE_KEYS, 'key');

        foreach ($validated['pages'] as $pageKey => $data) {
            if (! in_array($pageKey, $validPageKeys)) {
                continue;
            }

            SeoMetadata::updateOrCreate(
                ['page_key' => $pageKey],
                [
                    'meta_title_en' => $data['meta_title_en'] ?? null,
                    'meta_title_ar' => $data['meta_title_ar'] ?? null,
                    'meta_description_en' => $data['meta_description_en'] ?? null,
                    'meta_description_ar' => $data['meta_description_ar'] ?? null,
                    'og_image_id' => $data['og_image_id'] ?? null,
                ]
            );
        }

        return redirect()->route('admin.seo.index')->with('success', 'SEO settings updated.');
    }
}
