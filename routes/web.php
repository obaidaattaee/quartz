<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\RssFeedController;
use App\Http\Controllers\ServiceController;
use App\Http\Middleware\SetLocale;
use Illuminate\Support\Facades\Route;

// Root redirect to default locale
Route::redirect('/', '/en');

// All public routes under locale prefix
Route::prefix('{locale}')
    ->where(['locale' => 'en|ar'])
    ->middleware(SetLocale::class)
    ->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('home');

        // Service pages (database-backed via controller)
        Route::get('/services/{slug}', [ServiceController::class, 'show'])
            ->where('slug', 'development|automation|qa|cybersecurity')
            ->name('services.show');

        // About (database-backed team members)
        Route::get('/about', [AboutController::class, 'index'])->name('about');

        // FAQ (translations-based for v1)
        Route::get('/faq', [FaqController::class, 'index'])->name('faq');

        // Contact (GET: show form via controller with SEO, POST: submit via controller)
        Route::get('/contact', [ContactController::class, 'show'])->name('contact.show');
        Route::post('/contact', [ContactController::class, 'store'])
            ->middleware('throttle:contact')
            ->name('contact.store');

        // Portfolio (public)
        Route::get('/portfolio', [PortfolioController::class, 'index'])->name('portfolio.index');
        Route::get('/portfolio/{slug}', [PortfolioController::class, 'show'])->name('portfolio.show');

        // Newsletter
        Route::post('/newsletter', [NewsletterController::class, 'store'])
            ->middleware('throttle:newsletter')
            ->name('newsletter.store');

        // Blog routes
        Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
        Route::get('/blog/category/{slug}', [BlogController::class, 'category'])->name('blog.category');
        Route::get('/blog/tag/{slug}', [BlogController::class, 'tag'])->name('blog.tag');
        Route::get('/blog/author/{id}', [BlogController::class, 'author'])->name('blog.author');
        Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');

        // Portfolio routes
        Route::get('/portfolio', [PortfolioController::class, 'index'])->name('portfolio.index');
        Route::get('/portfolio/{slug}', [PortfolioController::class, 'show'])->name('portfolio.show');

        // RSS feed
        Route::get('/feed.xml', RssFeedController::class)->name('feed');
    });

// Auth/admin routes remain WITHOUT locale prefix
Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('dashboard', '/admin')->name('dashboard');
});

require __DIR__.'/settings.php';
