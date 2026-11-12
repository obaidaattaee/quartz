<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\IndustryController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\RssFeedController;
use App\Http\Controllers\ServiceController;
use App\Http\Middleware\SetLocale;
use App\Http\Middleware\SetPublicCacheHeaders;
use Illuminate\Support\Facades\Route;

// Render the default-locale home directly at `/` to avoid the extra round
// trip from a 302 redirect. The canonical URL still points at `/en` so
// search engines treat `/en` as the source of truth.
Route::get('/', [HomeController::class, 'index'])
    ->middleware([SetLocale::class, SetPublicCacheHeaders::class])
    ->name('home.root');

// All public routes under locale prefix
Route::prefix('{locale}')
    ->where(['locale' => 'en|ar'])
    ->middleware([SetLocale::class, SetPublicCacheHeaders::class])
    ->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('home');

        // Service pages (database-backed via controller)
        Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
        Route::get('/services/{slug}', [ServiceController::class, 'show'])
            ->where('slug', 'development|web-development|mobile-apps|automation|qa|cybersecurity')
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

        // Industries (public)
        Route::get('/industries', [IndustryController::class, 'index'])->name('industries.index');
        Route::get('/industries/{slug}', [IndustryController::class, 'show'])
            ->where('slug', '[a-z0-9-]+')
            ->name('industries.show');

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

        // Legal documents (database-backed, admin editable)
        Route::get('/{slug}', [LegalController::class, 'show'])
            ->where('slug', 'privacy|terms')
            ->name('legal.show');

        // RSS feed
        Route::get('/feed.xml', RssFeedController::class)->name('feed');
    });

// Auth/admin routes remain WITHOUT locale prefix
Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('dashboard', '/admin')->name('dashboard');
});

require __DIR__.'/settings.php';
