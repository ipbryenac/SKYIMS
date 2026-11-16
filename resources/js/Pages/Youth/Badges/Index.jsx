import YouthLayout from '@/Layouts/YouthLayout';
import { Head, Link } from '@inertiajs/react';

export default function YouthBadgesIndex({
    youthProfile,
    xp = 0,
    currentTier = 'Katipunan Novice',
    nextTier = 'Active Kabataan',
    nextTierXP = 50,
    tierProgress = 0,
    badges = [],
    stats = {},
}) {
    return (
        <YouthLayout
            header={
                <div className="flex items-center justify-between animate-fadeIn">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Youth Achievements & Gamification</h2>
                        <p className="text-xs text-slate-500">
                            Earn Participation XP points and digital badges across Barangay Tibao activities
                        </p>
                    </div>

                    <Link
                        href="/youth/profile/digital-id"
                        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95"
                    >
                        <span>🪪</span>
                        <span>My Digital ID</span>
                    </Link>
                </div>
            }
        >
            <Head title="Achievements & Badges" />

            <div className="space-y-6 animate-slideUp">
                {/* Hero Gamification Tier & Progress Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-purple-500/30">
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <span className="inline-block bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                                Citizen Gamification Level
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                {currentTier}
                            </h3>
                            <p className="text-xs text-purple-200">
                                Katipunan ng Kabataan • <strong>{youthProfile?.purok_sitio || 'Barangay Tibao'}</strong>
                            </p>
                        </div>

                        {/* XP Box */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center min-w-[160px] shadow-sm">
                            <p className="text-[11px] uppercase font-bold text-purple-200 tracking-wider">
                                Total Earned XP
                            </p>
                            <p className="text-3xl font-black text-amber-300 mt-1">
                                {xp} <span className="text-sm font-semibold text-white">pts</span>
                            </p>
                            <p className="text-[10px] text-purple-200 mt-1">
                                {stats.badgesUnlocked || 0} of {badges.length} Badges Unlocked
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar to Next Tier */}
                    <div className="relative z-10 mt-6 pt-5 border-t border-white/15 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-purple-200">
                                Next Milestone: <strong className="text-white">{nextTier}</strong> ({nextTierXP} XP)
                            </span>
                            <span className="font-bold text-amber-300">{tierProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-950/60 rounded-full h-3 p-0.5 overflow-hidden border border-white/10">
                            <div
                                className="bg-gradient-to-r from-amber-400 via-orange-500 to-purple-500 h-2 rounded-full transition-all duration-700"
                                style={{ width: `${tierProgress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* 4 Stats Counters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
                        <span className="text-2xl">🏃</span>
                        <p className="text-2xl font-black text-slate-800 mt-1">{stats.eventsAttended || 0}</p>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                            Events Attended
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
                        <span className="text-2xl">🎟️</span>
                        <p className="text-2xl font-black text-slate-800 mt-1">{stats.eventsRegistered || 0}</p>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                            Registered Events
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
                        <span className="text-2xl">🗳️</span>
                        <p className="text-2xl font-black text-slate-800 mt-1">{stats.surveysAnswered || 0}</p>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                            Needs Surveys
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
                        <span className="text-2xl">🏅</span>
                        <p className="text-2xl font-black text-slate-800 mt-1">{stats.badgesUnlocked || 0}</p>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                            Badges Earned
                        </p>
                    </div>
                </div>

                {/* Badges Grid Showcase */}
                <div className="space-y-4">
                    <div>
                        <h4 className="text-base font-black text-slate-900 tracking-tight">
                            Katipunan ng Kabataan Digital Badges
                        </h4>
                        <p className="text-xs text-slate-500">
                            Earned through consistent participation in sports, leadership, governance, and environmental initiatives.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {badges.map((badge) => (
                            <div
                                key={badge.id}
                                className={`p-5 rounded-3xl border transition duration-200 flex flex-col justify-between ${
                                    badge.is_unlocked
                                        ? 'bg-white border-amber-300 shadow-sm hover:shadow-md hover:border-amber-400'
                                        : 'bg-slate-50/80 border-slate-200 opacity-60'
                                }`}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs ${
                                                badge.is_unlocked
                                                    ? 'bg-amber-50 border border-amber-200'
                                                    : 'bg-slate-200 grayscale'
                                            }`}
                                        >
                                            {badge.icon}
                                        </div>

                                        {badge.is_unlocked ? (
                                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                <span>✓</span>
                                                <span>Unlocked</span>
                                            </span>
                                        ) : (
                                            <span className="bg-slate-200 text-slate-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                                                🔒 Locked
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <h5 className="font-black text-slate-900 text-sm">{badge.name}</h5>
                                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                            {badge.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-3 mt-3 border-t border-slate-100 text-[11px]">
                                    {badge.is_unlocked ? (
                                        <span className="text-emerald-700 font-bold">
                                            Awarded on {badge.awarded_at}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 font-medium">
                                            Criteria: {badge.criteria_type}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </YouthLayout>
    );
}

