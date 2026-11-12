<?php

namespace Tests\Feature;

use Database\Seeders\IndustryContentSeeder;
use Database\Seeders\LandingContentSeeder;
use Database\Seeders\ServicePageContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class WorldwideCopyTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_content_and_translations_do_not_position_quartz_in_the_gulf(): void
    {
        $this->withoutVite();
        $this->seed([LandingContentSeeder::class, ServicePageContentSeeder::class, IndustryContentSeeder::class]);
        $banned = '/Gulf|الخليج|Saudi|السعود|Riyadh|الرياض|KSA|NCA ECC|SAMA|PDPL|NPHIES|Nafath|نفاذ|Absher|أبشر|UAE Pass|Noor|Etimad|DGA|mada|\\bSAR\\b|ريال|Book a Call|احجز مكالمة|Live product|منتج حي/iu';

        foreach (['en', 'ar'] as $locale) {
            foreach (['', '/services', '/industries', '/services/development', '/services/web-development', '/services/mobile-apps', '/services/automation', '/services/qa', '/services/cybersecurity', '/industries/retail-pos', '/industries/healthcare', '/industries/financial-services', '/industries/government', '/industries/education'] as $path) {
                $response = $this->get("/{$locale}{$path}")->assertOk();
                $props = $response->viewData('page')['props'];
                $this->assertDoesNotMatchRegularExpression($banned, json_encode($props, JSON_UNESCAPED_UNICODE), "{$locale}{$path}");
            }
        }
    }

    public function test_contact_errors_use_human_messages_in_both_languages(): void
    {
        foreach ([
            'en' => ['Enter your name.', 'Enter a valid email address, such as name@company.com.', 'Choose a service, or select General Inquiry.', 'Please write at least 10 characters.'],
            'ar' => ['أدخل اسمك.', 'أدخل بريداً إلكترونياً صالحاً، مثل name@company.com.', 'اختر خدمة، أو اختر «استفسار عام».', 'اكتب رسالة من 10 أحرف على الأقل.'],
        ] as $locale => $messages) {
            $this->from("/{$locale}/contact")->post("/{$locale}/contact", [
                'name' => '', 'email' => 'invalid', 'service' => '', 'message' => 'tiny', '_honeypot' => '',
            ])->assertSessionHasErrors(array_combine(['name', 'email', 'service', 'message'], $messages));
        }
    }

    public function test_offer_context_is_trimmed_and_keeps_the_original_specialism(): void
    {
        $this->withoutVite();
        $topic = str_repeat('A', 140);
        $this->get('/en/contact?service=development&from=%20web-development%20&topic='.urlencode('  '.$topic.'  '))
            ->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->where('preselectedService', 'development')
            ->where('topic', str_repeat('A', 120))
            ->where('from', 'web-development'));
        $this->get('/ar/contact?topic[]=invalid&from=unrecognised')->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->where('topic', null)->where('from', null));
    }

    public function test_standards_describe_project_requirements_and_keep_client_signoff(): void
    {
        $requirements = [
            'retail-pos' => ['PCI DSS', 'EN 16931', 'Peppol', 'GDPR', 'CCPA', 'WCAG'],
            'healthcare' => ['HIPAA', 'GDPR', 'HL7 FHIR'],
            'financial-services' => ['PCI DSS', 'SOC 2', 'PSD2', 'DORA', 'KYC', 'AML', 'GDPR'],
            'government' => ['WCAG 2.2 AA', 'Section 508', 'SAML', 'OpenID Connect'],
            'education' => ['FERPA', 'COPPA', 'GDPR', 'LTI', 'xAPI', 'WCAG'],
        ];

        foreach (IndustryContentSeeder::content() as $slug => $content) {
            foreach (['en', 'ar'] as $locale) {
                $copy = json_encode($content[$locale]['compliance'], JSON_UNESCAPED_UNICODE);
                foreach ($requirements[$slug] as $standard) {
                    $this->assertStringContainsString($standard, $copy, "{$locale} {$slug}");
                }
                $this->assertLessThanOrEqual(1, substr_count($copy, 'ZATCA'));
                $this->assertStringContainsString($locale === 'en' ? 'final sign-off' : 'الاعتماد النهائي', $content[$locale]['compliance_note']);
            }
        }
    }

    public function test_arabic_titles_and_rss_metadata_use_the_arabic_brand(): void
    {
        $this->withoutVite();
        foreach (['about', 'contact', 'services', 'industries', 'faq', 'blog', 'portfolio'] as $page) {
            $this->get('/ar/'.$page)->assertOk()->assertInertia(fn (AssertableInertia $props) => $props
                ->where('seo.title', fn ($title) => str_ends_with($title, ' | كوارتز')));
        }
        $this->get('/ar/feed.xml')->assertOk()->assertSee('مدوّنة كوارتز')->assertSee('أحدث مقالات كوارتز وأدلتها العملية');
        $this->get('/en/feed.xml')->assertOk()->assertSee('Quartz Blog')->assertSee('Latest articles and practical guides from Quartz');
    }
}
