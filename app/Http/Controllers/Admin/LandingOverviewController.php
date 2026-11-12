<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingCaseStudy;
use App\Models\LandingFaq;
use App\Models\LandingProcessStep;
use App\Models\LandingService;
use Inertia\Inertia;
use Inertia\Response;

class LandingOverviewController extends Controller
{
    /**
     * Overview of every homepage section an admin can edit, with counts.
     * `visible` is null for sections that have no show/hide switch.
     */
    public function index(): Response
    {
        return Inertia::render('admin/landing/index', [
            'sections' => [
                [
                    'key' => 'services',
                    'total' => LandingService::count(),
                    'visible' => null,
                ],
                [
                    'key' => 'process-steps',
                    'total' => LandingProcessStep::count(),
                    'visible' => null,
                ],
                [
                    'key' => 'case-studies',
                    'total' => LandingCaseStudy::count(),
                    'visible' => LandingCaseStudy::where('is_visible', true)->count(),
                ],
                [
                    'key' => 'faqs',
                    'total' => LandingFaq::count(),
                    'visible' => LandingFaq::where('is_visible', true)->count(),
                ],
            ],
        ]);
    }
}
