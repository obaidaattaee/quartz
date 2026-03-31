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
        ]);
    }
}
