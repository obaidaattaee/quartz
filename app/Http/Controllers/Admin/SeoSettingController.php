<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoMetadata;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SeoSettingController extends Controller
{
    /**
     * The static page keys that can have SEO metadata.
     */
    private array $pageKeys = [
        'home',
        'about',
        'contact',
        'faq',
        'blog',
        'portfolio',
        'services-development',
        'services-automation',
        'services-qa',
        'services-cybersecurity',
    ];

    /**
     * Display the SEO settings page.
     */
    public function index()
    {
        $seoSettings = SeoMetadata::whereIn('page_key', $this->pageKeys)->get();

        return Inertia::render('admin/seo/index', [
            'seoSettings' => $seoSettings,
            'pageKeys' => $this->pageKeys,
        ]);
    }

    /**
     * Update SEO metadata for a specific page.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'page_key' => 'required|string|in:' . implode(',', $this->pageKeys),
            'meta_title_en' => 'nullable|string|max:70',
            'meta_title_ar' => 'nullable|string|max:70',
            'meta_description_en' => 'nullable|string|max:160',
            'meta_description_ar' => 'nullable|string|max:160',
            'og_image_id' => 'nullable|integer|exists:media,id',
        ]);

        $pageKey = $validated['page_key'];
        unset($validated['page_key']);

        SeoMetadata::updateOrCreate(
            ['page_key' => $pageKey],
            $validated
        );

        return redirect()->back()->with('success', 'SEO settings updated.');
    }
}
