<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\YouthProfile;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class YouthProfilesSeeder extends Seeder
{
    /**
     * Run the youth profiling seeds.
     */
    public function run(): void
    {
        $mockYouth = [
            // 1. Child Youth (15-17) - In-School
            [
                'first_name' => 'Alyssa',
                'middle_name' => 'Reyes',
                'last_name' => 'Alcantara',
                'email' => 'alyssa.alcantara@gmail.com',
                'phone' => '09171110001',
                'birthdate' => Carbon::today()->subYears(16)->subMonths(3)->format('Y-m-d'),
                'gender' => 'Female',
                'purok' => 'Purok 1',
                'classification' => 'In-School Youth',
                'education' => 'Senior High Level',
                'work' => 'Not Applicable',
                'status' => 'verified',
                'id_type' => 'Tibao High School Student ID',
            ],
            // 2. Child Youth (15-17) - Out-of-School - Pending Queue
            [
                'first_name' => 'Mark Jason',
                'middle_name' => 'Bautista',
                'last_name' => 'Dela Cruz',
                'email' => 'mark.jason@gmail.com',
                'phone' => '09171110002',
                'birthdate' => Carbon::today()->subYears(17)->subMonths(1)->format('Y-m-d'),
                'gender' => 'Male',
                'purok' => 'Purok 3',
                'classification' => 'Out-of-School Youth',
                'education' => 'High School Level',
                'work' => 'Looking for Job',
                'status' => 'pending',
                'id_type' => 'Barangay Tibao Residency Certificate',
            ],
            // 3. Core Youth (18-24) - Working Youth - Verified
            [
                'first_name' => 'John Lloyd',
                'middle_name' => 'Gomez',
                'last_name' => 'Villanueva',
                'email' => 'johnlloyd.v@gmail.com',
                'phone' => '09171110003',
                'birthdate' => Carbon::today()->subYears(21)->subMonths(5)->format('Y-m-d'),
                'gender' => 'Male',
                'purok' => 'Purok 2',
                'classification' => 'Working Youth',
                'education' => 'College Level',
                'work' => 'Employed',
                'status' => 'verified',
                'id_type' => 'PhilSys National ID',
            ],
            // 4. Core Youth (18-24) - In-School - Pending Queue
            [
                'first_name' => 'Maria Christine',
                'middle_name' => 'Tan',
                'last_name' => 'Salazar',
                'email' => 'christine.salazar@gmail.com',
                'phone' => '09171110004',
                'birthdate' => Carbon::today()->subYears(19)->subMonths(8)->format('Y-m-d'),
                'gender' => 'Female',
                'purok' => 'Purok 4',
                'classification' => 'In-School Youth',
                'education' => 'College Level',
                'work' => 'Not Applicable',
                'status' => 'pending',
                'id_type' => 'University Student ID',
            ],
            // 5. Core Youth (18-24) - Out-of-School - Pending Queue
            [
                'first_name' => 'Kenneth Ray',
                'middle_name' => 'Lopez',
                'last_name' => 'Aquino',
                'email' => 'kenneth.aquino@gmail.com',
                'phone' => '09171110005',
                'birthdate' => Carbon::today()->subYears(23)->subMonths(2)->format('Y-m-d'),
                'gender' => 'Male',
                'purok' => 'Purok 5',
                'classification' => 'Out-of-School Youth',
                'education' => 'Senior High Graduate',
                'work' => 'Unemployed',
                'status' => 'pending',
                'id_type' => 'Barangay Certificate',
            ],
            // 6. Young Adult (25-30) - Working Youth - Verified
            [
                'first_name' => 'Bea Rose',
                'middle_name' => 'Castillo',
                'last_name' => 'Montemayor',
                'email' => 'bea.montemayor@gmail.com',
                'phone' => '09171110006',
                'birthdate' => Carbon::today()->subYears(27)->subMonths(6)->format('Y-m-d'),
                'gender' => 'Female',
                'purok' => 'Purok 6',
                'classification' => 'Working Youth',
                'education' => 'College Graduate',
                'work' => 'Self-Employed',
                'status' => 'verified',
                'id_type' => 'PRC Professional ID',
            ],
            // 7. Young Adult (25-30) - Specific Needs (PWD / IP) - Pending Queue
            [
                'first_name' => 'Daniel',
                'middle_name' => 'Datu',
                'last_name' => 'Ampatuan',
                'email' => 'daniel.ampatuan@gmail.com',
                'phone' => '09171110007',
                'birthdate' => Carbon::today()->subYears(26)->subMonths(10)->format('Y-m-d'),
                'gender' => 'Male',
                'purok' => 'Sitio Crossing',
                'classification' => 'Youth with Specific Needs',
                'education' => 'High School Graduate',
                'work' => 'Self-Employed',
                'status' => 'pending',
                'id_type' => 'Indigenous Peoples / PWD ID',
            ],
            // 8. Child Youth (15-17) - In-School - Verified
            [
                'first_name' => 'Joshua',
                'middle_name' => 'Soriano',
                'last_name' => 'Padilla',
                'email' => 'joshua.padilla@gmail.com',
                'phone' => '09171110008',
                'birthdate' => Carbon::today()->subYears(15)->subMonths(9)->format('Y-m-d'),
                'gender' => 'Male',
                'purok' => 'Purok 7',
                'classification' => 'In-School Youth',
                'education' => 'High School Level',
                'work' => 'Not Applicable',
                'status' => 'verified',
                'id_type' => 'Tibao Integrated School ID',
            ],
        ];

        foreach ($mockYouth as $index => $item) {
            $user = User::updateOrCreate(
                ['email' => $item['email']],
                [
                    'name' => "{$item['first_name']} {$item['last_name']}",
                    'phone_number' => $item['phone'],
                    'password' => Hash::make('password123'),
                    'role' => 'youth_member',
                    'is_active' => true,
                    'email_verified_at' => now(),
                ]
            );

            $youthCode = sprintf('TIBAO-%s-%05d', date('Y'), 100 + $index + 1);

            YouthProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'youth_code' => $youthCode,
                    'first_name' => $item['first_name'],
                    'middle_name' => $item['middle_name'],
                    'last_name' => $item['last_name'],
                    'suffix' => null,
                    'gender' => $item['gender'],
                    'birthdate' => $item['birthdate'],
                    'civil_status' => 'Single',
                    'purok_sitio' => $item['purok'],
                    'barangay' => 'Tibao',
                    'municipality' => 'Mlang',
                    'province' => 'Cotabato',
                    'youth_classification' => $item['classification'],
                    'educational_attainment' => $item['education'],
                    'work_status' => $item['work'],
                    'is_registered_sk_voter' => true,
                    'is_registered_national_voter' => Carbon::parse($item['birthdate'])->age >= 18,
                    'voted_last_sk_election' => true,
                    'verification_status' => $item['status'],
                    'id_type' => $item['id_type'],
                    'xp_points' => $item['status'] === 'verified' ? 120 : 0,
                    'verified_at' => $item['status'] === 'verified' ? now() : null,
                ]
            );
        }
    }
}

