<?php

namespace App\Http\Controllers\Youth;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class YouthEventController extends Controller
{
    /**
     * Display the Activity Event Board with CBYDP categories.
     */
    public function index(Request $request): Response
    {
        Event::syncStatuses();

        $user = auth()->user()->load('profile');
        $category = $request->input('category');
        $tab = $request->input('tab', 'all'); // 'all' or 'registered'

        $query = Event::withCount('registrations')
            ->whereIn('status', ['published', 'ongoing'])
            ->orderBy('start_datetime');

        if ($category) {
            $query->where('category', $category);
        }

        if ($tab === 'registered') {
            $query->whereHas('registrations', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $events = $query->paginate(9)->through(function ($event) use ($user) {
            $reg = EventRegistration::where('event_id', $event->id)
                ->where('user_id', $user->id)
                ->first();

            return [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'description' => $event->description,
                'category' => $event->category,
                'venue' => $event->venue,
                'start_datetime' => $event->start_datetime->toIso8601String(),
                'end_datetime' => $event->end_datetime->toIso8601String(),
                'registration_deadline' => $event->registration_deadline?->toIso8601String(),
                'capacity' => $event->capacity,
                'points_reward' => $event->points_reward,
                'registrations_count' => $event->registrations_count,
                'is_registered' => $reg !== null,
                'ticket_token' => $reg?->ticket_token,
                'attendance_status' => $reg?->status,
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

        return Inertia::render('Youth/Events/Index', [
            'events' => $events,
            'categories' => $categories,
            'activeCategory' => $category,
            'activeTab' => $tab,
            'youthProfile' => $user->profile,
        ]);
    }

    /**
     * Join / Register directly for an upcoming SK activity.
     */
    public function register(Request $request, Event $event): RedirectResponse
    {
        $user = auth()->user();

        // Check if already registered
        $existing = EventRegistration::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            return back()->with('warning', 'You are already registered for this event.');
        }

        // Check capacity
        if ($event->capacity && $event->registrations()->count() >= $event->capacity) {
            return back()->with('error', 'Sorry, this event has already reached its maximum participant capacity.');
        }

        // Create registration pass with UUID ticket token
        $reg = EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $user->id,
            'ticket_token' => (string) Str::uuid(),
            'status' => 'registered',
        ]);

        return back()->with('success', "Success! You are now registered for {$event->title}. Present your Digital Pass QR at the venue to earn +{$event->points_reward} XP!");
    }

    /**
     * Cancel an event registration.
     */
    public function cancel(Request $request, Event $event): RedirectResponse
    {
        $user = auth()->user();

        EventRegistration::where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->delete();

        return back()->with('success', "Your registration for {$event->title} has been cancelled.");
    }
}
