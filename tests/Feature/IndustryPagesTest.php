<?php

namespace Tests\Feature;

use App\Http\Controllers\IndustryController;
use App\Models\Industry;
use Database\Seeders\IndustryContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class IndustryPagesTest extends TestCase
{
    use RefreshDatabase;

    private const SLUGS = ['retail-pos', 'healthcare', 'financial-services', 'government', 'education'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        $this->seed(IndustryContentSeeder::class);
    }

    /**
     * @return array<string, array{string}>
     */
    public static function locales(): array
    {
        return ['en' => ['en'], 'ar' => ['ar']];
    }

    /**
     * @return array<string, array{string, string}>
     */
    public static function pages(): array
    {
        $cases = [];

        foreach (self::SLUGS as $slug) {
            foreach (['en', 'ar'] as $locale) {
                $cases["{$slug} {$locale}"] = [$slug, $locale];
            }
        }

        return $cases;
    }

    #[DataProvider('locales')]
    public function test_index_renders_all_five_sectors(string $locale): void
    {
        $this->get("/{$locale}/industries")
            ->assertOk()
            ->assertInertia(function (AssertableInertia $page) {
                $page->component('public/industries/index')
                    ->has('industries', 5)
                    ->has('disciplines', 4)
                    ->where('disciplines.0.slug', 'development')
                    ->where('disciplines.0.services', ['development', 'web-development', 'mobile-apps'])
                    ->has('seo.title')
                    ->has('seo.description');

                foreach (self::SLUGS as $index => $slug) {
                    $page->where("industries.{$index}.slug", $slug)
                        ->whereType("industries.{$index}.title", 'string')
                        ->whereType("industries.{$index}.summary", 'string')
                        ->has("industries.{$index}.solutions", 5)
                        ->has("industries.{$index}.compliance", 4);
                }
            });
    }

    #[DataProvider('pages')]
    public function test_industry_page_renders_structured_content(string $slug, string $locale): void
    {
        $row = Industry::where('slug', $slug)->firstOrFail();

        $this->get("/{$locale}/industries/{$slug}")
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('public/industries/show')
                ->where('industry.slug', $slug)
                ->where('industry.title', $row->{"title_{$locale}"})
                ->where('industry.tagline', $row->{"tagline_{$locale}"})
                ->where('industry.lead', $row->{"hero_blurb_{$locale}"})
                ->whereType('industry.audience', 'string')
                ->where('industry.primary_service', fn ($service) => in_array($service, IndustryController::SERVICES, true))
                ->has('industry.realities', 4)
                ->has('industry.solutions', 5)
                ->has('industry.solutions.0', fn (AssertableInertia $solution) => $solution
                    ->whereType('title', 'string')
                    ->whereType('description', 'string')
                    ->where('service', fn ($service) => in_array($service, IndustryController::SERVICES, true))
                    ->etc())
                ->whereType('industry.compliance_note', 'string')
                ->has('industry.compliance', 4)
                ->has('industry.examples', 3)
                ->has('industry.faqs', 5)
                ->whereType('industry.cta', 'string')
                ->has('others', 4)
                ->where('seo.description', $row->{"summary_{$locale}"}));
    }

    public function test_empty_structured_fields_still_render(): void
    {
        Industry::where('slug', 'education')->update([
            'tagline_en' => null,
            'summary_en' => null,
            'audience_en' => null,
            'primary_service' => null,
            'challenges_en' => [],
            'solutions_en' => [],
            'compliance_note_en' => null,
            'compliance_items_en' => null,
            'examples_en' => null,
            'faqs_en' => null,
            'cta_text_en' => null,
        ]);

        $this->get('/en/industries/education')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('industry.tagline', 'Education')
                ->where('industry.summary', null)
                ->where('industry.primary_service', null)
                ->has('industry.realities', 0)
                ->has('industry.solutions', 0)
                ->has('industry.compliance', 0)
                ->has('industry.examples', 0)
                ->has('industry.faqs', 0)
                ->where('industry.cta', null));

        $this->get('/en/industries')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('industries.4.slug', 'education')
                ->where('industries.4.summary', fn ($summary) => is_string($summary) && $summary !== '')
                ->has('industries.4.solutions', 0)
                ->has('industries.4.compliance', 0));
    }

    public function test_unknown_service_on_a_solution_is_dropped(): void
    {
        Industry::where('slug', 'healthcare')->update([
            'solutions_en' => [['title' => 'Thing', 'description' => 'Text', 'service' => 'not-a-service']],
        ]);

        $this->get('/en/industries/healthcare')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('industry.solutions.0.service', null)
            ->where('industry.solutions.0.service_title', null));
    }

    public function test_hidden_and_unknown_industries_are_not_found(): void
    {
        Industry::where('slug', 'government')->update(['is_visible' => false]);

        $this->get('/en/industries/government')->assertNotFound();
        $this->get('/en/industries/not-a-sector')->assertNotFound();
        $this->get('/en/industries')->assertInertia(fn (AssertableInertia $page) => $page->has('industries', 4));
    }

    public function test_retail_page_is_not_selling_a_company_platform(): void
    {
        $this->get('/en/industries/retail-pos')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('industry.title', 'Retail & point of sale'));

        $this->get('/ar/industries/retail-pos')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('industry.title', 'التجزئة ونقاط البيع'));
    }

    public function test_industry_props_contain_no_banned_claims_timelines_or_payment_gateways(): void
    {
        $blob = '';

        foreach (['en', 'ar'] as $locale) {
            $blob .= json_encode($this->get("/{$locale}/industries")->viewData('page')['props']['industries'], JSON_UNESCAPED_UNICODE);

            foreach (self::SLUGS as $slug) {
                $props = $this->get("/{$locale}/industries/{$slug}")->viewData('page')['props'];
                $blob .= json_encode([$props['industry'], $props['seo']], JSON_UNESCAPED_UNICODE);
            }
        }

        $this->assertNotSame('', $blob);

        // Invented proof, certifications and contact channels.
        foreach ([
            '%', 'ISO 27001', 'SOC 2', 'certified', 'accredited', 'compliant', 'award', 'testimonial',
            'trusted by', 'certified partner', 'partner badge', 'WhatsApp', 'Quartz POS', 'Quartz Cyber', 'HIPAA', 'GDPR', 'PCI',
            'معتمدون لدى', 'حاصلون على شهادة', 'واتساب',
        ] as $banned) {
            $this->assertStringNotContainsStringIgnoringCase($banned, $blob, "Found banned term: {$banned}");
        }

        // Timelines and durations of any kind.
        $this->assertDoesNotMatchRegularExpression(
            '/\b(day|days|week|weeks|weekly|month|months|monthly|year|years|sprint|sprints)\b/i',
            $blob,
        );
        $this->assertDoesNotMatchRegularExpression('/أسبوع|أسابيع|شهر|أشهر|شهور|سنة|سنوات|أيام|يومين/u', $blob);

        // Prices and payment gateways.
        $this->assertDoesNotMatchRegularExpression(
            '/\b(mada|apple pay|stc pay|tap payments|hyperpay|moyasar|stripe|paytabs|checkout\.com|SAR|AED|USD)\b|\$|ريال|درهم|مدى|آبل باي|أبل باي/iu',
            $blob,
        );
    }

    public function test_every_industry_translation_key_used_by_the_pages_exists(): void
    {
        $staging = [
            'en' => storage_path('app/industries-lang-en.json'),
            'ar' => storage_path('app/industries-lang-ar.json'),
        ];

        $sources = [
            resource_path('js/pages/public/industries/index.tsx'),
            resource_path('js/pages/public/industries/show.tsx'),
            resource_path('js/components/industries/industry-visual.tsx'),
        ];

        $used = [];

        foreach ($sources as $file) {
            preg_match_all("/'(industries\.[a-zA-Z0-9.\-]+)'/", file_get_contents($file), $matches);
            $used = array_merge($used, $matches[1]);
        }

        // Keys built from template strings in the pages.
        foreach (IndustryController::SERVICES as $service) {
            $used[] = "industries.services.{$service}";
        }

        foreach ([0, 1, 2] as $i) {
            $used[] = "industries.page.next.{$i}.title";
            $used[] = "industries.page.next.{$i}.text";
        }

        $used = array_values(array_unique($used));
        $this->assertGreaterThan(40, count($used));

        $keySets = [];

        foreach (['en', 'ar'] as $locale) {
            $available = json_decode((string) @file_get_contents(lang_path("{$locale}.json")), true) ?: [];

            if (is_file($staging[$locale])) {
                $stagingKeys = json_decode(file_get_contents($staging[$locale]), true);
                $this->assertIsArray($stagingKeys);
                $keySets[$locale] = array_keys($stagingKeys);
                $available += $stagingKeys;
            }

            foreach ($used as $key) {
                $this->assertArrayHasKey($key, $available, "Missing {$locale} translation: {$key}");
                $this->assertNotSame('', trim((string) $available[$key]), "Empty {$locale} translation: {$key}");
            }
        }

        if (count($keySets) === 2) {
            $this->assertEqualsCanonicalizing($keySets['en'], $keySets['ar']);
        }
    }
}
