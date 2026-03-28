<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTestimonialRequest;
use App\Http\Requests\Admin\UpdateTestimonialRequest;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimonialController extends Controller
{
    /**
     * Display a listing of testimonials ordered by sort_order.
     */
    public function index()
    {
        $testimonials = Testimonial::with('photo')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('admin/testimonials/index', [
            'testimonials' => $testimonials,
        ]);
    }

    /**
     * Show the form for creating a new testimonial.
     */
    public function create()
    {
        $nextSortOrder = (Testimonial::max('sort_order') ?? 0) + 1;

        return Inertia::render('admin/testimonials/create', [
            'nextSortOrder' => $nextSortOrder,
        ]);
    }

    /**
     * Store a newly created testimonial.
     */
    public function store(StoreTestimonialRequest $request)
    {
        Testimonial::create(
            $request->validated() + ['sort_order' => (Testimonial::max('sort_order') ?? 0) + 1]
        );

        return redirect()->route('admin.testimonials.index')
            ->with('success', 'Testimonial created.');
    }

    /**
     * Show the form for editing the specified testimonial.
     */
    public function edit(Testimonial $testimonial)
    {
        $testimonial->load('photo');

        return Inertia::render('admin/testimonials/edit', [
            'testimonial' => $testimonial,
        ]);
    }

    /**
     * Update the specified testimonial.
     */
    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial)
    {
        $testimonial->update($request->validated());

        return redirect()->route('admin.testimonials.index')
            ->with('success', 'Testimonial updated.');
    }

    /**
     * Remove the specified testimonial.
     */
    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();

        return redirect()->route('admin.testimonials.index')
            ->with('success', 'Testimonial deleted.');
    }

    /**
     * Reorder a testimonial by swapping sort_order with adjacent item.
     */
    public function reorder(Request $request, Testimonial $testimonial)
    {
        $request->validate([
            'direction' => 'required|in:up,down',
        ]);

        $current = $testimonial->sort_order;

        if ($request->direction === 'up') {
            $swapWith = Testimonial::where('sort_order', '<', $current)
                ->orderByDesc('sort_order')
                ->first();
        } else {
            $swapWith = Testimonial::where('sort_order', '>', $current)
                ->orderBy('sort_order')
                ->first();
        }

        if ($swapWith) {
            $testimonial->update(['sort_order' => $swapWith->sort_order]);
            $swapWith->update(['sort_order' => $current]);
        }

        return redirect()->back();
    }
}
