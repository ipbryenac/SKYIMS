<?php

use App\Http\Controllers\Admin\AdminAnalyticsController;
use App\Http\Controllers\Admin\AdminAttendanceController;
use App\Http\Controllers\Admin\AdminEventController;
use App\Http\Controllers\Admin\YouthRegistryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Youth\YouthBadgeController;
use App\Http\Controllers\Youth\YouthEventController;
use App\Http\Controllers\Youth\YouthProfileController;
use App\Http\Controllers\Youth\YouthSurveyController;
use App\Models\Event;
use App\Models\Survey;
use App\Models\SurveyResponse;
use App\Models\YouthProfile;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Central Dashboard Route - Dispatches by User Role
Route::get('/dashboard', function () {
    $user = auth()->user();

    if ($user->isSkOfficial()) {
        return redirect()->route('admin.dashboard');
    }

    return redirect()->route('youth.dashboard');
})->middleware(['auth'])->name('dashboard');

// 1. YOUTH PORTAL ROUTES (Citizen Experience)
Route::middleware(['auth'])->prefix('youth')->name('youth.')->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user()->load('profile');

        // Check active survey and whether the youth user has completed it
        $activeSurvey = Survey::with('questions')
            ->where('is_active', true)
            ->latest()
            ->first();

        $hasCompletedSurvey = false;
        if ($activeSurvey) {
            $hasCompletedSurvey = SurveyResponse::where('survey_id', $activeSurvey->id)
                ->where('user_id', $user->id)
                ->exists();
        }

        return Inertia::render('Youth/Dashboard', [
            'youthProfile' => $user->profile,
            'activeSurvey' => $activeSurvey,
            'hasCompletedSurvey' => $hasCompletedSurvey,
        ]);
    })->name('dashboard');

    // Youth Needs Assessment Surveys
    Route::get('/surveys', [YouthSurveyController::class, 'index'])->name('surveys.index');
    Route::post('/surveys/{survey}/submit', [YouthSurveyController::class, 'submit'])->name('surveys.submit');

    // Module 3: Activity Event Board & Registration
    Route::get('/events', [YouthEventController::class, 'index'])->name('events.index');
    Route::post('/events/{event}/register', [YouthEventController::class, 'register'])->name('events.register');
    Route::delete('/events/{event}/cancel', [YouthEventController::class, 'cancel'])->name('events.cancel');

    // Module 3: Digital ID Pass & QR Code
    Route::get('/profile/digital-id', [YouthProfileController::class, 'digitalId'])->name('profile.digital-id');

    // Youth Profile Information Editor
    Route::get('/profile/edit', [YouthProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile/update', [YouthProfileController::class, 'update'])->name('profile.update');

    // Module 3: Gamification & Badges
    Route::get('/badges', [YouthBadgeController::class, 'index'])->name('badges.index');
});

// 2. SK COUNCIL ADMIN DASHBOARD ROUTES
Route::middleware(['auth', 'sk.official'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'totalYouth' => YouthProfile::count(),
                'pendingVerification' => YouthProfile::where('verification_status', 'pending')->count(),
                'inSchoolYouth' => YouthProfile::where('youth_classification', 'In-School Youth')->count(),
                'outOfSchoolYouth' => YouthProfile::where('youth_classification', 'Out-of-School Youth')->count(),
                'workingYouth' => YouthProfile::where('youth_classification', 'Working Youth')->count(),
                'activeEvents' => Event::where('status', 'published')->count(),
            ],
        ]);
    })->name('dashboard');

    // Youth Registry CRM & Verification Queue
    Route::get('/registry', [YouthRegistryController::class, 'index'])->name('registry.index');
    Route::get('/registry/verification', [YouthRegistryController::class, 'verificationQueue'])->name('registry.verification');
    Route::post('/registry/{profile}/verify', [YouthRegistryController::class, 'verify'])->name('registry.verify');
    Route::post('/registry/{profile}/reject', [YouthRegistryController::class, 'reject'])->name('registry.reject');
    Route::delete('/registry/{profile}', [YouthRegistryController::class, 'destroy'])->name('registry.destroy');
    Route::get('/registry/export', [YouthRegistryController::class, 'export'])->name('registry.export');

    // Real-Time Needs Assessment & Analytics
    Route::get('/analytics', [AdminAnalyticsController::class, 'index'])->name('analytics.index');
    Route::get('/analytics/export', [AdminAnalyticsController::class, 'export'])->name('analytics.export');

    // Module 3: Event Management & Roster CRUD
    Route::get('/events', [AdminEventController::class, 'index'])->name('events.index');
    Route::get('/events/create', [AdminEventController::class, 'create'])->name('events.create');
    Route::post('/events', [AdminEventController::class, 'store'])->name('events.store');
    Route::get('/events/{event}', [AdminEventController::class, 'show'])->name('events.show');
    Route::put('/events/{event}', [AdminEventController::class, 'update'])->name('events.update');
    Route::patch('/events/{event}/status', [AdminEventController::class, 'updateStatus'])->name('events.update-status');
    Route::post('/events/{event}/broadcast', [AdminEventController::class, 'broadcast'])->name('events.broadcast');
    Route::delete('/events/{event}', [AdminEventController::class, 'destroy'])->name('events.destroy');

    // Roster Management inside Event Manage & Roster view
    Route::post('/events/{event}/roster', [AdminEventController::class, 'registerAttendee'])->name('events.roster.register');
    Route::patch('/events/{event}/roster/{registration}', [AdminEventController::class, 'updateAttendeeStatus'])->name('events.roster.update');
    Route::delete('/events/{event}/roster/{registration}', [AdminEventController::class, 'removeAttendee'])->name('events.roster.remove');

    // Module 3: QR Code Attendance Scanner & API Logging
    Route::get('/attendance/scanner', [AdminAttendanceController::class, 'scanner'])->name('attendance.scanner');
    Route::post('/attendance/scan', [AdminAttendanceController::class, 'scan'])->name('attendance.scan');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
