<?php

namespace App\Http\Controllers;

use App\Models\Industry;
use App\Models\ServicePage;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class IndustryController extends Controller
{
    /**
     * Services an industry page may link to or preselect on the contact form.
     *
     * @var list<string>
     */
    public const SERVICES = ServiceController::ORDER;

    /**
     * Display the industries index.
     */
    public function index(string $locale): Response
    {
        $services = self::serviceTitles($locale);

        $industries = Industry::visible()
            ->ordered()
            ->get()
            ->map(fn (Industry $industry) => [
                'slug' => $industry->slug,
                'title' => $industry->{"title_{$locale}"},
                'summary' => $industry->{"summary_{$locale}"} ?: $industry->{"hero_blurb_{$locale}"},
                'solutions' => self::solutions($industry, $locale, $services),
                'compliance' => array_values(array_map(
                    fn (array $item) => $item['name'] ?? '',
                    self::list($industry, 'compliance_items', $locale),
                )),
            ]);

        $title = $locale === 'ar' ? 'القطاعات' : 'Industries';
        $description = $locale === 'ar'
            ? 'برمجيات مبنية على واقع قطاعك: التجزئة ونقاط البيع، والرعاية الصحية، والخدمات المالية، والقطاع الحكومي، والتعليم. اعرف ما نبنيه لكل قطاع والمتطلبات التي نصمّم وفقها.'
            : 'Software built around how your sector works: retail and point of sale, healthcare, financial services, government and education. See what we build for each and the rules we design for.';
        $seo = SeoService::forStaticPage('industries', $locale, $title, "/{$locale}/industries", $description);

        return Inertia::render('public/industries/index', [
            'industries' => $industries,
            'disciplines' => self::disciplines($services),
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Display one industry page.
     */
    public function show(string $locale, string $slug): Response
    {
        $industry = Industry::visible()
            ->where('slug', $slug)
            ->firstOrFail();

        $data = self::localized($industry, $locale);

        $seo = SeoService::forStaticPage(
            "industries.{$slug}",
            $locale,
            $data['title'],
            "/{$locale}/industries/{$slug}",
            $data['summary'] ?: $data['lead'],
        );

        $others = Industry::visible()
            ->ordered()
            ->where('id', '!=', $industry->id)
            ->get()
            ->map(fn (Industry $other) => [
                'slug' => $other->slug,
                'title' => $other->{"title_{$locale}"},
                'summary' => $other->{"summary_{$locale}"} ?: $other->{"hero_blurb_{$locale}"},
            ]);

        return Inertia::render('public/industries/show', [
            'industry' => $data,
            'others' => $others,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Flatten one industry row into the shape the page renders, so the
     * frontend never picks columns by locale itself.
     *
     * @return array<string, mixed>
     */
    public static function localized(Industry $industry, string $locale): array
    {
        $services = self::serviceTitles($locale);
        $primary = in_array($industry->primary_service, self::SERVICES, true)
            ? $industry->primary_service
            : null;

        return [
            'slug' => $industry->slug,
            'title' => $industry->{"title_{$locale}"},
            'tagline' => $industry->{"tagline_{$locale}"} ?: $industry->{"title_{$locale}"},
            'lead' => $industry->{"hero_blurb_{$locale}"},
            'summary' => $industry->{"summary_{$locale}"},
            'audience' => $industry->{"audience_{$locale}"},
            'primary_service' => $primary,
            'realities' => array_values(array_map(
                fn (array $item) => [
                    'title' => $item['title'] ?? '',
                    'description' => $item['description'] ?? '',
                ],
                self::list($industry, 'challenges', $locale),
            )),
            'solutions' => self::solutions($industry, $locale, $services),
            'compliance_note' => $industry->{"compliance_note_{$locale}"},
            'compliance' => self::list($industry, 'compliance_items', $locale),
            'examples' => self::list($industry, 'examples', $locale),
            'faqs' => self::list($industry, 'faqs', $locale),
            'cta' => $industry->{"cta_text_{$locale}"},
        ];
    }

    /**
     * A JSON list column for one locale, without empty rows.
     *
     * @return list<array<string, mixed>>
     */
    private static function list(Industry $industry, string $field, string $locale): array
    {
        return array_values(array_filter(
            $industry->{"{$field}_{$locale}"} ?? [],
            fn ($item) => is_array($item) && array_filter($item) !== [],
        ));
    }

    /**
     * Solutions with the linked service resolved to its title. The service
     * is null when the row names no known service; the title is null when
     * that service has no row yet (the page falls back to a static label).
     *
     * @param  array<string, string>  $services
     * @return list<array<string, mixed>>
     */
    private static function solutions(Industry $industry, string $locale, array $services): array
    {
        return array_map(function (array $item) use ($services) {
            $service = $item['service'] ?? null;
            $known = in_array($service, self::SERVICES, true);

            return [
                'title' => $item['title'] ?? '',
                'description' => $item['description'] ?? '',
                'service' => $known ? $service : null,
                'service_title' => $known ? ($services[$service] ?? null) : null,
            ];
        }, self::list($industry, 'solutions', $locale));
    }

    /**
     * Localised service titles keyed by slug, in the site's display order.
     *
     * @return array<string, string>
     */
    private static function serviceTitles(string $locale): array
    {
        $titles = ServicePage::whereIn('slug', self::SERVICES)
            ->pluck("title_{$locale}", 'slug')
            ->all();

        $ordered = [];

        foreach (self::SERVICES as $slug) {
            if (isset($titles[$slug])) {
                $ordered[$slug] = $titles[$slug];
            }
        }

        return $ordered;
    }

    /**
     * The four disciplines used by the index matrix, each with the service
     * slugs it groups (web and mobile sit under development).
     *
     * @param  array<string, string>  $services
     * @return list<array{slug: string, title: ?string, services: list<string>}>
     */
    private static function disciplines(array $services): array
    {
        $groups = [
            'development' => ['development', 'web-development', 'mobile-apps'],
            'automation' => ['automation'],
            'qa' => ['qa'],
            'cybersecurity' => ['cybersecurity'],
        ];

        $disciplines = [];

        foreach ($groups as $slug => $members) {
            $disciplines[] = ['slug' => $slug, 'title' => $services[$slug] ?? null, 'services' => $members];
        }

        return $disciplines;
    }
}
