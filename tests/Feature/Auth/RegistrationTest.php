<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
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
}
