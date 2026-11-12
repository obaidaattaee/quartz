<?php

namespace Tests\Feature;

use App\Models\LandingCaseStudy;
use App\Models\LandingFaq;
use App\Models\TeamMember;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class PublicContentAuditTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }

    public function test_unknown_arabic_url_renders_a_localized_404(): void
    {
        $response = $this->get('/ar/this-page-does-not-exist');

        $response->assertNotFound();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('errors/404')
            ->where('locale', 'ar')
            ->where('direction', 'rtl')
            ->where('translations', fn ($translations) => $translations['error.404.title'] === 'الصفحة غير موجودة')
        );

        $html = $response->getContent();
        $this->assertStringContainsString('lang="ar"', $html);
        $this->assertStringContainsString('dir="rtl"', $html);
        $this->assertSame(1, substr_count($html, '<title'));
        $this->assertStringContainsString('<title data-inertia="">الصفحة غير موجودة | كوارتز</title>', $html);
        $this->assertStringContainsString('name="robots" content="noindex"', $html);
    }

    public function test_static_pages_render_one_server_title_and_a_meta_description(): void
    {
        foreach (['/ar/about', '/en/about', '/ar/faq', '/en/contact', '/ar/portfolio', '/en/blog'] as $url) {
            $html = $this->get($url)->assertOk()->getContent();

            $this->assertSame(1, substr_count($html, '<title'), $url);
            $this->assertDoesNotMatchRegularExpression('#<title[^>]*>Quartz</title>#', $html, $url);
            $this->assertMatchesRegularExpression('#<meta name="description" content="[^"]+"#u', $html, $url);
        }

        $this->assertStringContainsString(
            '<title data-inertia="">عن كوارتز | كوارتز</title>',
            $this->get('/ar/about')->getContent(),
        );
    }

    public function test_hidden_team_members_case_studies_and_faqs_are_not_rendered(): void
    {
        TeamMember::create([
            'name_en' => 'Placeholder Person', 'name_ar' => 'شخص',
            'role_en' => 'Role', 'role_ar' => 'دور',
            'bio_en' => 'Bio', 'bio_ar' => 'نبذة',
            'sort_order' => 0, 'is_visible' => false,
        ]);
        LandingCaseStudy::create([
            'tag_en' => 'T', 'tag_ar' => 'T', 'client_en' => 'Fake Client', 'client_ar' => 'عميل',
            'headline_en' => 'H', 'headline_ar' => 'H', 'metric' => '1',
            'metric_label_en' => 'm', 'metric_label_ar' => 'm',
            'sort_order' => 0, 'is_visible' => false,
        ]);
        LandingFaq::create([
            'question_en' => 'Hidden?', 'question_ar' => 'مخفي؟',
            'answer_en' => 'Yes', 'answer_ar' => 'نعم',
            'sort_order' => 0, 'is_visible' => false,
        ]);

        $this->get('/en/about')->assertInertia(fn (AssertableInertia $page) => $page
            ->has('teamMembers', 0)
        );

        $this->get('/en')->assertInertia(fn (AssertableInertia $page) => $page
            ->has('landing.cases', 0)
            ->has('landing.faqs', 0)
        );
    }

    public function test_contact_validation_messages_are_arabic_on_arabic_pages(): void
    {
        $response = $this->from('/ar/contact')->post('/ar/contact', [
            'name' => '',
            'email' => '',
            'service' => '',
            'message' => '',
            '_honeypot' => '',
        ]);

        $response->assertSessionHasErrors([
            'service' => 'اختر خدمة، أو اختر «استفسار عام».',
            'email' => 'أدخل بريدك الإلكتروني.',
            'name' => 'أدخل اسمك.',
        ]);
    }
}
