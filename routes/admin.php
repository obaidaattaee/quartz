<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\ServicePageController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard -- accessible to all authenticated users (admin + editor)
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Media -- accessible to editors and admins (needed for blog/portfolio image uploads)
    Route::get('media', [MediaController::class, 'index'])->name('media.index');
    Route::post('media/upload', [MediaController::class, 'store'])->name('media.store');
    Route::delete('media/{media}', [MediaController::class, 'destroy'])->name('media.destroy');

    // Admin-only routes -- editors get 403
    Route::middleware('role:admin')->group(function () {
        // Service page management (edit-only, fixed set of 4 service pages)
        Route::resource('services', ServicePageController::class)->only(['index', 'edit', 'update']);

        // Site settings (branding, colors, contact, social)
        Route::get('settings', [SiteSettingController::class, 'index'])->name('settings.index');
        Route::put('settings', [SiteSettingController::class, 'update'])->name('settings.update');

        // User management (CRUD)
        Route::resource('users', UserController::class)->except(['show']);
    });
});
