<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactLeadController extends Controller
{
    /**
     * Display a paginated list of contact leads with filters.
     */
    public function index(Request $request)
    {
        $leads = Contact::query()
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/contacts/index', [
            'leads' => $leads,
            'filters' => $request->only('search', 'status'),
            'counts' => [
                'new' => Contact::where('status', 'new')->count(),
                'read' => Contact::where('status', 'read')->count(),
                'handled' => Contact::where('status', 'handled')->count(),
                'total' => Contact::count(),
            ],
        ]);
    }

    /**
     * Show a single contact lead detail. Auto-marks new leads as read.
     */
    public function show(Contact $contact)
    {
        if ($contact->status === 'new') {
            $contact->update(['status' => 'read']);
        }

        return Inertia::render('admin/contacts/show', [
            'lead' => $contact,
        ]);
    }

    /**
     * Update the status of a contact lead.
     */
    public function updateStatus(Request $request, Contact $contact)
    {
        $request->validate([
            'status' => 'required|in:new,read,handled',
        ]);

        $contact->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Status updated.');
    }
}
