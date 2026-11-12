<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Services\LegalContentService;
use App\Services\SettingsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LegalDetailsSettingsTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_save_the_company_details_used_by_the_legal_pages(): void
    {
        $this->actingAs($this->admin())
            ->put('/admin/settings', [
                'legal_entity_name' => 'Quartz Solutions LLC',
                'legal_registered_address' => '1 Example Street, Wilmington, DE 19801, USA',
                'legal_privacy_email' => 'privacy@quartz-solutions.net',
                'legal_contact_email' => 'legal@quartz-solutions.net',
                'legal_governing_law' => 'the laws of the State of Delaware, USA',
                'legal_dispute_venue' => 'the courts of Wilmington, Delaware',
                'legal_liability_cap' => 'the fees paid in the 12 months before the claim',
            ])
            ->assertRedirect('/admin/settings')
            ->assertSessionHas('success');

        $tokens = LegalContentService::tokens();

        $this->assertSame('Quartz Solutions LLC', $tokens['company']);
        $this->assertSame('1 Example Street, Wilmington, DE 19801, USA', $tokens['registered_address']);
        $this->assertSame('the laws of the State of Delaware, USA', $tokens['governing_law']);
        $this->assertSame('the courts of Wilmington, Delaware', $tokens['dispute_venue']);
        $this->assertSame('the fees paid in the 12 months before the claim', $tokens['liability_cap']);
    }

    public function test_empty_details_fall_back_to_a_visible_marker_instead_of_blank_text(): void
    {
        SettingsService::setMany([
            'contact_address' => null,
            'legal_registered_address' => null,
            'legal_governing_law' => null,
            'legal_dispute_venue' => null,
            'legal_liability_cap' => null,
        ]);

        $tokens = LegalContentService::tokens();

        $this->assertSame('[REGISTERED ADDRESS — TO BE SPECIFIED]', $tokens['registered_address']);
        $this->assertSame('[GOVERNING LAW — TO BE SPECIFIED]', $tokens['governing_law']);
        $this->assertSame('[DISPUTE VENUE — TO BE SPECIFIED]', $tokens['dispute_venue']);
        $this->assertSame('[LIABILITY CAP — TO BE SPECIFIED]', $tokens['liability_cap']);
    }

    public function test_legal_emails_must_be_valid(): void
    {
        $this->actingAs($this->admin())
            ->put('/admin/settings', ['legal_privacy_email' => 'not-an-email'])
            ->assertSessionHasErrors('legal_privacy_email');
    }

    public function test_editors_cannot_change_the_legal_details(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'editor']))
            ->put('/admin/settings', ['legal_governing_law' => 'anything'])
            ->assertForbidden();
    }
}
