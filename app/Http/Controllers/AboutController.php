<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    /**
     * Display the about page with database-sourced team members.
     */
    public function index(): Response
    {
        return Inertia::render('public/about', [
            'teamMembers' => TeamMember::with('photo')
                ->orderBy('sort_order')
                ->get(),
        ]);
    }
}
