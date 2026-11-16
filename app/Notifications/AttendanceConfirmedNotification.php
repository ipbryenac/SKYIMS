<?php

namespace App\Notifications;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AttendanceConfirmedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Event $event,
        public int $pointsEarned,
        public array $newBadges = []
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject("🎉 Attendance Logged: {$this->event->title}")
            ->greeting("Mabuhay, {$notifiable->name}!")
            ->line("Your attendance was successfully verified and logged by the Sangguniang Kabataan Council at {$this->event->venue}.")
            ->line("**Activity:** {$this->event->title}")
            ->line("**Participation XP Earned:** +{$this->pointsEarned} XP");

        if (!empty($this->newBadges)) {
            $badgeNames = implode(', ', $this->newBadges);
            $mail->line("🏆 **Congratulations! You unlocked new badges:** {$badgeNames}!");
        }

        return $mail
            ->action('View My Digital ID & Badges', url('/youth/badges'))
            ->line('Thank you for being an active Katipunan ng Kabataan member of Barangay Tibao!');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'event_id' => $this->event->id,
            'title' => $this->event->title,
            'points_earned' => $this->pointsEarned,
            'new_badges' => $this->newBadges,
            'logged_at' => now()->toIso8601String(),
        ];
    }
}

