<?php

namespace Database\Seeders;

use App\Models\Survey;
use App\Models\SurveyQuestion;
use App\Models\SurveyResponse;
use App\Models\User;
use App\Models\YouthProfile;
use Illuminate\Database\Seeder;

class NeedsAssessmentSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'sk_chairperson')->first();

        // 1. Create the official 2026 Katipunan ng Kabataan Needs Assessment Survey
        $survey = Survey::updateOrCreate(
            ['year' => 2026, 'title' => '2026 Katipunan ng Kabataan Needs Assessment Survey'],
            [
                'description' => 'Barangay Tibao Sangguniang Kabataan Council official annual needs assessment survey to guide CBYDP and ABYIP budgeting.',
                'is_active' => true,
                'xp_reward' => 25,
                'created_by' => $admin?->id,
            ]
        );

        // 2. Survey Questions
        $questions = [
            [
                'order' => 1,
                'category' => 'CBYDP Priorities',
                'question_type' => 'single_choice',
                'question_text' => 'What programs or activities are you most interested in participating in Barangay Tibao?',
                'options' => [
                    'Sports & Athletic Tournaments (Basketball, Volleyball, Esports)',
                    'Livelihood & Skills Training (TESDA Vocational, Entrepreneurship)',
                    'Leadership & Governance Seminars (Youth Camp, Civic Leadership)',
                    'Health & Mental Wellness (Mental Health Awareness, Medical Outreach)',
                    'Environmental Protection & Climate Action (Tree Planting, Clean-Up)',
                ],
            ],
            [
                'order' => 2,
                'category' => 'Community Needs',
                'question_type' => 'single_choice',
                'question_text' => 'What do you consider the biggest challenge or need of the youth in your purok?',
                'options' => [
                    'Lack of job opportunities and livelihood skills',
                    'Limited sports, recreational, and study facilities',
                    'Financial constraints for educational needs & tuition',
                    'Mental health support and youth peer counseling',
                    'Lack of information on barangay youth programs',
                ],
            ],
            [
                'order' => 3,
                'category' => 'Activity Participation',
                'question_type' => 'single_choice',
                'question_text' => 'What is your most convenient schedule for attending SK activities?',
                'options' => [
                    'Saturday / Sunday Mornings',
                    'Saturday / Sunday Afternoons',
                    'Weekday Evenings (after school / work)',
                ],
            ],
            [
                'order' => 4,
                'category' => 'Budget Planning',
                'question_type' => 'single_choice',
                'question_text' => 'Which area should receive highest priority in the 2026 Annual Barangay Youth Investment Program (ABYIP)?',
                'options' => [
                    'Economic Empowerment & Youth Livelihood',
                    'Sports Development & Physical Fitness',
                    'Education & Educational Support Grants',
                    'Mental Health, Well-Being & Health Services',
                    'Active Citizenship & Peace-Building',
                ],
            ],
        ];

        foreach ($questions as $q) {
            SurveyQuestion::updateOrCreate(
                ['survey_id' => $survey->id, 'order' => $q['order']],
                $q
            );
        }

        // 3. Seed sample responses from existing youth profiles to populate the analytics dashboard
        $youthProfiles = YouthProfile::with('user')->get();

        // Interests mapping per youth profile profile/sector
        $interestMapping = [
            'Out-of-School Youth' => 'Livelihood & Skills Training',
            'In-School Youth' => 'Sports & Athletic Tournaments',
            'Working Youth' => 'Leadership & Governance',
            'Youth with Specific Needs' => 'Health & Mental Wellness',
        ];

        foreach ($youthProfiles as $index => $profile) {
            if (!$profile->user) continue;

            // Skip one or two so the user can see uncompleted prompt in youth dashboard
            if ($profile->user->email === 'alyssa.alcantara@gmail.com') {
                continue; // Leave Alyssa pending so the user can test the assessment prompt directly!
            }

            $primary = $interestMapping[$profile->youth_classification] ?? 'Sports & Athletic Tournaments';
            if ($index % 3 === 0) {
                $primary = 'Environmental Protection & Climate Action';
            } elseif ($index % 4 === 0) {
                $primary = 'Leadership & Governance';
            }

            SurveyResponse::updateOrCreate(
                [
                    'survey_id' => $survey->id,
                    'user_id' => $profile->user_id,
                ],
                [
                    'youth_profile_id' => $profile->id,
                    'answers' => [
                        1 => $primary,
                        2 => $profile->youth_classification === 'Out-of-School Youth' 
                            ? 'Lack of job opportunities and livelihood skills'
                            : 'Limited sports, recreational, and study facilities',
                        3 => $index % 2 === 0 ? 'Saturday / Sunday Afternoons' : 'Saturday / Sunday Mornings',
                        4 => $profile->youth_classification === 'Out-of-School Youth'
                            ? 'Economic Empowerment & Youth Livelihood'
                            : 'Sports Development & Physical Fitness',
                    ],
                    'primary_interest' => $primary,
                    'purok_sitio' => $profile->purok_sitio,
                    'youth_classification' => $profile->youth_classification,
                    'age_bracket' => $profile->age_bracket,
                    'submitted_at' => now()->subDays(rand(1, 14)),
                ]
            );
        }
    }
}

