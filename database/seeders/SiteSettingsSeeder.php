<?php

namespace Database\Seeders;

use App\Services\SettingsService;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    /**
     * Seed default site settings.
     */
    public function run(): void
    {
        SettingsService::setMany([
            'site_name' => 'Quartz',
            'primary_color' => '#14B8A6',
            'secondary_color' => '#0F172A',
            'contact_phone' => '+966 50 XXX XXXX',
            'contact_email' => 'info@quartz.sa',
            'contact_whatsapp' => '+966 50 XXX XXXX',
            'contact_address' => 'Riyadh, Saudi Arabia',
            'social_linkedin' => 'https://linkedin.com/company/quart',
            'social_twitter' => 'https://twitter.com/quart',
            'social_github' => 'https://github.com/quart',
            'social_instagram' => '',

            // Legal document placeholders — resolved into the privacy policy
            // and terms of service at render time. Replace the bracketed
            // values with the real ones before publishing.
            'legal_entity_name' => 'Quartz Solutions',
            'legal_registered_address' => '[REGISTERED ADDRESS — TO BE SPECIFIED]',
            'legal_privacy_email' => 'privacy@quartz-solutions.net',
            'legal_contact_email' => 'legal@quartz-solutions.net',
            'legal_governing_law' => '[GOVERNING LAW — TO BE SPECIFIED]',
            'legal_dispute_venue' => '[DISPUTE VENUE — TO BE SPECIFIED]',
            'legal_liability_cap' => '[LIABILITY CAP — TO BE SPECIFIED]',
        ]);
    }
}
