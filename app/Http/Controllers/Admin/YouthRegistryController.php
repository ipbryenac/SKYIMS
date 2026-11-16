<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\YouthProfile;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class YouthRegistryController extends Controller
{
    /**
     * Display the centralized Youth Registry CRM databank with filters.
     */
    public function index(Request $request): Response
    {
        $query = YouthProfile::with(['user', 'verifier']);

        // 1. Text Search (Name, Youth Code, or Contact)
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('youth_code', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('email', 'like', "%{$search}%")
                         ->orWhere('phone_number', 'like', "%{$search}%");
                  });
            });
        }

        // 2. Filter by Purok / Sitio in Barangay Tibao
        if ($purok = $request->input('purok')) {
            $query->where('purok_sitio', $purok);
        }

        // 3. Filter by Sector / Youth Classification
        if ($sector = $request->input('sector')) {
            $query->where('youth_classification', $sector);
        }

        // 4. Filter by Verification Status
        if ($status = $request->input('status')) {
            $query->where('verification_status', $status);
        }

        // 5. Filter by Official Katipunan ng Kabataan Age Bracket
        if ($ageBracket = $request->input('age_bracket')) {
            $today = Carbon::today();
            if ($ageBracket === 'child') {
                // 15 - 17 years old
                $query->whereBetween('birthdate', [
                    $today->copy()->subYears(18)->addDay(),
                    $today->copy()->subYears(15),
                ]);
            } elseif ($ageBracket === 'core') {
                // 18 - 24 years old
                $query->whereBetween('birthdate', [
                    $today->copy()->subYears(25)->addDay(),
                    $today->copy()->subYears(18),
                ]);
            } elseif ($ageBracket === 'young_adult') {
                // 25 - 30 years old
                $query->whereBetween('birthdate', [
                    $today->copy()->subYears(31)->addDay(),
                    $today->copy()->subYears(25),
                ]);
            }
        }

        // 6. Filter by Voter Registration
        if ($voter = $request->input('voter')) {
            if ($voter === 'sk') {
                $query->where('is_registered_sk_voter', true);
            } elseif ($voter === 'national') {
                $query->where('is_registered_national_voter', true);
            }
        }

        $profiles = $query->latest()->paginate(15)->withQueryString();

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

        return Inertia::render('Admin/Registry/Index', [
            'profiles' => $profiles,
            'filters' => $request->only(['search', 'purok', 'sector', 'status', 'age_bracket', 'voter']),
            'puroksList' => $puroksList,
            'counts' => [
                'total' => YouthProfile::count(),
                'verified' => YouthProfile::where('verification_status', 'verified')->count(),
                'pending' => YouthProfile::where('verification_status', 'pending')->count(),
                'osy' => YouthProfile::where('youth_classification', 'Out-of-School Youth')->count(),
                'isy' => YouthProfile::where('youth_classification', 'In-School Youth')->count(),
                'wy' => YouthProfile::where('youth_classification', 'Working Youth')->count(),
            ],
        ]);
    }

    /**
     * Display the pending verification queue for the SK Council.
     */
    public function verificationQueue(): Response
    {
        $pendingYouth = YouthProfile::with('user')
            ->where('verification_status', 'pending')
            ->latest()
            ->paginate(12);

        return Inertia::render('Admin/Registry/VerificationQueue', [
            'pendingYouth' => $pendingYouth,
        ]);
    }

    /**
     * Approve and verify a youth's registration against barangay records.
     */
    public function verify(Request $request, YouthProfile $profile): RedirectResponse
    {
        $profile->update([
            'verification_status' => 'verified',
            'verified_by' => auth()->id(),
            'verified_at' => now(),
            'rejection_reason' => null,
            'xp_points' => max($profile->xp_points, 50), // 50 Welcome Starter XP
        ]);

        return back()->with('success', "{$profile->full_name} ({$profile->youth_code}) is now officially verified!");
    }

    /**
     * Reject a youth registration with justification.
     */
    public function reject(Request $request, YouthProfile $profile): RedirectResponse
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $profile->update([
            'verification_status' => 'rejected',
            'verified_by' => auth()->id(),
            'verified_at' => now(),
            'rejection_reason' => $request->input('reason'),
        ]);

        return back()->with('warning', "Registration for {$profile->full_name} was marked as rejected.");
    }

    /**
     * Delete a youth record and associated account from the registry.
     */
    public function destroy(YouthProfile $profile): RedirectResponse
    {
        $fullName = $profile->full_name;
        $youthCode = $profile->youth_code;

        // Clean up uploaded ID photo if present
        if ($profile->id_photo_path) {
            Storage::disk('public')->delete($profile->id_photo_path);
        }

        $user = $profile->user;

        // Delete the profile
        $profile->delete();

        // If associated with a youth member user account, remove the user account as well
        if ($user && $user->role === 'youth_member') {
            $user->forceDelete();
        }

        return redirect()->route('admin.registry.index')->with('success', "Youth record for {$fullName} ({$youthCode}) has been successfully removed from the registry.");
    }

    /**
     * Export Katipunan ng Kabataan databank records to CSV.
     */
    public function export(Request $request): StreamedResponse
    {
        $fileName = 'Katipunan_ng_Kabataan_Tibao_' . date('Y-m-d') . '.csv';

        return response()->streamDownload(function () {
            $handle = fopen('php://output', 'w');

            // Add UTF-8 BOM for Excel compatibility
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($handle, [
                'Youth Code',
                'Full Name',
                'Birthdate',
                'Age',
                'Age Bracket',
                'Gender',
                'Civil Status',
                'Purok/Sitio',
                'Classification',
                'Educational Attainment',
                'Work Status',
                'Skills & Competencies',
                'Hobbies & Interests',
                'SK Voter',
                'National Voter',
                'Verification Status',
                'Contact Number',
                'Email',
                'Registered Date',
            ]);

            YouthProfile::with('user')->chunk(100, function ($profiles) use ($handle) {
                foreach ($profiles as $p) {
                    fputcsv($handle, [
                        $p->youth_code,
                        $p->full_name,
                        $p->birthdate ? $p->birthdate->format('Y-m-d') : '',
                        $p->age,
                        $p->age_bracket,
                        $p->gender,
                        $p->civil_status,
                        $p->purok_sitio,
                        $p->youth_classification,
                        $p->educational_attainment,
                        $p->work_status,
                        $p->skills ?: 'None indicated',
                        $p->hobbies ?: 'None indicated',
                        $p->is_registered_sk_voter ? 'Yes' : 'No',
                        $p->is_registered_national_voter ? 'Yes' : 'No',
                        strtoupper($p->verification_status),
                        $p->user?->phone_number,
                        $p->user?->email,
                        $p->created_at->format('Y-m-d'),
                    ]);
                }
            });

            fclose($handle);
        }, $fileName, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}

