<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Mail\ContactSubmitted;
use App\Models\Contact;
use App\Services\SeoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Contact options the form accepts (see ContactRequest).
     *
     * @var list<string>
     */
    public const SERVICES = ['development', 'automation', 'qa', 'cybersecurity', 'general'];

    /**
     * Service pages without their own contact option map to their parent.
     *
     * @var array<string, string>
     */
    public const SERVICE_ALIASES = [
        'web-development' => 'development',
        'mobile-apps' => 'development',
    ];

    /**
     * Display the contact page with SEO data. ?service=<slug> preselects
     * the matching option in the form.
     */
    public function show(Request $request, string $locale): Response
    {
        $seo = SeoService::forStaticPage('contact', $locale, __('contact.title'), "/{$locale}/contact");

        return Inertia::render('public/contact', [
            'seo' => $seo,
            'preselectedService' => self::resolveService($request->query('service')),
        ])->withViewData(['seo' => $seo]);
    }

    /**
     * Map a ?service= value to a contact option, or null when unknown.
     */
    public static function resolveService(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $value = strtolower(trim($value));
        $value = self::SERVICE_ALIASES[$value] ?? $value;

        return in_array($value, self::SERVICES, true) ? $value : null;
    }

    public function store(ContactRequest $request)
    {
        $contact = Contact::create($request->validated());

        Mail::to(config('mail.admin_address', 'admin@quartz.com'))
            ->send(new ContactSubmitted($contact));

        return back()->with('success', true);
    }
}
