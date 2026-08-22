<?php

namespace Tests\Feature;

use App\Models\LegalPage;
use App\Services\SettingsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class LegalPagesTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Create a legal page with sensible defaults for the given slug.
     *
     * @param  array<string, mixed>  $overrides
     */
    private function makeLegalPage(string $slug, array $overrides = []): LegalPage
    {
        return LegalPage::create(array_merge([
            'slug' => $slug,
            'title_en' => 'Privacy Policy',
            'title_ar' => 'سياسة الخصوصية',
            'summary_en' => 'How we handle your data.',
            'summary_ar' => 'كيف نتعامل مع بياناتك.',
            'effective_date' => '2026-08-22',
            'version' => '1.0',
            'sections_en' => [
                ['heading' => 'Who We Are', 'body' => ['We are {{company}}.']],
                ['heading' => 'Contact', 'body' => ['Email us.'], 'list' => ['{{privacy_email}}']],
            ],
            'sections_ar' => [
                ['heading' => 'من نحن', 'body' => ['نحن {{company}}.']],
                ['heading' => 'اتصل بنا', 'body' => ['راسلنا.'], 'list' => ['{{privacy_email}}']],
            ],
            'is_published' => true,
        ], $overrides));
    }

    public function test_privacy_page_renders_for_the_english_locale(): void
    {
        $this->makeLegalPage('privacy');

        $this->get('/en/privacy')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('public/legal')
                ->where('page.slug', 'privacy')
                ->where('page.title', 'Privacy Policy')
            );
    }

    public function test_terms_page_renders_arabic_content_for_the_arabic_locale(): void
    {
        $this->makeLegalPage('terms', [
            'title_en' => 'Terms of Service',
            'title_ar' => 'شروط الخدمة',
        ]);

        $this->get('/ar/terms')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('public/legal')
                ->where('page.slug', 'terms')
                ->where('page.title', 'شروط الخدمة')
                ->where('page.sections.0.heading', 'من نحن')
            );
    }

    public function test_sections_expose_stable_anchor_ids_across_locales(): void
    {
        $this->makeLegalPage('privacy');

        $english = $this->get('/en/privacy')->viewData('page')['props']['page']['sections'];
        $arabic = $this->get('/ar/privacy')->viewData('page')['props']['page']['sections'];

        $this->assertSame('section-1', $english[0]['id']);
        $this->assertSame(
            array_column($english, 'id'),
            array_column($arabic, 'id'),
            'Anchor ids must match across locales so shared deep links resolve.',
        );
    }

    public function test_placeholder_tokens_are_resolved_from_site_settings(): void
    {
        SettingsService::setMany([
            'site_name' => 'Quartz',
            'legal_entity_name' => 'Quartz Technologies LLC',
            'legal_privacy_email' => 'privacy@quartz.sa',
        ]);
        $this->makeLegalPage('privacy');

        $sections = $this->get('/en/privacy')->viewData('page')['props']['page']['sections'];

        $this->assertSame('We are Quartz Technologies LLC.', $sections[0]['body'][0]);
        $this->assertSame('privacy@quartz.sa', $sections[1]['list'][0]);
    }

    public function test_unresolved_tokens_never_reach_the_rendered_page(): void
    {
        $this->makeLegalPage('privacy');

        $rendered = json_encode(
            $this->get('/en/privacy')->viewData('page')['props']['page'],
            JSON_UNESCAPED_UNICODE,
        );

        $this->assertStringNotContainsString('{{', $rendered);
    }

    public function test_unpublished_legal_page_returns_not_found(): void
    {
        $this->makeLegalPage('privacy', ['is_published' => false]);

        $this->get('/en/privacy')->assertNotFound();
    }

    public function test_missing_legal_page_returns_not_found(): void
    {
        $this->get('/en/terms')->assertNotFound();
    }

    public function test_legal_page_exposes_canonical_and_hreflang_seo_data(): void
    {
        $this->makeLegalPage('privacy');

        $this->get('/en/privacy')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('seo.canonical', config('app.url').'/en/privacy')
                ->where('seo.hreflang.ar', config('app.url').'/ar/privacy')
            );
    }

    public function test_sitemap_includes_published_legal_pages_in_both_locales(): void
    {
        $this->makeLegalPage('privacy');
        $this->makeLegalPage('terms', ['title_en' => 'Terms of Service']);

        $sitemap = $this->get('/sitemap.xml')->assertOk()->getContent();

        foreach (['/en/privacy', '/ar/privacy', '/en/terms', '/ar/terms'] as $path) {
            $this->assertStringContainsString(config('app.url').$path, $sitemap);
        }
    }
}
