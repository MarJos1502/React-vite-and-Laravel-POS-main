<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FarewellMessageController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::post('/send-receipt-email', [ReceiptController::class, 'sendEmail']);
    Route::get('/receipt/download/{id}', [ReceiptController::class, 'download']);

    // Role-based routes
    Route::middleware(['role:manager|administrator'])->group(function () {
        Route::get('/reports', [ReportController::class, 'index']);
        Route::get('/reports/sales', [ReportController::class, 'sales']);
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
    });

    Route::middleware(['role:administrator'])->group(function () {
        Route::post('/users', [UserController::class, 'store']);
        Route::post('/submit-form', [FormController::class, 'submit']);
    });

    Route::middleware(['role:cashier|manager|administrator'])->group(function () {
        Route::post('/payments', [PaymentController::class, 'store']);
        Route::post('/surveys', [SurveyController::class, 'store']);
        Route::get('/farewell-message', [FarewellMessageController::class, 'active']);
    });

    // Permission-based routes
    Route::middleware(['permission:manage products'])->group(function () {
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
    });

    Route::middleware(['permission:view reports'])->group(function () {
        Route::get('/reports', [ReportController::class, 'index']);
        Route::get('/reports/sales', [ReportController::class, 'sales']);
    });

    Route::middleware(['permission:process payments'])->group(function () {
        Route::post('/payments', [PaymentController::class, 'store']);
    });
});

// Public product viewing
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
