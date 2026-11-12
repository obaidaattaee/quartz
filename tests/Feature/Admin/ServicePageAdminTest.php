<?php

namespace Tests\Feature\Admin;

use App\Http\Controllers\ServiceController;
use App\Models\ServicePage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ServicePageAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    private function makeService(string $slug): ServicePage
    {
        return ServicePage::updateOrCreate(['slug' => $slug], [
            'title_en' => ucfirst($slug),
            'title_ar' => $slug,
            'problem_en' => 'Problem',
            'problem_ar' => 'مشكلة',
            'approach_en' => 'Approach',
            'approach_ar' => 'منهج',
            'process_steps_en' => [],
            'process_steps_ar' => [],
            'deliverables_en' => [],
            'deliverables_ar' => [],
        ]);
    }

    public function test_index_lists_only_public_services_in_public_order(): void
    {
        $this->makeService('legacy-service');

        foreach (array_reverse(ServiceController::ORDER) as $slug) {
            $this->makeService($slug);
        }

        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->get('/admin/services')->assertInertia(
            function (AssertableInertia $page) {
                $page->component('admin/services/index')
                    ->has('services', count(ServiceController::ORDER));

                foreach (ServiceController::ORDER as $index => $slug) {
                    $page->where("services.{$index}.slug", $slug);
                }
            }
        );

        $this->assertDatabaseHas('service_pages', ['slug' => 'legacy-service']);
    }

    public function test_non_public_service_pages_cannot_be_edited(): void
    {
        $legacy = $this->makeService('legacy-service');
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->get("/admin/services/{$legacy->id}/edit")->assertNotFound();
    }

    /**
     * A complete, valid update payload including every structured field.
     *
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(array $overrides = []): array
    {
        return array_merge([
            'title_en' => 'Software Development',
            'title_ar' => 'تطوير البرمجيات',
            'subtitle_en' => 'Intro',
            'subtitle_ar' => 'مقدمة',
            'tagline_en' => 'Software that fits.',
            'tagline_ar' => 'برمجيات على مقاسك.',
            'audience_en' => 'Teams outgrowing spreadsheets.',
            'audience_ar' => 'فرق تجاوزت الجداول.',
            'problem_en' => 'Problem intro',
            'problem_ar' => 'مقدمة المشكلة',
            'pains_en' => [['problem' => 'Manual work', 'solution' => 'Automated flow']],
            'pains_ar' => [['problem' => 'عمل يدوي', 'solution' => 'تدفق مؤتمت']],
            'approach_en' => 'Approach intro',
            'approach_ar' => 'مقدمة المنهج',
            'process_steps_en' => [['title' => 'Discover', 'description' => 'We listen.', 'duration' => '1 week']],
            'process_steps_ar' => [['title' => 'الاكتشاف', 'description' => 'نستمع.', 'duration' => 'أسبوع']],
            'deliverables_en' => ['Source code'],
            'deliverables_ar' => ['الشيفرة المصدرية'],
            'engagements_en' => [[
                'title' => 'Discovery sprint',
                'duration' => '2 weeks',
                'description' => 'A fixed-scope start.',
                'best_for' => 'New products',
            ]],
            'engagements_ar' => [[
                'title' => 'سباق الاكتشاف',
                'duration' => 'أسبوعان',
                'description' => 'بداية بنطاق محدد.',
                'best_for' => 'المنتجات الجديدة',
            ]],
            'tools' => ['Laravel', 'React'],
            'faqs_en' => [['question' => 'Who owns the code?', 'answer' => 'You do.']],
            'faqs_ar' => [['question' => 'من يملك الشيفرة؟', 'answer' => 'أنت.']],
            'cta_text_en' => 'Talk to us',
            'cta_text_ar' => 'تحدث معنا',
        ], $overrides);
    }

    public function test_every_public_service_page_is_editable(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        foreach (ServiceController::ORDER as $slug) {
            $service = $this->makeService($slug);

            $this->actingAs($admin)->get("/admin/services/{$service->id}/edit")
                ->assertOk()
                ->assertInertia(fn (AssertableInertia $page) => $page
                    ->component('admin/services/edit')
                    ->where('service.slug', $slug)
                );

            $this->actingAs($admin)
                ->put("/admin/services/{$service->id}", $this->payload())
                ->assertSessionHasNoErrors()
                ->assertRedirect('/admin/services');
        }
    }

    public function test_admin_can_update_structured_content_and_it_renders_publicly(): void
    {
        $service = $this->makeService('development');
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->put("/admin/services/{$service->id}", $this->payload())
            ->assertSessionHasNoErrors()
            ->assertRedirect('/admin/services')
            ->assertSessionHas('success', 'Service page updated.');

        $this->actingAs($admin)->get("/admin/services/{$service->id}/edit")
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('service.tagline_ar', 'برمجيات على مقاسك.')
                ->where('service.faqs_en.0.question', 'Who owns the code?')
                ->where('service.tools', ['Laravel', 'React'])
            );

        $this->get('/en/services/development')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('public/services/development')
                ->where('service.tagline', 'Software that fits.')
                ->where('service.audience', 'Teams outgrowing spreadsheets.')
                ->where('service.pains', [['problem' => 'Manual work', 'solution' => 'Automated flow']])
                ->where('service.steps.0.duration', '1 week')
                ->where('service.engagements.0.best_for', 'New products')
                ->where('service.tools', ['Laravel', 'React'])
                ->where('service.faqs', [['question' => 'Who owns the code?', 'answer' => 'You do.']])
                ->where('service.cta', 'Talk to us')
            );

        $this->get('/ar/services/development')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('service.tagline', 'برمجيات على مقاسك.')
                ->where('service.audience', 'فرق تجاوزت الجداول.')
                ->where('service.pains.0.solution', 'تدفق مؤتمت')
                ->where('service.steps.0.duration', 'أسبوع')
                ->where('service.engagements.0.title', 'سباق الاكتشاف')
                ->where('service.faqs.0.answer', 'أنت.')
            );
    }

    public function test_optional_structured_fields_can_be_cleared(): void
    {
        $service = $this->makeService('qa');
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->put("/admin/services/{$service->id}", $this->payload([
                'tagline_en' => '',
                'audience_en' => '',
                'pains_en' => [],
                'engagements_en' => [],
                'tools' => [],
                'faqs_en' => [],
                'process_steps_en' => [['title' => 'Discover', 'description' => 'We listen.', 'duration' => '']],
            ]))
            ->assertSessionHasNoErrors();

        $this->get('/en/services/qa')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('service.tagline', 'Software Development')
                ->where('service.audience', null)
                ->where('service.pains', [])
                ->where('service.engagements', [])
                ->where('service.tools', [])
                ->where('service.faqs', [])
                ->where('service.steps.0.duration', null)
            );
    }

    /**
     * @return array<string, array{array<string, mixed>, list<string>}>
     */
    public static function invalidPayloads(): array
    {
        $pain = ['problem' => 'P', 'solution' => 'S'];
        $engagement = ['title' => 'T', 'duration' => 'D', 'description' => 'X', 'best_for' => 'B'];
        $faq = ['question' => 'Q', 'answer' => 'A'];

        return [
            'too many pains' => [['pains_en' => array_fill(0, 7, $pain)], ['pains_en']],
            'too many engagements' => [['engagements_ar' => array_fill(0, 5, $engagement)], ['engagements_ar']],
            'too many faqs' => [['faqs_en' => array_fill(0, 11, $faq)], ['faqs_en']],
            'too many tools' => [['tools' => array_map(fn ($i) => "Tool {$i}", range(1, 21))], ['tools']],
            'tool too long' => [['tools' => [str_repeat('x', 41)]], ['tools.0']],
            'duplicate tools' => [['tools' => ['Laravel', 'Laravel']], ['tools.0', 'tools.1']],
            'pain missing solution' => [['pains_en' => [['problem' => 'P']]], ['pains_en.0.solution']],
            'engagement missing keys' => [
                ['engagements_en' => [['title' => 'T', 'description' => 'X']]],
                ['engagements_en.0.duration', 'engagements_en.0.best_for'],
            ],
            'faq missing answer' => [['faqs_ar' => [['question' => 'Q', 'answer' => '']]], ['faqs_ar.0.answer']],
            'tagline too long' => [['tagline_en' => str_repeat('x', 256)], ['tagline_en']],
            'engagement title too long' => [
                ['engagements_en' => [[...$engagement, 'title' => str_repeat('x', 256)]]],
                ['engagements_en.0.title'],
            ],
            'step duration too long' => [
                ['process_steps_en' => [['title' => 'T', 'description' => 'D', 'duration' => str_repeat('x', 61)]]],
                ['process_steps_en.0.duration'],
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @param  list<string>  $errorKeys
     */
    #[DataProvider('invalidPayloads')]
    public function test_invalid_structured_content_is_rejected(array $overrides, array $errorKeys): void
    {
        $service = $this->makeService('development');
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->from("/admin/services/{$service->id}/edit")
            ->put("/admin/services/{$service->id}", $this->payload($overrides))
            ->assertRedirect("/admin/services/{$service->id}/edit")
            ->assertSessionHasErrors($errorKeys);

        $this->assertNull($service->fresh()->tagline_en);
    }

    public function test_unknown_keys_in_repeater_rows_are_not_stored(): void
    {
        $service = $this->makeService('development');
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->put("/admin/services/{$service->id}", $this->payload([
                'faqs_en' => [['question' => 'Q', 'answer' => 'A', 'html' => '<script>']],
            ]))
            ->assertSessionHasNoErrors();

        $this->assertSame([['question' => 'Q', 'answer' => 'A']], $service->fresh()->faqs_en);
    }

    public function test_editors_and_guests_cannot_edit_service_pages(): void
    {
        $service = $this->makeService('development');
        $editor = User::factory()->create(['role' => 'editor']);

        $this->actingAs($editor)->get('/admin/services')->assertForbidden();
        $this->actingAs($editor)->get("/admin/services/{$service->id}/edit")->assertForbidden();
        $this->actingAs($editor)->put("/admin/services/{$service->id}", $this->payload())->assertForbidden();

        auth()->logout();

        $this->get("/admin/services/{$service->id}/edit")->assertRedirect('/login');
        $this->put("/admin/services/{$service->id}", $this->payload())->assertRedirect('/login');

        $this->assertNull($service->fresh()->tagline_en);
    }
}
