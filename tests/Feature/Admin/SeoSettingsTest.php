<?php

namespace Tests\Feature\Admin;

use App\Models\SeoMetadata;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class SeoSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_sends_the_shape_the_page_expects(): void
    {
        SeoMetadata::create(['page_key' => 'about', 'meta_title_en' => 'About Quartz']);

        $this->actingAs(User::factory()->create(['role' => 'admin']))
            ->get('/admin/seo')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('admin/seo/index')
                ->where('seoData.about.meta_title_en', 'About Quartz')
                ->where('pageKeys.0', ['key' => 'home', 'label' => 'Home'])
            );
    }

    public function test_update_saves_pages_using_public_page_keys(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']))
            ->put('/admin/seo', [
                'pages' => [
                    'about' => ['meta_title_en' => 'About Quartz', 'meta_title_ar' => '', 'meta_description_en' => '', 'meta_description_ar' => '', 'og_image_id' => null],
                    'services.development' => ['meta_title_en' => 'Custom software', 'meta_title_ar' => '', 'meta_description_en' => '', 'meta_description_ar' => '', 'og_image_id' => null],
                    'contact' => ['meta_title_en' => '', 'meta_title_ar' => '', 'meta_description_en' => '', 'meta_description_ar' => '', 'og_image_id' => null],
                    'not-a-page' => ['meta_title_en' => 'Ignored'],
                ],
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect();

        $this->assertSame('About Quartz', SeoMetadata::where('page_key', 'about')->value('meta_title_en'));
        $this->assertSame('Custom software', SeoMetadata::where('page_key', 'services.development')->value('meta_title_en'));
        $this->assertDatabaseMissing('seo_metadata', ['page_key' => 'contact']);
        $this->assertDatabaseMissing('seo_metadata', ['page_key' => 'not-a-page']);
    }

    public function test_titles_are_length_limited(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'admin']))
            ->put('/admin/seo', ['pages' => ['about' => ['meta_title_en' => str_repeat('a', 71)]]])
            ->assertSessionHasErrors('pages.about.meta_title_en');
    }
}
