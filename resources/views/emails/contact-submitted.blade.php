<x-mail::message>
# New Contact Form Submission

You have received a new contact form submission.

**Name:** {{ $contact->name }}

**Email:** {{ $contact->email }}

@if($contact->phone)
**Phone:** {{ $contact->phone }}
@endif

**Service:** {{ ucfirst($contact->service) }}

**Message:**

{{ $contact->message }}

<x-mail::button :url="config('app.url') . '/dashboard'">
View in Dashboard
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
