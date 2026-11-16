<?php

namespace App\Jobs;

use App\Models\Event;
use App\Models\User;
use App\Notifications\EventAnnouncementNotification;
use App\Services\SmsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendEventBroadcastNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public string $customMessage;

    public function __construct(
        public Event $event,
        ?string $customMessage = null,
        public string $targetAudience = 'all', // 'all', 'registered', or 'purok:X'
        public string $channel = 'both' // 'both', 'sms', 'email'
    ) {
        $this->customMessage = $customMessage ?? '';
    }

    public function handle(SmsService $smsService): void
    {
        // 1. Determine Target Recipients
        $query = User::where('role', 'youth_member');

        if ($this->targetAudience === 'registered') {
            $registeredUserIds = $this->event->registrations()->pluck('user_id');
            $query->whereIn('id', $registeredUserIds);
        } elseif (str_starts_with($this->targetAudience, 'purok:')) {
            $purok = substr($this->targetAudience, 6);
            $query->whereHas('profile', function ($q) use ($purok) {
                $q->where('purok_sitio', $purok);
            });
        }

        $recipients = $query->with('profile')->get();

        Log::info("Broadcast starting for: '{$this->event->title}' to {$recipients->count()} recipients via channel '{$this->channel}' (Audience: {$this->targetAudience}).");

        $smsCount = 0;
        $emailCount = 0;

        foreach ($recipients as $user) {
            // Channel: Email & In-app Notification
            if (in_array($this->channel, ['both', 'email'])) {
                try {
                    $user->notify(new EventAnnouncementNotification($this->event, $this->customMessage));
                    $emailCount++;
                } catch (\Throwable $e) {
                    Log::warning("Notification failed for user {$user->id}: " . $e->getMessage());
                }
            }

            // Channel: SMS Alert
            if (in_array($this->channel, ['both', 'sms']) && $user->phone_number) {
                try {
                    $smsText = $smsService->formatEventMessage($this->event, $this->customMessage);
                    $smsService->send(
                        phoneNumber: $user->phone_number,
                        message: $smsText,
                        recipientName: $user->name,
                        userId: $user->id,
                        eventId: $this->event->id
                    );
                    $smsCount++;
                } catch (\Throwable $e) {
                    Log::error("SMS dispatch failed for user {$user->id} ({$user->phone_number}): " . $e->getMessage());
                }
            }
        }

        Log::info("Broadcast completed for '{$this->event->title}': {$emailCount} emails/notifications and {$smsCount} SMS alerts processed.");
    }
}
