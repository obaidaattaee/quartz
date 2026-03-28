<?php

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
    });

// Auth/admin routes remain WITHOUT locale prefix
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
