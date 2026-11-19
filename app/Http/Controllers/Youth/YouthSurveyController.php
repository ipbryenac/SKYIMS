<?php

namespace App\Http\Controllers\Youth;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use App\Models\SurveyResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class YouthSurveyController extends Controller
{
    /**
     * Display the Youth Needs Assessment Surveys page.
     */
    public function index(): Response
    {
        $user = auth()->user()->load('profile');
        $activeSurvey = Survey::with('questions')
            ->where('is_active', true)
            ->latest()
            ->first();

        $existingResponse = null;
        if ($activeSurvey) {
            $existingResponse = SurveyResponse::where('survey_id', $activeSurvey->id)
                ->where('user_id', $user->id)
                ->first();
        }

        return Inertia::render('Youth/Surveys/Index', [
            'survey' => $activeSurvey,
            'hasCompleted' => $existingResponse !== null,
            'existingResponse' => $existingResponse,
            'youthProfile' => $user->profile,
        ]);
    }

    /**
     * Submit answers for the active Needs Assessment Survey.
     */
    public function submit(Request $request, Survey $survey): RedirectResponse
    {
        $user = auth()->user()->load('profile');
        $profile = $user->profile;

        // Check if already answered
        $alreadySubmitted = SurveyResponse::where('survey_id', $survey->id)
            ->where('user_id', $user->id)
            ->exists();

        if ($alreadySubmitted) {
            return back()->with('warning', 'You have already submitted your response for this assessment survey.');
        }

        $request->validate([
            'answers' => 'required|array',
            'answers.1' => 'required',
        ]);

        $answers = $request->input('answers');

        // Extract primary interest from Question 1 (or default)
        $primaryAnswer = $answers[1] ?? 'Sports & Athletic Tournaments';
        $primaryInterest = 'Sports';
        if (str_contains($primaryAnswer, 'Livelihood') || str_contains($primaryAnswer, 'Skills')) {
            $primaryInterest = 'Livelihood';
        } elseif (str_contains($primaryAnswer, 'Leadership') || str_contains($primaryAnswer, 'Governance')) {
            $primaryInterest = 'Leadership';
        } elseif (str_contains($primaryAnswer, 'Health') || str_contains($primaryAnswer, 'Mental')) {
            $primaryInterest = 'Health & Mental Wellness';
        } elseif (str_contains($primaryAnswer, 'Environmental') || str_contains($primaryAnswer, 'Clean-Up')) {
            $primaryInterest = 'Environment';
        } else {
            $primaryInterest = 'Sports & Recreation';
        }

        // Record response
        SurveyResponse::create([
            'survey_id' => $survey->id,
            'user_id' => $user->id,
            'youth_profile_id' => $profile?->id,
            'answers' => $answers,
            'primary_interest' => $primaryInterest,
            'purok_sitio' => $profile?->purok_sitio ?? 'Barangay Tibao',
            'youth_classification' => $profile?->youth_classification ?? 'In-School Youth',
            'age_bracket' => $profile?->age_bracket ?? 'Core Youth (18-24)',
            'submitted_at' => now(),
        ]);

        // Award Participation XP points to the youth member
        if ($profile) {
            $reward = $survey->xp_reward ?? 25;
            $profile->increment('xp_points', $reward);
        }

        return back()->with('success', "Daghang Salamat! Your voice has been recorded and submitted to the SK Council. You earned +{$survey->xp_reward} Participation XP!");
    }
}
