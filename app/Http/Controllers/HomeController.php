<?php

namespace App\Http\Controllers;

use App\Models\Industry;
use App\Models\LandingCaseStudy;
use App\Models\LandingClientLogo;
use App\Models\LandingFaq;
use App\Models\LandingProcessStep;
use App\Models\LandingProduct;
use App\Models\LandingService;
use App\Models\PortfolioItem;
use App\Models\Testimonial;
use App\Services\CriticalAssetService;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $locale = app()->getLocale();
        $seo = SeoService::forStaticPage(
            'home',
            $locale,
            config('app.name'),
            "/{$locale}",
        );

        $ar = $locale === 'ar';

        $services = LandingService::orderBy('sort_order')->get()->map(
            fn ($s) => [
                'code' => $s->code,
                'title' => $ar ? $s->title_ar : $s->title_en,
                'body' => $ar ? $s->body_ar : $s->body_en,
                'tags' => $ar ? $s->tags_ar : $s->tags_en,
            ],
        );

        $products = LandingProduct::orderBy('sort_order')->get()->map(
            fn ($p) => [
                'code' => $p->code,
                'name' => $p->name,
                'kind' => $ar ? $p->kind_ar : $p->kind_en,
                'pitch' => $ar ? $p->pitch_ar : $p->pitch_en,
                'url' => $p->url,
                'stats' => $ar ? $p->stats_ar : $p->stats_en,
                'demo_kind' => $p->demo_kind,
            ],
        );

        $processSteps = LandingProcessStep::orderBy('sort_order')->get()->map(
            fn ($s) => [
                'n' => $s->n,
                'title' => $ar ? $s->title_ar : $s->title_en,
                'body' => $ar ? $s->body_ar : $s->body_en,
                'duration' => $ar ? $s->duration_ar : $s->duration_en,
                'deliverable' => $ar ? $s->deliverable_ar : $s->deliverable_en,
            ],
        );

        $cases = LandingCaseStudy::orderBy('sort_order')->get()->map(
            fn ($c) => [
                'tag' => $ar ? $c->tag_ar : $c->tag_en,
                'client' => $ar ? $c->client_ar : $c->client_en,
                'headline' => $ar ? $c->headline_ar : $c->headline_en,
                'metric' => $c->metric,
                'metric_label' => $ar ? $c->metric_label_ar : $c->metric_label_en,
                'portfolio_slug' => $c->portfolio_slug,
            ],
        );

        $faqs = LandingFaq::orderBy('sort_order')->get()->map(
            fn ($f) => [
                'q' => $ar ? $f->question_ar : $f->question_en,
                'a' => $ar ? $f->answer_ar : $f->answer_en,
            ],
        );

        $logos = LandingClientLogo::orderBy('sort_order')
            ->get()
            ->map(fn ($l) => $ar ? $l->label_ar : $l->label_en);

        // Project to the active locale only. Frontend ternaries (`isRTL ? _ar : _en`)
        // keep working because the other-locale field is just blanked, but we save
        // ~40% on this section of the Inertia JSON — Arabic Unicode escapes are
        // especially expensive when serving an English page.
        $testimonials = Testimonial::where('is_visible', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'quote_en' => $ar ? '' : $t->quote_en,
                'quote_ar' => $ar ? $t->quote_ar : '',
                'author_name_en' => $ar ? '' : $t->author_name_en,
                'author_name_ar' => $ar ? $t->author_name_ar : '',
                'author_title_en' => $ar ? '' : $t->author_title_en,
                'author_title_ar' => $ar ? $t->author_title_ar : '',
                'company_en' => $ar ? '' : $t->company_en,
                'company_ar' => $ar ? $t->company_ar : '',
            ]);

        $industries = Industry::visible()
            ->ordered()
            ->get(['id', 'slug', 'title_en', 'title_ar', 'solutions_en', 'solutions_ar'])
            ->map(fn ($i) => [
                'id' => $i->id,
                'slug' => $i->slug,
                'title_en' => $ar ? '' : $i->title_en,
                'title_ar' => $ar ? $i->title_ar : '',
                'solutions_en' => $ar ? [] : $i->solutions_en,
                'solutions_ar' => $ar ? $i->solutions_ar : [],
            ]);

        $featuredCaseModel = PortfolioItem::published()
            ->orderBy('sort_order')
            ->with('featuredImage')
            ->first();

        $featuredCase = $featuredCaseModel ? [
            'id' => $featuredCaseModel->id,
            'slug' => $featuredCaseModel->slug,
            'title_en' => $ar ? '' : $featuredCaseModel->title_en,
            'title_ar' => $ar ? $featuredCaseModel->title_ar : '',
            'description_en' => $ar ? '' : $featuredCaseModel->description_en,
            'description_ar' => $ar ? $featuredCaseModel->description_ar : '',
            'client_name' => $featuredCaseModel->client_name,
            'service_category' => $featuredCaseModel->service_category,
            'featured_image' => $featuredCaseModel->featuredImage ? [
                'url' => $featuredCaseModel->featuredImage->url,
                'alt_text' => $featuredCaseModel->featuredImage->alt_text ?? null,
            ] : null,
        ] : null;

        // The H1 LCP element uses Fraunces serif (regular + italic). Preloading
        // these lets the browser fetch them in parallel with the CSS instead of
        // discovering them only after the bundled font CSS parses.
        $criticalFonts = CriticalAssetService::findInManifest([
            'fraunces-latin-400-normal',
            'fraunces-latin-400-italic',
        ], 'woff2');

        return Inertia::render('public/home', [
            'landing' => [
                'services' => $services,
                'products' => $products,
                'processSteps' => $processSteps,
                'cases' => $cases,
                'faqs' => $faqs,
                'logos' => $logos,
            ],
            'testimonials' => $testimonials,
            'industries' => $industries,
            'featuredCase' => $featuredCase,
            'seo' => $seo,
        ])->withViewData([
            'seo' => $seo,
            'criticalFonts' => $criticalFonts,
        ]);
    }
}
