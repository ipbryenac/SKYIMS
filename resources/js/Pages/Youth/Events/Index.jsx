import YouthLayout from '@/Layouts/YouthLayout';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function YouthEventsIndex({
    events,
    categories = [],
    activeCategory = '',
    activeTab = 'all',
    youthProfile,
}) {
    const [submittingId, setSubmittingId] = useState(null);
    const [cancellingEvent, setCancellingEvent] = useState(null);
    const [activeTicket, setActiveTicket] = useState(null);

    const handleFilterCategory = (cat) => {
        router.get('/youth/events', {
            category: cat || undefined,
            tab: activeTab !== 'all' ? activeTab : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSwitchTab = (tab) => {
        router.get('/youth/events', {
            tab: tab !== 'all' ? tab : undefined,
            category: activeCategory || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleRegister = (eventId) => {
        setSubmittingId(eventId);
        router.post(`/youth/events/${eventId}/register`, {}, {
            preserveScroll: true,
            onFinish: () => setSubmittingId(null),
        });
    };

    const handleConfirmCancel = () => {
        if (!cancellingEvent) return;
        setSubmittingId(cancellingEvent.id);
        router.delete(`/youth/events/${cancellingEvent.id}/cancel`, {
            preserveScroll: true,
            onFinish: () => {
                setSubmittingId(null);
                setCancellingEvent(null);
            },
        });
    };

    return (
        <YouthLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Activity Event Board</h2>
                        <p className="text-xs text-slate-500">
                            Upcoming Sangguniang Kabataan activities in Barangay Tibao
                        </p>
                    </div>

                    <Link
                        href="/youth/profile/digital-id"
                        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95"
                    >
                        <span>🪪</span>
                        <span>My Digital ID Pass</span>
                    </Link>
                </div>
            }
        >
            <Head title="Activity Event Board" />

            <div className="space-y-6 animate-slideUp">
                {/* Tabs: All Events vs My Registrations */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => handleSwitchTab('all')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                                activeTab === 'all'
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            🎉 All Upcoming Activities
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSwitchTab('registered')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                                activeTab === 'registered'
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            🎟️ My Registered Events
                        </button>
                    </div>

                    <span className="hidden sm:inline-block text-xs text-slate-500 font-medium">
                        Barangay Tibao, Mlang
                    </span>
                </div>

                {/* Category Pill Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
                    <button
                        type="button"
                        onClick={() => handleFilterCategory('')}
                        className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
                            !activeCategory
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        All Categories
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => handleFilterCategory(cat)}
                            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
                                activeCategory === cat
                                    ? 'bg-indigo-600 text-white shadow-xs'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Event Cards Grid */}
                {events.data.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
                        <span className="text-4xl block">📅</span>
                        <h3 className="font-bold text-slate-800 text-base">No activities found</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            {activeTab === 'registered'
                                ? "You haven't registered for any upcoming events yet. Browse all events and join today!"
                                : 'There are no published events matching your selected category.'}
                        </p>
                        {activeTab === 'registered' && (
                            <button
                                onClick={() => handleSwitchTab('all')}
                                className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-xs"
                            >
                                Browse All Upcoming Events
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {events.data.map((event) => {
                            const startDate = new Date(event.start_datetime);
                            const formattedDate = startDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                            });
                            const formattedTime = startDate.toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                            });

                            return (
                                <div
                                    key={event.id}
                                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-lg transition duration-200 flex flex-col justify-between group"
                                >
                                    <div className="space-y-3">
                                        {/* Category & XP Badge */}
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 truncate">
                                                {event.category}
                                            </span>
                                            <span className="bg-amber-100 text-amber-800 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1">
                                                <span>⚡</span>
                                                <span>+{event.points_reward} XP</span>
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-black text-slate-900 text-base group-hover:text-indigo-600 transition leading-snug">
                                            {event.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                                            {event.description}
                                        </p>

                                        {/* Date, Time & Venue */}
                                        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <span>📅</span>
                                                <span className="font-bold text-slate-800">
                                                    {formattedDate} • {formattedTime}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span>📍</span>
                                                <span className="truncate">{event.venue}</span>
                                            </div>
                                            {event.capacity && (
                                                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                                    <span>👥</span>
                                                    <span>
                                                        {event.registrations_count} / {event.capacity} registered
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-4 mt-4 border-t border-slate-100">
                                        {event.is_registered ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
                                                    <span className="font-bold flex items-center gap-1.5">
                                                        <span>✓</span>
                                                        <span>You are Registered!</span>
                                                    </span>
                                                    <Link
                                                        href="/youth/profile/digital-id"
                                                        className="text-[11px] font-bold text-emerald-700 underline"
                                                    >
                                                        View QR Pass →
                                                    </Link>
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={submittingId === event.id}
                                                    onClick={() => setCancellingEvent(event)}
                                                    className="w-full text-center text-[11px] text-slate-400 hover:text-rose-600 font-semibold py-1 transition"
                                                >
                                                    {submittingId === event.id ? 'Cancelling...' : 'Cancel Registration'}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled={submittingId === event.id}
                                                onClick={() => handleRegister(event.id)}
                                                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-indigo-600/20 text-xs transition active:scale-95 disabled:opacity-50"
                                            >
                                                <span>{submittingId === event.id ? 'Joining...' : 'Join / Register Now'}</span>
                                                <span>→</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Cancel Registration Confirmation Modal */}
                <ConfirmationModal
                    show={Boolean(cancellingEvent)}
                    type="warning"
                    title="Cancel Event Registration?"
                    message={
                        cancellingEvent && (
                            <div className="space-y-2">
                                <p>
                                    Are you sure you want to cancel your registration for{' '}
                                    <strong className="text-slate-900 font-bold">{cancellingEvent.title}</strong>?
                                </p>
                                <p className="text-[11px] text-slate-500">
                                    Your reserved spot will be released back to other youth in Barangay Tibao. You can register again later if slots remain open.
                                </p>
                            </div>
                        )
                    }
                    confirmText="Yes, Cancel Registration"
                    cancelText="Keep Registration"
                    loading={submittingId !== null}
                    onClose={() => setCancellingEvent(null)}
                    onConfirm={handleConfirmCancel}
                />
            </div>
        </YouthLayout>
    );
}

