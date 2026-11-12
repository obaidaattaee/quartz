<?php

namespace Tests\Feature\Admin;

use App\Models\Industry;
use App\Models\User;
use Database\Seeders\IndustryContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class IndustryAdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        $this->seed(IndustryContentSeeder::class);
    }

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    private function industry(string $slug = 'healthcare'): Industry
    {
        return Industry::where('slug', $slug)->firstOrFail();
    }

    /**
     * A complete, valid payload built from the seeded row.
     *
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(Industry $industry, array $overrides = []): array
    {
        $fields = [
            'primary_service', 'sort_order', 'is_visible',
        ];

        foreach (['en', 'ar'] as $locale) {
            foreach ([
                'title', 'tagline', 'hero_blurb', 'summary', 'audience', 'cta_text', 'compliance_note',
                'challenges', 'solutions', 'compliance_items', 'examples', 'faqs',
            ] as $field) {
                $fields[] = "{$field}_{$locale}";
            }
        }

        $payload = [];

        foreach ($fields as $field) {
            $payload[$field] = $industry->{$field};
        }

        return array_merge($payload, $overrides);
    }

    public function test_admin_index_lists_all_five_industries_in_order(): void
    {
        $this->actingAs($this->admin())->get('/admin/industries')->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('admin/industries/index')
                ->has('industries', 5)
                ->where('industries.0.slug', 'retail-pos')
                ->where('industries.4.slug', 'education')
        );
    }

    public function test_edit_page_receives_the_row_and_service_options(): void
    {
        $industry = $this->industry();

        $this->actingAs($this->admin())->get("/admin/industries/{$industry->id}/edit")->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('admin/industries/edit')
                ->where('industry.slug', 'healthcare')
                ->has('industry.faqs_ar', 5)
                ->has('industry.compliance_items_en', 4)
                ->has('services', 6)
                ->where('services.0.value', 'development')
        );
    }

    public function test_admin_can_update_every_structured_field(): void
    {
        $industry = $this->industry();

        $changes = [
            'tagline_en' => 'New headline',
            'tagline_ar' => 'عنوان جديد',
            'summary_en' => 'New summary',
            'summary_ar' => 'ملخص جديد',
            'audience_en' => 'New audience',
            'audience_ar' => 'جمهور جديد',
            'cta_text_en' => 'Talk to us',
            'cta_text_ar' => 'تحدث معنا',
            'primary_service' => 'qa',
            'compliance_note_en' => 'New rules intro',
            'challenges_en' => [['title' => 'Pain', 'description' => 'Pain text']],
            'solutions_en' => [
                ['title' => 'Linked', 'description' => 'Text', 'service' => 'cybersecurity'],
                ['title' => 'Unlinked', 'description' => 'Text', 'service' => ''],
            ],
            'compliance_items_en' => [['name' => 'Rule', 'description' => 'What we do']],
            'compliance_items_ar' => [['name' => 'متطلب', 'description' => 'ما نفعله']],
            'examples_en' => [['title' => 'Example', 'description' => 'Example text']],
            'examples_ar' => [],
            'faqs_en' => [['question' => 'Q?', 'answer' => 'A.']],
            'faqs_ar' => [['question' => 'سؤال؟', 'answer' => 'جواب.']],
            'sort_order' => 25,
            'is_visible' => false,
        ];

        $this->actingAs($this->admin())
            ->put("/admin/industries/{$industry->id}", $this->payload($industry, $changes))
            ->assertSessionHasNoErrors()
            ->assertRedirect('/admin/industries')
            ->assertSessionHas('success');

        $fresh = $industry->fresh();

        foreach ($changes as $field => $value) {
            if ($field === 'solutions_en') {
                continue;
            }

            $this->assertEquals($value, $fresh->{$field}, $field);
        }

        $this->assertSame([
            ['title' => 'Linked', 'description' => 'Text', 'service' => 'cybersecurity'],
            ['title' => 'Unlinked', 'description' => 'Text'],
        ], $fresh->solutions_en);
    }

    public function test_optional_fields_can_be_cleared(): void
    {
        $industry = $this->industry('education');

        $this->actingAs($this->admin())
            ->put("/admin/industries/{$industry->id}", $this->payload($industry, [
                'tagline_en' => null,
                'summary_en' => null,
                'primary_service' => null,
                'challenges_en' => [],
                'solutions_en' => [],
                'faqs_en' => [],
                'examples_en' => [],
                'compliance_items_en' => [],
            ]))
            ->assertSessionHasNoErrors();

        $fresh = $industry->fresh();
        $this->assertNull($fresh->tagline_en);
        $this->assertNull($fresh->primary_service);
        $this->assertSame([], $fresh->faqs_en);
        $this->assertSame([], $fresh->solutions_en);

        $this->get('/en/industries/education')->assertOk();
    }

    /**
     * @return array<string, array{array<string, mixed>, string}>
     */
    public static function invalidPayloads(): array
    {
        $faq = ['question' => 'Q', 'answer' => 'A'];
        $item = ['title' => 'T', 'description' => 'D'];

        return [
            'missing title' => [['title_ar' => ''], 'title_ar'],
            'missing intro' => [['hero_blurb_en' => ''], 'hero_blurb_en'],
            'long summary' => [['summary_en' => str_repeat('a', 301)], 'summary_en'],
            'long button' => [['cta_text_ar' => str_repeat('a', 81)], 'cta_text_ar'],
            'unknown main service' => [['primary_service' => 'payments'], 'primary_service'],
            'unknown solution service' => [['solutions_en' => [['title' => 'T', 'description' => 'D', 'service' => 'pos']]], 'solutions_en.0.service'],
            'too many realities' => [['challenges_en' => array_fill(0, 7, $item)], 'challenges_en'],
            'too many solutions' => [['solutions_ar' => array_fill(0, 7, $item)], 'solutions_ar'],
            'too many rules' => [['compliance_items_en' => array_fill(0, 9, ['name' => 'N', 'description' => 'D'])], 'compliance_items_en'],
            'too many examples' => [['examples_en' => array_fill(0, 5, $item)], 'examples_en'],
            'too many faqs' => [['faqs_ar' => array_fill(0, 11, $faq)], 'faqs_ar'],
            'faq without answer' => [['faqs_en' => [['question' => 'Q', 'answer' => '']]], 'faqs_en.0.answer'],
            'rule without name' => [['compliance_items_ar' => [['name' => '', 'description' => 'D']]], 'compliance_items_ar.0.name'],
            'long example text' => [['examples_ar' => [['title' => 'T', 'description' => str_repeat('a', 601)]]], 'examples_ar.0.description'],
            'negative order' => [['sort_order' => -1], 'sort_order'],
        ];
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    #[DataProvider('invalidPayloads')]
    public function test_validation_limits_hold(array $overrides, string $errorKey): void
    {
        $industry = $this->industry();
        $before = $industry->fresh()->toArray();

        $this->actingAs($this->admin())
            ->from("/admin/industries/{$industry->id}/edit")
            ->put("/admin/industries/{$industry->id}", $this->payload($industry, $overrides))
            ->assertSessionHasErrors($errorKey);

        $this->assertEquals($before, $industry->fresh()->toArray());
    }

    public function test_editors_are_blocked(): void
    {
        $industry = $this->industry();
        $editor = User::factory()->create(['role' => 'editor']);

        $this->actingAs($editor)->get('/admin/industries')->assertForbidden();
        $this->actingAs($editor)->get("/admin/industries/{$industry->id}/edit")->assertForbidden();
        $this->actingAs($editor)
            ->put("/admin/industries/{$industry->id}", $this->payload($industry, ['tagline_en' => 'Hacked']))
            ->assertForbidden();

        $this->assertNotSame('Hacked', $industry->fresh()->tagline_en);
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $industry = $this->industry();

        $this->get('/admin/industries')->assertRedirect('/login');
        $this->get("/admin/industries/{$industry->id}/edit")->assertRedirect('/login');
        $this->put("/admin/industries/{$industry->id}", $this->payload($industry))->assertRedirect('/login');
    }
}
