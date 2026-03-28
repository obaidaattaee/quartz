<?php

namespace Database\Seeders;

use App\Models\ServicePage;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ContentSeeder extends Seeder
{
    /**
     * Seed content from Phase 2 JSON translation files into database tables.
     */
    public function run(): void
    {
        $en = $this->loadTranslations('en');
        $ar = $this->loadTranslations('ar');

        $this->seedTestimonials($en, $ar);
        $this->seedServicePages($en, $ar);
        $this->seedTeamMembers($en, $ar);
        $this->seedAdminUser();
    }

    /**
     * Load flat JSON translation file.
     *
     * @return array<string, string>
     */
    private function loadTranslations(string $locale): array
    {
        $path = lang_path("{$locale}.json");

        if (! file_exists($path)) {
            return [];
        }

        return json_decode(file_get_contents($path), true) ?? [];
    }

    /**
     * Seed testimonials from translation keys.
     *
     * Keys: testimonials.{N}.quote, .name, .company, .role
     */
    private function seedTestimonials(array $en, array $ar): void
    {
        $index = 0;

        while (isset($en["testimonials.{$index}.quote"])) {
            Testimonial::updateOrCreate(
                ['sort_order' => $index],
                [
                    'quote_en' => $en["testimonials.{$index}.quote"] ?? '',
                    'quote_ar' => $ar["testimonials.{$index}.quote"] ?? '',
                    'author_name_en' => $en["testimonials.{$index}.name"] ?? '',
                    'author_name_ar' => $ar["testimonials.{$index}.name"] ?? '',
                    'author_title_en' => $en["testimonials.{$index}.role"] ?? '',
                    'author_title_ar' => $ar["testimonials.{$index}.role"] ?? '',
                    'company_en' => $en["testimonials.{$index}.company"] ?? '',
                    'company_ar' => $ar["testimonials.{$index}.company"] ?? '',
                    'is_visible' => true,
                ]
            );
            $index++;
        }
    }

    /**
     * Seed service pages from translation keys.
     *
     * Keys: services.{slug}.hero.title, .hero.subtitle, .problem.title,
     *       .problem.description, .approach.title, .approach.description,
     *       .step{N}.title, .step{N}.description, .deliverables.{N}, .cta
     */
    private function seedServicePages(array $en, array $ar): void
    {
        $services = ['development', 'automation', 'qa', 'cybersecurity'];

        foreach ($services as $slug) {
            $processStepsEn = [];
            $processStepsAr = [];

            for ($i = 1; $i <= 4; $i++) {
                $titleKeyEn = "services.{$slug}.step{$i}.title";
                $descKeyEn = "services.{$slug}.step{$i}.description";

                if (isset($en[$titleKeyEn])) {
                    $processStepsEn[] = [
                        'title' => $en[$titleKeyEn],
                        'description' => $en[$descKeyEn] ?? '',
                    ];
                    $processStepsAr[] = [
                        'title' => $ar[$titleKeyEn] ?? '',
                        'description' => $ar[$descKeyEn] ?? '',
                    ];
                }
            }

            $deliverablesEn = [];
            $deliverablesAr = [];
            $delIndex = 0;

            while (isset($en["services.{$slug}.deliverables.{$delIndex}"])) {
                $deliverablesEn[] = $en["services.{$slug}.deliverables.{$delIndex}"];
                $deliverablesAr[] = $ar["services.{$slug}.deliverables.{$delIndex}"] ?? '';
                $delIndex++;
            }

            ServicePage::updateOrCreate(
                ['slug' => $slug],
                [
                    'title_en' => $en["services.{$slug}.hero.title"] ?? '',
                    'title_ar' => $ar["services.{$slug}.hero.title"] ?? '',
                    'subtitle_en' => $en["services.{$slug}.hero.subtitle"] ?? '',
                    'subtitle_ar' => $ar["services.{$slug}.hero.subtitle"] ?? '',
                    'problem_en' => $en["services.{$slug}.problem.description"] ?? '',
                    'problem_ar' => $ar["services.{$slug}.problem.description"] ?? '',
                    'approach_en' => $en["services.{$slug}.approach.description"] ?? '',
                    'approach_ar' => $ar["services.{$slug}.approach.description"] ?? '',
                    'process_steps_en' => $processStepsEn,
                    'process_steps_ar' => $processStepsAr,
                    'deliverables_en' => $deliverablesEn,
                    'deliverables_ar' => $deliverablesAr,
                    'cta_text_en' => $en["services.{$slug}.cta"] ?? '',
                    'cta_text_ar' => $ar["services.{$slug}.cta"] ?? '',
                ]
            );
        }
    }

    /**
     * Seed team members from translation keys.
     *
     * Keys: about.team.{N}.name, .role, .bio
     */
    private function seedTeamMembers(array $en, array $ar): void
    {
        $index = 0;

        while (isset($en["about.team.{$index}.name"])) {
            TeamMember::updateOrCreate(
                ['sort_order' => $index],
                [
                    'name_en' => $en["about.team.{$index}.name"] ?? '',
                    'name_ar' => $ar["about.team.{$index}.name"] ?? '',
                    'role_en' => $en["about.team.{$index}.role"] ?? '',
                    'role_ar' => $ar["about.team.{$index}.role"] ?? '',
                    'bio_en' => $en["about.team.{$index}.bio"] ?? '',
                    'bio_ar' => $ar["about.team.{$index}.bio"] ?? '',
                ]
            );
            $index++;
        }
    }

    /**
     * Seed default admin user.
     */
    private function seedAdminUser(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@quart.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );
    }
}
