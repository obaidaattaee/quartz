<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Mail\ContactSubmitted;
use App\Models\Contact;
use App\Services\SeoService;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Display the contact page with SEO data.
     */
    public function show(string $locale): Response
    {
        $seo = SeoService::forStaticPage('contact', $locale, __('contact.title'), "/{$locale}/contact");

        return Inertia::render('public/contact', [
            'seo' => $seo,
        ])->withViewData(['seo' => $seo]);
    }

    public function store(ContactRequest $request)
    {
        $contact = Contact::create($request->validated());

        Mail::to(config('mail.admin_address', 'admin@quartz.com'))
            ->send(new ContactSubmitted($contact));

        return back()->with('success', true);
    }
}
