<?php

namespace Tests\Feature\Admin;

use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class TeamMemberVisibilityTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function payload(array $overrides = []): array
    {
        return array_merge([
            'name_en' => 'Sara',
            'name_ar' => 'سارة',
            'role_en' => 'Engineer',
            'role_ar' => 'مهندسة',
            'bio_en' => null,
            'bio_ar' => null,
            'photo_id' => null,
        ], $overrides);
    }

    private function member(bool $visible = true): TeamMember
    {
        return TeamMember::create($this->payload(['sort_order' => 1, 'is_visible' => $visible]));
    }

    public function test_admin_can_create_a_hidden_member(): void
    {
        $this->actingAs($this->admin())
            ->post('/admin/team', $this->payload(['is_visible' => false]))
            ->assertRedirect('/admin/team');

        $this->assertFalse(TeamMember::firstOrFail()->is_visible);
    }

    public function test_new_members_are_visible_by_default(): void
    {
        $this->actingAs($this->admin())
            ->post('/admin/team', $this->payload())
            ->assertRedirect('/admin/team');

        $this->assertTrue(TeamMember::firstOrFail()->is_visible);
    }

    public function test_admin_can_toggle_visibility_and_the_about_page_follows(): void
    {
        $member = $this->member(visible: false);
        $admin = $this->admin();

        $this->get('/en/about')->assertInertia(
            fn (AssertableInertia $page) => $page->has('teamMembers', 0)
        );

        $this->actingAs($admin)
            ->put("/admin/team/{$member->id}", $this->payload(['is_visible' => true]))
            ->assertRedirect('/admin/team');

        $this->assertTrue($member->fresh()->is_visible);
        $this->get('/en/about')->assertInertia(
            fn (AssertableInertia $page) => $page->has('teamMembers', 1)
        );

        $this->actingAs($admin)
            ->put("/admin/team/{$member->id}", $this->payload(['is_visible' => false]))
            ->assertRedirect('/admin/team');

        $this->assertFalse($member->fresh()->is_visible);
    }

    public function test_visibility_must_be_boolean(): void
    {
        $member = $this->member();

        $this->actingAs($this->admin())
            ->put("/admin/team/{$member->id}", $this->payload(['is_visible' => 'sometimes']))
            ->assertSessionHasErrors('is_visible');
    }

    public function test_index_and_edit_expose_visibility(): void
    {
        $member = $this->member(visible: false);
        $admin = $this->admin();

        $this->actingAs($admin)->get('/admin/team')->assertInertia(
            fn (AssertableInertia $page) => $page
                ->component('admin/team/index')
                ->where('members.0.is_visible', false)
        );

        $this->actingAs($admin)->get("/admin/team/{$member->id}/edit")->assertInertia(
            fn (AssertableInertia $page) => $page->where('member.is_visible', false)
        );
    }

    public function test_admin_can_delete_a_member(): void
    {
        $member = $this->member();

        $this->actingAs($this->admin())
            ->delete("/admin/team/{$member->id}")
            ->assertRedirect('/admin/team');

        $this->assertModelMissing($member);
    }
}
