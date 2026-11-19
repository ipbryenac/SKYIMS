<?php

namespace App\Services;

use App\Models\Badge;
use App\Models\SurveyResponse;
use App\Models\User;
use App\Models\UserBadge;

class GamificationService
{
    /**
     * Evaluate and award eligible badges for the given user.
     * Returns an array of newly awarded badge names.
     */
    public function evaluateBadges(User $user): array
    {
        $newlyAwarded = [];
        $profile = $user->profile;
        $earnedBadgeIds = $user->badges()->pluck('badge_id')->toArray();

        $allBadges = Badge::all()->keyBy('slug');

        // 1. Pioneer Badge (KK Registration)
        if (isset($allBadges['tibao-kk-pioneer']) && ! in_array($allBadges['tibao-kk-pioneer']->id, $earnedBadgeIds)) {
            UserBadge::create([
                'user_id' => $user->id,
                'badge_id' => $allBadges['tibao-kk-pioneer']->id,
                'awarded_at' => now(),
            ]);
            $newlyAwarded[] = $allBadges['tibao-kk-pioneer']->name;
        }

        // 2. Democracy Champion (Completed Survey)
        if (isset($allBadges['democracy-champion']) && ! in_array($allBadges['democracy-champion']->id, $earnedBadgeIds)) {
            if (SurveyResponse::where('user_id', $user->id)->exists()) {
                UserBadge::create([
                    'user_id' => $user->id,
                    'badge_id' => $allBadges['democracy-champion']->id,
                    'awarded_at' => now(),
                ]);
                $newlyAwarded[] = $allBadges['democracy-champion']->name;
            }
        }

        // 3. Event Attendances Milestones
        $attendancesCount = $user->eventAttendances()->count();

        // 1st Event: First Step Kabataan
        if (isset($allBadges['first-step-kabataan']) && ! in_array($allBadges['first-step-kabataan']->id, $earnedBadgeIds)) {
            if ($attendancesCount >= 1) {
                UserBadge::create([
                    'user_id' => $user->id,
                    'badge_id' => $allBadges['first-step-kabataan']->id,
                    'awarded_at' => now(),
                ]);
                $newlyAwarded[] = $allBadges['first-step-kabataan']->name;
            }
        }

        // 3+ Events: Active Citizen Bronze
        if (isset($allBadges['active-citizen-bronze']) && ! in_array($allBadges['active-citizen-bronze']->id, $earnedBadgeIds)) {
            if ($attendancesCount >= 3) {
                UserBadge::create([
                    'user_id' => $user->id,
                    'badge_id' => $allBadges['active-citizen-bronze']->id,
                    'awarded_at' => now(),
                ]);
                $newlyAwarded[] = $allBadges['active-citizen-bronze']->name;
            }
        }

        // 5+ Events: Active Citizen Silver
        if (isset($allBadges['active-citizen-silver']) && ! in_array($allBadges['active-citizen-silver']->id, $earnedBadgeIds)) {
            if ($attendancesCount >= 5) {
                UserBadge::create([
                    'user_id' => $user->id,
                    'badge_id' => $allBadges['active-citizen-silver']->id,
                    'awarded_at' => now(),
                ]);
                $newlyAwarded[] = $allBadges['active-citizen-silver']->name;
            }
        }

        // 4. Category-Specific Badges
        if (isset($allBadges['barangay-sports-champ']) && ! in_array($allBadges['barangay-sports-champ']->id, $earnedBadgeIds)) {
            $hasSports = $user->eventAttendances()->whereHas('event', function ($q) {
                $q->where('category', 'Global Mobility & Sports/Culture');
            })->exists();

            if ($hasSports) {
                UserBadge::create([
                    'user_id' => $user->id,
                    'badge_id' => $allBadges['barangay-sports-champ']->id,
                    'awarded_at' => now(),
                ]);
                $newlyAwarded[] = $allBadges['barangay-sports-champ']->name;
            }
        }

        if (isset($allBadges['tibao-eco-warrior']) && ! in_array($allBadges['tibao-eco-warrior']->id, $earnedBadgeIds)) {
            $hasEco = $user->eventAttendances()->whereHas('event', function ($q) {
                $q->where('category', 'Environment & Climate Action');
            })->exists();

            if ($hasEco) {
                UserBadge::create([
                    'user_id' => $user->id,
                    'badge_id' => $allBadges['tibao-eco-warrior']->id,
                    'awarded_at' => now(),
                ]);
                $newlyAwarded[] = $allBadges['tibao-eco-warrior']->name;
            }
        }

        // 5. XP Threshold: Community MVP (>= 150 XP)
        if (isset($allBadges['community-mvp']) && ! in_array($allBadges['community-mvp']->id, $earnedBadgeIds)) {
            if ($profile && $profile->xp_points >= 150) {
                UserBadge::create([
                    'user_id' => $user->id,
                    'badge_id' => $allBadges['community-mvp']->id,
                    'awarded_at' => now(),
                ]);
                $newlyAwarded[] = $allBadges['community-mvp']->name;
            }
        }

        return $newlyAwarded;
    }
}
