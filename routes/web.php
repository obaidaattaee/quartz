<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\NewsletterController;
use App\Http\Middleware\SetLocale;
use Illuminate\Support\Facades\Route;

// Root redirect to default locale
Route::redirect('/', '/en');

// All public routes under locale prefix
Route::prefix('{locale}')
    ->where(['locale' => 'en|ar'])
    ->middleware(SetLocale::class)
    ->group(function () {
        Route::inertia('/', 'public/home')->name('home');

        // Service pages (static Inertia render)
        Route::inertia('/services/development', 'public/services/development')->name('services.development');
        Route::inertia('/services/automation', 'public/services/automation')->name('services.automation');
        Route::inertia('/services/qa', 'public/services/qa')->name('services.qa');
        Route::inertia('/services/cybersecurity', 'public/services/cybersecurity')->name('services.cybersecurity');

        // Static pages
        Route::inertia('/about', 'public/about')->name('about');
        Route::inertia('/faq', 'public/faq')->name('faq');

        // Contact (GET: show form via Inertia, POST: submit via controller)
        Route::inertia('/contact', 'public/contact')->name('contact.show');
        Route::post('/contact', [ContactController::class, 'store'])
            ->middleware('throttle:contact')
            ->name('contact.store');

        // Newsletter
        Route::post('/newsletter', [NewsletterController::class, 'store'])
            ->middleware('throttle:newsletter')
            ->name('newsletter.store');
    });

// Auth/admin routes remain WITHOUT locale prefix
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
