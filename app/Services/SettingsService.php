<?php

namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;

class SettingsService
{
    /**
     * Cache key for site settings.
     */
    private const CACHE_KEY = 'site_settings';

    /**
     * Cache TTL in seconds (1 hour).
     */
    private const CACHE_TTL = 3600;

    /**
     * Get all site settings as a key-value array.
     *
     * @return array<string, mixed>
     */
    public static function all(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return SiteSetting::pluck('value', 'key')->toArray();
        });
    }

    /**
     * Get a single setting value by key.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $settings = self::all();

        return $settings[$key] ?? $default;
    }

    /**
     * Set a single setting value.
     */
    public static function set(string $key, mixed $value): void
    {
        SiteSetting::updateOrCreate(
            ['key' => $key],
            ['value' => $value],
        );

        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Set multiple settings at once.
     *
     * @param  array<string, mixed>  $settings
     */
    public static function setMany(array $settings): void
    {
        foreach ($settings as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value],
            );
        }

        Cache::forget(self::CACHE_KEY);
    }
}
