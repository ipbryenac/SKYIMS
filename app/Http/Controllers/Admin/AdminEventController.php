<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\SendEventBroadcastNotificationJob;
use App\Models\Event;
use App\Models\EventAttendance;
use App\Models\EventRegistration;
use App\Models\SmsLog;
use App\Models\User;
use App\Services\GamificationService;
use App\Services\SmsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminEventController extends Controller
{
    /**
     * Display all community events for SK Council management.
     */
    public function index(): Response
    {
        Event::syncStatuses();

        $events = Event::withCount(['registrations', 'attendances'])
            ->latest('start_datetime')
            ->paginate(12)
            ->through(function ($e) {
                return [
                    'id' => $e->id,
                    'title' => $e->title,
                    'slug' => $e->slug,
                    'category' => $e->category,
                    'venue' => $e->venue,
                    'start_datetime' => $e->start_datetime->format('M d, Y g:i A'),
                    'end_datetime' => $e->end_datetime->format('M d, Y g:i A'),
                    'capacity' => $e->capacity,
                    'points_reward' => $e->points_reward,
                    'status' => $e->status,
                    'registrations_count' => $e->registrations_count,
                    'attendances_count' => $e->attendances_count,
                ];
            });

        return Inertia::render('Admin/Events/Index', [
            'events' => $events,
        ]);
    }

    /**
     * Show form to create a new SK activity.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Events/Create', [
            'categories' => [
                'Global Mobility & Sports/Culture',
                'Governance & Leadership',
                'Economic Empowerment & Livelihood',
                'Environment & Climate Action',
                'Health & Mental Health',
                'Education',
                'Active Citizenship',
                'Peace-building & Security',
                'Social Inclusion & Gender Equality',
            ],
        ]);
    }

    /**
     * Store a newly created event.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'venue' => 'required|string|max:255',
            'start_datetime' => 'required|date',
            'end_datetime' => 'required|date|after:start_datetime',
            'capacity' => 'nullable|integer|min:1',
            'points_reward' => 'required|integer|min:10|max:500',
            'status' => 'required|in:draft,published,ongoing,completed',
        ]);

        $validated['slug'] = Str::slug($validated['title']) . '-' . rand(100, 999);
        $validated['created_by'] = auth()->id();

        $event = Event::create($validated);

        // If published immediately, dispatch broadcast job
        if ($event->status === 'published') {
            SendEventBroadcastNotificationJob::dispatch($event);
        }

        return redirect()->route('admin.events.index')
            ->with('success', "Event '{$event->title}' has been successfully created and saved.");
    }

    /**
     * Show event attendees and registration roster.
     */
    public function show(Event $event): Response
    {
        Event::syncStatuses();
        $event->refresh();

        $registrations = EventRegistration::with(['user.profile'])
            ->where('event_id', $event->id)
            ->latest()
            ->paginate(20)
            ->through(function ($r) {
                return [
                    'id' => $r->id,
                    'user_id' => $r->user_id,
                    'ticket_token' => $r->ticket_token,
                    'status' => $r->status,
                    'registered_at' => $r->created_at->format('M d, Y h:i A'),
                    'user_name' => $r->user?->name,
                    'youth_code' => $r->user?->profile?->youth_code,
                    'purok' => $r->user?->profile?->purok_sitio,
                    'sector' => $r->user?->profile?->youth_classification,
                    'contact' => $r->user?->phone_number,
                ];
            });

        $smsLogs = SmsLog::where('event_id', $event->id)
            ->latest()
            ->take(20)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'recipient_name' => $log->recipient_name,
                    'recipient_phone' => $log->recipient_phone,
                    'message' => $log->message,
                    'gateway' => $log->gateway,
                    'status' => $log->status,
                    'created_at' => $log->created_at->format('M d, Y h:i A'),
                ];
            });

        $smsService = new SmsService();

        // Youth available to add to roster (not yet registered)
        $availableYouth = User::where('role', 'youth_member')
            ->with('profile')
            ->whereDoesntHave('eventRegistrations', function ($q) use ($event) {
                $q->where('event_id', $event->id);
            })
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'youth_code' => $u->profile?->youth_code ?? 'TIBAO-KK',
                    'purok' => $u->profile?->purok_sitio ?? 'Barangay Tibao',
                    'sector' => $u->profile?->youth_classification ?? 'Youth Member',
                    'contact' => $u->phone_number,
                ];
            });

        $categories = [
            'Global Mobility & Sports/Culture',
            'Governance & Leadership',
            'Economic Empowerment & Livelihood',
            'Environment & Climate Action',
            'Health & Mental Health',
            'Education',
            'Active Citizenship',
            'Peace-building & Security',
            'Social Inclusion & Gender Equality',
        ];

        return Inertia::render('Admin/Events/Show', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'description' => $event->description,
                'category' => $event->category,
                'venue' => $event->venue,
                'start_datetime' => $event->start_datetime->format('Y-m-d\TH:i'),
                'end_datetime' => $event->end_datetime->format('Y-m-d\TH:i'),
                'start_formatted' => $event->start_datetime->format('M d, Y g:i A'),
                'end_formatted' => $event->end_datetime->format('M d, Y g:i A'),
                'capacity' => $event->capacity,
                'points_reward' => $event->points_reward,
                'status' => $event->status,
            ],
            'registrations' => $registrations,
            'attendancesCount' => $event->attendances()->count(),
            'smsLogs' => $smsLogs,
            'totalYouthCount' => User::where('role', 'youth_member')->count(),
            'youthWithPhonesCount' => User::where('role', 'youth_member')->whereNotNull('phone_number')->where('phone_number', '!=', '')->count(),
            'smsDriver' => $smsService->getDriver(),
            'defaultSmsPreview' => $smsService->formatEventMessage($event),
            'availableYouth' => $availableYouth,
            'categories' => $categories,
        ]);
    }

    /**
     * Update existing event details.
     */
    public function update(Request $request, Event $event): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'venue' => 'required|string|max:255',
            'start_datetime' => 'required|date',
            'end_datetime' => 'required|date|after:start_datetime',
            'capacity' => 'nullable|integer|min:1',
            'points_reward' => 'required|integer|min:10|max:500',
            'status' => 'required|in:draft,published,ongoing,completed,cancelled',
        ]);

        $oldStatus = $event->status;
        $event->update($validated);

        // If newly published, dispatch SMS broadcast
        if ($oldStatus !== 'published' && $event->status === 'published') {
            SendEventBroadcastNotificationJob::dispatch($event);
        }

        return back()->with('success', "Event '{$event->title}' has been successfully updated.");
    }

    /**
     * Quick status update for an event.
     */
    public function updateStatus(Request $request, Event $event): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,published,ongoing,completed,cancelled',
        ]);

        $event->update(['status' => $validated['status']]);

        return back()->with('success', "Event status changed to " . strtoupper($validated['status']) . ".");
    }

    /**
     * Manually add an attendee to the event roster.
     */
    public function registerAttendee(Request $request, Event $event, GamificationService $gamification): RedirectResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'status' => 'nullable|in:registered,attended',
        ]);

        // Check duplicate
        $exists = EventRegistration::where('event_id', $event->id)
            ->where('user_id', $request->user_id)
            ->exists();

        if ($exists) {
            return back()->with('error', 'This youth is already listed in the registration roster.');
        }

        // Check capacity
        if ($event->capacity && $event->registrations()->count() >= $event->capacity) {
            return back()->with('error', "Cannot add attendee. Event capacity ({$event->capacity}) has been reached.");
        }

        $regStatus = $request->input('status', 'registered');

        $registration = EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $request->user_id,
            'ticket_token' => Str::uuid()->toString(),
            'status' => $regStatus,
        ]);

        // If marked attended immediately, record attendance & XP
        if ($regStatus === 'attended') {
            EventAttendance::updateOrCreate(
                ['event_id' => $event->id, 'user_id' => $request->user_id],
                [
                    'scanned_by' => auth()->id(),
                    'scanned_at' => now(),
                    'check_in_method' => 'MANUAL_ENTRY',
                    'remarks' => 'Manual roster walk-in check-in by SK Official',
                ]
            );

            $user = User::with('profile')->find($request->user_id);
            if ($user && $user->profile) {
                $user->profile->increment('xp_points', $event->points_reward);
                $gamification->evaluateBadges($user);
            }
        }

        return back()->with('success', 'Youth successfully added to the attendee roster!');
    }

    /**
     * Update an attendee's status on the roster (e.g. registered, attended, cancelled).
     */
    public function updateAttendeeStatus(Request $request, Event $event, EventRegistration $registration, GamificationService $gamification): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:registered,attended,cancelled,no_show',
        ]);

        $oldStatus = $registration->status;
        $newStatus = $validated['status'];

        $registration->update(['status' => $newStatus]);

        $user = User::with('profile')->find($registration->user_id);

        // If transitioned to 'attended'
        if ($newStatus === 'attended' && $oldStatus !== 'attended') {
            EventAttendance::updateOrCreate(
                ['event_id' => $event->id, 'user_id' => $registration->user_id],
                [
                    'scanned_by' => auth()->id(),
                    'scanned_at' => now(),
                    'check_in_method' => 'MANUAL_ENTRY',
                    'remarks' => 'Verified present via SK Admin Roster',
                ]
            );

            if ($user && $user->profile) {
                $user->profile->increment('xp_points', $event->points_reward);
                $gamification->evaluateBadges($user);
            }
        }

        // If transitioned away from 'attended'
        if ($oldStatus === 'attended' && $newStatus !== 'attended') {
            EventAttendance::where('event_id', $event->id)
                ->where('user_id', $registration->user_id)
                ->delete();

            if ($user && $user->profile) {
                $user->profile->decrement('xp_points', min($event->points_reward, $user->profile->xp_points));
            }
        }

        return back()->with('success', "Attendee status changed to " . strtoupper($newStatus) . ".");
    }

    /**
     * Remove an attendee registration from the event roster.
     */
    public function removeAttendee(Event $event, EventRegistration $registration): RedirectResponse
    {
        if ($registration->status === 'attended') {
            EventAttendance::where('event_id', $event->id)
                ->where('user_id', $registration->user_id)
                ->delete();

            $user = User::with('profile')->find($registration->user_id);
            if ($user && $user->profile) {
                $user->profile->decrement('xp_points', min($event->points_reward, $user->profile->xp_points));
            }
        }

        $registration->delete();

        return back()->with('success', 'Attendee was removed from the event roster.');
    }

    /**
     * Send email/SMS alert broadcast to Katipunan ng Kabataan members.
     */
    public function broadcast(Request $request, Event $event): RedirectResponse
    {
        $message = $request->input('message') ?: null;
        $targetAudience = $request->input('target_audience', 'all');
        $channel = $request->input('channel', 'both');

        // Execute broadcast synchronously so admin immediately sees real-time SMS & email results
        SendEventBroadcastNotificationJob::dispatchSync($event, $message, $targetAudience, $channel);

        return back()->with('success', "Broadcast alerts successfully processed! Dispatched via {$channel} to target audience. View details in the SMS Log tab below.");
    }

    /**
     * Delete an event.
     */
    public function destroy(Event $event): RedirectResponse
    {
        $title = $event->title;
        $event->delete();

        return redirect()->route('admin.events.index')
            ->with('success', "Event '{$title}' was successfully deleted.");
    }
}

