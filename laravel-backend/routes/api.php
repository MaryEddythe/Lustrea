<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\MessageController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check route
Route::get('/health', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is running',
        'timestamp' => now()->toISOString()
    ]);
});

// Public routes
Route::prefix('v1')->group(function () {
    // Services
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/categories', [ServiceController::class, 'categories']);
    Route::get('/services/{service}', [ServiceController::class, 'show']);

    // Appointments (public booking)
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments/available-slots', [AppointmentController::class, 'getAvailableSlots']);

    // Gallery
    Route::get('/gallery', [GalleryController::class, 'index']);
    Route::get('/gallery/categories', [GalleryController::class, 'getCategories']);
    Route::get('/gallery/featured', [GalleryController::class, 'getFeatured']);
    Route::get('/gallery/{gallery}', [GalleryController::class, 'show']);

    // Messages (public - for clients)
    Route::get('/appointments/{appointmentId}/messages', [MessageController::class, 'index']);
    Route::post('/appointments/{appointmentId}/messages', [MessageController::class, 'store']);
    Route::put('/messages/{message}/read', [MessageController::class, 'markAsRead']);

    // Admin authentication
    Route::post('/admin/login', [AdminController::class, 'login']);
});

// Protected admin routes
Route::prefix('v1/admin')->middleware(['auth:sanctum'])->group(function () {
    // Admin profile
    Route::get('/me', [AdminController::class, 'me']);
    Route::put('/profile', [AdminController::class, 'updateProfile']);
    Route::post('/logout', [AdminController::class, 'logout']);
    Route::post('/refresh-token', [AdminController::class, 'refreshToken']);

    // Appointments management
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::get('/appointments/statistics', [AppointmentController::class, 'statistics']);
    Route::get('/appointments/{appointment}', [AppointmentController::class, 'show']);
    Route::put('/appointments/{appointment}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);

    // Services management
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{service}', [ServiceController::class, 'update']);
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

    // Gallery management
    Route::post('/gallery', [GalleryController::class, 'store']);
    Route::put('/gallery/{gallery}', [GalleryController::class, 'update']);
    Route::delete('/gallery/{gallery}', [GalleryController::class, 'destroy']);
    Route::post('/gallery/sort-order', [GalleryController::class, 'updateSortOrder']);

    // Messages management
    Route::get('/messages/conversations', [MessageController::class, 'getConversations']);
    Route::get('/messages/unread-count', [MessageController::class, 'getUnreadCount']);
    Route::put('/appointments/{appointmentId}/messages/read-all', [MessageController::class, 'markConversationAsRead']);
});

// Fallback route for API
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'API endpoint not found'
    ], 404);
});
