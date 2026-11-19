<?php

namespace App\Services;

use App\Models\Event;
use App\Models\SmsLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SmsService
{
    /**
     * Get the active SMS driver (e.g. 'log', 'semaphore', 'simulator').
     */
    public function getDriver(): string
    {
        return config('services.sms.driver', env('SMS_DRIVER', 'log'));
    }

    /**
     * Normalize a Philippine phone number into standard 09XXXXXXXXX or +639XXXXXXXXX.
     */
    public function normalizePhoneNumber(string $phone): string
    {
        $cleaned = preg_replace('/[^\d+]/', '', $phone);

        if (str_starts_with($cleaned, '+63')) {
            return '0'.substr($cleaned, 3);
        }

        if (str_starts_with($cleaned, '63') && strlen($cleaned) === 12) {
            return '0'.substr($cleaned, 2);
        }

        if (str_starts_with($cleaned, '9') && strlen($cleaned) === 10) {
            return '0'.$cleaned;
        }

        return $cleaned;
    }

    /**
     * Validate whether a phone number matches Philippine mobile format.
     */
    public function isValidPhilippineMobile(string $phone): bool
    {
        $normalized = $this->normalizePhoneNumber($phone);

        return (bool) preg_match('/^09\d{9}$/', $normalized);
    }

    /**
     * Format a standard SK Tibao SMS alert message for an event.
     */
    public function formatEventMessage(Event $event, ?string $customNote = null): string
    {
        $date = $event->start_datetime->format('M d g:i A');
        $note = $customNote ? " Note: {$customNote}" : '';

        return "[SK TIBAO ALERT] {$event->title} on {$date} at {$event->venue}. Reward: +{$event->points_reward} XP. Present your Digital QR Pass for attendance.{$note}";
    }

    /**
     * Send a single SMS to a recipient.
     */
    public function send(
        string $phoneNumber,
        string $message,
        ?string $recipientName = null,
        ?int $userId = null,
        ?int $eventId = null
    ): array {
        $normalizedPhone = $this->normalizePhoneNumber($phoneNumber);
        $driver = $this->getDriver();
        $apiKey = config('services.semaphore.api_key', env('SEMAPHORE_API_KEY'));
        $senderName = config('services.semaphore.sender_name', env('SEMAPHORE_SENDER_NAME', 'SKYIMS'));

        // If configured to use Semaphore and API key is present
        if ($driver === 'semaphore' && ! empty($apiKey)) {
            try {
                $response = Http::timeout(10)->asForm()->post('https://api.semaphore.co/api/v4/messages', [
                    'apikey' => $apiKey,
                    'number' => $normalizedPhone,
                    'message' => $message,
                    'sendername' => $senderName,
                ]);

                $success = $response->successful();
                $body = $response->json() ?? ['raw' => $response->body()];

                SmsLog::create([
                    'event_id' => $eventId,
                    'user_id' => $userId,
                    'recipient_name' => $recipientName ?? 'Youth Member',
                    'recipient_phone' => $normalizedPhone,
                    'message' => $message,
                    'gateway' => 'semaphore',
                    'status' => $success ? 'sent' : 'failed',
                    'response_details' => json_encode($body),
                ]);

                Log::info("[SEMAPHORE SMS] Dispatched to {$normalizedPhone}: ".($success ? 'SUCCESS' : 'FAILED'));

                return [
                    'success' => $success,
                    'driver' => 'semaphore',
                    'recipient' => $normalizedPhone,
                    'response' => $body,
                ];
            } catch (\Throwable $e) {
                Log::error("[SEMAPHORE SMS ERROR] {$e->getMessage()}");

                SmsLog::create([
                    'event_id' => $eventId,
                    'user_id' => $userId,
                    'recipient_name' => $recipientName ?? 'Youth Member',
                    'recipient_phone' => $normalizedPhone,
                    'message' => $message,
                    'gateway' => 'semaphore',
                    'status' => 'failed',
                    'response_details' => json_encode(['error' => $e->getMessage()]),
                ]);

                return [
                    'success' => false,
                    'driver' => 'semaphore',
                    'recipient' => $normalizedPhone,
                    'error' => $e->getMessage(),
                ];
            }
        }

        // Default: Local Simulator & Audit Logger (Zero Cost Development Mode)
        Log::channel('single')->info("[SMS GATEWAY SIMULATOR - BARANGAY TIBAO] Sent SMS to {$normalizedPhone} ({$recipientName}): \"{$message}\"");

        SmsLog::create([
            'event_id' => $eventId,
            'user_id' => $userId,
            'recipient_name' => $recipientName ?? 'Youth Member',
            'recipient_phone' => $normalizedPhone,
            'message' => $message,
            'gateway' => 'simulator',
            'status' => 'simulated',
            'response_details' => json_encode([
                'mode' => 'local_simulation',
                'timestamp' => now()->toIso8601String(),
                'char_count' => mb_strlen($message),
                'note' => 'Simulated successfully in local development environment.',
            ]),
        ]);

        return [
            'success' => true,
            'driver' => 'simulator',
            'recipient' => $normalizedPhone,
            'status' => 'simulated',
        ];
    }

    /**
     * Send bulk SMS alerts to a collection of users.
     */
    public function sendBulk(
        $recipients,
        string $message,
        ?int $eventId = null
    ): array {
        $stats = [
            'total' => 0,
            'sent' => 0,
            'failed' => 0,
            'simulated' => 0,
        ];

        foreach ($recipients as $recipient) {
            $phone = is_array($recipient) ? ($recipient['phone_number'] ?? null) : ($recipient->phone_number ?? null);
            $name = is_array($recipient) ? ($recipient['name'] ?? null) : ($recipient->name ?? null);
            $userId = is_array($recipient) ? ($recipient['id'] ?? null) : ($recipient->id ?? null);

            if (! $phone) {
                continue;
            }

            $stats['total']++;
            $result = $this->send($phone, $message, $name, $userId, $eventId);

            if ($result['driver'] === 'simulator') {
                $stats['simulated']++;
            } elseif (! empty($result['success'])) {
                $stats['sent']++;
            } else {
                $stats['failed']++;
            }
        }

        return $stats;
    }
}
