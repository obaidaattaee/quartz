<?php

namespace Tests\Feature;

use App\Models\BlogPost;
use App\Models\LandingCaseStudy;
use App\Models\LandingFaq;
use App\Models\PortfolioItem;
use App\Models\SeoMetadata;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Models\User;
use App\Services\SettingsService;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\LaunchContentSyncSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LaunchContentSyncSeederTest extends TestCase
{
    use RefreshDatabase;

    /** Recreates the state a database seeded by the first build is in. */
    private function seedPreLaunchState(): void
    {
        $this->seed(DatabaseSeeder::class);

        // The first build seeded these from translation keys that no longer exist.
        foreach (['Ahmed Al-Rashid', 'Sarah Mitchell', 'Omar Hassan'] as $name) {
            Testimonial::create(['quote_en' => 'Great work.', 'quote_ar' => 'عمل رائع.', 'author_name_en' => $name, 'author_name_ar' => $name]);
        }

        foreach (['Ahmed Al-Fahad', 'Nora Al-Sheikh', 'Khalid Ibrahim', 'Lina Mansour'] as $name) {
            TeamMember::create(['name_en' => $name, 'name_ar' => $name, 'role_en' => 'Engineer', 'role_ar' => 'مهندس']);
        }

        Testimonial::query()->update(['is_visible' => true]);
        TeamMember::query()->update(['is_visible' => true]);
        PortfolioItem::query()->update(['status' => 'published']);
        BlogPost::query()->update(['status' => 'published']);
        LandingCaseStudy::query()->update(['is_visible' => true]);
        LandingFaq::query()->update(['is_visible' => true]);

        LandingFaq::where('question_en', 'like', 'Do you work with existing teams%')->first()
            ->replicate()->fill(['question_en' => 'Do you work with existing teams or only greenfield?'])->save();
        LandingCaseStudy::first()
            ->replicate()->fill(['headline_en' => 'Replaced 3 point-solutions with Quartz POS in 11 weeks.'])->save();

        SeoMetadata::updateOrCreate(['page_key' => 'home'], ['meta_title_en' => 'Quart - Transform your business']);
        SeoMetadata::updateOrCreate(['page_key' => 'about'], [
            'meta_title_en' => 'About Quart',
            'meta_description_en' => 'A team you can trust.',
        ]);

        SettingsService::setMany([
            'contact_email' => 'info@quartz.sa',
            'contact_phone' => '+966 5X XXX XXXX',
            'contact_address' => 'Riyadh, Saudi Arabia',
            'legal_governing_law' => '[GOVERNING LAW — TO BE SPECIFIED]',
            'legal_dispute_venue' => 'the courts of Wilmington, Delaware',
        ]);

        $this->assertSame(3, Testimonial::where('is_visible', true)->count());
        $this->assertSame(4, TeamMember::where('is_visible', true)->count());
        $this->assertTrue(BlogPost::where('slug', 'building-scalable-apis-laravel')->exists());
        $this->assertTrue(PortfolioItem::where('slug', 'ecommerce-platform-redesign')->exists());
    }

    public function test_it_hides_placeholder_content_and_removes_duplicates(): void
    {
        $this->seedPreLaunchState();
        $admin = User::where('role', 'admin')->first();
        $adminPassword = $admin?->password;

        $this->seed(LaunchContentSyncSeeder::class);

        $this->assertSame(0, Testimonial::whereIn('author_name_en', ['Ahmed Al-Rashid', 'Sarah Mitchell', 'Omar Hassan'])->where('is_visible', true)->count());
        $this->assertSame(0, TeamMember::where('name_en', 'Lina Mansour')->where('is_visible', true)->count());
        $this->assertSame('draft', PortfolioItem::where('slug', 'ecommerce-platform-redesign')->value('status'));
        $this->assertSame('draft', BlogPost::where('slug', 'building-scalable-apis-laravel')->value('status'));
        $this->assertSame(0, LandingCaseStudy::where('is_visible', true)->count());
        $this->assertSame(0, LandingCaseStudy::where('headline_en', 'like', '%11 weeks%')->count());
        $this->assertSame(0, LandingFaq::where('question_en', 'like', '%greenfield%')->count());
        $this->assertSame(0, LandingFaq::where('question_en', 'like', 'Is Quartz Cyber%')->where('is_visible', true)->count());

        $this->assertStringStartsWith('Quartz - ', SeoMetadata::where('page_key', 'home')->value('meta_title_en'));
        $about = SeoMetadata::where('page_key', 'about')->first();
        $this->assertNull($about->meta_title_en);
        $this->assertSame('A team you can trust.', $about->meta_description_en);

        $this->assertSame('info@quartz-solutions.net', SettingsService::get('contact_email'));
        $this->assertNull(SettingsService::get('contact_phone'));
        $this->assertNull(SettingsService::get('contact_address'));
        $this->assertNull(SettingsService::get('legal_governing_law'));
        $this->assertSame('the courts of Wilmington, Delaware', SettingsService::get('legal_dispute_venue'));

        $this->assertSame($adminPassword, $admin?->fresh()->password);
    }

    public function test_running_it_twice_changes_nothing_more(): void
    {
        $this->seedPreLaunchState();
        $this->seed(LaunchContentSyncSeeder::class);

        $counts = fn () => [LandingFaq::count(), LandingCaseStudy::count(), Testimonial::count(), PortfolioItem::count(), BlogPost::count()];
        $before = $counts();

        $this->seed(LaunchContentSyncSeeder::class);

        $this->assertSame($before, $counts());
    }

    public function test_it_leaves_real_content_published(): void
    {
        $this->seedPreLaunchState();
        $real = BlogPost::first()->replicate()->fill(['slug' => 'a-real-article', 'status' => 'published']);
        $real->save();

        $this->seed(LaunchContentSyncSeeder::class);

        $this->assertSame('published', $real->fresh()->status);
    }
}
