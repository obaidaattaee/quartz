<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminSeederTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::where('email', 'admin@quartz.com')->firstOrFail();
    }

    public function test_it_creates_the_admin_with_the_dev_password_in_testing(): void
    {
        config(['app.admin_seed_password' => null]);

        $this->seed(ContentSeeder::class);

        $this->assertSame('admin', $this->admin()->role);
        $this->assertTrue(Hash::check('password', $this->admin()->password));
    }

    public function test_it_uses_the_configured_seed_password(): void
    {
        config(['app.admin_seed_password' => 'a-strong-seed-secret']);

        $this->seed(ContentSeeder::class);

        $this->assertTrue(Hash::check('a-strong-seed-secret', $this->admin()->password));
    }

    public function test_it_generates_a_random_password_outside_local_and_testing(): void
    {
        config(['app.admin_seed_password' => null]);
        $this->app['env'] = 'production';

        try {
            // Called directly: db:seed would stop at its production prompt.
            $this->app->make(ContentSeeder::class)->run();
        } finally {
            $this->app['env'] = 'testing';
        }

        $this->assertFalse(Hash::check('password', $this->admin()->password));
    }

    public function test_reseeding_never_overwrites_an_existing_admin(): void
    {
        User::factory()->create([
            'email' => 'admin@quartz.com',
            'password' => Hash::make('changed-by-the-owner'),
            'role' => 'admin',
        ]);
        config(['app.admin_seed_password' => 'a-strong-seed-secret']);

        $this->seed(ContentSeeder::class);

        $this->assertSame(1, User::where('email', 'admin@quartz.com')->count());
        $this->assertTrue(Hash::check('changed-by-the-owner', $this->admin()->password));
    }
}
