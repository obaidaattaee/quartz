<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Mail\ContactSubmitted;
use App\Models\Contact;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(ContactRequest $request)
    {
        $contact = Contact::create($request->validated());

        Mail::to(config('mail.admin_address', 'admin@quart.com'))
            ->send(new ContactSubmitted($contact));

        return back()->with('success', true);
    }
}
