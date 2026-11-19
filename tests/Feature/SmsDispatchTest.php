<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\SmsLog;
use App\Models\User;
use App\Models\YouthProfile;
use App\Services\SmsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SmsDispatchTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $youth;

    private Event $event;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'sk_chairperson',
            'is_active' => true,
        ]);

        $this->youth = User::factory()->create([
            'role' => 'youth_member',
            'phone_number' => '09171234567',
            'is_active' => true,
        ]);

        YouthProfile::create([
            'user_id' => $this->youth->id,
            'youth_code' => 'TIBAO-2026-00001',
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'gender' => 'Male',
            'birthdate' => '2005-01-01',
            'civil_status' => 'Single',
            'purok_sitio' => 'Purok 1',
            'youth_classification' => 'In-School Youth',
            'educational_attainment' => 'College Level',
            'work_status' => 'Unemployed',
            'is_registered_sk_voter' => true,
            'is_registered_national_voter' => true,
            'voted_last_sk_election' => false,
            'status' => 'verified',
        ]);

        $this->event = Event::create([
            'title' => 'Tree Planting Drive',
            'slug' => 'tree-planting-drive',
            'description' => 'Plant 500 seedlings along the riverbank.',
            'category' => 'Environment & Climate Action',
            'venue' => 'Sitio Crossing Riverside',
            'start_datetime' => now()->addDays(3),
            'end_datetime' => now()->addDays(3)->addHours(4),
            'points_reward' => 80,
            'status' => 'published',
            'created_by' => $this->admin->id,
        ]);
    }

    public function test_sms_service_normalizes_philippine_phone_numbers(): void
    {
        $service = new SmsService;

        $this->assertEquals('09171234567', $service->normalizePhoneNumber('09171234567'));
        $this->assertEquals('09171234567', $service->normalizePhoneNumber('+639171234567'));
        $this->assertEquals('09171234567', $service->normalizePhoneNumber('639171234567'));
        $this->assertEquals('09171234567', $service->normalizePhoneNumber('9171234567'));
        $this->assertTrue($service->isValidPhilippineMobile('+639171234567'));
    }

    public function test_simulator_mode_creates_sms_log_without_external_call(): void
    {
        $service = new SmsService;

        $result = $service->send(
            phoneNumber: '09171234567',
            message: 'Test simulated announcement',
            recipientName: 'Juan Dela Cruz',
            userId: $this->youth->id,
            eventId: $this->event->id
        );

        $this->assertTrue($result['success']);
        $this->assertEquals('simulator', $result['driver']);

        $this->assertDatabaseHas('sms_logs', [
            'event_id' => $this->event->id,
            'recipient_phone' => '09171234567',
            'gateway' => 'simulator',
            'status' => 'simulated',
        ]);
    }

    public function test_admin_can_broadcast_sms_alert_from_dashboard(): void
    {
        $response = $this->actingAs($this->admin)->post(
            "/admin/events/{$this->event->id}/broadcast",
            [
                'message' => 'Please bring work gloves and wear boots!',
                'target_audience' => 'all',
                'channel' => 'sms',
            ]
        );

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('sms_logs', [
            'event_id' => $this->event->id,
            'recipient_phone' => '09171234567',
            'status' => 'simulated',
        ]);

        $log = SmsLog::where('event_id', $this->event->id)->latest()->first();
        $this->assertStringContainsString('Tree Planting Drive', $log->message);
        $this->assertStringContainsString('Please bring work gloves', $log->message);
    }

    public function test_semaphore_mode_dispatches_http_request(): void
    {
        Http::fake([
            'https://api.semaphore.co/api/v4/messages' => Http::response([
                'message_id' => '12345678',
                'user_id' => 1,
                'status' => 'Queued',
            ], 200),
        ]);

        config([
            'services.sms.driver' => 'semaphore',
            'services.semaphore.api_key' => 'test_api_key_123',
            'services.semaphore.sender_name' => 'SKYIMS',
        ]);

        $service = new SmsService;
        $result = $service->send(
            phoneNumber: '09171234567',
            message: 'Live Semaphore Test',
            recipientName: 'Juan Dela Cruz',
            userId: $this->youth->id,
            eventId: $this->event->id
        );

        $this->assertTrue($result['success']);
        $this->assertEquals('semaphore', $result['driver']);

        $this->assertDatabaseHas('sms_logs', [
            'event_id' => $this->event->id,
            'recipient_phone' => '09171234567',
            'gateway' => 'semaphore',
            'status' => 'sent',
        ]);
    }
}
