<?php

namespace Tests\Feature\Admin;

use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_metrics_separate_live_content_from_totals(): void
    {
        foreach ([true, false, false] as $i => $visible) {
            TeamMember::create([
                'name_en' => "Member {$i}",
                'name_ar' => "عضو {$i}",
                'role_en' => 'Role',
                'role_ar' => 'دور',
                'sort_order' => $i,
                'is_visible' => $visible,
            ]);
        }

        foreach ([true, false] as $i => $visible) {
            Testimonial::create([
                'quote_en' => 'Great',
                'quote_ar' => 'رائع',
                'author_name_en' => "Author {$i}",
                'author_name_ar' => "كاتب {$i}",
                'sort_order' => $i,
                'is_visible' => $visible,
            ]);
        }

        $this->actingAs(User::factory()->create(['role' => 'admin']))
            ->get('/admin')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('admin/dashboard')
                ->where('metrics.team_members', 3)
                ->where('metrics.visible_team_members', 1)
                ->where('metrics.testimonials', 2)
                ->where('metrics.visible_testimonials', 1)
                ->where('metrics.portfolio_items', 0)
                ->where('metrics.published_portfolio_items', 0)
            );
    }
}
