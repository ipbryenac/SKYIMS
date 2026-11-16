<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use App\Models\SurveyResponse;
use App\Models\YouthProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminAnalyticsController extends Controller
{
    /**
     * Display the Real-Time Needs Assessment & Analytics Dashboard for CBYDP/ABYIP planning.
     */
    public function index(Request $request): Response
    {
        $activeSurvey = Survey::with('questions')->where('is_active', true)->latest()->first();
        $surveyId = $activeSurvey?->id;

        $purokFilter = $request->input('purok');
        $sectorFilter = $request->input('sector');

        $query = SurveyResponse::query();
        if ($surveyId) {
            $query->where('survey_id', $surveyId);
        }
        if ($purokFilter) {
            $query->where('purok_sitio', $purokFilter);
        }
        if ($sectorFilter) {
            $query->where('youth_classification', $sectorFilter);
        }

        $totalResponses = (clone $query)->count();
        $totalRegisteredYouth = YouthProfile::count();
        $responseRate = $totalRegisteredYouth > 0 ? round(($totalResponses / $totalRegisteredYouth) * 100, 1) : 0;

        // 1. Program Interest Breakdown (Question 1 / Primary Interest)
        $interestsRaw = (clone $query)
            ->selectRaw('primary_interest, count(*) as count')
            ->groupBy('primary_interest')
            ->orderByDesc('count')
            ->get();

        $interestColors = [
            'Sports' => '#4f46e5', // Indigo
            'Sports & Recreation' => '#4f46e5',
            'Livelihood' => '#059669', // Emerald
            'Leadership' => '#2563eb', // Blue
            'Health & Mental Wellness' => '#d97706', // Amber
            'Environment' => '#0d9488', // Teal
        ];

        $interestsBreakdown = $interestsRaw->map(function ($item) use ($totalResponses, $interestColors) {
            $percentage = $totalResponses > 0 ? round(($item->count / $totalResponses) * 100, 1) : 0;
            return [
                'name' => $item->primary_interest,
                'count' => $item->count,
                'percentage' => $percentage,
                'color' => $interestColors[$item->primary_interest] ?? '#6366f1',
            ];
        });

        // 2. Breakdown by Sector (In-School, Out-of-School, Working)
        $sectorBreakdownRaw = (clone $query)
            ->selectRaw('youth_classification, count(*) as count')
            ->groupBy('youth_classification')
            ->orderByDesc('count')
            ->get();

        $sectorBreakdown = $sectorBreakdownRaw->map(function ($item) use ($totalResponses) {
            return [
                'sector' => $item->youth_classification,
                'count' => $item->count,
                'percentage' => $totalResponses > 0 ? round(($item->count / $totalResponses) * 100, 1) : 0,
            ];
        });

        // 3. Purok / Sitio Distribution across Barangay Tibao
        $puroksList = [
            'Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Purok 6', 'Purok 7', 'Sitio Crossing'
        ];

        $purokData = [];
        foreach ($puroksList as $p) {
            $pCount = (clone $query)->where('purok_sitio', $p)->count();
            $topInterest = (clone $query)->where('purok_sitio', $p)
                ->selectRaw('primary_interest, count(*) as count')
                ->groupBy('primary_interest')
                ->orderByDesc('count')
                ->first();

            $purokData[] = [
                'purok' => $p,
                'responses' => $pCount,
                'topInterest' => $topInterest?->primary_interest ?? 'No data',
            ];
        }

        // 4. Preferred Activity Schedule Breakdown
        $allResponses = (clone $query)->get(['answers']);
        $scheduleCounts = [
            'Saturday / Sunday Mornings' => 0,
            'Saturday / Sunday Afternoons' => 0,
            'Weekday Evenings' => 0,
        ];
        foreach ($allResponses as $resp) {
            $sched = $resp->answers[3] ?? null;
            if ($sched) {
                if (str_contains($sched, 'Mornings')) $scheduleCounts['Saturday / Sunday Mornings']++;
                elseif (str_contains($sched, 'Afternoons')) $scheduleCounts['Saturday / Sunday Afternoons']++;
                elseif (str_contains($sched, 'Evenings')) $scheduleCounts['Weekday Evenings']++;
            }
        }

        // 5. Dynamic CBYDP & ABYIP Program Justifications & Policy Recommendations
        $justifications = [];

        // Check Out-of-School Youth Priority
        $osyCount = SurveyResponse::where('youth_classification', 'Out-of-School Youth')->count();
        if ($osyCount > 0) {
            $osyLivelihood = SurveyResponse::where('youth_classification', 'Out-of-School Youth')
                ->where('primary_interest', 'Livelihood')
                ->count();
            $osyPct = round(($osyLivelihood / $osyCount) * 100, 1);
            $justifications[] = [
                'badge' => 'CBYDP Economic Empowerment',
                'title' => "{$osyPct}% of Out-of-School Youth Demand Livelihood & Skills Training",
                'description' => 'Survey results show strong demand for vocational readiness among non-enrolled youth. The SK Council can justify partnering with TESDA for community skills training at the Barangay Hall.',
                'status' => 'High ABYIP Priority',
                'color' => 'emerald',
            ];
        }

        // Check Sports & Wellness Interest
        $sportsCount = (clone $query)->where('primary_interest', 'like', '%Sports%')->count();
        $sportsPct = $totalResponses > 0 ? round(($sportsCount / $totalResponses) * 100, 1) : 0;
        if ($sportsPct > 0) {
            $justifications[] = [
                'badge' => 'CBYDP Sports Development',
                'title' => "{$sportsPct}% Participation Demand for Inter-Purok Sports Leagues",
                'description' => 'Data supports funding sports equipment and weekend tournament scheduling at the Barangay Gym/Multi-Purpose Hall across Purok 1–7.',
                'status' => 'Core ABYIP Program',
                'color' => 'indigo',
            ];
        }

        // Check Health / Mental Wellness & Leadership
        $justifications[] = [
            'badge' => 'CBYDP Active Citizenship & Governance',
            'title' => 'Youth Leadership Summits & Barangay Assemblies',
            'description' => 'Youth expressed a strong desire for civic training and transparency sessions. Allocate budget for leadership bootcamps and Katipunan ng Kabataan general assemblies.',
            'status' => 'Governance Mandate',
            'color' => 'blue',
        ];

        // 6. Youth Talent Pool Analytics (Skills & Hobbies for Council Decision-Making)
        $youthProfilesQuery = YouthProfile::query();
        if ($purokFilter) {
            $youthProfilesQuery->where('purok_sitio', $purokFilter);
        }
        if ($sectorFilter) {
            $youthProfilesQuery->where('youth_classification', $sectorFilter);
        }

        $allSkillsRaw = (clone $youthProfilesQuery)->whereNotNull('skills')->where('skills', '!=', '')->pluck('skills');
        $allHobbiesRaw = (clone $youthProfilesQuery)->whereNotNull('hobbies')->where('hobbies', '!=', '')->pluck('hobbies');

        $skillFrequencies = [];
        foreach ($allSkillsRaw as $str) {
            $items = array_filter(array_map('trim', preg_split('/[,;\n]+/', $str)));
            foreach ($items as $item) {
                $canonical = ucwords(strtolower($item));
                $skillFrequencies[$canonical] = ($skillFrequencies[$canonical] ?? 0) + 1;
            }
        }
        arsort($skillFrequencies);

        $hobbyFrequencies = [];
        foreach ($allHobbiesRaw as $str) {
            $items = array_filter(array_map('trim', preg_split('/[,;\n]+/', $str)));
            foreach ($items as $item) {
                $canonical = ucwords(strtolower($item));
                $hobbyFrequencies[$canonical] = ($hobbyFrequencies[$canonical] ?? 0) + 1;
            }
        }
        arsort($hobbyFrequencies);

        $totalWithSkills = $allSkillsRaw->count();
        $totalWithHobbies = $allHobbiesRaw->count();

        $topSkills = collect(array_slice($skillFrequencies, 0, 8, true))->map(function ($count, $name) use ($totalWithSkills) {
            return [
                'name' => $name,
                'count' => $count,
                'percentage' => $totalWithSkills > 0 ? round(($count / $totalWithSkills) * 100, 1) : 0,
            ];
        })->values();

        $topHobbies = collect(array_slice($hobbyFrequencies, 0, 8, true))->map(function ($count, $name) use ($totalWithHobbies) {
            return [
                'name' => $name,
                'count' => $count,
                'percentage' => $totalWithHobbies > 0 ? round(($count / $totalWithHobbies) * 100, 1) : 0,
            ];
        })->values();

        // Specific CBYDP Council Policy Guidance derived from Talents
        $talentRecommendations = [];
        if (!empty($skillFrequencies)) {
            $firstSkill = array_key_first($skillFrequencies);
            $talentRecommendations[] = [
                'focus' => 'Livelihood & Technical Skills (CBYDP Center 2)',
                'title' => "High concentration of {$firstSkill} talents",
                'action' => "The SK Council can schedule specialized TESDA-accredited training or workshops at Barangay Tibao Hall to build economic independence.",
            ];
        }
        if (!empty($hobbyFrequencies)) {
            $firstHobby = array_key_first($hobbyFrequencies);
            $talentRecommendations[] = [
                'focus' => 'Youth Engagement & Sports / Culture (CBYDP Center 4)',
                'title' => "Widespread passion for {$firstHobby}",
                'action' => "Organize an Inter-Purok {$firstHobby} competition or showcase during the upcoming Katipunan ng Kabataan General Assembly.",
            ];
        }

        return Inertia::render('Admin/Analytics/Index', [
            'survey' => $activeSurvey,
            'summary' => [
                'totalResponses' => $totalResponses,
                'totalRegisteredYouth' => $totalRegisteredYouth,
                'responseRate' => $responseRate,
                'topInterest' => $interestsBreakdown->first()['name'] ?? 'Sports',
                'youthWithSkills' => $totalWithSkills,
                'youthWithHobbies' => $totalWithHobbies,
            ],
            'interestsBreakdown' => $interestsBreakdown,
            'sectorBreakdown' => $sectorBreakdown,
            'purokData' => $purokData,
            'scheduleCounts' => $scheduleCounts,
            'justifications' => $justifications,
            'skillsAnalytics' => [
                'topSkills' => $topSkills,
                'topHobbies' => $topHobbies,
                'talentRecommendations' => $talentRecommendations,
                'totalWithSkills' => $totalWithSkills,
                'totalWithHobbies' => $totalWithHobbies,
            ],
            'filters' => [
                'purok' => $purokFilter,
                'sector' => $sectorFilter,
            ],
            'puroksList' => $puroksList,
        ]);
    }

    /**
     * Export raw survey analytics data to CSV for SK federation reports.
     */
    public function export(Request $request): StreamedResponse
    {
        $fileName = 'Barangay_Tibao_Needs_Assessment_Analytics_' . date('Y-m-d') . '.csv';

        return response()->streamDownload(function () {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($handle, [
                'Respondent Code',
                'Respondent Name',
                'Purok/Sitio',
                'Classification / Sector',
                'Age Bracket',
                'Primary Interest (Q1)',
                'Community Challenge (Q2)',
                'Preferred Schedule (Q3)',
                'ABYIP Budget Priority (Q4)',
                'Submission Date',
            ]);

            SurveyResponse::with(['youthProfile', 'user'])->chunk(100, function ($responses) use ($handle) {
                foreach ($responses as $r) {
                    fputcsv($handle, [
                        $r->youthProfile?->youth_code ?? 'N/A',
                        $r->youthProfile?->full_name ?? $r->user?->name,
                        $r->purok_sitio,
                        $r->youth_classification,
                        $r->age_bracket,
                        $r->answers[1] ?? $r->primary_interest,
                        $r->answers[2] ?? 'N/A',
                        $r->answers[3] ?? 'N/A',
                        $r->answers[4] ?? 'N/A',
                        $r->submitted_at ? $r->submitted_at->format('Y-m-d H:i') : $r->created_at->format('Y-m-d H:i'),
                    ]);
                }
            });

            fclose($handle);
        }, $fileName, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}

