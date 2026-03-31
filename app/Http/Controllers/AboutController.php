<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use App\Services\SeoService;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    /**
     * Display the about page with database-sourced team members.
     */
    public function index(): Response
    {
        $locale = app()->getLocale();
        $seo = SeoService::forStaticPage('about', $locale, __('about.title'), "/{$locale}/about");

        return Inertia::render('public/about', [
            'teamMembers' => TeamMember::with('photo')
                ->orderBy('sort_order')
                ->get(),
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }
}
