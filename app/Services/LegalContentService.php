<?php

namespace App\Services;

use App\Models\LegalPage;

class LegalContentService
{
    /**
     * Placeholder tokens available inside legal copy.
     *
     * Legal documents name the company, its address, and its contact
     * addresses many times over. Storing those as tokens keeps the facts in
     * site settings — one place an admin can correct without a deploy, and
     * without an editor having to hunt through 18 sections of prose.
     *
     * @return array<string, string>
     */
    public static function tokens(): array
    {
        $siteName = (string) (SettingsService::get('site_name') ?: config('app.name', 'Quartz'));
        $contactEmail = (string) (SettingsService::get('contact_email') ?: '');
        $contactAddress = (string) (SettingsService::get('contact_address') ?: '');

        return [
            'company' => (string) (SettingsService::get('legal_entity_name') ?: $siteName),
            'site_name' => $siteName,
            'site_url' => rtrim((string) config('app.url'), '/'),
            'contact_email' => $contactEmail,
            'privacy_email' => (string) (SettingsService::get('legal_privacy_email') ?: $contactEmail),
            'legal_email' => (string) (SettingsService::get('legal_contact_email') ?: $contactEmail),
            'address' => $contactAddress,
            'registered_address' => (string) (SettingsService::get('legal_registered_address') ?: $contactAddress ?: '[REGISTERED ADDRESS — TO BE SPECIFIED]'),
            'governing_law' => (string) (SettingsService::get('legal_governing_law') ?: '[GOVERNING LAW — TO BE SPECIFIED]'),
            'dispute_venue' => (string) (SettingsService::get('legal_dispute_venue') ?: '[DISPUTE VENUE — TO BE SPECIFIED]'),
            'liability_cap' => (string) (SettingsService::get('legal_liability_cap') ?: '[LIABILITY CAP — TO BE SPECIFIED]'),
        ];
    }

    /**
     * Shape a legal page for the public view in a single locale, with every
     * token resolved and stable anchor ids attached.
     *
     * Anchor ids are positional rather than derived from the heading text so
     * that a link shared from the English page lands on the same section of
     * the Arabic one.
     *
     * @return array<string, mixed>
     */
    public static function present(LegalPage $page, string $locale): array
    {
        $suffix = $locale === 'ar' ? 'ar' : 'en';
        $tokens = self::tokens();

        $sections = [];

        foreach ($page->{'sections_'.$suffix} ?? [] as $index => $section) {
            $sections[] = [
                'id' => 'section-'.($index + 1),
                'heading' => self::resolve($section['heading'] ?? '', $tokens),
                'body' => array_map(
                    fn (string $paragraph): string => self::resolve($paragraph, $tokens),
                    $section['body'] ?? [],
                ),
                'list' => array_map(
                    fn (string $item): string => self::resolve($item, $tokens),
                    $section['list'] ?? [],
                ),
            ];
        }

        return [
            'slug' => $page->slug,
            'title' => self::resolve((string) $page->{'title_'.$suffix}, $tokens),
            'summary' => self::resolve((string) $page->{'summary_'.$suffix}, $tokens),
            'effective_date' => $page->effective_date?->toDateString(),
            'version' => $page->version,
            'sections' => $sections,
        ];
    }

    /**
     * Replace every known token in a string.
     *
     * Unknown tokens are deliberately left intact so a typo surfaces as
     * visible `{{ }}` in review (and in the seeder test) rather than being
     * silently swallowed into an empty gap in a legal sentence.
     *
     * @param  array<string, string>  $tokens
     */
    private static function resolve(string $text, array $tokens): string
    {
        return (string) preg_replace_callback(
            '/\{\{\s*([a-z_]+)\s*\}\}/',
            fn (array $matches): string => $tokens[$matches[1]] ?? $matches[0],
            $text,
        );
    }
}
