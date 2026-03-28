<?php

use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard -- accessible to all authenticated users (admin + editor)
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Placeholder route groups for future plans:
    // Editor-accessible: blog, portfolio, media
    // Admin-only: testimonials, services, team, contacts, users, settings
});
