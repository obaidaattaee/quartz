<?php

use App\Http\Controllers\Admin\BlogPostController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ContactLeadController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\PortfolioItemController;
use App\Http\Controllers\Admin\SeoSettingController;
use App\Http\Controllers\Admin\ServicePageController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\TeamMemberController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard -- accessible to all authenticated users (admin + editor)
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Media -- accessible to editors and admins (needed for blog/portfolio image uploads)
    Route::get('media', [MediaController::class, 'index'])->name('media.index');
    Route::post('media/upload', [MediaController::class, 'store'])->name('media.store');
    Route::delete('media/{media}', [MediaController::class, 'destroy'])->name('media.destroy');

    // Blog posts -- accessible to editors and admins
    Route::resource('blog', BlogPostController::class);

    // Portfolio items -- accessible to editors and admins
    Route::resource('portfolio', PortfolioItemController::class);

    // Categories -- accessible to editors and admins (needed for blog post assignment)
    Route::resource('categories', CategoryController::class)->except(['create', 'edit', 'show']);

    // SEO settings -- accessible to editors and admins
    Route::get('seo', [SeoSettingController::class, 'index'])->name('seo.index');
    Route::put('seo', [SeoSettingController::class, 'update'])->name('seo.update');

    // Admin-only routes -- editors get 403
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

        // Service page management (edit-only, fixed set of 4 service pages)
        Route::resource('services', ServicePageController::class)->only(['index', 'edit', 'update']);

        // Site settings (branding, colors, contact, social)
        Route::get('settings', [SiteSettingController::class, 'index'])->name('settings.index');
        Route::put('settings', [SiteSettingController::class, 'update'])->name('settings.update');

        // SEO settings for static pages
        Route::get('seo', [SeoSettingController::class, 'index'])->name('seo.index');
        Route::put('seo', [SeoSettingController::class, 'update'])->name('seo.update');

        // User management (CRUD)
        Route::resource('users', UserController::class)->except(['show']);
    });
});
