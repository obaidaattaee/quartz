<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\SettingsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    /**
     * Display the site settings form.
     */
    public function index(): Response
    {
        $settings = SettingsService::all();

        $logo = null;

        if (isset($settings['logo_media_id'])) {
            $logo = Media::find($settings['logo_media_id']);
        }

        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
            'logo' => $logo,
        ]);
    }

    /**
     * Update site settings in bulk.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'site_name' => ['nullable', 'string', 'max:255'],
            'logo_media_id' => ['nullable', 'integer', 'exists:media,id'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_whatsapp' => ['nullable', 'string', 'max:50'],
            'contact_address' => ['nullable', 'string', 'max:500'],
            'social_linkedin' => ['nullable', 'url', 'max:500'],
            'social_twitter' => ['nullable', 'url', 'max:500'],
            'social_github' => ['nullable', 'url', 'max:500'],
            'social_instagram' => ['nullable', 'url', 'max:500'],
            'legal_entity_name' => ['nullable', 'string', 'max:255'],
            'legal_registered_address' => ['nullable', 'string', 'max:500'],
            'legal_privacy_email' => ['nullable', 'email', 'max:255'],
            'legal_contact_email' => ['nullable', 'email', 'max:255'],
            'legal_governing_law' => ['nullable', 'string', 'max:255'],
            'legal_dispute_venue' => ['nullable', 'string', 'max:255'],
            'legal_liability_cap' => ['nullable', 'string', 'max:500'],
        ]);

        SettingsService::setMany($validated);

        return redirect()
            ->route('admin.settings.index')
            ->with('success', 'Settings updated.');
    }
}
