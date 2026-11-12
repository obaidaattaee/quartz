<?php

namespace App\Http\Controllers;

use App\Models\ServicePage;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display order: the two lead services first, then the specialisms
     * that sit under development, then the supporting services.
     *
     * @var list<string>
     */
    public const ORDER = ['development', 'automation', 'web-development', 'mobile-apps', 'qa', 'cybersecurity'];

    /**
     * Services shown under "Related services" on each detail page.
     *
     * @var array<string, list<string>>
     */
    public const RELATED = [
        'development' => ['web-development', 'mobile-apps'],
        'automation' => ['development', 'qa'],
        'web-development' => ['development', 'mobile-apps'],
        'mobile-apps' => ['development', 'web-development'],
        'qa' => ['development', 'cybersecurity'],
        'cybersecurity' => ['qa', 'development'],
    ];

    /**
     * Display the list of all services.
     */
    public function index(string $locale): Response
    {
        $services = ServicePage::whereIn('slug', self::ORDER)
            ->get()
            ->sortBy(fn (ServicePage $service) => array_search($service->slug, self::ORDER, true))
            ->values()
            ->map(fn (ServicePage $service) => [
                'slug' => $service->slug,
                'title' => $service->{"title_{$locale}"},
                'subtitle' => $service->{"subtitle_{$locale}"},
                'audience' => $service->{"audience_{$locale}"},
                'deliverables' => array_values($service->{"deliverables_{$locale}"} ?? []),
            ]);

        $title = $locale === 'ar' ? 'خدماتنا' : 'Services';
        $description = $locale === 'ar'
            ? 'تطوير البرمجيات والأتمتة، مع ضمان الجودة والأمن السيبراني، من فريق واحد يعمل عن بُعد لخدمة الشركات في الخليج. اعرف الخدمة المناسبة لمشكلتك وكيف يبدأ المشروع.'
            : 'Software development and automation, plus QA and cybersecurity, from one remote team serving businesses across the Gulf. Find the right service for your problem and see how a project starts.';
        $seo = SeoService::forStaticPage('services', $locale, $title, "/{$locale}/services", $description);

        return Inertia::render('public/services/index', [
            'services' => $services,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Display a service detail page with database-sourced content.
     */
    public function show(string $locale, string $slug): Response
    {
        $service = ServicePage::where('slug', $slug)->firstOrFail();
        $seo = SeoService::forStaticPage(
            "services.{$slug}",
            $locale,
            $service->{"title_{$locale}"},
            "/{$locale}/services/{$slug}",
            $service->{"subtitle_{$locale}"},
        );

        $related = ServicePage::whereIn('slug', self::RELATED[$slug] ?? [])
            ->get()
            ->sortBy(fn (ServicePage $s) => array_search($s->slug, self::RELATED[$slug], true))
            ->values()
            ->map(fn (ServicePage $s) => [
                'slug' => $s->slug,
                'title' => $s->{"title_{$locale}"},
                'subtitle' => $s->{"subtitle_{$locale}"},
            ]);

        return Inertia::render('public/services/'.$slug, [
            'service' => self::localized($service, $locale),
            'related' => $related,
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Flatten one service row into the shape the detail pages render,
     * so the frontend never picks columns by locale itself.
     *
     * @return array<string, mixed>
     */
    public static function localized(ServicePage $service, string $locale): array
    {
        $list = fn (string $field): array => array_values(array_filter(
            $service->{"{$field}_{$locale}"} ?? [],
            fn ($item) => ! empty($item),
        ));

        return [
            'slug' => $service->slug,
            'title' => $service->{"title_{$locale}"},
            'tagline' => $service->{"tagline_{$locale}"} ?: $service->{"title_{$locale}"},
            'subtitle' => $service->{"subtitle_{$locale}"},
            'audience' => $service->{"audience_{$locale}"},
            'problem' => $service->{"problem_{$locale}"},
            'pains' => $list('pains'),
            'approach' => $service->{"approach_{$locale}"},
            'steps' => $list('process_steps'),
            'deliverables' => $list('deliverables'),
            'engagements' => $list('engagements'),
            'tools' => array_values($service->tools ?? []),
            'faqs' => $list('faqs'),
            'cta' => $service->{"cta_text_{$locale}"},
        ];
    }
}
