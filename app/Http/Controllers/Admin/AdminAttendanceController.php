<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventAttendance;
use App\Models\EventRegistration;
use App\Models\User;
use App\Models\YouthProfile;
use App\Notifications\AttendanceConfirmedNotification;
use App\Services\GamificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminAttendanceController extends Controller
{
    /**
     * Display the on-site QR Code Attendance Scanner interface.
     */
    public function scanner(Request $request): Response
    {
        $events = Event::whereIn('status', ['published', 'ongoing'])
            ->orderBy('start_datetime')
            ->get();

        $selectedEventId = $request->input('event_id') ?: $events->first()?->id;

        $recentAttendances = [];
        if ($selectedEventId) {
            $recentAttendances = EventAttendance::with(['user.profile'])
                ->where('event_id', $selectedEventId)
                ->latest('scanned_at')
                ->take(10)
                ->get()
                ->map(function ($att) {
                    return [
                        'id' => $att->id,
                        'name' => $att->user?->name,
                        'youth_code' => $att->user?->profile?->youth_code,
                        'purok' => $att->user?->profile?->purok_sitio,
                        'scanned_at' => $att->scanned_at->format('h:i:s A'),
                        'method' => $att->check_in_method,
                    ];
                });
        }

        return Inertia::render('Admin/Attendance/Scanner', [
            'events' => $events,
            'selectedEventId' => (int) $selectedEventId,
            'recentAttendances' => $recentAttendances,
        ]);
    }

    /**
     * Process a scanned QR code to log youth attendance at the Barangay Gym/Hall.
     */
    public function scan(Request $request, GamificationService $gamification): JsonResponse|RedirectResponse
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'code' => 'required|string',
        ]);

        $eventId = $request->input('event_id');
        $rawCode = trim($request->input('code'));
        $event = Event::findOrFail($eventId);

        // Parse code: could be raw youth_code (e.g. TIBAO-2026-00001), JSON payload, URL, or ticket UUID
        $youthCode = $rawCode;
        if (str_starts_with($rawCode, '{') && str_ends_with($rawCode, '}')) {
            $parsed = json_decode($rawCode, true);
            if (! empty($parsed['code'])) {
                $youthCode = $parsed['code'];
            }
        }

        // Extract pattern TIBAO-YYYY-XXXXX if embedded inside a string or URL
        if (preg_match('/(TIBAO-\d{4}-\d{5})/i', $youthCode, $matches)) {
            $youthCode = strtoupper($matches[1]);
        }

        // 1. Locate Youth Profile
        $profile = YouthProfile::where('youth_code', $youthCode)
            ->orWhereRaw('UPPER(youth_code) = ?', [strtoupper($youthCode)])
            ->first();
        $user = null;

        if ($profile) {
            $user = $profile->user;
        } else {
            // Check if code was a ticket token
            $registration = EventRegistration::with('user.profile')
                ->where('ticket_token', $rawCode)
                ->first();

            if ($registration) {
                $user = $registration->user;
                $profile = $user?->profile;
            } else {
                // Check if searched by phone number or email
                $matchedUser = User::with('profile')
                    ->where('phone_number', $rawCode)
                    ->orWhere('email', strtolower($rawCode))
                    ->first();
                if ($matchedUser && $matchedUser->profile) {
                    $user = $matchedUser;
                    $profile = $matchedUser->profile;
                }
            }
        }

        if (! $profile || ! $user) {
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => "Invalid or unrecognized QR code ({$rawCode}). Youth not found in Katipunan ng Kabataan registry.",
                ], 404);
            }

            return back()->with('error', "Unrecognized QR code ({$rawCode}). Youth profile not found.");
        }

        // 2. Check if already checked in
        $alreadyAttended = EventAttendance::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();

        if ($alreadyAttended) {
            $timeStr = $alreadyAttended->scanned_at->format('h:i A');
            $msg = "{$profile->full_name} ({$profile->youth_code}) was already checked in at {$timeStr}!";

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'already_attended' => true,
                    'message' => $msg,
                    'youth' => [
                        'name' => $profile->full_name,
                        'code' => $profile->youth_code,
                        'purok' => $profile->purok_sitio,
                    ],
                ], 409);
            }

            return back()->with('warning', $msg);
        }

        // 3. Mark Registration or Create Walk-In Registration
        EventRegistration::updateOrCreate(
            ['event_id' => $event->id, 'user_id' => $user->id],
            [
                'ticket_token' => (string) Str::uuid(),
                'status' => 'attended',
            ]
        );

        // 4. Log Attendance Record
        EventAttendance::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'scanned_by' => auth()->id(),
            'scanned_at' => now(),
            'check_in_method' => 'QR_SCAN',
            'remarks' => "Verified at {$event->venue}",
        ]);

        // 5. Award Points
        $pointsReward = $event->points_reward ?: 50;
        $profile->increment('xp_points', $pointsReward);
        $profile->refresh();

        // 6. Evaluate and Award Badges
        $newBadges = $gamification->evaluateBadges($user);

        // 7. Trigger Notification Job / Alert
        try {
            $user->notify(new AttendanceConfirmedNotification($event, $pointsReward, $newBadges));
        } catch (\Throwable $e) {
            // Silently continue if mail fails in local test
        }

        $successMsg = "Verified! Attendance logged for {$profile->full_name} ({$profile->youth_code}). +{$pointsReward} XP credited!";

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => $successMsg,
                'youth' => [
                    'name' => $profile->full_name,
                    'code' => $profile->youth_code,
                    'purok' => $profile->purok_sitio,
                    'sector' => $profile->youth_classification,
                    'points_earned' => $pointsReward,
                    'total_xp' => $profile->xp_points,
                ],
                'new_badges' => $newBadges,
            ]);
        }

        return back()->with('success', $successMsg);
    }
}
