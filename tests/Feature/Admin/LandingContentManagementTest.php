<?php

namespace Tests\Feature\Admin;

use App\Models\LandingCaseStudy;
use App\Models\LandingFaq;
use App\Models\LandingProcessStep;
use App\Models\LandingService;
use App\Models\PortfolioItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class LandingContentManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function faqPayload(array $overrides = []): array
    {
        return array_merge([
            'question_en' => 'Do you sign NDAs?',
            'question_ar' => 'هل توقّعون اتفاقيات عدم إفصاح؟',
            'answer_en' => 'Yes, before discovery starts.',
            'answer_ar' => 'نعم، قبل بدء مرحلة الاكتشاف.',
            'is_visible' => true,
        ], $overrides);
    }

    private function faq(int $sortOrder = 0, bool $visible = true): LandingFaq
    {
        return LandingFaq::create($this->faqPayload([
            'question_en' => "Question {$sortOrder}",
            'sort_order' => $sortOrder,
            'is_visible' => $visible,
        ]));
    }

    public function test_overview_lists_every_section_with_counts(): void
    {
        $this->faq(0);
        $this->faq(1, false);

        $this->actingAs($this->admin)
            ->get('/admin/landing')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('admin/landing/index')
                ->has('sections', 4)
                ->where('sections.3', ['key' => 'faqs', 'total' => 2, 'visible' => 1])
                ->where('sections.0.visible', null)
            );
    }

    public function test_admin_can_view_each_section_index_and_forms(): void
    {
        $faq = $this->faq();

        foreach (['services', 'process-steps', 'case-studies', 'faqs'] as $section) {
            $this->actingAs($this->admin)
                ->get("/admin/landing/{$section}")
                ->assertOk()
                ->assertInertia(fn (AssertableInertia $page) => $page
                    ->component("admin/landing/{$section}/index")
                    ->has('items')
                );

            $this->actingAs($this->admin)
                ->get("/admin/landing/{$section}/create")
                ->assertOk()
                ->assertInertia(fn (AssertableInertia $page) => $page->component("admin/landing/{$section}/create"));
        }

        $this->actingAs($this->admin)
            ->get("/admin/landing/faqs/{$faq->id}/edit")
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('admin/landing/faqs/edit')
                ->where('item.question_en', 'Question 0')
            );
    }

    public function test_admin_can_create_a_faq_and_it_appears_on_both_homepages(): void
    {
        $this->faq(5);

        $this->actingAs($this->admin)
            ->post('/admin/landing/faqs', $this->faqPayload())
            ->assertRedirect('/admin/landing/faqs')
            ->assertSessionHas('success', 'FAQ created.');

        $created = LandingFaq::where('question_en', 'Do you sign NDAs?')->firstOrFail();
        $this->assertSame(6, $created->sort_order);

        auth()->logout();

        $this->get('/en')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('landing.faqs.1.q', 'Do you sign NDAs?')
        );
        $this->get('/ar')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('landing.faqs.1.q', 'هل توقّعون اتفاقيات عدم إفصاح؟')
        );
    }

    public function test_faq_validation_requires_both_languages(): void
    {
        $this->actingAs($this->admin)
            ->post('/admin/landing/faqs', $this->faqPayload(['question_ar' => '', 'answer_en' => '']))
            ->assertSessionHasErrors(['question_ar', 'answer_en']);

        $this->assertSame(0, LandingFaq::count());
    }

    public function test_admin_can_update_a_faq(): void
    {
        $faq = $this->faq();

        $this->actingAs($this->admin)
            ->put("/admin/landing/faqs/{$faq->id}", $this->faqPayload(['answer_en' => 'Always.']))
            ->assertRedirect('/admin/landing/faqs');

        $this->assertSame('Always.', $faq->fresh()->answer_en);

        auth()->logout();
        $this->get('/en')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('landing.faqs.0.a', 'Always.')
        );
    }

    public function test_toggling_visibility_hides_and_shows_on_the_homepage(): void
    {
        $faq = $this->faq();

        $this->actingAs($this->admin)
            ->patch("/admin/landing/faqs/{$faq->id}/visibility")
            ->assertRedirect();

        $this->assertFalse($faq->fresh()->is_visible);
        $this->get('/en')->assertInertia(fn (AssertableInertia $page) => $page->has('landing.faqs', 0));

        $this->actingAs($this->admin)->patch("/admin/landing/faqs/{$faq->id}/visibility");

        $this->assertTrue($faq->fresh()->is_visible);
        $this->get('/en')->assertInertia(fn (AssertableInertia $page) => $page->has('landing.faqs', 1));
    }

    public function test_visibility_route_only_exists_for_tables_with_the_column(): void
    {
        $step = LandingProcessStep::create([
            'n' => '01', 'title_en' => 'Discover', 'title_ar' => 'الاكتشاف',
            'body_en' => 'Body', 'body_ar' => 'نص', 'duration_en' => '1 wk', 'duration_ar' => 'أسبوع',
            'deliverable_en' => 'Doc', 'deliverable_ar' => 'وثيقة', 'sort_order' => 0,
        ]);

        $this->actingAs($this->admin)
            ->patch("/admin/landing/process-steps/{$step->id}/visibility")
            ->assertNotFound();
    }

    public function test_admin_can_delete_a_faq(): void
    {
        $faq = $this->faq();

        $this->actingAs($this->admin)
            ->delete("/admin/landing/faqs/{$faq->id}")
            ->assertRedirect('/admin/landing/faqs');

        $this->assertModelMissing($faq);
    }

    public function test_reorder_moves_an_item_even_with_duplicate_sort_orders(): void
    {
        $a = $this->faq(0);
        $b = $this->faq(0);
        $c = $this->faq(0);

        $this->actingAs($this->admin)
            ->post("/admin/landing/faqs/{$c->id}/reorder", ['direction' => 'up'])
            ->assertRedirect();

        $this->assertSame(
            [$a->id, $c->id, $b->id],
            LandingFaq::orderBy('sort_order')->pluck('id')->all(),
        );

        // Moving the first item up is a no-op.
        $this->actingAs($this->admin)
            ->post("/admin/landing/faqs/{$a->id}/reorder", ['direction' => 'up']);

        $this->assertSame($a->id, LandingFaq::orderBy('sort_order')->value('id'));

        $this->actingAs($this->admin)
            ->post("/admin/landing/faqs/{$a->id}/reorder", ['direction' => 'sideways'])
            ->assertSessionHasErrors('direction');
    }

    public function test_admin_can_create_and_update_a_case_study(): void
    {
        $portfolio = PortfolioItem::create([
            'title_en' => 'Real project', 'title_ar' => 'مشروع حقيقي', 'slug' => 'real-project',
            'description_en' => 'Desc', 'description_ar' => 'وصف', 'service_category' => 'development',
        ]);

        $payload = [
            'tag_en' => 'RETAIL', 'tag_ar' => 'تجزئة',
            'client_en' => 'Real Client', 'client_ar' => 'عميل حقيقي',
            'headline_en' => 'Shipped a thing.', 'headline_ar' => 'أطلقنا شيئاً.',
            'metric' => '+10%',
            'metric_label_en' => 'conversion', 'metric_label_ar' => 'التحويل',
            'portfolio_slug' => 'real-project',
            'is_visible' => false,
        ];

        $this->actingAs($this->admin)
            ->post('/admin/landing/case-studies', $payload)
            ->assertRedirect('/admin/landing/case-studies');

        $case = LandingCaseStudy::firstOrFail();
        $this->assertFalse($case->is_visible);
        $this->assertSame($portfolio->slug, $case->portfolio_slug);

        $this->actingAs($this->admin)
            ->put("/admin/landing/case-studies/{$case->id}", ['portfolio_slug' => 'missing'] + $payload)
            ->assertSessionHasErrors('portfolio_slug');

        $this->actingAs($this->admin)
            ->put("/admin/landing/case-studies/{$case->id}", ['portfolio_slug' => null, 'is_visible' => true] + $payload)
            ->assertSessionHasNoErrors();

        $this->get('/en')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('landing.cases.0.client', 'Real Client')
            ->where('landing.cases.0.portfolio_slug', null)
        );
    }

    public function test_admin_can_create_a_process_step(): void
    {
        $this->actingAs($this->admin)
            ->post('/admin/landing/process-steps', [
                'n' => '06',
                'title_en' => 'Scale', 'title_ar' => 'التوسّع',
                'body_en' => 'Grow it.', 'body_ar' => 'ننمّيه.',
                'duration_en' => 'Ongoing', 'duration_ar' => 'مستمر',
                'deliverable_en' => 'Roadmap', 'deliverable_ar' => 'خارطة طريق',
            ])
            ->assertRedirect('/admin/landing/process-steps');

        $this->get('/ar')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('landing.processSteps.0.title', 'التوسّع')
            ->where('landing.processSteps.0.n', '06')
        );
    }

    public function test_service_tags_are_split_from_comma_separated_text_and_code_is_generated(): void
    {
        LandingService::create([
            'code' => 'S_01', 'title_en' => 'Dev', 'title_ar' => 'تطوير',
            'body_en' => 'Body', 'body_ar' => 'نص', 'tags_en' => [], 'tags_ar' => [], 'sort_order' => 0,
        ]);

        $this->actingAs($this->admin)
            ->post('/admin/landing/services', [
                'title_en' => 'Data', 'title_ar' => 'البيانات',
                'body_en' => 'Pipelines.', 'body_ar' => 'خطوط بيانات.',
                'tags_en' => 'ETL, BI , ,Dashboards',
                'tags_ar' => 'ETL، ذكاء أعمال',
            ])
            ->assertRedirect('/admin/landing/services');

        $service = LandingService::where('title_en', 'Data')->firstOrFail();
        $this->assertSame('S_02', $service->code);
        $this->assertSame(['ETL', 'BI', 'Dashboards'], $service->tags_en);
        $this->assertSame(['ETL', 'ذكاء أعمال'], $service->tags_ar);

        $this->actingAs($this->admin)
            ->put("/admin/landing/services/{$service->id}", [
                'title_en' => 'Data', 'title_ar' => 'البيانات',
                'body_en' => 'Pipelines.', 'body_ar' => 'خطوط بيانات.',
                'tags_en' => '', 'tags_ar' => '',
            ])
            ->assertSessionHasNoErrors();

        $this->assertSame([], $service->fresh()->tags_en);
        $this->assertSame('S_02', $service->fresh()->code);
    }

    public function test_editors_and_guests_cannot_manage_homepage_content(): void
    {
        $faq = $this->faq();
        $editor = User::factory()->create(['role' => 'editor']);

        $this->actingAs($editor)->get('/admin/landing')->assertForbidden();
        $this->actingAs($editor)->get('/admin/landing/faqs')->assertForbidden();
        $this->actingAs($editor)->post('/admin/landing/faqs', $this->faqPayload())->assertForbidden();
        $this->actingAs($editor)->put("/admin/landing/faqs/{$faq->id}", $this->faqPayload())->assertForbidden();
        $this->actingAs($editor)->patch("/admin/landing/faqs/{$faq->id}/visibility")->assertForbidden();
        $this->actingAs($editor)->delete("/admin/landing/faqs/{$faq->id}")->assertForbidden();
        $this->assertModelExists($faq);

        auth()->logout();
        $this->get('/admin/landing')->assertRedirect('/login');
    }
}
