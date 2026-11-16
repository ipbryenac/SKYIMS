import YouthLayout from '@/Layouts/YouthLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function YouthSurveysIndex({
    survey,
    hasCompleted = false,
    existingResponse = null,
    youthProfile,
}) {
    const [answers, setAnswers] = useState({
        1: '',
        2: '',
        3: '',
        4: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAnswerSelect = (order, option) => {
        setAnswers((prev) => ({
            ...prev,
            [order]: option,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!survey) return;

        setIsSubmitting(true);
        router.post(
            `/youth/surveys/${survey.id}/submit`,
            { answers },
            {
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    const isFormValid = answers[1] && answers[2] && answers[3] && answers[4];

    return (
        <YouthLayout
            header={
                <div className="flex items-center justify-between animate-fadeIn">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Katipunan ng Kabataan Needs Assessment
                        </h2>
                        <p className="text-xs text-slate-500">
                            Barangay Tibao Annual Youth Investment Program (ABYIP) Survey
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Needs Assessment Survey" />

            <div className="max-w-3xl mx-auto space-y-6 animate-slideUp">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 md:p-8 text-white shadow-xl">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-white mb-3">
                        <span>🗳️</span>
                        <span>Official Sangguniang Kabataan Planning Tool</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                        {survey?.title || 'Youth Needs Assessment'}
                    </h3>

                    <p className="text-xs md:text-sm text-amber-100 max-w-xl mt-2 leading-relaxed">
                        {survey?.description ||
                            'Your answers help the SK Council allocate the barangay youth budget for sports tournaments, livelihood workshops, and health services.'}
                    </p>

                    <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-xs">
                        <span>
                            Purok: <strong>{youthProfile?.purok_sitio || 'Barangay Tibao'}</strong> • Sector:{' '}
                            <strong>{youthProfile?.youth_classification || 'Youth Member'}</strong>
                        </span>
                        <span className="bg-white/25 px-3 py-1 rounded-full font-bold">
                            +{survey?.xp_reward || 25} XP Reward
                        </span>
                    </div>
                </div>

                {/* If Already Completed */}
                {hasCompleted ? (
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900">
                            <span className="text-3xl">🎉</span>
                            <div>
                                <h4 className="font-extrabold text-base">You Have Completed This Survey!</h4>
                                <p className="text-xs text-emerald-700 mt-0.5">
                                    Submitted on{' '}
                                    {existingResponse?.submitted_at
                                        ? new Date(existingResponse.submitted_at).toLocaleDateString()
                                        : 'recently'}
                                    . Your input is now counted in the SK Council ABYIP budgeting charts.
                                </p>
                            </div>
                        </div>

                        {/* Display User's Submitted Answers */}
                        <div className="space-y-4">
                            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                                Your Submitted Preferences:
                            </h5>

                            {survey?.questions?.map((q, idx) => {
                                const submittedAns = existingResponse?.answers?.[q.order] || 'No response recorded';
                                return (
                                    <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                        <p className="text-[11px] font-bold text-amber-600 uppercase">
                                            Question {idx + 1}: {q.category}
                                        </p>
                                        <p className="text-sm font-bold text-slate-800 mt-0.5">{q.question_text}</p>
                                        <p className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl mt-2">
                                            ✓ {submittedAns}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Active Survey Questionnaire Form */
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                        <div className="space-y-6">
                            {survey?.questions?.map((q, idx) => (
                                <div key={q.id} className="space-y-3 p-5 bg-slate-50 rounded-2xl border border-slate-200">
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

                                    <div className="space-y-2 pt-1 pl-8">
                                        {q.options?.map((option, optIdx) => {
                                            const isSelected = answers[q.order] === option;
                                            return (
                                                <label
                                                    key={optIdx}
                                                    onClick={() => handleAnswerSelect(q.order, option)}
                                                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs font-semibold cursor-pointer transition ${
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

                        <div className="pt-4 border-t border-slate-200 flex justify-end">
                            <button
                                type="submit"
                                disabled={!isFormValid || isSubmitting}
                                className="w-full sm:w-auto bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-black px-8 py-3.5 rounded-2xl text-xs shadow-md transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <span>{isSubmitting ? 'Submitting Voice...' : 'Submit Answers & Claim +25 XP'}</span>
                                <span>→</span>
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </YouthLayout>
    );
}

