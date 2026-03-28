<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    /**
     * Display the FAQ page.
     *
     * FAQ content remains in translations for v1.
     */
    public function index(): Response
    {
        return Inertia::render('public/faq');
    }
}
