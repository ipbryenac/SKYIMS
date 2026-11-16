import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmationModal from '@/Components/ConfirmationModal';
import {
    Calendar,
    MapPin,
    Users,
    Award,
    Plus,
    QrCode,
    Sliders,
    Trash2,
    CheckCircle2,
    Clock,
    AlertCircle,
    CalendarCheck,
    XCircle,
} from 'lucide-react';

export default function AdminEventsIndex({ events }) {
    const [deletingEvent, setDeletingEvent] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteConfirm = () => {
        if (!deletingEvent) return;
        setIsDeleting(true);
        router.delete(`/admin/events/${deletingEvent.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDeletingEvent(null);
            },
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'published':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Published
                    </span>
                );
            case 'ongoing':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                        <Clock className="w-3 h-3" /> Ongoing
                    </span>
                );
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">
                        <CalendarCheck className="w-3 h-3" /> Completed
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">
                        <XCircle className="w-3 h-3" /> Cancelled
                    </span>
                );
            case 'draft':
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                        <AlertCircle className="w-3 h-3" /> Draft
                    </span>
                );
        }
    };

    return (
        <AdminLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-indigo-600" />
                            Community Events Management
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Plan, publish, manage rosters, and track Katipunan ng Kabataan activities across Barangay Tibao
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/events/create"
                            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Create Event</span>
                        </Link>
                        <Link
                            href="/admin/attendance/scanner"
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition active:scale-95"
                        >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Open QR Scanner</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Events Management" />

            <div className="space-y-6 animate-slideUp">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="p-3.5">Activity / Event Title</th>
                                    <th className="p-3.5">CBYDP Category</th>
                                    <th className="p-3.5">Schedule & Venue</th>
                                    <th className="p-3.5">XP Reward</th>
                                    <th className="p-3.5">Registrations & Attendance</th>
                                    <th className="p-3.5">Status</th>
                                    <th className="p-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {events.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-12 text-center text-slate-400">
                                            <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                                            <p className="font-medium text-slate-600">No events created yet.</p>
                                            <p className="text-[11px] text-slate-400 mt-1">Click "Create Event" to schedule your first Katipunan ng Kabataan activity.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    events.data.map((event) => (
                                        <tr key={event.id} className="hover:bg-slate-50/80 transition">
                                            <td className="p-3.5">
                                                <p className="font-bold text-slate-900">{event.title}</p>
                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{event.slug}</p>
                                            </td>
                                            <td className="p-3.5">
                                                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                                    {event.category}
                                                </span>
                                            </td>
                                            <td className="p-3.5">
                                                <p className="font-bold text-slate-800">{event.start_datetime}</p>
                                                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                                    {event.venue}
                                                </p>
                                            </td>
                                            <td className="p-3.5 font-bold text-amber-600">
                                                <span className="inline-flex items-center gap-1">
                                                    <Award className="w-3.5 h-3.5 text-amber-500" />
                                                    +{event.points_reward} XP
                                                </span>
                                            </td>
                                            <td className="p-3.5">
                                                <div className="space-y-0.5">
                                                    <span className="font-bold text-slate-900 flex items-center gap-1">
                                                        <Users className="w-3 h-3 text-slate-400" />
                                                        {event.registrations_count} registered
                                                    </span>
                                                    <span className="block text-[11px] text-emerald-700 font-semibold">
                                                        ✓ {event.attendances_count} attended
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-3.5">
                                                {getStatusBadge(event.status)}
                                            </td>
                                            <td className="p-3.5 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1.5 justify-end">
                                                    <Link
                                                        href={`/admin/events/${event.id}`}
                                                        className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-xl transition text-xs"
                                                    >
                                                        <Sliders className="w-3 h-3" />
                                                        Manage & Roster
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletingEvent(event)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                                                        title="Delete Event"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Themed Confirmation Modal for Event Deletion */}
            <ConfirmationModal
                show={!!deletingEvent}
                title="Delete Community Event?"
                message={
                    deletingEvent ? (
                        <div className="space-y-2">
                            <p>
                                Are you sure you want to permanently delete{' '}
                                <strong className="text-slate-900">"{deletingEvent.title}"</strong>?
                            </p>
                            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
                                ⚠️ All associated attendee registrations ({deletingEvent.registrations_count}) and check-in logs ({deletingEvent.attendances_count}) will also be permanently deleted.
                            </div>
                        </div>
                    ) : ''
                }
                type="danger"
                confirmText="Yes, Delete Event"
                cancelText="Keep Event"
                loading={isDeleting}
                onConfirm={handleDeleteConfirm}
                onClose={() => setDeletingEvent(null)}
            />
        </AdminLayout>
    );
}
