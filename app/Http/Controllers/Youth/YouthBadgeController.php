<?php

namespace App\Http\Controllers\Youth;

use App\Http\Controllers\Controller;
use App\Models\Badge;
use App\Services\GamificationService;
use Inertia\Inertia;
use Inertia\Response;

class YouthBadgeController extends Controller
{
    /**
     * Display the Gamification Badges, XP Points, and Achievements Showcase.
     */
    public function index(GamificationService $gamification): Response
    {
        $user = auth()->user()->load(['profile', 'badges']);

        // Check if user has unlocked any new badges automatically
        $gamification->evaluateBadges($user);
        $user->load('badges');

        $profile = $user->profile;
        $xp = $profile?->xp_points ?? 0;

        // Compute Tier & Level Progress
        $currentTier = 'Katipunan Novice';
        $nextTier = 'Active Kabataan';
        $nextTierXP = 50;
        $tierProgress = min(round(($xp / 50) * 100), 100);

        if ($xp >= 300) {
            $currentTier = 'Tibao Youth Leader';
            $nextTier = 'Max Level Achieved 🌟';
            $nextTierXP = 300;
            $tierProgress = 100;
        } elseif ($xp >= 150) {
            $currentTier = 'Community Champion';
            $nextTier = 'Tibao Youth Leader';
            $nextTierXP = 300;
            $tierProgress = min(round((($xp - 150) / 150) * 100), 100);
        } elseif ($xp >= 50) {
            $currentTier = 'Active Kabataan';
            $nextTier = 'Community Champion';
            $nextTierXP = 150;
            $tierProgress = min(round((($xp - 50) / 100) * 100), 100);
        }

        $earnedMap = $user->badges->keyBy('badge_id');

        $allBadges = Badge::all()->map(function ($badge) use ($earnedMap) {
            $userBadge = $earnedMap[$badge->id] ?? null;

            return [
                'id' => $badge->id,
                'name' => $badge->name,
                'slug' => $badge->slug,
                'description' => $badge->description,
                'icon' => $badge->icon_url,
                'criteria_type' => $badge->criteria_type,
                'threshold_value' => $badge->threshold_value,
                'is_unlocked' => $userBadge !== null,
                'awarded_at' => $userBadge?->awarded_at?->format('F d, Y'),
            ];
        });

        return Inertia::render('Youth/Badges/Index', [
            'youthProfile' => $profile,
            'xp' => $xp,
            'currentTier' => $currentTier,
            'nextTier' => $nextTier,
            'nextTierXP' => $nextTierXP,
            'tierProgress' => $tierProgress,
            'badges' => $allBadges,
            'stats' => [
                'eventsAttended' => $user->eventAttendances()->count(),
                'eventsRegistered' => $user->eventRegistrations()->count(),
                'surveysAnswered' => $user->surveyResponses()->count(),
                'badgesUnlocked' => $user->badges()->count(),
            ],
        ]);
    }
}
