import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Sparkles, Wrench, Heart, Trophy, BookOpen, Users, Compass, CheckCircle2 } from 'lucide-react';

export default function AdminAnalyticsIndex({
    survey,
    summary = {},
    interestsBreakdown = [],
    sectorBreakdown = [],
    purokData = [],
    scheduleCounts = {},
    justifications = [],
    skillsAnalytics = {
        topSkills: [],
        topHobbies: [],
        talentRecommendations: [],
        totalWithSkills: 0,
        totalWithHobbies: 0,
    },
    filters = {},
    puroksList = [],
}) {
    const [purok, setPurok] = useState(filters.purok || '');
    const [sector, setSector] = useState(filters.sector || '');

    const applyFilters = (newFilters = {}) => {
        const query = {
            purok,
            sector,
            ...newFilters,
        };

        Object.keys(query).forEach((k) => {
            if (!query[k]) delete query[k];
        });

        router.get('/admin/analytics', query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setPurok('');
        setSector('');
        router.get('/admin/analytics');
    };

    // Calculate maximum count for scaling bar graphs
    const maxInterestCount = Math.max(...interestsBreakdown.map((i) => i.count), 1);
    const totalScheduleResponses = Object.values(scheduleCounts).reduce((a, b) => a + b, 0);

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                                Needs Assessment & CBYDP Analytics
                            </h2>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Real-time Katipunan ng Kabataan survey telemetry for ABYIP budget allocation
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <a
                            href="/admin/analytics/export"
                            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95"
                        >
                            <span>📥</span>
                            <span>Export Survey CSV</span>
                        </a>
                    </div>
                </div>
            }
        >
            <Head title="Needs Assessment Analytics" />

            <div className="space-y-6 animate-fadeIn">
                {/* Filters Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2.5 flex-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Segment By:
                            </span>

                            {/* Purok Filter */}
                            <select
                                value={purok}
                                onChange={(e) => {
                                    setPurok(e.target.value);
                                    applyFilters({ purok: e.target.value });
                                }}
                                className="text-xs border-slate-200 rounded-xl bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500 py-1.5 px-3 font-semibold text-slate-700"
                            >
                                <option value="">All Puroks (Purok 1–7 & Crossing)</option>
                                {puroksList.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>

                            {/* Sector Classification Filter */}
                            <select
                                value={sector}
                                onChange={(e) => {
                                    setSector(e.target.value);
                                    applyFilters({ sector: e.target.value });
                                }}
                                className="text-xs border-slate-200 rounded-xl bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500 py-1.5 px-3 font-semibold text-slate-700"
                            >
                                <option value="">All Youth Sectors</option>
                                <option value="In-School Youth">In-School Youth</option>
                                <option value="Out-of-School Youth">Out-of-School Youth</option>
                                <option value="Working Youth">Working Youth</option>
                                <option value="Youth with Specific Needs">Youth with Specific Needs</option>
                            </select>

                            {(purok || sector) && (
                                <button
                                    onClick={resetFilters}
                                    className="text-xs font-bold text-rose-600 hover:text-rose-800 px-2 py-1 transition"
                                >
                                    ✕ Reset
                                </button>
                            )}
                        </div>

                        <div className="text-[11px] text-slate-400 font-medium">
                            Active Survey: <strong>{survey?.year || '2026'} ABYIP Planning</strong>
                        </div>
                    </div>
                </div>

                {/* KPI Metrics Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Total Survey Responses
                            </span>
                            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
                                📋
                            </span>
                        </div>
                        <p className="text-3xl font-black text-slate-900 mt-2">
                            {summary.totalResponses || 0}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                            from {summary.totalRegisteredYouth || 0} registered KK youth
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                                Response Rate
                            </span>
                            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                                📈
                            </span>
                        </div>
                        <p className="text-3xl font-black text-emerald-600 mt-2">
                            {summary.responseRate || 0}%
                        </p>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                            <div
                                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(summary.responseRate || 0, 100)}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                #1 Priority Demand
                            </span>
                            <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                                🏆
                            </span>
                        </div>
                        <p className="text-lg font-black text-slate-900 mt-2 truncate">
                            {summary.topInterest || 'Sports'}
                        </p>
                        <p className="text-[11px] text-blue-600 font-semibold mt-1">
                            Leading in surveyed puroks
                        </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                                Planning Scope
                            </span>
                            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
                                🏛️
                            </span>
                        </div>
                        <p className="text-xl font-black text-slate-900 mt-2">
                            Barangay Tibao
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                            Purok 1–7 & Sitio Crossing
                        </p>
                    </div>
                </div>

                {/* Visualizations Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* CHART 1: CBYDP Program Interest Breakdown (Bar & Progress Chart) */}
                    <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-black text-slate-900 tracking-tight">
                                    Program Interest Breakdown (CBYDP)
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Which activities youth want the SK Council to prioritize
                                </p>
                            </div>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                                Question 1
                            </span>
                        </div>

                        <div className="space-y-4 pt-2">
                            {interestsBreakdown.length === 0 ? (
                                <p className="text-xs text-slate-400 py-6 text-center">
                                    No response data available for the selected filters.
                                </p>
                            ) : (
                                interestsBreakdown.map((item, idx) => {
                                    const widthPct = Math.round((item.count / maxInterestCount) * 100);
                                    return (
                                        <div key={idx} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold text-slate-800 flex items-center gap-2">
                                                    <span
                                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                    <span>{item.name}</span>
                                                </span>
                                                <span className="font-black text-slate-900">
                                                    {item.count}{' '}
                                                    <span className="text-[10px] text-slate-400 font-semibold">
                                                        ({item.percentage}%)
                                                    </span>
                                                </span>
                                            </div>

                                            {/* Colored Progress Bar */}
                                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className="h-3 rounded-full transition-all duration-700"
                                                    style={{
                                                        width: `${Math.max(widthPct, 4)}%`,
                                                        backgroundColor: item.color,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Schedule Timing Quick Comparison */}
                        <div className="pt-4 border-t border-slate-100 mt-6">
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                                Preferred Activity Schedule:
                            </h4>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                {Object.entries(scheduleCounts).map(([sched, count]) => {
                                    const pct = totalScheduleResponses > 0 ? Math.round((count / totalScheduleResponses) * 100) : 0;
                                    return (
                                        <div key={sched} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <p className="text-[10px] text-slate-400 font-bold leading-tight truncate">
                                                {sched}
                                            </p>
                                            <p className="text-lg font-black text-slate-800 mt-1">{pct}%</p>
                                            <p className="text-[10px] text-slate-500">{count} youth</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* CHART 2: Sectoral Representation (Donut & Breakdown) */}
                    <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                                        Sector Representation
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Katipunan ng Kabataan demographic categories
                                    </p>
                                </div>
                                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                                    Sectors
                                </span>
                            </div>

                            {/* SVG Donut Ring Visualization */}
                            <div className="relative flex items-center justify-center my-4">
                                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="38"
                                        className="text-slate-100"
                                        strokeWidth="12"
                                        stroke="currentColor"
                                        fill="transparent"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="38"
                                        className="text-indigo-600"
                                        strokeWidth="12"
                                        strokeDasharray="238.76"
                                        strokeDashoffset={238.76 * (1 - 0.55)}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="38"
                                        className="text-emerald-500"
                                        strokeWidth="12"
                                        strokeDasharray="238.76"
                                        strokeDashoffset={238.76 * (1 - 0.25)}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                    />
                                </svg>
                                <div className="absolute text-center">
                                    <span className="text-2xl font-black text-slate-900">
                                        {summary.totalResponses || 0}
                                    </span>
                                    <span className="block text-[10px] text-slate-400 font-bold uppercase">
                                        Responses
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 mt-4">
                                {sectorBreakdown.map((s, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                                    >
                                        <span className="font-bold text-slate-800">{s.sector}</span>
                                        <span className="font-extrabold text-slate-900">
                                            {s.count} <span className="text-slate-400 font-normal">({s.percentage}%)</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 mt-4">
                            <strong>Policy Note:</strong> RA 10742 mandates allocating SK funds for all youth classifications, especially Out-of-School Youth (OSY).
                        </div>
                    </div>
                </div>

                {/* CHART 3: Purok Heatmap & Top Interest Matrix */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                        <div>
                            <h3 className="text-base font-black text-slate-900 tracking-tight">
                                Purok Telemetry Matrix (Barangay Tibao)
                            </h3>
                            <p className="text-xs text-slate-500">
                                Response participation and primary program demand per purok
                            </p>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                            Cross-referenced with Official Katipunan ng Kabataan records
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="p-3">Purok / Sitio</th>
                                    <th className="p-3">Responses</th>
                                    <th className="p-3">Participation Level</th>
                                    <th className="p-3">Leading Youth Demand</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {purokData.map((row, idx) => {
                                    const hasData = row.responses > 0;
                                    return (
                                        <tr key={idx} className="hover:bg-slate-50 transition">
                                            <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                                                <span>📍</span>
                                                <span>{row.purok}</span>
                                            </td>
                                            <td className="p-3 font-extrabold text-slate-800">
                                                {row.responses} youth
                                            </td>
                                            <td className="p-3">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                    hasData ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {hasData ? 'Active Engagement' : 'Awaiting Responses'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 text-[11px]">
                                                    {row.topInterest}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SECTION 4.5: Youth Talent Pool & Community Interests (Skills & Hobbies Analytics) */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                                        Youth Talent Pool & Interests Analytics
                                    </h3>
                                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full border border-indigo-200">
                                        CBYDP Decision Support
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Self-reported skills and hobbies from youth registration and profiles to justify tailored training, sports, and cultural projects.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                            <span className="bg-slate-50 border border-slate-200 text-slate-600 font-bold px-3 py-1.5 rounded-xl">
                                🛠️ {skillsAnalytics.totalWithSkills || 0} Profiled Skills
                            </span>
                            <span className="bg-slate-50 border border-slate-200 text-slate-600 font-bold px-3 py-1.5 rounded-xl">
                                ❤️ {skillsAnalytics.totalWithHobbies || 0} Profiled Hobbies
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Skills Card */}
                        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/90 space-y-3.5">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                    <Wrench className="w-4 h-4 text-indigo-600" />
                                    <span>Top Documented Skills & Competencies</span>
                                </h4>
                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                    Vocational & Livelihood
                                </span>
                            </div>

                            {(!skillsAnalytics.topSkills || skillsAnalytics.topSkills.length === 0) ? (
                                <p className="text-xs text-slate-400 py-6 text-center italic">
                                    No skills documented yet in this filter view.
                                </p>
                            ) : (
                                <div className="space-y-3 pt-1">
                                    {skillsAnalytics.topSkills.map((sk, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <span className="text-slate-700 flex items-center gap-1.5">
                                                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-[10px] flex items-center justify-center font-black">
                                                        {idx + 1}
                                                    </span>
                                                    <span>{sk.name}</span>
                                                </span>
                                                <span className="text-slate-900 font-extrabold">
                                                    {sk.count} youth{' '}
                                                    <span className="text-[10px] text-slate-400 font-semibold">
                                                        ({sk.percentage}%)
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-700"
                                                    style={{ width: `${Math.max(sk.percentage, 5)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Top Hobbies Card */}
                        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/90 space-y-3.5">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-rose-500" />
                                    <span>Top Hobbies, Sports & Creative Passions</span>
                                </h4>
                                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                                    Sports & Culture
                                </span>
                            </div>

                            {(!skillsAnalytics.topHobbies || skillsAnalytics.topHobbies.length === 0) ? (
                                <p className="text-xs text-slate-400 py-6 text-center italic">
                                    No hobbies documented yet in this filter view.
                                </p>
                            ) : (
                                <div className="space-y-3 pt-1">
                                    {skillsAnalytics.topHobbies.map((hb, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <span className="text-slate-700 flex items-center gap-1.5">
                                                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 text-[10px] flex items-center justify-center font-black">
                                                        {idx + 1}
                                                    </span>
                                                    <span>{hb.name}</span>
                                                </span>
                                                <span className="text-slate-900 font-extrabold">
                                                    {hb.count} youth{' '}
                                                    <span className="text-[10px] text-slate-400 font-semibold">
                                                        ({hb.percentage}%)
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-rose-500 h-2 rounded-full transition-all duration-700"
                                                    style={{ width: `${Math.max(hb.percentage, 5)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Council Decision-Making Action Recommendations */}
                    {skillsAnalytics.talentRecommendations && skillsAnalytics.talentRecommendations.length > 0 && (
                        <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <Compass className="w-4 h-4 text-indigo-700" />
                                <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                                    Direct Council Decision-Making Recommendations
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                {skillsAnalytics.talentRecommendations.map((rec, i) => (
                                    <div key={i} className="bg-white p-3.5 rounded-xl border border-indigo-100 shadow-2xs space-y-1">
                                        <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                            {rec.focus}
                                        </span>
                                        <h5 className="font-bold text-slate-900 mt-1">{rec.title}</h5>
                                        <p className="text-[11px] text-slate-600 leading-relaxed">{rec.action}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* SECTION 5: CBYDP & ABYIP Program Justification Engine */}
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-500/30">
                            Automated Policy Intelligence
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-2">
                            CBYDP & ABYIP Program Justifications
                        </h3>
                        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                            These evidence-backed justifications are generated in real-time from the youth responses to support the SK Council’s annual budget defense before the Barangay Council and NYC.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {justifications.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-slate-900/90 border border-slate-700/80 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-indigo-400 transition"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
                                            {item.badge}
                                        </span>
                                        <span className="text-[10px] font-bold bg-white/10 text-emerald-300 px-2 py-0.5 rounded-full border border-white/10">
                                            {item.status}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-black text-white leading-snug">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                                    <span>Evidence Level:</span>
                                    <strong className="text-white">Survey Verified ✓</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

