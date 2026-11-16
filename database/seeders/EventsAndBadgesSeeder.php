<?php

namespace Database\Seeders;

use App\Models\Badge;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\SurveyResponse;
use App\Models\User;
use App\Models\UserBadge;
use App\Models\YouthProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventsAndBadgesSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'sk_chairperson')->first();

        // 1. Seed Official Sangguniang Kabataan Gamification Badges
        $badges = [
            [
                'name' => 'Tibao KK Pioneer',
                'slug' => 'tibao-kk-pioneer',
                'description' => 'Official registered and verified Katipunan ng Kabataan member of Barangay Tibao.',
                'icon_url' => '🌟',
                'criteria_type' => 'REGISTRATION',
                'threshold_value' => 1,
            ],
            [
                'name' => 'Democracy Champion',
                'slug' => 'democracy-champion',
                'description' => 'Voiced youth needs by completing the Katipunan ng Kabataan Needs Assessment Survey.',
                'icon_url' => '🗳️',
                'criteria_type' => 'FIRST_SURVEY',
                'threshold_value' => 1,
            ],
            [
                'name' => 'First Step Kabataan',
                'slug' => 'first-step-kabataan',
                'description' => 'Attended your first official Sangguniang Kabataan community event or assembly.',
                'icon_url' => '🏃',
                'criteria_type' => 'ATTEND_EVENTS',
                'threshold_value' => 1,
            ],
            [
                'name' => 'Active Citizen Bronze',
                'slug' => 'active-citizen-bronze',
                'description' => 'Consistently participating in barangay youth development — attended 3+ events.',
                'icon_url' => '🥉',
                'criteria_type' => 'ATTEND_EVENTS',
                'threshold_value' => 3,
            ],
            [
                'name' => 'Active Citizen Silver',
                'slug' => 'active-citizen-silver',
                'description' => 'Dedicated youth leader — attended 5+ community programs.',
                'icon_url' => '🥈',
                'criteria_type' => 'ATTEND_EVENTS',
                'threshold_value' => 5,
            ],
            [
                'name' => 'Tibao Eco-Warrior',
                'slug' => 'tibao-eco-warrior',
                'description' => 'Championed environmental protection in tree planting and clean-up drives.',
                'icon_url' => '🌳',
                'criteria_type' => 'ENVIRONMENT_EVENT',
                'threshold_value' => 1,
            ],
            [
                'name' => 'Barangay Sports Champ',
                'slug' => 'barangay-sports-champ',
                'description' => 'Joined and competed in the Inter-Purok Youth Sports tournaments.',
                'icon_url' => '🏀',
                'criteria_type' => 'SPORTS_EVENT',
                'threshold_value' => 1,
            ],
            [
                'name' => 'Community MVP',
                'slug' => 'community-mvp',
                'description' => 'Elite youth contributor with over 150+ total Participation XP points.',
                'icon_url' => '🏆',
                'criteria_type' => 'XP_THRESHOLD',
                'threshold_value' => 150,
            ],
        ];

        foreach ($badges as $b) {
            Badge::updateOrCreate(['slug' => $b['slug']], $b);
        }

        // 2. Seed Realistic Upcoming Community Events in Barangay Tibao
        $events = [
            [
                'title' => '2026 Inter-Purok Youth Sports Fest & Basketball League',
                'slug' => '2026-inter-purok-sports-fest',
                'description' => 'Annual inter-purok sports tournament across Purok 1 to 7 and Sitio Crossing. Basketball, Volleyball, and Badminton competitions to promote sportsmanship and healthy lifestyle among Katipunan ng Kabataan members.',
                'category' => 'Global Mobility & Sports/Culture',
                'venue' => 'Barangay Tibao Multi-Purpose Gym',
                'start_datetime' => now()->addDays(3)->setTime(8, 0),
                'end_datetime' => now()->addDays(3)->setTime(17, 0),
                'registration_deadline' => now()->addDays(2)->setTime(23, 59),
                'capacity' => 200,
                'points_reward' => 100,
                'status' => 'published',
                'created_by' => $admin?->id ?? 1,
            ],
            [
                'title' => 'Katipunan ng Kabataan General Assembly & CBYDP Consultation',
                'slug' => 'kk-general-assembly-2026',
                'description' => 'Mandatory Katipunan ng Kabataan assembly pursuant to RA 10742. Presentation of the Sangguniang Kabataan 2026 ABYIP budget allocations based on our digital needs assessment survey results.',
                'category' => 'Governance & Leadership',
                'venue' => 'Barangay Tibao Multi-Purpose Hall',
                'start_datetime' => now()->addDays(7)->setTime(13, 30),
                'end_datetime' => now()->addDays(7)->setTime(17, 30),
                'registration_deadline' => now()->addDays(6)->setTime(18, 0),
                'capacity' => 300,
                'points_reward' => 75,
                'status' => 'published',
                'created_by' => $admin?->id ?? 1,
            ],
            [
                'title' => 'Livelihood & Digital Skills Boot Camp (TESDA Partnership)',
                'slug' => 'livelihood-digital-skills-bootcamp',
                'description' => 'Free hands-on livelihood and computer literacy workshop specially organized for Out-of-School and Working Youth in Barangay Tibao to equip them with immediate economic opportunities.',
                'category' => 'Economic Empowerment & Livelihood',
                'venue' => 'Tibao SK Youth Training Center (Multi-Purpose Hall 2nd Floor)',
                'start_datetime' => now()->addDays(14)->setTime(9, 0),
                'end_datetime' => now()->addDays(14)->setTime(16, 0),
                'registration_deadline' => now()->addDays(12)->setTime(17, 0),
                'capacity' => 60,
                'points_reward' => 100,
                'status' => 'published',
                'created_by' => $admin?->id ?? 1,
            ],
            [
                'title' => 'Tibao Green Guardians: Tree Planting & River Clean-Up Drive',
                'slug' => 'tibao-green-guardians-clean-up',
                'description' => 'Community-wide climate action drive planting 500 indigenous fruit trees and cleaning local riverbanks across Sitio Crossing and Purok 4.',
                'category' => 'Environment & Climate Action',
                'venue' => 'Sitio Crossing Riverside, Barangay Tibao',
                'start_datetime' => now()->addDays(20)->setTime(6, 30),
                'end_datetime' => now()->addDays(20)->setTime(11, 30),
                'registration_deadline' => now()->addDays(18)->setTime(17, 0),
                'capacity' => 150,
                'points_reward' => 80,
                'status' => 'published',
                'created_by' => $admin?->id ?? 1,
            ],
        ];

        foreach ($events as $e) {
            Event::updateOrCreate(['slug' => $e['slug']], $e);
        }

        // 3. Auto-award initial badges to eligible youth profiles
        $pioneerBadge = Badge::where('slug', 'tibao-kk-pioneer')->first();
        $democracyBadge = Badge::where('slug', 'democracy-champion')->first();
        $mvpBadge = Badge::where('slug', 'community-mvp')->first();

        $profiles = YouthProfile::with('user')->get();
        foreach ($profiles as $profile) {
            if (!$profile->user_id) continue;

            // Pioneer badge for verified or registered youth
            if ($pioneerBadge) {
                UserBadge::firstOrCreate([
                    'user_id' => $profile->user_id,
                    'badge_id' => $pioneerBadge->id,
                ], [
                    'awarded_at' => $profile->created_at,
                ]);
            }

            // Survey badge if youth answered survey
            if ($democracyBadge && SurveyResponse::where('user_id', $profile->user_id)->exists()) {
                UserBadge::firstOrCreate([
                    'user_id' => $profile->user_id,
                    'badge_id' => $democracyBadge->id,
                ], [
                    'awarded_at' => now()->subDays(2),
                ]);
            }

            // MVP badge if XP >= 150
            if ($mvpBadge && $profile->xp_points >= 150) {
                UserBadge::firstOrCreate([
                    'user_id' => $profile->user_id,
                    'badge_id' => $mvpBadge->id,
                ], [
                    'awarded_at' => now()->subDay(),
                ]);
            }
        }
    }
}

