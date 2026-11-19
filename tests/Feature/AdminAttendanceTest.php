<?php

namespace Tests\Feature;

use App\Models\Event;
use App\Models\EventAttendance;
use App\Models\User;
use App\Models\YouthProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAttendanceTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $youthUser;

    private YouthProfile $youthProfile;

    private Event $event;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'sk_chairperson',
            'is_active' => true,
        ]);

        $this->youthUser = User::factory()->create([
            'role' => 'youth_member',
            'is_active' => true,
            'phone_number' => '09991234567',
        ]);

        $this->youthProfile = YouthProfile::create([
            'user_id' => $this->youthUser->id,
            'youth_code' => 'TIBAO-2026-00001',
            'first_name' => 'Maria',
            'last_name' => 'Santos',
            'gender' => 'Female',
            'birthdate' => '2004-05-15',
            'civil_status' => 'Single',
            'purok_sitio' => 'Purok 1',
            'youth_classification' => 'In-School Youth',
            'educational_attainment' => 'College Level',
            'work_status' => 'Unemployed',
            'is_registered_sk_voter' => true,
            'is_registered_national_voter' => true,
            'voted_last_sk_election' => false,
            'status' => 'verified',
            'xp_points' => 100,
        ]);

        $this->event = Event::create([
            'title' => 'Barangay Youth Summit 2026',
            'slug' => 'barangay-youth-summit-2026',
            'description' => 'Annual youth convention and leadership symposium.',
            'category' => 'Governance & Leadership',
            'venue' => 'Barangay Tibao Gym',
            'start_datetime' => now()->addHour(),
            'end_datetime' => now()->addHours(5),
            'status' => 'published',
            'points_reward' => 50,
            'created_by' => $this->admin->id,
        ]);
    }

    public function test_non_admin_cannot_access_scanner(): void
    {
        $response = $this->actingAs($this->youthUser)->get('/admin/attendance/scanner');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_scanner(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/attendance/scanner');
        $response->assertStatus(200);
    }

    public function test_can_scan_attendance_with_exact_youth_code(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/admin/attendance/scan', [
                'event_id' => $this->event->id,
                'code' => 'TIBAO-2026-00001',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'youth' => [
                    'code' => 'TIBAO-2026-00001',
                ],
            ]);

        $this->assertDatabaseHas('event_attendances', [
            'event_id' => $this->event->id,
            'user_id' => $this->youthUser->id,
        ]);

        $this->youthProfile->refresh();
        $this->assertEquals(150, $this->youthProfile->xp_points);
    }

    public function test_can_scan_attendance_with_lowercase_youth_code(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/admin/attendance/scan', [
                'event_id' => $this->event->id,
                'code' => 'tibao-2026-00001',
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_can_scan_attendance_with_embedded_url(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/admin/attendance/scan', [
                'event_id' => $this->event->id,
                'code' => 'https://skyims.onrender.com/passes/TIBAO-2026-00001?verify=true',
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_can_scan_attendance_with_json_payload(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/admin/attendance/scan', [
                'event_id' => $this->event->id,
                'code' => json_encode(['code' => 'TIBAO-2026-00001', 'ts' => time()]),
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    public function test_prevent_duplicate_attendance_checkin(): void
    {
        EventAttendance::create([
            'event_id' => $this->event->id,
            'user_id' => $this->youthUser->id,
            'scanned_by' => $this->admin->id,
            'scanned_at' => now(),
            'check_in_method' => 'QR_SCAN',
        ]);

        $response = $this->actingAs($this->admin)
            ->postJson('/admin/attendance/scan', [
                'event_id' => $this->event->id,
                'code' => 'TIBAO-2026-00001',
            ]);

        $response->assertStatus(409)
            ->assertJson([
                'success' => false,
                'already_attended' => true,
            ]);
    }

    public function test_scanning_unknown_code_returns_404(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/admin/attendance/scan', [
                'event_id' => $this->event->id,
                'code' => 'TIBAO-9999-99999',
            ]);

        $response->assertStatus(404)
            ->assertJson([
                'success' => false,
            ]);
    }
}
