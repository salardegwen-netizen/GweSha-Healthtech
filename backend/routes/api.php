<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\HealthRecordController;
use App\Http\Controllers\Api\VitalsController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\SpecialistController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\NotificationController;

// Public routes (no authentication required)
Route::group(['prefix' => 'auth', 'middleware' => 'api'], function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// Public API endpoints - READ operations for development/demo
Route::get('/patients', [PatientController::class, 'index']);
Route::get('/patients/{id}', [PatientController::class, 'show']);
Route::get('/appointments', [AppointmentController::class, 'index']);
Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
Route::get('/invoices', [InvoiceController::class, 'index']);
Route::get('/invoices/{id}', [InvoiceController::class, 'show']);
Route::get('/billing/dashboard-metrics', [InvoiceController::class, 'dashboardMetrics']);
Route::get('/staff', [StaffController::class, 'index']);
Route::get('/staff/{id}', [StaffController::class, 'show']);
Route::get('/health-records', [HealthRecordController::class, 'index']);
Route::get('/health-records/{id}', [HealthRecordController::class, 'show']);
Route::get('/vitals', [VitalsController::class, 'index']);
Route::get('/schedule', [ScheduleController::class, 'index']);

// Protected routes (require authentication with Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // ========== AUTHENTICATION ==========
    Route::group(['prefix' => 'auth'], function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // ========== PATIENTS ==========
    Route::get('/patients/me', [PatientController::class, 'getMe']);
    Route::get('/patients/{id}/health-records', [HealthRecordController::class, 'byPatient']);
    Route::apiResource('patients', PatientController::class);

    // ========== APPOINTMENTS ==========
    Route::delete('appointments/clear-all', [AppointmentController::class, 'clearAll']);
    Route::apiResource('appointments', AppointmentController::class);

    // ========== INVOICES & BILLING ==========
    Route::group(['prefix' => 'invoices'], function () {
        Route::get('/', [InvoiceController::class, 'index']);
        Route::post('/', [InvoiceController::class, 'store']);
        Route::get('/{id}', [InvoiceController::class, 'show']);
    });

    Route::post('/payments', [InvoiceController::class, 'payment']);
    Route::get('/billing/dashboard-metrics', [InvoiceController::class, 'dashboardMetrics']);

    // ========== STAFF ==========
    Route::group(['prefix' => 'staff'], function () {
        Route::get('/', [StaffController::class, 'index']);
        Route::post('/', [StaffController::class, 'store']);
        Route::get('/{id}', [StaffController::class, 'show']);
        Route::put('/{id}', [StaffController::class, 'update']);
        Route::delete('/{id}', [StaffController::class, 'destroy']);
        Route::put('/{id}/status', [StaffController::class, 'updateStatus']);
    });

    // ========== HEALTH RECORDS ==========
    Route::apiResource('health-records', HealthRecordController::class);

    // ========== VITALS ==========
    Route::group(['prefix' => 'vitals'], function () {
        Route::get('/', [VitalsController::class, 'index']);
        Route::post('/', [VitalsController::class, 'store']);
        Route::get('/current', [VitalsController::class, 'getCurrent']);
        Route::get('/history/{patientId}', [VitalsController::class, 'getHistory']);
    });

    // ========== SCHEDULE ==========
    Route::group(['prefix' => 'schedule'], function () {
        Route::get('/', [ScheduleController::class, 'index']);
        Route::post('/', [ScheduleController::class, 'store']);
        Route::get('/blocks/{id}', [ScheduleController::class, 'show']);
        Route::put('/blocks/{id}', [ScheduleController::class, 'update']);
        Route::delete('/blocks/{id}', [ScheduleController::class, 'destroy']);
    });

    // ========== SPECIALISTS ==========
    Route::get('/specialists', [SpecialistController::class, 'index']);

    // ========== SETTINGS ==========
    Route::group(['prefix' => 'settings'], function () {
        Route::get('/', [SettingsController::class, 'index']);
        Route::put('/{id}', [SettingsController::class, 'update']);
        Route::post('/clinic-profile', [SettingsController::class, 'updateClinicProfile']);
        Route::post('/billing-config', [SettingsController::class, 'updateBillingConfig']);
        Route::post('/notifications', [SettingsController::class, 'updateNotifications']);
        Route::post('/security', [SettingsController::class, 'updateSecurity']);
    });

    // ========== NOTIFICATIONS ==========
    Route::group(['prefix' => 'notifications'], function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::put('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/clear-all', [NotificationController::class, 'clearAll']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
    });
});
