<?php

namespace Tests\Feature;

use App\Models\ServicePage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ServicesIndexTest extends TestCase
{
    use RefreshDatabase;

    private function makeService(string $slug): void
    {
        ServicePage::updateOrCreate(['slug' => $slug], [
            'title_en' => ucfirst($slug),
            'title_ar' => $slug,
            'subtitle_en' => "Subtitle for {$slug}",
            'subtitle_ar' => "عنوان {$slug}",
            'audience_en' => "Teams that need {$slug}",
            'audience_ar' => "فرق تحتاج {$slug}",
            'problem_en' => 'Problem',
            'problem_ar' => 'مشكلة',
            'approach_en' => 'Approach',
            'approach_ar' => 'منهج',
            'process_steps_en' => [],
            'process_steps_ar' => [],
            'deliverables_en' => ['One', 'Two'],
            'deliverables_ar' => ['واحد', 'اثنان'],
            'cta_text_en' => 'Start',
            'cta_text_ar' => 'ابدأ',
        ]);
    }

    protected function setUp(): void
    {
        parent::setUp();

        foreach (['development', 'automation', 'qa', 'cybersecurity', 'web-development', 'mobile-apps'] as $slug) {
            $this->makeService($slug);
        }
    }

    public function test_services_index_lists_every_service_with_lead_services_first(): void
    {
        $this->get('/en/services')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('public/services/index')
                ->has('services', 6)
                ->where('services.0.slug', 'development')
                ->where('services.1.slug', 'automation')
                ->where('services.0.title', 'Development')
                ->where('services.0.audience', 'Teams that need development')
                ->has('services.0.deliverables', 2)
                ->has('seo')
            );
    }

    public function test_services_index_is_localised_in_arabic(): void
    {
        $this->get('/ar/services')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('public/services/index')
                ->where('services.0.title', 'development')
                ->where('services.0.deliverables.0', 'واحد')
                ->where('services.0.audience', 'فرق تحتاج development')
            );
    }

    public function test_services_index_has_a_purpose_led_meta_description(): void
    {
        $this->get('/en/services')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('seo.description', fn ($d) => str_contains($d, 'Find a suitable service'))
            );

        $this->get('/ar/services')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('seo.description', fn ($d) => str_contains($d, 'الخدمة المناسبة'))
            );
    }

    public function test_index_guide_and_process_copy_exists_in_both_languages(): void
    {
        foreach (['en', 'ar'] as $locale) {
            $strings = json_decode(file_get_contents(lang_path("{$locale}.json")), true);

            for ($i = 0; $i < 6; $i++) {
                foreach (['problem', 'why', 'start'] as $part) {
                    $this->assertNotEmpty($strings["services.index.guide.{$i}.{$part}"] ?? null, "{$locale} guide {$i}.{$part}");
                }
            }

            for ($i = 0; $i < 4; $i++) {
                $this->assertNotEmpty($strings["services.index.process.{$i}.title"] ?? null);
            }
        }
    }

    public function test_unknown_locale_is_not_routed(): void
    {
        $this->get('/fr/services')->assertNotFound();
    }
}
