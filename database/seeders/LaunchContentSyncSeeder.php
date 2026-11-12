<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\LandingCaseStudy;
use App\Models\LandingFaq;
use App\Models\PortfolioItem;
use App\Models\SeoMetadata;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Services\SettingsService;
use Illuminate\Database\Seeder;

/**
 * Brings an existing (production) database in line with the launch content.
 *
 * The content seeders only upsert; they never hide the placeholder records an
 * older install already published, and the homepage seeder matches FAQs and
 * case studies by their English text, so re-running it after a copy change
 * leaves the old rows next to the new ones. This seeder runs the content
 * seeders and then cleans up exactly those records. It is idempotent, only
 * touches records it recognises, never deletes real content, and never
 * changes users or passwords.
 *
 *   php artisan db:seed --class=LaunchContentSyncSeeder --force
 */
class LaunchContentSyncSeeder extends Seeder
{
    /** Invented testimonials from the first build. */
    private const PLACEHOLDER_TESTIMONIAL_AUTHORS = ['Ahmed Al-Rashid', 'Sarah Mitchell', 'Omar Hassan'];

    /** Invented team members from the first build. */
    private const PLACEHOLDER_TEAM_MEMBERS = ['Ahmed Al-Fahad', 'Nora Al-Sheikh', 'Khalid Ibrahim', 'Lina Mansour'];

    /** Invented portfolio items, plus the company platform that is no longer marketed. */
    private const PLACEHOLDER_PORTFOLIO_SLUGS = [
        'ecommerce-platform-redesign',
        'devops-pipeline-automation',
        'security-audit-hardening',
        'quartz-pos-platform',
    ];

    /** Two-sentence stub articles. */
    private const STUB_BLOG_SLUGS = [
        'building-scalable-apis-laravel',
        'react-19-what-developers-need-to-know',
        'cicd-pipeline-automation-best-practices',
        'automated-testing-strategies-web-applications',
        'securing-laravel-application-common-threats',
        'typescript-best-practices-react-projects',
        'infrastructure-as-code-getting-started-terraform',
    ];

    /** Earlier English wording of homepage FAQs, superseded by LandingContentSeeder. */
    private const SUPERSEDED_FAQ_QUESTIONS = ['Do you work with existing teams or only greenfield?'];

    /** Every homepage case-study headline ever seeded; all are placeholders. */
    private const PLACEHOLDER_CASE_HEADLINES = [
        'Replaced 3 point-solutions with Quartz POS in 11 weeks.',
        'Replaced 3 point-solutions with Quartz POS with an agreed project scope.',
        'Phishing click-through cut from 31% to 6% in one quarter.',
        'Phishing click-through cut from 31% to 6%.',
        'Automated dispatch workflow saving 2,100 hrs/mo.',
    ];

    /** Superseded headlines whose rows are duplicates of the current ones. */
    private const SUPERSEDED_CASE_HEADLINES = [
        'Replaced 3 point-solutions with Quartz POS in 11 weeks.',
        'Phishing click-through cut from 31% to 6% in one quarter.',
    ];

    public function run(): void
    {
        $this->call([
            ServicePageContentSeeder::class,
            IndustryContentSeeder::class,
            LandingContentSeeder::class,
            LegalPageSeeder::class,
        ]);

        $this->hidePlaceholderContent();
        $this->removeSupersededHomepageRows();
        $this->fixSeoOverrides();
        $this->fixSiteSettings();
    }

    private function hidePlaceholderContent(): void
    {
        $this->report('Testimonials hidden', Testimonial::whereIn('author_name_en', self::PLACEHOLDER_TESTIMONIAL_AUTHORS)
            ->where('is_visible', true)->update(['is_visible' => false]));

        $this->report('Team members hidden', TeamMember::whereIn('name_en', self::PLACEHOLDER_TEAM_MEMBERS)
            ->where('is_visible', true)->update(['is_visible' => false]));

        $this->report('Portfolio items set to draft', PortfolioItem::whereIn('slug', self::PLACEHOLDER_PORTFOLIO_SLUGS)
            ->where('status', '!=', 'draft')->update(['status' => 'draft']));

        // The POS item once carried the English label as its category, which
        // produced a duplicate "Software Development" filter on /portfolio.
        PortfolioItem::where('service_category', 'Software Development')->update(['service_category' => 'development']);

        $this->report('Blog stubs set to draft', BlogPost::whereIn('slug', self::STUB_BLOG_SLUGS)
            ->where('status', '!=', 'draft')->update(['status' => 'draft']));

        $this->report('Case studies hidden', LandingCaseStudy::whereIn('headline_en', self::PLACEHOLDER_CASE_HEADLINES)
            ->where('is_visible', true)->update(['is_visible' => false]));

        $this->report('Product FAQ hidden', LandingFaq::where('question_en', 'like', 'Is Quartz Cyber%')
            ->where('is_visible', true)->update(['is_visible' => false]));
    }

    private function removeSupersededHomepageRows(): void
    {
        $this->report('Superseded FAQs removed', LandingFaq::whereIn('question_en', self::SUPERSEDED_FAQ_QUESTIONS)->delete());

        $this->report('Superseded case studies removed', LandingCaseStudy::whereIn('headline_en', self::SUPERSEDED_CASE_HEADLINES)->delete());
    }

    private function fixSeoOverrides(): void
    {
        $home = SeoMetadata::where('page_key', 'home')->first();

        if ($home) {
            $home->update([
                'meta_title_en' => 'Quartz - Software Development, Automation & Cybersecurity',
                'meta_title_ar' => 'كوارتز - تطوير البرمجيات والأتمتة والأمن السيبراني',
                'meta_description_en' => 'Quartz builds, tests, secures and automates software for clients worldwide, mostly in the US and Europe. 13+ live websites and products serving 500K+ users.',
                'meta_description_ar' => 'تبني كوارتز البرمجيات وتختبرها وتؤمّنها وتؤتمتها لعملاء حول العالم، أغلبهم في الولايات المتحدة وأوروبا. أكثر من 13 موقعاً ومنتجاً قيد التشغيل تخدم أكثر من 500 ألف مستخدم.',
            ]);
        }

        // Any other override still carrying the old misspelt brand or the old
        // Gulf positioning falls back to the current SeoService defaults.
        $outdated = '/\bQuart\b|كوارت(?!ز)|Gulf|الخليج|Transform your business|حوّل عملك/u';

        foreach (SeoMetadata::where('page_key', '!=', 'home')->get() as $meta) {
            $changes = [];

            foreach (['meta_title_en', 'meta_title_ar', 'meta_description_en', 'meta_description_ar'] as $field) {
                if (is_string($meta->{$field}) && preg_match($outdated, $meta->{$field})) {
                    $changes[$field] = null;
                }
            }

            if ($changes) {
                $meta->update($changes);
            }
        }
    }

    private function fixSiteSettings(): void
    {
        $placeholder = '/TO BE SPECIFIED|Riyadh|الرياض|XXX/u';
        $updates = [];

        foreach ([
            'contact_phone',
            'contact_whatsapp',
            'contact_address',
            'legal_registered_address',
            'legal_governing_law',
            'legal_dispute_venue',
            'legal_liability_cap',
        ] as $key) {
            $value = SettingsService::get($key);

            if (is_string($value) && preg_match($placeholder, $value)) {
                $updates[$key] = null;
            }
        }

        if (SettingsService::get('contact_email') === 'info@quartz.sa') {
            $updates['contact_email'] = 'info@quartz-solutions.net';
        }

        if ($updates) {
            SettingsService::setMany($updates);
        }

        $this->report('Settings cleared or corrected', count($updates));
    }

    private function report(string $label, int $count): void
    {
        $this->command?->info(sprintf('%s: %d', $label, $count));
    }
}
