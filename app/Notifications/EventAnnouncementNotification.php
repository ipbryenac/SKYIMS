<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EventAnnouncementNotification extends Notification
{
    use Queueable;

    public string $customMessage;

    public function __construct(
        public Event $event,
        ?string $customMessage = null
    ) {
        $this->customMessage = $customMessage ?? '';
    }

    public function via(object $notifiable): array
    {
        // Use mail and database channels
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $venue = $this->event->venue;
        $date = $this->event->start_datetime->format('F d, Y \a\t g:i A');

        return (new MailMessage)
            ->subject("📢 SK Tibao Announcement: {$this->event->title}")
            ->greeting("Hello {$notifiable->name}!")
            ->line('The Sangguniang Kabataan Council of Barangay Tibao invites you to attend an upcoming youth activity:')
            ->line("**Event:** {$this->event->title}")
            ->line("**Category:** {$this->event->category}")
            ->line("**Venue:** {$venue}")
            ->line("**Schedule:** {$date}")
            ->line("**Participation Reward:** +{$this->event->points_reward} XP")
            ->line($this->customMessage ?: "Don't forget to present your Digital Pass QR Code at the Barangay Gym entrance for attendance logging!")
            ->action('View Event & Register', url('/youth/events'))
            ->line('Padayon sa Pagserbisyo sa Kabataan ng Barangay Tibao!');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'event_id' => $this->event->id,
            'title' => $this->event->title,
            'category' => $this->event->category,
            'venue' => $this->event->venue,
            'start_datetime' => $this->event->start_datetime->toIso8601String(),
            'points_reward' => $this->event->points_reward,
            'message' => $this->customMessage ?: 'Upcoming SK community event in Barangay Tibao.',
        ];
    }
}
