<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Contact;
use App\Models\PortfolioItem;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'metrics' => [
                'total_leads' => Contact::count(),
                'new_leads' => Contact::where('status', 'new')->count(),
                'blog_posts' => BlogPost::count(),
                'published_posts' => BlogPost::where('status', 'published')->count(),
                'portfolio_items' => PortfolioItem::count(),
                'testimonials' => Testimonial::where('is_visible', true)->count(),
            ],
            'recent_leads' => Contact::latest()->take(5)->get(['id', 'name', 'email', 'service', 'status', 'created_at']),
        ]);
    }
}
