<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class ContactPreselectTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, array{string, string|null}>
     */
    public static function services(): array
    {
        return [
            'development' => ['development', 'development'],
            'automation' => ['automation', 'automation'],
            'qa' => ['qa', 'qa'],
            'cybersecurity' => ['cybersecurity', 'cybersecurity'],
            'web maps to development' => ['web-development', 'development'],
            'mobile maps to development' => ['mobile-apps', 'development'],
            'case-insensitive' => ['QA', 'qa'],
            'unknown is ignored' => ['blockchain', null],
        ];
    }

    #[DataProvider('services')]
    public function test_service_query_preselects_the_contact_option(string $query, ?string $expected): void
    {
        foreach (['en', 'ar'] as $locale) {
            $this->get("/{$locale}/contact?service={$query}")
                ->assertOk()
                ->assertInertia(fn (AssertableInertia $page) => $page
                    ->component('public/contact')
                    ->where('preselectedService', $expected)
                );
        }
    }

    public function test_contact_without_query_has_no_preselection(): void
    {
        $this->get('/en/contact')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('preselectedService', null)
            );
    }
}
