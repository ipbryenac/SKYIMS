<?php

namespace App\Http\Controllers\Youth;

use App\Http\Controllers\Controller;
use App\Models\YouthProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class YouthProfileController extends Controller
{
    /**
     * Display the official Katipunan ng Kabataan Digital Pass & QR Code.
     */
    public function digitalId(): Response
    {
        $user = auth()->user()->load(['profile', 'badges.badge']);

        $profile = $user->profile;
        $qrPayload = [
            'type' => 'SKYIMS_TIBAO_PASS',
            'code' => $profile?->youth_code ?? 'TIBAO-KK',
            'name' => $profile?->full_name ?? $user->name,
            'purok' => $profile?->purok_sitio ?? 'Barangay Tibao',
            'sector' => $profile?->youth_classification ?? 'Youth Member',
            'bracket' => $profile?->age_bracket ?? 'Core Youth',
            'status' => $profile?->verification_status ?? 'pending',
            'uid' => $user->id,
            'issued_at' => now()->toDateString(),
        ];

        return Inertia::render('Youth/Profile/DigitalId', [
            'youthProfile' => $profile,
            'user' => $user,
            'qrPayload' => json_encode($qrPayload),
            'qrString' => $profile?->youth_code ?? 'TIBAO-KK',
            'badges' => $user->badges->map(function ($ub) {
                return [
                    'id' => $ub->badge->id,
                    'name' => $ub->badge->name,
                    'icon' => $ub->badge->icon_url,
                    'awarded_at' => $ub->awarded_at?->format('M d, Y'),
                ];
            }),
        ]);
    }

    /**
     * Show form to view and edit the youth's personal Katipunan ng Kabataan profile.
     */
    public function edit(): Response
    {
        $user = auth()->user()->load('profile');
        $profile = $user->profile;

        $puroksList = [
            'Purok 1',
            'Purok 2',
            'Purok 3',
            'Purok 4',
            'Purok 5',
            'Purok 6',
            'Purok 7',
            'Sitio Crossing',
        ];

        $classifications = [
            'In-School Youth',
            'Out-of-School Youth',
            'Working Youth',
            'Youth with Specific Needs',
        ];

        $educationLevels = [
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
        ];

        $workStatuses = [
            'Employed',
            'Unemployed',
            'Self-Employed',
            'Looking for Job',
            'Not Applicable',
        ];

        $recommendedSkills = [
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
        ];

        $recommendedHobbies = [
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
        ];

        $idTypes = [
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
        ];

        return Inertia::render('Youth/Profile/Edit', [
            'user' => $user,
            'youthProfile' => $profile,
            'puroksList' => $puroksList,
            'classifications' => $classifications,
            'educationLevels' => $educationLevels,
            'workStatuses' => $workStatuses,
            'recommendedSkills' => $recommendedSkills,
            'recommendedHobbies' => $recommendedHobbies,
            'idTypes' => $idTypes,
        ]);
    }

    /**
     * Update the youth's Katipunan ng Kabataan profile and contact details.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = auth()->user()->load('profile');
        $profile = $user->profile;

        $request->validate([
            'first_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'last_name' => 'required|string|max:100',
            'suffix' => 'nullable|string|max:10',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone_number' => 'required|string|max:20',
            'gender' => 'required|in:Male,Female,Prefer not to say',
            'birthdate' => 'required|date',
            'civil_status' => 'required|in:Single,Married,Widowed,Separated,Live-in',
            'purok_sitio' => 'required|string|max:100',
            'youth_classification' => 'required|string',
            'educational_attainment' => 'required|string',
            'work_status' => 'required|string',
            'skills' => 'nullable|string|max:1000',
            'hobbies' => 'nullable|string|max:1000',
            'is_registered_sk_voter' => 'boolean',
            'is_registered_national_voter' => 'boolean',
            'voted_last_sk_election' => 'boolean',
            'id_type' => 'nullable|string|max:100',
            'id_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'current_password' => 'nullable|required_with:new_password',
            'new_password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        // 1. Update User Account
        $fullName = trim("{$request->first_name} {$request->middle_name} {$request->last_name} {$request->suffix}");
        $user->name = $fullName;
        $user->email = $request->email;
        $user->phone_number = $request->phone_number;

        if ($request->filled('new_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return back()->withErrors(['current_password' => 'Your current password does not match our records.']);
            }
            $user->password = Hash::make($request->new_password);
        }

        $user->save();

        // 2. Handle ID Photo Re-upload if provided
        $photoPath = $profile?->id_photo_path;
        if ($request->hasFile('id_photo')) {
            if ($photoPath) {
                Storage::disk('public')->delete($photoPath);
            }
            $photoPath = $request->file('id_photo')->store('id_proofs', 'public');
        }

        // 3. Update or Create Youth Profile Record
        $profileData = [
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'suffix' => $request->suffix,
            'gender' => $request->gender,
            'birthdate' => $request->birthdate,
            'civil_status' => $request->civil_status,
            'purok_sitio' => $request->purok_sitio,
            'youth_classification' => $request->youth_classification,
            'educational_attainment' => $request->educational_attainment,
            'work_status' => $request->work_status,
            'skills' => $request->skills,
            'hobbies' => $request->hobbies,
            'is_registered_sk_voter' => (bool) $request->is_registered_sk_voter,
            'is_registered_national_voter' => (bool) $request->is_registered_national_voter,
            'voted_last_sk_election' => (bool) $request->voted_last_sk_election,
            'id_type' => $request->id_type ?: ($profile?->id_type ?? 'Student ID'),
            'id_photo_path' => $photoPath,
        ];

        if ($profile) {
            $profile->update($profileData);
        } else {
            $profileData['user_id'] = $user->id;
            $profileData['youth_code'] = 'TIBAO-' . date('Y') . '-' . str_pad($user->id, 5, '0', STR_PAD_LEFT);
            $profileData['verification_status'] = 'pending';
            $profileData['xp_points'] = 25;
            YouthProfile::create($profileData);
        }

        return redirect()->route('youth.profile.edit')
            ->with('success', 'Your Katipunan ng Kabataan profile information has been successfully updated!');
    }
}
