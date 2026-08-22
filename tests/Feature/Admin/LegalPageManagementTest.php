<?php

namespace Tests\Feature\Admin;

use App\Models\LegalPage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class LegalPageManagementTest extends TestCase
{
    use RefreshDatabase;

    private function legalPage(): LegalPage
    {
        return LegalPage::create([
            'slug' => 'privacy',
            'title_en' => 'Privacy Policy',
            'title_ar' => 'سياسة الخصوصية',
            'summary_en' => 'How we handle your data.',
            'summary_ar' => 'كيف نتعامل مع بياناتك.',
            'effective_date' => '2026-08-22',
            'version' => '1.0',
            'sections_en' => [['heading' => 'Who We Are', 'body' => ['We are {{company}}.']]],
            'sections_ar' => [['heading' => 'من نحن', 'body' => ['نحن {{company}}.']]],
            'is_published' => true,
        ]);
    }

    /**
     * A valid update payload, so tests only vary the field under test.
     *
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(array $overrides = []): array
    {
        return array_merge([
            'title_en' => 'Privacy Policy',
            'title_ar' => 'سياسة الخصوصية',
            'summary_en' => 'Updated summary.',
            'summary_ar' => 'ملخص محدث.',
            'effective_date' => '2026-09-01',
            'version' => '1.1',
            'sections_en' => [['heading' => 'Scope', 'body' => ['Applies to everyone.']]],
            'sections_ar' => [['heading' => 'النطاق', 'body' => ['ينطبق على الجميع.']]],
            'is_published' => true,
        ], $overrides);
    }

    public function test_admin_can_view_the_legal_pages_index(): void
    {
        $this->legalPage();
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get('/admin/legal')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('admin/legal/index')
                ->has('pages', 1)
            );
    }

    public function test_admin_can_open_the_edit_screen_with_the_token_reference(): void
    {
        $page = $this->legalPage();
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->get("/admin/legal/{$page->id}/edit")
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $inertia) => $inertia
                ->component('admin/legal/edit')
                ->where('page.slug', 'privacy')
                ->has('tokens.company')
                ->has('tokens.privacy_email')
            );
    }

    public function test_effective_date_is_serialised_as_a_plain_date(): void
    {
        $page = $this->legalPage();
        $admin = User::factory()->create(['role' => 'admin']);

        // A full ISO timestamp is rejected by <input type="date">, which
        // silently renders an empty field and loses the date on save.
        $this->actingAs($admin)
            ->get("/admin/legal/{$page->id}/edit")
            ->assertInertia(fn (AssertableInertia $inertia) => $inertia
                ->where('page.effective_date', '2026-08-22')
            );
    }

    public function test_admin_can_update_a_legal_page(): void
    {
        $page = $this->legalPage();
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->put("/admin/legal/{$page->id}", $this->payload())
            ->assertRedirect('/admin/legal');

        $page->refresh();

        $this->assertSame('1.1', $page->version);
        $this->assertSame('Scope', $page->sections_en[0]['heading']);
        $this->assertSame('2026-09-01', $page->effective_date->toDateString());
    }

    public function test_update_rejects_a_page_with_no_sections(): void
    {
        $page = $this->legalPage();
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->put("/admin/legal/{$page->id}", $this->payload(['sections_en' => []]))
            ->assertSessionHasErrors('sections_en');
    }

    public function test_update_rejects_a_section_body_that_is_not_a_list_of_paragraphs(): void
    {
        $page = $this->legalPage();
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->put("/admin/legal/{$page->id}", $this->payload([
                'sections_en' => [['heading' => 'Scope', 'body' => 'not-an-array']],
            ]))
            ->assertSessionHasErrors('sections_en.0.body');
    }

    public function test_the_slug_cannot_be_changed_through_the_admin_form(): void
    {
        $page = $this->legalPage();
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->put("/admin/legal/{$page->id}", $this->payload(['slug' => 'hijacked']));

        $this->assertSame('privacy', $page->refresh()->slug);
    }

    public function test_editors_cannot_manage_legal_pages(): void
    {
        $page = $this->legalPage();
        $editor = User::factory()->create(['role' => 'editor']);

        $this->actingAs($editor)->get('/admin/legal')->assertForbidden();
        $this->actingAs($editor)->put("/admin/legal/{$page->id}", $this->payload())->assertForbidden();
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $this->legalPage();

        $this->get('/admin/legal')->assertRedirect('/login');
    }
}
