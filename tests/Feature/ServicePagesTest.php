<?php

namespace Tests\Feature;

use App\Http\Controllers\ServiceController;
use App\Models\ServicePage;
use Database\Seeders\ServicePageContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ServicePagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(ServicePageContentSeeder::class);
    }

    /**
     * @return array<string, array{string, string}>
     */
    public static function pages(): array
    {
        $cases = [];

        foreach (ServiceController::ORDER as $slug) {
            foreach (['en', 'ar'] as $locale) {
                $cases["{$slug} ({$locale})"] = [$slug, $locale];
            }
        }

        return $cases;
    }

    #[DataProvider('pages')]
    public function test_every_service_page_renders_its_structured_content(string $slug, string $locale): void
    {
        $this->get("/{$locale}/services/{$slug}")
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component("public/services/{$slug}")
                ->where('service.slug', $slug)
                ->where('service.tagline', fn ($v) => is_string($v) && $v !== '')
                ->where('service.audience', fn ($v) => is_string($v) && $v !== '')
                ->where('service.pains', fn ($pains) => count($pains) >= 3 && count($pains) <= 4)
                ->has('service.pains.0.problem')
                ->has('service.pains.0.solution')
                ->where('service.steps', function ($steps) {
                    foreach ($steps as $step) {
                        $this->assertSame('', $step['duration']);
                    }

                    return true;
                })
                ->where('service', function ($service) {
                    $this->assertProjectBasedCopy($service);

                    return true;
                })
                ->has('service.engagements', 3)
                ->has('service.engagements.0.best_for')
                ->where('service.faqs', fn ($faqs) => count($faqs) >= 4 && count($faqs) <= 5)
                ->where('service.tools', fn ($tools) => count($tools) > 0)
                ->has('related', 2)
                ->has('seo')
            );
    }

    public function test_arabic_page_serves_arabic_copy(): void
    {
        $this->get('/ar/services/automation')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('service.title', 'الأتمتة')
                ->where('service.faqs.0.question', fn ($q) => preg_match('/\p{Arabic}/u', $q) === 1)
                ->where('seo.description', fn ($d) => preg_match('/\p{Arabic}/u', $d) === 1)
            );
    }

    public function test_specialisms_link_back_to_development(): void
    {
        $this->get('/en/services/web-development')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('related.0.slug', 'development')
            );
    }

    public function test_seeded_rows_store_the_new_columns(): void
    {
        $service = ServicePage::where('slug', 'qa')->firstOrFail();

        $this->assertNotEmpty($service->tagline_en);
        $this->assertNotEmpty($service->tagline_ar);
        $this->assertCount(4, $service->pains_ar);
        $this->assertCount(3, $service->engagements_en);
        $this->assertSame(['title', 'duration', 'description', 'best_for'], array_keys($service->engagements_ar[0]));
        $this->assertContains('Playwright', $service->tools);
        $this->assertArrayHasKey('duration', $service->process_steps_en[0]);
    }

    public function test_pages_still_render_when_new_fields_are_empty(): void
    {
        ServicePage::where('slug', 'qa')->update([
            'tagline_en' => null,
            'audience_en' => null,
            'pains_en' => null,
            'engagements_en' => null,
            'tools' => null,
            'faqs_en' => null,
        ]);

        $this->get('/en/services/qa')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('service.tagline', 'Quality Assurance')
                ->has('service.pains', 0)
                ->has('service.engagements', 0)
                ->has('service.tools', 0)
                ->has('service.faqs', 0)
            );
    }

    public function test_service_copy_never_uses_unverified_proof(): void
    {
        $blob = json_encode(ServicePageContentSeeder::content(), JSON_UNESCAPED_UNICODE);

        foreach (['%', 'ISO 27001', 'certified partner', 'testimonial', 'WhatsApp us'] as $banned) {
            $this->assertStringNotContainsStringIgnoringCase($banned, $blob);
        }
    }

    public function test_service_and_faq_translations_use_project_based_copy(): void
    {
        $translations = [];

        foreach (['en', 'ar'] as $locale) {
            $translations[$locale] = json_decode(
                file_get_contents(resource_path("lang/{$locale}.json")),
                true,
                512,
                JSON_THROW_ON_ERROR,
            );

            foreach ($translations[$locale] as $key => $value) {
                if (str_starts_with($key, 'services.') || str_starts_with($key, 'faq.')) {
                    $this->assertProjectBasedCopy($value, "{$locale}.{$key}");
                }
            }
        }

        $englishKeys = array_keys($translations['en']);
        $arabicKeys = array_keys($translations['ar']);
        sort($englishKeys);
        sort($arabicKeys);
        $this->assertSame($englishKeys, $arabicKeys);
    }

    private function assertProjectBasedCopy(mixed $value, string $path = 'service'): void
    {
        if (is_iterable($value)) {
            foreach ($value as $key => $child) {
                $this->assertProjectBasedCopy($child, "{$path}.{$key}");
            }

            return;
        }

        if (! is_string($value)) {
            return;
        }

        $this->assertDoesNotMatchRegularExpression(
            '/\b\d+\s*(?:[-–]\s*\d+\s*)?(?:weeks?|months?|days?)\b/i',
            $value,
            $path,
        );
        $this->assertDoesNotMatchRegularExpression('/(أسبوع|أسابيع|أسبوعين|أسبوعان|أشهر|شهرين|أيام)/u', $value, $path);
        $this->assertDoesNotMatchRegularExpression('/mada|مدى|Apple Pay|HyperPay|Moyasar|Stripe|\bTap\b/iu', $value, $path);
    }

    public function test_unknown_service_is_not_found(): void
    {
        $this->get('/en/services/not-a-service')->assertNotFound();
    }
}
