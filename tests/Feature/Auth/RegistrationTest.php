<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'email' => 'juan.delacruz@example.com',
            'phone_number' => '09171234567',
            'password' => 'password',
            'password_confirmation' => 'password',
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
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertAuthenticated();
        $response->assertRedirect(route('youth.dashboard', absolute: false));
    }

    public function test_new_users_can_register_with_id_photo_upload(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('student_id.jpg', 500, 'image/jpeg');

        $response = $this->post('/register', [
            'first_name' => 'Maria',
            'last_name' => 'Santos',
            'email' => 'maria.santos@example.com',
            'phone_number' => '09181234567',
            'password' => 'password',
            'password_confirmation' => 'password',
            'gender' => 'Female',
            'birthdate' => '2004-05-15',
            'civil_status' => 'Single',
            'purok_sitio' => 'Purok 2',
            'youth_classification' => 'In-School Youth',
            'educational_attainment' => 'College Level',
            'work_status' => 'Unemployed',
            'id_type' => 'Student ID (School / College ID)',
            'id_photo' => $file,
            'is_registered_sk_voter' => true,
            'is_registered_national_voter' => false,
            'voted_last_sk_election' => false,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertAuthenticated();
        $response->assertRedirect(route('youth.dashboard', absolute: false));

        $user = User::where('email', 'maria.santos@example.com')->first();
        $this->assertNotNull($user->profile->id_photo_path);
        Storage::disk('public')->assertExists($user->profile->id_photo_path);
    }

    public function test_new_users_can_register_when_id_photo_is_null_string(): void
    {
        $response = $this->post('/register', [
            'first_name' => 'Pedro',
            'last_name' => 'Penduko',
            'email' => 'pedro@example.com',
            'phone_number' => '09191234567',
            'password' => 'password',
            'password_confirmation' => 'password',
            'gender' => 'Male',
            'birthdate' => '2003-03-20',
            'civil_status' => 'Single',
            'purok_sitio' => 'Purok 3',
            'youth_classification' => 'Working Youth',
            'educational_attainment' => 'Vocational Course',
            'work_status' => 'Employed',
            'id_type' => 'Postal ID',
            'id_photo' => 'null',
            'is_registered_sk_voter' => true,
            'is_registered_national_voter' => true,
            'voted_last_sk_election' => true,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertAuthenticated();
        $response->assertRedirect(route('youth.dashboard', absolute: false));
    }
}
