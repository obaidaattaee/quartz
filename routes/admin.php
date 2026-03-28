<?php

use App\Http\Controllers\Admin\ContactLeadController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\TeamMemberController;
use App\Http\Controllers\Admin\TestimonialController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard -- accessible to all authenticated users (admin + editor)
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Media -- accessible to editors and admins (needed for blog/portfolio image uploads)
    Route::get('media', [MediaController::class, 'index'])->name('media.index');
    Route::post('media/upload', [MediaController::class, 'store'])->name('media.store');
    Route::delete('media/{media}', [MediaController::class, 'destroy'])->name('media.destroy');

    // Admin-only routes
    Route::middleware('role:admin')->group(function () {
        // Contact leads management
        Route::get('contacts', [ContactLeadController::class, 'index'])->name('contacts.index');
        Route::get('contacts/{contact}', [ContactLeadController::class, 'show'])->name('contacts.show');
        Route::patch('contacts/{contact}/status', [ContactLeadController::class, 'updateStatus'])->name('contacts.status');

        // Testimonials CRUD with reorder
        Route::resource('testimonials', TestimonialController::class);
        Route::post('testimonials/{testimonial}/reorder', [TestimonialController::class, 'reorder'])->name('testimonials.reorder');

        // Team members CRUD with reorder
        Route::resource('team', TeamMemberController::class);
        Route::post('team/{teamMember}/reorder', [TeamMemberController::class, 'reorder'])->name('team.reorder');
    });
});
