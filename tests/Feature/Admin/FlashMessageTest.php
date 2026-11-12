<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class FlashMessageTest extends TestCase
{
    use RefreshDatabase;

    public function test_success_flash_from_a_redirect_reaches_the_page(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']))
            ->withSession(['success' => 'Settings updated.'])
            ->get('/admin/settings')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('flash.success', 'Settings updated.')
                ->where('flash.error', null)
            );
    }

    public function test_error_flash_reaches_the_page(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']))
            ->withSession(['error' => 'Cannot delete your own account.'])
            ->get('/admin/users')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('flash.error', 'Cannot delete your own account.')
            );
    }

    public function test_flash_is_empty_without_a_message(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']))
            ->get('/admin')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('flash.success', null)
                ->where('flash.error', null)
            );
    }
}
