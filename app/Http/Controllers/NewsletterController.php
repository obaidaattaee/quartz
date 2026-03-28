<?php

namespace App\Http\Controllers;

use App\Http\Requests\NewsletterRequest;
use App\Models\NewsletterSubscriber;

class NewsletterController extends Controller
{
    public function store(NewsletterRequest $request)
    {
        NewsletterSubscriber::create([
            'email' => $request->validated()['email'],
            'locale' => app()->getLocale(),
            'subscribed_at' => now(),
        ]);

        return back()->with('newsletter_success', true);
    }
}
