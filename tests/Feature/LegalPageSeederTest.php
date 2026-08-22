<?php

namespace Tests\Feature;

use App\Models\LegalPage;
use App\Services\LegalContentService;
use Database\Seeders\LegalPageSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LegalPageSeederTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(LegalPageSeeder::class);
    }

    /**
     * Flatten every string of a seeded page into one haystack for content checks.
     */
    private function textOf(string $slug, string $locale = 'en'): string
    {
        $page = LegalPage::where('slug', $slug)->firstOrFail();

        return json_encode($page->{'sections_'.$locale}, JSON_UNESCAPED_UNICODE);
    }

    public function test_it_seeds_a_published_privacy_policy_and_terms_of_service(): void
    {
        $this->assertSame(
            ['privacy', 'terms'],
            LegalPage::where('is_published', true)->orderBy('slug')->pluck('slug')->all(),
        );
    }

    public function test_running_the_seeder_twice_does_not_duplicate_pages(): void
    {
        $this->seed(LegalPageSeeder::class);

        $this->assertSame(2, LegalPage::count());
    }

    public function test_every_page_carries_an_effective_date_and_version(): void
    {
        foreach (LegalPage::all() as $page) {
            $this->assertNotNull($page->effective_date, "{$page->slug} is missing an effective date.");
            $this->assertNotEmpty($page->version, "{$page->slug} is missing a version.");
        }
    }

    public function test_english_and_arabic_sections_are_structurally_identical(): void
    {
        foreach (LegalPage::all() as $page) {
            $this->assertSame(
                count($page->sections_en),
                count($page->sections_ar),
                "{$page->slug} has a different number of English and Arabic sections.",
            );

            foreach ($page->sections_en as $index => $section) {
                $arabic = $page->sections_ar[$index];

                $this->assertNotEmpty($section['heading'], "{$page->slug} EN section {$index} has no heading.");
                $this->assertNotEmpty($arabic['heading'], "{$page->slug} AR section {$index} has no heading.");
                $this->assertNotEmpty($section['body'], "{$page->slug} EN section {$index} has no body.");
                $this->assertNotEmpty($arabic['body'], "{$page->slug} AR section {$index} has no body.");
            }
        }
    }

    public function test_seeded_copy_only_uses_tokens_the_resolver_knows(): void
    {
        $known = array_keys(LegalContentService::tokens());

        foreach (LegalPage::all() as $page) {
            $haystack = $this->textOf($page->slug).$this->textOf($page->slug, 'ar');

            preg_match_all('/\{\{\s*([a-z_]+)\s*\}\}/', $haystack, $matches);

            foreach (array_unique($matches[1]) as $token) {
                $this->assertContains(
                    $token,
                    $known,
                    "{$page->slug} uses unknown token {{{$token}}}.",
                );
            }
        }
    }

    public function test_privacy_policy_carries_the_google_api_services_limited_use_disclosure(): void
    {
        $privacy = $this->textOf('privacy');

        $this->assertStringContainsString('Google API Services User Data Policy', $privacy);
        $this->assertStringContainsString('Limited Use', $privacy);
    }

    public function test_privacy_policy_discloses_apple_and_microsoft_sign_in_handling(): void
    {
        $privacy = $this->textOf('privacy');

        $this->assertStringContainsString('Sign in with Apple', $privacy);
        $this->assertStringContainsString('Hide My Email', $privacy);
        $this->assertStringContainsString('Microsoft', $privacy);
    }

    public function test_privacy_policy_documents_an_account_and_data_deletion_path(): void
    {
        $privacy = $this->textOf('privacy');

        $this->assertStringContainsString('delete your account', $privacy);
        $this->assertStringContainsString('{{privacy_email}}', $privacy);
    }

    public function test_privacy_policy_covers_the_major_privacy_regimes(): void
    {
        $privacy = $this->textOf('privacy');

        foreach (['GDPR', 'CCPA', 'PDPL', 'LGPD', 'PIPEDA'] as $regime) {
            $this->assertStringContainsString($regime, $privacy, "Privacy policy does not mention {$regime}.");
        }
    }

    public function test_privacy_policy_states_that_personal_data_is_not_sold(): void
    {
        $this->assertStringContainsString('do not sell', $this->textOf('privacy'));
    }

    public function test_privacy_policy_covers_children_and_international_transfers(): void
    {
        $privacy = $this->textOf('privacy');

        $this->assertStringContainsString('Standard Contractual Clauses', $privacy);
        $this->assertStringContainsString('Children', $privacy);
    }

    public function test_terms_include_the_apple_third_party_beneficiary_clause(): void
    {
        $terms = $this->textOf('terms');

        $this->assertStringContainsString('third-party beneficiary', $terms);
        $this->assertStringContainsString('Apple', $terms);
    }

    public function test_terms_cover_export_control_and_sanctions(): void
    {
        $terms = $this->textOf('terms');

        $this->assertStringContainsString('export control', $terms);
        $this->assertStringContainsString('sanctions', $terms);
    }

    public function test_terms_state_governing_law_through_a_configurable_token(): void
    {
        $terms = $this->textOf('terms');

        $this->assertStringContainsString('{{governing_law}}', $terms);
        $this->assertStringContainsString('Governing Law', $terms);
    }
}
