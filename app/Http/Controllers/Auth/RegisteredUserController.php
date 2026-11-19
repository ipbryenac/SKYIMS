<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\YouthProfile;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the self-registration view with Puroks of Barangay Tibao.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'puroks' => [
                'Purok 1',
                'Purok 2',
                'Purok 3',
                'Purok 4',
                'Purok 5',
                'Purok 6',
                'Purok 7',
                'Sitio Crossing',
            ],
            'classifications' => [
                'In-School Youth',
                'Out-of-School Youth',
                'Working Youth',
                'Youth with Specific Needs',
            ],
            'educationLevels' => [
                'Elementary Level',
                'Elementary Graduate',
                'High School Level',
                'High School Graduate',
                'Senior High Level',
                'Senior High Graduate',
                'Vocational Course',
                'College Level',
                'College Graduate',
                'Post-Graduate Level',
            ],
            'workStatuses' => [
                'Employed',
                'Unemployed',
                'Self-Employed',
                'Looking for Job',
                'Not Applicable',
            ],
            'recommendedSkills' => [
                'Computer & IT / Programming',
                'Graphic Design & Digital Media',
                'Cooking & Commercial Baking',
                'Carpentry & Electrical Installation',
                'First Aid & Disaster Rescue (DRRM)',
                'Agriculture & Farming',
                'Public Speaking & Leadership',
                'Sports Coaching & Refereeing',
                'Tailoring & Dressmaking',
                'Automotive & Engine Repair',
                'Photography & Videography',
                'Bookkeeping & Financial Literacy',
            ],
            'recommendedHobbies' => [
                'Basketball',
                'Volleyball',
                'Esports (Mobile Legends / COD)',
                'Badminton',
                'Singing & Musical Instruments',
                'Dancing (Hip-hop / Folk)',
                'Painting & Visual Arts',
                'Cycling & Biking',
                'Gardening & Urban Farming',
                'Reading & Creative Writing',
                'Board Games & Chess',
                'Community Volunteering',
            ],
            'idTypes' => [
                'Student ID (School / College ID)',
                'National ID (PhilSys ID / ePhilID)',
                'Barangay Clearance / Certificate of Residency',
                'PSA / NSO Birth Certificate',
                'Philippine Passport',
                'Driver\'s License / Student Permit',
                'Voter\'s ID / COMELEC Certificate',
                'SK Member Certificate',
                'Postal ID',
                'Other Valid ID / Document',
            ],
        ]);
    }

    /**
     * Handle an incoming youth self-registration request.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            // Account Credentials
            'first_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'last_name' => 'required|string|max:100',
            'suffix' => 'nullable|string|max:10',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class.',email',
            'phone_number' => 'required|string|max:15|unique:'.User::class.',phone_number',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],

            // Demographics & Local Address
            'gender' => 'required|in:Male,Female,Prefer not to say',
            'birthdate' => 'required|date|before:today',
            'civil_status' => 'required|in:Single,Married,Widowed,Separated,Live-in',
            'purok_sitio' => 'required|string|max:100',

            // KK Sectoral & Educational Background
            'youth_classification' => 'required|in:In-School Youth,Out-of-School Youth,Working Youth,Youth with Specific Needs',
            'specific_needs_details' => 'nullable|array',
            'educational_attainment' => 'required|string',
            'work_status' => 'required|string',

            // Skills & Hobbies (CBYDP / ABYIP guidance)
            'skills' => 'nullable|string|max:1000',
            'hobbies' => 'nullable|string|max:1000',

            // Civic / Voting
            'is_registered_sk_voter' => 'boolean',
            'is_registered_national_voter' => 'boolean',
            'voted_last_sk_election' => 'boolean',

            // Verification ID proof
            'id_type' => 'nullable|string|max:100',
            'id_photo' => 'nullable|image|max:5120', // Max 5MB
        ], [
            'first_name.required' => 'First name is required.',
            'last_name.required' => 'Last name is required.',
            'email.unique' => 'This email address is already registered in SKYIMS.',
            'phone_number.unique' => 'This phone number is already registered in SKYIMS.',
            'phone_number.required' => 'Mobile number is required for assembly notifications.',
            'birthdate.required' => 'Date of birth is required to determine your youth age bracket.',
            'birthdate.before' => 'Birthdate must be a valid past date.',
            'purok_sitio.required' => 'Please select your Purok / Sitio in Barangay Tibao.',
        ]);

        $createdData = DB::transaction(function () use ($request, $validated) {
            $suffix = ! empty($validated['suffix']) ? ' '.$validated['suffix'] : '';
            $fullName = trim("{$validated['first_name']} {$validated['last_name']}{$suffix}");

            // 1. Create Base User
            $user = User::create([
                'name' => $fullName,
                'email' => $validated['email'],
                'phone_number' => $validated['phone_number'],
                'role' => 'youth_member',
                'password' => Hash::make($validated['password']),
                'is_active' => true,
            ]);

            // Handle ID file upload
            $idPath = null;
            if ($request->hasFile('id_photo')) {
                $idPath = $request->file('id_photo')->store('id_proofs', 'public');
            }

            // Generate Unique Youth Code: TIBAO-YYYY-00001
            $year = date('Y');
            $youthCode = sprintf('TIBAO-%s-%05d', $year, $user->id);

            // 2. Create Katipunan ng Kabataan Youth Profile
            $profile = YouthProfile::create([
                'user_id' => $user->id,
                'youth_code' => $youthCode,
                'first_name' => $validated['first_name'],
                'middle_name' => $validated['middle_name'] ?? null,
                'last_name' => $validated['last_name'],
                'suffix' => $validated['suffix'] ?? null,
                'gender' => $validated['gender'],
                'birthdate' => $validated['birthdate'],
                'civil_status' => $validated['civil_status'],
                'purok_sitio' => $validated['purok_sitio'],
                'barangay' => 'Tibao',
                'municipality' => 'Mlang',
                'province' => 'Cotabato',
                'youth_classification' => $validated['youth_classification'],
                'specific_needs_details' => $validated['specific_needs_details'] ?? null,
                'educational_attainment' => $validated['educational_attainment'],
                'work_status' => $validated['work_status'],
                'skills' => $validated['skills'] ?? null,
                'hobbies' => $validated['hobbies'] ?? null,
                'is_registered_sk_voter' => $request->boolean('is_registered_sk_voter'),
                'is_registered_national_voter' => $request->boolean('is_registered_national_voter'),
                'voted_last_sk_election' => $request->boolean('voted_last_sk_election'),
                'verification_status' => 'pending',
                'id_type' => $validated['id_type'] ?? null,
                'id_photo_path' => $idPath,
                'xp_points' => 0,
            ]);

            return [$user, $profile];
        });

        [$user, $profile] = $createdData;

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('youth.dashboard')
            ->with('success', "🎉 Registration Successful! Welcome to Kabataan ng Tibao, {$user->name}. Your profile code is {$profile->youth_code}. Your account is now in the SK Council verification queue!");
    }
}
