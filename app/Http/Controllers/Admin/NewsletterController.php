<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsletterController extends Controller
{
    /**
     * Display a paginated list of newsletter subscribers.
     */
    public function index(Request $request)
    {
        $subscribers = NewsletterSubscriber::query()
            ->when($request->search, fn ($q, $s) => $q->where('email', 'like', "%{$s}%"))
            ->latest('subscribed_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/newsletter/index', [
            'subscribers' => $subscribers,
            'filters' => $request->only('search'),
            'totalCount' => NewsletterSubscriber::count(),
        ]);
    }

    /**
     * Delete a subscriber.
     */
    public function destroy(NewsletterSubscriber $subscriber)
    {
        $subscriber->delete();

        return back()->with('success', 'Subscriber removed.');
    }
}
