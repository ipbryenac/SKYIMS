import DigitalPassModal from '@/Components/DigitalPassModal';
import YouthLayout from '@/Layouts/YouthLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    CheckCircle2,
    ClipboardList,
    Edit3,
    MapPin,
    Megaphone,
    QrCode,
    Sparkles,
    Trophy,
    X,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

export default function YouthDashboard({
    youthProfile,
    activeSurvey,
    hasCompletedSurvey = false,
    upcomingEvents = [],
    stats = {},
}) {
    const { auth } = usePage().props;
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
    const [answers, setAnswers] = useState({
        1: '',
        2: '',
        3: '',
        4: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAnswerSelect = (questionId, option) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: option,
        }));
    };

    const handleSurveySubmit = (e) => {
        e.preventDefault();
        if (!activeSurvey) return;

        setIsSubmitting(true);
        router.post(
            `/youth/surveys/${activeSurvey.id}/submit`,
            { answers },
            {
                onFinish: () => {
                    setIsSubmitting(false);
                    setIsSurveyModalOpen(false);
                },
            }
        );
    };

    const isSurveyFormValid = answers[1] && answers[2] && answers[3] && answers[4];

    return (
        <YouthLayout
            header={
                <div className="flex items-center justify-between animate-fadeIn">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Youth Portal Feed</h2>
                        <p className="text-xs text-slate-500">Welcome to your Katipunan ng Kabataan hub</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/youth/profile/edit"
                            className="inline-flex items-center gap-1.5 bg-white text-indigo-700 hover:bg-indigo-50 border border-slate-300 font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs transition active:scale-95"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Profile</span>
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsPassModalOpen(true)}
                            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs transition active:scale-95"
                        >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>My Digital Pass</span>
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Youth Portal" />

            <div className="space-y-6 animate-slideUp">
                {/* Hero Profile Pass / Welcome Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 rounded-3xl p-6 md:p-8 text-white shadow-xl hover:shadow-2xl transition duration-300">
                    <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none animate-pulse" />
                    <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-purple-500/20 blur-xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <img
                                src="/images/skyims-logo.jpg"
                                alt="SKYIMS Logo"
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-contain bg-white p-1 border-2 border-white/40 shadow-xl flex-shrink-0"
                            />
                            <div className="space-y-1.5">
                                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20">
                                    <MapPin className="w-3.5 h-3.5 text-indigo-200" />
                                    <span>{youthProfile?.purok_sitio || 'Barangay Tibao, Mlang'}</span>
                                </div>

                                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                    Welcome, {youthProfile?.first_name || 'Kabataan'}!
                                </h3>

                                <p className="text-xs md:text-sm text-indigo-100 max-w-md">
                                    Bracket: <strong className="text-white">{youthProfile?.age_bracket || 'Core Youth (18-24)'}</strong> • 
                                    Sector: <strong className="text-white">{youthProfile?.youth_classification || 'In-School Youth'}</strong>
                                </p>
                            </div>
                        </div>

                        {/* XP Participation Box */}
                        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/25 text-center min-w-[150px] shadow-sm transform hover:scale-105 transition duration-200">
                            <p className="text-[11px] uppercase tracking-wider font-bold text-indigo-200 flex items-center justify-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                <span>Participation XP</span>
                            </p>
                            <p className="text-3xl font-black text-amber-300 mt-1">
                                {youthProfile?.xp_points || 0} <span className="text-sm font-semibold text-white">pts</span>
                            </p>
                            <p className="text-[10px] text-indigo-200 mt-1">Earn badges by joining</p>
                        </div>
                    </div>

                    {/* Verification Status Banner */}
                    <div className="relative z-10 mt-6 pt-5 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                            <span className="font-bold">
                                Katipunan ng Kabataan Code: <span className="font-mono text-amber-300 font-black">{youthProfile?.youth_code || 'TIBAO-KK-00000'}</span>
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsPassModalOpen(true)}
                            className="inline-flex items-center gap-1.5 text-indigo-100 hover:text-white font-bold underline text-xs"
                        >
                            <span>Open Floating Pass Window</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* SURVEY PROMPT BANNER (CBYDP / ABYIP Needs Assessment) */}
                {activeSurvey && !hasCompletedSurvey && (
                    <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-xl animate-bounceSlow">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1.5">
                                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white">
                                    <ClipboardList className="w-3.5 h-3.5" />
                                    <span>2026 ABYIP Budget Needs Assessment</span>
                                </div>
                                <h4 className="text-xl font-black tracking-tight text-white">
                                    Voice Your Needs to the SK Council!
                                </h4>
                                <p className="text-xs text-amber-50 leading-relaxed max-w-xl">
                                    Help Chairperson and Kagawads decide which sports, livelihood, and youth programs to fund in Barangay Tibao. Takes only 1 minute!
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsSurveyModalOpen(true)}
                                className="bg-white hover:bg-amber-50 text-amber-800 font-black px-6 py-3 rounded-2xl shadow-md text-xs transition active:scale-95 whitespace-nowrap self-start sm:self-center flex items-center gap-2"
                            >
                                <span>Take Survey (+{activeSurvey.xp_reward || 25} XP)</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Survey Completed Congratulations Badge */}
                {activeSurvey && hasCompletedSurvey && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-emerald-900 shadow-xs">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                            <div>
                                <p className="font-bold">Needs Assessment Survey Submitted!</p>
                                <p className="text-emerald-700 text-[11px]">
                                    Thank you! Your preferences have been added to the SK Council ABYIP analytics.
                                </p>
                            </div>
                        </div>
                        <span className="bg-emerald-200/80 text-emerald-800 font-bold px-3 py-1 rounded-full text-[11px]">
                            +25 XP Earned
                        </span>
                    </div>
                )}

                {/* 4 Core Action Tiles */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        href="/youth/events"
                        className="group bg-white p-5 rounded-2xl shadow-xs border border-slate-200 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1 transition duration-200 text-center flex flex-col items-center justify-center"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition duration-200">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-800">Browse Events</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Register & Join Activities</p>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setIsPassModalOpen(true)}
                        className="group bg-white p-5 rounded-2xl shadow-xs border border-slate-200 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1 transition duration-200 text-center flex flex-col items-center justify-center w-full"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition duration-200">
                            <QrCode className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-800">Digital ID Pass</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Floating Window & Download</p>
                    </button>

                    <Link
                        href="/youth/surveys"
                        className="group bg-white p-5 rounded-2xl shadow-xs border border-slate-200 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1 transition duration-200 text-center flex flex-col items-center justify-center"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition duration-200">
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-800">Needs Survey</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {hasCompletedSurvey ? 'Survey Completed' : 'Voice Your Needs'}
                        </p>
                    </Link>

                    <Link
                        href="/youth/badges"
                        className="group bg-white p-5 rounded-2xl shadow-xs border border-slate-200 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1 transition duration-200 text-center flex flex-col items-center justify-center"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition duration-200">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-sm text-slate-800">Achievements</h4>
                        <p className="text-xs text-slate-500 mt-0.5">View Badges & Rewards</p>
                    </Link>
                </div>

                {/* Announcement Box with hover effect */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-indigo-300 transition duration-200">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                            <Megaphone className="w-4 h-4 text-indigo-600" />
                            <span>Barangay Tibao SK Council Announcements</span>
                        </h4>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold">
                            Latest Updates
                        </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Upcoming Katipunan ng Kabataan General Assembly will be held at the <strong>Barangay Tibao Multi-Purpose Gym</strong>. All registered youth ages 15–30 are encouraged to attend. Present your Digital Pass QR code at the entrance for attendance credit and 50 XP points!
                    </p>
                </div>
            </div>

            {/* FLOATING DIGITAL PASS WINDOW MODAL */}
            <DigitalPassModal
                isOpen={isPassModalOpen}
                onClose={() => setIsPassModalOpen(false)}
                youthProfile={youthProfile}
                user={auth?.user}
                qrString={youthProfile?.youth_code}
            />

            {/* INTEGRATED NEEDS ASSESSMENT MODAL (Instant Interactive Questionnaire) */}
            {isSurveyModalOpen && activeSurvey && (
                <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-slideUp">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-6 flex items-center justify-between">
                            <div>
                                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                    Official Katipunan ng Kabataan Survey
                                </span>
                                <h3 className="text-xl font-black mt-1">
                                    {activeSurvey.title}
                                </h3>
                                <p className="text-xs text-amber-100">
                                    Reward: <strong className="text-white">+{activeSurvey.xp_reward || 25} Participation XP</strong>
                                </p>
                            </div>
                            <button
                                onClick={() => setIsSurveyModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body / Questions Form */}
                        <form onSubmit={handleSurveySubmit} className="flex-1 flex flex-col overflow-hidden">
                            <div className="p-6 space-y-6 overflow-y-auto flex-1">
                                {activeSurvey.questions?.map((q, idx) => (
                                    <div key={q.id} className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                        <div className="flex items-start gap-2.5">
                                            <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black flex-shrink-0">
                                                {idx + 1}
                                            </span>
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                                                    {q.category}
                                                </span>
                                                <h5 className="text-sm font-bold text-slate-800 leading-snug">
                                                    {q.question_text}
                                                </h5>
                                            </div>
                                        </div>

                                        {/* Options Grid */}
                                        <div className="space-y-2 pt-1 pl-8">
                                            {q.options?.map((option, optIdx) => {
                                                const isSelected = answers[q.order] === option;
                                                return (
                                                    <label
                                                        key={optIdx}
                                                        onClick={() => handleAnswerSelect(q.order, option)}
                                                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                                                            isSelected
                                                                ? 'bg-amber-500/10 border-amber-500 text-amber-900 shadow-xs'
                                                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question_${q.order}`}
                                                            checked={isSelected}
                                                            onChange={() => handleAnswerSelect(q.order, option)}
                                                            className="text-amber-600 focus:ring-amber-500"
                                                        />
                                                        <span>{option}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setIsSurveyModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={!isSurveyFormValid || isSubmitting}
                                    className="bg-amber-600 hover:bg-amber-500 text-white font-black px-6 py-2.5 rounded-xl text-xs shadow-md transition active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <span>{isSubmitting ? 'Submitting Voice...' : 'Submit Answers & Claim +25 XP'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </YouthLayout>
    );
}
